import {frameDimensions,frameContour,lensCenters,designMeasurements,bridgeGeometry,templePlan,templeWidthLimit,nasalPads,templeSection,normalizeContour,lensContour} from './frame-geometry.js';
export const iconicModels = [
 {id:'recto',name:'Recto',description:'Rectangular proporcionado y de esquinas suaves.',price:209000,rounding:35},
 {id:'redondo',name:'Redondo',description:'Curva circular estable. Equilibrio clásico.',price:209000,rounding:100,lockRounding:true},
 {id:'ovalado',name:'Ovalado',description:'Óvalo en gota de inspiración aviador, sin doble puente.',price:209000,rounding:100,lockRounding:true},
 {id:'curvo',name:'Curvo',description:'Curva integral en acetato, adaptable a contornos CatEye.',price:209000,rounding:50}
];
export const bridgeTypes=[{id:'clasico',name:'Clásico'},{id:'doble',name:'Doble puente'},{id:'herradura',name:'Herradura'}];
export const bridgeHeights=[{id:'alto',name:'Alto'},{id:'medio',name:'Medio'},{id:'bajo',name:'Bajo'}];
export const frameColors=[{id:'negro',name:'Negro',hex:'#20211f'},{id:'carey',name:'Carey',hex:'#68422e'},{id:'amarillo',name:'Amarillo',hex:'#dfbb31'},{id:'marfil',name:'Marfil',hex:'#dfd5ba'},{id:'azul-marmol',name:'Azul piedra marmolado',hex:'#577b99'},{id:'gris',name:'Gris',hex:'#808585'},{id:'rojo',name:'Rojo italiano',hex:'#a63437'}];
export const lensColors=[{id:'humo',name:'Gris humo',hex:'#434a4b'},{id:'cafe',name:'Café',hex:'#7c5637'},{id:'verde',name:'Verde mineral',hex:'#526552'},{id:'azul',name:'Azul profundo',hex:'#435c78'},{id:'rosa',name:'Rosa mineral',hex:'#a97b77'}];
export const photoColors=[{id:'gris',name:'Gris negro',hex:'#414348'},{id:'cafe',name:'Café',hex:'#79573d'},{id:'lila',name:'Lila',hex:'#897496'}];
export const armStyles=[{id:'clasico',name:'Clásico'},{id:'fino',name:'Filiforme'},{id:'escultural',name:'Escultural'},{id:'sable',name:'Sable'},{id:'curvo',name:'Ondulado'},{id:'gancho',name:'Perfil envolvente'}];
export const lensTypes=[{id:'mono',name:'Monofocales',price:45000},{id:'bi',name:'Bifocales',price:85000},{id:'multi',name:'Multifocales',price:145000}];
export const defaultDesign={envelopeWall:4,wallMode:'inward',hingeMode:'hidden',nasalAngle:0,temporalLift:0,temporalReach:0,armBendAngle:45,bendMetric:'tangent-degrees',tipShape:'round',tipSize:10,tipMetric:'length',materialDepth:6,model:'recto',frameSize:'media',templeLength:140,rounding:35,bridgeThickness:5,bridgeNasalCurve:45,bridgeType:'clasico',bridgeHeight:'medio',thickness:4,armWidth:6,nasalProjection:35,armStyle:'clasico',armStyleRight:'clasico',rimColor:'negro',bridgeColor:'negro',armColor:'negro',use:'sol',lensType:'mono',blue:false,photo:false,ar:false,sunOptical:false,lensColor:'humo',photoColor:'gris'};
const valid=(list,id,fallback)=>list.some(x=>x.id===id)?id:fallback;
const decimal=(v,min,max,fallback)=>Number.isFinite(Number(v))?Math.max(min,Math.min(max,Math.round(Number(v)*100)/100)):fallback;
const clamp=(v,min,max,fallback)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Math.round(Number(v)))):fallback;
export function normalizeDesign(raw={}){
 const d={...defaultDesign,...raw},aliases={rectangular:'recto',panto:'redondo',aviador:'ovalado',clubmaster:'curvo',wayfarer:'curvo','cat-eye':'recto'};
 const model=valid(iconicModels,aliases[d.model]||d.model,'recto'),template=iconicModels.find(m=>m.id===model),optical=d.use==='optico',solar=optical&&d.sunOptical===true;
 const customContour=normalizeContour(d.customContour),colorAliases={miel:'amarillo',oliva:'gris',burdeos:'rojo'};
 for(const key of ['rimColor','bridgeColor','armColor'])d[key]=colorAliases[d[key]]||d[key];
 return {note:typeof d.note==='string'?d.note.slice(0,1000):'',envelopeWall:decimal(d.envelopeWall,3,8,4),wallMode:'inward',hingeMode:d.hingeMode==='box'?'box':'hidden',nasalAngle:decimal(d.nasalAngle,0,15,0),temporalLift:decimal(d.temporalLift,0,12,0),temporalReach:decimal(d.temporalReach,0,8,0),armBendAngle:decimal(d.armBendAngle,0,65,45),bendMetric:'tangent-degrees',tipMetric:'length',tipShape:['round','square','diamond','triangle'].includes(d.tipShape)?d.tipShape:'round',tipSize:decimal(d.tipSize,3,12,10),...(d.model==='wayfarer'||d.migratedFrom==='wayfarer'?{migratedFrom:'wayfarer',referenceStatus:'unverified'}:{}),...(customContour?{customContour}:{}),...(d.lensWidth!=null?{lensWidth:decimal(d.lensWidth,40,65,52)}:{}),...(d.bridgeWidth!=null?{bridgeWidth:decimal(d.bridgeWidth,14,26,17)}:{}),materialDepth:decimal(d.materialDepth,2,8,6),contourAspectScale:decimal(d.contourAspectScale,.85,1.15,1),model,frameSize:['estrecha','media','amplia'].includes(d.frameSize)?d.frameSize:'media',templeLength:decimal(d.templeLength,120,160,140),rounding:template.lockRounding?template.rounding:clamp(d.rounding,0,100,template.rounding),bridgeThickness:4,bridgeNasalCurve:0,bridgeType:valid(bridgeTypes,d.bridgeType,'clasico'),bridgeHeight:'medio',thickness:decimal(d.thickness,3,8,4),armWidth:decimal(d.armWidth,4,templeWidthLimit({...d,model,rounding:template.rounding,thickness:decimal(d.thickness,3,8,4)}),6),nasalProjection:clamp(d.nasalProjection,0,100,35),armStyle:valid(armStyles,d.armStyle,'clasico'),armStyleRight:valid(armStyles,d.armStyle,'clasico'),rimColor:valid(frameColors,d.rimColor,defaultDesign.rimColor),bridgeColor:valid(frameColors,d.bridgeColor,defaultDesign.bridgeColor),armColor:valid(frameColors,d.armColor,defaultDesign.armColor),use:optical?'optico':'sol',lensType:valid(lensTypes,d.lensType,'mono'),blue:optical&&!solar&&d.blue===true,photo:optical&&!solar&&d.photo===true,ar:optical&&!solar&&d.ar===true,sunOptical:solar,lensColor:valid(lensColors,d.lensColor,defaultDesign.lensColor),photoColor:valid(photoColors,d.photoColor,'gris')};
}
export function designQuote(raw){
 const d=normalizeDesign(raw);
 const lines=[{label:'Diseño personal · montura y personalización',amount:209000}];
 if(d.use==='optico'){
  const lens=lensTypes.find(l=>l.id===d.lensType);lines.push({label:`Cristales ${lens.name.toLowerCase()}`,amount:lens.price});
  if(d.blue)lines.push({label:'Filtro de luz azul',amount:20000});
  if(d.ar)lines.push({label:'Tratamiento antirreflejos',amount:18000});
  if(d.photo)lines.push({label:`Fotocromático · ${photoColors.find(c=>c.id===d.photoColor).name}`,amount:45000});
  if(d.sunOptical)lines.push({label:'Sol óptico (tinte graduado)',amount:25000});
 }
 return {lines,total:lines.reduce((sum,l)=>sum+l.amount,0)};
}
export function designSummary(raw){const d=normalizeDesign(raw),m=designMeasurements(d);return `${iconicModels.find(t=>t.id===d.model).name} · ${m.code} · ${d.use==='sol'?'Sol':lensTypes.find(l=>l.id===d.lensType).name}`;}
let previewSerial=0;
export function framePreview(raw,view='perspectiva'){
 const d=normalizeDesign(raw),centers=lensCenters(d),id=`design-glass-${++previewSerial}`,project=([x,y])=>[340+x*57,185-y*57];
 const rim=frameColors.find(c=>c.id===d.rimColor).hex,bridge=frameColors.find(c=>c.id===d.bridgeColor).hex,arm=frameColors.find(c=>c.id===d.armColor).hex;
 const tinted=d.use==='sol'||d.photo||d.sunOptical,lens=d.photo?photoColors.find(c=>c.id===d.photoColor).hex:lensColors.find(c=>c.id===d.lensColor).hex;
 const path=points=>points.map((p,i)=>`${i?'L':'M'}${project(p).join(' ')}`).join(' ')+'Z';
 const transform=view==='frente'?'':view==='lateral'?'translate(65 0) skewX(-16) scale(.8 1)':'rotate(-6 340 185)';
 const rings=[-1,1].map((side,i)=>{const points=frameContour(d,side).map(([x,y])=>[x+centers[i],y]),aperture=lensContour(d,side).map(([x,y])=>[x+centers[i],y]);return `<path d="${path(points)} ${path(aperture.slice().reverse())}" fill="${rim}" fill-rule="evenodd"/><path d="${path(aperture)}" fill="url(#${id})"/>`;}).join('');
 const bridges=bridgeGeometry(d).bands.map(b=>`<path d="${path(b.outline)}" fill="${bridge}"/>`).join('');
 const pads=[-1,1].map(side=>`<path d="${path(nasalPads(d,side).outline)}" fill="${rim}" opacity=".75"/>`).join('');
 const arms=view==='frente'?'':[-1,1].map(side=>{const p=templePlan(d,side,side===-1?d.armStyle:d.armStyleRight);const projectArm=([x,y,z])=>[x-z*.22,y-z*.25],widths=[p.shaftWidth,p.shaftWidth,p.shaftWidth*.4+p.hookWidth*.6,p.hookWidth];
  const upper=p.stem.map((v,i)=>{const section=templeSection(d,v[1],widths[i]),[x,y]=projectArm([v[0],section.top,v[2]]);return [x,y];}),lower=p.stem.map((v,i)=>{const section=templeSection(d,v[1],widths[i]),[x,y]=projectArm([v[0],section.bottom,v[2]]);return [x,y];});
  const hook=p.hook.map(projectArm);return `<path d="${path([...upper,...lower.reverse()])}" fill="${arm}"/><path d="${path(hook).slice(0,-1)}" fill="none" stroke="${arm}" stroke-width="${p.hookWidth*57}" stroke-linecap="round" stroke-linejoin="round"/>`;}).join('');
 return `<svg viewBox="0 0 680 390" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vista ${view} del diseño ${iconicModels.find(m=>m.id===d.model).name}"><defs><linearGradient id="${id}" x2="0" y2="1"><stop stop-color="${lens}" stop-opacity="${tinted?.95:.15}"/><stop offset="1" stop-color="${lens}" stop-opacity="${tinted?.7:.05}"/></linearGradient></defs><g transform="${transform}">${arms}${pads}${rings}${bridges}</g></svg>`;
}
export function prescriptionError(file){
 if(!file)return 'Selecciona una receta.';
 if(file.size>10*1024*1024)return 'El archivo supera los 10 MB. Elige uno más pequeño.';
 if(file.size===0)return 'El archivo está vacío.';
 const extension=file.name?.split('.').pop()?.toLowerCase();
 const allowed={pdf:'application/pdf',jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp'};
 if(!allowed[extension]||file.type&&file.type!==allowed[extension])return 'Formato no admitido. Usa PDF, JPG, PNG o WebP.';
 return '';
}
export function prescriptionSignature(bytes,file){
 const signatures={
  pdf:bytes[0]===0x25&&bytes[1]===0x50&&bytes[2]===0x44&&bytes[3]===0x46,
  jpg:bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff,
  png:bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47,
  webp:bytes[0]===0x52&&bytes[1]===0x49&&bytes[2]===0x46&&bytes[3]===0x46&&bytes[8]===0x57&&bytes[9]===0x45&&bytes[10]===0x42&&bytes[11]===0x50
 };
 if(!file)return Object.values(signatures).some(Boolean);
 let extension=file.name.split('.').pop().toLowerCase();if(extension==='jpeg')extension='jpg';
 return signatures[extension]===true;
}

export function migrateStoredDesign(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return normalizeDesign(defaultDesign);
 const envelopeWall=raw.envelopeWall??(raw.wallMode==='inward'?4:decimal(raw.thickness,3,8,4));
 const armBendAngle=raw.bendMetric==='tangent-degrees'?raw.armBendAngle:Math.atan(.9+.8*Math.tan(decimal(raw.armBendAngle,0,45,20)*Math.PI/180))*180/Math.PI;
 return normalizeDesign({...raw,envelopeWall,armBendAngle,bendMetric:'tangent-degrees',wallMode:'inward',tipMetric:'length',tipSize:raw.tipMetric==='length'?raw.tipSize:10});
}
