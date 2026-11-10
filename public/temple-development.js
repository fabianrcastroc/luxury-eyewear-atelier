import {MM,templePlan,frameContour} from './frame-geometry.js';
const bounded=(value,min,max,fallback)=>Number.isFinite(Number(value))?Math.max(min,Math.min(max,Number(value))):fallback;
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const arcLength=rows=>rows.slice(1).reduce((sum,row,i)=>sum+distance(row.point,rows[i].point),0);
// Quintic transitions have zero first and second derivatives at each end.
const smooth=(value,a=0,b=1)=>{const t=bounded((value-a)/(b-a),0,1,0);return t*t*t*(10+t*(-15+6*t));};
const bump=t=>64*t*t*t*(1-t)*(1-t)*(1-t);
const STYLE={
 clasico:{lateral:.45,vertical:0,neck:.5,profile:t=>1-.62*smooth(t,.12,1)},
 fino:{lateral:.3,vertical:0,neck:.46,profile:t=>1-.8*smooth(t,.04,.72)},
 escultural:{lateral:.65,vertical:.35,neck:.55,profile:t=>1-.6*smooth(t,.48,1)},
 sable:{lateral:.75,vertical:.1,neck:.5,profile:t=>1-.62*smooth(t,0,1)},
 curvo:{lateral:.8,vertical:.9,neck:.5,profile:t=>(.8+.2*Math.cos(Math.PI*2*t))*(1-.5*smooth(t,.7,1))},
 gancho:{lateral:.55,vertical:-.45,neck:.52,profile:t=>1-.62*smooth(t,.67,1)}
};

/** A common developed axis, with a fixed 32 mm ear section. `tipSize` is the
 * actual distal terminal length in mm, never an oversized knob's width. */
export function templeSections(d,side,style=d.armStyle||'clasico'){
 const plan=templePlan(d,side,style),spec=STYLE[style]||STYLE.clasico,frame=frameContour(d,side);
 const top=Math.max(...frame.map(p=>p[1])),bottom=Math.min(...frame.map(p=>p[1]));
 const stock=bounded(d.materialDepth,2,12,6),depth=stock*MM/2,terminalThickness=Math.min(stock,2.8);
 const bendAngle=bounded(d.armBendAngle,0,65,45),angle=bendAngle*Math.PI/180;
 const tipLength=bounded(d.tipSize,3,12,10),tipShape=['round','square','triangle','diamond'].includes(d.tipShape)?d.tipShape:'round';
 const total=bounded(plan.nominalLength,120,160,140),earLength=32*MM,target=(total-32)*MM,count=128;
 const neckWidth=bounded(plan.shaftWidth/MM*spec.neck,2.6,4.2,3.2)*MM;
 const tipWidth=bounded(neckWidth/MM*(tipShape==='diamond'?1.4:tipShape==='triangle'?1.3:1.2),3.2,5.8,4)*MM;
 const joint=plan.stem[0].slice(),jointDepth=Math.min(depth,plan.jointHalfDepth??depth);
 const hingeHeight=Math.max(.08,2*Math.min(top-joint[1],joint[1]-bottom));
 function shaftWidth(t){
  const candidate=Math.max(neckWidth,plan.shaftWidth*spec.profile(t)),shaped=candidate+(neckWidth-candidate)*smooth(t,.8,1);
  return Math.min(shaped,hingeHeight+(shaped-hingeHeight)*smooth(t,0,.12));
 }
 function stemAt(travel){return Array.from({length:count+1},(_,i)=>{
  const t=i/count,offset=bump(t),point=[joint[0]+side*spec.lateral*MM*offset,joint[1]+spec.vertical*MM*offset,joint[2]-travel*t];
  return {point,height:shaftWidth(t),depth:jointDepth+(depth-jointDepth)*smooth(t,0,.12),t};
 });}
 let low=.1*MM,high=target;
 if(arcLength(stemAt(low))>=target)throw new Error('El perfil del brazo no admite el largo B solicitado.');
 for(let i=0;i<40;i++){const middle=(low+high)/2;if(arcLength(stemAt(middle))>target)high=middle;else low=middle;}
 const stem=stemAt((low+high)/2),join=stem.at(-1).point;
 // Integrating a unit tangent creates a measurable final angle and a smooth
 // zero-curvature join, rather than rescaling an arbitrary hook parabola.
 const hookRaw=[{point:[0,0,0],t:0}];
 for(let i=1;i<=count;i++){
  const t=(i-.5)/count,theta=angle*smooth(t),wrap=2*Math.PI/180*smooth(t),step=earLength/count,previous=hookRaw.at(-1).point;
  hookRaw.push({point:[previous[0]-side*Math.sin(wrap)*Math.cos(theta)*step,previous[1]-Math.sin(theta)*step,previous[2]-Math.cos(wrap)*Math.cos(theta)*step],t:i/count});
 }
 const correction=earLength/arcLength(hookRaw);
 function terminalWidth(t){
  const start=1-tipLength/32;if(t<=start)return neckWidth;
  const u=bounded((t-start)/(1-start),0,1,0),end=.12*MM;
  if(tipShape==='square')return neckWidth+(tipWidth-neckWidth)*smooth(u,.02,.5);
  if(tipShape==='diamond')return u<=.45?neckWidth+(tipWidth-neckWidth)*smooth(u,0,.45):end+(tipWidth-end)*(1-smooth(u,.45,1));
  if(tipShape==='triangle')return u<=.18?neckWidth+(tipWidth-neckWidth)*smooth(u,0,.18):end+(tipWidth-end)*(1-(u-.18)/.82);
  if(u<=.55)return neckWidth+(tipWidth-neckWidth)*smooth(u,0,.55);
  const v=(u-.55)/.45;return Math.max(end,tipWidth*Math.sqrt(Math.max(0,1-v*v)));
 }
 const hookLocal=hookRaw.map(row=>({...row,point:row.point.map(v=>v*correction),height:terminalWidth(row.t),depth:depth+(terminalThickness*MM/2-depth)*smooth(row.t,.3,.85)}));
 const hook=hookLocal.map(row=>({...row,point:row.point.map((value,i)=>value+join[i])})),rows=[...stem,...hook.slice(1)];
 return {stem,hook,rows,plan,hookLocal,tipShape,tipSize:tipLength,tipLengthMM:tipLength,tipWidthMM:tipWidth/MM,terminalThicknessMM:terminalThickness,machining:{hingeSeatThicknessMM:jointDepth*2/MM,terminalThicknessMM:terminalThickness},bendAngle,bendMetric:'tangent-degrees',bendStart:join.slice(),bendStartLength:arcLength(stem)/MM,earLengthMM:32,developedLength:arcLength(rows)/MM};
}

/** Develop X/Z wrap while retaining the actual Y profile and every arc step. */
export function flatTemple(d,side,style=d.armStyle||'clasico'){
 const sections=templeSections(d,side,style),rows=sections.rows;let x=0;const first=rows[0].point;
 const points=rows.map((row,i)=>{if(i){const a=rows[i-1].point,b=row.point;x+=Math.hypot(b[0]-a[0],b[2]-a[2])/MM;}return {x,y:-(row.point[1]-first[1])/MM,width:row.height/MM};});
 const upper=[],lower=[];
 for(let i=0;i<points.length;i++){
  const p=points[i],a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy)||1;
  const nx=dy/n*p.width/2,ny=dx/n*p.width/2;upper.push([p.x+nx,p.y-ny]);lower.push([p.x-nx,p.y+ny]);
 }
 const bend=points[sections.stem.length-1];
 return {outline:[...upper,...lower.reverse()],centerline:points.map(p=>[p.x,p.y]),developedLength:sections.developedLength,nominalLength:sections.plan.nominalLength,hinge:[0,0],bendStart:[bend.x,bend.y],bendStartLength:sections.bendStartLength,tipShape:sections.tipShape,tipSize:sections.tipSize,tipLengthMM:sections.tipLengthMM,tipWidthMM:sections.tipWidthMM,terminalThicknessMM:sections.terminalThicknessMM,machining:sections.machining,bendMetric:sections.bendMetric};
}
