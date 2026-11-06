var op=Object.defineProperty;var Ln=(i,e,t)=>()=>{if(t)throw t[0];try{return i&&(e=i(i=0)),e}catch(n){throw t=[n],n}};var lp=(i,e)=>{for(var t in e)op(i,t,{get:e[t],enumerable:!0})};function nc(i){let e=Cu(i);return{rx:1,ry:e==="recto"?.64:e==="redondo"?1:e==="ovalado"?.79:.69}}function Ru(i,e){let t=Cu(i),n=[],s=Number(i.rounding??35),r=t==="recto"?3.6+(100-s)*.033:t==="curvo"?3.1+(100-s)*.021:2,{ry:a}=nc(i);for(let o=0;o<128;o++){let l=o/128*Math.PI*2,c=Math.cos(l),h=Math.sin(l),u=Math.sign(c)*Math.abs(c)**(2/r),d=Math.sign(h)*Math.abs(h)**(2/r)*a;if(t==="ovalado"){let f=Math.max(0,-h);u*=1-f*.22,d-=f*.075}t==="curvo"&&(u*=.9+.1*(d/a+1)/2,d+=Math.max(0,u*e)*.035),n.push([u,d])}return n}function Ia(i,e){let t=vs(i).lens/2*.04;return Ru(i,e).map(([n,s])=>[n*t,s*t])}function Qn(i,e,t=1){let n=vs(i).lens/2*.04,s=Number(i.thickness??4)*.04,{ry:r}=nc(i);return Ru(i,e).map(([a,o])=>{let l=Math.max(0,-a*e),c=Math.exp(-(((o/r+.2)/.48)**4)),h=Number(i.nasalProjection??35)/100*3*.04*l**5*c,u=ei(i)[1]+a*e*(n+s)-4*.04,d=Math.min(h,Math.max(0,u));return[(a*(n+s)-e*d)*t,o*(n+s/r)*t]})}function ei(i){let e=vs(i),t=17*e.lens/52,n=(e.lens+t)/2*.04;return[-n,n]}function ti(i){let e=vs(i),t=Number(i.templeLength??e.temple),n=Qn(i,1),s=ei(i)[1],r=2*.04,a=(s+Math.max(...n.map(o=>o[0]))+r)*2/.04;return{lens:e.lens,bridge:e.bridge,temple:t,front:Math.round(a),code:`${e.lens} \u25A1 ${e.bridge}\u2013${t}`,size:e.id}}function wu(i,e){let t=Qn(i,1),n=[];for(let r=0;r<t.length;r++){let a=t[r],o=t[(r+1)%t.length];if(a[1]<=e&&o[1]>=e||o[1]<=e&&a[1]>=e){if(Math.abs(o[1]-a[1])<1e-9)continue;n.push(a[0]+(o[0]-a[0])*(e-a[1])/(o[1]-a[1]))}}let s=n.length?Math.min(...n):-Math.max(...t.map(r=>Math.abs(r[0])));return ei(i)[1]+s+.025}function Pa(i){let e=vs(i).lens/2*.04*nc(i).ry,t=({alto:.59,medio:.33,bajo:.1}[i.bridgeHeight]??.33)*e,n=i.bridgeType||"clasico",s=Number(i.bridgeThickness??5)*.04,r=Math.max(0,Math.min(100,Number(i.bridgeNasalCurve??45)))/100;function a(c,h,u,d){let f=wu(i,c),g=wu(i,c-u),x=[],m=[];for(let p=0;p<=32;p++){let v=p/32,M=-f+2*f*v,b=Math.sin(Math.PI*v),C=c+h*b;x.push([M,C]),m.push([-g+2*g*v,C-u+d*u*.5*b*b])}return{upper:x,lower:m,outline:[...x,...m.slice().reverse()]}}let l=[a(t,n==="herradura"?.12:.022,s,r)];if(n==="doble"){let c=Math.min(t+.22,e*.9);l.push(a(c,.018,Math.min(s*.45,Math.max(.04,c-t-.065)),0))}return{bands:l,anchorHeight:t,type:n}}function La(i,e,t="clasico"){let n=Qn(i,e),r=ei(i)[e===-1?0:1]+e*(Math.max(...n.map(m=>m[0]*e))+2*.04),a=.16,o=Number(i.templeLength??vs(i).temple),l=[[0,0,0],[-.02*e,-.03,-.28],[-.1*e,-.22,-.63],[-.18*e,-.5,-.85]],c=l.slice(1).reduce((m,p,v)=>m+Math.hypot(...p.map((M,b)=>M-l[v][b])),0),h=o*.04-c,u=t==="curvo"?.13:t==="escultural"?.1:t==="sable"?.07:t==="gancho"?.16:.025,d=(Math.max(...n.map(m=>m[1]))+Math.min(...n.map(m=>m[1])))/2,f=[[r,d,0],[r+e*.04,a,-.55],[r+e*u,a+(t==="sable"?.05:0),-h*.56],[r,a,-h]],g=f.at(-1),x=l.map(m=>m.map((p,v)=>p+g[v]));return{stem:f,hook:x,hookLocal:l,join:g,stemLength:h,hookLength:c,nominalLength:o,shaftWidth:Math.min(Number(i.armWidth??6),bs(i))*.04,hookWidth:.12,depth:t==="fino"?.045:.075}}function bs(i){let e=Qn(i,1);return Math.floor((Math.max(...e.map(t=>t[1]))-Math.min(...e.map(t=>t[1])))/.04)}function Da(i,e){let t=ei(i)[e===-1?0:1],n=Qn(i,e),s=[];for(let o=0;o<128;o++){let l=n[o];l[0]*e<0&&l[1]<.2&&l[1]>-.56&&s.push([l[0]+t,l[1]])}s.sort((o,l)=>l[1]-o[1]);let r=i.model==="curvo"?Number(i.thickness??4)-.5:-1.4,a=s.map(([o,l])=>[e*Math.max(3*.04,e*o+r*.04),l]);return{outline:[...s,...a.reverse()],depth:(2+Number(i.nasalProjection??35)/100*3)*.04}}function Iu(i,e){let t=Number(i);if(!Number.isFinite(t)||t<80||t>190)return null;let n=yr.map(o=>({size:o,measurements:ti({...e,frameSize:o.id})})),s=Math.min(...n.map(o=>o.measurements.front)),r=Math.max(...n.map(o=>o.measurements.front));return{...n.sort((o,l)=>Math.abs(o.measurements.front-t)-Math.abs(l.measurements.front-t))[0],minimum:s,maximum:r,withinRange:t>=s&&t<=r}}var yr,vs,Cu,vr=Ln(()=>{yr=[{id:"estrecha",name:"Estrecha",lens:48,bridge:16,temple:135},{id:"media",name:"Media",lens:52,bridge:17,temple:140},{id:"amplia",name:"Amplia",lens:56,bridge:18,temple:145}],vs=i=>yr.find(e=>e.id===i.frameSize)||yr[1],Cu=i=>({rectangular:"recto",panto:"redondo",aviador:"ovalado",clubmaster:"curvo",wayfarer:"curvo"})[i.model]||i.model});function xn(i={}){let e={..._i,...i},n=hn(Dn,{rectangular:"recto",panto:"redondo",aviador:"ovalado",clubmaster:"curvo",wayfarer:"curvo","cat-eye":"recto"}[e.model]||e.model,"recto"),s=Dn.find(o=>o.id===n),r=e.use==="optico",a=r&&e.sunOptical===!0;return{model:n,frameSize:["estrecha","media","amplia"].includes(e.frameSize)?e.frameSize:"media",templeLength:[135,140,145,150].includes(Number(e.templeLength))?Number(e.templeLength):140,rounding:s.lockRounding?s.rounding:Hi(e.rounding,0,100,s.rounding),bridgeThickness:Hi(e.bridgeThickness,5,12,5),bridgeNasalCurve:Hi(e.bridgeNasalCurve??e.bridgeCurve,0,100,45),bridgeType:hn(ic,e.bridgeType,"clasico"),bridgeHeight:hn(sc,e.bridgeHeight,"medio"),thickness:Hi(e.thickness,3,8,4),armWidth:Hi(e.armWidth,4,bs({...e,model:n,rounding:s.rounding,thickness:Hi(e.thickness,3,8,4)}),6),nasalProjection:Hi(e.nasalProjection,0,100,35),armStyle:hn(Ms,e.armStyle,"clasico"),armStyleRight:hn(Ms,e.armStyleRight,hn(Ms,e.armStyle,"clasico")),rimColor:hn(Ut,e.rimColor,_i.rimColor),bridgeColor:hn(Ut,e.bridgeColor,_i.bridgeColor),armColor:hn(Ut,e.armColor,_i.armColor),use:r?"optico":"sol",lensType:hn(br,e.lensType,"mono"),blue:r&&!a&&e.blue===!0,photo:r&&!a&&e.photo===!0,ar:r&&!a&&e.ar===!0,sunOptical:a,lensColor:hn(Ss,e.lensColor,_i.lensColor),photoColor:hn(Gi,e.photoColor,"gris")}}function Wi(i){let e=xn(i),t=[{label:"Dise\xF1o personal \xB7 montura y personalizaci\xF3n",amount:209e3}];if(e.use==="optico"){let n=br.find(s=>s.id===e.lensType);t.push({label:`Cristales ${n.name.toLowerCase()}`,amount:n.price}),e.blue&&t.push({label:"Filtro de luz azul",amount:2e4}),e.ar&&t.push({label:"Tratamiento antirreflejos",amount:18e3}),e.photo&&t.push({label:`Fotocrom\xE1tico \xB7 ${Gi.find(s=>s.id===e.photoColor).name}`,amount:45e3}),e.sunOptical&&t.push({label:"Sol \xF3ptico (tinte graduado)",amount:25e3})}return{lines:t,total:t.reduce((n,s)=>n+s.amount,0)}}function Na(i){let e=xn(i),t=ti(e);return`${Dn.find(n=>n.id===e.model).name} \xB7 ${t.code} \xB7 ${e.use==="sol"?"Sol":br.find(n=>n.id===e.lensType).name}`}function Ua(i,e="perspectiva"){let t=xn(i),n=ei(t),s=`design-glass-${++cp}`,r=([p,v])=>[340+p*57,185-v*57],a=Ut.find(p=>p.id===t.rimColor).hex,o=Ut.find(p=>p.id===t.bridgeColor).hex,l=Ut.find(p=>p.id===t.armColor).hex,c=t.use==="sol"||t.photo||t.sunOptical,h=t.photo?Gi.find(p=>p.id===t.photoColor).hex:Ss.find(p=>p.id===t.lensColor).hex,u=p=>p.map((v,M)=>`${M?"L":"M"}${r(v).join(" ")}`).join(" ")+"Z",d=e==="frente"?"":e==="lateral"?"translate(65 0) skewX(-16) scale(.8 1)":"rotate(-6 340 185)",f=[-1,1].map((p,v)=>{let M=Qn(t,p).map(([b,C])=>[b+n[v],C]);return`<path d="${u(M)}" fill="url(#${s})" stroke="${t.model==="curvo"?"#bbaa7a":a}" stroke-width="${t.model==="curvo"?2:5}"/>${t.model==="curvo"?`<path d="${u(M.slice(0,65))}" fill="none" stroke="${a}" stroke-width="7"/>`:""}`}).join(""),g=Pa(t).bands.map(p=>`<path d="${u(p.outline)}" fill="${o}"/>`).join(""),x=[-1,1].map(p=>`<path d="${u(Da(t,p).outline)}" fill="${a}" opacity=".75"/>`).join(""),m=e==="frente"?"":[-1,1].map(p=>{let v=La(t,p,p===-1?t.armStyle:t.armStyleRight),M=([y,T,H])=>[y-H*.22,T-H*.25],b=[v.shaftWidth,v.shaftWidth,v.shaftWidth*.4+v.hookWidth*.6,v.hookWidth],C=v.stem.map((y,T)=>{let[H,R]=M(y);return[H,R+b[T]/2]}),w=v.stem.map((y,T)=>{let[H,R]=M(y);return[H,R-b[T]/2]}),P=v.hook.map(M);return`<path d="${u([...C,...w.reverse()])}" fill="${l}"/><path d="${u(P).slice(0,-1)}" fill="none" stroke="${l}" stroke-width="${v.hookWidth*57}" stroke-linecap="round" stroke-linejoin="round"/>`}).join("");return`<svg viewBox="0 0 680 390" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vista ${e} del dise\xF1o ${Dn.find(p=>p.id===t.model).name}"><defs><linearGradient id="${s}" x2="0" y2="1"><stop stop-color="${h}" stop-opacity="${c?.95:.15}"/><stop offset="1" stop-color="${h}" stop-opacity="${c?.7:.05}"/></linearGradient></defs><g transform="${d}">${m}${x}${f}${g}</g></svg>`}function Fa(i){if(!i)return"Selecciona una receta.";if(i.size>10*1024*1024)return"El archivo supera los 10 MB. Elige uno m\xE1s peque\xF1o.";if(i.size===0)return"El archivo est\xE1 vac\xEDo.";let e=i.name?.split(".").pop()?.toLowerCase(),t={pdf:"application/pdf",jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",webp:"image/webp"};return!t[e]||i.type&&i.type!==t[e]?"Formato no admitido. Usa PDF, JPG, PNG o WebP.":""}function Oa(i,e){let t={pdf:i[0]===37&&i[1]===80&&i[2]===68&&i[3]===70,jpg:i[0]===255&&i[1]===216&&i[2]===255,png:i[0]===137&&i[1]===80&&i[2]===78&&i[3]===71,webp:i[0]===82&&i[1]===73&&i[2]===70&&i[3]===70&&i[8]===87&&i[9]===69&&i[10]===66&&i[11]===80};if(!e)return Object.values(t).some(Boolean);let n=e.name.split(".").pop().toLowerCase();return n==="jpeg"&&(n="jpg"),t[n]===!0}var Dn,ic,sc,Ut,Ss,Gi,Ms,br,_i,hn,Hi,cp,Mr=Ln(()=>{vr();Dn=[{id:"recto",name:"Recto",description:"Rectangular proporcionado y de esquinas suaves.",price:209e3,rounding:35},{id:"redondo",name:"Redondo",description:"Curva circular estable. Equilibrio cl\xE1sico.",price:209e3,rounding:100,lockRounding:!0},{id:"ovalado",name:"Ovalado",description:"\xD3valo en gota de inspiraci\xF3n aviador, sin doble puente.",price:209e3,rounding:100,lockRounding:!0},{id:"curvo",name:"Curvo",description:"Browline en acetato, aro inferior ligero y brazos planos.",price:209e3,rounding:50}],ic=[{id:"clasico",name:"Cl\xE1sico"},{id:"doble",name:"Doble puente"},{id:"herradura",name:"Herradura"}],sc=[{id:"alto",name:"Alto"},{id:"medio",name:"Medio"},{id:"bajo",name:"Bajo"}],Ut=[{id:"miel",name:"Miel",hex:"#a76c32"},{id:"carey",name:"Tabaco",hex:"#68422e"},{id:"negro",name:"Obsidiana",hex:"#252622"},{id:"oliva",name:"Oliva",hex:"#697350"},{id:"marfil",name:"Marfil",hex:"#dfd5ba"},{id:"burdeos",name:"Borgo\xF1a",hex:"#6d3541"}],Ss=[{id:"humo",name:"Gris humo",hex:"#434a4b"},{id:"cafe",name:"Caf\xE9",hex:"#7c5637"},{id:"verde",name:"Verde mineral",hex:"#526552"},{id:"azul",name:"Azul profundo",hex:"#435c78"},{id:"rosa",name:"Rosa mineral",hex:"#a97b77"}],Gi=[{id:"gris",name:"Gris negro",hex:"#414348"},{id:"cafe",name:"Caf\xE9",hex:"#79573d"},{id:"lila",name:"Lila",hex:"#897496"}],Ms=[{id:"clasico",name:"Cl\xE1sico"},{id:"fino",name:"Filiforme"},{id:"escultural",name:"Escultural"},{id:"sable",name:"Sable"},{id:"curvo",name:"Ondulado"},{id:"gancho",name:"Perfil envolvente"}],br=[{id:"mono",name:"Monofocales",price:45e3},{id:"bi",name:"Bifocales",price:85e3},{id:"multi",name:"Multifocales",price:145e3}],_i={model:"recto",frameSize:"media",templeLength:140,rounding:35,bridgeThickness:5,bridgeNasalCurve:45,bridgeType:"clasico",bridgeHeight:"medio",thickness:4,armWidth:6,nasalProjection:35,armStyle:"clasico",armStyleRight:"clasico",rimColor:"negro",bridgeColor:"negro",armColor:"negro",use:"sol",lensType:"mono",blue:!1,photo:!1,ar:!1,sunOptical:!1,lensColor:"humo",photoColor:"gris"},hn=(i,e,t)=>i.some(n=>n.id===e)?e:t,Hi=(i,e,t,n)=>Number.isFinite(Number(i))?Math.min(t,Math.max(e,Math.round(Number(i)))):n;cp=0});function hp(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function up(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Vs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Zd(){let i=Vs("canvas");return i.style.display="block",i}function Fr(...i){let e="THREE."+i.shift();Hs?Hs("log",e,...i):console.log(e,...i)}function Kd(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ne(...i){i=Kd(i);let e="THREE."+i.shift();if(Hs)Hs("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ge(...i){i=Kd(i);let e="THREE."+i.shift();if(Hs)Hs("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Or(...i){let e=i.join(" ");e in Pu||(Pu[e]=!0,Ne(...i))}function jd(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function pn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Vt[i&255]+Vt[i>>8&255]+Vt[i>>16&255]+Vt[i>>24&255]+"-"+Vt[e&255]+Vt[e>>8&255]+"-"+Vt[e>>16&15|64]+Vt[e>>24&255]+"-"+Vt[t&63|128]+Vt[t>>8&255]+"-"+Vt[t>>16&255]+Vt[t>>24&255]+Vt[n&255]+Vt[n>>8&255]+Vt[n>>16&255]+Vt[n>>24&255]).toLowerCase()}function Ye(i,e,t){return Math.max(e,Math.min(t,i))}function gh(i,e){return(i%e+e)%e}function dp(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function fp(i,e,t){return i!==e?(t-i)/(e-i):0}function Lr(i,e,t){return(1-t)*i+t*e}function pp(i,e,t,n){return Lr(i,e,1-Math.exp(-t*n))}function mp(i,e=1){return e-Math.abs(gh(i,e*2)-e)}function gp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function _p(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function xp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function yp(i,e){return i+Math.random()*(e-i)}function vp(i){return i*(.5-Math.random())}function bp(i){i!==void 0&&(Lu=i);let e=Lu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Mp(i){return i*Pr}function Sp(i){return i*es}function Tp(i){return(i&i-1)===0&&i!==0}function Ep(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Ap(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function wp(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*f,o*h,o*c);break;default:Ne("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Mn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function st(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}function Cp(){let i={enabled:!0,workingColorSpace:Ot,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===nt&&(s.r=li(s.r),s.g=li(s.g),s.b=li(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===nt&&(s.r=Bs(s.r),s.g=Bs(s.g),s.b=Bs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===fi?Ur:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Or("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Or("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ot]:{primaries:e,whitePoint:n,transfer:Ur,toXYZ:Nu,fromXYZ:Uu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:wt},outputColorSpaceConfig:{drawingBufferColorSpace:wt}},[wt]:{primaries:e,whitePoint:n,transfer:nt,toXYZ:Nu,fromXYZ:Uu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:wt}}}),i}function li(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Bs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}function lc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ao.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ne("Texture: Unable to serialize Texture."),{})}function uc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function yc(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){qi.fromArray(i,r);let o=s.x*Math.abs(qi.x)+s.y*Math.abs(qi.y)+s.z*Math.abs(qi.z),l=e.dot(qi),c=t.dot(qi),h=n.dot(qi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}function Hp(i,e,t,n,s,r,a,o){let l;if(e.side===zt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Tn,o),l===null)return null;Qa.copy(o),Qa.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Qa);return c<t.near||c>t.far?null:{distance:c,point:Qa.clone(),object:i}}function eo(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Za),i.getVertexPosition(l,Ka),i.getVertexPosition(c,ja);let h=Hp(i,e,t,n,Za,Ka,ja,qu);if(h){let u=new I;Ei.getBarycoord(qu,Za,Ka,ja,u),s&&(h.uv=Ei.getInterpolatedAttribute(s,o,l,c,u,new re)),r&&(h.uv1=Ei.getInterpolatedAttribute(r,o,l,c,u,new re)),a&&(h.normal=Ei.getInterpolatedAttribute(a,o,l,c,u,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new I,materialIndex:0};Ei.getNormal(Za,Ka,ja,d.normal),h.face=d,h.barycoord=u}return h}function ro(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(Ro.fromBufferAttribute(o,s),Io.fromBufferAttribute(o,r),t.distanceSqToSegment(Ro,Io,Rc,nd)>n)return;Rc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Rc);if(!(c<e.near||c>e.far))return{distance:c,point:nd.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}function ad(i,e,t,n,s,r,a){let o=Vc.distanceSqToPoint(i);if(o<t){let l=new I;Vc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}function _h(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}function od(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function Zp(i,e){let t=1-i;return t*t*e}function Kp(i,e){return 2*(1-i)*i*e}function jp(i,e){return i*i*e}function Dr(i,e,t,n){return Zp(i,e)+Kp(i,t)+jp(i,n)}function Jp(i,e){let t=1-i;return t*t*t*e}function Qp(i,e){let t=1-i;return 3*t*t*i*e}function em(i,e){return 3*(1-i)*i*i*e}function tm(i,e){return i*i*i*e}function Nr(i,e,t,n,s){return Jp(i,e)+Qp(i,t)+em(i,n)+tm(i,s)}function nm(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=ef(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=om(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let h=o,u=l;for(let d=t;d<s;d+=t){let f=i[d],g=i[d+1];f<o&&(o=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return Qr(r,a,t,o,l,c,0),a}function ef(i,e,t,n,s){let r;if(s===xm(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=ld(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=ld(a/n|0,i[a],i[a+1],r);return r&&er(r,r.next)&&(ta(r),r=r.next),r}function rs(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(er(t,t.next)||gt(t.prev,t,t.next)===0)){if(ta(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Qr(i,e,t,n,s,r,a){if(!i)return;!a&&r&&dm(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?sm(i,n,s,r):im(i)){e.push(l.i,i.i,c.i),ta(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=rm(rs(i),e),Qr(i,e,t,n,s,r,2)):a===2&&am(i,e,t,n,s,r):Qr(rs(i),e,t,n,s,r,1);break}}}function im(i){let e=i.prev,t=i,n=i.next;if(gt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(s,r,a),u=Math.min(o,l,c),d=Math.max(s,r,a),f=Math.max(o,l,c),g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Ir(s,o,r,l,a,c,g.x,g.y)&&gt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function sm(i,e,t,n){let s=i.prev,r=i,a=i.next;if(gt(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,l,c),g=Math.min(h,u,d),x=Math.max(o,l,c),m=Math.max(h,u,d),p=Gc(f,g,e,t,n),v=Gc(x,m,e,t,n),M=i.prevZ,b=i.nextZ;for(;M&&M.z>=p&&b&&b.z<=v;){if(M.x>=f&&M.x<=x&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&Ir(o,h,l,u,c,d,M.x,M.y)&&gt(M.prev,M,M.next)>=0||(M=M.prevZ,b.x>=f&&b.x<=x&&b.y>=g&&b.y<=m&&b!==s&&b!==a&&Ir(o,h,l,u,c,d,b.x,b.y)&&gt(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;M&&M.z>=p;){if(M.x>=f&&M.x<=x&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&Ir(o,h,l,u,c,d,M.x,M.y)&&gt(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;b&&b.z<=v;){if(b.x>=f&&b.x<=x&&b.y>=g&&b.y<=m&&b!==s&&b!==a&&Ir(o,h,l,u,c,d,b.x,b.y)&&gt(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function rm(i,e){let t=i;do{let n=t.prev,s=t.next.next;!er(n,s)&&nf(n,t,t.next,s)&&ea(n,s)&&ea(s,n)&&(e.push(n.i,t.i,s.i),ta(t),ta(t.next),t=i=s),t=t.next}while(t!==i);return rs(t)}function am(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&mm(a,o)){let l=sf(a,o);a=rs(a,a.next),l=rs(l,l.next),Qr(a,e,t,n,s,r,0),Qr(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function om(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=ef(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(pm(c))}s.sort(lm);for(let r=0;r<s.length;r++)t=cm(s[r],t);return t}function lm(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function cm(i,e){let t=hm(i,e);if(!t)return e;let n=sf(t,i);return rs(n,n.next),rs(t,t.next)}function hm(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(er(i,t))return t;do{if(er(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&tf(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);ea(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&um(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function um(i,e){return gt(i.prev,i,e.prev)<0&&gt(e.next,i,i.next)<0}function dm(i,e,t,n){let s=i;do s.z===0&&(s.z=Gc(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,fm(s)}function fm(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Gc(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function pm(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function tf(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Ir(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&tf(i,e,t,n,s,r,a,o)}function mm(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!gm(i,e)&&(ea(i,e)&&ea(e,i)&&_m(i,e)&&(gt(i.prev,i,e.prev)||gt(i,e.prev,e))||er(i,e)&&gt(i.prev,i,i.next)>0&&gt(e.prev,e,e.next)>0)}function gt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function er(i,e){return i.x===e.x&&i.y===e.y}function nf(i,e,t,n){let s=ho(gt(i,e,t)),r=ho(gt(i,e,n)),a=ho(gt(t,n,i)),o=ho(gt(t,n,e));return!!(s!==r&&a!==o||s===0&&co(i,t,e)||r===0&&co(i,n,e)||a===0&&co(t,i,n)||o===0&&co(t,e,n))}function co(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function ho(i){return i>0?1:i<0?-1:0}function gm(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&nf(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function ea(i,e){return gt(i.prev,i,i.next)<0?gt(i,e,i.next)>=0&&gt(i,i.prev,e)>=0:gt(i,e,i.prev)<0||gt(i,i.next,e)<0}function _m(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function sf(i,e){let t=Wc(i.i,i.x,i.y),n=Wc(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function ld(i,e,t,n){let s=Wc(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ta(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Wc(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function xm(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}function cd(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function hd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}function vm(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}function bm(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}function ds(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Xt(i){let e={};for(let t=0;t<i.length;t++){let n=ds(i[t]);for(let s in n)e[s]=n[s]}return e}function Mm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function xh(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}function uo(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Em(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function ud(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){let o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=i[o+l]}return s}function af(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}function Am(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Vn;case"vector":case"vector2":case"vector3":case"vector4":return Gn;case"color":return aa;case"quaternion":return Hn;case"bool":case"boolean":return hi;case"string":return ui}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function wm(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Am(i.type);if(i.times===void 0){let t=[],n=[];af(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}function dd(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}function bh(i,e,t,n){let s=Fm(n);switch(t){case dh:return i*e;case il:return i*e/s.components*s.byteLength;case sl:return i*e/s.components*s.byteLength;case us:return i*e*2/s.components*s.byteLength;case rl:return i*e*2/s.components*s.byteLength;case fh:return i*e*3/s.components*s.byteLength;case ln:return i*e*4/s.components*s.byteLength;case al:return i*e*4/s.components*s.byteLength;case xa:case ya:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case va:case ba:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ll:case hl:return Math.max(i,16)*Math.max(e,8)/4;case ol:case cl:return Math.max(i,8)*Math.max(e,8)/2;case ul:case dl:case pl:case ml:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case fl:case gl:case _l:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case xl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case yl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case vl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case bl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ml:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Sl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Tl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case El:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Al:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case wl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Cl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Rl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Il:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Pl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ll:case Dl:case Nl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ul:case Fl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ol:case Bl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Fm(i){switch(i){case Jt:case lh:return{byteLength:1,components:1};case rr:case ch:case qn:return{byteLength:2,components:1};case tl:case nl:return{byteLength:2,components:4};case In:case el:case on:return{byteLength:4,components:1};case hh:case uh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}var Di,Ni,_d,jc,xd,ma,Zo,ir,Tn,zt,jt,Xn,Ki,Jc,Qc,eh,yd,Ai,vd,bd,Md,Sd,Td,Ed,Ad,wd,go,_o,Cd,Rd,Id,Pd,Ld,Dd,Nd,Ud,Fd,xo,yo,vo,ji,bo,Mo,So,To,Ko,Od,Bd,Cn,th,nh,ih,ga,sh,rh,ah,Uc,zd,oh,Ui,cs,jo,Jo,_a,wi,fn,zs,yt,Qo,hs,vt,sr,Rn,Jt,lh,ch,rr,el,In,on,qn,tl,nl,ar,hh,uh,dh,fh,ln,On,Fi,il,sl,us,rl,al,xa,ya,va,ba,ol,ll,cl,hl,ul,dl,fl,pl,ml,gl,_l,xl,yl,vl,bl,Ml,Sl,Tl,El,Al,wl,Cl,Rl,Il,Pl,Ll,Dl,Nl,Ul,Fl,Ol,Bl,Ji,Qi,mo,Fc,Oc,Bc,zc,kd,ph,Ma,or,Vd,zl,Hd,fi,wt,Ot,Ur,nt,Zi,kc,Gd,Wd,Xd,kl,qd,$d,Vl,Yd,Eo,mh,Sn,ks,Pu,Hs,Jd,Bn,Vt,Lu,Pr,es,pi,re,Gt,I,ac,Du,$e,oc,Nu,Uu,et,Ts,Ao,Rp,Gs,Ip,cc,Dt,ft,wo,sn,Br,Co,qe,Es,yn,Pp,Lp,yi,za,tn,Fu,Ou,mn,zr,Dp,Bu,As,ni,ka,Sr,Np,Up,zu,ku,Vu,Hu,Fp,ws,hc,pt,Yt,Op,Ws,Qd,vi,Va,ke,Ht,ts,vn,ii,dc,si,Cs,Rs,Gu,fc,pc,mc,gc,_c,xc,Ei,$t,ri,bn,Ha,Is,Ps,Ls,bi,Mi,Xi,Tr,Ga,Wa,qi,Mt,Xa,Bp,Tt,kr,Vr,mt,zp,Er,vc,Zt,kp,un,bc,Ds,nn,Ar,Lt,Et,Xs,qt,qs,Vp,Wt,ai,Mc,qa,Si,Sc,$a,Tc,ci,En,Wu,$i,Ya,Xu,Za,Ka,ja,Ec,Ja,qu,Qa,lt,$u,Yu,Zu,Gp,Ku,to,Ac,ju,wc,Hr,$s,Ys,Ju,Wp,Gr,Ci,Ns,Qu,no,ed,Xp,wr,Cr,ns,Cc,qp,$p,dn,Yi,Yp,io,Zs,Ks,Ro,Io,td,Rr,so,Rc,nd,is,id,sd,Wr,Xr,js,rd,Vc,ao,oo,qr,$r,Ri,Po,Yr,An,rn,Js,Lo,lo,Ic,Pc,Lc,Qs,Zr,Do,Kr,No,jr,Uo,Jr,Hc,Fo,ss,wn,Xc,Un,Ii,ym,as,na,ia,sa,rf,Sm,Tm,an,Oo,zn,Bt,ra,Bo,zo,kn,ko,Vo,Ho,Go,Kt,hi,aa,Vn,Wo,Hn,ui,Gn,oa,Fn,Xo,of,Wn,oi,qc,tr,Us,qo,la,os,ca,Dc,fd,pd,ha,fo,po,Nn,ua,Ti,md,gd,St,$c,da,Yc,ls,Pi,Zc,Li,di,Nc,fa,Fs,Os,$o,Yo,yh,Cm,vh,Rm,Im,Pm,Lm,Dm,Nm,Um,Kc,ut,rv,nr,pa,Mh=Ln(()=>{Di={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Ni={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},_d=0,jc=1,xd=2,ma=1,Zo=2,ir=3,Tn=0,zt=1,jt=2,Xn=0,Ki=1,Jc=2,Qc=3,eh=4,yd=5,Ai=100,vd=101,bd=102,Md=103,Sd=104,Td=200,Ed=201,Ad=202,wd=203,go=204,_o=205,Cd=206,Rd=207,Id=208,Pd=209,Ld=210,Dd=211,Nd=212,Ud=213,Fd=214,xo=0,yo=1,vo=2,ji=3,bo=4,Mo=5,So=6,To=7,Ko=0,Od=1,Bd=2,Cn=0,th=1,nh=2,ih=3,ga=4,sh=5,rh=6,ah=7,Uc="attached",zd="detached",oh=300,Ui=301,cs=302,jo=303,Jo=304,_a=306,wi=1e3,fn=1001,zs=1002,yt=1003,Qo=1004,hs=1005,vt=1006,sr=1007,Rn=1008,Jt=1009,lh=1010,ch=1011,rr=1012,el=1013,In=1014,on=1015,qn=1016,tl=1017,nl=1018,ar=1020,hh=35902,uh=35899,dh=1021,fh=1022,ln=1023,On=1026,Fi=1027,il=1028,sl=1029,us=1030,rl=1031,al=1033,xa=33776,ya=33777,va=33778,ba=33779,ol=35840,ll=35841,cl=35842,hl=35843,ul=36196,dl=37492,fl=37496,pl=37488,ml=37489,gl=37490,_l=37491,xl=37808,yl=37809,vl=37810,bl=37811,Ml=37812,Sl=37813,Tl=37814,El=37815,Al=37816,wl=37817,Cl=37818,Rl=37819,Il=37820,Pl=37821,Ll=36492,Dl=36494,Nl=36495,Ul=36283,Fl=36284,Ol=36285,Bl=36286,Ji=2300,Qi=2301,mo=2302,Fc=2303,Oc=2400,Bc=2401,zc=2402,kd=2500,ph=0,Ma=1,or=2,Vd=3200,zl=0,Hd=1,fi="",wt="srgb",Ot="srgb-linear",Ur="linear",nt="srgb",Zi=7680,kc=519,Gd=512,Wd=513,Xd=514,kl=515,qd=516,$d=517,Vl=518,Yd=519,Eo=35044,mh="300 es",Sn=2e3,ks=2001;Pu={},Hs=null;Jd={[xo]:yo,[vo]:So,[bo]:To,[ji]:Mo,[yo]:xo,[So]:vo,[To]:bo,[Mo]:ji},Bn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Lu=1234567,Pr=Math.PI/180,es=180/Math.PI;pi={DEG2RAD:Pr,RAD2DEG:es,generateUUID:pn,clamp:Ye,euclideanModulo:gh,mapLinear:dp,inverseLerp:fp,lerp:Lr,damp:pp,pingpong:mp,smoothstep:gp,smootherstep:_p,randInt:xp,randFloat:yp,randFloatSpread:vp,seededRandom:bp,degToRad:Mp,radToDeg:Sp,isPowerOfTwo:Tp,ceilPowerOfTwo:Ep,floorPowerOfTwo:Ap,setQuaternionFromProperEuler:wp,normalize:st,denormalize:Mn},re=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Gt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],f=r[a+1],g=r[a+2],x=r[a+3];if(u!==x||l!==d||c!==f||h!==g){let m=l*d+c*f+h*g+u*x;m<0&&(d=-d,f=-f,g=-g,x=-x,m=-m);let p=1-o;if(m<.9995){let v=Math.acos(m),M=Math.sin(v);p=Math.sin(p*v)/M,o=Math.sin(o*v)/M,l=l*p+d*o,c=c*p+f*o,h=h*p+g*o,u=u*p+x*o}else{l=l*p+d*o,c=c*p+f*o,h=h*p+g*o,u=u*p+x*o;let v=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=v,c*=v,h*=v,u*=v}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-o*f,e[t+2]=c*g+h*f+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:Ne("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Du.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Du.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ac.copy(this).projectOnVector(e),this.sub(ac)}reflect(e){return this.sub(ac.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ac=new I,Du=new Gt,$e=class i{constructor(e,t,n,s,r,a,o,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],x=s[0],m=s[3],p=s[6],v=s[1],M=s[4],b=s[7],C=s[2],w=s[5],P=s[8];return r[0]=a*x+o*v+l*C,r[3]=a*m+o*M+l*w,r[6]=a*p+o*b+l*P,r[1]=c*x+h*v+u*C,r[4]=c*m+h*M+u*w,r[7]=c*p+h*b+u*P,r[2]=d*x+f*v+g*C,r[5]=d*m+f*M+g*w,r[8]=d*p+f*b+g*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=t*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=u*x,e[1]=(s*c-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=d*x,e[4]=(h*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=f*x,e[7]=(n*l-c*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(oc.makeScale(e,t)),this}rotate(e){return this.premultiply(oc.makeRotation(-e)),this}translate(e,t){return this.premultiply(oc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},oc=new $e,Nu=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Uu=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);et=Cp();Ao=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ts===void 0&&(Ts=Vs("canvas")),Ts.width=e.width,Ts.height=e.height;let s=Ts.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ts}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Vs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=li(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(li(t[n]/255)*255):t[n]=li(t[n]);return{data:t,width:e.width,height:e.height}}else return Ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Rp=0,Gs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Rp++}),this.uuid=pn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(lc(s[a].image)):r.push(lc(s[a]))}else r=lc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};Ip=0,cc=new I,Dt=class i extends Bn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=fn,s=fn,r=vt,a=Rn,o=ln,l=Jt,c=i.DEFAULT_ANISOTROPY,h=fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ip++}),this.uuid=pn(),this.name="",this.source=new Gs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new re(0,0),this.repeat=new re(1,1),this.center=new re(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(cc).x}get height(){return this.source.getSize(cc).y}get depth(){return this.source.getSize(cc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ne(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ne(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==oh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case wi:e.x=e.x-Math.floor(e.x);break;case fn:e.x=e.x<0?0:1;break;case zs:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case wi:e.y=e.y-Math.floor(e.y);break;case fn:e.y=e.y<0?0:1;break;case zs:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Dt.DEFAULT_IMAGE=null;Dt.DEFAULT_MAPPING=oh;Dt.DEFAULT_ANISOTROPY=1;ft=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(c+1)/2,b=(f+1)/2,C=(p+1)/2,w=(h+d)/4,P=(u+x)/4,y=(g+m)/4;return M>b&&M>C?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=w/n,r=P/n):b>C?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=w/s,r=y/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=P/r,s=y/r),this.set(n,s,r,t),this}let v=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(u-x)/v,this.z=(d-h)/v,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},wo=class extends Bn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new Dt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:vt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Gs(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},sn=class extends wo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Br=class extends Dt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=yt,this.minFilter=yt,this.wrapR=fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Co=class extends Dt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=yt,this.minFilter=yt,this.wrapR=fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},qe=class i{constructor(e,t,n,s,r,a,o,l,c,h,u,d,f,g,x,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,d,f,g,x,m)}set(e,t,n,s,r,a,o,l,c,h,u,d,f,g,x,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();let t=this.elements,n=e.elements,s=1/Es.setFromMatrixColumn(e,0).length(),r=1/Es.setFromMatrixColumn(e,1).length(),a=1/Es.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*h,f=a*u,g=o*h,x=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-x*c,t[9]=-o*l,t[2]=x-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,g=c*h,x=c*u;t[0]=d+x*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=x+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,g=c*h,x=c*u;t[0]=d-x*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=x-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,f=a*u,g=o*h,x=o*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+x,t[1]=l*u,t[5]=x*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,f=a*c,g=o*l,x=o*c;t[0]=l*h,t[4]=x-d*u,t[8]=g*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-x*u}else if(e.order==="XZY"){let d=a*l,f=a*c,g=o*l,x=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+x,t[5]=a*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Pp,e,Lp)}lookAt(e,t,n){let s=this.elements;return tn.subVectors(e,t),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),yi.crossVectors(n,tn),yi.lengthSq()===0&&(Math.abs(n.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),yi.crossVectors(n,tn)),yi.normalize(),za.crossVectors(tn,yi),s[0]=yi.x,s[4]=za.x,s[8]=tn.x,s[1]=yi.y,s[5]=za.y,s[9]=tn.y,s[2]=yi.z,s[6]=za.z,s[10]=tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],x=n[6],m=n[10],p=n[14],v=n[3],M=n[7],b=n[11],C=n[15],w=s[0],P=s[4],y=s[8],T=s[12],H=s[1],R=s[5],G=s[9],B=s[13],L=s[2],k=s[6],F=s[10],U=s[14],ie=s[3],Y=s[7],le=s[11],he=s[15];return r[0]=a*w+o*H+l*L+c*ie,r[4]=a*P+o*R+l*k+c*Y,r[8]=a*y+o*G+l*F+c*le,r[12]=a*T+o*B+l*U+c*he,r[1]=h*w+u*H+d*L+f*ie,r[5]=h*P+u*R+d*k+f*Y,r[9]=h*y+u*G+d*F+f*le,r[13]=h*T+u*B+d*U+f*he,r[2]=g*w+x*H+m*L+p*ie,r[6]=g*P+x*R+m*k+p*Y,r[10]=g*y+x*G+m*F+p*le,r[14]=g*T+x*B+m*U+p*he,r[3]=v*w+M*H+b*L+C*ie,r[7]=v*P+M*R+b*k+C*Y,r[11]=v*y+M*G+b*F+C*le,r[15]=v*T+M*B+b*U+C*he,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],x=e[7],m=e[11],p=e[15],v=l*f-c*d,M=o*f-c*u,b=o*d-l*u,C=a*f-c*h,w=a*d-l*h,P=a*u-o*h;return t*(x*v-m*M+p*b)-n*(g*v-m*C+p*w)+s*(g*M-x*C+p*P)-r*(g*b-x*w+m*P)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],x=e[13],m=e[14],p=e[15],v=t*o-n*a,M=t*l-s*a,b=t*c-r*a,C=n*l-s*o,w=n*c-r*o,P=s*c-r*l,y=h*x-u*g,T=h*m-d*g,H=h*p-f*g,R=u*m-d*x,G=u*p-f*x,B=d*p-f*m,L=v*B-M*G+b*R+C*H-w*T+P*y;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/L;return e[0]=(o*B-l*G+c*R)*k,e[1]=(s*G-n*B-r*R)*k,e[2]=(x*P-m*w+p*C)*k,e[3]=(d*w-u*P-f*C)*k,e[4]=(l*H-a*B-c*T)*k,e[5]=(t*B-s*H+r*T)*k,e[6]=(m*b-g*P-p*M)*k,e[7]=(h*P-d*b+f*M)*k,e[8]=(a*G-o*H+c*y)*k,e[9]=(n*H-t*G-r*y)*k,e[10]=(g*w-x*b+p*v)*k,e[11]=(u*b-h*w-f*v)*k,e[12]=(o*T-a*R-l*y)*k,e[13]=(t*R-n*T+s*y)*k,e[14]=(x*M-g*C-m*v)*k,e[15]=(h*C-u*M+d*v)*k,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,x=a*h,m=a*u,p=o*u,v=l*c,M=l*h,b=l*u,C=n.x,w=n.y,P=n.z;return s[0]=(1-(x+p))*C,s[1]=(f+b)*C,s[2]=(g-M)*C,s[3]=0,s[4]=(f-b)*w,s[5]=(1-(d+p))*w,s[6]=(m+v)*w,s[7]=0,s[8]=(g+M)*P,s[9]=(m-v)*P,s[10]=(1-(d+x))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinant();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Es.set(s[0],s[1],s[2]).length(),o=Es.set(s[4],s[5],s[6]).length(),l=Es.set(s[8],s[9],s[10]).length();r<0&&(a=-a),yn.copy(this);let c=1/a,h=1/o,u=1/l;return yn.elements[0]*=c,yn.elements[1]*=c,yn.elements[2]*=c,yn.elements[4]*=h,yn.elements[5]*=h,yn.elements[6]*=h,yn.elements[8]*=u,yn.elements[9]*=u,yn.elements[10]*=u,t.setFromRotationMatrix(yn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Sn,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),g,x;if(l)g=r/(a-r),x=a*r/(a-r);else if(o===Sn)g=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===ks)g=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Sn,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),g,x;if(l)g=1/(a-r),x=a/(a-r);else if(o===Sn)g=-2/(a-r),x=-(a+r)/(a-r);else if(o===ks)g=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Es=new I,yn=new qe,Pp=new I(0,0,0),Lp=new I(1,1,1),yi=new I,za=new I,tn=new I,Fu=new qe,Ou=new Gt,mn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ye(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ye(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Fu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Fu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ou.setFromEuler(this),this.setFromQuaternion(Ou,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};mn.DEFAULT_ORDER="XYZ";zr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Dp=0,Bu=new I,As=new Gt,ni=new qe,ka=new I,Sr=new I,Np=new I,Up=new Gt,zu=new I(1,0,0),ku=new I(0,1,0),Vu=new I(0,0,1),Hu={type:"added"},Fp={type:"removed"},ws={type:"childadded",child:null},hc={type:"childremoved",child:null},pt=class i extends Bn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Dp++}),this.uuid=pn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new I,t=new mn,n=new Gt,s=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new qe},normalMatrix:{value:new $e}}),this.matrix=new qe,this.matrixWorld=new qe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return As.setFromAxisAngle(e,t),this.quaternion.multiply(As),this}rotateOnWorldAxis(e,t){return As.setFromAxisAngle(e,t),this.quaternion.premultiply(As),this}rotateX(e){return this.rotateOnAxis(zu,e)}rotateY(e){return this.rotateOnAxis(ku,e)}rotateZ(e){return this.rotateOnAxis(Vu,e)}translateOnAxis(e,t){return Bu.copy(e).applyQuaternion(this.quaternion),this.position.add(Bu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(zu,e)}translateY(e){return this.translateOnAxis(ku,e)}translateZ(e){return this.translateOnAxis(Vu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ni.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ka.copy(e):ka.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Sr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ni.lookAt(Sr,ka,this.up):ni.lookAt(ka,Sr,this.up),this.quaternion.setFromRotationMatrix(ni),s&&(ni.extractRotation(s.matrixWorld),As.setFromRotationMatrix(ni),this.quaternion.premultiply(As.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ge("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Hu),ws.child=e,this.dispatchEvent(ws),ws.child=null):Ge("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Fp),hc.child=e,this.dispatchEvent(hc),hc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ni.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ni.multiply(e.parent.matrixWorld)),e.applyMatrix4(ni),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Hu),ws.child=e,this.dispatchEvent(ws),ws.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Sr,e,Np),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Sr,Up,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};pt.DEFAULT_UP=new I(0,1,0);pt.DEFAULT_MATRIX_AUTO_UPDATE=!0;pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;Yt=class extends pt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Op={type:"move"},Ws=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let x of e.hand.values()){let m=t.getJointPose(x,n),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Op)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Yt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Qd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vi={h:0,s:0,l:0},Va={h:0,s:0,l:0};ke=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=wt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=et.workingColorSpace){return this.r=e,this.g=t,this.b=n,et.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=et.workingColorSpace){if(e=gh(e,1),t=Ye(t,0,1),n=Ye(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=uc(a,r,e+1/3),this.g=uc(a,r,e),this.b=uc(a,r,e-1/3)}return et.colorSpaceToWorking(this,s),this}setStyle(e,t=wt){function n(r){r!==void 0&&parseFloat(r)<1&&Ne("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ne("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ne("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=wt){let n=Qd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ne("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=li(e.r),this.g=li(e.g),this.b=li(e.b),this}copyLinearToSRGB(e){return this.r=Bs(e.r),this.g=Bs(e.g),this.b=Bs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=wt){return et.workingToColorSpace(Ht.copy(this),e),Math.round(Ye(Ht.r*255,0,255))*65536+Math.round(Ye(Ht.g*255,0,255))*256+Math.round(Ye(Ht.b*255,0,255))}getHexString(e=wt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(Ht.copy(this),t);let n=Ht.r,s=Ht.g,r=Ht.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=wt){et.workingToColorSpace(Ht.copy(this),e);let t=Ht.r,n=Ht.g,s=Ht.b;return e!==wt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(vi),this.setHSL(vi.h+e,vi.s+t,vi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(vi),e.getHSL(Va);let n=Lr(vi.h,Va.h,t),s=Lr(vi.s,Va.s,t),r=Lr(vi.l,Va.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ht=new ke;ke.NAMES=Qd;ts=class extends pt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mn,this.environmentIntensity=1,this.environmentRotation=new mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},vn=new I,ii=new I,dc=new I,si=new I,Cs=new I,Rs=new I,Gu=new I,fc=new I,pc=new I,mc=new I,gc=new ft,_c=new ft,xc=new ft,Ei=class i{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),vn.subVectors(e,t),s.cross(vn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){vn.subVectors(s,t),ii.subVectors(n,t),dc.subVectors(e,t);let a=vn.dot(vn),o=vn.dot(ii),l=vn.dot(dc),c=ii.dot(ii),h=ii.dot(dc),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,si)===null?!1:si.x>=0&&si.y>=0&&si.x+si.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,si)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,si.x),l.addScaledVector(a,si.y),l.addScaledVector(o,si.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return gc.setScalar(0),_c.setScalar(0),xc.setScalar(0),gc.fromBufferAttribute(e,t),_c.fromBufferAttribute(e,n),xc.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(gc,r.x),a.addScaledVector(_c,r.y),a.addScaledVector(xc,r.z),a}static isFrontFacing(e,t,n,s){return vn.subVectors(n,t),ii.subVectors(e,t),vn.cross(ii).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return vn.subVectors(this.c,this.b),ii.subVectors(this.a,this.b),vn.cross(ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Cs.subVectors(s,n),Rs.subVectors(r,n),fc.subVectors(e,n);let l=Cs.dot(fc),c=Rs.dot(fc);if(l<=0&&c<=0)return t.copy(n);pc.subVectors(e,s);let h=Cs.dot(pc),u=Rs.dot(pc);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Cs,a);mc.subVectors(e,r);let f=Cs.dot(mc),g=Rs.dot(mc);if(g>=0&&f<=g)return t.copy(r);let x=f*c-l*g;if(x<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Rs,o);let m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Gu.subVectors(r,s),o=(u-h)/(u-h+(f-g)),t.copy(s).addScaledVector(Gu,o);let p=1/(m+x+d);return a=x*p,o=d*p,t.copy(n).addScaledVector(Cs,a).addScaledVector(Rs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},$t=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(bn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(bn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=bn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,bn):bn.fromBufferAttribute(r,a),bn.applyMatrix4(e.matrixWorld),this.expandByPoint(bn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ha.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ha.copy(n.boundingBox)),Ha.applyMatrix4(e.matrixWorld),this.union(Ha)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,bn),bn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Tr),Ga.subVectors(this.max,Tr),Is.subVectors(e.a,Tr),Ps.subVectors(e.b,Tr),Ls.subVectors(e.c,Tr),bi.subVectors(Ps,Is),Mi.subVectors(Ls,Ps),Xi.subVectors(Is,Ls);let t=[0,-bi.z,bi.y,0,-Mi.z,Mi.y,0,-Xi.z,Xi.y,bi.z,0,-bi.x,Mi.z,0,-Mi.x,Xi.z,0,-Xi.x,-bi.y,bi.x,0,-Mi.y,Mi.x,0,-Xi.y,Xi.x,0];return!yc(t,Is,Ps,Ls,Ga)||(t=[1,0,0,0,1,0,0,0,1],!yc(t,Is,Ps,Ls,Ga))?!1:(Wa.crossVectors(bi,Mi),t=[Wa.x,Wa.y,Wa.z],yc(t,Is,Ps,Ls,Ga))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,bn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(bn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ri[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ri[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ri[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ri[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ri[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ri[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ri[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ri[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ri),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ri=[new I,new I,new I,new I,new I,new I,new I,new I],bn=new I,Ha=new $t,Is=new I,Ps=new I,Ls=new I,bi=new I,Mi=new I,Xi=new I,Tr=new I,Ga=new I,Wa=new I,qi=new I;Mt=new I,Xa=new re,Bp=0,Tt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Bp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Eo,this.updateRanges=[],this.gpuType=on,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Xa.fromBufferAttribute(this,t),Xa.applyMatrix3(e),this.setXY(t,Xa.x,Xa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Mn(t,this.array)),t}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Mn(t,this.array)),t}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Mn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Mn(t,this.array)),t}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Eo&&(e.usage=this.usage),e}},kr=class extends Tt{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Vr=class extends Tt{constructor(e,t,n){super(new Uint32Array(e),t,n)}},mt=class extends Tt{constructor(e,t,n){super(new Float32Array(e),t,n)}},zp=new $t,Er=new I,vc=new I,Zt=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):zp.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Er.subVectors(e,this.center);let t=Er.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Er,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(vc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Er.copy(e.center).add(vc)),this.expandByPoint(Er.copy(e.center).sub(vc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},kp=0,un=new qe,bc=new pt,Ds=new I,nn=new $t,Ar=new $t,Lt=new I,Et=class i extends Bn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:kp++}),this.uuid=pn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(hp(e)?Vr:kr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new $e().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return un.makeRotationFromQuaternion(e),this.applyMatrix4(un),this}rotateX(e){return un.makeRotationX(e),this.applyMatrix4(un),this}rotateY(e){return un.makeRotationY(e),this.applyMatrix4(un),this}rotateZ(e){return un.makeRotationZ(e),this.applyMatrix4(un),this}translate(e,t,n){return un.makeTranslation(e,t,n),this.applyMatrix4(un),this}scale(e,t,n){return un.makeScale(e,t,n),this.applyMatrix4(un),this}lookAt(e){return bc.lookAt(e),bc.updateMatrix(),this.applyMatrix4(bc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ds).negate(),this.translate(Ds.x,Ds.y,Ds.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new mt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $t);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ge("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];nn.setFromBufferAttribute(r),this.morphTargetsRelative?(Lt.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Lt),Lt.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Lt)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ge('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ge("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let n=this.boundingSphere.center;if(nn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ar.setFromBufferAttribute(o),this.morphTargetsRelative?(Lt.addVectors(nn.min,Ar.min),nn.expandByPoint(Lt),Lt.addVectors(nn.max,Ar.max),nn.expandByPoint(Lt)):(nn.expandByPoint(Ar.min),nn.expandByPoint(Ar.max))}nn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Lt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Lt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Lt.fromBufferAttribute(o,c),l&&(Ds.fromBufferAttribute(e,c),Lt.add(Ds)),s=Math.max(s,n.distanceToSquared(Lt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ge('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ge("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Tt(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let y=0;y<n.count;y++)o[y]=new I,l[y]=new I;let c=new I,h=new I,u=new I,d=new re,f=new re,g=new re,x=new I,m=new I;function p(y,T,H){c.fromBufferAttribute(n,y),h.fromBufferAttribute(n,T),u.fromBufferAttribute(n,H),d.fromBufferAttribute(r,y),f.fromBufferAttribute(r,T),g.fromBufferAttribute(r,H),h.sub(c),u.sub(c),f.sub(d),g.sub(d);let R=1/(f.x*g.y-g.x*f.y);isFinite(R)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(R),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(R),o[y].add(x),o[T].add(x),o[H].add(x),l[y].add(m),l[T].add(m),l[H].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let y=0,T=v.length;y<T;++y){let H=v[y],R=H.start,G=H.count;for(let B=R,L=R+G;B<L;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let M=new I,b=new I,C=new I,w=new I;function P(y){C.fromBufferAttribute(s,y),w.copy(C);let T=o[y];M.copy(T),M.sub(C.multiplyScalar(C.dot(T))).normalize(),b.crossVectors(w,T);let R=b.dot(l[y])<0?-1:1;a.setXYZW(y,M.x,M.y,M.z,R)}for(let y=0,T=v.length;y<T;++y){let H=v[y],R=H.start,G=H.count;for(let B=R,L=R+G;B<L;B+=3)P(e.getX(B+0)),P(e.getX(B+1)),P(e.getX(B+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Tt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new I,r=new I,a=new I,o=new I,l=new I,c=new I,h=new I,u=new I;if(e)for(let d=0,f=e.count;d<f;d+=3){let g=e.getX(d+0),x=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Lt.fromBufferAttribute(e,t),Lt.normalize(),e.setXYZ(t,Lt.x,Lt.y,Lt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),f=0,g=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new Tt(d,h,u)}if(this.index===null)return Ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xs=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Eo,this.updateRanges=[],this.version=0,this.uuid=pn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},qt=new I,qs=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Mn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Mn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Mn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Mn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Fr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Tt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Fr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Vp=0,Wt=class extends Bn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vp++}),this.uuid=pn(),this.name="",this.type="Material",this.blending=Ki,this.side=Tn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=go,this.blendDst=_o,this.blendEquation=Ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ke(0,0,0),this.blendAlpha=0,this.depthFunc=ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=kc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Zi,this.stencilZFail=Zi,this.stencilZPass=Zi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ne(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ne(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ki&&(n.blending=this.blending),this.side!==Tn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==go&&(n.blendSrc=this.blendSrc),this.blendDst!==_o&&(n.blendDst=this.blendDst),this.blendEquation!==Ai&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ji&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==kc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Zi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Zi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Zi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},ai=new I,Mc=new I,qa=new I,Si=new I,Sc=new I,$a=new I,Tc=new I,ci=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ai)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ai.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ai.copy(this.origin).addScaledVector(this.direction,t),ai.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Mc.copy(e).add(t).multiplyScalar(.5),qa.copy(t).sub(e).normalize(),Si.copy(this.origin).sub(Mc);let r=e.distanceTo(t)*.5,a=-this.direction.dot(qa),o=Si.dot(this.direction),l=-Si.dot(qa),c=Si.lengthSq(),h=Math.abs(1-a*a),u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Mc).addScaledVector(qa,d),f}intersectSphere(e,t){ai.subVectors(e.center,this.origin);let n=ai.dot(this.direction),s=ai.dot(ai)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ai)!==null}intersectTriangle(e,t,n,s,r){Sc.subVectors(t,e),$a.subVectors(n,e),Tc.crossVectors(Sc,$a);let a=this.direction.dot(Tc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Si.subVectors(this.origin,e);let l=o*this.direction.dot($a.crossVectors(Si,$a));if(l<0)return null;let c=o*this.direction.dot(Sc.cross(Si));if(c<0||l+c>a)return null;let h=-o*Si.dot(Tc);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},En=class extends Wt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=Ko,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Wu=new qe,$i=new ci,Ya=new Zt,Xu=new I,Za=new I,Ka=new I,ja=new I,Ec=new I,Ja=new I,qu=new I,Qa=new I,lt=class extends pt{constructor(e=new Et,t=new En){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Ja.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(Ec.fromBufferAttribute(u,e),a?Ja.addScaledVector(Ec,h):Ja.addScaledVector(Ec.sub(t),h))}t.add(Ja)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ya.copy(n.boundingSphere),Ya.applyMatrix4(r),$i.copy(e.ray).recast(e.near),!(Ya.containsPoint($i.origin)===!1&&($i.intersectSphere(Ya,Xu)===null||$i.origin.distanceToSquared(Xu)>(e.far-e.near)**2))&&(Wu.copy(r).invert(),$i.copy(e.ray).applyMatrix4(Wu),!(n.boundingBox!==null&&$i.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,$i)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){let m=d[g],p=a[m.materialIndex],v=Math.max(m.start,f.start),M=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let b=v,C=M;b<C;b+=3){let w=o.getX(b),P=o.getX(b+1),y=o.getX(b+2);s=eo(this,p,e,n,c,h,u,w,P,y),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){let v=o.getX(m),M=o.getX(m+1),b=o.getX(m+2);s=eo(this,a,e,n,c,h,u,v,M,b),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){let m=d[g],p=a[m.materialIndex],v=Math.max(m.start,f.start),M=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let b=v,C=M;b<C;b+=3){let w=b,P=b+1,y=b+2;s=eo(this,p,e,n,c,h,u,w,P,y),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){let v=m,M=m+1,b=m+2;s=eo(this,a,e,n,c,h,u,v,M,b),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};$u=new I,Yu=new ft,Zu=new ft,Gp=new I,Ku=new qe,to=new I,Ac=new Zt,ju=new qe,wc=new ci,Hr=class extends lt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Uc,this.bindMatrix=new qe,this.bindMatrixInverse=new qe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new $t),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,to),this.boundingBox.expandByPoint(to)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Zt),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,to),this.boundingSphere.expandByPoint(to)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ac.copy(this.boundingSphere),Ac.applyMatrix4(s),e.ray.intersectsSphere(Ac)!==!1&&(ju.copy(s).invert(),wc.copy(e.ray).applyMatrix4(ju),!(this.boundingBox!==null&&wc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,wc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new ft,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Uc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===zd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ne("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;Yu.fromBufferAttribute(s.attributes.skinIndex,e),Zu.fromBufferAttribute(s.attributes.skinWeight,e),$u.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let a=Zu.getComponent(r);if(a!==0){let o=Yu.getComponent(r);Ku.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Gp.copy($u).applyMatrix4(Ku),a)}}return t.applyMatrix4(this.bindMatrixInverse)}},$s=class extends pt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Ys=class extends Dt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=yt,h=yt,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ju=new qe,Wp=new qe,Gr=class i{constructor(e=[],t=[]){this.uuid=pn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ne("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new qe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new qe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){let o=e[r]?e[r].matrixWorld:Wp;Ju.multiplyMatrices(o,t[r]),Ju.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Ys(t,e,e,ln,on);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],a=t[r];a===void 0&&(Ne("Skeleton: No bone found with UUID:",r),a=new $s),this.bones.push(a),this.boneInverses.push(new qe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let a=t[s];e.bones.push(a.uuid);let o=n[s];e.boneInverses.push(o.toArray())}return e}},Ci=class extends Tt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ns=new qe,Qu=new qe,no=[],ed=new $t,Xp=new qe,wr=new lt,Cr=new Zt,ns=class extends lt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ci(new Float32Array(n*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Xp)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new $t),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ns),ed.copy(e.boundingBox).applyMatrix4(Ns),this.boundingBox.union(ed)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Zt),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ns),Cr.copy(e.boundingSphere).applyMatrix4(Ns),this.boundingSphere.union(Cr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(wr.geometry=this.geometry,wr.material=this.material,wr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Cr.copy(this.boundingSphere),Cr.applyMatrix4(n),e.ray.intersectsSphere(Cr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ns),Qu.multiplyMatrices(n,Ns),wr.matrixWorld=Qu,wr.raycast(e,no);for(let a=0,o=no.length;a<o;a++){let l=no[a];l.instanceId=r,l.object=this,t.push(l)}no.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ci(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ys(new Float32Array(s*this.count),s,this.count,il,on));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Cc=new I,qp=new I,$p=new $e,dn=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Cc.subVectors(n,t).cross(qp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Cc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||$p.getNormalMatrix(e),s=this.coplanarPoint(Cc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Yi=new Zt,Yp=new re(.5,.5),io=new I,Zs=class{constructor(e=new dn,t=new dn,n=new dn,s=new dn,r=new dn,a=new dn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Sn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],x=r[9],m=r[10],p=r[11],v=r[12],M=r[13],b=r[14],C=r[15];if(s[0].setComponents(c-a,f-h,p-g,C-v).normalize(),s[1].setComponents(c+a,f+h,p+g,C+v).normalize(),s[2].setComponents(c+o,f+u,p+x,C+M).normalize(),s[3].setComponents(c-o,f-u,p-x,C-M).normalize(),n)s[4].setComponents(l,d,m,b).normalize(),s[5].setComponents(c-l,f-d,p-m,C-b).normalize();else if(s[4].setComponents(c-l,f-d,p-m,C-b).normalize(),t===Sn)s[5].setComponents(c+l,f+d,p+m,C+b).normalize();else if(t===ks)s[5].setComponents(l,d,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Yi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Yi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Yi)}intersectsSprite(e){Yi.center.set(0,0,0);let t=Yp.distanceTo(e.center);return Yi.radius=.7071067811865476+t,Yi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Yi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(io.x=s.normal.x>0?e.max.x:e.min.x,io.y=s.normal.y>0?e.max.y:e.min.y,io.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(io)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ks=class extends Wt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ro=new I,Io=new I,td=new qe,Rr=new ci,so=new Zt,Rc=new I,nd=new I,is=class extends pt{constructor(e=new Et,t=new Ks){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ro.fromBufferAttribute(t,s-1),Io.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ro.distanceTo(Io);e.setAttribute("lineDistance",new mt(n,1))}else Ne("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),so.copy(n.boundingSphere),so.applyMatrix4(s),so.radius+=r,e.ray.intersectsSphere(so)===!1)return;td.copy(s).invert(),Rr.copy(e.ray).applyMatrix4(td);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let x=f,m=g-1;x<m;x+=c){let p=h.getX(x),v=h.getX(x+1),M=ro(this,e,Rr,l,p,v,x);M&&t.push(M)}if(this.isLineLoop){let x=h.getX(g-1),m=h.getX(f),p=ro(this,e,Rr,l,x,m,g-1);p&&t.push(p)}}else{let f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let x=f,m=g-1;x<m;x+=c){let p=ro(this,e,Rr,l,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){let x=ro(this,e,Rr,l,g-1,f,g-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};id=new I,sd=new I,Wr=class extends is{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)id.fromBufferAttribute(t,s),sd.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+id.distanceTo(sd);e.setAttribute("lineDistance",new mt(n,1))}else Ne("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Xr=class extends is{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},js=class extends Wt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ke(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},rd=new qe,Vc=new ci,ao=new Zt,oo=new I,qr=class extends pt{constructor(e=new Et,t=new js){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ao.copy(n.boundingSphere),ao.applyMatrix4(s),ao.radius+=r,e.ray.intersectsSphere(ao)===!1)return;rd.copy(s).invert(),Vc.copy(e.ray).applyMatrix4(rd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=d,x=f;g<x;g++){let m=c.getX(g);oo.fromBufferAttribute(u,m),ad(oo,m,l,s,e,t,this)}}else{let d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,x=f;g<x;g++)oo.fromBufferAttribute(u,g),ad(oo,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};$r=class extends Dt{constructor(e=[],t=Ui,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ri=class extends Dt{constructor(e,t,n=In,s,r,a,o=yt,l=yt,c,h=On,u=1){if(h!==On&&h!==Fi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Gs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Po=class extends Ri{constructor(e,t=In,n=Ui,s,r,a=yt,o=yt,l,c=On){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Yr=class extends Dt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},An=class i extends Et{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new mt(c,3)),this.setAttribute("normal",new mt(h,3)),this.setAttribute("uv",new mt(u,2));function g(x,m,p,v,M,b,C,w,P,y,T){let H=b/P,R=C/y,G=b/2,B=C/2,L=w/2,k=P+1,F=y+1,U=0,ie=0,Y=new I;for(let le=0;le<F;le++){let he=le*R-B;for(let ae=0;ae<k;ae++){let Me=ae*H-G;Y[x]=Me*v,Y[m]=he*M,Y[p]=L,c.push(Y.x,Y.y,Y.z),Y[x]=0,Y[m]=0,Y[p]=w>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(ae/P),u.push(1-le/y),U+=1}}for(let le=0;le<y;le++)for(let he=0;he<P;he++){let ae=d+he+k*le,Me=d+he+k*(le+1),j=d+(he+1)+k*(le+1),J=d+(he+1)+k*le;l.push(ae,Me,J),l.push(Me,j,J),ie+=6}o.addGroup(f,ie,T),f+=ie,d+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},rn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ne("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new re:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new I,s=[],r=[],a=[],o=new I,l=new qe;for(let f=0;f<=e;f++){let g=f/e;s[f]=this.getTangentAt(g,new I)}r[0]=new I,a[0]=new I;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(Ye(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Ye(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Js=class extends rn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new re){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Lo=class extends Js{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};lo=new I,Ic=new _h,Pc=new _h,Lc=new _h,Qs=class extends rn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new I){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(lo.subVectors(s[0],s[1]).add(s[0]),c=lo);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(lo.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=lo),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),Ic.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,x,m),Pc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,x,m),Lc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(Ic.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Pc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Lc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Ic.calc(l),Pc.calc(l),Lc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};Zr=class extends rn{constructor(e=new re,t=new re,n=new re,s=new re){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new re){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Nr(e,s.x,r.x,a.x,o.x),Nr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Do=class extends rn{constructor(e=new I,t=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new I){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Nr(e,s.x,r.x,a.x,o.x),Nr(e,s.y,r.y,a.y,o.y),Nr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Kr=class extends rn{constructor(e=new re,t=new re){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new re){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new re){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},No=class extends rn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},jr=class extends rn{constructor(e=new re,t=new re,n=new re){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new re){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Dr(e,s.x,r.x,a.x),Dr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Uo=class extends rn{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Dr(e,s.x,r.x,a.x),Dr(e,s.y,r.y,a.y),Dr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Jr=class extends rn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new re){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(od(o,l.x,c.x,h.x,u.x),od(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new re().fromArray(s))}return this}},Hc=Object.freeze({__proto__:null,ArcCurve:Lo,CatmullRomCurve3:Qs,CubicBezierCurve:Zr,CubicBezierCurve3:Do,EllipseCurve:Js,LineCurve:Kr,LineCurve3:No,QuadraticBezierCurve:jr,QuadraticBezierCurve3:Uo,SplineCurve:Jr}),Fo=class extends rn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Hc[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Hc[s.type]().fromJSON(s))}return this}},ss=class extends Fo{constructor(e){super(),this.type="Path",this.currentPoint=new re,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Kr(this.currentPoint.clone(),new re(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new jr(this.currentPoint.clone(),new re(e,t),new re(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new Zr(this.currentPoint.clone(),new re(e,t),new re(n,s),new re(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Jr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new Js(e,t,n,s,r,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},wn=class extends ss{constructor(e){super(e),this.uuid=pn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new ss().fromJSON(s))}return this}};Xc=class{static triangulate(e,t,n=2){return nm(e,t,n)}},Un=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];cd(e),hd(n,e);let a=e.length;t.forEach(cd);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,hd(n,t[l]);let o=Xc.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};Ii=class i extends Et{constructor(e=new wn([new re(.5,.5),new re(-.5,.5),new re(-.5,-.5),new re(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new mt(s,3)),this.setAttribute("uv",new mt(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:ym,M,b=!1,C,w,P,y;if(p){M=p.getSpacedPoints(h),b=!0,d=!1;let ee=p.isCatmullRomCurve3?p.closed:!1;C=p.computeFrenetFrames(h,ee),w=new I,P=new I,y=new I}d||(m=0,f=0,g=0,x=0);let T=o.extractPoints(c),H=T.shape,R=T.holes;if(!Un.isClockWise(H)){H=H.reverse();for(let ee=0,se=R.length;ee<se;ee++){let te=R[ee];Un.isClockWise(te)&&(R[ee]=te.reverse())}}function B(ee){let te=10000000000000001e-36,ge=ee[0];for(let A=1;A<=ee.length;A++){let ze=A%ee.length,be=ee[ze],Ve=be.x-ge.x,fe=be.y-ge.y,E=Ve*Ve+fe*fe,_=Math.max(Math.abs(be.x),Math.abs(be.y),Math.abs(ge.x),Math.abs(ge.y)),N=te*_*_;if(E<=N){ee.splice(ze,1),A--;continue}ge=be}}B(H),R.forEach(B);let L=R.length,k=H;for(let ee=0;ee<L;ee++){let se=R[ee];H=H.concat(se)}function F(ee,se,te){return se||Ge("ExtrudeGeometry: vec does not exist"),ee.clone().addScaledVector(se,te)}let U=H.length;function ie(ee,se,te){let ge,A,ze,be=ee.x-se.x,Ve=ee.y-se.y,fe=te.x-ee.x,E=te.y-ee.y,_=be*be+Ve*Ve,N=be*E-Ve*fe;if(Math.abs(N)>Number.EPSILON){let $=Math.sqrt(_),ne=Math.sqrt(fe*fe+E*E),Z=se.x-Ve/$,we=se.y+be/$,pe=te.x-E/ne,Fe=te.y+fe/ne,He=((pe-Z)*E-(Fe-we)*fe)/(be*E-Ve*fe);ge=Z+be*He-ee.x,A=we+Ve*He-ee.y;let oe=ge*ge+A*A;if(oe<=2)return new re(ge,A);ze=Math.sqrt(oe/2)}else{let $=!1;be>Number.EPSILON?fe>Number.EPSILON&&($=!0):be<-Number.EPSILON?fe<-Number.EPSILON&&($=!0):Math.sign(Ve)===Math.sign(E)&&($=!0),$?(ge=-Ve,A=be,ze=Math.sqrt(_)):(ge=be,A=Ve,ze=Math.sqrt(_/2))}return new re(ge/ze,A/ze)}let Y=[];for(let ee=0,se=k.length,te=se-1,ge=ee+1;ee<se;ee++,te++,ge++)te===se&&(te=0),ge===se&&(ge=0),Y[ee]=ie(k[ee],k[te],k[ge]);let le=[],he,ae=Y.concat();for(let ee=0,se=L;ee<se;ee++){let te=R[ee];he=[];for(let ge=0,A=te.length,ze=A-1,be=ge+1;ge<A;ge++,ze++,be++)ze===A&&(ze=0),be===A&&(be=0),he[ge]=ie(te[ge],te[ze],te[be]);le.push(he),ae=ae.concat(he)}let Me;if(m===0)Me=Un.triangulateShape(k,R);else{let ee=[],se=[];for(let te=0;te<m;te++){let ge=te/m,A=f*Math.cos(ge*Math.PI/2),ze=g*Math.sin(ge*Math.PI/2)+x;for(let be=0,Ve=k.length;be<Ve;be++){let fe=F(k[be],Y[be],ze);ve(fe.x,fe.y,-A),ge===0&&ee.push(fe)}for(let be=0,Ve=L;be<Ve;be++){let fe=R[be];he=le[be];let E=[];for(let _=0,N=fe.length;_<N;_++){let $=F(fe[_],he[_],ze);ve($.x,$.y,-A),ge===0&&E.push($)}ge===0&&se.push(E)}}Me=Un.triangulateShape(ee,se)}let j=Me.length,J=g+x;for(let ee=0;ee<U;ee++){let se=d?F(H[ee],ae[ee],J):H[ee];b?(P.copy(C.normals[0]).multiplyScalar(se.x),w.copy(C.binormals[0]).multiplyScalar(se.y),y.copy(M[0]).add(P).add(w),ve(y.x,y.y,y.z)):ve(se.x,se.y,0)}for(let ee=1;ee<=h;ee++)for(let se=0;se<U;se++){let te=d?F(H[se],ae[se],J):H[se];b?(P.copy(C.normals[ee]).multiplyScalar(te.x),w.copy(C.binormals[ee]).multiplyScalar(te.y),y.copy(M[ee]).add(P).add(w),ve(y.x,y.y,y.z)):ve(te.x,te.y,u/h*ee)}for(let ee=m-1;ee>=0;ee--){let se=ee/m,te=f*Math.cos(se*Math.PI/2),ge=g*Math.sin(se*Math.PI/2)+x;for(let A=0,ze=k.length;A<ze;A++){let be=F(k[A],Y[A],ge);ve(be.x,be.y,u+te)}for(let A=0,ze=R.length;A<ze;A++){let be=R[A];he=le[A];for(let Ve=0,fe=be.length;Ve<fe;Ve++){let E=F(be[Ve],he[Ve],ge);b?ve(E.x,E.y+M[h-1].y,M[h-1].x+te):ve(E.x,E.y,u+te)}}}O(),Q();function O(){let ee=s.length/3;if(d){let se=0,te=U*se;for(let ge=0;ge<j;ge++){let A=Me[ge];Ce(A[2]+te,A[1]+te,A[0]+te)}se=h+m*2,te=U*se;for(let ge=0;ge<j;ge++){let A=Me[ge];Ce(A[0]+te,A[1]+te,A[2]+te)}}else{for(let se=0;se<j;se++){let te=Me[se];Ce(te[2],te[1],te[0])}for(let se=0;se<j;se++){let te=Me[se];Ce(te[0]+U*h,te[1]+U*h,te[2]+U*h)}}n.addGroup(ee,s.length/3-ee,0)}function Q(){let ee=s.length/3,se=0;q(k,se),se+=k.length;for(let te=0,ge=R.length;te<ge;te++){let A=R[te];q(A,se),se+=A.length}n.addGroup(ee,s.length/3-ee,1)}function q(ee,se){let te=ee.length;for(;--te>=0;){let ge=te,A=te-1;A<0&&(A=ee.length-1);for(let ze=0,be=h+m*2;ze<be;ze++){let Ve=U*ze,fe=U*(ze+1),E=se+ge+Ve,_=se+A+Ve,N=se+A+fe,$=se+ge+fe;Se(E,_,N,$)}}}function ve(ee,se,te){l.push(ee),l.push(se),l.push(te)}function Ce(ee,se,te){Ke(ee),Ke(se),Ke(te);let ge=s.length/3,A=v.generateTopUV(n,s,ge-3,ge-2,ge-1);Be(A[0]),Be(A[1]),Be(A[2])}function Se(ee,se,te,ge){Ke(ee),Ke(se),Ke(ge),Ke(se),Ke(te),Ke(ge);let A=s.length/3,ze=v.generateSideWallUV(n,s,A-6,A-3,A-2,A-1);Be(ze[0]),Be(ze[1]),Be(ze[3]),Be(ze[1]),Be(ze[2]),Be(ze[3])}function Ke(ee){s.push(l[ee*3+0]),s.push(l[ee*3+1]),s.push(l[ee*3+2])}function Be(ee){r.push(ee.x),r.push(ee.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return vm(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Hc[s.type]().fromJSON(s)),new i(n,e.options)}},ym={generateTopUV:function(i,e,t,n,s){let r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new re(r,a),new re(o,l),new re(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],g=e[s*3+2],x=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new re(a,1-l),new re(c,1-u),new re(d,1-g),new re(x,1-p)]:[new re(o,1-l),new re(h,1-u),new re(f,1-g),new re(m,1-p)]}};as=class i extends Et{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,f=[],g=[],x=[],m=[];for(let p=0;p<h;p++){let v=p*d-a;for(let M=0;M<c;M++){let b=M*u-r;g.push(b,-v,0),x.push(0,0,1),m.push(M/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<o;v++){let M=v+c*p,b=v+c*(p+1),C=v+1+c*(p+1),w=v+1+c*p;f.push(M,b,w),f.push(b,C,w)}this.setIndex(f),this.setAttribute("position",new mt(g,3)),this.setAttribute("normal",new mt(x,3)),this.setAttribute("uv",new mt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},na=class i extends Et{constructor(e=new wn([new re(0,.5),new re(-.5,-.5),new re(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new mt(s,3)),this.setAttribute("normal",new mt(r,3)),this.setAttribute("uv",new mt(a,2));function c(h){let u=s.length/3,d=h.extractPoints(t),f=d.shape,g=d.holes;Un.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){let v=g[m];Un.isClockWise(v)===!0&&(g[m]=v.reverse())}let x=Un.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){let v=g[m];f=f.concat(v)}for(let m=0,p=f.length;m<p;m++){let v=f[m];s.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let m=0,p=x.length;m<p;m++){let v=x[m],M=v[0]+u,b=v[1]+u,C=v[2]+u;n.push(M,b,C),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return bm(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};ia=class i extends Et{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new I,d=new I,f=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){let v=[],M=p/n,b=0;p===0&&a===0?b=.5/t:p===n&&l===Math.PI&&(b=-.5/t);for(let C=0;C<=t;C++){let w=C/t;u.x=-e*Math.cos(s+w*r)*Math.sin(a+M*o),u.y=e*Math.cos(a+M*o),u.z=e*Math.sin(s+w*r)*Math.sin(a+M*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),m.push(w+b,1-M),v.push(c++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<t;v++){let M=h[p][v+1],b=h[p][v],C=h[p+1][v],w=h[p+1][v+1];(p!==0||a>0)&&f.push(M,b,w),(p!==n-1||l<Math.PI)&&f.push(b,C,w)}this.setIndex(f),this.setAttribute("position",new mt(g,3)),this.setAttribute("normal",new mt(x,3)),this.setAttribute("uv",new mt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},sa=class extends Wt{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new ke(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};rf={clone:ds,merge:Xt},Sm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Tm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,an=class extends Wt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Sm,this.fragmentShader=Tm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ds(e.uniforms),this.uniformsGroups=Mm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Oo=class extends an{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},zn=class extends Wt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zl,this.normalScale=new re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Bt=class extends zn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new re(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ye(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ke(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ke(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ke(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},ra=class extends Wt{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zl,this.normalScale=new re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=Ko,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Bo=class extends Wt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},zo=class extends Wt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};kn=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ko=class extends kn{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Oc,endingEnd:Oc}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Bc:r=e,o=2*t-n;break;case zc:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Bc:a=e,l=2*n-t;break;case zc:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),x=g*g,m=x*g,p=-d*m+2*d*x-d*g,v=(1+d)*m+(-1.5-2*d)*x+(-.5+d)*g+1,M=(-1-f)*m+(1.5+f)*x+.5*g,b=f*m-f*x;for(let C=0;C!==o;++C)r[C]=p*a[h+C]+v*a[c+C]+M*a[l+C]+b*a[u+C];return r}},Vo=class extends kn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},Ho=class extends kn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Go=class extends kn{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.settings||this.DefaultSettings_,u=h.inTangents,d=h.outTangents;if(!u||!d){let x=(n-t)/(s-t),m=1-x;for(let p=0;p!==o;++p)r[p]=a[c+p]*m+a[l+p]*x;return r}let f=o*2,g=e-1;for(let x=0;x!==o;++x){let m=a[c+x],p=a[l+x],v=g*f+x*2,M=d[v],b=d[v+1],C=e*f+x*2,w=u[C],P=u[C+1],y=(n-t)/(s-t),T,H,R,G,B;for(let L=0;L<8;L++){T=y*y,H=T*y,R=1-y,G=R*R,B=G*R;let F=B*t+3*G*y*M+3*R*T*w+H*s-n;if(Math.abs(F)<1e-10)break;let U=3*G*(M-t)+6*R*y*(w-M)+3*T*(s-w);if(Math.abs(U)<1e-10)break;y=y-F/U,y=Math.max(0,Math.min(1,y))}r[x]=B*m+3*G*y*b+3*R*T*P+H*p}return r}},Kt=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=uo(t,this.TimeBufferType),this.values=uo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:uo(e.times,Array),values:uo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ho(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Vo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ko(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Go(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case Ji:t=this.InterpolantFactoryMethodDiscrete;break;case Qi:t=this.InterpolantFactoryMethodLinear;break;case mo:t=this.InterpolantFactoryMethodSmooth;break;case Fc:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ne("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ji;case this.InterpolantFactoryMethodLinear:return Qi;case this.InterpolantFactoryMethodSmooth:return mo;case this.InterpolantFactoryMethodBezier:return Fc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ge("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ge("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Ge("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ge("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&up(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Ge("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===mo,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let u=o*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){let x=t[u+g];if(x!==t[d+g]||x!==t[f+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Kt.prototype.ValueTypeName="";Kt.prototype.TimeBufferType=Float32Array;Kt.prototype.ValueBufferType=Float32Array;Kt.prototype.DefaultInterpolation=Qi;hi=class extends Kt{constructor(e,t,n){super(e,t,n)}};hi.prototype.ValueTypeName="bool";hi.prototype.ValueBufferType=Array;hi.prototype.DefaultInterpolation=Ji;hi.prototype.InterpolantFactoryMethodLinear=void 0;hi.prototype.InterpolantFactoryMethodSmooth=void 0;aa=class extends Kt{constructor(e,t,n,s){super(e,t,n,s)}};aa.prototype.ValueTypeName="color";Vn=class extends Kt{constructor(e,t,n,s){super(e,t,n,s)}};Vn.prototype.ValueTypeName="number";Wo=class extends kn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)Gt.slerpFlat(r,0,a,c-o,a,c,l);return r}},Hn=class extends Kt{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Wo(this.times,this.values,this.getValueSize(),e)}};Hn.prototype.ValueTypeName="quaternion";Hn.prototype.InterpolantFactoryMethodSmooth=void 0;ui=class extends Kt{constructor(e,t,n){super(e,t,n)}};ui.prototype.ValueTypeName="string";ui.prototype.ValueBufferType=Array;ui.prototype.DefaultInterpolation=Ji;ui.prototype.InterpolantFactoryMethodLinear=void 0;ui.prototype.InterpolantFactoryMethodSmooth=void 0;Gn=class extends Kt{constructor(e,t,n,s){super(e,t,n,s)}};Gn.prototype.ValueTypeName="vector";oa=class{constructor(e="",t=-1,n=[],s=kd){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=pn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(wm(n[a]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Kt.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);let h=Em(l);l=ud(l,1,h),c=ud(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Vn(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],h=c.name.match(r);if(h&&h.length>1){let u=h[1],d=s[u];d||(s[u]=d=[]),d.push(c)}}let a=[];for(let o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}static parseAnimation(e,t){if(Ne("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return Ge("AnimationClip: No animation in JSONLoader data."),null;let n=function(u,d,f,g,x){if(f.length!==0){let m=[],p=[];af(f,m,p,g),m.length!==0&&x.push(new u(d,m,p))}},s=[],r=e.name||"default",a=e.fps||30,o=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let u=0;u<c.length;u++){let d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){let f={},g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let x=0;x<d[g].morphTargets.length;x++)f[d[g].morphTargets[x]]=-1;for(let x in f){let m=[],p=[];for(let v=0;v!==d[g].morphTargets.length;++v){let M=d[g];m.push(M.time),p.push(M.morphTarget===x?1:0)}s.push(new Vn(".morphTargetInfluence["+x+"]",m,p))}l=f.length*a}else{let f=".bones["+t[u].name+"]";n(Gn,f+".position",d,"pos",s),n(Hn,f+".quaternion",d,"rot",s),n(Gn,f+".scale",d,"scl",s)}}return s.length===0?null:new this(r,l,s,o)}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};Fn={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(dd(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!dd(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};Xo=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},of=new Xo,Wn=class{constructor(e){this.manager=e!==void 0?e:of,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Wn.DEFAULT_MATERIAL_NAME="__DEFAULT";oi={},qc=class extends Error{constructor(e,t){super(e),this.response=t}},tr=class extends Wn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Fn.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(oi[e]!==void 0){oi[e].push({onLoad:t,onProgress:n,onError:s});return}oi[e]=[],oi[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ne("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=oi[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,g=f!==0,x=0,m=new ReadableStream({start(p){v();function v(){u.read().then(({done:M,value:b})=>{if(M)p.close();else{x+=b.byteLength;let C=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:f});for(let w=0,P=h.length;w<P;w++){let y=h[w];y.onProgress&&y.onProgress(C)}p.enqueue(b),v()}},M=>{p.error(M)})}}});return new Response(m)}else throw new qc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{Fn.add(`file:${e}`,c);let h=oi[e];delete oi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{let h=oi[e];if(h===void 0)throw this.manager.itemError(e),c;delete oi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Us=new WeakMap,qo=class extends Wn{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=Fn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=Us.get(a);u===void 0&&(u=[],Us.set(a,u)),u.push({onLoad:t,onError:s})}return a}let o=Vs("img");function l(){h(),t&&t(this);let u=Us.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}Us.delete(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),Fn.remove(`image:${e}`);let d=Us.get(this)||[];for(let f=0;f<d.length;f++){let g=d[f];g.onError&&g.onError(u)}Us.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Fn.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}},la=class extends Wn{constructor(e){super(e)}load(e,t,n,s){let r=new Dt,a=new qo(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},os=class extends pt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ke(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},ca=class extends os{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Dc=new qe,fd=new I,pd=new I,ha=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new re(512,512),this.mapType=Jt,this.map=null,this.mapPass=null,this.matrix=new qe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Zs,this._frameExtents=new re(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;fd.setFromMatrixPosition(e.matrixWorld),t.position.copy(fd),pd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(pd),t.updateMatrixWorld(),Dc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dc,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===ks||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Dc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},fo=new I,po=new Gt,Nn=new I,ua=class extends pt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new qe,this.projectionMatrix=new qe,this.projectionMatrixInverse=new qe,this.coordinateSystem=Sn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(fo,po,Nn),Nn.x===1&&Nn.y===1&&Nn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fo,po,Nn.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(fo,po,Nn),Nn.x===1&&Nn.y===1&&Nn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fo,po,Nn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ti=new I,md=new re,gd=new re,St=class extends ua{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=es*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Pr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return es*2*Math.atan(Math.tan(Pr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ti.x,Ti.y).multiplyScalar(-e/Ti.z),Ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ti.x,Ti.y).multiplyScalar(-e/Ti.z)}getViewSize(e,t){return this.getViewBounds(e,md,gd),t.subVectors(gd,md)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Pr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},$c=class extends ha{constructor(){super(new St(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=es*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},da=class extends os{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new $c}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Yc=class extends ha{constructor(){super(new St(90,1,.5,500)),this.isPointLightShadow=!0}},ls=class extends os{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Yc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Pi=class extends ua{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Zc=class extends ha{constructor(){super(new Pi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Li=class extends os{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.shadow=new Zc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},di=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Nc=new WeakMap,fa=class extends Wn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ne("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ne("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=Fn.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{if(Nc.has(a)===!0)s&&s(Nc.get(a)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Fn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),Nc.set(l,c),Fn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Fn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Fs=-90,Os=1,$o=class extends pt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new St(Fs,Os,e,t);s.layers=this.layers,this.add(s);let r=new St(Fs,Os,e,t);r.layers=this.layers,this.add(r);let a=new St(Fs,Os,e,t);a.layers=this.layers,this.add(a);let o=new St(Fs,Os,e,t);o.layers=this.layers,this.add(o);let l=new St(Fs,Os,e,t);l.layers=this.layers,this.add(l);let c=new St(Fs,Os,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Sn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ks)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Yo=class extends St{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},yh="\\[\\]\\.:\\/",Cm=new RegExp("["+yh+"]","g"),vh="[^"+yh+"]",Rm="[^"+yh.replace("\\.","")+"]",Im=/((?:WC+[\/:])*)/.source.replace("WC",vh),Pm=/(WCOD+)?/.source.replace("WCOD",Rm),Lm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",vh),Dm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",vh),Nm=new RegExp("^"+Im+Pm+Lm+Dm+"$"),Um=["material","materials","bones","map"],Kc=class{constructor(e,t,n){let s=n||ut.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ut=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Cm,"")}static parseTrackName(e){let t=Nm.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Um.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ne("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ge("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ge("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ge("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ge("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ge("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ge("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ge("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Ge("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ge("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ge("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ut.Composite=Kc;ut.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ut.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ut.prototype.GetterByBindingType=[ut.prototype._getValue_direct,ut.prototype._getValue_array,ut.prototype._getValue_arrayElement,ut.prototype._getValue_toArray];ut.prototype.SetterByBindingTypeAndVersioning=[[ut.prototype._setValue_direct,ut.prototype._setValue_direct_setNeedsUpdate,ut.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_array,ut.prototype._setValue_array_setNeedsUpdate,ut.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_arrayElement,ut.prototype._setValue_arrayElement_setNeedsUpdate,ut.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_fromArray,ut.prototype._setValue_fromArray_setNeedsUpdate,ut.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];rv=new Float32Array(1),nr=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ye(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ye(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}},pa=class extends Bn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Ne("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"183"}}));typeof window<"u"&&(window.__THREE__?Ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="183")});function If(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Bm(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){let g=u[d],x=u[f];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){let x=u[f];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}function y_(i,e,t,n,s,r){let a=new ke(0),o=s===!0?0:1,l,c,h=null,u=0,d=null;function f(v){let M=v.isScene===!0?v.background:null;if(M&&M.isTexture){let b=v.backgroundBlurriness>0;M=e.get(M,b)}return M}function g(v){let M=!1,b=f(v);b===null?m(a,o):b&&b.isColor&&(m(b,1),M=!0);let C=i.xr.getEnvironmentBlendMode();C==="additive"?t.buffers.color.setClear(0,0,0,1,r):C==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(v,M){let b=f(M);b&&(b.isCubeTexture||b.mapping===_a)?(c===void 0&&(c=new lt(new An(1,1,1),new an({name:"BackgroundCubeMaterial",uniforms:ds(Yn.backgroundCube.uniforms),vertexShader:Yn.backgroundCube.vertexShader,fragmentShader:Yn.backgroundCube.fragmentShader,side:zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(C,w,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),fs.copy(M.backgroundRotation),fs.x*=-1,fs.y*=-1,fs.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(fs.y*=-1,fs.z*=-1),c.material.uniforms.envMap.value=b,c.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(x_.makeRotationFromEuler(fs)),c.material.toneMapped=et.getTransfer(b.colorSpace)!==nt,(h!==b||u!==b.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=b,u=b.version,d=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new lt(new as(2,2),new an({name:"BackgroundMaterial",uniforms:ds(Yn.background.uniforms),vertexShader:Yn.background.vertexShader,fragmentShader:Yn.background.fragmentShader,side:Tn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=et.getTransfer(b.colorSpace)!==nt,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||u!==b.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=b,u=b.version,d=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function m(v,M){v.getRGB(Hl,xh(i)),t.buffers.color.setClear(Hl.r,Hl.g,Hl.b,M,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,M=1){a.set(v),o=M,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,m(a,o)},render:g,addToRenderList:x,dispose:p}}function v_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(R,G,B,L,k){let F=!1,U=u(R,L,B,G);r!==U&&(r=U,c(r.object)),F=f(R,L,B,k),F&&g(R,L,B,k),k!==null&&e.update(k,i.ELEMENT_ARRAY_BUFFER),(F||a)&&(a=!1,b(R,G,B,L),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function l(){return i.createVertexArray()}function c(R){return i.bindVertexArray(R)}function h(R){return i.deleteVertexArray(R)}function u(R,G,B,L){let k=L.wireframe===!0,F=n[G.id];F===void 0&&(F={},n[G.id]=F);let U=R.isInstancedMesh===!0?R.id:0,ie=F[U];ie===void 0&&(ie={},F[U]=ie);let Y=ie[B.id];Y===void 0&&(Y={},ie[B.id]=Y);let le=Y[k];return le===void 0&&(le=d(l()),Y[k]=le),le}function d(R){let G=[],B=[],L=[];for(let k=0;k<t;k++)G[k]=0,B[k]=0,L[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:B,attributeDivisors:L,object:R,attributes:{},index:null}}function f(R,G,B,L){let k=r.attributes,F=G.attributes,U=0,ie=B.getAttributes();for(let Y in ie)if(ie[Y].location>=0){let he=k[Y],ae=F[Y];if(ae===void 0&&(Y==="instanceMatrix"&&R.instanceMatrix&&(ae=R.instanceMatrix),Y==="instanceColor"&&R.instanceColor&&(ae=R.instanceColor)),he===void 0||he.attribute!==ae||ae&&he.data!==ae.data)return!0;U++}return r.attributesNum!==U||r.index!==L}function g(R,G,B,L){let k={},F=G.attributes,U=0,ie=B.getAttributes();for(let Y in ie)if(ie[Y].location>=0){let he=F[Y];he===void 0&&(Y==="instanceMatrix"&&R.instanceMatrix&&(he=R.instanceMatrix),Y==="instanceColor"&&R.instanceColor&&(he=R.instanceColor));let ae={};ae.attribute=he,he&&he.data&&(ae.data=he.data),k[Y]=ae,U++}r.attributes=k,r.attributesNum=U,r.index=L}function x(){let R=r.newAttributes;for(let G=0,B=R.length;G<B;G++)R[G]=0}function m(R){p(R,0)}function p(R,G){let B=r.newAttributes,L=r.enabledAttributes,k=r.attributeDivisors;B[R]=1,L[R]===0&&(i.enableVertexAttribArray(R),L[R]=1),k[R]!==G&&(i.vertexAttribDivisor(R,G),k[R]=G)}function v(){let R=r.newAttributes,G=r.enabledAttributes;for(let B=0,L=G.length;B<L;B++)G[B]!==R[B]&&(i.disableVertexAttribArray(B),G[B]=0)}function M(R,G,B,L,k,F,U){U===!0?i.vertexAttribIPointer(R,G,B,k,F):i.vertexAttribPointer(R,G,B,L,k,F)}function b(R,G,B,L){x();let k=L.attributes,F=B.getAttributes(),U=G.defaultAttributeValues;for(let ie in F){let Y=F[ie];if(Y.location>=0){let le=k[ie];if(le===void 0&&(ie==="instanceMatrix"&&R.instanceMatrix&&(le=R.instanceMatrix),ie==="instanceColor"&&R.instanceColor&&(le=R.instanceColor)),le!==void 0){let he=le.normalized,ae=le.itemSize,Me=e.get(le);if(Me===void 0)continue;let j=Me.buffer,J=Me.type,O=Me.bytesPerElement,Q=J===i.INT||J===i.UNSIGNED_INT||le.gpuType===el;if(le.isInterleavedBufferAttribute){let q=le.data,ve=q.stride,Ce=le.offset;if(q.isInstancedInterleavedBuffer){for(let Se=0;Se<Y.locationSize;Se++)p(Y.location+Se,q.meshPerAttribute);R.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let Se=0;Se<Y.locationSize;Se++)m(Y.location+Se);i.bindBuffer(i.ARRAY_BUFFER,j);for(let Se=0;Se<Y.locationSize;Se++)M(Y.location+Se,ae/Y.locationSize,J,he,ve*O,(Ce+ae/Y.locationSize*Se)*O,Q)}else{if(le.isInstancedBufferAttribute){for(let q=0;q<Y.locationSize;q++)p(Y.location+q,le.meshPerAttribute);R.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let q=0;q<Y.locationSize;q++)m(Y.location+q);i.bindBuffer(i.ARRAY_BUFFER,j);for(let q=0;q<Y.locationSize;q++)M(Y.location+q,ae/Y.locationSize,J,he,ae*O,ae/Y.locationSize*q*O,Q)}}else if(U!==void 0){let he=U[ie];if(he!==void 0)switch(he.length){case 2:i.vertexAttrib2fv(Y.location,he);break;case 3:i.vertexAttrib3fv(Y.location,he);break;case 4:i.vertexAttrib4fv(Y.location,he);break;default:i.vertexAttrib1fv(Y.location,he)}}}}v()}function C(){T();for(let R in n){let G=n[R];for(let B in G){let L=G[B];for(let k in L){let F=L[k];for(let U in F)h(F[U].object),delete F[U];delete L[k]}}delete n[R]}}function w(R){if(n[R.id]===void 0)return;let G=n[R.id];for(let B in G){let L=G[B];for(let k in L){let F=L[k];for(let U in F)h(F[U].object),delete F[U];delete L[k]}}delete n[R.id]}function P(R){for(let G in n){let B=n[G];for(let L in B){let k=B[L];if(k[R.id]===void 0)continue;let F=k[R.id];for(let U in F)h(F[U].object),delete F[U];delete k[R.id]}}}function y(R){for(let G in n){let B=n[G],L=R.isInstancedMesh===!0?R.id:0,k=B[L];if(k!==void 0){for(let F in k){let U=k[F];for(let ie in U)h(U[ie].object),delete U[ie];delete k[F]}delete B[L],Object.keys(B).length===0&&delete n[G]}}}function T(){H(),a=!0,r!==s&&(r=s,c(r.object))}function H(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:H,dispose:C,releaseStatesOfGeometry:w,releaseStatesOfObject:y,releaseStatesOfProgram:P,initAttributes:x,enableAttribute:m,disableUnusedAttributes:v}}function b_(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,n,1)}function l(c,h,u,d){if(u===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x]*d[x];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function M_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let P=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==ln&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){let y=P===qn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==Jt&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==on&&!y)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Ne("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:b,maxSamples:C,samples:w}}function S_(i){let e=this,t=null,n=0,s=!1,r=!1,a=new dn,o=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let v=r?0:n,M=v*4,b=p.clippingState||null;l.value=b,b=h(g,d,M,f);for(let C=0;C!==M;++C)b[C]=t[C];p.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=l.value,g!==!0||m===null){let p=f+x*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,b=f;M!==x;++M,b+=4)a.copy(u[M]).applyMatrix4(v,o),a.normal.toArray(m,b),m[b+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function A_(i){let e=[],t=[],n=[],s=i,r=i-Oi+1+lf.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Oi?l=lf[a-i+Oi-1]:a===0&&(l=0),t.push(l);let c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,x=3,m=2,p=1,v=new Float32Array(x*g*f),M=new Float32Array(m*g*f),b=new Float32Array(p*g*f);for(let w=0;w<f;w++){let P=w%3*2/3-1,y=w>2?0:-1,T=[P,y,0,P+2/3,y,0,P+2/3,y+1,0,P,y,0,P+2/3,y+1,0,P,y+1,0];v.set(T,x*g*w),M.set(d,m*g*w);let H=[w,w,w,w,w,w];b.set(H,p*g*w)}let C=new Et;C.setAttribute("position",new Tt(v,x)),C.setAttribute("uv",new Tt(M,m)),C.setAttribute("faceIndex",new Tt(b,p)),n.push(new lt(C,null)),s>Oi&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function hf(i,e,t){let n=new sn(i,e,t);return n.texture.mapping=_a,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function lr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function w_(i,e,t){return new an({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:T_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ql(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function C_(i,e,t){let n=new Float32Array(ms),s=new I(0,1,0);return new an({name:"SphericalGaussianBlur",defines:{n:ms,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ql(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function uf(){return new an({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ql(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function df(){return new an({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function ql(){return`

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
	`}function R_(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===jo||f===Jo)if(e.has(d)){let g=e.get(d).texture;return o(g,d.mapping)}else{let g=d.image;if(g&&g.height>0){let x=new Wl(g.height);return x.fromEquirectangularTexture(i,d),e.set(d,x),d.addEventListener("dispose",c),o(x.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){let f=d.mapping,g=f===jo||f===Jo,x=f===Ui||f===cs;if(g||x){let m=t.get(d),p=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new hr(i)),m=g?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{let v=d.image;return g&&v&&v.height>0||x&&v&&l(v)?(n===null&&(n=new hr(i)),m=g?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,f){return f===jo?d.mapping=Ui:f===Jo&&(d.mapping=cs),d}function l(d){let f=0,g=6;for(let x=0;x<g;x++)d[x]!==void 0&&f++;return f===g}function c(d){let f=d.target;f.removeEventListener("dispose",c);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function I_(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Or("WebGLRenderer: "+n+" extension not supported."),s}}}function P_(i,e,t,n){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)e.update(d[f],i.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,g=u.attributes.position,x=0;if(g===void 0)return;if(f!==null){let v=f.array;x=f.version;for(let M=0,b=v.length;M<b;M+=3){let C=v[M+0],w=v[M+1],P=v[M+2];d.push(C,w,w,P,P,C)}}else{let v=g.array;x=g.version;for(let M=0,b=v.length/3-1;M<b;M+=3){let C=M+0,w=M+1,P=M+2;d.push(C,w,w,P,P,C)}}let m=new(g.count>=65535?Vr:kr)(d,1);m.version=x;let p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function L_(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*a),t.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*a,g),t.update(f,n,g))}function h(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function u(d,f,g,x){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/a,f[p],x[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,x,0,g);let p=0;for(let v=0;v<g;v++)p+=f[v]*x[v];t.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function D_(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Ge("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function N_(i,e,t){let n=new WeakMap,s=new ft;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let T=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",T)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],v=o.morphAttributes.color||[],M=0;f===!0&&(M=1),g===!0&&(M=2),x===!0&&(M=3);let b=o.attributes.position.count*M,C=1;b>e.maxTextureSize&&(C=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let w=new Float32Array(b*C*4*u),P=new Br(w,b,C,u);P.type=on,P.needsUpdate=!0;let y=M*4;for(let H=0;H<u;H++){let R=m[H],G=p[H],B=v[H],L=b*C*4*H;for(let k=0;k<R.count;k++){let F=k*y;f===!0&&(s.fromBufferAttribute(R,k),w[L+F+0]=s.x,w[L+F+1]=s.y,w[L+F+2]=s.z,w[L+F+3]=0),g===!0&&(s.fromBufferAttribute(G,k),w[L+F+4]=s.x,w[L+F+5]=s.y,w[L+F+6]=s.z,w[L+F+7]=0),x===!0&&(s.fromBufferAttribute(B,k),w[L+F+8]=s.x,w[L+F+9]=s.y,w[L+F+10]=s.z,w[L+F+11]=B.itemSize===4?s.w:1)}}d={count:u,texture:P,size:new re(b,C)},n.set(o,d),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function U_(i,e,t,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}function O_(i,e,t,n,s){let r=new sn(e,t,{type:i,depthBuffer:n,stencilBuffer:s}),a=new sn(e,t,{type:qn,depthBuffer:!1,stencilBuffer:!1}),o=new Et;o.setAttribute("position",new mt([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new mt([0,2,0,0,2,0],2));let l=new Oo({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),c=new lt(o,l),h=new Pi(-1,1,1,-1,0,1),u=null,d=null,f=!1,g,x=null,m=[],p=!1;this.setSize=function(v,M){r.setSize(v,M),a.setSize(v,M);for(let b=0;b<m.length;b++){let C=m[b];C.setSize&&C.setSize(v,M)}},this.setEffects=function(v){m=v,p=m.length>0&&m[0].isRenderPass===!0;let M=r.width,b=r.height;for(let C=0;C<m.length;C++){let w=m[C];w.setSize&&w.setSize(M,b)}},this.begin=function(v,M){if(f||v.toneMapping===Cn&&m.length===0)return!1;if(x=M,M!==null){let b=M.width,C=M.height;(r.width!==b||r.height!==C)&&this.setSize(b,C)}return p===!1&&v.setRenderTarget(r),g=v.toneMapping,v.toneMapping=Cn,!0},this.hasRenderPass=function(){return p},this.end=function(v,M){v.toneMapping=g,f=!0;let b=r,C=a;for(let w=0;w<m.length;w++){let P=m[w];if(P.enabled!==!1&&(P.render(v,C,b,M),P.needsSwap!==!1)){let y=b;b=C,C=y}}if(u!==v.outputColorSpace||d!==v.toneMapping){u=v.outputColorSpace,d=v.toneMapping,l.defines={},et.getTransfer(u)===nt&&(l.defines.SRGB_TRANSFER="");let w=F_[d];w&&(l.defines[w]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=b.texture,v.setRenderTarget(x),v.render(c,h),x=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}function ur(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=ff[s];if(r===void 0&&(r=new Float32Array(s),ff[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Ct(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Rt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function $l(i,e){let t=pf[e];t===void 0&&(t=new Int32Array(e),pf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function B_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function z_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;i.uniform2fv(this.addr,e),Rt(t,e)}}function k_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ct(t,e))return;i.uniform3fv(this.addr,e),Rt(t,e)}}function V_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;i.uniform4fv(this.addr,e),Rt(t,e)}}function H_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Rt(t,e)}else{if(Ct(t,n))return;_f.set(n),i.uniformMatrix2fv(this.addr,!1,_f),Rt(t,n)}}function G_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Rt(t,e)}else{if(Ct(t,n))return;gf.set(n),i.uniformMatrix3fv(this.addr,!1,gf),Rt(t,n)}}function W_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Rt(t,e)}else{if(Ct(t,n))return;mf.set(n),i.uniformMatrix4fv(this.addr,!1,mf),Rt(t,n)}}function X_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function q_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;i.uniform2iv(this.addr,e),Rt(t,e)}}function $_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;i.uniform3iv(this.addr,e),Rt(t,e)}}function Y_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;i.uniform4iv(this.addr,e),Rt(t,e)}}function Z_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function K_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;i.uniform2uiv(this.addr,e),Rt(t,e)}}function j_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;i.uniform3uiv(this.addr,e),Rt(t,e)}}function J_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;i.uniform4uiv(this.addr,e),Rt(t,e)}}function Q_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Rh.compareFunction=t.isReversedDepthBuffer()?Vl:kl,r=Rh):r=Pf,t.setTexture2D(e||r,s)}function ex(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Df,s)}function tx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Nf,s)}function nx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Lf,s)}function ix(i){switch(i){case 5126:return B_;case 35664:return z_;case 35665:return k_;case 35666:return V_;case 35674:return H_;case 35675:return G_;case 35676:return W_;case 5124:case 35670:return X_;case 35667:case 35671:return q_;case 35668:case 35672:return $_;case 35669:case 35673:return Y_;case 5125:return Z_;case 36294:return K_;case 36295:return j_;case 36296:return J_;case 35678:case 36198:case 36298:case 36306:case 35682:return Q_;case 35679:case 36299:case 36307:return ex;case 35680:case 36300:case 36308:case 36293:return tx;case 36289:case 36303:case 36311:case 36292:return nx}}function sx(i,e){i.uniform1fv(this.addr,e)}function rx(i,e){let t=ur(e,this.size,2);i.uniform2fv(this.addr,t)}function ax(i,e){let t=ur(e,this.size,3);i.uniform3fv(this.addr,t)}function ox(i,e){let t=ur(e,this.size,4);i.uniform4fv(this.addr,t)}function lx(i,e){let t=ur(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function cx(i,e){let t=ur(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function hx(i,e){let t=ur(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function ux(i,e){i.uniform1iv(this.addr,e)}function dx(i,e){i.uniform2iv(this.addr,e)}function fx(i,e){i.uniform3iv(this.addr,e)}function px(i,e){i.uniform4iv(this.addr,e)}function mx(i,e){i.uniform1uiv(this.addr,e)}function gx(i,e){i.uniform2uiv(this.addr,e)}function _x(i,e){i.uniform3uiv(this.addr,e)}function xx(i,e){i.uniform4uiv(this.addr,e)}function yx(i,e,t){let n=this.cache,s=e.length,r=$l(t,s);Ct(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Rh:a=Pf;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function vx(i,e,t){let n=this.cache,s=e.length,r=$l(t,s);Ct(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Df,r[a])}function bx(i,e,t){let n=this.cache,s=e.length,r=$l(t,s);Ct(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Nf,r[a])}function Mx(i,e,t){let n=this.cache,s=e.length,r=$l(t,s);Ct(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Lf,r[a])}function Sx(i){switch(i){case 5126:return sx;case 35664:return rx;case 35665:return ax;case 35666:return ox;case 35674:return lx;case 35675:return cx;case 35676:return hx;case 5124:case 35670:return ux;case 35667:case 35671:return dx;case 35668:case 35672:return fx;case 35669:case 35673:return px;case 5125:return mx;case 36294:return gx;case 36295:return _x;case 36296:return xx;case 35678:case 36198:case 36298:case 36306:case 35682:return yx;case 35679:case 36299:case 36307:return vx;case 35680:case 36300:case 36308:case 36293:return bx;case 36289:case 36303:case 36311:case 36292:return Mx}}function xf(i,e){i.seq.push(e),i.map[e.id]=e}function Tx(i,e,t){let n=i.name,s=n.length;for(wh.lastIndex=0;;){let r=wh.exec(n),a=wh.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){xf(t,c===void 0?new Ih(o,i,e):new Ph(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Lh(o),xf(t,u)),t=u}}}function yf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}function wx(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function Cx(i){et._getMatrix(vf,et.workingColorSpace,i);let e=`mat3( ${vf.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(i)){case Ur:return[e,"LinearTransferOETF"];case nt:return[e,"sRGBTransferOETF"];default:return Ne("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function bf(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+wx(i.getShaderSource(e),o)}else return r}function Rx(i,e){let t=Cx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Px(i,e){let t=Ix[e];return t===void 0?(Ne("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Lx(){et.getLuminanceCoefficients(Gl);let i=Gl.x.toFixed(4),e=Gl.y.toFixed(4),t=Gl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Dx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ea).join(`
`)}function Nx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Ux(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ea(i){return i!==""}function Mf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Sf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function Dh(i){return i.replace(Fx,Bx)}function Bx(i,e){let t=Ze[e];if(t===void 0){let n=Ox.get(e);if(n!==void 0)t=Ze[n],Ne('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Dh(t)}function Tf(i){return i.replace(zx,kx)}function kx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ef(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Hx(i){return Vx[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}function Wx(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Gx[i.envMapMode]||"ENVMAP_TYPE_CUBE"}function qx(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Xx[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}function Yx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":$x[i.combine]||"ENVMAP_BLENDING_NONE"}function Zx(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Kx(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Hx(t),c=Wx(t),h=qx(t),u=Yx(t),d=Zx(t),f=Dx(t),g=Nx(r),x=s.createProgram(),m,p,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ea).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ea).join(`
`),p.length>0&&(p+=`
`)):(m=[Ef(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ea).join(`
`),p=[Ef(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Cn?"#define TONE_MAPPING":"",t.toneMapping!==Cn?Ze.tonemapping_pars_fragment:"",t.toneMapping!==Cn?Px("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,Rx("linearToOutputTexel",t.outputColorSpace),Lx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ea).join(`
`)),a=Dh(a),a=Mf(a,t),a=Sf(a,t),o=Dh(o),o=Mf(o,t),o=Sf(o,t),a=Tf(a),o=Tf(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===mh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===mh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let M=v+m+a,b=v+p+o,C=yf(s,s.VERTEX_SHADER,M),w=yf(s,s.FRAGMENT_SHADER,b);s.attachShader(x,C),s.attachShader(x,w),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function P(R){if(i.debug.checkShaderErrors){let G=s.getProgramInfoLog(x)||"",B=s.getShaderInfoLog(C)||"",L=s.getShaderInfoLog(w)||"",k=G.trim(),F=B.trim(),U=L.trim(),ie=!0,Y=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(ie=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,C,w);else{let le=bf(s,C,"vertex"),he=bf(s,w,"fragment");Ge("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+k+`
`+le+`
`+he)}else k!==""?Ne("WebGLProgram: Program Info Log:",k):(F===""||U==="")&&(Y=!1);Y&&(R.diagnostics={runnable:ie,programLog:k,vertexShader:{log:F,prefix:m},fragmentShader:{log:U,prefix:p}})}s.deleteShader(C),s.deleteShader(w),y=new cr(s,x),T=Ux(s,x)}let y;this.getUniforms=function(){return y===void 0&&P(this),y};let T;this.getAttributes=function(){return T===void 0&&P(this),T};let H=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return H===!1&&(H=s.getProgramParameter(x,Ex)),H},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ax++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=C,this.fragmentShader=w,this}function Jx(i,e,t,n,s,r){let a=new zr,o=new Nh,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return l.add(y),y===0?"uv":`uv${y}`}function x(y,T,H,R,G){let B=R.fog,L=G.geometry,k=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?R.environment:null,F=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,U=e.get(y.envMap||k,F),ie=U&&U.mapping===_a?U.image.height:null,Y=f[y.type];y.precision!==null&&(d=n.getMaxPrecision(y.precision),d!==y.precision&&Ne("WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));let le=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,he=le!==void 0?le.length:0,ae=0;L.morphAttributes.position!==void 0&&(ae=1),L.morphAttributes.normal!==void 0&&(ae=2),L.morphAttributes.color!==void 0&&(ae=3);let Me,j,J,O;if(Y){let it=Yn[Y];Me=it.vertexShader,j=it.fragmentShader}else Me=y.vertexShader,j=y.fragmentShader,o.update(y),J=o.getVertexShaderID(y),O=o.getFragmentShaderID(y);let Q=i.getRenderTarget(),q=i.state.buffers.depth.getReversed(),ve=G.isInstancedMesh===!0,Ce=G.isBatchedMesh===!0,Se=!!y.map,Ke=!!y.matcap,Be=!!U,ee=!!y.aoMap,se=!!y.lightMap,te=!!y.bumpMap,ge=!!y.normalMap,A=!!y.displacementMap,ze=!!y.emissiveMap,be=!!y.metalnessMap,Ve=!!y.roughnessMap,fe=y.anisotropy>0,E=y.clearcoat>0,_=y.dispersion>0,N=y.iridescence>0,$=y.sheen>0,ne=y.transmission>0,Z=fe&&!!y.anisotropyMap,we=E&&!!y.clearcoatMap,pe=E&&!!y.clearcoatNormalMap,Fe=E&&!!y.clearcoatRoughnessMap,He=N&&!!y.iridescenceMap,oe=N&&!!y.iridescenceThicknessMap,ue=$&&!!y.sheenColorMap,Re=$&&!!y.sheenRoughnessMap,Pe=!!y.specularMap,Te=!!y.specularColorMap,je=!!y.specularIntensityMap,D=ne&&!!y.transmissionMap,me=ne&&!!y.thicknessMap,de=!!y.gradientMap,Ae=!!y.alphaMap,ce=y.alphaTest>0,K=!!y.alphaHash,Ie=!!y.extensions,We=Cn;y.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(We=i.toneMapping);let dt={shaderID:Y,shaderType:y.type,shaderName:y.name,vertexShader:Me,fragmentShader:j,defines:y.defines,customVertexShaderID:J,customFragmentShaderID:O,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Ce,batchingColor:Ce&&G._colorsTexture!==null,instancing:ve,instancingColor:ve&&G.instanceColor!==null,instancingMorph:ve&&G.morphTexture!==null,outputColorSpace:Q===null?i.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Ot,alphaToCoverage:!!y.alphaToCoverage,map:Se,matcap:Ke,envMap:Be,envMapMode:Be&&U.mapping,envMapCubeUVHeight:ie,aoMap:ee,lightMap:se,bumpMap:te,normalMap:ge,displacementMap:A,emissiveMap:ze,normalMapObjectSpace:ge&&y.normalMapType===Hd,normalMapTangentSpace:ge&&y.normalMapType===zl,metalnessMap:be,roughnessMap:Ve,anisotropy:fe,anisotropyMap:Z,clearcoat:E,clearcoatMap:we,clearcoatNormalMap:pe,clearcoatRoughnessMap:Fe,dispersion:_,iridescence:N,iridescenceMap:He,iridescenceThicknessMap:oe,sheen:$,sheenColorMap:ue,sheenRoughnessMap:Re,specularMap:Pe,specularColorMap:Te,specularIntensityMap:je,transmission:ne,transmissionMap:D,thicknessMap:me,gradientMap:de,opaque:y.transparent===!1&&y.blending===Ki&&y.alphaToCoverage===!1,alphaMap:Ae,alphaTest:ce,alphaHash:K,combine:y.combine,mapUv:Se&&g(y.map.channel),aoMapUv:ee&&g(y.aoMap.channel),lightMapUv:se&&g(y.lightMap.channel),bumpMapUv:te&&g(y.bumpMap.channel),normalMapUv:ge&&g(y.normalMap.channel),displacementMapUv:A&&g(y.displacementMap.channel),emissiveMapUv:ze&&g(y.emissiveMap.channel),metalnessMapUv:be&&g(y.metalnessMap.channel),roughnessMapUv:Ve&&g(y.roughnessMap.channel),anisotropyMapUv:Z&&g(y.anisotropyMap.channel),clearcoatMapUv:we&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:pe&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Fe&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:He&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:Re&&g(y.sheenRoughnessMap.channel),specularMapUv:Pe&&g(y.specularMap.channel),specularColorMapUv:Te&&g(y.specularColorMap.channel),specularIntensityMapUv:je&&g(y.specularIntensityMap.channel),transmissionMapUv:D&&g(y.transmissionMap.channel),thicknessMapUv:me&&g(y.thicknessMap.channel),alphaMapUv:Ae&&g(y.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(ge||fe),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!L.attributes.uv&&(Se||Ae),fog:!!B,useFog:y.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||L.attributes.normal===void 0&&ge===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:q,skinning:G.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:ae,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&H.length>0,shadowMapType:i.shadowMap.type,toneMapping:We,decodeVideoTexture:Se&&y.map.isVideoTexture===!0&&et.getTransfer(y.map.colorSpace)===nt,decodeVideoTextureEmissive:ze&&y.emissiveMap.isVideoTexture===!0&&et.getTransfer(y.emissiveMap.colorSpace)===nt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===jt,flipSided:y.side===zt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Ie&&y.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ie&&y.extensions.multiDraw===!0||Ce)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return dt.vertexUv1s=l.has(1),dt.vertexUv2s=l.has(2),dt.vertexUv3s=l.has(3),l.clear(),dt}function m(y){let T=[];if(y.shaderID?T.push(y.shaderID):(T.push(y.customVertexShaderID),T.push(y.customFragmentShaderID)),y.defines!==void 0)for(let H in y.defines)T.push(H),T.push(y.defines[H]);return y.isRawShaderMaterial===!1&&(p(T,y),v(T,y),T.push(i.outputColorSpace)),T.push(y.customProgramCacheKey),T.join()}function p(y,T){y.push(T.precision),y.push(T.outputColorSpace),y.push(T.envMapMode),y.push(T.envMapCubeUVHeight),y.push(T.mapUv),y.push(T.alphaMapUv),y.push(T.lightMapUv),y.push(T.aoMapUv),y.push(T.bumpMapUv),y.push(T.normalMapUv),y.push(T.displacementMapUv),y.push(T.emissiveMapUv),y.push(T.metalnessMapUv),y.push(T.roughnessMapUv),y.push(T.anisotropyMapUv),y.push(T.clearcoatMapUv),y.push(T.clearcoatNormalMapUv),y.push(T.clearcoatRoughnessMapUv),y.push(T.iridescenceMapUv),y.push(T.iridescenceThicknessMapUv),y.push(T.sheenColorMapUv),y.push(T.sheenRoughnessMapUv),y.push(T.specularMapUv),y.push(T.specularColorMapUv),y.push(T.specularIntensityMapUv),y.push(T.transmissionMapUv),y.push(T.thicknessMapUv),y.push(T.combine),y.push(T.fogExp2),y.push(T.sizeAttenuation),y.push(T.morphTargetsCount),y.push(T.morphAttributeCount),y.push(T.numDirLights),y.push(T.numPointLights),y.push(T.numSpotLights),y.push(T.numSpotLightMaps),y.push(T.numHemiLights),y.push(T.numRectAreaLights),y.push(T.numDirLightShadows),y.push(T.numPointLightShadows),y.push(T.numSpotLightShadows),y.push(T.numSpotLightShadowsWithMaps),y.push(T.numLightProbes),y.push(T.shadowMapType),y.push(T.toneMapping),y.push(T.numClippingPlanes),y.push(T.numClipIntersection),y.push(T.depthPacking)}function v(y,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),y.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),y.push(a.mask)}function M(y){let T=f[y.type],H;if(T){let R=Yn[T];H=rf.clone(R.uniforms)}else H=y.uniforms;return H}function b(y,T){let H=h.get(T);return H!==void 0?++H.usedTimes:(H=new Kx(i,T,y,s),c.push(H),h.set(T,H)),H}function C(y){if(--y.usedTimes===0){let T=c.indexOf(y);c[T]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function w(y){o.remove(y)}function P(){o.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:M,acquireProgram:b,releaseProgram:C,releaseShaderCache:w,programs:c,dispose:P}}function Qx(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function ey(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Af(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function wf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,g,x,m,p){let v=i[e];return v===void 0?(v={id:d.id,object:d,geometry:f,material:g,materialVariant:a(d),groupOrder:x,renderOrder:d.renderOrder,z:m,group:p},i[e]=v):(v.id=d.id,v.object=d,v.geometry=f,v.material=g,v.materialVariant=a(d),v.groupOrder=x,v.renderOrder=d.renderOrder,v.z=m,v.group=p),e++,v}function l(d,f,g,x,m,p){let v=o(d,f,g,x,m,p);g.transmission>0?n.push(v):g.transparent===!0?s.push(v):t.push(v)}function c(d,f,g,x,m,p){let v=o(d,f,g,x,m,p);g.transmission>0?n.unshift(v):g.transparent===!0?s.unshift(v):t.unshift(v)}function h(d,f){t.length>1&&t.sort(d||ey),n.length>1&&n.sort(f||Af),s.length>1&&s.sort(f||Af)}function u(){for(let d=e,f=i.length;d<f;d++){let g=i[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function ty(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new wf,i.set(n,[a])):s>=r.length?(a=new wf,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function ny(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new ke};break;case"SpotLight":t={position:new I,direction:new I,color:new ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new ke,groundColor:new ke};break;case"RectAreaLight":t={color:new ke,position:new I,halfWidth:new I,halfHeight:new I};break}return i[e.id]=t,t}}}function iy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}function ry(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function ay(i){let e=new ny,t=iy(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);let s=new I,r=new qe,a=new qe;function o(c){let h=0,u=0,d=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let f=0,g=0,x=0,m=0,p=0,v=0,M=0,b=0,C=0,w=0,P=0;c.sort(ry);for(let T=0,H=c.length;T<H;T++){let R=c[T],G=R.color,B=R.intensity,L=R.distance,k=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===us?k=R.shadow.map.texture:k=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=G.r*B,u+=G.g*B,d+=G.b*B;else if(R.isLightProbe){for(let F=0;F<9;F++)n.probe[F].addScaledVector(R.sh.coefficients[F],B);P++}else if(R.isDirectionalLight){let F=e.get(R);if(F.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let U=R.shadow,ie=t.get(R);ie.shadowIntensity=U.intensity,ie.shadowBias=U.bias,ie.shadowNormalBias=U.normalBias,ie.shadowRadius=U.radius,ie.shadowMapSize=U.mapSize,n.directionalShadow[f]=ie,n.directionalShadowMap[f]=k,n.directionalShadowMatrix[f]=R.shadow.matrix,v++}n.directional[f]=F,f++}else if(R.isSpotLight){let F=e.get(R);F.position.setFromMatrixPosition(R.matrixWorld),F.color.copy(G).multiplyScalar(B),F.distance=L,F.coneCos=Math.cos(R.angle),F.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),F.decay=R.decay,n.spot[x]=F;let U=R.shadow;if(R.map&&(n.spotLightMap[C]=R.map,C++,U.updateMatrices(R),R.castShadow&&w++),n.spotLightMatrix[x]=U.matrix,R.castShadow){let ie=t.get(R);ie.shadowIntensity=U.intensity,ie.shadowBias=U.bias,ie.shadowNormalBias=U.normalBias,ie.shadowRadius=U.radius,ie.shadowMapSize=U.mapSize,n.spotShadow[x]=ie,n.spotShadowMap[x]=k,b++}x++}else if(R.isRectAreaLight){let F=e.get(R);F.color.copy(G).multiplyScalar(B),F.halfWidth.set(R.width*.5,0,0),F.halfHeight.set(0,R.height*.5,0),n.rectArea[m]=F,m++}else if(R.isPointLight){let F=e.get(R);if(F.color.copy(R.color).multiplyScalar(R.intensity),F.distance=R.distance,F.decay=R.decay,R.castShadow){let U=R.shadow,ie=t.get(R);ie.shadowIntensity=U.intensity,ie.shadowBias=U.bias,ie.shadowNormalBias=U.normalBias,ie.shadowRadius=U.radius,ie.shadowMapSize=U.mapSize,ie.shadowCameraNear=U.camera.near,ie.shadowCameraFar=U.camera.far,n.pointShadow[g]=ie,n.pointShadowMap[g]=k,n.pointShadowMatrix[g]=R.shadow.matrix,M++}n.point[g]=F,g++}else if(R.isHemisphereLight){let F=e.get(R);F.skyColor.copy(R.color).multiplyScalar(B),F.groundColor.copy(R.groundColor).multiplyScalar(B),n.hemi[p]=F,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let y=n.hash;(y.directionalLength!==f||y.pointLength!==g||y.spotLength!==x||y.rectAreaLength!==m||y.hemiLength!==p||y.numDirectionalShadows!==v||y.numPointShadows!==M||y.numSpotShadows!==b||y.numSpotMaps!==C||y.numLightProbes!==P)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=b+C-w,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=P,y.directionalLength=f,y.pointLength=g,y.spotLength=x,y.rectAreaLength=m,y.hemiLength=p,y.numDirectionalShadows=v,y.numPointShadows=M,y.numSpotShadows=b,y.numSpotMaps=C,y.numLightProbes=P,n.version=sy++)}function l(c,h){let u=0,d=0,f=0,g=0,x=0,m=h.matrixWorldInverse;for(let p=0,v=c.length;p<v;p++){let M=c[p];if(M.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),u++}else if(M.isSpotLight){let b=n.spot[f];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),f++}else if(M.isRectAreaLight){let b=n.rectArea[g];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),a.identity(),r.copy(M.matrixWorld),r.premultiply(m),a.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){let b=n.point[d];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){let b=n.hemi[x];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(m),x++}}}return{setup:o,setupView:l,state:n}}function Cf(i){let e=new ay(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function oy(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Cf(i),e.set(s,[o])):r>=a.length?(o=new Cf(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}function dy(i,e,t){let n=new Zs,s=new re,r=new re,a=new ft,o=new Bo,l=new zo,c={},h=t.maxTextureSize,u={[Tn]:zt,[zt]:Tn,[jt]:jt},d=new an({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new re},radius:{value:4}},vertexShader:ly,fragmentShader:cy}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new Et;g.setAttribute("position",new Tt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new lt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ma;let p=this.type;this.render=function(w,P,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;this.type===Zo&&(Ne("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=ma);let T=i.getRenderTarget(),H=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),G=i.state;G.setBlending(Xn),G.buffers.depth.getReversed()===!0?G.buffers.color.setClear(0,0,0,0):G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);let B=p!==this.type;B&&P.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(k=>k.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,k=w.length;L<k;L++){let F=w[L],U=F.shadow;if(U===void 0){Ne("WebGLShadowMap:",F,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;s.copy(U.mapSize);let ie=U.getFrameExtents();s.multiply(ie),r.copy(U.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ie.x),s.x=r.x*ie.x,U.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ie.y),s.y=r.y*ie.y,U.mapSize.y=r.y));let Y=i.state.buffers.depth.getReversed();if(U.camera._reversedDepth=Y,U.map===null||B===!0){if(U.map!==null&&(U.map.depthTexture!==null&&(U.map.depthTexture.dispose(),U.map.depthTexture=null),U.map.dispose()),this.type===ir){if(F.isPointLight){Ne("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}U.map=new sn(s.x,s.y,{format:us,type:qn,minFilter:vt,magFilter:vt,generateMipmaps:!1}),U.map.texture.name=F.name+".shadowMap",U.map.depthTexture=new Ri(s.x,s.y,on),U.map.depthTexture.name=F.name+".shadowMapDepth",U.map.depthTexture.format=On,U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=yt,U.map.depthTexture.magFilter=yt}else F.isPointLight?(U.map=new Wl(s.x),U.map.depthTexture=new Po(s.x,In)):(U.map=new sn(s.x,s.y),U.map.depthTexture=new Ri(s.x,s.y,In)),U.map.depthTexture.name=F.name+".shadowMap",U.map.depthTexture.format=On,this.type===ma?(U.map.depthTexture.compareFunction=Y?Vl:kl,U.map.depthTexture.minFilter=vt,U.map.depthTexture.magFilter=vt):(U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=yt,U.map.depthTexture.magFilter=yt);U.camera.updateProjectionMatrix()}let le=U.map.isWebGLCubeRenderTarget?6:1;for(let he=0;he<le;he++){if(U.map.isWebGLCubeRenderTarget)i.setRenderTarget(U.map,he),i.clear();else{he===0&&(i.setRenderTarget(U.map),i.clear());let ae=U.getViewport(he);a.set(r.x*ae.x,r.y*ae.y,r.x*ae.z,r.y*ae.w),G.viewport(a)}if(F.isPointLight){let ae=U.camera,Me=U.matrix,j=F.distance||ae.far;j!==ae.far&&(ae.far=j,ae.updateProjectionMatrix()),Ta.setFromMatrixPosition(F.matrixWorld),ae.position.copy(Ta),Ch.copy(ae.position),Ch.add(hy[he]),ae.up.copy(uy[he]),ae.lookAt(Ch),ae.updateMatrixWorld(),Me.makeTranslation(-Ta.x,-Ta.y,-Ta.z),Rf.multiplyMatrices(ae.projectionMatrix,ae.matrixWorldInverse),U._frustum.setFromProjectionMatrix(Rf,ae.coordinateSystem,ae.reversedDepth)}else U.updateMatrices(F);n=U.getFrustum(),b(P,y,U.camera,F,this.type)}U.isPointLightShadow!==!0&&this.type===ir&&v(U,y),U.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(T,H,R)};function v(w,P){let y=e.update(x);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new sn(s.x,s.y,{format:us,type:qn})),d.uniforms.shadow_pass.value=w.map.depthTexture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(P,null,y,d,x,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(P,null,y,f,x,null)}function M(w,P,y,T){let H=null,R=y.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(R!==void 0)H=R;else if(H=y.isPointLight===!0?l:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let G=H.uuid,B=P.uuid,L=c[G];L===void 0&&(L={},c[G]=L);let k=L[B];k===void 0&&(k=H.clone(),L[B]=k,P.addEventListener("dispose",C)),H=k}if(H.visible=P.visible,H.wireframe=P.wireframe,T===ir?H.side=P.shadowSide!==null?P.shadowSide:P.side:H.side=P.shadowSide!==null?P.shadowSide:u[P.side],H.alphaMap=P.alphaMap,H.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,H.map=P.map,H.clipShadows=P.clipShadows,H.clippingPlanes=P.clippingPlanes,H.clipIntersection=P.clipIntersection,H.displacementMap=P.displacementMap,H.displacementScale=P.displacementScale,H.displacementBias=P.displacementBias,H.wireframeLinewidth=P.wireframeLinewidth,H.linewidth=P.linewidth,y.isPointLight===!0&&H.isMeshDistanceMaterial===!0){let G=i.properties.get(H);G.light=y}return H}function b(w,P,y,T,H){if(w.visible===!1)return;if(w.layers.test(P.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&H===ir)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,w.matrixWorld);let B=e.update(w),L=w.material;if(Array.isArray(L)){let k=B.groups;for(let F=0,U=k.length;F<U;F++){let ie=k[F],Y=L[ie.materialIndex];if(Y&&Y.visible){let le=M(w,Y,T,H);w.onBeforeShadow(i,w,P,y,B,le,ie),i.renderBufferDirect(y,null,B,le,w,ie),w.onAfterShadow(i,w,P,y,B,le,ie)}}}else if(L.visible){let k=M(w,L,T,H);w.onBeforeShadow(i,w,P,y,B,k,null),i.renderBufferDirect(y,null,B,k,w,null),w.onAfterShadow(i,w,P,y,B,k,null)}}let G=w.children;for(let B=0,L=G.length;B<L;B++)b(G[B],P,y,T,H)}function C(w){w.target.removeEventListener("dispose",C);for(let y in c){let T=c[y],H=w.target.uuid;H in T&&(T[H].dispose(),delete T[H])}}}function fy(i,e){function t(){let D=!1,me=new ft,de=null,Ae=new ft(0,0,0,0);return{setMask:function(ce){de!==ce&&!D&&(i.colorMask(ce,ce,ce,ce),de=ce)},setLocked:function(ce){D=ce},setClear:function(ce,K,Ie,We,dt){dt===!0&&(ce*=We,K*=We,Ie*=We),me.set(ce,K,Ie,We),Ae.equals(me)===!1&&(i.clearColor(ce,K,Ie,We),Ae.copy(me))},reset:function(){D=!1,de=null,Ae.set(-1,0,0,0)}}}function n(){let D=!1,me=!1,de=null,Ae=null,ce=null;return{setReversed:function(K){if(me!==K){let Ie=e.get("EXT_clip_control");K?Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.ZERO_TO_ONE_EXT):Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.NEGATIVE_ONE_TO_ONE_EXT),me=K;let We=ce;ce=null,this.setClear(We)}},getReversed:function(){return me},setTest:function(K){K?Q(i.DEPTH_TEST):q(i.DEPTH_TEST)},setMask:function(K){de!==K&&!D&&(i.depthMask(K),de=K)},setFunc:function(K){if(me&&(K=Jd[K]),Ae!==K){switch(K){case xo:i.depthFunc(i.NEVER);break;case yo:i.depthFunc(i.ALWAYS);break;case vo:i.depthFunc(i.LESS);break;case ji:i.depthFunc(i.LEQUAL);break;case bo:i.depthFunc(i.EQUAL);break;case Mo:i.depthFunc(i.GEQUAL);break;case So:i.depthFunc(i.GREATER);break;case To:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ae=K}},setLocked:function(K){D=K},setClear:function(K){ce!==K&&(ce=K,me&&(K=1-K),i.clearDepth(K))},reset:function(){D=!1,de=null,Ae=null,ce=null,me=!1}}}function s(){let D=!1,me=null,de=null,Ae=null,ce=null,K=null,Ie=null,We=null,dt=null;return{setTest:function(it){D||(it?Q(i.STENCIL_TEST):q(i.STENCIL_TEST))},setMask:function(it){me!==it&&!D&&(i.stencilMask(it),me=it)},setFunc:function(it,jn,Jn){(de!==it||Ae!==jn||ce!==Jn)&&(i.stencilFunc(it,jn,Jn),de=it,Ae=jn,ce=Jn)},setOp:function(it,jn,Jn){(K!==it||Ie!==jn||We!==Jn)&&(i.stencilOp(it,jn,Jn),K=it,Ie=jn,We=Jn)},setLocked:function(it){D=it},setClear:function(it){dt!==it&&(i.clearStencil(it),dt=it)},reset:function(){D=!1,me=null,de=null,Ae=null,ce=null,K=null,Ie=null,We=null,dt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],g=null,x=!1,m=null,p=null,v=null,M=null,b=null,C=null,w=null,P=new ke(0,0,0),y=0,T=!1,H=null,R=null,G=null,B=null,L=null,k=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),F=!1,U=0,ie=i.getParameter(i.VERSION);ie.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(ie)[1]),F=U>=1):ie.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),F=U>=2);let Y=null,le={},he=i.getParameter(i.SCISSOR_BOX),ae=i.getParameter(i.VIEWPORT),Me=new ft().fromArray(he),j=new ft().fromArray(ae);function J(D,me,de,Ae){let ce=new Uint8Array(4),K=i.createTexture();i.bindTexture(D,K),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ie=0;Ie<de;Ie++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(me,0,i.RGBA,1,1,Ae,0,i.RGBA,i.UNSIGNED_BYTE,ce):i.texImage2D(me+Ie,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ce);return K}let O={};O[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),O[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),O[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),O[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Q(i.DEPTH_TEST),a.setFunc(ji),te(!1),ge(jc),Q(i.CULL_FACE),ee(Xn);function Q(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function q(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function ve(D,me){return u[D]!==me?(i.bindFramebuffer(D,me),u[D]=me,D===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=me),D===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=me),!0):!1}function Ce(D,me){let de=f,Ae=!1;if(D){de=d.get(me),de===void 0&&(de=[],d.set(me,de));let ce=D.textures;if(de.length!==ce.length||de[0]!==i.COLOR_ATTACHMENT0){for(let K=0,Ie=ce.length;K<Ie;K++)de[K]=i.COLOR_ATTACHMENT0+K;de.length=ce.length,Ae=!0}}else de[0]!==i.BACK&&(de[0]=i.BACK,Ae=!0);Ae&&i.drawBuffers(de)}function Se(D){return g!==D?(i.useProgram(D),g=D,!0):!1}let Ke={[Ai]:i.FUNC_ADD,[vd]:i.FUNC_SUBTRACT,[bd]:i.FUNC_REVERSE_SUBTRACT};Ke[Md]=i.MIN,Ke[Sd]=i.MAX;let Be={[Td]:i.ZERO,[Ed]:i.ONE,[Ad]:i.SRC_COLOR,[go]:i.SRC_ALPHA,[Ld]:i.SRC_ALPHA_SATURATE,[Id]:i.DST_COLOR,[Cd]:i.DST_ALPHA,[wd]:i.ONE_MINUS_SRC_COLOR,[_o]:i.ONE_MINUS_SRC_ALPHA,[Pd]:i.ONE_MINUS_DST_COLOR,[Rd]:i.ONE_MINUS_DST_ALPHA,[Dd]:i.CONSTANT_COLOR,[Nd]:i.ONE_MINUS_CONSTANT_COLOR,[Ud]:i.CONSTANT_ALPHA,[Fd]:i.ONE_MINUS_CONSTANT_ALPHA};function ee(D,me,de,Ae,ce,K,Ie,We,dt,it){if(D===Xn){x===!0&&(q(i.BLEND),x=!1);return}if(x===!1&&(Q(i.BLEND),x=!0),D!==yd){if(D!==m||it!==T){if((p!==Ai||b!==Ai)&&(i.blendEquation(i.FUNC_ADD),p=Ai,b=Ai),it)switch(D){case Ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Jc:i.blendFunc(i.ONE,i.ONE);break;case Qc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case eh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ge("WebGLState: Invalid blending: ",D);break}else switch(D){case Ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Jc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Qc:Ge("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case eh:Ge("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ge("WebGLState: Invalid blending: ",D);break}v=null,M=null,C=null,w=null,P.set(0,0,0),y=0,m=D,T=it}return}ce=ce||me,K=K||de,Ie=Ie||Ae,(me!==p||ce!==b)&&(i.blendEquationSeparate(Ke[me],Ke[ce]),p=me,b=ce),(de!==v||Ae!==M||K!==C||Ie!==w)&&(i.blendFuncSeparate(Be[de],Be[Ae],Be[K],Be[Ie]),v=de,M=Ae,C=K,w=Ie),(We.equals(P)===!1||dt!==y)&&(i.blendColor(We.r,We.g,We.b,dt),P.copy(We),y=dt),m=D,T=!1}function se(D,me){D.side===jt?q(i.CULL_FACE):Q(i.CULL_FACE);let de=D.side===zt;me&&(de=!de),te(de),D.blending===Ki&&D.transparent===!1?ee(Xn):ee(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);let Ae=D.stencilWrite;o.setTest(Ae),Ae&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ze(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Q(i.SAMPLE_ALPHA_TO_COVERAGE):q(i.SAMPLE_ALPHA_TO_COVERAGE)}function te(D){H!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),H=D)}function ge(D){D!==_d?(Q(i.CULL_FACE),D!==R&&(D===jc?i.cullFace(i.BACK):D===xd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):q(i.CULL_FACE),R=D}function A(D){D!==G&&(F&&i.lineWidth(D),G=D)}function ze(D,me,de){D?(Q(i.POLYGON_OFFSET_FILL),(B!==me||L!==de)&&(B=me,L=de,a.getReversed()&&(me=-me),i.polygonOffset(me,de))):q(i.POLYGON_OFFSET_FILL)}function be(D){D?Q(i.SCISSOR_TEST):q(i.SCISSOR_TEST)}function Ve(D){D===void 0&&(D=i.TEXTURE0+k-1),Y!==D&&(i.activeTexture(D),Y=D)}function fe(D,me,de){de===void 0&&(Y===null?de=i.TEXTURE0+k-1:de=Y);let Ae=le[de];Ae===void 0&&(Ae={type:void 0,texture:void 0},le[de]=Ae),(Ae.type!==D||Ae.texture!==me)&&(Y!==de&&(i.activeTexture(de),Y=de),i.bindTexture(D,me||O[D]),Ae.type=D,Ae.texture=me)}function E(){let D=le[Y];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(D){Ge("WebGLState:",D)}}function N(){try{i.compressedTexImage3D(...arguments)}catch(D){Ge("WebGLState:",D)}}function $(){try{i.texSubImage2D(...arguments)}catch(D){Ge("WebGLState:",D)}}function ne(){try{i.texSubImage3D(...arguments)}catch(D){Ge("WebGLState:",D)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(D){Ge("WebGLState:",D)}}function we(){try{i.compressedTexSubImage3D(...arguments)}catch(D){Ge("WebGLState:",D)}}function pe(){try{i.texStorage2D(...arguments)}catch(D){Ge("WebGLState:",D)}}function Fe(){try{i.texStorage3D(...arguments)}catch(D){Ge("WebGLState:",D)}}function He(){try{i.texImage2D(...arguments)}catch(D){Ge("WebGLState:",D)}}function oe(){try{i.texImage3D(...arguments)}catch(D){Ge("WebGLState:",D)}}function ue(D){Me.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Me.copy(D))}function Re(D){j.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),j.copy(D))}function Pe(D,me){let de=c.get(me);de===void 0&&(de=new WeakMap,c.set(me,de));let Ae=de.get(D);Ae===void 0&&(Ae=i.getUniformBlockIndex(me,D.name),de.set(D,Ae))}function Te(D,me){let Ae=c.get(me).get(D);l.get(me)!==Ae&&(i.uniformBlockBinding(me,Ae,D.__bindingPointIndex),l.set(me,Ae))}function je(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},Y=null,le={},u={},d=new WeakMap,f=[],g=null,x=!1,m=null,p=null,v=null,M=null,b=null,C=null,w=null,P=new ke(0,0,0),y=0,T=!1,H=null,R=null,G=null,B=null,L=null,Me.set(0,0,i.canvas.width,i.canvas.height),j.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Q,disable:q,bindFramebuffer:ve,drawBuffers:Ce,useProgram:Se,setBlending:ee,setMaterial:se,setFlipSided:te,setCullFace:ge,setLineWidth:A,setPolygonOffset:ze,setScissorTest:be,activeTexture:Ve,bindTexture:fe,unbindTexture:E,compressedTexImage2D:_,compressedTexImage3D:N,texImage2D:He,texImage3D:oe,updateUBOMapping:Pe,uniformBlockBinding:Te,texStorage2D:pe,texStorage3D:Fe,texSubImage2D:$,texSubImage3D:ne,compressedTexSubImage2D:Z,compressedTexSubImage3D:we,scissor:ue,viewport:Re,reset:je}}function py(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new re,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,_){return f?new OffscreenCanvas(E,_):Vs("canvas")}function x(E,_,N){let $=1,ne=fe(E);if((ne.width>N||ne.height>N)&&($=N/Math.max(ne.width,ne.height)),$<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let Z=Math.floor($*ne.width),we=Math.floor($*ne.height);u===void 0&&(u=g(Z,we));let pe=_?g(Z,we):u;return pe.width=Z,pe.height=we,pe.getContext("2d").drawImage(E,0,0,Z,we),Ne("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+Z+"x"+we+")."),pe}else return"data"in E&&Ne("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),E;return E}function m(E){return E.generateMipmaps}function p(E){i.generateMipmap(E)}function v(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(E,_,N,$,ne=!1){if(E!==null){if(i[E]!==void 0)return i[E];Ne("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let Z=_;if(_===i.RED&&(N===i.FLOAT&&(Z=i.R32F),N===i.HALF_FLOAT&&(Z=i.R16F),N===i.UNSIGNED_BYTE&&(Z=i.R8)),_===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(Z=i.R8UI),N===i.UNSIGNED_SHORT&&(Z=i.R16UI),N===i.UNSIGNED_INT&&(Z=i.R32UI),N===i.BYTE&&(Z=i.R8I),N===i.SHORT&&(Z=i.R16I),N===i.INT&&(Z=i.R32I)),_===i.RG&&(N===i.FLOAT&&(Z=i.RG32F),N===i.HALF_FLOAT&&(Z=i.RG16F),N===i.UNSIGNED_BYTE&&(Z=i.RG8)),_===i.RG_INTEGER&&(N===i.UNSIGNED_BYTE&&(Z=i.RG8UI),N===i.UNSIGNED_SHORT&&(Z=i.RG16UI),N===i.UNSIGNED_INT&&(Z=i.RG32UI),N===i.BYTE&&(Z=i.RG8I),N===i.SHORT&&(Z=i.RG16I),N===i.INT&&(Z=i.RG32I)),_===i.RGB_INTEGER&&(N===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),N===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),N===i.UNSIGNED_INT&&(Z=i.RGB32UI),N===i.BYTE&&(Z=i.RGB8I),N===i.SHORT&&(Z=i.RGB16I),N===i.INT&&(Z=i.RGB32I)),_===i.RGBA_INTEGER&&(N===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),N===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),N===i.UNSIGNED_INT&&(Z=i.RGBA32UI),N===i.BYTE&&(Z=i.RGBA8I),N===i.SHORT&&(Z=i.RGBA16I),N===i.INT&&(Z=i.RGBA32I)),_===i.RGB&&(N===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),N===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),_===i.RGBA){let we=ne?Ur:et.getTransfer($);N===i.FLOAT&&(Z=i.RGBA32F),N===i.HALF_FLOAT&&(Z=i.RGBA16F),N===i.UNSIGNED_BYTE&&(Z=we===nt?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function b(E,_){let N;return E?_===null||_===In||_===ar?N=i.DEPTH24_STENCIL8:_===on?N=i.DEPTH32F_STENCIL8:_===rr&&(N=i.DEPTH24_STENCIL8,Ne("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===In||_===ar?N=i.DEPTH_COMPONENT24:_===on?N=i.DEPTH_COMPONENT32F:_===rr&&(N=i.DEPTH_COMPONENT16),N}function C(E,_){return m(E)===!0||E.isFramebufferTexture&&E.minFilter!==yt&&E.minFilter!==vt?Math.log2(Math.max(_.width,_.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?_.mipmaps.length:1}function w(E){let _=E.target;_.removeEventListener("dispose",w),y(_),_.isVideoTexture&&h.delete(_)}function P(E){let _=E.target;_.removeEventListener("dispose",P),H(_)}function y(E){let _=n.get(E);if(_.__webglInit===void 0)return;let N=E.source,$=d.get(N);if($){let ne=$[_.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&T(E),Object.keys($).length===0&&d.delete(N)}n.remove(E)}function T(E){let _=n.get(E);i.deleteTexture(_.__webglTexture);let N=E.source,$=d.get(N);delete $[_.__cacheKey],a.memory.textures--}function H(E){let _=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(_.__webglFramebuffer[$]))for(let ne=0;ne<_.__webglFramebuffer[$].length;ne++)i.deleteFramebuffer(_.__webglFramebuffer[$][ne]);else i.deleteFramebuffer(_.__webglFramebuffer[$]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[$])}else{if(Array.isArray(_.__webglFramebuffer))for(let $=0;$<_.__webglFramebuffer.length;$++)i.deleteFramebuffer(_.__webglFramebuffer[$]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let $=0;$<_.__webglColorRenderbuffer.length;$++)_.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[$]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let N=E.textures;for(let $=0,ne=N.length;$<ne;$++){let Z=n.get(N[$]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(N[$])}n.remove(E)}let R=0;function G(){R=0}function B(){let E=R;return E>=s.maxTextures&&Ne("WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),R+=1,E}function L(E){let _=[];return _.push(E.wrapS),_.push(E.wrapT),_.push(E.wrapR||0),_.push(E.magFilter),_.push(E.minFilter),_.push(E.anisotropy),_.push(E.internalFormat),_.push(E.format),_.push(E.type),_.push(E.generateMipmaps),_.push(E.premultiplyAlpha),_.push(E.flipY),_.push(E.unpackAlignment),_.push(E.colorSpace),_.join()}function k(E,_){let N=n.get(E);if(E.isVideoTexture&&be(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&N.__version!==E.version){let $=E.image;if($===null)Ne("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)Ne("WebGLRenderer: Texture marked for update but image is incomplete");else{O(N,E,_);return}}else E.isExternalTexture&&(N.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+_)}function F(E,_){let N=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&N.__version!==E.version){O(N,E,_);return}else E.isExternalTexture&&(N.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+_)}function U(E,_){let N=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&N.__version!==E.version){O(N,E,_);return}t.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+_)}function ie(E,_){let N=n.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&N.__version!==E.version){Q(N,E,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+_)}let Y={[wi]:i.REPEAT,[fn]:i.CLAMP_TO_EDGE,[zs]:i.MIRRORED_REPEAT},le={[yt]:i.NEAREST,[Qo]:i.NEAREST_MIPMAP_NEAREST,[hs]:i.NEAREST_MIPMAP_LINEAR,[vt]:i.LINEAR,[sr]:i.LINEAR_MIPMAP_NEAREST,[Rn]:i.LINEAR_MIPMAP_LINEAR},he={[Gd]:i.NEVER,[Yd]:i.ALWAYS,[Wd]:i.LESS,[kl]:i.LEQUAL,[Xd]:i.EQUAL,[Vl]:i.GEQUAL,[qd]:i.GREATER,[$d]:i.NOTEQUAL};function ae(E,_){if(_.type===on&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===vt||_.magFilter===sr||_.magFilter===hs||_.magFilter===Rn||_.minFilter===vt||_.minFilter===sr||_.minFilter===hs||_.minFilter===Rn)&&Ne("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,Y[_.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,Y[_.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,Y[_.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,le[_.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,le[_.minFilter]),_.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,he[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===yt||_.minFilter!==hs&&_.minFilter!==Rn||_.type===on&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let N=e.get("EXT_texture_filter_anisotropic");i.texParameterf(E,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Me(E,_){let N=!1;E.__webglInit===void 0&&(E.__webglInit=!0,_.addEventListener("dispose",w));let $=_.source,ne=d.get($);ne===void 0&&(ne={},d.set($,ne));let Z=L(_);if(Z!==E.__cacheKey){ne[Z]===void 0&&(ne[Z]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,N=!0),ne[Z].usedTimes++;let we=ne[E.__cacheKey];we!==void 0&&(ne[E.__cacheKey].usedTimes--,we.usedTimes===0&&T(_)),E.__cacheKey=Z,E.__webglTexture=ne[Z].texture}return N}function j(E,_,N){return Math.floor(Math.floor(E/N)/_)}function J(E,_,N,$){let Z=E.updateRanges;if(Z.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,N,$,_.data);else{Z.sort((oe,ue)=>oe.start-ue.start);let we=0;for(let oe=1;oe<Z.length;oe++){let ue=Z[we],Re=Z[oe],Pe=ue.start+ue.count,Te=j(Re.start,_.width,4),je=j(ue.start,_.width,4);Re.start<=Pe+1&&Te===je&&j(Re.start+Re.count-1,_.width,4)===Te?ue.count=Math.max(ue.count,Re.start+Re.count-ue.start):(++we,Z[we]=Re)}Z.length=we+1;let pe=i.getParameter(i.UNPACK_ROW_LENGTH),Fe=i.getParameter(i.UNPACK_SKIP_PIXELS),He=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let oe=0,ue=Z.length;oe<ue;oe++){let Re=Z[oe],Pe=Math.floor(Re.start/4),Te=Math.ceil(Re.count/4),je=Pe%_.width,D=Math.floor(Pe/_.width),me=Te,de=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,je),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),t.texSubImage2D(i.TEXTURE_2D,0,je,D,me,de,N,$,_.data)}E.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,pe),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Fe),i.pixelStorei(i.UNPACK_SKIP_ROWS,He)}}function O(E,_,N){let $=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&($=i.TEXTURE_3D);let ne=Me(E,_),Z=_.source;t.bindTexture($,E.__webglTexture,i.TEXTURE0+N);let we=n.get(Z);if(Z.version!==we.__version||ne===!0){t.activeTexture(i.TEXTURE0+N);let pe=et.getPrimaries(et.workingColorSpace),Fe=_.colorSpace===fi?null:et.getPrimaries(_.colorSpace),He=_.colorSpace===fi||pe===Fe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);let oe=x(_.image,!1,s.maxTextureSize);oe=Ve(_,oe);let ue=r.convert(_.format,_.colorSpace),Re=r.convert(_.type),Pe=M(_.internalFormat,ue,Re,_.colorSpace,_.isVideoTexture);ae($,_);let Te,je=_.mipmaps,D=_.isVideoTexture!==!0,me=we.__version===void 0||ne===!0,de=Z.dataReady,Ae=C(_,oe);if(_.isDepthTexture)Pe=b(_.format===Fi,_.type),me&&(D?t.texStorage2D(i.TEXTURE_2D,1,Pe,oe.width,oe.height):t.texImage2D(i.TEXTURE_2D,0,Pe,oe.width,oe.height,0,ue,Re,null));else if(_.isDataTexture)if(je.length>0){D&&me&&t.texStorage2D(i.TEXTURE_2D,Ae,Pe,je[0].width,je[0].height);for(let ce=0,K=je.length;ce<K;ce++)Te=je[ce],D?de&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,Te.width,Te.height,ue,Re,Te.data):t.texImage2D(i.TEXTURE_2D,ce,Pe,Te.width,Te.height,0,ue,Re,Te.data);_.generateMipmaps=!1}else D?(me&&t.texStorage2D(i.TEXTURE_2D,Ae,Pe,oe.width,oe.height),de&&J(_,oe,ue,Re)):t.texImage2D(i.TEXTURE_2D,0,Pe,oe.width,oe.height,0,ue,Re,oe.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){D&&me&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ae,Pe,je[0].width,je[0].height,oe.depth);for(let ce=0,K=je.length;ce<K;ce++)if(Te=je[ce],_.format!==ln)if(ue!==null)if(D){if(de)if(_.layerUpdates.size>0){let Ie=bh(Te.width,Te.height,_.format,_.type);for(let We of _.layerUpdates){let dt=Te.data.subarray(We*Ie/Te.data.BYTES_PER_ELEMENT,(We+1)*Ie/Te.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,We,Te.width,Te.height,1,ue,dt)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,0,Te.width,Te.height,oe.depth,ue,Te.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ce,Pe,Te.width,Te.height,oe.depth,0,Te.data,0,0);else Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?de&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,0,Te.width,Te.height,oe.depth,ue,Re,Te.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ce,Pe,Te.width,Te.height,oe.depth,0,ue,Re,Te.data)}else{D&&me&&t.texStorage2D(i.TEXTURE_2D,Ae,Pe,je[0].width,je[0].height);for(let ce=0,K=je.length;ce<K;ce++)Te=je[ce],_.format!==ln?ue!==null?D?de&&t.compressedTexSubImage2D(i.TEXTURE_2D,ce,0,0,Te.width,Te.height,ue,Te.data):t.compressedTexImage2D(i.TEXTURE_2D,ce,Pe,Te.width,Te.height,0,Te.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?de&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,Te.width,Te.height,ue,Re,Te.data):t.texImage2D(i.TEXTURE_2D,ce,Pe,Te.width,Te.height,0,ue,Re,Te.data)}else if(_.isDataArrayTexture)if(D){if(me&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ae,Pe,oe.width,oe.height,oe.depth),de)if(_.layerUpdates.size>0){let ce=bh(oe.width,oe.height,_.format,_.type);for(let K of _.layerUpdates){let Ie=oe.data.subarray(K*ce/oe.data.BYTES_PER_ELEMENT,(K+1)*ce/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,oe.width,oe.height,1,ue,Re,Ie)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,ue,Re,oe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Pe,oe.width,oe.height,oe.depth,0,ue,Re,oe.data);else if(_.isData3DTexture)D?(me&&t.texStorage3D(i.TEXTURE_3D,Ae,Pe,oe.width,oe.height,oe.depth),de&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,ue,Re,oe.data)):t.texImage3D(i.TEXTURE_3D,0,Pe,oe.width,oe.height,oe.depth,0,ue,Re,oe.data);else if(_.isFramebufferTexture){if(me)if(D)t.texStorage2D(i.TEXTURE_2D,Ae,Pe,oe.width,oe.height);else{let ce=oe.width,K=oe.height;for(let Ie=0;Ie<Ae;Ie++)t.texImage2D(i.TEXTURE_2D,Ie,Pe,ce,K,0,ue,Re,null),ce>>=1,K>>=1}}else if(je.length>0){if(D&&me){let ce=fe(je[0]);t.texStorage2D(i.TEXTURE_2D,Ae,Pe,ce.width,ce.height)}for(let ce=0,K=je.length;ce<K;ce++)Te=je[ce],D?de&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,ue,Re,Te):t.texImage2D(i.TEXTURE_2D,ce,Pe,ue,Re,Te);_.generateMipmaps=!1}else if(D){if(me){let ce=fe(oe);t.texStorage2D(i.TEXTURE_2D,Ae,Pe,ce.width,ce.height)}de&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue,Re,oe)}else t.texImage2D(i.TEXTURE_2D,0,Pe,ue,Re,oe);m(_)&&p($),we.__version=Z.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function Q(E,_,N){if(_.image.length!==6)return;let $=Me(E,_),ne=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+N);let Z=n.get(ne);if(ne.version!==Z.__version||$===!0){t.activeTexture(i.TEXTURE0+N);let we=et.getPrimaries(et.workingColorSpace),pe=_.colorSpace===fi?null:et.getPrimaries(_.colorSpace),Fe=_.colorSpace===fi||we===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);let He=_.isCompressedTexture||_.image[0].isCompressedTexture,oe=_.image[0]&&_.image[0].isDataTexture,ue=[];for(let K=0;K<6;K++)!He&&!oe?ue[K]=x(_.image[K],!0,s.maxCubemapSize):ue[K]=oe?_.image[K].image:_.image[K],ue[K]=Ve(_,ue[K]);let Re=ue[0],Pe=r.convert(_.format,_.colorSpace),Te=r.convert(_.type),je=M(_.internalFormat,Pe,Te,_.colorSpace),D=_.isVideoTexture!==!0,me=Z.__version===void 0||$===!0,de=ne.dataReady,Ae=C(_,Re);ae(i.TEXTURE_CUBE_MAP,_);let ce;if(He){D&&me&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,je,Re.width,Re.height);for(let K=0;K<6;K++){ce=ue[K].mipmaps;for(let Ie=0;Ie<ce.length;Ie++){let We=ce[Ie];_.format!==ln?Pe!==null?D?de&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Ie,0,0,We.width,We.height,Pe,We.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Ie,je,We.width,We.height,0,We.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Ie,0,0,We.width,We.height,Pe,Te,We.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Ie,je,We.width,We.height,0,Pe,Te,We.data)}}}else{if(ce=_.mipmaps,D&&me){ce.length>0&&Ae++;let K=fe(ue[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,je,K.width,K.height)}for(let K=0;K<6;K++)if(oe){D?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ue[K].width,ue[K].height,Pe,Te,ue[K].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,je,ue[K].width,ue[K].height,0,Pe,Te,ue[K].data);for(let Ie=0;Ie<ce.length;Ie++){let dt=ce[Ie].image[K].image;D?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Ie+1,0,0,dt.width,dt.height,Pe,Te,dt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Ie+1,je,dt.width,dt.height,0,Pe,Te,dt.data)}}else{D?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Pe,Te,ue[K]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,je,Pe,Te,ue[K]);for(let Ie=0;Ie<ce.length;Ie++){let We=ce[Ie];D?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Ie+1,0,0,Pe,Te,We.image[K]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Ie+1,je,Pe,Te,We.image[K])}}}m(_)&&p(i.TEXTURE_CUBE_MAP),Z.__version=ne.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function q(E,_,N,$,ne,Z){let we=r.convert(N.format,N.colorSpace),pe=r.convert(N.type),Fe=M(N.internalFormat,we,pe,N.colorSpace),He=n.get(_),oe=n.get(N);if(oe.__renderTarget=_,!He.__hasExternalTextures){let ue=Math.max(1,_.width>>Z),Re=Math.max(1,_.height>>Z);ne===i.TEXTURE_3D||ne===i.TEXTURE_2D_ARRAY?t.texImage3D(ne,Z,Fe,ue,Re,_.depth,0,we,pe,null):t.texImage2D(ne,Z,Fe,ue,Re,0,we,pe,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),ze(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,ne,oe.__webglTexture,0,A(_)):(ne===i.TEXTURE_2D||ne>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,ne,oe.__webglTexture,Z),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ve(E,_,N){if(i.bindRenderbuffer(i.RENDERBUFFER,E),_.depthBuffer){let $=_.depthTexture,ne=$&&$.isDepthTexture?$.type:null,Z=b(_.stencilBuffer,ne),we=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ze(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,A(_),Z,_.width,_.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,A(_),Z,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Z,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,we,i.RENDERBUFFER,E)}else{let $=_.textures;for(let ne=0;ne<$.length;ne++){let Z=$[ne],we=r.convert(Z.format,Z.colorSpace),pe=r.convert(Z.type),Fe=M(Z.internalFormat,we,pe,Z.colorSpace);ze(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,A(_),Fe,_.width,_.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,A(_),Fe,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Fe,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ce(E,_,N){let $=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let ne=n.get(_.depthTexture);if(ne.__renderTarget=_,(!ne.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),$){if(ne.__webglInit===void 0&&(ne.__webglInit=!0,_.depthTexture.addEventListener("dispose",w)),ne.__webglTexture===void 0){ne.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,ne.__webglTexture),ae(i.TEXTURE_CUBE_MAP,_.depthTexture);let He=r.convert(_.depthTexture.format),oe=r.convert(_.depthTexture.type),ue;_.depthTexture.format===On?ue=i.DEPTH_COMPONENT24:_.depthTexture.format===Fi&&(ue=i.DEPTH24_STENCIL8);for(let Re=0;Re<6;Re++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0,ue,_.width,_.height,0,He,oe,null)}}else k(_.depthTexture,0);let Z=ne.__webglTexture,we=A(_),pe=$?i.TEXTURE_CUBE_MAP_POSITIVE_X+N:i.TEXTURE_2D,Fe=_.depthTexture.format===Fi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===On)ze(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Fe,pe,Z,0,we):i.framebufferTexture2D(i.FRAMEBUFFER,Fe,pe,Z,0);else if(_.depthTexture.format===Fi)ze(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Fe,pe,Z,0,we):i.framebufferTexture2D(i.FRAMEBUFFER,Fe,pe,Z,0);else throw new Error("Unknown depthTexture format")}function Se(E){let _=n.get(E),N=E.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==E.depthTexture){let $=E.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),$){let ne=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,$.removeEventListener("dispose",ne)};$.addEventListener("dispose",ne),_.__depthDisposeCallback=ne}_.__boundDepthTexture=$}if(E.depthTexture&&!_.__autoAllocateDepthBuffer)if(N)for(let $=0;$<6;$++)Ce(_.__webglFramebuffer[$],E,$);else{let $=E.texture.mipmaps;$&&$.length>0?Ce(_.__webglFramebuffer[0],E,0):Ce(_.__webglFramebuffer,E,0)}else if(N){_.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[$]),_.__webglDepthbuffer[$]===void 0)_.__webglDepthbuffer[$]=i.createRenderbuffer(),ve(_.__webglDepthbuffer[$],E,!1);else{let ne=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=_.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,Z)}}else{let $=E.texture.mipmaps;if($&&$.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),ve(_.__webglDepthbuffer,E,!1);else{let ne=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,Z)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ke(E,_,N){let $=n.get(E);_!==void 0&&q($.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&Se(E)}function Be(E){let _=E.texture,N=n.get(E),$=n.get(_);E.addEventListener("dispose",P);let ne=E.textures,Z=E.isWebGLCubeRenderTarget===!0,we=ne.length>1;if(we||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=_.version,a.memory.textures++),Z){N.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(_.mipmaps&&_.mipmaps.length>0){N.__webglFramebuffer[pe]=[];for(let Fe=0;Fe<_.mipmaps.length;Fe++)N.__webglFramebuffer[pe][Fe]=i.createFramebuffer()}else N.__webglFramebuffer[pe]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){N.__webglFramebuffer=[];for(let pe=0;pe<_.mipmaps.length;pe++)N.__webglFramebuffer[pe]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(we)for(let pe=0,Fe=ne.length;pe<Fe;pe++){let He=n.get(ne[pe]);He.__webglTexture===void 0&&(He.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&ze(E)===!1){N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let pe=0;pe<ne.length;pe++){let Fe=ne[pe];N.__webglColorRenderbuffer[pe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[pe]);let He=r.convert(Fe.format,Fe.colorSpace),oe=r.convert(Fe.type),ue=M(Fe.internalFormat,He,oe,Fe.colorSpace,E.isXRRenderTarget===!0),Re=A(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,Re,ue,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,N.__webglColorRenderbuffer[pe])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),ve(N.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),ae(i.TEXTURE_CUBE_MAP,_);for(let pe=0;pe<6;pe++)if(_.mipmaps&&_.mipmaps.length>0)for(let Fe=0;Fe<_.mipmaps.length;Fe++)q(N.__webglFramebuffer[pe][Fe],E,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Fe);else q(N.__webglFramebuffer[pe],E,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);m(_)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let pe=0,Fe=ne.length;pe<Fe;pe++){let He=ne[pe],oe=n.get(He),ue=i.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(ue=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ue,oe.__webglTexture),ae(ue,He),q(N.__webglFramebuffer,E,He,i.COLOR_ATTACHMENT0+pe,ue,0),m(He)&&p(ue)}t.unbindTexture()}else{let pe=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(pe=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(pe,$.__webglTexture),ae(pe,_),_.mipmaps&&_.mipmaps.length>0)for(let Fe=0;Fe<_.mipmaps.length;Fe++)q(N.__webglFramebuffer[Fe],E,_,i.COLOR_ATTACHMENT0,pe,Fe);else q(N.__webglFramebuffer,E,_,i.COLOR_ATTACHMENT0,pe,0);m(_)&&p(pe),t.unbindTexture()}E.depthBuffer&&Se(E)}function ee(E){let _=E.textures;for(let N=0,$=_.length;N<$;N++){let ne=_[N];if(m(ne)){let Z=v(E),we=n.get(ne).__webglTexture;t.bindTexture(Z,we),p(Z),t.unbindTexture()}}}let se=[],te=[];function ge(E){if(E.samples>0){if(ze(E)===!1){let _=E.textures,N=E.width,$=E.height,ne=i.COLOR_BUFFER_BIT,Z=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,we=n.get(E),pe=_.length>1;if(pe)for(let He=0;He<_.length;He++)t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer);let Fe=E.texture.mipmaps;Fe&&Fe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let He=0;He<_.length;He++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(ne|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(ne|=i.STENCIL_BUFFER_BIT)),pe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,we.__webglColorRenderbuffer[He]);let oe=n.get(_[He]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,oe,0)}i.blitFramebuffer(0,0,N,$,0,0,N,$,ne,i.NEAREST),l===!0&&(se.length=0,te.length=0,se.push(i.COLOR_ATTACHMENT0+He),E.depthBuffer&&E.resolveDepthBuffer===!1&&(se.push(Z),te.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,te)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,se))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pe)for(let He=0;He<_.length;He++){t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.RENDERBUFFER,we.__webglColorRenderbuffer[He]);let oe=n.get(_[He]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.TEXTURE_2D,oe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){let _=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function A(E){return Math.min(s.maxSamples,E.samples)}function ze(E){let _=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function be(E){let _=a.render.frame;h.get(E)!==_&&(h.set(E,_),E.update())}function Ve(E,_){let N=E.colorSpace,$=E.format,ne=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||N!==Ot&&N!==fi&&(et.getTransfer(N)===nt?($!==ln||ne!==Jt)&&Ne("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ge("WebGLTextures: Unsupported texture color space:",N)),_}function fe(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=G,this.setTexture2D=k,this.setTexture2DArray=F,this.setTexture3D=U,this.setTextureCube=ie,this.rebindTextures=Ke,this.setupRenderTarget=Be,this.updateRenderTargetMipmap=ee,this.updateMultisampleRenderTarget=ge,this.setupDepthRenderbuffer=Se,this.setupFrameBufferTexture=q,this.useMultisampledRTT=ze,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function my(i,e){function t(n,s=fi){let r,a=et.getTransfer(s);if(n===Jt)return i.UNSIGNED_BYTE;if(n===tl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===nl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===hh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===uh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===lh)return i.BYTE;if(n===ch)return i.SHORT;if(n===rr)return i.UNSIGNED_SHORT;if(n===el)return i.INT;if(n===In)return i.UNSIGNED_INT;if(n===on)return i.FLOAT;if(n===qn)return i.HALF_FLOAT;if(n===dh)return i.ALPHA;if(n===fh)return i.RGB;if(n===ln)return i.RGBA;if(n===On)return i.DEPTH_COMPONENT;if(n===Fi)return i.DEPTH_STENCIL;if(n===il)return i.RED;if(n===sl)return i.RED_INTEGER;if(n===us)return i.RG;if(n===rl)return i.RG_INTEGER;if(n===al)return i.RGBA_INTEGER;if(n===xa||n===ya||n===va||n===ba)if(a===nt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===xa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===va)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ba)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===xa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ya)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===va)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ba)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ol||n===ll||n===cl||n===hl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ol)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ll)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===cl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===hl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ul||n===dl||n===fl||n===pl||n===ml||n===gl||n===_l)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ul||n===dl)return a===nt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===fl)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===pl)return r.COMPRESSED_R11_EAC;if(n===ml)return r.COMPRESSED_SIGNED_R11_EAC;if(n===gl)return r.COMPRESSED_RG11_EAC;if(n===_l)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===xl||n===yl||n===vl||n===bl||n===Ml||n===Sl||n===Tl||n===El||n===Al||n===wl||n===Cl||n===Rl||n===Il||n===Pl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===xl)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===yl)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===vl)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===bl)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ml)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Sl)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Tl)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===El)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Al)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===wl)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Cl)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Rl)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Il)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Pl)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ll||n===Dl||n===Nl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ll)return a===nt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Dl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Nl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ul||n===Fl||n===Ol||n===Bl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ul)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Fl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ol)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Bl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ar?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}function yy(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,xh(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,v,M,b){p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,b)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,v,M):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===zt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===zt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let v=e.get(p),M=v.envMap,b=v.envMapRotation;M&&(m.envMap.value=M,ps.copy(b),ps.x*=-1,ps.y*=-1,ps.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ps.y*=-1,ps.z*=-1),m.envMapRotation.value.setFromMatrix4(xy.makeRotationFromEuler(ps)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,v,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=M*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===zt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){let v=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function vy(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,M){let b=M.program;n.uniformBlockBinding(v,b)}function c(v,M){let b=s[v.id];b===void 0&&(g(v),b=h(v),s[v.id]=b,v.addEventListener("dispose",m));let C=M.program;n.updateUBOMapping(v,C);let w=e.render.frame;r[v.id]!==w&&(d(v),r[v.id]=w)}function h(v){let M=u();v.__bindingPointIndex=M;let b=i.createBuffer(),C=v.__size,w=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,C,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,b),b}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Ge("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let M=s[v.id],b=v.uniforms,C=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let w=0,P=b.length;w<P;w++){let y=Array.isArray(b[w])?b[w]:[b[w]];for(let T=0,H=y.length;T<H;T++){let R=y[T];if(f(R,w,T,C)===!0){let G=R.__offset,B=Array.isArray(R.value)?R.value:[R.value],L=0;for(let k=0;k<B.length;k++){let F=B[k],U=x(F);typeof F=="number"||typeof F=="boolean"?(R.__data[0]=F,i.bufferSubData(i.UNIFORM_BUFFER,G+L,R.__data)):F.isMatrix3?(R.__data[0]=F.elements[0],R.__data[1]=F.elements[1],R.__data[2]=F.elements[2],R.__data[3]=0,R.__data[4]=F.elements[3],R.__data[5]=F.elements[4],R.__data[6]=F.elements[5],R.__data[7]=0,R.__data[8]=F.elements[6],R.__data[9]=F.elements[7],R.__data[10]=F.elements[8],R.__data[11]=0):(F.toArray(R.__data,L),L+=U.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,M,b,C){let w=v.value,P=M+"_"+b;if(C[P]===void 0)return typeof w=="number"||typeof w=="boolean"?C[P]=w:C[P]=w.clone(),!0;{let y=C[P];if(typeof w=="number"||typeof w=="boolean"){if(y!==w)return C[P]=w,!0}else if(y.equals(w)===!1)return y.copy(w),!0}return!1}function g(v){let M=v.uniforms,b=0,C=16;for(let P=0,y=M.length;P<y;P++){let T=Array.isArray(M[P])?M[P]:[M[P]];for(let H=0,R=T.length;H<R;H++){let G=T[H],B=Array.isArray(G.value)?G.value:[G.value];for(let L=0,k=B.length;L<k;L++){let F=B[L],U=x(F),ie=b%C,Y=ie%U.boundary,le=ie+Y;b+=Y,le!==0&&C-le<U.storage&&(b+=C-le),G.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=b,b+=U.storage}}}let w=b%C;return w>0&&(b+=C-w),v.__size=b,v.__cache={},this}function x(v){let M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?Ne("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ne("WebGLRenderer: Unsupported uniform value type.",v),M}function m(v){let M=v.target;M.removeEventListener("dispose",m);let b=a.indexOf(M.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}function My(){return $n===null&&($n=new Ys(by,16,16,us,qn),$n.name="DFG_LUT",$n.minFilter=vt,$n.magFilter=vt,$n.wrapS=fn,$n.wrapT=fn,$n.generateMipmaps=!1,$n.needsUpdate=!0),$n}var zm,km,Vm,Hm,Gm,Wm,Xm,qm,$m,Ym,Zm,Km,jm,Jm,Qm,eg,tg,ng,ig,sg,rg,ag,og,lg,cg,hg,ug,dg,fg,pg,mg,gg,_g,xg,yg,vg,bg,Mg,Sg,Tg,Eg,Ag,wg,Cg,Rg,Ig,Pg,Lg,Dg,Ng,Ug,Fg,Og,Bg,zg,kg,Vg,Hg,Gg,Wg,Xg,qg,$g,Yg,Zg,Kg,jg,Jg,Qg,e0,t0,n0,i0,s0,r0,a0,o0,l0,c0,h0,u0,d0,f0,p0,m0,g0,_0,x0,y0,v0,b0,M0,S0,T0,E0,A0,w0,C0,R0,I0,P0,L0,D0,N0,U0,F0,O0,B0,z0,k0,V0,H0,G0,W0,X0,q0,$0,Y0,Z0,K0,j0,J0,Q0,e_,t_,n_,i_,s_,r_,a_,o_,l_,c_,h_,u_,d_,f_,p_,m_,g_,__,Ze,_e,Yn,Hl,fs,x_,Oi,lf,ms,T_,Sa,cf,Sh,Th,Eh,Ah,E_,hr,Wl,F_,Pf,Rh,Lf,Df,Nf,ff,pf,mf,gf,_f,Ih,Ph,Lh,wh,cr,Ex,Ax,vf,Ix,Gl,Fx,Ox,zx,Vx,Gx,Xx,$x,jx,Nh,Uh,sy,ly,cy,hy,uy,Rf,Ta,Ch,gy,_y,Fh,Oh,ps,xy,by,$n,Xl,dr=Ln(()=>{Mh();Mh();zm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,km=`#ifdef USE_ALPHAHASH
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
#endif`,Vm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Hm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xm=`#ifdef USE_AOMAP
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
#endif`,qm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$m=`#ifdef USE_BATCHING
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
#endif`,Ym=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Zm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Km=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Jm=`#ifdef USE_IRIDESCENCE
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
#endif`,Qm=`#ifdef USE_BUMPMAP
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
#endif`,eg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,tg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ng=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ig=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,rg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ag=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,og=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,lg=`#define PI 3.141592653589793
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
} // validated`,cg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,hg=`vec3 transformedNormal = objectNormal;
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
#endif`,ug=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,dg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,pg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mg="gl_FragColor = linearToOutputTexel( gl_FragColor );",gg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,_g=`#ifdef USE_ENVMAP
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
#endif`,xg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,yg=`#ifdef USE_ENVMAP
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
#endif`,vg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,bg=`#ifdef USE_ENVMAP
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
#endif`,Mg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Sg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Tg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Eg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ag=`#ifdef USE_GRADIENTMAP
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
}`,wg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Cg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ig=`uniform bool receiveShadow;
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
#endif`,Pg=`#ifdef USE_ENVMAP
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
#endif`,Lg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Dg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ng=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ug=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Fg=`PhysicalMaterial material;
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
#endif`,Og=`uniform sampler2D dfgLUT;
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
}`,Bg=`
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
#endif`,zg=`#if defined( RE_IndirectDiffuse )
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
#endif`,kg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Vg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Hg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Xg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,qg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$g=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Yg=`#if defined( USE_POINTS_UV )
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
#endif`,Zg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Kg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Jg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Qg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,e0=`#ifdef USE_MORPHTARGETS
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
#endif`,t0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,n0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,i0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,s0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,r0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,a0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,o0=`#ifdef USE_NORMALMAP
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
#endif`,l0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,c0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,h0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,u0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,d0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,f0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,p0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,m0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,g0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,x0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,y0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,v0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,b0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,M0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,S0=`float getShadowMask() {
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
}`,T0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,E0=`#ifdef USE_SKINNING
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
#endif`,A0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,w0=`#ifdef USE_SKINNING
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
#endif`,C0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,R0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,I0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,P0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,L0=`#ifdef USE_TRANSMISSION
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
#endif`,D0=`#ifdef USE_TRANSMISSION
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
#endif`,N0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,U0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,F0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,O0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,B0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,z0=`uniform sampler2D t2D;
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
}`,k0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,V0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,H0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,G0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,W0=`#include <common>
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
}`,X0=`#if DEPTH_PACKING == 3200
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
}`,q0=`#define DISTANCE
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
}`,$0=`#define DISTANCE
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
}`,Y0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Z0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K0=`uniform float scale;
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
}`,j0=`uniform vec3 diffuse;
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
}`,J0=`#include <common>
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
}`,Q0=`uniform vec3 diffuse;
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
}`,e_=`#define LAMBERT
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
}`,t_=`#define LAMBERT
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
}`,n_=`#define MATCAP
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
}`,i_=`#define MATCAP
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
}`,s_=`#define NORMAL
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
}`,r_=`#define NORMAL
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
}`,a_=`#define PHONG
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
}`,o_=`#define PHONG
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
}`,l_=`#define STANDARD
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
}`,c_=`#define STANDARD
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
}`,h_=`#define TOON
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
}`,u_=`#define TOON
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
}`,d_=`uniform float size;
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
}`,f_=`uniform vec3 diffuse;
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
}`,p_=`#include <common>
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
}`,m_=`uniform vec3 color;
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
}`,g_=`uniform float rotation;
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
}`,__=`uniform vec3 diffuse;
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
}`,Ze={alphahash_fragment:zm,alphahash_pars_fragment:km,alphamap_fragment:Vm,alphamap_pars_fragment:Hm,alphatest_fragment:Gm,alphatest_pars_fragment:Wm,aomap_fragment:Xm,aomap_pars_fragment:qm,batching_pars_vertex:$m,batching_vertex:Ym,begin_vertex:Zm,beginnormal_vertex:Km,bsdfs:jm,iridescence_fragment:Jm,bumpmap_pars_fragment:Qm,clipping_planes_fragment:eg,clipping_planes_pars_fragment:tg,clipping_planes_pars_vertex:ng,clipping_planes_vertex:ig,color_fragment:sg,color_pars_fragment:rg,color_pars_vertex:ag,color_vertex:og,common:lg,cube_uv_reflection_fragment:cg,defaultnormal_vertex:hg,displacementmap_pars_vertex:ug,displacementmap_vertex:dg,emissivemap_fragment:fg,emissivemap_pars_fragment:pg,colorspace_fragment:mg,colorspace_pars_fragment:gg,envmap_fragment:_g,envmap_common_pars_fragment:xg,envmap_pars_fragment:yg,envmap_pars_vertex:vg,envmap_physical_pars_fragment:Pg,envmap_vertex:bg,fog_vertex:Mg,fog_pars_vertex:Sg,fog_fragment:Tg,fog_pars_fragment:Eg,gradientmap_pars_fragment:Ag,lightmap_pars_fragment:wg,lights_lambert_fragment:Cg,lights_lambert_pars_fragment:Rg,lights_pars_begin:Ig,lights_toon_fragment:Lg,lights_toon_pars_fragment:Dg,lights_phong_fragment:Ng,lights_phong_pars_fragment:Ug,lights_physical_fragment:Fg,lights_physical_pars_fragment:Og,lights_fragment_begin:Bg,lights_fragment_maps:zg,lights_fragment_end:kg,logdepthbuf_fragment:Vg,logdepthbuf_pars_fragment:Hg,logdepthbuf_pars_vertex:Gg,logdepthbuf_vertex:Wg,map_fragment:Xg,map_pars_fragment:qg,map_particle_fragment:$g,map_particle_pars_fragment:Yg,metalnessmap_fragment:Zg,metalnessmap_pars_fragment:Kg,morphinstance_vertex:jg,morphcolor_vertex:Jg,morphnormal_vertex:Qg,morphtarget_pars_vertex:e0,morphtarget_vertex:t0,normal_fragment_begin:n0,normal_fragment_maps:i0,normal_pars_fragment:s0,normal_pars_vertex:r0,normal_vertex:a0,normalmap_pars_fragment:o0,clearcoat_normal_fragment_begin:l0,clearcoat_normal_fragment_maps:c0,clearcoat_pars_fragment:h0,iridescence_pars_fragment:u0,opaque_fragment:d0,packing:f0,premultiplied_alpha_fragment:p0,project_vertex:m0,dithering_fragment:g0,dithering_pars_fragment:_0,roughnessmap_fragment:x0,roughnessmap_pars_fragment:y0,shadowmap_pars_fragment:v0,shadowmap_pars_vertex:b0,shadowmap_vertex:M0,shadowmask_pars_fragment:S0,skinbase_vertex:T0,skinning_pars_vertex:E0,skinning_vertex:A0,skinnormal_vertex:w0,specularmap_fragment:C0,specularmap_pars_fragment:R0,tonemapping_fragment:I0,tonemapping_pars_fragment:P0,transmission_fragment:L0,transmission_pars_fragment:D0,uv_pars_fragment:N0,uv_pars_vertex:U0,uv_vertex:F0,worldpos_vertex:O0,background_vert:B0,background_frag:z0,backgroundCube_vert:k0,backgroundCube_frag:V0,cube_vert:H0,cube_frag:G0,depth_vert:W0,depth_frag:X0,distance_vert:q0,distance_frag:$0,equirect_vert:Y0,equirect_frag:Z0,linedashed_vert:K0,linedashed_frag:j0,meshbasic_vert:J0,meshbasic_frag:Q0,meshlambert_vert:e_,meshlambert_frag:t_,meshmatcap_vert:n_,meshmatcap_frag:i_,meshnormal_vert:s_,meshnormal_frag:r_,meshphong_vert:a_,meshphong_frag:o_,meshphysical_vert:l_,meshphysical_frag:c_,meshtoon_vert:h_,meshtoon_frag:u_,points_vert:d_,points_frag:f_,shadow_vert:p_,shadow_frag:m_,sprite_vert:g_,sprite_frag:__},_e={common:{diffuse:{value:new ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new re(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new ke(16777215)},opacity:{value:1},center:{value:new re(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},Yn={basic:{uniforms:Xt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:Xt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new ke(0)},envMapIntensity:{value:1}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:Xt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new ke(0)},specular:{value:new ke(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:Xt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:Xt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new ke(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:Xt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:Xt([_e.points,_e.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:Xt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:Xt([_e.common,_e.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:Xt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:Xt([_e.sprite,_e.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distance:{uniforms:Xt([_e.common,_e.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distance_vert,fragmentShader:Ze.distance_frag},shadow:{uniforms:Xt([_e.lights,_e.fog,{color:{value:new ke(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Yn.physical={uniforms:Xt([Yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new re(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new re},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new ke(0)},specularColor:{value:new ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new re},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};Hl={r:0,b:0,g:0},fs=new mn,x_=new qe;Oi=4,lf=[.125,.215,.35,.446,.526,.582],ms=20,T_=256,Sa=new Pi,cf=new ke,Sh=null,Th=0,Eh=0,Ah=!1,E_=new I,hr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=E_}=r;Sh=this._renderer.getRenderTarget(),Th=this._renderer.getActiveCubeFace(),Eh=this._renderer.getActiveMipmapLevel(),Ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=df(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=uf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Sh,Th,Eh),this._renderer.xr.enabled=Ah,e.scissorTest=!1,lr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ui||e.mapping===cs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Sh=this._renderer.getRenderTarget(),Th=this._renderer.getActiveCubeFace(),Eh=this._renderer.getActiveMipmapLevel(),Ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:vt,minFilter:vt,generateMipmaps:!1,type:qn,format:ln,colorSpace:Ot,depthBuffer:!1},s=hf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hf(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=A_(r)),this._blurMaterial=C_(r,e,t),this._ggxMaterial=w_(r,e,t)}return s}_compileMaterial(e){let t=new lt(new Et,e);this._renderer.compile(t,Sa)}_sceneToCubeUV(e,t,n,s,r){let l=new St(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(cf),u.toneMapping=Cn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new lt(new An,new En({name:"PMREM.Background",side:zt,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,m=x.material,p=!1,v=e.background;v?v.isColor&&(m.color.copy(v),e.background=null,p=!0):(m.color.copy(cf),p=!0);for(let M=0;M<6;M++){let b=M%3;b===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):b===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));let C=this._cubeSize;lr(s,b*C,M>2?C:0,C,C),u.setRenderTarget(s),p&&u.render(x,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=v}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Ui||e.mapping===cs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=df()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=uf());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;lr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Sa)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:g}=this,x=this._sizeLods[n],m=3*x*(n>g-Oi?n-g+Oi:0),p=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-t,lr(r,m,p,3*x,2*x),s.setRenderTarget(r),s.render(o,Sa),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,lr(e,m,p,3*x,2*x),s.setRenderTarget(e),s.render(o,Sa)}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ge("blur direction must be either latitudinal or longitudinal!");let h=3,u=this._lodMeshes[s];u.material=c;let d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ms-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):ms;m>ms&&Ne(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ms}`);let p=[],v=0;for(let P=0;P<ms;++P){let y=P/x,T=Math.exp(-y*y/2);p.push(T),P===0?v+=T:P<m&&(v+=2*T)}for(let P=0;P<p.length;P++)p[P]=p[P]/v;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-n;let b=this._sizeLods[s],C=3*b*(s>M-Oi?s-M+Oi:0),w=4*(this._cubeSize-b);lr(t,C,w,3*b,2*b),l.setRenderTarget(t),l.render(u,Sa)}};Wl=class extends sn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new $r(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new An(5,5,5),r=new an({name:"CubemapFromEquirect",uniforms:ds(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:zt,blending:Xn});r.uniforms.tEquirect.value=t;let a=new lt(s,r),o=t.minFilter;return t.minFilter===Rn&&(t.minFilter=vt),new $o(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};F_={[th]:"LINEAR_TONE_MAPPING",[nh]:"REINHARD_TONE_MAPPING",[ih]:"CINEON_TONE_MAPPING",[ga]:"ACES_FILMIC_TONE_MAPPING",[rh]:"AGX_TONE_MAPPING",[ah]:"NEUTRAL_TONE_MAPPING",[sh]:"CUSTOM_TONE_MAPPING"};Pf=new Dt,Rh=new Ri(1,1),Lf=new Br,Df=new Co,Nf=new $r,ff=[],pf=[],mf=new Float32Array(16),gf=new Float32Array(9),_f=new Float32Array(4);Ih=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ix(t.type)}},Ph=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Sx(t.type)}},Lh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},wh=/(\w+)(\])?(\[|\.)?/g;cr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Tx(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};Ex=37297,Ax=0;vf=new $e;Ix={[th]:"Linear",[nh]:"Reinhard",[ih]:"Cineon",[ga]:"ACESFilmic",[rh]:"AgX",[ah]:"Neutral",[sh]:"Custom"};Gl=new I;Fx=/^[ \t]*#include +<([\w\d./]+)>/gm;Ox=new Map;zx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;Vx={[ma]:"SHADOWMAP_TYPE_PCF",[ir]:"SHADOWMAP_TYPE_VSM"};Gx={[Ui]:"ENVMAP_TYPE_CUBE",[cs]:"ENVMAP_TYPE_CUBE",[_a]:"ENVMAP_TYPE_CUBE_UV"};Xx={[cs]:"ENVMAP_MODE_REFRACTION"};$x={[Ko]:"ENVMAP_BLENDING_MULTIPLY",[Od]:"ENVMAP_BLENDING_MIX",[Bd]:"ENVMAP_BLENDING_ADD"};jx=0,Nh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Uh(e),t.set(e,n)),n}},Uh=class{constructor(e){this.id=jx++,this.code=e,this.usedTimes=0}};sy=0;ly=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cy=`uniform sampler2D shadow_pass;
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
}`,hy=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],uy=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],Rf=new qe,Ta=new I,Ch=new I;gy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_y=`
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

}`,Fh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Yr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new an({vertexShader:gy,fragmentShader:_y,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new lt(new as(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Oh=class extends Bn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null,x=typeof XRWebGLBinding<"u",m=new Fh,p={},v=t.getContextAttributes(),M=null,b=null,C=[],w=[],P=new re,y=null,T=new St;T.viewport=new ft;let H=new St;H.viewport=new ft;let R=[T,H],G=new Yo,B=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let Q=C[O];return Q===void 0&&(Q=new Ws,C[O]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(O){let Q=C[O];return Q===void 0&&(Q=new Ws,C[O]=Q),Q.getGripSpace()},this.getHand=function(O){let Q=C[O];return Q===void 0&&(Q=new Ws,C[O]=Q),Q.getHandSpace()};function k(O){let Q=w.indexOf(O.inputSource);if(Q===-1)return;let q=C[Q];q!==void 0&&(q.update(O.inputSource,O.frame,c||a),q.dispatchEvent({type:O.type,data:O.inputSource}))}function F(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",U);for(let O=0;O<C.length;O++){let Q=w[O];Q!==null&&(w[O]=null,C[O].disconnect(Q))}B=null,L=null,m.reset();for(let O in p)delete p[O];e.setRenderTarget(M),f=null,d=null,u=null,s=null,b=null,J.stop(),n.isPresenting=!1,e.setPixelRatio(y),e.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){r=O,n.isPresenting===!0&&Ne("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){o=O,n.isPresenting===!0&&Ne("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(O){c=O},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(O){if(s=O,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",F),s.addEventListener("inputsourceschange",U),v.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(P),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let q=null,ve=null,Ce=null;v.depth&&(Ce=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,q=v.stencil?Fi:On,ve=v.stencil?ar:In);let Se={colorFormat:t.RGBA8,depthFormat:Ce,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Se),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new sn(d.textureWidth,d.textureHeight,{format:ln,type:Jt,depthTexture:new Ri(d.textureWidth,d.textureHeight,ve,void 0,void 0,void 0,void 0,void 0,void 0,q),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let q={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,q),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new sn(f.framebufferWidth,f.framebufferHeight,{format:ln,type:Jt,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),J.setContext(s),J.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function U(O){for(let Q=0;Q<O.removed.length;Q++){let q=O.removed[Q],ve=w.indexOf(q);ve>=0&&(w[ve]=null,C[ve].disconnect(q))}for(let Q=0;Q<O.added.length;Q++){let q=O.added[Q],ve=w.indexOf(q);if(ve===-1){for(let Se=0;Se<C.length;Se++)if(Se>=w.length){w.push(q),ve=Se;break}else if(w[Se]===null){w[Se]=q,ve=Se;break}if(ve===-1)break}let Ce=C[ve];Ce&&Ce.connect(q)}}let ie=new I,Y=new I;function le(O,Q,q){ie.setFromMatrixPosition(Q.matrixWorld),Y.setFromMatrixPosition(q.matrixWorld);let ve=ie.distanceTo(Y),Ce=Q.projectionMatrix.elements,Se=q.projectionMatrix.elements,Ke=Ce[14]/(Ce[10]-1),Be=Ce[14]/(Ce[10]+1),ee=(Ce[9]+1)/Ce[5],se=(Ce[9]-1)/Ce[5],te=(Ce[8]-1)/Ce[0],ge=(Se[8]+1)/Se[0],A=Ke*te,ze=Ke*ge,be=ve/(-te+ge),Ve=be*-te;if(Q.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(Ve),O.translateZ(be),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert(),Ce[10]===-1)O.projectionMatrix.copy(Q.projectionMatrix),O.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let fe=Ke+be,E=Be+be,_=A-Ve,N=ze+(ve-Ve),$=ee*Be/E*fe,ne=se*Be/E*fe;O.projectionMatrix.makePerspective(_,N,$,ne,fe,E),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}}function he(O,Q){Q===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(Q.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(s===null)return;let Q=O.near,q=O.far;m.texture!==null&&(m.depthNear>0&&(Q=m.depthNear),m.depthFar>0&&(q=m.depthFar)),G.near=H.near=T.near=Q,G.far=H.far=T.far=q,(B!==G.near||L!==G.far)&&(s.updateRenderState({depthNear:G.near,depthFar:G.far}),B=G.near,L=G.far),G.layers.mask=O.layers.mask|6,T.layers.mask=G.layers.mask&-5,H.layers.mask=G.layers.mask&-3;let ve=O.parent,Ce=G.cameras;he(G,ve);for(let Se=0;Se<Ce.length;Se++)he(Ce[Se],ve);Ce.length===2?le(G,T,H):G.projectionMatrix.copy(T.projectionMatrix),ae(O,G,ve)};function ae(O,Q,q){q===null?O.matrix.copy(Q.matrixWorld):(O.matrix.copy(q.matrixWorld),O.matrix.invert(),O.matrix.multiply(Q.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(Q.projectionMatrix),O.projectionMatrixInverse.copy(Q.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=es*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(O){l=O,d!==null&&(d.fixedFoveation=O),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=O)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(G)},this.getCameraTexture=function(O){return p[O]};let Me=null;function j(O,Q){if(h=Q.getViewerPose(c||a),g=Q,h!==null){let q=h.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let ve=!1;q.length!==G.cameras.length&&(G.cameras.length=0,ve=!0);for(let Be=0;Be<q.length;Be++){let ee=q[Be],se=null;if(f!==null)se=f.getViewport(ee);else{let ge=u.getViewSubImage(d,ee);se=ge.viewport,Be===0&&(e.setRenderTargetTextures(b,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(b))}let te=R[Be];te===void 0&&(te=new St,te.layers.enable(Be),te.viewport=new ft,R[Be]=te),te.matrix.fromArray(ee.transform.matrix),te.matrix.decompose(te.position,te.quaternion,te.scale),te.projectionMatrix.fromArray(ee.projectionMatrix),te.projectionMatrixInverse.copy(te.projectionMatrix).invert(),te.viewport.set(se.x,se.y,se.width,se.height),Be===0&&(G.matrix.copy(te.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),ve===!0&&G.cameras.push(te)}let Ce=s.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let Be=u.getDepthInformation(q[0]);Be&&Be.isValid&&Be.texture&&m.init(Be,s.renderState)}if(Ce&&Ce.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let Be=0;Be<q.length;Be++){let ee=q[Be].camera;if(ee){let se=p[ee];se||(se=new Yr,p[ee]=se);let te=u.getCameraImage(ee);se.sourceTexture=te}}}}for(let q=0;q<C.length;q++){let ve=w[q],Ce=C[q];ve!==null&&Ce!==void 0&&Ce.update(ve,Q,c||a)}Me&&Me(O,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}let J=new If;J.setAnimationLoop(j),this.setAnimationLoop=function(O){Me=O},this.dispose=function(){}}},ps=new mn,xy=new qe;by=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),$n=null;Xl=class{constructor(e={}){let{canvas:t=Zd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Jt}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let x=f,m=new Set([al,rl,sl]),p=new Set([Jt,In,rr,ar,tl,nl]),v=new Uint32Array(4),M=new Int32Array(4),b=null,C=null,w=[],P=[],y=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Cn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,H=!1;this._outputColorSpace=wt;let R=0,G=0,B=null,L=-1,k=null,F=new ft,U=new ft,ie=null,Y=new ke(0),le=0,he=t.width,ae=t.height,Me=1,j=null,J=null,O=new ft(0,0,he,ae),Q=new ft(0,0,he,ae),q=!1,ve=new Zs,Ce=!1,Se=!1,Ke=new qe,Be=new I,ee=new ft,se={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},te=!1;function ge(){return B===null?Me:1}let A=n;function ze(S,z){return t.getContext(S,z)}try{let S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"183"}`),t.addEventListener("webglcontextlost",Ie,!1),t.addEventListener("webglcontextrestored",We,!1),t.addEventListener("webglcontextcreationerror",dt,!1),A===null){let z="webgl2";if(A=ze(z,S),A===null)throw ze(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw Ge("WebGLRenderer: "+S.message),S}let be,Ve,fe,E,_,N,$,ne,Z,we,pe,Fe,He,oe,ue,Re,Pe,Te,je,D,me,de,Ae;function ce(){be=new I_(A),be.init(),me=new my(A,be),Ve=new M_(A,be,e,me),fe=new fy(A,be),Ve.reversedDepthBuffer&&d&&fe.buffers.depth.setReversed(!0),E=new D_(A),_=new Qx,N=new py(A,be,fe,_,Ve,me,E),$=new R_(T),ne=new Bm(A),de=new v_(A,ne),Z=new P_(A,ne,E,de),we=new U_(A,Z,ne,de,E),Te=new N_(A,Ve,N),ue=new S_(_),pe=new Jx(T,$,be,Ve,de,ue),Fe=new yy(T,_),He=new ty,oe=new oy(be),Pe=new y_(T,$,fe,we,g,l),Re=new dy(T,we,Ve),Ae=new vy(A,E,Ve,fe),je=new b_(A,be,E),D=new L_(A,be,E),E.programs=pe.programs,T.capabilities=Ve,T.extensions=be,T.properties=_,T.renderLists=He,T.shadowMap=Re,T.state=fe,T.info=E}ce(),x!==Jt&&(y=new O_(x,t.width,t.height,s,r));let K=new Oh(T,A);this.xr=K,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){let S=be.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=be.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return Me},this.setPixelRatio=function(S){S!==void 0&&(Me=S,this.setSize(he,ae,!1))},this.getSize=function(S){return S.set(he,ae)},this.setSize=function(S,z,X=!0){if(K.isPresenting){Ne("WebGLRenderer: Can't change size while VR device is presenting.");return}he=S,ae=z,t.width=Math.floor(S*Me),t.height=Math.floor(z*Me),X===!0&&(t.style.width=S+"px",t.style.height=z+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,S,z)},this.getDrawingBufferSize=function(S){return S.set(he*Me,ae*Me).floor()},this.setDrawingBufferSize=function(S,z,X){he=S,ae=z,Me=X,t.width=Math.floor(S*X),t.height=Math.floor(z*X),this.setViewport(0,0,S,z)},this.setEffects=function(S){if(x===Jt){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let z=0;z<S.length;z++)if(S[z].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(F)},this.getViewport=function(S){return S.copy(O)},this.setViewport=function(S,z,X,W){S.isVector4?O.set(S.x,S.y,S.z,S.w):O.set(S,z,X,W),fe.viewport(F.copy(O).multiplyScalar(Me).round())},this.getScissor=function(S){return S.copy(Q)},this.setScissor=function(S,z,X,W){S.isVector4?Q.set(S.x,S.y,S.z,S.w):Q.set(S,z,X,W),fe.scissor(U.copy(Q).multiplyScalar(Me).round())},this.getScissorTest=function(){return q},this.setScissorTest=function(S){fe.setScissorTest(q=S)},this.setOpaqueSort=function(S){j=S},this.setTransparentSort=function(S){J=S},this.getClearColor=function(S){return S.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor(...arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha(...arguments)},this.clear=function(S=!0,z=!0,X=!0){let W=0;if(S){let V=!1;if(B!==null){let xe=B.texture.format;V=m.has(xe)}if(V){let xe=B.texture.type,Ee=p.has(xe),ye=Pe.getClearColor(),Le=Pe.getClearAlpha(),Ue=ye.r,Xe=ye.g,Je=ye.b;Ee?(v[0]=Ue,v[1]=Xe,v[2]=Je,v[3]=Le,A.clearBufferuiv(A.COLOR,0,v)):(M[0]=Ue,M[1]=Xe,M[2]=Je,M[3]=Le,A.clearBufferiv(A.COLOR,0,M))}else W|=A.COLOR_BUFFER_BIT}z&&(W|=A.DEPTH_BUFFER_BIT),X&&(W|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&A.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ie,!1),t.removeEventListener("webglcontextrestored",We,!1),t.removeEventListener("webglcontextcreationerror",dt,!1),Pe.dispose(),He.dispose(),oe.dispose(),_.dispose(),$.dispose(),we.dispose(),de.dispose(),Ae.dispose(),pe.dispose(),K.dispose(),K.removeEventListener("sessionstart",yu),K.removeEventListener("sessionend",vu),ki.stop()};function Ie(S){S.preventDefault(),Fr("WebGLRenderer: Context Lost."),H=!0}function We(){Fr("WebGLRenderer: Context Restored."),H=!1;let S=E.autoReset,z=Re.enabled,X=Re.autoUpdate,W=Re.needsUpdate,V=Re.type;ce(),E.autoReset=S,Re.enabled=z,Re.autoUpdate=X,Re.needsUpdate=W,Re.type=V}function dt(S){Ge("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function it(S){let z=S.target;z.removeEventListener("dispose",it),jn(z)}function jn(S){Jn(S),_.remove(S)}function Jn(S){let z=_.get(S).programs;z!==void 0&&(z.forEach(function(X){pe.releaseProgram(X)}),S.isShaderMaterial&&pe.releaseShaderCache(S))}this.renderBufferDirect=function(S,z,X,W,V,xe){z===null&&(z=se);let Ee=V.isMesh&&V.matrixWorld.determinant()<0,ye=tp(S,z,X,W,V);fe.setMaterial(W,Ee);let Le=X.index,Ue=1;if(W.wireframe===!0){if(Le=Z.getWireframeAttribute(X),Le===void 0)return;Ue=2}let Xe=X.drawRange,Je=X.attributes.position,Oe=Xe.start*Ue,at=(Xe.start+Xe.count)*Ue;xe!==null&&(Oe=Math.max(Oe,xe.start*Ue),at=Math.min(at,(xe.start+xe.count)*Ue)),Le!==null?(Oe=Math.max(Oe,0),at=Math.min(at,Le.count)):Je!=null&&(Oe=Math.max(Oe,0),at=Math.min(at,Je.count));let xt=at-Oe;if(xt<0||xt===1/0)return;de.setup(V,W,ye,X,Le);let _t,ot=je;if(Le!==null&&(_t=ne.get(Le),ot=D,ot.setIndex(_t)),V.isMesh)W.wireframe===!0?(fe.setLineWidth(W.wireframeLinewidth*ge()),ot.setMode(A.LINES)):ot.setMode(A.TRIANGLES);else if(V.isLine){let kt=W.linewidth;kt===void 0&&(kt=1),fe.setLineWidth(kt*ge()),V.isLineSegments?ot.setMode(A.LINES):V.isLineLoop?ot.setMode(A.LINE_LOOP):ot.setMode(A.LINE_STRIP)}else V.isPoints?ot.setMode(A.POINTS):V.isSprite&&ot.setMode(A.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)Or("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ot.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(be.get("WEBGL_multi_draw"))ot.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{let kt=V._multiDrawStarts,De=V._multiDrawCounts,en=V._multiDrawCount,tt=Le?ne.get(Le).bytesPerElement:1,_n=_.get(W).currentProgram.getUniforms();for(let Pn=0;Pn<en;Pn++)_n.setValue(A,"_gl_DrawID",Pn),ot.render(kt[Pn]/tt,De[Pn])}else if(V.isInstancedMesh)ot.renderInstances(Oe,xt,V.count);else if(X.isInstancedBufferGeometry){let kt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,De=Math.min(X.instanceCount,kt);ot.renderInstances(Oe,xt,De)}else ot.render(Oe,xt)};function xu(S,z,X){S.transparent===!0&&S.side===jt&&S.forceSinglePass===!1?(S.side=zt,S.needsUpdate=!0,Ra(S,z,X),S.side=Tn,S.needsUpdate=!0,Ra(S,z,X),S.side=jt):Ra(S,z,X)}this.compile=function(S,z,X=null){X===null&&(X=S),C=oe.get(X),C.init(z),P.push(C),X.traverseVisible(function(V){V.isLight&&V.layers.test(z.layers)&&(C.pushLight(V),V.castShadow&&C.pushShadow(V))}),S!==X&&S.traverseVisible(function(V){V.isLight&&V.layers.test(z.layers)&&(C.pushLight(V),V.castShadow&&C.pushShadow(V))}),C.setupLights();let W=new Set;return S.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;let xe=V.material;if(xe)if(Array.isArray(xe))for(let Ee=0;Ee<xe.length;Ee++){let ye=xe[Ee];xu(ye,X,V),W.add(ye)}else xu(xe,X,V),W.add(xe)}),C=P.pop(),W},this.compileAsync=function(S,z,X=null){let W=this.compile(S,z,X);return new Promise(V=>{function xe(){if(W.forEach(function(Ee){_.get(Ee).currentProgram.isReady()&&W.delete(Ee)}),W.size===0){V(S);return}setTimeout(xe,10)}be.get("KHR_parallel_shader_compile")!==null?xe():setTimeout(xe,10)})};let ec=null;function ep(S){ec&&ec(S)}function yu(){ki.stop()}function vu(){ki.start()}let ki=new If;ki.setAnimationLoop(ep),typeof self<"u"&&ki.setContext(self),this.setAnimationLoop=function(S){ec=S,K.setAnimationLoop(S),S===null?ki.stop():ki.start()},K.addEventListener("sessionstart",yu),K.addEventListener("sessionend",vu),this.render=function(S,z){if(z!==void 0&&z.isCamera!==!0){Ge("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(H===!0)return;let X=K.enabled===!0&&K.isPresenting===!0,W=y!==null&&(B===null||X)&&y.begin(T,B);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(K.cameraAutoUpdate===!0&&K.updateCamera(z),z=K.getCamera()),S.isScene===!0&&S.onBeforeRender(T,S,z,B),C=oe.get(S,P.length),C.init(z),P.push(C),Ke.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),ve.setFromProjectionMatrix(Ke,Sn,z.reversedDepth),Se=this.localClippingEnabled,Ce=ue.init(this.clippingPlanes,Se),b=He.get(S,w.length),b.init(),w.push(b),K.enabled===!0&&K.isPresenting===!0){let Ee=T.xr.getDepthSensingMesh();Ee!==null&&tc(Ee,z,-1/0,T.sortObjects)}tc(S,z,0,T.sortObjects),b.finish(),T.sortObjects===!0&&b.sort(j,J),te=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,te&&Pe.addToRenderList(b,S),this.info.render.frame++,Ce===!0&&ue.beginShadows();let V=C.state.shadowsArray;if(Re.render(V,S,z),Ce===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset(),(W&&y.hasRenderPass())===!1){let Ee=b.opaque,ye=b.transmissive;if(C.setupLights(),z.isArrayCamera){let Le=z.cameras;if(ye.length>0)for(let Ue=0,Xe=Le.length;Ue<Xe;Ue++){let Je=Le[Ue];Mu(Ee,ye,S,Je)}te&&Pe.render(S);for(let Ue=0,Xe=Le.length;Ue<Xe;Ue++){let Je=Le[Ue];bu(b,S,Je,Je.viewport)}}else ye.length>0&&Mu(Ee,ye,S,z),te&&Pe.render(S),bu(b,S,z)}B!==null&&G===0&&(N.updateMultisampleRenderTarget(B),N.updateRenderTargetMipmap(B)),W&&y.end(T),S.isScene===!0&&S.onAfterRender(T,S,z),de.resetDefaultState(),L=-1,k=null,P.pop(),P.length>0?(C=P[P.length-1],Ce===!0&&ue.setGlobalState(T.clippingPlanes,C.state.camera)):C=null,w.pop(),w.length>0?b=w[w.length-1]:b=null};function tc(S,z,X,W){if(S.visible===!1)return;if(S.layers.test(z.layers)){if(S.isGroup)X=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(z);else if(S.isLight)C.pushLight(S),S.castShadow&&C.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||ve.intersectsSprite(S)){W&&ee.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Ke);let Ee=we.update(S),ye=S.material;ye.visible&&b.push(S,Ee,ye,X,ee.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||ve.intersectsObject(S))){let Ee=we.update(S),ye=S.material;if(W&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),ee.copy(S.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),ee.copy(Ee.boundingSphere.center)),ee.applyMatrix4(S.matrixWorld).applyMatrix4(Ke)),Array.isArray(ye)){let Le=Ee.groups;for(let Ue=0,Xe=Le.length;Ue<Xe;Ue++){let Je=Le[Ue],Oe=ye[Je.materialIndex];Oe&&Oe.visible&&b.push(S,Ee,Oe,X,ee.z,Je)}}else ye.visible&&b.push(S,Ee,ye,X,ee.z,null)}}let xe=S.children;for(let Ee=0,ye=xe.length;Ee<ye;Ee++)tc(xe[Ee],z,X,W)}function bu(S,z,X,W){let{opaque:V,transmissive:xe,transparent:Ee}=S;C.setupLightsView(X),Ce===!0&&ue.setGlobalState(T.clippingPlanes,X),W&&fe.viewport(F.copy(W)),V.length>0&&Ca(V,z,X),xe.length>0&&Ca(xe,z,X),Ee.length>0&&Ca(Ee,z,X),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function Mu(S,z,X,W){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(C.state.transmissionRenderTarget[W.id]===void 0){let Oe=be.has("EXT_color_buffer_half_float")||be.has("EXT_color_buffer_float");C.state.transmissionRenderTarget[W.id]=new sn(1,1,{generateMipmaps:!0,type:Oe?qn:Jt,minFilter:Rn,samples:Math.max(4,Ve.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace})}let xe=C.state.transmissionRenderTarget[W.id],Ee=W.viewport||F;xe.setSize(Ee.z*T.transmissionResolutionScale,Ee.w*T.transmissionResolutionScale);let ye=T.getRenderTarget(),Le=T.getActiveCubeFace(),Ue=T.getActiveMipmapLevel();T.setRenderTarget(xe),T.getClearColor(Y),le=T.getClearAlpha(),le<1&&T.setClearColor(16777215,.5),T.clear(),te&&Pe.render(X);let Xe=T.toneMapping;T.toneMapping=Cn;let Je=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),C.setupLightsView(W),Ce===!0&&ue.setGlobalState(T.clippingPlanes,W),Ca(S,X,W),N.updateMultisampleRenderTarget(xe),N.updateRenderTargetMipmap(xe),be.has("WEBGL_multisampled_render_to_texture")===!1){let Oe=!1;for(let at=0,xt=z.length;at<xt;at++){let _t=z[at],{object:ot,geometry:kt,material:De,group:en}=_t;if(De.side===jt&&ot.layers.test(W.layers)){let tt=De.side;De.side=zt,De.needsUpdate=!0,Su(ot,X,W,kt,De,en),De.side=tt,De.needsUpdate=!0,Oe=!0}}Oe===!0&&(N.updateMultisampleRenderTarget(xe),N.updateRenderTargetMipmap(xe))}T.setRenderTarget(ye,Le,Ue),T.setClearColor(Y,le),Je!==void 0&&(W.viewport=Je),T.toneMapping=Xe}function Ca(S,z,X){let W=z.isScene===!0?z.overrideMaterial:null;for(let V=0,xe=S.length;V<xe;V++){let Ee=S[V],{object:ye,geometry:Le,group:Ue}=Ee,Xe=Ee.material;Xe.allowOverride===!0&&W!==null&&(Xe=W),ye.layers.test(X.layers)&&Su(ye,z,X,Le,Xe,Ue)}}function Su(S,z,X,W,V,xe){S.onBeforeRender(T,z,X,W,V,xe),S.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),V.onBeforeRender(T,z,X,W,S,xe),V.transparent===!0&&V.side===jt&&V.forceSinglePass===!1?(V.side=zt,V.needsUpdate=!0,T.renderBufferDirect(X,z,W,V,S,xe),V.side=Tn,V.needsUpdate=!0,T.renderBufferDirect(X,z,W,V,S,xe),V.side=jt):T.renderBufferDirect(X,z,W,V,S,xe),S.onAfterRender(T,z,X,W,V,xe)}function Ra(S,z,X){z.isScene!==!0&&(z=se);let W=_.get(S),V=C.state.lights,xe=C.state.shadowsArray,Ee=V.state.version,ye=pe.getParameters(S,V.state,xe,z,X),Le=pe.getProgramCacheKey(ye),Ue=W.programs;W.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?z.environment:null,W.fog=z.fog;let Xe=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;W.envMap=$.get(S.envMap||W.environment,Xe),W.envMapRotation=W.environment!==null&&S.envMap===null?z.environmentRotation:S.envMapRotation,Ue===void 0&&(S.addEventListener("dispose",it),Ue=new Map,W.programs=Ue);let Je=Ue.get(Le);if(Je!==void 0){if(W.currentProgram===Je&&W.lightsStateVersion===Ee)return Eu(S,ye),Je}else ye.uniforms=pe.getUniforms(S),S.onBeforeCompile(ye,T),Je=pe.acquireProgram(ye,Le),Ue.set(Le,Je),W.uniforms=ye.uniforms;let Oe=W.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Oe.clippingPlanes=ue.uniform),Eu(S,ye),W.needsLights=ip(S),W.lightsStateVersion=Ee,W.needsLights&&(Oe.ambientLightColor.value=V.state.ambient,Oe.lightProbe.value=V.state.probe,Oe.directionalLights.value=V.state.directional,Oe.directionalLightShadows.value=V.state.directionalShadow,Oe.spotLights.value=V.state.spot,Oe.spotLightShadows.value=V.state.spotShadow,Oe.rectAreaLights.value=V.state.rectArea,Oe.ltc_1.value=V.state.rectAreaLTC1,Oe.ltc_2.value=V.state.rectAreaLTC2,Oe.pointLights.value=V.state.point,Oe.pointLightShadows.value=V.state.pointShadow,Oe.hemisphereLights.value=V.state.hemi,Oe.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Oe.spotLightMatrix.value=V.state.spotLightMatrix,Oe.spotLightMap.value=V.state.spotLightMap,Oe.pointShadowMatrix.value=V.state.pointShadowMatrix),W.currentProgram=Je,W.uniformsList=null,Je}function Tu(S){if(S.uniformsList===null){let z=S.currentProgram.getUniforms();S.uniformsList=cr.seqWithValue(z.seq,S.uniforms)}return S.uniformsList}function Eu(S,z){let X=_.get(S);X.outputColorSpace=z.outputColorSpace,X.batching=z.batching,X.batchingColor=z.batchingColor,X.instancing=z.instancing,X.instancingColor=z.instancingColor,X.instancingMorph=z.instancingMorph,X.skinning=z.skinning,X.morphTargets=z.morphTargets,X.morphNormals=z.morphNormals,X.morphColors=z.morphColors,X.morphTargetsCount=z.morphTargetsCount,X.numClippingPlanes=z.numClippingPlanes,X.numIntersection=z.numClipIntersection,X.vertexAlphas=z.vertexAlphas,X.vertexTangents=z.vertexTangents,X.toneMapping=z.toneMapping}function tp(S,z,X,W,V){z.isScene!==!0&&(z=se),N.resetTextureUnits();let xe=z.fog,Ee=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?z.environment:null,ye=B===null?T.outputColorSpace:B.isXRRenderTarget===!0?B.texture.colorSpace:Ot,Le=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Ue=$.get(W.envMap||Ee,Le),Xe=W.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Je=!!X.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Oe=!!X.morphAttributes.position,at=!!X.morphAttributes.normal,xt=!!X.morphAttributes.color,_t=Cn;W.toneMapped&&(B===null||B.isXRRenderTarget===!0)&&(_t=T.toneMapping);let ot=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,kt=ot!==void 0?ot.length:0,De=_.get(W),en=C.state.lights;if(Ce===!0&&(Se===!0||S!==k)){let Pt=S===k&&W.id===L;ue.setState(W,S,Pt)}let tt=!1;W.version===De.__version?(De.needsLights&&De.lightsStateVersion!==en.state.version||De.outputColorSpace!==ye||V.isBatchedMesh&&De.batching===!1||!V.isBatchedMesh&&De.batching===!0||V.isBatchedMesh&&De.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&De.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&De.instancing===!1||!V.isInstancedMesh&&De.instancing===!0||V.isSkinnedMesh&&De.skinning===!1||!V.isSkinnedMesh&&De.skinning===!0||V.isInstancedMesh&&De.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&De.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&De.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&De.instancingMorph===!1&&V.morphTexture!==null||De.envMap!==Ue||W.fog===!0&&De.fog!==xe||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==ue.numPlanes||De.numIntersection!==ue.numIntersection)||De.vertexAlphas!==Xe||De.vertexTangents!==Je||De.morphTargets!==Oe||De.morphNormals!==at||De.morphColors!==xt||De.toneMapping!==_t||De.morphTargetsCount!==kt)&&(tt=!0):(tt=!0,De.__version=W.version);let _n=De.currentProgram;tt===!0&&(_n=Ra(W,z,V));let Pn=!1,Vi=!1,xs=!1,ht=_n.getUniforms(),Nt=De.uniforms;if(fe.useProgram(_n.program)&&(Pn=!0,Vi=!0,xs=!0),W.id!==L&&(L=W.id,Vi=!0),Pn||k!==S){fe.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),ht.setValue(A,"projectionMatrix",S.projectionMatrix),ht.setValue(A,"viewMatrix",S.matrixWorldInverse);let gi=ht.map.cameraPosition;gi!==void 0&&gi.setValue(A,Be.setFromMatrixPosition(S.matrixWorld)),Ve.logarithmicDepthBuffer&&ht.setValue(A,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&ht.setValue(A,"isOrthographic",S.isOrthographicCamera===!0),k!==S&&(k=S,Vi=!0,xs=!0)}if(De.needsLights&&(en.state.directionalShadowMap.length>0&&ht.setValue(A,"directionalShadowMap",en.state.directionalShadowMap,N),en.state.spotShadowMap.length>0&&ht.setValue(A,"spotShadowMap",en.state.spotShadowMap,N),en.state.pointShadowMap.length>0&&ht.setValue(A,"pointShadowMap",en.state.pointShadowMap,N)),V.isSkinnedMesh){ht.setOptional(A,V,"bindMatrix"),ht.setOptional(A,V,"bindMatrixInverse");let Pt=V.skeleton;Pt&&(Pt.boneTexture===null&&Pt.computeBoneTexture(),ht.setValue(A,"boneTexture",Pt.boneTexture,N))}V.isBatchedMesh&&(ht.setOptional(A,V,"batchingTexture"),ht.setValue(A,"batchingTexture",V._matricesTexture,N),ht.setOptional(A,V,"batchingIdTexture"),ht.setValue(A,"batchingIdTexture",V._indirectTexture,N),ht.setOptional(A,V,"batchingColorTexture"),V._colorsTexture!==null&&ht.setValue(A,"batchingColorTexture",V._colorsTexture,N));let mi=X.morphAttributes;if((mi.position!==void 0||mi.normal!==void 0||mi.color!==void 0)&&Te.update(V,X,_n),(Vi||De.receiveShadow!==V.receiveShadow)&&(De.receiveShadow=V.receiveShadow,ht.setValue(A,"receiveShadow",V.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&z.environment!==null&&(Nt.envMapIntensity.value=z.environmentIntensity),Nt.dfgLUT!==void 0&&(Nt.dfgLUT.value=My()),Vi&&(ht.setValue(A,"toneMappingExposure",T.toneMappingExposure),De.needsLights&&np(Nt,xs),xe&&W.fog===!0&&Fe.refreshFogUniforms(Nt,xe),Fe.refreshMaterialUniforms(Nt,W,Me,ae,C.state.transmissionRenderTarget[S.id]),cr.upload(A,Tu(De),Nt,N)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(cr.upload(A,Tu(De),Nt,N),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&ht.setValue(A,"center",V.center),ht.setValue(A,"modelViewMatrix",V.modelViewMatrix),ht.setValue(A,"normalMatrix",V.normalMatrix),ht.setValue(A,"modelMatrix",V.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let Pt=W.uniformsGroups;for(let gi=0,ys=Pt.length;gi<ys;gi++){let Au=Pt[gi];Ae.update(Au,_n),Ae.bind(Au,_n)}}return _n}function np(S,z){S.ambientLightColor.needsUpdate=z,S.lightProbe.needsUpdate=z,S.directionalLights.needsUpdate=z,S.directionalLightShadows.needsUpdate=z,S.pointLights.needsUpdate=z,S.pointLightShadows.needsUpdate=z,S.spotLights.needsUpdate=z,S.spotLightShadows.needsUpdate=z,S.rectAreaLights.needsUpdate=z,S.hemisphereLights.needsUpdate=z}function ip(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return G},this.getRenderTarget=function(){return B},this.setRenderTargetTextures=function(S,z,X){let W=_.get(S);W.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),_.get(S.texture).__webglTexture=z,_.get(S.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:X,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,z){let X=_.get(S);X.__webglFramebuffer=z,X.__useDefaultFramebuffer=z===void 0};let sp=A.createFramebuffer();this.setRenderTarget=function(S,z=0,X=0){B=S,R=z,G=X;let W=null,V=!1,xe=!1;if(S){let ye=_.get(S);if(ye.__useDefaultFramebuffer!==void 0){fe.bindFramebuffer(A.FRAMEBUFFER,ye.__webglFramebuffer),F.copy(S.viewport),U.copy(S.scissor),ie=S.scissorTest,fe.viewport(F),fe.scissor(U),fe.setScissorTest(ie),L=-1;return}else if(ye.__webglFramebuffer===void 0)N.setupRenderTarget(S);else if(ye.__hasExternalTextures)N.rebindTextures(S,_.get(S.texture).__webglTexture,_.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let Xe=S.depthTexture;if(ye.__boundDepthTexture!==Xe){if(Xe!==null&&_.has(Xe)&&(S.width!==Xe.image.width||S.height!==Xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");N.setupDepthRenderbuffer(S)}}let Le=S.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(xe=!0);let Ue=_.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ue[z])?W=Ue[z][X]:W=Ue[z],V=!0):S.samples>0&&N.useMultisampledRTT(S)===!1?W=_.get(S).__webglMultisampledFramebuffer:Array.isArray(Ue)?W=Ue[X]:W=Ue,F.copy(S.viewport),U.copy(S.scissor),ie=S.scissorTest}else F.copy(O).multiplyScalar(Me).floor(),U.copy(Q).multiplyScalar(Me).floor(),ie=q;if(X!==0&&(W=sp),fe.bindFramebuffer(A.FRAMEBUFFER,W)&&fe.drawBuffers(S,W),fe.viewport(F),fe.scissor(U),fe.setScissorTest(ie),V){let ye=_.get(S.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+z,ye.__webglTexture,X)}else if(xe){let ye=z;for(let Le=0;Le<S.textures.length;Le++){let Ue=_.get(S.textures[Le]);A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0+Le,Ue.__webglTexture,X,ye)}}else if(S!==null&&X!==0){let ye=_.get(S.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,ye.__webglTexture,X)}L=-1},this.readRenderTargetPixels=function(S,z,X,W,V,xe,Ee,ye=0){if(!(S&&S.isWebGLRenderTarget)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Le=_.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ee!==void 0&&(Le=Le[Ee]),Le){fe.bindFramebuffer(A.FRAMEBUFFER,Le);try{let Ue=S.textures[ye],Xe=Ue.format,Je=Ue.type;if(S.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+ye),!Ve.textureFormatReadable(Xe)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ve.textureTypeReadable(Je)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=S.width-W&&X>=0&&X<=S.height-V&&A.readPixels(z,X,W,V,me.convert(Xe),me.convert(Je),xe)}finally{let Ue=B!==null?_.get(B).__webglFramebuffer:null;fe.bindFramebuffer(A.FRAMEBUFFER,Ue)}}},this.readRenderTargetPixelsAsync=async function(S,z,X,W,V,xe,Ee,ye=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Le=_.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ee!==void 0&&(Le=Le[Ee]),Le)if(z>=0&&z<=S.width-W&&X>=0&&X<=S.height-V){fe.bindFramebuffer(A.FRAMEBUFFER,Le);let Ue=S.textures[ye],Xe=Ue.format,Je=Ue.type;if(S.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+ye),!Ve.textureFormatReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ve.textureTypeReadable(Je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Oe=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,Oe),A.bufferData(A.PIXEL_PACK_BUFFER,xe.byteLength,A.STREAM_READ),A.readPixels(z,X,W,V,me.convert(Xe),me.convert(Je),0);let at=B!==null?_.get(B).__webglFramebuffer:null;fe.bindFramebuffer(A.FRAMEBUFFER,at);let xt=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);return A.flush(),await jd(A,xt,4),A.bindBuffer(A.PIXEL_PACK_BUFFER,Oe),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,xe),A.deleteBuffer(Oe),A.deleteSync(xt),xe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,z=null,X=0){let W=Math.pow(2,-X),V=Math.floor(S.image.width*W),xe=Math.floor(S.image.height*W),Ee=z!==null?z.x:0,ye=z!==null?z.y:0;N.setTexture2D(S,0),A.copyTexSubImage2D(A.TEXTURE_2D,X,0,0,Ee,ye,V,xe),fe.unbindTexture()};let rp=A.createFramebuffer(),ap=A.createFramebuffer();this.copyTextureToTexture=function(S,z,X=null,W=null,V=0,xe=0){let Ee,ye,Le,Ue,Xe,Je,Oe,at,xt,_t=S.isCompressedTexture?S.mipmaps[xe]:S.image;if(X!==null)Ee=X.max.x-X.min.x,ye=X.max.y-X.min.y,Le=X.isBox3?X.max.z-X.min.z:1,Ue=X.min.x,Xe=X.min.y,Je=X.isBox3?X.min.z:0;else{let Nt=Math.pow(2,-V);Ee=Math.floor(_t.width*Nt),ye=Math.floor(_t.height*Nt),S.isDataArrayTexture?Le=_t.depth:S.isData3DTexture?Le=Math.floor(_t.depth*Nt):Le=1,Ue=0,Xe=0,Je=0}W!==null?(Oe=W.x,at=W.y,xt=W.z):(Oe=0,at=0,xt=0);let ot=me.convert(z.format),kt=me.convert(z.type),De;z.isData3DTexture?(N.setTexture3D(z,0),De=A.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(N.setTexture2DArray(z,0),De=A.TEXTURE_2D_ARRAY):(N.setTexture2D(z,0),De=A.TEXTURE_2D),A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,z.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,z.unpackAlignment);let en=A.getParameter(A.UNPACK_ROW_LENGTH),tt=A.getParameter(A.UNPACK_IMAGE_HEIGHT),_n=A.getParameter(A.UNPACK_SKIP_PIXELS),Pn=A.getParameter(A.UNPACK_SKIP_ROWS),Vi=A.getParameter(A.UNPACK_SKIP_IMAGES);A.pixelStorei(A.UNPACK_ROW_LENGTH,_t.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,_t.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,Ue),A.pixelStorei(A.UNPACK_SKIP_ROWS,Xe),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Je);let xs=S.isDataArrayTexture||S.isData3DTexture,ht=z.isDataArrayTexture||z.isData3DTexture;if(S.isDepthTexture){let Nt=_.get(S),mi=_.get(z),Pt=_.get(Nt.__renderTarget),gi=_.get(mi.__renderTarget);fe.bindFramebuffer(A.READ_FRAMEBUFFER,Pt.__webglFramebuffer),fe.bindFramebuffer(A.DRAW_FRAMEBUFFER,gi.__webglFramebuffer);for(let ys=0;ys<Le;ys++)xs&&(A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,_.get(S).__webglTexture,V,Je+ys),A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,_.get(z).__webglTexture,xe,xt+ys)),A.blitFramebuffer(Ue,Xe,Ee,ye,Oe,at,Ee,ye,A.DEPTH_BUFFER_BIT,A.NEAREST);fe.bindFramebuffer(A.READ_FRAMEBUFFER,null),fe.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else if(V!==0||S.isRenderTargetTexture||_.has(S)){let Nt=_.get(S),mi=_.get(z);fe.bindFramebuffer(A.READ_FRAMEBUFFER,rp),fe.bindFramebuffer(A.DRAW_FRAMEBUFFER,ap);for(let Pt=0;Pt<Le;Pt++)xs?A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Nt.__webglTexture,V,Je+Pt):A.framebufferTexture2D(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Nt.__webglTexture,V),ht?A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,mi.__webglTexture,xe,xt+Pt):A.framebufferTexture2D(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,mi.__webglTexture,xe),V!==0?A.blitFramebuffer(Ue,Xe,Ee,ye,Oe,at,Ee,ye,A.COLOR_BUFFER_BIT,A.NEAREST):ht?A.copyTexSubImage3D(De,xe,Oe,at,xt+Pt,Ue,Xe,Ee,ye):A.copyTexSubImage2D(De,xe,Oe,at,Ue,Xe,Ee,ye);fe.bindFramebuffer(A.READ_FRAMEBUFFER,null),fe.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else ht?S.isDataTexture||S.isData3DTexture?A.texSubImage3D(De,xe,Oe,at,xt,Ee,ye,Le,ot,kt,_t.data):z.isCompressedArrayTexture?A.compressedTexSubImage3D(De,xe,Oe,at,xt,Ee,ye,Le,ot,_t.data):A.texSubImage3D(De,xe,Oe,at,xt,Ee,ye,Le,ot,kt,_t):S.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,xe,Oe,at,Ee,ye,ot,kt,_t.data):S.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,xe,Oe,at,_t.width,_t.height,ot,_t.data):A.texSubImage2D(A.TEXTURE_2D,xe,Oe,at,Ee,ye,ot,kt,_t);A.pixelStorei(A.UNPACK_ROW_LENGTH,en),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,tt),A.pixelStorei(A.UNPACK_SKIP_PIXELS,_n),A.pixelStorei(A.UNPACK_SKIP_ROWS,Pn),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Vi),xe===0&&z.generateMipmaps&&A.generateMipmap(De),fe.unbindTexture()},this.initRenderTarget=function(S){_.get(S).__webglFramebuffer===void 0&&N.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?N.setTextureCube(S,0):S.isData3DTexture?N.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?N.setTexture2DArray(S,0):N.setTexture2D(S,0),fe.unbindTexture()},this.resetState=function(){R=0,G=0,B=null,fe.reset(),de.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}}});function Ey(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Ay(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function wy(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Of),this.state=ct.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Cy(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Di.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ct.DOLLY;break;case Di.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ct.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ct.ROTATE}break;case Di.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ct.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ct.PAN}break;default:this.state=ct.NONE}this.state!==ct.NONE&&this.dispatchEvent(zh)}function Ry(i){switch(this.state){case ct.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ct.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ct.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Iy(i){this.enabled===!1||this.enableZoom===!1||this.state!==ct.NONE||(i.preventDefault(),this.dispatchEvent(zh),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Of))}function Py(i){this.enabled!==!1&&this._handleKeyDown(i)}function Ly(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Ni.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ct.TOUCH_ROTATE;break;case Ni.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ct.TOUCH_PAN;break;default:this.state=ct.NONE}break;case 2:switch(this.touches.TWO){case Ni.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ct.TOUCH_DOLLY_PAN;break;case Ni.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ct.TOUCH_DOLLY_ROTATE;break;default:this.state=ct.NONE}break;default:this.state=ct.NONE}this.state!==ct.NONE&&this.dispatchEvent(zh)}function Dy(i){switch(this._trackPointer(i),this.state){case ct.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ct.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ct.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ct.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ct.NONE}}function Ny(i){this.enabled!==!1&&i.preventDefault()}function Uy(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Fy(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Uf,zh,Of,Yl,Ff,Ty,It,Qt,ct,Bh,Zl,Bf=Ln(()=>{dr();Uf={type:"change"},zh={type:"start"},Of={type:"end"},Yl=new ci,Ff=new dn,Ty=Math.cos(70*pi.DEG2RAD),It=new I,Qt=2*Math.PI,ct={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Bh=1e-6,Zl=class extends pa{constructor(e,t=null){super(e,t),this.state=ct.NONE,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Di.ROTATE,MIDDLE:Di.DOLLY,RIGHT:Di.PAN},this.touches={ONE:Ni.ROTATE,TWO:Ni.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new Gt,this._lastTargetPosition=new I,this._quat=new Gt().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new nr,this._sphericalDelta=new nr,this._scale=1,this._panOffset=new I,this._rotateStart=new re,this._rotateEnd=new re,this._rotateDelta=new re,this._panStart=new re,this._panEnd=new re,this._panDelta=new re,this._dollyStart=new re,this._dollyEnd=new re,this._dollyDelta=new re,this._dollyDirection=new I,this._mouse=new re,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Ay.bind(this),this._onPointerDown=Ey.bind(this),this._onPointerUp=wy.bind(this),this._onContextMenu=Ny.bind(this),this._onMouseWheel=Iy.bind(this),this._onKeyDown=Py.bind(this),this._onTouchStart=Ly.bind(this),this._onTouchMove=Dy.bind(this),this._onMouseDown=Cy.bind(this),this._onMouseMove=Ry.bind(this),this._interceptControlDown=Uy.bind(this),this._interceptControlUp=Fy.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Uf),this.update(),this.state=ct.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;It.copy(t).sub(this.target),It.applyQuaternion(this._quat),this._spherical.setFromVector3(It),this.autoRotate&&this.state===ct.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Qt:n>Math.PI&&(n-=Qt),s<-Math.PI?s+=Qt:s>Math.PI&&(s-=Qt),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(It.setFromSpherical(this._spherical),It.applyQuaternion(this._quatInverse),t.copy(this.target).add(It),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=It.length();a=this._clampDistance(o*this._scale);let l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let o=new I(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new I(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=It.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Yl.origin.copy(this.object.position),Yl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Yl.direction))<Ty?this.object.lookAt(this.target):(Ff.setFromNormalAndCoplanarPoint(this.object.up,this.target),Yl.intersectPlane(Ff,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Bh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Bh||this._lastTargetPosition.distanceToSquared(this.target)>Bh?(this.dispatchEvent(Uf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Qt/60*this.autoRotateSpeed*e:Qt/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){It.setFromMatrixColumn(t,0),It.multiplyScalar(-e),this._panOffset.add(It)}_panUp(e,t){this.screenSpacePanning===!0?It.setFromMatrixColumn(t,1):(It.setFromMatrixColumn(t,0),It.crossVectors(this.object.up,It)),It.multiplyScalar(e),this._panOffset.add(It)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;It.copy(s).sub(this.target);let r=It.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Qt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Qt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Qt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Qt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new re,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}});function fr(i){return new ra({color:0,emissive:16777215,emissiveIntensity:i})}var Kl,zf=Ln(()=>{dr();Kl=class extends ts{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let e=new An;e.deleteAttribute("uv");let t=new zn({side:zt}),n=new zn,s=new ls(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new lt(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new ns(e,n,6),o=new pt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let l=new lt(e,fr(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new lt(e,fr(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new lt(e,fr(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let u=new lt(e,fr(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new lt(e,fr(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new lt(e,fr(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}}});function kh(i,e){if(e===ph)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===or||e===Ma){let t=i.getIndex();if(t===null){let a=[],o=i.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);i.setIndex(a),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===or)for(let a=1;a<=n;a++)s.push(t.getX(0)),s.push(t.getX(a)),s.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(s.push(t.getX(a)),s.push(t.getX(a+1)),s.push(t.getX(a+2))):(s.push(t.getX(a+2)),s.push(t.getX(a+1)),s.push(t.getX(a)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}var kf=Ln(()=>{dr()});function Vf(i){let e=new Map,t=new Map,n=i.clone();return Hf(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Hf(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)Hf(i.children[n],e.children[n],t)}var Gf=Ln(()=>{});function Oy(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function bt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}function ky(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new zn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Tn})),i.DefaultMaterial}function gs(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Zn(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Vy(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(s=!0),u.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){let u=e[c];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):i.attributes.position;a.push(d)}if(s){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):i.attributes.normal;o.push(d)}if(r){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):i.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let h=c[0],u=c[1],d=c[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=u),r&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function Hy(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Gy(i){let e,t=i.extensions&&i.extensions[Qe.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Gh(t.attributes):e=i.indices+":"+Gh(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Gh(i.targets[n]);return e}function Gh(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function fu(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Wy(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}function qy(i,e,t){let n=e.attributes,s=new $t;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new I(l[0],l[1],l[2]),new I(c[0],c[1],c[2])),o.normalized){let h=fu(pr[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let o=new I,l=new I;for(let c=0,h=r.length;c<h;c++){let u=r[c];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,g=d.max;if(f!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),d.normalized){let x=fu(pr[d.componentType]);l.multiplyScalar(x)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;let a=new Zt;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function $f(i,e,t){let n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){i.setAttribute(o,l)})}for(let a in n){let o=du[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){let a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return et.workingColorSpace!==Ot&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${et.workingColorSpace}" not supported.`),Zn(i,e),qy(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?Vy(i,e.targets,t):i})}var jl,Qe,Wh,Xh,qh,$h,Yh,Zh,Kh,jh,Jh,Qh,eu,tu,nu,iu,su,ru,Jl,au,Yf,Aa,Wf,ou,lu,cu,hu,Ql,By,uu,gn,pr,Xf,qf,Vh,du,Bi,zy,Hh,Xy,pu,Zf=Ln(()=>{dr();kf();Gf();jl=class extends Wn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new $h(t)}),this.register(function(t){return new Yh(t)}),this.register(function(t){return new iu(t)}),this.register(function(t){return new su(t)}),this.register(function(t){return new ru(t)}),this.register(function(t){return new Kh(t)}),this.register(function(t){return new jh(t)}),this.register(function(t){return new Jh(t)}),this.register(function(t){return new Qh(t)}),this.register(function(t){return new qh(t)}),this.register(function(t){return new eu(t)}),this.register(function(t){return new Zh(t)}),this.register(function(t){return new nu(t)}),this.register(function(t){return new tu(t)}),this.register(function(t){return new Wh(t)}),this.register(function(t){return new Jl(t,Qe.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Jl(t,Qe.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new au(t)})}load(e,t,n,s){let r=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=di.extractUrlBase(e);a=di.resolveURL(c,this.path)}else a=di.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new tr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Yf){try{a[Qe.KHR_BINARY_GLTF]=new ou(e)}catch(u){s&&s(u);return}r=JSON.parse(a[Qe.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new pu(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case Qe.KHR_MATERIALS_UNLIT:a[u]=new Xh;break;case Qe.KHR_DRACO_MESH_COMPRESSION:a[u]=new lu(r,this.dracoLoader);break;case Qe.KHR_TEXTURE_TRANSFORM:a[u]=new cu;break;case Qe.KHR_MESH_QUANTIZATION:a[u]=new hu;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};Qe={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Wh=class{constructor(e){this.parser=e,this.name=Qe.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new ke(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Ot);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Li(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new ls(h),c.distance=u;break;case"spot":c=new da(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Zn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}},Xh=class{constructor(){this.name=Qe.KHR_MATERIALS_UNLIT}getMaterialType(){return En}extendParams(e,t,n){let s=[];e.color=new ke(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Ot),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,wt))}return Promise.all(s)}},qh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=bt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},$h=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return bt(this.parser,e,this.name)!==null?Bt:null}extendMaterialParams(e,t){let n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new re(r,r)}return Promise.all(s)}},Yh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_DISPERSION}getMaterialType(e){return bt(this.parser,e,this.name)!==null?Bt:null}extendMaterialParams(e,t){let n=bt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Zh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return bt(this.parser,e,this.name)!==null?Bt:null}extendMaterialParams(e,t){let n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},Kh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_SHEEN}getMaterialType(e){return bt(this.parser,e,this.name)!==null?Bt:null}extendMaterialParams(e,t){let n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new ke(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Ot)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,wt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},jh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return bt(this.parser,e,this.name)!==null?Bt:null}extendMaterialParams(e,t){let n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},Jh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_VOLUME}getMaterialType(e){return bt(this.parser,e,this.name)!==null?Bt:null}extendMaterialParams(e,t){let n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new ke().setRGB(r[0],r[1],r[2],Ot),Promise.all(s)}},Qh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_IOR}getMaterialType(e){return bt(this.parser,e,this.name)!==null?Bt:null}extendMaterialParams(e,t){let n=bt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5),Promise.resolve()}},eu=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_SPECULAR}getMaterialType(e){return bt(this.parser,e,this.name)!==null?Bt:null}extendMaterialParams(e,t){let n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new ke().setRGB(r[0],r[1],r[2],Ot),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,wt)),Promise.all(s)}},tu=class{constructor(e){this.parser=e,this.name=Qe.EXT_MATERIALS_BUMP}getMaterialType(e){return bt(this.parser,e,this.name)!==null?Bt:null}extendMaterialParams(e,t){let n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},nu=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return bt(this.parser,e,this.name)!==null?Bt:null}extendMaterialParams(e,t){let n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},iu=class{constructor(e){this.parser=e,this.name=Qe.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}},su=class{constructor(e){this.parser=e,this.name=Qe.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},ru=class{constructor(e){this.parser=e,this.name=Qe.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},Jl=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){let l=s.byteOffset||0,c=s.byteLength||0,h=s.count,u=s.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){let f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,s.mode,s.filter),f})})}else return null}},au=class{constructor(e){this.name=Qe.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==gn.TRIANGLES&&c.mode!==gn.TRIANGLE_STRIP&&c.mode!==gn.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(let g of u){let x=new qe,m=new I,p=new Gt,v=new I(1,1,1),M=new ns(g.geometry,g.material,d);for(let b=0;b<d;b++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,b),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,b),l.SCALE&&v.fromBufferAttribute(l.SCALE,b),M.setMatrixAt(b,x.compose(m,p,v));for(let b in l)if(b==="_COLOR_0"){let C=l[b];M.instanceColor=new Ci(C.array,C.itemSize,C.normalized)}else b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"&&g.geometry.setAttribute(b,l[b]);pt.prototype.copy.call(M,g),this.parser.assignFinalMaterial(M),f.push(M)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},Yf="glTF",Aa=12,Wf={JSON:1313821514,BIN:5130562},ou=class{constructor(e){this.name=Qe.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Aa),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Yf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-Aa,r=new DataView(e,Aa),a=0;for(;a<s;){let o=r.getUint32(a,!0);a+=4;let l=r.getUint32(a,!0);if(a+=4,l===Wf.JSON){let c=new Uint8Array(e,Aa+a,o);this.content=n.decode(c)}else if(l===Wf.BIN){let c=Aa+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},lu=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Qe.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let h in a){let u=du[h]||h.toLowerCase();o[u]=a[h]}for(let h in e.attributes){let u=du[h]||h.toLowerCase();if(a[h]!==void 0){let d=n.accessors[e.attributes[h]],f=pr[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){s.decodeDracoFile(h,function(f){for(let g in f.attributes){let x=f.attributes[g],m=l[g];m!==void 0&&(x.normalized=m)}u(f)},o,c,Ot,d)})})}},cu=class{constructor(){this.name=Qe.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},hu=class{constructor(){this.name=Qe.KHR_MESH_QUANTIZATION}},Ql=class extends kn{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=s-t,u=(n-t)/h,d=u*u,f=d*u,g=e*c,x=g-c,m=-2*f+3*d,p=f-d,v=1-m,M=p-d+u;for(let b=0;b!==o;b++){let C=a[x+b+o],w=a[x+b+l]*h,P=a[g+b+o],y=a[g+b]*h;r[b]=v*C+M*w+m*P+p*y}return r}},By=new Gt,uu=class extends Ql{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return By.fromArray(r).normalize().toArray(r),r}},gn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},pr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Xf={9728:yt,9729:vt,9984:Qo,9985:sr,9986:hs,9987:Rn},qf={33071:fn,33648:zs,10497:wi},Vh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},du={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Bi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},zy={CUBICSPLINE:void 0,LINEAR:Qi,STEP:Ji},Hh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};Xy=new qe,pu=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Oy,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?this.textureLoader=new la(this.options.manager):this.textureLoader=new fa(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new tr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return gs(r,o,s),Zn(o,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,h]of a.children.entries())r(h,o.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Qe.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,a){n.load(di.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let a=Vh[s.type],o=pr[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new Tt(c,a,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){let o=a[0],l=Vh[s.type],c=pr[s.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0,x,m;if(f&&f!==u){let p=Math.floor(d/f),v="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count,M=t.cache.get(v);M||(x=new c(o,p*f,s.count*f/h),M=new Xs(x,f/h),t.cache.add(v,M)),m=new qs(M,l,d%f/h,g)}else o===null?x=new c(s.count*l):x=new c(o,d,s.count*l),m=new Tt(x,l,g);if(s.sparse!==void 0){let p=Vh.SCALAR,v=pr[s.sparse.indices.componentType],M=s.sparse.indices.byteOffset||0,b=s.sparse.values.byteOffset||0,C=new v(a[1],M,s.sparse.count*p),w=new c(a[2],b,s.sparse.count*l);o!==null&&(m=new Tt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let P=0,y=C.length;P<y;P++){let T=C[P];if(m.setX(T,w[P*l]),l>=2&&m.setY(T,w[P*l+1]),l>=3&&m.setZ(T,w[P*l+2]),l>=4&&m.setW(T,w[P*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r],o=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){let s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);let d=(r.samplers||{})[a.sampler]||{};return h.magFilter=Xf[d.magFilter]||vt,h.minFilter=Xf[d.minFilter]||Rn,h.wrapS=qf[d.wrapS]||wi,h.wrapT=qf[d.wrapT]||wi,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==yt&&h.minFilter!==vt,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let a=s.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){c=!0;let d=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let g=d;t.isImageBitmapLoader===!0&&(g=function(x){let m=new Dt(x);m.needsUpdate=!0,d(m)}),t.load(di.resolveURL(u,r.path),g,void 0,f)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),Zn(u,a),u.userData.mimeType=a.mimeType||Wy(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[Qe.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[Qe.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=r.associations.get(a);a=r.extensions[Qe.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new js,Wt.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Ks,Wt.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return zn}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],a,o={},l=r.extensions||{},c=[];if(l[Qe.KHR_MATERIALS_UNLIT]){let u=s[Qe.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{let u=r.pbrMetallicRoughness||{};if(o.color=new ke(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],Ot),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,wt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=jt);let h=r.alphaMode||Hh.OPAQUE;if(h===Hh.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Hh.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==En&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new re(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==En&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==En){let u=r.emissiveFactor;o.emissive=new ke().setRGB(u[0],u[1],u[2],Ot)}return r.emissiveTexture!==void 0&&a!==En&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,wt)),Promise.all(c).then(function(){let u=new a(o);return r.name&&(u.name=r.name),Zn(u,r),t.associations.set(u,{materials:e}),r.extensions&&gs(s,u,r),u})}createUniqueName(e){let t=ut.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[Qe.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return $f(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],h=Gy(c),u=s[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[Qe.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=$f(new Et,c,t),s[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let h=a[l].material===void 0?ky(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,g=h.length;f<g;f++){let x=h[f],m=a[f],p,v=c[f];if(m.mode===gn.TRIANGLES||m.mode===gn.TRIANGLE_STRIP||m.mode===gn.TRIANGLE_FAN||m.mode===void 0)p=r.isSkinnedMesh===!0?new Hr(x,v):new lt(x,v),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===gn.TRIANGLE_STRIP?p.geometry=kh(p.geometry,Ma):m.mode===gn.TRIANGLE_FAN&&(p.geometry=kh(p.geometry,or));else if(m.mode===gn.LINES)p=new Wr(x,v);else if(m.mode===gn.LINE_STRIP)p=new is(x,v);else if(m.mode===gn.LINE_LOOP)p=new Xr(x,v);else if(m.mode===gn.POINTS)p=new qr(x,v);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&Hy(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),Zn(p,r),m.extensions&&gs(s,p,m),t.assignFinalMaterial(p),u.push(p)}for(let f=0,g=u.length;f<g;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&gs(s,u[0],r),u[0];let d=new Yt;r.extensions&&gs(s,d,r),t.associations.set(d,{meshes:e});for(let f=0,g=u.length;f<g;f++)d.add(u[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new St(pi.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new Pi(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Zn(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),a=s,o=[],l=[];for(let c=0,h=a.length;c<h;c++){let u=a[c];if(u){o.push(u);let d=new qe;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Gr(o,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=s.channels.length;u<d;u++){let f=s.channels[u],g=s.samplers[f.sampler],x=f.target,m=x.node,p=s.parameters!==void 0?s.parameters[g.input]:g.input,v=s.parameters!==void 0?s.parameters[g.output]:g.output;x.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",v)),c.push(g),h.push(x))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],g=u[2],x=u[3],m=u[4],p=[];for(let M=0,b=d.length;M<b;M++){let C=d[M],w=f[M],P=g[M],y=x[M],T=m[M];if(C===void 0)continue;C.updateMatrix&&C.updateMatrix();let H=n._createAnimationTracks(C,w,P,y,T);if(H)for(let R=0;R<H.length;R++)p.push(H[R])}let v=new oa(r,void 0,p);return Zn(v,s),v})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){let h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Xy)});for(let f=0,g=u.length;f<g;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){let f=h.userData.pivot,g=u[0];h.pivot=new I().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new $s:c.length>1?h=new Yt:c.length===1?h=c[0]:h=new pt,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),Zn(h,r),r.extensions&&gs(n,h,r),r.matrix!==void 0){let u=new qe;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let u=s.associations.get(h);s.associations.set(h,{...u})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new Yt;n.name&&(r.name=s.createUniqueName(n.name)),Zn(r,n),n.extensions&&gs(t,r,n);let a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){let d=l[h];d.parent!==null?r.add(Vf(d)):r.add(d)}let c=h=>{let u=new Map;for(let[d,f]of s.associations)(d instanceof Wt||d instanceof Dt)&&u.set(d,f);return h.traverse(d=>{let f=s.associations.get(d);f!=null&&u.set(d,f)}),u};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let a=[],o=e.name?e.name:e.uuid,l=[];Bi[r.path]===Bi.weights?e.traverse(function(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}):l.push(o);let c;switch(Bi[r.path]){case Bi.weights:c=Vn;break;case Bi.rotation:c=Hn;break;case Bi.translation:case Bi.scale:c=Gn;break;default:n.itemSize===1?c=Vn:c=Gn;break}let h=s.interpolation!==void 0?zy[s.interpolation]:Qi,u=this._getArrayFromAccessor(n);for(let d=0,f=l.length;d<f;d++){let g=new c(l[d]+"."+Bi[r.path],t.array,u,h);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),a.push(g)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=fu(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof Hn?uu:Ql;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}});var mu={};lp(mu,{createDesignRenderer:()=>$y});function $y(i){let e=new Xl({antialias:!0,alpha:!0,powerPreference:"low-power",preserveDrawingBuffer:!0});e.setPixelRatio(Math.min(devicePixelRatio,1.7)),e.setClearColor(16250868,0),e.shadowMap.enabled=!0,e.shadowMap.type=Zo,e.toneMapping=ga,e.toneMappingExposure=1,e.domElement.setAttribute("aria-label","Vista 3D interactiva de tus gafas. Arrastra para girar."),e.domElement.setAttribute("role","img"),e.domElement.tabIndex=0,i.replaceChildren(e.domElement);let t=new ts,n=new St(34,1,.1,100),s=new Zl(n,e.domElement);s.enableDamping=!1,s.enablePan=!1,s.minDistance=4.7,s.maxDistance=13,s.maxPolarAngle=Math.PI*.72,s.target.set(0,0,-.5);let r=new hr(e),a=new Kl,o=r.fromScene(a,.04);t.environment=o.texture,a.dispose(),r.dispose(),t.add(new ca(16777215,7566195,1.2));let l=new Li(16777215,2.6);l.position.set(-3,7,5),l.castShadow=!0,l.shadow.mapSize.set(1024,1024),l.shadow.camera.left=-5,l.shadow.camera.right=5,l.shadow.camera.top=5,l.shadow.camera.bottom=-5,l.shadow.bias=-.001,t.add(l);let c=new Li(16777215,2);c.position.set(5,3,-3),t.add(c);let h=new lt(new as(200,200),new sa({color:3421236,opacity:.035}));h.rotation.x=-Math.PI/2,h.position.y=-1.6,h.receiveShadow=!0,t.add(h);let u=new Yt,d=null;t.add(u);let f=!1;function g(){f||(f=!0,requestAnimationFrame(()=>{f=!1,e.render(t,n),i.dataset.camera=JSON.stringify(n.position.toArray())}))}s.addEventListener("change",g);function x(B){B.traverse(L=>{L.geometry?.dispose(),L.material&&(Array.isArray(L.material)?L.material:[L.material]).forEach(F=>{for(let U of Object.values(F))U?.isTexture&&U.dispose();F.dispose()})})}function m(B,L=!1){return new Bt({color:B,roughness:L?.23:.2,metalness:L?.8:0,clearcoat:1,clearcoatRoughness:.1,transmission:0,thickness:.35,envMapIntensity:.8})}function p(B,L,k=u){let F=new lt(B,L);return F.castShadow=!0,F.receiveShadow=!0,k.add(F),F}function v(B,L,k=1){return Qn(B,L,k).map(F=>new re(...F))}function M(B,L,k,F){let U=La(B,L,k);function ie(he,ae){let Me=new Qs(he.map(ve=>new I(...ve))),j=[],J=[],O=48;for(let ve=0;ve<=O;ve++){let Ce=ve/O,Se=Me.getPoint(Ce),Ke=pi.smoothstep(Ce,.18,1),Be=ae?U.hookWidth:pi.lerp(U.shaftWidth,U.hookWidth,Ke),ee=ae?.075:U.depth;for(let[se,te]of[[-ee,-Be/2],[ee,-Be/2],[ee,Be/2],[-ee,Be/2]])j.push(Se.x+se,Se.y+te,Se.z);if(ve<O)for(let se=0;se<4;se++){let te=ve*4+se,ge=ve*4+(se+1)%4,A=(ve+1)*4+se,ze=(ve+1)*4+(se+1)%4;J.push(te,ge,A,ge,ze,A)}}J.push(0,2,1,0,3,2);let Q=O*4;J.push(Q,Q+1,Q+2,Q,Q+2,Q+3);let q=new Et;q.setAttribute("position",new mt(j,3)),q.setIndex(J),q.computeVertexNormals(),p(q,F)}ie(U.stem,!1),ie(U.hook,!0),p(new An(.16,.14,.18),F).position.set(U.stem[0][0]-L*.05,U.stem[0][1],.035),p(new An(.11,.13,.18),m("#baa26d",!0)).position.set(...U.stem[0])}function b(B){let L=xn(B);i.dataset.renderModel=L.model,i.dataset.config=JSON.stringify(L),t.remove(u),x(u),u=new Yt,t.add(u);let k=m(Ut.find(Y=>Y.id===L.rimColor).hex),F=m(Ut.find(Y=>Y.id===L.bridgeColor).hex),U=m(Ut.find(Y=>Y.id===L.armColor).hex),ie=ei(L);for(let Y of[-1,1]){let le=v(L,Y),he=Ia(L,Y).map(Se=>new re(...Se)),ae=Math.abs(ie[Y===-1?0:1]),Me=L.model==="curvo"?Ia(L,Y).map(([Se,Ke])=>new re(Se*1.025,Ke*1.025)):le,j=new wn(Me);if(j.holes.push(new ss([...L.model==="curvo"?Ia(L,Y).map(Se=>new re(...Se)):he].reverse())),p(new Ii(j,{depth:.11+L.thickness*.009,bevelEnabled:!0,bevelSize:.018,bevelThickness:.018,bevelSegments:3,steps:1}),L.model==="curvo"?m("#bfa876",!0):k).position.set(Y*ae,0,0),L.model==="curvo"){let Se=new wn([...le.slice(0,65),...he.slice(0,65).reverse()]);p(new Ii(Se,{depth:.15,bevelEnabled:!0,bevelSize:.018,bevelThickness:.018,bevelSegments:2}),k).position.set(Y*ae,0,.02)}let O=L.use==="sol"||L.sunOptical||L.photo,Q=L.photo?Gi.find(Se=>Se.id===L.photoColor).hex:Ss.find(Se=>Se.id===L.lensColor).hex,q=new Bt({color:O?new ke(Q).multiplyScalar(.65):"#e2eeeb",transparent:!0,opacity:O?.9:.1,roughness:.1,metalness:0,clearcoat:.5,side:jt,envMapIntensity:.5});p(new na(new wn(he)),q).position.set(Y*ae,0,.035),p(new ia(.023,10,8),m("#baa26d",!0)).position.set(Y*(ae+Math.max(...le.map(Se=>Se.x))*.88),.22,.22)}for(let Y of[-1,1]){let le=Da(L,Y),he=new wn(le.outline.map(Me=>new re(...Me))),ae=p(new Ii(he,{depth:le.depth,bevelEnabled:!0,bevelSize:.025,bevelThickness:.025,bevelSegments:4}),k);ae.position.z=-le.depth+.03,ae.userData.part="nasal-pad"}for(let Y of Pa(L).bands){let le=new wn(Y.outline.map(ae=>new re(...ae))),he=p(new Ii(le,{depth:.16,bevelEnabled:!0,bevelSize:.014,bevelThickness:.014,bevelSegments:2,steps:1}),F);he.position.z=.025}i.dataset.nasalPads="2",i.dataset.measurements=JSON.stringify(ti(L)),M(L,-1,L.armStyle,U),M(L,1,L.armStyleRight,U),u.visible=!d?.visible,g()}let C="perspectiva";function w(){let B=s.target,L=n.position.clone().sub(B).normalize(),k=Math.max(9.5,3.3/(Math.tan(pi.degToRad(n.fov/2))*n.aspect)+2.3);n.position.copy(B.clone().addScaledVector(L,k)),s.update()}function P(B){C=B;let L={frente:[0,.08,1],perspectiva:[.3,.17,1],lateral:[1,.1,0]};s.target.set(0,0,-2.3),n.position.copy(s.target.clone().add(new I(...L[B]||L.perspectiva))),w(),g()}function y(){let B=i.clientWidth,L=i.clientHeight;!B||!L||(e.setSize(B,L,!1),n.aspect=B/L,n.updateProjectionMatrix(),w(),g())}let T=new ResizeObserver(y);T.observe(i),P("perspectiva"),y(),e.domElement.addEventListener("keydown",B=>{if(!["ArrowLeft","ArrowRight"].includes(B.key))return;B.preventDefault();let L=n.position.clone().sub(s.target);L.applyAxisAngle(new I(0,1,0),B.key==="ArrowLeft"?-.15:.15),n.position.copy(s.target.clone().add(L)),s.update(),g()});async function H(B){if(B.size>15*1024*1024)throw new Error("El modelo debe pesar menos de 15 MB.");let L=await B.arrayBuffer(),k=new DataView(L);if(L.byteLength<20||k.getUint32(0,!0)!==1179937895||k.getUint32(4,!0)!==2)throw new Error("Selecciona un modelo GLB 2.0 v\xE1lido.");let F=k.getUint32(12,!0);if(20+F>L.byteLength)throw new Error("El modelo GLB est\xE1 incompleto.");let U=JSON.parse(new TextDecoder().decode(new Uint8Array(L,20,F)));if([...U.buffers||[],...U.images||[]].some(ae=>ae.uri&&!ae.uri.startsWith("data:")))throw new Error("El GLB debe incluir sus texturas y geometr\xEDa, sin archivos externos.");let ie=await new Promise((ae,Me)=>new jl().parse(L,"",ae,Me)),Y=new $t().setFromObject(ie.scene),le=Y.getSize(new I),he=Math.max(le.x,le.y,le.z);if(!Number.isFinite(he)||he<=0)throw new Error("El modelo no contiene geometr\xEDa visible.");d&&(t.remove(d),x(d)),d=ie.scene,d.position.sub(Y.getCenter(new I)),d.scale.setScalar(4/he),d.position.multiplyScalar(4/he),t.add(d),d.visible=!0,u.visible=!1,g()}function R(B){d&&(d.visible=B),u.visible=!d?.visible,g()}function G(){T.disconnect(),s.dispose(),x(u),d&&x(d),o.dispose(),h.geometry.dispose(),h.material.dispose(),e.dispose()}return{update:b,setView:P,loadReference:H,showReference:R,destroy:G,canvas:e.domElement,getCameraState:()=>n.position.toArray(),getStats:()=>({meshes:u.children.length,model:i.dataset.renderModel})}}var gu=Ln(()=>{dr();Bf();zf();Zf();vr();Mr()});Mr();var xi=[{id:"solar",name:"Solar",category:"sol",shape:"square",color:"Miel transl\xFAcida",hex:"#98602f",lens:"#544d31",price:159e3,material:"Acetato",size:"51 \xB7 21 \xB7 145",tag:"SELECCI\xD3N MISCANTE",bg:"#ece9e0"},{id:"noir",name:"Noir",category:"sol",shape:"cat",color:"Negro profundo",hex:"#242422",lens:"#343a35",price:169e3,material:"Acetato",size:"53 \xB7 19 \xB7 145",tag:"",bg:"#e5e7e2"},{id:"forma",name:"Forma",category:"optica",shape:"round",color:"Champagne",hex:"#baa078",lens:"#d5d9ce",price:139e3,material:"Titanio",size:"49 \xB7 20 \xB7 140",tag:"NUEVA PERSPECTIVA",bg:"#eee6dc"},{id:"terra",name:"Terra",category:"sol",shape:"round",color:"Carey c\xE1lido",hex:"#71432d",lens:"#5c4837",price:179e3,material:"Acetato",size:"50 \xB7 22 \xB7 145",tag:"",bg:"#e9e1d5"},{id:"linea",name:"L\xEDnea",category:"optica",shape:"square",color:"Oliva transparente",hex:"#72765b",lens:"#d7ddd0",price:149e3,material:"Acetato",size:"51 \xB7 20 \xB7 145",tag:"",bg:"#e1e5dc"},{id:"aura",name:"Aura",category:"sol",shape:"cat",color:"\xC1mbar",hex:"#af713c",lens:"#705238",price:189e3,material:"Acetato",size:"52 \xB7 20 \xB7 145",tag:"EDICI\xD3N DE ESTUDIO",bg:"#eee4d6"}],Ft=i=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(i);function rc(i){let e=i.reduce((n,s)=>n+(s.custom?Wi(s.config).total:xi.find(r=>r.id===s.id)?.price||0)*s.qty,0),t=e===0||e>=2e5?0:5e3;return{subtotal:e,shipping:t,total:e+t}}function Ba(i){let e=xi.findIndex(t=>t.id===i.id);return`<span class="studio-product" role="img" aria-label="Gafas ${i.name}, ${i.color}" style="--photo-x:${e%3*50}%;--photo-y:${e<3?0:100}%"></span>`}Mr();vr();function Kf({onAdd:i,notify:e}){let t=document.querySelector("#disena");if(!t)return;let n;try{n=JSON.parse(localStorage.getItem("miscante-design")||"null")}catch{}let s=xn(n||_i),r="perspectiva",a=null,o=null,l=0,c=null,h=null,u=null,d=!1,f=!1,g="editable",x=0,m=(j,J)=>j.map(O=>`<option value="${O.id}" ${J===O.id?"selected":""}>${O.name}${O.price?` \xB7 +${Ft(O.price)}`:""}</option>`).join(""),p=(j,J,O,Q,q)=>`<label class="range-label" for="design-${j}">${J}<output id="value-${j}" for="design-${j}"></output></label><input class="design-range" id="design-${j}" data-setting="${j}" type="range" min="${O}" max="${Q}" value="${s[j]}" aria-describedby="hint-${j}"><small id="hint-${j}">${q}</small>`,v=(j,J)=>`<fieldset class="color-field"><legend>${J} <span id="color-name-${j}"></span></legend><div class="swatches">${Ut.map(O=>`<button type="button" data-color-part="${j}" data-color="${O.id}" style="--swatch:${O.hex}" aria-label="${J}: ${O.name}" aria-pressed="${s[j]===O.id}"><span></span></button>`).join("")}</div></fieldset>`;t.innerHTML=`<div class="designer-heading"><div><p class="eyebrow">MISCANTE / ESTUDIO PERSONAL</p><h1>Una pieza.<br><em>Solo tuya.</em></h1></div><p>Elige una silueta. Define sus l\xEDneas y su materia.<br>Desde $209.000, con toda la personalizaci\xF3n incluida.</p></div><div class="designer-layout"><div class="design-visual"><div class="preview-top"><span>DISE\xD1ADO POR TI</span><button type="button" id="design-reset">Restablecer \u21BA</button></div><div id="design-preview"></div><div id="reference-photo-view" hidden></div><div class="preview-modes" role="group" aria-label="Tipo de vista previa"><button type="button" data-preview-mode="editable" aria-pressed="true">Dise\xF1o 3D</button><button type="button" data-preview-mode="photo" disabled aria-pressed="false">Foto de referencia</button><button type="button" data-preview-mode="model" disabled aria-pressed="false">Modelo importado</button></div><div class="preview-controls" role="group" aria-label="Vista de la montura"><button type="button" data-view="perspectiva" aria-pressed="true">Perspectiva</button><button type="button" data-view="frente" aria-pressed="false">Frente</button><button type="button" data-view="lateral" aria-pressed="false">Lateral</button></div><p class="preview-disclaimer">Arrastra para explorar el volumen. Vista de dise\xF1o, sujeta a validaci\xF3n de fabricaci\xF3n.</p><div class="design-preview-caption"><span id="design-caption"></span><span>M / 01</span></div></div><div class="design-controls"><form id="designer-form"><fieldset class="design-step"><legend><span>01</span> Tu punto de partida</legend><div class="model-grid">${Dn.map(j=>`<button type="button" class="model-option" data-model="${j.id}" aria-pressed="${s.model===j.id}"><span class="model-thumb"><img src="./assets/forms/${j.id}.webp" alt="Vista 3D de la montura ${j.name}"></span><strong>${j.name}</strong><small>${j.description}</small></button>`).join("")}</div><div class="fit-controls"><h3>Talla y medidas</h3><p class="fit-intro"><strong>52 \u25A1 17\u2013140</strong> indica ancho de un cristal, ancho nominal del puente y largo de la patilla, en mil\xEDmetros. La talla conserva la silueta del modelo.</p><label class="design-label" for="design-frameSize">Talla frontal \xB7 A / P</label><select id="design-frameSize" data-setting="frameSize">${yr.map(j=>`<option value="${j.id}">${j.name} \xB7 ${j.lens} \u25A1 ${j.bridge} mm</option>`).join("")}</select><label class="design-label" for="design-templeLength">Largo nominal de patilla \xB7 B</label><select id="design-templeLength" data-setting="templeLength">${[135,140,145,150].map(j=>`<option value="${j}">${j} mm</option>`).join("")}</select><p id="fit-code" class="fit-code" aria-live="polite"></p><button type="button" id="open-fit-guide" class="text-link">Medir mi rostro y orientar mi talla</button></div></fieldset><fieldset class="design-step"><legend><span>02</span> Esculpe la montura</legend><div class="slider-group">${p("rounding","Redondeo de las esquinas",0,100,"Ajuste de esquinas dentro de la silueta del modelo")}${p("thickness","Espesor del aro",3,8,"Espesor de dise\xF1o en mil\xEDmetros")}</div><div class="bridge-settings"><h3>El puente</h3><label class="design-label" for="design-bridgeType">Tipo de puente</label><select id="design-bridgeType" data-setting="bridgeType">${m(ic,s.bridgeType)}</select><label class="design-label" for="design-bridgeHeight">Ubicaci\xF3n del puente</label><select id="design-bridgeHeight" data-setting="bridgeHeight">${m(sc,s.bridgeHeight)}</select><p class="control-note">Alto, medio y bajo son posiciones relativas al modelo, no una norma anat\xF3mica universal.</p>${p("bridgeThickness","Espesor del puente",5,12,"Modifica el grosor sin separar los aros")}${p("bridgeNasalCurve","Borde nasal: recto / curvo",0,100,"Solo cambia el borde inferior de apoyo nasal; conserva el borde superior y el tipo de puente")}${p("nasalProjection","Pronunciaci\xF3n del apoyo nasal",0,100,"Menor pronunciaci\xF3n deja el apoyo m\xE1s abierto; mayor pronunciaci\xF3n lo estrecha y aumenta la proyecci\xF3n interior de las medias lunas. Conserva el contorno del cristal")}<p class="control-note">Todos los modelos incluyen medias lunas nasales interiores. Explora el reverso girando la montura para ver el apoyo. El ajuste sobre la nariz se valida antes de fabricar.</p></div><div class="arm-settings"><h3>Los brazos</h3>${p("armWidth","Ancho del brazo",4,bs(s),"Desde una patilla fina hasta la altura completa del aro. La curva de la oreja queda fija para el largo nominal B elegido")}</div><div class="arm-pair"><div><label class="design-label" for="design-armStyle">Brazo izquierdo</label><select id="design-armStyle" data-setting="armStyle">${m(Ms,s.armStyle)}</select></div><div><label class="design-label" for="design-armStyleRight">Brazo derecho</label><select id="design-armStyleRight" data-setting="armStyleRight">${m(Ms,s.armStyleRight)}</select></div></div><p class="control-note">Combina seis formas de brazos por separado, sin recargo. Expl\xF3ralos en la vista lateral. Las medidas se confirman antes de fabricar.</p>${v("rimColor","Aro")}${v("bridgeColor","Puente")}${v("armColor","Brazos")}<p class="control-note">Colores, combinaciones y personalizaci\xF3n de montura incluidos en $209.000.</p></fieldset><fieldset class="design-step"><legend><span>03</span> Tu forma de ver</legend><div class="use-toggle" role="group" aria-label="Uso de las gafas"><button type="button" data-use="sol" aria-pressed="${s.use==="sol"}">De sol<span>Sin graduaci\xF3n</span></button><button type="button" data-use="optico" aria-pressed="${s.use==="optico"}">\xD3ptico<span>Con receta</span></button></div><div id="optical-options" ${s.use==="sol"?"hidden":""}><label class="design-label" for="design-lensType">Tipo de cristales graduados</label><select id="design-lensType" data-setting="lensType">${m(br,s.lensType)}</select><p class="control-note">Monofocal: una distancia. Bifocal: dos zonas. Multifocal: transici\xF3n progresiva entre distancias. La elecci\xF3n final se valida con tu profesional \xF3ptico.</p><label class="treatment"><input type="checkbox" data-setting="blue" ${s.blue?"checked":""}><span>Filtro de luz azul<small>Tratamiento bluelight</small></span><b>+${Ft(2e4)}</b></label><label class="treatment"><input type="checkbox" data-setting="ar" ${s.ar?"checked":""}><span>Antirreflejos<small>Combinable con fotocrom\xE1tico</small></span><b>+${Ft(18e3)}</b></label><label class="treatment"><input type="checkbox" data-setting="photo" ${s.photo?"checked":""}><span>Fotocrom\xE1tico<small>Oscurecimiento con la luz exterior</small></span><b>+${Ft(45e3)}</b></label><label class="treatment"><input type="checkbox" data-setting="sunOptical" ${s.sunOptical?"checked":""}><span>Sol \xF3ptico<small>Cristales graduados con tinte fijo</small></span><b>+${Ft(25e3)}</b></label><p class="control-note">Sol \xF3ptico excluye bluelight, fotocrom\xE1tico y antirreflejos. El fotocrom\xE1tico se puede combinar con antirreflejos.</p></div><div id="photo-color-field" hidden><label class="design-label" for="design-photoColor">Color del fotocrom\xE1tico</label><select id="design-photoColor" data-setting="photoColor">${m(Gi,s.photoColor)}</select><p class="control-note">La vista representa el cristal activado en exterior.</p></div><div id="lens-color-field"><label class="design-label" for="design-lensColor">Color del cristal</label><select id="design-lensColor" data-setting="lensColor">${m(Ss,s.lensColor)}</select><p id="lens-color-note" class="control-note"></p></div></fieldset><fieldset class="design-step" id="recipe-section" ${s.use==="sol"?"hidden":""}><legend><span>04</span> Tu receta, cuando est\xE9s listo</legend><p>Adjunta una imagen legible o un PDF con tu receta m\xE9dica.</p><label class="recipe-drop" for="design-recipe"><span class="upload-icon">\u2191</span><strong>Seleccionar receta</strong><span>PDF, JPG, PNG o WebP \xB7 hasta 10 MB</span><input id="design-recipe" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"></label><p id="recipe-error" class="field-error" role="alert"></p><div id="recipe-status" aria-live="polite"></div><label class="recipe-later"><input type="checkbox" id="recipe-later"> Adjuntar\xE9 mi receta m\xE1s adelante.</label><p class="recipe-privacy">En esta demostraci\xF3n el archivo se adjunta localmente durante la visita: no se env\xEDa, no se guarda en el navegador y no se publica. Al recargar o cambiar de p\xE1gina deber\xE1s adjuntarlo de nuevo. No uses una receta real para probar.</p></fieldset><details class="reference-tools"><summary>Tus referencias personales</summary><p>Compara tu dise\xF1o con una fotograf\xEDa o un modelo 3D de referencia. Los archivos se mantienen solo durante esta visita.</p><label for="design-reference-photo">Cambiar foto de referencia<input type="file" id="design-reference-photo" accept="image/jpeg,image/png,image/webp"></label><label for="design-reference-glb">Importar modelo de referencia<input type="file" id="design-reference-glb" accept=".glb,model/gltf-binary"></label><small>Imagen hasta 10 MB. Modelo GLB autocontenido hasta 15 MB. El modelo importado se visualiza como referencia; los controles modifican el dise\xF1o Miscante.</small><p id="reference-error" role="alert"></p></details><section class="design-price" aria-label="Resumen del precio"><p class="eyebrow">TU DISE\xD1O, EN DETALLE</p><div id="design-price-lines"></div><div class="design-total"><span>Total estimado</span><strong id="design-total" aria-live="polite" aria-atomic="true"></strong></div><p class="control-note">Precios referenciales en CLP por el par de cristales. El valor final depende de la graduaci\xF3n, \xEDndice, receta y viabilidad de fabricaci\xF3n; requiere cotizaci\xF3n \xF3ptica.</p><p id="design-form-error" class="field-error" role="alert"></p><button class="button dark full" type="submit">A\xF1adir mi dise\xF1o a la bolsa <span>+</span></button><button type="button" id="design-save" class="save-design">Guardar dise\xF1o en este dispositivo</button><p class="control-note">Se guardan las especificaciones, nunca tu receta.</p></section></form></div></div>`;let M=[...t.querySelectorAll("#designer-form > fieldset.design-step")],b=["Modelo","Montura","Cristales","Receta"],C=t.querySelector("#designer-form"),w=document.createElement("div");w.className="studio-tabs",w.setAttribute("role","tablist"),w.setAttribute("aria-label","Personalizar tus gafas");let P=document.createElement("div");P.className="studio-panels",M.forEach((j,J)=>{j.id=J===3?"recipe-section":`studio-panel-${J}`,j.classList.add("studio-panel"),j.dataset.panelIndex=J,j.setAttribute("role","tabpanel"),j.setAttribute("aria-labelledby",`studio-tab-${J}`),j.hidden=J!==0,P.append(j);let O=document.createElement("button");O.type="button",O.id=`studio-tab-${J}`,O.dataset.panel=J,O.textContent=b[J],O.setAttribute("role","tab"),O.setAttribute("aria-controls",j.id),O.setAttribute("aria-selected",J===0),O.tabIndex=J===0?0:-1,w.append(O)}),C.prepend(P),C.prepend(w);let y=Dn.find(j=>j.id===s.model);t.querySelector(".designer-heading").innerHTML=`<div><p class="eyebrow">MISCANTE / DISE\xD1O PERSONAL</p><h1 id="studio-model-name">${y.name}</h1></div><p>Una montura personal, desde $209.000.<br>Formas y colores incluidos.</p>`,t.querySelector(".reference-provenance")?.remove(),t.querySelectorAll("[data-model]").forEach(j=>{let J=Dn.find(O=>O.id===j.dataset.model);j.innerHTML=`<span class="model-thumb"><img src="./assets/forms/${J.id}.webp" alt="Vista 3D de la montura ${J.name}"></span><strong>${J.name}</strong><small>${J.description}</small>`});let T=document.createElement("dialog");T.id="reference-dialog",T.setAttribute("aria-label","Comparar una referencia"),T.innerHTML='<button type="button" class="close" data-close aria-label="Cerrar">\xD7</button><p class="eyebrow">REFERENCIA PERSONAL</p><h2>Una referencia, aparte.</h2><p class="reference-explanation">Una foto o archivo importado es una referencia fija. Los controles modifican siempre tu montura Miscante en la vista principal.</p>',T.append(t.querySelector("#reference-photo-view"));let H=document.createElement("div");H.id="reference-model-view",H.hidden=!0,T.append(H),T.append(t.querySelector(".reference-tools")),t.append(T),t.querySelector(".reference-tools").open=!0,t.querySelector(".preview-modes").hidden=!0;let R=document.createElement("button");R.type="button",R.id="open-reference",R.textContent="Comparar una referencia",R.className="reference-link",t.querySelector(".design-visual").append(R),t.querySelector(".preview-top > span").textContent="MISCANTE \xB7 DISE\xD1O EN VIVO",t.querySelector(".design-controls").prepend(t.querySelector(".designer-heading"));let G=t.querySelector(".design-price"),B=t.querySelector("#design-price-lines"),L=document.createElement("details");L.className="price-breakdown",L.innerHTML="<summary>Ver desglose</summary>",L.append(B),G.prepend(L),G.querySelector(".eyebrow").remove();function k(j){M.forEach((J,O)=>J.hidden=O!==j),w.querySelectorAll("[data-panel]").forEach((J,O)=>{J.setAttribute("aria-selected",O===j),J.tabIndex=O===j?0:-1})}w.addEventListener("keydown",j=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(j.key))return;j.preventDefault();let J=[...w.querySelectorAll("[data-panel]")].filter(q=>!q.disabled),O=J.indexOf(document.activeElement),Q=j.key==="Home"?J[0]:j.key==="End"?J.at(-1):J[(O+(j.key==="ArrowRight"?1:J.length-1))%J.length];k(Number(Q.dataset.panel)),Q.focus()});let F=document.createElement("dialog");F.id="fit-guide-dialog",F.setAttribute("aria-label","Gu\xEDa de talla y medidas"),F.innerHTML='<button type="button" class="close" data-close aria-label="Cerrar gu\xEDa">\xD7</button><p class="eyebrow">MISCANTE / MEDIDAS Y AJUSTE</p><h2>La talla acompa\xF1a<br>tu forma de mirar.</h2><p>El c\xF3digo de una montura se lee en mil\xEDmetros. En <strong>52 \u25A1 17\u2013140</strong>, A = 52 es el ancho horizontal de un cristal; P = 17 es el ancho nominal del puente entre cristales; B = 140 es la longitud de la patilla. P es una medida de talla entre cristales; no es el espesor del material del puente. El c\xF3digo no indica la distancia pupilar ni equivale al ancho total de la cara.</p><div class="fit-diagram" aria-label="Medidas A, P y B de una montura"><span><b>A</b> Ancho de cristal</span><span><b>P</b> Puente nominal</span><span><b>B</b> Largo de patilla</span></div><p>Para empezar, compara el c\xF3digo con unas gafas que ya te queden c\xF3modas. El frontal debe acompa\xF1ar el ancho del rostro sin presi\xF3n lateral; la montura debe apoyarse de forma estable en la nariz y detr\xE1s de las orejas. La altura del puente y el ajuste de cristales graduados requieren revisi\xF3n profesional.</p><label for="fit-face-width">Ancho del rostro entre sienes (mm)</label><input id="fit-face-width" type="number" inputmode="decimal" min="80" max="190" step=".5" placeholder="Por ejemplo, 133"><p class="control-note">Usa una medida directa y horizontal, preferiblemente tomada por un profesional. Una fotograf\xEDa sin escala puede distorsionarla. Este dato no se env\xEDa ni se guarda.</p><div id="fit-advice" aria-live="polite"></div><button type="button" id="apply-fit-size" class="button dark full" disabled>Aplicar talla sugerida</button><p class="fit-caveat">La sugerencia compara tu dato con el ancho frontal aproximado de cada talla. Es una estimaci\xF3n geom\xE9trica del configurador, no una validaci\xF3n cl\xEDnica ni una garant\xEDa de ajuste. No deduce el largo de patilla, la distancia pupilar ni la altura del puente a partir del ancho de cara.</p><details><summary>Fuentes de consulta y alcance</summary><p>Se contrastaron las definiciones de puente, patilla y comodidad con la <a href="https://github.com/GODFREYnganga/Specs/blob/648c536e2b967157699546e1d58521d6560c2790/components/size-guide.tsx" target="_blank" rel="noopener noreferrer">gu\xEDa p\xFAblica de tallas SPECS</a>, una referencia informativa comunitaria, no una norma cl\xEDnica. Para ampliar la lectura del c\xF3digo A / P / B, consulta tambi\xE9n las gu\xEDas de <a href="https://www.warbyparker.com/learn/glasses-measurements" target="_blank" rel="noopener noreferrer">Warby Parker</a> y <a href="https://www.zennioptical.com/blog/how-to-measure-your-frame-size/" target="_blank" rel="noopener noreferrer">Zenni Optical</a>. Las posiciones alto / medio / bajo y el algoritmo de proximidad de ancho son decisiones de esta visualizaci\xF3n; no se atribuyen a esas gu\xEDas como est\xE1ndares m\xE9dicos.</p></details>',t.append(F);let U=null;function ie(){let j=F.querySelector("#fit-face-width"),J=F.querySelector("#fit-advice"),O=F.querySelector("#apply-fit-size");if(U=Iu(j.value,s),!j.value){J.textContent="Introduce tu medida para comparar las tallas.",O.disabled=!0;return}if(!U){J.textContent="Revisa la medida: utiliza mil\xEDmetros y un valor entre 80 y 190.",O.disabled=!0;return}if(!U.withinRange){J.textContent=`Tu medida queda fuera del rango frontal aproximado disponible (${U.minimum}\u2013${U.maximum} mm). Se requiere valorar otra talla con un profesional; no se aplica una sugerencia autom\xE1tica.`,O.disabled=!0;return}let Q=Math.abs(U.measurements.front-Number(j.value));J.textContent=`La m\xE1s cercana es ${U.size.name}: frontal estimado ${U.measurements.front} mm, frente a tus ${Number(j.value)} mm (${Q.toFixed(1)} mm de diferencia). Comprueba el ajuste antes de confirmar.`,O.disabled=!1}F.querySelector("#fit-face-width").addEventListener("input",ie),F.querySelector("#apply-fit-size").addEventListener("click",()=>{U?.withinRange&&(s.frameSize=U.size.id,Me(),F.close(),e("Talla frontal aplicada. El largo de patilla se elige por separado."))});let Y="",le=null;function he(){let j=JSON.stringify(s);if(t.dataset.design=j,!c){t.querySelector("#design-preview").innerHTML=Ua(s,r);return}if(j===Y){c.showReference(!1);return}Y=j,le&&cancelAnimationFrame(le);let J={...s};le=requestAnimationFrame(()=>{le=null,c.update(J),c.showReference(!1)})}function ae(){l++,a=null,o&&URL.revokeObjectURL(o),o=null,t.querySelector("#design-recipe").value="",t.querySelector("#recipe-status").replaceChildren()}function Me(){s=xn(s),he(),t.querySelector("#design-preview").hidden=!1;let j=Dn.find(q=>q.id===s.model);t.querySelector("#studio-model-name").textContent=j.name,t.querySelector("#design-rounding").disabled=!!j.lockRounding,t.querySelector("#hint-rounding").textContent=j.lockRounding?"La curva de este modelo est\xE1 protegida: cambia talla y espesores sin deformar su perfil.":"Ajuste de esquinas dentro de la silueta del modelo",t.querySelector("#design-armWidth").max=bs(s);let J=ti(s);t.querySelector("#fit-code").textContent=`${J.code} \xB7 frontal aproximado ${J.front} mm`,F.open&&ie(),t.querySelector("#reference-photo-view").hidden=!u,t.querySelector("#design-caption").textContent=Na(s),t.querySelector(".preview-disclaimer").textContent=t.dataset.renderer==="fallback"?"Vista simplificada editable \xB7 Para girar el producto se necesita WebGL.":s.use==="optico"&&s.photo?"Simulaci\xF3n de fotocrom\xE1tico activado al exterior \xB7 Vista orientativa.":"Arrastra para explorar el volumen. Vista de dise\xF1o, sujeta a validaci\xF3n de fabricaci\xF3n.";for(let q of["rounding","thickness","bridgeThickness","bridgeNasalCurve","armWidth","nasalProjection"])t.querySelector(`#value-${q}`).textContent=s[q]+(["thickness","bridgeThickness","armWidth"].includes(q)?" mm":" / 100"),t.querySelector(`[data-setting="${q}"]`).value=s[q];t.querySelectorAll("[data-setting]").forEach(q=>{q.type==="checkbox"?q.checked=s[q.dataset.setting]:q.value=s[q.dataset.setting]}),t.querySelectorAll("[data-model]").forEach(q=>q.setAttribute("aria-pressed",q.dataset.model===s.model)),t.querySelectorAll("[data-use]").forEach(q=>q.setAttribute("aria-pressed",q.dataset.use===s.use)),t.querySelectorAll("[data-view]").forEach(q=>q.setAttribute("aria-pressed",q.dataset.view===r)),t.querySelectorAll("[data-color-part]").forEach(q=>q.setAttribute("aria-pressed",s[q.dataset.colorPart]===q.dataset.color));for(let q of["rimColor","bridgeColor","armColor"])t.querySelector(`#color-name-${q}`).textContent=Ut.find(ve=>ve.id===s[q]).name;t.querySelector("#optical-options").hidden=s.use!=="optico";for(let q of["blue","photo","ar"])t.querySelector(`[data-setting="${q}"]`).disabled=s.sunOptical;t.querySelector("#photo-color-field").hidden=!(s.use==="optico"&&s.photo);let O=w.querySelector('[data-panel="3"]');O.disabled=s.use!=="optico",s.use!=="optico"&&O.getAttribute("aria-selected")==="true"&&k(2),t.querySelector("#lens-color-field").hidden=s.use==="optico"&&!s.sunOptical,t.querySelector("#lens-color-note").textContent=s.use==="sol"?"El tinte seleccionado se refleja en la vista previa.":"Color del tinte fijo en los cristales graduados.";let Q=Wi(s);t.querySelector("#design-price-lines").innerHTML=Q.lines.map(q=>`<p><span>${q.label}</span><span>${Ft(q.amount)}</span></p>`).join(""),t.querySelector("#design-total").textContent=Ft(Q.total),t.querySelector("#design-form-error").textContent=""}t.addEventListener("input",j=>{let J=j.target.dataset.setting;J&&(s[J]=j.target.type==="checkbox"?j.target.checked:j.target.value,J==="sunOptical"&&s.sunOptical&&(s.photo=!1,s.blue=!1,s.ar=!1),Me())}),t.addEventListener("click",j=>{let J=j.target.closest("button");if(J){if(J.dataset.panel!==void 0&&k(Number(J.dataset.panel)),J.id==="open-fit-guide"&&(ie(),F.showModal()),J.id==="open-reference"&&T.showModal(),J.dataset.previewMode&&(J.dataset.previewMode!=="editable"&&T.showModal(),g="editable",Me()),J.dataset.model){d&&u?.startsWith("blob:")&&URL.revokeObjectURL(u),d=!1,u=null,g="editable";let O=Dn.find(Q=>Q.id===J.dataset.model);s.model=O.id,s.rounding=O.rounding,Me()}if(J.dataset.view&&(r=J.dataset.view,c?.setView(r),Me()),J.dataset.use&&(s.use=J.dataset.use,s.use==="sol"&&ae(),Me()),J.dataset.colorPart&&(s[J.dataset.colorPart]=J.dataset.color,Me()),J.id==="design-reset"&&(s={..._i},r="perspectiva",c?.setView(r),Y="",g="editable",ae(),t.querySelector("#recipe-later").checked=!1,t.querySelector("#recipe-error").textContent="",Me(),e("Volviste al dise\xF1o inicial.")),J.id==="recipe-remove"&&(ae(),e("Receta retirada de este dise\xF1o.")),J.id==="design-save")try{localStorage.setItem("miscante-design",JSON.stringify(s)),e("Dise\xF1o guardado. La receta no se guarda.")}catch{e("No se pudo guardar el dise\xF1o en este navegador.")}}}),t.querySelector("#design-recipe").addEventListener("change",async j=>{let J=j.target,O=J.files[0];ae();let Q=l,q=t.querySelector("#recipe-error");if(q.textContent="",!O)return;let ve=Fa(O);if(!ve)try{let Be=new Uint8Array(await O.slice(0,12).arrayBuffer());Oa(Be,O)||(ve="El contenido no coincide con un PDF o una imagen compatible.")}catch{ve="No se pudo leer el archivo. Intenta seleccionarlo de nuevo."}if(Q!==l)return;if(ve){q.textContent=ve;return}a=O,t.querySelector("#recipe-later").checked=!1;let Ce=t.querySelector("#recipe-status"),Se=document.createElement("p");if(Se.textContent=`Adjunta localmente: ${O.name} \xB7 ${(O.size/1024).toFixed(0)} KB`,Ce.append(Se),O.type.startsWith("image/")){o=URL.createObjectURL(O);let Be=document.createElement("img");Be.src=o,Be.alt="Vista previa local de la receta adjunta",Be.className="recipe-preview",Ce.append(Be)}let Ke=document.createElement("button");Ke.type="button",Ke.id="recipe-remove",Ke.className="text-link",Ke.textContent="Quitar receta",Ce.append(Ke)}),t.querySelector("#designer-form").addEventListener("submit",j=>{if(j.preventDefault(),s.use==="optico"&&!a&&!t.querySelector("#recipe-later").checked){t.querySelector("#design-form-error").textContent="Adjunta tu receta o selecciona que la adjuntar\xE1s m\xE1s adelante.",k(3),t.querySelector("#recipe-section").scrollIntoView({block:"center",behavior:"smooth"}),t.querySelector("#recipe-later").focus({preventScroll:!0});return}i({config:xn(s),recipe:s.use==="optico"?a:null})}),Me(),Promise.resolve().then(()=>(gu(),mu)).then(({createDesignRenderer:j})=>{c=j(t.querySelector("#design-preview")),t.dataset.renderer="webgl",Y="",c.setView(r),Me()}).catch(()=>{t.dataset.renderer="fallback",t.querySelector(".preview-disclaimer").textContent="Vista de forma simplificada \xB7 La vista 3D requiere WebGL."}),t.querySelector("#design-reference-photo").addEventListener("change",async j=>{let J=j.target.files[0];if(!J)return;let O=t.querySelector("#reference-error");if(O.textContent="",J.size>10*1024*1024||!["image/jpeg","image/png","image/webp"].includes(J.type)){O.textContent="Selecciona una imagen JPG, PNG o WebP de hasta 10 MB.";return}d&&u&&URL.revokeObjectURL(u),d=!0,u=URL.createObjectURL(J);let Q=new Image;Q.alt="Tu fotograf\xEDa de referencia",Q.src=u,t.querySelector("#reference-photo-view").replaceChildren(Q),g="editable",Me(),T.showModal()}),t.querySelector("#design-reference-glb").addEventListener("change",async j=>{let J=j.target.files[0];if(!J)return;let O=t.querySelector("#reference-error"),Q=++x;O.textContent="";try{if(T.open||T.showModal(),H.hidden=!1,!h){let{createDesignRenderer:q}=await Promise.resolve().then(()=>(gu(),mu));h=q(H),h.canvas.setAttribute("aria-label","Modelo importado de referencia. No sustituye tu dise\xF1o editable.")}if(await h.loadReference(J),Q!==x)return;H.dataset.loaded="true",e("Modelo de referencia abierto por separado. Tu dise\xF1o se conserva.")}catch(q){O.textContent=q.message||"No se pudo abrir el modelo."}})}Mr();vr();var rt=i=>document.querySelector(i),Qf=(i,e)=>{try{return JSON.parse(localStorage.getItem(i))??e}catch{return e}},At=Qf("miscante-cart",[]);At=Array.isArray(At)?At.filter(i=>i&&Number.isInteger(i.qty)&&i.qty>0&&i.qty<=10&&(xi.some(e=>e.id===i.id)||i.custom===!0&&/^custom-[a-f0-9-]{36}$/.test(i.id))).map(i=>i.custom?{id:i.id,custom:!0,config:xn(i.config),qty:i.qty}:{id:i.id,qty:i.qty}):[];var Kn=new Map,Yy=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),cn=Qf("miscante-favorites",[]);cn=Array.isArray(cn)?cn.filter(i=>xi.some(e=>e.id===i)):[];var wa="all",jf,_u=(i,e)=>{try{localStorage.setItem(i,JSON.stringify(e))}catch{zi("El navegador no permite guardar datos. Se conservar\xE1n durante esta visita.")}};function zi(i){rt("#toast").textContent=i,rt("#toast").classList.add("show"),clearTimeout(jf),jf=setTimeout(()=>rt("#toast").classList.remove("show"),4e3)}var gr='<button class="close" data-close aria-label="Cerrar">\xD7</button>';function _r(i,e){i.innerHTML=e,i.open||i.showModal()}function xr(){_u("miscante-cart",At),rt("#cart-count").textContent=At.reduce((i,e)=>i+e.qty,0)}function Zy(i){let e=At.find(t=>t.id===i);if(e?.qty>=10){zi("M\xE1ximo 10 unidades por modelo en la demostraci\xF3n.");return}e?e.qty++:At.push({id:i,qty:1}),xr(),zi("A\xF1adido a tu bolsa")}function _s(){if(!rt("#products"))return;let i=rt("#search").value.trim().toLocaleLowerCase("es"),e=xi.filter(n=>(wa==="all"||wa==="favoritos"&&cn.includes(n.id)||n.category===wa)&&`${n.name} ${n.color} ${n.material}`.toLocaleLowerCase("es").includes(i)),t=rt("#sort").value;t==="price-up"&&e.sort((n,s)=>n.price-s.price),t==="price-down"&&e.sort((n,s)=>s.price-n.price),t==="name"&&e.sort((n,s)=>n.name.localeCompare(s.name)),rt("#result-count").textContent=`${e.length} modelos encontrados`,rt("#products").innerHTML=e.length?e.map(n=>`<article class="product"><div class="product-art" style="background:${n.bg}"><span class="product-tag">${n.tag}</span><button class="favorite ${cn.includes(n.id)?"selected":""}" data-favorite="${n.id}" aria-label="${cn.includes(n.id)?"Quitar de":"A\xF1adir a"} favoritos: ${n.name}" aria-pressed="${cn.includes(n.id)}">${cn.includes(n.id)?"\u2665":"\u2661"}</button><button class="product-image" data-product="${n.id}" aria-label="Ver ${n.name}">${Ba(n)}</button><button class="quick-add" data-add="${n.id}">A\xF1adir a la bolsa +</button></div><div class="product-heading"><button data-product="${n.id}">${n.name}</button><span>${Ft(n.price)}</span></div><p>${n.category==="sol"?"Gafas de sol":"Montura \xF3ptica"} \xB7 ${n.material}</p><span class="color-dot" style="background:${n.hex}"></span><small>${n.color}</small></article>`).join(""):'<div class="empty"><h3>No encontramos modelos.</h3><p>Prueba otra b\xFAsqueda o explora toda la colecci\xF3n.</p><button class="button dark" id="reset-filters">Ver todas las gafas</button></div>'}function Ky(i){let e=xi.find(t=>t.id===i);_r(rt("#product-dialog"),`${gr}<div class="detail-art" style="background:${e.bg}">${Ba(e)}</div><div class="detail-copy"><p class="eyebrow">COLECCI\xD3N 01 \xB7 ${e.category==="sol"?"DE SOL":"\xD3PTICAS"}</p><h2>${e.name}</h2><p>${Ft(e.price)} <small>CLP</small></p><p>Una silueta ${e.shape==="round"?"redonda":e.shape==="cat"?"de l\xEDneas expresivas":"rectangular"} con presencia sutil. Comodidad y car\xE1cter para acompa\xF1ar tu forma de mirar.</p><p><span class="color-dot" style="background:${e.hex}"></span> ${e.color}</p><dl><dt>Material</dt><dd>${e.material}</dd><dt>Lente \xB7 puente \xB7 patilla</dt><dd>${e.size} mm</dd><dt>Cristales</dt><dd>${e.category==="sol"?"Protecci\xF3n UV400":"Sin graduaci\xF3n"}</dd><dt>Incluye</dt><dd>Estuche y pa\xF1o de microfibra</dd></dl><button class="button dark full" data-add="${e.id}">A\xF1adir a la bolsa <span>+</span></button><small>Cat\xE1logo ilustrativo. Compra de demostraci\xF3n.</small></div>`)}function mr(){let i=rc(At),e=At.map(t=>{let n=t.custom?null:xi.find(c=>c.id===t.id),s=t.custom?"Tu dise\xF1o Miscante":n.name,r=t.custom?Wi(t.config).total:n.price,a=t.custom?Ua(t.config):Ba(n),o=t.custom?Na(t.config):n.color,l="";if(t.custom){let c=t.config,h=ti(c);o+=` \xB7 Aro ${Ut.find(u=>u.id===c.rimColor).name} / Puente ${Ut.find(u=>u.id===c.bridgeColor).name} / Brazos ${Ut.find(u=>u.id===c.armColor).name}`,l=`<details class="cart-design-details"><summary>Ver especificaciones y precio</summary><dl><dt>Bordes del aro</dt><dd>${c.rounding}/100</dd><dt>Talla A / P / B</dt><dd>${h.code}</dd><dt>Frontal aproximado</dt><dd>${h.front} mm</dd><dt>Puente</dt><dd>${c.bridgeType} \xB7 ${c.bridgeHeight} \xB7 espesor ${c.bridgeThickness} mm</dd><dt>Borde nasal</dt><dd>${c.bridgeNasalCurve}/100 \xB7 apoyo nasal ${c.nasalProjection}/100 \xB7 medias lunas interiores</dd><dt>Brazos</dt><dd>${c.armStyle} / ${c.armStyleRight} \xB7 ancho ${c.armWidth} mm</dd><dt>Cristal</dt><dd>${c.use==="sol"||c.sunOptical?c.lensColor:c.photo?"Fotocrom\xE1tico "+c.photoColor:"Transparente"}${c.blue&&c.use==="optico"?" \xB7 Bluelight":""}${c.ar?" \xB7 Antirreflejos":""}</dd></dl>${Wi(c).lines.map(u=>`<p><span>${u.label}</span><span>${Ft(u.amount)}</span></p>`).join("")}</details>`,c.use==="optico"&&(l+=`<div class="cart-recipe"><p>${Kn.has(t.id)?`Receta adjunta localmente: ${Yy(Kn.get(t.id).name)}`:"Receta pendiente \xB7 puedes adjuntarla ahora o m\xE1s adelante."}</p><label class="text-link">${Kn.has(t.id)?"Cambiar receta":"Adjuntar receta"}<input type="file" data-cart-recipe="${t.id}" accept=".pdf,.jpg,.jpeg,.png,.webp" aria-label="Adjuntar receta a tu dise\xF1o"></label>${Kn.has(t.id)?`<button type="button" class="text-link" data-remove-recipe="${t.id}">Quitar</button>`:""}<small>Solo durante esta visita. No se env\xEDa ni se conserva al recargar.</small></div>`)}return`<article class="cart-item ${t.custom?"custom-cart-item":""}"><div style="background:${n?.bg||"#ebe7dc"}">${a}</div><section><h3>${s}</h3><small>${o}</small><p>${Ft(r)}</p><div class="quantity"><button data-qty="${t.id}" data-delta="-1" aria-label="Reducir cantidad de ${s}">\u2212</button><span>${t.qty}</span><button data-qty="${t.id}" data-delta="1" aria-label="Aumentar cantidad de ${s}">+</button><button class="remove" data-remove="${t.id}">Eliminar</button></div></section>${l}</article>`}).join("");_r(rt("#cart-dialog"),`${gr}<p class="eyebrow">TUS ESENCIALES</p><h2>Tu bolsa <small>(${At.reduce((t,n)=>t+n.qty,0)})</small></h2>${At.length?`<div class="cart-items">${e}</div><div class="totals"><p>Subtotal <span>${Ft(i.subtotal)}</span></p><p>Env\xEDo <span>${i.shipping?Ft(i.shipping):"Sin costo"}</span></p><p class="total">Total <span>${Ft(i.total)} CLP</span></p></div><button id="checkout" class="button dark full">Continuar <span>\u2192</span></button><p class="fine">Compra de demostraci\xF3n. No se realizar\xE1n cargos. Los dise\xF1os graduados requieren validaci\xF3n de receta y cotizaci\xF3n final.</p>`:'<div class="empty"><p>Tu pr\xF3xima perspectiva te espera.</p><button class="button dark" data-close>Seguir explorando \u2192</button></div>'}`)}function jy(){_r(rt("#cart-dialog"),`${gr}<p class="eyebrow">\xDALTIMO PASO \xB7 DEMOSTRACI\xD3N</p><h2>Hazlo tuyo.</h2><p class="fine">No ingreses datos reales de pago. Este formulario no env\xEDa informaci\xF3n ni crea un pedido comercial.</p><form id="checkout-form"><label>Nombre<input name="name" autocomplete="name" required maxlength="100"></label><label>Correo electr\xF3nico<input name="email" type="email" autocomplete="email" required maxlength="254"></label><label>Direcci\xF3n de entrega<input name="address" autocomplete="street-address" required maxlength="200"></label><label>Ciudad<input name="city" autocomplete="address-level2" required maxlength="100"></label><label class="checkbox"><input type="checkbox" required> Entiendo que esta es una compra de demostraci\xF3n.</label><div class="totals"><p class="total">Total simulado <span>${Ft(rc(At).total)}</span></p></div><button class="button dark full">Confirmar pedido de prueba <svg class="arrow" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button><button type="button" id="back-cart" class="text-link">Volver a la bolsa</button></form>`)}document.addEventListener("click",i=>{let e=i.target.closest("button");if(e){if(e.hasAttribute("data-close")&&e.closest("dialog").close(),e.dataset.product&&Ky(e.dataset.product),e.dataset.add&&Zy(e.dataset.add),e.dataset.favorite){let t=e.dataset.favorite;cn=cn.includes(t)?cn.filter(n=>n!==t):[...cn,t],_u("miscante-favorites",cn),_s()}if(e.dataset.category&&(wa=e.dataset.category,document.querySelectorAll("[data-category]").forEach(t=>t.classList.toggle("active",t===e)),_s()),e.dataset.qty){let t=At.find(n=>n.id===e.dataset.qty);t&&(t.qty=Math.min(10,t.qty+Number(e.dataset.delta)),At=At.filter(n=>n.qty>0),t.qty<=0&&Kn.delete(t.id),xr(),mr())}if(e.dataset.remove&&(Kn.delete(e.dataset.remove),At=At.filter(t=>t.id!==e.dataset.remove),xr(),mr()),e.dataset.removeRecipe&&(Kn.delete(e.dataset.removeRecipe),mr()),e.id==="menu-toggle"&&rt("#menu-dialog").showModal(),e.id==="cart-toggle"&&mr(),e.id==="checkout"&&jy(),e.id==="back-cart"&&mr(),e.id==="search-toggle"&&!rt("#search-bar")){location.href="./coleccion.html?buscar=1";return}e.id==="search-toggle"&&(rt("#search-bar").hidden=!rt("#search-bar").hidden,rt("#search-bar").hidden||(rt("#coleccion").scrollIntoView(),rt("#search").focus())),e.id==="clear-search"&&(rt("#search").value="",_s()),e.id==="reset-filters"&&(wa="all",rt("#search").value="",document.querySelectorAll("[data-category]").forEach(t=>t.classList.toggle("active",t.dataset.category==="all")),_s()),e.id==="contact-open"&&_r(rt("#info-dialog"),`${gr}<p class="eyebrow">CONVERSEMOS</p><h2>Tu mirada importa.</h2><p>El canal de atenci\xF3n estar\xE1 disponible cuando se habilite la tienda. Por ahora puedes explorar la colecci\xF3n y probar tu compra sin cargos.</p><button class="button dark" data-close>Entendido</button>`),e.dataset.info&&_r(rt("#info-dialog"),`${gr}<h2>${e.dataset.info==="privacy"?"Tu privacidad":"T\xE9rminos de la demostraci\xF3n"}</h2><p>${e.dataset.info==="privacy"?"El carrito, los favoritos y la suscripci\xF3n de prueba se guardan \xFAnicamente en este navegador. No utilizamos anal\xEDtica ni enviamos formularios a un servidor. Los datos de entrega de prueba solo se mantienen en memoria mientras est\xE1 abierto el formulario. Las recetas se adjuntan temporalmente en memoria durante esta visita y nunca se env\xEDan a un servidor ni se guardan en el navegador. Al recargar o cambiar de p\xE1gina se deben adjuntar nuevamente.":"Los productos, precios y atributos son ilustrativos. Esta web permite probar una experiencia de compra; no cobra, reserva inventario ni genera contratos o pedidos reales. Antes de abrir la venta se deben confirmar los productos, pol\xEDticas y medios de pago."}</p><button data-close class="button dark">Entendido</button>`)}});document.addEventListener("submit",i=>{if(i.target.id==="newsletter-form"&&(i.preventDefault(),_u("miscante-newsletter",!0),i.target.reset(),zi("\xA1Gracias! Tu suscripci\xF3n de prueba qued\xF3 registrada en este navegador.")),i.target.id==="checkout-form"){if(i.preventDefault(),!i.target.reportValidity())return;At=[],Kn.clear(),xr(),_r(rt("#cart-dialog"),`${gr}<div class="success-mark">\u2713</div><p class="eyebrow">PEDIDO DE PRUEBA COMPLETADO</p><h2>Una nueva perspectiva.</h2><p>Has completado la experiencia de compra. No se ha cobrado ni enviado ning\xFAn pedido.</p><button class="button dark full" data-close>Volver a la colecci\xF3n <svg class="arrow" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button>`)}});document.querySelectorAll("dialog").forEach(i=>i.addEventListener("click",e=>{if(e.target===i){let t=i.getBoundingClientRect();(e.clientX<t.left||e.clientX>t.right||e.clientY<t.top||e.clientY>t.bottom)&&i.close()}}));rt("#search")?.addEventListener("input",_s);rt("#sort")?.addEventListener("change",_s);xr();_s();Kf({notify:zi,onAdd:({config:i,recipe:e})=>{let t=`custom-${crypto.randomUUID()}`;At.push({id:t,custom:!0,config:i,qty:1}),e&&Kn.set(t,e),xr(),zi("Tu dise\xF1o se a\xF1adi\xF3 a la bolsa.")}});var Jf=0;document.addEventListener("change",async i=>{let e=i.target.dataset.cartRecipe;if(!e)return;let t=++Jf,n=i.target.files[0];if(!n)return;let s=Fa(n);if(!s)try{Oa(new Uint8Array(await n.slice(0,12).arrayBuffer()),n)||(s="El archivo no contiene una imagen o PDF compatible.")}catch{s="No se pudo leer la receta."}if(t===Jf){if(s){i.target.value="",zi(s);return}At.some(r=>r.id===e&&r.custom&&r.config.use==="optico")&&(Kn.set(e,n),mr(),zi("Receta adjunta localmente durante esta visita."))}});new URLSearchParams(location.search).has("buscar")&&rt("#search-bar")&&(rt("#search-bar").hidden=!1,rt("#search").focus());document.body.dataset.page==="home"&&location.hash==="#disena"&&location.replace("./disena.html");document.body.dataset.page==="home"&&location.hash==="#coleccion"&&location.replace("./coleccion.html");document.querySelectorAll("nav a").forEach(i=>{i.getAttribute("href")===`./${location.pathname.split("/").pop()||"index.html"}`&&i.setAttribute("aria-current","page")});
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
