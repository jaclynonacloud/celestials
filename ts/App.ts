// let background = require("./../js/background.js");

/**
 * @author Jaclyn Staples
 * http://jaclynonacloud.com
 * @version 2018.08.11
 * 
 * Celestials - A desktop buddies applications designed to be flexible and highly customizable!
 * Uses json files to load and structure buddies.  Easily readable, easily designable.
 */

///<reference path="./systems/Collision.ts" />
///<reference path="./systems/Console.ts" />
///<reference path="./systems/Controls.ts" />
///<reference path="./systems/Debugger.ts" />
///<reference path="./systems/Notifications.ts" />
///<reference path="./systems/Weather.ts" />
///<reference path="./managers/CelestialsManager.ts" />
///<reference path="./managers/InputManager.ts" />
///<reference path="./managers/MouseManager.ts" />
///<reference path="./managers/RemoteManager.ts" />
///<reference path="./components/ui/menus/contexts/CelestialContext.ts" />
///<reference path="./components/ui/menus/contexts/ApplicationContext.ts" />
///<reference path="./components/ui/menus/statics/ControlPanel.ts" />
///<reference path="./components/ui/menus/statics/CelestialsPanel.ts" />
///<reference path="./components/ui/menus/statics/CurrentCelestialsPanel.ts" />
///<reference path="./components/ui/menus/statics/CelestialDetails.ts" />
///<reference path="./components/ui/menus/statics/NotificationBar.ts" />
///<reference path="./components/ui/menus/statics/NotificationPanel.ts" />
///<reference path="./components/ui/menus/overlays/Tooltip.ts" />
namespace celestials {
    export class App {
        private static _instance:App;
        private static _window:Window;
        private static _node:HTMLElement;

        private static _bounds:Rect;
        private static _paused:boolean;
        private static _usingRemote:boolean;

        private static _usesMood:boolean;
        private static _timestamp:number;
        private static _latency:number;

        constructor(win:Window, node:HTMLElement) {
            App._instance = this;
            App._window = win;
            App._node = node;
            App._paused = false;

            App._usesMood = false;
            App._timestamp = 0;
            App._latency = 0;
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public static async setup() {
            console.log("SETUP");
            App._bounds = new Rect(App._node.offsetLeft, App._node.offsetTop, App._node.offsetWidth, App._node.offsetHeight);

            //initialize managers
            await new managers.MouseManager();
            await new managers.InputManager();

            //setup systems
            await new systems.Console(document.querySelector(".overlay-menu.console"));
            await new systems.Collision();
            await new systems.Weather(document.querySelector(".weather"));            

            //setup tooltips early so it can listen to managers for desired tooltips as well
            await new ui.menus.Tooltip(document.querySelector(".overlay-menu.tooltip"));

            // await new managers.RemoteManager();
            // let celestialsMan = await new managers.CelestialsManager();
            // await celestialsMan.setup(managers.RemoteManager.Files)

            let celestialsMan = await new managers.CelestialsManager();
            await celestialsMan.setup();


            //set the contexts
            await  new ui.menus.CelestialContext(document.querySelector(".context-menu.celestial"));
            await new ui.menus.ApplicationContext(document.querySelector(".context-menu.application"));
            //set the statics
            await new ui.menus.NotificationBar(document.querySelector(".overlay-menu.notifications-bar"), document.querySelector(".notifications-bar-bounds"));
            await new ui.menus.NotificationPanel(document.querySelector(".overlay-menu.notifications-panel"));
            await new ui.menus.CelestialsPanel(document.querySelector(".overlay-menu.celestials"));
            await new ui.menus.CurrentCelestialsPanel(document.querySelector(".overlay-menu.current-celestials"));
            await new ui.menus.CelestialDetails(document.querySelector(".overlay-menu.celestial-details"));
            await new ui.menus.ControlPanel(document.querySelector(".overlay-menu.control-panel"));

            //test
            systems.Notifications.addNotification("This is a test!", systems.Notifications.TYPE.Notify);
            systems.Notifications.addNotification("This is a test for failure!", systems.Notifications.TYPE.Fail);
            

            
            
            
            //test
            // ui.menus.CelestialsPanel.show();

            //initialize systems
            let controls = await new systems.Controls();
            let debug = await new systems.Debugger();
            
            
            // return;

            //create update loop

            
            App.resume();

            // setInterval(() => {
            //     if(App._paused) return;
            //     //update managers
            //     managers.InputManager.update();
            //     managers.CelestialsManager.update();
            //     //update systems
            //     systems.Collision.update();
            // }, 1000/30);
        }


        public static pause() {
            App._paused = true;
        }
        public static resume() {
            App._paused = false;
            this._window.requestAnimationFrame(App.step);
        }

        public static step(timestamp:number) {
            if(App._paused) return;

            App._latency = timestamp - App._timestamp;
            App._timestamp = timestamp;

            // console.log("TIMESTAMP: " + App._timestamp);
            // console.log("LATENCY: " + App._latency / 1000);

            //update managers
            managers.InputManager.update();
            managers.CelestialsManager.update();
            //update systems
            systems.Collision.update();

            //request next frame
            App._window.requestAnimationFrame(App.step);
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
        /**
         * Returns the current mouse position { x, y }.
         * @requires managers.MouseManager.MousePosition
         */
        public static get MousePosition():IPoint { return managers.MouseManager.MousePosition; }
        public static get Paused():boolean { return App._paused; }
        public static get Runtime():number  { return App._timestamp; }
        public static get Latency():number  { return App._latency; }
        public static get FPS_Latency():number { return Math.abs((App.Latency / 30)); }


        public static get UsesMood():boolean { return App._usesMood; }
        public static set UsesMood(value:boolean) { App._usesMood = value; }

        
    }


    const _window = (<any>window);
    async function setupApp() {
        new App(window, document.querySelector(".screen"));
        await App.setup();
        _window.celestials = celestials.managers.CelestialsManager;
    }
    setupApp();   
    
}