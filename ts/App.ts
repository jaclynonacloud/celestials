///<reference path="./systems/Controls.ts" />
///<reference path="./systems/Debugger.ts" />
///<reference path="./managers/CelestialsManager.ts" />
///<reference path="./managers/InputManager.ts" />
namespace celestials {
    export class App {
        private static _instance:App;
        private static _window:Window;
        private static _node:HTMLElement;

        private static _bounds:Rect;

        constructor(win:Window, node:HTMLElement) {
            App._instance = this;
            App._window = win;
            App._node = node;
            App.setup();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public static setup() {
            console.log("SETUP");
            App._bounds = new Rect(App._node.offsetLeft, App._node.offsetTop, App._node.offsetWidth, App._node.offsetHeight);

            //initialize managers
            let iM = new managers.InputManager();
            let cM = new managers.CelestialsManager();

            //initialize systems
            let controls = new systems.Controls();
            let debug = new systems.Debugger();

            //create binding for test
            // let wKey:KeyBinding = new KeyBinding(() => {
            //     console.log("PRESSED W");
            // }, KeyBinding.State.Up, Key.Code.ctrl, Key.Code.shift);
            // managers.InputManager.addBinding("Press W", wKey);
            // managers.InputManager.Bindings.getValue("Press W").call();

            //create update loop
            setInterval(() => {
                //update managers
                managers.InputManager.update();
                managers.CelestialsManager.update();
            }, 1000/30);
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Window():Window { return App._window; }
        public static get Node():HTMLElement { return this._node; }
        public static get Bounds():Rect { return App._bounds; }

        
    }


    new App(window, document.querySelector(".screen"));
}