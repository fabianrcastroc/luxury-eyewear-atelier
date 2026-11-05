import {readFile,mkdir,writeFile,cp,rm} from 'node:fs/promises';
import {build} from 'esbuild';
const root=new URL('./',import.meta.url);
const bundle=await build({entryPoints:[new URL('./public/app.js',root).pathname],bundle:true,write:false,format:'esm',target:'es2022',minify:true,legalComments:'eof'});
for(const dir of ['docs','dist']){
 await rm(new URL('./'+dir+'/',root),{recursive:true,force:true});
 await mkdir(new URL('./'+dir+'/',root),{recursive:true});
 await cp(new URL('./public/',root),new URL('./'+dir+'/',root),{recursive:true});
 await writeFile(new URL('./'+dir+'/app.js',root),bundle.outputFiles[0].text);
 await writeFile(new URL('./'+dir+'/.nojekyll',root),'');
 await writeFile(new URL('./'+dir+'/Miscante.html',root),'<!doctype html><html lang="es"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./index.html"><title>Miscante</title><a href="./index.html">Entrar a Miscante</a></html>');
}
console.log('Generadas las páginas Inicio, Colección y Estudio personal en docs/ y dist/.');
