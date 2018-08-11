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
                for (var _i = 0, _a = this._bindings.List; _i < _a.length; _i++) {
                    var binding = _a[_i];
                    binding.update();
                }
            };
            InputManager.prototype._onMouseDown = function (e) {
                console.log("CLICKED GLOBAL: ");
                console.log(e.target);
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
                InputManager.addBinding("open menu", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._openMenu.bind(this), celestials.KeyBinding.State.Down].concat(this._openMenuKey)))());
                InputManager.addBinding("close menu", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._closeMenu.bind(this), celestials.KeyBinding.State.Down].concat(this._closeMenuKey)))());
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
                this._direction.x *= -1;
                this.setDirectionX(this._direction.x);
            };
            Entity.prototype.setDirectionX = function (value) {
                console.log("DIRECTION CHANGE: " + value);
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
                    return this._width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Entity.prototype, "Height", {
                get: function () {
                    return this._height;
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
    var ui;
    (function (ui) {
        var Menu = (function () {
            function Menu(node) {
                this._node = node;
            }
            Menu.prototype.show = function () {
                this._node.classList.remove("hide");
            };
            Menu.prototype.hide = function () {
                this._node.classList.add("hide");
            };
            Menu.prototype.remove = function () {
                this._node.remove();
            };
            Object.defineProperty(Menu.prototype, "Node", {
                get: function () { return this._node; },
                enumerable: true,
                configurable: true
            });
            return Menu;
        }());
        ui.Menu = Menu;
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var OverlayMenu = (function (_super) {
                __extends(OverlayMenu, _super);
                function OverlayMenu(node, targetBounds) {
                    var _this = _super.call(this, node) || this;
                    _this._position = {
                        x: 0,
                        y: 0
                    };
                    _this._targetBounds = targetBounds;
                    _this.show();
                    return _this;
                }
                OverlayMenu.prototype.changeTargetBounds = function (bounds) {
                    this._targetBounds = bounds;
                };
                OverlayMenu.prototype._keepInBounds = function () {
                    var screenBounds = celestials.App.Bounds;
                    var menuBounds = this.Bounds;
                    var hoverLeft = menuBounds.Center.x > screenBounds.Center.x;
                    var hoverUp = menuBounds.Center.y > screenBounds.Center.y;
                    if (hoverLeft)
                        this.X -= menuBounds.Width - this._targetBounds.Width * 0.1;
                    else
                        this.X += this._targetBounds.Width + this._targetBounds.Width * 0.1;
                    if (hoverUp)
                        this.Y -= menuBounds.Height - this._targetBounds.Height * 0.1;
                    else
                        this.Y += this._targetBounds.Height + this._targetBounds.Height * 0.1;
                };
                OverlayMenu.prototype.update = function () {
                    if (this._targetBounds == null)
                        return;
                    this.X = this._targetBounds.Left;
                    this.Y = this._targetBounds.Top;
                    this._keepInBounds();
                };
                Object.defineProperty(OverlayMenu.prototype, "Bounds", {
                    get: function () {
                        return new celestials.Rect(this._position.x, this._position.y, this._node.getBoundingClientRect().width, this._node.getBoundingClientRect().height);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OverlayMenu.prototype, "X", {
                    get: function () { return this._position.x; },
                    set: function (value) {
                        this._position.x = value;
                        this._node.style.left = this._position.x + "px";
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OverlayMenu.prototype, "Y", {
                    get: function () { return this._position.y; },
                    set: function (value) {
                        this._position.y = value;
                        this._node.style.top = this._position.y + "px";
                    },
                    enumerable: true,
                    configurable: true
                });
                return OverlayMenu;
            }(ui.Menu));
            menus.OverlayMenu = OverlayMenu;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var CelestialOverlay = (function (_super) {
                __extends(CelestialOverlay, _super);
                function CelestialOverlay(celestial, node, nameNode, sequenceNode) {
                    var _this = _super.call(this, node || document.querySelector(".overlay-menu.celestial").cloneNode(true), celestial.Bounds) || this;
                    _this._celestial = celestial;
                    _this._nameNode = nameNode || _this._node.querySelector(".name");
                    _this._sequenceNode = sequenceNode || _this._node.querySelector(".sequence");
                    return _this;
                }
                CelestialOverlay.prototype.changeName = function (name) {
                    this._nameNode.innerHTML = name;
                };
                CelestialOverlay.prototype.changeSequence = function (sequence) {
                    this._sequenceNode.innerHTML = sequence;
                };
                CelestialOverlay.prototype.update = function () {
                    this.changeTargetBounds(this._celestial.Bounds);
                    _super.prototype.update.call(this);
                };
                return CelestialOverlay;
            }(menus.OverlayMenu));
            menus.CelestialOverlay = CelestialOverlay;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
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
                _this._mainImage = _this._node.querySelector(".main-image");
                _this._paused = false;
                _this._isControlled = false;
                _this._node.dataset.name = _this.Name;
                console.log("Created: " + _this.Name);
                _this._eventsRegistry = new celestials.Dictionary();
                _this._eventsRegistry.add("sequenceComplete", _this._onSequenceComplete.bind(_this));
                _this._eventsRegistry.add("stateChange", _this._onStateChange.bind(_this));
                _this._eventsRegistry.add("stateComplete", _this._onStateComplete.bind(_this));
                _this._eventsRegistry.add("wallHit", _this._onWallHit.bind(_this));
                _this._eventsRegistry.add("rightClick", _this._onRightClicked.bind(_this));
                return _this;
            }
            Celestial.prototype.draw = function (src) {
                var _this = this;
                if (src == this._mainImage.src)
                    return new Promise(function (resolve, reject) { resolve(this._mainImage); });
                return new Promise(function (resolve, reject) {
                    var img = new Image();
                    img.onload = function () {
                        _this._mainImage.src = img.src;
                        _this._width = img.naturalWidth * _this._scale;
                        _this._height = img.naturalHeight * _this._scale;
                        _this._mainImage.style.width = _this._width + "px";
                        _this._mainImage.style.height = _this._height + "px";
                        var x = "-" + _this.RegistrationOffset.x + "px";
                        var y = "-" + _this.RegistrationOffset.y + "px";
                        _this._mainImage.style.left = x;
                        _this._mainImage.style.bottom = y;
                        resolve(_this._mainImage);
                    };
                    img.onerror = function () { return reject(new Error("Image could not be loaded!")); };
                    img.src = src;
                });
            };
            Celestial.prototype.drawCurrentFrame = function () {
                if (this.getImage(this._sequencer.CurrentFrame.name) == this._mainImage.src)
                    return new Promise(function (resolve, reject) { resolve(this._mainImage); });
                return this.draw(this.getImage(this._sequencer.CurrentFrame.name));
            };
            Celestial.prototype.pause = function () {
                this._paused = true;
            };
            Celestial.prototype.unpause = function () {
                this._paused = false;
            };
            Celestial.prototype.remove = function () {
                this.unload();
                this._node.remove();
                this._overlayMenu.remove();
            };
            Celestial.prototype.getIcon = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var data;
                    var _this = this;
                    return __generator(this, function (_a) {
                        if (this._imagesLookup.containsKey("icon")) {
                            return [2, new Promise(function (resolve, reject) { return resolve(_this._imagesLookup.getValue("icon")); })];
                        }
                        data = this.Data;
                        return [2, new Promise(function (resolve, reject) {
                                var iconSrc = data.icon;
                                if (iconSrc == null) {
                                    if (data.images != null)
                                        iconSrc = data.images[0].path;
                                    else if (data.spritesheets != null)
                                        iconSrc = data.spritesheets[0].path;
                                }
                                if (iconSrc != null) {
                                    var img_1 = document.createElement("img");
                                    img_1.onload = function () {
                                        console.log("loaded image!");
                                        if (!_this.addImage("icon", img_1.src))
                                            throw new Error("An image already exists belonging to " + _this.Name + " - icon.  Please choose a unique name.");
                                        resolve(img_1.src);
                                    };
                                    img_1.src = data.path + iconSrc;
                                }
                            })];
                    });
                });
            };
            Celestial.prototype.takeControl = function () {
                this._isControlled = true;
            };
            Celestial.prototype.releaseControl = function () {
                this._isControlled = false;
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
                            var data = _this._data;
                            _this._sequencer = new celestials.engines.CelestialSequencer(_this);
                            _this._physics = new celestials.engines.Physics(_this);
                            _this._logic = new celestials.logic.CelestialLogic(_this, _this.Data.logic || null);
                            _this._scale = celestials.randomRange(data.scale.min, data.scale.max);
                            var promises = new Array();
                            if (data.images != null) {
                                var _loop_1 = function (imgData) {
                                    promises.push(new Promise(function (res, rej) {
                                        try {
                                            var img_2 = document.createElement("img");
                                            img_2.onload = function () {
                                                console.log("loaded image!");
                                                if (!_this.addImage(imgData.name, img_2.src))
                                                    throw new Error("An image already exists belonging to " + _this.Name + " - " + imgData.name + ".  Please choose a unique name.");
                                                res();
                                            };
                                            img_2.src = data.path + imgData.path;
                                        }
                                        catch (e) {
                                            rej();
                                        }
                                    }));
                                };
                                for (var _i = 0, _a = data.images; _i < _a.length; _i++) {
                                    var imgData = _a[_i];
                                    _loop_1(imgData);
                                }
                            }
                            if (data.spritesheets != null) {
                                var _loop_2 = function (spritesheet) {
                                    promises.push(new Promise(function (res, rej) {
                                        try {
                                            var img_3 = document.createElement("img");
                                            img_3.onload = function () {
                                                var _loop_3 = function (frame) {
                                                    console.log("loaded sprite!");
                                                    celestials.cropImage(img_3, frame.x, frame.y, frame.w, frame.h, function (crop) {
                                                        if (!_this.addImage(frame.name, crop.src))
                                                            throw new Error("An image already exists belonging to " + _this.Name + " - " + frame.name + ".  Please choose a unique name.");
                                                        res();
                                                    });
                                                };
                                                for (var _i = 0, _a = spritesheet.frames; _i < _a.length; _i++) {
                                                    var frame = _a[_i];
                                                    _loop_3(frame);
                                                }
                                            };
                                            img_3.src = data.path + spritesheet.path;
                                        }
                                        catch (e) {
                                            rej();
                                        }
                                    }));
                                };
                                for (var _b = 0, _c = data.spritesheets; _b < _c.length; _b++) {
                                    var spritesheet = _c[_b];
                                    _loop_2(spritesheet);
                                }
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
                                    _this._overlayMenu = new celestials.ui.menus.CelestialOverlay(_this);
                                    _this._node.parentNode.appendChild(_this._overlayMenu.Node);
                                    resolve();
                                    _this._isLoaded = true;
                                });
                                _this._node.querySelector(".graphics").ondragstart = function () { return false; };
                                _this._sequencer.addSequenceCompleteListener(_this._eventsRegistry.getValue("sequenceComplete"));
                                _this._sequencer.addStateChangeListener(_this._eventsRegistry.getValue("stateChange"));
                                _this._sequencer.addStateCompleteListener(_this._eventsRegistry.getValue("stateComplete"));
                                _this._physics.addWallHitListener(_this._eventsRegistry.getValue("wallHit"));
                                celestials.managers.MouseManager.listenForDrag(_this._node, function (x, y) { return celestials.managers.CelestialsManager.onGrab(_this, x, y); }, function (x, y) { return celestials.managers.CelestialsManager.onDrag(_this, x, y); }, function (x, y) { return celestials.managers.CelestialsManager.onDrop(_this, x, y); });
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
                this._sequencer.removeStateChangeListener();
                this._sequencer.removeStateCompleteListener();
                this._physics.removeWallHitListener();
                this._node.removeEventListener("click", this._eventsRegistry.getValue("click"));
                this._node.removeEventListener("contextmenu", this._eventsRegistry.getValue("rightClick"));
            };
            Celestial.prototype.update = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (this._paused)
                                    return [2];
                                return [4, this._logic.update()];
                            case 1:
                                _a.sent();
                                if (!!this._isControlled) return [3, 5];
                                return [4, this._sequencer.update()];
                            case 2:
                                _a.sent();
                                return [4, this.drawCurrentFrame()];
                            case 3:
                                _a.sent();
                                return [4, this._physics.update()];
                            case 4:
                                _a.sent();
                                _a.label = 5;
                            case 5:
                                this._overlayMenu.update();
                                this._overlayMenu.changeName(this.Name);
                                this._overlayMenu.changeSequence(this._sequencer.CurrentSequence.name);
                                return [2];
                        }
                    });
                });
            };
            Celestial.prototype._onSequenceComplete = function () {
                console.log("SEQUENCE COMPLETE");
                this._logic.next();
            };
            Celestial.prototype._onStateChange = function () {
                this._logic.handleStateChange();
            };
            Celestial.prototype._onStateComplete = function () {
                this._logic.handleStateComplete();
            };
            Celestial.prototype._onWallHit = function (which) {
                console.log("Hit wall " + which);
                this._logic.handleWallHit(which);
            };
            Celestial.prototype._onRightClicked = function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                celestials.ui.menus.CelestialContext.show(this);
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
            Object.defineProperty(Celestial.prototype, "Paused", {
                get: function () { return this._paused; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "IsControlled", {
                get: function () { return this._isControlled; },
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
    var ui;
    (function (ui) {
        var components;
        (function (components) {
            var List = (function () {
                function List(node, template, maxItems) {
                    this._node = node;
                    this._template = template;
                    this._maxItems = maxItems || -1;
                    this._template.classList.add("hide");
                    this._items = new Array();
                    this.clear();
                }
                List.prototype.createItem = function (itemNode, bubbleSelect) {
                    var _this = this;
                    if (bubbleSelect === void 0) { bubbleSelect = true; }
                    var item = new Item(itemNode || this._template.cloneNode(true));
                    item.Node.classList.remove("template");
                    item.Node.classList.add("hide");
                    if (bubbleSelect) {
                        item.Node.addEventListener("click", function () { return item.select(); });
                    }
                    item.addSelectListener(function (selected) {
                        _this._index = _this._items.indexOf(selected);
                        if (_this._onSelectCallback != null)
                            _this._onSelectCallback(_this._index);
                    });
                    return item;
                };
                List.prototype.addItemToList = function (item) {
                    item.Node.classList.remove("hide");
                    this._items.push(item);
                    if (this._maxItems != -1)
                        if (this._items.length > this._maxItems)
                            this.removeItemAt(0);
                    this._node.appendChild(item.Node);
                };
                List.prototype.removeItemAt = function (index) {
                    var removedItem = this._items.splice(index, 1)[0];
                    removedItem.Node.remove();
                    removedItem = null;
                };
                List.prototype.clear = function () {
                    for (var i = this._items.length - 1; i >= 0; i--)
                        this.removeItemAt(i);
                };
                List.prototype.addSelectListener = function (callback) {
                    this._onSelectCallback = callback;
                };
                List.prototype.removeSelectListener = function () {
                    this._onSelectCallback = null;
                };
                Object.defineProperty(List.prototype, "Items", {
                    get: function () { return this._items; },
                    enumerable: true,
                    configurable: true
                });
                return List;
            }());
            components.List = List;
            var Item = (function () {
                function Item(node) {
                    this._node = node;
                }
                Item.prototype.select = function () {
                    if (this._onSelectCallback != null)
                        this._onSelectCallback(this);
                };
                Item.prototype.wireSelector = function (element) {
                    var _this = this;
                    var node = element || this._node;
                    node.addEventListener("mousedown", function () {
                        _this.select();
                    });
                };
                Item.prototype.wireSelectEvent = function () {
                    var _this = this;
                    this._node.querySelector(".btnDelete").addEventListener("mousedown", function () {
                        _this.select();
                    });
                };
                Item.prototype.addSelectListener = function (callback) {
                    this._onSelectCallback = callback;
                };
                Item.prototype.removeSelectListener = function () {
                    this._onSelectCallback = null;
                };
                Object.defineProperty(Item.prototype, "Node", {
                    get: function () { return this._node; },
                    enumerable: true,
                    configurable: true
                });
                return Item;
            }());
            components.Item = Item;
        })(components = ui.components || (ui.components = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var systems;
    (function (systems) {
        var Notifications = (function () {
            function Notifications() {
            }
            Object.defineProperty(Notifications, "TYPE", {
                get: function () { return Object.freeze({ "Normal": "", "Success": "success", "Fail": "fail", "Notify": "notify" }); },
                enumerable: true,
                configurable: true
            });
            Notifications.addNotification = function (message, type, date, clickHandler) {
                Notifications.Instance._notifications.push({
                    message: message,
                    type: type,
                    date: date || new Date(),
                    clickHandler: clickHandler
                });
                celestials.ui.menus.NotificationBar.addNotification(message, type, clickHandler);
            };
            Notifications.removeNotification = function (index) {
                Notifications.Instance._notifications.splice(index, 1);
            };
            Object.defineProperty(Notifications, "Instance", {
                get: function () {
                    if (Notifications._instance == null) {
                        Notifications._instance = new Notifications();
                        Notifications._instance._notifications = new Array();
                    }
                    return Notifications._instance;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Notifications, "Notifications", {
                get: function () { return Notifications.Instance._notifications; },
                enumerable: true,
                configurable: true
            });
            return Notifications;
        }());
        systems.Notifications = Notifications;
    })(systems = celestials.systems || (celestials.systems = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var NotificationPanel = (function (_super) {
                __extends(NotificationPanel, _super);
                function NotificationPanel(node) {
                    var _this = _super.call(this, node, null) || this;
                    NotificationPanel._instance = _this;
                    _this._node.querySelector(".ui.close").addEventListener("click", function () { return NotificationPanel._instance.hide(); });
                    _this._itemsList = new ui.components.List(_this._node.querySelector(".list"), _this._node.querySelector(".list .item.template"));
                    _this.hide();
                    return _this;
                }
                NotificationPanel.show = function () {
                    NotificationPanel._instance.show();
                    NotificationPanel.update();
                };
                NotificationPanel.update = function () {
                    var itemsList = NotificationPanel._instance._itemsList;
                    itemsList.clear();
                    var notifications = celestials.systems.Notifications.Notifications;
                    for (var i = notifications.length - 1; i >= 0; i--) {
                        var itemData = notifications[i];
                        var item = itemsList.createItem();
                        item.Node.classList.add("--" + itemData.type);
                        item.Node.querySelector(".message").innerHTML = itemData.message;
                        if (itemData.clickHandler != null) {
                            item.Node.style.cursor = 'pointer';
                            item.addSelectListener(itemData.clickHandler);
                        }
                        var timeNode = item.Node.querySelector(".time");
                        var dateOptions = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
                        timeNode.innerHTML = itemData.date.toLocaleDateString('us-EN', dateOptions);
                        itemsList.addItemToList(item);
                    }
                };
                return NotificationPanel;
            }(menus.OverlayMenu));
            menus.NotificationPanel = NotificationPanel;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var NotificationBar = (function (_super) {
                __extends(NotificationBar, _super);
                function NotificationBar(node, nodeIdle, idleTime) {
                    var _this = _super.call(this, node, null) || this;
                    NotificationBar._instance = _this;
                    _this._node.querySelector(".popout").addEventListener("click", function () {
                        _this._clearIdle();
                        _this._clearDuration();
                        _this.hide();
                        menus.NotificationPanel.show();
                    });
                    _this._itemsList = new ui.components.List(_this._node.querySelector(".list"), _this._node.querySelector(".list .item.template"), 5);
                    console.log("IDLE");
                    console.log(nodeIdle);
                    if (nodeIdle != null) {
                        console.log("GRUE");
                        _this._idleTime = idleTime || NotificationBar.DEF_IDLE;
                        nodeIdle.addEventListener("mouseenter", _this._onIdleEnter.bind(_this));
                        nodeIdle.addEventListener("mouseleave", _this._onIdleExit.bind(_this));
                    }
                    _this._node.addEventListener("mouseenter", function () { return _this._clearDuration(); });
                    _this._node.addEventListener("mouseleave", function () { return _this._startDurationTimer(NotificationBar.DEF_DURATION); });
                    return _this;
                }
                Object.defineProperty(NotificationBar, "DEF_IDLE", {
                    get: function () { return 1000; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NotificationBar, "DEF_DURATION", {
                    get: function () { return 3000; },
                    enumerable: true,
                    configurable: true
                });
                NotificationBar.show = function () {
                    NotificationBar._instance.show();
                };
                NotificationBar.addNotification = function (notification, type, clickCallback, duration) {
                    var item = NotificationBar._instance._itemsList.createItem();
                    item.Node.innerHTML = notification;
                    item.Node.classList.add("show");
                    if (type != null && type != "")
                        item.Node.classList.add("--" + type);
                    if (clickCallback != null) {
                        item.Node.style.cursor = 'pointer';
                        item.addSelectListener(clickCallback);
                    }
                    NotificationBar._instance._itemsList.addItemToList(item);
                    NotificationBar._instance.show();
                    NotificationBar._instance._startDurationTimer(duration || notification.length * 0.1 * 1000);
                    menus.NotificationPanel.update();
                    setTimeout(function () { return item.Node.classList.remove("show"); }, 2000);
                };
                NotificationBar.clearNotifications = function () {
                    NotificationBar._instance._itemsList.clear();
                };
                NotificationBar.prototype._startDurationTimer = function (duration) {
                    var _this = this;
                    this._clearDuration();
                    this._durationTimer = setTimeout(function () { return _this.hide(); }, duration);
                };
                NotificationBar.prototype._clearDuration = function () {
                    if (this._durationTimer != null)
                        celestials.App.Window.clearTimeout(this._durationTimer);
                    this._durationTimer = null;
                };
                NotificationBar.prototype._clearIdle = function () {
                    if (this._idleTimer != null)
                        celestials.App.Window.clearTimeout(this._idleTimer);
                    this._idleTimer = null;
                };
                NotificationBar.prototype._onIdleEnter = function () {
                    var _this = this;
                    if (this._idleTimer != null)
                        return;
                    this._idleTimer = setTimeout(function () { return _this.show(); }, this._idleTime);
                    this._clearDuration();
                };
                NotificationBar.prototype._onIdleExit = function () {
                    this._clearIdle();
                };
                Object.defineProperty(NotificationBar, "Items", {
                    get: function () { return NotificationBar._instance._itemsList.Items; },
                    enumerable: true,
                    configurable: true
                });
                return NotificationBar;
            }(menus.OverlayMenu));
            menus.NotificationBar = NotificationBar;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
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
    function shuffleArray(array) {
        var _a;
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
        }
    }
    celestials.shuffleArray = shuffleArray;
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
            }
            CelestialsManager.prototype.setup = function (files) {
                return __awaiter(this, void 0, void 0, function () {
                    var _i, files_1, file;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (files == null)
                                    files = [
                                        "./res/celestials/anthony/anthony.json",
                                        "./res/celestials/solaris/solaris.json",
                                        "./res/celestials/victor/victor.json"
                                    ];
                                _i = 0, files_1 = files;
                                _a.label = 1;
                            case 1:
                                if (!(_i < files_1.length)) return [3, 4];
                                file = files_1[_i];
                                return [4, celestials.fetchJson(file, function (json) {
                                        var cel = new Celestial(_this._template, _this._container, json);
                                        CelestialsManager.addTemplate(cel);
                                    })];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                _i++;
                                return [3, 1];
                            case 4:
                                if (CelestialsManager._lookup.containsKey("solaris"))
                                    CelestialsManager.addCelestial("solaris");
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
            CelestialsManager.addCelestial = function (lookup, addedByLineage) {
                return __awaiter(this, void 0, void 0, function () {
                    var celestial, data, copy;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                addedByLineage = addedByLineage || false;
                                celestial = CelestialsManager._lookup.getValue(lookup);
                                if (!(celestial != null)) return [3, 2];
                                if (celestial.Data.maxSpawns != null && !addedByLineage) {
                                    if (CelestialsManager.countCelestials(celestial.Lookup) + 1 > celestial.Data.maxSpawns) {
                                        celestials.systems.Notifications.addNotification("Max spawns reached for " + celestial.Name + ".", celestials.systems.Notifications.TYPE.Fail);
                                        return [2, null];
                                    }
                                }
                                data = CelestialsManager._data.getValue(lookup);
                                copy = celestial.clone();
                                if (!copy.load()) return [3, 2];
                                return [4, CelestialsManager._instance._celestials.push(copy)];
                            case 1:
                                _a.sent();
                                return [2, copy];
                            case 2: return [2, null];
                        }
                    });
                });
            };
            CelestialsManager.addCelestialAtPosition = function (lookup, x, y, addedByLineage) {
                return __awaiter(this, void 0, void 0, function () {
                    var celestial;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, CelestialsManager.addCelestial(lookup, addedByLineage)];
                            case 1:
                                celestial = _a.sent();
                                if (celestial == null)
                                    return [2, null];
                                celestial.X = x;
                                celestial.Y = y + celestial.Height;
                                return [2, celestial];
                        }
                    });
                });
            };
            CelestialsManager.countCelestials = function (lookup) {
                var count = 0;
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    if (cel.Lookup == lookup)
                        count++;
                }
                return count;
            };
            CelestialsManager.removeCelestial = function (celestial) {
                var index = CelestialsManager._instance._celestials.indexOf(celestial);
                if (index != -1) {
                    var cel = CelestialsManager._instance._celestials.splice(index, 1)[0];
                    cel.remove();
                }
            };
            CelestialsManager.removeAllCelestials = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var celestial = _a[_i];
                    this.removeCelestial(celestial);
                }
            };
            CelestialsManager.update = function () {
                for (var _i = 0, _a = CelestialsManager._instance._celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    if (cel.IsLoaded)
                        cel.update();
                }
            };
            CelestialsManager.onGrab = function (cel, x, y) {
                console.log("GRABBED");
                cel.Node.style.zIndex = '100';
                cel.takeControl();
                cel.Physics.zeroVelocity();
            };
            CelestialsManager.onDrag = function (cel, x, y) {
                console.log(cel.Name);
                console.log("DRAGGING: ", x, y);
                x = x;
                y += (cel.Height * cel.RegistrationPoint.y);
                cel.X = x;
                cel.Y = y;
            };
            CelestialsManager.onDrop = function (cel, x, y) {
                console.log("DROPPED");
                cel.releaseControl();
                cel.Physics.resetGravity();
                cel.Node.style.zIndex = "" + (cel.Data.zIndex || 1);
                var _a = managers.MouseManager.LastMousePosition, lastX = _a.x, lastY = _a.y;
                var flingX = ((x - lastX) / celestials.App.Bounds.Width) * celestials.App.Bounds.Width;
                var flingY = ((y - lastY) / celestials.App.Bounds.Height) * celestials.App.Bounds.Height;
                cel.Physics.zeroVelocity();
                cel.Physics.addForceX(flingX);
                cel.Physics.addForceY(flingY);
                if (flingX != 0) {
                    if (flingX > 0)
                        cel.setDirectionX(1);
                    else
                        cel.setDirectionX(-1);
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
                InputManager.addBinding("debug__velocity", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._randomVelocity.bind(this), celestials.KeyBinding.State.Down].concat(randoVelocityKey)))());
                var leftKey = [celestials.Key.Code["left arrow"]];
                InputManager.addBinding("debug__left", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._sendLeft.bind(this), celestials.KeyBinding.State.Down].concat(leftKey)))());
                var rightKey = [celestials.Key.Code["right arrow"]];
                InputManager.addBinding("debug__right", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._sendRight.bind(this), celestials.KeyBinding.State.Down].concat(rightKey)))());
                var upKey = [celestials.Key.Code["up arrow"]];
                InputManager.addBinding("debug__up", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._sendUp.bind(this), celestials.KeyBinding.State.Down].concat(upKey)))());
                var downKey = [celestials.Key.Code["down arrow"]];
                InputManager.addBinding("debug__down", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._sendDown.bind(this), celestials.KeyBinding.State.Down].concat(downKey)))());
                var snapUpKey = [celestials.Key.Code.o];
                InputManager.addBinding("debug__snapUp", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._snapToTop.bind(this), celestials.KeyBinding.State.Down].concat(snapUpKey)))());
                var spawnCelestialKey = [celestials.Key.Code.z];
                InputManager.addBinding("debug__spawnCelestial", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._spawnCelestial.bind(this), celestials.KeyBinding.State.Down].concat(spawnCelestialKey)))());
                var flipCelestialXKey = [celestials.Key.Code.x];
                InputManager.addBinding("debug__flipCelestialX", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._flipCelestialX.bind(this), celestials.KeyBinding.State.Down].concat(flipCelestialXKey)))());
                var switchStateKey = [celestials.Key.Code.v];
                InputManager.addBinding("debug__switchStateCelestial", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._switchState.bind(this), celestials.KeyBinding.State.Down].concat(switchStateKey)))());
                var pauseKey = [celestials.Key.Code.p];
                InputManager.addBinding("debug__pauseApp", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._togglePause.bind(this), celestials.KeyBinding.State.Down].concat(pauseKey)))());
                var controlPanelKey = [celestials.Key.Code.c];
                InputManager.addBinding("debug__openControlPanel", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._openControlPanel.bind(this), celestials.KeyBinding.State.Down].concat(controlPanelKey)))());
                var celestialsPanelKey = [celestials.Key.Code.m];
                InputManager.addBinding("debug__openCelestialsPanel", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._openCelestialsPanel.bind(this), celestials.KeyBinding.State.Down].concat(celestialsPanelKey)))());
                var notificationPanelKey = [celestials.Key.Code.j];
                InputManager.addBinding("debug__showNotificationPanel", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._openNotificationPanel.bind(this), celestials.KeyBinding.State.Down].concat(notificationPanelKey)))());
                var addNotificationKey = [celestials.Key.Code.n];
                InputManager.addBinding("debug__addNotification", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._addNotification.bind(this), celestials.KeyBinding.State.Down].concat(addNotificationKey)))());
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
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    cel.Physics.addForceX(-100);
                }
            };
            Debugger.prototype._sendRight = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    cel.Physics.addForceX(100);
                }
            };
            Debugger.prototype._sendUp = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    cel.Physics.addForceY(-200);
                }
            };
            Debugger.prototype._sendDown = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    cel.Physics.addForceY(200);
                }
            };
            Debugger.prototype._snapToTop = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    cel.Physics.snapToTop();
                }
            };
            Debugger.prototype._spawnCelestial = function () {
                CelestialsManager.addCelestial("solaris");
            };
            Debugger.prototype._flipCelestialX = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var celestial = _a[_i];
                    celestial.flipX();
                }
            };
            Debugger.prototype._switchState = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var celestial = _a[_i];
                    celestial.Sequencer.changeState(celestials.engines.CelestialSequencer.State.Walk);
                }
            };
            Debugger.prototype._togglePause = function () {
                if (celestials.App.Paused)
                    celestials.App.resume();
                else
                    celestials.App.pause();
            };
            Debugger.prototype._openControlPanel = function () {
                celestials.ui.menus.ControlPanel.show();
            };
            Debugger.prototype._openCelestialsPanel = function () {
                celestials.ui.menus.CelestialsPanel.show();
            };
            Debugger.prototype._openNotificationPanel = function () {
                celestials.ui.menus.NotificationPanel.show();
            };
            Debugger.prototype._addNotification = function () {
                systems.Notifications.addNotification("This is a test notification!");
            };
            return Debugger;
        }());
        systems.Debugger = Debugger;
    })(systems = celestials.systems || (celestials.systems = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var managers;
    (function (managers) {
        var MouseManager = (function () {
            function MouseManager() {
                MouseManager._mousePosition = { x: 0, y: 0 };
                MouseManager._lastMousePosition = { x: 0, y: 0 };
                MouseManager._mousedownRegistry = new celestials.Dictionary();
                MouseManager._mouseupRegistry = new celestials.Dictionary();
                MouseManager._rightClickRegistry = new celestials.Dictionary();
                MouseManager._dragRegistry = new celestials.Dictionary();
                celestials.App.Node.addEventListener("mousedown", this._onMouseDown.bind(this));
                celestials.App.Node.addEventListener("contextmenu", this._onRightClick.bind(this));
                celestials.App.Node.addEventListener("mousemove", this._onMouseMove.bind(this));
                celestials.App.Node.addEventListener("mouseup", this._onMouseUp.bind(this));
            }
            MouseManager.listenForMouseDown = function (node, callback) {
                MouseManager._mousedownRegistry.add(node, callback);
            };
            MouseManager.listenForMouseUp = function (node, callback) {
                MouseManager._mouseupRegistry.add(node, callback);
            };
            MouseManager.listenForRightClick = function (node, callback) {
                MouseManager._rightClickRegistry.add(node, callback);
            };
            MouseManager.listenForDrag = function (node, grabFunction, dragFunction, dropFunction) {
                MouseManager._dragRegistry.add(node, { grabFunction: grabFunction, dragFunction: dragFunction, dropFunction: dropFunction });
            };
            MouseManager.startDrag = function (node) {
                MouseManager._activeElement = node;
            };
            MouseManager.prototype._onMouseDown = function (e) {
                if (e.button != 0)
                    return;
                var target = e.target.closest("[data-clickable]");
                if (target == null)
                    return;
                console.log("CLICKED GLOBAL: ");
                console.log(target);
                if (MouseManager._dragRegistry.containsKey(target)) {
                    var grabFunction = MouseManager._dragRegistry.getValue(target).grabFunction;
                    if (grabFunction != null)
                        grabFunction(e.clientX, e.clientY);
                    MouseManager._activeElement = target;
                    return;
                }
                if (MouseManager._mousedownRegistry.containsKey(target))
                    MouseManager._mousedownRegistry.getValue(target)();
            };
            MouseManager.prototype._onRightClick = function (e) {
                var target = e.target.closest("[data-clickable]");
                if (target == null)
                    return;
                if (MouseManager._rightClickRegistry.containsKey(target))
                    MouseManager._rightClickRegistry.getValue(target)(e.clientX, e.clientY);
            };
            MouseManager.prototype._onMouseMove = function (e) {
                MouseManager._lastMousePosition = MouseManager._mousePosition;
                MouseManager._mousePosition = { x: e.clientX, y: e.clientY };
                if (MouseManager._activeElement != null) {
                    console.log("I WANT TO DRAG");
                    if (MouseManager._dragRegistry.containsKey(MouseManager._activeElement)) {
                        var dragFunction = MouseManager._dragRegistry.getValue(MouseManager._activeElement).dragFunction;
                        if (dragFunction != null)
                            dragFunction(e.clientX, e.clientY);
                    }
                }
            };
            MouseManager.prototype._onMouseUp = function (e) {
                var target = e.target.closest("[data-clickable]");
                if (target == null)
                    return;
                if (MouseManager._activeElement != null) {
                    if (MouseManager._dragRegistry.containsKey(MouseManager._activeElement)) {
                        var dropFunction = MouseManager._dragRegistry.getValue(MouseManager._activeElement).dropFunction;
                        if (dropFunction != null)
                            dropFunction(e.clientX, e.clientY);
                        MouseManager._activeElement = null;
                        return;
                    }
                }
                if (MouseManager._mousedownRegistry.containsKey(target))
                    MouseManager._mousedownRegistry.getValue(target)(e.clientX, e.clientY);
            };
            Object.defineProperty(MouseManager, "MousePosition", {
                get: function () { return MouseManager._mousePosition; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MouseManager, "LastMousePosition", {
                get: function () { return MouseManager._lastMousePosition; },
                enumerable: true,
                configurable: true
            });
            return MouseManager;
        }());
        managers.MouseManager = MouseManager;
    })(managers = celestials.managers || (celestials.managers = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var components;
        (function (components) {
            var Dropdown = (function () {
                function Dropdown(node, template) {
                    this._node = node;
                    this._itemTemplate = template;
                    this._itemTemplate.classList.add("hide");
                    this._items = new Array();
                }
                Dropdown.prototype.createItem = function () {
                    var item = this._itemTemplate.cloneNode(true);
                    item.classList.remove("template", "hide");
                    return item;
                };
                Dropdown.prototype.addItem = function (node, callback) {
                    var item = new components.Item(node);
                    item.wireSelector(item.Node);
                    item.addSelectListener(function (select) {
                        callback();
                    });
                    this._items.push(item);
                    this._node.appendChild(item.Node);
                };
                Dropdown.prototype.removeItemAt = function (index) {
                    var item = this._items.splice(index, 1)[0];
                    item.Node.remove();
                    item = null;
                };
                Dropdown.prototype.clearItems = function () {
                    for (var i = this._items.length - 1; i >= 0; i--)
                        this.removeItemAt(i);
                };
                Dropdown.prototype.addSelectListener = function (callback) {
                    this._selectListener = callback;
                };
                Dropdown.prototype.removeSelectListener = function () {
                    this._selectListener = null;
                };
                Object.defineProperty(Dropdown.prototype, "Items", {
                    get: function () { return this._items; },
                    enumerable: true,
                    configurable: true
                });
                return Dropdown;
            }());
            components.Dropdown = Dropdown;
        })(components = ui.components || (ui.components = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var components;
        (function (components) {
            var MultiDropdown = (function (_super) {
                __extends(MultiDropdown, _super);
                function MultiDropdown(node, template, headerTemplate, indentNodeTemplate, indentTemplate) {
                    var _this = _super.call(this, node, template) || this;
                    _this._headerTemplate = headerTemplate;
                    _this._indentNodeTemplate = indentNodeTemplate;
                    _this._indentTemplate = indentTemplate || _this._itemTemplate;
                    _this._headerTemplate.classList.add("hide");
                    _this._indentNodeTemplate.classList.add("hide");
                    _this._indentTemplate.classList.add("hide");
                    _this._indents = new Array();
                    return _this;
                }
                MultiDropdown.prototype.createIndent = function () {
                    var indent = this._indentNodeTemplate.cloneNode(true);
                    indent.classList.remove("template", "hide");
                    var ul = document.createElement("ul");
                    this._indents.push(indent);
                    return indent;
                };
                MultiDropdown.prototype.addItemToLastIndent = function (node, callback) {
                    var item = new components.Item(node);
                    item.wireSelector(item.Node);
                    item.addSelectListener(function (select) {
                        callback();
                    });
                    this._items.push(item);
                    var indent = this._indents[this._indents.length - 1];
                    if (indent instanceof HTMLUListElement) {
                        indent.appendChild(item.Node);
                    }
                    else {
                        var ul = indent.querySelector("ul");
                        ul.appendChild(item.Node);
                    }
                };
                MultiDropdown.prototype.addLastIndent = function (title) {
                    var titleNode = this._headerTemplate.cloneNode(true);
                    titleNode.innerHTML = title;
                    titleNode.classList.remove("template", "hide");
                    this._node.appendChild(titleNode);
                    var titleIconNode = document.createElement("div");
                    titleIconNode.innerHTML = "&#9655;";
                    titleNode.appendChild(titleIconNode);
                    this._node.appendChild(this._indents[this._indents.length - 1]);
                };
                MultiDropdown.prototype.clear = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var i, indent;
                        return __generator(this, function (_a) {
                            this.clearItems();
                            for (i = this._indents.length - 1; i >= 0; i--) {
                                indent = this._indents[i];
                                this._indents.splice(i, 1);
                                indent.parentNode.removeChild(indent);
                                indent = null;
                            }
                            while (this._node.hasChildNodes()) {
                                this._node.removeChild(this._node.lastChild);
                            }
                            return [2];
                        });
                    });
                };
                return MultiDropdown;
            }(components.Dropdown));
            components.MultiDropdown = MultiDropdown;
        })(components = ui.components || (ui.components = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var CelestialContext = (function () {
                function CelestialContext(node) {
                    var ctx = document.querySelector(".context-menu.celestial");
                    CelestialContext._node = node;
                    CelestialContext._nameNode = ctx.querySelector(".name");
                    CelestialContext._typeNode = ctx.querySelector(".type");
                    var statesNode = ctx.querySelector(".states");
                    CelestialContext._statesDropdown = new ui.components.MultiDropdown(statesNode.querySelector(".ctx-dropdown.template"), statesNode.querySelector(".ctx-item.template"), statesNode.querySelector(".ctx-dropdown-header.template"), statesNode.querySelector(".ctx-dropdown-2.template"), statesNode.querySelector(".ctx-dropdown-2 .ctx-item.template"));
                    var actionsNode = ctx.querySelector(".actions");
                    CelestialContext._actionsDropdown = new ui.components.MultiDropdown(actionsNode.querySelector(".ctx-dropdown.template"), actionsNode.querySelector(".ctx-item.template"), actionsNode.querySelector(".ctx-dropdown-header.template"), actionsNode.querySelector(".ctx-dropdown-2.template"), actionsNode.querySelector(".ctx-dropdown-2 .ctx-item.template"));
                    CelestialContext._eventsRegistry = new celestials.Dictionary();
                    CelestialContext._eventsRegistry.add("closeContext", CelestialContext._onClose.bind(this));
                    CelestialContext.hide();
                }
                CelestialContext.show = function (celestial) {
                    console.log("CEL: " + celestial);
                    if (celestial == null)
                        return;
                    CelestialContext._node.classList.remove("hide");
                    CelestialContext._nameNode.innerHTML = celestial.Name;
                    CelestialContext._typeNode.innerHTML = celestial.Lookup;
                    var statesDrop = CelestialContext._statesDropdown;
                    statesDrop.clear();
                    var _loop_4 = function (indentData) {
                        var state = celestials.engines.CelestialSequencer.State[indentData];
                        var sequences = celestial.Sequencer.getStateSequences(state);
                        if (sequences == null)
                            return "continue";
                        statesDrop.createIndent();
                        var _loop_5 = function (seq) {
                            this_1._createIndentItem(statesDrop, seq.name, function () {
                                celestial.Sequencer.changeState(state);
                                celestial.Sequencer.changeSequence(celestial.Sequencer.getSequenceByName(seq.name));
                                console.log("SEQUENCE: " + seq.name);
                            });
                        };
                        for (var _i = 0, sequences_1 = sequences; _i < sequences_1.length; _i++) {
                            var seq = sequences_1[_i];
                            _loop_5(seq);
                        }
                        statesDrop.addLastIndent(indentData);
                    };
                    var this_1 = this;
                    for (var _i = 0, _a = Object.keys(celestials.engines.CelestialSequencer.State); _i < _a.length; _i++) {
                        var indentData = _a[_i];
                        _loop_4(indentData);
                    }
                    var actionsDrop = CelestialContext._actionsDropdown;
                    actionsDrop.clear();
                    actionsDrop.createIndent();
                    this._createIndentItem(actionsDrop, "Flip X", function () { celestial.flipX(); });
                    this._createIndentItem(actionsDrop, "Nudge Left", function () { celestial.Physics.addForceX(-50); });
                    this._createIndentItem(actionsDrop, "Nudge Right", function () { celestial.Physics.addForceX(50); });
                    this._createIndentItem(actionsDrop, "Nudge Up", function () { celestial.Physics.addForceY(-150); });
                    this._createIndentItem(actionsDrop, "Nudge Down", function () { celestial.Physics.addForceY(50); });
                    actionsDrop.addLastIndent("General");
                    actionsDrop.createIndent();
                    this._createIndentItem(actionsDrop, "Send to Front", function () { return console.log("Send to FRONT"); });
                    this._createIndentItem(actionsDrop, "Send to Back", function () { return console.log("Send to BACK"); });
                    actionsDrop.addLastIndent("Sorting");
                    actionsDrop.createIndent();
                    this._createIndentItem(actionsDrop, "Pause/Unpause", function () { (celestial.Paused) ? celestial.unpause() : celestial.pause(); });
                    this._createIndentItem(actionsDrop, "Copy", function () { celestials.managers.CelestialsManager.addCelestial(celestial.Lookup); });
                    this._createIndentItem(actionsDrop, "Delete", function () { celestials.managers.CelestialsManager.removeCelestial(celestial); });
                    actionsDrop.addLastIndent("Control");
                    CelestialContext._keepOnScreen(celestial.Bounds);
                    celestials.App.Node.addEventListener("click", CelestialContext._eventsRegistry.getValue("closeContext"));
                };
                CelestialContext.hide = function () {
                    CelestialContext._node.classList.add("hide");
                };
                CelestialContext._createIndentItem = function (dropdown, title, action) {
                    var item = dropdown.createItem();
                    item.innerHTML = title;
                    var act = function () {
                        action();
                        CelestialContext.hide();
                    };
                    dropdown.addItemToLastIndent(item, act);
                };
                CelestialContext._keepOnScreen = function (celBounds) {
                    var node = CelestialContext._node;
                    var x = celBounds.Left;
                    var y = celBounds.Top;
                    if (x + node.offsetWidth > celestials.App.Bounds.Right)
                        x = celestials.App.Bounds.Right - node.offsetWidth - 150;
                    if (y + node.offsetHeight > celestials.App.Bounds.Bottom)
                        y = celestials.App.Bounds.Bottom - node.offsetHeight - 150;
                    node.style.left = x + "px";
                    node.style.top = y + "px";
                };
                CelestialContext._onClose = function () {
                    CelestialContext.hide();
                    celestials.App.Node.removeEventListener("click", CelestialContext._eventsRegistry.getValue("closeContext"));
                };
                Object.defineProperty(CelestialContext, "StatesDropdown", {
                    get: function () { return CelestialContext._statesDropdown; },
                    enumerable: true,
                    configurable: true
                });
                return CelestialContext;
            }());
            menus.CelestialContext = CelestialContext;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var ApplicationContext = (function () {
                function ApplicationContext(node) {
                    var ctx = document.querySelector(".context-menu.application");
                    ApplicationContext._node = node;
                    var celestialsNode = ctx.querySelector(".celestials");
                    ApplicationContext._celestialsDropdown = new ui.components.MultiDropdown(celestialsNode.querySelector(".ctx-dropdown.template"), celestialsNode.querySelector(".ctx-item.template"), celestialsNode.querySelector(".ctx-dropdown-header.template"), celestialsNode.querySelector(".ctx-dropdown-2.template"), celestialsNode.querySelector(".ctx-dropdown-2 .ctx-item.template"));
                    var actionsNode = ctx.querySelector(".actions");
                    ApplicationContext._actionsDropdown = new ui.components.MultiDropdown(actionsNode.querySelector(".ctx-dropdown.template"), actionsNode.querySelector(".ctx-item.template"), actionsNode.querySelector(".ctx-dropdown-header.template"), actionsNode.querySelector(".ctx-dropdown-2.template"), actionsNode.querySelector(".ctx-dropdown-2 .ctx-item.template"));
                    ApplicationContext._eventsRegistry = new celestials.Dictionary();
                    ApplicationContext._eventsRegistry.add("openContext", ApplicationContext._onOpen.bind(this));
                    ApplicationContext._eventsRegistry.add("closeContext", ApplicationContext._onClose.bind(this));
                    celestials.App.Node.addEventListener("contextmenu", ApplicationContext._eventsRegistry.getValue("openContext"));
                    ApplicationContext.hide();
                }
                ApplicationContext.show = function () {
                    ApplicationContext._node.classList.remove("hide");
                    var celestialsDrop = ApplicationContext._celestialsDropdown;
                    celestialsDrop.clear();
                    celestialsDrop.createIndent();
                    var _loop_6 = function (celestial) {
                        this_2._createIndentItem(celestialsDrop, celestial.Lookup, function () {
                            celestials.managers.CelestialsManager.addCelestial(celestial.Lookup);
                        });
                    };
                    var this_2 = this;
                    for (var _i = 0, _a = celestials.managers.CelestialsManager.Templates; _i < _a.length; _i++) {
                        var celestial = _a[_i];
                        _loop_6(celestial);
                    }
                    celestialsDrop.addLastIndent("Add Celestial");
                    var actionsDrop = ApplicationContext._actionsDropdown;
                    actionsDrop.clear();
                    actionsDrop.createIndent();
                    this._createIndentItem(actionsDrop, "Pause All", function () { console.log("PAUSE ALL"); });
                    this._createIndentItem(actionsDrop, "Unpause All", function () { console.log("UNPAUSE ALL"); });
                    this._createIndentItem(actionsDrop, "Delete All", function () { celestials.managers.CelestialsManager.removeAllCelestials(); });
                    actionsDrop.addLastIndent("Control");
                    celestials.App.Node.addEventListener("click", ApplicationContext._eventsRegistry.getValue("closeContext"));
                };
                ApplicationContext.hide = function () {
                    ApplicationContext._node.classList.add("hide");
                };
                ApplicationContext._createIndentItem = function (dropdown, title, action) {
                    var item = dropdown.createItem();
                    item.innerHTML = title;
                    var act = function () {
                        action();
                        ApplicationContext.hide();
                    };
                    dropdown.addItemToLastIndent(item, act);
                };
                ApplicationContext._onOpen = function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var node = ApplicationContext._node;
                    var x = e.clientX;
                    var y = e.clientY;
                    node.style.left = x + "px";
                    node.style.top = y + "px";
                    ApplicationContext.show();
                };
                ApplicationContext._onClose = function () {
                    ApplicationContext.hide();
                    celestials.App.Node.removeEventListener("click", ApplicationContext._eventsRegistry.getValue("closeContext"));
                };
                Object.defineProperty(ApplicationContext, "StatesDropdown", {
                    get: function () { return ApplicationContext._celestialsDropdown; },
                    enumerable: true,
                    configurable: true
                });
                return ApplicationContext;
            }());
            menus.ApplicationContext = ApplicationContext;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var components;
        (function (components) {
            var ToggleGroup = (function () {
                function ToggleGroup(inputNode, collapsableNode, changeListener) {
                    this._inputNode = inputNode;
                    this._collapsableNode = collapsableNode;
                    this._changeListener = changeListener;
                    this._collapsableHeight = (this._collapsableNode != null) ? this._collapsableNode.scrollHeight : 0;
                    this._inputNode.addEventListener("change", this._onToggleChanged.bind(this));
                    this._onToggleChanged();
                }
                ToggleGroup.prototype.addChangeListener = function (callback) {
                    this._changeListener = callback;
                };
                ToggleGroup.prototype.removeChangeListener = function () {
                    this._changeListener = null;
                };
                ToggleGroup.prototype._onToggleChanged = function () {
                    if (this._changeListener != null)
                        this._changeListener(this._inputNode.checked);
                    if (this._collapsableNode != null) {
                        if (this._inputNode.checked) {
                            this._collapsableNode.style.maxHeight = this._collapsableHeight + "px";
                            this._collapsableNode.classList.remove("hide");
                        }
                        else {
                            this._collapsableNode.style.maxHeight = '0px';
                            this._collapsableNode.classList.add("hide");
                        }
                    }
                };
                return ToggleGroup;
            }());
            components.ToggleGroup = ToggleGroup;
        })(components = ui.components || (ui.components = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var ControlPanel = (function () {
                function ControlPanel(node) {
                    ControlPanel._instance = this;
                    this._node = node;
                    this._eventsRegistry = new celestials.Dictionary();
                    this._node.querySelector(".ui.close").addEventListener("click", function () { return ControlPanel.hide(); });
                    var allowNotifications = new ui.components.ToggleGroup(this._node.querySelector("[data-checkbox=allow-notifications"), null, this._onAllowNotifications.bind(this));
                    var developerMode = new ui.components.ToggleGroup(this._node.querySelector("[data-checkbox=dev-mode]"), this._node.querySelector("[data-checkbox-collapse=dev-mode]"), this._onDevMode.bind(this));
                    this._node.classList.remove("opacity-0");
                    ControlPanel.hide();
                }
                ControlPanel.show = function () {
                    ControlPanel._instance._node.classList.remove("hide");
                };
                ControlPanel.hide = function () {
                    ControlPanel._instance._node.classList.add("hide");
                };
                ControlPanel.prototype._onAllowNotifications = function (checked) {
                    if (checked)
                        celestials.systems.Notifications.addNotification("Turned on notifications!", celestials.systems.Notifications.TYPE.Notify, null, function () { return ControlPanel.show(); });
                };
                ControlPanel.prototype._onDevMode = function (checked) {
                    console.log("DEV MODE: " + checked);
                };
                return ControlPanel;
            }());
            menus.ControlPanel = ControlPanel;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var components;
        (function (components) {
            var MultiList = (function (_super) {
                __extends(MultiList, _super);
                function MultiList(node, templates, maxItems) {
                    var _this = _super.call(this, node, templates[0].template, maxItems) || this;
                    _this._templates = templates;
                    for (var _i = 0, templates_1 = templates; _i < templates_1.length; _i++) {
                        var template = templates_1[_i];
                        template.template.classList.add("hide");
                    }
                    return _this;
                }
                MultiList.prototype.createItemFromLookup = function (templateLookup, bubbleSelect) {
                    var _this = this;
                    if (bubbleSelect === void 0) { bubbleSelect = true; }
                    var template = this._getTemplateFromLookup(templateLookup);
                    if (template == null)
                        return;
                    var item = new components.Item(template.template.cloneNode(true));
                    item.Node.classList.remove("template");
                    item.Node.classList.add("hide");
                    if (bubbleSelect) {
                        item.Node.addEventListener("click", function () { return item.select(); });
                    }
                    item.addSelectListener(function (selected) {
                        _this._index = _this.Items.indexOf(selected);
                        if (_this._onSelectCallback != null)
                            _this._onSelectCallback(_this._index);
                    });
                    return item;
                };
                MultiList.prototype._getTemplateFromLookup = function (lookup) {
                    for (var _i = 0, _a = this._templates; _i < _a.length; _i++) {
                        var template = _a[_i];
                        if (template.lookup == lookup)
                            return template;
                    }
                    return null;
                };
                return MultiList;
            }(components.List));
            components.MultiList = MultiList;
        })(components = ui.components || (ui.components = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var Tooltip = (function (_super) {
                __extends(Tooltip, _super);
                function Tooltip(node) {
                    var _this = _super.call(this, node, null) || this;
                    Tooltip._instance = _this;
                    _this._tooltips = new Array();
                    var tooltips = celestials.App.Node.querySelectorAll("[data-tooltip]");
                    for (var i = 0; i < tooltips.length; i++) {
                        var tooltip = tooltips[i];
                        Tooltip.addTooltip(tooltip);
                    }
                    Tooltip._instance.hide();
                    return _this;
                }
                Object.defineProperty(Tooltip, "DEF_DURATION", {
                    get: function () { return 1000; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Tooltip, "DEF_IDLE", {
                    get: function () { return 1000; },
                    enumerable: true,
                    configurable: true
                });
                Tooltip.addTooltip = function (tooltip, text) {
                    Tooltip._instance._tooltips.push(tooltip);
                    if (tooltip.dataset.tooltip == null) {
                        if (text != null)
                            tooltip.setAttribute('data-tooltip', text);
                    }
                    tooltip.addEventListener("mouseenter", Tooltip._instance._onHover.bind(Tooltip._instance));
                    tooltip.addEventListener("mouseleave", Tooltip._instance._onHoverOut.bind(Tooltip._instance));
                    console.log("ADDED TO TOOLTIPS");
                    console.log(tooltip);
                };
                Tooltip.showTooltipOnElement = function (text, element, duration) {
                    Tooltip.showTooltip(text, element.offsetLeft, element.offsetTop, duration || Tooltip.DEF_DURATION);
                };
                Tooltip.showTooltip = function (text, x, y, duration) {
                    Tooltip._instance._node.innerHTML = text;
                    Tooltip._instance.show();
                    y += 15;
                    var width = Tooltip._instance._node.getBoundingClientRect().width;
                    var height = Tooltip._instance._node.getBoundingClientRect().height;
                    if (x + width > celestials.App.Bounds.Right)
                        x = celestials.App.Bounds.Right - width;
                    if (y + height > celestials.App.Bounds.Bottom)
                        y = celestials.App.Bounds.Top - height;
                    Tooltip._instance.X = x;
                    Tooltip._instance.Y = y;
                    Tooltip._instance._durationTimer = setTimeout(function () {
                        Tooltip._instance.hide();
                        Tooltip._instance.reset();
                    }, duration);
                };
                Tooltip.prototype.reset = function () {
                    if (Tooltip._instance._durationTimer != null)
                        celestials.App.Window.clearTimeout(Tooltip._instance._durationTimer);
                    if (Tooltip._instance._idleTimer != null)
                        celestials.App.Window.clearTimeout(Tooltip._instance._idleTimer);
                };
                Tooltip.prototype._onHover = function (e) {
                    var element = e.target;
                    if (element == null)
                        return;
                    if (element.dataset.tooltip == null)
                        element = element.closest("[data-tooltip]");
                    var text = element.dataset.tooltip;
                    this._idleTimer = setTimeout(function () {
                        return Tooltip.showTooltip(element.dataset.tooltip, celestials.App.MousePosition.x, celestials.App.MousePosition.y, element.dataset.tooltip.length * 0.1 * 1000);
                    }, Tooltip.DEF_IDLE);
                };
                Tooltip.prototype._onHoverOut = function (e) {
                    var element = e.target;
                    if (element == null)
                        return;
                    if (element.dataset.tooltip == null)
                        element = element.closest("[data-tooltip]");
                    this.reset();
                    this.hide();
                };
                return Tooltip;
            }(menus.OverlayMenu));
            menus.Tooltip = Tooltip;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials_1) {
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var CelestialsPanel = (function (_super) {
                __extends(CelestialsPanel, _super);
                function CelestialsPanel(node) {
                    var _this = _super.call(this, node, null) || this;
                    CelestialsPanel._instance = _this;
                    _this._node.querySelector(".ui.close").addEventListener("click", function () { return _this.hide(); });
                    CelestialsPanel._celestialsList = new ui.components.MultiList(_this._node.querySelector(".list"), [
                        { "lookup": "normal", "template": _this._node.querySelector(".item.celestial") },
                        { "lookup": "locked", "template": _this._node.querySelector(".item.celestial--locked") }
                    ]);
                    _this.hide();
                    return _this;
                }
                CelestialsPanel.show = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var celestials, _loop_7, _i, celestials_2, cel;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    CelestialsPanel._instance.show();
                                    CelestialsPanel._celestialsList.clear();
                                    celestials = celestials_1.managers.CelestialsManager.Templates;
                                    celestials = celestials.sort(function (a, b) {
                                        var lookup = a.Lookup.localeCompare(b.Lookup);
                                        if (a.Data.locked && b.Data.locked)
                                            return lookup;
                                        if (lookup < 0 && a.Data.locked)
                                            return 1;
                                        return lookup;
                                    });
                                    console.log("MAKE THE ICONS");
                                    _loop_7 = function (cel) {
                                        var locked, item;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    locked = cel.Data.locked || false;
                                                    item = CelestialsPanel._celestialsList.createItemFromLookup((!locked) ? "normal" : "locked");
                                                    if (!!locked) return [3, 2];
                                                    item.Node.querySelector(".name").innerHTML = cel.Lookup;
                                                    return [4, cel.getIcon()
                                                            .then(function (src) { return item.Node.querySelector("img").src = src; })];
                                                case 1:
                                                    _a.sent();
                                                    menus.Tooltip.addTooltip(item.Node, "Click to spawn " + cel.Name + "!");
                                                    celestials_1.managers.MouseManager.listenForMouseDown(item.Node, function (x, y) { return CelestialsPanel._instance._onCelestialsItemClicked(item, x, y); });
                                                    item.Node.querySelector("img").ondragstart = function () { return false; };
                                                    return [3, 3];
                                                case 2:
                                                    menus.Tooltip.addTooltip(item.Node, 'This celestial is currently locked.  Be patient!');
                                                    _a.label = 3;
                                                case 3:
                                                    CelestialsPanel._celestialsList.addItemToList(item);
                                                    return [2];
                                            }
                                        });
                                    };
                                    _i = 0, celestials_2 = celestials;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < celestials_2.length)) return [3, 4];
                                    cel = celestials_2[_i];
                                    return [5, _loop_7(cel)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    _i++;
                                    return [3, 1];
                                case 4: return [2];
                            }
                        });
                    });
                };
                CelestialsPanel.prototype._onCelestialsItemClicked = function (item, x, y) {
                    return __awaiter(this, void 0, void 0, function () {
                        var template, cel;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("CLICKED");
                                    template = item.Node.querySelector(".name").innerHTML;
                                    return [4, celestials_1.managers.CelestialsManager.addCelestialAtPosition(template, x, y)];
                                case 1:
                                    cel = _a.sent();
                                    if (cel != null) {
                                        celestials_1.managers.CelestialsManager.onGrab(cel, x, y);
                                        celestials_1.managers.MouseManager.startDrag(cel.Node);
                                    }
                                    return [2];
                            }
                        });
                    });
                };
                return CelestialsPanel;
            }(menus.OverlayMenu));
            menus.CelestialsPanel = CelestialsPanel;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials_1.ui || (celestials_1.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var App = (function () {
        function App(win, node) {
            App._instance = this;
            App._window = win;
            App._node = node;
            App._paused = false;
            App._mousePosition = { x: 0, y: 0 };
            App._node.addEventListener("mousemove", function (e) {
                App._mousePosition.x = e.x;
                App._mousePosition.y = e.y;
            });
        }
        App.setup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var celestialsMan, controls, debug;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("SETUP");
                            App._bounds = new celestials.Rect(App._node.offsetLeft, App._node.offsetTop, App._node.offsetWidth, App._node.offsetHeight);
                            new celestials.ui.menus.CelestialContext(document.querySelector(".context-menu.celestial"));
                            new celestials.ui.menus.ApplicationContext(document.querySelector(".context-menu.application"));
                            new celestials.ui.menus.ControlPanel(document.querySelector(".overlay-menu.control-panel"));
                            new celestials.ui.menus.NotificationBar(document.querySelector(".overlay-menu.notifications-bar"), document.querySelector(".notifications-bar-bounds"));
                            new celestials.ui.menus.NotificationPanel(document.querySelector(".overlay-menu.notifications-panel"));
                            new celestials.ui.menus.CelestialsPanel(document.querySelector(".overlay-menu.celestials"));
                            new celestials.ui.menus.Tooltip(document.querySelector(".overlay-menu.tooltip"));
                            celestials.systems.Notifications.addNotification("This is a test!", celestials.systems.Notifications.TYPE.Notify);
                            celestials.systems.Notifications.addNotification("This is a test for failure!", celestials.systems.Notifications.TYPE.Fail);
                            return [4, new celestials.managers.MouseManager()];
                        case 1:
                            _a.sent();
                            return [4, new celestials.managers.InputManager()];
                        case 2:
                            _a.sent();
                            return [4, new celestials.managers.CelestialsManager()];
                        case 3:
                            celestialsMan = _a.sent();
                            return [4, celestialsMan.setup()];
                        case 4:
                            _a.sent();
                            return [4, new celestials.systems.Controls()];
                        case 5:
                            controls = _a.sent();
                            return [4, new celestials.systems.Debugger()];
                        case 6:
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
        Object.defineProperty(App, "MousePosition", {
            get: function () { return App._mousePosition; },
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
    var _window = window;
    function setupApp() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        new App(window, document.querySelector(".screen"));
                        return [4, App.setup()];
                    case 1:
                        _a.sent();
                        _window.celestials = celestials.managers.CelestialsManager;
                        return [2];
                }
            });
        });
    }
    setupApp();
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
                this._velocity = {
                    x: 0,
                    y: 0
                };
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
            Object.defineProperty(Physics, "WALL", {
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
                this._velocity.x += value;
            };
            Physics.prototype.addForceY = function (value) {
                this._velocity.y += value;
                this.update();
            };
            Physics.prototype.zeroVelocity = function () {
                this._velocity.x = 0;
                this._velocity.y = 0;
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
            Physics.prototype.snapToTop = function () {
                this._entity.Y = celestials.App.Bounds.Top + (this._entity.Bounds.Height - this._entity.RegistrationOffset.y);
            };
            Physics.prototype.keepInBounds = function () {
                var screenBounds = celestials.App.Bounds;
                var entityBounds = this._entity.Bounds;
                var regOffset = this._entity.RegistrationOffset;
                if (entityBounds.Left < screenBounds.Left) {
                    this._entity.X = screenBounds.Left + regOffset.x;
                    this.callWallHit(Physics.WALL.Left);
                }
                else if (entityBounds.Right > screenBounds.Right) {
                    this._entity.X = screenBounds.Right - (entityBounds.Width - regOffset.x);
                    this.callWallHit(Physics.WALL.Right);
                }
                if (entityBounds.Top < screenBounds.Top) {
                    this._entity.Y = screenBounds.Top + (entityBounds.Height - regOffset.y);
                    this.callWallHit(Physics.WALL.Top);
                }
                else if (entityBounds.Bottom > screenBounds.Bottom) {
                    this._entity.Y = screenBounds.Bottom - regOffset.y;
                    this.callWallHit(Physics.WALL.Bottom);
                }
            };
            Physics.prototype.correctVelocity = function () {
                var screenBounds = celestials.App.Bounds;
                var entityBounds = this._entity.Bounds;
                if (entityBounds.Left <= screenBounds.Left)
                    if (this._velocity.x < 0)
                        this._velocity.x = 0;
                if (entityBounds.Right >= screenBounds.Right)
                    if (this._velocity.x > 0)
                        this._velocity.x = 0;
                if (entityBounds.Top <= screenBounds.Top)
                    if (this._velocity.y < 0)
                        this._velocity.y = 0;
                if (entityBounds.Bottom >= screenBounds.Bottom)
                    if (this._velocity.y > 0)
                        this._velocity.y = 0;
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
            Physics.prototype.isTouchingWall = function () {
                var walls = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    walls[_i] = arguments[_i];
                }
                var screenBounds = celestials.App.Bounds;
                var entityBounds = this._entity.Bounds;
                for (var _a = 0, walls_1 = walls; _a < walls_1.length; _a++) {
                    var wall = walls_1[_a];
                    switch (wall) {
                        case Physics.WALL.Left:
                            if (entityBounds.Left <= screenBounds.Left)
                                return true;
                            break;
                        case Physics.WALL.Right:
                            if (entityBounds.Right >= screenBounds.Right)
                                return true;
                            break;
                        case Physics.WALL.Top:
                            if (entityBounds.Top <= screenBounds.Top)
                                return true;
                            break;
                        case Physics.WALL.Bottom:
                            if (entityBounds.Bottom >= screenBounds.Bottom)
                                return true;
                            break;
                    }
                }
                return false;
            };
            Physics.prototype.update = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this._velocity.x *= this._degradeVelocity;
                                this._velocity.y *= this._degradeVelocity;
                                if (this._usesGravity) {
                                    this._velocity.y += this._gravity;
                                }
                                return [4, this.correctVelocity()];
                            case 1:
                                _a.sent();
                                this._entity.X += this._velocity.x;
                                this._entity.Y += this._velocity.y;
                                return [4, this.keepInBounds()];
                            case 2:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            Object.defineProperty(Physics.prototype, "Velocity", {
                get: function () { return { x: this._velocity.x, y: this._velocity.y }; },
                enumerable: true,
                configurable: true
            });
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
                this._drawingFrame = false;
                this._pauseIntegrityCheck = false;
                if (data != null) {
                    var updateRate = data.updateRate, eagerness = data.eagerness, attentionSpan = data.attentionSpan;
                    if (updateRate != null)
                        this._updateRate = celestials.clamp(updateRate, 1, 1000);
                    if (eagerness != null)
                        this._eagerness = celestials.clamp(eagerness, 1, 100);
                    if (attentionSpan != null)
                        this._attentionSpan = celestials.clamp(attentionSpan, 0, 100);
                }
            }
            CelestialLogic.prototype.next = function () {
                this._tick += this._eagerness;
                var locAttentionSpan = celestials.clamp(this._celestial.Sequencer.CurrentSequenceSet.attentionSpan || 100, 1, 100);
                var attentionSpan = this._attentionSpan * (locAttentionSpan / 100);
                var attention = celestials.randomRangeInt(this._tick, 100);
                console.log("TICK:" + this._tick + ", ATTENTION:" + attention + ", SPAN:" + attentionSpan);
                if (attention > attentionSpan || this._celestial.Sequencer.CurrentSequenceSet.runOnce) {
                    console.log("CHANGE STATE!");
                    this.nextState();
                    this._tick = 0;
                }
                else {
                    console.log("I'm not bored yet!");
                    var sequence = this._celestial.Sequencer.getRandomStateSequence(this._celestial.Sequencer.CurrentState);
                    this._celestial.Sequencer.changeSequence(sequence);
                }
            };
            CelestialLogic.prototype.nextState = function (state) {
                if (state == null) {
                    state = this._celestial.Sequencer.CurrentState;
                    var nextStates = this._celestial.Sequencer.CurrentSequenceSet.transitionStates || celestials.engines.CelestialSequencer.DEFAULT_TRANSITIONAL_STATES;
                    celestials.shuffleArray(nextStates);
                    console.log("NEXT STATES");
                    console.log(nextStates);
                    var waitingForState = true;
                    while (waitingForState) {
                        for (var i = 0; i < nextStates.length; i++) {
                            var stateName = celestials.engines.CelestialSequencer.State[nextStates[i]];
                            if (this._celestial.Sequencer.changeState(stateName) != null) {
                                waitingForState = false;
                                console.log("I FOUND A STATE: " + this._celestial.Sequencer.CurrentState);
                                break;
                            }
                        }
                        if (waitingForState)
                            throw new Error("The state: " + state + " does not have a transition state available.  Celestial " + this._celestial.Name + " is trapped!");
                    }
                    console.log("Switched TO: " + this._celestial.Sequencer.CurrentState);
                    var sequence = this._celestial.Sequencer.getRandomStateSequence(this._celestial.Sequencer.CurrentState);
                    this._celestial.Sequencer.changeSequence(sequence);
                }
            };
            CelestialLogic.prototype.handleWallHit = function (which) {
                console.log("HIT WALL CHECK");
                this._handleStateIntegrity(which);
                if (which == Physics.WALL.Bottom && this._celestial.Sequencer.isCurrentState(celestials.engines.CelestialSequencer.State.Fall)) {
                    console.log("CALLED");
                    var state = this._celestial.Sequencer.changeState(celestials.engines.CelestialSequencer.State.Recover);
                    if (state != celestials.engines.CelestialSequencer.State.Recover) {
                        this.next();
                    }
                    var sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                    if (sequence != null)
                        this._celestial.Sequencer.changeSequence(sequence);
                }
            };
            CelestialLogic.prototype.handleStateChange = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("----------CALLLED----------");
                                console.log("STATE: -------- " + this._celestial.Sequencer.CurrentState);
                                this._pauseIntegrityCheck = true;
                                this._celestial.Sequencer.reset();
                                return [4, this._celestial.update()];
                            case 1:
                                _a.sent();
                                console.log("FINISHED UPDATING");
                                this.reset();
                                return [4, this._handleStateChange()];
                            case 2:
                                _a.sent();
                                return [4, this._handleStateNuance()];
                            case 3:
                                _a.sent();
                                this._pauseIntegrityCheck = false;
                                return [2];
                        }
                    });
                });
            };
            CelestialLogic.prototype._handleStateChange = function () {
                console.log("HANDLING STATE CHANGE");
                var cs = celestials.engines.CelestialSequencer;
                var lastState = this._celestial.Sequencer.LastState;
                var currentState = this._celestial.Sequencer.CurrentState;
                this._celestial.Physics.zeroVelocity();
                console.log("State setup: " + currentState);
                console.log(this._celestial.Sequencer.CurrentFrame.name);
                switch (currentState) {
                    case cs.State.Idle:
                    case cs.State.Walk:
                    case cs.State.Fall:
                        this._celestial.Physics.resetGravity();
                        this._tryToFlipX();
                        break;
                    case cs.State.Climb:
                        this._celestial.Physics.setGravity(0);
                        var lastTouchedWall = this._celestial.Physics.LastTouchedWall;
                        if (lastTouchedWall != Physics.WALL.Left && lastTouchedWall != Physics.WALL.Right)
                            lastTouchedWall = (this._celestial.Bounds.Center.x < celestials.App.Bounds.Center.x) ? Physics.WALL.Left : Physics.WALL.Right;
                        switch (lastTouchedWall) {
                            case Physics.WALL.Left:
                                this._celestial.Physics.snapToLeft();
                                this._celestial.setDirectionX(-1);
                                break;
                            case Physics.WALL.Right:
                                this._celestial.Physics.snapToRight();
                                this._celestial.setDirectionX(1);
                        }
                        break;
                    case cs.State.Hang:
                        console.log("SNAPPING TO TOP");
                        this._celestial.Physics.setGravity(0);
                        this._celestial.Physics.snapToTop();
                        break;
                }
            };
            CelestialLogic.prototype._handleStateNuance = function () {
                var cs = celestials.engines.CelestialSequencer;
                var lastState = this._celestial.Sequencer.LastState;
                var currentState = this._celestial.Sequencer.CurrentState;
                console.log(lastState, currentState);
                if (lastState == cs.State.Climb && currentState == cs.State.Hang) {
                    console.log("I AM USING THE NUANCE");
                    this._celestial.flipX();
                    this._celestial.Physics.addForceX(celestials.randomRange(20, 30) * this._celestial.Direction.x);
                }
            };
            CelestialLogic.prototype._handleStateIntegrity = function (wallHit) {
                var cs = celestials.engines.CelestialSequencer;
                var lastState = this._celestial.Sequencer.LastState;
                var currentState = this._celestial.Sequencer.CurrentState;
                switch (currentState) {
                    case cs.State.Walk:
                    case cs.State.Idle:
                    case cs.State.Fall:
                        if (!this._tryToClimb(wallHit))
                            this._celestial.flipX();
                        break;
                    case cs.State.Climb:
                        if (this._tryToHang(wallHit))
                            break;
                        if (!this._celestial.Physics.isTouchingWall(Physics.WALL.Left, Physics.WALL.Right)) {
                            this.nextState();
                            break;
                        }
                        if (this._celestial.Physics.isTouchingWall(Physics.WALL.Left) && this._celestial.Direction.x != -1) {
                            this.nextState();
                            break;
                        }
                        if (this._celestial.Physics.isTouchingWall(Physics.WALL.Right) && this._celestial.Direction.x != 1) {
                            this.nextState();
                            break;
                        }
                        break;
                    case cs.State.Hang:
                        if (wallHit != null)
                            if (wallHit == Physics.WALL.Left || wallHit == Physics.WALL.Right)
                                this._celestial.flipX();
                        if (wallHit == null)
                            if (this._celestial.Bounds.Top > celestials.App.Bounds.Top)
                                this.nextState();
                        break;
                    case cs.State.Recover:
                        if (this._celestial.Bounds.Bottom < celestials.App.Bounds.Bottom)
                            this.nextState();
                }
            };
            CelestialLogic.prototype.handleStateComplete = function () {
                var state = this._celestial.Sequencer.CurrentState;
                var funcName = "_complete" + state[0].toUpperCase() + state.substr(1);
                if (this[funcName] != null) {
                    this._celestial.Physics.resetGravity();
                    this[funcName]();
                }
            };
            CelestialLogic.prototype.reset = function () {
                this._tick = 0;
            };
            CelestialLogic.prototype.load = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var state, sequence, e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            state = this._celestial.Sequencer.changeState(celestials.engines.CelestialSequencer.State.Fall, celestials.engines.CelestialSequencer.State.Idle);
                                            console.log("STATE: " + state);
                                            console.log(this._celestial.Sequencer.Sequences);
                                            sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                                            this._celestial.Sequencer.changeSequence(sequence);
                                            return [4, this._celestial.drawCurrentFrame()];
                                        case 1:
                                            _a.sent();
                                            console.log("LOADED FIRST LOGIC");
                                            resolve();
                                            return [3, 3];
                                        case 2:
                                            e_1 = _a.sent();
                                            reject(new Error("Could not load Logic on " + this._celestial.Name + "\n" + e_1));
                                            return [3, 3];
                                        case 3: return [2];
                                    }
                                });
                            }); })];
                    });
                });
            };
            CelestialLogic.prototype.unload = function () {
            };
            CelestialLogic.prototype.update = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var state = _this._celestial.Sequencer.CurrentState;
                    if (!_this._celestial.IsControlled) {
                        var funcName = "_handle" + state[0].toUpperCase() + state.substr(1);
                        if (_this[funcName] != null)
                            _this[funcName]();
                        if (!_this._pauseIntegrityCheck)
                            _this._handleStateIntegrity();
                    }
                    resolve();
                });
            };
            CelestialLogic.prototype._handleIdles = function () {
            };
            CelestialLogic.prototype._completeIdles = function () {
            };
            CelestialLogic.prototype._handleWalks = function () {
                var frame = this._celestial.Sequencer.CurrentFrame;
                var moveSpeed = frame.moveSpeed || 0;
                var jumpForce = frame.jumpForce || 0;
                this._celestial.Physics.addForceX(moveSpeed * this._celestial.Direction.x);
                this._celestial.Physics.addForceY(-jumpForce);
            };
            CelestialLogic.prototype._completeWalks = function () {
            };
            CelestialLogic.prototype._handleClimbs = function () {
                var frame = this._celestial.Sequencer.CurrentFrame;
                var moveSpeed = frame.moveSpeed || 10;
                this._celestial.Physics.addForceY(-moveSpeed);
            };
            CelestialLogic.prototype._completeClimbs = function () {
                console.log("JUMP OFF WALL!");
                switch (this._celestial.Physics.LastTouchedWall) {
                    case Physics.WALL.Left:
                        this._celestial.Physics.addForceX(celestials.randomRange(35, 80));
                        this._celestial.flipX();
                        break;
                    case Physics.WALL.Right:
                        this._celestial.Physics.addForceX(celestials.randomRange(-35, -80));
                        this._celestial.flipX();
                        break;
                }
            };
            CelestialLogic.prototype._handleHangs = function () {
                var frame = this._celestial.Sequencer.CurrentFrame;
                this._celestial.Physics.setGravity(0);
                var moveSpeed = frame.moveSpeed || 2;
                this._celestial.Physics.addForceX(moveSpeed * this._celestial.Direction.x);
            };
            CelestialLogic.prototype._handleFalls = function () {
                var frame = this._celestial.Sequencer.CurrentFrame;
            };
            CelestialLogic.prototype._tryToFlipX = function () {
                var random = celestials.randomRange(0, 1);
                console.log("I wanna flip!");
                var wantToFlipX = celestials.lerp((this._eagerness * 5), 100, random);
                if (wantToFlipX > this._attentionSpan)
                    this._celestial.flipX();
            };
            CelestialLogic.prototype._tryToClimb = function (wallHit) {
                if (wallHit != null) {
                    if (wallHit == Physics.WALL.Left || wallHit == Physics.WALL.Right) {
                        if (celestials.randomRange(0, 1) > this._celestial.Sequencer.CurrentSequenceSet.attentionSpan || 100 / 100) {
                            var state = this._celestial.Sequencer.changeState(celestials.engines.CelestialSequencer.State.Climb);
                            if (state != celestials.engines.CelestialSequencer.State.Climb)
                                return false;
                            var sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                            if (sequence != null) {
                                this._celestial.Sequencer.changeSequence(sequence);
                                return true;
                            }
                        }
                        return false;
                    }
                }
                return true;
            };
            CelestialLogic.prototype._tryToHang = function (wallHit) {
                if (wallHit == null)
                    return false;
                if (wallHit != Physics.WALL.Top)
                    return false;
                if (celestials.randomRange(0, 1) > 0) {
                    var state = this._celestial.Sequencer.changeState(celestials.engines.CelestialSequencer.State.Hang);
                    if (state != celestials.engines.CelestialSequencer.State.Hang)
                        return false;
                    var sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                    if (sequence != null) {
                        this._celestial.Sequencer.changeSequence(sequence);
                        return true;
                    }
                }
                return false;
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
                    this._updateRate = this._sequences.updateRate || 1;
                }
            }
            Object.defineProperty(CelestialSequencer, "State", {
                get: function () {
                    return Object.freeze({
                        "Idle": "idles",
                        "Walk": "walks",
                        "Climb": "climbs",
                        "Hang": "hangs",
                        "Fall": "falls",
                        "Recover": "recovers",
                        "Hold": "holds"
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CelestialSequencer, "DEFAULT_TRANSITIONAL_STATES", {
                get: function () { return ["Idle", "Walk"]; },
                enumerable: true,
                configurable: true
            });
            CelestialSequencer.prototype.reset = function () {
                this._frameIndex = 0;
                this._holdIndex = 0;
                this._totalIndex = 0;
            };
            CelestialSequencer.prototype.changeState = function (state, fallback) {
                if (state === void 0) { state = CelestialSequencer.State.Idle; }
                if (this._currentState != null)
                    this.completeState();
                this._lastState = this._currentState || "";
                var sequences = (this._sequences[state] != null) ? this._sequences[state].sequences : null;
                if (sequences == null && fallback != null)
                    return this._changeToFallbackState(fallback);
                else if (sequences == null && fallback == null)
                    return null;
                this._currentState = state;
                if (this._stateChangeListener != null)
                    this._stateChangeListener();
                return this._currentState;
            };
            CelestialSequencer.prototype._changeToFallbackState = function (state) {
                return this.changeState(state);
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
            CelestialSequencer.prototype.getStateSequences = function (state) {
                return (this._sequences[state] != null) ? this._sequences[state].sequences : null;
            };
            CelestialSequencer.prototype.getRandomStateSequence = function (state) {
                var sequences = this._sequences[state].sequences;
                if (sequences.length > 0)
                    return sequences[celestials.randomRangeInt(0, sequences.length - 1)];
                return null;
            };
            CelestialSequencer.prototype.getSequenceByName = function (name) {
                var sequences = this._sequences[this._currentState].sequences;
                for (var _i = 0, sequences_2 = sequences; _i < sequences_2.length; _i++) {
                    var seq = sequences_2[_i];
                    if (seq.name == name)
                        return seq;
                }
                return null;
            };
            CelestialSequencer.prototype.changeSequence = function (sequence) {
                if (sequence == null)
                    return;
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
            CelestialSequencer.prototype.isCurrentState = function () {
                var states = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    states[_i] = arguments[_i];
                }
                for (var _a = 0, states_1 = states; _a < states_1.length; _a++) {
                    var state = states_1[_a];
                    if (this._currentState == state)
                        return true;
                }
                return false;
            };
            CelestialSequencer.prototype.addSequenceCompleteListener = function (listener) {
                this._sequenceCompleteListener = listener;
            };
            CelestialSequencer.prototype.removeSequenceCompleteListener = function () {
                this._sequenceCompleteListener = null;
            };
            CelestialSequencer.prototype.addStateChangeListener = function (listener) {
                this._stateChangeListener = listener;
            };
            CelestialSequencer.prototype.removeStateChangeListener = function () {
                this._stateChangeListener = null;
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
                        if (_this._holdIndex > _this._currentSequence.frames[_this._frameIndex].hold * _this._updateRate) {
                            _this._frameIndex++;
                            _this._holdIndex = 0;
                        }
                        if (_this._frameIndex > _this._currentSequence.frames.length - 1) {
                            if (_this._currentSequence.looping && !(_this.CurrentSequenceSet.runOnce || true))
                                _this._frameIndex = 0;
                            else
                                _this.completeSequence();
                        }
                        if (_this._totalIndex > _this._currentSequence.duration * _this._updateRate) {
                            _this.completeSequence();
                        }
                        resolve();
                    }
                    catch (e) {
                        reject(console.log("PROBLEM WITH SEQUENCER ON " + _this._celestial.Name + "\n" + e));
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
            Object.defineProperty(CelestialSequencer.prototype, "LastState", {
                get: function () { return this._lastState; },
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
            Object.defineProperty(CelestialSequencer.prototype, "CurrentSequenceSet", {
                get: function () { return this._sequences[this._currentState]; },
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