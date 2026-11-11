import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeRGBA} from '../public/reference-extraction.js';
import {normalizeContour,lensContour,frameContour,MM} from '../public/frame-geometry.js';
import {normalizeDesign} from '../public/designer-model.js';

function fixture({width=480,height=200,offset=0,broken=false,background=255,noise=false}={}){
 const data=new Uint8ClampedArray(width*height*4);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  let value=background;
  for(const [cx,cy] of [[140,100],[340,100+offset]]){const radius=Math.hypot((x-cx)/70,(y-cy)/45);if(radius>.87&&radius<1)value=20;if(broken&&x>cx-2&&x<cx+2&&y<cy)value=background;}
  if(x>205&&x<275&&y>83&&y<91)value=20;
  if(noise&&((x*17+y*31)%977===0))value=70;
  const i=(y*width+x)*4;data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;
 }
 return {data,width,height};
}

test('extracts two enclosed apertures automatically, symmetric normalized contour with image-space overlay',()=>{
 const result=analyzeRGBA(fixture());assert.equal(result.customContour.length,128);assert.ok(result.confidence>.95);assert.ok(Math.abs(result.aspectRatio-45/70)<.04);assert.ok(result.widthPixels>110&&result.widthPixels<130);
 const xs=result.customContour.map(p=>p[0]);assert.ok(Math.abs(Math.min(...xs)+1)<1e-9);assert.ok(Math.abs(Math.max(...xs)-1)<1e-9);
 let area=0;for(let i=0;i<128;i++){const a=result.customContour[i],b=result.customContour[(i+1)%128];area+=a[0]*b[1]-a[1]*b[0];assert.ok(a.every(Number.isFinite));}assert.ok(area>0,'counterclockwise');
 assert.match(result.diagnostics.join(' '),/ancho A conocido/);assert.equal(result.regularization,'radial-mirrored');assert.deepEqual(result.image,{width:480,height:200});assert.equal(result.apertures.length,2);for(const aperture of result.apertures){assert.equal(aperture.contour.length,128);for(const [x,y] of aperture.contour){assert.ok(x>=aperture.bounds.x-1&&x<=aperture.bounds.x+aperture.bounds.width+1);assert.ok(y>=aperture.bounds.y-1&&y<=aperture.bounds.y+aperture.bounds.height+1);}}assert.equal(result.referenceScale.requiresKnownDimension,true);
});
test('small image noise does not prevent extraction',()=>{assert.ok(analyzeRGBA(fixture({noise:true})).confidence>.9);});
test('extracted shape enters the editable geometry pipeline at a known lens width',()=>{
 const {customContour}=analyzeRGBA(fixture());assert.ok(normalizeContour(customContour));
 const design=normalizeDesign({customContour,lensWidth:54,thickness:4,nasalProjection:0});assert.equal(design.customContour.length,128);
 const lens=lensContour(design,1),xs=lens.map(p=>p[0]);assert.ok(Math.abs((Math.max(...xs)-Math.min(...xs))/MM-54)<1e-8);
 assert.ok(frameContour(design,1).every(p=>p.every(Number.isFinite)));
});
test('rejects blank, open sketch, nonfrontal disparity and dark background',()=>{
 const blank=fixture();blank.data.fill(255);assert.throws(()=>analyzeRGBA(blank),/No se detectaron/);
 assert.throws(()=>analyzeRGBA(fixture({broken:true})),/No se detectaron/);
 assert.throws(()=>analyzeRGBA(fixture({offset:30})),/No se detectaron/);
 assert.throws(()=>analyzeRGBA(fixture({background:80})),/fondo claro/);
});
test('rejects malformed dimensions and oversized data without silent fallback',()=>{
 assert.throws(()=>analyzeRGBA({data:new Uint8Array(4),width:480,height:200}),/dimensiones/);
 assert.throws(()=>analyzeRGBA({data:[],width:2000,height:2000}),/dimensiones/);
});


test('neutral grey background and dark glazed apertures remain automatically detectable',()=>{
 const grey=fixture({background:160});assert.ok(analyzeRGBA(grey).confidence>.9);
 // Simulate dark glazing with glare-free tonal separation from the dark rim.
 for(let y=0;y<grey.height;y++)for(let x=0;x<grey.width;x++)for(const cx of [140,340])if(Math.hypot((x-cx)/70,(y-100)/45)<.86){const i=(y*grey.width+x)*4;grey.data[i]=grey.data[i+1]=grey.data[i+2]=65;}
 const result=analyzeRGBA(grey);assert.ok(result.confidence>.9);assert.ok(result.widthPixels>110&&result.widthPixels<130);
});

function concaveFixture(){
 const width=480,height=220,data=new Uint8ClampedArray(width*height*4);
 const radius=angle=>{const delta=Math.atan2(Math.sin(angle-2.35),Math.cos(angle-2.35));return 1/Math.hypot(Math.cos(angle)/70,Math.sin(angle)/48)*(1-.34*Math.exp(-((delta/.28)**2)));};
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  let value=245;
  for(const [cx,mirror] of [[140,-1],[340,1]]){const dx=(x-cx)*mirror,dy=110-y,angle=Math.atan2(dy,dx),r=Math.hypot(dx,dy),outer=radius(angle)+7;if(r<outer)value=r<radius(angle)?245:20;}
  if(x>210&&x<270&&y>80&&y<88)value=20;
  const i=(y*width+x)*4;data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;
 }
 return {data,width,height};
}
const signedArea=points=>points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-q[0]*p[1];},0)/2;
test('a shallow nasal indentation survives automatic extraction instead of being convexified',()=>{
 const result=analyzeRGBA(concaveFixture()),points=result.customContour;
 const turns=points.map((b,i)=>{const a=points[(i-1+points.length)%points.length],c=points[(i+1)%points.length];return (b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);});
 assert.ok(turns.some(turn=>turn<-.0005),'real local concavity must remain');assert.ok(signedArea(points)>0);assert.ok(normalizeContour(points),'retained contour is valid for the structural pipeline');
 const design=normalizeDesign({customContour:points,lensWidth:50,thickness:4});assert.ok(frameContour(design,1).every(p=>p.every(Number.isFinite)));
});
