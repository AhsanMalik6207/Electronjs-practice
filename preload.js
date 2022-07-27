const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  // toggle: ()=>{console.log('run')},
  system: () => ipcRenderer.invoke('dark-mode:system')
})