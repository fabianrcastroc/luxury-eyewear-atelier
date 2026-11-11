import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultDesign,normalizeDesign} from '../public/designer-model.js';
import {templeSections,flatTemple} from '../public/temple-development.js';
import {manufacturingDocument} from '../public/manufacturing.js';
test('ear-length and splay edits preserve nominal L, update the real bend station and produce printable mirrored pieces',()=>{
 for(const templeLength of [120,145,160])for(const earLength of [20,32,45])for(const templeSplay of [0,4,8]){
  const d=normalizeDesign({...defaultDesign,templeLength,earLength,templeSplay}),s=templeSections(d,1),left=templeSections(d,-1);assert.ok(Math.abs(s.developedLength-templeLength)<1e-6);assert.ok(Math.abs(s.bendStartLength-(templeLength-earLength))<1e-6);assert.equal(s.earLengthMM,earLength);assert.ok(s.minimumBendRadiusMM>0);assert.equal(s.rows.length,left.rows.length);for(let i=0;i<s.rows.length;i+=15){assert.ok(Math.abs(s.rows[i].point[0]+left.rows[i].point[0])<1e-7);assert.ok(Math.abs(s.rows[i].point[1]-left.rows[i].point[1])<1e-7);}assert.equal(manufacturingDocument(d,{paper:'oficio'}).pages.length,2);assert.ok(Math.abs(flatTemple(d,1).developedLength-templeLength)<1e-6);
 }
});
