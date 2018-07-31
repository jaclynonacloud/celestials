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
        var InputManager = (function () {
            function InputManager() {
                InputManager._bindings = new celestials.Dictionary();
            }
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
    var KeyBinding = (function () {
        function KeyBinding(callback, state) {
            var key = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                key[_i - 2] = arguments[_i];
            }
            this._callback = callback;
            this._state = state;
            console.log("STATE: " + this._state);
            this._keys = key;
            this._keysPressed = Array();
            for (var i = 0; i < this._keys.length; i++)
                this._keysPressed[i] = false;
            this._kDown = this._onKeyDown.bind(this);
            this._kUp = this._onKeyUp.bind(this);
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
        KeyBinding.prototype.kill = function () {
            celestials.App.Window.removeEventListener("keydown", this._kDown);
            celestials.App.Window.removeEventListener("keyup", this._kUp);
        };
        KeyBinding.prototype.call = function () {
            if (this._callback != null)
                this._callback();
        };
        KeyBinding.prototype.checkBinding = function () {
            for (var i = 0; i < this._keys.length; i++)
                if (this._keysPressed[i] == false)
                    return false;
            this.call();
            return true;
        };
        KeyBinding.prototype.update = function () {
            if (this._state == KeyBinding.State.Pressed)
                this.checkBinding();
        };
        KeyBinding.prototype._onKeyDown = function (e) {
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
    var Key = (function () {
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
var celestials;
(function (celestials) {
    var systems;
    (function (systems) {
        var InputManager = celestials.managers.InputManager;
        var Controls = (function () {
            function Controls() {
                Controls._instance = this;
                this._openMenuKey = [celestials.Key.Code.w];
                this._closeMenuKey = [celestials.Key.Code.q];
                InputManager.addBinding("open menu", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._openMenu.bind(this), celestials.KeyBinding.State.Down], this._openMenuKey)))());
                InputManager.addBinding("close menu", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._closeMenu.bind(this), celestials.KeyBinding.State.Down], this._closeMenuKey)))());
            }
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
        var Entity = (function () {
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
                    x: 1,
                    y: 1
                };
                this._data = data;
                this._imagesLookup = new celestials.Dictionary();
                this._isLoaded = false;
                if (this._data != null) {
                    if (this._data.position != null)
                        this._position = this._data.position;
                    if (this._data.registrationPoint != null)
                        this._registrationPoint = this._data.registrationPoint;
                    if (this._data.direction != null)
                        this._direction = this._data.direction;
                }
            }
            Entity.prototype.addImage = function (key, src) {
                if (this._imagesLookup.containsKey(key))
                    return false;
                this._imagesLookup.add(key, src);
                return true;
            };
            Entity.prototype.getImage = function (key) {
                if (this._imagesLookup.containsKey(key))
                    return this._imagesLookup.getValue(key);
            };
            Entity.prototype.flipX = function () {
                console.log("DIR: " + this._direction);
                this._direction.x *= -1;
                this.setDirectionX(this._direction.x);
            };
            Entity.prototype.setDirectionX = function (value) {
                this._direction.x = value;
                var deg = this._direction.x == 1 ? 0 : 180;
                this._node.style.transform = "rotateY(" + deg + "deg)";
            };
            Entity.prototype.load = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2, new Promise(function (resolve, reject) {
                                try {
                                    console.log(_this._position);
                                    _this.X = _this._position.x;
                                    _this.Y = _this._position.y;
                                    resolve();
                                }
                                catch (e) {
                                    reject();
                                }
                            })];
                    });
                });
            };
            Entity.prototype.unload = function () {
            };
            Object.defineProperty(Entity.prototype, "Node", {
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
            Object.defineProperty(Entity.prototype, "Direction", {
                get: function () { return this._direction; },
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
            Object.defineProperty(Entity.prototype, "IsLoaded", {
                get: function () {
                    return this._isLoaded;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Entity.prototype, "Bounds", {
                get: function () {
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
var celestials;
(function (celestials) {
    var entities;
    (function (entities) {
        var Celestial = (function (_super) {
            __extends(Celestial, _super);
            function Celestial(node, container, json) {
                var _this = _super.call(this, json.name, node, json) || this;
                _this._container = container;
                console.log(_this._node);
                _this._mainImage = _this._node.querySelector(".main-image");
                _this._node.dataset.name = _this.Name;
                console.log("Created: " + _this.Name);
                _this._eventsRegistry = new celestials.Dictionary();
                _this._eventsRegistry.add("sequenceComplete", _this._onSequenceComplete.bind(_this));
                _this._eventsRegistry.add("stateComplete", _this._onStateComplete.bind(_this));
                _this._eventsRegistry.add("wallHit", _this._onWallHit.bind(_this));
                return _this;
            }
            Celestial.prototype.draw = function (src) {
                var _this = this;
                if (src == this._mainImage.src)
                    return new Promise(function (resolve, reject) { resolve(this._mainImage); });
                return new Promise(function (resolve, reject) {
                    _this._mainImage.onload = function () {
                        console.log("CHANGING IMAGE");
                        var width = _this._mainImage.naturalWidth * _this._scale;
                        var height = _this._mainImage.naturalHeight * _this._scale;
                        _this._mainImage.style.width = width + "px";
                        _this._mainImage.style.height = height + "px";
                        var x = "-" + _this.RegistrationOffset.x + "px";
                        var y = "-" + _this.RegistrationOffset.y + "px";
                        _this._mainImage.style.left = x;
                        _this._mainImage.style.bottom = y;
                        resolve(_this._mainImage);
                    };
                    _this._mainImage.onerror = function () { return reject(new Error("Image could not be loaded!")); };
                    _this._mainImage.src = src;
                });
            };
            Celestial.prototype.drawCurrentFrame = function () {
                return this.draw(this.getImage(this._sequencer.CurrentFrame.name));
            };
            Celestial.prototype.clone = function () {
                var clone = new Celestial(celestials.managers.CelestialsManager.Template, this._container, JSON.parse(JSON.stringify(this._data)));
                return clone;
            };
            Celestial.prototype.load = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    try {
                        _super.prototype.load.call(_this)
                            .then(function () {
                            var e_2, _a, e_3, _b;
                            var data = _this._data;
                            _this._sequencer = new celestials.engines.CelestialSequencer(_this);
                            _this._physics = new celestials.engines.Physics(_this);
                            _this._logic = new celestials.logic.CelestialLogic(_this, _this.Data.logic || null);
                            _this._scale = celestials.randomRange(data.scale.min, data.scale.max);
                            var promises = new Array();
                            var _loop_1 = function (imgData) {
                                promises.push(new Promise(function (res, rej) {
                                    try {
                                        var img_1 = document.createElement("img");
                                        img_1.onload = function () {
                                            console.log("loaded image!");
                                            if (!_this.addImage(imgData.name, img_1.src))
                                                throw new Error("An image already exists belonging to " + _this.Name + " - " + imgData.name + ".  Please choose a unique name.");
                                            res();
                                        };
                                        img_1.src = data.path + imgData.path;
                                    }
                                    catch (e) {
                                        rej();
                                    }
                                }));
                            };
                            try {
                                for (var _c = __values(data.images), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    var imgData = _d.value;
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
                            var _loop_2 = function (spritesheet) {
                                promises.push(new Promise(function (res, rej) {
                                    try {
                                        var img_2 = document.createElement("img");
                                        img_2.onload = function () {
                                            var e_4, _a;
                                            var _loop_3 = function (frame) {
                                                console.log("loaded sprite!");
                                                celestials.cropImage(img_2, frame.x, frame.y, frame.w, frame.h, function (crop) {
                                                    if (!_this.addImage(frame.name, crop.src))
                                                        throw new Error("An image already exists belonging to " + _this.Name + " - " + frame.name + ".  Please choose a unique name.");
                                                    res();
                                                });
                                            };
                                            try {
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
                                        img_2.src = data.path + spritesheet.path;
                                    }
                                    catch (e) {
                                        rej();
                                    }
                                }));
                            };
                            try {
                                for (var _e = __values(data.spritesheets), _f = _e.next(); !_f.done; _f = _e.next()) {
                                    var spritesheet = _f.value;
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
                            Promise.all(promises)
                                .then(function () {
                                console.log("loaded all images!");
                                if (data.lookup == null)
                                    throw new Error("Celestial has no lookup property!");
                                if (data.name == null)
                                    throw new Error("Celestial has no name property!");
                                if (data.images == null && data.spritesheets == null)
                                    throw new Error("No images/spritesheets were supplied.");
                                _this._container.appendChild(_this._node);
                                console.log(_this._imagesLookup.FullList);
                                _this._logic.load()
                                    .then(function () {
                                    resolve();
                                    _this._isLoaded = true;
                                });
                                _this._sequencer.addSequenceCompleteListener(_this._eventsRegistry.getValue("sequenceComplete"));
                                _this._sequencer.addStateCompleteListener(_this._eventsRegistry.getValue("stateComplete"));
                                _this._physics.addWallHitListener(_this._eventsRegistry.getValue("wallHit"));
                                _this._node.addEventListener("click", function () { return console.log("I'VE CLICKED: " + _this.Name); });
                            });
                        });
                    }
                    catch (e) {
                        reject(new Error("Could not load Celestial. \n" + e));
                    }
                });
            };
            Celestial.prototype.unload = function () {
                this._sequencer.removeSequenceCompleteListener();
                this._sequencer.removeStateCompleteListener();
                this._physics.removeWallHitListener();
            };
            Celestial.prototype.update = function () {
                var _this = this;
                this._logic.update()
                    .then(function () { return _this._sequencer.update(); })
                    .then(function () { return _this.draw(_this.getImage(_this._sequencer.CurrentFrame.name)); })
                    .then(function (img) { return _this._physics.update(); });
            };
            Celestial.prototype._onSequenceComplete = function () {
                console.log("SEQUENCE COMPLETE");
                this._logic.next();
            };
            Celestial.prototype._onStateComplete = function () {
                this._logic.handleStateComplete();
            };
            Celestial.prototype._onWallHit = function (which) {
                console.log("Hit wall " + which);
                this._logic.handleWallHit(which);
            };
            Object.defineProperty(Celestial.prototype, "Lookup", {
                get: function () { return this.Data.lookup; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Data", {
                get: function () { return this._data; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Sequencer", {
                get: function () { return this._sequencer; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Physics", {
                get: function () { return this._physics; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Logic", {
                get: function () { return this._logic; },
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
    function createImageFromFile(file, callback) {
        var img = document.createElement("img");
        var reader = new FileReader();
        reader.onload = function (e) {
            img.onload = function (ev) { return callback(img); };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    celestials.createImageFromFile = createImageFromFile;
    function clamp(value, min, max) {
        return (value < min) ? min : (value > max) ? max : value;
    }
    celestials.clamp = clamp;
    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    celestials.randomRange = randomRange;
    function randomRangeInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    celestials.randomRangeInt = randomRangeInt;
    function fetchJson(filename, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, fetch(filename)
                            .then(function (blob) { return blob.json(); })
                            .then(function (json) { return callback(json); })
                            .catch(function (e) { return console.log("Could not get file from " + filename + "\n" + e); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    }
    celestials.fetchJson = fetchJson;
    function lerp(a, b, t) {
        return (b - a) * t + a;
    }
    celestials.lerp = lerp;
    var Dictionary = (function () {
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
        Object.defineProperty(Dictionary.prototype, "FullList", {
            get: function () {
                return this._pairs;
            },
            enumerable: true,
            configurable: true
        });
        return Dictionary;
    }());
    celestials.Dictionary = Dictionary;
    var Rect = (function () {
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
    function cropImage(img, x, y, w, h, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var canvas, _a, ctx, imgDiv;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        canvas = document.createElement("canvas");
                        _a = canvas;
                        return [4, "tempCanvas"];
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
                        canvas.remove();
                        canvas = null;
                        return [2];
                }
            });
        });
    }
    celestials.cropImage = cropImage;
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var managers;
    (function (managers) {
        var Celestial = celestials.entities.Celestial;
        var CelestialsManager = (function () {
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
            CelestialsManager.prototype._setup = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var e_5, _a, e_6, _b, files, files_1, files_1_1, file, e_5_1, _c, _d, temp;
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
                                if (!!files_1_1.done) return [3, 5];
                                file = files_1_1.value;
                                return [4, celestials.fetchJson(file, function (json) {
                                        var cel = new Celestial(_this._template, _this._container, json);
                                        CelestialsManager.addTemplate(cel);
                                    })];
                            case 3:
                                _e.sent();
                                _e.label = 4;
                            case 4:
                                files_1_1 = files_1.next();
                                return [3, 2];
                            case 5: return [3, 8];
                            case 6:
                                e_5_1 = _e.sent();
                                e_5 = { error: e_5_1 };
                                return [3, 8];
                            case 7:
                                try {
                                    if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
                                }
                                finally { if (e_5) throw e_5.error; }
                                return [7];
                            case 8:
                                try {
                                    for (_c = __values(this._templates), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        temp = _d.value;
                                        CelestialsManager.addCelestial(temp.Lookup);
                                        console.log("ADDED: " + temp.Name);
                                    }
                                }
                                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                                finally {
                                    try {
                                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                                    }
                                    finally { if (e_6) throw e_6.error; }
                                }
                                return [2];
                        }
                    });
                });
            };
            CelestialsManager.addTemplate = function (celestial) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!CelestialsManager._lookup.containsKey(celestial.Lookup)) {
                                    CelestialsManager._lookup.add(celestial.Lookup, celestial);
                                    CelestialsManager._data.add(celestial.Lookup, celestial.Data);
                                }
                                return [4, CelestialsManager._instance._templates.push(celestial)];
                            case 1:
                                _a.sent();
                                return [2];
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
                                if (!(celestial != null)) return [3, 2];
                                console.log("START BUILD");
                                data = CelestialsManager._data.getValue(lookup);
                                console.log("PASSING THE FOLLOWING DATA: " + data.position.x + ", " + data.position.y);
                                copy = celestial.clone();
                                console.log("COMPLETE BUILD");
                                if (!copy.load()) return [3, 2];
                                console.log("LOAD");
                                return [4, CelestialsManager._instance._celestials.push(copy)];
                            case 1:
                                _a.sent();
                                console.log("FINISH LOAD");
                                _a.label = 2;
                            case 2: return [2];
                        }
                    });
                });
            };
            CelestialsManager.update = function () {
                var e_7, _a;
                try {
                    for (var _b = __values(CelestialsManager._instance._celestials), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var cel = _c.value;
                        if (cel.IsLoaded)
                            cel.update();
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            };
            Object.defineProperty(CelestialsManager, "Template", {
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
var celestials;
(function (celestials) {
    var systems;
    (function (systems) {
        var InputManager = celestials.managers.InputManager;
        var CelestialsManager = celestials.managers.CelestialsManager;
        var Debugger = (function () {
            function Debugger() {
                Debugger._instance = this;
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
                var flipCelestialXKey = [celestials.Key.Code.x];
                InputManager.addBinding("debug__flipCelestialX", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._flipCelestialX.bind(this), celestials.KeyBinding.State.Down], flipCelestialXKey)))());
                var switchStateKey = [celestials.Key.Code.v];
                InputManager.addBinding("debug__switchStateCelestial", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._switchState.bind(this), celestials.KeyBinding.State.Down], switchStateKey)))());
                var pauseKey = [celestials.Key.Code.p];
                InputManager.addBinding("debug__pauseApp", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, __spread([void 0, this._togglePause.bind(this), celestials.KeyBinding.State.Down], pauseKey)))());
            }
            Debugger.prototype._randomVelocity = function () {
                console.log("Rando Vel");
                for (var i = 0; i < CelestialsManager.Celestials.length; i++) {
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
                var e_8, _a;
                try {
                    for (var _b = __values(CelestialsManager.Celestials), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var cel = _c.value;
                        cel.Physics.addForceX(-100);
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
            };
            Debugger.prototype._sendRight = function () {
                var e_9, _a;
                try {
                    for (var _b = __values(CelestialsManager.Celestials), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var cel = _c.value;
                        cel.Physics.addForceX(100);
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_9) throw e_9.error; }
                }
            };
            Debugger.prototype._sendUp = function () {
                var e_10, _a;
                try {
                    for (var _b = __values(CelestialsManager.Celestials), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var cel = _c.value;
                        cel.Physics.addForceY(-200);
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
            Debugger.prototype._spawnCelestial = function () {
                CelestialsManager.addCelestial("solaris");
            };
            Debugger.prototype._flipCelestialX = function () {
                var e_11, _a;
                try {
                    for (var _b = __values(CelestialsManager.Celestials), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var celestial = _c.value;
                        celestial.flipX();
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
            Debugger.prototype._switchState = function () {
                var e_12, _a;
                try {
                    for (var _b = __values(CelestialsManager.Celestials), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var celestial = _c.value;
                        celestial.Sequencer.changeState(celestials.engines.CelestialSequencer.State.Walk);
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
            Debugger.prototype._togglePause = function () {
                if (celestials.App.Paused)
                    celestials.App.resume();
                else
                    celestials.App.pause();
            };
            return Debugger;
        }());
        systems.Debugger = Debugger;
    })(systems = celestials.systems || (celestials.systems = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var App = (function () {
        function App(win, node) {
            App._instance = this;
            App._window = win;
            App._node = node;
            App._paused = false;
            App.setup();
        }
        App.setup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var iM, cM, controls, debug;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("SETUP");
                            App._bounds = new celestials.Rect(App._node.offsetLeft, App._node.offsetTop, App._node.offsetWidth, App._node.offsetHeight);
                            return [4, new celestials.managers.InputManager()];
                        case 1:
                            iM = _a.sent();
                            return [4, new celestials.managers.CelestialsManager()];
                        case 2:
                            cM = _a.sent();
                            return [4, new celestials.systems.Controls()];
                        case 3:
                            controls = _a.sent();
                            return [4, new celestials.systems.Debugger()];
                        case 4:
                            debug = _a.sent();
                            setInterval(function () {
                                if (App._paused)
                                    return;
                                celestials.managers.InputManager.update();
                                celestials.managers.CelestialsManager.update();
                            }, 1000 / 30);
                            return [2];
                    }
                });
            });
        };
        App.pause = function () {
            App._paused = true;
        };
        App.resume = function () {
            App._paused = false;
        };
        Object.defineProperty(App, "Window", {
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
        Object.defineProperty(App, "Paused", {
            get: function () { return App._paused; },
            enumerable: true,
            configurable: true
        });
        return App;
    }());
    celestials.App = App;
    new App(window, document.querySelector(".screen"));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var engines;
    (function (engines) {
        var Physics = (function () {
            function Physics(entity) {
                this._entity = entity;
                this._gravity = Physics.DEF_GRAVITY;
                this._usesGravity = true;
                this._velocityX = 0;
                this._velocityY = 0;
                this._degradeVelocity = 0.75;
                if (this._entity.Data.physics != null) {
                    var data = this._entity.Data.physics;
                    if (data.gravity != null)
                        this._gravity = data.gravity;
                    if (data.degradeVelocity != null)
                        this._degradeVelocity = data.degradeVelocity;
                    if (data.usesGravity != null)
                        this._usesGravity = data.usesGravity;
                }
                this._onWallHitListener = null;
            }
            Object.defineProperty(Physics, "Wall", {
                get: function () { return Object.freeze({ "Top": 0, "Right": 1, "Bottom": 2, "Left": 3 }); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Physics, "DEF_GRAVITY", {
                get: function () { return 10; },
                enumerable: true,
                configurable: true
            });
            Physics.prototype.addForceX = function (value) {
                this._velocityX += value;
            };
            Physics.prototype.addForceY = function (value) {
                this._velocityY += value;
                console.log("VEL: " + value);
                this.update();
            };
            Physics.prototype.setGravity = function (value) {
                this._gravity = value;
            };
            Physics.prototype.resetGravity = function () {
                this._gravity = this._entity.Data.physics.gravity || Physics.DEF_GRAVITY;
            };
            Physics.prototype.snapToLeft = function () {
                this._entity.X = celestials.App.Bounds.Left + this._entity.RegistrationOffset.x;
            };
            Physics.prototype.snapToRight = function () {
                this._entity.X = celestials.App.Bounds.Right - this._entity.Bounds.Width + this._entity.RegistrationOffset.x;
            };
            Physics.prototype.keepInBounds = function () {
                var screenBounds = celestials.App.Bounds;
                var entityBounds = this._entity.Bounds;
                var regOffset = this._entity.RegistrationOffset;
                if (entityBounds.Left < screenBounds.Left) {
                    this._entity.X = screenBounds.Left + regOffset.x;
                    this.callWallHit(Physics.Wall.Left);
                }
                else if (entityBounds.Right > screenBounds.Right) {
                    this._entity.X = screenBounds.Right - (entityBounds.Width - regOffset.x);
                    this.callWallHit(Physics.Wall.Right);
                }
                if (entityBounds.Top < screenBounds.Top) {
                    this._entity.Y = screenBounds.Top + (entityBounds.Height - regOffset.y);
                    this.callWallHit(Physics.Wall.Top);
                }
                else if (entityBounds.Bottom > screenBounds.Bottom) {
                    this._entity.Y = screenBounds.Bottom - regOffset.y;
                    this.callWallHit(Physics.Wall.Bottom);
                }
            };
            Physics.prototype.correctVelocity = function () {
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
            Physics.prototype.addWallHitListener = function (listener) {
                this._onWallHitListener = listener;
            };
            Physics.prototype.removeWallHitListener = function () {
                this._onWallHitListener = null;
            };
            Physics.prototype.callWallHit = function (wall) {
                this._touchedWall = wall;
                if (this._onWallHitListener != null)
                    this._onWallHitListener(wall);
            };
            Physics.prototype.update = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this._velocityX *= this._degradeVelocity;
                                this._velocityY *= this._degradeVelocity;
                                if (this._usesGravity) {
                                    this._velocityY += this._gravity;
                                }
                                return [4, this.correctVelocity()];
                            case 1:
                                _a.sent();
                                this._entity.X += this._velocityX;
                                this._entity.Y += this._velocityY;
                                return [4, this.keepInBounds()];
                            case 2:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            Object.defineProperty(Physics.prototype, "LastTouchedWall", {
                get: function () { return this._touchedWall; },
                enumerable: true,
                configurable: true
            });
            return Physics;
        }());
        engines.Physics = Physics;
    })(engines = celestials.engines || (celestials.engines = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var logic;
    (function (logic) {
        var Physics = celestials.engines.Physics;
        var CelestialLogic = (function () {
            function CelestialLogic(celestial, data) {
                this._celestial = celestial;
                this._updateRate = 1;
                this._eagerness = 1;
                this._attentionSpan = 50;
                this._tick = 0;
                this._updateTick = 0;
                if (data != null) {
                    if (data.updateRate != null)
                        this._updateRate = celestials.clamp(data.updateRate, 1, 1000);
                    if (data.eagerness != null)
                        this._eagerness = celestials.clamp(data.eagerness, 1, 100);
                    if (data.attentionSpan != null)
                        this._attentionSpan = celestials.clamp(data.attentionSpan, 0, 100);
                }
            }
            CelestialLogic.prototype.next = function () {
                this._tick += this._eagerness;
                var attentionSpan = this._attentionSpan;
                var attention = celestials.randomRangeInt(this._tick, 100);
                console.log("TICK:" + this._tick + ", ATTENTION:" + attention + ", SPAN:" + attentionSpan);
                if (attention > attentionSpan) {
                    console.log("CHANGE STATE!");
                    var state = this._celestial.Sequencer.changeState(this._celestial.Sequencer.getRandomState());
                    var sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                    this._celestial.Sequencer.changeSequence(sequence);
                    this._tick = 0;
                }
                else {
                    console.log("I'm not bored yet!");
                    var sequence = this._celestial.Sequencer.getRandomStateSequence(this._celestial.Sequencer.CurrentState);
                    this._celestial.Sequencer.changeSequence(sequence);
                }
                var random = celestials.randomRange(0, 1);
                if (this._celestial.Sequencer.CurrentState != celestials.engines.CelestialSequencer.State.Climb) {
                    console.log("I wanna flip!");
                    var wantToFlipX = celestials.lerp((this._eagerness * 5), 100, random);
                    if (wantToFlipX > this._attentionSpan)
                        this._celestial.flipX();
                }
            };
            CelestialLogic.prototype.handleWallHit = function (which) {
                var _this = this;
                if (which == Physics.Wall.Left || which == Physics.Wall.Right) {
                    if (celestials.randomRange(0, 1) > 0) {
                        var state = this._celestial.Sequencer.changeState(celestials.engines.CelestialSequencer.State.Climb);
                        if (state != celestials.engines.CelestialSequencer.State.Climb)
                            return;
                        var sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                        if (sequence != null) {
                            this._celestial.Sequencer.changeSequence(sequence);
                            this._celestial.drawCurrentFrame()
                                .then(function () {
                                console.log("6-Handle Wall");
                                _this.reset();
                                switch (which) {
                                    case Physics.Wall.Left:
                                        _this._celestial.Physics.snapToLeft();
                                        _this._celestial.setDirectionX(1);
                                        break;
                                    case Physics.Wall.Right:
                                        _this._celestial.Physics.snapToRight();
                                        _this._celestial.setDirectionX(-1);
                                }
                            });
                        }
                    }
                }
            };
            CelestialLogic.prototype.handleStateComplete = function () {
                var state = this._celestial.Sequencer.CurrentState;
                var funcName = "_complete" + state[0].toUpperCase() + state.substr(1);
                if (this[funcName] != null)
                    this[funcName]();
            };
            CelestialLogic.prototype.reset = function () {
                this._tick = 0;
            };
            CelestialLogic.prototype.load = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    try {
                        var state = _this._celestial.Sequencer.changeState(_this._celestial.Sequencer.getRandomState());
                        var sequence = _this._celestial.Sequencer.getRandomStateSequence(state);
                        _this._celestial.Sequencer.changeSequence(sequence);
                        var frameName = _this._celestial.Sequencer.CurrentFrame.name;
                        _this._celestial.draw(_this._celestial.getImage(frameName))
                            .then(function (img) {
                            resolve();
                            console.log("LOADED FIRST LOGIC");
                        });
                    }
                    catch (e) {
                        reject(new Error("Could not load Logic on " + _this._celestial.Name + "\n" + e));
                    }
                });
            };
            CelestialLogic.prototype.unload = function () {
            };
            CelestialLogic.prototype.update = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var state = _this._celestial.Sequencer.CurrentState;
                    console.log("STATE: " + state);
                    var funcName = "_handle" + state[0].toUpperCase() + state.substr(1);
                    if (_this[funcName] != null)
                        _this[funcName]();
                    resolve();
                });
            };
            CelestialLogic.prototype._handleIdles = function () {
            };
            CelestialLogic.prototype._handleWalks = function () {
                var frame = this._celestial.Sequencer.CurrentFrame;
                var moveSpeed = frame.moveSpeed;
                var jumpForce = frame.jumpForce;
                if (moveSpeed != null)
                    this._celestial.Physics.addForceX(moveSpeed * this._celestial.Direction.x);
                if (jumpForce != null)
                    this._celestial.Physics.addForceY(-jumpForce);
            };
            CelestialLogic.prototype._handleClimbs = function () {
                var frame = this._celestial.Sequencer.CurrentFrame;
                this._celestial.Physics.setGravity(0);
                var moveSpeed = frame.moveSpeed || 10;
                this._celestial.Physics.addForceY(-moveSpeed);
            };
            CelestialLogic.prototype._completeClimbs = function () {
                console.log("JUMP OFF WALL!");
                console.log("LAST TOUCHED WALL: " + this._celestial.Physics.LastTouchedWall);
                switch (this._celestial.Physics.LastTouchedWall) {
                    case Physics.Wall.Left:
                        this._celestial.Physics.addForceX(celestials.randomRange(35, 80));
                        this._celestial.flipX();
                        break;
                    case Physics.Wall.Right:
                        this._celestial.Physics.addForceX(celestials.randomRange(-35, -80));
                        this._celestial.flipX();
                }
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
        var CelestialSequencer = (function () {
            function CelestialSequencer(celestial) {
                this._celestial = celestial;
                this.reset();
                if (this.Data.sequences != null) {
                    this._sequences = this.Data.sequences;
                }
            }
            Object.defineProperty(CelestialSequencer, "State", {
                get: function () {
                    return Object.freeze({
                        "Idle": "idles",
                        "Walk": "walks",
                        "Climb": "climbs"
                    });
                },
                enumerable: true,
                configurable: true
            });
            CelestialSequencer.prototype.reset = function () {
                this._frameIndex = 0;
                this._holdIndex = 0;
                this._totalIndex = 0;
            };
            CelestialSequencer.prototype.changeState = function (state) {
                if (state === void 0) { state = CelestialSequencer.State.Idle; }
                if (this._currentState != null)
                    this.completeState();
                this._currentState = state;
                return this._currentState;
            };
            CelestialSequencer.prototype.getRandomState = function (omitCurrentState) {
                if (omitCurrentState === void 0) { omitCurrentState = true; }
                var keys = Object.keys(CelestialSequencer.State);
                if (keys.length <= 1)
                    return this._currentState;
                var state = CelestialSequencer.State[keys[celestials.randomRangeInt(0, keys.length - 1)]];
                if (omitCurrentState && state == this._currentState)
                    return this.getRandomState(true);
                if (this._sequences[state].special)
                    return this.getRandomState(omitCurrentState);
                return state;
            };
            CelestialSequencer.prototype.getRandomStateSequence = function (state) {
                var sequences = this._sequences[state].sequences;
                if (sequences.length > 0)
                    return sequences[celestials.randomRangeInt(0, sequences.length - 1)];
                return null;
            };
            CelestialSequencer.prototype.changeSequence = function (sequence) {
                this.reset();
                this._currentSequence = sequence;
                console.log("CHANGED SEQUENCE: " + this._currentSequence.name);
            };
            CelestialSequencer.prototype.completeSequence = function () {
                if (this._sequenceCompleteListener != null)
                    this._sequenceCompleteListener();
            };
            CelestialSequencer.prototype.completeState = function () {
                console.log("COMPLETED STATE: " + this._currentState);
                if (this._stateCompleteListener != null)
                    this._stateCompleteListener();
            };
            CelestialSequencer.prototype.addSequenceCompleteListener = function (listener) {
                this._sequenceCompleteListener = listener;
            };
            CelestialSequencer.prototype.removeSequenceCompleteListener = function () {
                this._sequenceCompleteListener = null;
            };
            CelestialSequencer.prototype.addStateCompleteListener = function (listener) {
                this._stateCompleteListener = listener;
            };
            CelestialSequencer.prototype.removeStateCompleteListener = function () {
                this._stateCompleteListener = null;
            };
            CelestialSequencer.prototype.update = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    try {
                        var key = _this._currentSequence.frames[_this._frameIndex].name;
                        _this._holdIndex++;
                        _this._totalIndex++;
                        if (_this._holdIndex > _this._currentSequence.frames[_this._frameIndex].hold * _this._sequences.updateRate) {
                            _this._frameIndex++;
                            _this._holdIndex = 0;
                        }
                        if (_this._frameIndex > _this._currentSequence.frames.length - 1) {
                            if (_this._currentSequence.looping)
                                _this._frameIndex = 0;
                            else
                                _this.completeSequence();
                        }
                        if (_this._totalIndex > _this._currentSequence.duration * _this._sequences.updateRate) {
                            _this.completeSequence();
                        }
                        _this._celestial.Physics.resetGravity();
                        resolve();
                    }
                    catch (e) {
                        reject();
                    }
                });
            };
            Object.defineProperty(CelestialSequencer.prototype, "Data", {
                get: function () { return this._celestial.Data; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CelestialSequencer.prototype, "Sequences", {
                get: function () { return this._sequences; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CelestialSequencer.prototype, "CurrentState", {
                get: function () { return this._currentState; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CelestialSequencer.prototype, "CurrentSequence", {
                get: function () { return this._currentSequence; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CelestialSequencer.prototype, "CurrentFrame", {
                get: function () { return this._currentSequence.frames[this._frameIndex]; },
                enumerable: true,
                configurable: true
            });
            return CelestialSequencer;
        }());
        engines.CelestialSequencer = CelestialSequencer;
    })(engines = celestials.engines || (celestials.engines = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var systems;
    (function (systems) {
        var Weather = (function () {
            function Weather() {
            }
            return Weather;
        }());
        systems.Weather = Weather;
    })(systems = celestials.systems || (celestials.systems = {}));
})(celestials || (celestials = {}));
//# sourceMappingURL=celestials.js.map