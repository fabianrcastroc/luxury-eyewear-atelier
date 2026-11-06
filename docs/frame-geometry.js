// Nominal millimetres; the render is a design preview, not manufacturing CAD.
export const MM=.04;
export const frameSizes=[
 {id:'estrecha',name:'Estrecha',lens:48,bridge:16,temple:135},
 {id:'media',name:'Media',lens:52,bridge:17,temple:140},
 {id:'amplia',name:'Amplia',lens:56,bridge:18,temple:145}
];
const sizeOf=d=>frameSizes.find(s=>s.id===d.frameSize)||frameSizes[1];
const modelOf=d=>({rectangular:'recto',panto:'redondo',aviador:'ovalado',clubmaster:'curvo',wayfarer:'curvo'}[d.model]||d.model);
export function frameDimensions(d){
 const m=modelOf(d),rx=1,ry=m==='recto'?.64:m==='redondo'?1:m==='ovalado'?.79:.69;
 return {rx,ry};
}
function profile(d,side){
 const model=modelOf(d),points=[];
 const rounding=Number(d.rounding??35),n=model==='recto'?3.6+(100-rounding)*.033:model==='curvo'?3.1+(100-rounding)*.021:2;
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
 return points;
}
export function lensContour(d,side){const half=sizeOf(d).lens/2*MM;return profile(d,side).map(([x,y])=>[x*half,y*half]);}
export function frameContour(d,side,scale=1){
 const half=sizeOf(d).lens/2*MM,thickness=Number(d.thickness??4)*MM,{ry}=frameDimensions(d);
 return profile(d,side).map(([x,y])=>{
  // Add material only on the nasal rim; never reshape the lens aperture.
  const nasal=Math.max(0,-x*side),vertical=Math.exp(-(((y/ry+.2)/.48)**4));
  const requestedRelief=Number(d.nasalProjection??35)/100*3*MM*nasal**5*vertical;
  const nasalClearance=lensCenters(d)[1]+x*side*(half+thickness)-4*MM;
  const relief=Math.min(requestedRelief,Math.max(0,nasalClearance));
  return [(x*(half+thickness)-side*relief)*scale,y*(half+thickness/ry)*scale];
 });
}
export function lensCenters(d){
 const size=sizeOf(d),actualBridge=17*size.lens/52;
 const center=(size.lens+actualBridge)/2*MM;
 return [-center,center];
}
export function designMeasurements(d){
 const s=sizeOf(d),temple=Number(d.templeLength??s.temple);
 const outer=frameContour(d,1),center=lensCenters(d)[1],endpiece=2*MM;
 const width=(center+Math.max(...outer.map(p=>p[0]))+endpiece)*2/MM;
 return {lens:s.lens,bridge:s.bridge,temple,front:Math.round(width),code:`${s.lens} □ ${s.bridge}–${temple}`,size:s.id};
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
 const halfHeight=sizeOf(d).lens/2*MM*frameDimensions(d).ry;
 const height=({alto:.59,medio:.33,bajo:.1}[d.bridgeHeight]??.33)*halfHeight;
 const kind=d.bridgeType||'clasico',thickness=Number(d.bridgeThickness??5)*MM;
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
 const base=Number(d.templeLength??sizeOf(d).temple);
 // One fixed ear curve for every shaft style; placement follows nominal B only.
 const local=[[0,0,0],[-.02*side,-.03,-.28],[-.1*side,-.22,-.63],[-.18*side,-.5,-.85]];
 const hookLength=local.slice(1).reduce((sum,p,i)=>sum+Math.hypot(...p.map((v,j)=>v-local[i][j])),0);
 const stemLength=base*MM-hookLength;
 const lateral=style==='curvo'?.13:style==='escultural'?.1:style==='sable'?.07:style==='gancho'?.16:.025;
 const frontY=(Math.max(...outer.map(p=>p[1]))+Math.min(...outer.map(p=>p[1])))/2;
 const stem=[[x,frontY,0],[x+side*.04,y,-.55],[x+side*lateral,y+(style==='sable'?.05:0),-stemLength*.56],[x,y,-stemLength]];
 const join=stem.at(-1),hook=local.map(p=>p.map((v,i)=>v+join[i]));
 return {stem,hook,hookLocal:local,join,stemLength,hookLength,nominalLength:base,shaftWidth:Math.min(Number(d.armWidth??6),templeWidthLimit(d))*MM,hookWidth:.12,depth:style==='fino'?.045:.075};
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
 for(let i=0;i<128;i++){
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
