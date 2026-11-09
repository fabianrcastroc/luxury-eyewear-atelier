import test from 'node:test';
import assert from 'node:assert/strict';
import {manufacturingDocument,manufacturingIssues} from '../public/manufacturing.js';
import {flatTemple,templeSections} from '../public/temple-development.js';
import {normalizeDesign} from '../public/designer-model.js';
import {lensContour,MM} from '../public/frame-geometry.js';

const length=points=>points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(...p.map((v,j)=>v-points[i][j])),0);
const close=(actual,expected,tolerance=1e-5)=>assert.ok(Math.abs(actual-expected)<tolerance,`${actual} != ${expected}`);

test('patrones: exactamente dos hojas A4 vectoriales a escala 1:1 y regla de 100 mm',()=>{
 const doc=manufacturingDocument();
 assert.equal(doc.pages.length,2);assert.equal(doc.checks.pageCount,2);
 assert.equal((doc.html.match(/<section class="sheet">/g)||[]).length,2);
 for(const svg of doc.pages){
  assert.match(svg,/width="210mm" height="297mm" viewBox="0 0 210 297"/);
  assert.match(svg,/M20,265v4M120,265v4M20,267H120/);
  assert.match(svg,/100 mm/);assert.ok(!/NaN|Infinity|undefined/.test(svg));
 }
 assert.match(doc.html,/@page\{size:A4 portrait;margin:0\}/);
 assert.match(doc.html,/tamaño real 100/);
 assert.equal(doc.checks.manufacturingValidated,false);
 assert.match(doc.pages[0],/data-part="front"/);
 assert.equal((doc.pages[0].match(/data-part="lens-/g)||[]).length,2);
 assert.equal((doc.pages[1].match(/data-part="temple-/g)||[]).length,2);
});

test('lunetas: coordenadas SVG conservan los milímetros reales del contorno',()=>{
 for(const model of ['recto','redondo','ovalado'])for(const frameSize of ['estrecha','media','amplia']){
  const d=normalizeDesign({model,frameSize}),doc=manufacturingDocument(d);
  const match=doc.pages[0].match(/data-part="lens--1" data-origin-x="([^"]+)" data-origin-y="([^"]+)" d="([^"]+)"/);assert.ok(match);
  const points=[...match[3].matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(m=>[Number(m[1]),Number(m[2])]);
  const expected=lensContour(d,-1).map(([x,y])=>[Number(match[1])+x/MM,Number(match[2])-y/MM]);
  // Both the origin metadata and coordinates round to 0.0001 mm.
  assert.equal(points.length,expected.length);points.forEach((p,i)=>p.forEach((v,j)=>close(v,expected[i][j],.000101)));
  assert.ok(match[3].endsWith('Z'));
 }
});

test('frontal: un contorno conectado sin costuras de puente, incluso en límites de edición',()=>{
 for(const model of ['recto','redondo','ovalado'])for(const thickness of [3,8])for(const bridgeType of ['clasico','doble','herradura'])for(const bridgeHeight of ['alto','bajo']){
  const doc=manufacturingDocument({model,thickness,bridgeType,bridgeHeight,nasalProjection:100,bridgeWidth:24});
  assert.equal(doc.checks.frontConnected,true);
  assert.ok(doc.measurements.frontPatternWidth<180);
  const front=doc.pages[0].match(/data-part="front">(.*?)<\/g>/)[1];
  assert.ok(!/NaN|Infinity/.test(front));
  for(const match of front.matchAll(/d="([^"]+)"/g))assert.ok(match[1].endsWith('Z'));
 }
});

test('precisión: DBL insuficiente bloquea impresión con medidas y corrección concreta',()=>{
 const raw={lensWidth:50,bridgeWidth:14,thickness:8,nasalProjection:100};
 const issues=manufacturingIssues(raw);assert.ok(issues.length);assert.match(issues.join(' '),/abertura nasal mínima.*2 mm.*Aumenta DBL/);
 assert.throws(()=>manufacturingDocument(raw),/Aumenta DBL/);
 const doc=manufacturingDocument({...raw,bridgeWidth:22,thickness:4,materialDepth:8});
 assert.ok(doc.measurements.nasalClearance>=2);assert.equal(doc.measurements.materialDepth,8);
 assert.match(doc.pages[0],/Placa: 8 mm · ancho radial del aro: 4 mm/);
 assert.equal(doc.checks.holesDisjoint,true);assert.equal(doc.checks.holesContained,true);
});

test('precisión: extremos se imprimen sin solapes o se rechazan con un ajuste accionable',()=>{
 let accepted=0,rejected=0;
 for(const model of ['recto','redondo','ovalado'])for(const lensWidth of [40,65])for(const bridgeWidth of [14,24])for(const thickness of [3,8])for(const contourAspectScale of [.85,1.15])for(const bridgeType of ['clasico','doble','herradura']){
  const raw={model,lensWidth,bridgeWidth,thickness,contourAspectScale,bridgeType,nasalProjection:100};
  try{
   const doc=manufacturingDocument(raw);accepted++;assert.ok(doc.measurements.nasalClearance>=2-1e-5);assert.equal(doc.checks.holesDisjoint,true);assert.equal(doc.checks.holesContained,true);
   close(doc.measurements.front,doc.measurements.frontPatternWidth,.00501);
   const part=doc.pages[0].match(/data-part="front">(.*?)<\/g>/)[1];
   for(const match of part.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)){assert.ok(Number(match[1])>=12&&Number(match[1])<=198);assert.ok(Number(match[2])>=47&&Number(match[2])<=160);}
  }catch(e){assert.match(e.message,/abertura nasal|A4|vaciados|contorno|desconectadas|exceden/);rejected++;}
 }
 assert.ok(accepted>100);assert.ok(rejected>0);
});

test('materiales mixtos: Curvo no emite un frontal de acetato incompatible con su aro metálico',()=>{
 assert.match(manufacturingIssues({model:'curvo'}).join(' '),/aro metálico.*plano separado/);
 assert.throws(()=>manufacturingDocument({model:'curvo'}),/no corresponde al 3D/);
});

test('plantillas preliminares: ambas escalas y alineación, recuentos de corte y fuente sin autenticidad inventada',()=>{
 const doc=manufacturingDocument({bridgeType:'doble'});
 for(const svg of doc.pages){assert.match(svg,/PATRÓN PLANO PRELIMINAR/);assert.match(svg,/data-calibration="square" d="M170,264h20v20h-20Z"/);}
 assert.equal((doc.pages[0].match(/data-registration="lens-/g)||[]).length,2);
 assert.equal((doc.pages[1].match(/data-registration="temple-/g)||[]).length,2);
 assert.equal(doc.checks.frontComponentCount,1);assert.equal(doc.checks.frontVoidCount,3);assert.equal(doc.checks.closedCutContourCount,8);
 assert.equal(doc.source.type,'parametric');assert.equal(doc.source.verifiedReference,false);
 assert.deepEqual(doc.source.aperturePointCounts,[128,128]);
});

test('50 □ 22 y placas 2/3/4/6/8: nominal real sin atribuir curva RB2140 ni cambiar el corte XY',()=>{
 let baseline;
 for(const materialDepth of [2,3,4,6,8]){
  const raw={lensWidth:50,bridgeWidth:22,materialDepth},doc=manufacturingDocument(raw),d=normalizeDesign(raw);
  assert.equal(doc.measurements.lens,50);assert.equal(doc.measurements.bridge,22);assert.equal(doc.measurements.materialDepth,materialDepth);
  assert.equal(doc.source.verifiedReference,false);assert.equal(doc.checks.manufacturingValidated,false);
  const shape=doc.pages[0].match(/data-part="front">(.*?)<\/g>/)[1];if(baseline)assert.equal(shape,baseline);else baseline=shape;
  for(const section of [...templeSections(d,1).stem,...templeSections(d,1).hook])close(section.depth*2/MM,materialDepth);
 }
});

test('patillas anchas: comprobar la extensión desarrollada, no solo el ancho inicial',()=>{
 const raw={model:'redondo',lensWidth:65,bridgeWidth:24,contourAspectScale:1.15,thickness:8};
 const doc=manufacturingDocument({...raw,armWidth:72});
 assert.equal(doc.pages.length,2);assert.equal(doc.checks.templeCount,2);
 assert.throws(()=>manufacturingDocument({...raw,armWidth:76}),/Reduce el ancho de patilla/);
});

test('contorno importado: escala conservada; altura incompatible con dos A4 se rechaza sin reducir',()=>{
 const ellipse=aspect=>Array.from({length:64},(_,i)=>{const t=i/64*Math.PI*2;return [Math.cos(t),Math.sin(t)*aspect];});
 const doc=manufacturingDocument({customContour:ellipse(.7),lensWidth:50,bridgeWidth:22,thickness:4,contourAspectScale:1.1});
 assert.equal(doc.checks.holesContained,true);assert.equal(doc.measurements.lens,50);
 const tall={customContour:ellipse(1.25),lensWidth:65,bridgeWidth:24,thickness:8,contourAspectScale:1.15};
 assert.match(manufacturingIssues(tall).join(' '),/A4.*Reduce/);
 assert.throws(()=>manufacturingDocument(tall),/A4/);
 assert.throws(()=>manufacturingDocument({customContour:[[0,0],[1,0],[0,1]]}),/contorno importado no es válido/);
});

test('filiforme conserva espesor de placa y ancho de bisagra con una conicidad propia',()=>{
 const d=normalizeDesign({materialDepth:8,armWidth:8}),classic=templeSections(d,1,'clasico'),fine=templeSections(d,1,'fino');
 close(classic.stem[0].height,fine.stem[0].height);assert.ok(fine.stem[64].height<classic.stem[64].height);
 for(const row of [...classic.stem,...classic.hook,...fine.stem,...fine.hook])close(row.depth,8*MM/2);
 close(fine.developedLength,d.templeLength);
});

test('patillas: mesh y desarrollo comparten secciones con longitud B exacta',()=>{
 for(const model of ['recto','redondo','ovalado','curvo'])for(const templeLength of [135,140,145,150])for(const armStyle of ['clasico','fino','escultural','sable','curvo','gancho']){
  const d=normalizeDesign({model,templeLength,armStyle,armWidth:40});
  for(const side of [-1,1]){
   const sections=templeSections(d,side),flat=flatTemple(d,side);
   const axis=[...sections.stem,...sections.hook.slice(1)].map(row=>row.point);
   close(length(axis)/MM,templeLength);close(length(flat.centerline),templeLength);
   close(flat.developedLength,templeLength);
   assert.ok(flat.outline.every(p=>p.every(Number.isFinite)));
   assert.ok(Math.max(...flat.outline.map(p=>p[0]))<175);
  }
 }
});

test('el terminal de la patilla conserva su forma local al cambiar ancho y estilo',()=>{
 const local=rows=>rows.map(row=>row.point.map((v,i)=>v-rows[0].point[i]));
 const baseline=local(templeSections(normalizeDesign({}),1).hook);
 for(const armWidth of [4,25,60])for(const armStyle of ['clasico','sable','curvo']){
  const actual=local(templeSections(normalizeDesign({armWidth,armStyle}),1).hook);
  actual.forEach((p,i)=>p.forEach((v,j)=>close(v,baseline[i][j])));
 }
});
