const {app,BrowserWindow,Menu,protocol,net,session,dialog}=require('electron');
const path=require('node:path');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');

app.setName('FR eyewear studio');
protocol.registerSchemesAsPrivileged([{scheme:'fr',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true,stream:true,codeCache:true}}]);
if(process.argv.includes('--headless-test')){if(process.platform==='linux')app.commandLine.appendSwitch('ozone-platform','headless');app.commandLine.appendSwitch('disable-gpu');app.commandLine.appendSwitch('enable-unsafe-swiftshader');app.commandLine.appendSwitch('use-angle','swiftshader');}
const webPreferences={contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true};
let mainWindow;
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
 protocol.handle('fr',async request=>{
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
 const command=id=>()=>mainWindow?.webContents.executeJavaScript(`document.getElementById(${JSON.stringify(id)})?.click()`);
 Menu.setApplicationMenu(Menu.buildFromTemplate([
  {label:'Archivo',submenu:[{label:'Abrir proyecto…',accelerator:'CmdOrCtrl+O',click:command('studio-project-open')},{label:'Guardar proyecto…',accelerator:'CmdOrCtrl+S',click:command('studio-project-save')},{type:'separator'},{label:'Imprimir patrones…',accelerator:'CmdOrCtrl+P',click:command('studio-print')},{type:'separator'},{role:'quit',label:'Salir'}]},
  {label:'Edición',submenu:[{label:'Deshacer',accelerator:'CmdOrCtrl+Z',click:command('studio-undo')},{label:'Rehacer',accelerator:'CmdOrCtrl+Shift+Z',click:command('studio-redo')},{type:'separator'},{role:'cut',label:'Cortar'},{role:'copy',label:'Copiar'},{role:'paste',label:'Pegar'},{role:'selectAll',label:'Seleccionar todo'}]},
  {label:'Vista',submenu:[{role:'reload',label:'Recargar estudio'},{role:'resetZoom',label:'Tamaño de interfaz original'},{role:'zoomIn',label:'Ampliar interfaz'},{role:'zoomOut',label:'Reducir interfaz'},{role:'togglefullscreen',label:'Pantalla completa'}]}
 ]));
 app.on('web-contents-created',(_event,contents)=>{contents.on('will-attach-webview',event=>event.preventDefault());});
 app.on('browser-window-created',(_event,win)=>configureWindow(win));
 mainWindow=new BrowserWindow({width:1540,height:1000,minWidth:900,minHeight:650,backgroundColor:'#1b222a',title:'FR eyewear studio',autoHideMenuBar:false,webPreferences});
 await mainWindow.loadURL('fr://studio/index.html');
 await mainWindow.webContents.executeJavaScript("document.querySelectorAll('.fr-installer-link, #standalone-install, a[href^=\"http\"],a[href=\"../index.html\"]').forEach(link=>link.remove())");
}
app.whenReady().then(start).catch(error=>{dialog.showErrorBox('FR eyewear studio',error.message);app.quit();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)start();});
