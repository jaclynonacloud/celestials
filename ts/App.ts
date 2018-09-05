// let background = require("./../js/background.js");

/**
 * @author Jaclyn Staples
 * http://jaclynonacloud.com
 * @version 2018.09.03
 * 
 * Celestials - A desktop buddies applications designed to be flexible and highly customizable!
 * Uses json files to load and structure buddies.  Easily readable, easily designable.
 */

///<reference path="./systems/Splash.ts" />
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
        private static _maxCelestials:number;

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

            //read the .ini
            await fetchIni("./res/celestials.ini", (data) => {
                console.warn(data);
                App._maxCelestials = data.maxCelestials || 10;
                console.log("MAX: " + App._maxCelestials);
            });

            //start splash immediately
            let splash = new systems.Splash(document.querySelector('.splash-screen'), document.querySelector(".splash-screen .progress"));
            splash.open();
            //load tasks
            splash.setTasks([
                () => App._bounds = new Rect(App._node.offsetLeft, App._node.offsetTop, App._node.offsetWidth, App._node.offsetHeight),
                //initialize managers
                () => new managers.MouseManager(),
                () => new managers.InputManager(),

                // //setup systems
                () => new systems.Console(document.querySelector(".overlay-menu.console")),
                () => new systems.Collision(),
                () => new systems.Weather(document.querySelector(".weather")),

                // //setup tooltips early so it can listen to managers for desired tooltips as well
                () => new ui.menus.Tooltip(document.querySelector(".overlay-menu.tooltip")),

                /** REMOTE ELECTRON BUILD */
                // () => new managers.RemoteManager(),
                // () => new managers.CelestialsManager(),
                // () => managers.CelestialsManager.Instance.setup(managers.RemoteManager.Files),

                () => new managers.CelestialsManager(),
                () => managers.CelestialsManager.Instance.setup(),


                // //set the contexts
                () => new ui.menus.CelestialContext(document.querySelector(".context-menu.celestial")),
                () => new ui.menus.ApplicationContext(document.querySelector(".context-menu.application")),
                // //set the statics
                () => new ui.menus.NotificationBar(document.querySelector(".overlay-menu.notifications-bar"), document.querySelector(".notifications-bar-bounds")),
                () => new ui.menus.NotificationPanel(document.querySelector(".overlay-menu.notifications-panel")),
                () => new ui.menus.CelestialsPanel(document.querySelector(".overlay-menu.celestials")),
                () => new ui.menus.CurrentCelestialsPanel(document.querySelector(".overlay-menu.current-celestials")),
                () => new ui.menus.CelestialDetails(document.querySelector(".overlay-menu.celestial-details")),
                () => new ui.menus.ControlPanel(document.querySelector(".overlay-menu.control-panel")),

                () => new systems.Controls(),
                () => new systems.Debugger()
            ]);

            //start tasks
            // await splash.startTasks();
            await splash.autoStartTasks();

            console.log("Done LOADING");
            splash.close();

            

            //test
            systems.Notifications.addNotification("This is a test!", systems.Notifications.TYPE.Notify);
            systems.Notifications.addNotification("This is a test for failure!", systems.Notifications.TYPE.Fail);

            // return;

            //load in initial celestial
            if(managers.CelestialsManager.getTemplateByLookup("solaris") != null)
                    await managers.CelestialsManager.addCelestialByLookup("solaris");
            
            
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


        public static resume() {
            App._paused = false;
            this._window.requestAnimationFrame(App.step);

            //resume systems
            systems.Weather.Instance.resume();
        }
        public static pause() {
            App._paused = true;

            //pause systems
            systems.Weather.Instance.pause();
        }

        public static step(timestamp:number) {
            if(App._paused) {
                App._timestamp = -1;
                return;
            }


            //if we were recently paused, don't reset the latency until the app timestamp is reset
            if(App._timestamp != -1) {
                App._latency = timestamp - App._timestamp;
            }

            App._timestamp = timestamp;

            //update managers
            managers.InputManager.update();
            managers.CelestialsManager.update();
            //update systems
            systems.Collision.update();

            //request next frame
            App._window.requestAnimationFrame(App.step);
        }
        
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
        public static get FPS_Latency():number { return Math.abs((App.Latency / 1000)); }


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