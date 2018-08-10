///<reference path="./systems/Controls.ts" />
///<reference path="./systems/Debugger.ts" />
///<reference path="./managers/CelestialsManager.ts" />
///<reference path="./managers/InputManager.ts" />
///<reference path="./managers/RemoteManager.ts" />
///<reference path="./components/ui/menus/contexts/CelestialContext.ts" />
///<reference path="./components/ui/menus/contexts/ApplicationContext.ts" />
///<reference path="./components/ui/menus/statics/ControlPanel.ts" />
///<reference path="./components/ui/menus/statics/CelestialsPanel.ts" />
///<reference path="./components/ui/menus/statics/NotificationBar.ts" />
///<reference path="./components/ui/menus/overlays/Tooltip.ts" />
namespace celestials {
    export class App {
        private static _instance:App;
        private static _window:Window;
        private static _node:HTMLElement;

        private static _bounds:Rect;
        private static _mousePosition:IPoint;
        private static _paused:boolean;
        private static _usingRemote:boolean;

        constructor(win:Window, node:HTMLElement) {
            App._instance = this;
            App._window = win;
            App._node = node;
            App._paused = false;


            //get mouse position
            App._mousePosition = {x:0, y:0};
            App._node.addEventListener("mousemove", (e:MouseEvent) => {
                App._mousePosition.x = e.x;
                App._mousePosition.y = e.y;
            });
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public static async setup() {
            console.log("SETUP");
            App._bounds = new Rect(App._node.offsetLeft, App._node.offsetTop, App._node.offsetWidth, App._node.offsetHeight);

            

            //set the contexts
            new ui.menus.CelestialContext(document.querySelector(".context-menu.celestial"));
            new ui.menus.ApplicationContext(document.querySelector(".context-menu.application"));
            //set the statics
            new ui.menus.ControlPanel(document.querySelector(".overlay-menu.control-panel"));
            new ui.menus.NotificationBar(document.querySelector(".overlay-menu.notifications-bar"), document.querySelector(".notifications-bar-bounds"));
            new ui.menus.CelestialsPanel(document.querySelector(".overlay-menu.celestials"));
            new ui.menus.Tooltip(document.querySelector(".overlay-menu.tooltip"));

            //test
            ui.menus.NotificationBar.addNotification("This is a test!", ui.menus.NotificationBar.Type.Notify);
            ui.menus.NotificationBar.addNotification("This is a test for failure!", ui.menus.NotificationBar.Type.Fail);
            

            //initialize managers
            await new managers.InputManager();
            // let celestialsMan = await new managers.RemoteManager();
            // await celestialsMan.setup(managers.RemoteManager.Files)

            let celestialsMan = await new managers.CelestialsManager();
            await celestialsMan.setup();
            
            
            //test
            // ui.menus.CelestialsPanel.show();

            //initialize systems
            let controls = await new systems.Controls();
            let debug = await new systems.Debugger();
            
            
            return;

            //create update loop
            setInterval(() => {
                if(App._paused) return;
                //update managers
                managers.InputManager.update();
                managers.CelestialsManager.update();
            }, 1000/30);
        }


        public static pause() {
            App._paused = true;
        }
        public static resume() {
            App._paused = false;
        }


        // public static read(dir) {
        //     return fs.readdirSync(dir)
        //         .reduce((files, file) =>
        //         fs.statSync(path.join(dir, file)).isDirectory() ?
        //             files.concat(this.read(path.join(dir, file))) :
        //             files.concat(path.join(dir, file)),
        //         []);
        // }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Window():Window { return App._window; }
        public static get Node():HTMLElement { return this._node; }
        public static get Bounds():Rect { return App._bounds; }
        public static get MousePosition():IPoint { return App._mousePosition; }
        public static get Paused():boolean { return App._paused; }

        
    }

    const _window = (<any>window);
    async function setupApp() {
        new App(window, document.querySelector(".screen"));
        await App.setup();
        _window.celestials = celestials.managers.CelestialsManager;
    }
    setupApp();

    
    
}