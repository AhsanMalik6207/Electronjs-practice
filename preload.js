const { contextBridge, ipcRenderer } = require('electron')


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

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