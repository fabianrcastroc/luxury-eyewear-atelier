import {Shape,Path,Vector2,Vector3,ExtrudeGeometry,BufferGeometry,Float32BufferAttribute,ShapeUtils} from 'three';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {MM} from './frame-geometry.js';

// Quarter-round edges stay INSIDE the original XY silhouette and exact slab Z.
// A negative bevel offset contracts the face; the side reaches the source path.
export function finishedExtrusion(outer,holes,depth,radius=.65*MM){
 const shape=new Shape(outer.map(p=>new Vector2(...p)));
 for(const hole of holes)shape.holes.push(new Path(hole.map(p=>new Vector2(...p))));
 const bevel=Math.max(.001,Math.min(radius,depth*.24));
 const geometry=new ExtrudeGeometry(shape,{depth:Math.max(.002,depth-2*bevel),bevelEnabled:true,bevelSize:bevel,bevelOffset:-bevel,bevelThickness:bevel,bevelSegments:5,steps:1,curveSegments:24});
 geometry.translate(0,0,bevel);geometry.deleteAttribute('normal');geometry.deleteAttribute('uv');
 const smooth=mergeVertices(geometry,1e-6);geometry.dispose();smooth.computeVertexNormals();const uv=[];for(let i=0;i<smooth.attributes.position.count;i++)uv.push(smooth.attributes.position.getX(i)/(10*MM),smooth.attributes.position.getY(i)/(10*MM));smooth.setAttribute('uv',new Float32BufferAttribute(uv,2));return smooth;
}

const sectionCount=24;
function roundSection(depth,height){
 const half=Math.max(.004,height/2),radius=Math.min(depth,half,.6*MM)*.8,points=[];
 for(const [sx,sy,start] of [[1,1,0],[-1,1,90],[-1,-1,180],[1,-1,270]]){
  for(let k=0;k<6;k++){const angle=(start+k/5*90)*Math.PI/180;points.push([(depth-radius)*sx+radius*Math.cos(angle),(half-radius)*sy+radius*Math.sin(angle)]);}
 }
 return points;
}
export function finishedTemple(rows){
 const positions=[],indices=[],count=rows.length;
 for(let i=0;i<count;i++){
  const row=rows[i],p=new Vector3(...row.point),previous=new Vector3(...rows[Math.max(0,i-1)].point),next=new Vector3(...rows[Math.min(count-1,i+1)].point),tangent=next.sub(previous).normalize();
  const x=new Vector3(1,0,0).addScaledVector(tangent,-tangent.x).normalize(),y=new Vector3().crossVectors(tangent,x).normalize();
  if(y.y<0)y.negate();
  for(const [dx,dy] of roundSection(row.depth,row.height)){const vertex=p.clone().addScaledVector(x,dx).addScaledVector(y,dy);positions.push(...vertex.toArray());}
  if(i<count-1)for(let j=0;j<sectionCount;j++){const a=i*sectionCount+j,b=i*sectionCount+(j+1)%sectionCount,c=(i+1)*sectionCount+j,d=(i+1)*sectionCount+(j+1)%sectionCount;indices.push(a,c,b,b,c,d);}
 }
 const first=roundSection(rows[0].depth,rows[0].height).map(p=>new Vector2(...p)),last=roundSection(rows.at(-1).depth,rows.at(-1).height).map(p=>new Vector2(...p));
 for(const triangle of ShapeUtils.triangulateShape(first,[]))indices.push(...triangle);
 const end=(count-1)*sectionCount;for(const triangle of ShapeUtils.triangulateShape(last,[]))indices.push(...triangle.slice().reverse().map(i=>i+end));
 const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();const uv=[];let travel=0;for(let i=0;i<rows.length;i++){if(i)travel+=Math.hypot(...rows[i].point.map((v,j)=>v-rows[i-1].point[j]));for(let j=0;j<sectionCount;j++)uv.push(travel/(10*MM),j/sectionCount);}geometry.setAttribute('uv',new Float32BufferAttribute(uv,2));geometry.userData={sectionVertexCount:sectionCount,sectionCount:count,continuous:true};return geometry;
}
