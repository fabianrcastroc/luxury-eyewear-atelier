import {normalizeContour} from './frame-geometry.js';

// Local, mirrored contour correction. One gesture is bounded in millimetres;
// the underlying boxing dimensions are applied separately by the geometry core.
export function contourControlIndices(contour){
 const points=normalizeContour(contour);if(!points)return [];
 return Array.from({length:8},(_,i)=>{const angle=i*Math.PI/4;let best=0,error=Infinity;points.forEach(([x,y],k)=>{const a=Math.atan2(y,x),delta=Math.abs(Math.atan2(Math.sin(a-angle),Math.cos(a-angle)));if(delta<error){best=k;error=delta;}});return best;});
}
export function correctContour(contour,index,dxMM,dyMM,widthMM,heightMM){
 const points=normalizeContour(contour);
 if(!points||!Number.isInteger(index)||index<0||index>=points.length||![dxMM,dyMM,widthMM,heightMM].every(Number.isFinite)||widthMM<35||widthMM>65||heightMM<20||heightMM>60)throw new Error('La corrección necesita un contorno válido y medidas calibradas.');
 const ys=points.map(p=>p[1]),spanY=Math.max(...ys)-Math.min(...ys),limit=points[index][0]<-.45?1:2.5,len=Math.hypot(dxMM,dyMM),scale=len>limit?limit/len:1;
 const corrected=points.map(([x,y],i)=>{const separation=Math.min(Math.abs(i-index),points.length-Math.abs(i-index)),t=separation/(points.length*.115),weight=t<1?(1-t*t)**3:0;return [x+dxMM*scale/(widthMM/2)*weight,y+dyMM*scale/(heightMM/spanY)*weight];});
 const result=normalizeContour(corrected);if(!result)throw new Error('La corrección cruza el contorno o excede las proporciones admitidas.');
 return result;
}
