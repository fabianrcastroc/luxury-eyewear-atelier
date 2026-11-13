import {Mesh,MeshBasicMaterial,DoubleSide,Raycaster,Vector3} from 'three';
import {frameProfiles,normalizeDesign} from '../public/designer-model.js';import {frontCutGeometry} from '../public/manufacturing.js';import {finishedExtrusion} from '../public/finished-geometry.js';import {MM} from '../public/frame-geometry.js';
let failed=0,valid=0,rejected=0;const cases=[];
for(const p of frameProfiles)for(const bridgeType of ['clasico','herradura','doble'])for(const bridgeDip of [0,6])for(const bridgeGauge of [2,6]){
 const d=normalizeDesign({...p.defaults,model:p.id,bridgeType,bridgeDip,bridgeGauge,bridgeOffset:-2});let cut;try{cut=frontCutGeometry(d);}catch{rejected++;continue;}valid++;
 const g=finishedExtrusion(cut.outerLoops[0].map(p=>p.map(v=>v*MM)),cut.holes.map(h=>h.map(p=>p.map(v=>v*MM))),d.materialDepth*MM,Math.min(.8,d.thickness*.22)*MM),mesh=new Mesh(g,new MeshBasicMaterial({side:DoubleSide}));mesh.updateMatrixWorld();const ray=new Raycaster();let blocked=0;
 for(const h of cut.apertures){const center=h.reduce((a,p)=>a.map((v,k)=>v+p[k]/h.length),[0,0]);for(let i=0;i<h.length;i+=8){const p=h[i].map((v,k)=>(.7*v+.3*center[k])*MM);ray.set(new Vector3(...p,10),new Vector3(0,0,-1));if(ray.intersectObject(mesh).length)blocked++;}}
 if(blocked){failed++;cases.push({model:p.id,bridgeType,bridgeDip,bridgeGauge,blocked});}g.dispose();mesh.material.dispose();
}
console.log(JSON.stringify({valid,rejected,failed,cases},null,2));if(failed)process.exitCode=1;
