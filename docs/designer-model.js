import {frameDimensions,frameContour} from './frame-geometry.js';
export const iconicModels = [
 {id:'rectangular',name:'Recto',description:'Líneas paralelas. Proporción horizontal.',price:209000,rounding:22},
 {id:'panto',name:'Panto',description:'Redondez clásica y equilibrio.',price:209000,rounding:88},
 {id:'cat-eye',name:'Cat-eye',description:'Extremos elevados. Carácter sutil.',price:209000,rounding:52},
 {id:'aviador',name:'Aviador',description:'Lente en gota y doble puente.',price:209000,rounding:75},
 {id:'clubmaster',name:'Clubmaster',description:'Browline marcado y aro ligero.',price:209000,rounding:65},
 {id:'wayfarer',name:'Wayfarer',description:'Contorno trapezoidal y presencia.',price:209000,rounding:38}
];
export const frameColors=[{id:'miel',name:'Miel',hex:'#a76c32'},{id:'carey',name:'Tabaco',hex:'#68422e'},{id:'negro',name:'Obsidiana',hex:'#252622'},{id:'oliva',name:'Oliva',hex:'#697350'},{id:'marfil',name:'Marfil',hex:'#dfd5ba'},{id:'burdeos',name:'Borgoña',hex:'#6d3541'}];
export const lensColors=[{id:'humo',name:'Gris humo',hex:'#434a4b'},{id:'cafe',name:'Café',hex:'#7c5637'},{id:'verde',name:'Verde mineral',hex:'#526552'},{id:'azul',name:'Azul profundo',hex:'#435c78'},{id:'rosa',name:'Rosa mineral',hex:'#a97b77'}];
export const photoColors=[{id:'gris',name:'Gris negro',hex:'#414348'},{id:'cafe',name:'Café',hex:'#79573d'},{id:'lila',name:'Lila',hex:'#897496'}];
export const armStyles=[{id:'clasico',name:'Clásico'},{id:'fino',name:'Filiforme'},{id:'escultural',name:'Escultural'},{id:'sable',name:'Sable'},{id:'curvo',name:'Ondulado'},{id:'gancho',name:'Curva envolvente'}];
export const lensTypes=[{id:'mono',name:'Monofocales',price:45000},{id:'bi',name:'Bifocales',price:85000},{id:'multi',name:'Multifocales',price:145000}];
export const defaultDesign={model:'rectangular',rounding:22,bridgeCurve:55,thickness:6,bridgeWidth:20,armLength:145,armStyle:'clasico',armStyleRight:'clasico',rimColor:'negro',bridgeColor:'negro',armColor:'negro',use:'sol',lensType:'mono',blue:false,photo:false,ar:false,sunOptical:false,lensColor:'humo',photoColor:'gris'};
const valid=(list,id,fallback)=>list.some(x=>x.id===id)?id:fallback;
const clamp=(v,min,max,fallback)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Math.round(Number(v)))):fallback;
export function normalizeDesign(raw={}){
 const d={...defaultDesign,...raw},optical=d.use==='optico',solar=optical&&d.sunOptical===true;
 return {model:valid(iconicModels,d.model,'rectangular'),rounding:clamp(d.rounding,0,100,defaultDesign.rounding),bridgeCurve:clamp(d.bridgeCurve,0,100,55),thickness:clamp(d.thickness,3,10,6),bridgeWidth:clamp(d.bridgeWidth,16,24,20),armLength:clamp(d.armLength,135,155,145),armStyle:valid(armStyles,d.armStyle,'clasico'),armStyleRight:valid(armStyles,d.armStyleRight,valid(armStyles,d.armStyle,'clasico')),rimColor:valid(frameColors,d.rimColor,defaultDesign.rimColor),bridgeColor:valid(frameColors,d.bridgeColor,defaultDesign.bridgeColor),armColor:valid(frameColors,d.armColor,defaultDesign.armColor),use:optical?'optico':'sol',lensType:valid(lensTypes,d.lensType,'mono'),blue:optical&&!solar&&d.blue===true,photo:optical&&!solar&&d.photo===true,ar:optical&&!solar&&d.ar===true,sunOptical:solar,lensColor:valid(lensColors,d.lensColor,defaultDesign.lensColor),photoColor:valid(photoColors,d.photoColor,'gris')};
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
export function designSummary(raw){const d=normalizeDesign(raw);return `${iconicModels.find(m=>m.id===d.model).name} · ${d.use==='sol'?'Sol':lensTypes.find(l=>l.id===d.lensType).name} · ${d.thickness} mm · brazos ${d.armLength} mm`;}
let previewSerial=0;
export function framePreview(raw,view='perspectiva'){
 const d=normalizeDesign(raw),{rx}=frameDimensions(d),gap=.22+(d.bridgeWidth-16)*.018,offset=rx+gap,id=`design-glass-${++previewSerial}`;
 const rim=frameColors.find(c=>c.id===d.rimColor).hex,bridge=frameColors.find(c=>c.id===d.bridgeColor).hex,arm=frameColors.find(c=>c.id===d.armColor).hex;
 const tinted=d.use==='sol'||d.photo||d.sunOptical,lens=d.photo?photoColors.find(c=>c.id===d.photoColor).hex:lensColors.find(c=>c.id===d.lensColor).hex;
 const path=side=>frameContour(d,side).map(([x,y],i)=>`${i?'L':'M'}${340+(side*offset+x)*75} ${190-y*75}`).join(' ')+'Z';
 const transform=view==='frente'?'':view==='lateral'?'translate(65 0) skewX(-16) scale(.8 1)':'rotate(-6 340 190)';
 const armPath=(side,style)=>{const x=340+side*(rx*2+gap)*75,len=(d.armLength-125)*1.5+70;const bend=style==='gancho'?35:style==='curvo'?-15:style==='sable'?18:8;return `M${x} 175 Q${x+side*20} ${95-bend} ${x-side*len*.3} ${95-bend} L${x-side*len} ${116+bend}`;};
 return `<svg viewBox="0 0 680 390" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vista ${view} del diseño ${iconicModels.find(m=>m.id===d.model).name}"><defs><linearGradient id="${id}" x2="0" y2="1"><stop stop-color="${lens}" stop-opacity="${tinted?.95:.15}"/><stop offset="1" stop-color="${lens}" stop-opacity="${tinted?.7:.05}"/></linearGradient></defs><ellipse cx="340" cy="282" rx="210" ry="10" fill="#000" opacity=".045"/><g transform="${transform}">${view==='frente'?'':`<path d="${armPath(-1,d.armStyle)}" fill="none" stroke="${arm}" stroke-width="${d.armStyle==='fino'?6:13}"/><path d="${armPath(1,d.armStyleRight)}" fill="none" stroke="${arm}" stroke-width="${d.armStyleRight==='fino'?6:13}"/>`}<path d="${path(-1)}" fill="url(#${id})" stroke="${rim}" stroke-width="${d.thickness*1.4}"/><path d="${path(1)}" fill="url(#${id})" stroke="${rim}" stroke-width="${d.thickness*1.4}"/><path d="M${340-gap*75} 173 Q340 ${173-d.bridgeCurve*.35} ${340+gap*75} 173" fill="none" stroke="${bridge}" stroke-width="6"/>${d.model==='aviador'?`<path d="M${340-gap*75} 150 Q340 143 ${340+gap*75} 150" fill="none" stroke="${bridge}" stroke-width="4"/>`:''}</g></svg>`;
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
