const {app, shell, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');
  
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win;
  
  function createWindow () {

    // Create the browser window.
    win = new BrowserWindow({
        name: "Celestials",
        width: 800, 
        height: 600,
        'node-integration': true,
        frame: false,
        transparent: true,
        alwaysOnTop: true
    });

    win.maximize();
    // win.setIgnoreMouseEvents(true);
  
    // and load the index.html of the app.
    win.loadFile('index.html');

    //read files
    console.log("Read FILES");
    console.log(fromDir('./res/celestials/', '.json'));
  
    // Open the DevTools.
    win.webContents.openDevTools();
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null;
    });
  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);
  
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });


  app.disableHardwareAcceleration()








  /*----------------------------- ELECTRON Methods --------------------*/
/*https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs*/
function fromDir(startPath,filter){
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            console.log('-- found: ',filename);
        }
    }
}