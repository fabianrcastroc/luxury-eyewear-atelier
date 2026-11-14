/*! Clipper 6.4.2, Angus Johnson 2010–2017, JS port by Timo. Boost Software License 1.0; see THIRD_PARTY_NOTICES.txt. */
import ClipperLib from 'clipper-lib';

// All coordinates in this module use the caller's units. Frame geometry passes
// scene units (0.04 per mm); manufacturing passes millimetres. No implicit
// conversion or rescaling of a part is performed here.
const SCALE=1e8;
const area=points=>points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-q[0]*p[1];},0)/2;
function clean(points){
 if(!Array.isArray(points)||points.length<3||points.some(p=>!Array.isArray(p)||p.length!==2||p.some(n=>!Number.isFinite(n)||Math.abs(n)>10000)))throw new RangeError('Contorno plano inválido.');
 const out=[];
 for(const point of points)if(!out.length||Math.hypot(point[0]-out.at(-1)[0],point[1]-out.at(-1)[1])>1e-9)out.push(point);
 if(out.length>3&&Math.hypot(out[0][0]-out.at(-1)[0],out[0][1]-out.at(-1)[1])<1e-9)out.pop();
 if(out.length<3||Math.abs(area(out))<1e-12)throw new RangeError('El contorno plano no tiene área suficiente.');
 return out;
}
const integerPath=points=>clean(points).map(([x,y])=>({X:Math.round(x*SCALE),Y:Math.round(y*SCALE)}));
const coordinates=path=>path.map(p=>[p.X/SCALE,p.Y/SCALE]);
const positive=points=>area(points)<0?points.slice().reverse():points;
function execute(subject,clip,type){
 const kernel=new ClipperLib.Clipper();kernel.StrictlySimple=true;
 kernel.AddPaths(subject.map(p=>integerPath(positive(p))),ClipperLib.PolyType.ptSubject,true);
 if(clip.length)kernel.AddPaths(clip.map(p=>integerPath(positive(p))),ClipperLib.PolyType.ptClip,true);
 const solution=new ClipperLib.Paths();
 if(!kernel.Execute(type,solution,ClipperLib.PolyFillType.pftNonZero,ClipperLib.PolyFillType.pftNonZero))throw new Error('No se pudo resolver la operación de contornos.');
 return solution.map(coordinates).filter(p=>p.length>=3&&Math.abs(area(p))>1e-12);
}
export const unionPolygons=polygons=>execute(polygons,[],ClipperLib.ClipType.ctUnion);
export const subtractPolygons=(subject,holes)=>execute(subject,holes,ClipperLib.ClipType.ctDifference);
export const intersectPolygons=(subject,clip)=>execute(subject,clip,ClipperLib.ClipType.ctIntersection);
export function offsetPolygon(points,distance,{join='miter',arcTolerance=.0001,miterLimit=2}={}){
 if(!Number.isFinite(distance))throw new RangeError('La distancia del contorno debe ser finita.');
 if(Math.abs(distance)<1e-12)return [positive(clean(points))];
 const kernel=new ClipperLib.ClipperOffset(miterLimit,Math.max(1,arcTolerance*SCALE));
 kernel.AddPath(integerPath(positive(points)),join==='round'?ClipperLib.JoinType.jtRound:ClipperLib.JoinType.jtMiter,ClipperLib.EndType.etClosedPolygon);
 const solution=new ClipperLib.Paths();kernel.Execute(solution,distance*SCALE);
 return solution.map(coordinates).filter(p=>p.length>=3&&Math.abs(area(p))>1e-12).map(positive);
}
export function offsetSingleContour(points,distance,options){
 const paths=offsetPolygon(points,distance,options);
 if(paths.length!==1)throw new RangeError(paths.length?'El espesor divide el contorno en varias piezas. Reduce el ancho del aro.':'El espesor elimina la apertura. Reduce el ancho del aro.');
 return paths[0];
}
// Offset a material region with its signed hole contours, preserving winding.
// Unlike offsetSingleContour, this can represent disconnected regions and holes.
export function offsetRegion(paths,distance,{arcTolerance=.01}={}){
 const kernel=new ClipperLib.ClipperOffset(2,Math.max(1,arcTolerance*SCALE));
 kernel.AddPaths(paths.map(integerPath),ClipperLib.JoinType.jtRound,ClipperLib.EndType.etClosedPolygon);
 const solution=new ClipperLib.Paths();kernel.Execute(solution,distance*SCALE);
 return solution.map(coordinates).filter(p=>p.length>=3&&Math.abs(area(p))>1e-12);
}
function isSimpleContourUncached(points){
 try{
  const path=integerPath(points),simplified=ClipperLib.Clipper.SimplifyPolygon(path,ClipperLib.PolyFillType.pftNonZero);
  if(simplified.length!==1)return false;
  const before=Math.abs(area(points)),after=Math.abs(ClipperLib.Clipper.Area(simplified[0]))/(SCALE*SCALE);
  return Math.abs(before-after)<Math.max(1e-9,before*1e-7);
 }catch{return false;}
}
export {area as polygonArea};

const simpleCache=new Map();export function isSimpleContour(points){const key=JSON.stringify(points);if(simpleCache.has(key))return simpleCache.get(key);const result=isSimpleContourUncached(points);if(simpleCache.size>=192)simpleCache.delete(simpleCache.keys().next().value);simpleCache.set(key,result);return result;}
