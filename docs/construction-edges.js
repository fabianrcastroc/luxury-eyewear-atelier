import {BufferGeometry,Float32BufferAttribute,EdgesGeometry} from 'three';
// Boundaries of the planar extrusion caps only. Interior triangulation edges
// appear twice and are discarded before any forming transform is applied.
export function constructionEdges(geometry){
 const depth=geometry.userData.capDepth;
 if(!Number.isFinite(depth)){const edges=new EdgesGeometry(geometry,28);edges.userData.linear=true;return edges;}
 const p=geometry.attributes.position,index=geometry.index,edges=new Map(),point=i=>[p.getX(i),p.getY(i),p.getZ(i)],key=v=>v.map(x=>Math.round(x*1e7)).join(',');
 for(let i=0;i<(index?.count??p.count);i+=3){const vertices=[0,1,2].map(k=>point(index?index.getX(i+k):i+k));if(![0,depth].some(z=>vertices.every(v=>Math.abs(v[2]-z)<1e-6)))continue;
  for(let j=0;j<3;j++){const a=vertices[j],b=vertices[(j+1)%3],ka=key(a),kb=key(b);if(ka===kb)continue;const id=ka<kb?ka+'|'+kb:kb+'|'+ka,edge=edges.get(id)||{a,b,count:0};edge.count++;edges.set(id,edge);}
 }
 const positions=[...edges.values()].filter(e=>e.count===1).flatMap(e=>[...e.a,...e.b]),result=new BufferGeometry();result.setAttribute('position',new Float32BufferAttribute(positions,3));result.userData.linear=true;return result;
}
