///<reference path="./systems/Controls.ts" />
///<reference path="./systems/Debugger.ts" />
///<reference path="./managers/CelestialsManager.ts" />
///<reference path="./managers/InputManager.ts" />
///<reference path="./managers/RemoteManager.ts" />
///<reference path="./components/ui/menus/contexts/CelestialContext.ts" />
///<reference path="./components/ui/menus/contexts/ApplicationContext.ts" />
///<reference path="./components/ui/menus/statics/ControlPanel.ts" />
///<reference path="./components/ui/menus/overlays/Tooltip.ts" />
namespace celestials {
    export class App {
        private static _instance:App;
        private static _window:Window;
        private static _node:HTMLElement;

        private static _bounds:Rect;
        private static _paused:boolean;
        private static _usingRemote:boolean;

        constructor(win:Window, node:HTMLElement) {
            App._instance = this;
            App._window = win;
            App._node = node;
            App._paused = false;
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
            new ui.menus.Tooltip(document.querySelector(".overlay-menu.tooltip"));
            

            //initialize managers
            await new managers.InputManager();
            // await new managers.RemoteManager();
            // await new managers.CelestialsManager(managers.RemoteManager.Files);

            await new managers.CelestialsManager();


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