// Local, deterministic extraction of frontal lens apertures. A photograph cannot
// supply millimetres, depth, hinge placement or machining allowances by itself.
const HELP='Usa una vista frontal, sin perspectiva, con ambos huecos de cristal cerrados y fondo claro o gris neutro uniforme. Indica después un ancho de cristal conocido para calibrar la escala.';
function fail(message){throw new Error(`${message} ${HELP}`);}

function components(mask,width,height,wanted=1){
 const labels=new Int32Array(mask.length),queue=new Int32Array(mask.length),items=[];
 let next=0;
 for(let seed=0;seed<mask.length;seed++){
  if(mask[seed]!==wanted||labels[seed])continue;
  const id=++next;let head=0,tail=1,minX=width,minY=height,maxX=0,maxY=0,sumX=0,sumY=0;
  queue[0]=seed;labels[seed]=id;
  while(head<tail){
   const p=queue[head++],x=p%width,y=Math.floor(p/width);
   minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);sumX+=x;sumY+=y;
   for(const q of [x>0?p-1:-1,x+1<width?p+1:-1,y>0?p-width:-1,y+1<height?p+width:-1])if(q>=0&&mask[q]===wanted&&!labels[q]){labels[q]=id;queue[tail++]=q;}
  }
  items.push({id,area:tail,minX,minY,maxX,maxY,width:maxX-minX+1,height:maxY-minY+1,cx:sumX/tail,cy:sumY/tail,border:minX===0||minY===0||maxX===width-1||maxY===height-1});
 }
 return {labels,items};
}

function healSinglePixelGaps(mask,width,height){
 const eroded=new Uint8Array(mask.length),healed=new Uint8Array(mask.length);
 for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){const p=y*width+x;eroded[p]=mask[p]&&mask[p-1]&&mask[p+1]&&mask[p-width]&&mask[p+width]?1:0;}
 for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){const p=y*width+x;healed[p]=eroded[p]||eroded[p-1]||eroded[p+1]||eroded[p-width]||eroded[p+width]?1:0;}
 return healed;
}

function histogramThreshold(gray){
 const histogram=new Uint32Array(256);let total=0,sum=0;
 for(const v of gray){histogram[v]++;sum+=v;total++;}
 let left=0,leftSum=0,best=0,threshold=128;
 for(let value=0;value<255;value++){left+=histogram[value];leftSum+=value*histogram[value];if(!left||left===total)continue;const diff=leftSum/left-(sum-leftSum)/(total-left),variance=left*(total-left)*diff*diff;if(variance>best){best=variance;threshold=value;}}
 return threshold;
}

function choosePair(items,width,height){
 const candidates=items.filter(c=>!c.border&&c.area>=width*height*.0015&&c.width>=width*.045&&c.height>=height*.04&&c.height/c.width>=.35&&c.height/c.width<=1.3&&c.area/(c.width*c.height)>.45);
 let best=null;
 for(let i=0;i<candidates.length;i++)for(let j=i+1;j<candidates.length;j++){
  const [left,right]=[candidates[i],candidates[j]].sort((a,b)=>a.cx-b.cx),averageWidth=(left.width+right.width)/2,averageHeight=(left.height+right.height)/2;
  const widthMatch=Math.min(left.width,right.width)/Math.max(left.width,right.width),heightMatch=Math.min(left.height,right.height)/Math.max(left.height,right.height),areaMatch=Math.min(left.area,right.area)/Math.max(left.area,right.area),vertical=Math.abs(left.cy-right.cy)/averageHeight,gap=(right.minX-left.maxX)/averageWidth;
  if(widthMatch<.8||heightMatch<.8||areaMatch<.7||vertical>.16||gap<.04||gap>.85)continue;
  const symmetry=(widthMatch+heightMatch+areaMatch)/3,score=symmetry-vertical*.5+Math.min((left.area+right.area)/(width*height),.3);
  if(!best||score>best.score)best={left,right,score,symmetry,vertical};
 }
 return best;
}

// A radial boundary follows the detected component, including shallow nasal
// concavities and CatEye shoulders. Taking a convex hull here used to erase
// those features before the user could correct them. Speck holes are ignored
// by retaining the last sample on each ray belonging to the same component.
function componentRadii(component,labels,width,height,mirror=false,count=256){
 const radii=[];
 for(let i=0;i<count;i++){
  const angle=i/count*Math.PI*2,dx=Math.cos(angle)*(mirror?-1:1),dy=-Math.sin(angle),limit=Math.hypot(component.width,component.height)+2;
  let last=0;
  for(let r=0;r<=limit;r+=.5){const x=Math.round(component.cx+r*dx),y=Math.round(component.cy+r*dy);if(x<0||x>=width||y<0||y>=height)break;if(labels[y*width+x]===component.id)last=r;}
  radii.push(last);
 }
 // Remove pixel stair steps, without replacing concavities by a hull.
 const median=radii.map((_,i)=>[radii[(i-2+count)%count],radii[(i-1+count)%count],radii[i],radii[(i+1)%count],radii[(i+2)%count]].sort((a,b)=>a-b)[2]);
 return Object.assign(median.map((v,i)=>(median[(i-1+count)%count]+v*2+median[(i+1)%count])/4),{rawRadii:radii});
}
function radialPolygon(radii){return radii.map((r,i)=>{const a=i/radii.length*Math.PI*2;return [r*Math.cos(a),r*Math.sin(a)];});}
function imageContour(component,radii,mirror=false){return samplePerimeter(radialPolygon(radii)).map(([x,y])=>[component.cx+x*(mirror?-1:1),component.cy-y]);}
function samplePerimeter(poly,count=128){
 const lengths=poly.map((p,i)=>Math.hypot(p[0]-poly[(i+1)%poly.length][0],p[1]-poly[(i+1)%poly.length][1])),perimeter=lengths.reduce((a,b)=>a+b,0),out=[];
 let edge=0,accumulated=0;
 for(let i=0;i<count;i++){const distance=perimeter*i/count;while(edge<lengths.length-1&&accumulated+lengths[edge]<distance){accumulated+=lengths[edge++];}const t=(distance-accumulated)/lengths[edge],a=poly[edge],b=poly[(edge+1)%poly.length];out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}
 return out;
}

export function analyzeRGBA({data,width,height,threshold:requestedThreshold,cleanThinLines=false}){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<80||height<40||width>1200||height>1200||!data||data.length!==width*height*4)fail('La imagen debe tener dimensiones entre 80 × 40 y 1200 × 1200 píxeles.');
 const gray=new Uint8Array(width*height);let borderSum=0,borderCount=0;
 for(let i=0;i<gray.length;i++){const a=data[i*4+3]/255;gray[i]=Math.round((.2126*data[i*4]+.7152*data[i*4+1]+.0722*data[i*4+2])*a+255*(1-a));const x=i%width,y=Math.floor(i/width);if(x<3||y<3||x>=width-3||y>=height-3){borderSum+=gray[i];borderCount++;}}
 let backgroundLevel=borderSum/borderCount;const darkBackground=backgroundLevel<140;if(backgroundLevel<140){for(let i=0;i<gray.length;i++)gray[i]=255-gray[i];backgroundLevel=255-backgroundLevel;}
 const threshold=histogramThreshold(gray),thresholds=(Number.isFinite(requestedThreshold)?[requestedThreshold]:[threshold,40,55,70,80,110,140,170,200,225,240]).filter((x,i,a)=>x>=20&&x<backgroundLevel-12&&x<=245&&a.indexOf(x)===i);
 let selected=null;
 for(const threshold of thresholds){
  let background=new Uint8Array(gray.length);for(let i=0;i<gray.length;i++)background[i]=gray[i]>threshold?1:0;
  if(cleanThinLines){const inverse=background.map(v=>1-v),cleaned=healSinglePixelGaps(inverse,width,height);background=cleaned.map(v=>1-v);}
  let {labels,items}=components(background,width,height),pair=choosePair(items,width,height),gapRepairApplied=false;if(!pair){const fixed=components(healSinglePixelGaps(background,width,height),width,height);const proposal=choosePair(fixed.items,width,height);if(proposal){labels=fixed.labels;items=fixed.items;pair=proposal;gapRepairApplied=true;}}
  if(pair&&(!selected||pair.score>selected.pair.score))selected={labels,pair,threshold,gapRepairApplied};
 }
 // Neutral/blue-green tinted lenses can have the same luminance as a red frame.
 // Evaluate chromatic separation as well, retaining the same pair-quality checks.
 const chromatic=new Uint8Array(width*height);for(let i=0;i<chromatic.length;i++){const r=data[i*4],g=data[i*4+1],b=data[i*4+2];chromatic[i]=g>r*.9&&b>r*.85&&g>30&&g<180?1:0;}const colored=components(chromatic,width,height),colorPair=choosePair(colored.items,width,height);if(!darkBackground&&colorPair&&(!selected||colorPair.score>selected.pair.score+.03))selected={labels:colored.labels,pair:colorPair,threshold:null,gapRepairApplied:false,segmentation:'chromatic-neutral'};
 if(!selected)fail('No se detectaron dos huecos de cristal cerrados y simétricos con suficiente confianza.');
 const {pair,labels}=selected,leftRadii=componentRadii(pair.left,labels,width,height,true),rightRadii=componentRadii(pair.right,labels,width,height),radii=leftRadii.map((r,i)=>(r+rightRadii[i])/2);
 const disagreement=Math.sqrt(leftRadii.reduce((sum,r,i)=>sum+(r-rightRadii[i])**2,0)/radii.length)/(radii.reduce((sum,r)=>sum+r,0)/radii.length);
 if(disagreement>.18)fail('Los perfiles izquierdo y derecho no coinciden: recorta una vista frontal sin perspectiva ni reflejos que oculten el aro.');
 const poly=radialPolygon(radii),sampled=samplePerimeter(poly),minX=Math.min(...sampled.map(p=>p[0])),maxX=Math.max(...sampled.map(p=>p[0])),minY=Math.min(...sampled.map(p=>p[1])),maxY=Math.max(...sampled.map(p=>p[1])),half=(maxX-minX)/2,cx=(maxX+minX)/2,cy=(maxY+minY)/2,aspectRatio=(maxY-minY)/(maxX-minX);
 if(aspectRatio<.45||aspectRatio>1.25||half<8)fail('La proporción de los cristales queda fuera del rango estructural admitido.');
 const customContour=sampled.map(([x,y])=>[(x-cx)/half,(y-cy)/half]),widthPixels=maxX-minX,heightPixels=(pair.left.height+pair.right.height)/2;
 const apertures=[[pair.left,leftRadii,'left',true],[pair.right,rightRadii,'right',false]].map(([component,radii,side,mirror])=>({side,bounds:{x:component.minX,y:component.minY,width:component.width,height:component.height},contour:imageContour(component,leftRadii.map((r,i)=>(r+rightRadii[i])/2),mirror)}));
 const errors=[...leftRadii.rawRadii.map((r,i)=>Math.abs(r-radii[i])),...rightRadii.rawRadii.map((r,i)=>Math.abs(r-radii[i]))];
 return {segmentation:selected.segmentation||'luminance',gapRepairApplied:selected.gapRepairApplied,threshold:selected.threshold,traceErrorPixels:{maximum:Math.max(...errors)+.5,rms:Math.sqrt(errors.reduce((sum,e)=>sum+e*e,0)/errors.length),pixelQuantization:.5},customContour,contour:customContour,confidence:Math.max(0,Math.min(.98,pair.symmetry-pair.vertical*.5-disagreement*.25)),widthPixels,aspectRatio,image:{width,height},apertures,referenceScale:{widthPixels,heightPixels,gapPixels:pair.right.minX-pair.left.maxX-1,requiresKnownDimension:true},regularization:'radial-mirrored',diagnostics:['Dos huecos detectados automáticamente; perfiles simetrizados con suavizado local, sin envolvente convexa.','La escala requiere un ancho A conocido. La profundidad, el puente y los brazos usan los parámetros del diseño, no se deducen de la foto.','La superposición muestra el perfil simétrico que se aplicará; comprueba las curvas antes de fabricar. Una fotografía con perspectiva no proporciona metrología exacta.']};
}

export async function extractReferenceImage(file,options={}){
 if(!file||!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size===0||file.size>10*1024*1024)fail('Selecciona una imagen PNG, JPG o WebP válida de hasta 10 MB.');
 let bitmap;
 try{bitmap=await createImageBitmap(file);}catch{fail('No se pudo decodificar la imagen.');}
 try{
  if(bitmap.width<80||bitmap.height<40||bitmap.width>16000||bitmap.height>16000)fail('La resolución de la imagen no es adecuada.');
  const crop=options.crop||{x:0,y:0,width:1,height:1},sx=Math.max(0,crop.x)*bitmap.width,sy=Math.max(0,crop.y)*bitmap.height,sw=Math.min(1-crop.x,crop.width)*bitmap.width,sh=Math.min(1-crop.y,crop.height)*bitmap.height;if(sw<80||sh<40)fail('El recorte es demasiado pequeño.');const scale=Math.min(1,1100/Math.max(sw,sh)),width=Math.round(sw*scale),height=Math.round(sh*scale),canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d',{willReadFrequently:true});if(!context)fail('No está disponible el análisis de imagen en este navegador.');context.fillStyle='#fff';context.fillRect(0,0,width,height);context.drawImage(bitmap,sx,sy,sw,sh,0,0,width,height);
  const image=context.getImageData(0,0,width,height);
  // Thresholding and connected-component analysis run off the UI thread.
  const previewDataURL=canvas.toDataURL('image/png');if(typeof Worker==='undefined')return {...analyzeRGBA({...image,data:image.data,width,height,threshold:options.threshold,cleanThinLines:options.cleanThinLines}),previewDataURL};
  const result=await new Promise((resolve,reject)=>{
   const worker=new Worker(new URL('./reference-extraction.js?v=1.6.0',import.meta.url),{type:'module'});
   const timer=setTimeout(()=>{worker.terminate();reject(new Error('El análisis tardó demasiado. Prueba con un recorte frontal más simple.'));},20000);
   const finish=()=>{clearTimeout(timer);worker.terminate();};
   worker.onmessage=({data})=>{finish();if(data.error)reject(new Error(data.error));else resolve(data.result);};
   worker.onerror=()=>{finish();reject(new Error('No se pudo iniciar el análisis local de imagen. Recarga la página e inténtalo nuevamente.'));};
   worker.postMessage({data:image.data,width,height,threshold:options.threshold,cleanThinLines:options.cleanThinLines},[image.data.buffer]);
  });return {...result,previewDataURL};
 }finally{bitmap.close();}
}

if(typeof WorkerGlobalScope!=='undefined'&&globalThis instanceof WorkerGlobalScope){
 globalThis.onmessage=({data})=>{try{globalThis.postMessage({result:analyzeRGBA(data)});}catch(error){globalThis.postMessage({error:error.message});}};
}
