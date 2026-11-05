import {execFileSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const commit='5a63274163b3d763e5cf9c1c97e2101a3a41414d';
const base=`https://raw.githubusercontent.com/LucasEduardo2002/otica-landing-page/${commit}/public/images/`;
const references=[
 {id:'panto',label:'Ray-Ban RB7140 8124',path:'colecao/rayban/7140_8124_0.jpg'},
 {id:'rectangular',label:'Ray-Ban Jeffrey RB4448L',path:'solares/rayban/jeffrey_rb_4448l_0.jpg'},
 {id:'cat-eye',label:'Vogue VO5369S',path:'solares/vogue/vo_5369-s_0.jpg'},
 {id:'aviador',label:'Ray-Ban Aviator RB3025-L',path:'solares/rayban/aviator_rb_3025_l_0.jpg'},
 {id:'clubmaster',label:'Ray-Ban Clubmaster RB3016L',path:'solares/rayban/clubmaster_rb_3016l_0.jpg'}
];
const directory=new URL('../public/assets/references/',import.meta.url);await mkdir(directory,{recursive:true});
for(const ref of references){
 const image=execFileSync('curl',['-sSL','--fail','--max-time','30',base+ref.path],{maxBuffer:20*1024*1024});
 await sharp(image).resize({width:1100,height:800,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toFile(new URL(ref.id+'.webp',directory).pathname);
}
await writeFile(new URL('sources.json',directory),JSON.stringify({sourceRepository:'https://github.com/LucasEduardo2002/otica-landing-page',commit,references:references.map(r=>({...r,url:base+r.path}))},null,2)+'\n');
console.log('Cinco fotografías reales de referencia importadas con su procedencia.');
