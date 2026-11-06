import {money,productQuote} from './catalog.js';
import {normalizeDesign,lensTypes,photoColors,lensColors,prescriptionError,prescriptionSignature} from './designer-model.js';
export function initCollectionLenses(root,product,onAdd){
 let config=normalizeDesign({use:'sol'}),recipe=null,uploadRun=0,pending=false;
 const options=list=>list.map(x=>`<option value="${x.id}">${x.name}${x.price?` · +${money(x.price)}`:''}</option>`).join('');
 const treatments=[['blue','Filtro de luz azul',20000],['ar','Antirreflejos',18000],['photo','Fotocromático',45000],['sunOptical','Sol óptico',25000]];
 root.innerHTML=`<form id="collection-lens-form" class="collection-lenses"><h3>Elige tus cristales</h3><label for="collection-use">Graduación</label><select id="collection-use" data-lens-setting="use"><option value="sol">Sin graduación · incluidos</option><option value="optico">Con graduación médica</option></select><section id="collection-optical" hidden><label for="collection-lensType">Tipo de cristales</label><select id="collection-lensType" data-lens-setting="lensType">${options(lensTypes)}</select>${treatments.map(([id,name,price])=>`<label class="treatment"><input type="checkbox" id="collection-${id}" data-lens-setting="${id}"><span>${name}</span><b>+${money(price)}</b></label>`).join('')}<p class="control-note">Sol óptico excluye luz azul, fotocromático y antirreflejos. Fotocromático admite antirreflejos.</p><div id="collection-photo-field" hidden><label for="collection-photoColor">Color fotocromático</label><select id="collection-photoColor" data-lens-setting="photoColor">${options(photoColors)}</select></div><div id="collection-sun-field" hidden><label for="collection-lensColor">Color de sol óptico</label><select id="collection-lensColor" data-lens-setting="lensColor">${options(lensColors)}</select></div><label for="collection-recipe">Receta médica · PDF o imagen</label><input type="file" id="collection-recipe" accept=".pdf,.jpg,.jpeg,.png,.webp"><p id="collection-recipe-status" role="status"></p><button type="button" id="collection-remove-recipe" class="text-link" hidden>Quitar receta</button><label class="checkbox"><input type="checkbox" id="collection-recipe-later"> Adjuntaré mi receta más adelante.</label><p class="control-note">El archivo queda solo en memoria durante esta página. No se envía ni se conserva al recargar. No uses una receta real para probar.</p></section><div id="collection-price-lines"></div><p class="collection-total">Total estimado <strong id="collection-total" aria-live="polite"></strong></p><p class="control-note">Precios en CLP por el par. Graduación, índice y viabilidad requieren validación óptica y cotización final.</p><p id="collection-lens-error" role="alert" class="field-error"></p><button type="submit" class="button dark full">Añadir a la bolsa <span>+</span></button></form>`;
 const $=s=>root.querySelector(s);
 function sync(){
  config=normalizeDesign(config);const optical=config.use==='optico';
  $('#collection-optical').hidden=!optical;
  for(const [key] of treatments){const input=$(`#collection-${key}`);input.checked=config[key];input.disabled=['blue','ar','photo'].includes(key)&&config.sunOptical;}
  $('#collection-photo-field').hidden=!config.photo;$('#collection-sun-field').hidden=!config.sunOptical;
  const quote=productQuote(product.id,config);$('#collection-price-lines').innerHTML=quote.lines.map(l=>`<p><span>${l.label}</span><span>${money(l.amount)}</span></p>`).join('');$('#collection-total').textContent=money(quote.total);
 }
 root.addEventListener('change',e=>{const key=e.target.dataset.lensSetting;if(!key)return;config[key]=e.target.type==='checkbox'?e.target.checked:e.target.value;$('#collection-lens-error').textContent='';sync();});
 $('#collection-recipe').addEventListener('change',async e=>{
  const run=++uploadRun,file=e.target.files[0];recipe=null;$('#collection-remove-recipe').hidden=true;$('#collection-recipe-status').textContent='';if(!file)return;
  pending=true;let error=prescriptionError(file);
  try{if(!error&&!prescriptionSignature(new Uint8Array(await file.slice(0,12).arrayBuffer()),file))error='El contenido no coincide con un PDF o imagen compatible.';}catch{error='No se pudo leer el archivo.';}
  if(run!==uploadRun)return;pending=false;
  if(error){e.target.value='';$('#collection-lens-error').textContent=error;return;}
  recipe=file;$('#collection-recipe-status').textContent=`Adjunta localmente: ${file.name}`;$('#collection-remove-recipe').hidden=false;$('#collection-lens-error').textContent='';
 });
 $('#collection-remove-recipe').addEventListener('click',()=>{uploadRun++;pending=false;recipe=null;$('#collection-recipe').value='';$('#collection-recipe-status').textContent='';$('#collection-remove-recipe').hidden=true;});
 $('#collection-lens-form').addEventListener('submit',e=>{e.preventDefault();if(pending){$('#collection-lens-error').textContent='Espera a que termine la validación del archivo.';return;}if(config.use==='optico'&&!recipe&&!$('#collection-recipe-later').checked){$('#collection-lens-error').textContent='Adjunta tu receta o indica que la enviarás más adelante.';$('#collection-recipe').focus();return;}onAdd({config:normalizeDesign(config),recipe:config.use==='optico'?recipe:null});});
 sync();
}
