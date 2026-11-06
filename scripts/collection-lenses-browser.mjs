import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {products,money} from '../public/catalog.js';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],posts=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 await page.goto('http://127.0.0.1:3000/coleccion.html');
 const pdf={name:'receta-coleccion-prueba.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nPrueba sin datos médicos\n%%EOF')};
 for(const [index,product] of products.entries()){
  await page.locator(`.product-heading [data-product="${product.id}"]`).click();
  assert.equal(await page.locator('#collection-total').textContent(),money(product.price));
  await page.locator('#collection-use').selectOption('optico');await page.locator('#collection-lensType').selectOption('multi');await page.locator('#collection-photo').check();await page.locator('#collection-ar').check();
  assert.equal(await page.locator('#collection-total').textContent(),money(product.price+208000));
  assert.deepEqual(await page.locator('#collection-photoColor option').allTextContents(),['Gris negro','Café','Lila']);await page.locator('#collection-photoColor').selectOption('lila');await page.locator('#collection-blue').check();assert.equal(await page.locator('#collection-total').textContent(),money(product.price+228000));
  await page.locator('#collection-sunOptical').check();assert.equal(await page.locator('#collection-total').textContent(),money(product.price+170000));for(const key of ['blue','photo','ar']){assert.equal(await page.locator(`#collection-${key}`).isChecked(),false);assert.equal(await page.locator(`#collection-${key}`).isDisabled(),true);}
  await page.locator('#collection-sunOptical').uncheck();await page.locator('#collection-photo').check();await page.locator('#collection-ar').check();
  await page.locator('#collection-lens-form button[type="submit"]').click();assert.match(await page.locator('#collection-lens-error').textContent(),/Adjunta/);
  if(index===0){await page.locator('#collection-recipe').setInputFiles({name:'falsa.pdf',mimeType:'application/pdf',buffer:Buffer.from('invalido')});await page.getByText('El contenido no coincide con un PDF o imagen compatible.',{exact:true}).waitFor();await page.locator('#collection-recipe').setInputFiles(pdf);await page.getByText('Adjunta localmente: receta-coleccion-prueba.pdf',{exact:true}).waitFor();await page.locator('#product-dialog').screenshot({path:'.github/miscante-collection-lenses.png'});}else await page.locator('#collection-recipe-later').check();
  await page.locator('#collection-lens-form button[type="submit"]').click();assert.equal(await page.locator('#product-dialog').evaluate(e=>e.open),false);
 }
 await page.locator('#cart-toggle').click();assert.equal(await page.locator('.cart-item').count(),6);assert.match(await page.locator('.cart-recipe').first().textContent(),/receta-coleccion/);
 const stored=await page.evaluate(()=>localStorage.getItem('miscante-cart'));assert.ok(!stored.includes(pdf.name));const rows=JSON.parse(stored);assert.equal(new Set(rows.map(r=>r.id)).size,6);assert.ok(rows.every(r=>r.config.photoColor==='lila'&&r.config.photo&&r.config.ar));
 await page.reload();await page.locator('#cart-toggle').click();assert.ok((await page.locator('.cart-recipe').allTextContents()).every(t=>t.includes('Receta pendiente')));await page.locator('[data-cart-recipe]').first().setInputFiles(pdf);await page.getByText('Receta adjunta localmente: receta-coleccion-prueba.pdf',{exact:true}).waitFor();await page.locator('#cart-dialog [data-close]').click();
 // Two configurations of the same frame remain distinct cart items.
 await page.locator('.product-heading [data-product="solar"]').click();await page.locator('#collection-lens-form button[type="submit"]').click();await page.locator('#cart-toggle').click();assert.equal(await page.locator('.cart-item').count(),7);await page.locator('[data-delta="1"]').last().click();assert.match(await page.locator('.cart-item').last().textContent(),/159.000/);await page.locator('#checkout').click();assert.ok((await page.locator('#checkout-form .total').textContent()).includes(money(products.reduce((sum,p)=>sum+p.price+208000,0)+318000)));await page.locator('#cart-dialog [data-close]').click();
 for(const width of [320,390,768]){await page.setViewportSize({width,height:844});await page.locator('.product-heading [data-product="forma"]').click();await page.locator('#collection-use').selectOption('optico');await page.locator('#collection-photo').check();assert.equal(await page.locator('#product-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true);await page.locator('#product-dialog [data-close]').click();}
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);console.log('PASS: seis fichas con graduación, precios, exclusiones, tres fotocromáticos, receta válida, variantes, persistencia, bolsa, checkout y móvil.');
}finally{await browser.close();}
