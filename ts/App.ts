///<reference path="./systems/Controls.ts" />
///<reference path="./systems/Debugger.ts" />
///<reference path="./managers/CelestialsManager.ts" />
///<reference path="./managers/InputManager.ts" />
///<reference path="./components/ui/CelestialContext.ts" />
namespace celestials {
    // const path = require('path');
    // const fs = require('fs');
    import CC = ui.CelestialContext;

    export class App {
        private static _instance:App;
        private static _window:Window;
        private static _node:HTMLElement;

        private static _bounds:Rect;
        private static _paused:boolean;

        constructor(win:Window, node:HTMLElement) {
            App._instance = this;
            App._window = win;
            App._node = node;
            App._paused = false;
            App.setup();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public static async setup() {
            console.log("SETUP");
            App._bounds = new Rect(App._node.offsetLeft, App._node.offsetTop, App._node.offsetWidth, App._node.offsetHeight);

            //test the context
            let celContext = new CC(document.querySelector(".context-menu.celestial"));
            CC.hide();

            //initialize managers
            let iM = await new managers.InputManager();
            let cM = await new managers.CelestialsManager();

            //initialize systems
            let controls = await new systems.Controls();
            let debug = await new systems.Debugger();

            // console.log("FILES");
            // console.log(this.read('./'));

            
            // return;

            
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


    new App(window, document.querySelector(".screen"));
}