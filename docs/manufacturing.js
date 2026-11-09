import {MM,frameContour,lensContour,lensCenters,bridgeGeometry,designMeasurements} from './frame-geometry.js';
import {normalizeDesign} from './designer-model.js';
import {flatTemple,templeSections} from './temple-development.js';

const EPS=1e-7;
const f=n=>Number(n.toFixed(4));
const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]];
const close=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<1e-5;
const signedArea=poly=>poly.reduce((a,p,i)=>a+cross(p,poly[(i+1)%poly.length]),0)/2;
const bounds=points=>({minX:Math.min(...points.map(p=>p[0])),maxX:Math.max(...points.map(p=>p[0])),minY:Math.min(...points.map(p=>p[1])),maxY:Math.max(...points.map(p=>p[1]))});
const path=points=>`M${points.map(p=>`${f(p[0])},${f(p[1])}`).join('L')}Z`;
const linePath=points=>`M${points.map(p=>`${f(p[0])},${f(p[1])}`).join('L')}`;
const text=(x,y,value,extra='')=>`<text x="${f(x)}" y="${f(y)}" ${extra}>${value}</text>`;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function manufacturingIssues(raw={}){
 const d=normalizeDesign(raw),center=lensCenters(d)[1]/MM,right=frameContour(d,1).map(([x,y])=>[x/MM+center,y/MM]);
 const gap=Math.min(...right.map(p=>p[0]))*2,issues=[];
 if(d.model==='curvo'&&!d.customContour)issues.push('Curvo combina ceja de acetato y aro metálico. Falta un plano separado de materiales y herrajes; no se emitirá un patrón de acetato que no corresponde al 3D. Elige un modelo íntegro de acetato o importa un perfil para ese material.');
 if(raw.customContour&&!d.customContour)issues.push('El contorno importado no es válido. Corrige su cierre, convexidad y proporciones antes de imprimir.');
 if(gap<2-1e-5)issues.push(`La abertura nasal mínima es ${f(gap)} mm y debe ser al menos 2 mm. Aumenta DBL o reduce el ancho radial del aro o la pronunciación nasal.`);
 const lens=lensContour(d,1).map(([x,y])=>[x/MM,y/MM]),outerBounds=bounds(right),lensBounds=bounds(lens);
 const frontHeight=outerBounds.maxY-outerBounds.minY,lensHeight=lensBounds.maxY-lensBounds.minY;
 if(Math.max(143,48+frontHeight+15)+9+lensHeight+11>253)issues.push('El frontal y las lunetas exceden una hoja A4 a escala 1:1. Reduce la altura del contorno, A o el ancho radial; no se reducirá la escala automáticamente.');
 if((Math.max(...right.map(p=>p[0]))+3.25)*2>186)issues.push('El frontal excede el ancho útil A4 a escala 1:1. Reduce A o DBL.');
 if(d.armWidth>76)issues.push('El ancho de las patillas excede el espacio para ambas piezas en una hoja A4. Reduce el ancho de patilla a 76 mm o menos para conservar la escala 1:1.');
 return issues;
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
 return a.some((p,i)=>b.some((q,j)=>intersects(p,a[(i+1)%a.length],q,b[(j+1)%b.length])));
}

// Union of the finite straight segments used by the design model. Split at
// intersections, discard interior boundaries, then reconnect exterior loops.
// It removes bridge/rim construction seams from the actual cutting outline.
function unionPolygons(input){
 const polygons=input.map(p=>signedArea(p)>0?p:p.slice().reverse());
 const edges=polygons.flatMap((poly,index)=>poly.map((a,i)=>({a,b:poly[(i+1)%poly.length],index,ts:[0,1]})));
 for(let i=0;i<edges.length;i++)for(let j=i+1;j<edges.length;j++){
  const e=edges[i],o=edges[j];if(e.index===o.index)continue;
  const r=sub(e.b,e.a),s=sub(o.b,o.a),delta=sub(o.a,e.a),den=cross(r,s);
  if(Math.abs(den)<EPS)continue;
  const t=cross(delta,s)/den,u=cross(delta,r)/den;
  if(t>=-EPS&&t<=1+EPS&&u>=-EPS&&u<=1+EPS){e.ts.push(Math.max(0,Math.min(1,t)));o.ts.push(Math.max(0,Math.min(1,u)));}
 }
 const kept=[];
 for(const edge of edges){
  const ts=[...new Set(edge.ts.map(t=>Math.round(t*1e10)/1e10))].sort((a,b)=>a-b),delta=sub(edge.b,edge.a),at=t=>edge.a.map((v,i)=>v+delta[i]*t);
  for(let i=1;i<ts.length;i++){
   if(ts[i]-ts[i-1]<EPS)continue;
   const mid=at((ts[i]+ts[i-1])/2);
   if(polygons.some((poly,j)=>j!==edge.index&&pointInside(mid,poly)))continue;
   const a=at(ts[i-1]),b=at(ts[i]);if(!kept.some(e=>close(e.a,a)&&close(e.b,b)))kept.push({a,b});
  }
 }
 const loops=[];
 while(kept.length){
  const first=kept.shift(),loop=[first.a],start=first.a;let end=first.b,guard=0;
  while(!close(end,start)){
   loop.push(end);const index=kept.findIndex(e=>close(e.a,end));
   if(index<0||++guard>edges.length*4)throw new Error('El frontal no forma un contorno de corte cerrado. Revisa el puente.');
   end=kept.splice(index,1)[0].b;
  }
  if(loop.length>=3&&Math.abs(signedArea(loop))>EPS)loops.push(loop);
 }
 return loops;
}

function dimension(x1,x2,y,label){
 return `<g class="dimension"><path d="M${f(x1)},${f(y-2)}v4M${f(x2)},${f(y-2)}v4M${f(x1)},${f(y)}H${f(x2)}"/>${text((x1+x2)/2,y-1.5,escape(label),'text-anchor="middle"')}</g>`;
}
function calibration(){return `<g class="calibration">${text(20,261,'CONTROL DE ESCALA · verificar regla y cuadrado en ambos ejes')}${dimension(20,120,267,'100 mm')}<path data-calibration="square" d="M170,264h20v20h-20Z"/>${text(180,261,'20 × 20 mm','text-anchor="middle"')}${text(20,276,'Imprimir al 100 % / tamaño real. Desactivar «ajustar a página».')}${text(20,282,'Verificar ambos ejes antes de recortar. Sin compensación de mecanizado.')}</g>`;}
function page(number,title,content,d){
 return `<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297" data-sheet="${number}" role="img" aria-label="${escape(title)}"><title>${escape(title)}</title><style>text{font:3px Arial,sans-serif;fill:#172126}path{fill:none;stroke:#172126;stroke-width:.15;stroke-linejoin:round;stroke-linecap:round}.heading{font-size:5px;font-weight:bold}.caption{font-size:2.6px}.center{stroke:#6e7b80;stroke-width:.12;stroke-dasharray:2 1}.dimension path{stroke-width:.12}.dimension text,.calibration text{font-size:2.5px}.lens{stroke:#172126}.sheet-label{font-size:3.5px;font-weight:bold}</style>${text(15,17,'MISCANTE / PATRÓN PLANO PRELIMINAR','class="heading"')}${text(15,25,escape(title),'class="sheet-label"')}${text(15,32,`${d.customContour?'Perfil importado regularizado':escape(d.model)} · ${escape(designMeasurements(d).code)} · Escala vectorial 1:1 · A4`)}${text(15,38,`Placa: ${f(d.materialDepth)} mm · ancho radial del aro: ${f(d.thickness)} mm`,'class="caption"')}${content}${calibration()}${text(195,289,`${number} / 2`,'text-anchor="end"')}</svg>`;
}

export function manufacturingDocument(raw={}){
 const issues=manufacturingIssues(raw);if(issues.length)throw new Error(issues.join(' '));
 const d=normalizeDesign(raw),centers=lensCenters(d),polygons=[];
 const apertures=[];
 for(const side of [-1,1]){
  const center=centers[side===-1?0:1];
  polygons.push(frameContour(d,side).map(([x,y])=>[(x+center)/MM,y/MM]));
  apertures.push(lensContour(d,side).map(([x,y])=>[(x+center)/MM,y/MM]));
  // Same projected rectangular endpiece as the 3D renderer.
  const p=templeSections(d,side).stem[0].point,x=(p[0]-side*.05)/MM,y=p[1]/MM;
  polygons.push([[x-2,y-1.75],[x+2,y-1.75],[x+2,y+1.75],[x-2,y+1.75]]);
 }
 polygons.push(...bridgeGeometry(d).bands.map(b=>b.outline.map(([x,y])=>[x/MM,y/MM])));
 const outerLoops=unionPolygons(polygons);
 if(outerLoops.filter(loop=>signedArea(loop)>0).length!==1)throw new Error('El frontal contiene piezas desconectadas; no se puede emitir un patrón de corte único.');
 const exterior=outerLoops.find(loop=>signedArea(loop)>0),holes=[...apertures,...outerLoops.filter(loop=>signedArea(loop)<0)];
 if(holes.some(hole=>hole.some(p=>!pointInside(p,exterior))||boundariesCross(hole,exterior)))throw new Error('Un vaciado sale del frontal o toca su borde exterior. Aumenta el ancho radial del aro o corrige el contorno antes de imprimir.');
 for(let i=0;i<holes.length;i++)for(let j=i+1;j<holes.length;j++)if(boundariesCross(holes[i],holes[j])||pointInside(holes[i][0],holes[j])||pointInside(holes[j][0],holes[i]))throw new Error('Los vaciados de lunetas o puente se superponen. Ajusta DBL, el puente o el contorno antes de imprimir.');
 const frontBounds=bounds(outerLoops.flat()),frontWidth=frontBounds.maxX-frontBounds.minX;
 const frontY=48+frontBounds.maxY,frontBottom=48+frontBounds.maxY-frontBounds.minY,frontMap=([x,y])=>[105+x,frontY-y];
 const lensHeading=Math.max(143,frontBottom+15),lensShapes=[-1,1].map(side=>lensContour(d,side).map(([x,y])=>[x/MM,y/MM])),lensMaxY=Math.max(...lensShapes.flat().map(p=>p[1])),lensMinY=Math.min(...lensShapes.flat().map(p=>p[1])),lensY=lensHeading+9+lensMaxY,lensBottom=lensY-lensMinY;
 if(lensBottom+11>253)throw new Error('Los contornos exceden la hoja 1 a escala 1:1. Reduce la altura de la luneta, A o el ancho radial.');
 let front=`${text(105,43,'FRONTAL · línea continua = corte y vaciado / discontinua = alineación','text-anchor="middle" class="caption"')}<g data-part="front"><path d="${outerLoops.map(loop=>path(loop.map(frontMap))).join('')}"/>${apertures.map(p=>`<path d="${path(p.map(frontMap))}"/>`).join('')}</g><path class="center" d="M105,46V${f(frontBottom+2)}"/>${dimension(105+frontBounds.minX,105+frontBounds.maxX,frontBottom+7,`${f(frontWidth)} mm · ancho frontal del patrón`)}`;
 front+=text(105,lensHeading,'LUNETAS / PLANTILLAS DE LA ABERTURA','text-anchor="middle" class="sheet-label"');
 for(const [i,side] of [-1,1].entries()){
  const points=lensShapes[i],b=bounds(points),cx=i?143:67,cy=lensY;
  front+=`<path class="lens" data-part="lens-${side}" data-origin-x="${cx}" data-origin-y="${f(cy)}" d="${path(points.map(([x,y])=>[cx+x,cy-y]))}"/><path class="center" data-registration="lens-${side}" d="M${cx-2},${f(cy)}h4M${cx},${f(cy-2)}v4"/>${text(cx,lensBottom+5,i?'Derecha':'Izquierda','text-anchor="middle"')}${dimension(cx+b.minX,cx+b.maxX,lensBottom+11,`${f(b.maxX-b.minX)} mm`)}`;
 }
 front+=text(105,257,'No incluye apoyos nasales laminados, herrajes, bisel ni tolerancia de montaje.','text-anchor="middle" class="caption"');
 let arms='';const templePatterns=[];
 for(const [i,side] of [-1,1].entries()){
  const flat=flatTemple(d,side),b=bounds(flat.outline),x=23,y=86+i*96;
  if(b.maxX-b.minX>175+1e-5||b.maxY-b.minY>76+1e-5)throw new Error('La patilla excede el área útil de una hoja A4 a escala 1:1. Reduce el ancho de patilla o el largo B.');
  templePatterns.push(flat);
  arms+=`${text(x,y-41,`PATILLA ${i?'DERECHA':'IZQUIERDA'} · ${escape(d.armStyle)}`,'class="sheet-label"')}<path data-part="temple-${side}" d="${path(flat.outline.map(([px,py])=>[x+px,y+py]))}"/><path class="center" d="${linePath(flat.centerline.map(([px,py])=>[x+px,y+py]))}"/><path class="center" data-registration="temple-${side}" d="M${x-1.25},${y}h2.5M${x},${y-1.25}v2.5"/>${dimension(x,x+b.maxX,y+b.maxY+7,`${f(b.maxX)} mm · proyección del patrón`)}${text(x,y+b.maxY+12,`Largo desarrollado del eje: ${f(flat.developedLength)} mm · ancho inicial: ${f(flat.centerline.length?flat.outline[0][1]*-2:0)} mm`,'class="caption"')}`;
 }
 arms+=`${text(20,243,'Eje discontinuo · conserva la curva de terminal y la longitud desarrollada.')}${text(20,249,'Conformado, bisagras, alma, bisel y contracción requieren un plano de proceso.')}${text(20,255,'Validar espesor, herrajes, apoyos y tolerancias antes de cortar material definitivo.','class="caption"')}`;
 const pages=[page(1,'Hoja 1 · frontal y dos lunetas',front,d),page(2,'Hoja 2 · ambas patillas',arms,d)];
 const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Miscante · patrón plano preliminar 1:1 · dos hojas</title><style>@page{size:A4 portrait;margin:0}*{box-sizing:border-box}body{margin:0;background:#dfe3e4}.print-actions{padding:16px;text-align:center;font:14px Arial}.sheet{width:210mm;height:297mm;margin:0 auto;background:white;break-after:page;page-break-after:always;overflow:hidden}.sheet:last-child{break-after:auto;page-break-after:auto}.sheet svg{display:block;width:210mm;height:297mm}@media print{body{background:white}.print-actions{display:none}.sheet{margin:0}}</style></head><body><div class="print-actions"><button onclick="window.print()">Imprimir las dos hojas / guardar PDF</button><p>Selecciona A4, tamaño real 100 %, sin márgenes ni encabezados. Comprueba los 100 mm antes de cortar.</p></div>${pages.map(svg=>`<section class="sheet">${svg}</section>`).join('')}</body></html>`;
 return {html,pages,source:{type:d.customContour?'imported-regularized':'parametric',verifiedReference:false,sourcePointCount:d.customContour?.length||null,aperturePointCounts:lensShapes.map(p=>p.length)},measurements:{...designMeasurements(d),materialDepth:d.materialDepth,radialWidth:d.thickness,frontPatternWidth:frontWidth,nasalClearance:Math.min(...frameContour(d,1).map(p=>(p[0]+centers[1])/MM))*2,templeDevelopedLengths:templePatterns.map(p=>p.developedLength)},checks:{pageCount:2,scale:'1:1',unit:'mm',frontConnected:true,frontComponentCount:1,frontVoidCount:holes.length,lensTemplateCount:2,templeCount:2,closedCutContourCount:7+outerLoops.filter(loop=>signedArea(loop)<0).length,excludedParts:['added-laminated-nasal-pads','hinges-and-drillings','lens-bevel-and-groove'],holesDisjoint:true,holesContained:true,printerCalibrationRequired:true,manufacturingValidated:false}};
}

export function openManufacturingPrint(raw){
 const document=manufacturingDocument(raw),preview=window.open('','_blank');
 if(!preview)throw new Error('Permite abrir la ventana de impresión para ver las dos hojas.');
 preview.document.open();preview.document.write(document.html);preview.document.close();
 return document;
}
