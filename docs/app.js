var Am=Object.defineProperty;var Sn=(i,e,t)=>()=>{if(t)throw t[0];try{return i&&(e=i(i=0)),e}catch(n){throw t=[n],n}};var Em=(i,e)=>{for(var t in e)Am(i,t,{get:e[t],enumerable:!0})};function to(i){if(!Array.isArray(i)||i.length<32||i.length>256||i.some(h=>!Array.isArray(h)||h.length!==2||h.some(d=>typeof d!="number"||!Number.isFinite(d))))return null;let e=i.map(h=>h[0]),t=i.map(h=>h[1]),n=Math.min(...e),s=Math.max(...e),r=Math.min(...t),a=Math.max(...t),o=s-n,l=(a-r)/o;if(o<1e-6||l<.45||l>1.25)return null;let c=i.map(([h,d])=>[(h-(n+s)/2)*2/o,(d-(r+a)/2)*2/o]),u=0;for(let h=0;h<c.length;h++){let d=c[h],f=c[(h+1)%c.length],m=c[(h+2)%c.length];if(Math.hypot(f[0]-d[0],f[1]-d[1])<1e-5||(f[0]-d[0])*(m[1]-f[1])-(f[1]-d[1])*(m[0]-f[0])<-1e-7||c.some(g=>(f[0]-d[0])*(g[1]-d[1])-(f[1]-d[1])*(g[0]-d[0])<-1e-7))return null;u+=d[0]*f[1]-f[0]*d[1]}return u>1e-4?c:null}function Ic(i){let e=to(i.customContour);if(e)return{rx:1,ry:Math.max(...e.map(r=>r[1]))};let t=Ad(i);return{rx:1,ry:t==="recto"?.64:t==="redondo"?1:t==="ovalado"?.79:.69}}function wm(i,e){let t=to(i.customContour);if(t)return e===-1?t.map(([d,f])=>[-d,f]).reverse():t;let n=Ad(i),s=[],r=Pn(i.rounding,0,100,35),a=n==="recto"?3.6+(100-r)*.033:n==="curvo"?3.1+(100-r)*.021:2,{ry:o}=Ic(i);for(let d=0;d<128;d++){let f=d/128*Math.PI*2,m=Math.cos(f),x=Math.sin(f),g=Math.sign(m)*Math.abs(m)**(2/a),p=Math.sign(x)*Math.abs(x)**(2/a)*o;if(n==="ovalado"){let v=Math.max(0,-x);g*=1-v*.22,p-=v*.075}n==="curvo"&&(g*=.9+.1*(p/o+1)/2,p+=Math.max(0,g*e)*.035),s.push([g,p])}let l=s.map(d=>d[0]),c=Math.min(...l),u=Math.max(...l),h=(c+u)/2;return s.map(([d,f])=>[(d-h)*2/(u-c),f])}function Tn(i,e){let t=js(i).lens/2*.04,n=Pn(i.contourAspectScale,.85,1.15,1);return wm(i,e).map(([s,r])=>[s*t,r*t*n])}function Cm(i,e){if(!Array.isArray(i)||i.length<3||!Number.isFinite(e)||e<0)throw new RangeError("Contorno o distancia no v\xE1lidos.");let n=i.reduce((r,a,o)=>{let l=i[(o+1)%i.length];return r+a[0]*l[1]-l[0]*a[1]},0)>=0?1:-1,s=i.map((r,a)=>{let o=i[(a+1)%i.length],l=o[0]-r[0],c=o[1]-r[1],u=Math.hypot(l,c);if(!u||!r.every(Number.isFinite))throw new RangeError("Contorno degenerado.");return[n*c/u,-n*l/u]});return i.map((r,a)=>{let o=s[(a+i.length-1)%i.length],l=s[a],c=1+o[0]*l[0]+o[1]*l[1];if(c<1e-6)throw new RangeError("El contorno contiene una esquina incompatible.");return[r[0]+e*(o[0]+l[0])/c,r[1]+e*(o[1]+l[1])/c]})}function Dt(i,e,t=1){let n=Pn(i.thickness,3,8,4)*.04,{ry:s}=Ic(i),r=js(i).lens/2*.04,a=Cm(Tn(i,e),n),o=an(i)[1];return a.map(([l,c])=>{let u=Math.max(0,-l*e/(r+n)),h=Math.exp(-(((c/(r*s)+.2)/.48)**4)),d=Pn(i.nasalProjection,0,100,35)/100*3*.04*u**5*h,f=Math.min(d,Math.max(0,o+l*e-4*.04));return[(l-e*f)*t,c*t]})}function an(i){let e=js(i),t=e.bridge,n=(e.lens+t)/2*.04;return[-n,n]}function Wt(i){let e=js(i),t=Pn(i.templeLength,135,150,e.temple),n=Dt(i,1),s=an(i)[1],r=2.75*.04,a=(s+Math.max(...n.map(o=>o[0]))+r)*2/.04;return{lens:e.lens,bridge:e.bridge,temple:t,front:Math.round(a*100)/100,code:`${e.lens} \u25A1 ${e.bridge}\u2013${t}`,size:e.id}}function Td(i,e){let t=Dt(i,1),n=[];for(let r=0;r<t.length;r++){let a=t[r],o=t[(r+1)%t.length];if(a[1]<=e&&o[1]>=e||o[1]<=e&&a[1]>=e){if(Math.abs(o[1]-a[1])<1e-9)continue;n.push(a[0]+(o[0]-a[0])*(e-a[1])/(o[1]-a[1]))}}let s=n.length?Math.min(...n):-Math.max(...t.map(r=>Math.abs(r[0])));return an(i)[1]+s+.025}function Fi(i){let e=js(i).lens/2*.04*Ic(i).ry*Pn(i.contourAspectScale,.85,1.15,1),t=({alto:.59,medio:.33,bajo:.1}[i.bridgeHeight]??.33)*e,n=i.bridgeType||"clasico",s=Pn(i.bridgeThickness,5,12,5)*.04,r=Math.max(0,Math.min(100,Number(i.bridgeNasalCurve??45)))/100;function a(c,u,h,d){let f=Td(i,c),m=Td(i,c-h),x=[],g=[];for(let p=0;p<=32;p++){let v=p/32,S=-f+2*f*v,y=Math.sin(Math.PI*v),E=c+u*y;x.push([S,E]),g.push([-m+2*m*v,E-h+d*h*.5*y*y])}return{upper:x,lower:g,outline:[...x,...g.slice().reverse()]}}let l=[a(t,n==="herradura"?.12:.022,s,r)];if(n==="doble"){let c=Math.min(t+.22,e*.9);l.push(a(c,.018,Math.min(s*.45,Math.max(.04,c-t-.065)),0))}return{bands:l,anchorHeight:t,type:n}}function no(i,e,t="clasico"){let n=Dt(i,e),r=an(i)[e===-1?0:1]+e*(Math.max(...n.map(g=>g[0]*e))+2*.04),a=.16,o=Pn(i.templeLength,135,150,js(i).temple),l=[[0,0,0],[-.02*e,-.03,-.28],[-.1*e,-.22,-.63],[-.18*e,-.5,-.85]],c=l.slice(1).reduce((g,p,v)=>g+Math.hypot(...p.map((S,y)=>S-l[v][y])),0),u=o*.04-c,h=t==="curvo"?.13:t==="escultural"?.1:t==="sable"?.07:t==="gancho"?.16:.025,d=(Math.max(...n.map(g=>g[1]))+Math.min(...n.map(g=>g[1])))/2,f=[[r,d,0],[r+e*.04,a,-.55],[r+e*h,a+(t==="sable"?.05:0),-u*.56],[r,a,-u]],m=f.at(-1),x=l.map(g=>g.map((p,v)=>p+m[v]));return{stem:f,hook:x,hookLocal:l,join:m,stemLength:u,hookLength:c,nominalLength:o,shaftWidth:Pn(i.armWidth,4,Zs(i),6)*.04,hookWidth:.12,depth:t==="fino"?.045:.075}}function Zs(i){let e=Dt(i,1);return Math.floor((Math.max(...e.map(t=>t[1]))-Math.min(...e.map(t=>t[1])))/.04)}function Pc(i,e,t){let n=Dt(i,1),s=Math.max(...n.map(l=>l[1])),r=Math.min(...n.map(l=>l[1])),a=Math.min(t,s-r),o=Math.max(r+a/2,Math.min(s-a/2,e));return{bottom:o-a/2,top:o+a/2,center:o,height:a}}function io(i,e){i={...i,nasalProjection:0};let t=an(i)[e===-1?0:1],n=Dt(i,e),s=[];for(let o=0;o<n.length;o++){let l=n[o];l[0]*e<0&&l[1]<.2&&l[1]>-.56&&s.push([l[0]+t,l[1]])}s.sort((o,l)=>l[1]-o[1]);let r=i.model==="curvo"?Number(i.thickness??4)-.5:-1.4,a=s.map(([o,l])=>[e*Math.max(3*.04,e*o+r*.04),l]);return{outline:[...s,...a.reverse()],depth:3*.04}}function Ed(i,e){let t=Number(i);if(!Number.isFinite(t)||t<80||t>190)return null;let n=qr.map(o=>({size:o,measurements:Wt({...e,frameSize:o.id})})),s=Math.min(...n.map(o=>o.measurements.front)),r=Math.max(...n.map(o=>o.measurements.front));return{...n.sort((o,l)=>Math.abs(o.measurements.front-t)-Math.abs(l.measurements.front-t))[0],minimum:s,maximum:r,withinRange:t>=s&&t<=r}}var qr,js,Pn,Ad,Oi=Sn(()=>{qr=[{id:"estrecha",name:"Estrecha",lens:48,bridge:16,temple:135},{id:"media",name:"Media",lens:52,bridge:17,temple:140},{id:"amplia",name:"Amplia",lens:56,bridge:18,temple:145}],js=i=>{let e=qr.find(t=>t.id===i.frameSize)||qr[1];return{...e,lens:i.lensWidth==null?e.lens:Pn(i.lensWidth,40,65,e.lens),bridge:i.bridgeWidth==null?e.bridge:Pn(i.bridgeWidth,14,24,e.bridge)}},Pn=(i,e,t,n)=>Number.isFinite(Number(i))?Math.max(e,Math.min(t,Number(i))):n,Ad=i=>({rectangular:"recto",panto:"redondo",aviador:"ovalado",clubmaster:"curvo",wayfarer:"curvo"})[i.model]||i.model});function vt(i={}){let e={...Bi,...i},n=Ln($n,{rectangular:"recto",panto:"redondo",aviador:"ovalado",clubmaster:"curvo",wayfarer:"curvo","cat-eye":"recto"}[e.model]||e.model,"recto"),s=$n.find(l=>l.id===n),r=e.use==="optico",a=r&&e.sunOptical===!0,o=to(e.customContour);return{...e.model==="wayfarer"||e.migratedFrom==="wayfarer"?{migratedFrom:"wayfarer",referenceStatus:"unverified"}:{},...o?{customContour:o}:{},...e.lensWidth!=null?{lensWidth:so(e.lensWidth,40,65,52)}:{},...e.bridgeWidth!=null?{bridgeWidth:so(e.bridgeWidth,14,24,17)}:{},materialDepth:so(e.materialDepth,2,12,6),contourAspectScale:so(e.contourAspectScale,.85,1.15,1),model:n,frameSize:["estrecha","media","amplia"].includes(e.frameSize)?e.frameSize:"media",templeLength:[135,140,145,150].includes(Number(e.templeLength))?Number(e.templeLength):140,rounding:s.lockRounding?s.rounding:ps(e.rounding,0,100,s.rounding),bridgeThickness:ps(e.bridgeThickness,5,12,5),bridgeNasalCurve:ps(e.bridgeNasalCurve??e.bridgeCurve,0,100,45),bridgeType:Ln(Lc,e.bridgeType,"clasico"),bridgeHeight:Ln(Dc,e.bridgeHeight,"medio"),thickness:ps(e.thickness,3,8,4),armWidth:ps(e.armWidth,4,Zs({...e,model:n,rounding:s.rounding,thickness:ps(e.thickness,3,8,4)}),6),nasalProjection:ps(e.nasalProjection,0,100,35),armStyle:Ln(ro,e.armStyle,"clasico"),armStyleRight:Ln(ro,e.armStyle,"clasico"),rimColor:Ln(Xt,e.rimColor,Bi.rimColor),bridgeColor:Ln(Xt,e.bridgeColor,Bi.bridgeColor),armColor:Ln(Xt,e.armColor,Bi.armColor),use:r?"optico":"sol",lensType:Ln(ms,e.lensType,"mono"),blue:r&&!a&&e.blue===!0,photo:r&&!a&&e.photo===!0,ar:r&&!a&&e.ar===!0,sunOptical:a,lensColor:Ln(ki,e.lensColor,Bi.lensColor),photoColor:Ln(mi,e.photoColor,"gris")}}function gs(i){let e=vt(i),t=[{label:"Dise\xF1o personal \xB7 montura y personalizaci\xF3n",amount:209e3}];if(e.use==="optico"){let n=ms.find(s=>s.id===e.lensType);t.push({label:`Cristales ${n.name.toLowerCase()}`,amount:n.price}),e.blue&&t.push({label:"Filtro de luz azul",amount:2e4}),e.ar&&t.push({label:"Tratamiento antirreflejos",amount:18e3}),e.photo&&t.push({label:`Fotocrom\xE1tico \xB7 ${mi.find(s=>s.id===e.photoColor).name}`,amount:45e3}),e.sunOptical&&t.push({label:"Sol \xF3ptico (tinte graduado)",amount:25e3})}return{lines:t,total:t.reduce((n,s)=>n+s.amount,0)}}function ao(i){let e=vt(i),t=Wt(e);return`${$n.find(n=>n.id===e.model).name} \xB7 ${t.code} \xB7 ${e.use==="sol"?"Sol":ms.find(n=>n.id===e.lensType).name}`}function oo(i,e="perspectiva"){let t=vt(i),n=an(t),s=`design-glass-${++Rm}`,r=([p,v])=>[340+p*57,185-v*57],a=Xt.find(p=>p.id===t.rimColor).hex,o=Xt.find(p=>p.id===t.bridgeColor).hex,l=Xt.find(p=>p.id===t.armColor).hex,c=t.use==="sol"||t.photo||t.sunOptical,u=t.photo?mi.find(p=>p.id===t.photoColor).hex:ki.find(p=>p.id===t.lensColor).hex,h=p=>p.map((v,S)=>`${S?"L":"M"}${r(v).join(" ")}`).join(" ")+"Z",d=e==="frente"?"":e==="lateral"?"translate(65 0) skewX(-16) scale(.8 1)":"rotate(-6 340 185)",f=[-1,1].map((p,v)=>{let S=Dt(t,p).map(([y,E])=>[y+n[v],E]);return`<path d="${h(S)}" fill="url(#${s})" stroke="${t.model==="curvo"?"#bbaa7a":a}" stroke-width="${t.model==="curvo"?2:5}"/>${t.model==="curvo"?`<path d="${h(S.slice(0,65))}" fill="none" stroke="${a}" stroke-width="7"/>`:""}`}).join(""),m=Fi(t).bands.map(p=>`<path d="${h(p.outline)}" fill="${o}"/>`).join(""),x=[-1,1].map(p=>`<path d="${h(io(t,p).outline)}" fill="${a}" opacity=".75"/>`).join(""),g=e==="frente"?"":[-1,1].map(p=>{let v=no(t,p,p===-1?t.armStyle:t.armStyleRight),S=([b,M,F])=>[b-F*.22,M-F*.25],y=[v.shaftWidth,v.shaftWidth,v.shaftWidth*.4+v.hookWidth*.6,v.hookWidth],E=v.stem.map((b,M)=>{let F=Pc(t,b[1],y[M]),[w,V]=S([b[0],F.top,b[2]]);return[w,V]}),C=v.stem.map((b,M)=>{let F=Pc(t,b[1],y[M]),[w,V]=S([b[0],F.bottom,b[2]]);return[w,V]}),I=v.hook.map(S);return`<path d="${h([...E,...C.reverse()])}" fill="${l}"/><path d="${h(I).slice(0,-1)}" fill="none" stroke="${l}" stroke-width="${v.hookWidth*57}" stroke-linecap="round" stroke-linejoin="round"/>`}).join("");return`<svg viewBox="0 0 680 390" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vista ${e} del dise\xF1o ${$n.find(p=>p.id===t.model).name}"><defs><linearGradient id="${s}" x2="0" y2="1"><stop stop-color="${u}" stop-opacity="${c?.95:.15}"/><stop offset="1" stop-color="${u}" stop-opacity="${c?.7:.05}"/></linearGradient></defs><g transform="${d}">${g}${x}${f}${m}</g></svg>`}function Ks(i){if(!i)return"Selecciona una receta.";if(i.size>10*1024*1024)return"El archivo supera los 10 MB. Elige uno m\xE1s peque\xF1o.";if(i.size===0)return"El archivo est\xE1 vac\xEDo.";let e=i.name?.split(".").pop()?.toLowerCase(),t={pdf:"application/pdf",jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",webp:"image/webp"};return!t[e]||i.type&&i.type!==t[e]?"Formato no admitido. Usa PDF, JPG, PNG o WebP.":""}function Js(i,e){let t={pdf:i[0]===37&&i[1]===80&&i[2]===68&&i[3]===70,jpg:i[0]===255&&i[1]===216&&i[2]===255,png:i[0]===137&&i[1]===80&&i[2]===78&&i[3]===71,webp:i[0]===82&&i[1]===73&&i[2]===70&&i[3]===70&&i[8]===87&&i[9]===69&&i[10]===66&&i[11]===80};if(!e)return Object.values(t).some(Boolean);let n=e.name.split(".").pop().toLowerCase();return n==="jpeg"&&(n="jpg"),t[n]===!0}var $n,Lc,Dc,Xt,ki,mi,ro,ms,Bi,Ln,so,ps,Rm,zi=Sn(()=>{Oi();$n=[{id:"recto",name:"Recto",description:"Rectangular proporcionado y de esquinas suaves.",price:209e3,rounding:35},{id:"redondo",name:"Redondo",description:"Curva circular estable. Equilibrio cl\xE1sico.",price:209e3,rounding:100,lockRounding:!0},{id:"ovalado",name:"Ovalado",description:"\xD3valo en gota de inspiraci\xF3n aviador, sin doble puente.",price:209e3,rounding:100,lockRounding:!0},{id:"curvo",name:"Curvo",description:"Browline en acetato, aro inferior ligero y brazos planos.",price:209e3,rounding:50}],Lc=[{id:"clasico",name:"Cl\xE1sico"},{id:"doble",name:"Doble puente"},{id:"herradura",name:"Herradura"}],Dc=[{id:"alto",name:"Alto"},{id:"medio",name:"Medio"},{id:"bajo",name:"Bajo"}],Xt=[{id:"miel",name:"Miel",hex:"#a76c32"},{id:"carey",name:"Tabaco",hex:"#68422e"},{id:"negro",name:"Obsidiana",hex:"#252622"},{id:"oliva",name:"Oliva",hex:"#697350"},{id:"marfil",name:"Marfil",hex:"#dfd5ba"},{id:"burdeos",name:"Borgo\xF1a",hex:"#6d3541"}],ki=[{id:"humo",name:"Gris humo",hex:"#434a4b"},{id:"cafe",name:"Caf\xE9",hex:"#7c5637"},{id:"verde",name:"Verde mineral",hex:"#526552"},{id:"azul",name:"Azul profundo",hex:"#435c78"},{id:"rosa",name:"Rosa mineral",hex:"#a97b77"}],mi=[{id:"gris",name:"Gris negro",hex:"#414348"},{id:"cafe",name:"Caf\xE9",hex:"#79573d"},{id:"lila",name:"Lila",hex:"#897496"}],ro=[{id:"clasico",name:"Cl\xE1sico"},{id:"fino",name:"Filiforme"},{id:"escultural",name:"Escultural"},{id:"sable",name:"Sable"},{id:"curvo",name:"Ondulado"},{id:"gancho",name:"Perfil envolvente"}],ms=[{id:"mono",name:"Monofocales",price:45e3},{id:"bi",name:"Bifocales",price:85e3},{id:"multi",name:"Multifocales",price:145e3}],Bi={model:"recto",frameSize:"media",templeLength:140,rounding:35,bridgeThickness:5,bridgeNasalCurve:45,bridgeType:"clasico",bridgeHeight:"medio",thickness:4,armWidth:6,nasalProjection:35,armStyle:"clasico",armStyleRight:"clasico",rimColor:"negro",bridgeColor:"negro",armColor:"negro",use:"sol",lensType:"mono",blue:!1,photo:!1,ar:!1,sunOptical:!1,lensColor:"humo",photoColor:"gris"},Ln=(i,e,t)=>i.some(n=>n.id===e)?e:t,so=(i,e,t,n)=>Number.isFinite(Number(i))?Math.max(e,Math.min(t,Math.round(Number(i)*100)/100)):n,ps=(i,e,t,n)=>Number.isFinite(Number(i))?Math.min(t,Math.max(e,Math.round(Number(i)))):n;Rm=0});function Im(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Pm(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function mr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Yf(){let i=mr("canvas");return i.style.display="block",i}function aa(...i){let e="THREE."+i.shift();gr?gr("log",e,...i):console.log(e,...i)}function jf(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Fe(...i){i=jf(i);let e="THREE."+i.shift();if(gr)gr("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ge(...i){i=jf(i);let e="THREE."+i.shift();if(gr)gr("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function oa(...i){let e=i.join(" ");e in Rd||(Rd[e]=!0,Fe(...i))}function Zf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function wn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Zt[i&255]+Zt[i>>8&255]+Zt[i>>16&255]+Zt[i>>24&255]+"-"+Zt[e&255]+Zt[e>>8&255]+"-"+Zt[e>>16&15|64]+Zt[e>>24&255]+"-"+Zt[t&63|128]+Zt[t>>8&255]+"-"+Zt[t>>16&255]+Zt[t>>24&255]+Zt[n&255]+Zt[n>>8&255]+Zt[n>>16&255]+Zt[n>>24&255]).toLowerCase()}function Ze(i,e,t){return Math.max(e,Math.min(t,i))}function qu(i,e){return(i%e+e)%e}function Lm(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Dm(i,e,t){return i!==e?(t-i)/(e-i):0}function na(i,e,t){return(1-t)*i+t*e}function Nm(i,e,t,n){return na(i,e,1-Math.exp(-t*n))}function Um(i,e=1){return e-Math.abs(qu(i,e*2)-e)}function Fm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Om(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Bm(i,e){return i+Math.floor(Math.random()*(e-i+1))}function km(i,e){return i+Math.random()*(e-i)}function zm(i){return i*(.5-Math.random())}function Vm(i){i!==void 0&&(Id=i);let e=Id+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Hm(i){return i*ta}function Gm(i){return i*Ts}function Wm(i){return(i&i-1)===0&&i!==0}function Xm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function qm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function $m(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),h=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),m=a((n-e)/2);switch(s){case"XYX":i.set(o*u,l*h,l*d,o*c);break;case"YZY":i.set(l*d,o*u,l*h,o*c);break;case"ZXZ":i.set(l*h,l*d,o*u,o*c);break;case"XZX":i.set(o*u,l*m,l*f,o*c);break;case"YXY":i.set(l*f,o*u,l*m,o*c);break;case"ZYZ":i.set(l*m,l*f,o*u,o*c);break;default:Fe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Fn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function lt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}function Ym(){let i={enabled:!0,workingColorSpace:qt,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===at&&(s.r=Si(s.r),s.g=Si(s.g),s.b=Si(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===at&&(s.r=fr(s.r),s.g=fr(s.g),s.b=fr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Wn?ra:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return oa("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return oa("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[qt]:{primaries:e,whitePoint:n,transfer:ra,toXYZ:Ld,fromXYZ:Dd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ct},outputColorSpaceConfig:{drawingBufferColorSpace:Ct}},[Ct]:{primaries:e,whitePoint:n,transfer:at,toXYZ:Ld,fromXYZ:Dd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ct}}}),i}function Si(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function fr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}function Bc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?xr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Fe("Texture: Unable to serialize Texture."),{})}function Vc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function jc(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){_s.fromArray(i,r);let o=s.x*Math.abs(_s.x)+s.y*Math.abs(_s.y)+s.z*Math.abs(_s.z),l=e.dot(_s),c=t.dot(_s),u=n.dot(_s);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}function lg(i,e,t,n,s,r,a,o){let l;if(e.side===Yt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Bn,o),l===null)return null;Ao.copy(o),Ao.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Ao);return c<t.near||c>t.far?null:{distance:c,point:Ao.clone(),object:i}}function Eo(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,bo),i.getVertexPosition(l,Mo),i.getVertexPosition(c,So);let u=lg(i,e,t,n,bo,Mo,So,Wd);if(u){let h=new D;$i.getBarycoord(Wd,bo,Mo,So,h),s&&(u.uv=$i.getInterpolatedAttribute(s,o,l,c,h,new oe)),r&&(u.uv1=$i.getInterpolatedAttribute(r,o,l,c,h,new oe)),a&&(u.normal=$i.getInterpolatedAttribute(a,o,l,c,h,new D),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new D,materialIndex:0};$i.getNormal(bo,Mo,So,d.normal),u.face=d,u.barycoord=h}return u}function Po(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(Qo.fromBufferAttribute(o,s),el.fromBufferAttribute(o,r),t.distanceSqToSegment(Qo,el,ru,ef)>n)return;ru.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(ru);if(!(c<e.near||c>e.far))return{distance:c,point:ef.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}function rf(i,e,t,n,s,r,a){let o=xu.distanceSqToPoint(i);if(o<t){let l=new D;xu.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}function $u(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,h){let d=(a-r)/c-(o-r)/(c+u)+(o-a)/u,f=(o-a)/u-(l-a)/(u+h)+(l-o)/h;d*=u,f*=u,s(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}function af(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function mg(i,e){let t=1-i;return t*t*e}function gg(i,e){return 2*(1-i)*i*e}function xg(i,e){return i*i*e}function ia(i,e,t,n){return mg(i,e)+gg(i,t)+xg(i,n)}function _g(i,e){let t=1-i;return t*t*t*e}function yg(i,e){let t=1-i;return 3*t*t*i*e}function vg(i,e){return 3*(1-i)*i*i*e}function bg(i,e){return i*i*i*e}function sa(i,e,t,n,s){return _g(i,e)+yg(i,t)+vg(i,n)+bg(i,s)}function Mg(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Qf(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=wg(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let u=o,h=l;for(let d=t;d<s;d+=t){let f=i[d],m=i[d+1];f<o&&(o=f),m<l&&(l=m),f>u&&(u=f),m>h&&(h=m)}c=Math.max(u-o,h-l),c=c!==0?32767/c:0}return Ma(r,a,t,o,l,c,0),a}function Qf(i,e,t,n,s){let r;if(s===Bg(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=of(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=of(a/n|0,i[a],i[a+1],r);return r&&Er(r,r.next)&&(Ta(r),r=r.next),r}function Ps(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Er(t,t.next)||Mt(t.prev,t,t.next)===0)){if(Ta(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Ma(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Lg(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?Tg(i,n,s,r):Sg(i)){e.push(l.i,i.i,c.i),Ta(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Ag(Ps(i),e),Ma(i,e,t,n,s,r,2)):a===2&&Eg(i,e,t,n,s,r):Ma(Ps(i),e,t,n,s,r,1);break}}}function Sg(i){let e=i.prev,t=i,n=i.next;if(Mt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,u=Math.min(s,r,a),h=Math.min(o,l,c),d=Math.max(s,r,a),f=Math.max(o,l,c),m=n.next;for(;m!==e;){if(m.x>=u&&m.x<=d&&m.y>=h&&m.y<=f&&ea(s,o,r,l,a,c,m.x,m.y)&&Mt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Tg(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Mt(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,u=s.y,h=r.y,d=a.y,f=Math.min(o,l,c),m=Math.min(u,h,d),x=Math.max(o,l,c),g=Math.max(u,h,d),p=yu(f,m,e,t,n),v=yu(x,g,e,t,n),S=i.prevZ,y=i.nextZ;for(;S&&S.z>=p&&y&&y.z<=v;){if(S.x>=f&&S.x<=x&&S.y>=m&&S.y<=g&&S!==s&&S!==a&&ea(o,u,l,h,c,d,S.x,S.y)&&Mt(S.prev,S,S.next)>=0||(S=S.prevZ,y.x>=f&&y.x<=x&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&ea(o,u,l,h,c,d,y.x,y.y)&&Mt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;S&&S.z>=p;){if(S.x>=f&&S.x<=x&&S.y>=m&&S.y<=g&&S!==s&&S!==a&&ea(o,u,l,h,c,d,S.x,S.y)&&Mt(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;y&&y.z<=v;){if(y.x>=f&&y.x<=x&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&ea(o,u,l,h,c,d,y.x,y.y)&&Mt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Ag(i,e){let t=i;do{let n=t.prev,s=t.next.next;!Er(n,s)&&tp(n,t,t.next,s)&&Sa(n,s)&&Sa(s,n)&&(e.push(n.i,t.i,s.i),Ta(t),Ta(t.next),t=i=s),t=t.next}while(t!==i);return Ps(t)}function Eg(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Ug(a,o)){let l=np(a,o);a=Ps(a,a.next),l=Ps(l,l.next),Ma(a,e,t,n,s,r,0),Ma(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function wg(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Qf(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Ng(c))}s.sort(Cg);for(let r=0;r<s.length;r++)t=Rg(s[r],t);return t}function Cg(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Rg(i,e){let t=Ig(i,e);if(!t)return e;let n=np(t,i);return Ps(n,n.next),Ps(t,t.next)}function Ig(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(Er(i,t))return t;do{if(Er(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let h=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=n&&h>r&&(r=h,a=t.x<t.next.x?t:t.next,h===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,u=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&ep(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let h=Math.abs(s-t.y)/(n-t.x);Sa(t,i)&&(h<u||h===u&&(t.x>a.x||t.x===a.x&&Pg(a,t)))&&(a=t,u=h)}t=t.next}while(t!==o);return a}function Pg(i,e){return Mt(i.prev,i,e.prev)<0&&Mt(e.next,i,i.next)<0}function Lg(i,e,t,n){let s=i;do s.z===0&&(s.z=yu(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Dg(s)}function Dg(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function yu(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Ng(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function ep(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function ea(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&ep(i,e,t,n,s,r,a,o)}function Ug(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Fg(i,e)&&(Sa(i,e)&&Sa(e,i)&&Og(i,e)&&(Mt(i.prev,i,e.prev)||Mt(i,e.prev,e))||Er(i,e)&&Mt(i.prev,i,i.next)>0&&Mt(e.prev,e,e.next)>0)}function Mt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Er(i,e){return i.x===e.x&&i.y===e.y}function tp(i,e,t,n){let s=Fo(Mt(i,e,t)),r=Fo(Mt(i,e,n)),a=Fo(Mt(t,n,i)),o=Fo(Mt(t,n,e));return!!(s!==r&&a!==o||s===0&&Uo(i,t,e)||r===0&&Uo(i,n,e)||a===0&&Uo(t,i,n)||o===0&&Uo(t,e,n))}function Uo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Fo(i){return i>0?1:i<0?-1:0}function Fg(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&tp(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Sa(i,e){return Mt(i.prev,i,i.next)<0?Mt(i,e,i.next)>=0&&Mt(i,i.prev,e)>=0:Mt(i,e,i.prev)<0||Mt(i,i.next,e)<0}function Og(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function np(i,e){let t=vu(i.i,i.x,i.y),n=vu(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function of(i,e,t,n){let s=vu(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ta(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function vu(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Bg(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}function lf(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function cf(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}function zg(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}function Vg(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}function Os(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Fe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function en(i){let e={};for(let t=0;t<i.length;t++){let n=Os(i[t]);for(let s in n)e[s]=n[s]}return e}function Hg(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Yu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}function Oo(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Xg(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function uf(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){let o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=i[o+l]}return s}function sp(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}function qg(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ii;case"vector":case"vector2":case"vector3":case"vector4":return ri;case"color":return Ra;case"quaternion":return si;case"bool":case"boolean":return wi;case"string":return Ci}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function $g(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=qg(i.type);if(i.times===void 0){let t=[],n=[];sp(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}function hf(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}function Ku(i,e,t,n){let s=n0(n);switch(t){case Hu:return i*e;case El:return i*e/s.components*s.byteLength;case wl:return i*e/s.components*s.byteLength;case Fs:return i*e*2/s.components*s.byteLength;case Cl:return i*e*2/s.components*s.byteLength;case Gu:return i*e*3/s.components*s.byteLength;case sn:return i*e*4/s.components*s.byteLength;case Rl:return i*e*4/s.components*s.byteLength;case Ga:case Wa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Xa:case qa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Pl:case Dl:return Math.max(i,16)*Math.max(e,8)/4;case Il:case Ll:return Math.max(i,8)*Math.max(e,8)/2;case Nl:case Ul:case Ol:case Bl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Fl:case kl:case zl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Vl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Hl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Gl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Wl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Xl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ql:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case $l:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Yl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case jl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Zl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Kl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Jl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ql:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ec:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case tc:case nc:case ic:return Math.ceil(i/4)*Math.ceil(e/4)*16;case sc:case rc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ac:case oc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function n0(i){switch(i){case hn:case Bu:return{byteLength:1,components:1};case Pr:case ku:case ci:return{byteLength:2,components:1};case Tl:case Al:return{byteLength:2,components:4};case Gn:case Sl:case vn:return{byteLength:4,components:1};case zu:case Vu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}var ns,is,gf,wu,xf,za,yl,Rr,Bn,Yt,Qt,li,Ms,Cu,Ru,Iu,_f,Yi,yf,vf,bf,Mf,Sf,Tf,Af,Ef,Vo,Ho,wf,Cf,Rf,If,Pf,Lf,Df,Nf,Uf,Go,Wo,Xo,Ss,qo,$o,Yo,jo,vl,Ff,Of,Hn,Pu,Lu,Du,Va,Nu,Uu,Fu,hu,Bf,Ou,ss,Us,bl,Ml,Ha,Kn,on,ji,St,Ir,Ii,Tt,rs,yn,hn,Bu,ku,Pr,Sl,Gn,vn,ci,Tl,Al,Lr,zu,Vu,Hu,Gu,sn,Jn,as,El,wl,Fs,Cl,Rl,Ga,Wa,Xa,qa,Il,Pl,Ll,Dl,Nl,Ul,Fl,Ol,Bl,kl,zl,Vl,Hl,Gl,Wl,Xl,ql,$l,Yl,jl,Zl,Kl,Jl,Ql,ec,tc,nc,ic,sc,rc,ac,oc,Ti,Ai,zo,du,fu,pu,mu,kf,Wu,$a,Dr,zf,lc,Vf,Wn,Ct,qt,ra,at,bs,gu,Hf,Gf,Wf,cc,Xf,qf,uc,$f,Zo,Xu,On,pr,Rd,gr,Kf,Qn,Zt,Id,ta,Ts,rn,oe,Ht,D,Fc,Pd,je,Oc,Ld,Dd,tt,Qs,xr,jm,Zi,Zm,kc,Nt,xt,Ko,gn,la,Jo,Xe,er,Dn,Km,Jm,Vi,uo,pn,Nd,Ud,Cn,ca,Qm,Fd,tr,xi,ho,$r,eg,tg,Od,Bd,kd,zd,ng,nr,zc,_t,ln,ig,_r,Jf,Hi,fo,Be,Kt,ei,Nn,_i,Hc,yi,ir,sr,Vd,Gc,Wc,Xc,qc,$c,Yc,$i,nn,vi,Un,po,rr,ar,or,Gi,Wi,xs,Yr,mo,go,_s,Pt,xo,sg,dt,ua,ha,ct,rg,jr,Zc,cn,ag,An,Kc,lr,mn,Zr,Vt,Et,yr,tn,vr,og,Jt,bi,Jc,_o,Xi,Qc,yo,eu,Ei,kn,Hd,ys,vo,Gd,bo,Mo,So,tu,To,Wd,Ao,ft,Xd,qd,$d,cg,Yd,wo,nu,jd,iu,da,br,Mr,Zd,ug,fa,Ki,cr,Kd,Co,Jd,hg,Kr,Jr,As,su,dg,fg,En,vs,pg,Ro,Sr,Ji,Qo,el,Qd,Qr,Io,ru,ef,Es,tf,nf,ws,pa,Tr,sf,xu,Lo,Do,ma,Cs,ga,Qi,tl,xa,zn,xn,Ar,nl,No,au,ou,lu,Rs,_a,il,ya,sl,va,rl,ba,_u,al,Is,Vn,bu,jn,es,kg,Ls,Aa,Ea,wa,ip,Gg,Wg,_n,ol,ti,$t,Ca,ll,cl,ni,ul,hl,dl,fl,un,wi,Ra,ii,pl,si,Ci,ri,Ia,Zn,ml,rp,ai,Mi,Mu,wr,ur,gl,Pa,Ds,La,cu,df,ff,Da,Bo,ko,Yn,Na,qi,pf,mf,Rt,Su,Ua,Tu,Ns,oi,Au,ts,Ri,uu,Fa,hr,dr,xl,_l,ju,Yg,Zu,jg,Zg,Kg,Jg,Qg,e0,t0,Eu,st,Xb,Cr,Oa,Ba,ka,Ju=Sn(()=>{ns={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},is={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},gf=0,wu=1,xf=2,za=1,yl=2,Rr=3,Bn=0,Yt=1,Qt=2,li=0,Ms=1,Cu=2,Ru=3,Iu=4,_f=5,Yi=100,yf=101,vf=102,bf=103,Mf=104,Sf=200,Tf=201,Af=202,Ef=203,Vo=204,Ho=205,wf=206,Cf=207,Rf=208,If=209,Pf=210,Lf=211,Df=212,Nf=213,Uf=214,Go=0,Wo=1,Xo=2,Ss=3,qo=4,$o=5,Yo=6,jo=7,vl=0,Ff=1,Of=2,Hn=0,Pu=1,Lu=2,Du=3,Va=4,Nu=5,Uu=6,Fu=7,hu="attached",Bf="detached",Ou=300,ss=301,Us=302,bl=303,Ml=304,Ha=306,Kn=1e3,on=1001,ji=1002,St=1003,Ir=1004,Ii=1005,Tt=1006,rs=1007,yn=1008,hn=1009,Bu=1010,ku=1011,Pr=1012,Sl=1013,Gn=1014,vn=1015,ci=1016,Tl=1017,Al=1018,Lr=1020,zu=35902,Vu=35899,Hu=1021,Gu=1022,sn=1023,Jn=1026,as=1027,El=1028,wl=1029,Fs=1030,Cl=1031,Rl=1033,Ga=33776,Wa=33777,Xa=33778,qa=33779,Il=35840,Pl=35841,Ll=35842,Dl=35843,Nl=36196,Ul=37492,Fl=37496,Ol=37488,Bl=37489,kl=37490,zl=37491,Vl=37808,Hl=37809,Gl=37810,Wl=37811,Xl=37812,ql=37813,$l=37814,Yl=37815,jl=37816,Zl=37817,Kl=37818,Jl=37819,Ql=37820,ec=37821,tc=36492,nc=36494,ic=36495,sc=36283,rc=36284,ac=36285,oc=36286,Ti=2300,Ai=2301,zo=2302,du=2303,fu=2400,pu=2401,mu=2402,kf=2500,Wu=0,$a=1,Dr=2,zf=3200,lc=0,Vf=1,Wn="",Ct="srgb",qt="srgb-linear",ra="linear",at="srgb",bs=7680,gu=519,Hf=512,Gf=513,Wf=514,cc=515,Xf=516,qf=517,uc=518,$f=519,Zo=35044,Xu="300 es",On=2e3,pr=2001;Rd={},gr=null;Kf={[Go]:Wo,[Xo]:Yo,[qo]:jo,[Ss]:$o,[Wo]:Go,[Yo]:Xo,[jo]:qo,[$o]:Ss},Qn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Zt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Id=1234567,ta=Math.PI/180,Ts=180/Math.PI;rn={DEG2RAD:ta,RAD2DEG:Ts,generateUUID:wn,clamp:Ze,euclideanModulo:qu,mapLinear:Lm,inverseLerp:Dm,lerp:na,damp:Nm,pingpong:Um,smoothstep:Fm,smootherstep:Om,randInt:Bm,randFloat:km,randFloatSpread:zm,seededRandom:Vm,degToRad:Hm,radToDeg:Gm,isPowerOfTwo:Wm,ceilPowerOfTwo:Xm,floorPowerOfTwo:qm,setQuaternionFromProperEuler:$m,normalize:lt,denormalize:Fn},oe=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ht=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3],d=r[a+0],f=r[a+1],m=r[a+2],x=r[a+3];if(h!==x||l!==d||c!==f||u!==m){let g=l*d+c*f+u*m+h*x;g<0&&(d=-d,f=-f,m=-m,x=-x,g=-g);let p=1-o;if(g<.9995){let v=Math.acos(g),S=Math.sin(v);p=Math.sin(p*v)/S,o=Math.sin(o*v)/S,l=l*p+d*o,c=c*p+f*o,u=u*p+m*o,h=h*p+x*o}else{l=l*p+d*o,c=c*p+f*o,u=u*p+m*o,h=h*p+x*o;let v=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=v,c*=v,u*=v,h*=v}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+u*h+l*f-c*d,e[t+1]=l*m+u*d+c*h-o*f,e[t+2]=c*m+u*f+o*d-l*h,e[t+3]=u*m-o*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),h=o(r/2),d=l(n/2),f=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"YXZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"ZXY":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"ZYX":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"YZX":this._x=d*u*h+c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h-d*f*m;break;case"XZY":this._x=d*u*h-c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h+d*f*m;break;default:Fe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=n+o+h;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>h){let f=2*Math.sqrt(1+n-o-h);this._w=(u-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>h){let f=2*Math.sqrt(1+o-n-h);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+h-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ze(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Pd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Pd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),h=2*(r*n-a*t);return this.x=t+l*c+a*h-o*u,this.y=n+l*u+o*c-r*h,this.z=s+l*h+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Fc.copy(this).projectOnVector(e),this.sub(Fc)}reflect(e){return this.sub(Fc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Fc=new D,Pd=new Ht,je=class i{constructor(e,t,n,s,r,a,o,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],m=n[8],x=s[0],g=s[3],p=s[6],v=s[1],S=s[4],y=s[7],E=s[2],C=s[5],I=s[8];return r[0]=a*x+o*v+l*E,r[3]=a*g+o*S+l*C,r[6]=a*p+o*y+l*I,r[1]=c*x+u*v+h*E,r[4]=c*g+u*S+h*C,r[7]=c*p+u*y+h*I,r[2]=d*x+f*v+m*E,r[5]=d*g+f*S+m*C,r[8]=d*p+f*y+m*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,d=o*l-u*r,f=c*r-a*l,m=t*h+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=h*x,e[1]=(s*c-u*n)*x,e[2]=(o*n-s*a)*x,e[3]=d*x,e[4]=(u*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=f*x,e[7]=(n*l-c*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Oc.makeScale(e,t)),this}rotate(e){return this.premultiply(Oc.makeRotation(-e)),this}translate(e,t){return this.premultiply(Oc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Oc=new je,Ld=new je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Dd=new je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);tt=Ym();xr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Qs===void 0&&(Qs=mr("canvas")),Qs.width=e.width,Qs.height=e.height;let s=Qs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Qs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=mr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Si(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Si(t[n]/255)*255):t[n]=Si(t[n]);return{data:t,width:e.width,height:e.height}}else return Fe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},jm=0,Zi=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:jm++}),this.uuid=wn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Bc(s[a].image)):r.push(Bc(s[a]))}else r=Bc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};Zm=0,kc=new D,Nt=class i extends Qn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=on,s=on,r=Tt,a=yn,o=sn,l=hn,c=i.DEFAULT_ANISOTROPY,u=Wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Zm++}),this.uuid=wn(),this.name="",this.source=new Zi(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new oe(0,0),this.repeat=new oe(1,1),this.center=new oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(kc).x}get height(){return this.source.getSize(kc).y}get depth(){return this.source.getSize(kc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Fe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Fe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ou)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Kn:e.x=e.x-Math.floor(e.x);break;case on:e.x=e.x<0?0:1;break;case ji:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Kn:e.y=e.y-Math.floor(e.y);break;case on:e.y=e.y<0?0:1;break;case ji:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=Ou;Nt.DEFAULT_ANISOTROPY=1;xt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],m=l[9],x=l[2],g=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+x)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let S=(c+1)/2,y=(f+1)/2,E=(p+1)/2,C=(u+d)/4,I=(h+x)/4,b=(m+g)/4;return S>y&&S>E?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=C/n,r=I/n):y>E?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=C/s,r=b/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=I/r,s=b/r),this.set(n,s,r,t),this}let v=Math.sqrt((g-m)*(g-m)+(h-x)*(h-x)+(d-u)*(d-u));return Math.abs(v)<.001&&(v=1),this.x=(g-m)/v,this.y=(h-x)/v,this.z=(d-u)/v,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this.w=Ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this.w=Ze(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ko=class extends Qn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Tt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new Nt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Tt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Zi(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},gn=class extends Ko{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},la=class extends Nt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=St,this.minFilter=St,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Jo=class extends Nt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=St,this.minFilter=St,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Xe=class i{constructor(e,t,n,s,r,a,o,l,c,u,h,d,f,m,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,h,d,f,m,x,g)}set(e,t,n,s,r,a,o,l,c,u,h,d,f,m,x,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();let t=this.elements,n=e.elements,s=1/er.setFromMatrixColumn(e,0).length(),r=1/er.setFromMatrixColumn(e,1).length(),a=1/er.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){let d=a*u,f=a*h,m=o*u,x=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+m*c,t[5]=d-x*c,t[9]=-o*l,t[2]=x-d*c,t[6]=m+f*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*u,f=l*h,m=c*u,x=c*h;t[0]=d+x*o,t[4]=m*o-f,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=f*o-m,t[6]=x+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*u,f=l*h,m=c*u,x=c*h;t[0]=d-x*o,t[4]=-a*h,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*u,t[9]=x-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*u,f=a*h,m=o*u,x=o*h;t[0]=l*u,t[4]=m*c-f,t[8]=d*c+x,t[1]=l*h,t[5]=x*c+d,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,f=a*c,m=o*l,x=o*c;t[0]=l*u,t[4]=x-d*h,t[8]=m*h+f,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+m,t[10]=d-x*h}else if(e.order==="XZY"){let d=a*l,f=a*c,m=o*l,x=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+x,t[5]=a*u,t[9]=f*h-m,t[2]=m*h-f,t[6]=o*u,t[10]=x*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Km,e,Jm)}lookAt(e,t,n){let s=this.elements;return pn.subVectors(e,t),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),Vi.crossVectors(n,pn),Vi.lengthSq()===0&&(Math.abs(n.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),Vi.crossVectors(n,pn)),Vi.normalize(),uo.crossVectors(pn,Vi),s[0]=Vi.x,s[4]=uo.x,s[8]=pn.x,s[1]=Vi.y,s[5]=uo.y,s[9]=pn.y,s[2]=Vi.z,s[6]=uo.z,s[10]=pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],m=n[2],x=n[6],g=n[10],p=n[14],v=n[3],S=n[7],y=n[11],E=n[15],C=s[0],I=s[4],b=s[8],M=s[12],F=s[1],w=s[5],V=s[9],k=s[13],L=s[2],P=s[6],N=s[10],U=s[14],ee=s[3],se=s[7],fe=s[11],ye=s[15];return r[0]=a*C+o*F+l*L+c*ee,r[4]=a*I+o*w+l*P+c*se,r[8]=a*b+o*V+l*N+c*fe,r[12]=a*M+o*k+l*U+c*ye,r[1]=u*C+h*F+d*L+f*ee,r[5]=u*I+h*w+d*P+f*se,r[9]=u*b+h*V+d*N+f*fe,r[13]=u*M+h*k+d*U+f*ye,r[2]=m*C+x*F+g*L+p*ee,r[6]=m*I+x*w+g*P+p*se,r[10]=m*b+x*V+g*N+p*fe,r[14]=m*M+x*k+g*U+p*ye,r[3]=v*C+S*F+y*L+E*ee,r[7]=v*I+S*w+y*P+E*se,r[11]=v*b+S*V+y*N+E*fe,r[15]=v*M+S*k+y*U+E*ye,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],m=e[3],x=e[7],g=e[11],p=e[15],v=l*f-c*d,S=o*f-c*h,y=o*d-l*h,E=a*f-c*u,C=a*d-l*u,I=a*h-o*u;return t*(x*v-g*S+p*y)-n*(m*v-g*E+p*C)+s*(m*S-x*E+p*I)-r*(m*y-x*C+g*I)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],m=e[12],x=e[13],g=e[14],p=e[15],v=t*o-n*a,S=t*l-s*a,y=t*c-r*a,E=n*l-s*o,C=n*c-r*o,I=s*c-r*l,b=u*x-h*m,M=u*g-d*m,F=u*p-f*m,w=h*g-d*x,V=h*p-f*x,k=d*p-f*g,L=v*k-S*V+y*w+E*F-C*M+I*b;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/L;return e[0]=(o*k-l*V+c*w)*P,e[1]=(s*V-n*k-r*w)*P,e[2]=(x*I-g*C+p*E)*P,e[3]=(d*C-h*I-f*E)*P,e[4]=(l*F-a*k-c*M)*P,e[5]=(t*k-s*F+r*M)*P,e[6]=(g*y-m*I-p*S)*P,e[7]=(u*I-d*y+f*S)*P,e[8]=(a*V-o*F+c*b)*P,e[9]=(n*F-t*V-r*b)*P,e[10]=(m*C-x*y+p*v)*P,e[11]=(h*y-u*C-f*v)*P,e[12]=(o*M-a*w-l*b)*P,e[13]=(t*w-n*M+s*b)*P,e[14]=(x*S-m*E-g*v)*P,e[15]=(u*E-h*S+d*v)*P,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,h=o+o,d=r*c,f=r*u,m=r*h,x=a*u,g=a*h,p=o*h,v=l*c,S=l*u,y=l*h,E=n.x,C=n.y,I=n.z;return s[0]=(1-(x+p))*E,s[1]=(f+y)*E,s[2]=(m-S)*E,s[3]=0,s[4]=(f-y)*C,s[5]=(1-(d+p))*C,s[6]=(g+v)*C,s[7]=0,s[8]=(m+S)*I,s[9]=(g-v)*I,s[10]=(1-(d+x))*I,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinant();if(r===0)return n.set(1,1,1),t.identity(),this;let a=er.set(s[0],s[1],s[2]).length(),o=er.set(s[4],s[5],s[6]).length(),l=er.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Dn.copy(this);let c=1/a,u=1/o,h=1/l;return Dn.elements[0]*=c,Dn.elements[1]*=c,Dn.elements[2]*=c,Dn.elements[4]*=u,Dn.elements[5]*=u,Dn.elements[6]*=u,Dn.elements[8]*=h,Dn.elements[9]*=h,Dn.elements[10]*=h,t.setFromRotationMatrix(Dn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=On,l=!1){let c=this.elements,u=2*r/(t-e),h=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),m,x;if(l)m=r/(a-r),x=a*r/(a-r);else if(o===On)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===pr)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=On,l=!1){let c=this.elements,u=2/(t-e),h=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),m,x;if(l)m=1/(a-r),x=a/(a-r);else if(o===On)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===pr)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},er=new D,Dn=new Xe,Km=new D(0,0,0),Jm=new D(1,1,1),Vi=new D,uo=new D,pn=new D,Nd=new Xe,Ud=new Ht,Cn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ze(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Fe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Nd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Nd,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ud.setFromEuler(this),this.setFromQuaternion(Ud,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Cn.DEFAULT_ORDER="XYZ";ca=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Qm=0,Fd=new D,tr=new Ht,xi=new Xe,ho=new D,$r=new D,eg=new D,tg=new Ht,Od=new D(1,0,0),Bd=new D(0,1,0),kd=new D(0,0,1),zd={type:"added"},ng={type:"removed"},nr={type:"childadded",child:null},zc={type:"childremoved",child:null},_t=class i extends Qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Qm++}),this.uuid=wn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new D,t=new Cn,n=new Ht,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Xe},normalMatrix:{value:new je}}),this.matrix=new Xe,this.matrixWorld=new Xe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ca,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return tr.setFromAxisAngle(e,t),this.quaternion.multiply(tr),this}rotateOnWorldAxis(e,t){return tr.setFromAxisAngle(e,t),this.quaternion.premultiply(tr),this}rotateX(e){return this.rotateOnAxis(Od,e)}rotateY(e){return this.rotateOnAxis(Bd,e)}rotateZ(e){return this.rotateOnAxis(kd,e)}translateOnAxis(e,t){return Fd.copy(e).applyQuaternion(this.quaternion),this.position.add(Fd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Od,e)}translateY(e){return this.translateOnAxis(Bd,e)}translateZ(e){return this.translateOnAxis(kd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ho.copy(e):ho.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),$r.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xi.lookAt($r,ho,this.up):xi.lookAt(ho,$r,this.up),this.quaternion.setFromRotationMatrix(xi),s&&(xi.extractRotation(s.matrixWorld),tr.setFromRotationMatrix(xi),this.quaternion.premultiply(tr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ge("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(zd),nr.child=e,this.dispatchEvent(nr),nr.child=null):Ge("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ng),zc.child=e,this.dispatchEvent(zc),zc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xi.multiply(e.parent.matrixWorld)),e.applyMatrix4(xi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(zd),nr.child=e,this.dispatchEvent(nr),nr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($r,e,eg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($r,tg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};_t.DEFAULT_UP=new D(0,1,0);_t.DEFAULT_MATRIX_AUTO_UPDATE=!0;_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;ln=class extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}},ig={type:"move"},_r=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ln,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ln,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ln,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),p=this._getHandJoint(c,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ig)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ln;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Jf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hi={h:0,s:0,l:0},fo={h:0,s:0,l:0};Be=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ct){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=qu(e,1),t=Ze(t,0,1),n=Ze(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Vc(a,r,e+1/3),this.g=Vc(a,r,e),this.b=Vc(a,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=Ct){function n(r){r!==void 0&&parseFloat(r)<1&&Fe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Fe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Fe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ct){let n=Jf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Fe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Si(e.r),this.g=Si(e.g),this.b=Si(e.b),this}copyLinearToSRGB(e){return this.r=fr(e.r),this.g=fr(e.g),this.b=fr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ct){return tt.workingToColorSpace(Kt.copy(this),e),Math.round(Ze(Kt.r*255,0,255))*65536+Math.round(Ze(Kt.g*255,0,255))*256+Math.round(Ze(Kt.b*255,0,255))}getHexString(e=Ct){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(Kt.copy(this),t);let n=Kt.r,s=Kt.g,r=Kt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,u=(o+a)/2;if(o===a)l=0,c=0;else{let h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(Kt.copy(this),t),e.r=Kt.r,e.g=Kt.g,e.b=Kt.b,e}getStyle(e=Ct){tt.workingToColorSpace(Kt.copy(this),e);let t=Kt.r,n=Kt.g,s=Kt.b;return e!==Ct?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Hi),this.setHSL(Hi.h+e,Hi.s+t,Hi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Hi),e.getHSL(fo);let n=na(Hi.h,fo.h,t),s=na(Hi.s,fo.s,t),r=na(Hi.l,fo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Kt=new Be;Be.NAMES=Jf;ei=class extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Nn=new D,_i=new D,Hc=new D,yi=new D,ir=new D,sr=new D,Vd=new D,Gc=new D,Wc=new D,Xc=new D,qc=new xt,$c=new xt,Yc=new xt,$i=class i{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Nn.subVectors(e,t),s.cross(Nn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Nn.subVectors(s,t),_i.subVectors(n,t),Hc.subVectors(e,t);let a=Nn.dot(Nn),o=Nn.dot(_i),l=Nn.dot(Hc),c=_i.dot(_i),u=_i.dot(Hc),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;let d=1/h,f=(c*l-o*u)*d,m=(a*u-o*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,yi)===null?!1:yi.x>=0&&yi.y>=0&&yi.x+yi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,yi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,yi.x),l.addScaledVector(a,yi.y),l.addScaledVector(o,yi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return qc.setScalar(0),$c.setScalar(0),Yc.setScalar(0),qc.fromBufferAttribute(e,t),$c.fromBufferAttribute(e,n),Yc.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(qc,r.x),a.addScaledVector($c,r.y),a.addScaledVector(Yc,r.z),a}static isFrontFacing(e,t,n,s){return Nn.subVectors(n,t),_i.subVectors(e,t),Nn.cross(_i).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Nn.subVectors(this.c,this.b),_i.subVectors(this.a,this.b),Nn.cross(_i).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;ir.subVectors(s,n),sr.subVectors(r,n),Gc.subVectors(e,n);let l=ir.dot(Gc),c=sr.dot(Gc);if(l<=0&&c<=0)return t.copy(n);Wc.subVectors(e,s);let u=ir.dot(Wc),h=sr.dot(Wc);if(u>=0&&h<=u)return t.copy(s);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(ir,a);Xc.subVectors(e,r);let f=ir.dot(Xc),m=sr.dot(Xc);if(m>=0&&f<=m)return t.copy(r);let x=f*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(sr,o);let g=u*m-f*h;if(g<=0&&h-u>=0&&f-m>=0)return Vd.subVectors(r,s),o=(h-u)/(h-u+(f-m)),t.copy(s).addScaledVector(Vd,o);let p=1/(g+x+d);return a=x*p,o=d*p,t.copy(n).addScaledVector(ir,a).addScaledVector(sr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},nn=class{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Un):Un.fromBufferAttribute(r,a),Un.applyMatrix4(e.matrixWorld),this.expandByPoint(Un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),po.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),po.copy(n.boundingBox)),po.applyMatrix4(e.matrixWorld),this.union(po)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Un),Un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Yr),mo.subVectors(this.max,Yr),rr.subVectors(e.a,Yr),ar.subVectors(e.b,Yr),or.subVectors(e.c,Yr),Gi.subVectors(ar,rr),Wi.subVectors(or,ar),xs.subVectors(rr,or);let t=[0,-Gi.z,Gi.y,0,-Wi.z,Wi.y,0,-xs.z,xs.y,Gi.z,0,-Gi.x,Wi.z,0,-Wi.x,xs.z,0,-xs.x,-Gi.y,Gi.x,0,-Wi.y,Wi.x,0,-xs.y,xs.x,0];return!jc(t,rr,ar,or,mo)||(t=[1,0,0,0,1,0,0,0,1],!jc(t,rr,ar,or,mo))?!1:(go.crossVectors(Gi,Wi),t=[go.x,go.y,go.z],jc(t,rr,ar,or,mo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(vi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},vi=[new D,new D,new D,new D,new D,new D,new D,new D],Un=new D,po=new nn,rr=new D,ar=new D,or=new D,Gi=new D,Wi=new D,xs=new D,Yr=new D,mo=new D,go=new D,_s=new D;Pt=new D,xo=new oe,sg=0,dt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:sg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Zo,this.updateRanges=[],this.gpuType=vn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)xo.fromBufferAttribute(this,t),xo.applyMatrix3(e),this.setXY(t,xo.x,xo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix3(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Fn(t,this.array)),t}setX(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Fn(t,this.array)),t}setY(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Fn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Fn(t,this.array)),t}setW(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array),r=lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Zo&&(e.usage=this.usage),e}},ua=class extends dt{constructor(e,t,n){super(new Uint16Array(e),t,n)}},ha=class extends dt{constructor(e,t,n){super(new Uint32Array(e),t,n)}},ct=class extends dt{constructor(e,t,n){super(new Float32Array(e),t,n)}},rg=new nn,jr=new D,Zc=new D,cn=class{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):rg.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;jr.subVectors(e,this.center);let t=jr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(jr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Zc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(jr.copy(e.center).add(Zc)),this.expandByPoint(jr.copy(e.center).sub(Zc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ag=0,An=new Xe,Kc=new _t,lr=new D,mn=new nn,Zr=new nn,Vt=new D,Et=class i extends Qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ag++}),this.uuid=wn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Im(e)?ha:ua)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,n){return An.makeTranslation(e,t,n),this.applyMatrix4(An),this}scale(e,t,n){return An.makeScale(e,t,n),this.applyMatrix4(An),this}lookAt(e){return Kc.lookAt(e),Kc.updateMatrix(),this.applyMatrix4(Kc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(lr).negate(),this.translate(lr.x,lr.y,lr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ct(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Fe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new nn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ge("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];mn.setFromBufferAttribute(r),this.morphTargetsRelative?(Vt.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(Vt),Vt.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(Vt)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ge('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new cn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ge("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){let n=this.boundingSphere.center;if(mn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Zr.setFromBufferAttribute(o),this.morphTargetsRelative?(Vt.addVectors(mn.min,Zr.min),mn.expandByPoint(Vt),Vt.addVectors(mn.max,Zr.max),mn.expandByPoint(Vt)):(mn.expandByPoint(Zr.min),mn.expandByPoint(Zr.max))}mn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Vt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Vt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Vt.fromBufferAttribute(o,c),l&&(lr.fromBufferAttribute(e,c),Vt.add(lr)),s=Math.max(s,n.distanceToSquared(Vt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ge('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ge("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new dt(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let b=0;b<n.count;b++)o[b]=new D,l[b]=new D;let c=new D,u=new D,h=new D,d=new oe,f=new oe,m=new oe,x=new D,g=new D;function p(b,M,F){c.fromBufferAttribute(n,b),u.fromBufferAttribute(n,M),h.fromBufferAttribute(n,F),d.fromBufferAttribute(r,b),f.fromBufferAttribute(r,M),m.fromBufferAttribute(r,F),u.sub(c),h.sub(c),f.sub(d),m.sub(d);let w=1/(f.x*m.y-m.x*f.y);isFinite(w)&&(x.copy(u).multiplyScalar(m.y).addScaledVector(h,-f.y).multiplyScalar(w),g.copy(h).multiplyScalar(f.x).addScaledVector(u,-m.x).multiplyScalar(w),o[b].add(x),o[M].add(x),o[F].add(x),l[b].add(g),l[M].add(g),l[F].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let b=0,M=v.length;b<M;++b){let F=v[b],w=F.start,V=F.count;for(let k=w,L=w+V;k<L;k+=3)p(e.getX(k+0),e.getX(k+1),e.getX(k+2))}let S=new D,y=new D,E=new D,C=new D;function I(b){E.fromBufferAttribute(s,b),C.copy(E);let M=o[b];S.copy(M),S.sub(E.multiplyScalar(E.dot(M))).normalize(),y.crossVectors(C,M);let w=y.dot(l[b])<0?-1:1;a.setXYZW(b,S.x,S.y,S.z,w)}for(let b=0,M=v.length;b<M;++b){let F=v[b],w=F.start,V=F.count;for(let k=w,L=w+V;k<L;k+=3)I(e.getX(k+0)),I(e.getX(k+1)),I(e.getX(k+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new dt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new D,r=new D,a=new D,o=new D,l=new D,c=new D,u=new D,h=new D;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),x=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),o.add(u),l.add(u),c.add(u),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Vt.fromBufferAttribute(e,t),Vt.normalize(),e.setXYZ(t,Vt.x,Vt.y,Vt.z)}toNonIndexed(){function e(o,l){let c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u),f=0,m=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*u;for(let p=0;p<u;p++)d[m++]=c[f++]}return new dt(d,u,h)}if(this.index===null)return Fe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){let d=c[u],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,u=a.length;c<u;c++){let h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},yr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Zo,this.updateRanges=[],this.version=0,this.uuid=wn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=wn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=wn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},tn=new D,vr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix4(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyNormalMatrix(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.transformDirection(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=lt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Fn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Fn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Fn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Fn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array),r=lt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){aa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new dt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){aa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},og=0,Jt=class extends Qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:og++}),this.uuid=wn(),this.name="",this.type="Material",this.blending=Ms,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vo,this.blendDst=Ho,this.blendEquation=Yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Be(0,0,0),this.blendAlpha=0,this.depthFunc=Ss,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=bs,this.stencilZFail=bs,this.stencilZPass=bs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Fe(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Fe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ms&&(n.blending=this.blending),this.side!==Bn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Vo&&(n.blendSrc=this.blendSrc),this.blendDst!==Ho&&(n.blendDst=this.blendDst),this.blendEquation!==Yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ss&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==gu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==bs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==bs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==bs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},bi=new D,Jc=new D,_o=new D,Xi=new D,Qc=new D,yo=new D,eu=new D,Ei=class{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,bi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=bi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(bi.copy(this.origin).addScaledVector(this.direction,t),bi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Jc.copy(e).add(t).multiplyScalar(.5),_o.copy(t).sub(e).normalize(),Xi.copy(this.origin).sub(Jc);let r=e.distanceTo(t)*.5,a=-this.direction.dot(_o),o=Xi.dot(this.direction),l=-Xi.dot(_o),c=Xi.lengthSq(),u=Math.abs(1-a*a),h,d,f,m;if(u>0)if(h=a*l-o,d=a*o-l,m=r*u,h>=0)if(d>=-m)if(d<=m){let x=1/u;h*=x,d*=x,f=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d<=-m?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=m?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Jc).addScaledVector(_o,d),f}intersectSphere(e,t){bi.subVectors(e.center,this.origin);let n=bi.dot(this.direction),s=bi.dot(bi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,bi)!==null}intersectTriangle(e,t,n,s,r){Qc.subVectors(t,e),yo.subVectors(n,e),eu.crossVectors(Qc,yo);let a=this.direction.dot(eu),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Xi.subVectors(this.origin,e);let l=o*this.direction.dot(yo.crossVectors(Xi,yo));if(l<0)return null;let c=o*this.direction.dot(Qc.cross(Xi));if(c<0||l+c>a)return null;let u=-o*Xi.dot(eu);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},kn=class extends Jt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=vl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Hd=new Xe,ys=new Ei,vo=new cn,Gd=new D,bo=new D,Mo=new D,So=new D,tu=new D,To=new D,Wd=new D,Ao=new D,ft=class extends _t{constructor(e=new Et,t=new kn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){To.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=o[l],h=r[l];u!==0&&(tu.fromBufferAttribute(h,e),a?To.addScaledVector(tu,u):To.addScaledVector(tu.sub(t),u))}t.add(To)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vo.copy(n.boundingSphere),vo.applyMatrix4(r),ys.copy(e.ray).recast(e.near),!(vo.containsPoint(ys.origin)===!1&&(ys.intersectSphere(vo,Gd)===null||ys.origin.distanceToSquared(Gd)>(e.far-e.near)**2))&&(Hd.copy(r).invert(),ys.copy(e.ray).applyMatrix4(Hd),!(n.boundingBox!==null&&ys.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ys)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=a[g.materialIndex],v=Math.max(g.start,f.start),S=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let y=v,E=S;y<E;y+=3){let C=o.getX(y),I=o.getX(y+1),b=o.getX(y+2);s=Eo(this,p,e,n,c,u,h,C,I,b),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let v=o.getX(g),S=o.getX(g+1),y=o.getX(g+2);s=Eo(this,a,e,n,c,u,h,v,S,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=a[g.materialIndex],v=Math.max(g.start,f.start),S=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let y=v,E=S;y<E;y+=3){let C=y,I=y+1,b=y+2;s=Eo(this,p,e,n,c,u,h,C,I,b),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let v=g,S=g+1,y=g+2;s=Eo(this,a,e,n,c,u,h,v,S,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};Xd=new D,qd=new xt,$d=new xt,cg=new D,Yd=new Xe,wo=new D,nu=new cn,jd=new Xe,iu=new Ei,da=class extends ft{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=hu,this.bindMatrix=new Xe,this.bindMatrixInverse=new Xe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new nn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,wo),this.boundingBox.expandByPoint(wo)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new cn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,wo),this.boundingSphere.expandByPoint(wo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),nu.copy(this.boundingSphere),nu.applyMatrix4(s),e.ray.intersectsSphere(nu)!==!1&&(jd.copy(s).invert(),iu.copy(e.ray).applyMatrix4(jd),!(this.boundingBox!==null&&iu.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,iu)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new xt,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===hu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Bf?this.bindMatrixInverse.copy(this.bindMatrix).invert():Fe("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;qd.fromBufferAttribute(s.attributes.skinIndex,e),$d.fromBufferAttribute(s.attributes.skinWeight,e),Xd.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let a=$d.getComponent(r);if(a!==0){let o=qd.getComponent(r);Yd.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(cg.copy(Xd).applyMatrix4(Yd),a)}}return t.applyMatrix4(this.bindMatrixInverse)}},br=class extends _t{constructor(){super(),this.isBone=!0,this.type="Bone"}},Mr=class extends Nt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=St,u=St,h,d){super(null,a,o,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Zd=new Xe,ug=new Xe,fa=class i{constructor(e=[],t=[]){this.uuid=wn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Fe("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Xe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Xe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){let o=e[r]?e[r].matrixWorld:ug;Zd.multiplyMatrices(o,t[r]),Zd.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Mr(t,e,e,sn,vn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],a=t[r];a===void 0&&(Fe("Skeleton: No bone found with UUID:",r),a=new br),this.bones.push(a),this.boneInverses.push(new Xe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let a=t[s];e.bones.push(a.uuid);let o=n[s];e.boneInverses.push(o.toArray())}return e}},Ki=class extends dt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},cr=new Xe,Kd=new Xe,Co=[],Jd=new nn,hg=new Xe,Kr=new ft,Jr=new cn,As=class extends ft{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ki(new Float32Array(n*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,hg)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new nn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,cr),Jd.copy(e.boundingBox).applyMatrix4(cr),this.boundingBox.union(Jd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new cn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,cr),Jr.copy(e.boundingSphere).applyMatrix4(cr),this.boundingSphere.union(Jr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Kr.geometry=this.geometry,Kr.material=this.material,Kr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Jr.copy(this.boundingSphere),Jr.applyMatrix4(n),e.ray.intersectsSphere(Jr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,cr),Kd.multiplyMatrices(n,cr),Kr.matrixWorld=Kd,Kr.raycast(e,Co);for(let a=0,o=Co.length;a<o;a++){let l=Co[a];l.instanceId=r,l.object=this,t.push(l)}Co.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ki(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Mr(new Float32Array(s*this.count),s,this.count,El,vn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},su=new D,dg=new D,fg=new je,En=class{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=su.subVectors(n,t).cross(dg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(su),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||fg.getNormalMatrix(e),s=this.coplanarPoint(su).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},vs=new cn,pg=new oe(.5,.5),Ro=new D,Sr=class{constructor(e=new En,t=new En,n=new En,s=new En,r=new En,a=new En){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=On,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],m=r[8],x=r[9],g=r[10],p=r[11],v=r[12],S=r[13],y=r[14],E=r[15];if(s[0].setComponents(c-a,f-u,p-m,E-v).normalize(),s[1].setComponents(c+a,f+u,p+m,E+v).normalize(),s[2].setComponents(c+o,f+h,p+x,E+S).normalize(),s[3].setComponents(c-o,f-h,p-x,E-S).normalize(),n)s[4].setComponents(l,d,g,y).normalize(),s[5].setComponents(c-l,f-d,p-g,E-y).normalize();else if(s[4].setComponents(c-l,f-d,p-g,E-y).normalize(),t===On)s[5].setComponents(c+l,f+d,p+g,E+y).normalize();else if(t===pr)s[5].setComponents(l,d,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),vs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),vs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(vs)}intersectsSprite(e){vs.center.set(0,0,0);let t=pg.distanceTo(e.center);return vs.radius=.7071067811865476+t,vs.applyMatrix4(e.matrixWorld),this.intersectsSphere(vs)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Ro.x=s.normal.x>0?e.max.x:e.min.x,Ro.y=s.normal.y>0?e.max.y:e.min.y,Ro.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ro)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ji=class extends Jt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Be(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Qo=new D,el=new D,Qd=new Xe,Qr=new Ei,Io=new cn,ru=new D,ef=new D,Es=class extends _t{constructor(e=new Et,t=new Ji){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Qo.fromBufferAttribute(t,s-1),el.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Qo.distanceTo(el);e.setAttribute("lineDistance",new ct(n,1))}else Fe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Io.copy(n.boundingSphere),Io.applyMatrix4(s),Io.radius+=r,e.ray.intersectsSphere(Io)===!1)return;Qd.copy(s).invert(),Qr.copy(e.ray).applyMatrix4(Qd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){let f=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let x=f,g=m-1;x<g;x+=c){let p=u.getX(x),v=u.getX(x+1),S=Po(this,e,Qr,l,p,v,x);S&&t.push(S)}if(this.isLineLoop){let x=u.getX(m-1),g=u.getX(f),p=Po(this,e,Qr,l,x,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let x=f,g=m-1;x<g;x+=c){let p=Po(this,e,Qr,l,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){let x=Po(this,e,Qr,l,m-1,f,m-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};tf=new D,nf=new D,ws=class extends Es{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)tf.fromBufferAttribute(t,s),nf.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+tf.distanceTo(nf);e.setAttribute("lineDistance",new ct(n,1))}else Fe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},pa=class extends Es{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Tr=class extends Jt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Be(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},sf=new Xe,xu=new Ei,Lo=new cn,Do=new D,ma=class extends _t{constructor(e=new Et,t=new Tr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Lo.copy(n.boundingSphere),Lo.applyMatrix4(s),Lo.radius+=r,e.ray.intersectsSphere(Lo)===!1)return;sf.copy(s).invert(),xu.copy(e.ray).applyMatrix4(sf);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null){let d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let m=d,x=f;m<x;m++){let g=c.getX(m);Do.fromBufferAttribute(h,g),rf(Do,g,l,s,e,t,this)}}else{let d=Math.max(0,a.start),f=Math.min(h.count,a.start+a.count);for(let m=d,x=f;m<x;m++)Do.fromBufferAttribute(h,m),rf(Do,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};Cs=class extends Nt{constructor(e,t,n,s,r,a,o,l,c,u,h,d){super(null,a,o,l,c,u,s,r,h,d),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}},ga=class extends Nt{constructor(e=[],t=ss,n,s,r,a,o,l,c,u){super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Qi=class extends Nt{constructor(e,t,n=Gn,s,r,a,o=St,l=St,c,u=Jn,h=1){if(u!==Jn&&u!==as)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:h};super(d,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Zi(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},tl=class extends Qi{constructor(e,t=Gn,n=ss,s,r,a=St,o=St,l,c=Jn){let u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,n,s,r,a,o,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},xa=class extends Nt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},zn=class i extends Et{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],u=[],h=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ct(c,3)),this.setAttribute("normal",new ct(u,3)),this.setAttribute("uv",new ct(h,2));function m(x,g,p,v,S,y,E,C,I,b,M){let F=y/I,w=E/b,V=y/2,k=E/2,L=C/2,P=I+1,N=b+1,U=0,ee=0,se=new D;for(let fe=0;fe<N;fe++){let ye=fe*w-k;for(let j=0;j<P;j++){let X=j*F-V;se[x]=X*v,se[g]=ye*S,se[p]=L,c.push(se.x,se.y,se.z),se[x]=0,se[g]=0,se[p]=C>0?1:-1,u.push(se.x,se.y,se.z),h.push(j/I),h.push(1-fe/b),U+=1}}for(let fe=0;fe<b;fe++)for(let ye=0;ye<I;ye++){let j=d+ye+P*fe,X=d+ye+P*(fe+1),Ae=d+(ye+1)+P*(fe+1),Y=d+(ye+1)+P*fe;l.push(j,X,Y),l.push(X,Ae,Y),ee+=6}o.addGroup(f,ee,M),f+=ee,d+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},xn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Fe("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let u=n[s],d=n[s+1]-u,f=(a-u)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new oe:new D);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new D,s=[],r=[],a=[],o=new D,l=new Xe;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new D)}r[0]=new D,a[0]=new D;let c=Number.MAX_VALUE,u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Ze(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,m))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Ze(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],f*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ar=class extends xn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new oe){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},nl=class extends Ar{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};No=new D,au=new $u,ou=new $u,lu=new $u,Rs=class extends xn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new D){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(No.subVectors(s[0],s[1]).add(s[0]),c=No);let h=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(No.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=No),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(h),f),x=Math.pow(h.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(u),f);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),au.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,m,x,g),ou.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,m,x,g),lu.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,m,x,g)}else this.curveType==="catmullrom"&&(au.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),ou.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),lu.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(au.calc(l),ou.calc(l),lu.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new D().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};_a=class extends xn{constructor(e=new oe,t=new oe,n=new oe,s=new oe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new oe){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(sa(e,s.x,r.x,a.x,o.x),sa(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},il=class extends xn{constructor(e=new D,t=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new D){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(sa(e,s.x,r.x,a.x,o.x),sa(e,s.y,r.y,a.y,o.y),sa(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ya=class extends xn{constructor(e=new oe,t=new oe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new oe){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new oe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},sl=class extends xn{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},va=class extends xn{constructor(e=new oe,t=new oe,n=new oe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new oe){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ia(e,s.x,r.x,a.x),ia(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},rl=class extends xn{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ia(e,s.x,r.x,a.x),ia(e,s.y,r.y,a.y),ia(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ba=class extends xn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new oe){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],h=s[a>s.length-3?s.length-1:a+2];return n.set(af(o,l.x,c.x,u.x,h.x),af(o,l.y,c.y,u.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new oe().fromArray(s))}return this}},_u=Object.freeze({__proto__:null,ArcCurve:nl,CatmullRomCurve3:Rs,CubicBezierCurve:_a,CubicBezierCurve3:il,EllipseCurve:Ar,LineCurve:ya,LineCurve3:sl,QuadraticBezierCurve:va,QuadraticBezierCurve3:rl,SplineCurve:ba}),al=class extends xn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new _u[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new _u[s.type]().fromJSON(s))}return this}},Is=class extends al{constructor(e){super(),this.type="Path",this.currentPoint=new oe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ya(this.currentPoint.clone(),new oe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new va(this.currentPoint.clone(),new oe(e,t),new oe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new _a(this.currentPoint.clone(),new oe(e,t),new oe(n,s),new oe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new ba(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new Ar(e,t,n,s,r,a,o,l);if(this.curves.length>0){let h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);let u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Vn=class extends Is{constructor(e){super(e),this.uuid=wn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Is().fromJSON(s))}return this}};bu=class{static triangulate(e,t,n=2){return Mg(e,t,n)}},jn=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];lf(e),cf(n,e);let a=e.length;t.forEach(lf);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,cf(n,t[l]);let o=bu.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};es=class i extends Et{constructor(e=new Vn([new oe(.5,.5),new oe(-.5,.5),new oe(-.5,-.5),new oe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new ct(s,3)),this.setAttribute("uv",new ct(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:kg,S,y=!1,E,C,I,b;if(p){S=p.getSpacedPoints(u),y=!0,d=!1;let Q=p.isCatmullRomCurve3?p.closed:!1;E=p.computeFrenetFrames(u,Q),C=new D,I=new D,b=new D}d||(g=0,f=0,m=0,x=0);let M=o.extractPoints(c),F=M.shape,w=M.holes;if(!jn.isClockWise(F)){F=F.reverse();for(let Q=0,ae=w.length;Q<ae;Q++){let ne=w[Q];jn.isClockWise(ne)&&(w[Q]=ne.reverse())}}function k(Q){let ne=10000000000000001e-36,de=Q[0];for(let R=1;R<=Q.length;R++){let Oe=R%Q.length,xe=Q[Oe],Ne=xe.x-de.x,ue=xe.y-de.y,A=Ne*Ne+ue*ue,_=Math.max(Math.abs(xe.x),Math.abs(xe.y),Math.abs(de.x),Math.abs(de.y)),B=ne*_*_;if(A<=B){Q.splice(Oe,1),R--;continue}de=xe}}k(F),w.forEach(k);let L=w.length,P=F;for(let Q=0;Q<L;Q++){let ae=w[Q];F=F.concat(ae)}function N(Q,ae,ne){return ae||Ge("ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(ae,ne)}let U=F.length;function ee(Q,ae,ne){let de,R,Oe,xe=Q.x-ae.x,Ne=Q.y-ae.y,ue=ne.x-Q.x,A=ne.y-Q.y,_=xe*xe+Ne*Ne,B=xe*A-Ne*ue;if(Math.abs(B)>Number.EPSILON){let Z=Math.sqrt(_),ie=Math.sqrt(ue*ue+A*A),K=ae.x-Ne/Z,Re=ae.y+xe/Z,ge=ne.x-A/ie,ze=ne.y+ue/ie,He=((ge-K)*A-(ze-Re)*ue)/(xe*A-Ne*ue);de=K+xe*He-Q.x,R=Re+Ne*He-Q.y;let ce=de*de+R*R;if(ce<=2)return new oe(de,R);Oe=Math.sqrt(ce/2)}else{let Z=!1;xe>Number.EPSILON?ue>Number.EPSILON&&(Z=!0):xe<-Number.EPSILON?ue<-Number.EPSILON&&(Z=!0):Math.sign(Ne)===Math.sign(A)&&(Z=!0),Z?(de=-Ne,R=xe,Oe=Math.sqrt(_)):(de=xe,R=Ne,Oe=Math.sqrt(_/2))}return new oe(de/Oe,R/Oe)}let se=[];for(let Q=0,ae=P.length,ne=ae-1,de=Q+1;Q<ae;Q++,ne++,de++)ne===ae&&(ne=0),de===ae&&(de=0),se[Q]=ee(P[Q],P[ne],P[de]);let fe=[],ye,j=se.concat();for(let Q=0,ae=L;Q<ae;Q++){let ne=w[Q];ye=[];for(let de=0,R=ne.length,Oe=R-1,xe=de+1;de<R;de++,Oe++,xe++)Oe===R&&(Oe=0),xe===R&&(xe=0),ye[de]=ee(ne[de],ne[Oe],ne[xe]);fe.push(ye),j=j.concat(ye)}let X;if(g===0)X=jn.triangulateShape(P,w);else{let Q=[],ae=[];for(let ne=0;ne<g;ne++){let de=ne/g,R=f*Math.cos(de*Math.PI/2),Oe=m*Math.sin(de*Math.PI/2)+x;for(let xe=0,Ne=P.length;xe<Ne;xe++){let ue=N(P[xe],se[xe],Oe);re(ue.x,ue.y,-R),de===0&&Q.push(ue)}for(let xe=0,Ne=L;xe<Ne;xe++){let ue=w[xe];ye=fe[xe];let A=[];for(let _=0,B=ue.length;_<B;_++){let Z=N(ue[_],ye[_],Oe);re(Z.x,Z.y,-R),de===0&&A.push(Z)}de===0&&ae.push(A)}}X=jn.triangulateShape(Q,ae)}let Ae=X.length,Y=m+x;for(let Q=0;Q<U;Q++){let ae=d?N(F[Q],j[Q],Y):F[Q];y?(I.copy(E.normals[0]).multiplyScalar(ae.x),C.copy(E.binormals[0]).multiplyScalar(ae.y),b.copy(S[0]).add(I).add(C),re(b.x,b.y,b.z)):re(ae.x,ae.y,0)}for(let Q=1;Q<=u;Q++)for(let ae=0;ae<U;ae++){let ne=d?N(F[ae],j[ae],Y):F[ae];y?(I.copy(E.normals[Q]).multiplyScalar(ne.x),C.copy(E.binormals[Q]).multiplyScalar(ne.y),b.copy(S[Q]).add(I).add(C),re(b.x,b.y,b.z)):re(ne.x,ne.y,h/u*Q)}for(let Q=g-1;Q>=0;Q--){let ae=Q/g,ne=f*Math.cos(ae*Math.PI/2),de=m*Math.sin(ae*Math.PI/2)+x;for(let R=0,Oe=P.length;R<Oe;R++){let xe=N(P[R],se[R],de);re(xe.x,xe.y,h+ne)}for(let R=0,Oe=w.length;R<Oe;R++){let xe=w[R];ye=fe[R];for(let Ne=0,ue=xe.length;Ne<ue;Ne++){let A=N(xe[Ne],ye[Ne],de);y?re(A.x,A.y+S[u-1].y,S[u-1].x+ne):re(A.x,A.y,h+ne)}}}O(),W();function O(){let Q=s.length/3;if(d){let ae=0,ne=U*ae;for(let de=0;de<Ae;de++){let R=X[de];le(R[2]+ne,R[1]+ne,R[0]+ne)}ae=u+g*2,ne=U*ae;for(let de=0;de<Ae;de++){let R=X[de];le(R[0]+ne,R[1]+ne,R[2]+ne)}}else{for(let ae=0;ae<Ae;ae++){let ne=X[ae];le(ne[2],ne[1],ne[0])}for(let ae=0;ae<Ae;ae++){let ne=X[ae];le(ne[0]+U*u,ne[1]+U*u,ne[2]+U*u)}}n.addGroup(Q,s.length/3-Q,0)}function W(){let Q=s.length/3,ae=0;te(P,ae),ae+=P.length;for(let ne=0,de=w.length;ne<de;ne++){let R=w[ne];te(R,ae),ae+=R.length}n.addGroup(Q,s.length/3-Q,1)}function te(Q,ae){let ne=Q.length;for(;--ne>=0;){let de=ne,R=ne-1;R<0&&(R=Q.length-1);for(let Oe=0,xe=u+g*2;Oe<xe;Oe++){let Ne=U*Oe,ue=U*(Oe+1),A=ae+de+Ne,_=ae+R+Ne,B=ae+R+ue,Z=ae+de+ue;Se(A,_,B,Z)}}}function re(Q,ae,ne){l.push(Q),l.push(ae),l.push(ne)}function le(Q,ae,ne){We(Q),We(ae),We(ne);let de=s.length/3,R=v.generateTopUV(n,s,de-3,de-2,de-1);Ce(R[0]),Ce(R[1]),Ce(R[2])}function Se(Q,ae,ne,de){We(Q),We(ae),We(de),We(ae),We(ne),We(de);let R=s.length/3,Oe=v.generateSideWallUV(n,s,R-6,R-3,R-2,R-1);Ce(Oe[0]),Ce(Oe[1]),Ce(Oe[3]),Ce(Oe[1]),Ce(Oe[2]),Ce(Oe[3])}function We(Q){s.push(l[Q*3+0]),s.push(l[Q*3+1]),s.push(l[Q*3+2])}function Ce(Q){r.push(Q.x),r.push(Q.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return zg(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new _u[s.type]().fromJSON(s)),new i(n,e.options)}},kg={generateTopUV:function(i,e,t,n,s){let r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],u=e[s*3+1];return[new oe(r,a),new oe(o,l),new oe(c,u)]},generateSideWallUV:function(i,e,t,n,s,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],u=e[n*3+1],h=e[n*3+2],d=e[s*3],f=e[s*3+1],m=e[s*3+2],x=e[r*3],g=e[r*3+1],p=e[r*3+2];return Math.abs(o-u)<Math.abs(a-c)?[new oe(a,1-l),new oe(c,1-h),new oe(d,1-m),new oe(x,1-p)]:[new oe(o,1-l),new oe(u,1-h),new oe(f,1-m),new oe(g,1-p)]}};Ls=class i extends Et{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,h=e/o,d=t/l,f=[],m=[],x=[],g=[];for(let p=0;p<u;p++){let v=p*d-a;for(let S=0;S<c;S++){let y=S*h-r;m.push(y,-v,0),x.push(0,0,1),g.push(S/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<o;v++){let S=v+c*p,y=v+c*(p+1),E=v+1+c*(p+1),C=v+1+c*p;f.push(S,y,C),f.push(y,E,C)}this.setIndex(f),this.setAttribute("position",new ct(m,3)),this.setAttribute("normal",new ct(x,3)),this.setAttribute("uv",new ct(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Aa=class i extends Et{constructor(e=new Vn([new oe(0,.5),new oe(-.5,-.5),new oe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new ct(s,3)),this.setAttribute("normal",new ct(r,3)),this.setAttribute("uv",new ct(a,2));function c(u){let h=s.length/3,d=u.extractPoints(t),f=d.shape,m=d.holes;jn.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){let v=m[g];jn.isClockWise(v)===!0&&(m[g]=v.reverse())}let x=jn.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){let v=m[g];f=f.concat(v)}for(let g=0,p=f.length;g<p;g++){let v=f[g];s.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let g=0,p=x.length;g<p;g++){let v=x[g],S=v[0]+h,y=v[1]+h,E=v[2]+h;n.push(S,y,E),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Vg(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};Ea=class i extends Et{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,u=[],h=new D,d=new D,f=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){let v=[],S=p/n,y=0;p===0&&a===0?y=.5/t:p===n&&l===Math.PI&&(y=-.5/t);for(let E=0;E<=t;E++){let C=E/t;h.x=-e*Math.cos(s+C*r)*Math.sin(a+S*o),h.y=e*Math.cos(a+S*o),h.z=e*Math.sin(s+C*r)*Math.sin(a+S*o),m.push(h.x,h.y,h.z),d.copy(h).normalize(),x.push(d.x,d.y,d.z),g.push(C+y,1-S),v.push(c++)}u.push(v)}for(let p=0;p<n;p++)for(let v=0;v<t;v++){let S=u[p][v+1],y=u[p][v],E=u[p+1][v],C=u[p+1][v+1];(p!==0||a>0)&&f.push(S,y,C),(p!==n-1||l<Math.PI)&&f.push(y,E,C)}this.setIndex(f),this.setAttribute("position",new ct(m,3)),this.setAttribute("normal",new ct(x,3)),this.setAttribute("uv",new ct(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},wa=class extends Jt{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Be(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};ip={clone:Os,merge:en},Gg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Wg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,_n=class extends Jt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gg,this.fragmentShader=Wg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Os(e.uniforms),this.uniformsGroups=Hg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ol=class extends _n{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ti=class extends Jt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Be(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=lc,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},$t=class extends ti{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new oe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ze(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Be(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Be(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Be(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},Ca=class extends Jt{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=lc,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=vl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ll=class extends Jt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=zf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},cl=class extends Jt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};ni=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ul=class extends ni{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:fu,endingEnd:fu}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case pu:r=e,o=2*t-n;break;case mu:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case pu:a=e,l=2*n-t;break;case mu:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),x=m*m,g=x*m,p=-d*g+2*d*x-d*m,v=(1+d)*g+(-1.5-2*d)*x+(-.5+d)*m+1,S=(-1-f)*g+(1.5+f)*x+.5*m,y=f*g-f*x;for(let E=0;E!==o;++E)r[E]=p*a[u+E]+v*a[c+E]+S*a[l+E]+y*a[h+E];return r}},hl=class extends ni{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(s-t),h=1-u;for(let d=0;d!==o;++d)r[d]=a[c+d]*h+a[l+d]*u;return r}},dl=class extends ni{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},fl=class extends ni{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this.settings||this.DefaultSettings_,h=u.inTangents,d=u.outTangents;if(!h||!d){let x=(n-t)/(s-t),g=1-x;for(let p=0;p!==o;++p)r[p]=a[c+p]*g+a[l+p]*x;return r}let f=o*2,m=e-1;for(let x=0;x!==o;++x){let g=a[c+x],p=a[l+x],v=m*f+x*2,S=d[v],y=d[v+1],E=e*f+x*2,C=h[E],I=h[E+1],b=(n-t)/(s-t),M,F,w,V,k;for(let L=0;L<8;L++){M=b*b,F=M*b,w=1-b,V=w*w,k=V*w;let N=k*t+3*V*b*S+3*w*M*C+F*s-n;if(Math.abs(N)<1e-10)break;let U=3*V*(S-t)+6*w*b*(C-S)+3*M*(s-C);if(Math.abs(U)<1e-10)break;b=b-N/U,b=Math.max(0,Math.min(1,b))}r[x]=k*g+3*V*b*y+3*w*M*I+F*p}return r}},un=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Oo(t,this.TimeBufferType),this.values=Oo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Oo(e.times,Array),values:Oo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new dl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new hl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ul(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new fl(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case Ti:t=this.InterpolantFactoryMethodDiscrete;break;case Ai:t=this.InterpolantFactoryMethodLinear;break;case zo:t=this.InterpolantFactoryMethodSmooth;break;case du:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Fe("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ti;case this.InterpolantFactoryMethodLinear:return Ai;case this.InterpolantFactoryMethodSmooth:return zo;case this.InterpolantFactoryMethodBezier:return du}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ge("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ge("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Ge("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ge("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Pm(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Ge("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===zo,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(s)l=!0;else{let h=o*n,d=h-n,f=h+n;for(let m=0;m!==n;++m){let x=t[h+m];if(x!==t[d+m]||x!==t[f+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let h=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[h+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};un.prototype.ValueTypeName="";un.prototype.TimeBufferType=Float32Array;un.prototype.ValueBufferType=Float32Array;un.prototype.DefaultInterpolation=Ai;wi=class extends un{constructor(e,t,n){super(e,t,n)}};wi.prototype.ValueTypeName="bool";wi.prototype.ValueBufferType=Array;wi.prototype.DefaultInterpolation=Ti;wi.prototype.InterpolantFactoryMethodLinear=void 0;wi.prototype.InterpolantFactoryMethodSmooth=void 0;Ra=class extends un{constructor(e,t,n,s){super(e,t,n,s)}};Ra.prototype.ValueTypeName="color";ii=class extends un{constructor(e,t,n,s){super(e,t,n,s)}};ii.prototype.ValueTypeName="number";pl=class extends ni{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let u=c+o;c!==u;c+=4)Ht.slerpFlat(r,0,a,c-o,a,c,l);return r}},si=class extends un{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new pl(this.times,this.values,this.getValueSize(),e)}};si.prototype.ValueTypeName="quaternion";si.prototype.InterpolantFactoryMethodSmooth=void 0;Ci=class extends un{constructor(e,t,n){super(e,t,n)}};Ci.prototype.ValueTypeName="string";Ci.prototype.ValueBufferType=Array;Ci.prototype.DefaultInterpolation=Ti;Ci.prototype.InterpolantFactoryMethodLinear=void 0;Ci.prototype.InterpolantFactoryMethodSmooth=void 0;ri=class extends un{constructor(e,t,n,s){super(e,t,n,s)}};ri.prototype.ValueTypeName="vector";Ia=class{constructor(e="",t=-1,n=[],s=kf){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=wn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push($g(n[a]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(un.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);let u=Xg(l);l=uf(l,1,u),c=uf(c,1,u),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new ii(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],u=c.name.match(r);if(u&&u.length>1){let h=u[1],d=s[h];d||(s[h]=d=[]),d.push(c)}}let a=[];for(let o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}static parseAnimation(e,t){if(Fe("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return Ge("AnimationClip: No animation in JSONLoader data."),null;let n=function(h,d,f,m,x){if(f.length!==0){let g=[],p=[];sp(f,g,p,m),g.length!==0&&x.push(new h(d,g,p))}},s=[],r=e.name||"default",a=e.fps||30,o=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let h=0;h<c.length;h++){let d=c[h].keys;if(!(!d||d.length===0))if(d[0].morphTargets){let f={},m;for(m=0;m<d.length;m++)if(d[m].morphTargets)for(let x=0;x<d[m].morphTargets.length;x++)f[d[m].morphTargets[x]]=-1;for(let x in f){let g=[],p=[];for(let v=0;v!==d[m].morphTargets.length;++v){let S=d[m];g.push(S.time),p.push(S.morphTarget===x?1:0)}s.push(new ii(".morphTargetInfluence["+x+"]",g,p))}l=f.length*a}else{let f=".bones["+t[h].name+"]";n(ri,f+".position",d,"pos",s),n(si,f+".quaternion",d,"rot",s),n(ri,f+".scale",d,"scl",s)}}return s.length===0?null:new this(r,l,s,o)}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};Zn={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(hf(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!hf(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};ml=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let f=c[h],m=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},rp=new ml,ai=class{constructor(e){this.manager=e!==void 0?e:rp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ai.DEFAULT_MATERIAL_NAME="__DEFAULT";Mi={},Mu=class extends Error{constructor(e,t){super(e),this.response=t}},wr=class extends ai{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Zn.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Mi[e]!==void 0){Mi[e].push({onLoad:t,onProgress:n,onError:s});return}Mi[e]=[],Mi[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Fe("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=Mi[e],h=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,m=f!==0,x=0,g=new ReadableStream({start(p){v();function v(){h.read().then(({done:S,value:y})=>{if(S)p.close();else{x+=y.byteLength;let E=new ProgressEvent("progress",{lengthComputable:m,loaded:x,total:f});for(let C=0,I=u.length;C<I;C++){let b=u[C];b.onProgress&&b.onProgress(E)}p.enqueue(y),v()}},S=>{p.error(S)})}}});return new Response(g)}else throw new Mu(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{let h=/charset="?([^;"\s]*)"?/i.exec(o),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(m=>f.decode(m))}}}).then(c=>{Zn.add(`file:${e}`,c);let u=Mi[e];delete Mi[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=Mi[e];if(u===void 0)throw this.manager.itemError(e),c;delete Mi[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},ur=new WeakMap,gl=class extends ai{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=Zn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let h=ur.get(a);h===void 0&&(h=[],ur.set(a,h)),h.push({onLoad:t,onError:s})}return a}let o=mr("img");function l(){u(),t&&t(this);let h=ur.get(this)||[];for(let d=0;d<h.length;d++){let f=h[d];f.onLoad&&f.onLoad(this)}ur.delete(this),r.manager.itemEnd(e)}function c(h){u(),s&&s(h),Zn.remove(`image:${e}`);let d=ur.get(this)||[];for(let f=0;f<d.length;f++){let m=d[f];m.onError&&m.onError(h)}ur.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Zn.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}},Pa=class extends ai{constructor(e){super(e)}load(e,t,n,s){let r=new Nt,a=new gl(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},Ds=class extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Be(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},La=class extends Ds{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Be(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},cu=new Xe,df=new D,ff=new D,Da=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new oe(512,512),this.mapType=hn,this.map=null,this.mapPass=null,this.matrix=new Xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Sr,this._frameExtents=new oe(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;df.setFromMatrixPosition(e.matrixWorld),t.position.copy(df),ff.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ff),t.updateMatrixWorld(),cu.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(cu,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===pr||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(cu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Bo=new D,ko=new Ht,Yn=new D,Na=class extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xe,this.projectionMatrix=new Xe,this.projectionMatrixInverse=new Xe,this.coordinateSystem=On,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Bo,ko,Yn),Yn.x===1&&Yn.y===1&&Yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bo,ko,Yn.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Bo,ko,Yn),Yn.x===1&&Yn.y===1&&Yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bo,ko,Yn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},qi=new D,pf=new oe,mf=new oe,Rt=class extends Na{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ts*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ta*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ts*2*Math.atan(Math.tan(ta*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){qi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(qi.x,qi.y).multiplyScalar(-e/qi.z),qi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(qi.x,qi.y).multiplyScalar(-e/qi.z)}getViewSize(e,t){return this.getViewBounds(e,pf,mf),t.subVectors(mf,pf)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ta*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Su=class extends Da{constructor(){super(new Rt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Ts*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},Ua=class extends Ds{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Su}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Tu=class extends Da{constructor(){super(new Rt(90,1,.5,500)),this.isPointLightShadow=!0}},Ns=class extends Ds{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Tu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},oi=class extends Na{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Au=class extends Da{constructor(){super(new oi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ts=class extends Ds{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new Au}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Ri=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},uu=new WeakMap,Fa=class extends ai{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Fe("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Fe("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=Zn.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{if(uu.has(a)===!0)s&&s(uu.get(a)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Zn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),uu.set(l,c),Zn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Zn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},hr=-90,dr=1,xl=class extends _t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Rt(hr,dr,e,t);s.layers=this.layers,this.add(s);let r=new Rt(hr,dr,e,t);r.layers=this.layers,this.add(r);let a=new Rt(hr,dr,e,t);a.layers=this.layers,this.add(a);let o=new Rt(hr,dr,e,t);o.layers=this.layers,this.add(o);let l=new Rt(hr,dr,e,t);l.layers=this.layers,this.add(l);let c=new Rt(hr,dr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===On)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===pr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},_l=class extends Rt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ju="\\[\\]\\.:\\/",Yg=new RegExp("["+ju+"]","g"),Zu="[^"+ju+"]",jg="[^"+ju.replace("\\.","")+"]",Zg=/((?:WC+[\/:])*)/.source.replace("WC",Zu),Kg=/(WCOD+)?/.source.replace("WCOD",jg),Jg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Zu),Qg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Zu),e0=new RegExp("^"+Zg+Kg+Jg+Qg+"$"),t0=["material","materials","bones","map"],Eu=class{constructor(e,t,n){let s=n||st.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},st=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Yg,"")}static parseTrackName(e){let t=e0.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);t0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Fe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ge("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ge("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ge("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ge("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ge("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ge("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ge("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Ge("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ge("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ge("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};st.Composite=Eu;st.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};st.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};st.prototype.GetterByBindingType=[st.prototype._getValue_direct,st.prototype._getValue_array,st.prototype._getValue_arrayElement,st.prototype._getValue_toArray];st.prototype.SetterByBindingTypeAndVersioning=[[st.prototype._setValue_direct,st.prototype._setValue_direct_setNeedsUpdate,st.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[st.prototype._setValue_array,st.prototype._setValue_array_setNeedsUpdate,st.prototype._setValue_array_setMatrixWorldNeedsUpdate],[st.prototype._setValue_arrayElement,st.prototype._setValue_arrayElement_setNeedsUpdate,st.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[st.prototype._setValue_fromArray,st.prototype._setValue_fromArray_setNeedsUpdate,st.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];Xb=new Float32Array(1),Cr=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ze(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ze(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}},Oa=class extends ws{constructor(e=10,t=10,n=4473924,s=8947848){n=new Be(n),s=new Be(s);let r=t/2,a=e/t,o=e/2,l=[],c=[];for(let d=0,f=0,m=-o;d<=t;d++,m+=a){l.push(-o,0,m,o,0,m),l.push(m,0,-o,m,0,o);let x=d===r?n:s;x.toArray(c,f),f+=3,x.toArray(c,f),f+=3,x.toArray(c,f),f+=3,x.toArray(c,f),f+=3}let u=new Et;u.setAttribute("position",new ct(l,3)),u.setAttribute("color",new ct(c,3));let h=new Ji({vertexColors:!0,toneMapped:!1});super(u,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}},Ba=class extends ws{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Et;s.setAttribute("position",new ct(t,3)),s.setAttribute("color",new ct(n,3));let r=new Ji({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){let s=new Be,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}},ka=class extends Qn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Fe("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"183"}}));typeof window<"u"&&(window.__THREE__?Fe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="183")});function Cp(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function i0(i){let e=new WeakMap;function t(o,l){let c=o.array,u=o.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){let u=l.array,h=l.updateRanges;if(i.bindBuffer(c,o),h.length===0)i.bufferSubData(c,0,u);else{h.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<h.length;f++){let m=h[d],x=h[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,h[d]=x)}h.length=d+1;for(let f=0,m=h.length;f<m;f++){let x=h[f];i.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}function B_(i,e,t,n,s,r){let a=new Be(0),o=s===!0?0:1,l,c,u=null,h=0,d=null;function f(v){let S=v.isScene===!0?v.background:null;if(S&&S.isTexture){let y=v.backgroundBlurriness>0;S=e.get(S,y)}return S}function m(v){let S=!1,y=f(v);y===null?g(a,o):y&&y.isColor&&(g(y,1),S=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||S)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(v,S){let y=f(S);y&&(y.isCubeTexture||y.mapping===Ha)?(c===void 0&&(c=new ft(new zn(1,1,1),new _n({name:"BackgroundCubeMaterial",uniforms:Os(hi.backgroundCube.uniforms),vertexShader:hi.backgroundCube.vertexShader,fragmentShader:hi.backgroundCube.fragmentShader,side:Yt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,C,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),Bs.copy(S.backgroundRotation),Bs.x*=-1,Bs.y*=-1,Bs.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Bs.y*=-1,Bs.z*=-1),c.material.uniforms.envMap.value=y,c.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(O_.makeRotationFromEuler(Bs)),c.material.toneMapped=tt.getTransfer(y.colorSpace)!==at,(u!==y||h!==y.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,h=y.version,d=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new ft(new Ls(2,2),new _n({name:"BackgroundMaterial",uniforms:Os(hi.background.uniforms),vertexShader:hi.background.vertexShader,fragmentShader:hi.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=tt.getTransfer(y.colorSpace)!==at,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||h!==y.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=y,h=y.version,d=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function g(v,S){v.getRGB(hc,Yu(i)),t.buffers.color.setClear(hc.r,hc.g,hc.b,S,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,S=1){a.set(v),o=S,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,g(a,o)},render:m,addToRenderList:x,dispose:p}}function k_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(w,V,k,L,P){let N=!1,U=h(w,L,k,V);r!==U&&(r=U,c(r.object)),N=f(w,L,k,P),N&&m(w,L,k,P),P!==null&&e.update(P,i.ELEMENT_ARRAY_BUFFER),(N||a)&&(a=!1,y(w,V,k,L),P!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(P).buffer))}function l(){return i.createVertexArray()}function c(w){return i.bindVertexArray(w)}function u(w){return i.deleteVertexArray(w)}function h(w,V,k,L){let P=L.wireframe===!0,N=n[V.id];N===void 0&&(N={},n[V.id]=N);let U=w.isInstancedMesh===!0?w.id:0,ee=N[U];ee===void 0&&(ee={},N[U]=ee);let se=ee[k.id];se===void 0&&(se={},ee[k.id]=se);let fe=se[P];return fe===void 0&&(fe=d(l()),se[P]=fe),fe}function d(w){let V=[],k=[],L=[];for(let P=0;P<t;P++)V[P]=0,k[P]=0,L[P]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:k,attributeDivisors:L,object:w,attributes:{},index:null}}function f(w,V,k,L){let P=r.attributes,N=V.attributes,U=0,ee=k.getAttributes();for(let se in ee)if(ee[se].location>=0){let ye=P[se],j=N[se];if(j===void 0&&(se==="instanceMatrix"&&w.instanceMatrix&&(j=w.instanceMatrix),se==="instanceColor"&&w.instanceColor&&(j=w.instanceColor)),ye===void 0||ye.attribute!==j||j&&ye.data!==j.data)return!0;U++}return r.attributesNum!==U||r.index!==L}function m(w,V,k,L){let P={},N=V.attributes,U=0,ee=k.getAttributes();for(let se in ee)if(ee[se].location>=0){let ye=N[se];ye===void 0&&(se==="instanceMatrix"&&w.instanceMatrix&&(ye=w.instanceMatrix),se==="instanceColor"&&w.instanceColor&&(ye=w.instanceColor));let j={};j.attribute=ye,ye&&ye.data&&(j.data=ye.data),P[se]=j,U++}r.attributes=P,r.attributesNum=U,r.index=L}function x(){let w=r.newAttributes;for(let V=0,k=w.length;V<k;V++)w[V]=0}function g(w){p(w,0)}function p(w,V){let k=r.newAttributes,L=r.enabledAttributes,P=r.attributeDivisors;k[w]=1,L[w]===0&&(i.enableVertexAttribArray(w),L[w]=1),P[w]!==V&&(i.vertexAttribDivisor(w,V),P[w]=V)}function v(){let w=r.newAttributes,V=r.enabledAttributes;for(let k=0,L=V.length;k<L;k++)V[k]!==w[k]&&(i.disableVertexAttribArray(k),V[k]=0)}function S(w,V,k,L,P,N,U){U===!0?i.vertexAttribIPointer(w,V,k,P,N):i.vertexAttribPointer(w,V,k,L,P,N)}function y(w,V,k,L){x();let P=L.attributes,N=k.getAttributes(),U=V.defaultAttributeValues;for(let ee in N){let se=N[ee];if(se.location>=0){let fe=P[ee];if(fe===void 0&&(ee==="instanceMatrix"&&w.instanceMatrix&&(fe=w.instanceMatrix),ee==="instanceColor"&&w.instanceColor&&(fe=w.instanceColor)),fe!==void 0){let ye=fe.normalized,j=fe.itemSize,X=e.get(fe);if(X===void 0)continue;let Ae=X.buffer,Y=X.type,O=X.bytesPerElement,W=Y===i.INT||Y===i.UNSIGNED_INT||fe.gpuType===Sl;if(fe.isInterleavedBufferAttribute){let te=fe.data,re=te.stride,le=fe.offset;if(te.isInstancedInterleavedBuffer){for(let Se=0;Se<se.locationSize;Se++)p(se.location+Se,te.meshPerAttribute);w.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Se=0;Se<se.locationSize;Se++)g(se.location+Se);i.bindBuffer(i.ARRAY_BUFFER,Ae);for(let Se=0;Se<se.locationSize;Se++)S(se.location+Se,j/se.locationSize,Y,ye,re*O,(le+j/se.locationSize*Se)*O,W)}else{if(fe.isInstancedBufferAttribute){for(let te=0;te<se.locationSize;te++)p(se.location+te,fe.meshPerAttribute);w.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let te=0;te<se.locationSize;te++)g(se.location+te);i.bindBuffer(i.ARRAY_BUFFER,Ae);for(let te=0;te<se.locationSize;te++)S(se.location+te,j/se.locationSize,Y,ye,j*O,j/se.locationSize*te*O,W)}}else if(U!==void 0){let ye=U[ee];if(ye!==void 0)switch(ye.length){case 2:i.vertexAttrib2fv(se.location,ye);break;case 3:i.vertexAttrib3fv(se.location,ye);break;case 4:i.vertexAttrib4fv(se.location,ye);break;default:i.vertexAttrib1fv(se.location,ye)}}}}v()}function E(){M();for(let w in n){let V=n[w];for(let k in V){let L=V[k];for(let P in L){let N=L[P];for(let U in N)u(N[U].object),delete N[U];delete L[P]}}delete n[w]}}function C(w){if(n[w.id]===void 0)return;let V=n[w.id];for(let k in V){let L=V[k];for(let P in L){let N=L[P];for(let U in N)u(N[U].object),delete N[U];delete L[P]}}delete n[w.id]}function I(w){for(let V in n){let k=n[V];for(let L in k){let P=k[L];if(P[w.id]===void 0)continue;let N=P[w.id];for(let U in N)u(N[U].object),delete N[U];delete P[w.id]}}}function b(w){for(let V in n){let k=n[V],L=w.isInstancedMesh===!0?w.id:0,P=k[L];if(P!==void 0){for(let N in P){let U=P[N];for(let ee in U)u(U[ee].object),delete U[ee];delete P[N]}delete k[L],Object.keys(k).length===0&&delete n[V]}}}function M(){F(),a=!0,r!==s&&(r=s,c(r.object))}function F(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:M,resetDefaultState:F,dispose:E,releaseStatesOfGeometry:C,releaseStatesOfObject:b,releaseStatesOfProgram:I,initAttributes:x,enableAttribute:g,disableUnusedAttributes:v}}function z_(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function o(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let f=0;for(let m=0;m<h;m++)f+=u[m];t.update(f,n,1)}function l(c,u,h,d){if(h===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)a(c[m],u[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let m=0;for(let x=0;x<h;x++)m+=u[x]*d[x];t.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function V_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let I=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(I){return!(I!==sn&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(I){let b=I===ci&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==hn&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==vn&&!b)}function l(I){if(I==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(Fe("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=i.getParameter(i.MAX_SAMPLES),C=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:v,maxVaryings:S,maxFragmentUniforms:y,maxSamples:E,samples:C}}function H_(i){let e=this,t=null,n=0,s=!1,r=!1,a=new En,o=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let f=h.length!==0||d||n!==0||s;return s=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){let m=h.clippingPlanes,x=h.clipIntersection,g=h.clipShadows,p=i.get(h);if(!s||m===null||m.length===0||r&&!g)r?u(null):c();else{let v=r?0:n,S=v*4,y=p.clippingState||null;l.value=y,y=u(m,d,S,f);for(let E=0;E!==S;++E)y[E]=t[E];p.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,f,m){let x=h!==null?h.length:0,g=null;if(x!==0){if(g=l.value,m!==!0||g===null){let p=f+x*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<p)&&(g=new Float32Array(p));for(let S=0,y=f;S!==x;++S,y+=4)a.copy(h[S]).applyMatrix4(v,o),a.normal.toArray(g,y),g[y+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function X_(i){let e=[],t=[],n=[],s=i,r=i-os+1+ap.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let l=1/o;a>i-os?l=ap[a-i+os-1]:a===0&&(l=0),t.push(l);let c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,m=6,x=3,g=2,p=1,v=new Float32Array(x*m*f),S=new Float32Array(g*m*f),y=new Float32Array(p*m*f);for(let C=0;C<f;C++){let I=C%3*2/3-1,b=C>2?0:-1,M=[I,b,0,I+2/3,b,0,I+2/3,b+1,0,I,b,0,I+2/3,b+1,0,I,b+1,0];v.set(M,x*m*C),S.set(d,g*m*C);let F=[C,C,C,C,C,C];y.set(F,p*m*C)}let E=new Et;E.setAttribute("position",new dt(v,x)),E.setAttribute("uv",new dt(S,g)),E.setAttribute("faceIndex",new dt(y,p)),n.push(new ft(E,null)),s>os&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function lp(i,e,t){let n=new gn(i,e,t);return n.texture.mapping=Ha,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Nr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function q_(i,e,t){return new _n({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:G_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:mc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function $_(i,e,t){let n=new Float32Array(zs),s=new D(0,1,0);return new _n({name:"SphericalGaussianBlur",defines:{n:zs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function cp(){return new _n({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function up(){return new _n({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function mc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Y_(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===bl||f===Ml)if(e.has(d)){let m=e.get(d).texture;return o(m,d.mapping)}else{let m=d.image;if(m&&m.height>0){let x=new fc(m.height);return x.fromEquirectangularTexture(i,d),e.set(d,x),d.addEventListener("dispose",c),o(x.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){let f=d.mapping,m=f===bl||f===Ml,x=f===ss||f===Us;if(m||x){let g=t.get(d),p=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new Fr(i)),g=m?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{let v=d.image;return m&&v&&v.height>0||x&&v&&l(v)?(n===null&&(n=new Fr(i)),g=m?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",u),g.texture):null}}}return d}function o(d,f){return f===bl?d.mapping=ss:f===Ml&&(d.mapping=Us),d}function l(d){let f=0,m=6;for(let x=0;x<m;x++)d[x]!==void 0&&f++;return f===m}function c(d){let f=d.target;f.removeEventListener("dispose",c);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function u(d){let f=d.target;f.removeEventListener("dispose",u);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function h(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:h}}function j_(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&oa("WebGLRenderer: "+n+" extension not supported."),s}}}function Z_(i,e,t,n){let s={},r=new WeakMap;function a(h){let d=h.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(h){let d=h.attributes;for(let f in d)e.update(d[f],i.ARRAY_BUFFER)}function c(h){let d=[],f=h.index,m=h.attributes.position,x=0;if(m===void 0)return;if(f!==null){let v=f.array;x=f.version;for(let S=0,y=v.length;S<y;S+=3){let E=v[S+0],C=v[S+1],I=v[S+2];d.push(E,C,C,I,I,E)}}else{let v=m.array;x=m.version;for(let S=0,y=v.length/3-1;S<y;S+=3){let E=S+0,C=S+1,I=S+2;d.push(E,C,C,I,I,E)}}let g=new(m.count>=65535?ha:ua)(d,1);g.version=x;let p=r.get(h);p&&e.remove(p),r.set(h,g)}function u(h){let d=r.get(h);if(d){let f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function K_(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*a),t.update(f,n,1)}function c(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,r,d*a,m),t.update(f,n,m))}function u(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];t.update(g,n,1)}function h(d,f,m,x){if(m===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/a,f[p],x[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,x,0,m);let p=0;for(let v=0;v<m;v++)p+=f[v]*x[v];t.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function J_(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Ge("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Q_(i,e,t){let n=new WeakMap,s=new xt;function r(a,o,l){let c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0,d=n.get(o);if(d===void 0||d.count!==h){let M=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],v=o.morphAttributes.color||[],S=0;f===!0&&(S=1),m===!0&&(S=2),x===!0&&(S=3);let y=o.attributes.position.count*S,E=1;y>e.maxTextureSize&&(E=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let C=new Float32Array(y*E*4*h),I=new la(C,y,E,h);I.type=vn,I.needsUpdate=!0;let b=S*4;for(let F=0;F<h;F++){let w=g[F],V=p[F],k=v[F],L=y*E*4*F;for(let P=0;P<w.count;P++){let N=P*b;f===!0&&(s.fromBufferAttribute(w,P),C[L+N+0]=s.x,C[L+N+1]=s.y,C[L+N+2]=s.z,C[L+N+3]=0),m===!0&&(s.fromBufferAttribute(V,P),C[L+N+4]=s.x,C[L+N+5]=s.y,C[L+N+6]=s.z,C[L+N+7]=0),x===!0&&(s.fromBufferAttribute(k,P),C[L+N+8]=s.x,C[L+N+9]=s.y,C[L+N+10]=s.z,C[L+N+11]=k.itemSize===4?s.w:1)}}d={count:h,texture:I,size:new oe(y,E)},n.set(o,d),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let m=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function ey(i,e,t,n,s){let r=new WeakMap;function a(c){let u=s.render.frame,h=c.geometry,d=e.get(c,h);if(r.get(d)!==u&&(e.update(d),r.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return d}function o(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}function ny(i,e,t,n,s){let r=new gn(e,t,{type:i,depthBuffer:n,stencilBuffer:s}),a=new gn(e,t,{type:ci,depthBuffer:!1,stencilBuffer:!1}),o=new Et;o.setAttribute("position",new ct([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new ct([0,2,0,0,2,0],2));let l=new ol({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new ft(o,l),u=new oi(-1,1,1,-1,0,1),h=null,d=null,f=!1,m,x=null,g=[],p=!1;this.setSize=function(v,S){r.setSize(v,S),a.setSize(v,S);for(let y=0;y<g.length;y++){let E=g[y];E.setSize&&E.setSize(v,S)}},this.setEffects=function(v){g=v,p=g.length>0&&g[0].isRenderPass===!0;let S=r.width,y=r.height;for(let E=0;E<g.length;E++){let C=g[E];C.setSize&&C.setSize(S,y)}},this.begin=function(v,S){if(f||v.toneMapping===Hn&&g.length===0)return!1;if(x=S,S!==null){let y=S.width,E=S.height;(r.width!==y||r.height!==E)&&this.setSize(y,E)}return p===!1&&v.setRenderTarget(r),m=v.toneMapping,v.toneMapping=Hn,!0},this.hasRenderPass=function(){return p},this.end=function(v,S){v.toneMapping=m,f=!0;let y=r,E=a;for(let C=0;C<g.length;C++){let I=g[C];if(I.enabled!==!1&&(I.render(v,E,y,S),I.needsSwap!==!1)){let b=y;y=E,E=b}}if(h!==v.outputColorSpace||d!==v.toneMapping){h=v.outputColorSpace,d=v.toneMapping,l.defines={},tt.getTransfer(h)===at&&(l.defines.SRGB_TRANSFER="");let C=ty[d];C&&(l.defines[C]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=y.texture,v.setRenderTarget(x),v.render(c,u),x=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}function Or(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=hp[s];if(r===void 0&&(r=new Float32Array(s),hp[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Ut(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ft(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function gc(i,e){let t=dp[e];t===void 0&&(t=new Int32Array(e),dp[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function iy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function sy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2fv(this.addr,e),Ft(t,e)}}function ry(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;i.uniform3fv(this.addr,e),Ft(t,e)}}function ay(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4fv(this.addr,e),Ft(t,e)}}function oy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,n))return;mp.set(n),i.uniformMatrix2fv(this.addr,!1,mp),Ft(t,n)}}function ly(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,n))return;pp.set(n),i.uniformMatrix3fv(this.addr,!1,pp),Ft(t,n)}}function cy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,n))return;fp.set(n),i.uniformMatrix4fv(this.addr,!1,fp),Ft(t,n)}}function uy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function hy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2iv(this.addr,e),Ft(t,e)}}function dy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;i.uniform3iv(this.addr,e),Ft(t,e)}}function fy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4iv(this.addr,e),Ft(t,e)}}function py(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function my(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2uiv(this.addr,e),Ft(t,e)}}function gy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;i.uniform3uiv(this.addr,e),Ft(t,e)}}function xy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4uiv(this.addr,e),Ft(t,e)}}function _y(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(rh.compareFunction=t.isReversedDepthBuffer()?uc:cc,r=rh):r=Rp,t.setTexture2D(e||r,s)}function yy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Pp,s)}function vy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Lp,s)}function by(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Ip,s)}function My(i){switch(i){case 5126:return iy;case 35664:return sy;case 35665:return ry;case 35666:return ay;case 35674:return oy;case 35675:return ly;case 35676:return cy;case 5124:case 35670:return uy;case 35667:case 35671:return hy;case 35668:case 35672:return dy;case 35669:case 35673:return fy;case 5125:return py;case 36294:return my;case 36295:return gy;case 36296:return xy;case 35678:case 36198:case 36298:case 36306:case 35682:return _y;case 35679:case 36299:case 36307:return yy;case 35680:case 36300:case 36308:case 36293:return vy;case 36289:case 36303:case 36311:case 36292:return by}}function Sy(i,e){i.uniform1fv(this.addr,e)}function Ty(i,e){let t=Or(e,this.size,2);i.uniform2fv(this.addr,t)}function Ay(i,e){let t=Or(e,this.size,3);i.uniform3fv(this.addr,t)}function Ey(i,e){let t=Or(e,this.size,4);i.uniform4fv(this.addr,t)}function wy(i,e){let t=Or(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Cy(i,e){let t=Or(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ry(i,e){let t=Or(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Iy(i,e){i.uniform1iv(this.addr,e)}function Py(i,e){i.uniform2iv(this.addr,e)}function Ly(i,e){i.uniform3iv(this.addr,e)}function Dy(i,e){i.uniform4iv(this.addr,e)}function Ny(i,e){i.uniform1uiv(this.addr,e)}function Uy(i,e){i.uniform2uiv(this.addr,e)}function Fy(i,e){i.uniform3uiv(this.addr,e)}function Oy(i,e){i.uniform4uiv(this.addr,e)}function By(i,e,t){let n=this.cache,s=e.length,r=gc(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ft(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=rh:a=Rp;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function ky(i,e,t){let n=this.cache,s=e.length,r=gc(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ft(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Pp,r[a])}function zy(i,e,t){let n=this.cache,s=e.length,r=gc(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ft(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Lp,r[a])}function Vy(i,e,t){let n=this.cache,s=e.length,r=gc(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ft(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Ip,r[a])}function Hy(i){switch(i){case 5126:return Sy;case 35664:return Ty;case 35665:return Ay;case 35666:return Ey;case 35674:return wy;case 35675:return Cy;case 35676:return Ry;case 5124:case 35670:return Iy;case 35667:case 35671:return Py;case 35668:case 35672:return Ly;case 35669:case 35673:return Dy;case 5125:return Ny;case 36294:return Uy;case 36295:return Fy;case 36296:return Oy;case 35678:case 36198:case 36298:case 36306:case 35682:return By;case 35679:case 36299:case 36307:return ky;case 35680:case 36300:case 36308:case 36293:return zy;case 36289:case 36303:case 36311:case 36292:return Vy}}function gp(i,e){i.seq.push(e),i.map[e.id]=e}function Gy(i,e,t){let n=i.name,s=n.length;for(ih.lastIndex=0;;){let r=ih.exec(n),a=ih.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){gp(t,c===void 0?new ah(o,i,e):new oh(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new lh(o),gp(t,h)),t=h}}}function xp(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}function qy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function $y(i){tt._getMatrix(_p,tt.workingColorSpace,i);let e=`mat3( ${_p.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(i)){case ra:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return Fe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function yp(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+qy(i.getShaderSource(e),o)}else return r}function Yy(i,e){let t=$y(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Zy(i,e){let t=jy[e];return t===void 0?(Fe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Ky(){tt.getLuminanceCoefficients(dc);let i=dc.x.toFixed(4),e=dc.y.toFixed(4),t=dc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Jy(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Za).join(`
`)}function Qy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ev(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Za(i){return i!==""}function vp(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bp(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function ch(i){return i.replace(tv,iv)}function iv(i,e){let t=Ke[e];if(t===void 0){let n=nv.get(e);if(n!==void 0)t=Ke[n],Fe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ch(t)}function Mp(i){return i.replace(sv,rv)}function rv(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sp(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function ov(i){return av[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}function cv(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":lv[i.envMapMode]||"ENVMAP_TYPE_CUBE"}function hv(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":uv[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}function fv(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":dv[i.combine]||"ENVMAP_BLENDING_NONE"}function pv(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function mv(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=ov(t),c=cv(t),u=hv(t),h=fv(t),d=pv(t),f=Jy(t),m=Qy(r),x=s.createProgram(),g,p,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Za).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Za).join(`
`),p.length>0&&(p+=`
`)):(g=[Sp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Za).join(`
`),p=[Sp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Hn?"#define TONE_MAPPING":"",t.toneMapping!==Hn?Ke.tonemapping_pars_fragment:"",t.toneMapping!==Hn?Zy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,Yy("linearToOutputTexel",t.outputColorSpace),Ky(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Za).join(`
`)),a=ch(a),a=vp(a,t),a=bp(a,t),o=ch(o),o=vp(o,t),o=bp(o,t),a=Mp(a),o=Mp(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Xu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Xu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=v+g+a,y=v+p+o,E=xp(s,s.VERTEX_SHADER,S),C=xp(s,s.FRAGMENT_SHADER,y);s.attachShader(x,E),s.attachShader(x,C),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function I(w){if(i.debug.checkShaderErrors){let V=s.getProgramInfoLog(x)||"",k=s.getShaderInfoLog(E)||"",L=s.getShaderInfoLog(C)||"",P=V.trim(),N=k.trim(),U=L.trim(),ee=!0,se=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(ee=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,E,C);else{let fe=yp(s,E,"vertex"),ye=yp(s,C,"fragment");Ge("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+P+`
`+fe+`
`+ye)}else P!==""?Fe("WebGLProgram: Program Info Log:",P):(N===""||U==="")&&(se=!1);se&&(w.diagnostics={runnable:ee,programLog:P,vertexShader:{log:N,prefix:g},fragmentShader:{log:U,prefix:p}})}s.deleteShader(E),s.deleteShader(C),b=new Ur(s,x),M=ev(s,x)}let b;this.getUniforms=function(){return b===void 0&&I(this),b};let M;this.getAttributes=function(){return M===void 0&&I(this),M};let F=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return F===!1&&(F=s.getProgramParameter(x,Wy)),F},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Xy++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=C,this}function xv(i,e,t,n,s,r){let a=new ca,o=new uh,l=new Set,c=[],u=new Map,h=n.logarithmicDepthBuffer,d=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(b){return l.add(b),b===0?"uv":`uv${b}`}function x(b,M,F,w,V){let k=w.fog,L=V.geometry,P=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?w.environment:null,N=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap,U=e.get(b.envMap||P,N),ee=U&&U.mapping===Ha?U.image.height:null,se=f[b.type];b.precision!==null&&(d=n.getMaxPrecision(b.precision),d!==b.precision&&Fe("WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));let fe=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,ye=fe!==void 0?fe.length:0,j=0;L.morphAttributes.position!==void 0&&(j=1),L.morphAttributes.normal!==void 0&&(j=2),L.morphAttributes.color!==void 0&&(j=3);let X,Ae,Y,O;if(se){let ot=hi[se];X=ot.vertexShader,Ae=ot.fragmentShader}else X=b.vertexShader,Ae=b.fragmentShader,o.update(b),Y=o.getVertexShaderID(b),O=o.getFragmentShaderID(b);let W=i.getRenderTarget(),te=i.state.buffers.depth.getReversed(),re=V.isInstancedMesh===!0,le=V.isBatchedMesh===!0,Se=!!b.map,We=!!b.matcap,Ce=!!U,Q=!!b.aoMap,ae=!!b.lightMap,ne=!!b.bumpMap,de=!!b.normalMap,R=!!b.displacementMap,Oe=!!b.emissiveMap,xe=!!b.metalnessMap,Ne=!!b.roughnessMap,ue=b.anisotropy>0,A=b.clearcoat>0,_=b.dispersion>0,B=b.iridescence>0,Z=b.sheen>0,ie=b.transmission>0,K=ue&&!!b.anisotropyMap,Re=A&&!!b.clearcoatMap,ge=A&&!!b.clearcoatNormalMap,ze=A&&!!b.clearcoatRoughnessMap,He=B&&!!b.iridescenceMap,ce=B&&!!b.iridescenceThicknessMap,pe=Z&&!!b.sheenColorMap,Ie=Z&&!!b.sheenRoughnessMap,Le=!!b.specularMap,Te=!!b.specularColorMap,Je=!!b.specularIntensityMap,z=ie&&!!b.transmissionMap,_e=ie&&!!b.thicknessMap,me=!!b.gradientMap,we=!!b.alphaMap,he=b.alphaTest>0,J=!!b.alphaHash,Pe=!!b.extensions,$e=Hn;b.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&($e=i.toneMapping);let gt={shaderID:se,shaderType:b.type,shaderName:b.name,vertexShader:X,fragmentShader:Ae,defines:b.defines,customVertexShaderID:Y,customFragmentShaderID:O,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:le,batchingColor:le&&V._colorsTexture!==null,instancing:re,instancingColor:re&&V.instanceColor!==null,instancingMorph:re&&V.morphTexture!==null,outputColorSpace:W===null?i.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:qt,alphaToCoverage:!!b.alphaToCoverage,map:Se,matcap:We,envMap:Ce,envMapMode:Ce&&U.mapping,envMapCubeUVHeight:ee,aoMap:Q,lightMap:ae,bumpMap:ne,normalMap:de,displacementMap:R,emissiveMap:Oe,normalMapObjectSpace:de&&b.normalMapType===Vf,normalMapTangentSpace:de&&b.normalMapType===lc,metalnessMap:xe,roughnessMap:Ne,anisotropy:ue,anisotropyMap:K,clearcoat:A,clearcoatMap:Re,clearcoatNormalMap:ge,clearcoatRoughnessMap:ze,dispersion:_,iridescence:B,iridescenceMap:He,iridescenceThicknessMap:ce,sheen:Z,sheenColorMap:pe,sheenRoughnessMap:Ie,specularMap:Le,specularColorMap:Te,specularIntensityMap:Je,transmission:ie,transmissionMap:z,thicknessMap:_e,gradientMap:me,opaque:b.transparent===!1&&b.blending===Ms&&b.alphaToCoverage===!1,alphaMap:we,alphaTest:he,alphaHash:J,combine:b.combine,mapUv:Se&&m(b.map.channel),aoMapUv:Q&&m(b.aoMap.channel),lightMapUv:ae&&m(b.lightMap.channel),bumpMapUv:ne&&m(b.bumpMap.channel),normalMapUv:de&&m(b.normalMap.channel),displacementMapUv:R&&m(b.displacementMap.channel),emissiveMapUv:Oe&&m(b.emissiveMap.channel),metalnessMapUv:xe&&m(b.metalnessMap.channel),roughnessMapUv:Ne&&m(b.roughnessMap.channel),anisotropyMapUv:K&&m(b.anisotropyMap.channel),clearcoatMapUv:Re&&m(b.clearcoatMap.channel),clearcoatNormalMapUv:ge&&m(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ze&&m(b.clearcoatRoughnessMap.channel),iridescenceMapUv:He&&m(b.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&m(b.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&m(b.sheenColorMap.channel),sheenRoughnessMapUv:Ie&&m(b.sheenRoughnessMap.channel),specularMapUv:Le&&m(b.specularMap.channel),specularColorMapUv:Te&&m(b.specularColorMap.channel),specularIntensityMapUv:Je&&m(b.specularIntensityMap.channel),transmissionMapUv:z&&m(b.transmissionMap.channel),thicknessMapUv:_e&&m(b.thicknessMap.channel),alphaMapUv:we&&m(b.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(de||ue),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!L.attributes.uv&&(Se||we),fog:!!k,useFog:b.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:b.wireframe===!1&&(b.flatShading===!0||L.attributes.normal===void 0&&de===!1&&(b.isMeshLambertMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isMeshPhysicalMaterial)),sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:te,skinning:V.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:j,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&F.length>0,shadowMapType:i.shadowMap.type,toneMapping:$e,decodeVideoTexture:Se&&b.map.isVideoTexture===!0&&tt.getTransfer(b.map.colorSpace)===at,decodeVideoTextureEmissive:Oe&&b.emissiveMap.isVideoTexture===!0&&tt.getTransfer(b.emissiveMap.colorSpace)===at,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Qt,flipSided:b.side===Yt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Pe&&b.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Pe&&b.extensions.multiDraw===!0||le)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return gt.vertexUv1s=l.has(1),gt.vertexUv2s=l.has(2),gt.vertexUv3s=l.has(3),l.clear(),gt}function g(b){let M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(let F in b.defines)M.push(F),M.push(b.defines[F]);return b.isRawShaderMaterial===!1&&(p(M,b),v(M,b),M.push(i.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function p(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function v(b,M){a.disableAll(),M.instancing&&a.enable(0),M.instancingColor&&a.enable(1),M.instancingMorph&&a.enable(2),M.matcap&&a.enable(3),M.envMap&&a.enable(4),M.normalMapObjectSpace&&a.enable(5),M.normalMapTangentSpace&&a.enable(6),M.clearcoat&&a.enable(7),M.iridescence&&a.enable(8),M.alphaTest&&a.enable(9),M.vertexColors&&a.enable(10),M.vertexAlphas&&a.enable(11),M.vertexUv1s&&a.enable(12),M.vertexUv2s&&a.enable(13),M.vertexUv3s&&a.enable(14),M.vertexTangents&&a.enable(15),M.anisotropy&&a.enable(16),M.alphaHash&&a.enable(17),M.batching&&a.enable(18),M.dispersion&&a.enable(19),M.batchingColor&&a.enable(20),M.gradientMap&&a.enable(21),b.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),b.push(a.mask)}function S(b){let M=f[b.type],F;if(M){let w=hi[M];F=ip.clone(w.uniforms)}else F=b.uniforms;return F}function y(b,M){let F=u.get(M);return F!==void 0?++F.usedTimes:(F=new mv(i,M,b,s),c.push(F),u.set(M,F)),F}function E(b){if(--b.usedTimes===0){let M=c.indexOf(b);c[M]=c[c.length-1],c.pop(),u.delete(b.cacheKey),b.destroy()}}function C(b){o.remove(b)}function I(){o.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:S,acquireProgram:y,releaseProgram:E,releaseShaderCache:C,programs:c,dispose:I}}function _v(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function yv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Tp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Ap(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,m,x,g,p){let v=i[e];return v===void 0?(v={id:d.id,object:d,geometry:f,material:m,materialVariant:a(d),groupOrder:x,renderOrder:d.renderOrder,z:g,group:p},i[e]=v):(v.id=d.id,v.object=d,v.geometry=f,v.material=m,v.materialVariant=a(d),v.groupOrder=x,v.renderOrder=d.renderOrder,v.z=g,v.group=p),e++,v}function l(d,f,m,x,g,p){let v=o(d,f,m,x,g,p);m.transmission>0?n.push(v):m.transparent===!0?s.push(v):t.push(v)}function c(d,f,m,x,g,p){let v=o(d,f,m,x,g,p);m.transmission>0?n.unshift(v):m.transparent===!0?s.unshift(v):t.unshift(v)}function u(d,f){t.length>1&&t.sort(d||yv),n.length>1&&n.sort(f||Tp),s.length>1&&s.sort(f||Tp)}function h(){for(let d=e,f=i.length;d<f;d++){let m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:h,sort:u}}function vv(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Ap,i.set(n,[a])):s>=r.length?(a=new Ap,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function bv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Be};break;case"SpotLight":t={position:new D,direction:new D,color:new Be,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Be,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Be,groundColor:new Be};break;case"RectAreaLight":t={color:new Be,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function Mv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}function Tv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Av(i){let e=new bv,t=Mv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);let s=new D,r=new Xe,a=new Xe;function o(c){let u=0,h=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,v=0,S=0,y=0,E=0,C=0,I=0;c.sort(Tv);for(let M=0,F=c.length;M<F;M++){let w=c[M],V=w.color,k=w.intensity,L=w.distance,P=null;if(w.shadow&&w.shadow.map&&(w.shadow.map.texture.format===Fs?P=w.shadow.map.texture:P=w.shadow.map.depthTexture||w.shadow.map.texture),w.isAmbientLight)u+=V.r*k,h+=V.g*k,d+=V.b*k;else if(w.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(w.sh.coefficients[N],k);I++}else if(w.isDirectionalLight){let N=e.get(w);if(N.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){let U=w.shadow,ee=t.get(w);ee.shadowIntensity=U.intensity,ee.shadowBias=U.bias,ee.shadowNormalBias=U.normalBias,ee.shadowRadius=U.radius,ee.shadowMapSize=U.mapSize,n.directionalShadow[f]=ee,n.directionalShadowMap[f]=P,n.directionalShadowMatrix[f]=w.shadow.matrix,v++}n.directional[f]=N,f++}else if(w.isSpotLight){let N=e.get(w);N.position.setFromMatrixPosition(w.matrixWorld),N.color.copy(V).multiplyScalar(k),N.distance=L,N.coneCos=Math.cos(w.angle),N.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),N.decay=w.decay,n.spot[x]=N;let U=w.shadow;if(w.map&&(n.spotLightMap[E]=w.map,E++,U.updateMatrices(w),w.castShadow&&C++),n.spotLightMatrix[x]=U.matrix,w.castShadow){let ee=t.get(w);ee.shadowIntensity=U.intensity,ee.shadowBias=U.bias,ee.shadowNormalBias=U.normalBias,ee.shadowRadius=U.radius,ee.shadowMapSize=U.mapSize,n.spotShadow[x]=ee,n.spotShadowMap[x]=P,y++}x++}else if(w.isRectAreaLight){let N=e.get(w);N.color.copy(V).multiplyScalar(k),N.halfWidth.set(w.width*.5,0,0),N.halfHeight.set(0,w.height*.5,0),n.rectArea[g]=N,g++}else if(w.isPointLight){let N=e.get(w);if(N.color.copy(w.color).multiplyScalar(w.intensity),N.distance=w.distance,N.decay=w.decay,w.castShadow){let U=w.shadow,ee=t.get(w);ee.shadowIntensity=U.intensity,ee.shadowBias=U.bias,ee.shadowNormalBias=U.normalBias,ee.shadowRadius=U.radius,ee.shadowMapSize=U.mapSize,ee.shadowCameraNear=U.camera.near,ee.shadowCameraFar=U.camera.far,n.pointShadow[m]=ee,n.pointShadowMap[m]=P,n.pointShadowMatrix[m]=w.shadow.matrix,S++}n.point[m]=N,m++}else if(w.isHemisphereLight){let N=e.get(w);N.skyColor.copy(w.color).multiplyScalar(k),N.groundColor.copy(w.groundColor).multiplyScalar(k),n.hemi[p]=N,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;let b=n.hash;(b.directionalLength!==f||b.pointLength!==m||b.spotLength!==x||b.rectAreaLength!==g||b.hemiLength!==p||b.numDirectionalShadows!==v||b.numPointShadows!==S||b.numSpotShadows!==y||b.numSpotMaps!==E||b.numLightProbes!==I)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=y+E-C,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=I,b.directionalLength=f,b.pointLength=m,b.spotLength=x,b.rectAreaLength=g,b.hemiLength=p,b.numDirectionalShadows=v,b.numPointShadows=S,b.numSpotShadows=y,b.numSpotMaps=E,b.numLightProbes=I,n.version=Sv++)}function l(c,u){let h=0,d=0,f=0,m=0,x=0,g=u.matrixWorldInverse;for(let p=0,v=c.length;p<v;p++){let S=c[p];if(S.isDirectionalLight){let y=n.directional[h];y.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),h++}else if(S.isSpotLight){let y=n.spot[f];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(S.isRectAreaLight){let y=n.rectArea[m];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),a.identity(),r.copy(S.matrixWorld),r.premultiply(g),a.extractRotation(r),y.halfWidth.set(S.width*.5,0,0),y.halfHeight.set(0,S.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),m++}else if(S.isPointLight){let y=n.point[d];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),d++}else if(S.isHemisphereLight){let y=n.hemi[x];y.direction.setFromMatrixPosition(S.matrixWorld),y.direction.transformDirection(g),x++}}}return{setup:o,setupView:l,state:n}}function Ep(i){let e=new Av(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Ev(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Ep(i),e.set(s,[o])):r>=a.length?(o=new Ep(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}function Pv(i,e,t){let n=new Sr,s=new oe,r=new oe,a=new xt,o=new ll,l=new cl,c={},u=t.maxTextureSize,h={[Bn]:Yt,[Yt]:Bn,[Qt]:Qt},d=new _n({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new oe},radius:{value:4}},vertexShader:wv,fragmentShader:Cv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new Et;m.setAttribute("position",new dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new ft(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=za;let p=this.type;this.render=function(C,I,b){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||C.length===0)return;this.type===yl&&(Fe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=za);let M=i.getRenderTarget(),F=i.getActiveCubeFace(),w=i.getActiveMipmapLevel(),V=i.state;V.setBlending(li),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let k=p!==this.type;k&&I.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(P=>P.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,P=C.length;L<P;L++){let N=C[L],U=N.shadow;if(U===void 0){Fe("WebGLShadowMap:",N,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;s.copy(U.mapSize);let ee=U.getFrameExtents();s.multiply(ee),r.copy(U.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ee.x),s.x=r.x*ee.x,U.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ee.y),s.y=r.y*ee.y,U.mapSize.y=r.y));let se=i.state.buffers.depth.getReversed();if(U.camera._reversedDepth=se,U.map===null||k===!0){if(U.map!==null&&(U.map.depthTexture!==null&&(U.map.depthTexture.dispose(),U.map.depthTexture=null),U.map.dispose()),this.type===Rr){if(N.isPointLight){Fe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}U.map=new gn(s.x,s.y,{format:Fs,type:ci,minFilter:Tt,magFilter:Tt,generateMipmaps:!1}),U.map.texture.name=N.name+".shadowMap",U.map.depthTexture=new Qi(s.x,s.y,vn),U.map.depthTexture.name=N.name+".shadowMapDepth",U.map.depthTexture.format=Jn,U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=St,U.map.depthTexture.magFilter=St}else N.isPointLight?(U.map=new fc(s.x),U.map.depthTexture=new tl(s.x,Gn)):(U.map=new gn(s.x,s.y),U.map.depthTexture=new Qi(s.x,s.y,Gn)),U.map.depthTexture.name=N.name+".shadowMap",U.map.depthTexture.format=Jn,this.type===za?(U.map.depthTexture.compareFunction=se?uc:cc,U.map.depthTexture.minFilter=Tt,U.map.depthTexture.magFilter=Tt):(U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=St,U.map.depthTexture.magFilter=St);U.camera.updateProjectionMatrix()}let fe=U.map.isWebGLCubeRenderTarget?6:1;for(let ye=0;ye<fe;ye++){if(U.map.isWebGLCubeRenderTarget)i.setRenderTarget(U.map,ye),i.clear();else{ye===0&&(i.setRenderTarget(U.map),i.clear());let j=U.getViewport(ye);a.set(r.x*j.x,r.y*j.y,r.x*j.z,r.y*j.w),V.viewport(a)}if(N.isPointLight){let j=U.camera,X=U.matrix,Ae=N.distance||j.far;Ae!==j.far&&(j.far=Ae,j.updateProjectionMatrix()),ja.setFromMatrixPosition(N.matrixWorld),j.position.copy(ja),sh.copy(j.position),sh.add(Rv[ye]),j.up.copy(Iv[ye]),j.lookAt(sh),j.updateMatrixWorld(),X.makeTranslation(-ja.x,-ja.y,-ja.z),wp.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),U._frustum.setFromProjectionMatrix(wp,j.coordinateSystem,j.reversedDepth)}else U.updateMatrices(N);n=U.getFrustum(),y(I,b,U.camera,N,this.type)}U.isPointLightShadow!==!0&&this.type===Rr&&v(U,b),U.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(M,F,w)};function v(C,I){let b=e.update(x);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,f.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new gn(s.x,s.y,{format:Fs,type:ci})),d.uniforms.shadow_pass.value=C.map.depthTexture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(I,null,b,d,x,null),f.uniforms.shadow_pass.value=C.mapPass.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(I,null,b,f,x,null)}function S(C,I,b,M){let F=null,w=b.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(w!==void 0)F=w;else if(F=b.isPointLight===!0?l:o,i.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){let V=F.uuid,k=I.uuid,L=c[V];L===void 0&&(L={},c[V]=L);let P=L[k];P===void 0&&(P=F.clone(),L[k]=P,I.addEventListener("dispose",E)),F=P}if(F.visible=I.visible,F.wireframe=I.wireframe,M===Rr?F.side=I.shadowSide!==null?I.shadowSide:I.side:F.side=I.shadowSide!==null?I.shadowSide:h[I.side],F.alphaMap=I.alphaMap,F.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,F.map=I.map,F.clipShadows=I.clipShadows,F.clippingPlanes=I.clippingPlanes,F.clipIntersection=I.clipIntersection,F.displacementMap=I.displacementMap,F.displacementScale=I.displacementScale,F.displacementBias=I.displacementBias,F.wireframeLinewidth=I.wireframeLinewidth,F.linewidth=I.linewidth,b.isPointLight===!0&&F.isMeshDistanceMaterial===!0){let V=i.properties.get(F);V.light=b}return F}function y(C,I,b,M,F){if(C.visible===!1)return;if(C.layers.test(I.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&F===Rr)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,C.matrixWorld);let k=e.update(C),L=C.material;if(Array.isArray(L)){let P=k.groups;for(let N=0,U=P.length;N<U;N++){let ee=P[N],se=L[ee.materialIndex];if(se&&se.visible){let fe=S(C,se,M,F);C.onBeforeShadow(i,C,I,b,k,fe,ee),i.renderBufferDirect(b,null,k,fe,C,ee),C.onAfterShadow(i,C,I,b,k,fe,ee)}}}else if(L.visible){let P=S(C,L,M,F);C.onBeforeShadow(i,C,I,b,k,P,null),i.renderBufferDirect(b,null,k,P,C,null),C.onAfterShadow(i,C,I,b,k,P,null)}}let V=C.children;for(let k=0,L=V.length;k<L;k++)y(V[k],I,b,M,F)}function E(C){C.target.removeEventListener("dispose",E);for(let b in c){let M=c[b],F=C.target.uuid;F in M&&(M[F].dispose(),delete M[F])}}}function Lv(i,e){function t(){let z=!1,_e=new xt,me=null,we=new xt(0,0,0,0);return{setMask:function(he){me!==he&&!z&&(i.colorMask(he,he,he,he),me=he)},setLocked:function(he){z=he},setClear:function(he,J,Pe,$e,gt){gt===!0&&(he*=$e,J*=$e,Pe*=$e),_e.set(he,J,Pe,$e),we.equals(_e)===!1&&(i.clearColor(he,J,Pe,$e),we.copy(_e))},reset:function(){z=!1,me=null,we.set(-1,0,0,0)}}}function n(){let z=!1,_e=!1,me=null,we=null,he=null;return{setReversed:function(J){if(_e!==J){let Pe=e.get("EXT_clip_control");J?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),_e=J;let $e=he;he=null,this.setClear($e)}},getReversed:function(){return _e},setTest:function(J){J?W(i.DEPTH_TEST):te(i.DEPTH_TEST)},setMask:function(J){me!==J&&!z&&(i.depthMask(J),me=J)},setFunc:function(J){if(_e&&(J=Kf[J]),we!==J){switch(J){case Go:i.depthFunc(i.NEVER);break;case Wo:i.depthFunc(i.ALWAYS);break;case Xo:i.depthFunc(i.LESS);break;case Ss:i.depthFunc(i.LEQUAL);break;case qo:i.depthFunc(i.EQUAL);break;case $o:i.depthFunc(i.GEQUAL);break;case Yo:i.depthFunc(i.GREATER);break;case jo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}we=J}},setLocked:function(J){z=J},setClear:function(J){he!==J&&(he=J,_e&&(J=1-J),i.clearDepth(J))},reset:function(){z=!1,me=null,we=null,he=null,_e=!1}}}function s(){let z=!1,_e=null,me=null,we=null,he=null,J=null,Pe=null,$e=null,gt=null;return{setTest:function(ot){z||(ot?W(i.STENCIL_TEST):te(i.STENCIL_TEST))},setMask:function(ot){_e!==ot&&!z&&(i.stencilMask(ot),_e=ot)},setFunc:function(ot,fi,pi){(me!==ot||we!==fi||he!==pi)&&(i.stencilFunc(ot,fi,pi),me=ot,we=fi,he=pi)},setOp:function(ot,fi,pi){(J!==ot||Pe!==fi||$e!==pi)&&(i.stencilOp(ot,fi,pi),J=ot,Pe=fi,$e=pi)},setLocked:function(ot){z=ot},setClear:function(ot){gt!==ot&&(i.clearStencil(ot),gt=ot)},reset:function(){z=!1,_e=null,me=null,we=null,he=null,J=null,Pe=null,$e=null,gt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,u={},h={},d=new WeakMap,f=[],m=null,x=!1,g=null,p=null,v=null,S=null,y=null,E=null,C=null,I=new Be(0,0,0),b=0,M=!1,F=null,w=null,V=null,k=null,L=null,P=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,U=0,ee=i.getParameter(i.VERSION);ee.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(ee)[1]),N=U>=1):ee.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),N=U>=2);let se=null,fe={},ye=i.getParameter(i.SCISSOR_BOX),j=i.getParameter(i.VIEWPORT),X=new xt().fromArray(ye),Ae=new xt().fromArray(j);function Y(z,_e,me,we){let he=new Uint8Array(4),J=i.createTexture();i.bindTexture(z,J),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Pe=0;Pe<me;Pe++)z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?i.texImage3D(_e,0,i.RGBA,1,1,we,0,i.RGBA,i.UNSIGNED_BYTE,he):i.texImage2D(_e+Pe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,he);return J}let O={};O[i.TEXTURE_2D]=Y(i.TEXTURE_2D,i.TEXTURE_2D,1),O[i.TEXTURE_CUBE_MAP]=Y(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),O[i.TEXTURE_2D_ARRAY]=Y(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),O[i.TEXTURE_3D]=Y(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),W(i.DEPTH_TEST),a.setFunc(Ss),ne(!1),de(wu),W(i.CULL_FACE),Q(li);function W(z){u[z]!==!0&&(i.enable(z),u[z]=!0)}function te(z){u[z]!==!1&&(i.disable(z),u[z]=!1)}function re(z,_e){return h[z]!==_e?(i.bindFramebuffer(z,_e),h[z]=_e,z===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=_e),z===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=_e),!0):!1}function le(z,_e){let me=f,we=!1;if(z){me=d.get(_e),me===void 0&&(me=[],d.set(_e,me));let he=z.textures;if(me.length!==he.length||me[0]!==i.COLOR_ATTACHMENT0){for(let J=0,Pe=he.length;J<Pe;J++)me[J]=i.COLOR_ATTACHMENT0+J;me.length=he.length,we=!0}}else me[0]!==i.BACK&&(me[0]=i.BACK,we=!0);we&&i.drawBuffers(me)}function Se(z){return m!==z?(i.useProgram(z),m=z,!0):!1}let We={[Yi]:i.FUNC_ADD,[yf]:i.FUNC_SUBTRACT,[vf]:i.FUNC_REVERSE_SUBTRACT};We[bf]=i.MIN,We[Mf]=i.MAX;let Ce={[Sf]:i.ZERO,[Tf]:i.ONE,[Af]:i.SRC_COLOR,[Vo]:i.SRC_ALPHA,[Pf]:i.SRC_ALPHA_SATURATE,[Rf]:i.DST_COLOR,[wf]:i.DST_ALPHA,[Ef]:i.ONE_MINUS_SRC_COLOR,[Ho]:i.ONE_MINUS_SRC_ALPHA,[If]:i.ONE_MINUS_DST_COLOR,[Cf]:i.ONE_MINUS_DST_ALPHA,[Lf]:i.CONSTANT_COLOR,[Df]:i.ONE_MINUS_CONSTANT_COLOR,[Nf]:i.CONSTANT_ALPHA,[Uf]:i.ONE_MINUS_CONSTANT_ALPHA};function Q(z,_e,me,we,he,J,Pe,$e,gt,ot){if(z===li){x===!0&&(te(i.BLEND),x=!1);return}if(x===!1&&(W(i.BLEND),x=!0),z!==_f){if(z!==g||ot!==M){if((p!==Yi||y!==Yi)&&(i.blendEquation(i.FUNC_ADD),p=Yi,y=Yi),ot)switch(z){case Ms:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Cu:i.blendFunc(i.ONE,i.ONE);break;case Ru:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Iu:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ge("WebGLState: Invalid blending: ",z);break}else switch(z){case Ms:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Cu:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ru:Ge("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Iu:Ge("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ge("WebGLState: Invalid blending: ",z);break}v=null,S=null,E=null,C=null,I.set(0,0,0),b=0,g=z,M=ot}return}he=he||_e,J=J||me,Pe=Pe||we,(_e!==p||he!==y)&&(i.blendEquationSeparate(We[_e],We[he]),p=_e,y=he),(me!==v||we!==S||J!==E||Pe!==C)&&(i.blendFuncSeparate(Ce[me],Ce[we],Ce[J],Ce[Pe]),v=me,S=we,E=J,C=Pe),($e.equals(I)===!1||gt!==b)&&(i.blendColor($e.r,$e.g,$e.b,gt),I.copy($e),b=gt),g=z,M=!1}function ae(z,_e){z.side===Qt?te(i.CULL_FACE):W(i.CULL_FACE);let me=z.side===Yt;_e&&(me=!me),ne(me),z.blending===Ms&&z.transparent===!1?Q(li):Q(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),a.setFunc(z.depthFunc),a.setTest(z.depthTest),a.setMask(z.depthWrite),r.setMask(z.colorWrite);let we=z.stencilWrite;o.setTest(we),we&&(o.setMask(z.stencilWriteMask),o.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),o.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Oe(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?W(i.SAMPLE_ALPHA_TO_COVERAGE):te(i.SAMPLE_ALPHA_TO_COVERAGE)}function ne(z){F!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),F=z)}function de(z){z!==gf?(W(i.CULL_FACE),z!==w&&(z===wu?i.cullFace(i.BACK):z===xf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):te(i.CULL_FACE),w=z}function R(z){z!==V&&(N&&i.lineWidth(z),V=z)}function Oe(z,_e,me){z?(W(i.POLYGON_OFFSET_FILL),(k!==_e||L!==me)&&(k=_e,L=me,a.getReversed()&&(_e=-_e),i.polygonOffset(_e,me))):te(i.POLYGON_OFFSET_FILL)}function xe(z){z?W(i.SCISSOR_TEST):te(i.SCISSOR_TEST)}function Ne(z){z===void 0&&(z=i.TEXTURE0+P-1),se!==z&&(i.activeTexture(z),se=z)}function ue(z,_e,me){me===void 0&&(se===null?me=i.TEXTURE0+P-1:me=se);let we=fe[me];we===void 0&&(we={type:void 0,texture:void 0},fe[me]=we),(we.type!==z||we.texture!==_e)&&(se!==me&&(i.activeTexture(me),se=me),i.bindTexture(z,_e||O[z]),we.type=z,we.texture=_e)}function A(){let z=fe[se];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(z){Ge("WebGLState:",z)}}function B(){try{i.compressedTexImage3D(...arguments)}catch(z){Ge("WebGLState:",z)}}function Z(){try{i.texSubImage2D(...arguments)}catch(z){Ge("WebGLState:",z)}}function ie(){try{i.texSubImage3D(...arguments)}catch(z){Ge("WebGLState:",z)}}function K(){try{i.compressedTexSubImage2D(...arguments)}catch(z){Ge("WebGLState:",z)}}function Re(){try{i.compressedTexSubImage3D(...arguments)}catch(z){Ge("WebGLState:",z)}}function ge(){try{i.texStorage2D(...arguments)}catch(z){Ge("WebGLState:",z)}}function ze(){try{i.texStorage3D(...arguments)}catch(z){Ge("WebGLState:",z)}}function He(){try{i.texImage2D(...arguments)}catch(z){Ge("WebGLState:",z)}}function ce(){try{i.texImage3D(...arguments)}catch(z){Ge("WebGLState:",z)}}function pe(z){X.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),X.copy(z))}function Ie(z){Ae.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),Ae.copy(z))}function Le(z,_e){let me=c.get(_e);me===void 0&&(me=new WeakMap,c.set(_e,me));let we=me.get(z);we===void 0&&(we=i.getUniformBlockIndex(_e,z.name),me.set(z,we))}function Te(z,_e){let we=c.get(_e).get(z);l.get(_e)!==we&&(i.uniformBlockBinding(_e,we,z.__bindingPointIndex),l.set(_e,we))}function Je(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},se=null,fe={},h={},d=new WeakMap,f=[],m=null,x=!1,g=null,p=null,v=null,S=null,y=null,E=null,C=null,I=new Be(0,0,0),b=0,M=!1,F=null,w=null,V=null,k=null,L=null,X.set(0,0,i.canvas.width,i.canvas.height),Ae.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:W,disable:te,bindFramebuffer:re,drawBuffers:le,useProgram:Se,setBlending:Q,setMaterial:ae,setFlipSided:ne,setCullFace:de,setLineWidth:R,setPolygonOffset:Oe,setScissorTest:xe,activeTexture:Ne,bindTexture:ue,unbindTexture:A,compressedTexImage2D:_,compressedTexImage3D:B,texImage2D:He,texImage3D:ce,updateUBOMapping:Le,uniformBlockBinding:Te,texStorage2D:ge,texStorage3D:ze,texSubImage2D:Z,texSubImage3D:ie,compressedTexSubImage2D:K,compressedTexSubImage3D:Re,scissor:pe,viewport:Ie,reset:Je}}function Dv(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new oe,u=new WeakMap,h,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(A,_){return f?new OffscreenCanvas(A,_):mr("canvas")}function x(A,_,B){let Z=1,ie=ue(A);if((ie.width>B||ie.height>B)&&(Z=B/Math.max(ie.width,ie.height)),Z<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let K=Math.floor(Z*ie.width),Re=Math.floor(Z*ie.height);h===void 0&&(h=m(K,Re));let ge=_?m(K,Re):h;return ge.width=K,ge.height=Re,ge.getContext("2d").drawImage(A,0,0,K,Re),Fe("WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+K+"x"+Re+")."),ge}else return"data"in A&&Fe("WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),A;return A}function g(A){return A.generateMipmaps}function p(A){i.generateMipmap(A)}function v(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(A,_,B,Z,ie=!1){if(A!==null){if(i[A]!==void 0)return i[A];Fe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let K=_;if(_===i.RED&&(B===i.FLOAT&&(K=i.R32F),B===i.HALF_FLOAT&&(K=i.R16F),B===i.UNSIGNED_BYTE&&(K=i.R8)),_===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(K=i.R8UI),B===i.UNSIGNED_SHORT&&(K=i.R16UI),B===i.UNSIGNED_INT&&(K=i.R32UI),B===i.BYTE&&(K=i.R8I),B===i.SHORT&&(K=i.R16I),B===i.INT&&(K=i.R32I)),_===i.RG&&(B===i.FLOAT&&(K=i.RG32F),B===i.HALF_FLOAT&&(K=i.RG16F),B===i.UNSIGNED_BYTE&&(K=i.RG8)),_===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(K=i.RG8UI),B===i.UNSIGNED_SHORT&&(K=i.RG16UI),B===i.UNSIGNED_INT&&(K=i.RG32UI),B===i.BYTE&&(K=i.RG8I),B===i.SHORT&&(K=i.RG16I),B===i.INT&&(K=i.RG32I)),_===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(K=i.RGB8UI),B===i.UNSIGNED_SHORT&&(K=i.RGB16UI),B===i.UNSIGNED_INT&&(K=i.RGB32UI),B===i.BYTE&&(K=i.RGB8I),B===i.SHORT&&(K=i.RGB16I),B===i.INT&&(K=i.RGB32I)),_===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),B===i.UNSIGNED_INT&&(K=i.RGBA32UI),B===i.BYTE&&(K=i.RGBA8I),B===i.SHORT&&(K=i.RGBA16I),B===i.INT&&(K=i.RGBA32I)),_===i.RGB&&(B===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),_===i.RGBA){let Re=ie?ra:tt.getTransfer(Z);B===i.FLOAT&&(K=i.RGBA32F),B===i.HALF_FLOAT&&(K=i.RGBA16F),B===i.UNSIGNED_BYTE&&(K=Re===at?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function y(A,_){let B;return A?_===null||_===Gn||_===Lr?B=i.DEPTH24_STENCIL8:_===vn?B=i.DEPTH32F_STENCIL8:_===Pr&&(B=i.DEPTH24_STENCIL8,Fe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Gn||_===Lr?B=i.DEPTH_COMPONENT24:_===vn?B=i.DEPTH_COMPONENT32F:_===Pr&&(B=i.DEPTH_COMPONENT16),B}function E(A,_){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==St&&A.minFilter!==Tt?Math.log2(Math.max(_.width,_.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?_.mipmaps.length:1}function C(A){let _=A.target;_.removeEventListener("dispose",C),b(_),_.isVideoTexture&&u.delete(_)}function I(A){let _=A.target;_.removeEventListener("dispose",I),F(_)}function b(A){let _=n.get(A);if(_.__webglInit===void 0)return;let B=A.source,Z=d.get(B);if(Z){let ie=Z[_.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&M(A),Object.keys(Z).length===0&&d.delete(B)}n.remove(A)}function M(A){let _=n.get(A);i.deleteTexture(_.__webglTexture);let B=A.source,Z=d.get(B);delete Z[_.__cacheKey],a.memory.textures--}function F(A){let _=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(_.__webglFramebuffer[Z]))for(let ie=0;ie<_.__webglFramebuffer[Z].length;ie++)i.deleteFramebuffer(_.__webglFramebuffer[Z][ie]);else i.deleteFramebuffer(_.__webglFramebuffer[Z]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[Z])}else{if(Array.isArray(_.__webglFramebuffer))for(let Z=0;Z<_.__webglFramebuffer.length;Z++)i.deleteFramebuffer(_.__webglFramebuffer[Z]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let Z=0;Z<_.__webglColorRenderbuffer.length;Z++)_.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[Z]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let B=A.textures;for(let Z=0,ie=B.length;Z<ie;Z++){let K=n.get(B[Z]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),a.memory.textures--),n.remove(B[Z])}n.remove(A)}let w=0;function V(){w=0}function k(){let A=w;return A>=s.maxTextures&&Fe("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),w+=1,A}function L(A){let _=[];return _.push(A.wrapS),_.push(A.wrapT),_.push(A.wrapR||0),_.push(A.magFilter),_.push(A.minFilter),_.push(A.anisotropy),_.push(A.internalFormat),_.push(A.format),_.push(A.type),_.push(A.generateMipmaps),_.push(A.premultiplyAlpha),_.push(A.flipY),_.push(A.unpackAlignment),_.push(A.colorSpace),_.join()}function P(A,_){let B=n.get(A);if(A.isVideoTexture&&xe(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&B.__version!==A.version){let Z=A.image;if(Z===null)Fe("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Fe("WebGLRenderer: Texture marked for update but image is incomplete");else{O(B,A,_);return}}else A.isExternalTexture&&(B.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+_)}function N(A,_){let B=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&B.__version!==A.version){O(B,A,_);return}else A.isExternalTexture&&(B.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+_)}function U(A,_){let B=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&B.__version!==A.version){O(B,A,_);return}t.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+_)}function ee(A,_){let B=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&B.__version!==A.version){W(B,A,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+_)}let se={[Kn]:i.REPEAT,[on]:i.CLAMP_TO_EDGE,[ji]:i.MIRRORED_REPEAT},fe={[St]:i.NEAREST,[Ir]:i.NEAREST_MIPMAP_NEAREST,[Ii]:i.NEAREST_MIPMAP_LINEAR,[Tt]:i.LINEAR,[rs]:i.LINEAR_MIPMAP_NEAREST,[yn]:i.LINEAR_MIPMAP_LINEAR},ye={[Hf]:i.NEVER,[$f]:i.ALWAYS,[Gf]:i.LESS,[cc]:i.LEQUAL,[Wf]:i.EQUAL,[uc]:i.GEQUAL,[Xf]:i.GREATER,[qf]:i.NOTEQUAL};function j(A,_){if(_.type===vn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Tt||_.magFilter===rs||_.magFilter===Ii||_.magFilter===yn||_.minFilter===Tt||_.minFilter===rs||_.minFilter===Ii||_.minFilter===yn)&&Fe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,se[_.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,se[_.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,se[_.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,fe[_.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,fe[_.minFilter]),_.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,ye[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===St||_.minFilter!==Ii&&_.minFilter!==yn||_.type===vn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let B=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function X(A,_){let B=!1;A.__webglInit===void 0&&(A.__webglInit=!0,_.addEventListener("dispose",C));let Z=_.source,ie=d.get(Z);ie===void 0&&(ie={},d.set(Z,ie));let K=L(_);if(K!==A.__cacheKey){ie[K]===void 0&&(ie[K]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,B=!0),ie[K].usedTimes++;let Re=ie[A.__cacheKey];Re!==void 0&&(ie[A.__cacheKey].usedTimes--,Re.usedTimes===0&&M(_)),A.__cacheKey=K,A.__webglTexture=ie[K].texture}return B}function Ae(A,_,B){return Math.floor(Math.floor(A/B)/_)}function Y(A,_,B,Z){let K=A.updateRanges;if(K.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,B,Z,_.data);else{K.sort((ce,pe)=>ce.start-pe.start);let Re=0;for(let ce=1;ce<K.length;ce++){let pe=K[Re],Ie=K[ce],Le=pe.start+pe.count,Te=Ae(Ie.start,_.width,4),Je=Ae(pe.start,_.width,4);Ie.start<=Le+1&&Te===Je&&Ae(Ie.start+Ie.count-1,_.width,4)===Te?pe.count=Math.max(pe.count,Ie.start+Ie.count-pe.start):(++Re,K[Re]=Ie)}K.length=Re+1;let ge=i.getParameter(i.UNPACK_ROW_LENGTH),ze=i.getParameter(i.UNPACK_SKIP_PIXELS),He=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let ce=0,pe=K.length;ce<pe;ce++){let Ie=K[ce],Le=Math.floor(Ie.start/4),Te=Math.ceil(Ie.count/4),Je=Le%_.width,z=Math.floor(Le/_.width),_e=Te,me=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Je),i.pixelStorei(i.UNPACK_SKIP_ROWS,z),t.texSubImage2D(i.TEXTURE_2D,0,Je,z,_e,me,B,Z,_.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ge),i.pixelStorei(i.UNPACK_SKIP_PIXELS,ze),i.pixelStorei(i.UNPACK_SKIP_ROWS,He)}}function O(A,_,B){let Z=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(Z=i.TEXTURE_3D);let ie=X(A,_),K=_.source;t.bindTexture(Z,A.__webglTexture,i.TEXTURE0+B);let Re=n.get(K);if(K.version!==Re.__version||ie===!0){t.activeTexture(i.TEXTURE0+B);let ge=tt.getPrimaries(tt.workingColorSpace),ze=_.colorSpace===Wn?null:tt.getPrimaries(_.colorSpace),He=_.colorSpace===Wn||ge===ze?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);let ce=x(_.image,!1,s.maxTextureSize);ce=Ne(_,ce);let pe=r.convert(_.format,_.colorSpace),Ie=r.convert(_.type),Le=S(_.internalFormat,pe,Ie,_.colorSpace,_.isVideoTexture);j(Z,_);let Te,Je=_.mipmaps,z=_.isVideoTexture!==!0,_e=Re.__version===void 0||ie===!0,me=K.dataReady,we=E(_,ce);if(_.isDepthTexture)Le=y(_.format===as,_.type),_e&&(z?t.texStorage2D(i.TEXTURE_2D,1,Le,ce.width,ce.height):t.texImage2D(i.TEXTURE_2D,0,Le,ce.width,ce.height,0,pe,Ie,null));else if(_.isDataTexture)if(Je.length>0){z&&_e&&t.texStorage2D(i.TEXTURE_2D,we,Le,Je[0].width,Je[0].height);for(let he=0,J=Je.length;he<J;he++)Te=Je[he],z?me&&t.texSubImage2D(i.TEXTURE_2D,he,0,0,Te.width,Te.height,pe,Ie,Te.data):t.texImage2D(i.TEXTURE_2D,he,Le,Te.width,Te.height,0,pe,Ie,Te.data);_.generateMipmaps=!1}else z?(_e&&t.texStorage2D(i.TEXTURE_2D,we,Le,ce.width,ce.height),me&&Y(_,ce,pe,Ie)):t.texImage2D(i.TEXTURE_2D,0,Le,ce.width,ce.height,0,pe,Ie,ce.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){z&&_e&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Le,Je[0].width,Je[0].height,ce.depth);for(let he=0,J=Je.length;he<J;he++)if(Te=Je[he],_.format!==sn)if(pe!==null)if(z){if(me)if(_.layerUpdates.size>0){let Pe=Ku(Te.width,Te.height,_.format,_.type);for(let $e of _.layerUpdates){let gt=Te.data.subarray($e*Pe/Te.data.BYTES_PER_ELEMENT,($e+1)*Pe/Te.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,he,0,0,$e,Te.width,Te.height,1,pe,gt)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,he,0,0,0,Te.width,Te.height,ce.depth,pe,Te.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,he,Le,Te.width,Te.height,ce.depth,0,Te.data,0,0);else Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else z?me&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,he,0,0,0,Te.width,Te.height,ce.depth,pe,Ie,Te.data):t.texImage3D(i.TEXTURE_2D_ARRAY,he,Le,Te.width,Te.height,ce.depth,0,pe,Ie,Te.data)}else{z&&_e&&t.texStorage2D(i.TEXTURE_2D,we,Le,Je[0].width,Je[0].height);for(let he=0,J=Je.length;he<J;he++)Te=Je[he],_.format!==sn?pe!==null?z?me&&t.compressedTexSubImage2D(i.TEXTURE_2D,he,0,0,Te.width,Te.height,pe,Te.data):t.compressedTexImage2D(i.TEXTURE_2D,he,Le,Te.width,Te.height,0,Te.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):z?me&&t.texSubImage2D(i.TEXTURE_2D,he,0,0,Te.width,Te.height,pe,Ie,Te.data):t.texImage2D(i.TEXTURE_2D,he,Le,Te.width,Te.height,0,pe,Ie,Te.data)}else if(_.isDataArrayTexture)if(z){if(_e&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Le,ce.width,ce.height,ce.depth),me)if(_.layerUpdates.size>0){let he=Ku(ce.width,ce.height,_.format,_.type);for(let J of _.layerUpdates){let Pe=ce.data.subarray(J*he/ce.data.BYTES_PER_ELEMENT,(J+1)*he/ce.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,J,ce.width,ce.height,1,pe,Ie,Pe)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ce.width,ce.height,ce.depth,pe,Ie,ce.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Le,ce.width,ce.height,ce.depth,0,pe,Ie,ce.data);else if(_.isData3DTexture)z?(_e&&t.texStorage3D(i.TEXTURE_3D,we,Le,ce.width,ce.height,ce.depth),me&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ce.width,ce.height,ce.depth,pe,Ie,ce.data)):t.texImage3D(i.TEXTURE_3D,0,Le,ce.width,ce.height,ce.depth,0,pe,Ie,ce.data);else if(_.isFramebufferTexture){if(_e)if(z)t.texStorage2D(i.TEXTURE_2D,we,Le,ce.width,ce.height);else{let he=ce.width,J=ce.height;for(let Pe=0;Pe<we;Pe++)t.texImage2D(i.TEXTURE_2D,Pe,Le,he,J,0,pe,Ie,null),he>>=1,J>>=1}}else if(Je.length>0){if(z&&_e){let he=ue(Je[0]);t.texStorage2D(i.TEXTURE_2D,we,Le,he.width,he.height)}for(let he=0,J=Je.length;he<J;he++)Te=Je[he],z?me&&t.texSubImage2D(i.TEXTURE_2D,he,0,0,pe,Ie,Te):t.texImage2D(i.TEXTURE_2D,he,Le,pe,Ie,Te);_.generateMipmaps=!1}else if(z){if(_e){let he=ue(ce);t.texStorage2D(i.TEXTURE_2D,we,Le,he.width,he.height)}me&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,pe,Ie,ce)}else t.texImage2D(i.TEXTURE_2D,0,Le,pe,Ie,ce);g(_)&&p(Z),Re.__version=K.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function W(A,_,B){if(_.image.length!==6)return;let Z=X(A,_),ie=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+B);let K=n.get(ie);if(ie.version!==K.__version||Z===!0){t.activeTexture(i.TEXTURE0+B);let Re=tt.getPrimaries(tt.workingColorSpace),ge=_.colorSpace===Wn?null:tt.getPrimaries(_.colorSpace),ze=_.colorSpace===Wn||Re===ge?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ze);let He=_.isCompressedTexture||_.image[0].isCompressedTexture,ce=_.image[0]&&_.image[0].isDataTexture,pe=[];for(let J=0;J<6;J++)!He&&!ce?pe[J]=x(_.image[J],!0,s.maxCubemapSize):pe[J]=ce?_.image[J].image:_.image[J],pe[J]=Ne(_,pe[J]);let Ie=pe[0],Le=r.convert(_.format,_.colorSpace),Te=r.convert(_.type),Je=S(_.internalFormat,Le,Te,_.colorSpace),z=_.isVideoTexture!==!0,_e=K.__version===void 0||Z===!0,me=ie.dataReady,we=E(_,Ie);j(i.TEXTURE_CUBE_MAP,_);let he;if(He){z&&_e&&t.texStorage2D(i.TEXTURE_CUBE_MAP,we,Je,Ie.width,Ie.height);for(let J=0;J<6;J++){he=pe[J].mipmaps;for(let Pe=0;Pe<he.length;Pe++){let $e=he[Pe];_.format!==sn?Le!==null?z?me&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Pe,0,0,$e.width,$e.height,Le,$e.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Pe,Je,$e.width,$e.height,0,$e.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?me&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Pe,0,0,$e.width,$e.height,Le,Te,$e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Pe,Je,$e.width,$e.height,0,Le,Te,$e.data)}}}else{if(he=_.mipmaps,z&&_e){he.length>0&&we++;let J=ue(pe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,we,Je,J.width,J.height)}for(let J=0;J<6;J++)if(ce){z?me&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,pe[J].width,pe[J].height,Le,Te,pe[J].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Je,pe[J].width,pe[J].height,0,Le,Te,pe[J].data);for(let Pe=0;Pe<he.length;Pe++){let gt=he[Pe].image[J].image;z?me&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Pe+1,0,0,gt.width,gt.height,Le,Te,gt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Pe+1,Je,gt.width,gt.height,0,Le,Te,gt.data)}}else{z?me&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Le,Te,pe[J]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Je,Le,Te,pe[J]);for(let Pe=0;Pe<he.length;Pe++){let $e=he[Pe];z?me&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Pe+1,0,0,Le,Te,$e.image[J]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Pe+1,Je,Le,Te,$e.image[J])}}}g(_)&&p(i.TEXTURE_CUBE_MAP),K.__version=ie.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function te(A,_,B,Z,ie,K){let Re=r.convert(B.format,B.colorSpace),ge=r.convert(B.type),ze=S(B.internalFormat,Re,ge,B.colorSpace),He=n.get(_),ce=n.get(B);if(ce.__renderTarget=_,!He.__hasExternalTextures){let pe=Math.max(1,_.width>>K),Ie=Math.max(1,_.height>>K);ie===i.TEXTURE_3D||ie===i.TEXTURE_2D_ARRAY?t.texImage3D(ie,K,ze,pe,Ie,_.depth,0,Re,ge,null):t.texImage2D(ie,K,ze,pe,Ie,0,Re,ge,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),Oe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,ie,ce.__webglTexture,0,R(_)):(ie===i.TEXTURE_2D||ie>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,ie,ce.__webglTexture,K),t.bindFramebuffer(i.FRAMEBUFFER,null)}function re(A,_,B){if(i.bindRenderbuffer(i.RENDERBUFFER,A),_.depthBuffer){let Z=_.depthTexture,ie=Z&&Z.isDepthTexture?Z.type:null,K=y(_.stencilBuffer,ie),Re=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Oe(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,R(_),K,_.width,_.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,R(_),K,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,K,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Re,i.RENDERBUFFER,A)}else{let Z=_.textures;for(let ie=0;ie<Z.length;ie++){let K=Z[ie],Re=r.convert(K.format,K.colorSpace),ge=r.convert(K.type),ze=S(K.internalFormat,Re,ge,K.colorSpace);Oe(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,R(_),ze,_.width,_.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,R(_),ze,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ze,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function le(A,_,B){let Z=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let ie=n.get(_.depthTexture);if(ie.__renderTarget=_,(!ie.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),Z){if(ie.__webglInit===void 0&&(ie.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),ie.__webglTexture===void 0){ie.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,ie.__webglTexture),j(i.TEXTURE_CUBE_MAP,_.depthTexture);let He=r.convert(_.depthTexture.format),ce=r.convert(_.depthTexture.type),pe;_.depthTexture.format===Jn?pe=i.DEPTH_COMPONENT24:_.depthTexture.format===as&&(pe=i.DEPTH24_STENCIL8);for(let Ie=0;Ie<6;Ie++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ie,0,pe,_.width,_.height,0,He,ce,null)}}else P(_.depthTexture,0);let K=ie.__webglTexture,Re=R(_),ge=Z?i.TEXTURE_CUBE_MAP_POSITIVE_X+B:i.TEXTURE_2D,ze=_.depthTexture.format===as?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===Jn)Oe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ze,ge,K,0,Re):i.framebufferTexture2D(i.FRAMEBUFFER,ze,ge,K,0);else if(_.depthTexture.format===as)Oe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ze,ge,K,0,Re):i.framebufferTexture2D(i.FRAMEBUFFER,ze,ge,K,0);else throw new Error("Unknown depthTexture format")}function Se(A){let _=n.get(A),B=A.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==A.depthTexture){let Z=A.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),Z){let ie=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,Z.removeEventListener("dispose",ie)};Z.addEventListener("dispose",ie),_.__depthDisposeCallback=ie}_.__boundDepthTexture=Z}if(A.depthTexture&&!_.__autoAllocateDepthBuffer)if(B)for(let Z=0;Z<6;Z++)le(_.__webglFramebuffer[Z],A,Z);else{let Z=A.texture.mipmaps;Z&&Z.length>0?le(_.__webglFramebuffer[0],A,0):le(_.__webglFramebuffer,A,0)}else if(B){_.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[Z]),_.__webglDepthbuffer[Z]===void 0)_.__webglDepthbuffer[Z]=i.createRenderbuffer(),re(_.__webglDepthbuffer[Z],A,!1);else{let ie=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=_.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,K)}}else{let Z=A.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),re(_.__webglDepthbuffer,A,!1);else{let ie=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,K)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function We(A,_,B){let Z=n.get(A);_!==void 0&&te(Z.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Se(A)}function Ce(A){let _=A.texture,B=n.get(A),Z=n.get(_);A.addEventListener("dispose",I);let ie=A.textures,K=A.isWebGLCubeRenderTarget===!0,Re=ie.length>1;if(Re||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=_.version,a.memory.textures++),K){B.__webglFramebuffer=[];for(let ge=0;ge<6;ge++)if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer[ge]=[];for(let ze=0;ze<_.mipmaps.length;ze++)B.__webglFramebuffer[ge][ze]=i.createFramebuffer()}else B.__webglFramebuffer[ge]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer=[];for(let ge=0;ge<_.mipmaps.length;ge++)B.__webglFramebuffer[ge]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(Re)for(let ge=0,ze=ie.length;ge<ze;ge++){let He=n.get(ie[ge]);He.__webglTexture===void 0&&(He.__webglTexture=i.createTexture(),a.memory.textures++)}if(A.samples>0&&Oe(A)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let ge=0;ge<ie.length;ge++){let ze=ie[ge];B.__webglColorRenderbuffer[ge]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[ge]);let He=r.convert(ze.format,ze.colorSpace),ce=r.convert(ze.type),pe=S(ze.internalFormat,He,ce,ze.colorSpace,A.isXRRenderTarget===!0),Ie=R(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ie,pe,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,B.__webglColorRenderbuffer[ge])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),re(B.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),j(i.TEXTURE_CUBE_MAP,_);for(let ge=0;ge<6;ge++)if(_.mipmaps&&_.mipmaps.length>0)for(let ze=0;ze<_.mipmaps.length;ze++)te(B.__webglFramebuffer[ge][ze],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ze);else te(B.__webglFramebuffer[ge],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0);g(_)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Re){for(let ge=0,ze=ie.length;ge<ze;ge++){let He=ie[ge],ce=n.get(He),pe=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(pe=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(pe,ce.__webglTexture),j(pe,He),te(B.__webglFramebuffer,A,He,i.COLOR_ATTACHMENT0+ge,pe,0),g(He)&&p(pe)}t.unbindTexture()}else{let ge=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ge=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ge,Z.__webglTexture),j(ge,_),_.mipmaps&&_.mipmaps.length>0)for(let ze=0;ze<_.mipmaps.length;ze++)te(B.__webglFramebuffer[ze],A,_,i.COLOR_ATTACHMENT0,ge,ze);else te(B.__webglFramebuffer,A,_,i.COLOR_ATTACHMENT0,ge,0);g(_)&&p(ge),t.unbindTexture()}A.depthBuffer&&Se(A)}function Q(A){let _=A.textures;for(let B=0,Z=_.length;B<Z;B++){let ie=_[B];if(g(ie)){let K=v(A),Re=n.get(ie).__webglTexture;t.bindTexture(K,Re),p(K),t.unbindTexture()}}}let ae=[],ne=[];function de(A){if(A.samples>0){if(Oe(A)===!1){let _=A.textures,B=A.width,Z=A.height,ie=i.COLOR_BUFFER_BIT,K=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=n.get(A),ge=_.length>1;if(ge)for(let He=0;He<_.length;He++)t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer);let ze=A.texture.mipmaps;ze&&ze.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let He=0;He<_.length;He++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ie|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ie|=i.STENCIL_BUFFER_BIT)),ge){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Re.__webglColorRenderbuffer[He]);let ce=n.get(_[He]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ce,0)}i.blitFramebuffer(0,0,B,Z,0,0,B,Z,ie,i.NEAREST),l===!0&&(ae.length=0,ne.length=0,ae.push(i.COLOR_ATTACHMENT0+He),A.depthBuffer&&A.resolveDepthBuffer===!1&&(ae.push(K),ne.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ne)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ae))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ge)for(let He=0;He<_.length;He++){t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.RENDERBUFFER,Re.__webglColorRenderbuffer[He]);let ce=n.get(_[He]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.TEXTURE_2D,ce,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){let _=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function R(A){return Math.min(s.maxSamples,A.samples)}function Oe(A){let _=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function xe(A){let _=a.render.frame;u.get(A)!==_&&(u.set(A,_),A.update())}function Ne(A,_){let B=A.colorSpace,Z=A.format,ie=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||B!==qt&&B!==Wn&&(tt.getTransfer(B)===at?(Z!==sn||ie!==hn)&&Fe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ge("WebGLTextures: Unsupported texture color space:",B)),_}function ue(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=V,this.setTexture2D=P,this.setTexture2DArray=N,this.setTexture3D=U,this.setTextureCube=ee,this.rebindTextures=We,this.setupRenderTarget=Ce,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=de,this.setupDepthRenderbuffer=Se,this.setupFrameBufferTexture=te,this.useMultisampledRTT=Oe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Nv(i,e){function t(n,s=Wn){let r,a=tt.getTransfer(s);if(n===hn)return i.UNSIGNED_BYTE;if(n===Tl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Al)return i.UNSIGNED_SHORT_5_5_5_1;if(n===zu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Vu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Bu)return i.BYTE;if(n===ku)return i.SHORT;if(n===Pr)return i.UNSIGNED_SHORT;if(n===Sl)return i.INT;if(n===Gn)return i.UNSIGNED_INT;if(n===vn)return i.FLOAT;if(n===ci)return i.HALF_FLOAT;if(n===Hu)return i.ALPHA;if(n===Gu)return i.RGB;if(n===sn)return i.RGBA;if(n===Jn)return i.DEPTH_COMPONENT;if(n===as)return i.DEPTH_STENCIL;if(n===El)return i.RED;if(n===wl)return i.RED_INTEGER;if(n===Fs)return i.RG;if(n===Cl)return i.RG_INTEGER;if(n===Rl)return i.RGBA_INTEGER;if(n===Ga||n===Wa||n===Xa||n===qa)if(a===at)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ga)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Wa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Xa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===qa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ga)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Wa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Xa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===qa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Il||n===Pl||n===Ll||n===Dl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Il)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Pl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ll)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Dl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Nl||n===Ul||n===Fl||n===Ol||n===Bl||n===kl||n===zl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Nl||n===Ul)return a===at?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Fl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ol)return r.COMPRESSED_R11_EAC;if(n===Bl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===kl)return r.COMPRESSED_RG11_EAC;if(n===zl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Vl||n===Hl||n===Gl||n===Wl||n===Xl||n===ql||n===$l||n===Yl||n===jl||n===Zl||n===Kl||n===Jl||n===Ql||n===ec)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Vl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Hl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Gl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ql)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===$l)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Yl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===jl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Zl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Kl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Jl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ql)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ec)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===tc||n===nc||n===ic)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===tc)return a===at?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===nc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ic)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sc||n===rc||n===ac||n===oc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===sc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===rc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ac)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===oc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Lr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}function Bv(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Yu(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,v,S,y){p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),h(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,v,S):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Yt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Yt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let v=e.get(p),S=v.envMap,y=v.envMapRotation;S&&(g.envMap.value=S,ks.copy(y),ks.x*=-1,ks.y*=-1,ks.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(ks.y*=-1,ks.z*=-1),g.envMapRotation.value.setFromMatrix4(Ov.makeRotationFromEuler(ks)),g.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,v,S){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*v,g.scale.value=S*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function h(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,v){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Yt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let v=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function kv(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,S){let y=S.program;n.uniformBlockBinding(v,y)}function c(v,S){let y=s[v.id];y===void 0&&(m(v),y=u(v),s[v.id]=y,v.addEventListener("dispose",g));let E=S.program;n.updateUBOMapping(v,E);let C=e.render.frame;r[v.id]!==C&&(d(v),r[v.id]=C)}function u(v){let S=h();v.__bindingPointIndex=S;let y=i.createBuffer(),E=v.__size,C=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,E,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,y),y}function h(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Ge("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let S=s[v.id],y=v.uniforms,E=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let C=0,I=y.length;C<I;C++){let b=Array.isArray(y[C])?y[C]:[y[C]];for(let M=0,F=b.length;M<F;M++){let w=b[M];if(f(w,C,M,E)===!0){let V=w.__offset,k=Array.isArray(w.value)?w.value:[w.value],L=0;for(let P=0;P<k.length;P++){let N=k[P],U=x(N);typeof N=="number"||typeof N=="boolean"?(w.__data[0]=N,i.bufferSubData(i.UNIFORM_BUFFER,V+L,w.__data)):N.isMatrix3?(w.__data[0]=N.elements[0],w.__data[1]=N.elements[1],w.__data[2]=N.elements[2],w.__data[3]=0,w.__data[4]=N.elements[3],w.__data[5]=N.elements[4],w.__data[6]=N.elements[5],w.__data[7]=0,w.__data[8]=N.elements[6],w.__data[9]=N.elements[7],w.__data[10]=N.elements[8],w.__data[11]=0):(N.toArray(w.__data,L),L+=U.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,w.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,S,y,E){let C=v.value,I=S+"_"+y;if(E[I]===void 0)return typeof C=="number"||typeof C=="boolean"?E[I]=C:E[I]=C.clone(),!0;{let b=E[I];if(typeof C=="number"||typeof C=="boolean"){if(b!==C)return E[I]=C,!0}else if(b.equals(C)===!1)return b.copy(C),!0}return!1}function m(v){let S=v.uniforms,y=0,E=16;for(let I=0,b=S.length;I<b;I++){let M=Array.isArray(S[I])?S[I]:[S[I]];for(let F=0,w=M.length;F<w;F++){let V=M[F],k=Array.isArray(V.value)?V.value:[V.value];for(let L=0,P=k.length;L<P;L++){let N=k[L],U=x(N),ee=y%E,se=ee%U.boundary,fe=ee+se;y+=se,fe!==0&&E-fe<U.storage&&(y+=E-fe),V.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=y,y+=U.storage}}}let C=y%E;return C>0&&(y+=E-C),v.__size=y,v.__cache={},this}function x(v){let S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=48,S.storage=48):v.isMatrix4?(S.boundary=64,S.storage=64):v.isTexture?Fe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Fe("WebGLRenderer: Unsupported uniform value type.",v),S}function g(v){let S=v.target;S.removeEventListener("dispose",g);let y=a.indexOf(S.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function p(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}function Vv(){return ui===null&&(ui=new Mr(zv,16,16,Fs,ci),ui.name="DFG_LUT",ui.minFilter=Tt,ui.magFilter=Tt,ui.wrapS=on,ui.wrapT=on,ui.generateMipmaps=!1,ui.needsUpdate=!0),ui}var s0,r0,a0,o0,l0,c0,u0,h0,d0,f0,p0,m0,g0,x0,_0,y0,v0,b0,M0,S0,T0,A0,E0,w0,C0,R0,I0,P0,L0,D0,N0,U0,F0,O0,B0,k0,z0,V0,H0,G0,W0,X0,q0,$0,Y0,j0,Z0,K0,J0,Q0,ex,tx,nx,ix,sx,rx,ax,ox,lx,cx,ux,hx,dx,fx,px,mx,gx,xx,_x,yx,vx,bx,Mx,Sx,Tx,Ax,Ex,wx,Cx,Rx,Ix,Px,Lx,Dx,Nx,Ux,Fx,Ox,Bx,kx,zx,Vx,Hx,Gx,Wx,Xx,qx,$x,Yx,jx,Zx,Kx,Jx,Qx,e_,t_,n_,i_,s_,r_,a_,o_,l_,c_,u_,h_,d_,f_,p_,m_,g_,x_,__,y_,v_,b_,M_,S_,T_,A_,E_,w_,C_,R_,I_,P_,L_,D_,N_,U_,F_,Ke,ve,hi,hc,Bs,O_,os,ap,zs,G_,Ya,op,Qu,eh,th,nh,W_,Fr,fc,ty,Rp,rh,Ip,Pp,Lp,hp,dp,fp,pp,mp,ah,oh,lh,ih,Ur,Wy,Xy,_p,jy,dc,tv,nv,sv,av,lv,uv,dv,gv,uh,hh,Sv,wv,Cv,Rv,Iv,wp,ja,sh,Uv,Fv,dh,fh,ks,Ov,zv,ui,pc,ls=Sn(()=>{Ju();Ju();s0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,r0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,a0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,o0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,l0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,c0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,u0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,h0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,d0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,f0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,p0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,m0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,g0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,x0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,_0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,y0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,v0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,b0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,M0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,S0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,T0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,A0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,E0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,w0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,C0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,R0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,I0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,P0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,L0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,D0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,N0="gl_FragColor = linearToOutputTexel( gl_FragColor );",U0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,F0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,O0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,B0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,k0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,z0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,V0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,H0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,G0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,W0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,X0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,q0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Y0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,j0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Z0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,K0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,J0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Q0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ex=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,tx=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,nx=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ix=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,sx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,rx=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ax=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ox=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ux=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,dx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,fx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,px=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,mx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,gx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,xx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_x=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,vx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Mx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Sx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ax=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ex=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,wx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Cx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Rx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ix=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Px=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Dx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Nx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ux=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Fx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ox=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Bx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,kx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,zx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Vx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Hx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Gx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Wx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Xx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,qx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,$x=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Yx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Zx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Kx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Jx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Qx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,e_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,t_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,n_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,i_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,s_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,r_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,a_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,o_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,l_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,u_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,h_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,d_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,f_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,p_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,m_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,g_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,x_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,__=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,v_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,b_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,M_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,T_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,A_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,E_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,C_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,I_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,L_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,D_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,N_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,U_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,F_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ke={alphahash_fragment:s0,alphahash_pars_fragment:r0,alphamap_fragment:a0,alphamap_pars_fragment:o0,alphatest_fragment:l0,alphatest_pars_fragment:c0,aomap_fragment:u0,aomap_pars_fragment:h0,batching_pars_vertex:d0,batching_vertex:f0,begin_vertex:p0,beginnormal_vertex:m0,bsdfs:g0,iridescence_fragment:x0,bumpmap_pars_fragment:_0,clipping_planes_fragment:y0,clipping_planes_pars_fragment:v0,clipping_planes_pars_vertex:b0,clipping_planes_vertex:M0,color_fragment:S0,color_pars_fragment:T0,color_pars_vertex:A0,color_vertex:E0,common:w0,cube_uv_reflection_fragment:C0,defaultnormal_vertex:R0,displacementmap_pars_vertex:I0,displacementmap_vertex:P0,emissivemap_fragment:L0,emissivemap_pars_fragment:D0,colorspace_fragment:N0,colorspace_pars_fragment:U0,envmap_fragment:F0,envmap_common_pars_fragment:O0,envmap_pars_fragment:B0,envmap_pars_vertex:k0,envmap_physical_pars_fragment:Z0,envmap_vertex:z0,fog_vertex:V0,fog_pars_vertex:H0,fog_fragment:G0,fog_pars_fragment:W0,gradientmap_pars_fragment:X0,lightmap_pars_fragment:q0,lights_lambert_fragment:$0,lights_lambert_pars_fragment:Y0,lights_pars_begin:j0,lights_toon_fragment:K0,lights_toon_pars_fragment:J0,lights_phong_fragment:Q0,lights_phong_pars_fragment:ex,lights_physical_fragment:tx,lights_physical_pars_fragment:nx,lights_fragment_begin:ix,lights_fragment_maps:sx,lights_fragment_end:rx,logdepthbuf_fragment:ax,logdepthbuf_pars_fragment:ox,logdepthbuf_pars_vertex:lx,logdepthbuf_vertex:cx,map_fragment:ux,map_pars_fragment:hx,map_particle_fragment:dx,map_particle_pars_fragment:fx,metalnessmap_fragment:px,metalnessmap_pars_fragment:mx,morphinstance_vertex:gx,morphcolor_vertex:xx,morphnormal_vertex:_x,morphtarget_pars_vertex:yx,morphtarget_vertex:vx,normal_fragment_begin:bx,normal_fragment_maps:Mx,normal_pars_fragment:Sx,normal_pars_vertex:Tx,normal_vertex:Ax,normalmap_pars_fragment:Ex,clearcoat_normal_fragment_begin:wx,clearcoat_normal_fragment_maps:Cx,clearcoat_pars_fragment:Rx,iridescence_pars_fragment:Ix,opaque_fragment:Px,packing:Lx,premultiplied_alpha_fragment:Dx,project_vertex:Nx,dithering_fragment:Ux,dithering_pars_fragment:Fx,roughnessmap_fragment:Ox,roughnessmap_pars_fragment:Bx,shadowmap_pars_fragment:kx,shadowmap_pars_vertex:zx,shadowmap_vertex:Vx,shadowmask_pars_fragment:Hx,skinbase_vertex:Gx,skinning_pars_vertex:Wx,skinning_vertex:Xx,skinnormal_vertex:qx,specularmap_fragment:$x,specularmap_pars_fragment:Yx,tonemapping_fragment:jx,tonemapping_pars_fragment:Zx,transmission_fragment:Kx,transmission_pars_fragment:Jx,uv_pars_fragment:Qx,uv_pars_vertex:e_,uv_vertex:t_,worldpos_vertex:n_,background_vert:i_,background_frag:s_,backgroundCube_vert:r_,backgroundCube_frag:a_,cube_vert:o_,cube_frag:l_,depth_vert:c_,depth_frag:u_,distance_vert:h_,distance_frag:d_,equirect_vert:f_,equirect_frag:p_,linedashed_vert:m_,linedashed_frag:g_,meshbasic_vert:x_,meshbasic_frag:__,meshlambert_vert:y_,meshlambert_frag:v_,meshmatcap_vert:b_,meshmatcap_frag:M_,meshnormal_vert:S_,meshnormal_frag:T_,meshphong_vert:A_,meshphong_frag:E_,meshphysical_vert:w_,meshphysical_frag:C_,meshtoon_vert:R_,meshtoon_frag:I_,points_vert:P_,points_frag:L_,shadow_vert:D_,shadow_frag:N_,sprite_vert:U_,sprite_frag:F_},ve={common:{diffuse:{value:new Be(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Be(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Be(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new Be(16777215)},opacity:{value:1},center:{value:new oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},hi={basic:{uniforms:en([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:en([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Be(0)},envMapIntensity:{value:1}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:en([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Be(0)},specular:{value:new Be(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:en([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Be(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:en([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Be(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:en([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:en([ve.points,ve.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:en([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:en([ve.common,ve.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:en([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:en([ve.sprite,ve.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distance:{uniforms:en([ve.common,ve.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distance_vert,fragmentShader:Ke.distance_frag},shadow:{uniforms:en([ve.lights,ve.fog,{color:{value:new Be(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};hi.physical={uniforms:en([hi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new Be(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new Be(0)},specularColor:{value:new Be(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};hc={r:0,b:0,g:0},Bs=new Cn,O_=new Xe;os=4,ap=[.125,.215,.35,.446,.526,.582],zs=20,G_=256,Ya=new oi,op=new Be,Qu=null,eh=0,th=0,nh=!1,W_=new D,Fr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=W_}=r;Qu=this._renderer.getRenderTarget(),eh=this._renderer.getActiveCubeFace(),th=this._renderer.getActiveMipmapLevel(),nh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=up(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Qu,eh,th),this._renderer.xr.enabled=nh,e.scissorTest=!1,Nr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ss||e.mapping===Us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Qu=this._renderer.getRenderTarget(),eh=this._renderer.getActiveCubeFace(),th=this._renderer.getActiveMipmapLevel(),nh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Tt,minFilter:Tt,generateMipmaps:!1,type:ci,format:sn,colorSpace:qt,depthBuffer:!1},s=lp(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lp(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=X_(r)),this._blurMaterial=$_(r,e,t),this._ggxMaterial=q_(r,e,t)}return s}_compileMaterial(e){let t=new ft(new Et,e);this._renderer.compile(t,Ya)}_sceneToCubeUV(e,t,n,s,r){let l=new Rt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(op),h.toneMapping=Hn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ft(new zn,new kn({name:"PMREM.Background",side:Yt,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,p=!1,v=e.background;v?v.isColor&&(g.color.copy(v),e.background=null,p=!0):(g.color.copy(op),p=!0);for(let S=0;S<6;S++){let y=S%3;y===0?(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[S],r.y,r.z)):y===1?(l.up.set(0,0,c[S]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[S],r.z)):(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[S]));let E=this._cubeSize;Nr(s,y*E,S>2?E:0,E,E),h.setRenderTarget(s),p&&h.render(x,l),h.render(e,l)}h.toneMapping=f,h.autoClear=d,e.background=v}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===ss||e.mapping===Us;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=up()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cp());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Nr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Ya)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=0+c*1.25,f=h*d,{_lodMax:m}=this,x=this._sizeLods[n],g=3*x*(n>m-os?n-m+os:0),p=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=m-t,Nr(r,g,p,3*x,2*x),s.setRenderTarget(r),s.render(o,Ya),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,Nr(e,g,p,3*x,2*x),s.setRenderTarget(e),s.render(o,Ya)}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ge("blur direction must be either latitudinal or longitudinal!");let u=3,h=this._lodMeshes[s];h.material=c;let d=c.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*zs-1),x=r/m,g=isFinite(r)?1+Math.floor(u*x):zs;g>zs&&Fe(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${zs}`);let p=[],v=0;for(let I=0;I<zs;++I){let b=I/x,M=Math.exp(-b*b/2);p.push(M),I===0?v+=M:I<g&&(v+=2*M)}for(let I=0;I<p.length;I++)p[I]=p[I]/v;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:S}=this;d.dTheta.value=m,d.mipInt.value=S-n;let y=this._sizeLods[s],E=3*y*(s>S-os?s-S+os:0),C=4*(this._cubeSize-y);Nr(t,E,C,3*y,2*y),l.setRenderTarget(t),l.render(h,Ya)}};fc=class extends gn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ga(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new zn(5,5,5),r=new _n({name:"CubemapFromEquirect",uniforms:Os(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Yt,blending:li});r.uniforms.tEquirect.value=t;let a=new ft(s,r),o=t.minFilter;return t.minFilter===yn&&(t.minFilter=Tt),new xl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};ty={[Pu]:"LINEAR_TONE_MAPPING",[Lu]:"REINHARD_TONE_MAPPING",[Du]:"CINEON_TONE_MAPPING",[Va]:"ACES_FILMIC_TONE_MAPPING",[Uu]:"AGX_TONE_MAPPING",[Fu]:"NEUTRAL_TONE_MAPPING",[Nu]:"CUSTOM_TONE_MAPPING"};Rp=new Nt,rh=new Qi(1,1),Ip=new la,Pp=new Jo,Lp=new ga,hp=[],dp=[],fp=new Float32Array(16),pp=new Float32Array(9),mp=new Float32Array(4);ah=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=My(t.type)}},oh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Hy(t.type)}},lh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},ih=/(\w+)(\])?(\[|\.)?/g;Ur=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Gy(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};Wy=37297,Xy=0;_p=new je;jy={[Pu]:"Linear",[Lu]:"Reinhard",[Du]:"Cineon",[Va]:"ACESFilmic",[Uu]:"AgX",[Fu]:"Neutral",[Nu]:"Custom"};dc=new D;tv=/^[ \t]*#include +<([\w\d./]+)>/gm;nv=new Map;sv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;av={[za]:"SHADOWMAP_TYPE_PCF",[Rr]:"SHADOWMAP_TYPE_VSM"};lv={[ss]:"ENVMAP_TYPE_CUBE",[Us]:"ENVMAP_TYPE_CUBE",[Ha]:"ENVMAP_TYPE_CUBE_UV"};uv={[Us]:"ENVMAP_MODE_REFRACTION"};dv={[vl]:"ENVMAP_BLENDING_MULTIPLY",[Ff]:"ENVMAP_BLENDING_MIX",[Of]:"ENVMAP_BLENDING_ADD"};gv=0,uh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new hh(e),t.set(e,n)),n}},hh=class{constructor(e){this.id=gv++,this.code=e,this.usedTimes=0}};Sv=0;wv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Cv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Rv=[new D(1,0,0),new D(-1,0,0),new D(0,1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1)],Iv=[new D(0,-1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1),new D(0,-1,0),new D(0,-1,0)],wp=new Xe,ja=new D,sh=new D;Uv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Fv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,dh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new xa(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new _n({vertexShader:Uv,fragmentShader:Fv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ft(new Ls(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},fh=class extends Qn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,m=null,x=typeof XRWebGLBinding<"u",g=new dh,p={},v=t.getContextAttributes(),S=null,y=null,E=[],C=[],I=new oe,b=null,M=new Rt;M.viewport=new xt;let F=new Rt;F.viewport=new xt;let w=[M,F],V=new _l,k=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let W=E[O];return W===void 0&&(W=new _r,E[O]=W),W.getTargetRaySpace()},this.getControllerGrip=function(O){let W=E[O];return W===void 0&&(W=new _r,E[O]=W),W.getGripSpace()},this.getHand=function(O){let W=E[O];return W===void 0&&(W=new _r,E[O]=W),W.getHandSpace()};function P(O){let W=C.indexOf(O.inputSource);if(W===-1)return;let te=E[W];te!==void 0&&(te.update(O.inputSource,O.frame,c||a),te.dispatchEvent({type:O.type,data:O.inputSource}))}function N(){s.removeEventListener("select",P),s.removeEventListener("selectstart",P),s.removeEventListener("selectend",P),s.removeEventListener("squeeze",P),s.removeEventListener("squeezestart",P),s.removeEventListener("squeezeend",P),s.removeEventListener("end",N),s.removeEventListener("inputsourceschange",U);for(let O=0;O<E.length;O++){let W=C[O];W!==null&&(C[O]=null,E[O].disconnect(W))}k=null,L=null,g.reset();for(let O in p)delete p[O];e.setRenderTarget(S),f=null,d=null,h=null,s=null,y=null,Y.stop(),n.isPresenting=!1,e.setPixelRatio(b),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){r=O,n.isPresenting===!0&&Fe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){o=O,n.isPresenting===!0&&Fe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(O){c=O},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&x&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(O){if(s=O,s!==null){if(S=e.getRenderTarget(),s.addEventListener("select",P),s.addEventListener("selectstart",P),s.addEventListener("selectend",P),s.addEventListener("squeeze",P),s.addEventListener("squeezestart",P),s.addEventListener("squeezeend",P),s.addEventListener("end",N),s.addEventListener("inputsourceschange",U),v.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(I),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,re=null,le=null;v.depth&&(le=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=v.stencil?as:Jn,re=v.stencil?Lr:Gn);let Se={colorFormat:t.RGBA8,depthFormat:le,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(Se),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new gn(d.textureWidth,d.textureHeight,{format:sn,type:hn,depthTexture:new Qi(d.textureWidth,d.textureHeight,re,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let te={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new gn(f.framebufferWidth,f.framebufferHeight,{format:sn,type:hn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Y.setContext(s),Y.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function U(O){for(let W=0;W<O.removed.length;W++){let te=O.removed[W],re=C.indexOf(te);re>=0&&(C[re]=null,E[re].disconnect(te))}for(let W=0;W<O.added.length;W++){let te=O.added[W],re=C.indexOf(te);if(re===-1){for(let Se=0;Se<E.length;Se++)if(Se>=C.length){C.push(te),re=Se;break}else if(C[Se]===null){C[Se]=te,re=Se;break}if(re===-1)break}let le=E[re];le&&le.connect(te)}}let ee=new D,se=new D;function fe(O,W,te){ee.setFromMatrixPosition(W.matrixWorld),se.setFromMatrixPosition(te.matrixWorld);let re=ee.distanceTo(se),le=W.projectionMatrix.elements,Se=te.projectionMatrix.elements,We=le[14]/(le[10]-1),Ce=le[14]/(le[10]+1),Q=(le[9]+1)/le[5],ae=(le[9]-1)/le[5],ne=(le[8]-1)/le[0],de=(Se[8]+1)/Se[0],R=We*ne,Oe=We*de,xe=re/(-ne+de),Ne=xe*-ne;if(W.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(Ne),O.translateZ(xe),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert(),le[10]===-1)O.projectionMatrix.copy(W.projectionMatrix),O.projectionMatrixInverse.copy(W.projectionMatrixInverse);else{let ue=We+xe,A=Ce+xe,_=R-Ne,B=Oe+(re-Ne),Z=Q*Ce/A*ue,ie=ae*Ce/A*ue;O.projectionMatrix.makePerspective(_,B,Z,ie,ue,A),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}}function ye(O,W){W===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(W.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(s===null)return;let W=O.near,te=O.far;g.texture!==null&&(g.depthNear>0&&(W=g.depthNear),g.depthFar>0&&(te=g.depthFar)),V.near=F.near=M.near=W,V.far=F.far=M.far=te,(k!==V.near||L!==V.far)&&(s.updateRenderState({depthNear:V.near,depthFar:V.far}),k=V.near,L=V.far),V.layers.mask=O.layers.mask|6,M.layers.mask=V.layers.mask&-5,F.layers.mask=V.layers.mask&-3;let re=O.parent,le=V.cameras;ye(V,re);for(let Se=0;Se<le.length;Se++)ye(le[Se],re);le.length===2?fe(V,M,F):V.projectionMatrix.copy(M.projectionMatrix),j(O,V,re)};function j(O,W,te){te===null?O.matrix.copy(W.matrixWorld):(O.matrix.copy(te.matrixWorld),O.matrix.invert(),O.matrix.multiply(W.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(W.projectionMatrix),O.projectionMatrixInverse.copy(W.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=Ts*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(O){l=O,d!==null&&(d.fixedFoveation=O),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=O)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(V)},this.getCameraTexture=function(O){return p[O]};let X=null;function Ae(O,W){if(u=W.getViewerPose(c||a),m=W,u!==null){let te=u.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let re=!1;te.length!==V.cameras.length&&(V.cameras.length=0,re=!0);for(let Ce=0;Ce<te.length;Ce++){let Q=te[Ce],ae=null;if(f!==null)ae=f.getViewport(Q);else{let de=h.getViewSubImage(d,Q);ae=de.viewport,Ce===0&&(e.setRenderTargetTextures(y,de.colorTexture,de.depthStencilTexture),e.setRenderTarget(y))}let ne=w[Ce];ne===void 0&&(ne=new Rt,ne.layers.enable(Ce),ne.viewport=new xt,w[Ce]=ne),ne.matrix.fromArray(Q.transform.matrix),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.projectionMatrix.fromArray(Q.projectionMatrix),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert(),ne.viewport.set(ae.x,ae.y,ae.width,ae.height),Ce===0&&(V.matrix.copy(ne.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),re===!0&&V.cameras.push(ne)}let le=s.enabledFeatures;if(le&&le.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){h=n.getBinding();let Ce=h.getDepthInformation(te[0]);Ce&&Ce.isValid&&Ce.texture&&g.init(Ce,s.renderState)}if(le&&le.includes("camera-access")&&x){e.state.unbindTexture(),h=n.getBinding();for(let Ce=0;Ce<te.length;Ce++){let Q=te[Ce].camera;if(Q){let ae=p[Q];ae||(ae=new xa,p[Q]=ae);let ne=h.getCameraImage(Q);ae.sourceTexture=ne}}}}for(let te=0;te<E.length;te++){let re=C[te],le=E[te];re!==null&&le!==void 0&&le.update(re,W,c||a)}X&&X(O,W),W.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:W}),m=null}let Y=new Cp;Y.setAnimationLoop(Ae),this.setAnimationLoop=function(O){X=O},this.dispose=function(){}}},ks=new Cn,Ov=new Xe;zv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ui=null;pc=class{constructor(e={}){let{canvas:t=Yf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=hn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let x=f,g=new Set([Rl,Cl,wl]),p=new Set([hn,Gn,Pr,Lr,Tl,Al]),v=new Uint32Array(4),S=new Int32Array(4),y=null,E=null,C=[],I=[],b=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let M=this,F=!1;this._outputColorSpace=Ct;let w=0,V=0,k=null,L=-1,P=null,N=new xt,U=new xt,ee=null,se=new Be(0),fe=0,ye=t.width,j=t.height,X=1,Ae=null,Y=null,O=new xt(0,0,ye,j),W=new xt(0,0,ye,j),te=!1,re=new Sr,le=!1,Se=!1,We=new Xe,Ce=new D,Q=new xt,ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ne=!1;function de(){return k===null?X:1}let R=n;function Oe(T,H){return t.getContext(T,H)}try{let T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"183"}`),t.addEventListener("webglcontextlost",Pe,!1),t.addEventListener("webglcontextrestored",$e,!1),t.addEventListener("webglcontextcreationerror",gt,!1),R===null){let H="webgl2";if(R=Oe(H,T),R===null)throw Oe(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw Ge("WebGLRenderer: "+T.message),T}let xe,Ne,ue,A,_,B,Z,ie,K,Re,ge,ze,He,ce,pe,Ie,Le,Te,Je,z,_e,me,we;function he(){xe=new j_(R),xe.init(),_e=new Nv(R,xe),Ne=new V_(R,xe,e,_e),ue=new Lv(R,xe),Ne.reversedDepthBuffer&&d&&ue.buffers.depth.setReversed(!0),A=new J_(R),_=new _v,B=new Dv(R,xe,ue,_,Ne,_e,A),Z=new Y_(M),ie=new i0(R),me=new k_(R,ie),K=new Z_(R,ie,A,me),Re=new ey(R,K,ie,me,A),Te=new Q_(R,Ne,B),pe=new H_(_),ge=new xv(M,Z,xe,Ne,me,pe),ze=new Bv(M,_),He=new vv,ce=new Ev(xe),Le=new B_(M,Z,ue,Re,m,l),Ie=new Pv(M,Re,Ne),we=new kv(R,A,Ne,ue),Je=new z_(R,xe,A),z=new K_(R,xe,A),A.programs=ge.programs,M.capabilities=Ne,M.extensions=xe,M.properties=_,M.renderLists=He,M.shadowMap=Ie,M.state=ue,M.info=A}he(),x!==hn&&(b=new ny(x,t.width,t.height,s,r));let J=new fh(M,R);this.xr=J,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let T=xe.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=xe.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(T){T!==void 0&&(X=T,this.setSize(ye,j,!1))},this.getSize=function(T){return T.set(ye,j)},this.setSize=function(T,H,$=!0){if(J.isPresenting){Fe("WebGLRenderer: Can't change size while VR device is presenting.");return}ye=T,j=H,t.width=Math.floor(T*X),t.height=Math.floor(H*X),$===!0&&(t.style.width=T+"px",t.style.height=H+"px"),b!==null&&b.setSize(t.width,t.height),this.setViewport(0,0,T,H)},this.getDrawingBufferSize=function(T){return T.set(ye*X,j*X).floor()},this.setDrawingBufferSize=function(T,H,$){ye=T,j=H,X=$,t.width=Math.floor(T*$),t.height=Math.floor(H*$),this.setViewport(0,0,T,H)},this.setEffects=function(T){if(x===hn){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let H=0;H<T.length;H++)if(T[H].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(N)},this.getViewport=function(T){return T.copy(O)},this.setViewport=function(T,H,$,q){T.isVector4?O.set(T.x,T.y,T.z,T.w):O.set(T,H,$,q),ue.viewport(N.copy(O).multiplyScalar(X).round())},this.getScissor=function(T){return T.copy(W)},this.setScissor=function(T,H,$,q){T.isVector4?W.set(T.x,T.y,T.z,T.w):W.set(T,H,$,q),ue.scissor(U.copy(W).multiplyScalar(X).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(T){ue.setScissorTest(te=T)},this.setOpaqueSort=function(T){Ae=T},this.setTransparentSort=function(T){Y=T},this.getClearColor=function(T){return T.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor(...arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha(...arguments)},this.clear=function(T=!0,H=!0,$=!0){let q=0;if(T){let G=!1;if(k!==null){let be=k.texture.format;G=g.has(be)}if(G){let be=k.texture.type,Ee=p.has(be),Me=Le.getClearColor(),De=Le.getClearAlpha(),ke=Me.r,Ye=Me.g,Qe=Me.b;Ee?(v[0]=ke,v[1]=Ye,v[2]=Qe,v[3]=De,R.clearBufferuiv(R.COLOR,0,v)):(S[0]=ke,S[1]=Ye,S[2]=Qe,S[3]=De,R.clearBufferiv(R.COLOR,0,S))}else q|=R.COLOR_BUFFER_BIT}H&&(q|=R.DEPTH_BUFFER_BIT),$&&(q|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q!==0&&R.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Pe,!1),t.removeEventListener("webglcontextrestored",$e,!1),t.removeEventListener("webglcontextcreationerror",gt,!1),Le.dispose(),He.dispose(),ce.dispose(),_.dispose(),Z.dispose(),Re.dispose(),me.dispose(),we.dispose(),ge.dispose(),J.dispose(),J.removeEventListener("sessionstart",gd),J.removeEventListener("sessionend",xd),ds.stop()};function Pe(T){T.preventDefault(),aa("WebGLRenderer: Context Lost."),F=!0}function $e(){aa("WebGLRenderer: Context Restored."),F=!1;let T=A.autoReset,H=Ie.enabled,$=Ie.autoUpdate,q=Ie.needsUpdate,G=Ie.type;he(),A.autoReset=T,Ie.enabled=H,Ie.autoUpdate=$,Ie.needsUpdate=q,Ie.type=G}function gt(T){Ge("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ot(T){let H=T.target;H.removeEventListener("dispose",ot),fi(H)}function fi(T){pi(T),_.remove(T)}function pi(T){let H=_.get(T).programs;H!==void 0&&(H.forEach(function($){ge.releaseProgram($)}),T.isShaderMaterial&&ge.releaseShaderCache(T))}this.renderBufferDirect=function(T,H,$,q,G,be){H===null&&(H=ae);let Ee=G.isMesh&&G.matrixWorld.determinant()<0,Me=ym(T,H,$,q,G);ue.setMaterial(q,Ee);let De=$.index,ke=1;if(q.wireframe===!0){if(De=K.getWireframeAttribute($),De===void 0)return;ke=2}let Ye=$.drawRange,Qe=$.attributes.position,Ve=Ye.start*ke,ut=(Ye.start+Ye.count)*ke;be!==null&&(Ve=Math.max(Ve,be.start*ke),ut=Math.min(ut,(be.start+be.count)*ke)),De!==null?(Ve=Math.max(Ve,0),ut=Math.min(ut,De.count)):Qe!=null&&(Ve=Math.max(Ve,0),ut=Math.min(ut,Qe.count));let wt=ut-Ve;if(wt<0||wt===1/0)return;me.setup(G,q,Me,$,De);let At,ht=Je;if(De!==null&&(At=ie.get(De),ht=z,ht.setIndex(At)),G.isMesh)q.wireframe===!0?(ue.setLineWidth(q.wireframeLinewidth*de()),ht.setMode(R.LINES)):ht.setMode(R.TRIANGLES);else if(G.isLine){let jt=q.linewidth;jt===void 0&&(jt=1),ue.setLineWidth(jt*de()),G.isLineSegments?ht.setMode(R.LINES):G.isLineLoop?ht.setMode(R.LINE_LOOP):ht.setMode(R.LINE_STRIP)}else G.isPoints?ht.setMode(R.POINTS):G.isSprite&&ht.setMode(R.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)oa("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ht.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(xe.get("WEBGL_multi_draw"))ht.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let jt=G._multiDrawStarts,Ue=G._multiDrawCounts,fn=G._multiDrawCount,it=De?ie.get(De).bytesPerElement:1,In=_.get(q).currentProgram.getUniforms();for(let qn=0;qn<fn;qn++)In.setValue(R,"_gl_DrawID",qn),ht.render(jt[qn]/it,Ue[qn])}else if(G.isInstancedMesh)ht.renderInstances(Ve,wt,G.count);else if($.isInstancedBufferGeometry){let jt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ue=Math.min($.instanceCount,jt);ht.renderInstances(Ve,wt,Ue)}else ht.render(Ve,wt)};function md(T,H,$){T.transparent===!0&&T.side===Qt&&T.forceSinglePass===!1?(T.side=Yt,T.needsUpdate=!0,eo(T,H,$),T.side=Bn,T.needsUpdate=!0,eo(T,H,$),T.side=Qt):eo(T,H,$)}this.compile=function(T,H,$=null){$===null&&($=T),E=ce.get($),E.init(H),I.push(E),$.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),T!==$&&T.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),E.setupLights();let q=new Set;return T.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let be=G.material;if(be)if(Array.isArray(be))for(let Ee=0;Ee<be.length;Ee++){let Me=be[Ee];md(Me,$,G),q.add(Me)}else md(be,$,G),q.add(be)}),E=I.pop(),q},this.compileAsync=function(T,H,$=null){let q=this.compile(T,H,$);return new Promise(G=>{function be(){if(q.forEach(function(Ee){_.get(Ee).currentProgram.isReady()&&q.delete(Ee)}),q.size===0){G(T);return}setTimeout(be,10)}xe.get("KHR_parallel_shader_compile")!==null?be():setTimeout(be,10)})};let Cc=null;function _m(T){Cc&&Cc(T)}function gd(){ds.stop()}function xd(){ds.start()}let ds=new Cp;ds.setAnimationLoop(_m),typeof self<"u"&&ds.setContext(self),this.setAnimationLoop=function(T){Cc=T,J.setAnimationLoop(T),T===null?ds.stop():ds.start()},J.addEventListener("sessionstart",gd),J.addEventListener("sessionend",xd),this.render=function(T,H){if(H!==void 0&&H.isCamera!==!0){Ge("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;let $=J.enabled===!0&&J.isPresenting===!0,q=b!==null&&(k===null||$)&&b.begin(M,k);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(J.cameraAutoUpdate===!0&&J.updateCamera(H),H=J.getCamera()),T.isScene===!0&&T.onBeforeRender(M,T,H,k),E=ce.get(T,I.length),E.init(H),I.push(E),We.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),re.setFromProjectionMatrix(We,On,H.reversedDepth),Se=this.localClippingEnabled,le=pe.init(this.clippingPlanes,Se),y=He.get(T,C.length),y.init(),C.push(y),J.enabled===!0&&J.isPresenting===!0){let Ee=M.xr.getDepthSensingMesh();Ee!==null&&Rc(Ee,H,-1/0,M.sortObjects)}Rc(T,H,0,M.sortObjects),y.finish(),M.sortObjects===!0&&y.sort(Ae,Y),ne=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,ne&&Le.addToRenderList(y,T),this.info.render.frame++,le===!0&&pe.beginShadows();let G=E.state.shadowsArray;if(Ie.render(G,T,H),le===!0&&pe.endShadows(),this.info.autoReset===!0&&this.info.reset(),(q&&b.hasRenderPass())===!1){let Ee=y.opaque,Me=y.transmissive;if(E.setupLights(),H.isArrayCamera){let De=H.cameras;if(Me.length>0)for(let ke=0,Ye=De.length;ke<Ye;ke++){let Qe=De[ke];yd(Ee,Me,T,Qe)}ne&&Le.render(T);for(let ke=0,Ye=De.length;ke<Ye;ke++){let Qe=De[ke];_d(y,T,Qe,Qe.viewport)}}else Me.length>0&&yd(Ee,Me,T,H),ne&&Le.render(T),_d(y,T,H)}k!==null&&V===0&&(B.updateMultisampleRenderTarget(k),B.updateRenderTargetMipmap(k)),q&&b.end(M),T.isScene===!0&&T.onAfterRender(M,T,H),me.resetDefaultState(),L=-1,P=null,I.pop(),I.length>0?(E=I[I.length-1],le===!0&&pe.setGlobalState(M.clippingPlanes,E.state.camera)):E=null,C.pop(),C.length>0?y=C[C.length-1]:y=null};function Rc(T,H,$,q){if(T.visible===!1)return;if(T.layers.test(H.layers)){if(T.isGroup)$=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(H);else if(T.isLight)E.pushLight(T),T.castShadow&&E.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||re.intersectsSprite(T)){q&&Q.setFromMatrixPosition(T.matrixWorld).applyMatrix4(We);let Ee=Re.update(T),Me=T.material;Me.visible&&y.push(T,Ee,Me,$,Q.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||re.intersectsObject(T))){let Ee=Re.update(T),Me=T.material;if(q&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Q.copy(T.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),Q.copy(Ee.boundingSphere.center)),Q.applyMatrix4(T.matrixWorld).applyMatrix4(We)),Array.isArray(Me)){let De=Ee.groups;for(let ke=0,Ye=De.length;ke<Ye;ke++){let Qe=De[ke],Ve=Me[Qe.materialIndex];Ve&&Ve.visible&&y.push(T,Ee,Ve,$,Q.z,Qe)}}else Me.visible&&y.push(T,Ee,Me,$,Q.z,null)}}let be=T.children;for(let Ee=0,Me=be.length;Ee<Me;Ee++)Rc(be[Ee],H,$,q)}function _d(T,H,$,q){let{opaque:G,transmissive:be,transparent:Ee}=T;E.setupLightsView($),le===!0&&pe.setGlobalState(M.clippingPlanes,$),q&&ue.viewport(N.copy(q)),G.length>0&&Qa(G,H,$),be.length>0&&Qa(be,H,$),Ee.length>0&&Qa(Ee,H,$),ue.buffers.depth.setTest(!0),ue.buffers.depth.setMask(!0),ue.buffers.color.setMask(!0),ue.setPolygonOffset(!1)}function yd(T,H,$,q){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[q.id]===void 0){let Ve=xe.has("EXT_color_buffer_half_float")||xe.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[q.id]=new gn(1,1,{generateMipmaps:!0,type:Ve?ci:hn,minFilter:yn,samples:Math.max(4,Ne.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace})}let be=E.state.transmissionRenderTarget[q.id],Ee=q.viewport||N;be.setSize(Ee.z*M.transmissionResolutionScale,Ee.w*M.transmissionResolutionScale);let Me=M.getRenderTarget(),De=M.getActiveCubeFace(),ke=M.getActiveMipmapLevel();M.setRenderTarget(be),M.getClearColor(se),fe=M.getClearAlpha(),fe<1&&M.setClearColor(16777215,.5),M.clear(),ne&&Le.render($);let Ye=M.toneMapping;M.toneMapping=Hn;let Qe=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),E.setupLightsView(q),le===!0&&pe.setGlobalState(M.clippingPlanes,q),Qa(T,$,q),B.updateMultisampleRenderTarget(be),B.updateRenderTargetMipmap(be),xe.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let ut=0,wt=H.length;ut<wt;ut++){let At=H[ut],{object:ht,geometry:jt,material:Ue,group:fn}=At;if(Ue.side===Qt&&ht.layers.test(q.layers)){let it=Ue.side;Ue.side=Yt,Ue.needsUpdate=!0,vd(ht,$,q,jt,Ue,fn),Ue.side=it,Ue.needsUpdate=!0,Ve=!0}}Ve===!0&&(B.updateMultisampleRenderTarget(be),B.updateRenderTargetMipmap(be))}M.setRenderTarget(Me,De,ke),M.setClearColor(se,fe),Qe!==void 0&&(q.viewport=Qe),M.toneMapping=Ye}function Qa(T,H,$){let q=H.isScene===!0?H.overrideMaterial:null;for(let G=0,be=T.length;G<be;G++){let Ee=T[G],{object:Me,geometry:De,group:ke}=Ee,Ye=Ee.material;Ye.allowOverride===!0&&q!==null&&(Ye=q),Me.layers.test($.layers)&&vd(Me,H,$,De,Ye,ke)}}function vd(T,H,$,q,G,be){T.onBeforeRender(M,H,$,q,G,be),T.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),G.onBeforeRender(M,H,$,q,T,be),G.transparent===!0&&G.side===Qt&&G.forceSinglePass===!1?(G.side=Yt,G.needsUpdate=!0,M.renderBufferDirect($,H,q,G,T,be),G.side=Bn,G.needsUpdate=!0,M.renderBufferDirect($,H,q,G,T,be),G.side=Qt):M.renderBufferDirect($,H,q,G,T,be),T.onAfterRender(M,H,$,q,G,be)}function eo(T,H,$){H.isScene!==!0&&(H=ae);let q=_.get(T),G=E.state.lights,be=E.state.shadowsArray,Ee=G.state.version,Me=ge.getParameters(T,G.state,be,H,$),De=ge.getProgramCacheKey(Me),ke=q.programs;q.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?H.environment:null,q.fog=H.fog;let Ye=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;q.envMap=Z.get(T.envMap||q.environment,Ye),q.envMapRotation=q.environment!==null&&T.envMap===null?H.environmentRotation:T.envMapRotation,ke===void 0&&(T.addEventListener("dispose",ot),ke=new Map,q.programs=ke);let Qe=ke.get(De);if(Qe!==void 0){if(q.currentProgram===Qe&&q.lightsStateVersion===Ee)return Md(T,Me),Qe}else Me.uniforms=ge.getUniforms(T),T.onBeforeCompile(Me,M),Qe=ge.acquireProgram(Me,De),ke.set(De,Qe),q.uniforms=Me.uniforms;let Ve=q.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ve.clippingPlanes=pe.uniform),Md(T,Me),q.needsLights=bm(T),q.lightsStateVersion=Ee,q.needsLights&&(Ve.ambientLightColor.value=G.state.ambient,Ve.lightProbe.value=G.state.probe,Ve.directionalLights.value=G.state.directional,Ve.directionalLightShadows.value=G.state.directionalShadow,Ve.spotLights.value=G.state.spot,Ve.spotLightShadows.value=G.state.spotShadow,Ve.rectAreaLights.value=G.state.rectArea,Ve.ltc_1.value=G.state.rectAreaLTC1,Ve.ltc_2.value=G.state.rectAreaLTC2,Ve.pointLights.value=G.state.point,Ve.pointLightShadows.value=G.state.pointShadow,Ve.hemisphereLights.value=G.state.hemi,Ve.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ve.spotLightMatrix.value=G.state.spotLightMatrix,Ve.spotLightMap.value=G.state.spotLightMap,Ve.pointShadowMatrix.value=G.state.pointShadowMatrix),q.currentProgram=Qe,q.uniformsList=null,Qe}function bd(T){if(T.uniformsList===null){let H=T.currentProgram.getUniforms();T.uniformsList=Ur.seqWithValue(H.seq,T.uniforms)}return T.uniformsList}function Md(T,H){let $=_.get(T);$.outputColorSpace=H.outputColorSpace,$.batching=H.batching,$.batchingColor=H.batchingColor,$.instancing=H.instancing,$.instancingColor=H.instancingColor,$.instancingMorph=H.instancingMorph,$.skinning=H.skinning,$.morphTargets=H.morphTargets,$.morphNormals=H.morphNormals,$.morphColors=H.morphColors,$.morphTargetsCount=H.morphTargetsCount,$.numClippingPlanes=H.numClippingPlanes,$.numIntersection=H.numClipIntersection,$.vertexAlphas=H.vertexAlphas,$.vertexTangents=H.vertexTangents,$.toneMapping=H.toneMapping}function ym(T,H,$,q,G){H.isScene!==!0&&(H=ae),B.resetTextureUnits();let be=H.fog,Ee=q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial?H.environment:null,Me=k===null?M.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:qt,De=q.isMeshStandardMaterial||q.isMeshLambertMaterial&&!q.envMap||q.isMeshPhongMaterial&&!q.envMap,ke=Z.get(q.envMap||Ee,De),Ye=q.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Qe=!!$.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ve=!!$.morphAttributes.position,ut=!!$.morphAttributes.normal,wt=!!$.morphAttributes.color,At=Hn;q.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(At=M.toneMapping);let ht=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,jt=ht!==void 0?ht.length:0,Ue=_.get(q),fn=E.state.lights;if(le===!0&&(Se===!0||T!==P)){let zt=T===P&&q.id===L;pe.setState(q,T,zt)}let it=!1;q.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==fn.state.version||Ue.outputColorSpace!==Me||G.isBatchedMesh&&Ue.batching===!1||!G.isBatchedMesh&&Ue.batching===!0||G.isBatchedMesh&&Ue.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ue.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ue.instancing===!1||!G.isInstancedMesh&&Ue.instancing===!0||G.isSkinnedMesh&&Ue.skinning===!1||!G.isSkinnedMesh&&Ue.skinning===!0||G.isInstancedMesh&&Ue.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ue.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ue.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ue.instancingMorph===!1&&G.morphTexture!==null||Ue.envMap!==ke||q.fog===!0&&Ue.fog!==be||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==pe.numPlanes||Ue.numIntersection!==pe.numIntersection)||Ue.vertexAlphas!==Ye||Ue.vertexTangents!==Qe||Ue.morphTargets!==Ve||Ue.morphNormals!==ut||Ue.morphColors!==wt||Ue.toneMapping!==At||Ue.morphTargetsCount!==jt)&&(it=!0):(it=!0,Ue.__version=q.version);let In=Ue.currentProgram;it===!0&&(In=eo(q,H,G));let qn=!1,fs=!1,$s=!1,mt=In.getUniforms(),Gt=Ue.uniforms;if(ue.useProgram(In.program)&&(qn=!0,fs=!0,$s=!0),q.id!==L&&(L=q.id,fs=!0),qn||P!==T){ue.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),mt.setValue(R,"projectionMatrix",T.projectionMatrix),mt.setValue(R,"viewMatrix",T.matrixWorldInverse);let Ui=mt.map.cameraPosition;Ui!==void 0&&Ui.setValue(R,Ce.setFromMatrixPosition(T.matrixWorld)),Ne.logarithmicDepthBuffer&&mt.setValue(R,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&mt.setValue(R,"isOrthographic",T.isOrthographicCamera===!0),P!==T&&(P=T,fs=!0,$s=!0)}if(Ue.needsLights&&(fn.state.directionalShadowMap.length>0&&mt.setValue(R,"directionalShadowMap",fn.state.directionalShadowMap,B),fn.state.spotShadowMap.length>0&&mt.setValue(R,"spotShadowMap",fn.state.spotShadowMap,B),fn.state.pointShadowMap.length>0&&mt.setValue(R,"pointShadowMap",fn.state.pointShadowMap,B)),G.isSkinnedMesh){mt.setOptional(R,G,"bindMatrix"),mt.setOptional(R,G,"bindMatrixInverse");let zt=G.skeleton;zt&&(zt.boneTexture===null&&zt.computeBoneTexture(),mt.setValue(R,"boneTexture",zt.boneTexture,B))}G.isBatchedMesh&&(mt.setOptional(R,G,"batchingTexture"),mt.setValue(R,"batchingTexture",G._matricesTexture,B),mt.setOptional(R,G,"batchingIdTexture"),mt.setValue(R,"batchingIdTexture",G._indirectTexture,B),mt.setOptional(R,G,"batchingColorTexture"),G._colorsTexture!==null&&mt.setValue(R,"batchingColorTexture",G._colorsTexture,B));let Ni=$.morphAttributes;if((Ni.position!==void 0||Ni.normal!==void 0||Ni.color!==void 0)&&Te.update(G,$,In),(fs||Ue.receiveShadow!==G.receiveShadow)&&(Ue.receiveShadow=G.receiveShadow,mt.setValue(R,"receiveShadow",G.receiveShadow)),(q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial)&&q.envMap===null&&H.environment!==null&&(Gt.envMapIntensity.value=H.environmentIntensity),Gt.dfgLUT!==void 0&&(Gt.dfgLUT.value=Vv()),fs&&(mt.setValue(R,"toneMappingExposure",M.toneMappingExposure),Ue.needsLights&&vm(Gt,$s),be&&q.fog===!0&&ze.refreshFogUniforms(Gt,be),ze.refreshMaterialUniforms(Gt,q,X,j,E.state.transmissionRenderTarget[T.id]),Ur.upload(R,bd(Ue),Gt,B)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Ur.upload(R,bd(Ue),Gt,B),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&mt.setValue(R,"center",G.center),mt.setValue(R,"modelViewMatrix",G.modelViewMatrix),mt.setValue(R,"normalMatrix",G.normalMatrix),mt.setValue(R,"modelMatrix",G.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let zt=q.uniformsGroups;for(let Ui=0,Ys=zt.length;Ui<Ys;Ui++){let Sd=zt[Ui];we.update(Sd,In),we.bind(Sd,In)}}return In}function vm(T,H){T.ambientLightColor.needsUpdate=H,T.lightProbe.needsUpdate=H,T.directionalLights.needsUpdate=H,T.directionalLightShadows.needsUpdate=H,T.pointLights.needsUpdate=H,T.pointLightShadows.needsUpdate=H,T.spotLights.needsUpdate=H,T.spotLightShadows.needsUpdate=H,T.rectAreaLights.needsUpdate=H,T.hemisphereLights.needsUpdate=H}function bm(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return k},this.setRenderTargetTextures=function(T,H,$){let q=_.get(T);q.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),_.get(T.texture).__webglTexture=H,_.get(T.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:$,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,H){let $=_.get(T);$.__webglFramebuffer=H,$.__useDefaultFramebuffer=H===void 0};let Mm=R.createFramebuffer();this.setRenderTarget=function(T,H=0,$=0){k=T,w=H,V=$;let q=null,G=!1,be=!1;if(T){let Me=_.get(T);if(Me.__useDefaultFramebuffer!==void 0){ue.bindFramebuffer(R.FRAMEBUFFER,Me.__webglFramebuffer),N.copy(T.viewport),U.copy(T.scissor),ee=T.scissorTest,ue.viewport(N),ue.scissor(U),ue.setScissorTest(ee),L=-1;return}else if(Me.__webglFramebuffer===void 0)B.setupRenderTarget(T);else if(Me.__hasExternalTextures)B.rebindTextures(T,_.get(T.texture).__webglTexture,_.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Ye=T.depthTexture;if(Me.__boundDepthTexture!==Ye){if(Ye!==null&&_.has(Ye)&&(T.width!==Ye.image.width||T.height!==Ye.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");B.setupDepthRenderbuffer(T)}}let De=T.texture;(De.isData3DTexture||De.isDataArrayTexture||De.isCompressedArrayTexture)&&(be=!0);let ke=_.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(ke[H])?q=ke[H][$]:q=ke[H],G=!0):T.samples>0&&B.useMultisampledRTT(T)===!1?q=_.get(T).__webglMultisampledFramebuffer:Array.isArray(ke)?q=ke[$]:q=ke,N.copy(T.viewport),U.copy(T.scissor),ee=T.scissorTest}else N.copy(O).multiplyScalar(X).floor(),U.copy(W).multiplyScalar(X).floor(),ee=te;if($!==0&&(q=Mm),ue.bindFramebuffer(R.FRAMEBUFFER,q)&&ue.drawBuffers(T,q),ue.viewport(N),ue.scissor(U),ue.setScissorTest(ee),G){let Me=_.get(T.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+H,Me.__webglTexture,$)}else if(be){let Me=H;for(let De=0;De<T.textures.length;De++){let ke=_.get(T.textures[De]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+De,ke.__webglTexture,$,Me)}}else if(T!==null&&$!==0){let Me=_.get(T.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Me.__webglTexture,$)}L=-1},this.readRenderTargetPixels=function(T,H,$,q,G,be,Ee,Me=0){if(!(T&&T.isWebGLRenderTarget)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let De=_.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ee!==void 0&&(De=De[Ee]),De){ue.bindFramebuffer(R.FRAMEBUFFER,De);try{let ke=T.textures[Me],Ye=ke.format,Qe=ke.type;if(T.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+Me),!Ne.textureFormatReadable(Ye)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ne.textureTypeReadable(Qe)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=T.width-q&&$>=0&&$<=T.height-G&&R.readPixels(H,$,q,G,_e.convert(Ye),_e.convert(Qe),be)}finally{let ke=k!==null?_.get(k).__webglFramebuffer:null;ue.bindFramebuffer(R.FRAMEBUFFER,ke)}}},this.readRenderTargetPixelsAsync=async function(T,H,$,q,G,be,Ee,Me=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=_.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ee!==void 0&&(De=De[Ee]),De)if(H>=0&&H<=T.width-q&&$>=0&&$<=T.height-G){ue.bindFramebuffer(R.FRAMEBUFFER,De);let ke=T.textures[Me],Ye=ke.format,Qe=ke.type;if(T.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+Me),!Ne.textureFormatReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ne.textureTypeReadable(Qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ve=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Ve),R.bufferData(R.PIXEL_PACK_BUFFER,be.byteLength,R.STREAM_READ),R.readPixels(H,$,q,G,_e.convert(Ye),_e.convert(Qe),0);let ut=k!==null?_.get(k).__webglFramebuffer:null;ue.bindFramebuffer(R.FRAMEBUFFER,ut);let wt=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Zf(R,wt,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Ve),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,be),R.deleteBuffer(Ve),R.deleteSync(wt),be}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,H=null,$=0){let q=Math.pow(2,-$),G=Math.floor(T.image.width*q),be=Math.floor(T.image.height*q),Ee=H!==null?H.x:0,Me=H!==null?H.y:0;B.setTexture2D(T,0),R.copyTexSubImage2D(R.TEXTURE_2D,$,0,0,Ee,Me,G,be),ue.unbindTexture()};let Sm=R.createFramebuffer(),Tm=R.createFramebuffer();this.copyTextureToTexture=function(T,H,$=null,q=null,G=0,be=0){let Ee,Me,De,ke,Ye,Qe,Ve,ut,wt,At=T.isCompressedTexture?T.mipmaps[be]:T.image;if($!==null)Ee=$.max.x-$.min.x,Me=$.max.y-$.min.y,De=$.isBox3?$.max.z-$.min.z:1,ke=$.min.x,Ye=$.min.y,Qe=$.isBox3?$.min.z:0;else{let Gt=Math.pow(2,-G);Ee=Math.floor(At.width*Gt),Me=Math.floor(At.height*Gt),T.isDataArrayTexture?De=At.depth:T.isData3DTexture?De=Math.floor(At.depth*Gt):De=1,ke=0,Ye=0,Qe=0}q!==null?(Ve=q.x,ut=q.y,wt=q.z):(Ve=0,ut=0,wt=0);let ht=_e.convert(H.format),jt=_e.convert(H.type),Ue;H.isData3DTexture?(B.setTexture3D(H,0),Ue=R.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(B.setTexture2DArray(H,0),Ue=R.TEXTURE_2D_ARRAY):(B.setTexture2D(H,0),Ue=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,H.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,H.unpackAlignment);let fn=R.getParameter(R.UNPACK_ROW_LENGTH),it=R.getParameter(R.UNPACK_IMAGE_HEIGHT),In=R.getParameter(R.UNPACK_SKIP_PIXELS),qn=R.getParameter(R.UNPACK_SKIP_ROWS),fs=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,At.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,At.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,ke),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ye),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Qe);let $s=T.isDataArrayTexture||T.isData3DTexture,mt=H.isDataArrayTexture||H.isData3DTexture;if(T.isDepthTexture){let Gt=_.get(T),Ni=_.get(H),zt=_.get(Gt.__renderTarget),Ui=_.get(Ni.__renderTarget);ue.bindFramebuffer(R.READ_FRAMEBUFFER,zt.__webglFramebuffer),ue.bindFramebuffer(R.DRAW_FRAMEBUFFER,Ui.__webglFramebuffer);for(let Ys=0;Ys<De;Ys++)$s&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,_.get(T).__webglTexture,G,Qe+Ys),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,_.get(H).__webglTexture,be,wt+Ys)),R.blitFramebuffer(ke,Ye,Ee,Me,Ve,ut,Ee,Me,R.DEPTH_BUFFER_BIT,R.NEAREST);ue.bindFramebuffer(R.READ_FRAMEBUFFER,null),ue.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(G!==0||T.isRenderTargetTexture||_.has(T)){let Gt=_.get(T),Ni=_.get(H);ue.bindFramebuffer(R.READ_FRAMEBUFFER,Sm),ue.bindFramebuffer(R.DRAW_FRAMEBUFFER,Tm);for(let zt=0;zt<De;zt++)$s?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Gt.__webglTexture,G,Qe+zt):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Gt.__webglTexture,G),mt?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ni.__webglTexture,be,wt+zt):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Ni.__webglTexture,be),G!==0?R.blitFramebuffer(ke,Ye,Ee,Me,Ve,ut,Ee,Me,R.COLOR_BUFFER_BIT,R.NEAREST):mt?R.copyTexSubImage3D(Ue,be,Ve,ut,wt+zt,ke,Ye,Ee,Me):R.copyTexSubImage2D(Ue,be,Ve,ut,ke,Ye,Ee,Me);ue.bindFramebuffer(R.READ_FRAMEBUFFER,null),ue.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else mt?T.isDataTexture||T.isData3DTexture?R.texSubImage3D(Ue,be,Ve,ut,wt,Ee,Me,De,ht,jt,At.data):H.isCompressedArrayTexture?R.compressedTexSubImage3D(Ue,be,Ve,ut,wt,Ee,Me,De,ht,At.data):R.texSubImage3D(Ue,be,Ve,ut,wt,Ee,Me,De,ht,jt,At):T.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,be,Ve,ut,Ee,Me,ht,jt,At.data):T.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,be,Ve,ut,At.width,At.height,ht,At.data):R.texSubImage2D(R.TEXTURE_2D,be,Ve,ut,Ee,Me,ht,jt,At);R.pixelStorei(R.UNPACK_ROW_LENGTH,fn),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,it),R.pixelStorei(R.UNPACK_SKIP_PIXELS,In),R.pixelStorei(R.UNPACK_SKIP_ROWS,qn),R.pixelStorei(R.UNPACK_SKIP_IMAGES,fs),be===0&&H.generateMipmaps&&R.generateMipmap(Ue),ue.unbindTexture()},this.initRenderTarget=function(T){_.get(T).__webglFramebuffer===void 0&&B.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?B.setTextureCube(T,0):T.isData3DTexture?B.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?B.setTexture2DArray(T,0):B.setTexture2D(T,0),ue.unbindTexture()},this.resetState=function(){w=0,V=0,k=null,ue.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}}});function Vs(i,e,t=i.armStyle||"clasico"){let n=no(i,e,t),s=128,r=Dt(i,1),a=Math.max(...r.map(S=>S[1])),o=Math.min(...r.map(S=>S[1])),l=Number(i.materialDepth??6)*.04/2,c=new Rs(n.hookLocal.map(S=>new D(...S))),u=Array.from({length:s+1},(S,y)=>({point:c.getPoint(y/s).toArray(),height:n.hookWidth,depth:l,t:y/s})),h=Br(u),d=Number(n.nominalLength)*.04-h;if(!(d>0))throw new Error("La patilla no admite el largo solicitado.");function f(S){let y=new Rs(n.stem.map(([E,C,I])=>new D(E,C,I*S)));return Array.from({length:s+1},(E,C)=>{let I=C/s,b=y.getPoint(I).toArray(),M=n.shaftWidth+(n.hookWidth-n.shaftWidth)*Wv(I,t),F=Math.min(M,a-o);return b[1]=Math.max(o+F/2,Math.min(a-F/2,b[1])),{point:b,height:M,depth:l,t:I}})}let m=.01,x=2;if(Br(f(m))>d)throw new Error("El ancho o la curva de patilla no admite este largo.");for(;Br(f(x))<d;)x*=2;for(let S=0;S<32;S++){let y=(m+x)/2;Br(f(y))>d?x=y:m=y}let g=f((m+x)/2),p=g.at(-1).point,v=u.map(S=>({...S,point:S.point.map((y,E)=>y+p[E])}));return{stem:g,hook:v,plan:n,developedLength:(Br(g)+Br(v))/.04}}function Dp(i,e,t=i.armStyle||"clasico"){let n=Vs(i,e,t),s=[...n.stem,...n.hook.slice(1)],r=0,a=s[0].point,o=s.map((u,h)=>{if(h){let d=s[h-1].point,f=u.point;r+=Math.hypot(f[0]-d[0],f[2]-d[2])/.04}return{x:r,y:-(u.point[1]-a[1])/.04,width:u.height/.04,t:u.t}}),l=o.map(u=>[u.x,u.y-u.width/2]),c=o.map(u=>[u.x,u.y+u.width/2]);return{outline:[...l,...c.reverse()],centerline:o.map(u=>[u.x,u.y]),developedLength:n.developedLength,nominalLength:n.plan.nominalLength,hinge:[0,0]}}var Gv,Br,Wv,xc=Sn(()=>{ls();Oi();Gv=(i,e)=>Math.hypot(...i.map((t,n)=>t-e[n])),Br=i=>i.slice(1).reduce((e,t,n)=>e+Gv(t.point,i[n].point),0),Wv=(i,e)=>{let t=e==="fino"?.04:.18,n=e==="fino"?.72:1,s=Math.max(0,Math.min(1,(i-t)/(n-t)));return s*s*(3-2*s)}});function tb(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function nb(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function ib(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent($p),this.state=pt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function sb(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ns.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=pt.DOLLY;break;case ns.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=pt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=pt.ROTATE}break;case ns.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=pt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=pt.PAN}break;default:this.state=pt.NONE}this.state!==pt.NONE&&this.dispatchEvent(yh)}function rb(i){switch(this.state){case pt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case pt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case pt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function ab(i){this.enabled===!1||this.enableZoom===!1||this.state!==pt.NONE||(i.preventDefault(),this.dispatchEvent(yh),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent($p))}function ob(i){this.enabled!==!1&&this._handleKeyDown(i)}function lb(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case is.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=pt.TOUCH_ROTATE;break;case is.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=pt.TOUCH_PAN;break;default:this.state=pt.NONE}break;case 2:switch(this.touches.TWO){case is.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=pt.TOUCH_DOLLY_PAN;break;case is.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=pt.TOUCH_DOLLY_ROTATE;break;default:this.state=pt.NONE}break;default:this.state=pt.NONE}this.state!==pt.NONE&&this.dispatchEvent(yh)}function cb(i){switch(this._trackPointer(i),this.state){case pt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case pt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case pt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case pt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=pt.NONE}}function ub(i){this.enabled!==!1&&i.preventDefault()}function hb(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function db(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Xp,yh,$p,Mc,qp,eb,Bt,dn,pt,_h,Sc,Yp=Sn(()=>{ls();Xp={type:"change"},yh={type:"start"},$p={type:"end"},Mc=new Ei,qp=new En,eb=Math.cos(70*rn.DEG2RAD),Bt=new D,dn=2*Math.PI,pt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},_h=1e-6,Sc=class extends ka{constructor(e,t=null){super(e,t),this.state=pt.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ns.ROTATE,MIDDLE:ns.DOLLY,RIGHT:ns.PAN},this.touches={ONE:is.ROTATE,TWO:is.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new Ht,this._lastTargetPosition=new D,this._quat=new Ht().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Cr,this._sphericalDelta=new Cr,this._scale=1,this._panOffset=new D,this._rotateStart=new oe,this._rotateEnd=new oe,this._rotateDelta=new oe,this._panStart=new oe,this._panEnd=new oe,this._panDelta=new oe,this._dollyStart=new oe,this._dollyEnd=new oe,this._dollyDelta=new oe,this._dollyDirection=new D,this._mouse=new oe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=nb.bind(this),this._onPointerDown=tb.bind(this),this._onPointerUp=ib.bind(this),this._onContextMenu=ub.bind(this),this._onMouseWheel=ab.bind(this),this._onKeyDown=ob.bind(this),this._onTouchStart=lb.bind(this),this._onTouchMove=cb.bind(this),this._onMouseDown=sb.bind(this),this._onMouseMove=rb.bind(this),this._interceptControlDown=hb.bind(this),this._interceptControlUp=db.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Xp),this.update(),this.state=pt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;Bt.copy(t).sub(this.target),Bt.applyQuaternion(this._quat),this._spherical.setFromVector3(Bt),this.autoRotate&&this.state===pt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=dn:n>Math.PI&&(n-=dn),s<-Math.PI?s+=dn:s>Math.PI&&(s-=dn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Bt.setFromSpherical(this._spherical),Bt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Bt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=Bt.length();a=this._clampDistance(o*this._scale);let l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let o=new D(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Bt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Mc.origin.copy(this.object.position),Mc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Mc.direction))<eb?this.object.lookAt(this.target):(qp.setFromNormalAndCoplanarPoint(this.object.up,this.target),Mc.intersectPlane(qp,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>_h||8*(1-this._lastQuaternion.dot(this.object.quaternion))>_h||this._lastTargetPosition.distanceToSquared(this.target)>_h?(this.dispatchEvent(Xp),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?dn/60*this.autoRotateSpeed*e:dn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Bt.setFromMatrixColumn(t,0),Bt.multiplyScalar(-e),this._panOffset.add(Bt)}_panUp(e,t){this.screenSpacePanning===!0?Bt.setFromMatrixColumn(t,1):(Bt.setFromMatrixColumn(t,0),Bt.crossVectors(this.object.up,Bt)),Bt.multiplyScalar(e),this._panOffset.add(Bt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Bt.copy(s).sub(this.target);let r=Bt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(dn*this._rotateDelta.x/t.clientHeight),this._rotateUp(dn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(dn*this._rotateDelta.x/t.clientHeight),this._rotateUp(dn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new oe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}});function zr(i){return new Ca({color:0,emissive:16777215,emissiveIntensity:i})}var Tc,jp=Sn(()=>{ls();Tc=class extends ei{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let e=new zn;e.deleteAttribute("uv");let t=new ti({side:Yt}),n=new ti,s=new Ns(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new ft(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new As(e,n,6),o=new _t;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let l=new ft(e,zr(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new ft(e,zr(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let u=new ft(e,zr(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);let h=new ft(e,zr(43));h.position.set(-.462,8.89,14.52),h.scale.set(4.38,5.441,.088),this.add(h);let d=new ft(e,zr(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new ft(e,zr(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}}});function vh(i,e){if(e===Wu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===Dr||e===$a){let t=i.getIndex();if(t===null){let a=[],o=i.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);i.setIndex(a),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===Dr)for(let a=1;a<=n;a++)s.push(t.getX(0)),s.push(t.getX(a)),s.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(s.push(t.getX(a)),s.push(t.getX(a+1)),s.push(t.getX(a+2))):(s.push(t.getX(a+2)),s.push(t.getX(a+1)),s.push(t.getX(a)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}var Zp=Sn(()=>{ls()});function Kp(i){let e=new Map,t=new Map,n=i.clone();return Jp(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Jp(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)Jp(i.children[n],e.children[n],t)}var Qp=Sn(()=>{});function fb(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function It(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}function gb(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new ti({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Bn})),i.DefaultMaterial}function Ws(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function di(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function xb(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,u=e.length;c<u;c++){let h=e[c];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(s=!0),h.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let a=[],o=[],l=[];for(let c=0,u=e.length;c<u;c++){let h=e[c];if(n){let d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):i.attributes.position;a.push(d)}if(s){let d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):i.attributes.normal;o.push(d)}if(r){let d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):i.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let u=c[0],h=c[1],d=c[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=h),r&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function _b(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function yb(i){let e,t=i.extensions&&i.extensions[et.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Sh(t.attributes):e=i.indices+":"+Sh(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Sh(i.targets[n]);return e}function Sh(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function $h(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function vb(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}function Mb(i,e,t){let n=e.attributes,s=new nn;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new D(l[0],l[1],l[2]),new D(c[0],c[1],c[2])),o.normalized){let u=$h(Vr[o.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let o=new D,l=new D;for(let c=0,u=r.length;c<u;c++){let h=r[c];if(h.POSITION!==void 0){let d=t.json.accessors[h.POSITION],f=d.min,m=d.max;if(f!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),d.normalized){let x=$h(Vr[d.componentType]);l.multiplyScalar(x)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;let a=new cn;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function im(i,e,t){let n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){i.setAttribute(o,l)})}for(let a in n){let o=qh[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){let a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return tt.workingColorSpace!==qt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${tt.workingColorSpace}" not supported.`),di(i,e),Mb(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?xb(i,e.targets,t):i})}var Ac,et,Th,Ah,Eh,wh,Ch,Rh,Ih,Ph,Lh,Dh,Nh,Uh,Fh,Oh,Bh,kh,Ec,zh,sm,Ka,em,Vh,Hh,Gh,Wh,wc,pb,Xh,Rn,Vr,tm,nm,bh,qh,us,mb,Mh,bb,Yh,rm=Sn(()=>{ls();Zp();Qp();Ac=class extends ai{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new wh(t)}),this.register(function(t){return new Ch(t)}),this.register(function(t){return new Oh(t)}),this.register(function(t){return new Bh(t)}),this.register(function(t){return new kh(t)}),this.register(function(t){return new Ih(t)}),this.register(function(t){return new Ph(t)}),this.register(function(t){return new Lh(t)}),this.register(function(t){return new Dh(t)}),this.register(function(t){return new Eh(t)}),this.register(function(t){return new Nh(t)}),this.register(function(t){return new Rh(t)}),this.register(function(t){return new Fh(t)}),this.register(function(t){return new Uh(t)}),this.register(function(t){return new Th(t)}),this.register(function(t){return new Ec(t,et.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ec(t,et.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new zh(t)})}load(e,t,n,s){let r=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=Ri.extractUrlBase(e);a=Ri.resolveURL(c,this.path)}else a=Ri.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new wr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(u){t(u),r.manager.itemEnd(e)},o)}catch(u){o(u)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===sm){try{a[et.KHR_BINARY_GLTF]=new Vh(e)}catch(h){s&&s(h);return}r=JSON.parse(a[et.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Yh(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[h.name]=h,a[h.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){let h=r.extensionsUsed[u],d=r.extensionsRequired||[];switch(h){case et.KHR_MATERIALS_UNLIT:a[h]=new Ah;break;case et.KHR_DRACO_MESH_COMPRESSION:a[h]=new Hh(r,this.dracoLoader);break;case et.KHR_TEXTURE_TRANSFORM:a[h]=new Gh;break;case et.KHR_MESH_QUANTIZATION:a[h]=new Wh;break;default:d.indexOf(h)>=0&&o[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};et={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Th=class{constructor(e){this.parser=e,this.name=et.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,u=new Be(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],qt);let h=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new ts(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Ns(u),c.distance=h;break;case"spot":c=new Ua(u),c.distance=h,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),di(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}},Ah=class{constructor(){this.name=et.KHR_MATERIALS_UNLIT}getMaterialType(){return kn}extendParams(e,t,n){let s=[];e.color=new Be(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],qt),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,Ct))}return Promise.all(s)}},Eh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=It(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},wh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return It(this.parser,e,this.name)!==null?$t:null}extendMaterialParams(e,t){let n=It(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new oe(r,r)}return Promise.all(s)}},Ch=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_DISPERSION}getMaterialType(e){return It(this.parser,e,this.name)!==null?$t:null}extendMaterialParams(e,t){let n=It(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Rh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return It(this.parser,e,this.name)!==null?$t:null}extendMaterialParams(e,t){let n=It(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},Ih=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SHEEN}getMaterialType(e){return It(this.parser,e,this.name)!==null?$t:null}extendMaterialParams(e,t){let n=It(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new Be(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],qt)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Ct)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},Ph=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return It(this.parser,e,this.name)!==null?$t:null}extendMaterialParams(e,t){let n=It(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},Lh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_VOLUME}getMaterialType(e){return It(this.parser,e,this.name)!==null?$t:null}extendMaterialParams(e,t){let n=It(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Be().setRGB(r[0],r[1],r[2],qt),Promise.all(s)}},Dh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IOR}getMaterialType(e){return It(this.parser,e,this.name)!==null?$t:null}extendMaterialParams(e,t){let n=It(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5),Promise.resolve()}},Nh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SPECULAR}getMaterialType(e){return It(this.parser,e,this.name)!==null?$t:null}extendMaterialParams(e,t){let n=It(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new Be().setRGB(r[0],r[1],r[2],qt),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Ct)),Promise.all(s)}},Uh=class{constructor(e){this.parser=e,this.name=et.EXT_MATERIALS_BUMP}getMaterialType(e){return It(this.parser,e,this.name)!==null?$t:null}extendMaterialParams(e,t){let n=It(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},Fh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return It(this.parser,e,this.name)!==null?$t:null}extendMaterialParams(e,t){let n=It(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},Oh=class{constructor(e){this.parser=e,this.name=et.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}},Bh=class{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},kh=class{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},Ec=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){let l=s.byteOffset||0,c=s.byteLength||0,u=s.count,h=s.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(u,h,d,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){let f=new ArrayBuffer(u*h);return a.decodeGltfBuffer(new Uint8Array(f),u,h,d,s.mode,s.filter),f})})}else return null}},zh=class{constructor(e){this.name=et.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==Rn.TRIANGLES&&c.mode!==Rn.TRIANGLE_STRIP&&c.mode!==Rn.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(u=>(l[c]=u,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let u=c.pop(),h=u.isGroup?u.children:[u],d=c[0].count,f=[];for(let m of h){let x=new Xe,g=new D,p=new Ht,v=new D(1,1,1),S=new As(m.geometry,m.material,d);for(let y=0;y<d;y++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,y),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,y),l.SCALE&&v.fromBufferAttribute(l.SCALE,y),S.setMatrixAt(y,x.compose(g,p,v));for(let y in l)if(y==="_COLOR_0"){let E=l[y];S.instanceColor=new Ki(E.array,E.itemSize,E.normalized)}else y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"&&m.geometry.setAttribute(y,l[y]);_t.prototype.copy.call(S,m),this.parser.assignFinalMaterial(S),f.push(S)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},sm="glTF",Ka=12,em={JSON:1313821514,BIN:5130562},Vh=class{constructor(e){this.name=et.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Ka),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==sm)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-Ka,r=new DataView(e,Ka),a=0;for(;a<s;){let o=r.getUint32(a,!0);a+=4;let l=r.getUint32(a,!0);if(a+=4,l===em.JSON){let c=new Uint8Array(e,Ka+a,o);this.content=n.decode(c)}else if(l===em.BIN){let c=Ka+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Hh=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=et.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let u in a){let h=qh[u]||u.toLowerCase();o[h]=a[u]}for(let u in e.attributes){let h=qh[u]||u.toLowerCase();if(a[u]!==void 0){let d=n.accessors[e.attributes[u]],f=Vr[d.componentType];c[h]=f.name,l[h]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(h,d){s.decodeDracoFile(u,function(f){for(let m in f.attributes){let x=f.attributes[m],g=l[m];g!==void 0&&(x.normalized=g)}h(f)},o,c,qt,d)})})}},Gh=class{constructor(){this.name=et.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},Wh=class{constructor(){this.name=et.KHR_MESH_QUANTIZATION}},wc=class extends ni{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,u=s-t,h=(n-t)/u,d=h*h,f=d*h,m=e*c,x=m-c,g=-2*f+3*d,p=f-d,v=1-g,S=p-d+h;for(let y=0;y!==o;y++){let E=a[x+y+o],C=a[x+y+l]*u,I=a[m+y+o],b=a[m+y]*u;r[y]=v*E+S*C+g*I+p*b}return r}},pb=new Ht,Xh=class extends wc{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return pb.fromArray(r).normalize().toArray(r),r}},Rn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Vr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},tm={9728:St,9729:Tt,9984:Ir,9985:rs,9986:Ii,9987:yn},nm={33071:on,33648:ji,10497:Kn},bh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},qh={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},us={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},mb={CUBICSPLINE:void 0,LINEAR:Ai,STEP:Ti},Mh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};bb=new Xe,Yh=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new fb,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?this.textureLoader=new Pa(this.options.manager):this.textureLoader=new Fa(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new wr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return Ws(r,o,s),di(o,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,u]of a.children.entries())r(u,o.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[et.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,a){n.load(Ri.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let a=bh[s.type],o=Vr[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new dt(c,a,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){let o=a[0],l=bh[s.type],c=Vr[s.componentType],u=c.BYTES_PER_ELEMENT,h=u*l,d=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0,x,g;if(f&&f!==h){let p=Math.floor(d/f),v="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count,S=t.cache.get(v);S||(x=new c(o,p*f,s.count*f/u),S=new yr(x,f/u),t.cache.add(v,S)),g=new vr(S,l,d%f/u,m)}else o===null?x=new c(s.count*l):x=new c(o,d,s.count*l),g=new dt(x,l,m);if(s.sparse!==void 0){let p=bh.SCALAR,v=Vr[s.sparse.indices.componentType],S=s.sparse.indices.byteOffset||0,y=s.sparse.values.byteOffset||0,E=new v(a[1],S,s.sparse.count*p),C=new c(a[2],y,s.sparse.count*l);o!==null&&(g=new dt(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let I=0,b=E.length;I<b;I++){let M=E[I];if(g.setX(M,C[I*l]),l>=2&&g.setY(M,C[I*l+1]),l>=3&&g.setZ(M,C[I*l+2]),l>=4&&g.setW(M,C[I*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r],o=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){let s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=a.name||o.name||"",u.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(u.name=o.uri);let d=(r.samplers||{})[a.sampler]||{};return u.magFilter=tm[d.magFilter]||Tt,u.minFilter=tm[d.minFilter]||yn,u.wrapS=nm[d.wrapS]||Kn,u.wrapT=nm[d.wrapT]||Kn,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==St&&u.minFilter!==Tt,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());let a=s.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(h){c=!0;let d=new Blob([h],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(l).then(function(h){return new Promise(function(d,f){let m=d;t.isImageBitmapLoader===!0&&(m=function(x){let g=new Nt(x);g.needsUpdate=!0,d(g)}),t.load(Ri.resolveURL(h,r.path),m,void 0,f)})}).then(function(h){return c===!0&&o.revokeObjectURL(l),di(h,a),h.userData.mimeType=a.mimeType||vb(a.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[et.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[et.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=r.associations.get(a);a=r.extensions[et.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Tr,Jt.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Ji,Jt.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return ti}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],a,o={},l=r.extensions||{},c=[];if(l[et.KHR_MATERIALS_UNLIT]){let h=s[et.KHR_MATERIALS_UNLIT];a=h.getMaterialType(),c.push(h.extendParams(o,r,t))}else{let h=r.pbrMetallicRoughness||{};if(o.color=new Be(1,1,1),o.opacity=1,Array.isArray(h.baseColorFactor)){let d=h.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],qt),o.opacity=d[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",h.baseColorTexture,Ct)),o.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,o.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",h.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Qt);let u=r.alphaMode||Mh.OPAQUE;if(u===Mh.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,u===Mh.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==kn&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new oe(1,1),r.normalTexture.scale!==void 0)){let h=r.normalTexture.scale;o.normalScale.set(h,h)}if(r.occlusionTexture!==void 0&&a!==kn&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==kn){let h=r.emissiveFactor;o.emissive=new Be().setRGB(h[0],h[1],h[2],qt)}return r.emissiveTexture!==void 0&&a!==kn&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Ct)),Promise.all(c).then(function(){let h=new a(o);return r.name&&(h.name=r.name),di(h,r),t.associations.set(h,{materials:e}),r.extensions&&Ws(s,h,r),h})}createUniqueName(e){let t=st.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[et.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return im(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],u=yb(c),h=s[u];if(h)a.push(h.promise);else{let d;c.extensions&&c.extensions[et.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=im(new Et,c,t),s[u]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let u=a[l].material===void 0?gb(this.cache):this.getDependency("material",a[l].material);o.push(u)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){let c=l.slice(0,l.length-1),u=l[l.length-1],h=[];for(let f=0,m=u.length;f<m;f++){let x=u[f],g=a[f],p,v=c[f];if(g.mode===Rn.TRIANGLES||g.mode===Rn.TRIANGLE_STRIP||g.mode===Rn.TRIANGLE_FAN||g.mode===void 0)p=r.isSkinnedMesh===!0?new da(x,v):new ft(x,v),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),g.mode===Rn.TRIANGLE_STRIP?p.geometry=vh(p.geometry,$a):g.mode===Rn.TRIANGLE_FAN&&(p.geometry=vh(p.geometry,Dr));else if(g.mode===Rn.LINES)p=new ws(x,v);else if(g.mode===Rn.LINE_STRIP)p=new Es(x,v);else if(g.mode===Rn.LINE_LOOP)p=new pa(x,v);else if(g.mode===Rn.POINTS)p=new ma(x,v);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&_b(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),di(p,r),g.extensions&&Ws(s,p,g),t.assignFinalMaterial(p),h.push(p)}for(let f=0,m=h.length;f<m;f++)t.associations.set(h[f],{meshes:e,primitives:f});if(h.length===1)return r.extensions&&Ws(s,h[0],r),h[0];let d=new ln;r.extensions&&Ws(s,d,r),t.associations.set(d,{meshes:e});for(let f=0,m=h.length;f<m;f++)d.add(h[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Rt(rn.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new oi(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),di(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),a=s,o=[],l=[];for(let c=0,u=a.length;c<u;c++){let h=a[c];if(h){o.push(h);let d=new Xe;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new fa(o,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],u=[];for(let h=0,d=s.channels.length;h<d;h++){let f=s.channels[h],m=s.samplers[f.sampler],x=f.target,g=x.node,p=s.parameters!==void 0?s.parameters[m.input]:m.input,v=s.parameters!==void 0?s.parameters[m.output]:m.output;x.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",v)),c.push(m),u.push(x))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(h){let d=h[0],f=h[1],m=h[2],x=h[3],g=h[4],p=[];for(let S=0,y=d.length;S<y;S++){let E=d[S],C=f[S],I=m[S],b=x[S],M=g[S];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();let F=n._createAnimationTracks(E,C,I,b,M);if(F)for(let w=0;w<F.length;w++)p.push(F[w])}let v=new Ia(r,void 0,p);return di(v,s),v})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,u=o.length;c<u;c++)a.push(n.getDependency("node",o[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){let u=c[0],h=c[1],d=c[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,bb)});for(let f=0,m=h.length;f<m;f++)u.add(h[f]);if(u.userData.pivot!==void 0&&h.length>0){let f=u.userData.pivot,m=h[0];u.pivot=new D().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],m.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let u;if(r.isBone===!0?u=new br:c.length>1?u=new ln:c.length===1?u=c[0]:u=new _t,u!==c[0])for(let h=0,d=c.length;h<d;h++)u.add(c[h]);if(r.name&&(u.userData.name=r.name,u.name=a),di(u,r),r.extensions&&Ws(n,u,r),r.matrix!==void 0){let h=new Xe;h.fromArray(r.matrix),u.applyMatrix4(h)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let h=s.associations.get(u);s.associations.set(u,{...h})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new ln;n.name&&(r.name=s.createUniqueName(n.name)),di(r,n),n.extensions&&Ws(t,r,n);let a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let u=0,h=l.length;u<h;u++){let d=l[u];d.parent!==null?r.add(Kp(d)):r.add(d)}let c=u=>{let h=new Map;for(let[d,f]of s.associations)(d instanceof Jt||d instanceof Nt)&&h.set(d,f);return u.traverse(d=>{let f=s.associations.get(d);f!=null&&h.set(d,f)}),h};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let a=[],o=e.name?e.name:e.uuid,l=[];us[r.path]===us.weights?e.traverse(function(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}):l.push(o);let c;switch(us[r.path]){case us.weights:c=ii;break;case us.rotation:c=si;break;case us.translation:case us.scale:c=ri;break;default:n.itemSize===1?c=ii:c=ri;break}let u=s.interpolation!==void 0?mb[s.interpolation]:Ai,h=this._getArrayFromAccessor(n);for(let d=0,f=l.length;d<f;d++){let m=new c(l[d]+"."+us[r.path],t.array,h,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),a.push(m)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=$h(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof si?Xh:wc;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}});function Di(i,e){return i.length===e.length&&i.every(function(t,n){return t===e[n]})}function Cb(i){return new TextEncoder().encode(i).buffer}function Rb(i){return Di(i.elements,[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}function Ib(i,e,t){let n={min:new Array(i.itemSize).fill(Number.POSITIVE_INFINITY),max:new Array(i.itemSize).fill(Number.NEGATIVE_INFINITY)};for(let s=e;s<e+t;s++)for(let r=0;r<i.itemSize;r++){let a;i.itemSize>4?a=i.array[s*i.itemSize+r]:(r===0?a=i.getX(s):r===1?a=i.getY(s):r===2?a=i.getZ(s):r===3&&(a=i.getW(s)),i.normalized===!0&&(a=rn.normalize(a,i.array))),n.min[r]=Math.min(n.min[r],a),n.max[r]=Math.max(n.max[r],a)}return n}function hm(i){return Math.ceil(i/4)*4}function Zh(i,e=0){let t=hm(i.byteLength);if(t!==i.byteLength){let n=new Uint8Array(t);if(n.set(new Uint8Array(i)),e!==0)for(let s=i.byteLength;s<t;s++)n[s]=e;return n.buffer}return i}function um(){return typeof document>"u"&&typeof OffscreenCanvas<"u"?new OffscreenCanvas(1,1):document.createElement("canvas")}function Pb(i,e){if(typeof OffscreenCanvas<"u"&&i instanceof OffscreenCanvas){let t;return e==="image/jpeg"?t=.92:e==="image/webp"&&(t=.8),i.convertToBlob({type:e,quality:t})}else return new Promise(t=>i.toBlob(t,e))}var am,hs,nt,jh,bn,om,Sb,lm,Tb,Ab,cm,Eb,wb,Kh,Jh,Qh,ed,td,nd,id,sd,rd,ad,od,ld,cd,ud,hd,dm=Sn(()=>{ls();am={POSITION:["byte","byte normalized","unsigned byte","unsigned byte normalized","short","short normalized","unsigned short","unsigned short normalized"],NORMAL:["byte normalized","short normalized"],TANGENT:["byte normalized","short normalized"],TEXCOORD:["byte","byte normalized","unsigned byte","short","short normalized","unsigned short"]},hs=class{constructor(){this.textureUtils=null,this.pluginCallbacks=[],this.register(function(e){return new Jh(e)}),this.register(function(e){return new Qh(e)}),this.register(function(e){return new id(e)}),this.register(function(e){return new sd(e)}),this.register(function(e){return new rd(e)}),this.register(function(e){return new ad(e)}),this.register(function(e){return new ed(e)}),this.register(function(e){return new td(e)}),this.register(function(e){return new nd(e)}),this.register(function(e){return new od(e)}),this.register(function(e){return new ld(e)}),this.register(function(e){return new cd(e)}),this.register(function(e){return new ud(e)}),this.register(function(e){return new hd(e)})}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}setTextureUtils(e){return this.textureUtils=e,this}parse(e,t,n,s){let r=new Kh,a=[];for(let o=0,l=this.pluginCallbacks.length;o<l;o++)a.push(this.pluginCallbacks[o](r));r.setPlugins(a),r.setTextureUtils(this.textureUtils),r.writeAsync(e,t,s).catch(n)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,s,r,t)})}},nt={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,INT:5124,UNSIGNED_INT:5125,FLOAT:5126,ARRAY_BUFFER:34962,ELEMENT_ARRAY_BUFFER:34963,NEAREST:9728,LINEAR:9729,NEAREST_MIPMAP_NEAREST:9984,LINEAR_MIPMAP_NEAREST:9985,NEAREST_MIPMAP_LINEAR:9986,LINEAR_MIPMAP_LINEAR:9987,CLAMP_TO_EDGE:33071,MIRRORED_REPEAT:33648,REPEAT:10497},jh="KHR_mesh_quantization",bn={};bn[St]=nt.NEAREST;bn[Ir]=nt.NEAREST_MIPMAP_NEAREST;bn[Ii]=nt.NEAREST_MIPMAP_LINEAR;bn[Tt]=nt.LINEAR;bn[rs]=nt.LINEAR_MIPMAP_NEAREST;bn[yn]=nt.LINEAR_MIPMAP_LINEAR;bn[on]=nt.CLAMP_TO_EDGE;bn[Kn]=nt.REPEAT;bn[ji]=nt.MIRRORED_REPEAT;om={scale:"scale",position:"translation",quaternion:"rotation",morphTargetInfluences:"weights"},Sb=new Be,lm=12,Tb=1179937895,Ab=2,cm=8,Eb=1313821514,wb=5130562;Kh=class{constructor(){this.plugins=[],this.options={},this.pending=[],this.buffers=[],this.byteOffset=0,this.buffers=[],this.nodeMap=new Map,this.skins=[],this.extensionsUsed={},this.extensionsRequired={},this.uids=new Map,this.uid=0,this.json={asset:{version:"2.0",generator:"THREE.GLTFExporter r183"}},this.cache={meshes:new Map,attributes:new Map,attributesNormalized:new Map,materials:new Map,textures:new Map,images:new Map},this.textureUtils=null}setPlugins(e){this.plugins=e}setTextureUtils(e){this.textureUtils=e}async writeAsync(e,t,n={}){this.options=Object.assign({binary:!1,trs:!1,onlyVisible:!0,maxTextureSize:1/0,animations:[],includeCustomExtensions:!1},n),this.options.animations.length>0&&(this.options.trs=!0),await this.processInputAsync(e),await Promise.all(this.pending);let s=this,r=s.buffers,a=s.json;n=s.options;let o=s.extensionsUsed,l=s.extensionsRequired,c=new Blob(r,{type:"application/octet-stream"}),u=Object.keys(o),h=Object.keys(l);if(u.length>0&&(a.extensionsUsed=u),h.length>0&&(a.extensionsRequired=h),a.buffers&&a.buffers.length>0&&(a.buffers[0].byteLength=c.size),n.binary===!0){let d=new FileReader;d.readAsArrayBuffer(c),d.onloadend=function(){let f=Zh(d.result),m=new DataView(new ArrayBuffer(cm));m.setUint32(0,f.byteLength,!0),m.setUint32(4,wb,!0);let x=Zh(Cb(JSON.stringify(a)),32),g=new DataView(new ArrayBuffer(cm));g.setUint32(0,x.byteLength,!0),g.setUint32(4,Eb,!0);let p=new ArrayBuffer(lm),v=new DataView(p);v.setUint32(0,Tb,!0),v.setUint32(4,Ab,!0);let S=lm+g.byteLength+x.byteLength+m.byteLength+f.byteLength;v.setUint32(8,S,!0);let y=new Blob([p,g,x,m,f],{type:"application/octet-stream"}),E=new FileReader;E.readAsArrayBuffer(y),E.onloadend=function(){t(E.result)}}}else if(a.buffers&&a.buffers.length>0){let d=new FileReader;d.readAsDataURL(c),d.onloadend=function(){let f=d.result;a.buffers[0].uri=f,t(a)}}else t(a)}serializeUserData(e,t){if(Object.keys(e.userData).length===0)return;let n=this.options,s=this.extensionsUsed;try{let r=JSON.parse(JSON.stringify(e.userData));if(n.includeCustomExtensions&&r.gltfExtensions){t.extensions===void 0&&(t.extensions={});for(let a in r.gltfExtensions)t.extensions[a]=r.gltfExtensions[a],s[a]=!0;delete r.gltfExtensions}Object.keys(r).length>0&&(t.extras=r)}catch(r){console.warn("THREE.GLTFExporter: userData of '"+e.name+"' won't be serialized because of JSON.stringify error - "+r.message)}}getUID(e,t=!1){if(this.uids.has(e)===!1){let s=new Map;s.set(!0,this.uid++),s.set(!1,this.uid++),this.uids.set(e,s)}return this.uids.get(e).get(t)}isNormalizedNormalAttribute(e){if(this.cache.attributesNormalized.has(e))return!1;let n=new D;for(let s=0,r=e.count;s<r;s++)if(Math.abs(n.fromBufferAttribute(e,s).length()-1)>5e-4)return!1;return!0}createNormalizedNormalAttribute(e){let t=this.cache;if(t.attributesNormalized.has(e))return t.attributesNormalized.get(e);let n=e.clone(),s=new D;for(let r=0,a=n.count;r<a;r++)s.fromBufferAttribute(n,r),s.x===0&&s.y===0&&s.z===0?s.setX(1):s.normalize(),n.setXYZ(r,s.x,s.y,s.z);return t.attributesNormalized.set(e,n),n}applyTextureTransform(e,t){let n=!1,s={};(t.offset.x!==0||t.offset.y!==0)&&(s.offset=t.offset.toArray(),n=!0),t.rotation!==0&&(s.rotation=t.rotation,n=!0),(t.repeat.x!==1||t.repeat.y!==1)&&(s.scale=t.repeat.toArray(),n=!0),n&&(e.extensions=e.extensions||{},e.extensions.KHR_texture_transform=s,this.extensionsUsed.KHR_texture_transform=!0)}async buildMetalRoughTextureAsync(e,t){if(e===t)return e;function n(f){return f.colorSpace===Ct?function(x){return x<.04045?x*.0773993808:Math.pow(x*.9478672986+.0521327014,2.4)}:function(x){return x}}e instanceof Cs&&(e=await this.decompressTextureAsync(e)),t instanceof Cs&&(t=await this.decompressTextureAsync(t));let s=e?e.image:null,r=t?t.image:null,a=Math.max(s?s.width:0,r?r.width:0),o=Math.max(s?s.height:0,r?r.height:0),l=um();l.width=a,l.height=o;let c=l.getContext("2d",{willReadFrequently:!0});c.fillStyle="#00ffff",c.fillRect(0,0,a,o);let u=c.getImageData(0,0,a,o);if(s){c.drawImage(s,0,0,a,o);let f=n(e),m=c.getImageData(0,0,a,o).data;for(let x=2;x<m.length;x+=4)u.data[x]=f(m[x]/256)*256}if(r){c.drawImage(r,0,0,a,o);let f=n(t),m=c.getImageData(0,0,a,o).data;for(let x=1;x<m.length;x+=4)u.data[x]=f(m[x]/256)*256}c.putImageData(u,0,0);let d=(e||t).clone();return d.source=new Zi(l),d.colorSpace=Wn,d.channel=(e||t).channel,e&&t&&e.channel!==t.channel&&console.warn("THREE.GLTFExporter: UV channels for metalnessMap and roughnessMap textures must match."),console.warn("THREE.GLTFExporter: Merged metalnessMap and roughnessMap textures."),d}async decompressTextureAsync(e,t=1/0){if(this.textureUtils===null)throw new Error("THREE.GLTFExporter: setTextureUtils() must be called to process compressed textures.");return await this.textureUtils.decompress(e,t)}processBuffer(e){let t=this.json,n=this.buffers;return t.buffers||(t.buffers=[{byteLength:0}]),n.push(e),0}processBufferView(e,t,n,s,r){let a=this.json;a.bufferViews||(a.bufferViews=[]);let o;switch(t){case nt.BYTE:case nt.UNSIGNED_BYTE:o=1;break;case nt.SHORT:case nt.UNSIGNED_SHORT:o=2;break;default:o=4}let l=e.itemSize*o;r===nt.ARRAY_BUFFER&&(l=Math.ceil(l/4)*4);let c=hm(s*l),u=new DataView(new ArrayBuffer(c)),h=0;for(let m=n;m<n+s;m++){for(let x=0;x<e.itemSize;x++){let g;e.itemSize>4?g=e.array[m*e.itemSize+x]:(x===0?g=e.getX(m):x===1?g=e.getY(m):x===2?g=e.getZ(m):x===3&&(g=e.getW(m)),e.normalized===!0&&(g=rn.normalize(g,e.array))),t===nt.FLOAT?u.setFloat32(h,g,!0):t===nt.INT?u.setInt32(h,g,!0):t===nt.UNSIGNED_INT?u.setUint32(h,g,!0):t===nt.SHORT?u.setInt16(h,g,!0):t===nt.UNSIGNED_SHORT?u.setUint16(h,g,!0):t===nt.BYTE?u.setInt8(h,g):t===nt.UNSIGNED_BYTE&&u.setUint8(h,g),h+=o}h%l!==0&&(h+=l-h%l)}let d={buffer:this.processBuffer(u.buffer),byteOffset:this.byteOffset,byteLength:c};return r!==void 0&&(d.target=r),r===nt.ARRAY_BUFFER&&(d.byteStride=l),this.byteOffset+=c,a.bufferViews.push(d),{id:a.bufferViews.length-1,byteLength:0}}processBufferViewImage(e){let t=this,n=t.json;return n.bufferViews||(n.bufferViews=[]),new Promise(function(s){let r=new FileReader;r.readAsArrayBuffer(e),r.onloadend=function(){let a=Zh(r.result),o={buffer:t.processBuffer(a),byteOffset:t.byteOffset,byteLength:a.byteLength};t.byteOffset+=a.byteLength,s(n.bufferViews.push(o)-1)}})}processAccessor(e,t,n,s){let r=this.json,a={1:"SCALAR",2:"VEC2",3:"VEC3",4:"VEC4",9:"MAT3",16:"MAT4"},o;if(e.array.constructor===Float32Array)o=nt.FLOAT;else if(e.array.constructor===Int32Array)o=nt.INT;else if(e.array.constructor===Uint32Array)o=nt.UNSIGNED_INT;else if(e.array.constructor===Int16Array)o=nt.SHORT;else if(e.array.constructor===Uint16Array)o=nt.UNSIGNED_SHORT;else if(e.array.constructor===Int8Array)o=nt.BYTE;else if(e.array.constructor===Uint8Array)o=nt.UNSIGNED_BYTE;else throw new Error("THREE.GLTFExporter: Unsupported bufferAttribute component type: "+e.array.constructor.name);if(n===void 0&&(n=0),(s===void 0||s===1/0)&&(s=e.count),s===0)return null;let l=Ib(e,n,s),c;t!==void 0&&(c=e===t.index?nt.ELEMENT_ARRAY_BUFFER:nt.ARRAY_BUFFER);let u=this.processBufferView(e,o,n,s,c),h={bufferView:u.id,byteOffset:u.byteOffset,componentType:o,count:s,max:l.max,min:l.min,type:a[e.itemSize]};return e.normalized===!0&&(h.normalized=!0),r.accessors||(r.accessors=[]),r.accessors.push(h)-1}processImage(e,t,n,s="image/png"){if(e!==null){let r=this,a=r.cache,o=r.json,l=r.options,c=r.pending;a.images.has(e)||a.images.set(e,{});let u=a.images.get(e),h=s+":flipY/"+n.toString();if(u[h]!==void 0)return u[h];o.images||(o.images=[]);let d={mimeType:s},f=um();f.width=Math.min(e.width,l.maxTextureSize),f.height=Math.min(e.height,l.maxTextureSize);let m=f.getContext("2d",{willReadFrequently:!0});if(n===!0&&(m.translate(0,f.height),m.scale(1,-1)),e.data!==void 0){t!==sn&&console.error("GLTFExporter: Only RGBAFormat is supported.",t),(e.width>l.maxTextureSize||e.height>l.maxTextureSize)&&console.warn("GLTFExporter: Image size is bigger than maxTextureSize",e);let g=new Uint8ClampedArray(e.height*e.width*4);for(let p=0;p<g.length;p+=4)g[p+0]=e.data[p+0],g[p+1]=e.data[p+1],g[p+2]=e.data[p+2],g[p+3]=e.data[p+3];m.putImageData(new ImageData(g,e.width,e.height),0,0)}else if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap||typeof OffscreenCanvas<"u"&&e instanceof OffscreenCanvas)m.drawImage(e,0,0,f.width,f.height);else throw new Error("THREE.GLTFExporter: Invalid image type. Use HTMLImageElement, HTMLCanvasElement, ImageBitmap or OffscreenCanvas.");l.binary===!0?c.push(Pb(f,s).then(g=>r.processBufferViewImage(g)).then(g=>{d.bufferView=g})):d.uri=xr.getDataURL(f,s);let x=o.images.push(d)-1;return u[h]=x,x}else throw new Error("THREE.GLTFExporter: No valid image data found. Unable to process texture.")}processSampler(e){let t=this.json;t.samplers||(t.samplers=[]);let n={magFilter:bn[e.magFilter],minFilter:bn[e.minFilter],wrapS:bn[e.wrapS],wrapT:bn[e.wrapT]};return t.samplers.push(n)-1}async processTextureAsync(e){let n=this.options,s=this.cache,r=this.json;if(s.textures.has(e))return s.textures.get(e);r.textures||(r.textures=[]),e instanceof Cs&&(e=await this.decompressTextureAsync(e,n.maxTextureSize));let a=e.userData.mimeType;a==="image/webp"&&(a="image/png");let o={sampler:this.processSampler(e),source:this.processImage(e.image,e.format,e.flipY,a)};e.name&&(o.name=e.name),await this._invokeAllAsync(async function(c){c.writeTexture&&await c.writeTexture(e,o)});let l=r.textures.push(o)-1;return s.textures.set(e,l),l}async processMaterialAsync(e){let t=this.cache,n=this.json;if(t.materials.has(e))return t.materials.get(e);if(e.isShaderMaterial)return console.warn("GLTFExporter: THREE.ShaderMaterial not supported."),null;n.materials||(n.materials=[]);let s={pbrMetallicRoughness:{}};e.isMeshStandardMaterial!==!0&&e.isMeshBasicMaterial!==!0&&console.warn("GLTFExporter: Use MeshStandardMaterial or MeshBasicMaterial for best results.");let r=e.color.toArray().concat([e.opacity]);if(Di(r,[1,1,1,1])||(s.pbrMetallicRoughness.baseColorFactor=r),e.isMeshStandardMaterial?(s.pbrMetallicRoughness.metallicFactor=e.metalness,s.pbrMetallicRoughness.roughnessFactor=e.roughness):(s.pbrMetallicRoughness.metallicFactor=0,s.pbrMetallicRoughness.roughnessFactor=1),e.metalnessMap||e.roughnessMap){let o=await this.buildMetalRoughTextureAsync(e.metalnessMap,e.roughnessMap),l={index:await this.processTextureAsync(o),texCoord:o.channel};this.applyTextureTransform(l,o),s.pbrMetallicRoughness.metallicRoughnessTexture=l}if(e.map){let o={index:await this.processTextureAsync(e.map),texCoord:e.map.channel};this.applyTextureTransform(o,e.map),s.pbrMetallicRoughness.baseColorTexture=o}if(e.emissive){let o=e.emissive;if(Math.max(o.r,o.g,o.b)>0&&(s.emissiveFactor=e.emissive.toArray()),e.emissiveMap){let c={index:await this.processTextureAsync(e.emissiveMap),texCoord:e.emissiveMap.channel};this.applyTextureTransform(c,e.emissiveMap),s.emissiveTexture=c}}if(e.normalMap){let o={index:await this.processTextureAsync(e.normalMap),texCoord:e.normalMap.channel};e.normalScale&&e.normalScale.x!==1&&(o.scale=e.normalScale.x),this.applyTextureTransform(o,e.normalMap),s.normalTexture=o}if(e.aoMap){let o={index:await this.processTextureAsync(e.aoMap),texCoord:e.aoMap.channel};e.aoMapIntensity!==1&&(o.strength=e.aoMapIntensity),this.applyTextureTransform(o,e.aoMap),s.occlusionTexture=o}e.transparent?s.alphaMode="BLEND":e.alphaTest>0&&(s.alphaMode="MASK",s.alphaCutoff=e.alphaTest),e.side===Qt&&(s.doubleSided=!0),e.name!==""&&(s.name=e.name),this.serializeUserData(e,s),await this._invokeAllAsync(async function(o){o.writeMaterialAsync&&await o.writeMaterialAsync(e,s)});let a=n.materials.push(s)-1;return t.materials.set(e,a),a}async processMeshAsync(e){let t=this.cache,n=this.json,s=[e.geometry.uuid];if(Array.isArray(e.material))for(let y=0,E=e.material.length;y<E;y++)s.push(e.material[y].uuid);else s.push(e.material.uuid);let r=s.join(":");if(t.meshes.has(r))return t.meshes.get(r);let a=e.geometry,o;e.isLineSegments?o=nt.LINES:e.isLineLoop?o=nt.LINE_LOOP:e.isLine?o=nt.LINE_STRIP:e.isPoints?o=nt.POINTS:o=e.material.wireframe?nt.LINES:nt.TRIANGLES;let l={},c={},u=[],h=[],d={uv:"TEXCOORD_0",uv1:"TEXCOORD_1",uv2:"TEXCOORD_2",uv3:"TEXCOORD_3",color:"COLOR_0",skinWeight:"WEIGHTS_0",skinIndex:"JOINTS_0"},f=a.getAttribute("normal");f!==void 0&&!this.isNormalizedNormalAttribute(f)&&(console.warn("THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one."),a.setAttribute("normal",this.createNormalizedNormalAttribute(f)));let m=null;for(let y in a.attributes){if(y.slice(0,5)==="morph")continue;let E=a.attributes[y];if(y=d[y]||y.toUpperCase(),/^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/.test(y)||(y="_"+y),t.attributes.has(this.getUID(E))){c[y]=t.attributes.get(this.getUID(E));continue}m=null;let I=E.array;y==="JOINTS_0"&&!(I instanceof Uint16Array)&&!(I instanceof Uint8Array)?(console.warn('GLTFExporter: Attribute "skinIndex" converted to type UNSIGNED_SHORT.'),m=hs.Utils.toTypedBufferAttribute(E,Uint16Array)):(I instanceof Uint32Array||I instanceof Int32Array)&&!y.startsWith("_")&&(console.warn(`GLTFExporter: Attribute "${y}" converted to type FLOAT.`),m=hs.Utils.toTypedBufferAttribute(E,Float32Array));let b=this.processAccessor(m||E,a);b!==null&&(y.startsWith("_")||this.detectMeshQuantization(y,E),c[y]=b,t.attributes.set(this.getUID(E),b))}if(f!==void 0&&a.setAttribute("normal",f),Object.keys(c).length===0)return null;if(e.morphTargetInfluences!==void 0&&e.morphTargetInfluences.length>0){let y=[],E=[],C={};if(e.morphTargetDictionary!==void 0)for(let I in e.morphTargetDictionary)C[e.morphTargetDictionary[I]]=I;for(let I=0;I<e.morphTargetInfluences.length;++I){let b={},M=!1;for(let F in a.morphAttributes){if(F!=="position"&&F!=="normal"){M||(console.warn("GLTFExporter: Only POSITION and NORMAL morph are supported."),M=!0);continue}let w=a.morphAttributes[F][I],V=F.toUpperCase(),k=a.attributes[F];if(t.attributes.has(this.getUID(w,!0))){b[V]=t.attributes.get(this.getUID(w,!0));continue}let L=w.clone();if(!a.morphTargetsRelative)for(let P=0,N=w.count;P<N;P++)for(let U=0;U<w.itemSize;U++)U===0&&L.setX(P,w.getX(P)-k.getX(P)),U===1&&L.setY(P,w.getY(P)-k.getY(P)),U===2&&L.setZ(P,w.getZ(P)-k.getZ(P)),U===3&&L.setW(P,w.getW(P)-k.getW(P));b[V]=this.processAccessor(L,a),t.attributes.set(this.getUID(k,!0),b[V])}h.push(b),y.push(e.morphTargetInfluences[I]),e.morphTargetDictionary!==void 0&&E.push(C[I])}l.weights=y,E.length>0&&(l.extras={},l.extras.targetNames=E)}let x=Array.isArray(e.material);if(x&&a.groups.length===0)return null;let g=!1;if(x&&a.index===null){let y=[];for(let E=0,C=a.attributes.position.count;E<C;E++)y[E]=E;a.setIndex(y),g=!0}let p=x?e.material:[e.material],v=x?a.groups:[{materialIndex:0,start:void 0,count:void 0}];for(let y=0,E=v.length;y<E;y++){let C={mode:o,attributes:c};if(this.serializeUserData(a,C),h.length>0&&(C.targets=h),a.index!==null){let b=this.getUID(a.index);(v[y].start!==void 0||v[y].count!==void 0)&&(b+=":"+v[y].start+":"+v[y].count),t.attributes.has(b)?C.indices=t.attributes.get(b):(C.indices=this.processAccessor(a.index,a,v[y].start,v[y].count),t.attributes.set(b,C.indices)),C.indices===null&&delete C.indices}let I=await this.processMaterialAsync(p[v[y].materialIndex]);I!==null&&(C.material=I),u.push(C)}g===!0&&a.setIndex(null),l.primitives=u,n.meshes||(n.meshes=[]),await this._invokeAllAsync(function(y){y.writeMesh&&y.writeMesh(e,l)});let S=n.meshes.push(l)-1;return t.meshes.set(r,S),S}detectMeshQuantization(e,t){if(this.extensionsUsed[jh])return;let n;switch(t.array.constructor){case Int8Array:n="byte";break;case Uint8Array:n="unsigned byte";break;case Int16Array:n="short";break;case Uint16Array:n="unsigned short";break;default:return}t.normalized&&(n+=" normalized");let s=e.split("_",1)[0];am[s]&&am[s].includes(n)&&(this.extensionsUsed[jh]=!0,this.extensionsRequired[jh]=!0)}processCamera(e){let t=this.json;t.cameras||(t.cameras=[]);let n=e.isOrthographicCamera,s={type:n?"orthographic":"perspective"};return n?s.orthographic={xmag:e.right*2,ymag:e.top*2,zfar:e.far<=0?.001:e.far,znear:e.near<0?0:e.near}:s.perspective={aspectRatio:e.aspect,yfov:rn.degToRad(e.fov),zfar:e.far<=0?.001:e.far,znear:e.near<0?0:e.near},e.name!==""&&(s.name=e.type),t.cameras.push(s)-1}processAnimation(e,t){let n=this.json,s=this.nodeMap;n.animations||(n.animations=[]),e=hs.Utils.mergeMorphTargetTracks(e.clone(),t);let r=e.tracks,a=[],o=[];for(let c=0;c<r.length;++c){let u=r[c],h=st.parseTrackName(u.name),d=st.findNode(t,h.nodeName),f=om[h.propertyName];if(h.objectName==="bones"&&(d.isSkinnedMesh===!0?d=d.skeleton.getBoneByName(h.objectIndex):d=void 0),!d||!f){console.warn('THREE.GLTFExporter: Could not export animation track "%s".',u.name);continue}let m=1,x=u.values.length/u.times.length;f===om.morphTargetInfluences&&(x/=d.morphTargetInfluences.length);let g;u.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline===!0?(g="CUBICSPLINE",x/=3):u.getInterpolation()===Ti?g="STEP":g="LINEAR",o.push({input:this.processAccessor(new dt(u.times,m)),output:this.processAccessor(new dt(u.values,x)),interpolation:g}),a.push({sampler:o.length-1,target:{node:s.get(d),path:f}})}let l={name:e.name||"clip_"+n.animations.length,samplers:o,channels:a};return this.serializeUserData(e,l),n.animations.push(l),n.animations.length-1}processSkin(e){let t=this.json,n=this.nodeMap,s=t.nodes[n.get(e)],r=e.skeleton;if(r===void 0)return null;let a=e.skeleton.bones[0];if(a===void 0)return null;let o=[],l=new Float32Array(r.bones.length*16),c=new Xe;for(let h=0;h<r.bones.length;++h)o.push(n.get(r.bones[h])),c.copy(r.boneInverses[h]),c.multiply(e.bindMatrix).toArray(l,h*16);return t.skins===void 0&&(t.skins=[]),t.skins.push({inverseBindMatrices:this.processAccessor(new dt(l,16)),joints:o,skeleton:n.get(a)}),s.skin=t.skins.length-1}async processNodeAsync(e){let t=this.json,n=this.options,s=this.nodeMap;if(t.nodes||(t.nodes=[]),e.pivot!==null)return await this._processNodeWithPivotAsync(e);let r={};if(n.trs){let o=e.quaternion.toArray(),l=e.position.toArray(),c=e.scale.toArray();Di(o,[0,0,0,1])||(r.rotation=o),Di(l,[0,0,0])||(r.translation=l),Di(c,[1,1,1])||(r.scale=c)}else e.matrixAutoUpdate&&e.updateMatrix(),Rb(e.matrix)===!1&&(r.matrix=e.matrix.elements);if(e.name!==""&&(r.name=String(e.name)),this.serializeUserData(e,r),e.isMesh||e.isLine||e.isPoints){let o=await this.processMeshAsync(e);o!==null&&(r.mesh=o)}else e.isCamera&&(r.camera=this.processCamera(e));e.isSkinnedMesh&&this.skins.push(e);let a=t.nodes.push(r)-1;if(s.set(e,a),e.children.length>0){let o=[];for(let l=0,c=e.children.length;l<c;l++){let u=e.children[l];if(u.visible||n.onlyVisible===!1){let h=await this.processNodeAsync(u);h!==null&&o.push(h)}}o.length>0&&(r.children=o)}return await this._invokeAllAsync(function(o){o.writeNode&&o.writeNode(e,r)}),a}async _processNodeWithPivotAsync(e){let t=this.json,n=this.options,s=this.nodeMap,r=e.pivot,a={},o=e.quaternion.toArray(),l=[e.position.x+r.x,e.position.y+r.y,e.position.z+r.z],c=e.scale.toArray();Di(o,[0,0,0,1])||(a.rotation=o),Di(l,[0,0,0])||(a.translation=l),Di(c,[1,1,1])||(a.scale=c),a.extras={pivot:r.toArray()},e.name!==""&&(a.name=String(e.name)),this.serializeUserData(e,a);let u=t.nodes.push(a)-1;s.set(e,u);let h={},d=[-r.x,-r.y,-r.z];if(Di(d,[0,0,0])||(h.translation=d),e.isMesh||e.isLine||e.isPoints){let x=await this.processMeshAsync(e);x!==null&&(h.mesh=x)}else e.isCamera&&(h.camera=this.processCamera(e));e.isSkinnedMesh&&this.skins.push(e);let m=[t.nodes.push(h)-1];if(e.children.length>0){let x=[];for(let g=0,p=e.children.length;g<p;g++){let v=e.children[g];if(v.visible||n.onlyVisible===!1){let S=await this.processNodeAsync(v);S!==null&&x.push(S)}}x.length>0&&(h.children=x)}return a.children=m,await this._invokeAllAsync(function(x){x.writeNode&&x.writeNode(e,a)}),u}async processSceneAsync(e){let t=this.json,n=this.options;t.scenes||(t.scenes=[],t.scene=0);let s={};e.name!==""&&(s.name=e.name),t.scenes.push(s);let r=[];for(let a=0,o=e.children.length;a<o;a++){let l=e.children[a];if(l.visible||n.onlyVisible===!1){let c=await this.processNodeAsync(l);c!==null&&r.push(c)}}r.length>0&&(s.nodes=r),this.serializeUserData(e,s)}async processObjectsAsync(e){let t=new ei;t.name="AuxScene";for(let n=0;n<e.length;n++)t.children.push(e[n]);await this.processSceneAsync(t)}async processInputAsync(e){let t=this.options;e=e instanceof Array?e:[e],await this._invokeAllAsync(function(s){s.beforeParse&&s.beforeParse(e)});let n=[];for(let s=0;s<e.length;s++)e[s]instanceof ei?await this.processSceneAsync(e[s]):n.push(e[s]);n.length>0&&await this.processObjectsAsync(n);for(let s=0;s<this.skins.length;++s)this.processSkin(this.skins[s]);for(let s=0;s<t.animations.length;++s)this.processAnimation(t.animations[s],e[0]);await this._invokeAllAsync(function(s){s.afterParse&&s.afterParse(e)})}async _invokeAllAsync(e){for(let t=0,n=this.plugins.length;t<n;t++)await e(this.plugins[t])}},Jh=class{constructor(e){this.writer=e,this.name="KHR_lights_punctual"}writeNode(e,t){if(!e.isLight)return;if(!e.isDirectionalLight&&!e.isPointLight&&!e.isSpotLight){console.warn("THREE.GLTFExporter: Only directional, point, and spot lights are supported.",e);return}let n=this.writer,s=n.json,r=n.extensionsUsed,a={};e.name&&(a.name=e.name),a.color=e.color.toArray(),a.intensity=e.intensity,e.isDirectionalLight?a.type="directional":e.isPointLight?(a.type="point",e.distance>0&&(a.range=e.distance)):e.isSpotLight&&(a.type="spot",e.distance>0&&(a.range=e.distance),a.spot={},a.spot.innerConeAngle=(1-e.penumbra)*e.angle,a.spot.outerConeAngle=e.angle),e.decay!==void 0&&e.decay!==2&&console.warn("THREE.GLTFExporter: Light decay may be lost. glTF is physically-based, and expects light.decay=2."),e.target&&(e.target.parent!==e||e.target.position.x!==0||e.target.position.y!==0||e.target.position.z!==-1)&&console.warn("THREE.GLTFExporter: Light direction may be lost. For best results, make light.target a child of the light with position 0,0,-1."),r[this.name]||(s.extensions=s.extensions||{},s.extensions[this.name]={lights:[]},r[this.name]=!0);let o=s.extensions[this.name].lights;o.push(a),t.extensions=t.extensions||{},t.extensions[this.name]={light:o.length-1}}},Qh=class{constructor(e){this.writer=e,this.name="KHR_materials_unlit"}async writeMaterialAsync(e,t){if(!e.isMeshBasicMaterial)return;let s=this.writer.extensionsUsed;t.extensions=t.extensions||{},t.extensions[this.name]={},s[this.name]=!0,t.pbrMetallicRoughness.metallicFactor=0,t.pbrMetallicRoughness.roughnessFactor=.9}},ed=class{constructor(e){this.writer=e,this.name="KHR_materials_clearcoat"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.clearcoat===0)return;let n=this.writer,s=n.extensionsUsed,r={};if(r.clearcoatFactor=e.clearcoat,e.clearcoatMap){let a={index:await n.processTextureAsync(e.clearcoatMap),texCoord:e.clearcoatMap.channel};n.applyTextureTransform(a,e.clearcoatMap),r.clearcoatTexture=a}if(r.clearcoatRoughnessFactor=e.clearcoatRoughness,e.clearcoatRoughnessMap){let a={index:await n.processTextureAsync(e.clearcoatRoughnessMap),texCoord:e.clearcoatRoughnessMap.channel};n.applyTextureTransform(a,e.clearcoatRoughnessMap),r.clearcoatRoughnessTexture=a}if(e.clearcoatNormalMap){let a={index:await n.processTextureAsync(e.clearcoatNormalMap),texCoord:e.clearcoatNormalMap.channel};e.clearcoatNormalScale.x!==1&&(a.scale=e.clearcoatNormalScale.x),n.applyTextureTransform(a,e.clearcoatNormalMap),r.clearcoatNormalTexture=a}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},td=class{constructor(e){this.writer=e,this.name="KHR_materials_dispersion"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.dispersion===0)return;let s=this.writer.extensionsUsed,r={};r.dispersion=e.dispersion,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},nd=class{constructor(e){this.writer=e,this.name="KHR_materials_iridescence"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.iridescence===0)return;let n=this.writer,s=n.extensionsUsed,r={};if(r.iridescenceFactor=e.iridescence,e.iridescenceMap){let a={index:await n.processTextureAsync(e.iridescenceMap),texCoord:e.iridescenceMap.channel};n.applyTextureTransform(a,e.iridescenceMap),r.iridescenceTexture=a}if(r.iridescenceIor=e.iridescenceIOR,r.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],r.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1],e.iridescenceThicknessMap){let a={index:await n.processTextureAsync(e.iridescenceThicknessMap),texCoord:e.iridescenceThicknessMap.channel};n.applyTextureTransform(a,e.iridescenceThicknessMap),r.iridescenceThicknessTexture=a}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},id=class{constructor(e){this.writer=e,this.name="KHR_materials_transmission"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.transmission===0)return;let n=this.writer,s=n.extensionsUsed,r={};if(r.transmissionFactor=e.transmission,e.transmissionMap){let a={index:await n.processTextureAsync(e.transmissionMap),texCoord:e.transmissionMap.channel};n.applyTextureTransform(a,e.transmissionMap),r.transmissionTexture=a}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},sd=class{constructor(e){this.writer=e,this.name="KHR_materials_volume"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.transmission===0)return;let n=this.writer,s=n.extensionsUsed,r={};if(r.thicknessFactor=e.thickness,e.thicknessMap){let a={index:await n.processTextureAsync(e.thicknessMap),texCoord:e.thicknessMap.channel};n.applyTextureTransform(a,e.thicknessMap),r.thicknessTexture=a}e.attenuationDistance!==1/0&&(r.attenuationDistance=e.attenuationDistance),r.attenuationColor=e.attenuationColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},rd=class{constructor(e){this.writer=e,this.name="KHR_materials_ior"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.ior===1.5)return;let s=this.writer.extensionsUsed,r={};r.ior=e.ior,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},ad=class{constructor(e){this.writer=e,this.name="KHR_materials_specular"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.specularIntensity===1&&e.specularColor.equals(Sb)&&!e.specularIntensityMap&&!e.specularColorMap)return;let n=this.writer,s=n.extensionsUsed,r={};if(e.specularIntensityMap){let a={index:await n.processTextureAsync(e.specularIntensityMap),texCoord:e.specularIntensityMap.channel};n.applyTextureTransform(a,e.specularIntensityMap),r.specularTexture=a}if(e.specularColorMap){let a={index:await n.processTextureAsync(e.specularColorMap),texCoord:e.specularColorMap.channel};n.applyTextureTransform(a,e.specularColorMap),r.specularColorTexture=a}r.specularFactor=e.specularIntensity,r.specularColorFactor=e.specularColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},od=class{constructor(e){this.writer=e,this.name="KHR_materials_sheen"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.sheen==0)return;let n=this.writer,s=n.extensionsUsed,r={};if(e.sheenRoughnessMap){let a={index:await n.processTextureAsync(e.sheenRoughnessMap),texCoord:e.sheenRoughnessMap.channel};n.applyTextureTransform(a,e.sheenRoughnessMap),r.sheenRoughnessTexture=a}if(e.sheenColorMap){let a={index:await n.processTextureAsync(e.sheenColorMap),texCoord:e.sheenColorMap.channel};n.applyTextureTransform(a,e.sheenColorMap),r.sheenColorTexture=a}r.sheenRoughnessFactor=e.sheenRoughness,r.sheenColorFactor=e.sheenColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},ld=class{constructor(e){this.writer=e,this.name="KHR_materials_anisotropy"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.anisotropy==0)return;let n=this.writer,s=n.extensionsUsed,r={};if(e.anisotropyMap){let a={index:await n.processTextureAsync(e.anisotropyMap)};n.applyTextureTransform(a,e.anisotropyMap),r.anisotropyTexture=a}r.anisotropyStrength=e.anisotropy,r.anisotropyRotation=e.anisotropyRotation,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},cd=class{constructor(e){this.writer=e,this.name="KHR_materials_emissive_strength"}async writeMaterialAsync(e,t){if(!e.isMeshStandardMaterial||e.emissiveIntensity===1)return;let s=this.writer.extensionsUsed,r={};r.emissiveStrength=e.emissiveIntensity,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},ud=class{constructor(e){this.writer=e,this.name="EXT_materials_bump"}async writeMaterialAsync(e,t){if(!e.isMeshStandardMaterial||e.bumpScale===1&&!e.bumpMap)return;let n=this.writer,s=n.extensionsUsed,r={};if(e.bumpMap){let a={index:await n.processTextureAsync(e.bumpMap),texCoord:e.bumpMap.channel};n.applyTextureTransform(a,e.bumpMap),r.bumpTexture=a}r.bumpFactor=e.bumpScale,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},hd=class{constructor(e){this.writer=e,this.name="EXT_mesh_gpu_instancing"}writeNode(e,t){if(!e.isInstancedMesh)return;let n=this.writer,s=e,r=new Float32Array(s.count*3),a=new Float32Array(s.count*4),o=new Float32Array(s.count*3),l=new Xe,c=new D,u=new Ht,h=new D;for(let f=0;f<s.count;f++)s.getMatrixAt(f,l),l.decompose(c,u,h),c.toArray(r,f*3),u.toArray(a,f*4),h.toArray(o,f*3);let d={TRANSLATION:n.processAccessor(new dt(r,3)),ROTATION:n.processAccessor(new dt(a,4)),SCALE:n.processAccessor(new dt(o,3))};s.instanceColor&&(d._COLOR_0=n.processAccessor(s.instanceColor)),t.extensions=t.extensions||{},t.extensions[this.name]={attributes:d},n.extensionsUsed[this.name]=!0,n.extensionsRequired[this.name]=!0}};hs.Utils={insertKeyframe:function(i,e){let n=i.getValueSize(),s=new i.TimeBufferType(i.times.length+1),r=new i.ValueBufferType(i.values.length+n),a=i.createInterpolant(new i.ValueBufferType(n)),o;if(i.times.length===0){s[0]=e;for(let l=0;l<n;l++)r[l]=0;o=0}else if(e<i.times[0]){if(Math.abs(i.times[0]-e)<.001)return 0;s[0]=e,s.set(i.times,1),r.set(a.evaluate(e),0),r.set(i.values,n),o=0}else if(e>i.times[i.times.length-1]){if(Math.abs(i.times[i.times.length-1]-e)<.001)return i.times.length-1;s[s.length-1]=e,s.set(i.times,0),r.set(i.values,0),r.set(a.evaluate(e),i.values.length),o=s.length-1}else for(let l=0;l<i.times.length;l++){if(Math.abs(i.times[l]-e)<.001)return l;if(i.times[l]<e&&i.times[l+1]>e){s.set(i.times.slice(0,l+1),0),s[l+1]=e,s.set(i.times.slice(l+1),l+2),r.set(i.values.slice(0,(l+1)*n),0),r.set(a.evaluate(e),(l+1)*n),r.set(i.values.slice((l+1)*n),(l+2)*n),o=l+1;break}}return i.times=s,i.values=r,o},mergeMorphTargetTracks:function(i,e){let t=[],n={},s=i.tracks;for(let r=0;r<s.length;++r){let a=s[r],o=st.parseTrackName(a.name),l=st.findNode(e,o.nodeName);if(o.propertyName!=="morphTargetInfluences"||o.propertyIndex===void 0){t.push(a);continue}if(a.createInterpolant!==a.InterpolantFactoryMethodDiscrete&&a.createInterpolant!==a.InterpolantFactoryMethodLinear){if(a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline)throw new Error("THREE.GLTFExporter: Cannot merge tracks with glTF CUBICSPLINE interpolation.");console.warn("THREE.GLTFExporter: Morph target interpolation mode not yet supported. Using LINEAR instead."),a=a.clone(),a.setInterpolation(Ai)}let c=l.morphTargetInfluences.length,u=l.morphTargetDictionary[o.propertyIndex];if(u===void 0)throw new Error("THREE.GLTFExporter: Morph target name not found: "+o.propertyIndex);let h;if(n[l.uuid]===void 0){h=a.clone();let f=new h.ValueBufferType(c*h.times.length);for(let m=0;m<h.times.length;m++)f[m*c+u]=h.values[m];h.name=(o.nodeName||"")+".morphTargetInfluences",h.values=f,n[l.uuid]=h,t.push(h);continue}let d=a.createInterpolant(new a.ValueBufferType(1));h=n[l.uuid];for(let f=0;f<h.times.length;f++)h.values[f*c+u]=d.evaluate(h.times[f]);for(let f=0;f<a.times.length;f++){let m=this.insertKeyframe(h,a.times[f]);h.values[m*c+u]=a.values[f]}}return i.tracks=t,i},toTypedBufferAttribute:function(i,e){let t=new dt(new e(i.count*i.itemSize),i.itemSize,!1);if(!i.normalized&&!i.isInterleavedBufferAttribute)return t.array.set(i.array),t;for(let n=0,s=i.count;n<s;n++)for(let r=0;r<i.itemSize;r++)t.setComponent(n,r,i.getComponent(n,r));return t}}});var dd={};Em(dd,{createDesignRenderer:()=>Lb});function Lb(i){let e=new pc({antialias:!0,alpha:!0,powerPreference:"low-power",preserveDrawingBuffer:!0});e.setPixelRatio(Math.min(devicePixelRatio,1.7)),e.setClearColor(16250868,0),e.shadowMap.enabled=!0,e.shadowMap.type=yl,e.toneMapping=Va,e.toneMappingExposure=1,e.domElement.setAttribute("aria-label","Vista 3D interactiva de tus gafas. Arrastra para girar; bot\xF3n derecho para desplazar; rueda para acercar."),e.domElement.setAttribute("role","img"),e.domElement.tabIndex=0,i.replaceChildren(e.domElement);let t=new ei,n=new Rt(34,1,.1,100),s=new Sc(n,e.domElement);s.enableDamping=!1,s.enablePan=!0,s.screenSpacePanning=!0,s.minDistance=3,s.maxDistance=40,s.minZoom=.35,s.maxZoom=8,s.maxPolarAngle=Math.PI*.95,s.target.set(0,0,-.5);let r={wireframe:!1,grid:!1,axes:!1},a=new Oa(250*.04,50,10661287,14081496);a.rotation.x=Math.PI/2,a.position.z=-.12,a.visible=!1,a.material.transparent=!0,a.material.opacity=.55,t.add(a);let o=new Ba(25*.04);o.position.set(-3.5,-2,-.1),o.visible=!1,t.add(o);let l=new Fr(e),c=new Tc,u=l.fromScene(c,.04);t.environment=u.texture,c.dispose(),l.dispose(),t.add(new La(16777215,7566195,1.2));let h=new ts(16777215,2.6);h.position.set(-3,7,5),h.castShadow=!0,h.shadow.mapSize.set(1024,1024),h.shadow.camera.left=-5,h.shadow.camera.right=5,h.shadow.camera.top=5,h.shadow.camera.bottom=-5,h.shadow.bias=-.001,t.add(h);let d=new ts(16777215,2);d.position.set(5,3,-3),t.add(d);let f=new ft(new Ls(200,200),new wa({color:3421236,opacity:.035}));f.rotation.x=-Math.PI/2,f.position.y=-1.6,f.receiveShadow=!0,t.add(f);let m=new ln,x=null;t.add(m);let g=!1;function p(){g||(g=!0,requestAnimationFrame(()=>{g=!1,e.render(t,n),i.dataset.camera=JSON.stringify(n.position.toArray()),i.dataset.projection=n.isOrthographicCamera?"orthographic":"perspective",i.dataset.wireframe=String(r.wireframe),i.dataset.grid=String(r.grid)}))}s.addEventListener("change",p);function v(j){j.traverse(X=>{X.geometry?.dispose(),X.material&&(Array.isArray(X.material)?X.material:[X.material]).forEach(Y=>{for(let O of Object.values(Y))O?.isTexture&&O.dispose();Y.dispose()})})}function S(j,X=!1){return new $t({color:j,roughness:X?.23:.2,metalness:X?.8:0,clearcoat:1,clearcoatRoughness:.1,transmission:0,thickness:.35,envMapIntensity:.8})}function y(j,X,Ae=m){let Y=new ft(j,X);return Y.castShadow=!0,Y.receiveShadow=!0,Ae.add(Y),Y}function E(j,X,Ae=1){return Dt(j,X,Ae).map(Y=>new oe(...Y))}function C(j,X,Ae,Y){let O=Vs(j,X,Ae);function W(We,Ce){let Q=[],ae=[],ne=We.length-1;for(let xe=0;xe<=ne;xe++){let Ne=new D(...We[xe].point),{height:ue}=We[xe],A=j.materialDepth*.04/2;for(let[_,B]of[[-A,-ue/2],[A,-ue/2],[A,ue/2],[-A,ue/2]])Q.push(Ne.x+_,Ne.y+B,Ne.z);if(xe<ne)for(let _=0;_<4;_++){let B=xe*4+_,Z=xe*4+(_+1)%4,ie=(xe+1)*4+_,K=(xe+1)*4+(_+1)%4;ae.push(B,Z,ie,Z,K,ie)}}ae.push(0,2,1,0,3,2);let de=ne*4;ae.push(de,de+1,de+2,de,de+2,de+3);let R=new Et;R.setAttribute("position",new ct(Q,3)),R.setIndex(ae),R.computeVertexNormals();let Oe=y(R,Y);Oe.name=`temple-${X}-${Ce}`,Oe.userData={part:"temple",materialClass:"acetate-stock",stockThicknessMM:j.materialDepth,thicknessAxis:"local-x-at-each-section",sectionVertexCount:4}}W(O.stem,"stem"),W(O.hook,"hook");let te=O.stem[0].point,re=j.materialDepth*.04,le=y(new zn(.16,.14,re),Y);le.position.set(te[0]-X*.05,te[1],re/2),le.name=`endpiece-${X}`,le.userData={part:"endpiece",materialClass:"acetate-stock",stockThicknessMM:j.materialDepth,thicknessAxis:"z"};let Se=y(new zn(.11,.13,Math.min(.18,re*.8)),S("#baa26d",!0));Se.position.set(te[0],te[1],re/2),Se.name=`hinge-placeholder-${X}`,Se.userData={part:"hinge",materialClass:"hardware-placeholder",manufacturingValidated:!1}}function I(j){let X=vt(j),Ae=X.model==="curvo"&&!X.customContour,Y=X.materialDepth*.04;i.dataset.renderModel=X.model,i.dataset.config=JSON.stringify(X),t.remove(m),v(m),m=new ln,t.add(m);let O=S(Xt.find(le=>le.id===X.rimColor).hex),W=S(Xt.find(le=>le.id===X.bridgeColor).hex),te=S(Xt.find(le=>le.id===X.armColor).hex),re=an(X);for(let le of[-1,1]){let Se=E(X,le),We=Tn(X,le).map(A=>new oe(...A)),Ce=Math.abs(re[le===-1?0:1]),Q=Dt({...X,nasalProjection:0},le),ae=Ae?Tn(X,le).map(([A,_],B)=>new oe(A*1.025+Se[B].x-Q[B][0],_*1.025)):Se,ne=new Vn(ae);ne.holes.push(new Is([...We].reverse()));let de=y(new es(ne,{depth:Ae?.12:Y,bevelEnabled:!1,steps:1}),Ae?S("#bfa876",!0):O);if(de.position.set(le*Ce,0,0),de.name=`rim-${le}`,de.userData={part:"rim",materialClass:Ae?"metal-preview":"acetate-stock",stockThicknessMM:Ae?3:X.materialDepth,thicknessAxis:"z"},Ae){let A=new Vn([...Se.slice(0,65),...We.slice(0,65).reverse()]),_=y(new es(A,{depth:Y,bevelEnabled:!1,steps:1}),O);_.position.set(le*Ce,0,0),_.name=`brow-${le}`,_.userData={part:"brow",materialClass:"acetate-stock",stockThicknessMM:X.materialDepth,thicknessAxis:"z"}}let R=X.use==="sol"||X.sunOptical||X.photo,Oe=X.photo?mi.find(A=>A.id===X.photoColor).hex:ki.find(A=>A.id===X.lensColor).hex,xe=new $t({color:R?new Be(Oe).multiplyScalar(.65):"#e2eeeb",transparent:!0,opacity:R?.9:.1,roughness:.1,metalness:0,clearcoat:.5,side:Qt,envMapIntensity:.5}),Ne=y(new Aa(new Vn(We)),xe);Ne.position.set(le*Ce,0,.035),Ne.name=`lens-${le}`,Ne.userData={part:"lens",materialClass:"lens-preview"};let ue=y(new Ea(.023,10,8),S("#baa26d",!0));ue.position.set(le*(Ce+Math.max(...Se.map(A=>A.x))*.88),.22,Y+.015),ue.name=`pin-placeholder-${le}`,ue.userData={part:"pin",materialClass:"hardware-placeholder",manufacturingValidated:!1}}for(let le of[-1,1]){let Se=io(X,le),We=new Vn(Se.outline.map(Q=>new oe(...Q))),Ce=y(new es(We,{depth:Se.depth,bevelEnabled:!1,steps:1}),O);Ce.position.z=-Se.depth,Ce.name=`laminated-nasal-pad-${le}`,Ce.userData={part:"nasal-pad",materialClass:"added-laminate",operation:"bond-separate-pad-to-rear",addedThicknessMM:Se.depth/.04,includedInMainStock:!1,manufacturingValidated:!1}}for(let[le,Se]of Fi(X).bands.entries()){let We=new Vn(Se.outline.map(Q=>new oe(...Q))),Ce=y(new es(We,{depth:Y,bevelEnabled:!1,steps:1}),W);Ce.position.z=0,Ce.name=`bridge-${le}`,Ce.userData={part:"bridge",materialClass:"acetate-stock",stockThicknessMM:X.materialDepth,thicknessAxis:"z"}}i.dataset.nasalPads="2",i.dataset.padConstruction="added-laminate-3mm",i.dataset.measurements=JSON.stringify(Wt(X)),C(X,-1,X.armStyle,te),C(X,1,X.armStyle,te),m.visible=!x?.visible,k(),p()}function b(){let j=s.target,X=n.position.clone().sub(j).normalize(),Ae=Math.max(.15,n.aspect||1);if(X.lengthSq()||X.set(0,0,1),n.isOrthographicCamera)n.zoom=1,n.updateProjectionMatrix(),n.position.copy(j.clone().addScaledVector(X,12));else{n.zoom=1;let Y=Math.max(9.5,3.3/(Math.tan(rn.degToRad(n.fov/2))*Ae)+2.3);n.position.copy(j.clone().addScaledVector(X,Math.min(38,Y))),n.updateProjectionMatrix()}s.update()}function M(j){let X={frente:[0,0,1],perspectiva:[.3,.17,1],lateral:[1,0,0]};s.target.set(0,0,-2.3),n.position.copy(s.target.clone().add(new D(...X[j]||X.perspectiva))),b(),p()}function F(j){if(n.aspect=j,n.isOrthographicCamera){let X=Math.max(7,7/j);n.left=-X*j/2,n.right=X*j/2,n.top=X/2,n.bottom=-X/2}n.updateProjectionMatrix()}function w(){let j=i.clientWidth,X=i.clientHeight;!j||!X||(e.setSize(j,X,!1),F(j/X),p())}function V(j){if(!["orthographic","perspective"].includes(j)||(n.isOrthographicCamera?"orthographic":"perspective")===j)return;let X=n,Ae=X.aspect||1;n=j==="orthographic"?new oi(-4,4,4,-4,.1,100):new Rt(34,Ae,.1,100),n.position.copy(X.position),n.quaternion.copy(X.quaternion),n.up.copy(X.up),s.object=n,F(Ae);let Y=X.position.distanceTo(s.target);if(n.isOrthographicCamera){let O=2*Y*Math.tan(rn.degToRad(X.fov/2))/X.zoom;n.zoom=(n.top-n.bottom)/O}else if(X.isOrthographicCamera){let W=(X.top-X.bottom)/X.zoom/(2*Math.tan(rn.degToRad(n.fov/2)));n.position.copy(s.target.clone().addScaledVector(X.position.clone().sub(s.target).normalize(),W))}n.updateProjectionMatrix(),s.update(),p()}function k(){m.traverse(j=>{if(j.material)for(let X of Array.isArray(j.material)?j.material:[j.material])"wireframe"in X&&(X.wireframe=r.wireframe)}),a.visible=r.grid,o.visible=r.axes}function L(j={}){for(let X of["wireframe","grid","axes"])typeof j[X]=="boolean"&&(r[X]=j[X]);k(),p()}function P(j){if(!(!Number.isFinite(j)||j<=0)){if(n.isOrthographicCamera)n.zoom=rn.clamp(n.zoom*j,s.minZoom,s.maxZoom),n.updateProjectionMatrix();else{let X=n.position.clone().sub(s.target),Ae=rn.clamp(X.length()/j,s.minDistance,s.maxDistance);n.position.copy(s.target.clone().addScaledVector(X.normalize(),Ae))}s.update(),p()}}function N(){s.target.set(0,0,-2.3),b(),p()}let U=new ResizeObserver(w);U.observe(i),M("perspectiva"),w(),e.domElement.addEventListener("keydown",j=>{if(!["ArrowLeft","ArrowRight"].includes(j.key))return;j.preventDefault();let X=n.position.clone().sub(s.target);X.applyAxisAngle(new D(0,1,0),j.key==="ArrowLeft"?-.15:.15),n.position.copy(s.target.clone().add(X)),s.update(),p()});async function ee(j){if(j.size>15*1024*1024)throw new Error("El modelo debe pesar menos de 15 MB.");let X=await j.arrayBuffer(),Ae=new DataView(X);if(X.byteLength<20||Ae.getUint32(0,!0)!==1179937895||Ae.getUint32(4,!0)!==2)throw new Error("Selecciona un modelo GLB 2.0 v\xE1lido.");let Y=Ae.getUint32(12,!0);if(20+Y>X.byteLength)throw new Error("El modelo GLB est\xE1 incompleto.");let O=JSON.parse(new TextDecoder().decode(new Uint8Array(X,20,Y)));if([...O.buffers||[],...O.images||[]].some(Se=>Se.uri&&!Se.uri.startsWith("data:")))throw new Error("El GLB debe incluir sus texturas y geometr\xEDa, sin archivos externos.");let W=await new Promise((Se,We)=>new Ac().parse(X,"",Se,We)),te=new nn().setFromObject(W.scene),re=te.getSize(new D),le=Math.max(re.x,re.y,re.z);if(!Number.isFinite(le)||le<=0)throw new Error("El modelo no contiene geometr\xEDa visible.");x&&(t.remove(x),v(x)),x=W.scene,x.position.sub(te.getCenter(new D)),x.scale.setScalar(4/le),x.position.multiplyScalar(4/le),t.add(x),x.visible=!0,m.visible=!1,p()}function se(j){x&&(x.visible=j),m.visible=!x?.visible,p()}async function fe(){if(!m.children.length)throw new Error("Primero crea una montura para exportar.");let j=m.clone(!0);return j.scale.multiplyScalar(.001/.04),j.name="Miscante eyewear",j.userData={...j.userData,units:"metres",design:JSON.parse(i.dataset.config||"{}"),purpose:"Parametric design preview; validate manufacturing fit separately"},new hs().parseAsync(j,{binary:!0,onlyVisible:!1})}function ye(){U.disconnect(),s.dispose(),v(m),x&&v(x),v(a),v(o),u.dispose(),f.geometry.dispose(),f.material.dispose(),e.dispose()}return{update:I,setView:M,setProjection:V,setDisplay:L,zoom:P,fitView:N,exportGLB:fe,loadReference:ee,showReference:se,destroy:ye,canvas:e.domElement,getCameraState:()=>n.position.toArray(),getStats:()=>({meshes:m.children.length,model:i.dataset.renderModel,projection:n.isOrthographicCamera?"orthographic":"perspective",...r})}}var fd=Sn(()=>{ls();Yp();jp();rm();dm();Oi();zi();xc()});zi();var gi=[{id:"solar",name:"Solar",category:"sol",shape:"square",color:"Miel transl\xFAcida",hex:"#98602f",lens:"#544d31",price:159e3,material:"Acetato",size:"51 \xB7 21 \xB7 145",tag:"SELECCI\xD3N MISCANTE",bg:"#ece9e0"},{id:"noir",name:"Noir",category:"sol",shape:"cat",color:"Negro profundo",hex:"#242422",lens:"#343a35",price:169e3,material:"Acetato",size:"53 \xB7 19 \xB7 145",tag:"",bg:"#e5e7e2"},{id:"forma",name:"Forma",category:"optica",shape:"round",color:"Champagne",hex:"#baa078",lens:"#d5d9ce",price:139e3,material:"Titanio",size:"49 \xB7 20 \xB7 140",tag:"NUEVA PERSPECTIVA",bg:"#eee6dc"},{id:"terra",name:"Terra",category:"sol",shape:"round",color:"Carey c\xE1lido",hex:"#71432d",lens:"#5c4837",price:179e3,material:"Acetato",size:"50 \xB7 22 \xB7 145",tag:"",bg:"#e9e1d5"},{id:"linea",name:"L\xEDnea",category:"optica",shape:"square",color:"Oliva transparente",hex:"#72765b",lens:"#d7ddd0",price:149e3,material:"Acetato",size:"51 \xB7 20 \xB7 145",tag:"",bg:"#e1e5dc"},{id:"aura",name:"Aura",category:"sol",shape:"cat",color:"\xC1mbar",hex:"#af713c",lens:"#705238",price:189e3,material:"Acetato",size:"52 \xB7 20 \xB7 145",tag:"EDICI\xD3N DE ESTUDIO",bg:"#eee4d6"}],bt=i=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(i);function Nc(i,e={}){let t=gi.find(r=>r.id===i);if(!t)return{lines:[],total:0};let n=gs(vt(e)).lines.slice(1),s=[{label:`Montura ${t.name} \xB7 cristales sin graduaci\xF3n incluidos`,amount:t.price},...n];return{lines:s,total:s.reduce((r,a)=>r+a.amount,0)}}function wd(i){return gi.find(e=>e.id===(i.productId||i.id))}function lo(i){return i.custom?gs(i.config):Nc(i.productId||i.id,i.config)}function Uc(i){let e=i.reduce((n,s)=>n+lo(s).total*s.qty,0),t=e===0||e>=2e5?0:5e3;return{subtotal:e,shipping:t,total:e+t}}function co(i){let e=gi.findIndex(t=>t.id===i.id);return`<span class="studio-product" role="img" aria-label="Gafas ${i.name}, ${i.color}" style="--photo-x:${e%3*50}%;--photo-y:${e<3?0:100}%"></span>`}zi();function Cd(i,e,t){let n=vt({use:"sol"}),s=null,r=0,a=!1,o=h=>h.map(d=>`<option value="${d.id}">${d.name}${d.price?` \xB7 +${bt(d.price)}`:""}</option>`).join(""),l=[["blue","Filtro de luz azul",2e4],["ar","Antirreflejos",18e3],["photo","Fotocrom\xE1tico",45e3],["sunOptical","Sol \xF3ptico",25e3]];i.innerHTML=`<form id="collection-lens-form" class="collection-lenses"><h3>Elige tus cristales</h3><label for="collection-use">Graduaci\xF3n</label><select id="collection-use" data-lens-setting="use"><option value="sol">Sin graduaci\xF3n \xB7 incluidos</option><option value="optico">Con graduaci\xF3n m\xE9dica</option></select><section id="collection-optical" hidden><label for="collection-lensType">Tipo de cristales</label><select id="collection-lensType" data-lens-setting="lensType">${o(ms)}</select>${l.map(([h,d,f])=>`<label class="treatment"><input type="checkbox" id="collection-${h}" data-lens-setting="${h}"><span>${d}</span><b>+${bt(f)}</b></label>`).join("")}<p class="control-note">Sol \xF3ptico excluye luz azul, fotocrom\xE1tico y antirreflejos. Fotocrom\xE1tico admite antirreflejos.</p><div id="collection-photo-field" hidden><label for="collection-photoColor">Color fotocrom\xE1tico</label><select id="collection-photoColor" data-lens-setting="photoColor">${o(mi)}</select></div><div id="collection-sun-field" hidden><label for="collection-lensColor">Color de sol \xF3ptico</label><select id="collection-lensColor" data-lens-setting="lensColor">${o(ki)}</select></div><label for="collection-recipe">Receta m\xE9dica \xB7 PDF o imagen</label><input type="file" id="collection-recipe" accept=".pdf,.jpg,.jpeg,.png,.webp"><p id="collection-recipe-status" role="status"></p><button type="button" id="collection-remove-recipe" class="text-link" hidden>Quitar receta</button><label class="checkbox"><input type="checkbox" id="collection-recipe-later"> Adjuntar\xE9 mi receta m\xE1s adelante.</label><p class="control-note">El archivo queda solo en memoria durante esta p\xE1gina. No se env\xEDa ni se conserva al recargar. No uses una receta real para probar.</p></section><div id="collection-price-lines"></div><p class="collection-total">Total estimado <strong id="collection-total" aria-live="polite"></strong></p><p class="control-note">Precios en CLP por el par. Graduaci\xF3n, \xEDndice y viabilidad requieren validaci\xF3n \xF3ptica y cotizaci\xF3n final.</p><p id="collection-lens-error" role="alert" class="field-error"></p><button type="submit" class="button dark full">A\xF1adir a la bolsa <span>+</span></button></form>`;let c=h=>i.querySelector(h);function u(){n=vt(n);let h=n.use==="optico";c("#collection-optical").hidden=!h;for(let[f]of l){let m=c(`#collection-${f}`);m.checked=n[f],m.disabled=["blue","ar","photo"].includes(f)&&n.sunOptical}c("#collection-photo-field").hidden=!n.photo,c("#collection-sun-field").hidden=!n.sunOptical;let d=Nc(e.id,n);c("#collection-price-lines").innerHTML=d.lines.map(f=>`<p><span>${f.label}</span><span>${bt(f.amount)}</span></p>`).join(""),c("#collection-total").textContent=bt(d.total)}i.addEventListener("change",h=>{let d=h.target.dataset.lensSetting;d&&(n[d]=h.target.type==="checkbox"?h.target.checked:h.target.value,c("#collection-lens-error").textContent="",u())}),c("#collection-recipe").addEventListener("change",async h=>{let d=++r,f=h.target.files[0];if(s=null,c("#collection-remove-recipe").hidden=!0,c("#collection-recipe-status").textContent="",!f)return;a=!0;let m=Ks(f);try{!m&&!Js(new Uint8Array(await f.slice(0,12).arrayBuffer()),f)&&(m="El contenido no coincide con un PDF o imagen compatible.")}catch{m="No se pudo leer el archivo."}if(d===r){if(a=!1,m){h.target.value="",c("#collection-lens-error").textContent=m;return}s=f,c("#collection-recipe-status").textContent=`Adjunta localmente: ${f.name}`,c("#collection-remove-recipe").hidden=!1,c("#collection-lens-error").textContent=""}}),c("#collection-remove-recipe").addEventListener("click",()=>{r++,a=!1,s=null,c("#collection-recipe").value="",c("#collection-recipe-status").textContent="",c("#collection-remove-recipe").hidden=!0}),c("#collection-lens-form").addEventListener("submit",h=>{if(h.preventDefault(),a){c("#collection-lens-error").textContent="Espera a que termine la validaci\xF3n del archivo.";return}if(n.use==="optico"&&!s&&!c("#collection-recipe-later").checked){c("#collection-lens-error").textContent="Adjunta tu receta o indica que la enviar\xE1s m\xE1s adelante.",c("#collection-recipe").focus();return}t({config:vt(n),recipe:n.use==="optico"?s:null})}),u()}zi();Oi();Oi();zi();xc();var Lt=1e-7,yt=i=>Number(i.toFixed(4)),Pi=(i,e)=>i[0]*e[1]-i[1]*e[0],Li=(i,e)=>[i[0]-e[0],i[1]-e[1]],_c=(i,e)=>Math.hypot(i[0]-e[0],i[1]-e[1])<1e-5,kr=i=>i.reduce((e,t,n)=>e+Pi(t,i[(n+1)%i.length]),0)/2,Gs=i=>({minX:Math.min(...i.map(e=>e[0])),maxX:Math.max(...i.map(e=>e[0])),minY:Math.min(...i.map(e=>e[1])),maxY:Math.max(...i.map(e=>e[1]))}),yc=i=>`M${i.map(e=>`${yt(e[0])},${yt(e[1])}`).join("L")}Z`,Xv=i=>`M${i.map(e=>`${yt(e[0])},${yt(e[1])}`).join("L")}`,Ot=(i,e,t,n="")=>`<text x="${yt(i)}" y="${yt(e)}" ${n}>${t}</text>`,Hs=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function mh(i={}){let e=vt(i),t=an(e)[1]/.04,n=Dt(e,1).map(([h,d])=>[h/.04+t,d/.04]),s=Math.min(...n.map(h=>h[0]))*2,r=[];e.model==="curvo"&&!e.customContour&&r.push("Curvo combina ceja de acetato y aro met\xE1lico. Falta un plano separado de materiales y herrajes; no se emitir\xE1 un patr\xF3n de acetato que no corresponde al 3D. Elige un modelo \xEDntegro de acetato o importa un perfil para ese material."),i.customContour&&!e.customContour&&r.push("El contorno importado no es v\xE1lido. Corrige su cierre, convexidad y proporciones antes de imprimir."),s<2-1e-5&&r.push(`La abertura nasal m\xEDnima es ${yt(s)} mm y debe ser al menos 2 mm. Aumenta DBL o reduce el ancho radial del aro o la pronunciaci\xF3n nasal.`);let a=Tn(e,1).map(([h,d])=>[h/.04,d/.04]),o=Gs(n),l=Gs(a),c=o.maxY-o.minY,u=l.maxY-l.minY;return Math.max(143,48+c+15)+9+u+11>253&&r.push("El frontal y las lunetas exceden una hoja A4 a escala 1:1. Reduce la altura del contorno, A o el ancho radial; no se reducir\xE1 la escala autom\xE1ticamente."),(Math.max(...n.map(h=>h[0]))+3.25)*2>186&&r.push("El frontal excede el ancho \xFAtil A4 a escala 1:1. Reduce A o DBL."),e.armWidth>76&&r.push("El ancho de las patillas excede el espacio para ambas piezas en una hoja A4. Reduce el ancho de patilla a 76 mm o menos para conservar la escala 1:1."),r}function vc(i,e){let t=!1;for(let n=0,s=e.length-1;n<e.length;s=n++){let r=e[s],a=e[n],o=Li(a,r),l=Li(i,r);if(Math.abs(Pi(o,l))<Lt&&i[0]>=Math.min(r[0],a[0])-Lt&&i[0]<=Math.max(r[0],a[0])+Lt&&i[1]>=Math.min(r[1],a[1])-Lt&&i[1]<=Math.max(r[1],a[1])+Lt)return!1;r[1]>i[1]!=a[1]>i[1]&&i[0]<(a[0]-r[0])*(i[1]-r[1])/(a[1]-r[1])+r[0]&&(t=!t)}return t}function qv(i,e,t,n){let s=Li(e,i),r=Li(n,t),a=Li(t,i),o=Pi(s,r);if(Math.abs(o)<Lt)return Math.abs(Pi(a,s))>Lt?!1:Math.max(Math.min(i[0],e[0]),Math.min(t[0],n[0]))<=Math.min(Math.max(i[0],e[0]),Math.max(t[0],n[0]))+Lt&&Math.max(Math.min(i[1],e[1]),Math.min(t[1],n[1]))<=Math.min(Math.max(i[1],e[1]),Math.max(t[1],n[1]))+Lt;let l=Pi(a,r)/o,c=Pi(a,s)/o;return l>=-Lt&&l<=1+Lt&&c>=-Lt&&c<=1+Lt}function Np(i,e){let t=Gs(i),n=Gs(e);return t.maxX<n.minX||n.maxX<t.minX||t.maxY<n.minY||n.maxY<t.minY?!1:i.some((s,r)=>e.some((a,o)=>qv(s,i[(r+1)%i.length],a,e[(o+1)%e.length])))}function $v(i){let e=i.map(r=>kr(r)>0?r:r.slice().reverse()),t=e.flatMap((r,a)=>r.map((o,l)=>({a:o,b:r[(l+1)%r.length],index:a,ts:[0,1]})));for(let r=0;r<t.length;r++)for(let a=r+1;a<t.length;a++){let o=t[r],l=t[a];if(o.index===l.index)continue;let c=Li(o.b,o.a),u=Li(l.b,l.a),h=Li(l.a,o.a),d=Pi(c,u);if(Math.abs(d)<Lt)continue;let f=Pi(h,u)/d,m=Pi(h,c)/d;f>=-Lt&&f<=1+Lt&&m>=-Lt&&m<=1+Lt&&(o.ts.push(Math.max(0,Math.min(1,f))),l.ts.push(Math.max(0,Math.min(1,m))))}let n=[];for(let r of t){let a=[...new Set(r.ts.map(c=>Math.round(c*1e10)/1e10))].sort((c,u)=>c-u),o=Li(r.b,r.a),l=c=>r.a.map((u,h)=>u+o[h]*c);for(let c=1;c<a.length;c++){if(a[c]-a[c-1]<Lt)continue;let u=l((a[c]+a[c-1])/2);if(e.some((f,m)=>m!==r.index&&vc(u,f)))continue;let h=l(a[c-1]),d=l(a[c]);n.some(f=>_c(f.a,h)&&_c(f.b,d))||n.push({a:h,b:d})}}let s=[];for(;n.length;){let r=n.shift(),a=[r.a],o=r.a,l=r.b,c=0;for(;!_c(l,o);){a.push(l);let u=n.findIndex(h=>_c(h.a,l));if(u<0||++c>t.length*4)throw new Error("El frontal no forma un contorno de corte cerrado. Revisa el puente.");l=n.splice(u,1)[0].b}a.length>=3&&Math.abs(kr(a))>Lt&&s.push(a)}return s}function bc(i,e,t,n){return`<g class="dimension"><path d="M${yt(i)},${yt(t-2)}v4M${yt(e)},${yt(t-2)}v4M${yt(i)},${yt(t)}H${yt(e)}"/>${Ot((i+e)/2,t-1.5,Hs(n),'text-anchor="middle"')}</g>`}function Yv(){return`<g class="calibration">${Ot(20,261,"CONTROL DE ESCALA \xB7 verificar regla y cuadrado en ambos ejes")}${bc(20,120,267,"100 mm")}<path data-calibration="square" d="M170,264h20v20h-20Z"/>${Ot(180,261,"20 \xD7 20 mm",'text-anchor="middle"')}${Ot(20,276,"Imprimir al 100 % / tama\xF1o real. Desactivar \xABajustar a p\xE1gina\xBB.")}${Ot(20,282,"Verificar ambos ejes antes de recortar. Sin compensaci\xF3n de mecanizado.")}</g>`}function Up(i,e,t,n){return`<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297" data-sheet="${i}" role="img" aria-label="${Hs(e)}"><title>${Hs(e)}</title><style>text{font:3px Arial,sans-serif;fill:#172126}path{fill:none;stroke:#172126;stroke-width:.15;stroke-linejoin:round;stroke-linecap:round}.heading{font-size:5px;font-weight:bold}.caption{font-size:2.6px}.center{stroke:#6e7b80;stroke-width:.12;stroke-dasharray:2 1}.dimension path{stroke-width:.12}.dimension text,.calibration text{font-size:2.5px}.lens{stroke:#172126}.sheet-label{font-size:3.5px;font-weight:bold}</style>${Ot(15,17,"MISCANTE / PATR\xD3N PLANO PRELIMINAR",'class="heading"')}${Ot(15,25,Hs(e),'class="sheet-label"')}${Ot(15,32,`${n.customContour?"Perfil importado regularizado":Hs(n.model)} \xB7 ${Hs(Wt(n).code)} \xB7 Escala vectorial 1:1 \xB7 A4`)}${Ot(15,38,`Placa: ${yt(n.materialDepth)} mm \xB7 ancho radial del aro: ${yt(n.thickness)} mm`,'class="caption"')}${t}${Yv()}${Ot(195,289,`${i} / 2`,'text-anchor="end"')}</svg>`}function gh(i={}){let e=mh(i);if(e.length)throw new Error(e.join(" "));let t=vt(i),n=an(t),s=[],r=[];for(let M of[-1,1]){let F=n[M===-1?0:1];s.push(Dt(t,M).map(([L,P])=>[(L+F)/.04,P/.04])),r.push(Tn(t,M).map(([L,P])=>[(L+F)/.04,P/.04]));let w=Vs(t,M).stem[0].point,V=(w[0]-M*.05)/.04,k=w[1]/.04;s.push([[V-2,k-1.75],[V+2,k-1.75],[V+2,k+1.75],[V-2,k+1.75]])}s.push(...Fi(t).bands.map(M=>M.outline.map(([F,w])=>[F/.04,w/.04])));let a=$v(s);if(a.filter(M=>kr(M)>0).length!==1)throw new Error("El frontal contiene piezas desconectadas; no se puede emitir un patr\xF3n de corte \xFAnico.");let o=a.find(M=>kr(M)>0),l=[...r,...a.filter(M=>kr(M)<0)];if(l.some(M=>M.some(F=>!vc(F,o))||Np(M,o)))throw new Error("Un vaciado sale del frontal o toca su borde exterior. Aumenta el ancho radial del aro o corrige el contorno antes de imprimir.");for(let M=0;M<l.length;M++)for(let F=M+1;F<l.length;F++)if(Np(l[M],l[F])||vc(l[M][0],l[F])||vc(l[F][0],l[M]))throw new Error("Los vaciados de lunetas o puente se superponen. Ajusta DBL, el puente o el contorno antes de imprimir.");let c=Gs(a.flat()),u=c.maxX-c.minX,h=48+c.maxY,d=48+c.maxY-c.minY,f=([M,F])=>[105+M,h-F],m=Math.max(143,d+15),x=[-1,1].map(M=>Tn(t,M).map(([F,w])=>[F/.04,w/.04])),g=Math.max(...x.flat().map(M=>M[1])),p=Math.min(...x.flat().map(M=>M[1])),v=m+9+g,S=v-p;if(S+11>253)throw new Error("Los contornos exceden la hoja 1 a escala 1:1. Reduce la altura de la luneta, A o el ancho radial.");let y=`${Ot(105,43,"FRONTAL \xB7 l\xEDnea continua = corte y vaciado / discontinua = alineaci\xF3n",'text-anchor="middle" class="caption"')}<g data-part="front"><path d="${a.map(M=>yc(M.map(f))).join("")}"/>${r.map(M=>`<path d="${yc(M.map(f))}"/>`).join("")}</g><path class="center" d="M105,46V${yt(d+2)}"/>${bc(105+c.minX,105+c.maxX,d+7,`${yt(u)} mm \xB7 ancho frontal del patr\xF3n`)}`;y+=Ot(105,m,"LUNETAS / PLANTILLAS DE LA ABERTURA",'text-anchor="middle" class="sheet-label"');for(let[M,F]of[-1,1].entries()){let w=x[M],V=Gs(w),k=M?143:67,L=v;y+=`<path class="lens" data-part="lens-${F}" data-origin-x="${k}" data-origin-y="${yt(L)}" d="${yc(w.map(([P,N])=>[k+P,L-N]))}"/><path class="center" data-registration="lens-${F}" d="M${k-2},${yt(L)}h4M${k},${yt(L-2)}v4"/>${Ot(k,S+5,M?"Derecha":"Izquierda",'text-anchor="middle"')}${bc(k+V.minX,k+V.maxX,S+11,`${yt(V.maxX-V.minX)} mm`)}`}y+=Ot(105,257,"No incluye apoyos nasales laminados, herrajes, bisel ni tolerancia de montaje.",'text-anchor="middle" class="caption"');let E="",C=[];for(let[M,F]of[-1,1].entries()){let w=Dp(t,F),V=Gs(w.outline),k=23,L=86+M*96;if(V.maxX-V.minX>175+1e-5||V.maxY-V.minY>76+1e-5)throw new Error("La patilla excede el \xE1rea \xFAtil de una hoja A4 a escala 1:1. Reduce el ancho de patilla o el largo B.");C.push(w),E+=`${Ot(k,L-41,`PATILLA ${M?"DERECHA":"IZQUIERDA"} \xB7 ${Hs(t.armStyle)}`,'class="sheet-label"')}<path data-part="temple-${F}" d="${yc(w.outline.map(([P,N])=>[k+P,L+N]))}"/><path class="center" d="${Xv(w.centerline.map(([P,N])=>[k+P,L+N]))}"/><path class="center" data-registration="temple-${F}" d="M${k-1.25},${L}h2.5M${k},${L-1.25}v2.5"/>${bc(k,k+V.maxX,L+V.maxY+7,`${yt(V.maxX)} mm \xB7 proyecci\xF3n del patr\xF3n`)}${Ot(k,L+V.maxY+12,`Largo desarrollado del eje: ${yt(w.developedLength)} mm \xB7 ancho inicial: ${yt(w.centerline.length?w.outline[0][1]*-2:0)} mm`,'class="caption"')}`}E+=`${Ot(20,243,"Eje discontinuo \xB7 conserva la curva de terminal y la longitud desarrollada.")}${Ot(20,249,"Conformado, bisagras, alma, bisel y contracci\xF3n requieren un plano de proceso.")}${Ot(20,255,"Validar espesor, herrajes, apoyos y tolerancias antes de cortar material definitivo.",'class="caption"')}`;let I=[Up(1,"Hoja 1 \xB7 frontal y dos lunetas",y,t),Up(2,"Hoja 2 \xB7 ambas patillas",E,t)];return{html:`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Miscante \xB7 patr\xF3n plano preliminar 1:1 \xB7 dos hojas</title><style>@page{size:A4 portrait;margin:0}*{box-sizing:border-box}body{margin:0;background:#dfe3e4}.print-actions{padding:16px;text-align:center;font:14px Arial}.sheet{width:210mm;height:297mm;margin:0 auto;background:white;break-after:page;page-break-after:always;overflow:hidden}.sheet:last-child{break-after:auto;page-break-after:auto}.sheet svg{display:block;width:210mm;height:297mm}@media print{body{background:white}.print-actions{display:none}.sheet{margin:0}}</style></head><body><div class="print-actions"><button onclick="window.print()">Imprimir las dos hojas / guardar PDF</button><p>Selecciona A4, tama\xF1o real 100 %, sin m\xE1rgenes ni encabezados. Comprueba los 100 mm antes de cortar.</p></div>${I.map(M=>`<section class="sheet">${M}</section>`).join("")}</body></html>`,pages:I,source:{type:t.customContour?"imported-regularized":"parametric",verifiedReference:!1,sourcePointCount:t.customContour?.length||null,aperturePointCounts:x.map(M=>M.length)},measurements:{...Wt(t),materialDepth:t.materialDepth,radialWidth:t.thickness,frontPatternWidth:u,nasalClearance:Math.min(...Dt(t,1).map(M=>(M[0]+n[1])/.04))*2,templeDevelopedLengths:C.map(M=>M.developedLength)},checks:{pageCount:2,scale:"1:1",unit:"mm",frontConnected:!0,frontComponentCount:1,frontVoidCount:l.length,lensTemplateCount:2,templeCount:2,closedCutContourCount:7+a.filter(M=>kr(M)<0).length,excludedParts:["added-laminated-nasal-pads","hinges-and-drillings","lens-bevel-and-groove"],holesDisjoint:!0,holesContained:!0,printerCalibrationRequired:!0,manufacturingValidated:!1}}}function Fp(i){let e=gh(i),t=window.open("","_blank");if(!t)throw new Error("Permite abrir la ventana de impresi\xF3n para ver las dos hojas.");return t.document.open(),t.document.write(e.html),t.document.close(),e}xc();var jv="Usa una vista frontal, sin perspectiva, con ambos huecos de cristal cerrados y fondo claro uniforme. Indica despu\xE9s un ancho de cristal conocido para calibrar la escala.";function cs(i){throw new Error(`${i} ${jv}`)}function Zv(i,e,t,n=1){let s=new Int32Array(i.length),r=new Int32Array(i.length),a=[],o=0;for(let l=0;l<i.length;l++){if(i[l]!==n||s[l])continue;let c=++o,u=0,h=1,d=e,f=t,m=0,x=0,g=0,p=0;for(r[0]=l,s[l]=c;u<h;){let v=r[u++],S=v%e,y=Math.floor(v/e);d=Math.min(d,S),m=Math.max(m,S),f=Math.min(f,y),x=Math.max(x,y),g+=S,p+=y;for(let E of[S>0?v-1:-1,S+1<e?v+1:-1,y>0?v-e:-1,y+1<t?v+e:-1])E>=0&&i[E]===n&&!s[E]&&(s[E]=c,r[h++]=E)}a.push({id:c,area:h,minX:d,minY:f,maxX:m,maxY:x,width:m-d+1,height:x-f+1,cx:g/h,cy:p/h,border:d===0||f===0||m===e-1||x===t-1})}return{labels:s,items:a}}function Kv(i){let e=new Uint32Array(256),t=0,n=0;for(let l of i)e[l]++,n+=l,t++;let s=0,r=0,a=0,o=128;for(let l=0;l<255;l++){if(s+=e[l],r+=l*e[l],!s||s===t)continue;let c=r/s-(n-r)/(t-s),u=s*(t-s)*c*c;u>a&&(a=u,o=l)}return o}function Jv(i,e,t){let n=i.filter(r=>!r.border&&r.area>=e*t*.0015&&r.width>=e*.045&&r.height>=t*.04&&r.height/r.width>=.35&&r.height/r.width<=1.3&&r.area/(r.width*r.height)>.45),s=null;for(let r=0;r<n.length;r++)for(let a=r+1;a<n.length;a++){let[o,l]=[n[r],n[a]].sort((v,S)=>v.cx-S.cx),c=(o.width+l.width)/2,u=(o.height+l.height)/2,h=Math.min(o.width,l.width)/Math.max(o.width,l.width),d=Math.min(o.height,l.height)/Math.max(o.height,l.height),f=Math.min(o.area,l.area)/Math.max(o.area,l.area),m=Math.abs(o.cy-l.cy)/u,x=(l.minX-o.maxX)/c;if(h<.8||d<.8||f<.7||m>.16||x<.04||x>.85)continue;let g=(h+d+f)/3,p=g-m*.5+Math.min((o.area+l.area)/(e*t),.3);(!s||p>s.score)&&(s={left:o,right:l,score:p,symmetry:g,vertical:m})}return s}var Op=(i,e,t)=>(e[0]-i[0])*(t[1]-i[1])-(e[1]-i[1])*(t[0]-i[0]);function zp(i){let e=i.sort((s,r)=>s[0]-r[0]||s[1]-r[1]),t=[],n=[];for(let s of e){for(;t.length>=2&&Op(t.at(-2),t.at(-1),s)<=0;)t.pop();t.push(s)}for(let s of e.slice().reverse()){for(;n.length>=2&&Op(n.at(-2),n.at(-1),s)<=0;)n.pop();n.push(s)}return t.slice(0,-1).concat(n.slice(0,-1))}function Bp(i,e,t,n,s=!1){let r=[];for(let a=i.minY;a<=i.maxY;a++)for(let o=i.minX;o<=i.maxX;o++){let l=a*t+o;e[l]===i.id&&(o===0||a===0||o+1===t||a+1===n||e[l-1]!==i.id||e[l+1]!==i.id||e[l-t]!==i.id||e[l+t]!==i.id)&&r.push([(o-i.cx)*(s?-1:1),i.cy-a])}return zp(r)}function kp(i,e){let t=Math.cos(e),n=Math.sin(e),s=0;for(let r=0;r<i.length;r++){let a=i[r],o=i[(r+1)%i.length],l=o[0]-a[0],c=o[1]-a[1],u=t*c-n*l;if(Math.abs(u)<1e-10)continue;let h=(a[0]*c-a[1]*l)/u,d=(a[0]*n-a[1]*t)/u;h>0&&d>=-1e-8&&d<=1+1e-8&&(s=Math.max(s,h))}return s}function Qv(i,e=128){let t=i.map((o,l)=>Math.hypot(o[0]-i[(l+1)%i.length][0],o[1]-i[(l+1)%i.length][1])),n=t.reduce((o,l)=>o+l,0),s=[],r=0,a=0;for(let o=0;o<e;o++){let l=n*o/e;for(;r<t.length-1&&a+t[r]<l;)a+=t[r++];let c=(l-a)/t[r],u=i[r],h=i[(r+1)%i.length];s.push([u[0]+(h[0]-u[0])*c,u[1]+(h[1]-u[1])*c])}return s}function Vp({data:i,width:e,height:t}){(!Number.isInteger(e)||!Number.isInteger(t)||e<80||t<40||e>1200||t>1200||!i||i.length!==e*t*4)&&cs("La imagen debe tener dimensiones entre 80 \xD7 40 y 1200 \xD7 1200 p\xEDxeles.");let n=new Uint8Array(e*t),s=0,r=0;for(let M=0;M<n.length;M++){let F=i[M*4+3]/255;n[M]=Math.round((.2126*i[M*4]+.7152*i[M*4+1]+.0722*i[M*4+2])*F+255*(1-F));let w=M%e,V=Math.floor(M/e);(w<3||V<3||w>=e-3||V>=t-3)&&(s+=n[M],r++)}s/r<205&&cs("No se reconoce un fondo claro alrededor de la montura.");let a=Kv(n),o=[a,80,110,140,170,200,225,240].filter((M,F,w)=>M>=30&&M<=245&&w.indexOf(M)===F),l=null;for(let M of o){let F=new Uint8Array(n.length);for(let L=0;L<n.length;L++)F[L]=n[L]>M?1:0;let{labels:w,items:V}=Zv(F,e,t),k=Jv(V,e,t);k&&(!l||k.score>l.pair.score)&&(l={labels:w,pair:k,threshold:M})}l||cs("No se detectaron dos huecos de cristal cerrados y sim\xE9tricos con suficiente confianza.");let{pair:c,labels:u}=l,h=Bp(c.left,u,e,t,!0),d=Bp(c.right,u,e,t),f=[];for(let M=0;M<128;M++){let F=M/128*Math.PI*2,w=(kp(h,F)+kp(d,F))/2;f.push([w*Math.cos(F),w*Math.sin(F)])}let m=zp(f),x=Qv(m),g=Math.min(...x.map(M=>M[0])),p=Math.max(...x.map(M=>M[0])),v=Math.min(...x.map(M=>M[1])),S=Math.max(...x.map(M=>M[1])),y=(p-g)/2,E=(p+g)/2,C=(S+v)/2,I=(S-v)/(p-g);(I<.45||I>1.25||y<8||m.length<8)&&cs("La proporci\xF3n de los cristales queda fuera del rango estructural admitido.");let b=x.map(([M,F])=>[(M-E)/y,(F-C)/y]);return{customContour:b,contour:b,confidence:Math.max(0,Math.min(.98,c.symmetry-c.vertical*.5)),widthPixels:(c.left.width+c.right.width)/2,aspectRatio:I,diagnostics:["Dos huecos detectados autom\xE1ticamente; contorno suavizado y simetrizado con envolvente convexa.","La escala requiere un ancho A conocido. La profundidad, el puente y los brazos usan los par\xE1metros del dise\xF1o, no se deducen de la foto.","Comprueba las curvas en 2D antes de fabricar; una fotograf\xEDa con perspectiva no proporciona metrolog\xEDa exacta."]}}async function Hp(i){(!i||!["image/png","image/jpeg","image/webp"].includes(i.type)||i.size===0||i.size>10*1024*1024)&&cs("Selecciona una imagen PNG, JPG o WebP v\xE1lida de hasta 10 MB.");let e;try{e=await createImageBitmap(i)}catch{cs("No se pudo decodificar la imagen.")}try{(e.width<80||e.height<40||e.width>16e3||e.height>16e3)&&cs("La resoluci\xF3n de la imagen no es adecuada.");let t=Math.min(1,960/Math.max(e.width,e.height)),n=Math.round(e.width*t),s=Math.round(e.height*t),r=document.createElement("canvas");r.width=n,r.height=s;let a=r.getContext("2d",{willReadFrequently:!0});a||cs("No est\xE1 disponible el an\xE1lisis de imagen en este navegador."),a.fillStyle="#fff",a.fillRect(0,0,n,s),a.drawImage(e,0,0,n,s);let o=a.getImageData(0,0,n,s);return typeof Worker>"u"?Vp(o):await new Promise((l,c)=>{let u=new Worker(new URL("./reference-extraction.js",import.meta.url),{type:"module"}),h=setTimeout(()=>{u.terminate(),c(new Error("El an\xE1lisis tard\xF3 demasiado. Prueba con un recorte frontal m\xE1s simple."))},2e4),d=()=>{clearTimeout(h),u.terminate()};u.onmessage=({data:f})=>{d(),f.error?c(new Error(f.error)):l(f.result)},u.onerror=()=>{d(),c(new Error("No se pudo iniciar el an\xE1lisis local de imagen. Recarga la p\xE1gina e int\xE9ntalo nuevamente."))},u.postMessage({data:o.data,width:n,height:s},[o.data.buffer])})}finally{e.close()}}typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope&&(globalThis.onmessage=({data:i})=>{try{globalThis.postMessage({result:Vp(i)})}catch(e){globalThis.postMessage({error:e.message})}});var xh=i=>i.map(([e,t],n)=>`${n?"L":"M"}${e.toFixed(4)} ${t.toFixed(4)}`).join(" ")+"Z";function Gp(i){let e=an(i),t=Wt(i),n=[-1,1].map(u=>{let h=Vs(i,u).stem[0].point,d=(h[0]-u*.05)/.04,f=-h[1]/.04;return`<rect class="plan-rim" x="${d-2}" y="${f-1.75}" width="4" height="3.5"/>`}).join(""),s=[-1,1].map((u,h)=>`<path class="plan-rim" fill-rule="evenodd" d="${xh(Dt(i,u).map(([d,f])=>[(d+e[h])/.04,-f/.04]))} ${xh(Tn(i,u).map(([d,f])=>[(d+e[h])/.04,-f/.04]))}"/>`).join(""),r=Tn(i,1),a=e[1]/.04+Math.max(...r.map(u=>u[0]))/.04,o=-Math.max(...r.map(u=>u[1]))/.04,l=`<circle class="plan-grip" data-grip="width" cx="${a}" cy="0" r="1.3" tabindex="0" role="slider" aria-label="Ancho A sim\xE9trico" aria-valuemin="40" aria-valuemax="65" aria-valuenow="${t.lens}"/><circle class="plan-grip" data-grip="height" cx="${e[1]/.04}" cy="${o}" r="1.3" tabindex="0" role="slider" aria-label="Altura de silueta" aria-valuemin="85" aria-valuemax="115" aria-valuenow="${Math.round((i.contourAspectScale||1)*100)}"/>`,c=Fi(i).bands.map(u=>`<path class="plan-rim" d="${xh(u.outline.map(([h,d])=>[h/.04,-d/.04]))}"/>`).join("");return`<svg viewBox="-95 -65 190 130" role="img" aria-label="Plano frontal acotado en mil\xEDmetros"><defs><pattern id="plan-grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="#d9e0e3" stroke-width=".12"/></pattern></defs><rect x="-95" y="-65" width="190" height="130" fill="url(#plan-grid)"/><path d="M-95 0H95 M0-65V65" stroke="#a5b4bc" stroke-dasharray="1 1" stroke-width=".18"/>${s}${c}${n}${l}<path d="M${-t.front/2} 43V49 M${t.front/2} 43V49 M${-t.front/2} 47H${t.front/2}" fill="none" stroke="#386473" stroke-width=".22"/><text x="0" y="53" text-anchor="middle" font-size="3" fill="#386473">Frontal ${t.front} mm \xB7 A ${t.lens} / DBL ${t.bridge}</text><text x="-89" y="-56" font-size="3" fill="#386473">PLANO FRONTAL \xB7 5 mm \xB7 arrastra los nodos o usa las flechas</text><text x="-89" y="61" font-size="2.5" fill="#386473">La escala f\xEDsica corresponde al archivo de impresi\xF3n, no al tama\xF1o de pantalla.</text></svg>`}function Wp({root:i,getDesign:e,applyDesign:t,getViewer:n,notify:s}){let r=[],a=-1,o=!1,l=0,c="3d",u=null,h=0,d=document.createElement("div");d.className="workbench-toolbar",d.setAttribute("aria-label","Herramientas del estudio"),d.innerHTML='<div class="workbench-brand"><strong>MISCANTE <span>ATELIER</span></strong><small>DISE\xD1O PARAM\xC9TRICO \xB7 mm</small></div><div class="workbench-actions"><button type="button" id="studio-undo" title="Deshacer \xB7 Ctrl Z">\u21B6 <span>Deshacer</span></button><button type="button" id="studio-redo" title="Rehacer \xB7 Ctrl Shift Z">\u21B7 <span>Rehacer</span></button><i></i><button type="button" data-stage="3d" aria-pressed="true">3D</button><button type="button" data-stage="2d" aria-pressed="false">Plano 2D</button><i></i><button type="button" id="studio-project-save">Guardar proyecto</button><label class="toolbar-file">Abrir<input id="studio-project-open" type="file" accept=".json,application/json"></label><button type="button" id="studio-glb">Exportar 3D</button><button type="button" id="studio-print" class="primary-tool">Patrones \xB7 2 hojas</button></div>',i.prepend(d);let f=document.createElement("aside");f.className="fabrication-note",f.setAttribute("aria-label","Estado de fabricaci\xF3n"),f.innerHTML="<strong>Prueba de taller \xB7 escala digital 1:1</strong><span>Contorno RB2140 sin verificar. Los patrones son preliminares; requieren comprobar luneta real, herrajes y escala impresa.</span>",d.after(f);let m=i.querySelector(".design-visual"),x=document.createElement("div");x.id="studio-plan",x.hidden=!0,m.insertBefore(x,i.querySelector(".preview-controls"));let g=document.createElement("div");g.className="viewport-tools",g.setAttribute("aria-label","Navegaci\xF3n del espacio de dise\xF1o"),g.innerHTML='<button type="button" id="studio-fit" title="Encuadrar">Encuadrar</button><button type="button" data-zoom="1.2" aria-label="Acercar">\uFF0B</button><button type="button" data-zoom="0.833333" aria-label="Alejar">\u2212</button><button type="button" id="studio-projection" aria-pressed="false">Ortogonal</button><button type="button" id="studio-grid" aria-pressed="false">Ret\xEDcula</button><button type="button" id="studio-wire" aria-pressed="false">Aristas</button>',m.insertBefore(g,i.querySelector("#design-preview"));let p=document.createElement("p");p.className="workbench-status",p.setAttribute("role","status"),m.append(p);let v=document.createElement("section");v.className="precision-properties",v.innerHTML=`<h3>Geometr\xEDa y material</h3><p>Medidas independientes en mil\xEDmetros. Los pares conservan simetr\xEDa y contornos cerrados.</p><div class="precision-grid"><label>Ancho de luneta A<input id="precision-a" type="number" min="40" max="65" step="0.1"></label><label>Puente DBL<input id="precision-dbl" type="number" min="14" max="24" step="0.1"></label><label>Plancha de acetato<input id="precision-depth" type="number" min="2" max="12" step="0.1" list="acetate-stock"></label><label>Altura de silueta (%)<input id="precision-aspect" type="number" min="85" max="115" step="1"></label></div><datalist id="acetate-stock">${[2,3,4,6,8].map(L=>`<option value="${L}"></option>`).join("")}</datalist><p class="control-note">Stock: 2, 3, 4, 6 y 8 mm. La plancha define la profundidad; el espesor del aro define la pared alrededor de la luneta.</p><button type="button" id="precision-presets" class="text-link">Recuperar medidas de la talla</button><p id="precision-summary"></p>`,i.querySelector("#studio-panel-1").prepend(v);let S=document.createElement("button");S.type="button",S.id="precision-rb2140",S.className="text-link",S.textContent="Aplicar medidas RB2140 \xB7 50 \u25A1 22",v.append(S);let y=document.createElement("p");y.className="control-note",y.textContent="Referencia de luneta: RB2140 50 \u25A1 22. El trazado exacto a\xFAn no est\xE1 incorporado; este ajuste aplica solamente A y DBL.",v.append(y);let E=document.createElement("section");E.className="reference-automation",E.innerHTML='<h3>De referencia a modelo</h3><p>Fotograf\xEDa frontal o boceto con fondo claro y ambos huecos de las lunetas cerrados. Extraemos el perfil autom\xE1ticamente y lo aplicamos sim\xE9tricamente al 2D y 3D.</p><label class="recipe-drop">Seleccionar foto o boceto<input id="studio-extract-file" type="file" accept="image/jpeg,image/png,image/webp"></label><p id="studio-extract-status" role="status"></p><div id="studio-extract-preview"></div><button type="button" id="studio-apply-reference" class="button dark full" disabled>Aplicar perfil detectado</button><p class="control-note">Calibra el ancho A con una medida real. Se regulariza a un contorno convexo; no deduce profundidad, bisel ni geometr\xEDa oculta. Puedes deshacer y corregir medidas despu\xE9s.</p>',i.querySelector("#studio-panel-0").append(E);let C=document.createElement("section");C.className="reference-automation",C.innerHTML='<h3>Crear un dise\xF1o desde esta imagen</h3><p class="reference-extract-status" role="status">Selecciona una foto frontal o un boceto. El perfil se detectar\xE1 autom\xE1ticamente.</p><button type="button" id="reference-apply-detected" class="button dark full" disabled>Aplicar perfil al modelo 2D y 3D</button><p class="control-note">La detecci\xF3n necesita dos huecos de luneta cerrados sobre fondo claro. Calibra el ancho A con una medida real.</p>',i.querySelector("#reference-dialog").append(C);let I=document.createElement("section");I.className="template-download",I.innerHTML='<h3>Patrones preliminares de taller</h3><p>Dos A4 a escala 1:1: frontal y lunetas; ambos brazos desarrollados. Imprime al 100 %, sin ajustar, y verifica la regla de 100 mm y el cuadrado de 20 \xD7 20 mm.</p><button type="button" id="studio-svg-front">SVG \xB7 frontal y lunetas</button><button type="button" id="studio-svg-temples">SVG \xB7 ambos brazos</button><p class="control-note">Estos son contornos nominales de preparaci\xF3n: faltan tolerancias de ranura, bisel, contracci\xF3n y mecanizado de bisagra. Los apoyos nasales son piezas a\xF1adidas de 3 mm; no se tallan autom\xE1ticamente de la plancha elegida. Los herrajes del 3D son ilustrativos. Comprueba el montaje en material de prueba antes de cortar acetato definitivo.</p>',i.querySelector("#studio-panel-1").append(I);let b=(L,P,N)=>{let U=URL.createObjectURL(new Blob([L],{type:N})),ee=document.createElement("a");ee.href=U,ee.download=P,ee.click(),setTimeout(()=>URL.revokeObjectURL(U),1e3)},M=L=>{p.textContent=L};function F(){let L=e(),P=JSON.stringify(L),N=Date.now();!o&&r[a]!==P&&(a<r.length-1&&(r=r.slice(0,a+1)),N-l<350&&a>0?r[a]=P:(r.push(P),r.length>100&&r.shift(),a=r.length-1),l=N),i.querySelector("#studio-undo").disabled=a<=0,i.querySelector("#studio-redo").disabled=a>=r.length-1;let U=Wt(L);i.querySelector("#precision-a").value=U.lens,i.querySelector("#precision-dbl").value=U.bridge,i.querySelector("#precision-depth").value=L.materialDepth,i.querySelector("#precision-aspect").value=Math.round(L.contourAspectScale*100),i.querySelector("#precision-summary").textContent=`A ${U.lens} \xB7 DBL ${U.bridge} \xB7 B ${U.temple} mm / plancha ${L.materialDepth} mm`,x.innerHTML=Gp(L),i.querySelector("#design-preview").hidden=c==="2d",x.hidden=c!=="2d",L.customContour&&(i.querySelector("#design-rounding").disabled=!0,i.querySelector("#hint-rounding").textContent="Perfil importado protegido. Corrige ancho y altura con l\xEDmites estructurales.");let ee=mh(L);M(ee.length?`REVISAR GEOMETR\xCDA \xB7 ${ee.join(" ")}`:`PATR\xD3N PRELIMINAR \xB7 ${L.customContour?"PERFIL IMPORTADO":"MODELO PARAM\xC9TRICO"} \xB7 ${U.code} \xB7 Plancha ${L.materialDepth} mm`),p.classList.toggle("geometry-issue",ee.length>0),L.migratedFrom&&(p.textContent+=` \xB7 Dise\xF1o antiguo ${L.migratedFrom} migrado a ${L.model}; no es un contorno RB2140 verificado.`)}function w(L){let P=a+L;if(!(P<0||P>=r.length)){a=P,o=!0;try{t(JSON.parse(r[a]))}finally{o=!1}l=0,F()}}i.addEventListener("click",L=>{let P=L.target.closest("button");if(P){P.id==="studio-undo"&&w(-1),P.id==="studio-redo"&&w(1),P.dataset.stage&&(c=P.dataset.stage,d.querySelectorAll("[data-stage]").forEach(N=>N.setAttribute("aria-pressed",N===P)),F()),P.id==="studio-fit"&&n()?.fitView(),P.dataset.zoom&&n()?.zoom(Number(P.dataset.zoom));for(let[N,U]of[["studio-grid","grid"],["studio-wire","wireframe"]])if(P.id===N){let ee=P.getAttribute("aria-pressed")!=="true";P.setAttribute("aria-pressed",ee),n()?.setDisplay({[U]:ee})}if(P.id==="studio-projection"){let N=P.getAttribute("aria-pressed")!=="true";P.setAttribute("aria-pressed",N),n()?.setProjection(N?"orthographic":"perspective")}if(P.id==="studio-project-save"&&b(JSON.stringify({format:"miscante-eyewear",version:1,units:"mm",design:e()},null,2),"miscante-proyecto.json","application/json"),P.id==="studio-print")try{Fp(e())}catch(N){M(N.message)}if(P.id==="studio-svg-front"||P.id==="studio-svg-temples")try{let N=P.id==="studio-svg-front"?0:1;b(gh(e()).pages[N],`miscante-patron-preliminar-hoja-${N+1}.svg`,"image/svg+xml")}catch(N){M(N.message)}if(P.id==="precision-rb2140"&&(t({...e(),lensWidth:50,bridgeWidth:22}),s("Medidas 50 \u25A1 22 aplicadas. La curva exacta RB2140 requiere un trazado calibrado.")),P.id==="studio-glb"){let N=n();if(!N){M("La exportaci\xF3n 3D necesita WebGL disponible.");return}P.disabled=!0,N.exportGLB().then(U=>b(U,"miscante-modelo.glb","model/gltf-binary")).catch(U=>M(U.message)).finally(()=>P.disabled=!1)}if(P.id==="precision-presets"){let N={...e(),contourAspectScale:1};delete N.lensWidth,delete N.bridgeWidth,t(N)}["studio-apply-reference","reference-apply-detected"].includes(P.id)&&u&&(t({...e(),customContour:u.customContour,model:"recto",contourAspectScale:1}),s("Perfil aplicado al modelo 2D y 3D. Calibra A y revisa la forma antes de fabricar."),i.querySelector("#reference-dialog").close())}});for(let[L,P,N]of[["precision-a","lensWidth",1],["precision-dbl","bridgeWidth",1],["precision-depth","materialDepth",1],["precision-aspect","contourAspectScale",.01]])i.querySelector("#"+L).addEventListener("change",U=>{if(!U.target.checkValidity()||!Number.isFinite(U.target.valueAsNumber)){U.target.reportValidity();return}t({...e(),[P]:U.target.valueAsNumber*N})});i.querySelector("#studio-project-open").addEventListener("change",async L=>{let P=L.target.files[0];if(P){try{if(P.size>5e5)throw Error("El proyecto supera 500 KB.");let N=JSON.parse(await P.text());if(N.format!=="miscante-eyewear"||N.version!==1||N.units!=="mm"||!N.design||typeof N.design!="object"||Array.isArray(N.design))throw Error("Selecciona un proyecto Miscante v\xE1lido en mil\xEDmetros.");let U=vt(N.design);if(N.design.customContour&&!U.customContour)throw Error("El contorno del proyecto no cumple los l\xEDmites estructurales.");t(U),s("Proyecto abierto. Puedes deshacer la importaci\xF3n.")}catch(N){M(N.message)}L.target.value=""}});async function V(L){if(!L)return;let P=++h,N=i.querySelector("#studio-extract-status"),U=i.querySelector("#studio-apply-reference"),ee=i.querySelector(".reference-extract-status"),se=i.querySelector("#reference-apply-detected");U.disabled=se.disabled=!0,u=null,N.textContent=ee.textContent="Detectando y regularizando las lunetas\u2026";try{let fe=await Hp(L);if(P!==h)return;u=fe,i.querySelector("#studio-extract-preview").innerHTML=Gp({...e(),model:"recto",customContour:fe.customContour,contourAspectScale:1}),N.textContent=ee.textContent=`Perfil detectado \xB7 confianza ${Math.round(fe.confidence*100)} %. Revisa la propuesta y calibra el ancho A.`,U.disabled=se.disabled=!1}catch(fe){P===h&&(N.textContent=ee.textContent=fe.message,i.querySelector("#studio-extract-preview").replaceChildren())}}i.querySelector("#studio-extract-file").addEventListener("change",L=>V(L.target.files[0])),i.querySelector("#design-reference-photo").addEventListener("change",L=>V(L.target.files[0]));let k=null;return x.addEventListener("pointerdown",L=>{let P=L.target.closest("[data-grip]");if(!P)return;L.preventDefault();let N=e(),U=Wt(N),ee=x.querySelector("svg");k={key:P.dataset.grip,x:L.clientX,y:L.clientY,scale:190/ee.getBoundingClientRect().width,a:U.lens,aspect:N.contourAspectScale,halfHeight:Math.max(...Tn(N,1).map(se=>se[1]))/.04/N.contourAspectScale},x.setPointerCapture(L.pointerId)}),x.addEventListener("pointermove",L=>{if(!k)return;let P=k;P.key==="width"?t({...e(),lensWidth:Math.round(Math.max(40,Math.min(65,P.a+(L.clientX-P.x)*P.scale))*10)/10}):t({...e(),contourAspectScale:Math.max(.85,Math.min(1.15,P.aspect-(L.clientY-P.y)*P.scale/P.halfHeight))})}),x.addEventListener("pointerup",()=>{k=null}),x.addEventListener("pointercancel",()=>{k=null}),x.addEventListener("keydown",L=>{let P=L.target.closest("[data-grip]");if(!P||!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(L.key))return;L.preventDefault();let N=["ArrowRight","ArrowUp"].includes(L.key)?1:-1,U=e();P.dataset.grip==="width"?t({...U,lensWidth:Wt(U).lens+N*.1}):t({...U,contourAspectScale:U.contourAspectScale+N*.01}),x.querySelector(`[data-grip="${P.dataset.grip}"]`)?.focus()}),document.addEventListener("keydown",L=>{!(L.ctrlKey||L.metaKey)||L.altKey||L.target.matches("input,textarea,select")||i.querySelector("dialog[open]")||(L.key.toLowerCase()==="z"&&(L.preventDefault(),w(L.shiftKey?1:-1)),L.key.toLowerCase()==="s"&&(L.preventDefault(),i.querySelector("#studio-project-save").click()))}),F(),{refresh:F}}zi();Oi();function fm({onAdd:i,notify:e}){let t=document.querySelector("#disena");if(!t)return;let n;try{n=JSON.parse(localStorage.getItem("miscante-design")||"null")}catch{}let s=vt(n||Bi),r="perspectiva",a=null,o=null,l=0,c=null,u=null,h=null,d=null,f=!1,m=!1,x="editable",g=0,p=(Y,O)=>Y.map(W=>`<option value="${W.id}" ${O===W.id?"selected":""}>${W.name}${W.price?` \xB7 +${bt(W.price)}`:""}</option>`).join(""),v=(Y,O,W,te,re)=>`<label class="range-label" for="design-${Y}">${O}<output id="value-${Y}" for="design-${Y}"></output></label><input class="design-range" id="design-${Y}" data-setting="${Y}" type="range" min="${W}" max="${te}" value="${s[Y]}" aria-describedby="hint-${Y}"><small id="hint-${Y}">${re}</small>`,S=(Y,O)=>`<fieldset class="color-field"><legend>${O} <span id="color-name-${Y}"></span></legend><div class="swatches">${Xt.map(W=>`<button type="button" data-color-part="${Y}" data-color="${W.id}" style="--swatch:${W.hex}" aria-label="${O}: ${W.name}" aria-pressed="${s[Y]===W.id}"><span></span></button>`).join("")}</div></fieldset>`;t.innerHTML=`<div class="designer-heading"><div><p class="eyebrow">MISCANTE / ESTUDIO PERSONAL</p><h1>Una pieza.<br><em>Solo tuya.</em></h1></div><p>Elige una silueta. Define sus l\xEDneas y su materia.<br>Desde $209.000, con toda la personalizaci\xF3n incluida.</p></div><div class="designer-layout"><div class="design-visual"><div class="preview-top"><span>DISE\xD1ADO POR TI</span><button type="button" id="design-reset">Restablecer \u21BA</button></div><div id="design-preview"></div><div id="reference-photo-view" hidden></div><div class="preview-modes" role="group" aria-label="Tipo de vista previa"><button type="button" data-preview-mode="editable" aria-pressed="true">Dise\xF1o 3D</button><button type="button" data-preview-mode="photo" disabled aria-pressed="false">Foto de referencia</button><button type="button" data-preview-mode="model" disabled aria-pressed="false">Modelo importado</button></div><div class="preview-controls" role="group" aria-label="Vista de la montura"><button type="button" data-view="perspectiva" aria-pressed="true">Perspectiva</button><button type="button" data-view="frente" aria-pressed="false">Frente</button><button type="button" data-view="lateral" aria-pressed="false">Lateral</button></div><p class="preview-disclaimer">Arrastra para explorar el volumen. Vista de dise\xF1o, sujeta a validaci\xF3n de fabricaci\xF3n.</p><div class="design-preview-caption"><span id="design-caption"></span><span>M / 01</span></div></div><div class="design-controls"><form id="designer-form"><fieldset class="design-step"><legend><span>01</span> Tu punto de partida</legend><div class="model-grid">${$n.map(Y=>`<button type="button" class="model-option" data-model="${Y.id}" aria-pressed="${s.model===Y.id}"><span class="model-thumb"><img src="./assets/forms/${Y.id}.webp" alt="Vista 3D de la montura ${Y.name}"></span><strong>${Y.name}</strong><small>${Y.description}</small></button>`).join("")}</div><div class="fit-controls"><h3>Talla y medidas</h3><p class="fit-intro"><strong>52 \u25A1 17\u2013140</strong> indica ancho de un cristal, ancho nominal del puente y largo de la patilla, en mil\xEDmetros. La talla conserva la silueta del modelo.</p><label class="design-label" for="design-frameSize">Talla frontal \xB7 A / P</label><select id="design-frameSize" data-setting="frameSize">${qr.map(Y=>`<option value="${Y.id}">${Y.name} \xB7 ${Y.lens} \u25A1 ${Y.bridge} mm</option>`).join("")}</select><label class="design-label" for="design-templeLength">Largo nominal de patilla \xB7 B</label><select id="design-templeLength" data-setting="templeLength">${[135,140,145,150].map(Y=>`<option value="${Y}">${Y} mm</option>`).join("")}</select><p id="fit-code" class="fit-code" aria-live="polite"></p><button type="button" id="open-fit-guide" class="text-link">Medir mi rostro y orientar mi talla</button></div></fieldset><fieldset class="design-step"><legend><span>02</span> Esculpe la montura</legend><div class="slider-group">${v("rounding","Redondeo de las esquinas",0,100,"Ajuste de esquinas dentro de la silueta del modelo")}${v("thickness","Espesor del aro",3,8,"Espesor de dise\xF1o en mil\xEDmetros")}</div><div class="bridge-settings"><h3>El puente</h3><label class="design-label" for="design-bridgeType">Tipo de puente</label><select id="design-bridgeType" data-setting="bridgeType">${p(Lc,s.bridgeType)}</select><label class="design-label" for="design-bridgeHeight">Ubicaci\xF3n del puente</label><select id="design-bridgeHeight" data-setting="bridgeHeight">${p(Dc,s.bridgeHeight)}</select><p class="control-note">Alto, medio y bajo son posiciones relativas al modelo, no una norma anat\xF3mica universal.</p>${v("bridgeThickness","Espesor del puente",5,12,"Modifica el grosor sin separar los aros")}${v("bridgeNasalCurve","Borde nasal: recto / curvo",0,100,"Solo cambia el borde inferior de apoyo nasal; conserva el borde superior y el tipo de puente")}</div><div class="bridge-settings nasal-settings"><h3>El borde nasal del aro</h3>${v("nasalProjection","Pronunciaci\xF3n del borde nasal del aro",0,100,"Esculpe el propio borde del aro hacia la nariz, de m\xE1s abierto a m\xE1s pronunciado. Conserva el cristal y no modifica las medias lunas interiores.")}<p class="control-note">Todos los modelos incluyen medias lunas nasales interiores. Explora el reverso girando la montura para ver el apoyo. El ajuste sobre la nariz se valida antes de fabricar.</p></div><div class="arm-settings"><h3>Los brazos</h3>${v("armWidth","Ancho del brazo",4,Zs(s),"Desde una patilla fina hasta la altura completa del aro. La curva de la oreja queda fija para el largo nominal B elegido")}</div><div class="arm-pair"><div><label class="design-label" for="design-armStyle">Dise\xF1o de ambos brazos</label><select id="design-armStyle" data-setting="armStyle">${p(ro,s.armStyle)}</select></div></div><p class="control-note">El ancho y el dise\xF1o se aplican siempre a ambos brazos. La curva de la oreja conserva su posici\xF3n seg\xFAn el largo B.</p>${S("rimColor","Aro")}${S("bridgeColor","Puente")}${S("armColor","Brazos")}<p class="control-note">Colores, combinaciones y personalizaci\xF3n de montura incluidos en $209.000.</p></fieldset><fieldset class="design-step"><legend><span>03</span> Tu forma de ver</legend><div class="use-toggle" role="group" aria-label="Uso de las gafas"><button type="button" data-use="sol" aria-pressed="${s.use==="sol"}">De sol<span>Sin graduaci\xF3n</span></button><button type="button" data-use="optico" aria-pressed="${s.use==="optico"}">\xD3ptico<span>Con receta</span></button></div><div id="optical-options" ${s.use==="sol"?"hidden":""}><label class="design-label" for="design-lensType">Tipo de cristales graduados</label><select id="design-lensType" data-setting="lensType">${p(ms,s.lensType)}</select><p class="control-note">Monofocal: una distancia. Bifocal: dos zonas. Multifocal: transici\xF3n progresiva entre distancias. La elecci\xF3n final se valida con tu profesional \xF3ptico.</p><label class="treatment"><input type="checkbox" data-setting="blue" ${s.blue?"checked":""}><span>Filtro de luz azul<small>Tratamiento bluelight</small></span><b>+${bt(2e4)}</b></label><label class="treatment"><input type="checkbox" data-setting="ar" ${s.ar?"checked":""}><span>Antirreflejos<small>Combinable con fotocrom\xE1tico</small></span><b>+${bt(18e3)}</b></label><label class="treatment"><input type="checkbox" data-setting="photo" ${s.photo?"checked":""}><span>Fotocrom\xE1tico<small>Oscurecimiento con la luz exterior</small></span><b>+${bt(45e3)}</b></label><label class="treatment"><input type="checkbox" data-setting="sunOptical" ${s.sunOptical?"checked":""}><span>Sol \xF3ptico<small>Cristales graduados con tinte fijo</small></span><b>+${bt(25e3)}</b></label><p class="control-note">Sol \xF3ptico excluye bluelight, fotocrom\xE1tico y antirreflejos. El fotocrom\xE1tico se puede combinar con antirreflejos.</p></div><div id="photo-color-field" hidden><label class="design-label" for="design-photoColor">Color del fotocrom\xE1tico</label><select id="design-photoColor" data-setting="photoColor">${p(mi,s.photoColor)}</select><p class="control-note">La vista representa el cristal activado en exterior.</p></div><div id="lens-color-field"><label class="design-label" for="design-lensColor">Color del cristal</label><select id="design-lensColor" data-setting="lensColor">${p(ki,s.lensColor)}</select><p id="lens-color-note" class="control-note"></p></div></fieldset><fieldset class="design-step" id="recipe-section" ${s.use==="sol"?"hidden":""}><legend><span>04</span> Tu receta, cuando est\xE9s listo</legend><p>Adjunta una imagen legible o un PDF con tu receta m\xE9dica.</p><label class="recipe-drop" for="design-recipe"><span class="upload-icon">\u2191</span><strong>Seleccionar receta</strong><span>PDF, JPG, PNG o WebP \xB7 hasta 10 MB</span><input id="design-recipe" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"></label><p id="recipe-error" class="field-error" role="alert"></p><div id="recipe-status" aria-live="polite"></div><label class="recipe-later"><input type="checkbox" id="recipe-later"> Adjuntar\xE9 mi receta m\xE1s adelante.</label><p class="recipe-privacy">En esta demostraci\xF3n el archivo se adjunta localmente durante la visita: no se env\xEDa, no se guarda en el navegador y no se publica. Al recargar o cambiar de p\xE1gina deber\xE1s adjuntarlo de nuevo. No uses una receta real para probar.</p></fieldset><details class="reference-tools"><summary>Tus referencias personales</summary><p>Compara tu dise\xF1o con una fotograf\xEDa o un modelo 3D de referencia. Los archivos se mantienen solo durante esta visita.</p><label for="design-reference-photo">Cambiar foto de referencia<input type="file" id="design-reference-photo" accept="image/jpeg,image/png,image/webp"></label><label for="design-reference-glb">Importar modelo de referencia<input type="file" id="design-reference-glb" accept=".glb,model/gltf-binary"></label><small>Imagen hasta 10 MB. Modelo GLB autocontenido hasta 15 MB. El modelo importado se visualiza como referencia; los controles modifican el dise\xF1o Miscante.</small><p id="reference-error" role="alert"></p></details><section class="design-price" aria-label="Resumen del precio"><p class="eyebrow">TU DISE\xD1O, EN DETALLE</p><div id="design-price-lines"></div><div class="design-total"><span>Total estimado</span><strong id="design-total" aria-live="polite" aria-atomic="true"></strong></div><p class="control-note">Precios referenciales en CLP por el par de cristales. El valor final depende de la graduaci\xF3n, \xEDndice, receta y viabilidad de fabricaci\xF3n; requiere cotizaci\xF3n \xF3ptica.</p><p id="design-form-error" class="field-error" role="alert"></p><button class="button dark full" type="submit">A\xF1adir mi dise\xF1o a la bolsa <span>+</span></button><button type="button" id="design-save" class="save-design">Guardar dise\xF1o en este dispositivo</button><p class="control-note">Se guardan las especificaciones, nunca tu receta.</p></section></form></div></div>`;let y=[...t.querySelectorAll("#designer-form > fieldset.design-step")],E=["Modelo","Montura","Cristales","Receta"],C=t.querySelector("#designer-form"),I=document.createElement("div");I.className="studio-tabs",I.setAttribute("role","tablist"),I.setAttribute("aria-label","Personalizar tus gafas");let b=document.createElement("div");b.className="studio-panels",y.forEach((Y,O)=>{Y.id=O===3?"recipe-section":`studio-panel-${O}`,Y.classList.add("studio-panel"),Y.dataset.panelIndex=O,Y.setAttribute("role","tabpanel"),Y.setAttribute("aria-labelledby",`studio-tab-${O}`),Y.hidden=O!==0,b.append(Y);let W=document.createElement("button");W.type="button",W.id=`studio-tab-${O}`,W.dataset.panel=O,W.textContent=E[O],W.setAttribute("role","tab"),W.setAttribute("aria-controls",Y.id),W.setAttribute("aria-selected",O===0),W.tabIndex=O===0?0:-1,I.append(W)}),C.prepend(b),C.prepend(I);let M=$n.find(Y=>Y.id===s.model);t.querySelector(".designer-heading").innerHTML=`<div><p class="eyebrow">MISCANTE / DISE\xD1O PERSONAL</p><h1 id="studio-model-name">${M.name}</h1></div><p>Una montura personal, desde $209.000.<br>Formas y colores incluidos.</p>`,t.querySelector(".reference-provenance")?.remove(),t.querySelectorAll("[data-model]").forEach(Y=>{let O=$n.find(W=>W.id===Y.dataset.model);Y.innerHTML=`<span class="model-thumb"><img src="./assets/forms/${O.id}.webp" alt="Vista 3D de la montura ${O.name}"></span><strong>${O.name}</strong><small>${O.description}</small>`});let F=document.createElement("dialog");F.id="reference-dialog",F.setAttribute("aria-label","Comparar una referencia"),F.innerHTML='<button type="button" class="close" data-close aria-label="Cerrar">\xD7</button><p class="eyebrow">REFERENCIA PERSONAL</p><h2>Una referencia, aparte.</h2><p class="reference-explanation">Una foto o archivo importado es una referencia fija. Los controles modifican siempre tu montura Miscante en la vista principal.</p>',F.append(t.querySelector("#reference-photo-view"));let w=document.createElement("div");w.id="reference-model-view",w.hidden=!0,F.append(w),F.append(t.querySelector(".reference-tools")),t.append(F),t.querySelector(".reference-tools").open=!0,t.querySelector(".preview-modes").hidden=!0;let V=document.createElement("button");V.type="button",V.id="open-reference",V.textContent="Comparar una referencia",V.className="reference-link",t.querySelector(".design-visual").append(V),t.querySelector(".preview-top > span").textContent="MISCANTE \xB7 DISE\xD1O EN VIVO",t.querySelector(".design-controls").prepend(t.querySelector(".designer-heading"));let k=t.querySelector(".design-price"),L=t.querySelector("#design-price-lines"),P=document.createElement("details");P.className="price-breakdown",P.innerHTML="<summary>Ver desglose</summary>",P.append(L),k.prepend(P),k.querySelector(".eyebrow").remove();function N(Y){y.forEach((O,W)=>O.hidden=W!==Y),I.querySelectorAll("[data-panel]").forEach((O,W)=>{O.setAttribute("aria-selected",W===Y),O.tabIndex=W===Y?0:-1})}I.addEventListener("keydown",Y=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(Y.key))return;Y.preventDefault();let O=[...I.querySelectorAll("[data-panel]")].filter(re=>!re.disabled),W=O.indexOf(document.activeElement),te=Y.key==="Home"?O[0]:Y.key==="End"?O.at(-1):O[(W+(Y.key==="ArrowRight"?1:O.length-1))%O.length];N(Number(te.dataset.panel)),te.focus()});let U=document.createElement("dialog");U.id="fit-guide-dialog",U.setAttribute("aria-label","Gu\xEDa de talla y medidas"),U.innerHTML='<button type="button" class="close" data-close aria-label="Cerrar gu\xEDa">\xD7</button><p class="eyebrow">MISCANTE / MEDIDAS Y AJUSTE</p><h2>La talla acompa\xF1a<br>tu forma de mirar.</h2><p>El c\xF3digo de una montura se lee en mil\xEDmetros. En <strong>52 \u25A1 17\u2013140</strong>, A = 52 es el ancho horizontal de un cristal; P = 17 es el ancho nominal del puente entre cristales; B = 140 es la longitud de la patilla. P es una medida de talla entre cristales; no es el espesor del material del puente. El c\xF3digo no indica la distancia pupilar ni equivale al ancho total de la cara.</p><div class="fit-diagram" aria-label="Medidas A, P y B de una montura"><span><b>A</b> Ancho de cristal</span><span><b>P</b> Puente nominal</span><span><b>B</b> Largo de patilla</span></div><p>Para empezar, compara el c\xF3digo con unas gafas que ya te queden c\xF3modas. El frontal debe acompa\xF1ar el ancho del rostro sin presi\xF3n lateral; la montura debe apoyarse de forma estable en la nariz y detr\xE1s de las orejas. La altura del puente y el ajuste de cristales graduados requieren revisi\xF3n profesional.</p><label for="fit-face-width">Ancho del rostro entre sienes (mm)</label><input id="fit-face-width" type="number" inputmode="decimal" min="80" max="190" step=".5" placeholder="Por ejemplo, 133"><p class="control-note">Usa una medida directa y horizontal, preferiblemente tomada por un profesional. Una fotograf\xEDa sin escala puede distorsionarla. Este dato no se env\xEDa ni se guarda.</p><div id="fit-advice" aria-live="polite"></div><button type="button" id="apply-fit-size" class="button dark full" disabled>Aplicar talla sugerida</button><p class="fit-caveat">La sugerencia compara tu dato con el ancho frontal aproximado de cada talla. Es una estimaci\xF3n geom\xE9trica del configurador, no una validaci\xF3n cl\xEDnica ni una garant\xEDa de ajuste. No deduce el largo de patilla, la distancia pupilar ni la altura del puente a partir del ancho de cara.</p><details><summary>Fuentes de consulta y alcance</summary><p>Se contrastaron las definiciones de puente, patilla y comodidad con la <a href="https://github.com/GODFREYnganga/Specs/blob/648c536e2b967157699546e1d58521d6560c2790/components/size-guide.tsx" target="_blank" rel="noopener noreferrer">gu\xEDa p\xFAblica de tallas SPECS</a>, una referencia informativa comunitaria, no una norma cl\xEDnica. Para ampliar la lectura del c\xF3digo A / P / B, consulta tambi\xE9n las gu\xEDas de <a href="https://www.warbyparker.com/learn/glasses-measurements" target="_blank" rel="noopener noreferrer">Warby Parker</a> y <a href="https://www.zennioptical.com/blog/how-to-measure-your-frame-size/" target="_blank" rel="noopener noreferrer">Zenni Optical</a>. Las posiciones alto / medio / bajo y el algoritmo de proximidad de ancho son decisiones de esta visualizaci\xF3n; no se atribuyen a esas gu\xEDas como est\xE1ndares m\xE9dicos.</p></details>',t.append(U);let ee=null;function se(){let Y=U.querySelector("#fit-face-width"),O=U.querySelector("#fit-advice"),W=U.querySelector("#apply-fit-size");if(ee=Ed(Y.value,s),!Y.value){O.textContent="Introduce tu medida para comparar las tallas.",W.disabled=!0;return}if(!ee){O.textContent="Revisa la medida: utiliza mil\xEDmetros y un valor entre 80 y 190.",W.disabled=!0;return}if(!ee.withinRange){O.textContent=`Tu medida queda fuera del rango frontal aproximado disponible (${ee.minimum}\u2013${ee.maximum} mm). Se requiere valorar otra talla con un profesional; no se aplica una sugerencia autom\xE1tica.`,W.disabled=!0;return}let te=Math.abs(ee.measurements.front-Number(Y.value));O.textContent=`La m\xE1s cercana es ${ee.size.name}: frontal estimado ${ee.measurements.front} mm, frente a tus ${Number(Y.value)} mm (${te.toFixed(1)} mm de diferencia). Comprueba el ajuste antes de confirmar.`,W.disabled=!1}U.querySelector("#fit-face-width").addEventListener("input",se),U.querySelector("#apply-fit-size").addEventListener("click",()=>{ee?.withinRange&&(s.frameSize=ee.size.id,Ae(),U.close(),e("Talla frontal aplicada. El largo de patilla se elige por separado."))});let fe="",ye=null;function j(){let Y=JSON.stringify(s);if(t.dataset.design=Y,!u){t.querySelector("#design-preview").innerHTML=oo(s,r);return}if(Y===fe){u.showReference(!1);return}fe=Y,ye&&cancelAnimationFrame(ye);let O={...s};ye=requestAnimationFrame(()=>{ye=null,u.update(O),u.showReference(!1)})}function X(){l++,a=null,o&&URL.revokeObjectURL(o),o=null,t.querySelector("#design-recipe").value="",t.querySelector("#recipe-status").replaceChildren()}function Ae(){s=vt(s),j(),t.querySelector("#design-preview").hidden=!1;let Y=$n.find(re=>re.id===s.model);t.querySelector("#studio-model-name").textContent=Y.name,t.querySelector("#design-rounding").disabled=!!Y.lockRounding,t.querySelector("#hint-rounding").textContent=Y.lockRounding?"La curva de este modelo est\xE1 protegida: cambia talla y espesores sin deformar su perfil.":"Ajuste de esquinas dentro de la silueta del modelo",t.querySelector("#design-armWidth").max=Zs(s);let O=Wt(s);t.querySelector("#fit-code").textContent=`${O.code} \xB7 frontal aproximado ${O.front} mm`,U.open&&se(),t.querySelector("#reference-photo-view").hidden=!d,t.querySelector("#design-caption").textContent=ao(s),t.querySelector(".preview-disclaimer").textContent=t.dataset.renderer==="fallback"?"Vista simplificada editable \xB7 Para girar el producto se necesita WebGL.":s.use==="optico"&&s.photo?"Simulaci\xF3n de fotocrom\xE1tico activado al exterior \xB7 Vista orientativa.":"Arrastra para explorar el volumen. Vista de dise\xF1o, sujeta a validaci\xF3n de fabricaci\xF3n.";for(let re of["rounding","thickness","bridgeThickness","bridgeNasalCurve","armWidth","nasalProjection"])t.querySelector(`#value-${re}`).textContent=s[re]+(["thickness","bridgeThickness","armWidth"].includes(re)?" mm":" / 100"),t.querySelector(`[data-setting="${re}"]`).value=s[re];t.querySelectorAll("[data-setting]").forEach(re=>{re.type==="checkbox"?re.checked=s[re.dataset.setting]:re.value=s[re.dataset.setting]}),t.querySelectorAll("[data-model]").forEach(re=>re.setAttribute("aria-pressed",re.dataset.model===s.model)),t.querySelectorAll("[data-use]").forEach(re=>re.setAttribute("aria-pressed",re.dataset.use===s.use)),t.querySelectorAll("[data-view]").forEach(re=>re.setAttribute("aria-pressed",re.dataset.view===r)),t.querySelectorAll("[data-color-part]").forEach(re=>re.setAttribute("aria-pressed",s[re.dataset.colorPart]===re.dataset.color));for(let re of["rimColor","bridgeColor","armColor"])t.querySelector(`#color-name-${re}`).textContent=Xt.find(le=>le.id===s[re]).name;t.querySelector("#optical-options").hidden=s.use!=="optico";for(let re of["blue","photo","ar"])t.querySelector(`[data-setting="${re}"]`).disabled=s.sunOptical;t.querySelector("#photo-color-field").hidden=!(s.use==="optico"&&s.photo);let W=I.querySelector('[data-panel="3"]');W.disabled=s.use!=="optico",s.use!=="optico"&&W.getAttribute("aria-selected")==="true"&&N(2),t.querySelector("#lens-color-field").hidden=s.use==="optico"&&!s.sunOptical,t.querySelector("#lens-color-note").textContent=s.use==="sol"?"El tinte seleccionado se refleja en la vista previa.":"Color del tinte fijo en los cristales graduados.";let te=gs(s);t.querySelector("#design-price-lines").innerHTML=te.lines.map(re=>`<p><span>${re.label}</span><span>${bt(re.amount)}</span></p>`).join(""),t.querySelector("#design-total").textContent=bt(te.total),t.querySelector("#design-form-error").textContent="",c?.refresh()}t.addEventListener("input",Y=>{let O=Y.target.dataset.setting;O&&(s[O]=Y.target.type==="checkbox"?Y.target.checked:Y.target.value,O==="sunOptical"&&s.sunOptical&&(s.photo=!1,s.blue=!1,s.ar=!1),Ae())}),t.addEventListener("click",Y=>{let O=Y.target.closest("button");if(O){if(O.dataset.panel!==void 0&&N(Number(O.dataset.panel)),O.id==="open-fit-guide"&&(se(),U.showModal()),O.id==="open-reference"&&F.showModal(),O.dataset.previewMode&&(O.dataset.previewMode!=="editable"&&F.showModal(),x="editable",Ae()),O.dataset.model){f&&d?.startsWith("blob:")&&URL.revokeObjectURL(d),f=!1,d=null,x="editable";let W=$n.find(te=>te.id===O.dataset.model);s.model=W.id,delete s.customContour,s.contourAspectScale=1,s.rounding=W.rounding,Ae()}if(O.dataset.view&&(r=O.dataset.view,u?.setView(r),Ae()),O.dataset.use&&(s.use=O.dataset.use,s.use==="sol"&&X(),Ae()),O.dataset.colorPart&&(s[O.dataset.colorPart]=O.dataset.color,Ae()),O.id==="design-reset"&&(s={...Bi},r="perspectiva",u?.setView(r),fe="",x="editable",X(),t.querySelector("#recipe-later").checked=!1,t.querySelector("#recipe-error").textContent="",Ae(),e("Volviste al dise\xF1o inicial.")),O.id==="recipe-remove"&&(X(),e("Receta retirada de este dise\xF1o.")),O.id==="design-save")try{localStorage.setItem("miscante-design",JSON.stringify(s)),e("Dise\xF1o guardado. La receta no se guarda.")}catch{e("No se pudo guardar el dise\xF1o en este navegador.")}}}),t.querySelector("#design-recipe").addEventListener("change",async Y=>{let O=Y.target,W=O.files[0];X();let te=l,re=t.querySelector("#recipe-error");if(re.textContent="",!W)return;let le=Ks(W);if(!le)try{let Q=new Uint8Array(await W.slice(0,12).arrayBuffer());Js(Q,W)||(le="El contenido no coincide con un PDF o una imagen compatible.")}catch{le="No se pudo leer el archivo. Intenta seleccionarlo de nuevo."}if(te!==l)return;if(le){re.textContent=le;return}a=W,t.querySelector("#recipe-later").checked=!1;let Se=t.querySelector("#recipe-status"),We=document.createElement("p");if(We.textContent=`Adjunta localmente: ${W.name} \xB7 ${(W.size/1024).toFixed(0)} KB`,Se.append(We),W.type.startsWith("image/")){o=URL.createObjectURL(W);let Q=document.createElement("img");Q.src=o,Q.alt="Vista previa local de la receta adjunta",Q.className="recipe-preview",Se.append(Q)}let Ce=document.createElement("button");Ce.type="button",Ce.id="recipe-remove",Ce.className="text-link",Ce.textContent="Quitar receta",Se.append(Ce)}),t.querySelector("#designer-form").addEventListener("submit",Y=>{if(Y.preventDefault(),s.use==="optico"&&!a&&!t.querySelector("#recipe-later").checked){t.querySelector("#design-form-error").textContent="Adjunta tu receta o selecciona que la adjuntar\xE1s m\xE1s adelante.",N(3),t.querySelector("#recipe-section").scrollIntoView({block:"center",behavior:"smooth"}),t.querySelector("#recipe-later").focus({preventScroll:!0});return}i({config:vt(s),recipe:s.use==="optico"?a:null})}),c=Wp({root:t,getDesign:()=>s,applyDesign:Y=>{s=vt(Y),Ae()},getViewer:()=>u,notify:e}),Ae(),Promise.resolve().then(()=>(fd(),dd)).then(({createDesignRenderer:Y})=>{u=Y(t.querySelector("#design-preview")),t.dataset.renderer="webgl",fe="",u.setView(r),Ae()}).catch(()=>{t.dataset.renderer="fallback",t.querySelector(".preview-disclaimer").textContent="Vista de forma simplificada \xB7 La vista 3D requiere WebGL."}),t.querySelector("#design-reference-photo").addEventListener("change",async Y=>{let O=Y.target.files[0];if(!O)return;let W=t.querySelector("#reference-error");if(W.textContent="",O.size>10*1024*1024||!["image/jpeg","image/png","image/webp"].includes(O.type)){W.textContent="Selecciona una imagen JPG, PNG o WebP de hasta 10 MB.";return}f&&d&&URL.revokeObjectURL(d),f=!0,d=URL.createObjectURL(O);let te=new Image;te.alt="Tu fotograf\xEDa de referencia",te.src=d,t.querySelector("#reference-photo-view").replaceChildren(te),x="editable",Ae(),F.showModal()}),t.querySelector("#design-reference-glb").addEventListener("change",async Y=>{let O=Y.target.files[0];if(!O)return;let W=t.querySelector("#reference-error"),te=++g;W.textContent="";try{if(F.open||F.showModal(),w.hidden=!1,!h){let{createDesignRenderer:re}=await Promise.resolve().then(()=>(fd(),dd));h=re(w),h.canvas.setAttribute("aria-label","Modelo importado de referencia. No sustituye tu dise\xF1o editable.")}if(await h.loadReference(O),te!==g)return;w.dataset.loaded="true",e("Modelo de referencia abierto por separado. Tu dise\xF1o se conserva.")}catch(re){W.textContent=re.message||"No se pudo abrir el modelo."}})}zi();Oi();var rt=i=>document.querySelector(i),xm=(i,e)=>{try{return JSON.parse(localStorage.getItem(i))??e}catch{return e}},kt=xm("miscante-cart",[]);kt=Array.isArray(kt)?kt.filter(i=>i&&Number.isInteger(i.qty)&&i.qty>0&&i.qty<=10&&(gi.some(e=>e.id===i.id)||i.custom===!0&&/^custom-[a-f0-9-]{36}$/.test(i.id)||gi.some(e=>e.id===i.productId)&&/^configured-[a-f0-9-]{36}$/.test(i.id))).map(i=>i.custom?{id:i.id,custom:!0,config:vt(i.config),qty:i.qty}:i.productId?{id:i.id,productId:i.productId,config:vt(i.config),qty:i.qty}:{id:i.id,qty:i.qty}):[];var Xn=new Map,Db=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Mn=xm("miscante-favorites",[]);Mn=Array.isArray(Mn)?Mn.filter(i=>gi.some(e=>e.id===i)):[];var Ja="all",pm,pd=(i,e)=>{try{localStorage.setItem(i,JSON.stringify(e))}catch{qs("El navegador no permite guardar datos. Se conservar\xE1n durante esta visita.")}};function qs(i){rt("#toast").textContent=i,rt("#toast").classList.add("show"),clearTimeout(pm),pm=setTimeout(()=>rt("#toast").classList.remove("show"),4e3)}var Gr='<button class="close" data-close aria-label="Cerrar">\xD7</button>';function Wr(i,e){i.innerHTML=e,i.open||i.showModal()}function Xr(){pd("miscante-cart",kt),rt("#cart-count").textContent=kt.reduce((i,e)=>i+e.qty,0)}function Xs(){if(!rt("#products"))return;let i=rt("#search").value.trim().toLocaleLowerCase("es"),e=gi.filter(n=>(Ja==="all"||Ja==="favoritos"&&Mn.includes(n.id)||n.category===Ja)&&`${n.name} ${n.color} ${n.material}`.toLocaleLowerCase("es").includes(i)),t=rt("#sort").value;t==="price-up"&&e.sort((n,s)=>n.price-s.price),t==="price-down"&&e.sort((n,s)=>s.price-n.price),t==="name"&&e.sort((n,s)=>n.name.localeCompare(s.name)),rt("#result-count").textContent=`${e.length} modelos encontrados`,rt("#products").innerHTML=e.length?e.map(n=>`<article class="product"><div class="product-art" style="background:${n.bg}"><span class="product-tag">${n.tag}</span><button class="favorite ${Mn.includes(n.id)?"selected":""}" data-favorite="${n.id}" aria-label="${Mn.includes(n.id)?"Quitar de":"A\xF1adir a"} favoritos: ${n.name}" aria-pressed="${Mn.includes(n.id)}">${Mn.includes(n.id)?"\u2665":"\u2661"}</button><button class="product-image" data-product="${n.id}" aria-label="Ver ${n.name}">${co(n)}</button><button class="quick-add" data-add="${n.id}">Elegir cristales +</button></div><div class="product-heading"><button data-product="${n.id}">${n.name}</button><span>Desde ${bt(n.price)}</span></div><p>${n.category==="sol"?"Gafas de sol":"Montura \xF3ptica"} \xB7 ${n.material}</p><span class="color-dot" style="background:${n.hex}"></span><small>${n.color}</small></article>`).join(""):'<div class="empty"><h3>No encontramos modelos.</h3><p>Prueba otra b\xFAsqueda o explora toda la colecci\xF3n.</p><button class="button dark" id="reset-filters">Ver todas las gafas</button></div>'}function mm(i){let e=gi.find(t=>t.id===i);Wr(rt("#product-dialog"),`${Gr}<div class="detail-art" style="background:${e.bg}">${co(e)}</div><div class="detail-copy"><p class="eyebrow">COLECCI\xD3N 01 \xB7 ${e.category==="sol"?"DE SOL":"\xD3PTICAS"}</p><h2>${e.name}</h2><p>Precio base ${bt(e.price)} <small>CLP</small></p><p>Una silueta ${e.shape==="round"?"redonda":e.shape==="cat"?"de l\xEDneas expresivas":"rectangular"} con presencia sutil. Comodidad y car\xE1cter para acompa\xF1ar tu forma de mirar.</p><p><span class="color-dot" style="background:${e.hex}"></span> ${e.color}</p><dl><dt>Material</dt><dd>${e.material}</dd><dt>Lente \xB7 puente \xB7 patilla</dt><dd>${e.size} mm</dd><dt>Cristales</dt><dd>${e.category==="sol"?"Protecci\xF3n UV400":"Sin graduaci\xF3n"}</dd><dt>Incluye</dt><dd>Estuche y pa\xF1o de microfibra</dd></dl><div id="product-lens-options"></div><small>Cat\xE1logo ilustrativo. Compra de demostraci\xF3n.</small></div>`),Cd(rt("#product-lens-options"),e,({config:t,recipe:n})=>{let s=`configured-${crypto.randomUUID()}`;kt.push({id:s,productId:e.id,config:t,qty:1}),n&&Xn.set(s,n),Xr(),rt("#product-dialog").close(),qs("Gafas y cristales a\xF1adidos a tu bolsa.")})}function Hr(){let i=Uc(kt),e=kt.map(t=>{let n=t.custom?null:wd(t),s=t.custom?"Tu dise\xF1o Miscante":n.name,r=lo(t).total,a=t.custom?oo(t.config):co(n),o=t.custom?ao(t.config):n.color,l="";if(t.custom){let c=t.config,u=Wt(c);o+=` \xB7 Aro ${Xt.find(h=>h.id===c.rimColor).name} / Puente ${Xt.find(h=>h.id===c.bridgeColor).name} / Brazos ${Xt.find(h=>h.id===c.armColor).name}`,l=`<details class="cart-design-details"><summary>Ver especificaciones y precio</summary><dl><dt>Bordes del aro</dt><dd>${c.rounding}/100</dd><dt>Talla A / P / B</dt><dd>${u.code}</dd><dt>Frontal aproximado</dt><dd>${u.front} mm</dd><dt>Puente</dt><dd>${c.bridgeType} \xB7 ${c.bridgeHeight} \xB7 espesor ${c.bridgeThickness} mm</dd><dt>Borde nasal</dt><dd>${c.bridgeNasalCurve}/100 \xB7 borde del aro ${c.nasalProjection}/100 \xB7 medias lunas interiores</dd><dt>Brazos</dt><dd>${c.armStyle} \xB7 ambos brazos \xB7 ancho ${c.armWidth} mm</dd><dt>Cristal</dt><dd>${c.use==="sol"||c.sunOptical?c.lensColor:c.photo?"Fotocrom\xE1tico "+c.photoColor:"Transparente"}${c.blue&&c.use==="optico"?" \xB7 Bluelight":""}${c.ar?" \xB7 Antirreflejos":""}</dd></dl>${gs(c).lines.map(h=>`<p><span>${h.label}</span><span>${bt(h.amount)}</span></p>`).join("")}</details>`}else if(t.config){let c=t.config;o+=` \xB7 ${c.use==="optico"?"Con graduaci\xF3n":"Sin graduaci\xF3n"}`,l=`<details class="cart-design-details"><summary>Ver cristales y precio</summary><p>${c.use==="optico"?c.lensType==="mono"?"Monofocales":c.lensType==="bi"?"Bifocales":"Multifocales":"Sin graduaci\xF3n"}${c.blue?" \xB7 Luz azul":""}${c.ar?" \xB7 Antirreflejos":""}${c.photo?" \xB7 Fotocrom\xE1tico "+c.photoColor:""}${c.sunOptical?" \xB7 Sol \xF3ptico "+c.lensColor:""}</p>${lo(t).lines.map(u=>`<p><span>${u.label}</span><span>${bt(u.amount)}</span></p>`).join("")}</details>`}return t.config?.use==="optico"&&(l+=`<div class="cart-recipe"><p>${Xn.has(t.id)?`Receta adjunta localmente: ${Db(Xn.get(t.id).name)}`:"Receta pendiente \xB7 puedes adjuntarla ahora o m\xE1s adelante."}</p><label class="text-link">${Xn.has(t.id)?"Cambiar receta":"Adjuntar receta"}<input type="file" data-cart-recipe="${t.id}" accept=".pdf,.jpg,.jpeg,.png,.webp" aria-label="Adjuntar receta a tus gafas"></label>${Xn.has(t.id)?`<button type="button" class="text-link" data-remove-recipe="${t.id}">Quitar</button>`:""}<small>Solo durante esta visita. No se env\xEDa ni se conserva al recargar.</small></div>`),`<article class="cart-item ${t.custom?"custom-cart-item":""}"><div style="background:${n?.bg||"#ebe7dc"}">${a}</div><section><h3>${s}</h3><small>${o}</small><p>${bt(r)}</p><div class="quantity"><button data-qty="${t.id}" data-delta="-1" aria-label="Reducir cantidad de ${s}">\u2212</button><span>${t.qty}</span><button data-qty="${t.id}" data-delta="1" aria-label="Aumentar cantidad de ${s}">+</button><button class="remove" data-remove="${t.id}">Eliminar</button></div></section>${l}</article>`}).join("");Wr(rt("#cart-dialog"),`${Gr}<p class="eyebrow">TUS ESENCIALES</p><h2>Tu bolsa <small>(${kt.reduce((t,n)=>t+n.qty,0)})</small></h2>${kt.length?`<div class="cart-items">${e}</div><div class="totals"><p>Subtotal <span>${bt(i.subtotal)}</span></p><p>Env\xEDo <span>${i.shipping?bt(i.shipping):"Sin costo"}</span></p><p class="total">Total <span>${bt(i.total)} CLP</span></p></div><button id="checkout" class="button dark full">Continuar <span>\u2192</span></button><p class="fine">Compra de demostraci\xF3n. No se realizar\xE1n cargos. Los dise\xF1os graduados requieren validaci\xF3n de receta y cotizaci\xF3n final.</p>`:'<div class="empty"><p>Tu pr\xF3xima perspectiva te espera.</p><button class="button dark" data-close>Seguir explorando \u2192</button></div>'}`)}function Nb(){Wr(rt("#cart-dialog"),`${Gr}<p class="eyebrow">\xDALTIMO PASO \xB7 DEMOSTRACI\xD3N</p><h2>Hazlo tuyo.</h2><p class="fine">No ingreses datos reales de pago. Este formulario no env\xEDa informaci\xF3n ni crea un pedido comercial.</p><form id="checkout-form"><label>Nombre<input name="name" autocomplete="name" required maxlength="100"></label><label>Correo electr\xF3nico<input name="email" type="email" autocomplete="email" required maxlength="254"></label><label>Direcci\xF3n de entrega<input name="address" autocomplete="street-address" required maxlength="200"></label><label>Ciudad<input name="city" autocomplete="address-level2" required maxlength="100"></label><label class="checkbox"><input type="checkbox" required> Entiendo que esta es una compra de demostraci\xF3n.</label><div class="totals"><p class="total">Total simulado <span>${bt(Uc(kt).total)}</span></p></div><button class="button dark full">Confirmar pedido de prueba <svg class="arrow" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button><button type="button" id="back-cart" class="text-link">Volver a la bolsa</button></form>`)}document.addEventListener("click",i=>{let e=i.target.closest("button");if(e){if(e.hasAttribute("data-close")&&e.closest("dialog").close(),e.dataset.product&&mm(e.dataset.product),e.dataset.add&&mm(e.dataset.add),e.dataset.favorite){let t=e.dataset.favorite;Mn=Mn.includes(t)?Mn.filter(n=>n!==t):[...Mn,t],pd("miscante-favorites",Mn),Xs()}if(e.dataset.category&&(Ja=e.dataset.category,document.querySelectorAll("[data-category]").forEach(t=>t.classList.toggle("active",t===e)),Xs()),e.dataset.qty){let t=kt.find(n=>n.id===e.dataset.qty);t&&(t.qty=Math.min(10,t.qty+Number(e.dataset.delta)),kt=kt.filter(n=>n.qty>0),t.qty<=0&&Xn.delete(t.id),Xr(),Hr())}if(e.dataset.remove&&(Xn.delete(e.dataset.remove),kt=kt.filter(t=>t.id!==e.dataset.remove),Xr(),Hr()),e.dataset.removeRecipe&&(Xn.delete(e.dataset.removeRecipe),Hr()),e.id==="menu-toggle"&&rt("#menu-dialog").showModal(),e.id==="cart-toggle"&&Hr(),e.id==="checkout"&&Nb(),e.id==="back-cart"&&Hr(),e.id==="search-toggle"&&!rt("#search-bar")){location.href="./coleccion.html?buscar=1";return}e.id==="search-toggle"&&(rt("#search-bar").hidden=!rt("#search-bar").hidden,rt("#search-bar").hidden||(rt("#coleccion").scrollIntoView(),rt("#search").focus())),e.id==="clear-search"&&(rt("#search").value="",Xs()),e.id==="reset-filters"&&(Ja="all",rt("#search").value="",document.querySelectorAll("[data-category]").forEach(t=>t.classList.toggle("active",t.dataset.category==="all")),Xs()),e.id==="contact-open"&&Wr(rt("#info-dialog"),`${Gr}<p class="eyebrow">CONVERSEMOS</p><h2>Tu mirada importa.</h2><p>El canal de atenci\xF3n estar\xE1 disponible cuando se habilite la tienda. Por ahora puedes explorar la colecci\xF3n y probar tu compra sin cargos.</p><button class="button dark" data-close>Entendido</button>`),e.dataset.info&&Wr(rt("#info-dialog"),`${Gr}<h2>${e.dataset.info==="privacy"?"Tu privacidad":"T\xE9rminos de la demostraci\xF3n"}</h2><p>${e.dataset.info==="privacy"?"El carrito, los favoritos y la suscripci\xF3n de prueba se guardan \xFAnicamente en este navegador. No utilizamos anal\xEDtica ni enviamos formularios a un servidor. Los datos de entrega de prueba solo se mantienen en memoria mientras est\xE1 abierto el formulario. Las recetas se adjuntan temporalmente en memoria durante esta visita y nunca se env\xEDan a un servidor ni se guardan en el navegador. Al recargar o cambiar de p\xE1gina se deben adjuntar nuevamente.":"Los productos, precios y atributos son ilustrativos. Esta web permite probar una experiencia de compra; no cobra, reserva inventario ni genera contratos o pedidos reales. Antes de abrir la venta se deben confirmar los productos, pol\xEDticas y medios de pago."}</p><button data-close class="button dark">Entendido</button>`)}});document.addEventListener("submit",i=>{if(i.target.id==="newsletter-form"&&(i.preventDefault(),pd("miscante-newsletter",!0),i.target.reset(),qs("\xA1Gracias! Tu suscripci\xF3n de prueba qued\xF3 registrada en este navegador.")),i.target.id==="checkout-form"){if(i.preventDefault(),!i.target.reportValidity())return;kt=[],Xn.clear(),Xr(),Wr(rt("#cart-dialog"),`${Gr}<div class="success-mark">\u2713</div><p class="eyebrow">PEDIDO DE PRUEBA COMPLETADO</p><h2>Una nueva perspectiva.</h2><p>Has completado la experiencia de compra. No se ha cobrado ni enviado ning\xFAn pedido.</p><button class="button dark full" data-close>Volver a la colecci\xF3n <svg class="arrow" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button>`)}});document.querySelectorAll("dialog").forEach(i=>i.addEventListener("click",e=>{if(e.target===i){let t=i.getBoundingClientRect();(e.clientX<t.left||e.clientX>t.right||e.clientY<t.top||e.clientY>t.bottom)&&i.close()}}));rt("#search")?.addEventListener("input",Xs);rt("#sort")?.addEventListener("change",Xs);Xr();Xs();fm({notify:qs,onAdd:({config:i,recipe:e})=>{let t=`custom-${crypto.randomUUID()}`;kt.push({id:t,custom:!0,config:i,qty:1}),e&&Xn.set(t,e),Xr(),qs("Tu dise\xF1o se a\xF1adi\xF3 a la bolsa.")}});var gm=0;document.addEventListener("change",async i=>{let e=i.target.dataset.cartRecipe;if(!e)return;let t=++gm,n=i.target.files[0];if(!n)return;let s=Ks(n);if(!s)try{Js(new Uint8Array(await n.slice(0,12).arrayBuffer()),n)||(s="El archivo no contiene una imagen o PDF compatible.")}catch{s="No se pudo leer la receta."}if(t===gm){if(s){i.target.value="",qs(s);return}kt.some(r=>r.id===e&&r.config?.use==="optico")&&(Xn.set(e,n),Hr(),qs("Receta adjunta localmente durante esta visita."))}});new URLSearchParams(location.search).has("buscar")&&rt("#search-bar")&&(rt("#search-bar").hidden=!1,rt("#search").focus());document.body.dataset.page==="home"&&location.hash==="#disena"&&location.replace("./disena.html");document.body.dataset.page==="home"&&location.hash==="#coleccion"&&location.replace("./coleccion.html");document.querySelectorAll("nav a").forEach(i=>{i.getAttribute("href")===`./${location.pathname.split("/").pop()||"index.html"}`&&i.setAttribute("aria-current","page")});
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
