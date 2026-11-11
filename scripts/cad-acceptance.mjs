import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {mkdir,readFile} from 'node:fs/promises';
import {frameContour,lensContour,hingeGeometry} from '../public/frame-geometry.js';
const base=process.env.CAD_URL||'http://127.0.0.1:3035';
const route=process.env.CAD_PAGE||'/fr/';
const output=process.env.CAD_ARTIFACTS||'/tmp/cad-acceptance';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000},acceptDownloads:true}),errors=[],bad=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)bad.push([r.status(),r.url()]);});
 const design=()=>page.locator('#disena').evaluate(el=>JSON.parse(el.dataset.design));
 const frame=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const number=async(id,key,value)=>{await page.locator('#'+id).fill(String(value));await page.locator('#'+id).press('Tab');await page.waitForFunction(({key,value})=>JSON.parse(document.querySelector('#disena').dataset.design)[key]===value,{key,value});await frame();};
 const select=async(id,key,value)=>{await page.locator('#'+id).selectOption(value);await page.waitForFunction(({key,value})=>JSON.parse(document.querySelector('#disena').dataset.design)[key]===value,{key,value});await frame();};
 await page.goto(base+route);await page.waitForFunction(()=>document.querySelector('#disena')?.dataset.renderer==='webgl');await frame();
 assert.equal(await page.locator('link[data-cad-style]').evaluate(el=>!!el.sheet),true,'CAD stylesheet actually loads at deployment subpath');
 assert.equal(await page.locator('.cad-tree [role=treeitem]').count(),6);assert.equal(await page.locator('.cad-menu').count(),4);assert.equal(await page.locator('.cad-ribbon [data-tool]').count(),4);
 assert.equal(await page.locator('#design-bridgeNasalCurve').isVisible(),false,'Bridge nasal sculpting removed from interface');
 assert.equal(await page.locator('#precision-bridge-wall').count(),0,'No inert bridge wall control');
 assert.equal(await page.locator('#precision-bridge-height').count(),0,'No inert bridge height control');
 await page.screenshot({path:output+'/perspective.png'});
 const before=await design(),outerBefore=frameContour(before,1),hingeBefore=hingeGeometry(before,1).anchor,apertureBefore=lensContour(before,1);
 assert.equal(before.wallMode,'inward');await number('precision-wall','thickness',6);const after=await design();
 assert.deepEqual(frameContour(after,1),outerBefore,'Wall consumes inner opening and preserves exterior');assert.deepEqual(hingeGeometry(after,1).anchor,hingeBefore,'Wall does not move hinge or alter frontal size');assert.notDeepEqual(lensContour(after,1),apertureBefore,'Wall width changes actual inner opening');
 await number('precision-wall','thickness',4);
 await select('precision-hinge','hingeMode','box');const boxed=hingeGeometry(await design(),1);assert.ok(boxed.boxOutline.length>=4);await select('precision-hinge','hingeMode','hidden');assert.equal(hingeGeometry(await design(),1).boxOutline.length,0);
 await number('precision-nasal','nasalAngle',10);await number('precision-temporal-lift','temporalLift',5);await number('precision-temporal-reach','temporalReach',3);
 await page.locator('.cad-stage-tabs [data-stage=quad]').click();assert.equal(await page.locator('.cad-view:visible').count(),4);assert.equal(await page.locator('#cad-top-plan svg').count(),1);assert.equal(await page.locator('#cad-side-plan svg').count(),1);await page.screenshot({path:output+'/four-views.png'});
 await page.locator('[data-select-part=bridge]').click();assert.equal(await page.locator('#cad-selection-label').textContent(),'Puente');
 await page.locator('[data-layer=rims]').click();assert.equal(await page.locator('#studio-plan [data-part=rims]').count(),0);await page.locator('[data-layer=rims]').click();assert.equal(await page.locator('#studio-plan [data-part=rims]').count(),1,'The frontal plan is one united outline without artificial bridge seams');
 await page.locator('.cad-ribbon [data-tool=curve]').click();await page.locator('.cad-stage-tabs [data-stage="2d"]').click();assert.equal(await page.locator('#studio-plan [data-grip]').count(),3);
 const grip=page.locator('#studio-plan [data-grip=temporalLift]');await grip.focus();const lift=(await design()).temporalLift;await grip.press('ArrowUp');await page.waitForFunction(lift=>JSON.parse(document.querySelector('#disena').dataset.design).temporalLift>lift,lift);
 await page.locator('#studio-undo').click();assert.equal((await design()).temporalLift,lift);await page.locator('#studio-redo').click();assert.ok((await design()).temporalLift>lift);
 await page.locator('.cad-ribbon [data-tool=measure]').click();const measureBox=await page.locator('#studio-plan').boundingBox();await page.mouse.click(measureBox.x+measureBox.width*.25,measureBox.y+measureBox.height*.7);await page.mouse.click(measureBox.x+measureBox.width*.65,measureBox.y+measureBox.height*.7);const measured=await page.locator('.cad-measurement text').textContent();assert.ok(parseFloat(measured)>0);assert.match(await page.locator('#cad-command-message').textContent(),new RegExp(parseFloat(measured).toFixed(2).replace('.','\\.')),'Command and drawing report the same nonzero metric distance');
 await number('precision-arm-bend','armBendAngle',30);await select('precision-tip','tipShape','diamond');await number('precision-tip-size','tipSize',7);
 await page.locator('.cad-stage-tabs [data-stage="3d"]').click();await page.locator('[data-cad-view=lateral]').click();await frame();await page.screenshot({path:output+'/side.png'});await page.locator('[data-cad-view=frente]').click();await frame();await page.screenshot({path:output+'/front.png'});
 // Verify the new editable geometry and actual STL download through the UI.
 await select('precision-wall-mode','wallMode','outward');await number('precision-wall','thickness',6);
 await number('precision-bridge-gauge','bridgeGauge',3);await number('precision-bridge-rise','bridgeRise',3);
 await page.locator('#cad-job-name').fill('Trabajo de prueba');await page.locator('#cad-job-name').dispatchEvent('change');assert.equal((await design()).jobName,'Trabajo de prueba');
 await page.locator('#studio-stl-part').selectOption('front');const stlEvent=page.waitForEvent('download');await page.locator('#studio-stl').click();const stl=await stlEvent,stlBytes=await readFile(await stl.path());assert.equal(stlBytes.length,84+stlBytes.readUInt32LE(80)*50);assert.ok(stlBytes.readUInt32LE(80)>100);
 // Reset local changes before plotting standard model in each paper size.
 await page.locator('.cad-menu summary').first().click();await page.locator('[data-command=new]').click();await frame();
 await page.locator('[data-panel="1"]').click();
 for(const paper of ['a4','carta','oficio']){
  await page.locator('#studio-paper').selectOption(paper);const event=page.waitForEvent('popup');await page.locator('#studio-print').click();const popup=await event;await popup.waitForLoadState('domcontentloaded');
  assert.equal(await popup.locator('.sheet').count(),2);assert.doesNotMatch(await popup.locator('.sheet').first().textContent(),/FR eyewear|MISCANTE|Imprimir|Comprobar/);assert.equal(await popup.locator('[data-part=front]').count(),1);assert.equal(await popup.locator('[data-part^="nasal-pad-"]').count(),2);assert.equal(await popup.locator('.sheet').nth(0).locator('[data-part^="optical-lens-"]').count(),2);assert.equal(await popup.locator('.sheet').nth(1).locator('[data-part^="nasal-pad-"]').count(),2);assert.equal(await popup.locator('[data-part^="temple-"]').count(),2);
  const pdf=await popup.pdf({path:output+'/'+paper+'.pdf',preferCSSPageSize:true,printBackground:true});assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,2);await popup.close();
 }
 const downloadEvent=page.waitForEvent('download');await page.locator('#studio-project-save').click();const download=await downloadEvent;const saved=JSON.parse(await readFile(await download.path(),'utf8'));assert.equal(saved.units,'mm');assert.equal(saved.design.wallMode,'inward');
 const synthetic=await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="200"><rect width="480" height="200" fill="white"/><g stroke="#101010" stroke-width="10" fill="#444"><ellipse cx="140" cy="100" rx="70" ry="45"/><ellipse cx="340" cy="100" rx="70" ry="45"/><path d="M209 86Q240 73 271 86" fill="none"/></g></svg>')).png().toBuffer();
 await page.locator('#studio-extract-file').setInputFiles({name:'referencia-frontal.png',mimeType:'image/png',buffer:synthetic});await page.waitForFunction(()=>!document.querySelector('#studio-apply-reference').disabled);await page.locator('#studio-apply-reference').click();await page.waitForFunction(()=>JSON.parse(document.querySelector('#design-preview').dataset.config).customContour?.length===128);
 const glbEvent=page.waitForEvent('download');await page.locator('#studio-glb').click();const glb=await glbEvent,binary=await readFile(await glb.path());assert.equal(binary.readUInt32LE(0),0x46546c67);assert.equal(binary.readUInt32LE(8),binary.length);
 for(const width of [320,390,768]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'No horizontal document overflow at '+width);if(width<=760){await page.locator('[data-panel="0"]').click();assert.equal(await page.locator('.cad-mobile-models .model-grid').isVisible(),true,'Templates remain usable on mobile');assert.equal(await page.locator('.cad-mobile-models .cad-import-drop').isVisible(),true,'Photo import remains usable on mobile');await page.locator('.cad-mobile-models [data-model="curvo"]').click();await page.waitForFunction(()=>JSON.parse(document.querySelector('#disena').dataset.design).model==='curvo');}}
 assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);
 console.log('PASS CAD acceptance: actual loaded shell, independent wall/hinge invariants, local nasal and temporal editing, four projections, reversible curve edit, temple terminals, exact two sheets with nasal lunetas on A4/Carta/Oficio, saved state and mobile bounds.');
 console.log('Visual artifacts:',output);
}finally{await browser.close();}
