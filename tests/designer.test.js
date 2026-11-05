import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultDesign,normalizeDesign,designQuote,prescriptionError,prescriptionSignature,framePreview,armStyles,photoColors} from '../public/designer-model.js';
import {totals} from '../public/catalog.js';

test('precios de lentes y tratamientos se suman al diseño; los ocultos de óptica no se cobran en sol',()=>{
  assert.equal(designQuote(defaultDesign).total,209000);
  const optical={...defaultDesign,use:'optico'};
  assert.equal(designQuote(optical).total,254000);
  assert.equal(designQuote({...optical,lensType:'bi'}).total,294000);
  assert.equal(designQuote({...optical,lensType:'multi',blue:true,photo:true}).total,419000);
  assert.equal(designQuote({...optical,sunOptical:true,blue:true}).total,279000);
  assert.equal(designQuote({...defaultDesign,blue:true,photo:true,lensType:'multi'}).total,209000);
});
test('todas las personalizaciones de montura se incluyen en $209.000 y se conservan en la bolsa',()=>{
  const config={...defaultDesign,thickness:8,armStyle:'escultural',bridgeColor:'negro'};
  assert.equal(designQuote(config).total,209000);
  assert.deepEqual(totals([{id:'custom-test',custom:true,config,qty:2},{id:'forma',qty:1}]),{subtotal:557000,shipping:0,total:557000});
});
test('normaliza diseños persistidos y no confía en precios guardados',()=>{
  const config=normalizeDesign({use:'optico',model:'invalid',thickness:100,armLength:-5,rounding:'bad',rimColor:'<script>',photo:true,sunOptical:true});
  assert.equal(config.model,'panto');assert.equal(config.thickness,10);assert.equal(config.armLength,135);assert.equal(config.rounding,88);assert.equal(config.rimColor,'miel');assert.equal(config.sunOptical,true);assert.equal(config.photo,false);
  assert.equal(designQuote({...defaultDesign,price:1,total:1}).total,209000);
});
test('vista responde a geometría, colores, vista y brazos sin repetir identificadores de gradiente',()=>{
  const base=framePreview(defaultDesign);
  const changed=framePreview({...defaultDesign,rounding:0,armLength:155,armStyle:'escultural',rimColor:'burdeos'});
  const stripIDs=s=>s.replace(/design-glass-\d+/g,'gradient');
  assert.notEqual(stripIDs(base),stripIDs(changed));assert.match(changed,/#6d3541/);
  for(const model of ['panto','rectangular','cat-eye','aviador'])assert.notEqual(stripIDs(framePreview({...defaultDesign,model,rounding:0})),stripIDs(framePreview({...defaultDesign,model,rounding:100})));
  assert.notEqual(stripIDs(framePreview({...defaultDesign,armLength:135})),stripIDs(framePreview({...defaultDesign,armLength:155})));
  assert.notEqual(stripIDs(framePreview({...defaultDesign,bridgeCurve:0})),stripIDs(framePreview({...defaultDesign,bridgeCurve:100})));
  assert.notEqual(stripIDs(framePreview({...defaultDesign,thickness:3})),stripIDs(framePreview({...defaultDesign,thickness:10})));
  const id=base.match(/id="(design-glass-\d+)"/)[1];assert.ok(!changed.includes(id+'"'));
  assert.notEqual(framePreview(defaultDesign,'frente'),framePreview(defaultDesign,'lateral'));
});
test('recetas: tamaños, extensiones, MIME y firmas admitidas',()=>{
  assert.equal(prescriptionError({name:'receta.pdf',type:'application/pdf',size:100}), '');
  assert.match(prescriptionError({name:'receta.exe',type:'application/pdf',size:100}),/Formato/);
  assert.match(prescriptionError({name:'receta.pdf',type:'text/html',size:100}),/Formato/);
  assert.match(prescriptionError({name:'receta.pdf',type:'application/pdf',size:11*1024*1024}),/10 MB/);
  assert.match(prescriptionError({name:'receta.pdf',size:0}),/vacío/);
  assert.ok(prescriptionSignature(new Uint8Array([0x25,0x50,0x44,0x46])));
  assert.ok(!prescriptionSignature(new TextEncoder().encode('<html>')));
  assert.equal(prescriptionSignature(new Uint8Array([0x25,0x50,0x44,0x46]),{name:'falsa.png'}),false);
});

test('sol óptico elimina todos los tratamientos incompatibles al normalizar y al cobrar',()=>{
 const raw={...defaultDesign,use:'optico',sunOptical:true,photo:true,blue:true,ar:true};
 const d=normalizeDesign(raw);assert.equal(d.sunOptical,true);assert.equal(d.blue,false);assert.equal(d.photo,false);assert.equal(d.ar,false);
 assert.deepEqual(designQuote(raw).lines.map(x=>x.amount),[209000,45000,25000]);
});
test('fotocromático con antirreflejos y tres tonos disponibles',()=>{
 assert.deepEqual(photoColors.map(c=>c.name),['Gris negro','Café','Lila']);
 for(const c of photoColors){const d=normalizeDesign({...defaultDesign,use:'optico',photo:true,ar:true,photoColor:c.id});assert.equal(d.ar,true);assert.equal(d.photoColor,c.id);assert.equal(designQuote(d).total,317000);}
});
test('todas las formas y combinaciones de brazos están incluidas sin graduación',()=>{
 for(const left of armStyles)for(const right of armStyles)assert.equal(designQuote({...defaultDesign,armStyle:left.id,armStyleRight:right.id,thickness:10,rimColor:'negro',bridgeColor:'miel',armColor:'oliva'}).total,209000);
});
