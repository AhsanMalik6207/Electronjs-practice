//ipcMain is used for main process like backend
const {app, BrowserWindow, ipcMain,dialog,Menu} = require('electron')
const path = require('path');
const { title } = require('process');
  //two way: brows the file from storage 
  async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  }
function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  
  // it can programmatically change its window title.Set an IPC listener
  ipcMain.on('set-title', (event, title) =>{
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })

// Main to Render IPC
const menu = Menu.buildFromTemplate([
  {
    label: app.name,
    submenu: [
    {
      click: () => mainWindow.webContents.send('update-counter', 1),
      label: 'Increment',
    },
    {
      click: () => mainWindow.webContents.send('update-counter', -1),
      label: 'Decrement',
    }
    ]
  }

])
    Menu.setApplicationMenu(menu)
    mainWindow.loadFile('index.html')
      // Open the DevTools.
  mainWindow.webContents.openDevTools()
  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  //Two way
  ipcMain.handle('dialog:openFile', handleFileOpen)
  // main to renderer
  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })
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