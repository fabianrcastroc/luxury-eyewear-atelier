import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {frameDimensions,frameContour,lensContour,lensCenters,bridgeGeometry,templePlan,designMeasurements,nasalPads,MM} from './frame-geometry.js';
import {normalizeDesign,frameColors,lensColors,photoColors} from './designer-model.js';

export function createDesignRenderer(container){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power',preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0xf7f7f4,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
 renderer.domElement.setAttribute('aria-label','Vista 3D interactiva de tus gafas. Arrastra para girar.');renderer.domElement.setAttribute('role','img');renderer.domElement.tabIndex=0;
 container.replaceChildren(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.enablePan=false;controls.minDistance=4.7;controls.maxDistance=13;controls.maxPolarAngle=Math.PI*.72;controls.target.set(0,0,-.5);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0x737373,1.2));
 const light=new THREE.DirectionalLight(0xffffff,2.6);light.position.set(-3,7,5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-5;light.shadow.camera.right=5;light.shadow.camera.top=5;light.shadow.camera.bottom=-5;light.shadow.bias=-.001;scene.add(light);
 const fill=new THREE.DirectionalLight(0xffffff,2);fill.position.set(5,3,-3);scene.add(fill);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({color:0x343434,opacity:.035}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.6;floor.receiveShadow=true;scene.add(floor);
 let group=new THREE.Group(),reference=null;scene.add(group);
 let framePending=false;
 function render(){if(framePending)return;framePending=true;requestAnimationFrame(()=>{framePending=false;renderer.render(scene,camera);container.dataset.camera=JSON.stringify(camera.position.toArray());});}
 controls.addEventListener('change',render);
 function dispose(object){object.traverse(o=>{o.geometry?.dispose();if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();});}});}
 function material(hex,metal=false){return new THREE.MeshPhysicalMaterial({color:hex,roughness:metal?.23:.2,metalness:metal?.8:0,clearcoat:1,clearcoatRoughness:.1,transmission:0,thickness:.35,envMapIntensity:.8});}
 function addMesh(geometry,mat,parent=group){const mesh=new THREE.Mesh(geometry,mat);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function contours(d,side,scale=1){return frameContour(d,side,scale).map(p=>new THREE.Vector2(...p));}
 function arm(d,side,style,mat){
  const plan=templePlan(d,side,style);
  function sweep(points,hook){
   const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),positions=[],indices=[],sections=48;
   for(let i=0;i<=sections;i++){
    const t=i/sections,p=curve.getPoint(t),ease=THREE.MathUtils.smoothstep(t,.18,1);

    const height=hook?plan.hookWidth:THREE.MathUtils.lerp(plan.shaftWidth,plan.hookWidth,ease),depth=hook?.075:plan.depth;
    for(const [dx,dy] of [[-depth,-height/2],[depth,-height/2],[depth,height/2],[-depth,height/2]])positions.push(p.x+dx,p.y+dy,p.z);
    if(i<sections)for(let j=0;j<4;j++){const a=i*4+j,b=i*4+(j+1)%4,c=(i+1)*4+j,e=(i+1)*4+(j+1)%4;indices.push(a,b,c,b,e,c);}
   }
   indices.push(0,2,1,0,3,2);const end=sections*4;indices.push(end,end+1,end+2,end,end+2,end+3);
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();addMesh(geometry,mat);
  }
  sweep(plan.stem,false);sweep(plan.hook,true);
  const endpiece=addMesh(new THREE.BoxGeometry(.16,.14,.18),mat);endpiece.position.set(plan.stem[0][0]-side*.05,plan.stem[0][1],.035);
  const hinge=addMesh(new THREE.BoxGeometry(.11,.13,.18),material('#baa26d',true));hinge.position.set(...plan.stem[0]);
 }
 function update(raw){
  const d=normalizeDesign(raw);container.dataset.renderModel=d.model;container.dataset.config=JSON.stringify(d);scene.remove(group);dispose(group);group=new THREE.Group();scene.add(group);
  const rim=material(frameColors.find(c=>c.id===d.rimColor).hex),bridge=material(frameColors.find(c=>c.id===d.bridgeColor).hex),arms=material(frameColors.find(c=>c.id===d.armColor).hex);
  const centers=lensCenters(d);
  for(const side of [-1,1]){
   const outer=contours(d,side),inner=lensContour(d,side).map(p=>new THREE.Vector2(...p)),offset=Math.abs(centers[side===-1?0:1]);
   const metalOuter=d.model==='curvo'?lensContour(d,side).map(([x,y])=>new THREE.Vector2(x*1.025,y*1.025)):outer;
   const shape=new THREE.Shape(metalOuter);shape.holes.push(new THREE.Path([...(d.model==='curvo'?lensContour(d,side).map(p=>new THREE.Vector2(...p)):inner)].reverse()));
   const ring=addMesh(new THREE.ExtrudeGeometry(shape,{depth:.11+d.thickness*.009,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:3,steps:1}),d.model==='curvo'?material('#bfa876',true):rim);ring.position.set(side*offset,0,0);
   if(d.model==='curvo'){const brow=new THREE.Shape([...outer.slice(0,65),...inner.slice(0,65).reverse()]);const browMesh=addMesh(new THREE.ExtrudeGeometry(brow,{depth:.15,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:2}),rim);browMesh.position.set(side*offset,0,.02);}
   const tinted=d.use==='sol'||d.sunOptical||d.photo;
   const color=d.photo?photoColors.find(c=>c.id===d.photoColor).hex:lensColors.find(c=>c.id===d.lensColor).hex;
   const lensMaterial=new THREE.MeshPhysicalMaterial({color:tinted?new THREE.Color(color).multiplyScalar(.65):'#e2eeeb',transparent:true,opacity:tinted?.9:.1,roughness:.1,metalness:0,clearcoat:.5,side:THREE.DoubleSide,envMapIntensity:.5});
   const lens=addMesh(new THREE.ShapeGeometry(new THREE.Shape(inner)),lensMaterial);lens.position.set(side*offset,0,.035);
   const pin=addMesh(new THREE.SphereGeometry(.023,10,8),material('#baa26d',true));pin.position.set(side*(offset+Math.max(...outer.map(p=>p.x))*.88),.22,.22);
  }
  for(const side of [-1,1]){
   const pad=nasalPads(d,side),shape=new THREE.Shape(pad.outline.map(p=>new THREE.Vector2(...p)));
   const mesh=addMesh(new THREE.ExtrudeGeometry(shape,{depth:pad.depth,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:4}),rim);
   mesh.position.z=-pad.depth+.03;mesh.userData.part='nasal-pad';
  }
  for(const band of bridgeGeometry(d).bands){const shape=new THREE.Shape(band.outline.map(p=>new THREE.Vector2(...p)));const mesh=addMesh(new THREE.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelSize:.014,bevelThickness:.014,bevelSegments:2,steps:1}),bridge);mesh.position.z=.025;}
  container.dataset.nasalPads='2';container.dataset.measurements=JSON.stringify(designMeasurements(d));
  arm(d,-1,d.armStyle,arms);arm(d,1,d.armStyleRight,arms);
  group.visible=!reference?.visible;render();
 }
 let selectedView='perspectiva';
 function fit(){const target=controls.target,vector=camera.position.clone().sub(target).normalize();const distance=Math.max(9.5,3.3/(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect)+2.3);camera.position.copy(target.clone().addScaledVector(vector,distance));controls.update();}
 function setView(view){
  selectedView=view;const positions={frente:[0,.08,1],perspectiva:[.3,.17,1],lateral:[1,.1,0]};controls.target.set(0,0,-2.3);camera.position.copy(controls.target.clone().add(new THREE.Vector3(...(positions[view]||positions.perspectiva))));fit();render();
 }
 function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();fit();render();}
 const observer=new ResizeObserver(resize);observer.observe(container);setView('perspectiva');resize();
 renderer.domElement.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),e.key==='ArrowLeft'?-.15:.15);camera.position.copy(controls.target.clone().add(offset));controls.update();render();});
 async function loadReference(file){
  if(file.size>15*1024*1024)throw new Error('El modelo debe pesar menos de 15 MB.');
  const buffer=await file.arrayBuffer(),bytes=new DataView(buffer);
  if(buffer.byteLength<20||bytes.getUint32(0,true)!==0x46546c67||bytes.getUint32(4,true)!==2)throw new Error('Selecciona un modelo GLB 2.0 válido.');
  const len=bytes.getUint32(12,true);if(20+len>buffer.byteLength)throw new Error('El modelo GLB está incompleto.');
  const json=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,20,len)));
  if([...(json.buffers||[]),...(json.images||[])].some(x=>x.uri&&!x.uri.startsWith('data:')))throw new Error('El GLB debe incluir sus texturas y geometría, sin archivos externos.');
  const result=await new Promise((resolve,reject)=>new GLTFLoader().parse(buffer,'',resolve,reject));
  const box=new THREE.Box3().setFromObject(result.scene),size=box.getSize(new THREE.Vector3()),max=Math.max(size.x,size.y,size.z);
  if(!Number.isFinite(max)||max<=0)throw new Error('El modelo no contiene geometría visible.');
  if(reference){scene.remove(reference);dispose(reference);}
  reference=result.scene;reference.position.sub(box.getCenter(new THREE.Vector3()));reference.scale.setScalar(4/max);reference.position.multiplyScalar(4/max);scene.add(reference);reference.visible=true;group.visible=false;render();
 }
 function showReference(value){if(reference)reference.visible=value;group.visible=!reference?.visible;render();}
 function destroy(){observer.disconnect();controls.dispose();dispose(group);if(reference)dispose(reference);env.dispose();floor.geometry.dispose();floor.material.dispose();renderer.dispose();}
 return {update,setView,loadReference,showReference,destroy,canvas:renderer.domElement,getCameraState:()=>camera.position.toArray(),getStats:()=>({meshes:group.children.length,model:container.dataset.renderModel})};
}
