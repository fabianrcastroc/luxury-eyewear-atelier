import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {defaultDesign} from '../public/designer-model.js';

// Inspect exported binary vertex data, not just the requested configuration.
// No development server is needed: bundle the canonical renderer into a blank page.
const bundle=await build({entryPoints:[new URL('../public/designer-renderer.js',import.meta.url).pathname],bundle:true,write:false,format:'iife',globalName:'ViewportMetrology'});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.setContent('<div id="viewport" style="width:900px;height:650px"></div>');
 await page.addScriptTag({content:bundle.outputFiles[0].text});
 const runs=await page.evaluate(async design=>{
  const viewer=ViewportMetrology.createDesignRenderer(document.querySelector('#viewport')),runs=[];
  const close=(actual,expected)=>{if(Math.abs(actual-expected)>1e-4)throw new Error(`Geometry ${actual} != ${expected}`);};
  const translation=node=>node.translation||(node.matrix?[node.matrix[12],node.matrix[13],node.matrix[14]]:[0,0,0]);
  try{
   for(const model of ['recto','redondo','ovalado','curvo','panto','boston','cateye','geometrico'])for(const stock of [2,3,4,6,8]){
    viewer.update({...design,model,materialDepth:stock});
    viewer.setView('frente');viewer.setProjection('orthographic');
    const camera=viewer.getCameraState();close(camera[0],0);close(camera[1],0);
    viewer.setView('lateral');close(viewer.getCameraState()[1],0);close(viewer.getCameraState()[2],-2.3);
    viewer.setView('frente');
    const buffer=await viewer.exportGLB(),view=new DataView(buffer);
    if(view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2||view.getUint32(8,true)!==buffer.byteLength)throw new Error('Invalid binary glTF header');
    const jsonLength=view.getUint32(12,true),json=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,20,jsonLength))),binOffset=20+jsonLength+8;
    const root=json.nodes.find(node=>node.name==='FR eyewear studio');
    const scale=root.scale||(root.matrix?[root.matrix[0],root.matrix[5],root.matrix[10]]:[]);
    if(scale.length!==3)throw new Error('Missing metre conversion');scale.forEach(value=>close(value,.025));
    if(!/preview/i.test(root.extras.purpose))throw new Error('Export must identify its design-preview scope');
    const positions=node=>{
     const access=json.accessors[json.meshes[node.mesh].primitives[0].attributes.POSITION],bv=json.bufferViews[access.bufferView];
     if(access.componentType!==5126||access.type!=='VEC3')throw new Error('Unexpected position encoding');
     const offset=binOffset+(bv.byteOffset||0)+(access.byteOffset||0),stride=bv.byteStride||12;
     return Array.from({length:access.count},(_,i)=>[0,1,2].map(axis=>view.getFloat32(offset+i*stride+axis*4,true)));
    };
    let stockParts=0,addedPads=0,hardware=0;
    for(const node of json.nodes){
     if(node.mesh==null)continue;
     const extras=node.extras||{},points=positions(node);
     if(extras.materialClass==='acetate-stock'){
      close(extras.stockThicknessMM,stock);
      if(extras.thicknessAxis==='z'){
       const zs=points.map(point=>point[2]),tz=translation(node)[2];
       close((Math.max(...zs)-Math.min(...zs))*25,stock);
       close((Math.min(...zs)+tz)*25,0);close((Math.max(...zs)+tz)*25,stock);
      }else{
       const n=extras.sectionVertexCount;
       if(n!==24||points.length%n||extras.continuous!==true)throw new Error('Unexpected rounded continuous temple topology');
       for(let start=0;start<points.length;start+=n){
        let diameter=0;for(let a=0;a<n;a++)for(let b=a+1;b<n;b++)diameter=Math.max(diameter,Math.hypot(...points[start+a].map((v,k)=>v-points[start+b][k]))*25);
        if(!Number.isFinite(diameter)||diameter<=0)throw new Error('Invalid swept section');
       }
       // The joint is locally machined to sit inside the rim; the shaft reaches
       // the requested full sheet thickness further behind the hinge.
       const row=64,center=k=>[0,1,2].map(axis=>points.slice(k*n,(k+1)*n).reduce((sum,p)=>sum+p[axis],0)/n),before=center(row-1),after=center(row+1),origin=center(row),tangent=after.map((v,k)=>v-before[k]),len=Math.hypot(...tangent);for(let k=0;k<3;k++)tangent[k]/=len;
       const axis=[1-tangent[0]*tangent[0],-tangent[0]*tangent[1],-tangent[0]*tangent[2]],axisLength=Math.hypot(...axis);for(let k=0;k<3;k++)axis[k]/=axisLength;
       const projection=points.slice(row*n,(row+1)*n).map(p=>p.reduce((sum,v,k)=>sum+(v-origin[k])*axis[k],0));close((Math.max(...projection)-Math.min(...projection))*25,stock);
       for(const primitive of json.meshes[node.mesh].primitives){const material=json.materials[primitive.material];if(material.alphaMode==='BLEND'||material.pbrMetallicRoughness?.baseColorFactor?.[3]<1)throw new Error('Acetate must remain fully opaque');}
      }
      stockParts++;
     }
     if(extras.materialClass==='added-laminate'){
      const zs=points.map(point=>point[2]),tz=translation(node)[2];
      close((Math.max(...zs)-Math.min(...zs))*25,3);close((Math.min(...zs)+tz)*25,-3);close((Math.max(...zs)+tz)*25,0);
      if(extras.includedInMainStock!==false||extras.manufacturingValidated!==false)throw new Error('Added nasal laminate is incorrectly declared as cut main stock');
      addedPads++;
     }
     if(extras.materialClass==='hardware-placeholder'){if(extras.manufacturingValidated!==false)throw new Error('Hardware must remain identified as illustrative');hardware++;}
    }
    if(stockParts!==3||addedPads!==2||hardware!==4)throw new Error('Expected stock/laminate/hardware classification missing');
    const front=json.nodes.find(node=>node.extras?.part==='front');if(!front)throw new Error('Missing connected front solid');
    const xs=positions(front).map(point=>point[0]);close(Math.min(...xs),-Math.max(...xs));
    const frontMesh=json.meshes[front.mesh];if(frontMesh.primitives.length>2)throw new Error('Material groups must be batched, not one draw per triangle');
    const before=viewer.getCameraState();viewer.setDisplay({grid:true,wireframe:true,axes:true});viewer.update({...design,model,materialDepth:stock,thickness:8});
    viewer.getCameraState().forEach((value,index)=>close(value,before[index]));
    runs.push({model,stock,stockParts});
   }
  }finally{viewer.destroy();}
  return runs;
 },defaultDesign);
 assert.equal(runs.length,40);assert.deepEqual(errors,[]);
 console.log('PASS renderer metrology: 40 model/stock combinations; GLB binary scale, actual 2/3/4/6/8 mm stock, continuous rounded sections, separate 3 mm added nasal laminates, hardware scope, mirrored rims and front/lateral camera axes.');
}finally{await browser.close();}
