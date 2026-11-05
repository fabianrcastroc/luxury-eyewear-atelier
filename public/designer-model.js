import {frameDimensions,frameContour,lensCenters,designMeasurements,bridgeGeometry,templePlan} from './frame-geometry.js';
export const iconicModels = [
 {id:'recto',name:'Recto',description:'Rectangular proporcionado y de esquinas suaves.',price:209000,rounding:35},
 {id:'redondo',name:'Redondo',description:'Curva circular estable. Equilibrio clásico.',price:209000,rounding:100,lockRounding:true},
 {id:'ovalado',name:'Ovalado',description:'Óvalo en gota de inspiración aviador, sin doble puente.',price:209000,rounding:100,lockRounding:true},
 {id:'curvo',name:'Curvo',description:'Browline en acetato, aro inferior ligero y brazos planos.',price:209000,rounding:50}
];
export const bridgeTypes=[{id:'clasico',name:'Clásico'},{id:'doble',name:'Doble puente'},{id:'herradura',name:'Herradura'}];
export const bridgeHeights=[{id:'alto',name:'Alto'},{id:'medio',name:'Medio'},{id:'bajo',name:'Bajo'}];
export const frameColors=[{id:'miel',name:'Miel',hex:'#a76c32'},{id:'carey',name:'Tabaco',hex:'#68422e'},{id:'negro',name:'Obsidiana',hex:'#252622'},{id:'oliva',name:'Oliva',hex:'#697350'},{id:'marfil',name:'Marfil',hex:'#dfd5ba'},{id:'burdeos',name:'Borgoña',hex:'#6d3541'}];
export const lensColors=[{id:'humo',name:'Gris humo',hex:'#434a4b'},{id:'cafe',name:'Café',hex:'#7c5637'},{id:'verde',name:'Verde mineral',hex:'#526552'},{id:'azul',name:'Azul profundo',hex:'#435c78'},{id:'rosa',name:'Rosa mineral',hex:'#a97b77'}];
export const photoColors=[{id:'gris',name:'Gris negro',hex:'#414348'},{id:'cafe',name:'Café',hex:'#79573d'},{id:'lila',name:'Lila',hex:'#897496'}];
export const armStyles=[{id:'clasico',name:'Clásico'},{id:'fino',name:'Filiforme'},{id:'escultural',name:'Escultural'},{id:'sable',name:'Sable'},{id:'curvo',name:'Ondulado'},{id:'gancho',name:'Curva envolvente'}];
export const lensTypes=[{id:'mono',name:'Monofocales',price:45000},{id:'bi',name:'Bifocales',price:85000},{id:'multi',name:'Multifocales',price:145000}];
export const defaultDesign={model:'recto',frameSize:'media',templeLength:140,rounding:35,bridgeThickness:4,bridgeNasalCurve:45,bridgeType:'clasico',bridgeHeight:'medio',thickness:4,armWidth:6,armExtension:0,armStyle:'clasico',armStyleRight:'clasico',rimColor:'negro',bridgeColor:'negro',armColor:'negro',use:'sol',lensType:'mono',blue:false,photo:false,ar:false,sunOptical:false,lensColor:'humo',photoColor:'gris'};
const valid=(list,id,fallback)=>list.some(x=>x.id===id)?id:fallback;
const clamp=(v,min,max,fallback)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Math.round(Number(v)))):fallback;
export function normalizeDesign(raw={}){
 const d={...defaultDesign,...raw},aliases={rectangular:'recto',panto:'redondo',aviador:'ovalado',clubmaster:'curvo',wayfarer:'curvo','cat-eye':'recto'};
 const model=valid(iconicModels,aliases[d.model]||d.model,'recto'),template=iconicModels.find(m=>m.id===model),optical=d.use==='optico',solar=optical&&d.sunOptical===true;
 return {model,frameSize:['estrecha','media','amplia'].includes(d.frameSize)?d.frameSize:'media',templeLength:[135,140,145,150].includes(Number(d.templeLength))?Number(d.templeLength):140,rounding:template.lockRounding?template.rounding:clamp(d.rounding,0,100,template.rounding),bridgeThickness:clamp(d.bridgeThickness,3,8,4),bridgeNasalCurve:clamp(d.bridgeNasalCurve??d.bridgeCurve,0,100,45),bridgeType:valid(bridgeTypes,d.bridgeType,'clasico'),bridgeHeight:valid(bridgeHeights,d.bridgeHeight,'medio'),thickness:clamp(d.thickness,3,8,4),armWidth:clamp(d.armWidth,4,12,6),armExtension:clamp(d.armExtension,-5,5,0),armStyle:valid(armStyles,d.armStyle,'clasico'),armStyleRight:valid(armStyles,d.armStyleRight,valid(armStyles,d.armStyle,'clasico')),rimColor:valid(frameColors,d.rimColor,defaultDesign.rimColor),bridgeColor:valid(frameColors,d.bridgeColor,defaultDesign.bridgeColor),armColor:valid(frameColors,d.armColor,defaultDesign.armColor),use:optical?'optico':'sol',lensType:valid(lensTypes,d.lensType,'mono'),blue:optical&&!solar&&d.blue===true,photo:optical&&!solar&&d.photo===true,ar:optical&&!solar&&d.ar===true,sunOptical:solar,lensColor:valid(lensColors,d.lensColor,defaultDesign.lensColor),photoColor:valid(photoColors,d.photoColor,'gris')};
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
 const rings=[-1,1].map((side,i)=>{const points=frameContour(d,side).map(([x,y])=>[x+centers[i],y]);return `<path d="${path(points)}" fill="url(#${id})" stroke="${d.model==='curvo'?'#bbaa7a':rim}" stroke-width="${d.model==='curvo'?2:5}"/>${d.model==='curvo'?`<path d="${path(points.slice(0,65))}" fill="none" stroke="${rim}" stroke-width="7"/>`:''}`;}).join('');
 const bridges=bridgeGeometry(d).bands.map(b=>`<path d="${path(b.outline)}" fill="${bridge}"/>`).join('');
 const arms=view==='frente'?'':[-1,1].map(side=>{const p=templePlan(d,side,side===-1?d.armStyle:d.armStyleRight);const points=[...p.stem,...p.hook.slice(1)].map(([x,y,z])=>[x-z*.22,y-z*.25]);return `<path d="${path(points)}" fill="none" stroke="${arm}" stroke-width="${d.armWidth}"/>`;}).join('');
 return `<svg viewBox="0 0 680 390" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vista ${view} del diseño ${iconicModels.find(m=>m.id===d.model).name}"><defs><linearGradient id="${id}" x2="0" y2="1"><stop stop-color="${lens}" stop-opacity="${tinted?.95:.15}"/><stop offset="1" stop-color="${lens}" stop-opacity="${tinted?.7:.05}"/></linearGradient></defs><g transform="${transform}">${arms}${rings}${bridges}</g></svg>`;
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
