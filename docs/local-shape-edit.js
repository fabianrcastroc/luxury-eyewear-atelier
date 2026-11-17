import{frameContour,lensContour,independentCenterOffset,designMeasurements,MM}from'./frame-geometry.js';
import{normalizeDesign}from'./designer-model.js';
export const localShapeKeys=['nasalAngle','temporalLift','temporalReach'];
// Capture once, evaluate absolute edits from this source, never repeatedly deform a deformed outline.
export function localShapeEdit(design,key,value){
 if(![...localShapeKeys,'localLensMode'].includes(key))throw Error('Modificador local no válido');
 const mode=key==='localLensMode'?value:design.localLensMode||'fixed';
 const source=design.modifierSource?.lensMode===mode?design.modifierSource:{outer:frameContour(design,1).map(p=>p.map(v=>v/MM)),optical:lensContour(design,1).map(p=>p.map(v=>v/MM)),values:localShapeKeys.map(k=>design[k]||0),lensMode:mode};
 const values=localShapeKeys.map(k=>k===key?value:design[k]||0),angle=(values[0]-source.values[0])*Math.PI/180,lift=values[1]-source.values[1],reach=values[2]-source.values[2],w=Math.max(...source.outer.map(p=>Math.abs(p[0]))),h=Math.max(...source.outer.map(p=>Math.abs(p[1])));
 const smooth=(v,a,b)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
 const warp=([x,y])=>{const weight=smooth(x/w,0,1)*smooth(Math.max(0,y/h),0,.85),shift=y<0&&x<0?3*Math.tanh(Math.tan(angle)*(-y)*smooth(-x/w,.12,.85)/3):0;return[x+reach*weight+shift,y+lift*weight];};
 const radius=mode==='fixed'&&design.frontWrap>0?(source.formingRadius||designMeasurements(design).front/2/(design.frontWrap*Math.PI/180)):null;
 let next=normalizeDesign({...design,[key]:value,localLensMode:mode,centerSpacingOffset:independentCenterOffset(design),frameShapeMode:'independent',modifierSource:{...source,...(radius?{formingRadius:radius}:{})},outerOutline:source.outer.map(warp),outerBezier:null,outerSpline:null,opticalOutline:mode==='linked'?source.optical.map(warp):source.optical,opticalBezier:null,opticalSpline:null});if(radius){const angle=designMeasurements(next).front/2/radius*180/Math.PI;if(angle>20.000001)throw Error('Para conservar el cristal y su radio, reduce la curvatura frontal antes de ampliar más el temporal.');next=normalizeDesign({...next,frontWrap:angle});}if(!next.outerOutline||!next.opticalOutline||!next.modifierSource)throw Error('El ajuste no conserva contornos válidos. Se mantiene el diseño anterior.');return next;
}
