import test from 'node:test';
import assert from 'node:assert/strict';
import {frameSizes,lensContour,frameContour,lensCenters,bridgeGeometry,templePlan,designMeasurements,recommendFrameSize,templeWidthLimit,nasalPads,templeSection,MM} from '../public/frame-geometry.js';
import {iconicModels,defaultDesign,normalizeDesign,designQuote,prescriptionError,prescriptionSignature,armStyles,photoColors,framePreview} from '../public/designer-model.js';
import {totals} from '../public/catalog.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≈ ${b}`);

test('solo cuatro modelos y migración de diseños anteriores',()=>{
 assert.deepEqual(iconicModels.map(m=>m.name),['Recto','Redondo','Ovalado','Curvo']);
 for(const [before,after] of Object.entries({rectangular:'recto',panto:'redondo',aviador:'ovalado',clubmaster:'curvo',wayfarer:'curvo','cat-eye':'recto'}))assert.equal(normalizeDesign({model:before}).model,after);
 const d=normalizeDesign({bridgeWidth:24,armLength:155});assert.equal(d.bridgeWidth,24);assert.ok(!('armLength' in d));
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
  const p=nasalPads(base,side),q=nasalPads(strong,side);assert.ok(p.outline.length>6);assert.deepEqual(q,p);assert.ok(q.outline.every(p=>p.every(Number.isFinite)));assert.ok(q.outline.every(([x])=>x*side>=3*MM-1e-8));
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

test('brazos sincronizados y sección nunca supera los extremos del aro',()=>{
 const paired=normalizeDesign({armStyle:'sable',armStyleRight:'gancho'});assert.equal(paired.armStyleRight,paired.armStyle);
 for(const model of iconicModels)for(const size of frameSizes){const d={...defaultDesign,model:model.id,frameSize:size.id},points=frameContour(d,1),top=Math.max(...points.map(p=>p[1])),bottom=Math.min(...points.map(p=>p[1]));for(const y of [-.4,0,.16,.4])for(const width of [4,templeWidthLimit(d),100]){const section=templeSection(d,y,width*MM);assert.ok(section.top<=top+1e-8);assert.ok(section.bottom>=bottom-1e-8);}}
});

test('el ancho de puente declarado coincide con la distancia real entre aperturas',()=>{
 for(const size of frameSizes){const d={...defaultDesign,frameSize:size.id},centers=lensCenters(d);close((centers[1]-centers[0])/MM-size.lens,size.bridge);}
});
test('el aro mantiene espesor normal constante en todos los segmentos del cristal',()=>{
 for(const model of iconicModels)for(const rounding of [0,35,100])for(const thickness of [3,8]){
  const d={...defaultDesign,model:model.id,rounding,thickness,nasalProjection:0},inner=lensContour(d,1),outer=frameContour(d,1);
  for(let i=0;i<inner.length;i++){const a=inner[i],b=inner[(i+1)%inner.length],p=outer[i],q=outer[(i+1)%outer.length],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);close(((p[0]-a[0])*dy-(p[1]-a[1])*dx)/length,thickness*MM);close(((q[0]-b[0])*dy-(q[1]-b[1])*dx)/length,thickness*MM);}
 }
});
test('contorno importado se valida, conserva proporción y refleja ambos aros',()=>{
 const contour=Array.from({length:64},(_,i)=>[Math.cos(i/64*Math.PI*2),Math.sin(i/64*Math.PI*2)*.7]);
 const d=normalizeDesign({customContour:contour}),right=lensContour(d,1),left=lensContour(d,-1).slice().reverse();assert.equal(right.length,64);right.forEach(([x,y],i)=>{close(left[i][0],-x);close(left[i][1],y);});
 assert.ok(normalizeDesign(JSON.parse(JSON.stringify(d))).customContour);
 for(const invalid of [[...contour.slice(0,10)],contour.map(([x,y],i)=>i===10?[NaN,y]:[x,y]),contour.slice().reverse(),contour.map(([x,y],i)=>i===10?[0,0]:[x,y])])assert.ok(!normalizeDesign({customContour:invalid}).customContour);
});

 test('medidas de precisión A y DBL conservan escala y aceptan decimales',()=>{
 for(const lensWidth of [40,51.35,65])for(const bridgeWidth of [14,18.25,24]){const d=normalizeDesign({lensWidth,bridgeWidth}),points=lensContour(d,1),centers=lensCenters(d),measure=designMeasurements(d);close((Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])))/MM,lensWidth);close((centers[1]-centers[0])/MM-lensWidth,bridgeWidth);assert.equal(measure.lens,lensWidth);assert.equal(measure.bridge,bridgeWidth);}
 const d=normalizeDesign({contourAspectScale:1.15,materialDepth:12});assert.equal(d.materialDepth,12);assert.equal(d.contourAspectScale,1.15);assert.equal(normalizeDesign({materialDepth:-2}).materialDepth,2);
 });

test('espesores de plancha de acetato son independientes del ancho radial del aro',()=>{
 const base=normalizeDesign(defaultDesign),aperture=lensContour(base,1),outline=frameContour(base,1),bridge=bridgeGeometry(base);
 for(const materialDepth of [2,3,4,6,8]){
  const d=normalizeDesign({...defaultDesign,materialDepth});
  assert.equal(d.materialDepth,materialDepth);assert.equal(d.thickness,base.thickness);
  assert.deepEqual(lensContour(d,1),aperture);assert.deepEqual(frameContour(d,1),outline);assert.deepEqual(bridgeGeometry(d),bridge);
  assert.ok(d.materialDepth*MM>0);
 }
 assert.equal(normalizeDesign({}).materialDepth,6);
});

test('A50 DBL22: cada silueta tiene boxing real de 50 mm y hueco interlenticular de 22 mm',()=>{
 for(const model of iconicModels)for(const materialDepth of [2,3,4,6,8])for(const rounding of [0,35,100]){
  const d=normalizeDesign({model:model.id,lensWidth:50,bridgeWidth:22,materialDepth,rounding}),centers=lensCenters(d);
  const left=lensContour(d,-1).map(([x,y])=>[x+centers[0],y]),right=lensContour(d,1).map(([x,y])=>[x+centers[1],y]);
  for(const contour of [left,right])close((Math.max(...contour.map(p=>p[0]))-Math.min(...contour.map(p=>p[0])))/MM,50);
  close((Math.min(...right.map(p=>p[0]))-Math.max(...left.map(p=>p[0])))/MM,22);
 }
});

test('migración histórica Wayfarer conserva procedencia y no autentica el contorno',()=>{
 const d=normalizeDesign({model:'wayfarer',lensWidth:50,bridgeWidth:22});assert.equal(d.model,'curvo');assert.equal(d.migratedFrom,'wayfarer');assert.equal(d.referenceStatus,'unverified');assert.ok(!d.customContour);
 const restored=normalizeDesign(JSON.parse(JSON.stringify(d)));assert.equal(restored.referenceStatus,'unverified');assert.equal(restored.migratedFrom,'wayfarer');
 assert.ok(!normalizeDesign(defaultDesign).referenceStatus);
});
