import {BufferGeometry,Float32BufferAttribute,ShapeUtils,Vector2} from 'three';
import {offsetRegion,polygonArea} from './planar-kernel.js';
import {extrusionBoundary} from './extrusion-boundary.js';
// Loft exact planar material offsets. Caps and walls share the same boundary;
// unlike moving an already triangulated cap, no triangle can cover a lens hole.
export function polishedExtrusion(outer,holes,depth,radius,tolerance){
 const orient=(p,positive)=>{const q=extrusionBoundary(p,tolerance);return (polygonArea(q)>0)===positive?q:q.reverse();};
 const original=[orient(outer,true),...holes.map(h=>orient(h,false))],positions=[],add=(a,b,c)=>positions.push(...a,...b,...c);
 const center=poly=>poly.reduce((a,p)=>a.map((v,k)=>v+p[k]/poly.length),[0,0]);
 function contours(margin){if(margin<1e-10)return original.map(p=>p.map(v=>v.slice()));const loops=offsetRegion(original,-margin),exterior=loops.filter(p=>polygonArea(p)>0),voids=loops.filter(p=>polygonArea(p)<0);if(exterior.length!==1||voids.length!==holes.length)throw new Error('El radio de acabado elimina material de una unión.');const result=[orient(exterior[0],true)];for(const h of original.slice(1)){const c=center(h);let best=0;for(let j=1;j<voids.length;j++)if(Math.hypot(...center(voids[j]).map((v,k)=>v-c[k]))<Math.hypot(...center(voids[best]).map((v,k)=>v-c[k])))best=j;result.push(orient(voids.splice(best,1)[0],false));}return result;}
 let rings,r=Math.max(0,Math.min(radius,depth*.24));for(let attempt=0;attempt<8;attempt++){try{rings=[];for(let i=0;i<=5;i++){const t=i/5*Math.PI/2;rings.push({z:r*(1-Math.cos(t)),loops:contours(r*(1-Math.sin(t)))});}rings.push({z:depth-r,loops:contours(0)});for(let i=4;i>=0;i--){const t=i/5*Math.PI/2;rings.push({z:depth-r*(1-Math.cos(t)),loops:contours(r*(1-Math.sin(t)))});}break;}catch(error){if(attempt===7)throw error;r*=.5;}}
 const path=(poly,reference)=>{let at=0;for(let i=1;i<poly.length;i++)if(Math.hypot(...poly[i].map((v,k)=>v-reference[k]))<Math.hypot(...poly[at].map((v,k)=>v-reference[k])))at=i;return [...poly.slice(at),...poly.slice(0,at)];};
 for(let k=1;k<rings.length;k++)for(let h=0;h<original.length;h++)rings[k].loops[h]=path(rings[k].loops[h],rings[k-1].loops[h][0]);
 function cap(ring,top){const loops=ring.loops,flat=loops.flat();for(const ids of ShapeUtils.triangulateShape(loops[0].map(p=>new Vector2(...p)),loops.slice(1).map(h=>h.map(p=>new Vector2(...p))))){const ps=ids.map(i=>[...flat[i],ring.z]),a=ps[0],b=ps[1],c=ps[2],positive=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])>0;if(positive!==top)ps.reverse();add(...ps);}}
 cap(rings[0],false);cap(rings.at(-1),true);const capCount=positions.length/3;
 const stations=p=>{const s=[0];for(let i=0;i<p.length;i++)s.push(s.at(-1)+Math.hypot(...p[(i+1)%p.length].map((v,k)=>v-p[i][k])));return s.map(v=>v/s.at(-1));};
 for(let k=0;k<rings.length-1;k++)for(let h=0;h<original.length;h++){
  const a=rings[k].loops[h],b=rings[k+1].loops[h],sa=stations(a),sb=stations(b),pa=i=>[...a[i%a.length],rings[k].z],pb=j=>[...b[j%b.length],rings[k+1].z];let i=0,j=0;
  while(i<a.length||j<b.length){if(i<a.length&&(j===b.length||sa[i+1]<=sb[j+1])){add(pa(i),pa(i+1),pb(j));i++;}else{add(pa(i),pb(j+1),pb(j));j++;}}
 }
 const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.addGroup(0,capCount,0);geometry.addGroup(capCount,positions.length/3-capCount,1);geometry.userData.edgeRadius=r;return geometry;
}
