import {readFile,mkdir,writeFile,cp,rm} from 'node:fs/promises';
import {build} from 'esbuild';
import {createHash} from 'node:crypto';
const root=new URL('./',import.meta.url);
const bundle=await build({entryPoints:[new URL('./public/app.js',root).pathname],bundle:true,write:false,format:'esm',target:'es2022',minify:true,legalComments:'eof'});
const scriptVersion=createHash('sha256').update(bundle.outputFiles[0].text).digest('hex').slice(0,12);
const cssVersion=createHash('sha256').update(await readFile(new URL('./public/style.css',root))).digest('hex').slice(0,12);
for(const dir of ['docs','dist']){
 await rm(new URL('./'+dir+'/',root),{recursive:true,force:true});
 await mkdir(new URL('./'+dir+'/',root),{recursive:true});
 await cp(new URL('./public/',root),new URL('./'+dir+'/',root),{recursive:true});
 await writeFile(new URL('./'+dir+'/app.js',root),bundle.outputFiles[0].text);
 for(const page of ['index.html','coleccion.html','disena.html']){const url=new URL('./'+dir+'/'+page,root);const html=await readFile(url,'utf8');await writeFile(url,html.replace('./app.js',`./app.js?v=${scriptVersion}`).replace('./style.css',`./style.css?v=${cssVersion}`));}
 await writeFile(new URL('./'+dir+'/.nojekyll',root),'');
 await writeFile(new URL('./'+dir+'/Miscante.html',root),'<!doctype html><html lang="es"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./index.html"><title>Miscante</title><a href="./index.html">Entrar a Miscante</a></html>');
}
console.log('Generadas las páginas Inicio, Colección y Estudio personal en docs/ y dist/.');
