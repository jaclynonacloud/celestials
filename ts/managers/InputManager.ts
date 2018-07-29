namespace celestials.managers {
    export class InputManager {
        private static _bindings:Dictionary<string, KeyBinding>;

        constructor() {
            InputManager._bindings = new Dictionary();
        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        /**
         * Adds a binding to the dictionary for easy access.
         * @param key The key to associate the binding with.  For example: "jump", "leftarrow", "run jump".
         * @param binding The binding for the key.
         */
        public static addBinding(key:string, binding:KeyBinding) {
            if(InputManager._bindings.containsKey(key)) {
                console.log(`Cannot build binding.  Key already has binding - ${key}.  Try removing it if you need to.`)
                return;
            }

            InputManager._bindings.add(key, binding);
        }

        public static removeBinding(key:string) {
            if(!InputManager._bindings.containsKey(key)) return;

            let binding:KeyBinding = InputManager._bindings.getValue(key);
            binding.kill();
            InputManager._bindings.remove(key);
        }

        public static updateBinding(key:string, binding:KeyBinding) {
            if(InputManager._bindings.containsKey(key))
                InputManager._bindings.setValue(key, binding);
        }

        public static update() {
            for(let binding of this._bindings.List)
                binding.update();
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Bindings():Dictionary<string, KeyBinding> { return InputManager._bindings; }

    }


   
}

namespace celestials {
    export class KeyBinding {
        public static get State() { return Object.freeze({"Down":0,"Up":1,"Pressed":2});}
        private _keys:number[];
        private _keysPressed:boolean[];
        private _state:number;
        private _callback:Function;

        private _kDown;
        private _kUp;

        /**
         * Creates a key binding.  Can hold multiple keys, for combos like "shift+e", "ctrl+q", etc.
         * @param callback A callback for when the key binding has been activated.
         * @param key The key(s) to listen to.
         */
        constructor(callback:Function, state:number, ...key:number[] ) {
            this._callback = callback;
            this._state = state;

            console.log("STATE: " + this._state);

            //set the keys
            this._keys = key;
            this._keysPressed = Array<boolean>();
            for(let i = 0; i < this._keys.length; i++)
                this._keysPressed[i] = false;

            //register the events
            this._kDown = this._onKeyDown.bind(this);
            this._kUp = this._onKeyUp.bind(this);

            //listen to events
            switch(this._state) {
                case KeyBinding.State.Pressed:
                case KeyBinding.State.Up:
                case KeyBinding.State.Down:
                    App.Window.addEventListener("keyup", this._kUp);
                    App.Window.addEventListener("keydown", this._kDown);
                    break;
                default:
                    console.log("Please use the Keybinding.State states to set a state to listen to.");
            }
                
        }

        /**Kills the key binding listeners. */
        public kill() {
            App.Window.removeEventListener("keydown", this._kDown);
            App.Window.removeEventListener("keyup", this._kUp);
        }

        /**Calls the callback of the binding. */
        public call() {
            if(this._callback != null)
                this._callback();
        }

        /**Checks binding keys to see if they are pressed.  Will call callback if so. */
        public checkBinding() {            
            //test all keys
            for(let i = 0; i < this._keys.length; i++)
            if(this._keysPressed[i] == false) return false;

            //if nothing stopped us from getting here, our binding is a success!
            this.call();
            return true;
        }

        public update() {
            if(this._state == KeyBinding.State.Pressed)
                this.checkBinding();
        }
        /*--------------------- EVENTS --------------*/
        private _onKeyDown(e:KeyboardEvent) {
            //mark key as pressed if listening
            let index = this._keys.indexOf(e.keyCode);
            if(index != -1) {
                if(this._keysPressed[index]) return;
                this._keysPressed[index] = true;
                if(this._state == KeyBinding.State.Down)
                    this.checkBinding();
            }
        }
        private _onKeyUp(e:KeyboardEvent) {
            //mark key as not pressed if listening
            let index = this._keys.indexOf(e.keyCode);
            if(index != -1) {
                if(this._state == KeyBinding.State.Up)
                    this.checkBinding();
                this._keysPressed[index] = false;
            }
        }

        get Callback():Function { return this._callback; }
    }


    export class Key {
        public static get Code() {return Object.freeze({
            "backspace"         : 8,
            "tab"               : 9,
            "enter"             : 13,
            "shift"             : 16,
            "ctrl"              : 17,
            "alt"               : 18,
            "pause/break"       : 19,
            "caps lock"         : 20,
            "escape"            : 27,
            "page up"           : 33,
            "page down"         : 34,
            "end"               : 35,
            "home"              : 36,
            "left arrow"        : 37,
            "up arrow"          : 38,
            "right arrow"       : 39,
            "down arrow"        : 40,
            "insert"            : 45,
            "delete"            : 46,
            "0"                 : 48,
            "1"                 : 49,
            "2"                 : 50,
            "3"                 : 51,
            "4"                 : 52,
            "5"                 : 53,
            "6"                 : 54,
            "7"                 : 55,
            "8"                 : 56,
            "9"                 : 57,
            "a"                 : 65,
            "b"                 : 66,
            "c"                 : 67,
            "d"                 : 68,
            "e"                 : 69,
            "f"                 : 70,
            "g"                 : 71,
            "h"                 : 72,
            "i"                 : 73,
            "j"                 : 74,
            "k"                 : 75,
            "l"                 : 76,
            "m"                 : 77,
            "n"                 : 78,
            "o"                 : 79,
            "p"                 : 80,
            "q"                 : 81,
            "r"                 : 82,
            "s"                 : 83,
            "t"                 : 84,
            "u"                 : 85,
            "v"                 : 86,
            "w"                 : 87,
            "x"                 : 88,
            "y"                 : 89,
            "z"                 : 90,
            "left window key"   : 91,
            "right window key"  : 92,
            "select key"        : 93,
            "numpad 0"          : 96,
            "numpad 1"          : 97,
            "numpad 2"          : 98,
            "numpad 3"          : 99,
            "numpad 4"          : 100,
            "numpad 5"          : 101,
            "numpad 6"          : 102,
            "numpad 7"          : 103,
            "numpad 8 9"        : 104,
            "numpad"            : 105,
            "multiply"          : 106,
            "add"               : 107,
            "subtract"          : 109,
            "decimal point"     : 110,
            "divide"            : 111,
            "f1"                : 112,
            "f2"                : 113,
            "f3"                : 114,
            "f4"                : 115,
            "f5"                : 116,
            "f6"                : 117,
            "f7"                : 118,
            "f8"                : 119,
            "f9"                : 120,
            "f10"               : 121,
            "f11"               : 122,
            "f12"               : 123,
            "num lock"          : 144,
            "scroll lock"       : 145,
            "semi-colon"        : 186,
            "equal sign"        : 187,
            "comma"             : 188,
            "dash"              : 189,
            "period"            : 190,
            "forward slash"     : 191,
            "grave accent"      : 192,
            "open bracket"      : 219,
            "back slash"        : 220,
            "close braket"      : 221,
            "single quote"      : 222
        })};
    }
}