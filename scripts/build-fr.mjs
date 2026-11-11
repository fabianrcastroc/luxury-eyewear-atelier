import {fileURLToPath} from 'node:url';
import {readFile,mkdir,writeFile,cp,rm,access,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';

const root=new URL('../',import.meta.url);
const hash=data=>createHash('sha256').update(data).digest('hex').slice(0,12);

// Build from checked-in templates and the canonical shared core. CI does not
// need the independent software checkout to reproduce the /fr publication.
export async function buildFR(){
 const source=new URL('public/',root),templates=new URL('software-fr/',root);
 const entry=await readFile(new URL('app.js',templates),'utf8');
 const common={bundle:true,write:false,define:{__CAD_STYLE_VERSION__:JSON.stringify(hash(await readFile(new URL('cad-workspace.css',source))))},format:'esm',target:'es2022',minify:true,legalComments:'eof'};
 const bundle=await build({...common,stdin:{contents:entry,sourcefile:'software-fr/app.js',resolveDir:fileURLToPath(source),loader:'js'}});
 const worker=await build({...common,entryPoints:[fileURLToPath(new URL('reference-extraction.js',source))]});
 const code=bundle.outputFiles[0].text,workerCode=worker.outputFiles[0].text;
 const style=await readFile(new URL('style.css',source)),standalone=await readFile(new URL('standalone.css',templates));
 const html=(await readFile(new URL('index.html',templates),'utf8'))
  .replace('./app.js',`./app.js?v=${hash(code)}`)
  .replace('./style.css',`./style.css?v=${hash(style)}`)
  .replace('./standalone.css',`./standalone.css?v=${hash(standalone)}`);
 for(const directory of ['docs/fr/','dist/fr/']){
  const out=new URL(directory,root);
  await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
  await writeFile(new URL('index.html',out),html);
  await writeFile(new URL('app.js',out),code);
  await writeFile(new URL('reference-extraction.js',out),workerCode);
  await writeFile(new URL('style.css',out),style);
  await cp(new URL('cad-workspace.css',source),new URL('cad-workspace.css',out));
  await cp(new URL('THIRD_PARTY_NOTICES.txt',source),new URL('THIRD_PARTY_NOTICES.txt',out));
  await writeFile(new URL('standalone.css',out),standalone);
  await mkdir(new URL('assets/',out),{recursive:true});
  await cp(new URL('favicon.svg',templates),new URL('assets/favicon.svg',out));
  await cp(new URL('manifest.webmanifest',templates),new URL('manifest.webmanifest',out));
  const sharp=(await import('sharp')).default;
  for(const size of [192,512])await sharp(fileURLToPath(new URL('favicon.svg',templates))).resize(size,size).png().toFile(fileURLToPath(new URL(`assets/icon-${size}.png`,out)));
  await cp(new URL('assets/forms/',source),new URL('assets/forms/',out),{recursive:true});
  const cached=['./','./index.html','./app.js','./reference-extraction.js','./style.css','./cad-workspace.css','./standalone.css','./manifest.webmanifest','./assets/favicon.svg','./assets/icon-192.png','./assets/icon-512.png',...(await readdir(new URL('assets/forms/',out))).map(name=>'./assets/forms/'+name)];
  const workerTemplate=await readFile(new URL('offline-worker.js',templates),'utf8');
  await writeFile(new URL('sw.js',out),`const CACHE=${JSON.stringify('fr-studio-'+hash(code+workerCode+style+standalone+workerTemplate+html))};const FILES=${JSON.stringify(cached)};\n`+workerTemplate);
  // Fail the Pages build rather than deploy a missing entry or broken worker.
  for(const path of ['index.html','app.js','reference-extraction.js','style.css','cad-workspace.css','standalone.css','assets/favicon.svg','assets/forms/recto.webp','assets/forms/redondo.webp','assets/forms/ovalado.webp','assets/forms/curvo.webp'])await access(new URL(path,out));
  if(!html.includes('FR eyewear studio')||!html.includes('id="disena"')||!code.length||!workerCode.includes('onmessage'))throw new Error(`FR output incomplete in ${directory}`);
 }
 console.log('FR · Eyewear Studio generado en docs/fr/ y dist/fr/, con análisis local de imagen.');
}
