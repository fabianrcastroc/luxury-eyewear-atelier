import {CatmullRomCurve3,Vector3} from 'three';
import {MM,templePlan,frameContour} from './frame-geometry.js';
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const length=rows=>rows.slice(1).reduce((sum,row,i)=>sum+distance(row.point,rows[i].point),0);
const ease=(t,a=0,b=1)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x);};
const bounded=(value,min,max,fallback)=>Number.isFinite(Number(value))?Math.max(min,Math.min(max,Number(value))):fallback;
export function templeSections(d,side,style=d.armStyle||'clasico'){
 const plan=templePlan(d,side,style),count=128,frame=frameContour(d,side),top=Math.max(...frame.map(p=>p[1])),bottom=Math.min(...frame.map(p=>p[1]));
 const depth=bounded(d.materialDepth,2,12,6)*MM/2,angle=bounded(d.armBendAngle,0,45,20)*Math.PI/180,tipSize=bounded(d.tipSize,3,12,4)*MM;
 const tipShape=['round','square','triangle','diamond'].includes(d.tipShape)?d.tipShape:'round';
 // Every ear-bend variant preserves developed length and starts at the same stem join.
 const baseline=new CatmullRomCurve3(plan.hookLocal.map(p=>new Vector3(...p)));
 const baselineRows=Array.from({length:count+1},(_,i)=>({point:baseline.getPoint(i/count).toArray()})),hookLength=length(baselineRows);
 const hookRaw=Array.from({length:count+1},(_,i)=>{const t=i/count;return {point:[-side*.18*t*t,-((.4*Math.tan(angle)+.45)*t*t),-t],t};});
 const hookScale=hookLength/length(hookRaw);
 function tipWidth(t){
  if(t<.56)return plan.hookWidth;
  const u=(t-.56)/.44,neck=plan.hookWidth;
  if(tipShape==='square')return neck+(tipSize-neck)*ease(u,0,.45);
  if(tipShape==='triangle')return u<.25?neck+(tipSize-neck)*ease(u,0,.25):Math.max(.008,tipSize*(1-(u-.25)/.75));
  if(tipShape==='diamond')return u<.5?neck+(tipSize-neck)*ease(u,0,.5):Math.max(.008,tipSize*(1-ease(u,.5,1)));
  return u<.45?neck+(tipSize-neck)*ease(u,0,.45):Math.max(.008,tipSize*Math.sqrt(Math.max(0,1-((u-.45)/.55)**2)));
 }
 const hookLocal=hookRaw.map(row=>({...row,point:row.point.map(v=>v*hookScale),height:tipWidth(row.t),depth}));
 const target=Number(plan.nominalLength)*MM-hookLength;if(!(target>0))throw new Error('La patilla no admite el largo solicitado.');
 const origin=plan.stem[0];
 function stemWidth(t){
  const width=plan.shaftWidth,factor=style==='fino'?1-.78*ease(t,.02,.55):style==='escultural'?1-.15*ease(t,.1,.9):style==='sable'?1-.55*ease(t,.1,.9):style==='curvo'?1-.35*Math.sin(Math.PI*t):style==='gancho'?1-.12*ease(t,.15,.85):1-.35*ease(t,.1,.85);
  return width*factor+(plan.hookWidth-width*factor)*ease(t,.82,1);
 }
 function stemAt(scale){
  const curve=new CatmullRomCurve3(plan.stem.map(([x,y,z])=>new Vector3(x,y,origin[2]+(z-origin[2])*scale)));
  return Array.from({length:count+1},(_,i)=>{const t=i/count,point=curve.getPoint(t).toArray(),wanted=stemWidth(t),available=Math.max(.08,2*Math.min(top-point[1],point[1]-bottom));
   const height=Math.min(wanted,available+(wanted-available)*ease(t,0,.08));return {point,height,depth:plan.jointHalfDepth+(depth-plan.jointHalfDepth)*ease(t,0,.1),t};});
 }
 let low=.01,high=2;if(length(stemAt(low))>target)throw new Error('El ancho o la curva de patilla no admite este largo.');while(length(stemAt(high))<target)high*=2;
 for(let i=0;i<36;i++){const mid=(low+high)/2;if(length(stemAt(mid))>target)high=mid;else low=mid;}
 const stem=stemAt((low+high)/2),join=stem.at(-1).point,hook=hookLocal.map(row=>({...row,point:row.point.map((v,i)=>v+join[i])})),rows=[...stem,...hook.slice(1)];
 return {stem,hook,rows,plan,hookLocal,tipShape,tipSize:tipSize/MM,bendAngle:angle*180/Math.PI,bendStart:join.slice(),bendStartLength:length(stem)/MM,developedLength:length(rows)/MM};
}
export function flatTemple(d,side,style=d.armStyle||'clasico'){
 const sections=templeSections(d,side,style),rows=sections.rows;let x=0;const first=rows[0].point;
 const points=rows.map((row,i)=>{if(i){const a=rows[i-1].point,b=row.point;x+=Math.hypot(b[0]-a[0],b[2]-a[2])/MM;}return {x,y:-(row.point[1]-first[1])/MM,width:row.height/MM};});
 const top=[],bottom=[];for(let i=0;i<points.length;i++){const p=points[i],prev=points[Math.max(0,i-1)],next=points[Math.min(points.length-1,i+1)],dx=next.x-prev.x,dy=next.y-prev.y,n=Math.hypot(dx,dy)||1,nx=dy/n*p.width/2,ny=dx/n*p.width/2;top.push([p.x+nx,p.y-ny]);bottom.push([p.x-nx,p.y+ny]);}
 const bend=points[sections.stem.length-1];return {outline:[...top,...bottom.reverse()],centerline:points.map(p=>[p.x,p.y]),developedLength:sections.developedLength,nominalLength:sections.plan.nominalLength,hinge:[0,0],bendStart:[bend.x,bend.y],bendStartLength:sections.bendStartLength,tipShape:sections.tipShape,tipSize:sections.tipSize};
}
