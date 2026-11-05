import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],posts=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 await page.goto('http://127.0.0.1:3000/index.html');
 assert.equal(await page.locator('#products,#disena').count(),0);
 await page.locator('nav a[href="./coleccion.html"]').click();
 await page.locator('.product').first().waitFor();assert.equal(await page.locator('.product').count(),6);assert.equal(await page.locator('#disena').count(),0);
 await page.locator('nav a[href="./disena.html"]').click();
 await page.waitForFunction(()=>document.querySelector('#disena').dataset.renderer==='webgl');
 assert.equal(await page.locator('[data-model]').count(),5);
 assert.equal(await page.locator('.model-option img').count(),5);await page.locator('[data-preview-mode="photo"]').click();await page.waitForFunction(()=>document.querySelector('#reference-photo-view img')?.naturalWidth>0);await page.locator('[data-preview-mode="editable"]').click();
 assert.equal(await page.locator('#design-total').textContent(),'$209.000');
 for(const model of ['rectangular','cat-eye','aviador','clubmaster','panto']){await page.locator(`[data-model="${model}"]`).click();assert.equal(await page.locator('#design-total').textContent(),'$209.000');}
 const canvas=page.locator('#design-preview canvas');const original=await canvas.screenshot();
 await page.locator('#design-rounding').fill('10');await page.locator('#design-thickness').fill('10');await page.locator('#design-armLength').fill('155');
 await page.locator('#design-armStyle').selectOption('sable');await page.locator('#design-armStyleRight').selectOption('gancho');await page.locator('[data-color-part="rimColor"][data-color="negro"]').click();
 assert.equal(await page.locator('#design-total').textContent(),'$209.000');assert.notDeepEqual(await canvas.screenshot(),original);
 await page.locator('[data-view="lateral"]').click();
 await page.locator('[data-use="optico"]').click();await page.locator('#design-lensType').selectOption('multi');
 await page.locator('[data-setting="ar"]').check();await page.locator('[data-setting="photo"]').check();
 assert.equal(await page.locator('#design-total').textContent(),'$417.000');
 assert.deepEqual(await page.locator('#design-photoColor option').allTextContents(),['Gris negro','Café','Lila']);
 for(const color of ['gris','cafe','lila']){await page.locator('#design-photoColor').selectOption(color);assert.equal(await page.locator('#design-total').textContent(),'$417.000');}
 await page.locator('[data-setting="blue"]').check();assert.equal(await page.locator('#design-total').textContent(),'$437.000');
 await page.locator('[data-setting="sunOptical"]').check();assert.equal(await page.locator('#design-total').textContent(),'$379.000');
 for(const treatment of ['blue','photo','ar']){const input=page.locator(`[data-setting="${treatment}"]`);assert.equal(await input.isChecked(),false);assert.equal(await input.isDisabled(),true);}
 assert.equal(await page.locator('#photo-color-field').isVisible(),false);
 await page.locator('[data-setting="sunOptical"]').uncheck();await page.locator('[data-setting="photo"]').check();await page.locator('[data-setting="ar"]').check();
 await page.locator('#designer-form button[type="submit"]').click();assert.match(await page.locator('#design-form-error').textContent(),/Adjunta/);
 const pdf={name:'receta-prueba.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nPrueba sin datos médicos\n%%EOF')};
 await page.locator('#design-recipe').setInputFiles({name:'falsa.pdf',mimeType:'application/pdf',buffer:Buffer.from('not a pdf')});await page.getByText('El contenido no coincide con un PDF o una imagen compatible.',{exact:true}).waitFor();
 await page.locator('#design-recipe').setInputFiles(pdf);await page.getByText(/Adjunta localmente: receta-prueba.pdf/).waitFor();
 await page.locator('#design-save').click();await page.locator('#designer-form button[type="submit"]').click();await page.locator('#cart-toggle').click();
 assert.match(await page.locator('.cart-recipe').textContent(),/receta-prueba.pdf/);assert.match(await page.locator('.total').textContent(),/417.000/);
 assert.ok(!(await page.evaluate(()=>localStorage.getItem('miscante-cart'))).includes('receta-prueba.pdf'));
 await page.reload();await page.waitForFunction(()=>document.querySelector('#disena').dataset.renderer==='webgl');
 assert.equal(await page.locator('#design-total').textContent(),'$417.000');await page.locator('#cart-toggle').click();assert.match(await page.locator('.cart-recipe').textContent(),/Receta pendiente/);
 await page.locator('[data-cart-recipe]').setInputFiles(pdf);await page.getByText(/Receta adjunta localmente: receta-prueba.pdf/).waitFor();
 await page.locator('.cart-design-details summary').click();assert.match(await page.locator('.cart-design-details').textContent(),/sable \/ gancho/);
 await page.locator('#checkout').click();await page.locator('input[name="name"]').fill('Visitante de prueba');await page.locator('input[name="email"]').fill('prueba@example.com');await page.locator('input[name="address"]').fill('Dirección de prueba 123');await page.locator('input[name="city"]').fill('Santiago');await page.locator('#checkout-form input[type="checkbox"]').check();await page.locator('#checkout-form button:not([type])').click();await page.getByText('PEDIDO DE PRUEBA COMPLETADO',{exact:true}).waitFor();await page.locator('#cart-dialog [data-close]').first().click();
 await page.locator('#design-reset').click();assert.equal(await page.locator('#design-total').textContent(),'$209.000');
 await page.locator('.reference-tools summary').click();
 const photo=await readFile('.github/miscante-preview.png');
 await page.locator('#design-reference-photo').setInputFiles({name:'referencia.png',mimeType:'image/png',buffer:photo});await page.locator('#reference-photo-view img').waitFor();assert.equal(await page.locator('[data-preview-mode="photo"]').getAttribute('aria-pressed'),'true');
 await page.locator('[data-preview-mode="editable"]').click();assert.equal(await canvas.isVisible(),true);
 const json={asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:{POSITION:0}}]}],accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3',min:[-1,0,0],max:[1,1,0]}],bufferViews:[{buffer:0,byteOffset:0,byteLength:36}],buffers:[{byteLength:36}]};
 const str=JSON.stringify(json),padded=str+' '.repeat((4-str.length%4)%4),chunk=Buffer.from(padded),bin=Buffer.from(new Float32Array([-1,0,0,1,0,0,0,1,0]).buffer),glb=Buffer.alloc(12+8+chunk.length+8+bin.length);
 glb.writeUInt32LE(0x46546c67,0);glb.writeUInt32LE(2,4);glb.writeUInt32LE(glb.length,8);glb.writeUInt32LE(chunk.length,12);glb.writeUInt32LE(0x4e4f534a,16);chunk.copy(glb,20);glb.writeUInt32LE(bin.length,20+chunk.length);glb.writeUInt32LE(0x004e4942,24+chunk.length);bin.copy(glb,28+chunk.length);
 await page.locator('#design-reference-glb').setInputFiles({name:'molde.glb',mimeType:'model/gltf-binary',buffer:glb});await page.waitForFunction(()=>document.querySelector('[data-preview-mode="model"]').getAttribute('aria-pressed')==='true');
 assert.equal(await page.locator('#reference-error').textContent(),'');
 await page.locator('[data-preview-mode="editable"]').click();
 await page.locator('#design-reset').click();
 for(const url of ['index.html','coleccion.html','disena.html']){await page.goto(`http://127.0.0.1:3000/${url}`);if(url==='disena.html')await page.waitForFunction(()=>document.querySelector('#disena').dataset.renderer==='webgl');for(const width of [390,320,768]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${url} a ${width}px`);}}
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:3000/disena.html');await page.waitForFunction(()=>document.querySelector('#disena').dataset.renderer==='webgl');await page.screenshot({path:'/tmp/miscante-studio-final.png',fullPage:false});
 await page.screenshot({path:'.github/miscante-studio-preview.png'});
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);
 console.log('PASS: tres páginas, navegación, 3D real, cinco siluetas, brazos combinables, base $209.000, tratamientos excluyentes, colores fotocromáticos, receta, bolsa, guardado, foto y modelo GLB reemplazables, compra de prueba y móvil.');
}finally{await browser.close();}
