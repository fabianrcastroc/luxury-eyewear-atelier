import {offsetSingleContour,isSimpleContour,polygonArea} from './planar-kernel.js';
// Nominal millimetres; the render is a design preview, not manufacturing CAD.
export const MM=.04;
export const frameSizes=[
 {id:'estrecha',name:'Estrecha',lens:48,bridge:16,temple:135},
 {id:'media',name:'Media',lens:52,bridge:17,temple:140},
 {id:'amplia',name:'Amplia',lens:56,bridge:18,temple:145}
];
const sizeOf=d=>{const base=frameSizes.find(s=>s.id===d.frameSize)||frameSizes[1];return {...base,lens:d.lensWidth==null?base.lens:finite(d.lensWidth,40,65,base.lens),bridge:d.bridgeWidth==null?base.bridge:finite(d.bridgeWidth,14,26,base.bridge)};};
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
 if(!isSimpleContour(points))return null;
 const signed=polygonArea(points);
 return Math.abs(signed)>1e-4?(signed>0?points:points.reverse()):null;
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
  if(model==='curvo'){x*=.9+.1*(y/ry+1)/2;y+=Math.max(0,x)*.07;}
  points.push([x,y]);
 }
 // A is the boxing width of the actual aperture, including tapered profiles.
 // Keep the silhouette but normalise its horizontal bounding box so A/DBL
 // labels, optical centres and vector templates refer to the same dimensions.
 const xs=points.map(p=>p[0]),lo=Math.min(...xs),hi=Math.max(...xs),mid=(lo+hi)/2;
 const normalized=points.map(([x,y])=>[(x-mid)*2/(hi-lo),y]);
 return side===-1?normalized.map(([x,y])=>[-x,y]).reverse():normalized;
}
// Convex envelope operations keep an inward wall from folding or crossing
// itself. Geometry uses scene units (.04 = 1 millimetre), not display pixels.
const area=points=>points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-q[0]*p[1];},0)/2;
function hull(points){
 const sorted=points.map(p=>p.slice()).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 const turn=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const lower=[],upper=[];
 for(const p of sorted){while(lower.length>1&&turn(lower.at(-2),lower.at(-1),p)<=1e-12)lower.pop();lower.push(p);}
 for(const p of sorted.slice().reverse()){while(upper.length>1&&turn(upper.at(-2),upper.at(-1),p)<=1e-12)upper.pop();upper.push(p);}
 return [...lower.slice(0,-1),...upper.slice(0,-1)];
}
export function offsetContour(input,distance){
 const result=offsetSingleContour(input,distance);
 if(Math.abs(polygonArea(result))<4*MM*MM)throw new RangeError('El ancho radial deja una abertura de cristal insuficiente. Reduce el ancho del aro.');
 return result;
}
function baselineLens(d,side){const half=sizeOf(d).lens/2*MM,aspect=finite(d.contourAspectScale,.85,1.15,1);return profile(d,side).map(([x,y])=>[x*half,y*half*aspect]);}
function detailedOuter(d,side,wall=4){
 const half=sizeOf(d).lens/2*MM,outer=offsetContour(baselineLens(d,side),wall*MM),angle=finite(d.nasalAngle,0,15,0)*Math.PI/180,lift=finite(d.temporalLift,0,12,0)*MM,reach=finite(d.temporalReach,0,8,0)*MM;
 if(!angle&&!lift&&!reach)return outer;
 const h=Math.max(...outer.map(p=>Math.abs(p[1]))),w=Math.max(...outer.map(p=>Math.abs(p[0]))),nasalPivot=Math.min(...outer.map(p=>p[0]*side));
 const shaped=outer.map(([x,y])=>{
  const temporal=x*side/w,upper=Math.max(0,y/h),nasal=Math.max(0,-x*side/w),lower=Math.max(0,-y/h);
  // These supports are confined to their named quadrants. Upper-nasal and
  // lower-temporal edges never receive another control's displacement.
  const temporalWeight=Math.max(0,temporal)**3*upper**.7;
  let nx=x,ny=y;if(angle&&x*side<0&&y<0){const phi=Math.atan2(-y,-x*side),theta=angle*Math.sin(2*phi)**2,vx=x*side-nasalPivot;nx=side*(nasalPivot+vx*Math.cos(theta)-y*Math.sin(theta));ny=vx*Math.sin(theta)+y*Math.cos(theta);}
  return [nx+side*reach*temporalWeight,ny+lift*temporalWeight];
 });
 return shaped;
}
export function frameContour(d,side,scale=1){
 // In envelope mode every radial-width edit consumes the INNER aperture.
 // The baseline 4 mm external envelope never grows towards the nose/temples.
 const outer=detailedOuter(d,side,d.wallMode==='fixed-lens'?finite(d.thickness,3,8,4):4);
 return outer.map(([x,y])=>[x*scale,y*scale]);
}
export function lensContour(d,side){
 if(d.wallMode==='fixed-lens')return baselineLens(d,side);
 return offsetContour(detailedOuter(d,side),-finite(d.thickness,3,8,4)*MM);
}
export function lensCenters(d){const size=sizeOf(d),center=(size.lens+size.bridge)/2*MM;return [-center,center];}
export function hingeGeometry(d,side){
 const outer=frameContour({...d,temporalLift:0,temporalReach:0,nasalAngle:0},side),center=lensCenters(d)[side===-1?0:1],stock=finite(d.materialDepth,2,8,6)*MM,mode=d.hingeMode==='box'?'box':'hidden';
 const top=Math.max(...outer.map(p=>p[1])),bottom=Math.min(...outer.map(p=>p[1])),y=bottom+(top-bottom)*.6;
 // Locate the true temporal envelope at hinge height, not its unrelated maxX.
 const crossings=[];
 for(let i=0;i<outer.length;i++){const a=outer[i],b=outer[(i+1)%outer.length];if((a[1]<=y&&b[1]>=y)||(b[1]<=y&&a[1]>=y)){if(Math.abs(b[1]-a[1])>1e-10)crossings.push(a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]));}}
 const edge=center+(crossings.length?(side===1?Math.max(...crossings):Math.min(...crossings)):side*Math.max(...outer.map(p=>Math.abs(p[0]))));
 const extension=mode==='box'?4*MM:0,anchor=[edge+side*(extension-1.5*MM),y,-1*MM];
 const boxOutline=mode==='box'?[[edge-side*2*MM,y-2.5*MM],[edge+side*extension,y-2.5*MM],[edge+side*extension,y+2.5*MM],[edge-side*2*MM,y+2.5*MM]]:[];
 if(boxOutline.length&&area(boxOutline)<0)boxOutline.reverse();
 return {mode,anchor,boxOutline,jointHalfDepth:Math.min(stock/2,1.25*MM),hardware:{center:[anchor[0],y,-.5*MM],size:[2*MM,3*MM,2*MM]}};
}
export function designMeasurements(d){
 const s=sizeOf(d),temple=finite(d.templeLength,120,160,s.temple),centers=lensCenters(d),left=lensContour(d,-1),right=lensContour(d,1),round=x=>Math.round(x*100)/100;
 const lens=(Math.max(...right.map(p=>p[0]))-Math.min(...right.map(p=>p[0])))/MM;
 const bridge=(centers[1]+Math.min(...right.map(p=>p[0]))-centers[0]-Math.max(...left.map(p=>p[0])))/MM;
 const envelope=[...frameContour(d,1).map(([x,y])=>[x+centers[1],y]),...hingeGeometry(d,1).boxOutline];
 const width=2*Math.max(...envelope.map(p=>p[0]))/MM;
 return {lens:round(lens),bridge:round(bridge),temple,front:round(width),nominalLens:s.lens,nominalBridge:s.bridge,code:`${round(lens)} □ ${round(bridge)}–${temple}`,size:s.id,wallMode:d.wallMode==='fixed-lens'?'fixed-lens':'inward'};
}
function nasalX(d,y){
 const contour=frameContour(d,1),crossings=[];
 for(let i=0;i<contour.length;i++){const a=contour[i],b=contour[(i+1)%contour.length];if((a[1]<=y&&b[1]>=y)||(b[1]<=y&&a[1]>=y)){if(Math.abs(b[1]-a[1])>1e-10)crossings.push(a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]));}}
 return lensCenters(d)[1]+(crossings.length?Math.min(...crossings):-Math.max(...contour.map(p=>Math.abs(p[0]))))+.8*MM;
}
export function bridgeGeometry(d){
 const outer=frameContour(d,1),top=Math.max(...outer.map(p=>p[1])),kind=['clasico','doble','herradura'].includes(d.bridgeType)?d.bridgeType:'clasico';
 const base=top*.42,gauge=4*MM,rise=kind==='herradura'?5*MM:1.5*MM;
 function band(y,up,thickness){const upper=[],lower=[],x=nasalX(d,y),lowerX=nasalX(d,y-thickness);for(let i=0;i<=48;i++){const t=i/48,bump=Math.sin(Math.PI*t);upper.push([-x+2*x*t,y+up*bump]);lower.push([-lowerX+2*lowerX*t,y-thickness+up*bump]);}return {upper,lower,outline:[...upper,...lower.slice().reverse()]};}
 const bands=[band(base,rise,gauge)];if(kind==='doble')bands.push(band(Math.min(top*.83,base+8*MM),.6*MM,2*MM));
 return {bands,anchorHeight:base,type:kind};
}
export function templePlan(d,side,style='clasico'){
 const outer=frameContour(d,side),center=lensCenters(d)[side===-1?0:1];
 const hinge=hingeGeometry(d,side),x=hinge.anchor[0],y=hinge.anchor[1];
 const base=finite(d.templeLength,120,160,sizeOf(d).temple);
 // One fixed ear curve for every shaft style; placement follows nominal B only.
 const local=[[0,0,0],[-.02*side,-.03,-.28],[-.1*side,-.22,-.63],[-.18*side,-.5,-.85]];
 const hookLength=local.slice(1).reduce((sum,p,i)=>sum+Math.hypot(...p.map((v,j)=>v-local[i][j])),0);
 const stemLength=base*MM-hookLength;
 const lateral=style==='curvo'?.13:style==='escultural'?.1:style==='sable'?.07:style==='gancho'?.16:.025;
 const frontY=y;
 const stem=[[x,frontY,hinge.anchor[2]],[x+side*.04,y,-.55],[x+side*lateral,y+(style==='sable'?.05:0),-stemLength*.56],[x,y,-stemLength]];
 const join=stem.at(-1),hook=local.map(p=>p.map((v,i)=>v+join[i]));
 return {stem,hook,hookLocal:local,join,stemLength,hookLength,nominalLength:base,jointHalfDepth:hinge.jointHalfDepth,shaftWidth:finite(d.armWidth,4,templeWidthLimit(d),6)*MM,hookWidth:.12,depth:style==='fino'?.045:.075};
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
 const outer=frameContour(d,side),center=lensCenters(d)[side===-1?0:1],back=[],nose=[],height=12*MM,cy=-6*MM;
 function nasalBoundary(y){const crosses=[];for(let i=0;i<outer.length;i++){const a=outer[i],b=outer[(i+1)%outer.length];if((a[1]<=y&&b[1]>=y)||(b[1]<=y&&a[1]>=y)){if(Math.abs(b[1]-a[1])>1e-10)crosses.push(a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]));}}return center+(side===1?Math.min(...crosses):Math.max(...crosses));}
 // A bonded half-moon follows the rear nasal wall. Its front boundary overlaps
 // the parent acetate, avoiding a detached oval or a floating clip-on pad.
 for(let i=0;i<=48;i++){
  const t=i/48,y=cy+height/2-height*t,boundary=nasalBoundary(y),bump=Math.sin(Math.PI*t),available=Math.max(0,boundary*side-2*MM);
  back.push([boundary+side*2.5*MM*bump,y]);nose.push([boundary-side*Math.min(2.5*MM,available)*bump,y]);
 }
 return {outline:[...back,...nose.slice(1,-1).reverse()],depth:3*MM,rearZ:-3*MM,kind:'bonded-nasal-halfmoon'};
}
export function recommendFrameSize(faceWidth,d){
 const width=Number(faceWidth);if(!Number.isFinite(width)||width<80||width>190)return null;
 const choices=frameSizes.map(size=>({size,measurements:designMeasurements({...d,frameSize:size.id})}));
 const minimum=Math.min(...choices.map(x=>x.measurements.front)),maximum=Math.max(...choices.map(x=>x.measurements.front));
 const closest=choices.sort((a,b)=>Math.abs(a.measurements.front-width)-Math.abs(b.measurements.front-width))[0];
 return {...closest,minimum,maximum,withinRange:width>=minimum&&width<=maximum};
}
