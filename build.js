import {readFile,mkdir,writeFile,cp} from 'node:fs/promises';
const read = name=>readFile(new URL('./public/'+name,import.meta.url),'utf8');
const [html,css,model,catalog,designer,app]=await Promise.all(['index.html','style.css','designer-model.js','catalog.js','designer.js','app.js'].map(read));
const script=[model,catalog,designer,app].map(source=>source.replace(/^import .*?;\n/gm,'').replaceAll('export ','')).join('\n');
let embeddedCss=css;
let embeddedHtml=html;
for(const name of ['editorial-solar.png','collection-studio.png']){
  const bytes=await readFile(new URL('./public/assets/'+name,import.meta.url));
  const data='data:image/png;base64,'+bytes.toString('base64');
  if(name==='collection-studio.png'){
    embeddedCss=embeddedCss.replace("--studio-image:url('./assets/collection-studio.png')",'--studio-image:none');
    embeddedCss=embeddedCss.replaceAll('background-image:var(--studio-image)',`background-image:url('${data}')`);
  } else embeddedCss=embeddedCss.replaceAll('./assets/'+name,data);
  embeddedHtml=embeddedHtml.replaceAll('./assets/'+name,data);
}
const standalone=embeddedHtml.replace('<link rel="stylesheet" href="./style.css">',`<style>${embeddedCss}</style>`).replace('<script type="module" src="./app.js"></script>','').replace('</body>',`<script type="module">${script}</script></body>`);
await mkdir(new URL('./dist/',import.meta.url),{recursive:true});
await writeFile(new URL('./dist/Miscante.html',import.meta.url),standalone);
await mkdir(new URL('./docs/',import.meta.url),{recursive:true});
await cp(new URL('./public/',import.meta.url),new URL('./docs/',import.meta.url),{recursive:true});
await writeFile(new URL('./docs/.nojekyll',import.meta.url),'');
await writeFile(new URL('./docs/Miscante.html',import.meta.url),standalone);
console.log('Creado dist/Miscante.html: abre este archivo en un navegador, sin instalar dependencias.');
