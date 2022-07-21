const {app, BrowserWindow, ipcMain, webContents} = require('electron')
const path = require('path')
require("electron-reload")(__dirname);
function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  
  mainWindow.webContents.openDevTools()
  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('game', (event, msg) => {
  console.log(msg, Date.now())
  event.reply('game', 'pong');
})