import {Float32BufferAttribute} from 'three';
// Slice all triangles at the same X planes before cylindrical forming. Shared
// edges receive identical intersections; a broad planar cap cannot become one
// large chord across the curved front. Preserve UVs, normals and material groups.
export function refineFormingSurface(geometry,step){
 const attrs=Object.entries(geometry.attributes),position=geometry.attributes.position,index=geometry.index,output=Object.fromEntries(attrs.map(([name])=>[name,[]]));
 const groups=geometry.groups.length?geometry.groups:[{start:0,count:index?.count??position.count,materialIndex:0}],newGroups=[];
 const vertex=i=>attrs.map(([,a])=>Array.from({length:a.itemSize},(_,k)=>a.array[i*a.itemSize+k]));
 const interpolate=(a,b,t)=>a.map((values,j)=>values.map((v,k)=>v+(b[j][k]-v)*t));
 const px=attrs.findIndex(([name])=>name==='position');
 const clip=(poly,x,keepRight)=>{const result=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],av=a[px][0]-x,bv=b[px][0]-x,inside=keepRight?av>=-1e-9:av<=1e-9,next=keepRight?bv>=-1e-9:bv<=1e-9;if(inside)result.push(a);if(inside!==next){const v=interpolate(a,b,av/(av-bv));v[px][0]=x;result.push(v);}}return result;};
 let count=0;
 for(const group of groups){const start=count;
  for(let i=group.start;i<group.start+group.count;i+=3){const triangle=[0,1,2].map(k=>vertex(index?index.getX(i+k):i+k)),xs=triangle.map(v=>v[px][0]),lo=Math.floor(Math.min(...xs)/step),hi=Math.floor(Math.max(...xs)/step);
   for(let strip=lo;strip<=hi;strip++){let poly=clip(triangle,strip*step,true);if(poly.length<3)continue;poly=clip(poly,(strip+1)*step,false);for(let j=1;j<poly.length-1;j++){const vertices=[poly[0],poly[j],poly[j+1]],p=vertices.map(v=>v[px]),a=p[1].map((v,k)=>v-p[0][k]),b=p[2].map((v,k)=>v-p[0][k]);if(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])<1e-10)continue;for(const v of vertices)attrs.forEach(([name],k)=>output[name].push(...v[k]));count+=3;}}
  }
  if(count>start)newGroups.push({start,count:count-start,materialIndex:group.materialIndex});
 }
 geometry.setIndex(null);for(const [name,attr]of attrs)geometry.setAttribute(name,new Float32BufferAttribute(output[name],attr.itemSize));geometry.clearGroups();for(const g of newGroups)geometry.addGroup(g.start,g.count,g.materialIndex);return geometry;
}
