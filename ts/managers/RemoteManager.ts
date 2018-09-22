// namespace celestials.managers {
//     const remote = require("electron").remote;
//     const {ipcRenderer} = require("electron");


//     export class RemoteManager {
//         private static _instance:RemoteManager;
//         private _remote:any;
//         private _files:string[];

//         constructor() {
//             RemoteManager._instance = this;
//             this._remote = remote.getCurrentWindow();

//             //try to get data
//             if(this._remote.data != null) {
//                 this._files = this._remote.data.files;
//             }

//             //listen to remote
//             ipcRenderer.on('showControlPanel', this._onShowControlPanel.bind(this));
//             ipcRenderer.on('showConsole', this._onShowConsole.bind(this));
//             ipcRenderer.on('showSplash', this._onShowSplash.bind(this));
//         }


//         /*---------------------------------------------- METHODS -------------------------------------*/
//         /*---------------------------------------------- ABSTRACTS -----------------------------------*/
//         /*---------------------------------------------- INTERFACES ----------------------------------*/
//         /*---------------------------------------------- EVENTS --------------------------------------*/
//         private _onShowControlPanel() {
//             ui.menus.ControlPanel.show();
//         }
//         private _onShowConsole() {
//             systems.Console.Instance.open();
//         }
//         private _onShowSplash() {
//             systems.Splash.Instance.openStatic();
//         }
//         /*---------------------------------------------- GETS & SETS ---------------------------------*/
//         public static get Files():string[] { return RemoteManager._instance._files; }
//     }
    
// }