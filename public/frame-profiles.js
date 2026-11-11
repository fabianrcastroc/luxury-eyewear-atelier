import {referenceProfileContours} from './reference-profile-contours.js';
// Original editable construction curves informed by the user's Banton kit and
// the mixed reference-plan PDF. They are NOT authenticated manufacturer traces.
// Coordinates describe a right-eye aperture: negative X is nasal, positive X temporal.
const definitions=[
 {id:'recto',name:'Recto',description:'Rectangular óptico: ceja suave, pared nasal estable y base redondeada.',aspect:.70,rounding:35,sourcePages:[1,5,6],preset:{lensWidth:52,bridgeWidth:18,templeLength:145},brow:1.5,endpiece:3,knots:[[1,.16],[.91,.58],[.22,.71],[-.72,.62],[-1,.21],[-.84,-.48],[-.40,-.69],[.55,-.68],[.90,-.40]]},
 {id:'redondo',name:'Redondo',description:'Circular óptico con hombros temporales para asiento de bisagra.',aspect:1,rounding:100,lockRounding:true,sourcePages:[8,9],preset:{lensWidth:48,bridgeWidth:23,templeLength:145},brow:.5,endpiece:3,circle:true},
 {id:'ovalado',name:'Ovalado',description:'Gota aviador: parte superior amplia y base nasal recogida.',aspect:.84,rounding:100,lockRounding:true,sourcePages:[5],preset:{lensWidth:54,bridgeWidth:18,templeLength:145},brow:.7,endpiece:2.8,knots:[[1,.20],[.86,.65],[.10,.82],[-.72,.63],[-1,.17],[-.68,-.50],[-.08,-.83],[.58,-.61],[.91,-.18]]},
 {id:'curvo',name:'Curvo',description:'Cuadrado de acetato: ceja alta, caída nasal y base de mayor amplitud.',aspect:.80,rounding:50,sourcePages:[2,7,8],preset:{lensWidth:50,bridgeWidth:22,templeLength:145},brow:2,endpiece:3.5,knots:[[1,.30],[.91,.71],[.23,.80],[-.66,.68],[-1,.29],[-.80,-.43],[-.36,-.77],[.46,-.76],[.83,-.45]]},
 {id:'panto',name:'Panto',description:'Redondo anatómico con ceja aplanada y base circular.',aspect:.90,rounding:65,sourcePages:[1,8,9],preset:{lensWidth:48,bridgeWidth:22,templeLength:145},brow:1.2,endpiece:3,knots:[[1,.13],[.80,.65],[.16,.88],[-.65,.72],[-1,.25],[-.83,-.39],[-.21,-.89],[.52,-.72],[.90,-.25]]},
 {id:'boston',name:'Boston',description:'Panto de ceja recta con ángulos superiores definidos y base redonda.',aspect:.88,rounding:45,sourcePages:[4,7],preset:{lensWidth:49,bridgeWidth:21,templeLength:145},brow:1.8,endpiece:3.2,knots:[[1,.25],[.83,.72],[.10,.82],[-.68,.71],[-1,.29],[-.80,-.45],[-.23,-.87],[.48,-.72],[.88,-.27]]},
 {id:'cateye',name:'Cat-eye',description:'Mariposa: elevación temporal integrada, nasal redondeada y base oblicua.',aspect:.77,rounding:35,sourcePages:[3],preset:{lensWidth:54,bridgeWidth:17,templeLength:145},brow:1.8,endpiece:3.5,knots:[[1,.56],[.79,.83],[.19,.63],[-.63,.42],[-1,.12],[-.76,-.48],[-.25,-.69],[.42,-.61],[.86,-.16]]},
 {id:'geometrico',name:'Geométrico',description:'Poligonal de esquinas suavizadas, ceja horizontal y base amplia.',aspect:.80,rounding:25,sourcePages:[8],preset:{lensWidth:54,bridgeWidth:19,templeLength:140},brow:.7,endpiece:2.8,knots:[[1,.22],[.76,.75],[.04,.78],[-.72,.64],[-1,.22],[-.75,-.48],[-.28,-.78],[.49,-.74],[.87,-.31]]}
];
// Construction landmarks read from the supplied plan sheets. These variants
// retain their own proportions; they are not labelled as manufacturer CAD.
definitions.push(
 {id:'redondo-2',name:'Redondo 2',description:'Panto ancho: ceja aplanada y base redonda, referencia de la hoja 8.',aspect:.88,rounding:55,sourcePages:[8],preset:{lensWidth:49,bridgeWidth:23,templeLength:145},brow:1.1,endpiece:2.8,knots:[[1,.20],[.89,.62],[.45,.82],[-.38,.83],[-.86,.57],[-1,.10],[-.80,-.50],[-.30,-.86],[.30,-.85],[.80,-.48]]},
 {id:'redondo-3',name:'Redondo 3',description:'Panto estrecho de hombro nasal alto y base profunda, hoja 9.',aspect:.98,rounding:70,sourcePages:[9],preset:{lensWidth:46,bridgeWidth:24,templeLength:145},brow:1,endpiece:2.6,knots:[[1,.16],[.82,.69],[.25,.95],[-.40,.83],[-.91,.43],[-1,-.04],[-.76,-.61],[-.19,-.97],[.46,-.81],[.88,-.36]]},
 {id:'recto-2',name:'Recto 2',description:'Rectangular bajo de ceja horizontal y esquinas amplias, hoja 5.',aspect:.69,rounding:28,sourcePages:[5],preset:{lensWidth:52.5,bridgeWidth:21,templeLength:150},brow:1.5,endpiece:3,knots:[[1,.25],[.91,.60],[.40,.68],[-.48,.68],[-.91,.49],[-1,.12],[-.89,-.43],[-.49,-.65],[.49,-.66],[.92,-.40]]},
 {id:'recto-3',name:'Recto 3',description:'Rectangular de base descendente y borde nasal inclinado, referencia negra de la hoja 8.',aspect:.80,rounding:35,sourcePages:[8],preset:{lensWidth:50,bridgeWidth:22,templeLength:145},brow:2.1,endpiece:3.4,knots:[[1,.48],[.84,.76],[.26,.79],[-.52,.65],[-.92,.40],[-1,.08],[-.76,-.49],[-.30,-.78],[.50,-.70],[.87,-.27]]},
 {id:'mariposa-2',name:'Mariposa 2',description:'Alas temporales ascendentes y base suave, hoja 3.',aspect:.89,rounding:42,sourcePages:[3],preset:{lensWidth:51,bridgeWidth:17,templeLength:145},brow:1.2,endpiece:3.5,knots:[[1,.66],[.76,.89],[.22,.65],[-.58,.37],[-1,.04],[-.82,-.47],[-.30,-.86],[.31,-.76],[.79,-.30]]},
 {id:'geometrico-2',name:'Geométrico 2',description:'Doble puente de cristal alto y base oblicua, hoja 8.',aspect:.80,rounding:18,sourcePages:[8],preset:{lensWidth:54,bridgeWidth:19,templeLength:140},brow:.8,endpiece:2.8,knots:[[1,.44],[.72,.80],[-.40,.79],[-.92,.47],[-1,-.05],[-.69,-.73],[.23,-.80],[.81,-.36]]}
);
for(const p of definitions){const trace=referenceProfileContours[p.id];if(trace){p.contour=trace.contour;p.lockRounding=true;p.aspect=trace.aspect;p.traceSource=trace;p.description+=' Contorno de apertura extraído de la imagen del PDF.';}}
export const frameProfiles=definitions.map(p=>Object.freeze({...p,price:209000,referenceStatus:p.traceSource?'pdf-raster-trace':'original-parametric',source:p.traceSource?'Apertura extraída de planos · pág. 8 · calibración por A; no CAD del fabricante':'Base original · referencias: planos aportados y Banton Frameworks',preset:Object.freeze({...p.preset,lensHeight:Math.round(p.preset.lensWidth*p.aspect*10)/10}),defaults:Object.freeze({...p.preset,lensHeight:Math.round(p.preset.lensWidth*p.aspect*10)/10,bridgeType:p.id.startsWith('geometrico')?'doble':p.id==='panto'||p.id==='boston'?'herradura':'clasico',rounding:p.rounding})}));
export const getFrameProfile=id=>frameProfiles.find(p=>p.id===id)||frameProfiles[0];

// Cubic Hermite segments interpolate construction landmarks. Tangents are
// deliberately restrained to keep nasal shoulders and polygonal corners from
// overshooting while preserving a smooth, editable closed perimeter.
export function normalizedProfile(id,rounding=50,count=180){
 const p=getFrameProfile(id);
 if(p.contour)return p.contour.map(v=>v.slice());
 if(p.circle)return Array.from({length:count},(_,i)=>{const a=i/count*Math.PI*2;return [Math.cos(a),Math.sin(a)];});
 const knots=p.knots,points=[],tension=.30+.24*Math.max(0,Math.min(100,rounding))/100;
 for(let j=0;j<knots.length;j++){
  const prev=knots[(j+knots.length-1)%knots.length],a=knots[j],b=knots[(j+1)%knots.length],after=knots[(j+2)%knots.length],steps=Math.ceil(count/knots.length);
  const v=a.map((_,k)=>(b[k]-prev[k])*tension),w=b.map((_,k)=>(after[k]-a[k])*tension);
  for(let i=0;i<steps;i++){const t=i/steps,t2=t*t,t3=t2*t;points.push(a.map((x,k)=>(2*t3-3*t2+1)*x+(t3-2*t2+t)*v[k]+(-2*t3+3*t2)*b[k]+(t3-t2)*w[k]));}
 }
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),lo=Math.min(...xs),hi=Math.max(...xs),bottom=Math.min(...ys),top=Math.max(...ys),cx=(hi+lo)/2,cy=(top+bottom)/2;
 return points.map(([x,y])=>[(x-cx)*2/(hi-lo),(y-cy)*2*p.aspect/(top-bottom)]);
}
