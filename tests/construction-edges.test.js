import test from 'node:test';import assert from 'node:assert/strict';import {finishedExtrusion} from '../public/finished-geometry.js';import {constructionEdges} from '../public/construction-edges.js';
test('los contornos de una placa rectangular excluyen diagonales de triangulación',()=>{const g=finishedExtrusion([[0,0],[4,0],[4,2],[0,2]],[],.24,.02),edges=constructionEdges(g),p=edges.attributes.position;assert.equal(p.count,16);for(let i=0;i<p.count;i+=2){assert.ok(Math.abs(p.getX(i)-p.getX(i+1))<1e-7||Math.abs(p.getY(i)-p.getY(i+1))<1e-7);assert.equal(p.getZ(i),p.getZ(i+1));}g.dispose();edges.dispose();});

test('formed optical caps have short chords and continuous cylinder normals',async()=>{
 const {finishedLens}=await import('../public/finished-geometry.js');const {formGeometry}=await import('../public/front-forming.js');const {MM}=await import('../public/frame-geometry.js');const {normalizeDesign}=await import('../public/designer-model.js');
 const shape=[[-25,-15],[25,-15],[25,15],[-25,15]].map(p=>p.map(v=>v*MM)),g=finishedLens(shape,MM);formGeometry(g,normalizeDesign({frontWrap:15}),'lens-1');const p=g.attributes.position,n=g.attributes.normal;
 assert.ok(p.count>100);for(let i=0;i<p.count;i+=3){const xs=[0,1,2].map(k=>p.getX(i+k)/MM);assert.ok(Math.max(...xs)-Math.min(...xs)<2.1,'maximum cap chord 2 mm');}
 for(let i=0;i<n.count;i++)assert.ok(Math.abs(Math.hypot(n.getX(i),n.getY(i),n.getZ(i))-1)<1e-5);g.dispose();
});
