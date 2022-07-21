const { app, BrowserWindow, Menu, shell, ipcMain, ipcRenderer } = require('electron');
const path = require("path");

const menuItems = [
  {
    label: 'Menu',
    submenu:[
      {label: 'Items'}

    ]
  },
  {
    label: 'File',
    submenu:[
      {label: 'Learn More',
       click: async()=>{ await shell.openExternal('https://bitfumes.com')}},
      {label: 'Exit',
       click: () => app.quit(),},
       
    ]
  }, 
  {
    label:'Window',
    // open new window
    submenu:[
      {label: 'New Window',
       click: async ()=> {
         const win2 = new BrowserWindow({
           height: 300,
           width: 400,
           show: false,
           webPreferences: {
            preload: path.join(__dirname, 'cameraPreload.js')
          }

          });
        //  win2.loadFile("index.html")
        win2.loadURL("https://bitfumes.com")
        win2.once('ready-to-show', ()=> win2.show())
       }},

       // open camera
      { label: "Open Camera",
     click: async ()=>{
      const win2 = new BrowserWindow({
        height: 500,
        width: 800,
        show: false,
        webPreferences:{
          preload:path.join(__dirname, "cameraPreload.js"),
        }
      });

      ipcMain.on('close-window-2', ()=> win2.close());

      win2.loadFile("camera.html");
     win2.once('ready-to-show', ()=> win2.show());
     }},

      {role: 'close'},
      {role: 'minimize'}
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
]

const menu = Menu.buildFromTemplate(menuItems);
Menu.setApplicationMenu(menu);
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });

    ipcMain.on('get-image', (event,data)=>{
      window.webContents.send('get-image',data)
    });
   win.webContents.openDevTools();
    win.loadFile('index.html')
  }
  // when electron is loaded and app is ready we call above function

  app.whenReady().then(()=>{
      createWindow();

      // this is for never kill the electron icon from desktop and activate the application running behind
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
  })
  // for defaul behavior of Mac application running behind the scene and closing the window
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })