import {chromium} from 'playwright-core';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {manufacturingDocument} from '../public/manufacturing.js';

const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
const base=process.env.WORKBENCH_URL||'http://127.0.0.1:3000';
const digest=buffer=>createHash('sha256').update(buffer).digest('hex');
try{
 const context=await browser.newContext({viewport:{width:1600,height:1100},acceptDownloads:true}),page=await context.newPage(),errors=[],bad=[];
 page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)bad.push([response.status(),response.url()]);});
 const frame=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const design=()=>page.locator('#disena').evaluate(el=>JSON.parse(el.dataset.design));
 const rendered=()=>page.locator('#design-preview').evaluate(el=>JSON.parse(el.dataset.config));
 const property=async(id,value,key)=>{
  await page.locator('#'+id).fill(String(value));await page.locator('#'+id).press('Tab');
  await page.waitForFunction(({key,value})=>JSON.parse(document.querySelector('#design-preview').dataset.config||'{}')[key]===value,{key,value});
  assert.equal((await design())[key],value);assert.equal((await rendered())[key],value);
 };
 await page.goto(`${base}${process.env.WORKBENCH_PAGE||'/disena.html'}`);
 await page.waitForFunction(()=>document.querySelector('#disena').dataset.renderer==='webgl');await frame();
 assert.equal(await page.locator('#studio-plan').isVisible(),false);
 await page.locator('[data-panel="1"]').click();
 await property('precision-a',54.2,'lensWidth');await property('precision-dbl',18.4,'bridgeWidth');
 for(const depth of [2,3,4,6,8])await property('precision-depth',depth,'materialDepth');
 assert.match(await page.locator('#precision-summary').textContent(),/54.2.*18.4.*8 mm/);

 await page.locator('[data-stage="2d"]').click();assert.equal(await page.locator('#studio-plan').isVisible(),true);assert.equal(await page.locator('#design-preview').isVisible(),false);
 const beforePlan=await page.locator('#studio-plan .plan-rim').first().getAttribute('d');
 await property('precision-a',55.1,'lensWidth');assert.equal(await page.locator('#studio-plan').isVisible(),true);assert.equal(await page.locator('#design-preview').isVisible(),false,'Editing in the plan preserves the 2D viewport');
 assert.notEqual(await page.locator('#studio-plan .plan-rim').first().getAttribute('d'),beforePlan,'2D geometry follows metric edits');
 await page.waitForTimeout(400);await property('precision-dbl',19.2,'bridgeWidth');
 await page.locator('#studio-undo').click();assert.equal((await design()).bridgeWidth,18.4);
 await page.locator('#studio-redo').click();assert.equal((await design()).bridgeWidth,19.2);

 await page.locator('[data-stage="3d"]').click();await page.locator('#studio-projection').click();await page.locator('#studio-grid').click();await page.locator('#studio-wire').click();await frame();
 assert.equal(await page.locator('#design-preview').getAttribute('data-projection'),'orthographic');assert.equal(await page.locator('#design-preview').getAttribute('data-grid'),'true');assert.equal(await page.locator('#design-preview').getAttribute('data-wireframe'),'true');
 await page.locator('#studio-wire').click();await page.locator('#studio-grid').click();await page.locator('#studio-fit').click();await frame();
 const originalPixels=digest(await page.locator('#design-preview canvas').screenshot());

 // A connected frontal frame with two enclosed white openings; no hand traces.
 const source=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="200"><rect width="480" height="200" fill="white"/><g fill="none" stroke="black" stroke-width="10"><ellipse cx="140" cy="100" rx="70" ry="45"/><ellipse cx="340" cy="100" rx="70" ry="45"/><path d="M209 86 Q240 73 271 86"/></g></svg>');
 const reference=await sharp(source).png().toBuffer();
 await page.locator('[data-panel="0"]').click();await page.locator('#studio-extract-file').setInputFiles({name:'frontal-sintetico.png',mimeType:'image/png',buffer:reference});
 await page.waitForFunction(()=>!document.querySelector('#studio-apply-reference').disabled);
 assert.match(await page.locator('#studio-extract-status').textContent(),/Perfil detectado/);
 assert.equal(await page.locator('#studio-extract-preview svg').count(),1);
 await page.locator('#studio-apply-reference').click();await page.waitForFunction(()=>JSON.parse(document.querySelector('#design-preview').dataset.config||'{}').customContour?.length===128);await frame();
 const imported=await design();assert.equal(imported.customContour.length,128);assert.equal((await rendered()).customContour.length,128);
 assert.equal(await page.locator('#design-rounding').isDisabled(),true,'Imported aperture cannot be deformed by preset rounding');
 assert.notEqual(digest(await page.locator('#design-preview canvas').screenshot()),originalPixels,'Detected aperture changes the visible 3D object');
 await page.locator('[data-stage="2d"]').click();
 assert.notEqual(await page.locator('#studio-plan .plan-rim').first().getAttribute('d'),beforePlan,'Imported aperture updates the editable 2D plan');

 // The original reference upload also offers automatic reconstruction.
 await page.locator('#open-reference').click();await page.locator('#design-reference-photo').setInputFiles({name:'frontal-comparacion.png',mimeType:'image/png',buffer:reference});await page.waitForFunction(()=>!document.querySelector('#reference-apply-detected').disabled);await page.locator('#reference-apply-detected').click();assert.equal(await page.locator('#reference-dialog').evaluate(el=>el.open),false);assert.equal((await design()).customContour.length,128);

 // Assisted plan grips preserve symmetry and remain inside structural limits.
 const grip=page.locator('#studio-plan [data-grip="width"]');await grip.focus();const beforeGrip=(await design()).lensWidth;await grip.press('ArrowRight');assert.equal((await design()).lensWidth,Math.round((beforeGrip+.1)*100)/100);
 const glbEvent=page.waitForEvent('download');await page.locator('#studio-glb').click();const glb=await glbEvent;const binary=await readFile(await glb.path());assert.equal(binary.readUInt32LE(0),0x46546c67);assert.equal(binary.readUInt32LE(4),2);assert.equal(binary.readUInt32LE(8),binary.length);

 const downloadEvent=page.waitForEvent('download');await page.locator('#studio-project-save').click();const download=await downloadEvent;
 assert.equal(download.suggestedFilename(),'miscante-proyecto.json');const project=JSON.parse(await readFile(await download.path(),'utf8'));
 assert.equal(project.format,'miscante-eyewear');assert.equal(project.units,'mm');assert.deepEqual(project.design.customContour,imported.customContour);
 project.design.lensWidth=53.3;await page.locator('#studio-project-open').setInputFiles({name:'reabierto.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#disena').dataset.design).lensWidth===53.3);
 assert.equal((await rendered()).customContour.length,128);assert.equal(await page.locator('#studio-plan').isVisible(),true);

 const popupEvent=page.waitForEvent('popup');await page.locator('#studio-print').click();const popup=await popupEvent;
 await popup.waitForLoadState('domcontentloaded');assert.equal(await popup.locator('.sheet').count(),2);assert.equal(await popup.locator('.sheet svg[width="210mm"][height="297mm"]').count(),2);
 assert.equal(await popup.locator('[data-part="front"]').count(),1);assert.equal(await popup.locator('[data-part^="lens-"]').count(),2);assert.equal(await popup.locator('[data-part^="temple-"]').count(),2);
 const pdf=await popup.pdf({path:'/tmp/miscante-workbench-two-pages.pdf',preferCSSPageSize:true,printBackground:true});
 assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,2,'PDF contains exactly two A4 pages');
 await popup.close();
 const moduleChecks=manufacturingDocument(await design()).checks;
 assert.equal(moduleChecks.pageCount,2);assert.equal(moduleChecks.scale,'1:1');assert.equal(moduleChecks.unit,'mm');assert.equal(moduleChecks.frontConnected,true);
 assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);
 console.log('PASS: stock de acetato 2/3/4/6/8, medidas A/DBL, edición 2D persistente, deshacer/rehacer, ortogonal/retícula/aristas, extracción automática real, geometría compartida 2D/3D, proyecto JSON y PDF de exactamente dos A4.');
}finally{await browser.close();}
