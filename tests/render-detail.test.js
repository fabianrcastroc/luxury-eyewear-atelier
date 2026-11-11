import test from 'node:test';
import assert from 'node:assert/strict';
import {finishedNasalLaminate,finishedLens,finishedHinge,finishedRivetPair} from '../public/finished-geometry.js';
import {nasalPads,lensContour,hingeGeometry,MM} from '../public/frame-geometry.js';
import {defaultDesign} from '../public/designer-model.js';
const close=(a,b,tolerance=2e-6)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} versus ${b}`);
function bounds(g){g.computeBoundingBox();return g.boundingBox;}
function volume(g){const p=g.attributes.position,index=g.index;let result=0;for(let i=0;i<(index?.count||p.count);i+=3){const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j),[a,b,c]=ids.map(j=>[p.getX(j),p.getY(j),p.getZ(j)]);result+=(a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6;}return result;}

test('polished nasal laminates keep the bonded footprint and declared maximum added thickness',()=>{
 for(const side of [-1,1])for(const nasalAngle of [0,15]){
  const d={...defaultDesign,nasalAngle},pad=nasalPads(d,side),g=finishedNasalLaminate(pad.outline,pad.depth),box=bounds(g),p=g.attributes.position;
  close(box.min.z,0);close(box.max.z,pad.depth);close(box.min.x,Math.min(...pad.outline.map(v=>v[0])));close(box.max.x,Math.max(...pad.outline.map(v=>v[0])));
  assert.equal(g.userData.bondFace,'z-max');assert.ok(volume(g)>0);
  const edges=new Map();for(let i=0;i<g.index.count;i+=3){const ids=[0,1,2].map(j=>g.index.getX(i+j));for(let j=0;j<3;j++){const a=ids[j],b=ids[(j+1)%3],key=[Math.min(a,b),Math.max(a,b)].join(':');edges.set(key,(edges.get(key)||0)+1);}}
  assert.ok([...edges.values()].every(count=>count===2),'Laminate is a closed solid after welding its tapered end points');
  // Finishing removes thickness near both ends. It does not translate the
  // adhesive face away from the rear of the main acetate stock.
  const maxY=Math.max(...pad.outline.map(v=>v[1])),minY=Math.min(...pad.outline.map(v=>v[1]));let endMinimum=Infinity,bondVertices=0;
  for(let i=0;i<p.count;i++){if(p.getY(i)>maxY-.5*MM||p.getY(i)<minY+.5*MM)endMinimum=Math.min(endMinimum,p.getZ(i));if(Math.abs(p.getZ(i)-pad.depth)<1e-7)bondVertices++;}
  assert.ok(endMinimum>pad.depth*.45);assert.ok(bondVertices>=3);g.dispose();
 }
});

test('lenses are closed edged blanks of actual metric thickness inside the chosen stock',()=>{
 for(const stock of [2,3,4,6,8]){
  const depth=Math.min(1.2,stock*.45)*MM,g=finishedLens(lensContour({...defaultDesign,materialDepth:stock},1),depth),box=bounds(g);
  close(box.min.z,0);close(box.max.z,depth);assert.ok(volume(g)>0);assert.equal(g.userData.closedLensBlank,true);assert.equal(g.userData.opticalPrescription,false);assert.ok(depth<stock*MM);g.dispose();
 }
});

test('flat lens faces have exact plane normals instead of cap triangulation bands',()=>{
 const depth=1.2*MM,g=finishedLens(lensContour(defaultDesign,1),depth),p=g.attributes.position,n=g.attributes.normal;let caps=0,rounded=0;
 for(let i=0;i<p.count;i++){
  const z=p.getZ(i);if(Math.abs(z)<1e-7||Math.abs(z-depth)<1e-7){close(n.getX(i),0,1e-8);close(n.getY(i),0,1e-8);close(n.getZ(i),z<depth/2?-1:1,1e-8);caps++;}
  else if(Math.abs(n.getZ(i))>.01&&Math.abs(n.getZ(i))<.99)rounded++;
 }
 assert.ok(caps>100);assert.ok(rounded>100,'quarter-round edge retains smooth intermediate normals');g.dispose();
});

test('detailed hinge assembly stays within its illustrative hardware envelope with separate knuckles',()=>{
 for(const stock of [2,8])for(const side of [-1,1]){
  const h=hingeGeometry({...defaultDesign,materialDepth:stock},side),g=finishedHinge(h.hardware.size),box=bounds(g);
  assert.equal(g.userData.construction,'three-knuckle-two-leaf-hinge');assert.equal(g.userData.illustrative,true);assert.ok(g.attributes.position.count>500);
  for(const [i,axis] of ['x','y','z'].entries()){assert.ok(box.min[axis]>=-h.hardware.size[i]/2-1e-7);assert.ok(box.max[axis]<=h.hardware.size[i]/2+1e-7);}
  assert.ok(volume(g)>0);g.dispose();
 }
});

test('paired rivets are shallow and fit within a narrow rim wall rather than floating spheres',()=>{
 const g=finishedRivetPair(),box=bounds(g);assert.equal(g.userData.construction,'paired-flush-rivets');assert.ok((box.max.x-box.min.x)/MM<.8);assert.ok((box.max.z-box.min.z)/MM<.15);assert.ok((box.max.y-box.min.y)/MM<2.3);g.dispose();
});
