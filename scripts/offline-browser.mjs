import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.CAD_URL||'http://127.0.0.1:3040')+'/fr/');
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);await page.reload();await page.waitForFunction(()=>document.querySelector('#disena')?.dataset.renderer==='webgl');
 assert.equal(await page.locator('[data-model]').count(),14);await page.locator('[data-model=recto-3]').click();await page.locator('[data-panel="1"]').click();
 await page.locator('#precision-wall-mode').selectOption('outward');assert.equal(await page.locator('#disena').evaluate(el=>JSON.parse(el.dataset.design).wallMode),'outward');
 const event=page.waitForEvent('download');await page.locator('#studio-stl').click();const download=await event;assert.match(download.suggestedFilename(),/\.stl$/);
 assert.deepEqual(errors,[]);console.log('PASS offline web app: cached startup with network disabled, WebGL, 14 profiles, fixed-lens editing and STL download. Safari/iOS installation is not validated by this Chromium test.');
}finally{await browser.close();}
