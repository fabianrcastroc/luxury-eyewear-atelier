import {Shape,Path,Vector2,ExtrudeGeometry} from 'three';
import {normalizeDesign} from './designer-model.js';
import {frontCutGeometry} from './manufacturing.js';
import {nasalPads,MM} from './frame-geometry.js';
import {templeSections} from './temple-development.js';
import {finishedTemple,finishedNasalLaminate} from './finished-geometry.js';

export const stlParts=['front','temple-left','temple-right','pad-left','pad-right'];

// Separate material parts, in millimetres. Hardware and illustrative optical
// surfaces are deliberately excluded from the printable solids.
export function manufacturingSTL(raw,part='front'){
 const d=normalizeDesign(raw);let geometry;
 if(part==='front'){
  const cut=frontCutGeometry(d),shape=new Shape(cut.outerLoops[0].map(p=>new Vector2(...p)));
  for(const hole of cut.holes)shape.holes.push(new Path(hole.map(p=>new Vector2(...p))));
  geometry=new ExtrudeGeometry(shape,{depth:d.materialDepth,bevelEnabled:false,steps:1});
 }else if(stlParts.includes(part)){
  const side=part.endsWith('left')?-1:1;
  geometry=part.startsWith('temple')?finishedTemple(templeSections(d,side).rows):finishedNasalLaminate(nasalPads(d,side).outline,3*MM);
  geometry.scale(1/MM,1/MM,1/MM);
 }else throw new Error('Selecciona frontal, brazo o luneta nasal para exportar STL.');
 try{return encodeClosedSTL(geometry,`${d.jobName||'Diseño 1'} / ${part}`);}finally{geometry.dispose();}
}

export function encodeClosedSTL(geometry,label){
 const p=geometry.attributes.position,index=geometry.index,triangles=[],edges=new Map();
 const point=i=>[p.getX(i),p.getY(i),p.getZ(i)],key=v=>v.map(x=>Math.round(x*10000)).join(',');
 let volume=0;
 for(let i=0;i<(index?.count??p.count);i+=3){
  const v=[0,1,2].map(j=>point(index?index.getX(i+j):i+j)),keys=v.map(key);
  if(new Set(keys).size<3)continue;
  const [a,b,c]=v,u=b.map((x,k)=>x-a[k]),w=c.map((x,k)=>x-a[k]),n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]],length=Math.hypot(...n);
  if(!Number.isFinite(length)||length<1e-10)continue;
  for(let j=0;j<3;j++){
   const x=keys[j],y=keys[(j+1)%3],edge=x<y?x+'|'+y:y+'|'+x,entry=edges.get(edge)||{count:0,balance:0};
   entry.count++;entry.balance+=x<y?1:-1;edges.set(edge,entry);
  }
  volume+=(a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6;
  triangles.push({v,n:n.map(x=>x/length)});
 }
 if(!triangles.length||Math.abs(volume)<1e-6||[...edges.values()].some(e=>e.count!==2||e.balance!==0))throw new Error('La pieza contiene una malla abierta o aristas incoherentes. No se exportó STL.');
 const bytes=new ArrayBuffer(84+triangles.length*50),view=new DataView(bytes),header=new TextEncoder().encode('FR eyewear studio | mm | '+label);
 new Uint8Array(bytes,0,80).set(header.subarray(0,80));view.setUint32(80,triangles.length,true);
 triangles.forEach(({v,n},i)=>{
  if(volume<0){v=[v[0],v[2],v[1]];n=n.map(x=>-x);}
  const values=[...n,...v.flat()];values.forEach((x,j)=>view.setFloat32(84+i*50+j*4,x,true));
 });
 return {buffer:bytes,triangles:triangles.length,volumeMM3:Math.abs(volume),unit:'mm',closed:true};
}
