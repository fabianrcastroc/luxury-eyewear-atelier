import {initDesigner} from './designer.js';
import {normalizeDesign} from './designer-model.js';
let toastTimer;
function notify(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),4000);}
function saveDesign(config){try{localStorage.setItem('miscante-design',JSON.stringify(normalizeDesign(config)));notify('Proyecto guardado en este dispositivo. Usa Guardar proyecto para descargar una copia JSON.');}catch{notify('No se pudo guardar. Descarga una copia con Guardar proyecto.');}}
initDesigner({notify,onAdd:({config})=>saveDesign(config)});
document.querySelector('#disena .designer-heading .eyebrow').textContent='FR / EYEWEAR STUDIO';
document.querySelector('#disena .preview-top > span').textContent='FR · DISEÑO EN VIVO';
document.querySelector('#standalone-save').addEventListener('click',()=>{const data=document.querySelector('#disena').dataset.design;if(data)saveDesign(JSON.parse(data));});
document.addEventListener('click',event=>{const close=event.target.closest('[data-close]');if(close)close.closest('dialog')?.close();if(event.target instanceof HTMLDialogElement){const bounds=event.target.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)event.target.close();}});

if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()));
