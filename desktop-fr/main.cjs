const {app,BrowserWindow,Menu,protocol,net,session,dialog,ipcMain}=require('electron');
const path=require('node:path');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');

app.setName('FR eyewear studio');
protocol.registerSchemesAsPrivileged([{scheme:'fr',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true,stream:true,codeCache:true}}]);
if(process.argv.includes('--headless-test')){if(process.platform==='linux')app.commandLine.appendSwitch('ozone-platform','headless');if(process.platform==='darwin'&&process.arch==='arm64'){app.commandLine.appendSwitch('use-angle','metal');}else{app.commandLine.appendSwitch('disable-gpu');app.commandLine.appendSwitch('enable-unsafe-swiftshader');app.commandLine.appendSwitch('use-angle','swiftshader');}}
const webPreferences={preload:path.join(__dirname,'license-preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true};
const {deviceId,verifyLicense,trialStatus}=require('./license.cjs');
let mainWindow,servicesConfigured=false,lifecycleConfigured=false;
const licensePath=()=>path.join(app.getPath('userData'),'license.frlicense'),trialPath=()=>path.join(app.getPath('userData'),'evaluation.json');
const readJSON=file=>{try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return null;}};
function licensingStatus(){let license,message;try{const raw=readJSON(licensePath());if(raw)license=verifyLicense(raw,fs.readFileSync(path.join(__dirname,'license-public.pem'),'utf8'),deviceId());}catch(error){message=error.message;}return {deviceId:deviceId(),license,trial:trialStatus(readJSON(trialPath())),message};}
function openEditor(){return mainWindow.loadURL('fr://studio/index.html').then(()=>mainWindow.webContents.executeJavaScript("document.querySelectorAll('.fr-installer-link, a[href^=\"http\"]').forEach(link=>link.remove())"));}
function configureLicensing(){fs.mkdirSync(app.getPath('userData'),{recursive:true});
 const allowed=event=>{if(event.sender.getURL()!=='fr://studio/license.html')throw Error('Operación no permitida.');};
 ipcMain.handle('fr-license-resume',async event=>{allowed(event);const status=licensingStatus();if(!status.license&&!status.trial.valid)throw Error('Activa una licencia para continuar.');await openEditor();return {message:'Estudio abierto.'};});
 ipcMain.handle('fr-license-status',event=>{allowed(event);return licensingStatus();});
 ipcMain.handle('fr-license-trial',async event=>{allowed(event);const status=licensingStatus();if(!status.trial.available)throw Error('La evaluación de este equipo ya se utilizó.');fs.writeFileSync(trialPath(),JSON.stringify({startedAt:Date.now(),lastSeen:Date.now()}));await openEditor();return {message:'Evaluación iniciada.'};});
 ipcMain.handle('fr-license-activate',async event=>{allowed(event);const result=await dialog.showOpenDialog(mainWindow,{properties:['openFile'],filters:[{name:'Licencia FR',extensions:['frlicense','json']}]});if(result.canceled)return {message:'Activación cancelada.'};if(fs.statSync(result.filePaths[0]).size>20000)throw Error('Licencia demasiado grande.');const bytes=fs.readFileSync(result.filePaths[0],'utf8');verifyLicense(JSON.parse(bytes),fs.readFileSync(path.join(__dirname,'license-public.pem'),'utf8'),deviceId());fs.writeFileSync(licensePath(),bytes);await openEditor();return {message:'Licencia activada para este equipo.'};});
 ipcMain.handle('fr-license-request',async event=>{allowed(event);const result=await dialog.showSaveDialog(mainWindow,{defaultPath:'FR-solicitud-licencia.json',filters:[{name:'Solicitud de licencia',extensions:['json']}]});if(result.canceled)return {message:'Guardado cancelado.'};fs.writeFileSync(result.filePath,JSON.stringify({product:'FR eyewear studio',deviceId:deviceId(),platform:process.platform},null,2));return {message:'Solicitud guardada. Entrégala al titular de la licencia para recibir el archivo firmado.'};});
}

globalThis.__frSmokeDownloads=[];
function configureWindow(win){
 win.webContents.setWindowOpenHandler(({url})=>{
  if(url==='about:blank'||url==='')return {action:'allow',overrideBrowserWindowOptions:{width:1000,height:820,title:'FR eyewear studio · impresión',webPreferences}};
  return {action:'deny'};
 });
 win.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith('fr://studio/')&&!url.startsWith('blob:fr://studio/'))event.preventDefault();});
}
async function start(){
 const root=path.resolve(__dirname,'../dist');
 if(!fs.existsSync(path.join(root,'index.html')))throw new Error('No se encontró el estudio incluido en esta instalación.');
 if(!servicesConfigured){protocol.handle('fr',async request=>{
  const url=new URL(request.url);if(url.hostname!=='studio')return new Response('No encontrado',{status:404});
  let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{return new Response('Ruta inválida',{status:400});}
  const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!target.startsWith(root+path.sep))return new Response('Ruta no permitida',{status:403});
  const response=await net.fetch(pathToFileURL(target).toString());const headers=new Headers(response.headers);headers.set('Content-Security-Policy',"default-src 'self' data: blob:; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' data: blob:; object-src 'none'; base-uri 'none'");return new Response(response.body,{status:response.status,headers});
 });
 // The installed application runs its own packaged assets. Neither the editor,
 // workers, imports nor exports require an Internet connection.
 session.defaultSession.webRequest.onBeforeRequest((details,callback)=>callback({cancel:/^https?:/i.test(details.url)}));
 session.defaultSession.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
 session.defaultSession.setPermissionCheckHandler(()=>false);
 session.defaultSession.on('will-download',(_event,item)=>{
  item.once('done',(_event,state)=>{globalThis.__frSmokeDownloads.push({state,name:item.getFilename(),path:item.getSavePath()});console.log('FR_DOWNLOAD',state,item.getSavePath());});
  const arg=process.argv.find(x=>x.startsWith('--download-dir='));
  if(arg){const directory=path.resolve(arg.slice('--download-dir='.length));fs.mkdirSync(directory,{recursive:true});item.setSavePath(path.join(directory,path.basename(item.getFilename())));}
  else item.setSaveDialogOptions({title:'Guardar archivo de FR eyewear studio',defaultPath:path.join(app.getPath('downloads'),path.basename(item.getFilename()))});
 });
 servicesConfigured=true;}
 const command=id=>()=>mainWindow?.webContents.executeJavaScript(`document.getElementById(${JSON.stringify(id)})?.click()`);
 Menu.setApplicationMenu(Menu.buildFromTemplate([
  ...(process.platform==='darwin'?[{role:'appMenu',label:app.name}]:[]),
  {label:'Archivo',submenu:[{label:'Abrir proyecto…',accelerator:'CmdOrCtrl+O',click:command('studio-project-open')},{label:'Guardar proyecto…',accelerator:'CmdOrCtrl+S',click:command('studio-project-save')},{type:'separator'},{label:'Imprimir patrones…',accelerator:'CmdOrCtrl+P',click:command('studio-print')},{type:'separator'},{label:'Licencia y activación…',click:async()=>{if(mainWindow?.webContents.getURL()==='fr://studio/index.html')await mainWindow.webContents.executeJavaScript("(()=>{const d=document.querySelector('#disena')?.dataset.design;if(d)localStorage.setItem('miscante-design',d);})()");await mainWindow.loadURL('fr://studio/license.html');}},{type:'separator'},{role:'quit',label:'Salir'}]},
  {label:'Edición',submenu:[{label:'Deshacer',accelerator:'CmdOrCtrl+Z',click:command('studio-undo')},{label:'Rehacer',accelerator:'CmdOrCtrl+Shift+Z',click:command('studio-redo')},{type:'separator'},{role:'cut',label:'Cortar'},{role:'copy',label:'Copiar'},{role:'paste',label:'Pegar'},{role:'selectAll',label:'Seleccionar todo'}]},
  {label:'Vista',submenu:[{role:'reload',label:'Recargar estudio'},{role:'resetZoom',label:'Tamaño de interfaz original'},{role:'zoomIn',label:'Ampliar interfaz'},{role:'zoomOut',label:'Reducir interfaz'},{role:'togglefullscreen',label:'Pantalla completa'}]}
 ]));
 if(!lifecycleConfigured){app.on('web-contents-created',(_event,contents)=>{contents.on('will-attach-webview',event=>event.preventDefault());});
 app.on('browser-window-created',(_event,win)=>configureWindow(win));lifecycleConfigured=true;}
 mainWindow=new BrowserWindow({width:1540,height:1000,minWidth:900,minHeight:650,backgroundColor:'#1b222a',title:'FR eyewear studio',autoHideMenuBar:false,webPreferences});
 const license=licensingStatus();if(license.license||license.trial.valid){if(license.trial.valid)fs.writeFileSync(trialPath(),JSON.stringify({...readJSON(trialPath()),lastSeen:Date.now()}));await openEditor();}else await mainWindow.loadURL('fr://studio/license.html');
 await mainWindow.webContents.executeJavaScript("document.querySelectorAll('.fr-installer-link, #standalone-install, a[href^=\"http\"],a[href=\"../index.html\"]').forEach(link=>link.remove())");
}
app.whenReady().then(()=>{configureLicensing();return start();}).catch(error=>{dialog.showErrorBox('FR eyewear studio',error.message);app.quit();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)start();});
