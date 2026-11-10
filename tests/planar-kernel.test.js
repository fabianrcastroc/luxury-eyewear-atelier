import test from 'node:test';
import assert from 'node:assert/strict';
import {offsetSingleContour,unionPolygons,subtractPolygons,polygonArea,isSimpleContour} from '../public/planar-kernel.js';

test('signed offsets keep metric dimensions for positive and negative wall distances',()=>{
 const square=[[0,0],[60,0],[60,40],[0,40]];
 for(const delta of [-8,-3,2,6]){
  const p=offsetSingleContour(square,delta),xs=p.map(v=>v[0]),ys=p.map(v=>v[1]);
  assert.ok(Math.abs(Math.max(...xs)-Math.min(...xs)-(60+delta*2))<1e-6);
  assert.ok(Math.abs(Math.max(...ys)-Math.min(...ys)-(40+delta*2))<1e-6);
 }
 assert.throws(()=>offsetSingleContour(square,-25),/elimina/);
});
test('front unions remove overlap seams and retain negative space as holes',()=>{
 const pieces=[[[0,0],[10,0],[10,10],[0,10]],[[8,3],[16,3],[16,7],[8,7]]];
 const union=unionPolygons(pieces);assert.equal(union.length,1);assert.ok(Math.abs(polygonArea(union[0])-124)<1e-6);
 const ring=subtractPolygons(union,[[[2,2],[6,2],[6,8],[2,8]]]);
 assert.equal(ring.length,2);assert.equal(ring.filter(p=>polygonArea(p)<0).length,1);
});
test('concave but simple contours survive a true offset, while crossed curves are rejected',()=>{
 const concave=[[0,0],[12,0],[12,4],[8,4],[8,10],[0,10]];
 assert.equal(isSimpleContour(concave),true);assert.equal(isSimpleContour([[0,0],[10,10],[0,10],[10,0]]),false);
 assert.ok(polygonArea(offsetSingleContour(concave,-1))>0);
});
