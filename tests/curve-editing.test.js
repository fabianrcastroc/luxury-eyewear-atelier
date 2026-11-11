import test from 'node:test';
import assert from 'node:assert/strict';
import {contourControlIndices,correctContour} from '../public/curve-editing.js';
import {normalizeContour,lensContour,designMeasurements,MM} from '../public/frame-geometry.js';
import {defaultDesign,normalizeDesign} from '../public/designer-model.js';
import {frontCutGeometry} from '../public/manufacturing.js';
test('assisted corrections create valid editable mirrored cut profiles without changing boxing dimensions',()=>{
 const source=normalizeContour(lensContour(defaultDesign,1)),indices=contourControlIndices(source);assert.equal(new Set(indices).size,8);
 for(const index of indices){const contour=correctContour(source,index,1.2,.6,52,36.4),d=normalizeDesign({...defaultDesign,customContour:contour,lensWidth:52,lensHeight:36.4,bridgeWidth:22});assert.notDeepEqual(contour,source);const cut=frontCutGeometry(d);assert.equal(cut.outerLoops.length,1);const m=designMeasurements(d);assert.equal(m.lens,52);assert.equal(m.lensHeight,36.4);assert.equal(m.bridge,22);const right=lensContour(d,1),left=lensContour(d,-1);assert.ok(Math.abs(Math.min(...right.map(p=>p[0]))+Math.max(...left.map(p=>p[0])))<1e-6*MM);}
});
test('nasal correction gestures are limited to one millimetre and malformed input is rejected',()=>{
 const source=normalizeContour(lensContour(defaultDesign,1)),nasal=contourControlIndices(source)[4];assert.deepEqual(correctContour(source,nasal,10,0,52,36.4),correctContour(source,nasal,1,0,52,36.4));assert.throws(()=>correctContour(source,999,1,0,52,36.4));assert.throws(()=>correctContour([],0,1,0,52,36.4));
});

test('una corrección de 0,1 mm en Cat-eye conserva un frontal fabricable tras redondear la unión',async()=>{
 const {normalizeDesign}=await import('../public/designer-model.js');const {getFrameProfile}=await import('../public/frame-profiles.js');const {normalizeContour,lensContour,designMeasurements}=await import('../public/frame-geometry.js');const {frontCutGeometry}=await import('../public/manufacturing.js');
 let d=normalizeDesign({...getFrameProfile('cateye').defaults,model:'cateye',lensHeight:37.5});d=normalizeDesign({...d,customContour:normalizeContour(lensContour(d,1))});const m=designMeasurements(d),index=contourControlIndices(d.customContour)[2],next=normalizeDesign({...d,customContour:correctContour(d.customContour,index,0,.1,m.nominalLens,m.nominalLensHeight)});assert.equal(frontCutGeometry(next).outerLoops.length,1);assert.notDeepEqual(next.customContour,d.customContour);assert.equal(designMeasurements(next).lensHeight,37.5);
});
