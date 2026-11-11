import {refineFormingSurface} from './forming-refinement.js';
import {designMeasurements,hingeGeometry,MM} from './frame-geometry.js';
// Cylindrical forming of the flat blank. Thickness follows the surface normal;
// printed patterns retain developed XY coordinates. Angles are per half-front.
export function formingParameters(design){const angle=Math.max(0,Math.min(20,Number(design.frontWrap)||0))*Math.PI/180,half=designMeasurements(design).front/2;return {angle,radius:angle?half/angle:Infinity,half};}
export function formPoint(point,parameters){
 const [x,y,z]=point,{radius}=parameters;if(!Number.isFinite(radius))return point.slice();const angle=x/radius;return [(radius+z)*Math.sin(angle),y,-radius*(1-Math.cos(angle))+z*Math.cos(angle)];
}
export function formGeometry(geometry,design,part,position=[0,0,0],unitsPerMM=MM,parameters=formingParameters(design)){
 if(!parameters.angle)return geometry;
 const rigid=/temple|hinge|pin/.test(part);if(!rigid&&!geometry.userData.linear)refineFormingSurface(geometry,2*unitsPerMM);
 const p=geometry.attributes.position,n=geometry.attributes.normal,side=part.endsWith('--1')||part.endsWith('left')?-1:1,anchor=hingeGeometry(design,side).anchor.map(v=>v/MM),formedAnchor=formPoint(anchor,parameters),theta=anchor[0]/parameters.radius;
 for(let i=0;i<p.count;i++){
  const global=[p.getX(i),p.getY(i),p.getZ(i)].map((v,k)=>(v+position[k])/unitsPerMM);let formed;
  if(rigid){const [dx,dy,dz]=global.map((v,k)=>v-anchor[k]);formed=[formedAnchor[0]+Math.cos(theta)*dx+Math.sin(theta)*dz,formedAnchor[1]+dy,formedAnchor[2]-Math.sin(theta)*dx+Math.cos(theta)*dz];}
  else formed=formPoint(global,parameters);
  p.setXYZ(i,...formed.map(v=>v*unitsPerMM));
  if(n){const angle=rigid?theta:global[0]/parameters.radius,scale=rigid?1:1+global[2]/parameters.radius,nx=n.getX(i)/scale,ny=n.getY(i),nz=n.getZ(i),length=Math.hypot(nx,ny,nz);n.setXYZ(i,(Math.cos(angle)*nx+Math.sin(angle)*nz)/length,ny/length,(-Math.sin(angle)*nx+Math.cos(angle)*nz)/length);}
 }
 p.needsUpdate=true;if(n)n.needsUpdate=true;geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
}
