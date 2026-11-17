import{frameContour,lensContour,MM}from'./frame-geometry.js';
import{normalizeDesign}from'./designer-model.js';
export const localShapeKeys=['nasalAngle','temporalLift','temporalReach'];
// Capture once, evaluate absolute edits from this source, never repeatedly deform a deformed outline.
export function localShapeEdit(design,key,value){
 if(!localShapeKeys.includes(key))throw Error('Modificador local no válido');
 if(!design.outerOutline&&!design.outerBezier&&!design.outerSpline)return normalizeDesign({...design,[key]:value});
 const source=design.modifierSource||{outer:frameContour(design,1).map(p=>p.map(v=>v/MM)),optical:lensContour(design,1).map(p=>p.map(v=>v/MM)),values:localShapeKeys.map(k=>design[k]||0)};
 const values=localShapeKeys.map(k=>k===key?value:design[k]||0),angle=(values[0]-source.values[0])*Math.PI/180,lift=values[1]-source.values[1],reach=values[2]-source.values[2],w=Math.max(...source.outer.map(p=>Math.abs(p[0]))),h=Math.max(...source.outer.map(p=>Math.abs(p[1])));
 const smooth=(v,a,b)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
 const warp=([x,y])=>{const weight=smooth(x/w,0,1)*smooth(Math.max(0,y/h),0,.85),shift=y<0&&x<0?3*Math.tanh(Math.tan(angle)*(-y)*smooth(-x/w,.12,.85)/3):0;return[x+reach*weight+shift,y+lift*weight];};
 return normalizeDesign({...design,[key]:value,modifierSource:source,outerOutline:source.outer.map(warp),outerBezier:null,outerSpline:null,opticalOutline:source.optical.map(warp),opticalBezier:null,opticalSpline:null});
}
