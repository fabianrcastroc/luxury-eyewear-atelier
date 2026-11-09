import {CatmullRomCurve3,Vector3} from 'three';
import {MM,templePlan,frameContour} from './frame-geometry.js';

const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const length=rows=>rows.slice(1).reduce((sum,row,i)=>sum+distance(row.point,rows[i].point),0);
const smooth=(t,style)=>{const start=style==='fino'?.04:.18,end=style==='fino'?.72:1,x=Math.max(0,Math.min(1,(t-start)/(end-start)));return x*x*(3-2*x);};

// Shared finite-section manufacturing geometry. The 3D mesh and flat pattern
// must consume these exact sections, rather than two unrelated approximations.
export function templeSections(d,side,style=d.armStyle||'clasico'){
 const plan=templePlan(d,side,style),count=128,frame=frameContour(d,1),top=Math.max(...frame.map(p=>p[1])),bottom=Math.min(...frame.map(p=>p[1])),depth=Number(d.materialDepth??6)*MM/2;
 const hookCurve=new CatmullRomCurve3(plan.hookLocal.map(p=>new Vector3(...p)));
 const hookLocal=Array.from({length:count+1},(_,i)=>({point:hookCurve.getPoint(i/count).toArray(),height:plan.hookWidth,depth,t:i/count}));
 const hookLength=length(hookLocal),target=Number(plan.nominalLength)*MM-hookLength;
 if(!(target>0))throw new Error('La patilla no admite el largo solicitado.');
 function stemAt(scale){
  const curve=new CatmullRomCurve3(plan.stem.map(([x,y,z])=>new Vector3(x,y,z*scale)));
  return Array.from({length:count+1},(_,i)=>{
   const t=i/count,point=curve.getPoint(t).toArray(),height=plan.shaftWidth+(plan.hookWidth-plan.shaftWidth)*smooth(t,style);
   const h=Math.min(height,top-bottom);point[1]=Math.max(bottom+h/2,Math.min(top-h/2,point[1]));
   return {point,height,depth,t};
  });
 }
 let low=.01,high=2;
 if(length(stemAt(low))>target)throw new Error('El ancho o la curva de patilla no admite este largo.');
 while(length(stemAt(high))<target)high*=2;
 for(let i=0;i<32;i++){const mid=(low+high)/2;if(length(stemAt(mid))>target)high=mid;else low=mid;}
 const stem=stemAt((low+high)/2),join=stem.at(-1).point;
 const hook=hookLocal.map(row=>({...row,point:row.point.map((v,i)=>v+join[i])}));
 return {stem,hook,plan,developedLength:(length(stem)+length(hook))/MM};
}

// Develop lateral displacement into horizontal travel, preserving the hook's
// vertical profile and the length of every centreline segment.
export function flatTemple(d,side,style=d.armStyle||'clasico'){
 const sections=templeSections(d,side,style),rows=[...sections.stem,...sections.hook.slice(1)];
 let x=0;const first=rows[0].point;
 const points=rows.map((row,i)=>{
  if(i){const a=rows[i-1].point,b=row.point;x+=Math.hypot(b[0]-a[0],b[2]-a[2])/MM;}
  return {x,y:-(row.point[1]-first[1])/MM,width:row.height/MM,t:row.t};
 });
 const top=points.map(p=>[p.x,p.y-p.width/2]),bottom=points.map(p=>[p.x,p.y+p.width/2]);
 return {outline:[...top,...bottom.reverse()],centerline:points.map(p=>[p.x,p.y]),developedLength:sections.developedLength,nominalLength:sections.plan.nominalLength,hinge:[0,0]};
}
