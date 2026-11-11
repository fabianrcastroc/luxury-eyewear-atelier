import {constructionEdges} from './construction-edges.js';
import {formGeometry,formingParameters} from './front-forming.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {frameContour,lensContour,lensCenters,bridgeGeometry,designMeasurements,nasalPads,hingeGeometry,MM} from './frame-geometry.js';
import {normalizeDesign,frameColors,lensColors,photoColors} from './designer-model.js';
import {templeSections} from './temple-development.js';
import {finishedExtrusion,finishedTemple,finishedNasalLaminate,finishedLens,finishedHinge,finishedRivetPair} from './finished-geometry.js';
import {frontCutGeometry} from './manufacturing.js';

export function createDesignRenderer(container){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power',preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0x3b444d,1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;
 renderer.domElement.setAttribute('aria-label','Vista 3D interactiva de tus gafas. Arrastra para girar; botón derecho para desplazar; rueda para acercar.');renderer.domElement.setAttribute('role','img');renderer.domElement.tabIndex=0;
 container.replaceChildren(renderer.domElement);
 const scene=new THREE.Scene();let camera=new THREE.PerspectiveCamera(34,1,.1,100);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.enablePan=true;controls.screenSpacePanning=true;controls.minDistance=3;controls.maxDistance=40;controls.minZoom=.35;controls.maxZoom=8;controls.maxPolarAngle=Math.PI*.95;controls.target.set(0,0,-.5);
 const display={wireframe:false,grid:false,axes:false},partVisibility={rims:true,lenses:true,bridge:true,temples:true,pads:true,hinges:true};let selectedPart=null;
 // The 3D workplane is below the model; it must never cross opaque temples.
 const grid=new THREE.GridHelper(250*MM,50,0xa2ada7,0xd6ddd8);grid.position.y=-2;grid.visible=false;grid.material.transparent=true;grid.material.opacity=.55;scene.add(grid);
 const axes=new THREE.AxesHelper(25*MM);axes.position.set(-3.5,-2,-.1);axes.visible=false;scene.add(axes);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0x737373,.85));
 const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(-3,7,5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-5;light.shadow.camera.right=5;light.shadow.camera.top=5;light.shadow.camera.bottom=-5;light.shadow.bias=-.001;scene.add(light);
 const fill=new THREE.DirectionalLight(0xffffff,2);fill.position.set(5,3,-3);scene.add(fill);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({color:0x343434,opacity:.035}));floor.rotation.x=-Math.PI/2;floor.position.y=-2;floor.material.depthWrite=false;floor.receiveShadow=true;scene.add(floor);
 let group=new THREE.Group(),reference=null,initialModelFit=true;scene.add(group);
 let framePending=false;
 function render(){if(framePending)return;framePending=true;requestAnimationFrame(()=>{framePending=false;renderer.render(scene,camera);container.dataset.camera=JSON.stringify(camera.position.toArray());container.dataset.projection=camera.isOrthographicCamera?'orthographic':'perspective';container.dataset.wireframe=String(display.wireframe);container.dataset.grid=String(display.grid);});}
 controls.addEventListener('change',render);
 const raycaster=new THREE.Raycaster();let pickStart=null;
 renderer.domElement.addEventListener('pointerdown',event=>{if(event.button===0)pickStart=[event.clientX,event.clientY];});
 renderer.domElement.addEventListener('pointerup',event=>{if(!pickStart||Math.hypot(event.clientX-pickStart[0],event.clientY-pickStart[1])>5){pickStart=null;return;}pickStart=null;if(container.closest('.cad-workspace')?.dataset.tool!=='select')return;const box=renderer.domElement.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((event.clientX-box.left)/box.width*2-1,-(event.clientY-box.top)/box.height*2+1),camera);const hit=raycaster.intersectObject(group,true).find(h=>h.object.visible&&(Array.isArray(h.object.material)?h.object.material[h.face.materialIndex]:h.object.material)?.visible!==false);if(!hit)return;const mat=Array.isArray(hit.object.material)?hit.object.material[hit.face.materialIndex]:hit.object.material,part=mat.userData.part||partKey(hit.object);if(part)container.dispatchEvent(new CustomEvent('designpartselect',{bubbles:true,detail:{part}}));});

 function dispose(object){object.traverse(o=>{o.geometry?.dispose();if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();});}});}
 const materialTextures=new Map();
 function acetateTexture(hex){
  if(!['#68422e','#577b99'].includes(hex))return null;
  if(!materialTextures.has(hex)){
   const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d'),img=ctx.createImageData(256,256),marble=hex==='#577b99';
   const noise=(x,y,period)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,s=t=>t*t*(3-2*t),hash=(a,b)=>{const v=Math.sin(((a%period+period)%period)*127.1+((b%period+period)%period)*311.7)*43758.5453;return v-Math.floor(v);};const a=hash(ix,iy),b=hash(ix+1,iy),c=hash(ix,iy+1),d=hash(ix+1,iy+1),u=s(fx),v=s(fy);return (a+(b-a)*u)*(1-v)+(c+(d-c)*u)*v;};
   for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    const n=Math.sin(x*.037+Math.cos(y*.051)*2)+.5*Math.sin(x*.113+y*.079)+.22*Math.cos(x*.25-y*.18),i=(y*256+x)*4;
    let rgb;if(marble){const vein=Math.pow(Math.max(0,1-Math.abs(Math.sin((x*.033+y*.018)+n*.8))),12),stone=(Math.sin(x*.1+y*.05+n)*.5+.5);rgb=[57+36*stone+116*vein,83+41*stone+100*vein,106+44*stone+80*vein];}
    else{const cloud=.55*noise(x/64,y/64,4)+.3*noise(x/32,y/32,8)+.15*noise(x/16,y/16,16),t=Math.max(0,Math.min(1,(cloud-.31)/.4)),amber=t*t*(3-2*t);rgb=[23+125*amber,17+70*amber,12+28*amber];}
    img.data[i]=rgb[0];img.data[i+1]=rgb[1];img.data[i+2]=rgb[2];img.data[i+3]=255;
   }
   ctx.putImageData(img,0,0);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());materialTextures.set(hex,texture);
  }
  const result=materialTextures.get(hex).clone();result.needsUpdate=true;return result;
 }
 function material(hex,metal=false){const map=metal?null:acetateTexture(hex);return new THREE.MeshPhysicalMaterial({color:map?'#ffffff':hex,map,roughness:metal?.26:.27,metalness:metal?.8:0,clearcoat:.55,clearcoatRoughness:.22,transmission:0,transparent:false,opacity:1,side:THREE.DoubleSide,thickness:.35,envMapIntensity:.7});}

 function addMesh(geometry,mat,parent=group){const mesh=new THREE.Mesh(geometry,mat.clone());const edge=new THREE.LineSegments(constructionEdges(geometry),new THREE.LineBasicMaterial({color:(mat.color.r+mat.color.g+mat.color.b)>1.5?0x17222c:0xc1cdd5,transparent:true,opacity:.7}));edge.userData.featureEdges=true;edge.visible=display.wireframe;mesh.add(edge);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function contours(d,side,scale=1){return frameContour(d,side,scale).map(p=>new THREE.Vector2(...p));}
 function arm(d,side,style,mat){
  const sections=templeSections(d,side,style),geometry=finishedTemple(sections.rows),mesh=addMesh(geometry,mat);
  mesh.name=`temple-${side}`;mesh.userData={part:'temple',materialClass:'acetate-stock',stockThicknessMM:d.materialDepth,sectionVertexCount:geometry.userData.sectionVertexCount,sectionCount:sections.rows.length,continuous:true,nominalLengthMM:sections.developedLength};
  const hinge=hingeGeometry(d,side);
  const hardware=addMesh(finishedHinge(hinge.hardware.size),material('#9b927d',true));hardware.position.set(...hinge.hardware.center);hardware.name=`hinge-${side}`;hardware.userData={part:'hinge',materialClass:'hardware-placeholder',manufacturingValidated:false,construction:'three-knuckle-two-leaf-hinge',illustrativeEnvelopeMM:hinge.hardware.size.map(v=>v/MM)};
 }
 function update(raw){
  const d=normalizeDesign(raw),stockDepth=d.materialDepth*MM;container.dataset.renderModel=d.model;const cut=frontCutGeometry(d);for(const side of [-1,1])templeSections(d,side);container.dataset.config=JSON.stringify(d);scene.remove(group);dispose(group);group=new THREE.Group();scene.add(group);
  const rim=material(frameColors.find(c=>c.id===d.rimColor).hex),bridge=material(frameColors.find(c=>c.id===d.bridgeColor).hex),arms=material(frameColors.find(c=>c.id===d.armColor).hex),centers=lensCenters(d);
  const frontGeometry=finishedExtrusion(cut.outerLoops[0].map(p=>p.map(v=>v*MM)),cut.holes.map(h=>h.map(p=>p.map(v=>v*MM))),stockDepth,Math.min(.8,d.thickness*.22)*MM);
  const front=addMesh(frontGeometry,rim);front.name='finished-front';front.userData={part:'front',materialClass:'acetate-stock',stockThicknessMM:d.materialDepth,thicknessAxis:'z',finishedEdges:true,connectedFront:true};
  front.material.dispose();front.material=[rim.clone(),bridge.clone()];front.material[0].userData.part='rims';front.material[1].userData.part='bridge';
  const bandPolys=bridgeGeometry(d).bands.map(b=>b.outline);
  const inside=(p,poly)=>{let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;};
  frontGeometry.clearGroups();const vertices=frontGeometry.attributes.position,index=frontGeometry.index,rimIndices=[],bridgeIndices=[];
  for(let i=0;i<index.count;i+=3){const p=[0,0];for(let j=0;j<3;j++){const at=index.getX(i+j);p[0]+=vertices.getX(at)/3;p[1]+=vertices.getY(at)/3;}(bandPolys.some(poly=>inside(p,poly))?bridgeIndices:rimIndices).push(index.getX(i),index.getX(i+1),index.getX(i+2));}
  frontGeometry.setIndex([...rimIndices,...bridgeIndices]);frontGeometry.addGroup(0,rimIndices.length,0);if(bridgeIndices.length)frontGeometry.addGroup(rimIndices.length,bridgeIndices.length,1);
  for(const side of [-1,1]){
   const inner=lensContour(d,side),center=centers[side===-1?0:1];
   const tinted=d.use==='sol'||d.sunOptical||d.photo,color=d.photo?photoColors.find(c=>c.id===d.photoColor).hex:lensColors.find(c=>c.id===d.lensColor).hex;
   const lensMat=new THREE.MeshPhysicalMaterial({color:tinted?new THREE.Color(color).multiplyScalar(.78):'#d5e0df',transparent:true,opacity:tinted?.82:.14,roughness:.11,metalness:0,clearcoat:1,clearcoatRoughness:.08,ior:1.5,side:THREE.DoubleSide,depthWrite:false});
   const lensDepth=Math.min(1.2,d.materialDepth*.45)*MM;
   const lens=addMesh(finishedLens(inner,lensDepth),lensMat);lens.position.set(center,0,(stockDepth-lensDepth)*.5);lens.name=`lens-${side}`;lens.userData={part:'lens',materialClass:'lens-preview',closedLensBlank:true,illustrativeThicknessMM:lensDepth/MM,opticalPrescription:false,manufacturingValidated:false};
   const hinge=hingeGeometry(d,side),pin=addMesh(finishedRivetPair(),material('#a4a08b',true));pin.position.set(hinge.anchor[0],hinge.anchor[1],stockDepth);pin.name=`pin-${side}`;pin.userData={part:'pin',materialClass:'hardware-placeholder',construction:'paired-flush-rivets',manufacturingValidated:false};
  }
  for(const side of [-1,1]){
   const pad=nasalPads(d,side);if(pad.outline.length<3)continue;
   const mesh=addMesh(finishedNasalLaminate(pad.outline,pad.depth),rim);mesh.position.z=-pad.depth;mesh.name=`nasal-pad-${side}`;mesh.userData={part:'nasal-pad',materialClass:'added-laminate',addedThicknessMM:pad.depth/MM,includedInMainStock:false,manufacturingValidated:false,polishedContinuity:true,finish:'tapered-added-laminate',bondFaceZMM:0};
  }
  container.dataset.nasalPads='2';container.dataset.padConstruction='polished-laminated-crescent';container.dataset.measurements=JSON.stringify(designMeasurements(d));
  arm(d,-1,d.armStyle,arms);arm(d,1,d.armStyle,arms);if(d.frontWrap){const forming=formingParameters(d);for(const mesh of group.children){if(!mesh.isMesh)continue;const position=mesh.position.toArray();formGeometry(mesh.geometry,d,mesh.name,position,MM,forming);for(const child of mesh.children)if(child.userData.featureEdges)formGeometry(child.geometry,d,mesh.name,position,MM,forming);mesh.position.set(0,0,0);}}rim.dispose();bridge.dispose();arms.dispose();group.visible=!reference?.visible;applyDisplay();if(initialModelFit){initialModelFit=false;fit();}render();
 }
 function fit(){
  const target=controls.target,vector=camera.position.clone().sub(target).normalize(),aspect=Math.max(.15,camera.aspect||1);
  if(!vector.lengthSq())vector.set(0,0,1);
  if(camera.isOrthographicCamera){camera.zoom=1;camera.position.copy(target.clone().addScaledVector(vector,12));controls.update();camera.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(group);if(!box.isEmpty()){const inverse=camera.quaternion.clone().invert(),corners=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])corners.push(new THREE.Vector3(x,y,z).sub(target).applyQuaternion(inverse));const width=Math.max(...corners.map(p=>Math.abs(p.x)))*2,height=Math.max(...corners.map(p=>Math.abs(p.y)))*2;camera.zoom=Math.min((camera.right-camera.left)/Math.max(width,.1),(camera.top-camera.bottom)/Math.max(height,.1))/1.16;}camera.updateProjectionMatrix();}
  else{
   camera.zoom=1;camera.position.copy(target.clone().addScaledVector(vector,12));controls.update();camera.updateMatrixWorld(true);group.updateMatrixWorld(true);
   const inverse=camera.quaternion.clone().invert(),points=[],point=new THREE.Vector3();
   group.traverse(object=>{if(!object.isMesh||!object.visible)return;const p=object.geometry.attributes.position;for(let i=0;i<p.count;i++){point.fromBufferAttribute(p,i).applyMatrix4(object.matrixWorld).sub(target).applyQuaternion(inverse);points.push(point.x,point.y,point.z);}});
   if(points.length){
    const tanY=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),tanX=tanY*aspect,margin=1.12;
    // Fit every projected vertex against both frustum axes. The former
    // iterative target shift could overshoot and crop an entire eye on load.
    let distance=controls.minDistance;
    for(let i=0;i<points.length;i+=3)distance=Math.max(distance,points[i+2]+margin*Math.max(Math.abs(points[i])/tanX,Math.abs(points[i+1])/tanY));
    camera.position.copy(target.clone().addScaledVector(vector,Math.min(controls.maxDistance,distance)));

   }else camera.position.copy(target.clone().addScaledVector(vector,Math.max(9.5,3.3/(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*aspect)+2.3)));
   camera.updateProjectionMatrix();
  }
  controls.update();
 }
 function setView(view){
  const positions={frente:[0,0,1],front:[0,0,1],perspectiva:[.65,.35,1],perspective:[.65,.35,1],lateral:[1,0,0],right:[1,0,0],superior:[0,1,.0001],top:[0,1,.0001],inferior:[0,-1,.0001],bottom:[0,-1,.0001],posterior:[0,0,-1],back:[0,0,-1]};controls.target.set(0,0,-2.3);camera.position.copy(controls.target.clone().add(new THREE.Vector3(...(positions[view]||positions.perspectiva))));fit();render();
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
 function partKey(object){const part=object.userData.part;return part==='front'?'rims':part==='rim'?'rims':part==='lens'?'lenses':part==='temple'?'temples':part==='nasal-pad'?'pads':part==='hinge'||part==='pin'?'hinges':part==='bridge'?'bridge':null;}
 function applyDisplay(){group.traverse(object=>{if(object.userData.featureEdges){object.visible=display.wireframe;return;}if(!object.material)return;const key=partKey(object);if(key)object.visible=object.userData.part==='front'?(partVisibility.rims||partVisibility.bridge):partVisibility[key];for(const material of (Array.isArray(object.material)?object.material:[object.material])){const semantic=material.userData.part||key;material.visible=semantic?partVisibility[semantic]:true;if('wireframe' in material)material.wireframe=false;if(material.emissive){material.emissive.setHex(selectedPart===semantic?0x28556a:0);material.emissiveIntensity=selectedPart===semantic?.25:1;}}});grid.visible=display.grid;axes.visible=display.axes;}
 function setPartVisibility(part,value){if(part in partVisibility){partVisibility[part]=Boolean(value);applyDisplay();render();}}
 function selectPart(part){selectedPart=part in partVisibility?part:null;applyDisplay();render();}
 function setDisplay(settings={}){for(const key of ['wireframe','grid','axes'])if(typeof settings[key]==='boolean')display[key]=settings[key];applyDisplay();render();}
 function zoom(factor){if(!Number.isFinite(factor)||factor<=0)return;if(camera.isOrthographicCamera){camera.zoom=THREE.MathUtils.clamp(camera.zoom*factor,controls.minZoom,controls.maxZoom);camera.updateProjectionMatrix();}else{const offset=camera.position.clone().sub(controls.target);const distance=THREE.MathUtils.clamp(offset.length()/factor,controls.minDistance,controls.maxDistance);camera.position.copy(controls.target.clone().addScaledVector(offset.normalize(),distance));}controls.update();render();}
 function fitView(){const offset=camera.position.clone().sub(controls.target);controls.target.set(0,0,-2.3);camera.position.copy(controls.target.clone().add(offset));fit();render();}
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
  const snapshot=group.clone(true),helpers=[];snapshot.traverse(o=>{if(o.userData.featureEdges)helpers.push(o);});helpers.forEach(o=>o.removeFromParent());
  // glTF declares metres; each scene unit is 1 / MM millimetres.
  snapshot.scale.multiplyScalar(.001/MM);
  snapshot.name='FR eyewear studio';
  snapshot.userData={...snapshot.userData,units:'metres',design:JSON.parse(container.dataset.config||'{}'),purpose:'Parametric design preview; validate manufacturing fit separately'};
  return new GLTFExporter().parseAsync(snapshot,{binary:true,onlyVisible:false});
 }
 function destroy(){observer.disconnect();controls.dispose();dispose(group);if(reference)dispose(reference);dispose(grid);dispose(axes);env.dispose();floor.geometry.dispose();floor.material.dispose();for(const texture of materialTextures.values())texture.dispose();renderer.dispose();}
 return {update,setView,setProjection,setDisplay,setPartVisibility,selectPart,setSelection:selectPart,zoom,fitView,exportGLB,loadReference,showReference,destroy,canvas:renderer.domElement,getCameraState:()=>camera.position.toArray(),getStats:()=>({meshes:group.children.length,model:container.dataset.renderModel,projection:camera.isOrthographicCamera?'orthographic':'perspective',selectedPart,renderCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,partVisibility:{...partVisibility},...display})};
}
