const q=id=>document.getElementById(id);const show=message=>q('status').textContent=message;
window.frLicense.status().then(status=>{q('device').textContent=status.deviceId;q('license-trial').disabled=!status.trial.available;q('license-key-online').disabled=!status.onlineAvailable;q('license-deactivate').disabled=!status.onlineAvailable||!status.license?.activationToken;q('license-recover').disabled=!status.onlineAvailable;q('online-state').textContent=status.onlineAvailable?'Servicio online configurado. El diseño sigue funcionando sin conexión dentro de la autorización.':'Activación online aún no disponible. Usa un archivo firmado o contacta '+status.supportEmail+'.';q('license-resume').hidden=!(status.license||status.trial.valid);show(status.license?'Licencia activa · '+status.license.customer:status.trial.valid?'Evaluación activa · '+status.trial.days+' días restantes':status.message||'Selecciona una licencia o inicia la evaluación.');});
q('license-activate').onclick=()=>window.frLicense.activate().then(result=>show(result.message)).catch(e=>show(e.message));
q('license-request').onclick=()=>window.frLicense.request().then(result=>show(result.message)).catch(e=>show(e.message));
q('license-trial').onclick=()=>window.frLicense.trial().then(result=>show(result.message)).catch(e=>show(e.message));

q('license-resume').onclick=()=>window.frLicense.resume().catch(e=>show(e.message));

q('license-key-online').onclick=()=>window.frLicense.activateKey(q('license-key').value).then(r=>show(r.message)).catch(e=>show(e.message));
q('license-key-offline').onclick=()=>window.frLicense.keyRequest({key:q('license-key').value,action:'activate'}).then(r=>show(r.message)).catch(e=>show(e.message));
q('license-deactivate').onclick=()=>{if(!confirm('¿Desactivar la licencia de este equipo? Podrás trasladar el puesto a otro ordenador.'))return;window.frLicense.deactivate(q('license-key').value).then(r=>{show(r.message);location.reload();}).catch(e=>show(e.message));};
q('license-deactivate-request').onclick=()=>window.frLicense.keyRequest({key:q('license-key').value,action:'deactivate'}).then(r=>show(r.message)).catch(e=>show(e.message));
q('license-deactivate-import').onclick=()=>window.frLicense.importDeactivation().then(r=>{show(r.message);location.reload();}).catch(e=>show(e.message));
q('license-recover').onclick=()=>window.frLicense.recover(q('license-email').value).then(r=>show(r.message)).catch(e=>show(e.message));
