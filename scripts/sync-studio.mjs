import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// The website owns the shared implementation and the deployable FR shell.
// The standalone repository retains its own server, build and package files.
const source=fileURLToPath(new URL('../',import.meta.url));
const args=process.argv.slice(2),write=args.includes('--write'),check=args.includes('--check');
if(write===check||args.some((arg,i)=>!['--write','--check','--studio'].includes(arg)&&args[i-1]!=='--studio')){
 console.error('Usage: node scripts/sync-studio.mjs --write|--check [--studio /path/to/miscante-eyewear-studio]');process.exit(2);
}
const at=args.indexOf('--studio');
if(at!==-1&&!args[at+1])throw new Error('--studio requires a directory');
const target=path.resolve(at===-1?path.join(source,'../miscante-eyewear-studio'):args[at+1]);
if(target===path.resolve(source))throw new Error('The standalone target must differ from the website checkout.');
const files=['public/THIRD_PARTY_NOTICES.txt','scripts/cad-acceptance.mjs','design-notes/REQUIREMENTS-REVIEW.md','design-notes/CAD-VISUAL-QA.md','public/cad-workspace.css','public/finished-geometry.js','public/planar-kernel.js','public/print-paper.js','tests/temple-shapes.test.js','tests/planar-kernel.test.js','scripts/renderer-metrology.mjs','design-notes/DESIGN-RESEARCH.md','public/designer.js','public/designer-model.js','public/designer-renderer.js','public/frame-geometry.js','public/manufacturing.js','public/temple-development.js','public/reference-extraction.js','public/workbench.js','public/catalog.js','public/style.css','tests/designer.test.js','tests/manufacturing.test.js','tests/reference-extraction.test.js'];
async function assets(relative){for(const entry of await readdir(path.join(source,relative),{withFileTypes:true})){const name=path.join(relative,entry.name);if(entry.isDirectory())await assets(name);else if(entry.isFile())files.push(name);else throw new Error(`Unsupported asset entry: ${name}`);}}
await assets('public/assets/forms');
let mismatches=0;
for(const relative of files.sort()){
 const bytes=await readFile(path.join(source,relative)),destination=path.join(target,relative);
 if(write){await mkdir(path.dirname(destination),{recursive:true});await writeFile(destination,bytes);}
 else{let other;try{other=await readFile(destination);}catch(error){if(error.code!=='ENOENT')throw error;}if(!other||!bytes.equals(other)){console.error(`Out of sync: ${relative}`);mismatches++;}}
}
for(const [from,to] of [['index.html','index.html'],['index.html','disena.html'],['app.js','app.js'],['standalone.css','standalone.css'],['favicon.svg','assets/favicon.svg']]){
 const bytes=await readFile(path.join(source,'software-fr',from)),destination=path.join(target,'public',to);
 if(write){await mkdir(path.dirname(destination),{recursive:true});await writeFile(destination,bytes);}
 else{let other;try{other=await readFile(destination);}catch(error){if(error.code!=='ENOENT')throw error;}if(!other||!bytes.equals(other)){console.error(`Out of sync integration: ${to}`);mismatches++;}}
}
const manifest=JSON.parse(await readFile(path.join(source,'package.json'),'utf8')),targetManifestPath=path.join(target,'package.json'),targetManifest=JSON.parse(await readFile(targetManifestPath,'utf8'));
const sharedDependenciesMatch=Object.entries(manifest.dependencies||{}).every(([k,v])=>targetManifest.dependencies?.[k]===v)&&Object.entries(manifest.devDependencies||{}).every(([k,v])=>targetManifest.devDependencies?.[k]===v);
if(write){targetManifest.dependencies={...targetManifest.dependencies,...manifest.dependencies};targetManifest.devDependencies={...targetManifest.devDependencies,...manifest.devDependencies};await writeFile(targetManifestPath,JSON.stringify(targetManifest,null,2)+'\n');}else if(!sharedDependenciesMatch){console.error('Out of sync: shared runtime dependencies');mismatches++;}
if(mismatches){console.error(`${mismatches} shared files differ. Run --write after reviewing website changes.`);process.exitCode=1;}
else console.log(`${write?'Synchronized':'Verified'} ${files.length} shared files: ${target}`);
