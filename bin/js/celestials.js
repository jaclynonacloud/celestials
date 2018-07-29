var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var celestials;
(function (celestials) {
    var managers;
    (function (managers) {
        var InputManager = /** @class */ (function () {
            function InputManager() {
                InputManager._bindings = new celestials.Dictionary();
            }
            /*---------------------------------------------- METHODS -------------------------------------*/
            /**
             * Adds a binding to the dictionary for easy access.
             * @param key The key to associate the binding with.  For example: "jump", "leftarrow", "run jump".
             * @param binding The binding for the key.
             */
            InputManager.addBinding = function (key, binding) {
                if (InputManager._bindings.containsKey(key)) {
                    console.log("Cannot build binding.  Key already has binding - " + key + ".  Try removing it if you need to.");
                    return;
                }
                InputManager._bindings.add(key, binding);
            };
            InputManager.removeBinding = function (key) {
                if (!InputManager._bindings.containsKey(key))
                    return;
                var binding = InputManager._bindings.getValue(key);
                binding.kill();
                InputManager._bindings.remove(key);
            };
            InputManager.updateBinding = function (key, binding) {
                if (InputManager._bindings.containsKey(key))
                    InputManager._bindings.setValue(key, binding);
            };
            InputManager.update = function () {
                var e_1, _a;
                try {
                    for (var _b = __values(this._bindings.List), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var binding = _c.value;
                        binding.update();
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            };
            Object.defineProperty(InputManager, "Bindings", {
                /*---------------------------------------------- ABSTRACTS -----------------------------------*/
                /*---------------------------------------------- INTERFACES ----------------------------------*/
                /*---------------------------------------------- EVENTS --------------------------------------*/
                /*---------------------------------------------- GETS & SETS ---------------------------------*/
                get: function () { return InputManager._bindings; },
                enumerable: true,
                configurable: true
            });
            return InputManager;
        }());
        managers.InputManager = InputManager;
    })(managers = celestials.managers || (celestials.managers = {}));
})(celestials || (celestials = {}));
(function (celestials) {
    var KeyBinding = /** @class */ (function () {
        /**
         * Creates a key binding.  Can hold multiple keys, for combos like "shift+e", "ctrl+q", etc.
         * @param callback A callback for when the key binding has been activated.
         * @param key The key(s) to listen to.
         */
        function KeyBinding(callback, state) {
            var key = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                key[_i - 2] = arguments[_i];
            }
            this._callback = callback;
            this._state = state;
            console.log("STATE: " + this._state);
            //set the keys
            this._keys = key;
            this._keysPressed = Array();
            for (var i = 0; i < this._keys.length; i++)
                this._keysPressed[i] = false;
            //register the events
            this._kDown = this._onKeyDown.bind(this);
            this._kUp = this._onKeyUp.bind(this);
            //listen to events
            switch (this._state) {
                case KeyBinding.State.Pressed:
                case KeyBinding.State.Up:
                case KeyBinding.State.Down:
                    celestials.App.Window.addEventListener("keyup", this._kUp);
                    celestials.App.Window.addEventListener("keydown", this._kDown);
                    break;
                default:
                    console.log("Please use the Keybinding.State states to set a state to listen to.");
            }
        }
        Object.defineProperty(KeyBinding, "State", {
            get: function () { return Object.freeze({ "Down": 0, "Up": 1, "Pressed": 2 }); },
            enumerable: true,
            configurable: true
        });
        /**Kills the key binding listeners. */
        KeyBinding.prototype.kill = function () {
            celestials.App.Window.removeEventListener("keydown", this._kDown);
            celestials.App.Window.removeEventListener("keyup", this._kUp);
        };
        /**Calls the callback of the binding. */
        KeyBinding.prototype.call = function () {
            if (this._callback != null)
                this._callback();
        };
        /**Checks binding keys to see if they are pressed.  Will call callback if so. */
        KeyBinding.prototype.checkBinding = function () {
            //test all keys
            for (var i = 0; i < this._keys.length; i++)
                if (this._keysPressed[i] == false)
                    return false;
            //if nothing stopped us from getting here, our binding is a success!
            this.call();
            return true;
        };
        KeyBinding.prototype.update = function () {
            if (this._state == KeyBinding.State.Pressed)
                this.checkBinding();
        };
        /*--------------------- EVENTS --------------*/
        KeyBinding.prototype._onKeyDown = function (e) {
            //mark key as pressed if listening
            var index = this._keys.indexOf(e.keyCode);
            if (index != -1) {
                if (this._keysPressed[index])
                    return;
                this._keysPressed[index] = true;
                if (this._state == KeyBinding.State.Down)
                    this.checkBinding();
            }
        };
        KeyBinding.prototype._onKeyUp = function (e) {
            //mark key as not pressed if listening
            var index = this._keys.indexOf(e.keyCode);
            if (index != -1) {
                if (this._state == KeyBinding.State.Up)
                    this.checkBinding();
                this._keysPressed[index] = false;
            }
        };
        Object.defineProperty(KeyBinding.prototype, "Callback", {
            get: function () { return this._callback; },
            enumerable: true,
            configurable: true
        });
        return KeyBinding;
    }());
    celestials.KeyBinding = KeyBinding;
    var Key = /** @class */ (function () {
        function Key() {
        }
        Object.defineProperty(Key, "Code", {
            get: function () {
                return Object.freeze({
                    "backspace": 8,
                    "tab": 9,
                    "enter": 13,
                    "shift": 16,
                    "ctrl": 17,
                    "alt": 18,
                    "pause/break": 19,
                    "caps lock": 20,
                    "escape": 27,
                    "page up": 33,
                    "page down": 34,
                    "end": 35,
                    "home": 36,
                    "left arrow": 37,
                    "up arrow": 38,
                    "right arrow": 39,
                    "down arrow": 40,
                    "insert": 45,
                    "delete": 46,
                    "0": 48,
                    "1": 49,
                    "2": 50,
                    "3": 51,
                    "4": 52,
                    "5": 53,
                    "6": 54,
                    "7": 55,
                    "8": 56,
                    "9": 57,
                    "a": 65,
                    "b": 66,
                    "c": 67,
                    "d": 68,
                    "e": 69,
                    "f": 70,
                    "g": 71,
                    "h": 72,
                    "i": 73,
                    "j": 74,
                    "k": 75,
                    "l": 76,
                    "m": 77,
                    "n": 78,
                    "o": 79,
                    "p": 80,
                    "q": 81,
                    "r": 82,
                    "s": 83,
                    "t": 84,
                    "u": 85,
                    "v": 86,
                    "w": 87,
                    "x": 88,
                    "y": 89,
                    "z": 90,
                    "left window key": 91,
                    "right window key": 92,
                    "select key": 93,
                    "numpad 0": 96,
                    "numpad 1": 97,
                    "numpad 2": 98,
                    "numpad 3": 99,
                    "numpad 4": 100,
                    "numpad 5": 101,
                    "numpad 6": 102,
                    "numpad 7": 103,
                    "numpad 8 9": 104,
                    "numpad": 105,
                    "multiply": 106,
                    "add": 107,
                    "subtract": 109,
                    "decimal point": 110,
                    "divide": 111,
                    "f1": 112,
                    "f2": 113,
                    "f3": 114,
                    "f4": 115,
                    "f5": 116,
                    "f6": 117,
                    "f7": 118,
                    "f8": 119,
                    "f9": 120,
                    "f10": 121,
                    "f11": 122,
                    "f12": 123,
                    "num lock": 144,
                    "scroll lock": 145,
                    "semi-colon": 186,
                    "equal sign": 187,
                    "comma": 188,
                    "dash": 189,
                    "period": 190,
                    "forward slash": 191,
                    "grave accent": 192,
                    "open bracket": 219,
                    "back slash": 220,
                    "close braket": 221,
                    "single quote": 222
                });
            },
            enumerable: true,
            configurable: true
        });
        ;
        return Key;
    }());
    celestials.Key = Key;
})(celestials || (celestials = {}));
///<reference path="./../managers/InputManager.ts" />
var celestials;
(function (celestials) {
    var systems;
    (function (systems) {
        var InputManager = celestials.managers.InputManager;
        var Controls = /** @class */ (function () {
            function Controls() {
                Controls._instance = this;
                this._openMenuKey = [celestials.Key.Code.w];
                this._closeMenuKey = [celestials.Key.Code.q];
                //add initial bindings
                InputManager.addBinding("open menu", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._openMenu.bind(this), celestials.KeyBinding.State.Down], this._openMenuKey)))());
                InputManager.addBinding("close menu", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._closeMenu.bind(this), celestials.KeyBinding.State.Down], this._closeMenuKey)))());
            }
            /*---------------------------------------------- METHODS -------------------------------------*/
            Controls.prototype._openMenu = function () {
                console.log("Open menu!");
            };
            Controls.prototype._closeMenu = function () {
                console.log("Close menu!");
            };
            return Controls;
        }());
        systems.Controls = Controls;
    })(systems = celestials.systems || (celestials.systems = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var entities;
    (function (entities) {
        var Entity = /** @class */ (function () {
            function Entity(name, node, data) {
                if (data === void 0) { data = null; }
                this._name = name;
                this._node = node.cloneNode(true);
                this._node.style.position = "absolute";
                this._node.classList.remove("template");
                this._position = {
                    x: 0,
                    y: 0
                };
                this._registrationPoint = {
                    x: 0.5,
                    y: 1
                };
                this._direction = {
                    //1,1 faces right, upright
                    x: 1,
                    y: 1
                };
                this._data = data;
                //setup with data, if applicable
                if (this._data != null) {
                    if (this._data.position != null)
                        this._position = this._data.position;
                    if (this._data.registrationPoint != null)
                        this._registrationPoint = this._data.registrationPoint;
                    if (this._direction != null)
                        this._direction = this._data.direction;
                }
            }
            /*---------------------------------------------- METHODS -------------------------------------*/
            Entity.prototype.load = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        //set position
                        console.log(this._position);
                        this.X = this._position.x;
                        this.Y = this._position.y;
                        return [2 /*return*/];
                    });
                });
            };
            Object.defineProperty(Entity.prototype, "Node", {
                /*---------------------------------------------- ABSTRACTS -----------------------------------*/
                /*---------------------------------------------- INTERFACES ----------------------------------*/
                /*---------------------------------------------- EVENTS --------------------------------------*/
                /*---------------------------------------------- GETS & SETS ---------------------------------*/
                get: function () { return this._node; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Entity.prototype, "Name", {
                get: function () { return this._name; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Entity.prototype, "Data", {
                get: function () { return this._data; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Entity.prototype, "X", {
                get: function () { return this._position.x; },
                set: function (value) {
                    this._position.x = value;
                    this._node.style.left = this._position.x + "px";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Entity.prototype, "Y", {
                get: function () { return this._position.y; },
                set: function (value) {
                    this._position.y = value;
                    this._node.style.top = this._position.y + "px";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Entity.prototype, "RegistrationPoint", {
                get: function () { return this._registrationPoint; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Entity.prototype, "RegistrationOffset", {
                get: function () {
                    return {
                        x: this.Width * this._registrationPoint.x,
                        //because we are attached to the bottom, 
                        //our reg point needs to start at the bottom
                        y: this.Height - (this.Height * this._registrationPoint.y)
                    };
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Entity.prototype, "Width", {
                get: function () {
                    return this._mainImage.getBoundingClientRect().width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Entity.prototype, "Height", {
                get: function () {
                    return this._mainImage.getBoundingClientRect().height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Entity.prototype, "Bounds", {
                get: function () {
                    // return new Rect(this._position.x, this._position.y, this._mainImage.getBoundingClientRect().width, this._mainImage.getBoundingClientRect().height); 
                    return new celestials.Rect(this._position.x - this.RegistrationOffset.x, this._position.y - (this.Height - this.RegistrationOffset.y), this.Width, this.Height);
                },
                enumerable: true,
                configurable: true
            });
            return Entity;
        }());
        entities.Entity = Entity;
    })(entities = celestials.entities || (celestials.entities = {}));
})(celestials || (celestials = {}));
///<reference path="./../Entity.ts" />
var celestials;
(function (celestials) {
    var entities;
    (function (entities) {
        var Celestial = /** @class */ (function (_super) {
            __extends(Celestial, _super);
            function Celestial(node, container, json) {
                var _this = _super.call(this, json.name, node, json) || this;
                _this._container = container;
                //create the main image holder
                // this._mainImage = document.createElement("img");
                // this._mainImage.classList.add("mainImage");
                console.log(_this._node);
                _this._mainImage = _this._node.querySelector(".main-image");
                //add name to node
                _this._node.dataset.name = _this.Name;
                console.log("Created: " + _this.Name);
                _this._eventsRegistry = new celestials.Dictionary();
                _this._eventsRegistry.add("sequenceComplete", _this._onSequenceComplete.bind(_this));
                return _this;
            }
            /*---------------------------------------------- METHODS -------------------------------------*/
            /**
             * Loads the Celestial's graphics and other data.
             */
            Celestial.prototype.load = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var e_2, _a, e_3, _b, data, _loop_1, _c, _d, imgData, _loop_2, _e, _f, spritesheet;
                    var _this = this;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, _super.prototype.load.call(this)];
                            case 1:
                                _g.sent();
                                data = this._data;
                                //create logic
                                this._logic = new celestials.logic.CelestialLogic(this);
                                //create physics
                                this._physics = new celestials.engines.Physics(this);
                                //set the scale
                                this._scale = celestials.randomRange(data.scale.min, data.scale.max);
                                _loop_1 = function (imgData) {
                                    //go get the images to load
                                    var img = document.createElement("img");
                                    //listen for load
                                    img.onload = function () {
                                        console.log("LOADED");
                                        //set the image
                                        imgData.src = img.src;
                                    };
                                    //load the image
                                    img.src = data.path + imgData.path;
                                    console.log("LOAD THE IMAGE");
                                };
                                try {
                                    // this._mainImage.style.transform = `scale(${this._scale})`;
                                    // this._mainImage.parentElement.style.transformOrigin = `${50}%} ${100}%`;
                                    //iterate through each image
                                    for (_c = __values(data.images), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        imgData = _d.value;
                                        _loop_1(imgData);
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                                _loop_2 = function (spritesheet) {
                                    //go get the images to load
                                    var img = document.createElement("img");
                                    //listen for laod
                                    img.onload = function () {
                                        var e_4, _a;
                                        var _loop_3 = function (frame) {
                                            //give the chop
                                            //give the chop
                                            celestials.cropImage(img, frame.x, frame.y, frame.width, frame.height, function (crop) {
                                                //set as the image
                                                frame.src = crop.src;
                                            });
                                        };
                                        try {
                                            //set each frame
                                            for (var _b = __values(spritesheet.frames), _c = _b.next(); !_c.done; _c = _b.next()) {
                                                var frame = _c.value;
                                                _loop_3(frame);
                                            }
                                        }
                                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                        finally {
                                            try {
                                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                            }
                                            finally { if (e_4) throw e_4.error; }
                                        }
                                    };
                                    //load the spritesheet image
                                    img.src = data.path + spritesheet.path;
                                };
                                try {
                                    //iterate through each spritesheet
                                    for (_e = __values(data.spritesheets), _f = _e.next(); !_f.done; _f = _e.next()) {
                                        spritesheet = _f.value;
                                        _loop_2(spritesheet);
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                                // img.onload = () => {
                                //     //iterate through the spritesheets
                                //     for(let i = 0; i < data.spritesheets.length; i++) {
                                //         //iterate through the frames
                                //         for(let n = 0; n < data.spritesheets[i].frames.length; n++) {
                                //             let frame = data.spritesheets[i].frames[n];
                                //             //give the chop
                                //             cropImage(img, frame.x, frame.y, frame.width, frame.height, (crop) => {
                                //                 //set as the image
                                //                 frame.img = crop;
                                //                 //load the celestial into its container
                                //                 this._container.appendChild(this._node);
                                //             });
                                //         }
                                //         //load the spritesheet image
                                //         img.src = data.path + data.spritesheets[i].src;
                                //     }
                                // }
                                //put the container in
                                this._container.appendChild(this._node);
                                //wire listeners
                                this._logic.addSequenceCompleteListener(this._eventsRegistry.getValue("sequenceComplete"));
                                this._node.addEventListener("click", function () { return console.log("I'VE CLICKED: " + _this.Name); });
                                return [2 /*return*/];
                        }
                    });
                });
            };
            /**
             * Unloads the Celestial's graphics and other data.
             */
            Celestial.prototype.unload = function () {
                //remove listeners
                this._logic.removeSequenceCompleteListener();
            };
            Celestial.prototype.draw = function (src) {
                var _this = this;
                if (src == null || src == "")
                    return;
                this._mainImage.onload = function () {
                    //set the scale
                    _this._mainImage.style.width = _this._mainImage.naturalWidth * _this._scale + "px";
                    _this._mainImage.style.height = _this._mainImage.naturalHeight * _this._scale + "px";
                    //offset by registration point
                    var x = "-" + _this.RegistrationOffset.x + "px";
                    var y = "-" + _this.RegistrationOffset.y + "px";
                    // this._mainImage.parentElement.style.transform = `translate(${x} ${y})`;
                    _this._mainImage.style.left = "-" + _this.RegistrationOffset.x + "px";
                    _this._mainImage.style.bottom = "-" + _this.RegistrationOffset.y + "px";
                };
                if (this._mainImage.src != src)
                    this._mainImage.src = src;
            };
            Celestial.prototype.getImageByName = function (name) {
                var e_5, _a, e_6, _b, e_7, _c;
                try {
                    //search images
                    for (var _d = __values(this.Data.images), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var imageData = _e.value;
                        if (imageData.name == name)
                            return imageData.src;
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                try {
                    //search spritesheets
                    for (var _f = __values(this.Data.spritesheets), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var spritesheet = _g.value;
                        try {
                            for (var _h = __values(spritesheet.frames), _j = _h.next(); !_j.done; _j = _h.next()) {
                                var frame = _j.value;
                                if (frame.name == name)
                                    return frame.src;
                            }
                        }
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                            }
                            finally { if (e_7) throw e_7.error; }
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                return null;
            };
            /*---------------------------------------------- ABSTRACTS -----------------------------------*/
            /*---------------------------------------------- INTERFACES ----------------------------------*/
            Celestial.prototype.clone = function () {
                var clone = new Celestial(celestials.managers.CelestialsManager.Template, this._container, JSON.parse(JSON.stringify(this._data)));
                return clone;
            };
            Celestial.prototype.update = function () {
                this._logic.update();
                this._physics.update();
            };
            /*---------------------------------------------- EVENTS --------------------------------------*/
            Celestial.prototype._onSequenceComplete = function () {
                console.log("SEQUENCE COMPLETE");
                //TODO set a sequence hierarchy either here or in logic.  Probably in logic.
                this._logic.changeSequence(this._logic.Sequences.idles[0]);
            };
            Object.defineProperty(Celestial.prototype, "Lookup", {
                /*---------------------------------------------- GETS & SETS ---------------------------------*/
                get: function () { return this.Data.lookup; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Data", {
                get: function () { return this._data; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Logic", {
                get: function () { return this._logic; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Physics", {
                get: function () { return this._physics; },
                enumerable: true,
                configurable: true
            });
            return Celestial;
        }(entities.Entity));
        entities.Celestial = Celestial;
    })(entities = celestials.entities || (celestials.entities = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    /**
     * Creates an HTMLImageElement of a file object once loaded.
     * @param file The file object to create the image from.
     * @param callback The function that will call when the image is loaded.
     */
    function createImageFromFile(file, callback) {
        //create an image element
        var img = document.createElement("img");
        //create the reader for the file
        var reader = new FileReader();
        //load handler
        reader.onload = function (e) {
            img.onload = function (ev) { return callback(img); };
            img.src = e.target.result;
        };
        //read
        reader.readAsDataURL(file);
    }
    celestials.createImageFromFile = createImageFromFile;
    /**
     * Clamps the number between the min/max.
     */
    function clamp(value, min, max) {
        return (value < min) ? min : (value > max) ? max : value;
    }
    celestials.clamp = clamp;
    /**Returns a random number within the specified range. */
    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    celestials.randomRange = randomRange;
    /**Returns a random whole number within the specified range. */
    function randomRangeInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    celestials.randomRangeInt = randomRangeInt;
    /**Fetches a json file and returns the results via a callback function. */
    function fetchJson(filename, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(filename)
                            .then(function (blob) { return blob.json(); })
                            .then(function (json) { return callback(json); })
                            .catch(function (e) { return console.log("Could not get file from " + filename + "\n" + e); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    celestials.fetchJson = fetchJson;
    /**Returns the max bounds of a node, including its children. */
    // export function maxBounds(node:HTMLElement) {
    //     const children = node.children;
    //     let maxWidth:number = (children[0] as HTMLElement).getBoundingClientRect().width;
    //     let maxHeight:number = (children[0] as HTMLElement).getBoundingClientRect().height;
    //     for(let i = 0; i < children.length; i++) {
    //         maxWidth = Math.max(maxWidth, (children[i] as HTMLElement).getBoundingClientRect().width);
    //         maxHeight = Math.max(maxHeight, (children[i] as HTMLElement).getBoundingClientRect().height);
    //     }
    //     return {x:maxWidth, y:maxHeight};
    // }
    /**
     * A key value pairing list.
     */
    var Dictionary = /** @class */ (function () {
        function Dictionary() {
            this._pairs = new Array();
        }
        Dictionary.prototype.add = function (key, value) {
            this._pairs.push([key, value]);
        };
        Dictionary.prototype.remove = function (key) {
            for (var i = 0; i < this._pairs.length; i++)
                if (this._pairs[i][0] == key)
                    this._pairs.splice(i, 1);
        };
        Dictionary.prototype.getValue = function (key) {
            for (var i = 0; i < this._pairs.length; i++)
                if (this._pairs[i][0] == key)
                    return this._pairs[i][1];
            return null;
        };
        Dictionary.prototype.setValue = function (key, value) {
            for (var i = 0; i < this._pairs.length; i++)
                if (this._pairs[i][0] == key)
                    this._pairs[i][1] = value;
        };
        Dictionary.prototype.containsKey = function (key) {
            for (var i = 0; i < this._pairs.length; i++)
                if (this._pairs[i][0] == key)
                    return true;
            return false;
        };
        Dictionary.prototype.containsValue = function (value) {
            for (var i = 0; i < this._pairs.length; i++)
                if (this._pairs[i][1] == value)
                    return true;
            return false;
        };
        Object.defineProperty(Dictionary.prototype, "List", {
            get: function () {
                var list = new Array();
                for (var i = 0; i < this._pairs.length; i++)
                    list.push(this._pairs[i][1]);
                return list;
            },
            enumerable: true,
            configurable: true
        });
        return Dictionary;
    }());
    celestials.Dictionary = Dictionary;
    /**
     * Creates a rectangle object.
     */
    var Rect = /** @class */ (function () {
        function Rect(x, y, width, height) {
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
        }
        Rect.prototype.reset = function () {
            this._x = 0;
            this._y = 0;
            this._width = 0;
            this._height = 0;
        };
        Rect.prototype.toString = function () {
            return "Rect(x:" + this._x + ", y:" + this._y + ", w:" + this._width + ", h:" + this._height;
        };
        Object.defineProperty(Rect.prototype, "X", {
            get: function () { return this._x; },
            set: function (value) { this._x = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "Y", {
            get: function () { return this._y; },
            set: function (value) { this._y = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "Width", {
            get: function () { return this._width; },
            set: function (value) { this._width = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "Height", {
            get: function () { return this._height; },
            set: function (value) { this._height = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "Left", {
            get: function () { return this._x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "Top", {
            get: function () { return this._y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "Right", {
            get: function () { return this._x + this._width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "Bottom", {
            get: function () { return this._y + this._height; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "Center", {
            get: function () { return { x: this._x + this._width / 2, y: this._y + this._height / 2 }; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect, "Empty", {
            get: function () { return new Rect(0, 0, 0, 0); },
            enumerable: true,
            configurable: true
        });
        return Rect;
    }());
    celestials.Rect = Rect;
    /**
     * Use html2canvas to create a cropped image.
     * @param img
     * @param x
     * @param y
     * @param w
     * @param h
     */
    function cropImage(img, x, y, w, h, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var canvas, _a, ctx, imgDiv;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        canvas = document.createElement("canvas");
                        _a = canvas;
                        return [4 /*yield*/, "tempCanvas"];
                    case 1:
                        _a.id = _b.sent();
                        canvas.width = w;
                        canvas.height = h;
                        document.body.appendChild(canvas);
                        ctx = canvas.getContext("2d");
                        ctx.drawImage(img, -x, -y);
                        imgDiv = document.createElement("img");
                        imgDiv.onload = function () { return callback(imgDiv); };
                        imgDiv.src = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                        //destroy canvas
                        canvas.remove();
                        canvas = null;
                        return [2 /*return*/];
                }
            });
        });
    }
    celestials.cropImage = cropImage;
})(celestials || (celestials = {}));
///<reference path="./../components/entities/celestials/Celestial.ts" />
///<reference path="./../Tools.ts" />
var celestials;
(function (celestials) {
    var managers;
    (function (managers) {
        var Celestial = celestials.entities.Celestial;
        var CelestialsManager = /** @class */ (function () {
            function CelestialsManager() {
                CelestialsManager._instance = this;
                CelestialsManager._lookup = new celestials.Dictionary();
                CelestialsManager._data = new celestials.Dictionary();
                this._template = document.querySelector(".template.celestial");
                this._container = document.querySelector(".celestials");
                this._templates = new Array();
                this._celestials = new Array();
                this._setup();
            }
            /*---------------------------------------------- METHODS -------------------------------------*/
            CelestialsManager.prototype._setup = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var e_8, _a, e_9, _b, files, files_1, files_1_1, file, e_8_1, _c, _d, temp;
                    var _this = this;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                files = ["./res/celestials/solaris/solaris.json"];
                                _e.label = 1;
                            case 1:
                                _e.trys.push([1, 6, 7, 8]);
                                files_1 = __values(files), files_1_1 = files_1.next();
                                _e.label = 2;
                            case 2:
                                if (!!files_1_1.done) return [3 /*break*/, 5];
                                file = files_1_1.value;
                                return [4 /*yield*/, celestials.fetchJson(file, function (json) {
                                        //DEBUG create celectial
                                        var cel = new Celestial(_this._template, _this._container, json);
                                        CelestialsManager.addTemplate(cel);
                                    })];
                            case 3:
                                _e.sent();
                                _e.label = 4;
                            case 4:
                                files_1_1 = files_1.next();
                                return [3 /*break*/, 2];
                            case 5: return [3 /*break*/, 8];
                            case 6:
                                e_8_1 = _e.sent();
                                e_8 = { error: e_8_1 };
                                return [3 /*break*/, 8];
                            case 7:
                                try {
                                    if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
                                }
                                finally { if (e_8) throw e_8.error; }
                                return [7 /*endfinally*/];
                            case 8:
                                try {
                                    //DEBUG let app/user decide what celestials are added
                                    for (_c = __values(this._templates), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        temp = _d.value;
                                        CelestialsManager.addCelestial(temp.Lookup);
                                        console.log("ADDED: " + temp.Name);
                                    }
                                }
                                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                                finally {
                                    try {
                                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                                    }
                                    finally { if (e_9) throw e_9.error; }
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            /**
             * Adds a Celestial to the templates array, and gives their lookup to the lookup dictionary for easy selection.
             * @param celestial The Celestial object to add.
             */
            CelestialsManager.addTemplate = function (celestial) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!CelestialsManager._lookup.containsKey(celestial.Lookup)) {
                                    CelestialsManager._lookup.add(celestial.Lookup, celestial);
                                    CelestialsManager._data.add(celestial.Lookup, celestial.Data);
                                }
                                return [4 /*yield*/, CelestialsManager._instance._templates.push(celestial)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            };
            CelestialsManager.addCelestial = function (lookup) {
                return __awaiter(this, void 0, void 0, function () {
                    var celestial, data, copy;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                celestial = CelestialsManager._lookup.getValue(lookup);
                                if (!(celestial != null)) return [3 /*break*/, 2];
                                console.log("START BUILD");
                                data = CelestialsManager._data.getValue(lookup);
                                console.log("PASSING THE FOLLOWING DATA: " + data.position.x + ", " + data.position.y);
                                copy = celestial.clone();
                                console.log("COMPLETE BUILD");
                                if (!copy.load()) return [3 /*break*/, 2];
                                console.log("LOAD");
                                return [4 /*yield*/, CelestialsManager._instance._celestials.push(copy)];
                            case 1:
                                _a.sent();
                                console.log("FINISH LOAD");
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                });
            };
            CelestialsManager.update = function () {
                var e_10, _a;
                try {
                    //update the current celestials
                    for (var _b = __values(CelestialsManager._instance._celestials), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var cel = _c.value;
                        cel.update();
                    }
                }
                catch (e_10_1) { e_10 = { error: e_10_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_10) throw e_10.error; }
                }
            };
            Object.defineProperty(CelestialsManager, "Template", {
                /*---------------------------------------------- ABSTRACTS -----------------------------------*/
                /*---------------------------------------------- INTERFACES ----------------------------------*/
                /*---------------------------------------------- EVENTS --------------------------------------*/
                /*---------------------------------------------- GETS & SETS ---------------------------------*/
                get: function () { return CelestialsManager._instance._template; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CelestialsManager, "Templates", {
                get: function () { return CelestialsManager._instance._templates; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CelestialsManager, "Celestials", {
                get: function () { return CelestialsManager._instance._celestials; },
                enumerable: true,
                configurable: true
            });
            return CelestialsManager;
        }());
        managers.CelestialsManager = CelestialsManager;
    })(managers = celestials.managers || (celestials.managers = {}));
})(celestials || (celestials = {}));
///<reference path="./../managers/InputManager.ts" />
///<reference path="./../managers/CelestialsManager.ts" />
var celestials;
(function (celestials) {
    var systems;
    (function (systems) {
        var InputManager = celestials.managers.InputManager;
        var CelestialsManager = celestials.managers.CelestialsManager;
        var Debugger = /** @class */ (function () {
            function Debugger() {
                Debugger._instance = this;
                //debug
                var randoVelocityKey = [celestials.Key.Code.a];
                InputManager.addBinding("debug__velocity", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._randomVelocity.bind(this), celestials.KeyBinding.State.Down], randoVelocityKey)))());
                var leftKey = [celestials.Key.Code["left arrow"]];
                InputManager.addBinding("debug__left", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._sendLeft.bind(this), celestials.KeyBinding.State.Down], leftKey)))());
                var rightKey = [celestials.Key.Code["right arrow"]];
                InputManager.addBinding("debug__right", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._sendRight.bind(this), celestials.KeyBinding.State.Down], rightKey)))());
                var upKey = [celestials.Key.Code["up arrow"]];
                InputManager.addBinding("debug__up", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._sendUp.bind(this), celestials.KeyBinding.State.Down], upKey)))());
                var spawnCelestialKey = [celestials.Key.Code.z];
                InputManager.addBinding("debug__spawnCelestial", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._spawnCelestial.bind(this), celestials.KeyBinding.State.Down], spawnCelestialKey)))());
                var switchStateKey = [celestials.Key.Code.v];
                InputManager.addBinding("debug__switchStateCelestial", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._switchState.bind(this), celestials.KeyBinding.State.Down], switchStateKey)))());
            }
            /*---------------------------------------------- METHODS -------------------------------------*/
            Debugger.prototype._randomVelocity = function () {
                console.log("Rando Vel");
                //look for celestials
                for (var i = 0; i < CelestialsManager.Celestials.length; i++) {
                    //add rando velocity to each
                    var celestial = CelestialsManager.Celestials[i];
                    var x = celestials.randomRange(-150, 150);
                    var y = celestials.randomRange(-150, 0);
                    celestial.Physics.addForceX(x);
                    celestial.Physics.addForceY(y);
                    var grav = celestials.randomRange(2, 15);
                    celestial.Physics.setGravity(grav);
                }
            };
            Debugger.prototype._sendLeft = function () {
                var e_11, _a;
                try {
                    for (var _b = __values(CelestialsManager.Celestials), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var cel = _c.value;
                        cel.Physics.addForceX(-100);
                    }
                }
                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_11) throw e_11.error; }
                }
            };
            Debugger.prototype._sendRight = function () {
                var e_12, _a;
                try {
                    for (var _b = __values(CelestialsManager.Celestials), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var cel = _c.value;
                        cel.Physics.addForceX(100);
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
            };
            Debugger.prototype._sendUp = function () {
                var e_13, _a;
                try {
                    for (var _b = __values(CelestialsManager.Celestials), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var cel = _c.value;
                        cel.Physics.addForceY(-200);
                    }
                }
                catch (e_13_1) { e_13 = { error: e_13_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_13) throw e_13.error; }
                }
            };
            Debugger.prototype._spawnCelestial = function () {
                CelestialsManager.addCelestial("solaris");
            };
            Debugger.prototype._switchState = function () {
                var e_14, _a;
                try {
                    //switch to walk
                    for (var _b = __values(CelestialsManager.Celestials), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var celestial = _c.value;
                        celestial.Logic.changeState(celestials.logic.CelestialLogic.State.Walk);
                    }
                }
                catch (e_14_1) { e_14 = { error: e_14_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_14) throw e_14.error; }
                }
            };
            return Debugger;
        }());
        systems.Debugger = Debugger;
    })(systems = celestials.systems || (celestials.systems = {}));
})(celestials || (celestials = {}));
///<reference path="./systems/Controls.ts" />
///<reference path="./systems/Debugger.ts" />
///<reference path="./managers/CelestialsManager.ts" />
///<reference path="./managers/InputManager.ts" />
var celestials;
(function (celestials) {
    var App = /** @class */ (function () {
        function App(win, node) {
            App._instance = this;
            App._window = win;
            App._node = node;
            App.setup();
        }
        /*---------------------------------------------- METHODS -------------------------------------*/
        App.setup = function () {
            console.log("SETUP");
            App._bounds = new celestials.Rect(App._node.offsetLeft, App._node.offsetTop, App._node.offsetWidth, App._node.offsetHeight);
            //initialize managers
            var iM = new celestials.managers.InputManager();
            var cM = new celestials.managers.CelestialsManager();
            //initialize systems
            var controls = new celestials.systems.Controls();
            var debug = new celestials.systems.Debugger();
            //create binding for test
            // let wKey:KeyBinding = new KeyBinding(() => {
            //     console.log("PRESSED W");
            // }, KeyBinding.State.Up, Key.Code.ctrl, Key.Code.shift);
            // managers.InputManager.addBinding("Press W", wKey);
            // managers.InputManager.Bindings.getValue("Press W").call();
            //create update loop
            setInterval(function () {
                //update managers
                celestials.managers.InputManager.update();
                celestials.managers.CelestialsManager.update();
            }, 1000 / 30);
        };
        Object.defineProperty(App, "Window", {
            /*---------------------------------------------- ABSTRACTS -----------------------------------*/
            /*---------------------------------------------- INTERFACES ----------------------------------*/
            /*---------------------------------------------- EVENTS --------------------------------------*/
            /*---------------------------------------------- GETS & SETS ---------------------------------*/
            get: function () { return App._window; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "Node", {
            get: function () { return this._node; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "Bounds", {
            get: function () { return App._bounds; },
            enumerable: true,
            configurable: true
        });
        return App;
    }());
    celestials.App = App;
    new App(window, document.querySelector(".screen"));
})(celestials || (celestials = {}));
///<reference path="./Celestial.ts" />
var celestials;
(function (celestials) {
    var logic;
    (function (logic) {
        var CelestialLogic = /** @class */ (function () {
            function CelestialLogic(celestial) {
                this._celestial = celestial;
                this.reset();
                //look for sequences
                if (this.Data.sequences != null) {
                    this._sequences = this.Data.sequences;
                    this.changeState(CelestialLogic.State.Idle);
                }
            }
            Object.defineProperty(CelestialLogic, "State", {
                get: function () {
                    return Object.freeze({
                        "Idle": "idles",
                        "Walk": "walks"
                    });
                },
                enumerable: true,
                configurable: true
            });
            /*---------------------------------------------- METHODS -------------------------------------*/
            CelestialLogic.prototype.reset = function () {
                this._frameIndex = 0;
                this._holdIndex = 0;
                this._totalIndex = 0;
            };
            /**Changes the Celestial's state.  Use the CelestialLogic.State options. */
            CelestialLogic.prototype.changeState = function (state) {
                if (state === void 0) { state = CelestialLogic.State.Idle; }
                this._currentState = state;
                //TODO decide a factor for switching sequences
                var sequence = this.getRandomStateSequence(this._currentState);
                this.changeSequence(sequence);
            };
            /**Returns a random sequence from a given state.  Use the CelestialLogic.State options. */
            CelestialLogic.prototype.getRandomStateSequence = function (state) {
                var sequences = this._sequences[state];
                if (sequences.length > 0)
                    return sequences[celestials.randomRangeInt(0, sequences.length - 1)];
            };
            /**Changes to the given sequence. */
            CelestialLogic.prototype.changeSequence = function (sequence) {
                if (this._currentSequence != null)
                    this.reset();
                this._currentSequence = sequence;
                console.log("CHANGED SEQUENCE: " + this._currentSequence.name);
            };
            /**Calls the sequence completion.  Can be used to stop a sequence early. */
            CelestialLogic.prototype.completeSequence = function () {
                if (this._sequenceCompleteListener != null)
                    this._sequenceCompleteListener();
            };
            /*-------------- WIRES ------------*/
            CelestialLogic.prototype.addSequenceCompleteListener = function (listener) {
                this._sequenceCompleteListener = listener;
            };
            CelestialLogic.prototype.removeSequenceCompleteListener = function () {
                this._sequenceCompleteListener = null;
            };
            /*---------------------------------------------- ABSTRACTS -----------------------------------*/
            /*---------------------------------------------- INTERFACES ----------------------------------*/
            CelestialLogic.prototype.update = function () {
                if (this._currentSequence == null)
                    return;
                //set the image
                this._celestial.draw(this._celestial.getImageByName(this._currentSequence.frames[this._frameIndex].name));
                this._holdIndex++;
                this._totalIndex++;
                //do testing
                //test frame hold
                if (this._holdIndex > this._currentSequence.frames[this._frameIndex].hold * this._sequences.updateRate) {
                    this._frameIndex++;
                    this._holdIndex = 0;
                }
                //see if this is a looping sequence
                if (this._frameIndex > this._currentSequence.frames.length - 1) {
                    if (this._currentSequence.looping) //just reset the index
                        this._frameIndex = 0;
                    else //end the sequence
                        this.completeSequence();
                }
                //see if sequence time is complete
                if (this._totalIndex > this._currentSequence.duration * this._sequences.updateRate) {
                    this.completeSequence();
                }
                //handle state differences
                switch (this._currentState) {
                    case CelestialLogic.State.Walk:
                        this._handleWalk();
                        break;
                }
            };
            Object.defineProperty(CelestialLogic.prototype, "Data", {
                /*---------------------------------------------- EVENTS --------------------------------------*/
                /*---------------------------------------------- GETS & SETS ---------------------------------*/
                get: function () { return this._celestial.Data; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CelestialLogic.prototype, "Sequences", {
                get: function () { return this._sequences; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CelestialLogic.prototype, "CurrentSequence", {
                get: function () { return this._currentSequence; },
                enumerable: true,
                configurable: true
            });
            /*---------------------------------------------- STATES --------------------------------------*/
            CelestialLogic.prototype._handleWalk = function () {
                //get the movespeed
                var moveSpeed = this._currentSequence.frames[this._frameIndex].moveSpeed;
                if (moveSpeed != null)
                    this._celestial.Physics.addForceX(moveSpeed);
            };
            return CelestialLogic;
        }());
        logic.CelestialLogic = CelestialLogic;
    })(logic = celestials.logic || (celestials.logic = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var engines;
    (function (engines) {
        var Physics = /** @class */ (function () {
            function Physics(entity) {
                this._entity = entity;
                this._gravity = Physics.DEF_GRAVITY;
                this._usesGravity = true;
                this._velocityX = 0;
                this._velocityY = 0;
                this._degradeVelocity = 0.75;
                //read entity for gravity data
                if (this._entity.Data.physics != null) {
                    var data = this._entity.Data.physics;
                    if (data.gravity != null)
                        this._gravity = data.gravity;
                    if (data.degradeVelocity != null)
                        this._degradeVelocity = data.degradeVelocity;
                    if (data.usesGravity != null)
                        this._usesGravity = data.usesGravity;
                }
            }
            Object.defineProperty(Physics, "DEF_GRAVITY", {
                get: function () { return 10; },
                enumerable: true,
                configurable: true
            });
            /*---------------------------------------------- METHODS -------------------------------------*/
            Physics.prototype.addForceX = function (value) {
                this._velocityX += value;
            };
            Physics.prototype.addForceY = function (value) {
                this._velocityY += value;
            };
            Physics.prototype.setGravity = function (value) {
                this._gravity = value;
            };
            Physics.prototype.keepInBounds = function () {
                //get properties
                var screenBounds = celestials.App.Bounds;
                var entityBounds = this._entity.Bounds;
                var regOffset = this._entity.RegistrationOffset;
                // if(entityBounds.Left < screenBounds.Left) this._entity.X = screenBounds.Left;
                // else if(entityBounds.Right > screenBounds.Right) this._entity.X = screenBounds.Right - entityBounds.Width;
                // if(entityBounds.Top < screenBounds.Top) this._entity.Y = screenBounds.Top;
                // else if(entityBounds.Bottom > screenBounds.Bottom) this._entity.Y = screenBounds.Bottom - entityBounds.Height;
                if (entityBounds.Left < screenBounds.Left)
                    this._entity.X = screenBounds.Left + regOffset.x;
                else if (entityBounds.Right > screenBounds.Right)
                    this._entity.X = screenBounds.Right - (entityBounds.Width - regOffset.x);
                if (entityBounds.Top < screenBounds.Top)
                    this._entity.Y = screenBounds.Top + (entityBounds.Height - regOffset.y);
                else if (entityBounds.Bottom > screenBounds.Bottom)
                    this._entity.Y = screenBounds.Bottom - regOffset.y;
            };
            Physics.prototype.correctVelocity = function () {
                //get properties
                var screenBounds = celestials.App.Bounds;
                var entityBounds = this._entity.Bounds;
                if (entityBounds.Left <= screenBounds.Left)
                    if (this._velocityX < 0)
                        this._velocityX = 0;
                if (entityBounds.Right >= screenBounds.Right)
                    if (this._velocityX > 0)
                        this._velocityX = 0;
                if (entityBounds.Top <= screenBounds.Top)
                    if (this._velocityY < 0)
                        this._velocityY = 0;
                if (entityBounds.Bottom >= screenBounds.Bottom)
                    if (this._velocityY > 0)
                        this._velocityY = 0;
            };
            /*---------------------------------------------- ABSTRACTS -----------------------------------*/
            /*---------------------------------------------- INTERFACES ----------------------------------*/
            Physics.prototype.update = function () {
                //degrade velocity
                this._velocityX *= this._degradeVelocity;
                this._velocityY *= this._degradeVelocity;
                //add gravity to entity
                if (this._usesGravity) {
                    this._velocityY += this._gravity;
                }
                this.correctVelocity();
                //set the new position
                this._entity.X += this._velocityX;
                this._entity.Y += this._velocityY;
                this.keepInBounds();
            };
            return Physics;
        }());
        engines.Physics = Physics;
    })(engines = celestials.engines || (celestials.engines = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var systems;
    (function (systems) {
        var Weather = /** @class */ (function () {
            function Weather() {
            }
            return Weather;
        }());
        systems.Weather = Weather;
    })(systems = celestials.systems || (celestials.systems = {}));
})(celestials || (celestials = {}));
//# sourceMappingURL=celestials.js.map