const electron = require('electron')

// Module to control application life.
const app = electron.app

if (require('./modules/squirrel-event-handler').handleSquirrelEvent(app)) return;

const {Menu, MenuItem, Tray} = require('electron')
var AutoLaunch = require('auto-launch');

var streamNotiAutoLauncher = new AutoLaunch({
  name: 'Stream Notification'
});

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
// const exps = require('./webserver/server')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let winTray = null
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 700, 
    height: 600, 
    title: "Stream Notification", 
    icon: __dirname + "/images/icon.ico"
  })

  mainWindow.setMenu(null)
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // exps.start();

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    
    app.isQuiting = true;
    app.quit();
  })


  winTray = new Tray(__dirname + "/images/icon.png");
  var contextMenu = Menu.buildFromTemplate([
      { label: 'Show App', click: function(){
          mainWindow.show();
      }},{
        type: 'separator'
      },
      { label: 'Quit', click: function(){
          app.isQuiting = true;
          app.quit();
      }}
  ])
  
  streamNotiAutoLauncher.isEnabled()
  .then(function(isEnabled){
    // console.log(isEnabled);
    var autoRunMenuItem = new MenuItem({
      label: 'Run on Startup', 
      type: "checkbox",
      checked: isEnabled,
      click(menuItem){
        if(menuItem.checked){
          streamNotiAutoLauncher.enable();
        } else {
          streamNotiAutoLauncher.disable();
        }
      }
    })

    contextMenu.insert(0, autoRunMenuItem);
  })
  .catch(function(err){});

  winTray.setToolTip('Steam Notification')
  winTray.setContextMenu(contextMenu)
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
