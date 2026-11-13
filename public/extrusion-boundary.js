// Remove sub-resolution duplicate and collinear union vertices before Three.js
// computes bevel vectors. A micron-long edge can otherwise produce a bevel
// spanning the entire optical aperture. This is shared by preview and STL.
export function extrusionBoundary(points,tolerance=.00002){
 const out=points.map(p=>p.slice());let changed=true;
 while(changed&&out.length>3){changed=false;for(let i=0;i<out.length;i++){
  const a=out[(i+out.length-1)%out.length],b=out[i],c=out[(i+1)%out.length],dx=c[0]-a[0],dy=c[1]-a[1],length=Math.hypot(dx,dy),between=(b[0]-a[0])*(b[0]-c[0])+(b[1]-a[1])*(b[1]-c[1])<=0;
  if(Math.hypot(b[0]-a[0],b[1]-a[1])<tolerance||(between&&length&&Math.abs(dx*(b[1]-a[1])-dy*(b[0]-a[0]))/length<tolerance)){out.splice(i,1);changed=true;break;}
 }}return out;
}
