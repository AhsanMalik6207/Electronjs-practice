//ipcRenderer used for rendered process like frontend
const { contextBridge, ipcRenderer } = require('electron')
// Expose ipcRenderer.send, As an app developer, you need to choose which APIs to expose from
// your preload script using the contextBridge API.
contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  //two way
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  //main to renderer
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback)
})


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }
// main to renderer: update counter functionality
const counter = document.getElementById('counter')
ipcRenderer.on('update-counter', (_event, value) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue
})
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld(
  'game',
  {
  sendPing: () => ipcRenderer.send('game', 'ping'),
  listen: (callback) => ipcRenderer.on('game', (event, msg) => {
    if(typeof callback === 'function') {
      callback(msg);
    }
  })
  }

)