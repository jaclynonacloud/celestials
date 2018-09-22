const {app, shell, BrowserWindow, Tray, Menu, nativeImage} = require('electron');
const path = require('path');
const fs = require('fs');

class Background {
  constructor() {
    this.app = app;
    this.mainWindow = null;
    this.tray = null;


    //event listeners
    app.on('ready', this.createWindow.bind(this));   
    // Quit when all windows are closed.
    app.on('window-all-closed', this._onAllWindowsClosed.bind(this));    
    app.on('activate', this._onActivateWindow.bind(this));


    this.app.disableHardwareAcceleration();
  }


  /*---------------------------------------------- METHODS -------------------------------------*/
  createWindow() {
      // Create the browser window.
      this.mainWindow = new BrowserWindow({
        name: "Celestials",
        width: 800, 
        height: 600,
        'node-integration': true,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true
    });

    //attach data
    this.mainWindow.data = {};

    //maximize screen
    this.mainWindow.maximize();

    // and load the index.html of the app.
    this.mainWindow.loadFile(path.join(__dirname, '/../index.html'));

    //read files
    this.mainWindow.data.files = getFilesFromDir(path.join(__dirname, "/../res/celestials/"), [".json"]);
    this.mainWindow.data.files = this.mainWindow.data.files.map(value => path.join(__dirname, '../res/celestials/', value));
    

    // Open the DevTools.
    this.mainWindow.webContents.openDevTools();

    //create the tray
    this.createTray();

    // Emitted when the window is closed.
    this.mainWindow.on('closed', this._onMainWindowClosed.bind(this));

  }
  createTray() {
    const iconPath = path.join(__dirname, '/../res/tray-icon.png');
    console.log(iconPath);
    this.tray = new Tray(nativeImage.createFromPath(iconPath));
    this.tray.setToolTip("Celestials - Desktop Buddies");
    this.tray.setHighlightMode('always');
    let trayItems = [
      {
        'label' : 'Control Panel',
        'click' : () => {
          this.mainWindow.webContents.send('showControlPanel');
        }
      },
      {
        'label' : 'Console',
        'click' : () => {
          this.mainWindow.webContents.send('showConsole');
        }
      },
      {
        'label' : 'Show Splash',
        'click' : () => {
          this.mainWindow.webContents.send('showSplash');
        }
      },
      {
        'role' : 'quit'
      }
    ];

    const ctxMenu = Menu.buildFromTemplate(trayItems);
    this.tray.setContextMenu(ctxMenu);
  }
  /*---------------------------------------------- ABSTRACTS -----------------------------------*/
  /*---------------------------------------------- INTERFACES ----------------------------------*/
  /*---------------------------------------------- EVENTS --------------------------------------*/
  _onMainWindowClosed() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.mainWindow = null;
  }
  _onAllWindowsClosed() {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        this.app.quit();
      }
  }
  _onActivateWindow() {
    // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.mainWindow === null) {
        this.createWindow().bind(this);
      }
  }
  /*---------------------------------------------- GETS & SETS ---------------------------------*/

}

new Background();


module.exports = Background;
  
  // // Keep a global reference of the window object, if you don't, the window will
  // // be closed automatically when the JavaScript object is garbage collected.
  // let win;
  // let tray = null;
  
  // function createWindow () {

  //   // Create the browser window.
  //   win = new BrowserWindow({
  //       name: "Celestials",
  //       width: 800, 
  //       height: 600,
  //       'node-integration': true,
  //       frame: false,
  //       transparent: true,
  //       alwaysOnTop: true,
  //       skipTaskbar: true
  //   });

  //   win.maximize();
  //   // win.setIgnoreMouseEvents(true);

  //   //setup tray
  //   const iconPath = path.join(__dirname, '/../res/tray-icon.png');
  //   console.log(iconPath);
  //   tray = new Tray(nativeImage.createFromPath(iconPath));
  //   tray.setToolTip("Celestials - Desktop Buddies");
  //   tray.setHighlightMode('always');
  //   let trayItems = [
  //     {
  //       'label' : 'Control Panel',
  //       'click' : () => {
  //         console.log("CLICKED");
  //         // console.log(window.celestials.Celestials);
  //       }
  //     },
  //     {
  //       'role' : 'quit'
  //     }
  //   ];

  //   const ctxMenu = Menu.buildFromTemplate(trayItems);
  //   tray.setContextMenu(ctxMenu);

  
  //   // and load the index.html of the app.
  //   win.loadFile('index.html');

  //   //read files
  //   console.log("Read FILES");
  //   console.log(fromDir('./res/celestials/', '.json'));
  
  //   // Open the DevTools.
  //   win.webContents.openDevTools();
  
  //   // Emitted when the window is closed.
  //   win.on('closed', () => {
  //     // Dereference the window object, usually you would store windows
  //     // in an array if your app supports multi windows, this is the time
  //     // when you should delete the corresponding element.
  //     win = null;
  //   });
  // }
  
  // // This method will be called when Electron has finished
  // // initialization and is ready to create browser windows.
  // // Some APIs can only be used after this event occurs.
  // app.on('ready', createWindow);
  
  
  // // Quit when all windows are closed.
  // app.on('window-all-closed', () => {
  //   // On macOS it is common for applications and their menu bar
  //   // to stay active until the user quits explicitly with Cmd + Q
  //   if (process.platform !== 'darwin') {
  //     app.quit();
  //   }
  // });
  
  // app.on('activate', () => {
  //   // On macOS it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (win === null) {
  //     createWindow();
  //   }
  // });


  // app.disableHardwareAcceleration()








  /*----------------------------- ELECTRON Methods --------------------*/
/*https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs*/
// function fromDir(startPath,filter){
//     if (!fs.existsSync(startPath)){
//         console.log("no dir ",startPath);
//         return;
//     }

//     var files=fs.readdirSync(startPath);
//     for(var i=0;i<files.length;i++){
//         var filename=path.join(startPath,files[i]);
//         var stat = fs.lstatSync(filename);
//         if (stat.isDirectory()){
//             fromDir(filename,filter); //recurse
//         }
//         else if (filename.indexOf(filter)>=0) {
//             console.log('-- found: ',filename);
//         }
//     }
// }


/*https://www.codexpedia.com/node-js/node-js-getting-files-from-a-directory-including-sub-directories/*/
// Return a list of files of the specified fileTypes in the provided dir, 
// with the file path relative to the given dir
// dir: path of the directory you want to search the files for
// fileTypes: array of file types you are search files, ex: ['.txt', '.jpg']
function getFilesFromDir(dir, fileTypes) {
  var filesToReturn = [];
  function walkDir(currentPath) {
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var curFile = path.join(currentPath, files[i]);      
      if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
        filesToReturn.push(curFile.replace(dir, ''));
      } else if (fs.statSync(curFile).isDirectory()) {
       walkDir(curFile);
      }
    }
  };
  walkDir(dir);
  return filesToReturn; 
}