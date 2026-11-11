import test from 'node:test';
import assert from 'node:assert/strict';
import {frameProfiles,getFrameProfile,normalizedProfile} from '../public/frame-profiles.js';
import {normalizeDesign} from '../public/designer-model.js';
import {frameContour,lensContour,lensCenters,designMeasurements,hingeGeometry,MM} from '../public/frame-geometry.js';
import {frontCutGeometry,manufacturingDocument} from '../public/manufacturing.js';
import {polygonArea,isSimpleContour} from '../public/planar-kernel.js';
const near=(a,b,tolerance=1e-5)=>assert.ok(Math.abs(a-b)<tolerance,`${a} ≈ ${b}`);
const distance=(p,poly)=>Math.min(...poly.map((a,i)=>{const b=poly[(i+1)%poly.length],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);}));

test('veinte curvas de construcción distintas y fuentes declaradas, sin autenticidad comercial inventada',()=>{
 assert.equal(frameProfiles.length,20);const signatures=new Set();
 for(const p of frameProfiles){assert.equal(p.referenceStatus,p.traceSource?'pdf-raster-trace':'original-parametric');assert.ok(p.sourcePages.length);assert.ok(p.defaults.lensHeight>=25);const contour=normalizedProfile(p.id,p.rounding);assert.ok(isSimpleContour(contour));assert.ok(polygonArea(contour)>0);signatures.add(JSON.stringify(contour));}
 assert.equal(signatures.size,20);
});

test('A, B óptico y DBL son cotas independientes exactas de la abertura base',()=>{
 for(const p of frameProfiles)for(const lensWidth of [40,52,65])for(const lensHeight of [25,38,60]){
  const d=normalizeDesign({...p.defaults,model:p.id,lensWidth,lensHeight,bridgeWidth:22}),m=designMeasurements(d);near(m.lens,lensWidth);near(m.lensHeight,lensHeight);near(m.nominalLensHeight,lensHeight);near(m.bridge,22);
 }
});

test('ceja y terminal temporal tienen material adicional y la pared mínima no mueve su envolvente ni bisagra',()=>{
 for(const p of frameProfiles){const d=normalizeDesign({...p.defaults,model:p.id}),outer=frameContour(d,1),anchor=hingeGeometry(d,1).anchor,inner=lensContour(d,1),widths=inner.map(point=>distance(point,outer)/MM);assert.ok(Math.min(...widths)>=d.thickness-1e-5);assert.ok(Math.max(...widths)-Math.min(...widths)>1,`${p.id}: pared variable real`);
  const hinge=hingeGeometry(d,1),center=lensCenters(d)[1];assert.ok(distance([hinge.anchor[0]-center,hinge.anchor[1]],outer)>MM,'asiento de bisagra dentro del material');
  for(const thickness of [3,6,8]){const edited=normalizeDesign({...d,thickness});assert.deepEqual(frameContour(edited,1),outer);assert.deepEqual(hingeGeometry(edited,1).anchor,anchor);assert.ok(designMeasurements(edited).lens!==designMeasurements(d).lens);}
 }
});

test('los veinte modelos y tres puentes producen un frontal continuo y dos hojas con cada plancha',()=>{
 for(const p of frameProfiles)for(const bridgeType of ['clasico','herradura','doble'])for(const materialDepth of [2,3,4,6,8]){
  const d=normalizeDesign({...p.defaults,model:p.id,bridgeType,materialDepth}),cut=frontCutGeometry(d),document=manufacturingDocument(d);assert.equal(cut.outerLoops.length,1);assert.equal(cut.apertures.length,2);assert.equal(cut.bridgeVoids.length,bridgeType==='doble'?1:0);assert.equal(document.pages.length,2);assert.equal(document.checks.nasalPadCount,2);
 }
});

test('cotas exteriores anotadas: Boston 138 × 48 y Recto 2 152 × 42 mm',()=>{
 for(const [id,width,height] of [['boston',138,48],['recto-2',152,42]]){const p=getFrameProfile(id),d=normalizeDesign({...p.defaults,model:id}),cut=frontCutGeometry(d);near(designMeasurements(d).front,width,.00501);near(cut.frontBounds.maxX-cut.frontBounds.minX,width,.01);near(cut.frontBounds.maxY-cut.frontBounds.minY,height,.01);}
});
