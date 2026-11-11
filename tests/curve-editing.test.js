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
