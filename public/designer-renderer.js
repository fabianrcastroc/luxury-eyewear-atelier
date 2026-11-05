import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {normalizeDesign,frameColors,lensColors,photoColors} from './designer-model.js';

export function createDesignRenderer(container){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power',preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0xf0ece1,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.88;
 renderer.domElement.setAttribute('aria-label','Vista 3D interactiva de tus gafas. Arrastra para girar.');renderer.domElement.setAttribute('role','img');renderer.domElement.tabIndex=0;
 container.replaceChildren(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.enablePan=false;controls.minDistance=4.7;controls.maxDistance=13;controls.maxPolarAngle=Math.PI*.72;controls.target.set(0,0,-.5);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xfffaf0,0x6b6354,1.5));
 const light=new THREE.DirectionalLight(0xfff1d5,3);light.position.set(-3,7,5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-5;light.shadow.camera.right=5;light.shadow.camera.top=5;light.shadow.camera.bottom=-5;light.shadow.bias=-.001;scene.add(light);
 const fill=new THREE.DirectionalLight(0xffffff,2);fill.position.set(5,3,-3);scene.add(fill);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({color:0x5f5541,opacity:.16}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.02;floor.receiveShadow=true;scene.add(floor);
 let group=new THREE.Group(),reference=null;scene.add(group);
 let framePending=false;
 function render(){if(framePending)return;framePending=true;requestAnimationFrame(()=>{framePending=false;renderer.render(scene,camera);});}
 controls.addEventListener('change',render);
 function dispose(object){object.traverse(o=>{o.geometry?.dispose();if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();});}});}
 function material(hex,metal=false){return new THREE.MeshPhysicalMaterial({color:hex,roughness:metal?.25:.22,metalness:metal?.8:.06,clearcoat:1,clearcoatRoughness:.13,transmission:metal?0:.12,thickness:.35,envMapIntensity:.95});}
 function addMesh(geometry,mat,parent=group){const mesh=new THREE.Mesh(geometry,mat);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function contours(d,side,scale=1){
  const points=[],n=2.05+(100-d.rounding)/100*4.8;
  for(let i=0;i<96;i++){
   const a=i/96*Math.PI*2,c=Math.cos(a),s=Math.sin(a);
   let x=Math.sign(c)*Math.abs(c)**(2/n)*.89*scale,y=Math.sign(s)*Math.abs(s)**(2/n)*.67*scale;
   if(d.model==='cat-eye')y+=Math.max(0,x*side)*.27*(y>0?1:.3);
   if(d.model==='aviador'){y*=1.12;const lower=Math.max(0,-s);x*=1-lower*.22;y-=lower*Math.max(0,x*side)*.14;}
   points.push(new THREE.Vector2(x,y));
  }return points;
 }
 function arm(d,side,style,mat){
  const length=(d.armLength/145)*2.8,x=side*2.12;
  const profiles={
   clasico:[[x,.14,0],[x+side*.04,.14,-.8],[x,.08,-length*.75],[x-side*.17,-.25,-length]],
   fino:[[x,.14,0],[x+side*.03,.15,-length*.55],[x-side*.12,.1,-length*.9],[x-side*.22,-.25,-length]],
   escultural:[[x,.14,0],[x+side*.22,.22,-.6],[x+side*.12,.12,-length*.65],[x-side*.22,-.25,-length]],
   sable:[[x,.14,0],[x+side*.25,.3,-.75],[x+side*.06,.27,-length*.75],[x-side*.26,-.2,-length]],
   curvo:[[x,.14,0],[x-side*.1,.26,-.65],[x+side*.22,.04,-length*.55],[x-side*.2,-.3,-length]],
   gancho:[[x,.14,0],[x+side*.08,.16,-length*.55],[x-side*.03,.1,-length*.87],[x-side*.28,-.1,-length],[x-side*.3,-.5,-length*.9]]
  };
  const curve=new THREE.CatmullRomCurve3(profiles[style].map(p=>new THREE.Vector3(...p)));
  const radius=style==='fino'?.045:style==='escultural'?.115:style==='sable'?.09:.07;
  addMesh(new THREE.TubeGeometry(curve,44,radius,8,false),mat);
  const hinge=addMesh(new THREE.BoxGeometry(.1,.13,.18),material('#baa26d',true));hinge.position.set(x,.14,-.04);
 }
 function update(raw){
  const d=normalizeDesign(raw);scene.remove(group);dispose(group);group=new THREE.Group();scene.add(group);
  const rim=material(frameColors.find(c=>c.id===d.rimColor).hex),bridge=material(frameColors.find(c=>c.id===d.bridgeColor).hex),arms=material(frameColors.find(c=>c.id===d.armColor).hex);
  const gap=.27+(d.bridgeWidth-16)*.018,offset=.89+gap;
  for(const side of [-1,1]){
   const outer=contours(d,side),inner=contours(d,side,1-(d.thickness*.012));
   const shape=new THREE.Shape(outer);shape.holes.push(new THREE.Path([...(d.model==='clubmaster'?contours(d,side,.965):inner)].reverse()));
   const ring=addMesh(new THREE.ExtrudeGeometry(shape,{depth:.11+d.thickness*.009,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:3,steps:1}),d.model==='clubmaster'?material('#bfa876',true):rim);ring.position.set(side*offset,0,0);
   if(d.model==='clubmaster'){const brow=new THREE.Shape([...outer.slice(0,49),...inner.slice(0,49).reverse()]);const browMesh=addMesh(new THREE.ExtrudeGeometry(brow,{depth:.15,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:2}),rim);browMesh.position.set(side*offset,0,.02);}
   const tinted=d.use==='sol'||d.sunOptical||d.photo;
   const color=d.photo?photoColors.find(c=>c.id===d.photoColor).hex:lensColors.find(c=>c.id===d.lensColor).hex;
   const lensMaterial=new THREE.MeshPhysicalMaterial({color:tinted?new THREE.Color(color).multiplyScalar(.5):'#e2eeeb',transparent:true,opacity:tinted?.79:.15,roughness:.1,metalness:0,clearcoat:.5,side:THREE.DoubleSide,envMapIntensity:.5});
   const lens=addMesh(new THREE.ShapeGeometry(new THREE.Shape(inner)),lensMaterial);lens.position.set(side*offset,0,.035);
   const pin=addMesh(new THREE.SphereGeometry(.023,10,8),material('#baa26d',true));pin.position.set(side*(offset+.77),.22,.22);
  }
  const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-gap-.03,.23,.09),new THREE.Vector3(0,.23+d.bridgeCurve*.0045,.12),new THREE.Vector3(gap+.03,.23,.09));
  addMesh(new THREE.TubeGeometry(curve,24,.035+d.thickness*.004,10,false),bridge);
  if(d.model==='aviador')addMesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-gap,.53,.09),new THREE.Vector3(0,.6,.1),new THREE.Vector3(gap,.53,.09)),16,.03,8,false),bridge);
  arm(d,-1,d.armStyle,arms);arm(d,1,d.armStyleRight,arms);
  group.visible=!reference?.visible;render();
 }
 function setView(view){
  const positions={frente:[0,.15,8.1],perspectiva:[4,2.5,6.5],lateral:[7.3,1.1,.5]};camera.position.set(...positions[view]||positions.perspectiva);controls.target.set(0,0,-.55);controls.update();render();
 }
 function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();render();}
 const observer=new ResizeObserver(resize);observer.observe(container);setView('perspectiva');resize();
 renderer.domElement.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();group.rotation.y+=e.key==='ArrowLeft'?-.15:.15;render();});
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
 return {update,setView,loadReference,showReference,destroy,canvas:renderer.domElement};
}
