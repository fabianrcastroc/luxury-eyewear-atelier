const crypto=require('node:crypto');
const fs=require('node:fs');
const os=require('node:os');
const {execFileSync}=require('node:child_process');
function deviceId(){
 let identity;
 try{
  if(process.platform==='win32')identity=execFileSync('reg',['query','HKLM\\SOFTWARE\\Microsoft\\Cryptography','/v','MachineGuid'],{encoding:'utf8',windowsHide:true}).match(/MachineGuid\s+REG_SZ\s+(\S+)/i)?.[1];
  else if(process.platform==='darwin')identity=execFileSync('/usr/sbin/ioreg',['-rd1','-c','IOPlatformExpertDevice'],{encoding:'utf8'}).match(/"IOPlatformUUID"\s*=\s*"([^"]+)"/)?.[1];
  else identity=fs.readFileSync('/etc/machine-id','utf8');
 }catch{}
 return crypto.createHash('sha256').update('FR-eyewear-studio-v1|'+process.platform+'|'+(identity||os.hostname()+'|'+os.userInfo().username)).digest('hex');
}
function verifyLicense(document,publicKey,device,now=Date.now()){
 if(!document||typeof document.payload!=='string'||typeof document.signature!=='string'||document.payload.length>12000)throw Error('Archivo de licencia inválido.');
 if(!crypto.verify(null,Buffer.from(document.payload),publicKey,Buffer.from(document.signature,'base64')))throw Error('La firma de la licencia no es válida.');
 const data=JSON.parse(document.payload);
 if(data.product!=='FR eyewear studio'||data.deviceId!==device||typeof data.customer!=='string'||!data.customer.trim()||!data.licenseId)throw Error('La licencia no corresponde a este equipo.');
 if(data.expiresAt!=null&&(!Number.isFinite(Date.parse(data.expiresAt))||Date.parse(data.expiresAt)<now))throw Error('La licencia ha vencido.');
 return data;
}
function trialStatus(state,now=Date.now()){
 const duration=30*24*60*60*1000;
 if(!state)return {valid:false,available:true,days:30};
 if(!Number.isFinite(state.startedAt)||!Number.isFinite(state.lastSeen)||now<state.lastSeen-300000||now<state.startedAt||now-state.startedAt>=duration)return {valid:false,available:false,days:0};
 return {valid:true,available:false,days:Math.ceil((duration-(now-state.startedAt))/86400000)};
}
module.exports={deviceId,verifyLicense,trialStatus};
