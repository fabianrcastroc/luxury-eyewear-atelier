import {sampleBezier} from './bezier-profile.js';
import {minimumProfileWall,isConvexProfile,sampleSpline} from './profile-spline.js';
import {unionPolygons,offsetRegion} from './planar-kernel.js';
import {MM,frameContour,lensContour,lensCenters,bridgeGeometry,designMeasurements,hingeGeometry,nasalPads} from './frame-geometry.js';
import {normalizeDesign} from './designer-model.js';
import {flatTemple} from './temple-development.js';
import {printPaper,printPapers} from './print-paper.js';
export {printPapers};

const EPS=1e-7;
const f=n=>Number(n.toFixed(4));
const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]];
const signedArea=poly=>poly.reduce((a,p,i)=>a+cross(p,poly[(i+1)%poly.length]),0)/2;
const bounds=points=>({minX:Math.min(...points.map(p=>p[0])),maxX:Math.max(...points.map(p=>p[0])),minY:Math.min(...points.map(p=>p[1])),maxY:Math.max(...points.map(p=>p[1]))});
const path=points=>`M${points.map(p=>`${f(p[0])},${f(p[1])}`).join('L')}Z`;
const linePath=points=>`M${points.map(p=>`${f(p[0])},${f(p[1])}`).join('L')}`;
const text=(x,y,value,extra='')=>`<text x="${f(x)}" y="${f(y)}" ${extra}>${value}</text>`;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const partsCache=new Map();
function projectParts(d){const key=JSON.stringify(d);if(partsCache.has(key))return partsCache.get(key);
 const centers=lensCenters(d),polygons=[],apertures=[],pads=[];
 for(const side of [-1,1]){
  const center=centers[side===-1?0:1];
  polygons.push(frameContour(d,side).map(([x,y])=>[(x+center)/MM,y/MM]));
  apertures.push(lensContour(d,side).map(([x,y])=>[(x+center)/MM,y/MM]));
  const hinge=hingeGeometry(d,side);if(hinge.boxOutline?.length)polygons.push(hinge.boxOutline.map(([x,y])=>[x/MM,y/MM]));
  const pad=nasalPads(d,side);pads.push({side,depth:pad.depth/MM,outline:pad.outline.map(([x,y])=>[x/MM,y/MM])});
 }
 polygons.push(...bridgeGeometry(d).bands.map(b=>b.outline.map(([x,y])=>[x/MM,y/MM])));
 const result={polygons,apertures,pads,centers};if(partsCache.size>=64)partsCache.delete(partsCache.keys().next().value);partsCache.set(key,result);return result;
}
function frontLayout(parts,paper,includeLensTemplates=false){
 const frontBounds=bounds(parts.polygons.flat()),frontWidth=frontBounds.maxX-frontBounds.minX,frontHeight=frontBounds.maxY-frontBounds.minY;
 if(frontWidth>paper.width-28)throw new Error(`El frontal excede el ancho útil de ${paper.name} a escala 1:1. Reduce la amplitud o elige otro papel; no se reducirá la escala.`);
 const frontX=paper.width/2-(frontBounds.minX+frontBounds.maxX)/2,frontY=47+frontBounds.maxY,frontBottom=47+frontHeight;
 const padHeading=0,padTop=0,padBounds=parts.pads.map(p=>bounds(p.outline)),padBottom=0;
 let lensLayout=null,lastBottom=frontBottom+12;
 {
  const shapes=parts.apertures.map((points,i)=>points.map(([x,y])=>[x-parts.centers[i]/MM,y])),span=(paper.width-42)/2;
  const transformed=shapes,bs=transformed.map(bounds),height=Math.max(...bs.map(b=>b.maxY-b.minY));
  if(bs.some(b=>b.maxX-b.minX>span))throw new Error(`Los cristales no caben en ${paper.name} a escala 1:1.`);
  const heading=lastBottom+10,top=heading+7;lensLayout={shapes:transformed,bounds:bs,height,heading,top,rotation:0};lastBottom=top+height+11;
 }
 if(lastBottom>paper.height-43)throw new Error(`Las piezas de la hoja 1 no caben en ${paper.name} a escala 1:1. Elige Oficio o reduce la altura.`);
 return {frontBounds,frontWidth,frontHeight,frontX,frontY,frontBottom,padHeading,padTop,padBounds,padBottom,lensLayout};
}

export function manufacturingIssues(raw={},options={}){
 try{
  const paper=printPaper(options),d=normalizeDesign(raw),parts=projectParts(d),right=frameContour(d,1).map(([x,y])=>[x/MM+parts.centers[1]/MM,y/MM]),gap=Math.min(...right.map(p=>p[0]))*2,issues=[];
  if(raw.customContour&&!d.customContour)issues.push('El contorno importado no es válido. Corrige su cierre, convexidad y proporciones antes de imprimir.');
  if(gap<2-1e-5)issues.push(`La abertura nasal mínima es ${f(gap)} mm y debe ser al menos 2 mm. Aumenta el puente o corrige el contorno exterior.`);
  try{frontLayout(parts,paper,options.includeLensTemplates===true);}catch(error){issues.push(error.message);}
  return issues;
 }catch(error){return [error.message];}
}

function pointInside(p,poly){
 let inside=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[j],b=poly[i],ab=sub(b,a),ap=sub(p,a);
  if(Math.abs(cross(ab,ap))<EPS&&p[0]>=Math.min(a[0],b[0])-EPS&&p[0]<=Math.max(a[0],b[0])+EPS&&p[1]>=Math.min(a[1],b[1])-EPS&&p[1]<=Math.max(a[1],b[1])+EPS)return false;
  if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }
 return inside;
}

function intersects(a,b,c,d){
 const r=sub(b,a),s=sub(d,c),delta=sub(c,a),den=cross(r,s);
 if(Math.abs(den)<EPS){
  if(Math.abs(cross(delta,r))>EPS)return false;
  return Math.max(Math.min(a[0],b[0]),Math.min(c[0],d[0]))<=Math.min(Math.max(a[0],b[0]),Math.max(c[0],d[0]))+EPS&&Math.max(Math.min(a[1],b[1]),Math.min(c[1],d[1]))<=Math.min(Math.max(a[1],b[1]),Math.max(c[1],d[1]))+EPS;
 }
 const t=cross(delta,s)/den,u=cross(delta,r)/den;
 return t>=-EPS&&t<=1+EPS&&u>=-EPS&&u<=1+EPS;
}
function boundariesCross(a,b){
 const x=bounds(a),y=bounds(b);if(x.maxX<y.minX||y.maxX<x.minX||x.maxY<y.minY||y.maxY<x.minY)return false;
 const segments=b.map((q,j)=>({q,r:b[(j+1)%b.length],minX:Math.min(q[0],b[(j+1)%b.length][0]),maxX:Math.max(q[0],b[(j+1)%b.length][0]),minY:Math.min(q[1],b[(j+1)%b.length][1]),maxY:Math.max(q[1],b[(j+1)%b.length][1])}));return a.some((p,i)=>{const r=a[(i+1)%a.length],x0=Math.min(p[0],r[0])-EPS,x1=Math.max(p[0],r[0])+EPS,y0=Math.min(p[1],r[1])-EPS,y1=Math.max(p[1],r[1])+EPS;return segments.some(s=>s.maxX>=x0&&s.minX<=x1&&s.maxY>=y0&&s.minY<=y1&&intersects(p,r,s.q,s.r));});
}

// Shared by the 3D solid and the printable cutting plan. Coordinates are mm
// in the model's frontal XY plane, before any paper placement or rotation.
const frontGeometryCache=new Map();
export function frontCutGeometry(raw={}){
 const d=normalizeDesign(raw),cacheKey=JSON.stringify([d.model,d.outerOutline,d.outerBezier,d.opticalBezier,d.outerSpline,d.opticalSpline,d.opticalOutline,d.curveMinWall,d.curveAllowConcave,d.rimJoin,d.frameShapeMode,d.hingeBoxLength,d.armWidth,d.frameSize,d.lensWidth,d.lensHeight,d.bridgeWidth,d.customContour,d.opticalShape,d.opticalContour,d.opticalWidth,d.opticalHeight,d.contourAspectScale,d.rounding,d.thickness,d.envelopeWall,d.wallMode,d.temporalLift,d.temporalReach,d.nasalAngle,d.hingeMode,d.hingeLevel,d.bridgeType,d.bridgeGauge,d.bridgeDip,d.bridgeRise,d.bridgeOffset,d.bridgeBlend]);if(frontGeometryCache.has(cacheKey))return frontGeometryCache.get(cacheKey);
 const parts=projectParts(d);let loops=unionPolygons(parts.polygons);
 if(d.bridgeBlend>0){loops=offsetRegion(offsetRegion(loops,d.bridgeBlend),-d.bridgeBlend).filter(loop=>Math.abs(signedArea(loop))>=1e-5);}
 const outerLoops=loops.filter(loop=>signedArea(loop)>0),bridgeVoids=loops.filter(loop=>signedArea(loop)<0);
 const gap=Math.min(...frameContour(d,1).map(p=>(p[0]+parts.centers[1])/MM))*2;
 if(gap<2-1e-5)throw new Error('El contorno invade la zona nasal: conserva al menos 2 mm de separación entre aros o aumenta DBL.');
 if(outerLoops.length!==1)throw new Error('El frontal contiene piezas desconectadas. Revisa el puente y la caja de bisagra.');
 const exterior=outerLoops[0],holes=[...parts.apertures,...bridgeVoids];
 if(holes.some(h=>h.some(p=>!pointInside(p,exterior))||boundariesCross(h,exterior)))throw new Error('La edición deja un vaciado fuera del frontal. Corrige el puente o la pared.');
 for(let i=0;i<holes.length;i++)for(let j=i+1;j<holes.length;j++)if(boundariesCross(holes[i],holes[j])||pointInside(holes[i][0],holes[j])||pointInside(holes[j][0],holes[i]))throw new Error('La edición superpone los vaciados del cristal o del puente. Reduce sus parámetros.');

 if(!d.curveAllowConcave)for(const p of [d.outerSpline,d.opticalSpline].filter(Boolean))if(!isConvexProfile(sampleSpline(p)))throw Error('La curva crea una concavidad no habilitada. Ajusta los controles o permite concavidades intencionales.');
 if(d.outerOutline||d.outerBezier||d.opticalBezier||d.outerSpline||d.opticalSpline){const center=parts.centers[1]/MM,wall=minimumProfileWall(parts.apertures[1].map(([x,y])=>[x-center,y]),frameContour(d,1).map(p=>p.map(v=>v/MM)));if(wall<d.curveMinWall-.001)throw new Error(`La pared real queda en ${wall.toFixed(2)} mm; el mínimo configurado es ${d.curveMinWall} mm.`);}
 const result={outerLoops,holes:[...parts.apertures,...bridgeVoids],apertures:parts.apertures,bridgeVoids,frontBounds:bounds(loops.flat()),unit:'mm'};if(frontGeometryCache.size>=48)frontGeometryCache.delete(frontGeometryCache.keys().next().value);frontGeometryCache.set(cacheKey,result);return result;
}
export const frontSolidPolygons=frontCutGeometry;

function dimension(x1,x2,y,label){
 return `<g class="dimension"><path d="M${f(x1)},${f(y-2)}v4M${f(x2)},${f(y-2)}v4M${f(x1)},${f(y)}H${f(x2)}"/>${text((x1+x2)/2,y-1.5,escape(label),'text-anchor="middle"')}</g>`;
}
function verticalDimension(x,y1,y2,label){
 return `<g class="dimension"><path d="M${f(x-2)},${f(y1)}h4M${f(x-2)},${f(y2)}h4M${f(x)},${f(y1)}V${f(y2)}"/>${text(x-1.5,(y1+y2)/2,escape(label),`text-anchor="middle" transform="rotate(-90 ${f(x-1.5)} ${f((y1+y2)/2)})"`)}</g>`;
}
function calibration(paper){const y=paper.height;return `<g class="calibration">${dimension(18,118,y-20,'100 mm')}<path data-calibration="square" d="M${f(paper.width-40)},${f(y-28)}h20v20h-20Z"/>${text(paper.width-30,y-31,'20 × 20 mm','text-anchor="middle"')}</g>`;}
function page(number,title,content,d,paper){
 const m=designMeasurements(d),mode=m.wallMode==='inward'?'aro hacia dentro':'cristal fijo';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${paper.width}mm" height="${paper.height}mm" viewBox="0 0 ${paper.width} ${paper.height}" data-sheet="${number}" role="img" aria-label="${escape(title)}"><title>${escape(title)}</title><style>text{font:3px Arial,sans-serif;fill:#172126}path{fill:none;stroke:#172126;stroke-width:.15;stroke-linejoin:round;stroke-linecap:round}.heading{font-size:4.5px;font-weight:bold}.caption{font-size:2.5px}.center{stroke:#6e7b80;stroke-width:.12;stroke-dasharray:2 1}.dimension path{stroke-width:.12}.dimension text,.calibration text{font-size:2.4px}.sheet-label{font-size:3.4px;font-weight:bold}.bend{stroke:#386473;stroke-width:.18;stroke-dasharray:1 .7}</style>${text(14,16,escape(d.jobName||'Diseño 1'),'class="heading"')}${text(14,24,escape(title),'class="sheet-label"')}${text(14,31,`${d.customContour?'Perfil personalizado':escape(d.model)} · A ${m.lens} × B ${m.lensHeight} · DBL ${m.bridge} · L ${m.temple} · 1:1 · ${paper.name}`)}${text(14,37,`Base ${m.nominalLens??m.lens} □ ${m.nominalBridge??m.bridge} · ${mode} · placa ${f(d.materialDepth)} mm · pared mínima ${f(d.thickness)} mm · conformado ${f(d.frontWrap||0)}°`,'class="caption"')}${content}${calibration(paper)}${text(paper.width-14,paper.height-4,`${number} / 2`,'text-anchor="end"')}</svg>`;
}
function closedSimple(points){
 if(points.length<3||Math.abs(signedArea(points))<1e-6)return false;
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
  if(j===i+1||(i===0&&j===points.length-1))continue;
  if(intersects(points[i],points[(i+1)%points.length],points[j],points[(j+1)%points.length]))return false;
 }
 return true;
}

export function manufacturingDocument(raw={},options={}){
 const paper=printPaper(options),issues=manufacturingIssues(raw,options);if(issues.length)throw new Error(issues.join(' '));
 const d=normalizeDesign(raw),parts=projectParts(d),layout=frontLayout(parts,paper,options.includeLensTemplates===true),{polygons,apertures,pads,centers}=parts;
 const cut=frontCutGeometry(d),outerLoops=[...cut.outerLoops,...cut.bridgeVoids];
 if(outerLoops.filter(loop=>signedArea(loop)>0).length!==1)throw new Error('El frontal contiene piezas desconectadas. Revisa el puente y la caja de bisagra antes de imprimir.');
 const exterior=outerLoops.find(loop=>signedArea(loop)>0),holes=[...apertures,...outerLoops.filter(loop=>signedArea(loop)<0)];
 if(holes.some(hole=>hole.some(p=>!pointInside(p,exterior))||boundariesCross(hole,exterior)))throw new Error('Un vaciado sale del frontal o toca su borde exterior. Corrige el contorno o el ancho radial del aro.');
 for(let i=0;i<holes.length;i++)for(let j=i+1;j<holes.length;j++)if(boundariesCross(holes[i],holes[j])||pointInside(holes[i][0],holes[j])||pointInside(holes[j][0],holes[i]))throw new Error('Los vaciados del cristal o puente se superponen. Corrige el puente o el contorno.');
 if(pads.some(p=>!closedSimple(p.outline)))throw new Error('El apoyo nasal no forma una pieza de corte simple. Corrige el contorno nasal o amplía el puente.');
 const {frontBounds,frontX,frontY,frontBottom,lensLayout}=layout,frontMap=([x,y])=>[frontX+x,frontY-y];
 let front=`${text(paper.width/2,43,'FRONTAL','text-anchor="middle" class="caption"')}<g data-part="front" data-origin-x="${f(frontX)}" data-origin-y="${f(frontY)}"><path d="${outerLoops.map(loop=>path(loop.map(frontMap))).join('')}"/>${apertures.map(p=>`<path d="${path(p.map(frontMap))}"/>`).join('')}</g><path class="center" d="M${f(frontX)},45V${f(frontBottom+2)}"/>${dimension(frontX+frontBounds.minX,frontX+frontBounds.maxX,frontBottom+6,`${layout.frontWidth.toFixed(2)} mm · ancho frontal`)}${verticalDimension(frontX+frontBounds.minX-5,47,frontBottom,`${f(layout.frontHeight)} mm`)}`;

 if(lensLayout){
  front+=text(paper.width/2,lensLayout.heading,'CRISTALES','text-anchor="middle" class="caption"');
  for(const [i,points] of lensLayout.shapes.entries()){
   const b=lensLayout.bounds[i],cx=paper.width*(i?.73:.27),x=cx-(b.minX+b.maxX)/2,y=lensLayout.top+b.maxY;
   front+=`<path data-part="optical-lens-${i?1:-1}" data-origin-x="${f(x)}" data-origin-y="${f(y)}" data-rotation="${lensLayout.rotation}" d="${path(points.map(([px,py])=>[x+px,y-py]))}"/>${dimension(x+b.minX,x+b.maxX,lensLayout.top+lensLayout.height+7,`${f(b.maxX-b.minX)} mm`)}${text(cx,lensLayout.top+lensLayout.height+11,i?'Cristal derecho':'Cristal izquierdo','text-anchor="middle" class="caption"')}`;
  }
 }
 let arms='',cursor=45;const templePatterns=[];
 for(const [i,side] of [-1,1].entries()){
  const flat=flatTemple(d,side),b=bounds(flat.outline),width=b.maxX-b.minX,height=b.maxY-b.minY;
  if(!closedSimple(flat.outline))throw new Error('El terminal o la patilla se cruza a sí mismo. Ajusta su forma, tamaño o inclinación.');
  if(width>paper.width-28)throw new Error(`La patilla excede el ancho útil de ${paper.name} a escala 1:1. Reduce L o elige otro papel.`);
  const top=cursor+5,bottom=top+height,x=14-b.minX,y=top-b.minY;
  if(bottom+14>paper.height-52)throw new Error(`Ambas patillas no caben en ${paper.name} a escala 1:1. Elige Oficio o reduce el ancho o el terminal; no se modificará la escala.`);
  templePatterns.push(flat);
  arms+=`${text(14,cursor,`BRAZO ${i?'DERECHO':'IZQUIERDO'} · ${escape(d.armStyle)}`,'class="sheet-label"')}<path data-part="temple-${side}" d="${path(flat.outline.map(([px,py])=>[x+px,y+py]))}"/><path class="center" d="${linePath(flat.centerline.map(([px,py])=>[x+px,y+py]))}"/>${dimension(x+b.minX,x+b.maxX,bottom+6,`${f(width)} mm · proyección`)}${text(14,bottom+11,`L desarrollado del eje: ${f(flat.developedLength)} mm · ancho inicial: ${f(Number(d.armWidth))} mm · placa ${d.materialDepth} mm`,'class="caption"')}`;
  if(flat.bendStart){const [bx,by]=flat.bendStart;arms+=`<path class="bend" data-part="bend-start-${side}" d="M${f(x+bx)},${f(y+by-3)}v6"/>`;}
  arms+=text(14,bottom+16,`Terminal: ${f(flat.tipLengthMM)} × ${f(flat.tipWidthMM)} mm · espesor terminal ${f(flat.terminalThicknessMM)} mm`,'class="caption"');
  arms+=text(14,bottom+21,`Tramo auricular ${f(flat.earLengthMM)} mm · ángulo ${f(d.armBendAngle)}° · radio mínimo ${flat.minimumBendRadiusMM==null?'recto':f(flat.minimumBendRadiusMM)+' mm'}`,'class="caption"');
  cursor=bottom+28;
 }
 const padBounds=parts.pads.map(p=>bounds(p.outline)),padsHeading=cursor+1,padsTop=padsHeading+8,padsHeight=Math.max(...padBounds.map(b=>b.maxY-b.minY)),padsBottom=padsTop+padsHeight;
 if(padsBottom+16>paper.height-40)throw new Error(`Los brazos y lunetas nasales no caben en ${paper.name} a escala 1:1. Elige Oficio o reduce el ancho del brazo.`);
 arms+=text(paper.width/2,padsHeading,'LUNETAS NASALES · 2 × 3 mm','text-anchor="middle" class="sheet-label"');
 for(const [i,pad] of pads.entries()){
  const b=padBounds[i],cx=paper.width*(i?.68:.32),x=cx-(b.minX+b.maxX)/2,y=padsTop+b.maxY,map=([px,py])=>[x+px,y-py];
  arms+=`<path data-part="nasal-pad-${pad.side}" data-origin-x="${f(x)}" data-origin-y="${f(y)}" d="${path(pad.outline.map(map))}"/>${dimension(x+b.minX,x+b.maxX,padsBottom+6,`${f(b.maxX-b.minX)} mm`)}${text(cx,padsBottom+12,`${i?'Derecha':'Izquierda'} · lámina ${f(pad.depth)} mm`,'text-anchor="middle" class="caption"')}${verticalDimension(x+b.minX-4,padsTop,padsTop+b.maxY-b.minY,`${f(b.maxY-b.minY)} mm`)}`;
 }
 const pages=[page(1,'Frontal y cristales',front,d,paper),page(2,'Brazos y lunetas nasales',arms,d,paper)],size=`${paper.width}mm ${paper.height}mm`;
 const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${escape(d.jobName||'Diseño 1')} · ${paper.name} · 1:1</title><style>@page{size:${size};margin:0}*{box-sizing:border-box}body{margin:0;background:#dfe3e4}.print-actions{padding:16px;text-align:center;font:14px Arial}.sheet{width:${paper.width}mm;height:${paper.height}mm;margin:0 auto;background:white;break-after:page;page-break-after:always;overflow:hidden}.sheet:last-child{break-after:auto;page-break-after:auto}.sheet svg{display:block;width:${paper.width}mm;height:${paper.height}mm}@media print{body{background:white}.print-actions{display:none}.sheet{margin:0}}</style></head><body><div class="print-actions"><button id="fr-print-trigger">Imprimir dos hojas / guardar PDF</button><p>${paper.name} (${paper.width} × ${paper.height} mm), tamaño real 100 %, sin márgenes ni encabezados. Verifica la regla y el cuadrado.</p></div>${pages.map(svg=>`<section class="sheet">${svg}</section>`).join('')}</body></html>`;
 return {html,pages,paper:{...paper},source:{type:d.customContour?'imported-regularized':'parametric',verifiedReference:false,sourcePointCount:d.customContour?.length||null,aperturePointCounts:apertures.map(p=>p.length)},measurements:{...designMeasurements(d),materialDepth:d.materialDepth,radialWidth:d.thickness,frontPatternWidth:layout.frontWidth,nasalPadDepths:pads.map(p=>p.depth),nasalClearance:Math.min(...frameContour(d,1).map(p=>(p[0]+centers[1])/MM))*2,templeDevelopedLengths:templePatterns.map(p=>p.developedLength)},checks:{pageCount:2,scale:'1:1',unit:'mm',frontConnected:true,frontComponentCount:1,frontVoidCount:holes.length,nasalPadCount:2,lensTemplateCount:2,templeCount:2,closedCutContourCount:9+outerLoops.filter(loop=>signedArea(loop)<0).length,excludedParts:['hinges-and-drillings','lens-bevel-and-groove'],holesDisjoint:true,holesContained:true,printerCalibrationRequired:true,manufacturingValidated:false}};
}

export function openManufacturingPrint(raw,options={}){
 const document=manufacturingDocument(raw,options),preview=window.open('','_blank');
 if(!preview)throw new Error('Permite abrir la ventana de impresión para ver las dos hojas.');
 preview.document.open();preview.document.write(document.html);preview.document.close();preview.document.querySelector('#fr-print-trigger')?.addEventListener('click',()=>preview.print());return document;
}
