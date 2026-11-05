// Shared, deterministic geometry for the 3D product and its simplified fallback.
export function frameDimensions(d){
 return d.model==='rectangular'?{rx:1.02,ry:.51}:d.model==='wayfarer'?{rx:.98,ry:.66}:d.model==='panto'?{rx:.82,ry:.74}:d.model==='aviador'?{rx:.87,ry:.76}:d.model==='cat-eye'?{rx:.94,ry:.59}:{rx:.9,ry:.63};
}
export function frameContour(d,side,scale=1){
 const {rx,ry}=frameDimensions(d),n=d.model==='rectangular'?14-d.rounding*.11:2+(100-d.rounding)*.045,points=[];
 for(let i=0;i<128;i++){
  const t=i/128*Math.PI*2,c=Math.cos(t),s=Math.sin(t);
  let x=Math.sign(c)*Math.abs(c)**(2/n)*rx,y=Math.sign(s)*Math.abs(s)**(2/n)*ry;
  if(d.model==='wayfarer'){x*=.86+.14*(y/ry+1)/2;y+=Math.max(0,x*side)*.06;}
  if(d.model==='cat-eye'){y+=Math.max(0,x*side)*.35*(s>0?1:.2);x*=.95+.05*(s+1)/2;}
  if(d.model==='aviador'){const lower=Math.max(0,-s);x*=1-lower*.25;y-=lower*.1;}
  points.push([x*scale,y*scale]);
 }return points;
}
