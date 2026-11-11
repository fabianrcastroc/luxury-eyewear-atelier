import {readFile,writeFile} from 'node:fs/promises';
import {sign,randomUUID} from 'node:crypto';
const [requestFile,customer,output,privateKeyFile,expiresAt]=process.argv.slice(2);
if(!requestFile||!customer||!output||!privateKeyFile)throw Error('Uso: node scripts/license-issue.mjs solicitud.json "Cliente" licencia.frlicense /ruta/privada.pem [vencimiento-ISO]');
const request=JSON.parse(await readFile(requestFile,'utf8'));if(!/^[a-f0-9]{64}$/.test(request.deviceId))throw Error('Solicitud inválida.');
if(expiresAt&&!Number.isFinite(Date.parse(expiresAt)))throw Error('Vencimiento inválido.');
const payload=JSON.stringify({product:'FR eyewear studio',licenseId:randomUUID(),customer,deviceId:request.deviceId,issuedAt:new Date().toISOString(),expiresAt:expiresAt||null});
const signature=sign(null,Buffer.from(payload),await readFile(privateKeyFile)).toString('base64');await writeFile(output,JSON.stringify({payload,signature},null,2)+'\n');console.log('Licencia firmada guardada en '+output);
