import test from 'node:test';
import assert from 'node:assert/strict';
import {manufacturingDocument,manufacturingIssues,frontCutGeometry,printPapers} from '../public/manufacturing.js';
import {flatTemple,templeSections} from '../public/temple-development.js';
import {normalizeDesign} from '../public/designer-model.js';
import {lensContour,nasalPads,hingeGeometry,MM,designMeasurements} from '../public/frame-geometry.js';

const near=(a,b,tolerance=1e-5)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const length=points=>points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(...p.map((v,j)=>v-points[i][j])),0);
const coords=d=>[...d.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(m=>[Number(m[1]),Number(m[2])]);
const box=points=>({width:Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])),height:Math.max(...points.map(p=>p[1]))-Math.min(...points.map(p=>p[1]))});

for(const [paper,spec] of Object.entries(printPapers))test(`papel ${paper}: exactamente dos hojas, medidas físicas y calibración en ambos ejes`,()=>{
 const doc=manufacturingDocument({},{paper});assert.equal(doc.pages.length,2);assert.equal(doc.checks.pageCount,2);
 assert.deepEqual(doc.paper,spec);assert.equal((doc.html.match(/<section class="sheet">/g)||[]).length,2);
 assert.ok(doc.html.includes(`@page{size:${spec.width}mm ${spec.height}mm;margin:0}`));
 for(const svg of doc.pages){
  assert.ok(svg.includes(`width="${spec.width}mm" height="${spec.height}mm" viewBox="0 0 ${spec.width} ${spec.height}"`));
  assert.match(svg,/100 mm/);assert.match(svg,/20 × 20 mm/);assert.match(svg,/data-calibration="square"/);assert.ok(!/NaN|Infinity|undefined/.test(svg));
 }
 assert.match(doc.html,/tamaño real 100/);assert.equal(doc.checks.manufacturingValidated,false);
});

test('hoja 1: lunetas son los dos apoyos nasales de 3 mm, no discos ópticos sustitutos',()=>{
 const doc=manufacturingDocument();assert.match(doc.pages[0],/LUNETAS NASALES/);assert.equal(doc.checks.nasalPadCount,2);assert.equal(doc.checks.lensTemplateCount,0);
 assert.equal((doc.pages[0].match(/data-part="nasal-pad-/g)||[]).length,2);assert.equal((doc.pages[1].match(/data-part="temple-/g)||[]).length,2);
 assert.ok(!doc.pages[0].includes('data-part="optical-lens-'));assert.deepEqual(doc.measurements.nasalPadDepths,[3,3]);
 assert.equal(doc.checks.closedCutContourCount,7);assert.equal(doc.checks.excludedParts.includes('added-laminated-nasal-pads'),false);
});

test('los apoyos impresos conservan el mismo contorno y escala de la pieza 3D compartida',()=>{
 for(const model of ['recto','redondo','ovalado','curvo']){
  const d=normalizeDesign({model}),doc=manufacturingDocument(d);
  for(const side of [-1,1]){
   const re=new RegExp(`data-part="nasal-pad-${side}" data-origin-x="([^"]+)" data-origin-y="([^"]+)" d="([^"]+)"`),match=doc.pages[0].match(re);assert.ok(match);
   const expected=nasalPads(d,side).outline.map(([x,y])=>[Number(match[1])+x/MM,Number(match[2])-y/MM]),actual=coords(match[3]);
   assert.equal(actual.length,expected.length);actual.forEach((p,i)=>p.forEach((v,j)=>near(v,expected[i][j],.000101)));assert.ok(match[3].endsWith('Z'));
  }
 }
});

test('plantillas ópticas opcionales son piezas adicionales y no desplazan las lunetas nasales',()=>{
 const doc=manufacturingDocument({},{paper:'oficio',includeLensTemplates:true});
 assert.equal(doc.checks.nasalPadCount,2);assert.equal(doc.checks.lensTemplateCount,2);assert.equal(doc.checks.closedCutContourCount,9);
 assert.equal((doc.pages[0].match(/data-part="optical-lens-/g)||[]).length,2);
 assert.match(doc.pages[0],/NO SON APOYOS NASALES/);
});

test('cambiar papel no redimensiona el frontal ni los apoyos',()=>{
 const raw={lensWidth:50,bridgeWidth:22,materialDepth:8};let baseline;
 for(const paper of ['a4','carta','oficio']){
  const doc=manufacturingDocument(raw,{paper});
  const metrics=[doc.measurements.frontPatternWidth,...doc.measurements.nasalPadDepths,...doc.measurements.templeDevelopedLengths];
  if(baseline)assert.deepEqual(metrics,baseline);else baseline=metrics;
 }
 assert.throws(()=>manufacturingDocument(raw,{paper:'letter-unknown'}),/Selecciona papel/);
});

test('ancho radial hacia dentro: envolvente y bisagra fijas; vaciado y medidas reales cambian',()=>{
 for(const model of ['recto','redondo','ovalado','curvo'])for(const hingeMode of ['hidden','box']){
  let outer,front,previousLens;
  for(const thickness of [3,4,8]){
   const raw={model,hingeMode,lensWidth:50,bridgeWidth:22,thickness},d=normalizeDesign(raw),cut=frontCutGeometry(d),doc=manufacturingDocument(d);
   if(outer){assert.deepEqual(cut.outerLoops,outer);near(doc.measurements.frontPatternWidth,front);assert.ok(doc.measurements.lens<previousLens);}else{outer=cut.outerLoops;front=doc.measurements.frontPatternWidth;}
   previousLens=doc.measurements.lens;assert.equal(doc.measurements.nominalLens,50);assert.equal(doc.measurements.nominalBridge,22);near(doc.measurements.front,doc.measurements.frontPatternWidth,.00501);
  }
 }
});

test('caja opcional: el patrón usa exclusivamente la geometría de bisagra compartida',()=>{
 const raw={model:'curvo',lensWidth:50,bridgeWidth:22},hidden=manufacturingDocument({...raw,hingeMode:'hidden'}),boxed=manufacturingDocument({...raw,hingeMode:'box'});
 assert.ok(boxed.measurements.frontPatternWidth>hidden.measurements.frontPatternWidth);
 assert.equal(hingeGeometry(normalizeDesign({...raw,hingeMode:'hidden'}),1).boxOutline.length,0);
 assert.equal(hingeGeometry(normalizeDesign({...raw,hingeMode:'box'}),1).boxOutline.length,4);
 assert.ok(!/data-part="drill/.test(boxed.pages.join('')));assert.match(boxed.pages[1],/No se inventan taladros/);
});

test('frontal de impresión y sólido 3D comparten exactamente el mismo contorno unido y vaciados',()=>{
 for(const model of ['recto','redondo','ovalado','curvo'])for(const bridgeType of ['clasico','doble','herradura']){
  const d=normalizeDesign({model,bridgeType}),cut=frontCutGeometry(d),doc=manufacturingDocument(d),match=doc.pages[0].match(/data-part="front" data-origin-x="([^"]+)" data-origin-y="([^"]+)"><path d="([^"]+)"/);assert.ok(match);
  const expected=cut.outerLoops.flat().map(([x,y])=>[Number(match[1])+x,Number(match[2])-y]),firstPath=match[3].split('Z')[0],actual=coords(firstPath);
  assert.equal(actual.length,expected.length);actual.forEach((p,i)=>p.forEach((v,j)=>near(v,expected[i][j],.000101)));
  assert.equal(doc.checks.frontVoidCount,cut.holes.length);assert.equal(doc.checks.holesContained,true);assert.equal(doc.checks.holesDisjoint,true);
 }
});

test('placas 2/3/4/6/8 conservan XY y se declaran como espesor real, sin inventar autenticidad RB',()=>{
 let baseline;
 for(const materialDepth of [2,3,4,6,8]){
  const d=normalizeDesign({lensWidth:50,bridgeWidth:22,materialDepth}),doc=manufacturingDocument(d),cut=frontCutGeometry(d);
  if(baseline)assert.deepEqual(cut.outerLoops,baseline);else baseline=cut.outerLoops;
  assert.equal(doc.measurements.materialDepth,materialDepth);assert.equal(doc.source.verifiedReference,false);
  const sections=templeSections(d,1);near(sections.stem[64].depth*2/MM,materialDepth);near(sections.stem[0].depth*2/MM,Math.min(materialDepth,2.5));for(const row of sections.rows)assert.ok(row.depth>0&&row.depth*2/MM<=materialDepth+1e-7);
 }
});

test('64 extremos válidos conservan el frontal, las lunetas y la escala sin ampliar la envolvente',()=>{
 let accepted=0,rejected=0;
 for(const model of ['recto','redondo','ovalado','curvo'])for(const lensWidth of [40,65])for(const bridgeWidth of [14,26])for(const thickness of [3,8])for(const hingeMode of ['hidden','box']){
  const raw={model,lensWidth,bridgeWidth,thickness,hingeMode};
  try{const doc=manufacturingDocument(raw,{paper:'oficio'});accepted++;assert.equal(doc.checks.frontConnected,true);assert.equal(doc.checks.nasalPadCount,2);near(doc.measurements.front,doc.measurements.frontPatternWidth,.00501);}
  catch(e){assert.match(e.message,/nasal|contorno|superponen|vaciado|bisagra|papel|Oficio|frontal|patilla/);rejected++;}
 }
 assert.equal(accepted,64);assert.equal(rejected,0);
});

test('perfiles importados inválidos se rechazan en vez de imprimir otro diseño silenciosamente',()=>{
 assert.throws(()=>manufacturingDocument({customContour:[[0,0],[1,0],[0,1]]}),/contorno importado no es válido/);
 const customContour=Array.from({length:64},(_,i)=>[Math.cos(i/64*Math.PI*2),Math.sin(i/64*Math.PI*2)*.7]);
 const doc=manufacturingDocument({customContour});assert.equal(doc.source.type,'imported-regularized');assert.equal(doc.source.sourcePointCount,64);
});

test('patillas: longitud B real del eje 120 a 160 mm, variando estilos sin alterar la longitud',()=>{
 for(const templeLength of [120,140,160])for(const armStyle of ['clasico','fino','escultural','sable','curvo','gancho']){
  const d=normalizeDesign({templeLength,armStyle,armWidth:8});
  for(const side of [-1,1]){
   const sections=templeSections(d,side),flat=flatTemple(d,side),axis=[...sections.stem,...sections.hook.slice(1)].map(row=>row.point);
   near(length(axis)/MM,templeLength);near(length(flat.centerline),templeLength);near(flat.developedLength,templeLength);
   assert.ok(flat.outline.every(p=>p.every(Number.isFinite)));
  }
 }
});


test('Carta rechaza brazos demasiado anchos en vez de reducir la escala; Oficio conserva las piezas',()=>{
 const raw={model:'redondo',lensWidth:65,bridgeWidth:26,armWidth:75,templeLength:160};
 assert.throws(()=>manufacturingDocument(raw,{paper:'carta'}),/Ambas patillas no caben en Carta.*no se modificará la escala/);
 const doc=manufacturingDocument(raw,{paper:'oficio'});assert.equal(doc.checks.pageCount,2);assert.equal(doc.checks.scale,'1:1');assert.deepEqual(doc.measurements.templeDevelopedLengths.map(n=>Math.round(n)),[160,160]);
});

 test('los terminales en la inclinación máxima se desarrollan sin cruces y conservan B',()=>{
 for(const tipShape of ['round','square','triangle','diamond'])for(const tipSize of [3,12]){const result=manufacturingDocument({tipShape,tipSize,armBendAngle:45,templeLength:120},{paper:'oficio'});assert.equal(result.checks.pageCount,2);for(const length of result.measurements.templeDevelopedLengths)assert.ok(Math.abs(length-120)<.0001);}
});
