import {normalizeContour} from './frame-geometry.js';
// Closed cubic interpolation for an operator-reviewed aperture when automatic
// segmentation is obstructed. Pixel-space points use image Y downwards.
export function traceLandmarks(raw,{linear=false}={}){
 const points=[];for(const p of raw||[])if(Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&(!points.length||Math.hypot(p[0]-points.at(-1)[0],p[1]-points.at(-1)[1])>1))points.push(p);
 if(points.length>1&&Math.hypot(points[0][0]-points.at(-1)[0],points[0][1]-points.at(-1)[1])<2)points.pop();
 if(points.length<4||points.length>64)throw Error('Marca entre 4 y 64 puntos alrededor de un cristal, siguiendo su borde en orden.');
 const sampled=[];
 for(let i=0;i<128;i++){const t=i/128*points.length,k=Math.floor(t),u=t-k,a=points[k%points.length],b=points[(k+1)%points.length],previous=points[(k+points.length-1)%points.length],next=points[(k+2)%points.length],u2=u*u,u3=u2*u;sampled.push(linear?a.map((v,axis)=>v+(b[axis]-v)*u):[0,1].map(axis=>(2*u3-3*u2+1)*a[axis]+(u3-2*u2+u)*(b[axis]-previous[axis])*.3+(-2*u3+3*u2)*b[axis]+(u3-u2)*(next[axis]-a[axis])*.3));}
 const width=Math.max(...sampled.map(p=>p[0]))-Math.min(...sampled.map(p=>p[0])),height=Math.max(...sampled.map(p=>p[1]))-Math.min(...sampled.map(p=>p[1])),contour=normalizeContour(sampled.map(([x,y])=>[x,-y]));
 if(!contour)throw Error('El trazado se cruza o tiene una proporción fuera de rango. Revisa el orden y la posición de los puntos.');
 return {pixelContour:sampled,customContour:contour,aspectRatio:height/width,widthPixels:width,manual:true,traceErrorPixels:null,referenceScale:{widthPixels:width,requiresKnownDimension:true},regularization:linear?'operator-reviewed-lines':'operator-reviewed-cubic'};
}
