import test from 'node:test';
import assert from 'node:assert/strict';
import {frameSizes,lensContour,frameContour,lensCenters,bridgeGeometry,templePlan,designMeasurements,recommendFrameSize,templeWidthLimit,nasalPads,MM} from '../public/frame-geometry.js';
import {iconicModels,defaultDesign,normalizeDesign,designQuote,prescriptionError,prescriptionSignature,armStyles,photoColors,framePreview} from '../public/designer-model.js';
import {totals} from '../public/catalog.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≈ ${b}`);

test('solo cuatro modelos y migración de diseños anteriores',()=>{
 assert.deepEqual(iconicModels.map(m=>m.name),['Recto','Redondo','Ovalado','Curvo']);
 for(const [before,after] of Object.entries({rectangular:'recto',panto:'redondo',aviador:'ovalado',clubmaster:'curvo',wayfarer:'curvo','cat-eye':'recto'}))assert.equal(normalizeDesign({model:before}).model,after);
 const d=normalizeDesign({bridgeWidth:24,armLength:155});assert.ok(!('bridgeWidth' in d));assert.ok(!('armLength' in d));
});
test('la base sigue en $209.000 sin recargos por talla, puente o brazos',()=>{
 for(const m of iconicModels)for(const size of frameSizes)for(const type of ['clasico','doble','herradura'])for(const arm of armStyles)assert.equal(designQuote({...defaultDesign,model:m.id,frameSize:size.id,bridgeType:type,armStyle:arm.id,thickness:8,bridgeThickness:8,armWidth:12,armExtension:5}).total,209000);
 assert.equal(totals([{id:'x',custom:true,config:defaultDesign,qty:2}]).subtotal,418000);
});
test('talla cambia medidas y conserva el perfil normalizado de cada cristal',()=>{
 for(const model of iconicModels){const base=lensContour({...defaultDesign,model:model.id},1);for(const size of frameSizes){const d={...defaultDesign,model:model.id,frameSize:size.id},points=lensContour(d,1),factor=size.lens/52;points.forEach((p,i)=>{close(p[0]/factor,base[i][0]);close(p[1]/factor,base[i][1]);});}}
 assert.equal(designMeasurements(defaultDesign).code,'52 □ 17–140');assert.equal(designMeasurements({...defaultDesign,templeLength:145,armExtension:5}).code,'52 □ 17–145');
});
test('Redondo es circular y Ovalado conserva la gota con cualquier ajuste de redondeo',()=>{
 for(const id of ['redondo','ovalado']){const a=normalizeDesign({...defaultDesign,model:id,rounding:0}),b=normalizeDesign({...defaultDesign,model:id,rounding:100});assert.deepEqual(lensContour(a,1),lensContour(b,1));}
 const points=lensContour(normalizeDesign({...defaultDesign,model:'redondo'}),1);for(const [x,y] of points)close(Math.hypot(x,y),52/2*MM);
 const oval=lensContour(normalizeDesign({...defaultDesign,model:'ovalado'}),1),width=p=>Math.max(...p.map(x=>x[0]))-Math.min(...p.map(x=>x[0]));assert.ok(width(oval.filter(p=>p[1]<-.3))<width(oval.filter(p=>p[1]>.3)));
 assert.equal(bridgeGeometry(normalizeDesign({...defaultDesign,model:'ovalado'})).bands.length,1);
});
test('espesor, altura, tipo y curva del puente nunca separan los aros',()=>{
 for(const model of iconicModels){const base={...defaultDesign,model:model.id},centers=lensCenters(base),outline=frameContour(base,1);for(const type of ['clasico','doble','herradura'])for(const height of ['alto','medio','bajo'])for(const thickness of [5,12]){const d={...base,bridgeType:type,bridgeHeight:height,bridgeThickness:thickness,bridgeNasalCurve:100};assert.deepEqual(lensCenters(d),centers);assert.deepEqual(frameContour(d,1),outline);}}
});
test('curva nasal y espesor solo modifican la cara inferior; doble puente es explícito',()=>{
 for(const model of iconicModels)for(const type of ['clasico','doble','herradura'])for(const height of ['alto','medio','bajo']){
  const d={...defaultDesign,model:model.id,bridgeType:type,bridgeHeight:height},straight=bridgeGeometry({...d,bridgeNasalCurve:0}),curved=bridgeGeometry({...d,bridgeNasalCurve:100}),thick=bridgeGeometry({...d,bridgeThickness:8});
  assert.equal(straight.bands.length,type==='doble'?2:1);assert.deepEqual(straight.bands[0].upper,curved.bands[0].upper);assert.notDeepEqual(straight.bands[0].lower,curved.bands[0].lower);assert.deepEqual(straight.bands[0].upper,thick.bands[0].upper);
  const top=Math.max(...frameContour(d,1).map(p=>p[1]));for(const band of curved.bands){assert.ok(Math.max(...band.upper.map(p=>p[1]))<=top);assert.ok(band.outline.every(p=>p.every(Number.isFinite)));}
 }
});
test('ancho completo no mueve el gancho y el largo nominal B determina su posición',()=>{
 for(const model of iconicModels)for(const arm of armStyles)for(const side of [-1,1]){
  const d={...defaultDesign,model:model.id},base=templePlan(d,side,arm.id),wide=templePlan({...d,armWidth:templeWidthLimit(d)},side,arm.id),long=templePlan({...d,templeLength:150},side,arm.id);
  assert.deepEqual(base.hook,templePlan({...d,nasalProjection:100},side,arm.id).hook);assert.deepEqual(base.hook,wide.hook);assert.deepEqual(base.stem,wide.stem);assert.notEqual(base.shaftWidth,wide.shaftWidth);assert.equal(base.hookWidth,wide.hookWidth);
  close(wide.shaftWidth,templeWidthLimit(d)*MM);assert.deepEqual(base.hookLocal,long.hookLocal);close(long.join[2]-base.join[2],-10*MM);
  assert.deepEqual(base.hook,templePlan({...d,armExtension:5},side,arm.id).hook);
  assert.deepEqual(base.hook,templePlan(d,side,'clasico').hook,'El estilo del tramo recto no cambia el gancho');
 }
 assert.ok(!('armExtension' in normalizeDesign({armExtension:5})));
});
test('puente admite 5 a 12 mm y apoyo nasal añade material sin deformar el cristal',()=>{
 assert.equal(normalizeDesign({bridgeThickness:1}).bridgeThickness,5);assert.equal(normalizeDesign({bridgeThickness:30}).bridgeThickness,12);
 for(const model of iconicModels)for(const side of [-1,1]){
  const base={...defaultDesign,model:model.id,nasalProjection:0},strong={...base,nasalProjection:100};
  assert.deepEqual(lensContour(base,side),lensContour(strong,side));assert.deepEqual(lensCenters(base),lensCenters(strong));
  assert.notDeepEqual(frameContour(base,side),frameContour(strong,side));
  const p=nasalPads(base,side),q=nasalPads(strong,side);assert.ok(p.outline.length>6);assert.ok(q.depth>p.depth);assert.ok(q.outline.every(p=>p.every(Number.isFinite)));assert.ok(q.outline.every(([x])=>x*side>=3*MM-1e-8));
 }
});
test('guía compara ancho frontal y no recomienda automáticamente fuera del rango',()=>{
 const own=designMeasurements(defaultDesign),fit=recommendFrameSize(own.front,defaultDesign);assert.equal(fit.size.id,'media');assert.equal(fit.withinRange,true);assert.equal(recommendFrameSize('mal',defaultDesign),null);assert.equal(recommendFrameSize(0,defaultDesign),null);assert.equal(recommendFrameSize(189,defaultDesign).withinRange,false);
});
test('tratamientos graduados mantienen sus precios y exclusiones',()=>{
 const d={...defaultDesign,use:'optico',lensType:'multi'};assert.equal(designQuote({...d,photo:true,ar:true}).total,417000);assert.equal(designQuote({...d,blue:true,ar:true,photo:true,sunOptical:true}).total,379000);
 const normalized=normalizeDesign({...d,sunOptical:true,photo:true,ar:true,blue:true});assert.equal(normalized.photo,false);assert.equal(normalized.ar,false);assert.equal(normalized.blue,false);
 for(const c of photoColors)assert.equal(designQuote({...d,photo:true,ar:true,photoColor:c.id}).total,417000);
});
test('SVG alternativo responde a geometría, medidas y tipos de puente sin repetir gradientes',()=>{
 const first=framePreview(defaultDesign),second=framePreview({...defaultDesign,bridgeType:'doble',bridgeNasalCurve:100,armExtension:5,armWidth:12});assert.notEqual(first,second);assert.ok(!second.includes(first.match(/id="(design-glass-\d+)"/)[1]+'"'));assert.match(second,/Recto/);
});
test('recetas: formatos, firma de archivo y límites de tamaño',()=>{
 assert.equal(prescriptionError({name:'receta.pdf',type:'application/pdf',size:100}),'');assert.match(prescriptionError({name:'r.exe',size:100}),/Formato/);assert.match(prescriptionError({name:'r.pdf',size:11*1024*1024}),/10 MB/);assert.ok(prescriptionSignature(new TextEncoder().encode('%PDF')));assert.equal(prescriptionSignature(new TextEncoder().encode('%PDF'),{name:'falsa.png'}),false);
});
