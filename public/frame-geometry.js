// Nominal millimetres; the render is a design preview, not manufacturing CAD.
export const MM=.04;
export const frameSizes=[
 {id:'estrecha',name:'Estrecha',lens:48,bridge:16,temple:135},
 {id:'media',name:'Media',lens:52,bridge:17,temple:140},
 {id:'amplia',name:'Amplia',lens:56,bridge:18,temple:145}
];
const sizeOf=d=>{const base=frameSizes.find(s=>s.id===d.frameSize)||frameSizes[1];return {...base,lens:d.lensWidth==null?base.lens:finite(d.lensWidth,40,65,base.lens),bridge:d.bridgeWidth==null?base.bridge:finite(d.bridgeWidth,14,24,base.bridge)};};
const finite=(value,min,max,fallback)=>Number.isFinite(Number(value))?Math.max(min,Math.min(max,Number(value))):fallback;
const modelOf=d=>({rectangular:'recto',panto:'redondo',aviador:'ovalado',clubmaster:'curvo',wayfarer:'curvo'}[d.model]||d.model);
// Imported apertures use the same constrained, millimetre-based geometry.
// Invalid/self-intersecting/concave contours cannot enter the offset pipeline.
export function normalizeContour(raw){
 if(!Array.isArray(raw)||raw.length<32||raw.length>256)return null;
 if(raw.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>typeof v!=='number'||!Number.isFinite(v))))return null;
 const xs=raw.map(p=>p[0]),ys=raw.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),width=maxX-minX,aspect=(maxY-minY)/width;
 if(width<1e-6||aspect<.45||aspect>1.25)return null;
 const points=raw.map(([x,y])=>[(x-(minX+maxX)/2)*2/width,(y-(minY+maxY)/2)*2/width]);
 let area=0;
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length],c=points[(i+2)%points.length];
  if(Math.hypot(b[0]-a[0],b[1]-a[1])<1e-5)return null;
  const cross=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);
  if(cross< -1e-7)return null;
  // Every vertex must remain on the interior side of every edge. This also
  // rules out multiply-wound stars whose local turns can all be positive.
  if(points.some(p=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])< -1e-7))return null;
  area+=a[0]*b[1]-b[0]*a[1];
 }
 return area>1e-4?points:null;
}
export function frameDimensions(d){
 const custom=normalizeContour(d.customContour);if(custom)return {rx:1,ry:Math.max(...custom.map(p=>p[1]))};
 const m=modelOf(d),rx=1,ry=m==='recto'?.64:m==='redondo'?1:m==='ovalado'?.79:.69;
 return {rx,ry};
}
function profile(d,side){
 const custom=normalizeContour(d.customContour);if(custom)return side===-1?custom.map(([x,y])=>[-x,y]).reverse():custom;
 const model=modelOf(d),points=[];
 const rounding=finite(d.rounding,0,100,35),n=model==='recto'?3.6+(100-rounding)*.033:model==='curvo'?3.1+(100-rounding)*.021:2;
 const {ry}=frameDimensions(d);
 for(let i=0;i<128;i++){
  const a=i/128*Math.PI*2,c=Math.cos(a),s=Math.sin(a);
  let x=Math.sign(c)*Math.abs(c)**(2/n),y=Math.sign(s)*Math.abs(s)**(2/n)*ry;
  if(model==='ovalado'){
   // Fixed aviator-derived drop: broad upper half, rounded narrowing below.
   const lower=Math.max(0,-s);x*=1-lower*.22;y-=lower*.075;
  }
  if(model==='curvo'){x*=.9+.1*(y/ry+1)/2;y+=Math.max(0,x*side)*.035;}
  points.push([x,y]);
 }
 // A is the boxing width of the actual aperture, including tapered profiles.
 // Keep the silhouette but normalise its horizontal bounding box so A/DBL
 // labels, optical centres and vector templates refer to the same dimensions.
 const xs=points.map(p=>p[0]),lo=Math.min(...xs),hi=Math.max(...xs),mid=(lo+hi)/2;
 return points.map(([x,y])=>[(x-mid)*2/(hi-lo),y]);
}
export function lensContour(d,side){const half=sizeOf(d).lens/2*MM,aspect=finite(d.contourAspectScale,.85,1.15,1);return profile(d,side).map(([x,y])=>[x*half,y*half*aspect]);}
// Offset the actual aperture rather than scaling it: scaling a superellipse
// changes the wall gauge at corners and deforms narrow/rounded silhouettes.
export function offsetContour(points,distance){
 if(!Array.isArray(points)||points.length<3||!Number.isFinite(distance)||distance<0)throw new RangeError('Contorno o distancia no válidos.');
 const area=points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-q[0]*p[1];},0);
 const orientation=area>=0?1:-1;
 const normals=points.map((p,i)=>{const q=points[(i+1)%points.length],dx=q[0]-p[0],dy=q[1]-p[1],length=Math.hypot(dx,dy);if(!length||!p.every(Number.isFinite))throw new RangeError('Contorno degenerado.');return [orientation*dy/length,-orientation*dx/length];});
 return points.map((p,i)=>{const a=normals[(i+points.length-1)%points.length],b=normals[i],denominator=1+a[0]*b[0]+a[1]*b[1];if(denominator<1e-6)throw new RangeError('El contorno contiene una esquina incompatible.');return [p[0]+distance*(a[0]+b[0])/denominator,p[1]+distance*(a[1]+b[1])/denominator];});
}
export function frameContour(d,side,scale=1){
 const thickness=finite(d.thickness,3,8,4)*MM,{ry}=frameDimensions(d),half=sizeOf(d).lens/2*MM;
 const outer=offsetContour(lensContour(d,side),thickness),center=lensCenters(d)[1];
 return outer.map(([x,y])=>{
  // Localised nasal material is limited by the centre clearance. The aperture
  // and remaining wall retain their original shape under every bridge edit.
  const nasal=Math.max(0,-x*side/(half+thickness)),vertical=Math.exp(-(((y/(half*ry)+.2)/.48)**4));
  const requested=finite(d.nasalProjection,0,100,35)/100*3*MM*nasal**5*vertical;
  const relief=Math.min(requested,Math.max(0,center+x*side-4*MM));
  return [(x-side*relief)*scale,y*scale];
 });
}
export function lensCenters(d){
 const size=sizeOf(d),actualBridge=size.bridge;
 const center=(size.lens+actualBridge)/2*MM;
 return [-center,center];
}
export function designMeasurements(d){
 const s=sizeOf(d),temple=finite(d.templeLength,135,150,s.temple);
 const outer=frameContour(d,1),center=lensCenters(d)[1],endpiece=2.75*MM;
 const width=(center+Math.max(...outer.map(p=>p[0]))+endpiece)*2/MM;
 return {lens:s.lens,bridge:s.bridge,temple,front:Math.round(width*100)/100,code:`${s.lens} □ ${s.bridge}–${temple}`,size:s.id};
}
function nasalX(d,y){
 const contour=frameContour(d,1),crossings=[];
 for(let i=0;i<contour.length;i++){
  const a=contour[i],b=contour[(i+1)%contour.length];
  if((a[1]<=y&&b[1]>=y)||(b[1]<=y&&a[1]>=y)){
   if(Math.abs(b[1]-a[1])<1e-9)continue;
   crossings.push(a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]));
  }
 }
 const inner=crossings.length?Math.min(...crossings):-Math.max(...contour.map(p=>Math.abs(p[0])));
 return lensCenters(d)[1]+inner+.025;
}
export function bridgeGeometry(d){
 const halfHeight=sizeOf(d).lens/2*MM*frameDimensions(d).ry*finite(d.contourAspectScale,.85,1.15,1);
 const height=({alto:.59,medio:.33,bajo:.1}[d.bridgeHeight]??.33)*halfHeight;
 const kind=d.bridgeType||'clasico',thickness=finite(d.bridgeThickness,5,12,5)*MM;
 const curve=Math.max(0,Math.min(100,Number(d.bridgeNasalCurve??45)))/100;
 function band(base,topRise,gauge,nasal){
  const x=nasalX(d,base),lowerX=nasalX(d,base-gauge),upper=[],lower=[];
  for(let i=0;i<=32;i++){
   const t=i/32,px=-x+2*x*t,bump=Math.sin(Math.PI*t),top=base+topRise*bump;
   upper.push([px,top]);lower.push([-lowerX+2*lowerX*t,top-gauge+nasal*gauge*.5*bump*bump]);
  }
  return {upper,lower,outline:[...upper,...lower.slice().reverse()]};
 }
 const primary=band(height,kind==='herradura'?.12:.022,thickness,curve);
 const bands=[primary];
 if(kind==='doble'){
  const second=Math.min(height+.22,halfHeight*.9);
  bands.push(band(second,.018,Math.min(thickness*.45,Math.max(.04,second-height-.065)),0));
 }
 return {bands,anchorHeight:height,type:kind};
}
export function templePlan(d,side,style='clasico'){
 const outer=frameContour(d,side),center=lensCenters(d)[side===-1?0:1];
 const x=center+side*(Math.max(...outer.map(p=>p[0]*side))+2*MM),y=.16;
 const base=finite(d.templeLength,135,150,sizeOf(d).temple);
 // One fixed ear curve for every shaft style; placement follows nominal B only.
 const local=[[0,0,0],[-.02*side,-.03,-.28],[-.1*side,-.22,-.63],[-.18*side,-.5,-.85]];
 const hookLength=local.slice(1).reduce((sum,p,i)=>sum+Math.hypot(...p.map((v,j)=>v-local[i][j])),0);
 const stemLength=base*MM-hookLength;
 const lateral=style==='curvo'?.13:style==='escultural'?.1:style==='sable'?.07:style==='gancho'?.16:.025;
 const frontY=(Math.max(...outer.map(p=>p[1]))+Math.min(...outer.map(p=>p[1])))/2;
 const stem=[[x,frontY,0],[x+side*.04,y,-.55],[x+side*lateral,y+(style==='sable'?.05:0),-stemLength*.56],[x,y,-stemLength]];
 const join=stem.at(-1),hook=local.map(p=>p.map((v,i)=>v+join[i]));
 return {stem,hook,hookLocal:local,join,stemLength,hookLength,nominalLength:base,shaftWidth:finite(d.armWidth,4,templeWidthLimit(d),6)*MM,hookWidth:.12,depth:style==='fino'?.045:.075};
}
export function templeWidthLimit(d){
 const points=frameContour(d,1);return Math.floor((Math.max(...points.map(p=>p[1]))-Math.min(...points.map(p=>p[1])))/MM);
}
// Actual vertical bounds used by both renderers, including the shaft centreline.
export function templeSection(d,centerY,height){
 const points=frameContour(d,1),top=Math.max(...points.map(p=>p[1])),bottom=Math.min(...points.map(p=>p[1]));
 const h=Math.min(height,top-bottom),center=Math.max(bottom+h/2,Math.min(top-h/2,centerY));
 return {bottom:center-h/2,top:center+h/2,center,height:h};
}
export function nasalPads(d,side){
 d={...d,nasalProjection:0};
 const center=lensCenters(d)[side===-1?0:1],outer=frameContour(d,side),arc=[];
 // Continuous crescent following the nasal rim, on the face-facing side.
 for(let i=0;i<outer.length;i++){
  const p=outer[i];if(p[0]*side<0&&p[1]<.2&&p[1]>-.56)arc.push([p[0]+center,p[1]]);
 }
 arc.sort((a,b)=>b[1]-a[1]);
 const attachment=d.model==='curvo'?Number(d.thickness??4)-.5:-1.4;
 const inner=arc.map(([x,y])=>[side*Math.max(3*MM,side*x+attachment*MM),y]);
 return {outline:[...arc,...inner.reverse()],depth:3*MM};
}
export function recommendFrameSize(faceWidth,d){
 const width=Number(faceWidth);if(!Number.isFinite(width)||width<80||width>190)return null;
 const choices=frameSizes.map(size=>({size,measurements:designMeasurements({...d,frameSize:size.id})}));
 const minimum=Math.min(...choices.map(x=>x.measurements.front)),maximum=Math.max(...choices.map(x=>x.measurements.front));
 const closest=choices.sort((a,b)=>Math.abs(a.measurements.front-width)-Math.abs(b.measurements.front-width))[0];
 return {...closest,minimum,maximum,withinRange:width>=minimum&&width<=maximum};
}
