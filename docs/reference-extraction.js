// Local, deterministic extraction of frontal lens apertures. A photograph cannot
// supply millimetres, depth, hinge placement or machining allowances by itself.
const HELP='Usa una vista frontal, sin perspectiva, con ambos huecos de cristal cerrados y fondo claro uniforme. Indica después un ancho de cristal conocido para calibrar la escala.';
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

const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
function hull(points){
 const sorted=points.sort((a,b)=>a[0]-b[0]||a[1]-b[1]),lower=[],upper=[];
 for(const p of sorted){while(lower.length>=2&&cross(lower.at(-2),lower.at(-1),p)<=0)lower.pop();lower.push(p);}
 for(const p of sorted.slice().reverse()){while(upper.length>=2&&cross(upper.at(-2),upper.at(-1),p)<=0)upper.pop();upper.push(p);}
 return lower.slice(0,-1).concat(upper.slice(0,-1));
}
function outline(component,labels,width,height,mirror=false){
 const points=[];
 for(let y=component.minY;y<=component.maxY;y++)for(let x=component.minX;x<=component.maxX;x++){
  const index=y*width+x;if(labels[index]!==component.id)continue;
  if(x===0||y===0||x+1===width||y+1===height||labels[index-1]!==component.id||labels[index+1]!==component.id||labels[index-width]!==component.id||labels[index+width]!==component.id)points.push([(x-component.cx)*(mirror?-1:1),component.cy-y]);
 }
 return hull(points);
}
function radial(poly,angle){
 const dx=Math.cos(angle),dy=Math.sin(angle);let radius=0;
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length],ex=b[0]-a[0],ey=b[1]-a[1],den=dx*ey-dy*ex;
  if(Math.abs(den)<1e-10)continue;
  const distance=(a[0]*ey-a[1]*ex)/den,t=(a[0]*dy-a[1]*dx)/den;
  if(distance>0&&t>=-1e-8&&t<=1+1e-8)radius=Math.max(radius,distance);
 }
 return radius;
}
function samplePerimeter(poly,count=128){
 const lengths=poly.map((p,i)=>Math.hypot(p[0]-poly[(i+1)%poly.length][0],p[1]-poly[(i+1)%poly.length][1])),perimeter=lengths.reduce((a,b)=>a+b,0),out=[];
 let edge=0,accumulated=0;
 for(let i=0;i<count;i++){const distance=perimeter*i/count;while(edge<lengths.length-1&&accumulated+lengths[edge]<distance){accumulated+=lengths[edge++];}const t=(distance-accumulated)/lengths[edge],a=poly[edge],b=poly[(edge+1)%poly.length];out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}
 return out;
}

export function analyzeRGBA({data,width,height}){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<80||height<40||width>1200||height>1200||!data||data.length!==width*height*4)fail('La imagen debe tener dimensiones entre 80 × 40 y 1200 × 1200 píxeles.');
 const gray=new Uint8Array(width*height);let borderSum=0,borderCount=0;
 for(let i=0;i<gray.length;i++){const a=data[i*4+3]/255;gray[i]=Math.round((.2126*data[i*4]+.7152*data[i*4+1]+.0722*data[i*4+2])*a+255*(1-a));const x=i%width,y=Math.floor(i/width);if(x<3||y<3||x>=width-3||y>=height-3){borderSum+=gray[i];borderCount++;}}
 if(borderSum/borderCount<205)fail('No se reconoce un fondo claro alrededor de la montura.');
 const threshold=histogramThreshold(gray),thresholds=[threshold,40,55,70,80,110,140,170,200,225,240].filter((x,i,a)=>x>=30&&x<=245&&a.indexOf(x)===i);
 let selected=null;
 for(const threshold of thresholds){
  const background=new Uint8Array(gray.length);for(let i=0;i<gray.length;i++)background[i]=gray[i]>threshold?1:0;
  const {labels,items}=components(background,width,height),pair=choosePair(items,width,height);
  if(pair&&(!selected||pair.score>selected.pair.score))selected={labels,pair,threshold};
 }
 if(!selected)fail('No se detectaron dos huecos de cristal cerrados y simétricos con suficiente confianza.');
 const {pair,labels}=selected,left=outline(pair.left,labels,width,height,true),right=outline(pair.right,labels,width,height),average=[];
 for(let i=0;i<128;i++){const angle=i/128*Math.PI*2,r=(radial(left,angle)+radial(right,angle))/2;average.push([r*Math.cos(angle),r*Math.sin(angle)]);}
 const poly=hull(average),sampled=samplePerimeter(poly),minX=Math.min(...sampled.map(p=>p[0])),maxX=Math.max(...sampled.map(p=>p[0])),minY=Math.min(...sampled.map(p=>p[1])),maxY=Math.max(...sampled.map(p=>p[1])),half=(maxX-minX)/2,cx=(maxX+minX)/2,cy=(maxY+minY)/2,aspectRatio=(maxY-minY)/(maxX-minX);
 if(aspectRatio<.45||aspectRatio>1.25||half<8||poly.length<8)fail('La proporción de los cristales queda fuera del rango estructural admitido.');
 const customContour=sampled.map(([x,y])=>[(x-cx)/half,(y-cy)/half]);
 return {customContour,contour:customContour,confidence:Math.max(0,Math.min(.98,pair.symmetry-pair.vertical*.5)),widthPixels:(pair.left.width+pair.right.width)/2,aspectRatio,diagnostics:['Dos huecos detectados automáticamente; contorno suavizado y simetrizado con envolvente convexa.','La escala requiere un ancho A conocido. La profundidad, el puente y los brazos usan los parámetros del diseño, no se deducen de la foto.','Comprueba las curvas en 2D antes de fabricar; una fotografía con perspectiva no proporciona metrología exacta.']};
}

export async function extractReferenceImage(file){
 if(!file||!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size===0||file.size>10*1024*1024)fail('Selecciona una imagen PNG, JPG o WebP válida de hasta 10 MB.');
 let bitmap;
 try{bitmap=await createImageBitmap(file);}catch{fail('No se pudo decodificar la imagen.');}
 try{
  if(bitmap.width<80||bitmap.height<40||bitmap.width>16000||bitmap.height>16000)fail('La resolución de la imagen no es adecuada.');
  const scale=Math.min(1,960/Math.max(bitmap.width,bitmap.height)),width=Math.round(bitmap.width*scale),height=Math.round(bitmap.height*scale),canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d',{willReadFrequently:true});if(!context)fail('No está disponible el análisis de imagen en este navegador.');context.fillStyle='#fff';context.fillRect(0,0,width,height);context.drawImage(bitmap,0,0,width,height);
  const image=context.getImageData(0,0,width,height);
  // Thresholding and connected-component analysis run off the UI thread.
  if(typeof Worker==='undefined')return analyzeRGBA(image);
  return await new Promise((resolve,reject)=>{
   const worker=new Worker(new URL('./reference-extraction.js',import.meta.url),{type:'module'});
   const timer=setTimeout(()=>{worker.terminate();reject(new Error('El análisis tardó demasiado. Prueba con un recorte frontal más simple.'));},20000);
   const finish=()=>{clearTimeout(timer);worker.terminate();};
   worker.onmessage=({data})=>{finish();if(data.error)reject(new Error(data.error));else resolve(data.result);};
   worker.onerror=()=>{finish();reject(new Error('No se pudo iniciar el análisis local de imagen. Recarga la página e inténtalo nuevamente.'));};
   worker.postMessage({data:image.data,width,height},[image.data.buffer]);
  });
 }finally{bitmap.close();}
}

if(typeof WorkerGlobalScope!=='undefined'&&globalThis instanceof WorkerGlobalScope){
 globalThis.onmessage=({data})=>{try{globalThis.postMessage({result:analyzeRGBA(data)});}catch(error){globalThis.postMessage({error:error.message});}};
}
