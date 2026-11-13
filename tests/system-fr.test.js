import test from 'node:test';import assert from 'node:assert/strict';
import {Mesh,MeshBasicMaterial,DoubleSide,Raycaster,Vector3} from 'three';
import {normalizeDesign,migrateStoredDesign,getFrameProfile} from '../public/designer-model.js';
import {frontCutGeometry} from '../public/manufacturing.js';import {finishedExtrusion} from '../public/finished-geometry.js';
import {hingeGeometry,frameContour,designMeasurements,MM} from '../public/frame-geometry.js';import {templeSections} from '../public/temple-development.js';import {lensLibrary} from '../public/lens-library.js';
test('cap faces never cover the optical openings after bridge edits',()=>{
 for(const model of ['recto','panto','cateye-2'])for(const bridgeType of ['clasico','herradura','doble'])for(const bridgeDip of [0,6]){
  const d=normalizeDesign({...getFrameProfile(model).defaults,model,bridgeType,bridgeDip,bridgeGauge:2,bridgeOffset:-2}),cut=frontCutGeometry(d),g=finishedExtrusion(cut.outerLoops[0],cut.holes,6,.8),m=new Mesh(g,new MeshBasicMaterial({side:DoubleSide}));m.updateMatrixWorld();const ray=new Raycaster();
  for(const h of cut.apertures){const c=h.reduce((a,p)=>a.map((v,k)=>v+p[k]/h.length),[0,0]);for(let i=0;i<h.length;i+=24){const p=h[i].map((v,k)=>v*.7+c[k]*.3);ray.set(new Vector3(...p,10),new Vector3(0,0,-1));assert.equal(ray.intersectObject(m).length,0,`${model}/${bridgeType}/${bridgeDip}`);}}g.dispose();m.material.dispose();
 }
});
test('external hinge boxes track the real proximal arm width and remain mirrored',()=>{
 for(const armWidth of [4,7,12,18]){const d=normalizeDesign({model:'panto',hingeMode:'box',armWidth,hingeBoxLength:5}),a=hingeGeometry(d,1),b=hingeGeometry(d,-1),height=(Math.max(...a.boxOutline.map(p=>p[1]))-Math.min(...a.boxOutline.map(p=>p[1])))/MM;assert.ok(Math.abs(height-armWidth-1)<1e-6);assert.equal(a.lengthMM,5);assert.ok(Math.abs(a.anchor[0]+b.anchor[0])<1e-6);assert.ok(Math.abs(templeSections(d,1).rows[0].height/MM-armWidth)<.01);frontCutGeometry(d);}
});
test('all supplied optical shapes can drive the rim, without arbitrary enlargement or clipping',()=>{
 for(const s of lensLibrary){const d=normalizeDesign({model:'recto',frameShapeMode:'follow',opticalShape:s.id,opticalWidth:s.width,opticalHeight:s.height,wallMode:'outward',bridgeWidth:22});frontCutGeometry(d);const m=designMeasurements(d);assert.equal(m.lens,s.width,s.id);assert.equal(m.lensHeight,s.height,s.id);}
 const d=normalizeDesign({model:'recto',frameShapeMode:'independent',opticalShape:'222',opticalWidth:40,opticalHeight:25,lensWidth:60,lensHeight:50});assert.deepEqual(frameContour(d,1),frameContour({...d,opticalWidth:39},1));
});
test('annotated Cat-eye retains A51 B48 DBL17 frontal150 and L125',()=>{const p=getFrameProfile('cateye-2'),m=designMeasurements(normalizeDesign({...p.defaults,model:p.id}));assert.deepEqual([m.lens,m.lensHeight,m.bridge,m.front,m.temple],[51,48,17,150,125]);});
test('linked optics, outward wall, box and terminal dimensions survive project reopening',()=>{const d=normalizeDesign({frameShapeMode:'follow',wallMode:'outward',opticalShape:'221',opticalWidth:54,opticalHeight:41,hingeMode:'box',hingeBoxLength:6,tipWidth:8,tipSize:15,terminalThickness:2});assert.deepEqual(migrateStoredDesign(JSON.parse(JSON.stringify(d))),d);const s=templeSections(d,1);assert.equal(s.tipWidthMM,8);assert.equal(s.tipLengthMM,15);assert.equal(s.terminalThicknessMM,2);});
