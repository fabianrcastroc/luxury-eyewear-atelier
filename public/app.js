import {products,money,totals,glasses,cartProduct,itemQuote} from './catalog.js';
import {initCollectionLenses} from './collection-lenses.js';
import {initDesigner} from './designer.js';
import {normalizeDesign,designQuote,designSummary,framePreview,frameColors,prescriptionError,prescriptionSignature} from './designer-model.js';
import {designMeasurements} from './frame-geometry.js';
const $ = s=>document.querySelector(s);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
let cart=read('miscante-cart',[]);
cart=Array.isArray(cart)?cart.filter(i=>i&&Number.isInteger(i.qty)&&i.qty>0&&i.qty<=10&&(products.some(p=>p.id===i.id)||i.custom===true&&/^custom-[a-f0-9-]{36}$/.test(i.id)||products.some(p=>p.id===i.productId)&&/^configured-[a-f0-9-]{36}$/.test(i.id))).map(i=>i.custom?{id:i.id,custom:true,config:normalizeDesign(i.config),qty:i.qty}:i.productId?{id:i.id,productId:i.productId,config:normalizeDesign(i.config),qty:i.qty}:{id:i.id,qty:i.qty}):[];
const cartRecipes=new Map();
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let favorites=read('miscante-favorites',[]); favorites=Array.isArray(favorites)?favorites.filter(id=>products.some(p=>p.id===id)):[];
let category='all'; let toastTimer;
const store=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{toast('El navegador no permite guardar datos. Se conservarán durante esta visita.');}};
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4000);}
const closeButton='<button class="close" data-close aria-label="Cerrar">×</button>';
function show(dialog,html){dialog.innerHTML=html;if(!dialog.open)dialog.showModal();}
function updateCart(){store('miscante-cart',cart);$('#cart-count').textContent=cart.reduce((n,i)=>n+i.qty,0);}
function render(){
 if(!$('#products'))return;
 const query=$('#search').value.trim().toLocaleLowerCase('es');
 let list=products.filter(p=>(category==='all'||category==='favoritos'&&favorites.includes(p.id)||p.category===category)&&`${p.name} ${p.color} ${p.material}`.toLocaleLowerCase('es').includes(query));
 const sort=$('#sort').value; if(sort==='price-up')list.sort((a,b)=>a.price-b.price);if(sort==='price-down')list.sort((a,b)=>b.price-a.price);if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
 $('#result-count').textContent=`${list.length} modelos encontrados`;
 $('#products').innerHTML=list.length?list.map(p=>`<article class="product"><div class="product-art" style="background:${p.bg}"><span class="product-tag">${p.tag}</span><button class="favorite ${favorites.includes(p.id)?'selected':''}" data-favorite="${p.id}" aria-label="${favorites.includes(p.id)?'Quitar de':'Añadir a'} favoritos: ${p.name}" aria-pressed="${favorites.includes(p.id)}">${favorites.includes(p.id)?'♥':'♡'}</button><button class="product-image" data-product="${p.id}" aria-label="Ver ${p.name}">${glasses(p)}</button><button class="quick-add" data-add="${p.id}">Elegir cristales +</button></div><div class="product-heading"><button data-product="${p.id}">${p.name}</button><span>Desde ${money(p.price)}</span></div><p>${p.category==='sol'?'Gafas de sol':'Montura óptica'} · ${p.material}</p><span class="color-dot" style="background:${p.hex}"></span><small>${p.color}</small></article>`).join(''):'<div class="empty"><h3>No encontramos modelos.</h3><p>Prueba otra búsqueda o explora toda la colección.</p><button class="button dark" id="reset-filters">Ver todas las gafas</button></div>';
}
function product(id){const p=products.find(p=>p.id===id);show($('#product-dialog'),`${closeButton}<div class="detail-art" style="background:${p.bg}">${glasses(p)}</div><div class="detail-copy"><p class="eyebrow">COLECCIÓN 01 · ${p.category==='sol'?'DE SOL':'ÓPTICAS'}</p><h2>${p.name}</h2><p>Precio base ${money(p.price)} <small>CLP</small></p><p>Una silueta ${p.shape==='round'?'redonda':p.shape==='cat'?'de líneas expresivas':'rectangular'} con presencia sutil. Comodidad y carácter para acompañar tu forma de mirar.</p><p><span class="color-dot" style="background:${p.hex}"></span> ${p.color}</p><dl><dt>Material</dt><dd>${p.material}</dd><dt>Lente · puente · patilla</dt><dd>${p.size} mm</dd><dt>Cristales</dt><dd>${p.category==='sol'?'Protección UV400':'Sin graduación'}</dd><dt>Incluye</dt><dd>Estuche y paño de microfibra</dd></dl><div id="product-lens-options"></div><small>Catálogo ilustrativo. Compra de demostración.</small></div>`);initCollectionLenses($('#product-lens-options'),p,({config,recipe})=>{const id=`configured-${crypto.randomUUID()}`;cart.push({id,productId:p.id,config,qty:1});if(recipe)cartRecipes.set(id,recipe);updateCart();$('#product-dialog').close();toast('Gafas y cristales añadidos a tu bolsa.');});}
function renderCart(){
 const t=totals(cart);
 const items=cart.map(i=>{
  const p=i.custom?null:cartProduct(i);
  const title=i.custom?'Tu diseño Miscante':p.name;
  const price=itemQuote(i).total;
  const photo=i.custom?framePreview(i.config):glasses(p);
  let description=i.custom?designSummary(i.config):p.color;
  let details='';
  if(i.custom){
   const d=i.config,measure=designMeasurements(d);
   description+=` · Aro ${frameColors.find(c=>c.id===d.rimColor).name} / Puente ${frameColors.find(c=>c.id===d.bridgeColor).name} / Brazos ${frameColors.find(c=>c.id===d.armColor).name}`;
   details=`<details class="cart-design-details"><summary>Ver especificaciones y precio</summary><dl><dt>Bordes del aro</dt><dd>${d.rounding}/100</dd><dt>Talla A / P / B</dt><dd>${measure.code}</dd><dt>Frontal aproximado</dt><dd>${measure.front} mm</dd><dt>Puente</dt><dd>${d.bridgeType} · ${d.bridgeHeight} · espesor ${d.bridgeThickness} mm</dd><dt>Borde nasal</dt><dd>${d.bridgeNasalCurve}/100 · borde del aro ${d.nasalProjection}/100 · medias lunas interiores</dd><dt>Brazos</dt><dd>${d.armStyle} · ambos brazos · ancho ${d.armWidth} mm</dd><dt>Cristal</dt><dd>${d.use==='sol'||d.sunOptical?d.lensColor:d.photo?'Fotocromático '+d.photoColor:'Transparente'}${d.blue&&d.use==='optico'?' · Bluelight':''}${d.ar?' · Antirreflejos':''}</dd></dl>${designQuote(d).lines.map(l=>`<p><span>${l.label}</span><span>${money(l.amount)}</span></p>`).join('')}</details>`;
  }else if(i.config){
   const d=i.config;description+=` · ${d.use==='optico'?'Con graduación':'Sin graduación'}`;
   details=`<details class="cart-design-details"><summary>Ver cristales y precio</summary><p>${d.use==='optico'?(d.lensType==='mono'?'Monofocales':d.lensType==='bi'?'Bifocales':'Multifocales'):'Sin graduación'}${d.blue?' · Luz azul':''}${d.ar?' · Antirreflejos':''}${d.photo?' · Fotocromático '+d.photoColor:''}${d.sunOptical?' · Sol óptico '+d.lensColor:''}</p>${itemQuote(i).lines.map(l=>`<p><span>${l.label}</span><span>${money(l.amount)}</span></p>`).join('')}</details>`;
  }
   if(i.config?.use==='optico')details+=`<div class="cart-recipe"><p>${cartRecipes.has(i.id)?`Receta adjunta localmente: ${escapeHTML(cartRecipes.get(i.id).name)}`:'Receta pendiente · puedes adjuntarla ahora o más adelante.'}</p><label class="text-link">${cartRecipes.has(i.id)?'Cambiar receta':'Adjuntar receta'}<input type="file" data-cart-recipe="${i.id}" accept=".pdf,.jpg,.jpeg,.png,.webp" aria-label="Adjuntar receta a tus gafas"></label>${cartRecipes.has(i.id)?`<button type="button" class="text-link" data-remove-recipe="${i.id}">Quitar</button>`:''}<small>Solo durante esta visita. No se envía ni se conserva al recargar.</small></div>`;
  return `<article class="cart-item ${i.custom?'custom-cart-item':''}"><div style="background:${p?.bg||'#ebe7dc'}">${photo}</div><section><h3>${title}</h3><small>${description}</small><p>${money(price)}</p><div class="quantity"><button data-qty="${i.id}" data-delta="-1" aria-label="Reducir cantidad de ${title}">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-delta="1" aria-label="Aumentar cantidad de ${title}">+</button><button class="remove" data-remove="${i.id}">Eliminar</button></div></section>${details}</article>`;
 }).join('');
 show($('#cart-dialog'),`${closeButton}<p class="eyebrow">TUS ESENCIALES</p><h2>Tu bolsa <small>(${cart.reduce((n,i)=>n+i.qty,0)})</small></h2>${cart.length?`<div class="cart-items">${items}</div><div class="totals"><p>Subtotal <span>${money(t.subtotal)}</span></p><p>Envío <span>${t.shipping?money(t.shipping):'Sin costo'}</span></p><p class="total">Total <span>${money(t.total)} CLP</span></p></div><button id="checkout" class="button dark full">Continuar <span>→</span></button><p class="fine">Compra de demostración. No se realizarán cargos. Los diseños graduados requieren validación de receta y cotización final.</p>`:'<div class="empty"><p>Tu próxima perspectiva te espera.</p><button class="button dark" data-close>Seguir explorando →</button></div>'}`);
}
function checkout(){show($('#cart-dialog'),`${closeButton}<p class="eyebrow">ÚLTIMO PASO · DEMOSTRACIÓN</p><h2>Hazlo tuyo.</h2><p class="fine">No ingreses datos reales de pago. Este formulario no envía información ni crea un pedido comercial.</p><form id="checkout-form"><label>Nombre<input name="name" autocomplete="name" required maxlength="100"></label><label>Correo electrónico<input name="email" type="email" autocomplete="email" required maxlength="254"></label><label>Dirección de entrega<input name="address" autocomplete="street-address" required maxlength="200"></label><label>Ciudad<input name="city" autocomplete="address-level2" required maxlength="100"></label><label class="checkbox"><input type="checkbox" required> Entiendo que esta es una compra de demostración.</label><div class="totals"><p class="total">Total simulado <span>${money(totals(cart).total)}</span></p></div><button class="button dark full">Confirmar pedido de prueba <svg class="arrow" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button><button type="button" id="back-cart" class="text-link">Volver a la bolsa</button></form>`);}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-close'))b.closest('dialog').close();
 if(b.dataset.product)product(b.dataset.product);
 if(b.dataset.add)product(b.dataset.add);
 if(b.dataset.favorite){const id=b.dataset.favorite;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];store('miscante-favorites',favorites);render();}
 if(b.dataset.category){category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('active',x===b));render();}
 if(b.dataset.qty){const i=cart.find(i=>i.id===b.dataset.qty);if(i){i.qty=Math.min(10,i.qty+Number(b.dataset.delta));cart=cart.filter(x=>x.qty>0);if(i.qty<=0)cartRecipes.delete(i.id);updateCart();renderCart();}}
 if(b.dataset.remove){cartRecipes.delete(b.dataset.remove);cart=cart.filter(x=>x.id!==b.dataset.remove);updateCart();renderCart();}
 if(b.dataset.removeRecipe){cartRecipes.delete(b.dataset.removeRecipe);renderCart();}
 if(b.id==='menu-toggle')$('#menu-dialog').showModal();
 if(b.id==='cart-toggle')renderCart();if(b.id==='checkout')checkout();if(b.id==='back-cart')renderCart();
 if(b.id==='search-toggle'&&!$('#search-bar')){location.href='./coleccion.html?buscar=1';return;}
 if(b.id==='search-toggle'){$('#search-bar').hidden=!$('#search-bar').hidden;if(!$('#search-bar').hidden){$('#coleccion').scrollIntoView();$('#search').focus();}}
 if(b.id==='clear-search'){$('#search').value='';render();}
 if(b.id==='reset-filters'){category='all';$('#search').value='';document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('active',x.dataset.category==='all'));render();}
 if(b.id==='contact-open')show($('#info-dialog'),`${closeButton}<p class="eyebrow">CONVERSEMOS</p><h2>Tu mirada importa.</h2><p>El canal de atención estará disponible cuando se habilite la tienda. Por ahora puedes explorar la colección y probar tu compra sin cargos.</p><button class="button dark" data-close>Entendido</button>`);
 if(b.dataset.info)show($('#info-dialog'),`${closeButton}<h2>${b.dataset.info==='privacy'?'Tu privacidad':'Términos de la demostración'}</h2><p>${b.dataset.info==='privacy'?'El carrito, los favoritos y la suscripción de prueba se guardan únicamente en este navegador. No utilizamos analítica ni enviamos formularios a un servidor. Los datos de entrega de prueba solo se mantienen en memoria mientras está abierto el formulario. Las recetas se adjuntan temporalmente en memoria durante esta visita y nunca se envían a un servidor ni se guardan en el navegador. Al recargar o cambiar de página se deben adjuntar nuevamente.':'Los productos, precios y atributos son ilustrativos. Esta web permite probar una experiencia de compra; no cobra, reserva inventario ni genera contratos o pedidos reales. Antes de abrir la venta se deben confirmar los productos, políticas y medios de pago.'}</p><button data-close class="button dark">Entendido</button>`);
});
document.addEventListener('submit',e=>{
 if(e.target.id==='newsletter-form'){e.preventDefault();store('miscante-newsletter',true);e.target.reset();toast('¡Gracias! Tu suscripción de prueba quedó registrada en este navegador.');}
 if(e.target.id==='checkout-form'){e.preventDefault();if(!e.target.reportValidity())return;cart=[];cartRecipes.clear();updateCart();show($('#cart-dialog'),`${closeButton}<div class="success-mark">✓</div><p class="eyebrow">PEDIDO DE PRUEBA COMPLETADO</p><h2>Una nueva perspectiva.</h2><p>Has completado la experiencia de compra. No se ha cobrado ni enviado ningún pedido.</p><button class="button dark full" data-close>Volver a la colección <svg class="arrow" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button>`);}
});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
$('#search')?.addEventListener('input',render);$('#sort')?.addEventListener('change',render);updateCart();render();

initDesigner({notify:toast,onAdd:({config,recipe})=>{
 const id=`custom-${crypto.randomUUID()}`;
 cart.push({id,custom:true,config,qty:1});if(recipe)cartRecipes.set(id,recipe);updateCart();toast('Tu diseño se añadió a la bolsa.');
}});
let cartUploadRun=0;
document.addEventListener('change',async e=>{
 const id=e.target.dataset.cartRecipe;if(!id)return;
 const run=++cartUploadRun,file=e.target.files[0];if(!file)return;
 let error=prescriptionError(file);
 if(!error){try{if(!prescriptionSignature(new Uint8Array(await file.slice(0,12).arrayBuffer()),file))error='El archivo no contiene una imagen o PDF compatible.';}catch{error='No se pudo leer la receta.';}}
 if(run!==cartUploadRun)return;
 if(error){e.target.value='';toast(error);return;}
 if(!cart.some(i=>i.id===id&&i.config?.use==='optico'))return;
 cartRecipes.set(id,file);renderCart();toast('Receta adjunta localmente durante esta visita.');
});

if(new URLSearchParams(location.search).has('buscar')&&$('#search-bar')){$('#search-bar').hidden=false;$('#search').focus();}
if(document.body.dataset.page==='home'&&location.hash==='#disena')location.replace('./disena.html');
if(document.body.dataset.page==='home'&&location.hash==='#coleccion')location.replace('./coleccion.html');
document.querySelectorAll('nav a').forEach(a=>{if(a.getAttribute('href')===`./${location.pathname.split('/').pop()||'index.html'}`)a.setAttribute('aria-current','page');});
