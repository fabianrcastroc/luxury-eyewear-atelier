import test from 'node:test';
import assert from 'node:assert/strict';
import {frameSizes,lensContour,frameContour,lensCenters,bridgeGeometry,templePlan,designMeasurements,recommendFrameSize,templeWidthLimit,nasalPads,templeSection,hingeGeometry,MM} from '../public/frame-geometry.js';
import {iconicModels,defaultDesign,normalizeDesign,designQuote,prescriptionError,prescriptionSignature,armStyles,photoColors,framePreview,frameColors,migrateStoredDesign} from '../public/designer-model.js';
import {totals} from '../public/catalog.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} ≈ ${b}`);

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
test('puentes conservan tres identidades y descartan deformación nasal heredada',()=>{
 for(const model of iconicModels)for(const type of ['clasico','doble','herradura']){
  const base=normalizeDesign({model:model.id,bridgeType:type}),a=bridgeGeometry(base),b=bridgeGeometry(normalizeDesign({...base,bridgeNasalCurve:100,bridgeThickness:12,bridgeHeight:'bajo'}));
  assert.deepEqual(a,b);assert.equal(a.bands.length,type==='doble'?2:1);assert.ok(a.bands.every(b=>b.outline.every(p=>p.every(Number.isFinite))));
 }
 assert.notDeepEqual(bridgeGeometry({...defaultDesign,bridgeType:'clasico'}),bridgeGeometry({...defaultDesign,bridgeType:'herradura'}));
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
test('lunetas nasales son medias lunas continuas del aro con espacio central',()=>{
 for(const model of iconicModels)for(const side of [-1,1])for(const bridgeWidth of [14,22,26]){
  const d=normalizeDesign({model:model.id,bridgeWidth}),pad=nasalPads(d,side);assert.equal(pad.kind,'bonded-nasal-halfmoon');assert.ok(pad.outline.length>60);assert.ok(pad.outline.every(p=>p.every(Number.isFinite)));assert.ok(pad.outline.every(([x])=>x*side>=2*MM-1e-8));assert.equal(pad.depth,3*MM);
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
test('ancho radial hacia dentro conserva distancia métrica al borde, también en zonas cóncavas',()=>{
 for(const model of iconicModels)for(const rounding of [0,35,100])for(const thickness of [3,8]){
  const d=normalizeDesign({model:model.id,rounding,thickness}),inner=lensContour(d,1),outer=frameContour(d,1);
  for(const p of inner){let nearest=Infinity;for(let i=0;i<outer.length;i++){const a=outer[i],b=outer[(i+1)%outer.length],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)));nearest=Math.min(nearest,Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy));}assert.ok(nearest>=thickness*MM-1e-6);}
 }
});
test('contorno importado se valida, conserva proporción y refleja ambos aros',()=>{
 const contour=Array.from({length:64},(_,i)=>[Math.cos(i/64*Math.PI*2),Math.sin(i/64*Math.PI*2)*.7]);
 const d=normalizeDesign({customContour:contour}),right=lensContour(d,1),left=lensContour(d,-1).slice().reverse();assert.equal(right.length,left.length);right.forEach(([x,y])=>assert.ok(left.some(p=>Math.hypot(p[0]+x,p[1]-y)<1e-6)));assert.ok(normalizeDesign({customContour:contour.slice().reverse()}).customContour);
 assert.ok(normalizeDesign(JSON.parse(JSON.stringify(d))).customContour);
 for(const invalid of [[...contour.slice(0,10)],contour.map(([x,y],i)=>i===10?[NaN,y]:[x,y])])assert.ok(!normalizeDesign({customContour:invalid}).customContour);
});

 test('medidas de precisión A y DBL conservan escala y aceptan decimales',()=>{
 for(const lensWidth of [40,51.35,65])for(const bridgeWidth of [14,18.25,24]){const d=normalizeDesign({lensWidth,bridgeWidth}),points=lensContour(d,1),centers=lensCenters(d),measure=designMeasurements(d);close((Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])))/MM,lensWidth);close((centers[1]-centers[0])/MM-lensWidth,bridgeWidth);assert.equal(measure.lens,lensWidth);assert.equal(measure.bridge,bridgeWidth);}
 const d=normalizeDesign({contourAspectScale:1.15,materialDepth:8});assert.equal(d.materialDepth,8);assert.equal(d.contourAspectScale,1.15);assert.equal(normalizeDesign({materialDepth:-2}).materialDepth,2);
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

test('PDF: el ancho radial nunca desplaza envolvente, frente, bisagras ni arranque de brazos',()=>{
 for(const model of iconicModels)for(const hingeMode of ['hidden','box']){
  const base=normalizeDesign({model:model.id,hingeMode}),outer=frameContour(base,1),hinge=hingeGeometry(base,1),front=designMeasurements(base).front,stem=templePlan(base,1).stem[0];
  for(const thickness of [3,5,8]){const d=normalizeDesign({...base,thickness});assert.deepEqual(frameContour(d,1),outer);assert.deepEqual(hingeGeometry(d,1),hinge);assert.equal(designMeasurements(d).front,front);assert.deepEqual(templePlan(d,1).stem[0],stem);assert.notEqual(designMeasurements(d).lens,designMeasurements(base).lens);}
 }
});
test('cristal fijo es un modo explícito y conserva el contorno al modificar aro',()=>{
 const base=normalizeDesign({wallMode:'fixed-lens',lensWidth:50,bridgeWidth:22}),inner=lensContour(base,1);
 for(const thickness of [3,8]){const d=normalizeDesign({...base,thickness});assert.deepEqual(lensContour(d,1),inner);assert.equal(designMeasurements(d).lens,50);assert.equal(designMeasurements(d).bridge,22);assert.notDeepEqual(frameContour(d,1),frameContour(base,1));}
});
test('controles locales no mueven los otros cuadrantes y conservan simetría',()=>{
 const d=normalizeDesign({model:'curvo'}),base=frameContour(d,1),nasal=frameContour({...d,nasalAngle:15},1),temporal=frameContour({...d,temporalLift:12,temporalReach:8},1);
 for(const p of base.filter(([x,y])=>x<0&&y>0))assert.ok(nasal.some(q=>Math.hypot(q[0]-p[0],q[1]-p[1])<1e-8));
 for(const p of base.filter(([x,y])=>x<0&&y>0))assert.ok(temporal.some(q=>Math.hypot(q[0]-p[0],q[1]-p[1])<1e-8));
 assert.notDeepEqual(nasal,base);assert.notDeepEqual(temporal,base);
 const right=frameContour({...d,nasalAngle:15,temporalLift:12,temporalReach:8},1),left=frameContour({...d,nasalAngle:15,temporalLift:12,temporalReach:8},-1);
 for(const [x,y] of right)assert.ok(left.some(p=>Math.hypot(p[0]+x,p[1]-y)<1e-8));
});
test('tallas numéricas amplias y parámetros de terminal sobreviven guardar y abrir',()=>{
 const raw={lensWidth:40,bridgeWidth:26,templeLength:123.5,armBendAngle:37,tipShape:'diamond',tipSize:11,materialDepth:2,hingeMode:'box',nasalAngle:12,temporalLift:7,temporalReach:4};
 const d=normalizeDesign(raw),restored=normalizeDesign(JSON.parse(JSON.stringify(d)));for(const key of Object.keys(raw))assert.equal(restored[key],raw[key]);
 assert.equal(normalizeDesign({templeLength:180}).templeLength,160);assert.equal(normalizeDesign({templeLength:90}).templeLength,120);
});

test('paleta disponible y migración de colores anteriores',()=>{
 assert.deepEqual(frameColors.map(c=>c.id),['negro','carey','amarillo','marfil','azul-marmol','gris','rojo']);
 const d=normalizeDesign({rimColor:'miel',bridgeColor:'oliva',armColor:'burdeos'});assert.equal(d.rimColor,'amarillo');assert.equal(d.bridgeColor,'gris');assert.equal(d.armColor,'rojo');
});

 test('la profundidad de plancha no desplaza el eje de bisagra y la unión queda dentro del frontal',()=>{
 const anchors=[2,3,4,6,8].map(materialDepth=>hingeGeometry(normalizeDesign({materialDepth}),1));for(const h of anchors){assert.deepEqual(h.anchor,anchors[0].anchor);assert.ok(h.jointHalfDepth<=1.25*MM+1e-9);}
});
 test('decimales de pared y brazo no se redondean a milímetros enteros',()=>{const d=normalizeDesign({thickness:4.3,armWidth:7.6});assert.equal(d.thickness,4.3);assert.equal(d.armWidth,7.6);});

test('proyectos anteriores conservan abertura de cristal y los nuevos guardan su política de pared',()=>{const legacy=migrateStoredDesign({model:'recto',thickness:6});assert.equal(legacy.wallMode,'fixed-lens');const saved=normalizeDesign({wallMode:'inward',thickness:4.3,note:'Revisar apoyo nasal'});assert.deepEqual(migrateStoredDesign(JSON.parse(JSON.stringify(saved))),saved);assert.equal(normalizeDesign({note:'x'.repeat(2000)}).note.length,1000);});
