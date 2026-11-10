import test from 'node:test';
import assert from 'node:assert/strict';
import {templeSections,flatTemple} from '../public/temple-development.js';
import {finishedTemple} from '../public/finished-geometry.js';
import {normalizeDesign,defaultDesign,armStyles} from '../public/designer-model.js';
import {isSimpleContour} from '../public/planar-kernel.js';
import {MM} from '../public/frame-geometry.js';

const close=(actual,expected,tolerance=1e-6)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} versus ${expected}`);
const axisLength=points=>points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(...p.map((v,j)=>v-points[i][j])),0);

test('B and the bend station are true lengths, invariant under terminal, width, angle and style edits',()=>{
 for(const B of [120,140,160])for(const style of armStyles)for(const angle of [0,45,65]){
  const base={...defaultDesign,templeLength:B,armStyle:style.id,armBendAngle:angle,tipSize:10};
  const a=templeSections(base,1),wide=templeSections({...base,armWidth:18,tipShape:'diamond',tipSize:12},1);
  close(a.developedLength,B);close(wide.developedLength,B);close(a.bendStartLength,B-32);close(wide.bendStartLength,B-32);
  assert.deepEqual(a.bendStart,wide.bendStart);assert.deepEqual(a.stem.map(row=>row.point),wide.stem.map(row=>row.point));
  const end=a.hook.at(-1).point,before=a.hook.at(-2).point,dx=end[0]-before[0],dy=end[1]-before[1],dz=end[2]-before[2];
  close(Math.atan2(-dy,Math.hypot(dx,dz))*180/Math.PI,angle,.001);
 }
});

test('the shank and ear section share a continuous tangent without a bent wedge at the join',()=>{
 for(const style of armStyles)for(const armBendAngle of [0,45,65]){
  const sections=templeSections({...defaultDesign,armStyle:style.id,armBendAngle},1),a=sections.stem.at(-2).point,b=sections.stem.at(-1).point,c=sections.hook[1].point;
  const v=b.map((n,i)=>n-a[i]),w=c.map((n,i)=>n-b[i]),dot=v.reduce((sum,n,i)=>sum+n*w[i],0)/Math.hypot(...v)/Math.hypot(...w);
  assert.ok(dot>.999999,`join tangent for ${style.id}`);close(sections.stem.at(-1).height,sections.hook[0].height);
 }
});

test('all real terminal lengths and angles form simple developed cutting outlines, with mirrored pairs',()=>{
 for(const tipShape of ['round','square','triangle','diamond'])for(const tipSize of [3,12])for(const armBendAngle of [0,45,65])for(const armStyle of armStyles){
  const d={...defaultDesign,tipShape,tipSize,armBendAngle,armStyle:armStyle.id,templeLength:120},left=templeSections(d,-1),right=templeSections(d,1),flat=flatTemple(d,1);
  assert.equal(isSimpleContour(flat.outline),true,`${armStyle.id}/${tipShape}/${tipSize}/${armBendAngle}`);close(axisLength(flat.centerline),120);
  close(flat.tipLengthMM,tipSize);assert.ok(flat.tipWidthMM>=3.2&&flat.tipWidthMM<=5.8);
  for(let i=0;i<left.rows.length;i++){close(left.rows[i].point[0],-right.rows[i].point[0]);close(left.rows[i].point[1],right.rows[i].point[1]);close(left.rows[i].point[2],right.rows[i].point[2]);}
 }
});

test('terminals taper in thickness for finishing rather than retaining an oversized full-stock bulb',()=>{
 for(const stock of [2,3,4,6,8]){
  const sections=templeSections({...defaultDesign,materialDepth:stock,tipSize:10},1);
  close(sections.stem[64].depth*2/MM,stock);close(sections.hook.at(-1).depth*2/MM,Math.min(stock,2.8));
  assert.equal(sections.terminalThicknessMM,Math.min(stock,2.8));
  for(const row of sections.rows)assert.ok(row.depth>0&&row.depth*2/MM<=stock+1e-8);
 }
});

test('finished temples are closed consistently oriented solids, including correctly facing end caps',()=>{
 for(const tipShape of ['round','square','triangle','diamond']){
  const rows=templeSections({...defaultDesign,tipSize:10,tipShape,armBendAngle:65},1).rows,geometry=finishedTemple(rows),position=geometry.attributes.position,index=geometry.index,edges=new Map();let volume=0;
  assert.equal(geometry.userData.continuous,true);assert.equal(position.count,rows.length*24);
  for(let i=0;i<index.count;i+=3){
   const ids=[0,1,2].map(j=>index.getX(i+j));
   for(let j=0;j<3;j++){const a=ids[j],b=ids[(j+1)%3],key=`${Math.min(a,b)}:${Math.max(a,b)}`,edge=edges.get(key)||{count:0,orientation:0};edge.count++;edge.orientation+=a<b?1:-1;edges.set(key,edge);}
   const [a,b,c]=ids.map(id=>[position.getX(id),position.getY(id),position.getZ(id)]);volume+=(a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6;
  }
  assert.ok(volume>0);for(const edge of edges.values()){assert.equal(edge.count,2);assert.equal(edge.orientation,0);}
  for(const value of position.array)assert.ok(Number.isFinite(value));geometry.dispose();
 }
});
