import {chromium} from 'playwright-core';
import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
import {iconicModels} from '../public/designer-model.js';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto((process.env.MISCANTE_BASE_URL||'http://127.0.0.1:3000')+'/disena.html');
 await page.waitForFunction(()=>document.querySelector('#disena').dataset.renderer==='webgl');
 await mkdir(new URL('../public/assets/forms/',import.meta.url),{recursive:true});
 for(const model of iconicModels){
  await page.locator(`button[data-model="${model.id}"]`).click();
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const image=await page.locator('#design-preview canvas').screenshot();
  await sharp(image).resize({width:500,height:360,fit:'contain',background:'#f4f5f1'}).webp({quality:90}).toFile(new URL(`../public/assets/forms/${model.id}.webp`,import.meta.url).pathname);
 }
 console.log('Miniaturas generadas desde la misma geometría y materiales del producto editable.');
}finally{await browser.close();}
