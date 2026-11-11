import {_electron as electron} from 'playwright-core';
const results=[];
for(const angle of ['swiftshader-webgl','swiftshader','gl','default']){
 let app;const logs=[];
 try{
  app=await electron.launch({executablePath:process.env.FR_ELECTRON_EXECUTABLE,args:['--headless-test'],env:{...process.env,FR_TEST_ANGLE:angle},timeout:30000});
  app.process().stderr.on('data',b=>logs.push(b.toString()));
  const gpu=await app.evaluate(async({app})=>({arch:process.arch,angle:app.commandLine.getSwitchValue('use-angle'),gl:app.commandLine.getSwitchValue('use-gl'),status:app.getGPUFeatureStatus(),info:await app.getGPUInfo('basic')}));
  const page=await app.firstWindow();page.on('console',m=>{if(m.type()==='error')logs.push(m.text());});await page.waitForFunction(()=>document.querySelector('#license-trial')||document.querySelector('#disena'));if(await page.locator('#license-trial').count())await page.locator('#license-trial').click();
  await page.waitForFunction(()=>document.querySelector('#disena')?.dataset.renderer==='webgl',{},{timeout:20000});results.push({angle,success:true,gpu});
 }catch(error){results.push({angle,success:false,error:error.message,logs:logs.join('\n').slice(-6000)});}finally{await app?.close();}
}
console.log('::notice::'+JSON.stringify(results).replaceAll('%','%25').replaceAll('\n','%0A').replaceAll('\r','%0D'));
if(!results.some(r=>r.success))process.exitCode=1;
