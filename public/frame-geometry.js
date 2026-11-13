import {sampleSpline} from './profile-spline.js';
import {getLensShape} from './lens-library.js';
import {getFrameProfile,normalizedProfile} from './frame-profiles.js';
import {offsetSingleContour,isSimpleContour,polygonArea,unionPolygons,intersectPolygons} from './planar-kernel.js';
// Nominal millimetres; the render is a design preview, not manufacturing CAD.
export const MM=.04;
export const frameSizes=[
 {id:'estrecha',name:'Estrecha',lens:48,bridge:16,temple:135},
 {id:'media',name:'Media',lens:52,bridge:17,temple:140},
 {id:'amplia',name:'Amplia',lens:56,bridge:18,temple:145}
];
const sizeOf=d=>{const base=frameSizes.find(s=>s.id===d.frameSize)||frameSizes[1];return {...base,lens:d.frameShapeMode==='follow'&&getLensShape(d.opticalShape)?finite(d.opticalWidth,35,65,52):d.lensWidth==null?base.lens:finite(d.lensWidth,40,65,base.lens),bridge:d.bridgeWidth==null?base.bridge:finite(d.bridgeWidth,14,26,base.bridge)};};
const finite=(value,min,max,fallback)=>Number.isFinite(Number(value))?Math.max(min,Math.min(max,Number(value))):fallback;
const modelOf=d=>({rectangular:'recto',aviador:'ovalado',clubmaster:'curvo'}[d.model]||d.model);
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
 const custom=normalizeContour(d.customContour);if(custom)return {rx:1,ry:(Math.max(...custom.map(p=>p[1]))-Math.min(...custom.map(p=>p[1])))/2};
 return {rx:1,ry:getFrameProfile(modelOf(d)).aspect};
}
function profile(d,side){
 const optical=getLensShape(d.opticalShape);if(optical){const pts=normalizeContour(d.opticalContour)||optical.contour;return side===-1?pts.map(([x,y])=>[-x,y]).reverse():pts;}
 const custom=normalizeContour(d.customContour),points=custom||normalizedProfile(modelOf(d),finite(d.rounding,0,100,35));
 return side===-1?points.map(([x,y])=>[-x,y]).reverse():points;
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
function baselineLens(d,side){
 if(d.opticalSpline||d.opticalOutline){const p=(d.opticalSpline?sampleSpline(d.opticalSpline):d.opticalOutline).map(p=>p.map(v=>v*MM));return side===-1?p.map(([x,y])=>[-x,y]).reverse():p;}
 const points=profile(d,side),half=(getLensShape(d.opticalShape)?finite(d.opticalWidth,35,65,52):sizeOf(d).lens)/2*MM,aspect=finite(d.contourAspectScale,.85,1.15,1),ys=points.map(p=>p[1]),height=Math.max(...ys)-Math.min(...ys);
 const yScale=getLensShape(d.opticalShape)?finite(d.opticalHeight,20,60,40)*MM/height:d.lensHeight==null?half*aspect:finite(d.lensHeight,25,60,40)*MM/height*aspect;
 return points.map(([x,y])=>[x*half,y*yScale]);
}
const structuralCache=new Map();
function structuralEnvelope(d,side,wall=finite(d.wallMode==='outward'?d.thickness:d.envelopeWall,3,8,4)){
 const cacheKey=JSON.stringify([side,wall,modelOf(d),d.customContour,d.frameSize,d.lensWidth,d.lensHeight,d.contourAspectScale,d.rounding,d.rimJoin,d.hingeLevel,d.hingeMode,d.armWidth,d.frameShapeMode,d.opticalSpline,d.opticalOutline,d.opticalShape,d.opticalContour,d.opticalWidth,d.opticalHeight]);if(structuralCache.has(cacheKey))return structuralCache.get(cacheKey);
 const seed=baselineLens(d.frameShapeMode==='follow'?d:{...d,opticalShape:'',opticalSpline:null,opticalOutline:null},side),base=(d.frameShapeMode==='follow'&&getLensShape(d.opticalShape))||d.rimJoin==='round'?offsetSingleContour(seed,wall*MM,{join:'round',arcTolerance:.00001}):offsetContour(seed,wall*MM),spec=getFrameProfile(modelOf(d));
 const h=Math.max(...base.map(p=>Math.abs(p[1]))),w=Math.max(...base.map(p=>Math.abs(p[0])));
 const miterExcess=(w-sizeOf(d).lens/2*MM)/MM-wall,endpiece=spec.referenceFrontWidth?spec.endpiece-miterExcess:spec.endpiece;
 const smooth=(value,a,b)=>{const t=Math.max(0,Math.min(1,(value-a)/(b-a)));return t*t*(3-2*t);};
 // Extra material is reserved at the brow and temporal hinge shoulder. It is
 // not an enlarged lens opening: the aperture has its own construction curve.
 const shaped=base.map(([x,y])=>{
  const temporal=x*side/w,upper=Math.max(0,y/h),endWeight=smooth(temporal,.65,.97)*Math.exp(-Math.pow((y/h-(2*finite(d.hingeLevel,.55,.85,spec.hingeFraction||.72)-1))/.32,4));
  return [x+side*endpiece*MM*endWeight,y+spec.brow*MM*smooth(upper,.2,.9)];
 });
 // Rounded hinge endpiece: broad enough to seat hardware inside the actual
 // frontal material, with a short vertical temporal face rather than a blob.
 const cy=h*(2*finite(d.hingeLevel,.55,.85,spec.hingeFraction||.72)-1),hy=(d.hingeMode==='box'?Math.max(2.8,finite(d.armWidth,4,45,6)/2+.5):2.8)*MM,edgeAt=[];
 for(let i=0;i<base.length;i++){const a=base[i],b=base[(i+1)%base.length];if((a[1]<=cy&&b[1]>=cy)||(b[1]<=cy&&a[1]>=cy)){if(Math.abs(b[1]-a[1])>1e-10)edgeAt.push((a[0]+(b[0]-a[0])*(cy-a[1])/(b[1]-a[1]))*side);}}
 const edge=Math.max(...edgeAt),x0=edge-2.5*MM,x1=w+endpiece*MM,r=.8*MM,seat=[];
 for(const [cx,yy,start] of [[x1-r,cy+hy-r,0],[x0+r,cy+hy-r,90],[x0+r,cy-hy+r,180],[x1-r,cy-hy+r,270]])for(let k=0;k<=6;k++){const a=(start+k*15)*Math.PI/180;seat.push([side*(cx+r*Math.cos(a)),yy+r*Math.sin(a)]);}
 // One convex material envelope per eye: unions of local lobes created
 // artificial scallops at the brow and hinge. The bridge is joined downstream.
 const union=[hull([...base,...shaped,...seat])];
 if(structuralCache.size>=100)structuralCache.delete(structuralCache.keys().next().value);structuralCache.set(cacheKey,union[0]);return union[0];
}
function deform(d,side,points,reference){
 const angle=finite(d.nasalAngle,0,15,0)*Math.PI/180,lift=finite(d.temporalLift,0,12,0)*MM,reach=finite(d.temporalReach,0,8,0)*MM;
 if(!angle&&!lift&&!reach)return points;
 const h=Math.max(...reference.map(p=>Math.abs(p[1]))),w=Math.max(...reference.map(p=>Math.abs(p[0])));
 const smooth=(value,a,b)=>{const t=Math.max(0,Math.min(1,(value-a)/(b-a)));return t*t*(3-2*t);};
 return points.map(([x,y])=>{
  const temporal=x*side/w,upper=Math.max(0,y/h),nasal=Math.max(0,-x*side/w);
  const temporalWeight=smooth(temporal,0,1)*smooth(upper,0,.85);
  // Lower nasal flare: fixed vertical stations and a smooth 3 mm saturation,
  // never a sharp clamp/kink or a rotation of the entire nasal quadrant.
  const raw=Math.tan(angle)*(-y)*smooth(nasal,.12,.85),nasalShift=y<0&&x*side<0?3*MM*Math.tanh(raw/(3*MM)):0;
  return [x+side*(reach*temporalWeight+nasalShift),y+lift*temporalWeight];
 });
}
function detailedOuter(d,side){
 if(d.outerSpline){let p=sampleSpline(d.outerSpline).map(p=>p.map(v=>v*MM));if(side===-1)p=p.map(([x,y])=>[-x,y]).reverse();return p;}
 if(d.wallMode==='outward'){
  const baseline=structuralEnvelope(d,side,finite(d.envelopeWall,3,8,4)),outer=deform(d,side,baseline,baseline);
  return offsetContour(outer,(finite(d.thickness,3,8,4)-finite(d.envelopeWall,3,8,4))*MM);
 }
 const outer=structuralEnvelope(d,side);return deform(d,side,outer,outer);
}
export function frameContour(d,side,scale=1){const points=d.outerSpline?detailedOuter(d,side):hull(detailedOuter(d,side));if(!isSimpleContour(points))throw new RangeError('La modificación cruza el contorno exterior. Reduce la edición local.');return points.map(([x,y])=>[x*scale,y*scale]);}
export function lensContour(d,side){
 if(d.opticalSpline||d.opticalOutline)return baselineLens(d,side);
 if(d.wallMode==='outward')return lensContour({...d,wallMode:'inward',thickness:finite(d.envelopeWall,3,8,4)},side);
 if(d.outerSpline)return baselineLens(d,side);
 const wall=finite(d.thickness,3,8,4),baseWall=d.wallMode==='outward'?wall:finite(d.envelopeWall,3,8,4),outer=structuralEnvelope(d,side),finishedOuter=deform(d,side,outer,outer);
 const nominal=offsetContour(baselineLens(d,side),(baseWall-wall)*MM),desired=deform(d,side,nominal,outer);
 if(d.frameShapeMode==='follow'&&getLensShape(d.opticalShape))return desired;
 // Clip the independent aperture to the minimum-wall offset. This preserves
 // thicker brows/endpieces and guarantees the minimum material after edits.
 if(!d.customContour&&!getLensShape(d.opticalShape)&&!finite(d.nasalAngle,0,15,0)&&!finite(d.temporalLift,0,12,0)&&!finite(d.temporalReach,0,8,0))return desired;
 const limit=offsetContour(finishedOuter,-wall*MM),clipped=intersectPolygons([desired],[limit]);
 if(getLensShape(d.opticalShape)&&clipped.length===1){const loss=Math.abs(polygonArea(desired))-Math.abs(polygonArea(clipped[0]));if(loss>1e-5)throw new RangeError('El cristal invade la pared del aro. Amplía el frontal o reduce A/B del cristal.');}
 if(clipped.length!==1)throw new RangeError('La modificación divide o elimina la abertura. Reduce la pared o la edición local.');
 return clipped[0];
}
export function lensCenters(d){const size=sizeOf(d),center=(size.lens+size.bridge)/2*MM;return [-center,center];}
export function hingeGeometry(d,side){
 const outer=frameContour(d,side),center=lensCenters(d)[side===-1?0:1],stock=finite(d.materialDepth,2,8,6)*MM,mode=d.hingeMode==='box'?'box':'hidden';
 const reference=offsetContour(baselineLens(d.frameShapeMode==='follow'?d:{...d,opticalShape:'',opticalSpline:null,opticalOutline:null},side),finite(d.wallMode==='outward'?d.thickness:d.envelopeWall,3,8,4)*MM),height=Math.max(...reference.map(p=>Math.abs(p[1]))),station=height*(2*finite(d.hingeLevel,.55,.85,getFrameProfile(modelOf(d)).hingeFraction||.72)-1),y=deform(d,side,[[side*Math.max(...reference.map(p=>Math.abs(p[0]))),station]],reference)[0][1];
 // Locate the true temporal envelope at hinge height, not its unrelated maxX.
 const crossings=[];
 for(let i=0;i<outer.length;i++){const a=outer[i],b=outer[(i+1)%outer.length];if((a[1]<=y&&b[1]>=y)||(b[1]<=y&&a[1]>=y)){if(Math.abs(b[1]-a[1])>1e-10)crossings.push(a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]));}}
 const edge=center+(crossings.length?(side===1?Math.max(...crossings):Math.min(...crossings)):side*Math.max(...outer.map(p=>Math.abs(p[0]))));
 const extension=mode==='box'?finite(d.hingeBoxLength,2,10,4)*MM:0,anchor=[edge+side*(extension-1.5*MM),y,-1*MM],hy=(finite(d.armWidth,4,45,6)/2+.5)*MM;
 const boxOutline=[];if(mode==='box'){const x0=edge*side-2*MM,x1=edge*side+extension,r=Math.min(.8*MM,hy);for(const [cx,cy,start]of [[x1-r,y+hy-r,0],[x0+r,y+hy-r,90],[x0+r,y-hy+r,180],[x1-r,y-hy+r,270]])for(let i=0;i<=6;i++){const a=(start+i*15)*Math.PI/180;boxOutline.push([side*(cx+r*Math.cos(a)),cy+r*Math.sin(a)]);}}
 if(boxOutline.length&&area(boxOutline)<0)boxOutline.reverse();
 return {mode,anchor,boxOutline,heightMM:2*hy/MM,lengthMM:extension/MM,jointHalfDepth:Math.min(stock/2,1.25*MM),hardware:{center:[anchor[0],y,-.5*MM],size:[2*MM,Math.min(3*MM,2*hy-MM),2*MM]}};
}

export function designMeasurements(d){
 const s=sizeOf(d),temple=finite(d.templeLength,120,160,s.temple),centers=lensCenters(d),left=lensContour(d,-1),right=lensContour(d,1),round=x=>Math.round(x*100)/100;
 const lens=(Math.max(...right.map(p=>p[0]))-Math.min(...right.map(p=>p[0])))/MM;
 const bridge=(centers[1]+Math.min(...right.map(p=>p[0]))-centers[0]-Math.max(...left.map(p=>p[0])))/MM;
 const envelope=[...frameContour(d,1).map(([x,y])=>[x+centers[1],y]),...hingeGeometry(d,1).boxOutline];
 const width=2*Math.max(...envelope.map(p=>p[0]))/MM;
 const lensHeight=(Math.max(...right.map(p=>p[1]))-Math.min(...right.map(p=>p[1])))/MM,baseLens=baselineLens(d,1),nominalLensHeight=(Math.max(...baseLens.map(p=>p[1]))-Math.min(...baseLens.map(p=>p[1])))/MM;
 return {lensHeight:round(lensHeight),nominalLensHeight:round(nominalLensHeight),minimumRimWallMM:finite(d.thickness,3,8,4),lens:round(lens),bridge:round(bridge),temple,front:round(width),nominalLens:s.lens,nominalBridge:s.bridge,code:`${round(lens)} □ ${round(bridge)}–${temple}`,size:s.id,wallMode:d.wallMode==='outward'?'outward':'inward'};
}
function nasalX(d,y){
 const contour=frameContour(d,1),crossings=[];
 for(let i=0;i<contour.length;i++){const a=contour[i],b=contour[(i+1)%contour.length];if((a[1]<=y&&b[1]>=y)||(b[1]<=y&&a[1]>=y)){if(Math.abs(b[1]-a[1])>1e-10)crossings.push(a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]));}}
 return lensCenters(d)[1]+(crossings.length?Math.min(...crossings):-Math.max(...contour.map(p=>Math.abs(p[0]))))+1.4*MM;
}
export function bridgeGeometry(d){
 const outer=frameContour(d,1),top=Math.max(...outer.map(p=>p[1])),kind=['clasico','doble','herradura'].includes(d.bridgeType)?d.bridgeType:'clasico';
 const samples=64,mm=n=>n*MM,gaugeMM=finite(d.bridgeGauge,2,6,4),riseMM=finite(d.bridgeRise,0,4,2.5),offset=mm(finite(d.bridgeOffset,-2,2,0));
 function band(y,rise,gauge){
  const x=nasalX(d,y),lowerX=nasalX(d,y-gauge),upper=[],lower=[];
  for(let i=0;i<=samples;i++){const t=i/samples,bump=4*t*(1-t);upper.push([-x+2*x*t,y+rise*bump]);lower.push([-lowerX+2*lowerX*t,y-gauge+rise*bump]);}
  return {upper,lower,outline:[...upper,...lower.slice().reverse()]};
 }
 let bands,section;
 if(kind==='herradura'){
  // The panto drawing has a shallow top saddle and a broad keyhole vault,
  // not a circular strip standing above the frame.
  const y=top*.78+offset,dip=mm(finite(d.bridgeDip,0,6,2)*.35),x=nasalX(d,y),base=y-dip-mm(gaugeMM+4),lowerX=nasalX(d,base),upper=[],lower=[];
  for(let i=0;i<=samples;i++){const t=i/samples,bump=Math.sin(Math.PI*t);upper.push([-x+2*x*t,y-dip*bump*bump]);lower.push([-lowerX+2*lowerX*t,base+mm(4)*Math.pow(bump,.5)]);}
  bands=[{upper,lower,outline:[...upper,...lower.slice().reverse()]}];section={kind:'elliptical-keyhole-vault',vaultRadiusMM:lowerX/MM,wallMM:gaugeMM,baseMM:base/MM};
 }else if(kind==='doble'){
  const lowerY=top*.32+offset,upperY=Math.max(top*.8,lowerY+mm(8));
  bands=[band(lowerY,mm(riseMM*.52),mm(gaugeMM*.6)),band(Math.min(upperY,top-mm(.8)),mm(.15),mm(gaugeMM*.5))];
  section={kind:'separate-saddle-and-brow-bar',lowerGaugeMM:gaugeMM*.6,upperGaugeMM:gaugeMM*.5,clearanceMM:(bands[1].lower[Math.floor(samples/2)][1]-Math.max(...bands[0].upper.map(p=>p[1])))/MM};
 }else{
  const y=top*.82+offset,dip=mm(finite(d.bridgeDip,0,6,2)),x=nasalX(d,y),lowerY=y-dip-mm(gaugeMM+riseMM),lowerX=nasalX(d,lowerY),upper=[],lower=[];
  for(let i=0;i<=samples;i++){const t=i/samples,bump=Math.sin(Math.PI*t);upper.push([-x+2*x*t,y-dip*bump*bump]);lower.push([-lowerX+2*lowerX*t,lowerY+mm(riseMM)*bump]);}
  bands=[{upper,lower,outline:[...upper,...lower.slice().reverse()]}];section={kind:'integral-acetate-saddle',centerGaugeMM:gaugeMM,shoulderGaugeMM:gaugeMM+riseMM+dip};
 }
 return {bands,anchorHeight:bands[0].upper[0][1],type:kind,section};
}

// Measured construction dimensions, not a medical or manufacturer fit standard.
export function noseZoneMeasurements(d){
 const right=frameContour(d,1),center=lensCenters(d)[1];
 function gapAt(mm){const y=mm*MM,cross=[];for(let i=0;i<right.length;i++){const a=right[i],b=right[(i+1)%right.length];if((a[1]<=y&&b[1]>=y)||(b[1]<=y&&a[1]>=y)){if(Math.abs(b[1]-a[1])>1e-10)cross.push(center+a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]));}}return cross.length?Math.min(...cross)*2/MM:null;}
 const stations=[0,-3,-6,-9,-12].map(y=>({heightMM:y,widthMM:gapAt(y)})),pad=nasalPads(d,1),minimumPadGapMM=Math.min(...pad.outline.map(p=>p[0]))*2/MM;
 return {stations,minimumOuterGapMM:Math.min(...stations.filter(s=>s.widthMM!=null).map(s=>s.widthMM)),minimumPadGapMM,openingAngleDegrees:finite(d.nasalAngle,0,15,0),maximumFlarePerSideMM:3,clinicalFitValidated:false,source:'measured-parametric-construction'};
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
