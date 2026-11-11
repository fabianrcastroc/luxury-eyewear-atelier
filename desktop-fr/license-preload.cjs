const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('frLicense',Object.freeze({resume:()=>ipcRenderer.invoke('fr-license-resume'),status:()=>ipcRenderer.invoke('fr-license-status'),trial:()=>ipcRenderer.invoke('fr-license-trial'),activate:()=>ipcRenderer.invoke('fr-license-activate'),request:()=>ipcRenderer.invoke('fr-license-request')}));
