export const iconicModels = [
  {id:'panto',photo:'./assets/references/panto.webp',referenceLabel:'Ray-Ban RB7140 8124',name:'Panto',description:'Redondo, intelectual y atemporal.',price:209000,rounding:88,lift:0},
  {id:'rectangular',photo:'./assets/references/rectangular.webp',referenceLabel:'Ray-Ban Jeffrey RB4448L',name:'Recto',description:'Geometría limpia. Presencia serena.',price:209000,rounding:22,lift:0},
  {id:'cat-eye',photo:'./assets/references/cat-eye.webp',referenceLabel:'Vogue VO5369S',name:'Cat-eye',description:'Una mirada elevada y expresiva.',price:209000,rounding:50,lift:22},
  {id:'aviador',photo:'./assets/references/aviador.webp',referenceLabel:'Ray-Ban Aviator RB3025-L',name:'Aviador',description:'La silueta de doble puente.',price:209000,rounding:72,lift:-12},
  {id:'clubmaster',photo:'./assets/references/clubmaster.webp',referenceLabel:'Ray-Ban Clubmaster RB3016L',name:'Clubmaster',description:'Línea superior marcada. Equilibrio clásico.',price:209000,rounding:65,lift:0}
];
export const frameColors=[{id:'miel',name:'Miel',hex:'#a76c32'},{id:'carey',name:'Tabaco',hex:'#68422e'},{id:'negro',name:'Obsidiana',hex:'#252622'},{id:'oliva',name:'Oliva',hex:'#697350'},{id:'marfil',name:'Marfil',hex:'#dfd5ba'},{id:'burdeos',name:'Borgoña',hex:'#6d3541'}];
export const lensColors=[{id:'humo',name:'Gris humo',hex:'#434a4b'},{id:'cafe',name:'Café',hex:'#7c5637'},{id:'verde',name:'Verde mineral',hex:'#526552'},{id:'azul',name:'Azul profundo',hex:'#435c78'},{id:'rosa',name:'Rosa mineral',hex:'#a97b77'}];
export const photoColors=[{id:'gris',name:'Gris negro',hex:'#414348'},{id:'cafe',name:'Café',hex:'#79573d'},{id:'lila',name:'Lila',hex:'#897496'}];
export const armStyles=[{id:'clasico',name:'Clásico'},{id:'fino',name:'Filiforme'},{id:'escultural',name:'Escultural'},{id:'sable',name:'Sable'},{id:'curvo',name:'Ondulado'},{id:'gancho',name:'Curva envolvente'}];
export const lensTypes=[{id:'mono',name:'Monofocales',price:45000},{id:'bi',name:'Bifocales',price:85000},{id:'multi',name:'Multifocales',price:145000}];
export const defaultDesign={model:'panto',rounding:88,bridgeCurve:55,thickness:6,bridgeWidth:20,armLength:145,armStyle:'clasico',armStyleRight:'clasico',rimColor:'miel',bridgeColor:'miel',armColor:'miel',use:'sol',lensType:'mono',blue:false,photo:false,ar:false,sunOptical:false,lensColor:'cafe',photoColor:'gris'};
const valid=(list,id,fallback)=>list.some(x=>x.id===id)?id:fallback;
const clamp=(v,min,max,fallback)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Math.round(Number(v)))):fallback;
export function normalizeDesign(raw={}){
 const d={...defaultDesign,...raw},optical=d.use==='optico',solar=optical&&d.sunOptical===true;
 return {model:valid(iconicModels,d.model,'panto'),rounding:clamp(d.rounding,0,100,88),bridgeCurve:clamp(d.bridgeCurve,0,100,55),thickness:clamp(d.thickness,3,10,6),bridgeWidth:clamp(d.bridgeWidth,16,24,20),armLength:clamp(d.armLength,135,155,145),armStyle:valid(armStyles,d.armStyle,'clasico'),armStyleRight:valid(armStyles,d.armStyleRight,valid(armStyles,d.armStyle,'clasico')),rimColor:valid(frameColors,d.rimColor,'miel'),bridgeColor:valid(frameColors,d.bridgeColor,'miel'),armColor:valid(frameColors,d.armColor,'miel'),use:optical?'optico':'sol',lensType:valid(lensTypes,d.lensType,'mono'),blue:optical&&!solar&&d.blue===true,photo:optical&&!solar&&d.photo===true,ar:optical&&!solar&&d.ar===true,sunOptical:solar,lensColor:valid(lensColors,d.lensColor,'cafe'),photoColor:valid(photoColors,d.photoColor,'gris')};
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
 const gradientID=`design-glass-${++previewSerial}`;
 const d=normalizeDesign(raw),rim=frameColors.find(c=>c.id===d.rimColor).hex,bridge=frameColors.find(c=>c.id===d.bridgeColor).hex,arm=frameColors.find(c=>c.id===d.armColor).hex;
 const tinted=d.use==='sol'||d.sunOptical||d.photo;const lens=d.use==='optico'&&d.photo?photoColors.find(c=>c.id===d.photoColor).hex:tinted?lensColors.find(c=>c.id===d.lensColor).hex:'#d8e5df';
 const rx=Math.min(83,14+d.rounding*.75),ry=Math.min(65,10+d.rounding*.62),top=112,bot=d.model==='aviador'?257:242;
 const left=145-d.bridgeWidth, right=355+d.bridgeWidth;
 const lensPath=(x,mirror)=>{
  const w=166,h=bot-top,lift=d.model==='cat-eye'?22:0;
  const leftY=top-(mirror?0:lift),rightY=top-(mirror?lift:0);
  if(d.model==='aviador'){
   const points=[[x+24,top],[x+141,top],[x+166,top+25],[x+153,top+98],[x+103,top+h],[x+65,top+h-3],[x+14,top+92],[x,top+26]];
   const ratio=d.rounding/100*.49;
   const entries=points.map((point,i)=>{const prev=points[(i+points.length-1)%points.length];return [point[0]+(prev[0]-point[0])*ratio,point[1]+(prev[1]-point[1])*ratio];});
   return points.map((point,i)=>{const next=points[(i+1)%points.length];const end=[point[0]+(next[0]-point[0])*ratio,point[1]+(next[1]-point[1])*ratio];return `${i===0?'M':'L'}${entries[i][0]} ${entries[i][1]} Q${point[0]} ${point[1]} ${end[0]} ${end[1]}`;}).join(' ')+'Z';
  }
  return `M ${x+rx} ${leftY} L ${x+w-rx} ${rightY} Q ${x+w} ${rightY} ${x+w} ${top+ry} L ${x+w} ${top+h-ry} Q ${x+w} ${top+h} ${x+w-rx} ${top+h} L ${x+rx} ${top+h} Q ${x} ${top+h} ${x} ${top+h-ry} L ${x} ${top+ry} Q ${x} ${leftY} ${x+rx} ${leftY} Z`;
 };
 const lx=left,rxPos=right-22;const innerL=lx+166,innerR=rxPos;const center=(innerL+innerR)/2;const thick=d.thickness*2;
 const extension=(d.armLength-135)*2.1,armW=d.armStyle==='fino'?7:d.armStyle==='escultural'?22:13;
 const transform=view==='frente'?'translate(-32 0)':view==='lateral'?'translate(44 10) skewX(-19) scale(.82 1)':'translate(-21 11) rotate(-7 320 180)';
 return `<svg viewBox="0 0 680 390" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vista ${view} del diseño ${iconicModels.find(m=>m.id===d.model).name}"><defs><linearGradient id="${gradientID}" x2=".3" y2="1"><stop stop-color="${lens}" stop-opacity="${tinted?.88:.22}"/><stop offset="1" stop-color="${lens}" stop-opacity="${tinted?.52:.07}"/></linearGradient><linearGradient id="acetate-shine" x2=".6" y2="1"><stop stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><ellipse cx="338" cy="313" rx="235" ry="18" fill="#353329" opacity=".09"/><g transform="${transform}">${view!=='frente'?`<path d="M${lx+4} 139 L${lx+91+extension} 60 Q${lx+100+extension} 53 ${lx+120+extension} 59 L${lx+246+extension} 98 M${rxPos+160} 133 L${rxPos+206+extension} 64 Q${rxPos+215+extension} 57 ${rxPos+195+extension} 58 L${rxPos+67} 87" stroke="${arm}" stroke-width="${armW}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`:''}<path d="${lensPath(lx,0)}" fill="url(#${gradientID})" stroke="${rim}" stroke-width="${thick}"/><path d="${lensPath(rxPos,1)}" fill="url(#${gradientID})" stroke="${rim}" stroke-width="${thick}"/><path d="M${innerL} 144 Q${center} ${144-d.bridgeCurve*.8} ${innerR} 144" fill="none" stroke="${bridge}" stroke-width="${Math.max(7,thick*.65)}" stroke-linecap="round"/>${d.model==='aviador'?`<path d="M${innerL-3} 116 Q${center} 89 ${innerR+3} 116" stroke="${bridge}" stroke-width="6" fill="none"/>`:''}<path d="M${lx+12} 133h11 M${rxPos+142} 133h11" stroke="#e8d6a1" stroke-width="3"/><path d="M${lx+30} 135 Q${lx+75} 122 ${lx+117} 135 M${rxPos+30} 135 Q${rxPos+75} 122 ${rxPos+117} 135" stroke="white" opacity=".3" fill="none" stroke-width="3"/>${d.use==='optico'&&d.lensType==='bi'?`<path d="M${lx+26} 217q55-33 110 0 M${rxPos+26} 217q55-33 110 0" fill="none" stroke="${lens}" opacity=".5"/>`:''}</g></svg>`;
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
