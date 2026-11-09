import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {frameContour,lensContour,lensCenters,bridgeGeometry,designMeasurements,nasalPads,MM} from './frame-geometry.js';
import {normalizeDesign,frameColors,lensColors,photoColors} from './designer-model.js';
import {templeSections} from './temple-development.js';

export function createDesignRenderer(container){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power',preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0xf7f7f4,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
 renderer.domElement.setAttribute('aria-label','Vista 3D interactiva de tus gafas. Arrastra para girar; botón derecho para desplazar; rueda para acercar.');renderer.domElement.setAttribute('role','img');renderer.domElement.tabIndex=0;
 container.replaceChildren(renderer.domElement);
 const scene=new THREE.Scene();let camera=new THREE.PerspectiveCamera(34,1,.1,100);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.enablePan=true;controls.screenSpacePanning=true;controls.minDistance=3;controls.maxDistance=40;controls.minZoom=.35;controls.maxZoom=8;controls.maxPolarAngle=Math.PI*.95;controls.target.set(0,0,-.5);
 const display={wireframe:false,grid:false,axes:false};
 // Grid lies in the frontal drawing plane, with 5 mm spacing in scene units.
 const grid=new THREE.GridHelper(250*MM,50,0xa2ada7,0xd6ddd8);grid.rotation.x=Math.PI/2;grid.position.z=-.12;grid.visible=false;grid.material.transparent=true;grid.material.opacity=.55;scene.add(grid);
 const axes=new THREE.AxesHelper(25*MM);axes.position.set(-3.5,-2,-.1);axes.visible=false;scene.add(axes);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0x737373,1.2));
 const light=new THREE.DirectionalLight(0xffffff,2.6);light.position.set(-3,7,5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-5;light.shadow.camera.right=5;light.shadow.camera.top=5;light.shadow.camera.bottom=-5;light.shadow.bias=-.001;scene.add(light);
 const fill=new THREE.DirectionalLight(0xffffff,2);fill.position.set(5,3,-3);scene.add(fill);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({color:0x343434,opacity:.035}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.6;floor.receiveShadow=true;scene.add(floor);
 let group=new THREE.Group(),reference=null;scene.add(group);
 let framePending=false;
 function render(){if(framePending)return;framePending=true;requestAnimationFrame(()=>{framePending=false;renderer.render(scene,camera);container.dataset.camera=JSON.stringify(camera.position.toArray());container.dataset.projection=camera.isOrthographicCamera?'orthographic':'perspective';container.dataset.wireframe=String(display.wireframe);container.dataset.grid=String(display.grid);});}
 controls.addEventListener('change',render);
 function dispose(object){object.traverse(o=>{o.geometry?.dispose();if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();});}});}
 function material(hex,metal=false){return new THREE.MeshPhysicalMaterial({color:hex,roughness:metal?.23:.2,metalness:metal?.8:0,clearcoat:1,clearcoatRoughness:.1,transmission:0,thickness:.35,envMapIntensity:.8});}
 function addMesh(geometry,mat,parent=group){const mesh=new THREE.Mesh(geometry,mat);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function contours(d,side,scale=1){return frameContour(d,side,scale).map(p=>new THREE.Vector2(...p));}
 function arm(d,side,style,mat){
  const sections=templeSections(d,side,style);
  function sweep(rows,part){
   const positions=[],indices=[],count=rows.length-1;
   for(let i=0;i<=count;i++){
    const p=new THREE.Vector3(...rows[i].point),{height}=rows[i],depth=d.materialDepth*MM/2;
    for(const [dx,dy] of [[-depth,-height/2],[depth,-height/2],[depth,height/2],[-depth,height/2]])positions.push(p.x+dx,p.y+dy,p.z);
    if(i<count)for(let j=0;j<4;j++){const a=i*4+j,b=i*4+(j+1)%4,c=(i+1)*4+j,e=(i+1)*4+(j+1)%4;indices.push(a,b,c,b,e,c);}
   }
   indices.push(0,2,1,0,3,2);const end=count*4;indices.push(end,end+1,end+2,end,end+2,end+3);
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
   const mesh=addMesh(geometry,mat);mesh.name=`temple-${side}-${part}`;mesh.userData={part:'temple',materialClass:'acetate-stock',stockThicknessMM:d.materialDepth,thicknessAxis:'local-x-at-each-section',sectionVertexCount:4};
  }
  sweep(sections.stem,'stem');sweep(sections.hook,'hook');
  const start=sections.stem[0].point,stockDepth=d.materialDepth*MM;
  const endpiece=addMesh(new THREE.BoxGeometry(.16,.14,stockDepth),mat);endpiece.position.set(start[0]-side*.05,start[1],stockDepth/2);endpiece.name=`endpiece-${side}`;endpiece.userData={part:'endpiece',materialClass:'acetate-stock',stockThicknessMM:d.materialDepth,thicknessAxis:'z'};
  // Hardware is a separate illustrative component, not acetate to cut from the sheet.
  const hinge=addMesh(new THREE.BoxGeometry(.11,.13,Math.min(.18,stockDepth*.8)),material('#baa26d',true));hinge.position.set(start[0],start[1],stockDepth/2);hinge.name=`hinge-placeholder-${side}`;hinge.userData={part:'hinge',materialClass:'hardware-placeholder',manufacturingValidated:false};
 }
 function update(raw){
  const d=normalizeDesign(raw),mixed=d.model==='curvo'&&!d.customContour,stockDepth=d.materialDepth*MM;container.dataset.renderModel=d.model;container.dataset.config=JSON.stringify(d);scene.remove(group);dispose(group);group=new THREE.Group();scene.add(group);
  const rim=material(frameColors.find(c=>c.id===d.rimColor).hex),bridge=material(frameColors.find(c=>c.id===d.bridgeColor).hex),arms=material(frameColors.find(c=>c.id===d.armColor).hex);
  const centers=lensCenters(d);
  for(const side of [-1,1]){
   const outer=contours(d,side),inner=lensContour(d,side).map(p=>new THREE.Vector2(...p)),offset=Math.abs(centers[side===-1?0:1]);
   const baseOuter=frameContour({...d,nasalProjection:0},side);
   const metalOuter=mixed?lensContour(d,side).map(([x,y],i)=>new THREE.Vector2(x*1.025+outer[i].x-baseOuter[i][0],y*1.025)):outer;
   const shape=new THREE.Shape(metalOuter);shape.holes.push(new THREE.Path([...inner].reverse()));
   // Avoid outward bevel expansion: the visual silhouette must match the millimetre pattern.
   const ring=addMesh(new THREE.ExtrudeGeometry(shape,{depth:mixed?.12:stockDepth,bevelEnabled:false,steps:1}),mixed?material('#bfa876',true):rim);ring.position.set(side*offset,0,0);ring.name=`rim-${side}`;ring.userData={part:'rim',materialClass:mixed?'metal-preview':'acetate-stock',stockThicknessMM:mixed?3:d.materialDepth,thicknessAxis:'z'};
   if(mixed){const brow=new THREE.Shape([...outer.slice(0,65),...inner.slice(0,65).reverse()]);const browMesh=addMesh(new THREE.ExtrudeGeometry(brow,{depth:stockDepth,bevelEnabled:false,steps:1}),rim);browMesh.position.set(side*offset,0,0);browMesh.name=`brow-${side}`;browMesh.userData={part:'brow',materialClass:'acetate-stock',stockThicknessMM:d.materialDepth,thicknessAxis:'z'};}
   const tinted=d.use==='sol'||d.sunOptical||d.photo;
   const color=d.photo?photoColors.find(c=>c.id===d.photoColor).hex:lensColors.find(c=>c.id===d.lensColor).hex;
   const lensMaterial=new THREE.MeshPhysicalMaterial({color:tinted?new THREE.Color(color).multiplyScalar(.65):'#e2eeeb',transparent:true,opacity:tinted?.9:.1,roughness:.1,metalness:0,clearcoat:.5,side:THREE.DoubleSide,envMapIntensity:.5});
   const lens=addMesh(new THREE.ShapeGeometry(new THREE.Shape(inner)),lensMaterial);lens.position.set(side*offset,0,.035);lens.name=`lens-${side}`;lens.userData={part:'lens',materialClass:'lens-preview'};
   const pin=addMesh(new THREE.SphereGeometry(.023,10,8),material('#baa26d',true));pin.position.set(side*(offset+Math.max(...outer.map(p=>p.x))*.88),.22,stockDepth+.015);pin.name=`pin-placeholder-${side}`;pin.userData={part:'pin',materialClass:'hardware-placeholder',manufacturingValidated:false};
  }
  for(const side of [-1,1]){
   const pad=nasalPads(d,side),shape=new THREE.Shape(pad.outline.map(p=>new THREE.Vector2(...p)));
   const mesh=addMesh(new THREE.ExtrudeGeometry(shape,{depth:pad.depth,bevelEnabled:false,steps:1}),rim);
   mesh.position.z=-pad.depth;mesh.name=`laminated-nasal-pad-${side}`;mesh.userData={part:'nasal-pad',materialClass:'added-laminate',operation:'bond-separate-pad-to-rear',addedThicknessMM:pad.depth/MM,includedInMainStock:false,manufacturingValidated:false};
  }
  for(const [index,band] of bridgeGeometry(d).bands.entries()){const shape=new THREE.Shape(band.outline.map(p=>new THREE.Vector2(...p)));const mesh=addMesh(new THREE.ExtrudeGeometry(shape,{depth:stockDepth,bevelEnabled:false,steps:1}),bridge);mesh.position.z=0;mesh.name=`bridge-${index}`;mesh.userData={part:'bridge',materialClass:'acetate-stock',stockThicknessMM:d.materialDepth,thicknessAxis:'z'};}
  container.dataset.nasalPads='2';container.dataset.padConstruction='added-laminate-3mm';container.dataset.measurements=JSON.stringify(designMeasurements(d));
  arm(d,-1,d.armStyle,arms);arm(d,1,d.armStyle,arms);
  group.visible=!reference?.visible;applyDisplay();render();
 }
 function fit(){
  const target=controls.target,vector=camera.position.clone().sub(target).normalize(),aspect=Math.max(.15,camera.aspect||1);
  if(!vector.lengthSq())vector.set(0,0,1);
  if(camera.isOrthographicCamera){camera.zoom=1;camera.updateProjectionMatrix();camera.position.copy(target.clone().addScaledVector(vector,12));}
  else{camera.zoom=1;const distance=Math.max(9.5,3.3/(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*aspect)+2.3);camera.position.copy(target.clone().addScaledVector(vector,Math.min(38,distance)));camera.updateProjectionMatrix();}
  controls.update();
 }
 function setView(view){
  const positions={frente:[0,0,1],perspectiva:[.3,.17,1],lateral:[1,0,0]};controls.target.set(0,0,-2.3);camera.position.copy(controls.target.clone().add(new THREE.Vector3(...(positions[view]||positions.perspectiva))));fit();render();
 }
 function updateFrustum(aspect){camera.aspect=aspect;if(camera.isOrthographicCamera){const height=Math.max(7,7/aspect);camera.left=-height*aspect/2;camera.right=height*aspect/2;camera.top=height/2;camera.bottom=-height/2;}camera.updateProjectionMatrix();}
 function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);updateFrustum(w/h);render();}
 function setProjection(projection){
  if(!['orthographic','perspective'].includes(projection))return;
  if((camera.isOrthographicCamera?'orthographic':'perspective')===projection)return;
  const previous=camera,aspect=previous.aspect||1;
  camera=projection==='orthographic'?new THREE.OrthographicCamera(-4,4,4,-4,.1,100):new THREE.PerspectiveCamera(34,aspect,.1,100);
  camera.position.copy(previous.position);camera.quaternion.copy(previous.quaternion);camera.up.copy(previous.up);controls.object=camera;updateFrustum(aspect);
  // Match the apparent target-plane size when changing camera projection.
  const distance=previous.position.distanceTo(controls.target);
  if(camera.isOrthographicCamera){const visibleHeight=2*distance*Math.tan(THREE.MathUtils.degToRad(previous.fov/2))/previous.zoom;camera.zoom=(camera.top-camera.bottom)/visibleHeight;}
  else if(previous.isOrthographicCamera){const visibleHeight=(previous.top-previous.bottom)/previous.zoom;const nextDistance=visibleHeight/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)));camera.position.copy(controls.target.clone().addScaledVector(previous.position.clone().sub(controls.target).normalize(),nextDistance));}
  camera.updateProjectionMatrix();controls.update();render();
 }
 function applyDisplay(){group.traverse(object=>{if(!object.material)return;for(const material of (Array.isArray(object.material)?object.material:[object.material])){if('wireframe' in material)material.wireframe=display.wireframe;}});grid.visible=display.grid;axes.visible=display.axes;}
 function setDisplay(settings={}){for(const key of ['wireframe','grid','axes'])if(typeof settings[key]==='boolean')display[key]=settings[key];applyDisplay();render();}
 function zoom(factor){if(!Number.isFinite(factor)||factor<=0)return;if(camera.isOrthographicCamera){camera.zoom=THREE.MathUtils.clamp(camera.zoom*factor,controls.minZoom,controls.maxZoom);camera.updateProjectionMatrix();}else{const offset=camera.position.clone().sub(controls.target);const distance=THREE.MathUtils.clamp(offset.length()/factor,controls.minDistance,controls.maxDistance);camera.position.copy(controls.target.clone().addScaledVector(offset.normalize(),distance));}controls.update();render();}
 function fitView(){controls.target.set(0,0,-2.3);fit();render();}
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
 async function exportGLB(){
  if(!group.children.length)throw new Error('Primero crea una montura para exportar.');
  const snapshot=group.clone(true);
  // glTF declares metres; each scene unit is 1 / MM millimetres.
  snapshot.scale.multiplyScalar(.001/MM);
  snapshot.name='Miscante eyewear';
  snapshot.userData={...snapshot.userData,units:'metres',design:JSON.parse(container.dataset.config||'{}'),purpose:'Parametric design preview; validate manufacturing fit separately'};
  return new GLTFExporter().parseAsync(snapshot,{binary:true,onlyVisible:false});
 }
 function destroy(){observer.disconnect();controls.dispose();dispose(group);if(reference)dispose(reference);dispose(grid);dispose(axes);env.dispose();floor.geometry.dispose();floor.material.dispose();renderer.dispose();}
 return {update,setView,setProjection,setDisplay,zoom,fitView,exportGLB,loadReference,showReference,destroy,canvas:renderer.domElement,getCameraState:()=>camera.position.toArray(),getStats:()=>({meshes:group.children.length,model:container.dataset.renderModel,projection:camera.isOrthographicCamera?'orthographic':'perspective',...display})};
}
