import {Shape,Path,Vector2,Vector3,ExtrudeGeometry,BufferGeometry,Float32BufferAttribute,ShapeUtils,BoxGeometry,CylinderGeometry,SphereGeometry} from 'three';
import {mergeVertices,mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {MM} from './frame-geometry.js';

// Quarter-round edges stay INSIDE the original XY silhouette and exact slab Z.
// A negative bevel offset contracts the face; the side reaches the source path.
export function finishedExtrusion(outer,holes,depth,radius=.65*MM){
 const shape=new Shape(outer.map(p=>new Vector2(...p)));
 for(const hole of holes)shape.holes.push(new Path(hole.map(p=>new Vector2(...p))));
 const bevel=Math.max(.001,Math.min(radius,depth*.24));
 const geometry=new ExtrudeGeometry(shape,{depth:Math.max(.002,depth-2*bevel),bevelEnabled:true,bevelSize:bevel,bevelOffset:-bevel,bevelThickness:bevel,bevelSegments:5,steps:1,curveSegments:24});
 geometry.translate(0,0,bevel);geometry.deleteAttribute('normal');geometry.deleteAttribute('uv');
 const smooth=mergeVertices(geometry,1e-6);geometry.dispose();smooth.computeVertexNormals();
 // Welding the cap to its rounded edge must not average bevel normals across
 // the planar face. Unequal cap triangles otherwise produce broad, artificial
 // bands on a flat lens or acetate slab. At the tangent of a quarter round,
 // the exact surface normal is also the cap's +/-Z normal.
 const position=smooth.attributes.position,normal=smooth.attributes.normal;
 for(let i=0;i<position.count;i++){const z=position.getZ(i);if(Math.abs(z)<1e-7)normal.setXYZ(i,0,0,-1);else if(Math.abs(z-depth)<1e-7)normal.setXYZ(i,0,0,1);}
 normal.needsUpdate=true;const uv=[];for(let i=0;i<position.count;i++)uv.push(position.getX(i)/(10*MM),position.getY(i)/(10*MM));smooth.setAttribute('uv',new Float32BufferAttribute(uv,2));smooth.userData.capDepth=depth;return smooth;
}

/** A bonded laminate is polished towards its ends, not a uniform vertical fin.
 * The adhesive face remains the complete, planar source footprint. The opposite
 * face reaches the declared maximum added thickness, and tapers at both ends.
 * Return 0..depth, like the other solids; the caller places its bond face at z=0.
 */
export function finishedNasalLaminate(outer,depth){
 const ys=[...new Set(outer.map(p=>p[1]))].sort((a,b)=>b-a),top=ys[0],height=top-ys.at(-1),columns=12,positions=[],indices=[];
 const rows=ys.map(y=>{const crossings=[];for(let i=0;i<outer.length;i++){const a=outer[i],b=outer[(i+1)%outer.length];if((a[1]<=y&&b[1]>=y)||(b[1]<=y&&a[1]>=y)){if(Math.abs(b[1]-a[1])>1e-10)crossings.push(a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]));else crossings.push(a[0],b[0]);}}return {y,left:Math.min(...crossings),right:Math.max(...crossings)};});
 if(height<=0||rows.some(row=>!Number.isFinite(row.left+row.right)))throw new Error('El laminado nasal no define una media luna continua.');
 const stride=columns+1,count=rows.length*stride;
 // A regular patch gives the polished rear face enough interior vertices to
 // follow its dome smoothly. Deforming a triangulated flat cap instead produced
 // long, visibly faceted triangles around the nasal crescent.
 for(const face of [0,1])for(let r=0;r<rows.length;r++){
  const row=rows[r],t=(top-row.y)/height;
  for(let c=0;c<=columns;c++){
   const u=c/columns,weight=.22+.78*Math.pow(Math.sin(Math.PI*t)*Math.sin(Math.PI*u),1.25);
   positions.push(row.left+(row.right-row.left)*u,row.y,face?depth:depth*(1-weight));
  }
 }
 for(let r=0;r<rows.length-1;r++)for(let c=0;c<columns;c++){
  const a=r*stride+c,b=a+1,k=a+stride,d=k+1;
  indices.push(a,b,k,b,d,k);indices.push(count+a,count+k,count+b,count+b,count+k,count+d);
 }
 for(let r=0;r<rows.length-1;r++)for(const c of [0,columns]){
  const a=r*stride+c,b=a+stride;
  if(c===0)indices.push(a,b,count+a,b,count+b,count+a);else indices.push(a,count+a,b,b,count+a,count+b);
 }
 const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setIndex(indices);
 // Shared end points of the crescent are welded before normal generation.
 const smooth=mergeVertices(geometry,1e-7),clean=[];geometry.dispose();
 for(let i=0;i<smooth.index.count;i+=3){const ids=[0,1,2].map(j=>smooth.index.getX(i+j));if(new Set(ids).size===3)clean.push(...ids);}
 smooth.setIndex(clean);smooth.computeVertexNormals();const uv=[];for(let i=0;i<smooth.attributes.position.count;i++)uv.push(smooth.attributes.position.getX(i)/(10*MM),smooth.attributes.position.getY(i)/(10*MM));smooth.setAttribute('uv',new Float32BufferAttribute(uv,2));smooth.computeBoundingBox();smooth.userData={bondFace:'z-max',maximumAddedThicknessMM:depth/MM,finish:'polished-domed-laminate'};return smooth;
}

/** Thin, closed lens blank with a finished edge. This is an illustrative lens,
 * not a prescription surface or a claimed commercial replacement contour. */
export function finishedLens(outer,thickness){
 const geometry=finishedExtrusion(outer,[],thickness,Math.min(.12*MM,thickness*.18));
 geometry.userData={...geometry.userData,closedLensBlank:true,nominalThicknessMM:thickness/MM,opticalPrescription:false};return geometry;
}

function compound(parts){
 const flat=parts.map(geometry=>geometry.index?geometry.toNonIndexed():geometry),result=mergeGeometries(flat,false);
 for(const geometry of new Set([...parts,...flat]))geometry.dispose();
 result.computeBoundingBox();return result;
}

/** Three knuckles, two embedded leaves and a screw head, constrained within the
 * existing illustrative hinge envelope. No drill centres are manufacturing data.
 * Coordinates are local to hinge.hardware.center and dimensions remain metric.
 */
export function finishedHinge(size){
 const [w,h,d]=size,parts=[];
 for(const sign of [-1,1]){
  const leaf=new BoxGeometry(w*.39,h*.84,d*.2);leaf.translate(sign*w*.27,0,sign*d*.22);parts.push(leaf);
 }
 const radius=Math.min(w*.22,d*.24),knuckle=h*.29;
 for(let i=-1;i<=1;i++){const barrel=new CylinderGeometry(radius,radius,knuckle,24,1);barrel.translate(0,i*h*.31,0);parts.push(barrel);}
 const screw=new CylinderGeometry(radius*.72,radius*.72,h*.055,24,1);screw.translate(0,h*.46,0);parts.push(screw);
 const geometry=compound(parts);geometry.userData={construction:'three-knuckle-two-leaf-hinge',illustrative:true,envelopeMM:size.map(v=>v/MM)};return geometry;
}

/** Two shallow rivet heads instead of a single floating spherical marker. */
export function finishedRivetPair(spacing=1.45*MM,radius=.38*MM){
 const parts=[];
 for(const sign of [-1,1]){const head=new SphereGeometry(radius,20,12);head.scale(1,1,.19);head.translate(0,sign*spacing/2,0);parts.push(head);}
 const geometry=compound(parts);geometry.userData={construction:'paired-flush-rivets',illustrative:true};return geometry;
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
