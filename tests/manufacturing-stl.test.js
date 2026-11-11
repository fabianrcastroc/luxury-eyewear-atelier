import test from 'node:test';
import assert from 'node:assert/strict';
import {BoxGeometry} from 'three';
import {frameProfiles} from '../public/frame-profiles.js';
import {normalizeDesign} from '../public/designer-model.js';
import {manufacturingSTL,stlParts,encodeClosedSTL} from '../public/manufacturing-stl.js';
import {frameContour,lensContour,designMeasurements,bridgeGeometry} from '../public/frame-geometry.js';
import {frontCutGeometry} from '../public/manufacturing.js';

test('STL de cada pieza de los 14 modelos: cerrado, orientado, volumen positivo y mm',()=>{
 for(const profile of frameProfiles)for(const part of stlParts){
  const result=manufacturingSTL({...profile.defaults,model:profile.id,jobName:'Prueba'},part),bytes=new DataView(result.buffer);
  assert.equal(result.unit,'mm');assert.equal(result.closed,true);assert.ok(result.volumeMM3>1);assert.equal(result.buffer.byteLength,84+50*bytes.getUint32(80,true));
  if(part==='front'){
   let min=Infinity,max=-Infinity;for(let t=0;t<result.triangles;t++)for(let v=0;v<3;v++){const z=bytes.getFloat32(84+t*50+12+v*12+8,true);min=Math.min(min,z);max=Math.max(max,z);}assert.equal(min,0);assert.equal(max,6);
  }
 }
});
test('no se exportan STL de mallas abiertas',()=>{
 const box=new BoxGeometry(10,10,10);box.setIndex(Array.from(box.index.array).slice(3));assert.throws(()=>encodeClosedSTL(box,'abierta'),/malla abierta/);box.dispose();
});
test('modo cristal fijo conserva la abertura; modo exterior fijo conserva la envolvente',()=>{
 for(const profile of frameProfiles){const base=normalizeDesign({...profile.defaults,model:profile.id});
  const inward=normalizeDesign({...base,thickness:6}),outward=normalizeDesign({...base,wallMode:'outward',thickness:6});
  assert.deepEqual(frameContour(inward,1),frameContour(base,1));assert.deepEqual(lensContour(outward,1),lensContour(base,1));assert.ok(designMeasurements(outward).front>designMeasurements(base).front);assert.equal(designMeasurements(outward).wallMode,'outward');
 }
});
test('grosor y bóveda del puente cambian el material sin desplazar los cristales',()=>{
 for(const profile of frameProfiles)for(const bridgeType of ['clasico','doble','herradura']){
  const base=normalizeDesign({...profile.defaults,model:profile.id,bridgeType});const a=bridgeGeometry(base);
  const next=normalizeDesign({...base,bridgeGauge:3,bridgeRise:3});assert.notDeepEqual(bridgeGeometry(next).bands,a.bands);assert.deepEqual(lensContour(next,1),lensContour(base,1));assert.equal(frontCutGeometry(next).outerLoops.length,1);
 }
});

test('una foto importada con microaristas de unión produce un STL cerrado sin alterar la plancha',async()=>{
 const {readFile}=await import('node:fs/promises');const design=JSON.parse(await readFile(new URL('./fixtures/imported-outline.json',import.meta.url),'utf8'));
 const result=manufacturingSTL(design),view=new DataView(result.buffer);assert.ok(result.volumeMM3>1000);assert.equal(result.closed,true);
 let low=Infinity,high=-Infinity;
 for(let i=0;i<result.triangles;i++)for(let j=0;j<3;j++){const z=view.getFloat32(84+i*50+20+j*12,true);low=Math.min(low,z);high=Math.max(high,z);}
 assert.equal(low,0);assert.equal(high,design.materialDepth);
});

test('cristal fijo conserva incluso la edición nasal al cambiar pared y rechaza invasión nasal',()=>{
 const base=normalizeDesign({model:'curvo',nasalAngle:12,temporalLift:3,wallMode:'outward'});
 const inner=lensContour(base,1);for(const thickness of [3,4,6,8])assert.deepEqual(lensContour({...base,thickness},1),inner);
 assert.throws(()=>manufacturingSTL({bridgeWidth:14,wallMode:'outward',thickness:8}),/zona nasal/);
});
