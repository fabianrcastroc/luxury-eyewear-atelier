const q=id=>document.getElementById(id);const show=message=>q('status').textContent=message;
window.frLicense.status().then(status=>{q('device').textContent=status.deviceId;q('license-trial').disabled=!status.trial.available;q('license-resume').hidden=!(status.license||status.trial.valid);show(status.license?'Licencia activa · '+status.license.customer:status.trial.valid?'Evaluación activa · '+status.trial.days+' días restantes':status.message||'Selecciona una licencia o inicia la evaluación.');});
q('license-activate').onclick=()=>window.frLicense.activate().then(result=>show(result.message)).catch(e=>show(e.message));
q('license-request').onclick=()=>window.frLicense.request().then(result=>show(result.message)).catch(e=>show(e.message));
q('license-trial').onclick=()=>window.frLicense.trial().then(result=>show(result.message)).catch(e=>show(e.message));

q('license-resume').onclick=()=>window.frLicense.resume().catch(e=>show(e.message));
