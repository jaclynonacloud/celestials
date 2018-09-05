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
                this._callbacksRegistry = new celestials.Dictionary();
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
            Entity.prototype.setName = function (name) {
                this._name = name;
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
            Entity.prototype.callListeners = function () {
                for (var _i = 0, _a = this._callbacksRegistry.List; _i < _a.length; _i++) {
                    var html = _a[_i];
                    for (var _b = 0, html_1 = html; _b < html_1.length; _b++) {
                        var func = html_1[_b];
                        func();
                    }
                }
            };
            Entity.prototype.showRegistrationPoint = function (show) {
                var regPointDiv = this._node.querySelector(".coord");
                if (regPointDiv == null)
                    return;
                if (show)
                    regPointDiv.classList.remove("hide");
                else
                    regPointDiv.classList.add("hide");
            };
            Entity.prototype.registerListener = function (node, func) {
                if (this._callbacksRegistry.containsKey(node)) {
                    this._callbacksRegistry.getValue(node).push(func);
                }
            };
            Entity.prototype.removeListeners = function (node) {
                if (this._callbacksRegistry.containsKey(node))
                    this._callbacksRegistry.remove(node);
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
            Object.defineProperty(Entity.prototype, "MainImage", {
                get: function () { return this._mainImage; },
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
                this._isShowing = false;
                this._isDisabled = false;
            }
            Menu.prototype.show = function () {
                this._node.classList.remove("hide");
                this._isShowing = true;
            };
            Menu.prototype.hide = function () {
                this._node.classList.add("hide");
                this._isShowing = false;
            };
            Menu.prototype.remove = function () {
                this._node.remove();
                this._isShowing = false;
            };
            Menu.prototype.disable = function () {
                this._isDisabled = true;
            };
            Menu.prototype.enable = function () {
                this._isDisabled = false;
            };
            Object.defineProperty(Menu.prototype, "Node", {
                get: function () { return this._node; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Menu.prototype, "IsDisabled", {
                get: function () { return this._isDisabled; },
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
                _this._size = 0;
                _this._spawnTick = 0;
                _this._spawnOdds = 0;
                _this._isSpawning = false;
                _this._descendants = new Array();
                _this._interactingWith = null;
                _this._interactBurnout = 0;
                _this._dateSpawned = new Date();
                _this._spawnedBy = null;
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
            Celestial.prototype.setName = function (name) {
                _super.prototype.setName.call(this, name);
                celestials.managers.CelestialsManager.callChangeCelestial(this);
            };
            Celestial.prototype.setSpawnParent = function (celestial) {
                this._spawnedBy = celestial;
            };
            Celestial.prototype.setZIndex = function (index) {
                this.setZIndexTemp(index);
                this.Data.zIndex = index;
            };
            Celestial.prototype.setZIndexTemp = function (index) {
                this._node.style.zIndex = "" + index;
            };
            Celestial.prototype.resetZIndex = function () {
                this.setZIndexTemp(this.Data.zIndex);
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
            Celestial.prototype.trySpawn = function () {
                this._spawnTick = 0;
                if (this.Data.spawnChance == null)
                    return;
                console.log(this.Data.spawnChance);
                console.log("LISTEN FOR SPAWNING!!!!!!!!");
                this._spawnOdds++;
                var chance = celestials.randomRange(0, 100);
                var spawnChance = this.Data.spawnChance;
                var result = Math.abs(chance - this._spawnOdds);
                console.log("SPAWN CHANCE: ", spawnChance, " ODDS: ", this._spawnOdds, " CHANCE: ", chance, "COMB: ", result);
                if (result < spawnChance) {
                    console.log("SPAWNING FRIEND");
                    this.spawn();
                }
            };
            Celestial.prototype.spawn = function () {
                this._spawnOdds = 0;
                this._isSpawning = true;
                if (!this._logic.startState(celestials.engines.CelestialSequencer.STATE.Spawn))
                    this.endSpawn();
            };
            Celestial.prototype.endSpawn = function (spawnChance) {
                return __awaiter(this, void 0, void 0, function () {
                    var chance, lookup, rare, _i, _a, lin, odds, spawn;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                this._isSpawning = false;
                                spawnChance = spawnChance || 50;
                                console.log("MIGHT SPAWN");
                                chance = celestials.randomRange(0, 100);
                                console.log("CHANCE: ", chance, "SPAWN CHANCE: ", spawnChance);
                                if (!(spawnChance > chance)) return [3, 2];
                                console.log("WANT TO SPAWN!");
                                lookup = this.Lookup;
                                rare = false;
                                if (this.Data.spawnLineage != null) {
                                    for (_i = 0, _a = this.Data.spawnLineage; _i < _a.length; _i++) {
                                        lin = _a[_i];
                                        odds = celestials.randomRange(0, 100);
                                        if (lin.chance >= odds) {
                                            if (celestials.managers.CelestialsManager.getTemplateByLookup(lin.lookup) != null) {
                                                lookup = lin.lookup;
                                                rare = lin.rare || false;
                                            }
                                        }
                                    }
                                }
                                console.log("MAX: " + this.Data.maxDescendants + ", CURRENT: " + this._descendants.length);
                                if (this.Data.maxDescendants != null) {
                                    if (this._descendants.length >= this.Data.maxDescendants && !rare) {
                                        console.log(this.Name + " has too many children!  Cannot spawn any more!");
                                        return [2];
                                    }
                                }
                                return [4, celestials.managers.CelestialsManager.addCelestialByLookupAtPosition(lookup, this.X, this.Y)];
                            case 1:
                                spawn = _b.sent();
                                if (spawn != null) {
                                    spawn.setSpawnParent(this);
                                    spawn.Physics.addForceX(celestials.randomRange(-100, 100));
                                    spawn.Physics.addForceY(celestials.randomRange(-100, 100));
                                    this._descendants.push(spawn);
                                }
                                _b.label = 2;
                            case 2: return [2];
                        }
                    });
                });
            };
            Celestial.prototype.askToInteractWith = function (celestial) {
                console.log("I WANT TO TALK TO : " + celestial.Name);
                if (celestial.InteractingWith != null)
                    return false;
                if (celestial.InteractingWith == this)
                    return false;
                console.log("I AM LISTENING: " + this.Name);
                this._interactingWith = celestial;
                if (this.Sequencer.CurrentState == celestials.engines.CelestialSequencer.STATE.Hold)
                    return false;
                if (celestial.Sequencer.CurrentState == celestials.engines.CelestialSequencer.STATE.Hold)
                    return false;
                if (this._interactBurnout > 0 && celestials.randomRange(0, 1) < 0.9)
                    return false;
                if (this._moods.UsesMood) {
                    var chance = celestials.randomRange(0, 100);
                    if (chance < this._moods.getMoodByName(celestials.engines.Moods.MOOD.Social).value)
                        return false;
                    else if (celestials.randomRange(0, 1) > 0.2)
                        return false;
                }
                if (this._relationships != null) {
                    var relationship = this._relationships.findRelationshipByCelestial(celestial);
                    if (relationship != null) {
                        var chance = celestials.randomRange(0, 100);
                        if (chance > relationship.value)
                            if (celestials.randomRange(0, 1) > 0.5)
                                return false;
                    }
                }
                var valueOfInteraction = this._relationships.getInteractValueWith(celestial);
                celestial.Relationships.setInteraction(this, valueOfInteraction);
                this.Relationships.setInteraction(celestial, valueOfInteraction);
                this._moods.boost(celestials.engines.Moods.MOOD.Social, (valueOfInteraction * Math.max(1, this._relationships.Attachment)), true);
                celestial.Moods.boost(celestials.engines.Moods.MOOD.Social, (valueOfInteraction * Math.max(1, this._relationships.Attachment)), true);
                this.startInteraction(celestial);
                celestial.startInteraction(this);
                if (this.X < celestial.X) {
                    this.setDirectionX(1);
                    celestial.setDirectionX(-1);
                }
                else {
                    this.setDirectionX(-1);
                    celestial.setDirectionX(1);
                }
                return true;
            };
            Celestial.prototype.startInteraction = function (celestial) {
                return __awaiter(this, void 0, void 0, function () {
                    var relationship, relationship;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this._interactingWith = celestial;
                                console.log("I AM STARTING AN INTERACTION WITH: " + celestial.Name);
                                this._interactBurnout = ((100 - this.Relationships.Attachment) * celestials.randomRange(0.7, 1.3));
                                console.log("BURNOUT: " + this._interactBurnout);
                                return [4, this._logic.startState(celestials.engines.CelestialSequencer.STATE.Interact)];
                            case 1:
                                if (_a.sent()) {
                                    if (this._relationships != null) {
                                        relationship = this._relationships.findRelationshipByCelestial(celestial);
                                        if (relationship != null)
                                            relationship.lastAction = celestial.Sequencer.CurrentSequence.name + " with " + celestial.Name;
                                    }
                                    if (celestial.Relationships != null) {
                                        relationship = celestial.Relationships.findRelationshipByCelestial(this);
                                        if (relationship != null)
                                            relationship.lastAction = this.Sequencer.CurrentSequence.name + " with " + this.Name;
                                    }
                                }
                                else
                                    this._logic.startState(celestials.engines.CelestialSequencer.STATE.Idle);
                                return [2];
                        }
                    });
                });
            };
            Celestial.prototype.completeInteraction = function () {
                if (this._interactingWith.InteractingWith != null) {
                    this._interactingWith.InteractingWith.Logic.nextState();
                }
                this._interactingWith = null;
            };
            Celestial.prototype.removeInteractionCelestial = function () {
                this._interactingWith = null;
            };
            Celestial.prototype.clone = function () {
                var clone = new Celestial(celestials.managers.CelestialsManager.Template, this._container, JSON.parse(JSON.stringify(this._data)));
                return clone;
            };
            Celestial.prototype.load = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                    var data_1, _a, path_1, images, spritesheets, name_1, lookup, promises, _loop_1, _i, images_1, imgData, _loop_2, _b, spritesheets_1, spritesheet, hueVariation, e_1;
                                    var _this = this;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4, _super.prototype.load.call(this)];
                                            case 1:
                                                _c.sent();
                                                _c.label = 2;
                                            case 2:
                                                _c.trys.push([2, 9, , 10]);
                                                data_1 = this._data;
                                                this._sequencer = new celestials.engines.CelestialSequencer(this);
                                                this._physics = new celestials.engines.Physics(this);
                                                this._moods = new celestials.engines.Moods(this);
                                                this._relationships = new celestials.engines.Relationships(this);
                                                this._logic = new celestials.logic.CelestialLogic(this, this.Data.logic || null);
                                                this._scale = celestials.randomRange(data_1.scale.min, data_1.scale.max);
                                                this._variation = celestials.randomRange(0, data_1.variation || 0);
                                                if (this.Data.presets != null) {
                                                    this.setName(this.Data.presets[celestials.randomRangeInt(0, this.Data.presets.length - 1)]);
                                                }
                                                _a = this.Data, path_1 = _a.path, images = _a.images, spritesheets = _a.spritesheets, name_1 = _a.name, lookup = _a.lookup;
                                                promises = new Array();
                                                if (images != null) {
                                                    _loop_1 = function (imgData) {
                                                        promises.push(new Promise(function (res, rej) {
                                                            try {
                                                                var img_2 = document.createElement("img");
                                                                img_2.onload = function () {
                                                                    _this.addImage(imgData.name, img_2.src);
                                                                    res();
                                                                };
                                                                img_2.src = path_1 + imgData.path;
                                                            }
                                                            catch (e) {
                                                                rej();
                                                            }
                                                        }));
                                                    };
                                                    for (_i = 0, images_1 = images; _i < images_1.length; _i++) {
                                                        imgData = images_1[_i];
                                                        _loop_1(imgData);
                                                    }
                                                }
                                                if (spritesheets != null) {
                                                    _loop_2 = function (spritesheet) {
                                                        promises.push(new Promise(function (res, rej) {
                                                            try {
                                                                var img_3 = document.createElement("img");
                                                                img_3.onload = function () {
                                                                    var _loop_3 = function (frame) {
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
                                                                img_3.src = data_1.path + spritesheet.path;
                                                            }
                                                            catch (e) {
                                                                rej();
                                                            }
                                                        }));
                                                    };
                                                    for (_b = 0, spritesheets_1 = spritesheets; _b < spritesheets_1.length; _b++) {
                                                        spritesheet = spritesheets_1[_b];
                                                        _loop_2(spritesheet);
                                                    }
                                                }
                                                return [4, Promise.all(promises)];
                                            case 3:
                                                _c.sent();
                                                console.log("loaded all images!");
                                                if (lookup == null)
                                                    throw new Error("Celestial has no lookup property!");
                                                if (name_1 == null)
                                                    throw new Error("Celestial has no name property!");
                                                if (images == null && spritesheets == null)
                                                    throw new Error("No images/spritesheets were supplied.");
                                                this._container.appendChild(this._node);
                                                console.log(this._imagesLookup.FullList);
                                                return [4, this._moods.load()];
                                            case 4:
                                                _c.sent();
                                                return [4, this._logic.load()];
                                            case 5:
                                                _c.sent();
                                                this._node.querySelector(".graphics").ondragstart = function () { return false; };
                                                hueVariation = celestials.randomRange(-this.GlobalVariation * 10, this.GlobalVariation * 10);
                                                this._mainImage.style.filter = "hue-rotate(" + hueVariation + "deg)";
                                                if (!(this.Data.icon != null)) return [3, 7];
                                                return [4, new Promise(function (res, rej) {
                                                        var iconImg = document.createElement("img");
                                                        iconImg.onload = function () {
                                                            _this._icon = iconImg;
                                                            _this._icon.style.filter = _this._mainImage.style.filter;
                                                            res();
                                                        };
                                                        iconImg.onerror = function () { rej("Could not load icon on : " + _this.Name); };
                                                        iconImg.src = data_1.path + _this.Data.icon;
                                                    })];
                                            case 6:
                                                _c.sent();
                                                return [3, 8];
                                            case 7:
                                                this._icon = this.MainImage.cloneNode(false);
                                                _c.label = 8;
                                            case 8:
                                                this._overlayMenu = new celestials.ui.menus.CelestialOverlay(this);
                                                this._node.parentNode.appendChild(this._overlayMenu.Node);
                                                console.log("LOADED ALL OF : " + this.Name);
                                                this._size = (this.Height / celestials.App.Bounds.Height) * this._scale;
                                                resolve();
                                                this._isLoaded = true;
                                                this._sequencer.addSequenceCompleteListener(this._eventsRegistry.getValue("sequenceComplete"));
                                                this._sequencer.addStateChangeListener(this._eventsRegistry.getValue("stateChange"));
                                                this._sequencer.addStateCompleteListener(this._eventsRegistry.getValue("stateComplete"));
                                                this._physics.addWallHitListener(this._eventsRegistry.getValue("wallHit"));
                                                celestials.managers.MouseManager.listenForDrag(this.MainImage, function (x, y) {
                                                    celestials.managers.CelestialsManager.onGrab(_this, x, y);
                                                    _this._logic.startState(celestials.engines.CelestialSequencer.STATE.Hold);
                                                }, function (x, y) { return celestials.managers.CelestialsManager.onDrag(_this, x, y); }, function (x, y) {
                                                    celestials.managers.CelestialsManager.onDrop(_this, x, y);
                                                });
                                                celestials.managers.MouseManager.listenForRightClick(this.MainImage, function () { return celestials.ui.menus.CelestialContext.show(_this); });
                                                return [3, 10];
                                            case 9:
                                                e_1 = _c.sent();
                                                reject(new Error("Could not load Celestial. \n" + e_1));
                                                return [3, 10];
                                            case 10: return [2];
                                        }
                                    });
                                }); })];
                            case 1: return [2, _a.sent()];
                        }
                    });
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
                                this._spawnTick++;
                                if (this._spawnTick > celestials.managers.CelestialsManager.SpawnRate) {
                                    this.trySpawn();
                                }
                                return [4, this._logic.update()];
                            case 1:
                                _a.sent();
                                return [4, this._sequencer.update()];
                            case 2:
                                _a.sent();
                                return [4, this.drawCurrentFrame()];
                            case 3:
                                _a.sent();
                                return [4, this._physics.update()];
                            case 4:
                                _a.sent();
                                return [4, this._moods.update()];
                            case 5:
                                _a.sent();
                                this._interactBurnout--;
                                if (this._interactBurnout < 0)
                                    this._interactBurnout = 0;
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
                if (this._isSpawning)
                    this.endSpawn(this._sequencer.CurrentSequence.spawnChance);
                if (this._interactingWith != null) {
                    this.completeInteraction();
                }
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
            Object.defineProperty(Celestial.prototype, "Moods", {
                get: function () { return this._moods; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Relationships", {
                get: function () { return this._relationships; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Logic", {
                get: function () { return this._logic; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Icon", {
                get: function () { return this._icon; },
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
            Object.defineProperty(Celestial.prototype, "DateSpawned", {
                get: function () { return this._dateSpawned; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Scale", {
                get: function () { return this._scale; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Variation", {
                get: function () { return this._variation; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "GlobalVariation", {
                get: function () { return this.Data.variation || 0; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Size", {
                get: function () { return this._size * celestials.App.Bounds.Height; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Mass", {
                get: function () {
                    return this._size * this._physics.Gravity;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Age", {
                get: function () {
                    return (((new Date()).getTime() - this._dateSpawned.getTime()) / 1000 / 60 / 60);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "FavouriteSequence", {
                get: function () {
                    var sequence = null;
                    var name = "None";
                    for (var _i = 0, _a = Object.keys(celestials.engines.CelestialSequencer.STATE); _i < _a.length; _i++) {
                        var key = _a[_i];
                        var state = celestials.engines.CelestialSequencer.STATE[key];
                        var seq = this._sequencer.getStateByName(state);
                        if (seq != null) {
                            if (sequence == null) {
                                sequence = seq;
                                name = key;
                            }
                            else if (seq.attentionSpan > sequence.attentionSpan) {
                                var canBeFavourite = (seq.canBeFavourite == undefined) ? true : seq.canBeFavourite;
                                if (!canBeFavourite)
                                    continue;
                                sequence = seq;
                                name = key;
                            }
                        }
                    }
                    return name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "AvailableSequences", {
                get: function () {
                    var sequences = new Array();
                    for (var _i = 0, _a = Object.keys(celestials.engines.CelestialSequencer.STATE); _i < _a.length; _i++) {
                        var key = _a[_i];
                        var state = celestials.engines.CelestialSequencer.STATE[key];
                        var seq = this._sequencer.getStateByName(state);
                        if (seq != null) {
                            sequences.push(key);
                        }
                    }
                    return sequences;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "SpawnedBy", {
                get: function () { return this._spawnedBy; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "Descendants", {
                get: function () { return this._descendants; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Celestial.prototype, "InteractingWith", {
                get: function () { return this._interactingWith; },
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
                    this._index = -1;
                    this._template.classList.add("hide");
                    this._items = new Array();
                    this.clear();
                }
                List.prototype.createItem = function (itemNode, bubbleSelect) {
                    if (bubbleSelect === void 0) { bubbleSelect = true; }
                    var item = new Item(itemNode || this._template.cloneNode(true));
                    this.setupItem(item, bubbleSelect);
                    return item;
                };
                List.prototype.setupItem = function (item, bubbleSelect) {
                    var _this = this;
                    if (bubbleSelect === void 0) { bubbleSelect = true; }
                    item.Node.classList.remove("template", "hide");
                    if (bubbleSelect) {
                        item.Node.addEventListener("click", function () { return item.select(); });
                    }
                    item.addSelectListener(function (selected) {
                        console.log("LESITNING TO BUTTON");
                        var index = _this._items.indexOf(selected);
                        if (index != _this._index)
                            _this.deselectItem(_this._index);
                        _this._index = index;
                        if (_this._onSelectCallback != null)
                            _this._onSelectCallback(_this._index, item);
                    });
                };
                List.prototype.addItemToList = function (item) {
                    item.Node.classList.remove("hide");
                    this._items.push(item);
                    if (this._maxItems != -1)
                        if (this._items.length > this._maxItems)
                            this.removeItemAt(this._items.length - 1);
                    this._node.appendChild(item.Node);
                };
                List.prototype.removeItemAt = function (index, destroy) {
                    if (destroy === void 0) { destroy = true; }
                    var removedItem = this._items.splice(index, 1)[0];
                    removedItem.Node.remove();
                    if (destroy)
                        removedItem = null;
                };
                List.prototype.removeItem = function (item, destroy) {
                    if (destroy === void 0) { destroy = true; }
                    var index = this._items.indexOf(item);
                    if (index != -1)
                        this.removeItemAt(index);
                };
                List.prototype.addItemAt = function (item, index) {
                    if (index <= this._items.length - 1 && index >= 0) {
                        this._node.insertBefore(item.Node, this._items[index].Node);
                        if (this._items.indexOf(item) != -1)
                            this._items.splice(this._items.indexOf(item), 1);
                        this._items.splice(index, 0, item);
                    }
                    else {
                        this.addItemToList(item);
                    }
                };
                List.prototype.setItems = function (items) {
                    this._items = items;
                };
                List.prototype.clear = function () {
                    for (var i = this._items.length - 1; i >= 0; i--)
                        this.removeItemAt(i);
                    this._index = -1;
                };
                List.prototype.selectItem = function (index) {
                    if (index < this._items.length) {
                        this._index = index;
                        this._items[index].select();
                    }
                };
                List.prototype.deselectItem = function (index) {
                    if (index < this._items.length && index != -1) {
                        this._items[index].deselect();
                    }
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
                    this._node.classList.add("selected");
                    if (this._onSelectCallback != null)
                        this._onSelectCallback(this);
                };
                Item.prototype.deselect = function () {
                    this._node.classList.remove("selected");
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
                    console.log("AM I DISABLED?" + NotificationBar._instance._isDisabled);
                    if (NotificationBar._instance._isDisabled)
                        return;
                    NotificationBar._instance.show();
                };
                NotificationBar.enable = function () {
                    NotificationBar._instance.enable();
                };
                NotificationBar.disable = function () {
                    NotificationBar._instance.disable();
                    NotificationBar._instance.hide();
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
                    NotificationBar.show();
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
                    if (this._idleTimer != null)
                        return;
                    this._idleTimer = setTimeout(function () { return NotificationBar.show(); }, this._idleTime);
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
    var Queue = (function () {
        function Queue() {
            this._list = new Array();
        }
        Queue.prototype.enqueue = function (item) {
            this._list.push(item);
        };
        Queue.prototype.dequeue = function () {
            return this._list.splice(0, 1)[0];
        };
        Queue.prototype.clear = function () {
            this._list = new Array();
        };
        Object.defineProperty(Queue.prototype, "List", {
            get: function () { return this._list; },
            enumerable: true,
            configurable: true
        });
        return Queue;
    }());
    celestials.Queue = Queue;
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
                this._changeRegistry = new Array();
                this._spawnRate = CelestialsManager.DEF_SPAWNRATE;
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
                                if (!CelestialsManager._lookup.containsKey("solaris")) return [3, 6];
                                return [4, CelestialsManager.addCelestialByLookup("solaris")];
                            case 5:
                                _a.sent();
                                _a.label = 6;
                            case 6:
                                managers.MouseManager.listenForMouseOut(celestials.App.Node, function (x, y) { return managers.MouseManager.simluateMouseUp(celestials.App.Node); });
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
            CelestialsManager.getTemplateByLookup = function (lookup) {
                if (CelestialsManager._lookup.containsKey(lookup))
                    return CelestialsManager._lookup.getValue(lookup);
                return null;
            };
            CelestialsManager.addCelestial = function (celestial, addedByLineage) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                addedByLineage = addedByLineage || false;
                                return [4, new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (celestial.Data.maxSpawns != null) {
                                                        if (CelestialsManager.countCelestialsOfType(celestial.Lookup) + 1 > celestial.Data.maxSpawns) {
                                                            if (!addedByLineage)
                                                                celestials.systems.Notifications.addNotification("Max spawns reached for " + celestial.Name + ".", celestials.systems.Notifications.TYPE.Fail);
                                                            res(null);
                                                        }
                                                    }
                                                    return [4, celestial.load()
                                                            .then(function () {
                                                            console.log("CREATED COPY");
                                                            CelestialsManager._instance._celestials.push(celestial);
                                                            CelestialsManager.callChangeRegistry({ add: celestial });
                                                            celestials.systems.Collision.addToCollisionSystem(celestial, function (cel) {
                                                                celestial.askToInteractWith(cel);
                                                            });
                                                            res(celestial);
                                                        })];
                                                case 1:
                                                    _a.sent();
                                                    return [2];
                                            }
                                        });
                                    }); })];
                            case 1: return [2, _a.sent()];
                        }
                    });
                });
            };
            CelestialsManager.addCelestialByLookup = function (lookup, addedByLineage) {
                return __awaiter(this, void 0, void 0, function () {
                    var celestial, copy;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                addedByLineage = addedByLineage || false;
                                celestial = CelestialsManager._lookup.getValue(lookup);
                                if (!(celestial != null)) return [3, 3];
                                return [4, celestial.clone()];
                            case 1:
                                copy = _a.sent();
                                return [4, this.addCelestial(copy, addedByLineage)];
                            case 2: return [2, _a.sent()];
                            case 3: return [2, null];
                        }
                    });
                });
            };
            CelestialsManager.addCelestialByLookupAtPosition = function (lookup, x, y, addedByLineage) {
                return __awaiter(this, void 0, void 0, function () {
                    var celestial;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, CelestialsManager.addCelestialByLookup(lookup, addedByLineage)];
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
            CelestialsManager.countCelestialsOfType = function (lookup) {
                var count = 0;
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    if (cel.Lookup == lookup)
                        count++;
                }
                return count;
            };
            CelestialsManager.removeCelestial = function (celestial, callChangeRegistry) {
                if (callChangeRegistry === void 0) { callChangeRegistry = true; }
                var index = CelestialsManager._instance._celestials.indexOf(celestial);
                if (index != -1) {
                    var cel = CelestialsManager._instance._celestials.splice(index, 1)[0];
                    if (callChangeRegistry)
                        CelestialsManager.callChangeRegistry({ delete: cel });
                    if (celestials.ui.menus.CelestialDetails.isShowing)
                        if (celestials.ui.menus.CelestialDetails.CurrentCelestial == cel)
                            celestials.ui.menus.CelestialDetails.hide();
                    cel.remove();
                }
            };
            CelestialsManager.removeAllCelestials = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var celestial = _a[_i];
                    this.removeCelestial(celestial, false);
                }
                CelestialsManager.callChangeRegistry(null);
            };
            CelestialsManager.update = function () {
                var instance = CelestialsManager._instance;
                for (var _i = 0, _a = instance._celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    if (cel.IsLoaded) {
                        cel.update();
                    }
                }
            };
            CelestialsManager.callChangeCelestial = function (celestial) {
                CelestialsManager.callChangeRegistry({ change: celestial });
            };
            CelestialsManager.callChangeRegistry = function (change) {
                for (var _i = 0, _a = CelestialsManager._instance._changeRegistry; _i < _a.length; _i++) {
                    var func = _a[_i];
                    func(change);
                }
            };
            CelestialsManager.listenForCelestialChanges = function (func) {
                CelestialsManager._instance._changeRegistry.push(func);
            };
            CelestialsManager.removeListenForCelestialChanges = function (func) {
                var index = CelestialsManager._instance._changeRegistry.indexOf(func);
                if (index != -1)
                    CelestialsManager._instance._changeRegistry.splice(index, 1);
            };
            CelestialsManager.onGrab = function (cel, x, y) {
                console.log("GRABBED");
                cel.Node.style.zIndex = '100';
                cel.takeControl();
                cel.Physics.zeroVelocity();
            };
            CelestialsManager.onDrag = function (cel, x, y) {
                x = x;
                y += (cel.Height * cel.RegistrationPoint.y);
                cel.X = x;
                cel.Y = y;
            };
            CelestialsManager.onDrop = function (cel, x, y) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, lastX, lastY, flingX, flingY;
                    return __generator(this, function (_b) {
                        console.log("DROPPED");
                        cel.releaseControl();
                        cel.Physics.resetGravity();
                        cel.Node.style.zIndex = "" + (cel.Data.zIndex || 1);
                        _a = managers.MouseManager.LastMousePosition, lastX = _a.x, lastY = _a.y;
                        flingX = ((x - lastX) / celestials.App.Bounds.Width) * celestials.App.Bounds.Width;
                        flingY = ((y - lastY) / celestials.App.Bounds.Height) * celestials.App.Bounds.Height;
                        cel.Physics.zeroVelocity();
                        cel.Physics.addForceX(flingX * 1.2);
                        cel.Physics.addForceY(flingY);
                        console.log("FLING: ", flingX, flingY);
                        console.log(cel.Physics.Velocity);
                        if (flingX != 0) {
                            if (flingX > 0)
                                cel.setDirectionX(1);
                            else
                                cel.setDirectionX(-1);
                        }
                        return [2];
                    });
                });
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
            Object.defineProperty(CelestialsManager, "SpawnRate", {
                get: function () { return CelestialsManager._instance._spawnRate; },
                enumerable: true,
                configurable: true
            });
            CelestialsManager.DEF_SPAWNRATE = 200;
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
                var currentCelestialsPanelKey = [celestials.Key.Code.comma];
                InputManager.addBinding("debug__openCurrentCelestialsPanel", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._openCurrentCelestialsPanel.bind(this), celestials.KeyBinding.State.Down].concat(currentCelestialsPanelKey)))());
                var notificationPanelKey = [celestials.Key.Code.j];
                InputManager.addBinding("debug__showNotificationPanel", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._openNotificationPanel.bind(this), celestials.KeyBinding.State.Down].concat(notificationPanelKey)))());
                var addNotificationKey = [celestials.Key.Code.n];
                InputManager.addBinding("debug__addNotification", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._addNotification.bind(this), celestials.KeyBinding.State.Down].concat(addNotificationKey)))());
                var deleteLastCelestialKey = [celestials.Key.Code["numpad 0"]];
                InputManager.addBinding("debug__deleteLastCelestial", new (celestials.KeyBinding.bind.apply(celestials.KeyBinding, [void 0, this._deleteLastCelestial.bind(this), celestials.KeyBinding.State.Down].concat(deleteLastCelestialKey)))());
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
                    cel.takeControl();
                }
                setTimeout(function () {
                    for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                        var cel = _a[_i];
                        cel.releaseControl();
                        cel.Logic.updateState();
                    }
                }, 100);
            };
            Debugger.prototype._sendRight = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    cel.Physics.addForceX(100);
                    cel.takeControl();
                }
                setTimeout(function () {
                    for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                        var cel = _a[_i];
                        cel.releaseControl();
                        cel.Logic.updateState();
                    }
                }, 100);
            };
            Debugger.prototype._sendUp = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    cel.Physics.addForceY(-200);
                    cel.takeControl();
                }
                setTimeout(function () {
                    for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                        var cel = _a[_i];
                        cel.releaseControl();
                        cel.Logic.updateState();
                    }
                }, 100);
            };
            Debugger.prototype._sendDown = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    cel.Physics.addForceY(200);
                    cel.takeControl();
                }
                setTimeout(function () {
                    for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                        var cel = _a[_i];
                        cel.releaseControl();
                        cel.Logic.updateState();
                    }
                }, 100);
            };
            Debugger.prototype._snapToTop = function () {
                for (var _i = 0, _a = CelestialsManager.Celestials; _i < _a.length; _i++) {
                    var cel = _a[_i];
                    cel.Physics.snapToTop();
                }
            };
            Debugger.prototype._spawnCelestial = function () {
                CelestialsManager.addCelestialByLookup("solaris");
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
                    celestial.Sequencer.changeState(celestials.engines.CelestialSequencer.STATE.Walk);
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
            Debugger.prototype._openCurrentCelestialsPanel = function () {
                celestials.ui.menus.CurrentCelestialsPanel.show();
            };
            Debugger.prototype._openNotificationPanel = function () {
                celestials.ui.menus.NotificationPanel.show();
            };
            Debugger.prototype._addNotification = function () {
                systems.Notifications.addNotification("This is a test notification!");
            };
            Debugger.prototype._deleteLastCelestial = function () {
                celestials.managers.CelestialsManager.removeCelestial(celestials.managers.CelestialsManager.Celestials[celestials.managers.CelestialsManager.Celestials.length - 1]);
            };
            return Debugger;
        }());
        systems.Debugger = Debugger;
    })(systems = celestials.systems || (celestials.systems = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var systems;
    (function (systems) {
        var Collision = (function () {
            function Collision() {
                Collision._instance = this;
                this._objects = new Array();
                this._usesCollision = true;
                this._showCollisionBounds = true;
            }
            Collision.addToCollisionSystem = function (entity, collisionCallback) {
                var rect = entity.Bounds;
                var visual = document.createElement("div");
                visual.classList.add("collision");
                celestials.App.Node.appendChild(visual);
                Collision._instance._objects.push({ entity: entity, rect: rect, visual: visual, collisionCallback: collisionCallback, isOverlapping: false });
            };
            Collision.hasOverlap = function (a, b) {
                var onLeft = a.rect.Right < b.rect.Left;
                var onRight = a.rect.Left > b.rect.Right;
                var onTop = a.rect.Top > b.rect.Bottom;
                var onBottom = a.rect.Bottom < b.rect.Top;
                return !(onLeft || onRight || onTop || onBottom);
            };
            Collision.showCollisionBounds = function (show) {
                Collision._instance._showCollisionBounds = show;
                for (var _i = 0, _a = Collision._instance._objects; _i < _a.length; _i++) {
                    var obj = _a[_i];
                    if (show)
                        obj.visual.classList.remove("hide");
                    else
                        obj.visual.classList.add("hide");
                }
            };
            Collision.prototype.load = function () {
            };
            Collision.prototype.unload = function () {
            };
            Collision.update = function () {
                if (!Collision._instance._usesCollision)
                    return;
                var colSize = Collision.COLLISION_SIZE;
                for (var _i = 0, _a = Collision._instance._objects; _i < _a.length; _i++) {
                    var obj = _a[_i];
                    var bounds = obj.entity.MainImage.getBoundingClientRect();
                    obj.rect = new celestials.Rect(bounds.left - colSize, bounds.top - colSize, bounds.width + (colSize * 2), bounds.height + (colSize * 2));
                    if (Collision._instance._showCollisionBounds) {
                        obj.visual.style.left = obj.rect.X + "px";
                        obj.visual.style.top = obj.rect.Y + "px";
                        obj.visual.style.width = obj.rect.Width + "px";
                        obj.visual.style.height = obj.rect.Height + "px";
                    }
                }
                for (var _b = 0, _c = Collision._instance._objects; _b < _c.length; _b++) {
                    var obj = _c[_b];
                    var isOverlapping = false;
                    for (var _d = 0, _e = Collision._instance._objects; _d < _e.length; _d++) {
                        var compObj = _e[_d];
                        if (this.hasOverlap(obj, compObj)) {
                            if (obj == compObj)
                                continue;
                            isOverlapping = true;
                            if (!obj.isOverlapping) {
                                console.log("WE ARE OVERLAPPING: " + obj.entity.Name + ", " + compObj.entity.Name);
                                if (obj.collisionCallback != null) {
                                    obj.collisionCallback(compObj.entity);
                                }
                            }
                        }
                    }
                    obj.isOverlapping = isOverlapping;
                }
            };
            Collision.COLLISION_SIZE = 50;
            return Collision;
        }());
        systems.Collision = Collision;
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
                MouseManager._registry = {
                    mousedown: new celestials.Dictionary(),
                    mouseup: new celestials.Dictionary(),
                    mouseout: new celestials.Dictionary(),
                    mouseover: new celestials.Dictionary(),
                    rightclick: new celestials.Dictionary(),
                    drag: new celestials.Dictionary()
                };
                celestials.App.Node.addEventListener("mousedown", this._onMouseDown.bind(this));
                celestials.App.Node.addEventListener("contextmenu", this._onRightClick.bind(this));
                celestials.App.Node.addEventListener("mousemove", this._onMouseMove.bind(this));
                celestials.App.Node.addEventListener("mouseup", this._onMouseUp.bind(this));
                celestials.App.Node.addEventListener("mouseenter", this._onMouseOver.bind(this));
                celestials.App.Node.addEventListener("mouseleave", this._onMouseOut.bind(this));
            }
            MouseManager.listenForMouseDown = function (node, callback) {
                MouseManager._registry.mousedown.add(node, callback);
            };
            MouseManager.listenForMouseUp = function (node, callback) {
                MouseManager._registry.mouseup.add(node, callback);
            };
            MouseManager.listenForMouseOver = function (node, callback) {
                MouseManager._registry.mouseover.add(node, callback);
            };
            MouseManager.listenForMouseOut = function (node, callback) {
                MouseManager._registry.mouseout.add(node, callback);
            };
            MouseManager.listenForRightClick = function (node, callback) {
                MouseManager._registry.rightclick.add(node, callback);
            };
            MouseManager.listenForDrag = function (node, grabCallback, dragCallback, dropCallback) {
                MouseManager._registry.drag.add(node, { grabCallback: grabCallback, dragCallback: dragCallback, dropCallback: dropCallback });
            };
            MouseManager.startDrag = function (node) {
                MouseManager._activeElement = node;
            };
            MouseManager.simluateMouseDown = function (node, x, y) {
                var mouseEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    clientX: x || MouseManager.MousePosition.x,
                    clientY: y || MouseManager.MousePosition.y
                });
                node.dispatchEvent(mouseEvent);
            };
            MouseManager.simluateMouseUp = function (node, x, y) {
                var mouseEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    clientX: x || MouseManager.MousePosition.x,
                    clientY: y || MouseManager.MousePosition.y
                });
                node.dispatchEvent(mouseEvent);
            };
            MouseManager.prototype._onMouseDown = function (e) {
                if (e.button != 0)
                    return;
                var target = e.target.closest("[data-clickable]");
                if (target == null)
                    return;
                console.log(target);
                var _a = MouseManager._registry, mousedown = _a.mousedown, drag = _a.drag;
                if (drag.containsKey(target)) {
                    var grabCallback = drag.getValue(target).grabCallback;
                    if (grabCallback != null)
                        grabCallback(e.clientX, e.clientY);
                    MouseManager._activeElement = target;
                    return;
                }
                if (mousedown.containsKey(target))
                    mousedown.getValue(target)();
            };
            MouseManager.prototype._onRightClick = function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var target = e.target.closest("[data-clickable]");
                if (target == null)
                    return;
                var rightclick = MouseManager._registry.rightclick;
                if (rightclick.containsKey(target))
                    rightclick.getValue(target)(e.clientX, e.clientY);
            };
            MouseManager.prototype._onMouseMove = function (e) {
                MouseManager._lastMousePosition = MouseManager._mousePosition;
                MouseManager._mousePosition = { x: e.clientX, y: e.clientY };
                var drag = MouseManager._registry.drag;
                if (MouseManager._activeElement != null) {
                    if (drag.containsKey(MouseManager._activeElement)) {
                        var dragCallback = drag.getValue(MouseManager._activeElement).dragCallback;
                        if (dragCallback != null)
                            dragCallback(e.clientX, e.clientY);
                    }
                }
            };
            MouseManager.prototype._onMouseUp = function (e) {
                var target = e.target.closest("[data-clickable]");
                if (target == null)
                    return;
                var _a = MouseManager._registry, mouseup = _a.mouseup, drag = _a.drag;
                if (MouseManager._activeElement != null) {
                    if (drag.containsKey(MouseManager._activeElement)) {
                        var dropCallback = drag.getValue(MouseManager._activeElement).dropCallback;
                        if (dropCallback != null)
                            dropCallback(e.clientX, e.clientY);
                        MouseManager._activeElement = null;
                        return;
                    }
                }
                if (mouseup.containsKey(target))
                    mouseup.getValue(target)(e.clientX, e.clientY);
            };
            MouseManager.prototype._onMouseOver = function (e) {
                var target = e.target.closest("[data-clickable]");
                if (target == null)
                    return;
                var mouseover = MouseManager._registry.mouseover;
                if (mouseover.containsKey(target))
                    mouseover.getValue(target)(e.clientX, e.clientY);
            };
            MouseManager.prototype._onMouseOut = function (e) {
                var target = e.target.closest("[data-clickable]");
                if (target == null)
                    return;
                var mouseout = MouseManager._registry.mouseout;
                if (mouseout.containsKey(target))
                    mouseout.getValue(target)(e.clientX, e.clientY);
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
            Object.defineProperty(MouseManager, "Registry", {
                get: function () { return MouseManager._registry; },
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
    var managers;
    (function (managers) {
        var remote = require("electron").remote;
        var ipcRenderer = require("electron").ipcRenderer;
        var RemoteManager = (function () {
            function RemoteManager() {
                RemoteManager._instance = this;
                this._remote = remote.getCurrentWindow();
                if (this._remote.data != null) {
                    this._files = this._remote.data.files;
                }
                ipcRenderer.on('showControlPanel', this._onShowControlPanel.bind(this));
            }
            RemoteManager.prototype._onShowControlPanel = function () {
                console.log("SHOW THE CONTROL PANEL PLEASE");
                celestials.ui.menus.ControlPanel.show();
            };
            Object.defineProperty(RemoteManager, "Files", {
                get: function () { return RemoteManager._instance._files; },
                enumerable: true,
                configurable: true
            });
            return RemoteManager;
        }());
        managers.RemoteManager = RemoteManager;
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
                        var state = celestials.engines.CelestialSequencer.STATE[indentData];
                        var sequences = celestial.Sequencer.getStateSequences(state);
                        if (sequences == null)
                            return "continue";
                        statesDrop.createIndent();
                        var _loop_5 = function (seq) {
                            this_1._createIndentItem(statesDrop, seq.name, function () {
                                celestial.Sequencer.changeState(state);
                                celestial.Sequencer.changeSequence(celestial.Sequencer.getSequenceByName(seq.name));
                                console.log("SEQUENCE: " + seq.name);
                                if (celestial.Sequencer.CurrentState == celestials.engines.CelestialSequencer.STATE.Spawn)
                                    celestial.spawn();
                            });
                        };
                        for (var _i = 0, sequences_1 = sequences; _i < sequences_1.length; _i++) {
                            var seq = sequences_1[_i];
                            _loop_5(seq);
                        }
                        statesDrop.addLastIndent(indentData);
                    };
                    var this_1 = this;
                    for (var _i = 0, _a = Object.keys(celestials.engines.CelestialSequencer.STATE); _i < _a.length; _i++) {
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
                    this._createIndentItem(actionsDrop, "Copy", function () { celestials.managers.CelestialsManager.addCelestialByLookup(celestial.Lookup); });
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
            var ApplicationContext = (function (_super) {
                __extends(ApplicationContext, _super);
                function ApplicationContext(node) {
                    var _this = _super.call(this, node) || this;
                    ApplicationContext._instance = _this;
                    var ctx = document.querySelector(".context-menu.application");
                    var celestialsNode = ctx.querySelector(".celestials");
                    ApplicationContext._celestialsDropdown = new ui.components.MultiDropdown(celestialsNode.querySelector(".ctx-dropdown.template"), celestialsNode.querySelector(".ctx-item.template"), celestialsNode.querySelector(".ctx-dropdown-header.template"), celestialsNode.querySelector(".ctx-dropdown-2.template"), celestialsNode.querySelector(".ctx-dropdown-2 .ctx-item.template"));
                    var actionsNode = ctx.querySelector(".actions");
                    ApplicationContext._actionsDropdown = new ui.components.MultiDropdown(actionsNode.querySelector(".ctx-dropdown.template"), actionsNode.querySelector(".ctx-item.template"), actionsNode.querySelector(".ctx-dropdown-header.template"), actionsNode.querySelector(".ctx-dropdown-2.template"), actionsNode.querySelector(".ctx-dropdown-2 .ctx-item.template"));
                    ApplicationContext._eventsRegistry = new celestials.Dictionary();
                    celestials.managers.MouseManager.listenForRightClick(celestials.App.Node, function (x, y) { return ApplicationContext.showAt(x, y); });
                    celestials.managers.MouseManager.listenForMouseDown(celestials.App.Node, function () { return ApplicationContext.hide(); });
                    ApplicationContext.hide();
                    return _this;
                }
                ApplicationContext.show = function () {
                    ApplicationContext._instance.show();
                    var celestialsDrop = ApplicationContext._celestialsDropdown;
                    celestialsDrop.clear();
                    celestialsDrop.createIndent();
                    var _loop_6 = function (celestial) {
                        this_2._createIndentItem(celestialsDrop, celestial.Lookup, function () {
                            celestials.managers.CelestialsManager.addCelestialByLookup(celestial.Lookup);
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
                    ApplicationContext._instance.hide();
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
                ApplicationContext.showAt = function (x, y) {
                    ApplicationContext._instance._node.style.left = x + "px";
                    ApplicationContext._instance._node.style.top = y + "px";
                    ApplicationContext.show();
                };
                Object.defineProperty(ApplicationContext, "StatesDropdown", {
                    get: function () { return ApplicationContext._celestialsDropdown; },
                    enumerable: true,
                    configurable: true
                });
                return ApplicationContext;
            }(ui.Menu));
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
                    var useMoods = new ui.components.ToggleGroup(this._node.querySelector("[data-checkbox='use-moods']"), null, this._onUseMoods.bind(this));
                    var allowNotifications = new ui.components.ToggleGroup(this._node.querySelector("[data-checkbox=allow-notifications"), null, this._onAllowNotifications.bind(this));
                    var developerMode = new ui.components.ToggleGroup(this._node.querySelector("[data-checkbox=dev-mode]"), this._node.querySelector("[data-checkbox-collapse=dev-mode]"), this._onDevMode.bind(this));
                    var showOverlays = new ui.components.ToggleGroup(this._node.querySelector("[data-checkbox='show-overlays']"), null, this._onShowOverlays.bind(this));
                    this._node.querySelector("[data-button='show-notifications']").addEventListener("click", this._onShowNotifications.bind(this));
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
                    if (checked) {
                        ui.menus.NotificationBar.enable();
                        celestials.systems.Notifications.addNotification("Turned on notifications!", celestials.systems.Notifications.TYPE.Notify, null, function () { return ControlPanel.show(); });
                    }
                    else {
                        ui.menus.NotificationBar.disable();
                    }
                };
                ControlPanel.prototype._onUseMoods = function (checked) {
                    celestials.App.UsesMood = checked;
                    if (checked)
                        menus.CelestialDetails.showMood();
                    else
                        menus.CelestialDetails.hideMood();
                };
                ControlPanel.prototype._onDevMode = function (checked) {
                    console.log("DEV MODE: " + checked);
                };
                ControlPanel.prototype._onShowNotifications = function () {
                    ui.menus.NotificationPanel.show();
                };
                ControlPanel.prototype._onShowOverlays = function (checked) {
                    celestials.systems.Collision.showCollisionBounds(checked);
                    for (var _i = 0, _a = celestials.managers.CelestialsManager.Celestials; _i < _a.length; _i++) {
                        var cel = _a[_i];
                        cel.showRegistrationPoint(checked);
                    }
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
                Tooltip.lookForTooltips = function (node) {
                    var divs = node.querySelectorAll("*");
                    for (var i = 0; i < divs.length; i++) {
                        var div = divs[i];
                        if (div != null) {
                            if (div.dataset.tooltip != null)
                                Tooltip.addTooltip(div, div.dataset.tooltip);
                        }
                    }
                };
                Tooltip.addTooltip = function (tooltip, text) {
                    if (Tooltip._instance._tooltips.indexOf(tooltip) - -1)
                        return;
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
                Tooltip.showTooltipOnElement = function (text, element, duration, useDelay) {
                    if (duration === void 0) { duration = Tooltip.DEF_DURATION; }
                    if (useDelay === void 0) { useDelay = true; }
                    Tooltip.showTooltip(text, element.offsetLeft, element.offsetTop, duration);
                };
                Tooltip.showTooltip = function (text, x, y, duration) {
                    if (duration === void 0) { duration = Tooltip.DEF_DURATION; }
                    Tooltip._instance._node.innerHTML = text;
                    Tooltip._instance.show();
                    x = x || celestials.App.MousePosition.x;
                    y = y || celestials.App.MousePosition.y;
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
                Tooltip.getMessageDuration = function (message) {
                    return message.length * 0.07 * 1000;
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
                        return Tooltip.showTooltip(element.dataset.tooltip, celestials.App.MousePosition.x, celestials.App.MousePosition.y, Tooltip.getMessageDuration(element.dataset.tooltip));
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
                                        var locked, item, message_1;
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
                                                    message_1 = 'This celestial is currently locked.  Be patient!';
                                                    celestials_1.managers.MouseManager.listenForMouseDown(item.Node, function (x, y) { return menus.Tooltip.showTooltip(message_1, x, y, menus.Tooltip.getMessageDuration(message_1)); });
                                                    menus.Tooltip.addTooltip(item.Node, message_1);
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
                                    return [4, celestials_1.managers.CelestialsManager.addCelestialByLookupAtPosition(template, x, y)];
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
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var CurrentCelestialsPanel = (function (_super) {
                __extends(CurrentCelestialsPanel, _super);
                function CurrentCelestialsPanel(node) {
                    var _this = _super.call(this, node, null) || this;
                    var CCP = CurrentCelestialsPanel;
                    CCP._instance = _this;
                    CCP._instance._itemTemplate = _this._node.querySelector(".item.celestial");
                    _this._node.querySelector(".ui.close").addEventListener("click", function () { return CCP.hide(); });
                    CCP._instance._itemList = new ui.components.List(_this._node.querySelector(".list"), _this._node.querySelector(".item.celestial"));
                    CCP._instance._itemList.addSelectListener(function (index, item) { return CCP._onSelectItem(item); });
                    var sortRadios = _this._node.querySelectorAll("input[name='sort']");
                    var _loop_8 = function (i) {
                        sortRadios[i].addEventListener("change", function () { return CCP._onRadioSelect(sortRadios[i].value); });
                    };
                    for (var i = 0; i < sortRadios.length; i++) {
                        _loop_8(i);
                    }
                    CCP._instance._itemList.clear();
                    for (var _i = 0, _a = celestials.managers.CelestialsManager.Celestials; _i < _a.length; _i++) {
                        var cel = _a[_i];
                        var item = CCP.createItem(cel);
                        CCP._instance._itemList.addItemToList(item);
                    }
                    CCP.changeSortType('name');
                    celestials.managers.CelestialsManager.listenForCelestialChanges(function (change) { return CCP._onCelestialChange(change); });
                    CurrentCelestialsPanel.hide();
                    return _this;
                }
                CurrentCelestialsPanel.show = function () {
                    var CCP = CurrentCelestialsPanel;
                    CCP._instance.show();
                    CCP.sortItems();
                };
                CurrentCelestialsPanel.hide = function () {
                    var CCP = CurrentCelestialsPanel;
                    CCP._instance.hide();
                    if (CCP._instance._selectedItem != null) {
                        CCP._instance._selectedItem.deselect();
                        CCP._instance._selectedItem = null;
                    }
                };
                CurrentCelestialsPanel.selectCelestial = function (celestial) {
                    var CCP = CurrentCelestialsPanel;
                    var item = CCP.findItemByCelestial(celestial);
                    if (item == null)
                        return;
                    CCP._instance._itemList.selectItem(CCP._instance._itemList.Items.indexOf(item));
                    item.Node.scrollIntoView();
                };
                CurrentCelestialsPanel.createItem = function (celestial) {
                    var CCP = CurrentCelestialsPanel;
                    var item = new menus.CurrentCelestialsItem(CCP._instance._itemTemplate.cloneNode(true), celestial, function (item) { return CCP._onChangeItem(item); }, function (item) { return CCP._onRemoveItem(item); }, function (item) { return CCP._onUpdateItem(item); });
                    CCP._instance._itemList.setupItem(item);
                    return item;
                };
                CurrentCelestialsPanel.changeSortType = function (value) {
                    var CCP = CurrentCelestialsPanel;
                    CCP._instance._sortType = value;
                    console.log("CHANGED TO: " + value);
                    CCP.sortItems();
                    if (CCP._instance._selectedItem != null)
                        CCP._instance._selectedItem.Node.scrollIntoView();
                };
                CurrentCelestialsPanel.findItemByCelestial = function (celestial) {
                    var CCP = CurrentCelestialsPanel;
                    for (var _i = 0, _a = CCP._instance._itemList.Items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.Celestial == celestial)
                            return item;
                    }
                    return null;
                };
                CurrentCelestialsPanel.sortItem = function (item) {
                    var CCP = CurrentCelestialsPanel;
                    CCP._instance._itemList.removeItem(item, false);
                    var index = CCP.getSortIndex(item);
                    CCP._instance._itemList.addItemAt(item, index);
                };
                CurrentCelestialsPanel.getSortIndex = function (item) {
                    var CCP = CurrentCelestialsPanel;
                    var items = CCP._instance._itemList.Items.map(function (item) { return item; });
                    var index = -1;
                    var sortType = CurrentCelestialsPanel._instance._sortType;
                    for (var i = 0; i < items.length; i++) {
                        index++;
                        var compareCel = items[i].Celestial;
                        if (compareCel == item.Celestial)
                            continue;
                        if (sortType == 'name')
                            if (item.Celestial.Name.localeCompare(compareCel.Name) < 0)
                                return index;
                        if (sortType == 'type') {
                            if (item.Celestial.Lookup.localeCompare(compareCel.Lookup) < 0)
                                return index;
                            if (item.Celestial.Name.localeCompare(compareCel.Name) < 0)
                                return index;
                        }
                        if (sortType == 'date')
                            if (item.Celestial.DateSpawned.getTime() > compareCel.DateSpawned.getTime())
                                return index;
                    }
                    return index += 1;
                };
                CurrentCelestialsPanel.sortItems = function () {
                    var CCP = CurrentCelestialsPanel;
                    console.log(CCP._instance._itemList.Items.length);
                    var items = CCP._instance._itemList.Items.map(function (item) { return item; });
                    console.log(items);
                    switch (CCP._instance._sortType) {
                        case 'name':
                            items = items.sort(function (a, b) {
                                return a.Celestial.Name.localeCompare(b.Celestial.Name);
                            });
                            break;
                        case 'type':
                            items = items.sort(function (a, b) {
                                return a.Celestial.Lookup.localeCompare(b.Celestial.Lookup);
                            });
                            break;
                        case 'date':
                            items = items.sort(function (a, b) {
                                if (a.Celestial.DateSpawned.getTime() > b.Celestial.DateSpawned.getTime())
                                    return -1;
                                else if (a.Celestial.DateSpawned.getTime() < b.Celestial.DateSpawned.getTime())
                                    return 1;
                                return 0;
                            });
                            break;
                    }
                    CCP._instance._itemList.clear();
                    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                        var item = items_1[_i];
                        CCP._instance._itemList.addItemToList(item);
                    }
                    CCP._instance._itemList.setItems(items);
                };
                CurrentCelestialsPanel._onSelectItem = function (item) {
                    var CCP = CurrentCelestialsPanel;
                    if (CCP._instance._selectedItem == item)
                        return;
                    if (CCP._instance._selectedItem != null)
                        CCP._instance._selectedItem.deselect();
                    CCP._instance._selectedItem = item;
                    if (menus.CelestialDetails.isShowing)
                        menus.CelestialDetails.show(CCP._instance._selectedItem.Celestial);
                };
                CurrentCelestialsPanel._onRadioSelect = function (value) {
                    var CCP = CurrentCelestialsPanel;
                    CCP.changeSortType(value);
                };
                CurrentCelestialsPanel._onChangeItem = function (item) {
                    var CCP = CurrentCelestialsPanel;
                    CCP.sortItem(item);
                };
                CurrentCelestialsPanel._onRemoveItem = function (item) {
                    var CCP = CurrentCelestialsPanel;
                    celestials.managers.CelestialsManager.removeCelestial(item.Celestial);
                };
                CurrentCelestialsPanel._onUpdateItem = function (item) {
                    var CCP = CurrentCelestialsPanel;
                    CCP.sortItem(item);
                };
                CurrentCelestialsPanel._onCelestialChange = function (change) {
                    var CCP = CurrentCelestialsPanel;
                    if (change == null)
                        return;
                    if (change.delete != null) {
                        var item = this.findItemByCelestial(change.delete);
                        if (item != null)
                            CCP._instance._itemList.removeItem(item, false);
                    }
                    if (change.add != null) {
                        var item = CCP.createItem(change.add);
                        CCP.sortItem(item);
                    }
                };
                return CurrentCelestialsPanel;
            }(menus.OverlayMenu));
            menus.CurrentCelestialsPanel = CurrentCelestialsPanel;
            ;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var CelestialDetails = (function (_super) {
                __extends(CelestialDetails, _super);
                function CelestialDetails(node) {
                    var _this = _super.call(this, node, null) || this;
                    CelestialDetails._instance = _this;
                    _this._node.querySelector(".ui.close").addEventListener("click", function () { return CelestialDetails.hide(); });
                    _this._node.querySelector(".ui.view").addEventListener("click", function () { return _this._onShowInView(); });
                    _this._staticElements = {
                        lookup: _this._node.querySelector("[data-detail='lookup']"),
                        dateSpawned: _this._node.querySelector("[data-detail='date-spawned']"),
                        rarity: _this._node.querySelector("[data-detail='rarity']"),
                        favouriteAction: _this._node.querySelector("[data-detail='favourite-action']"),
                        availableActions: _this._node.querySelector("[data-detail='available-actions']"),
                        spawnedBy: _this._node.querySelector("[data-detail='spawned-by']"),
                        attentionSpan: _this._node.querySelector("[data-detail='attention-span']"),
                    };
                    _this._activeElements = {
                        name: _this._node.querySelector("[data-detail='name']"),
                        age: _this._node.querySelector("[data-detail='age']"),
                        size: _this._node.querySelector("[data-detail='size']"),
                        mass: _this._node.querySelector("[data-detail='mass']"),
                        currentAction: _this._node.querySelector("[data-detail='current-action']"),
                        descendants: _this._node.querySelector("[data-detail='descendants']"),
                        friends: _this._node.querySelector("[data-detail='friends']"),
                        enemies: _this._node.querySelector("[data-detail='enemies']"),
                        socialNeeds: _this._node.querySelector("[data-detail='social-need']"),
                        hungerNeeds: _this._node.querySelector("[data-detail='hunger-need']"),
                        restNeeds: _this._node.querySelector("[data-detail='rest-need']"),
                        screenshot: _this._node.querySelector("[data-detail='screenshot'")
                    };
                    _this._moodToggle = {
                        disable: _this._node.querySelector(".mood .disabled"),
                        enable: _this._node.querySelector(".mood .enabled")
                    };
                    CelestialDetails.hide();
                    CelestialDetails.hideMood();
                    return _this;
                }
                CelestialDetails.show = function (celestial) {
                    return __awaiter(this, void 0, void 0, function () {
                        var instance, dateSpawned, span;
                        return __generator(this, function (_a) {
                            CelestialDetails._instance.show();
                            instance = CelestialDetails._instance;
                            instance._celestial = celestial;
                            instance._staticElements.lookup.innerHTML = celestial.Lookup;
                            dateSpawned = celestial.DateSpawned;
                            instance._staticElements.dateSpawned.innerHTML = dateSpawned.getMonth() + 1 + "/" + dateSpawned.getDate() + "/" + dateSpawned.getFullYear();
                            instance._staticElements.rarity.innerHTML = "TODO";
                            instance._staticElements.attentionSpan.innerHTML = celestial.Logic.AttentionSpan.toFixed(1) + "%";
                            instance._staticElements.favouriteAction.innerHTML = celestial.FavouriteSequence;
                            instance._staticElements.availableActions.innerHTML = celestial.AvailableSequences.join(", ");
                            if (celestial.SpawnedBy != null) {
                                instance._staticElements.spawnedBy.innerHTML = "";
                                span = document.createElement("span");
                                span.classList.add("link");
                                span.innerHTML = celestial.SpawnedBy.Name;
                                instance._staticElements.spawnedBy.appendChild(span);
                                span.addEventListener("click", function () {
                                    ui.menus.CelestialDetails.show(celestial.SpawnedBy);
                                    ui.menus.CurrentCelestialsPanel.selectCelestial(celestial.SpawnedBy);
                                });
                            }
                            else
                                instance._staticElements.spawnedBy.innerHTML = "User Action";
                            instance._rebuildList(celestial.Descendants, instance._lastDescendantsLength, instance._activeElements.descendants, true);
                            instance._rebuildList(celestial.Relationships.Friends.map(function (value) { return value.celestial; }), instance._lastFriendsLength, instance._activeElements.friends, true);
                            instance._rebuildList(celestial.Relationships.Enemies.map(function (value) { return value.celestial; }), instance._lastEnemiesLength, instance._activeElements.enemies, true);
                            instance.update();
                            instance._activeElements.screenshot.style.filter = celestial.MainImage.style.filter;
                            instance._updateTimer = setInterval(instance.update.bind(instance), 100);
                            return [2];
                        });
                    });
                };
                CelestialDetails.hide = function () {
                    CelestialDetails._instance.hide();
                    celestials.App.Window.clearInterval(CelestialDetails._instance._updateTimer);
                };
                CelestialDetails.showMood = function () {
                    var instance = CelestialDetails._instance;
                    instance._moodToggle.enable.classList.remove("hide");
                    instance._moodToggle.disable.classList.add("hide");
                };
                CelestialDetails.hideMood = function () {
                    var instance = CelestialDetails._instance;
                    instance._moodToggle.disable.classList.remove("hide");
                    instance._moodToggle.enable.classList.add("hide");
                };
                CelestialDetails.prototype._setProgress = function (bar, mood) {
                    var value = mood.value;
                    bar.style.width = value + "%";
                    bar.parentElement.classList.remove("low");
                    bar.parentElement.classList.remove("high");
                    if (value < 20)
                        bar.parentElement.classList.add("low");
                    else if (value > 80)
                        bar.parentElement.classList.add("high");
                };
                CelestialDetails.prototype._grabScreenshot = function (forceChange) {
                    if (forceChange === void 0) { forceChange = false; }
                    var instance = CelestialDetails._instance;
                    var lastSrc = instance._activeElements.screenshot.src;
                    var mainImage = instance._celestial.MainImage;
                    var currSrc = mainImage.src;
                    if (lastSrc != currSrc || forceChange) {
                        instance._activeElements.screenshot.src = currSrc;
                        this._activeElements.screenshot.style.width = mainImage.width + "px";
                        this._activeElements.screenshot.style.height = mainImage.height + "px";
                    }
                };
                CelestialDetails.prototype._rebuildDescendants = function (firstTime) {
                    if (firstTime === void 0) { firstTime = false; }
                    if (this._celestial == null)
                        return;
                    var descendants = this._celestial.Descendants;
                    if (descendants.length != this._lastDescendantsLength || firstTime) {
                        this._activeElements.descendants.innerHTML = "";
                        var _loop_9 = function (i) {
                            var desc = descendants[i];
                            var span = document.createElement("span");
                            span.classList.add("link");
                            span.innerHTML = desc.Name;
                            this_3._activeElements.descendants.appendChild(span);
                            if (i < descendants.length - 1) {
                                var commaSpan = document.createElement("span");
                                commaSpan.innerHTML = ", ";
                                this_3._activeElements.descendants.appendChild(commaSpan);
                            }
                            span.addEventListener("click", function () {
                                ui.menus.CelestialDetails.show(desc);
                                ui.menus.CurrentCelestialsPanel.selectCelestial(desc);
                            });
                        };
                        var this_3 = this;
                        for (var i = 0; i < descendants.length; i++) {
                            _loop_9(i);
                        }
                    }
                };
                CelestialDetails.prototype._rebuildList = function (list, lastLength, container, firstTime) {
                    if (firstTime === void 0) { firstTime = false; }
                    if (this._celestial == null)
                        return;
                    if (list.length != lastLength || firstTime) {
                        container.innerHTML = "";
                        var _loop_10 = function (i) {
                            var item = list[i];
                            var span = document.createElement("span");
                            span.classList.add("link");
                            span.innerHTML = item.Name;
                            container.appendChild(span);
                            if (i < list.length - 1) {
                                var commaSpan = document.createElement("span");
                                commaSpan.innerHTML = ", ";
                                container.appendChild(commaSpan);
                            }
                            span.addEventListener("click", function () {
                                ui.menus.CelestialDetails.show(item);
                                ui.menus.CurrentCelestialsPanel.selectCelestial(item);
                            });
                        };
                        for (var i = 0; i < list.length; i++) {
                            _loop_10(i);
                        }
                    }
                };
                CelestialDetails.prototype._onShowInView = function () {
                    if (this._celestial != null)
                        menus.CurrentCelestialsPanel.selectCelestial(this._celestial);
                };
                CelestialDetails.prototype.update = function () {
                    this._activeElements.name.innerHTML = this._celestial.Name;
                    this._staticElements.lookup.innerHTML = this._celestial.Lookup;
                    this._activeElements.age.innerHTML = this._celestial.Age.toFixed(2);
                    this._activeElements.size.innerHTML = this._celestial.Size.toFixed(2);
                    this._activeElements.mass.innerHTML = this._celestial.Mass.toFixed(2) + " souls";
                    this._activeElements.currentAction.innerHTML = this._celestial.Sequencer.CurrentSequence.name;
                    this._rebuildList(this._celestial.Descendants, this._lastDescendantsLength, this._activeElements.descendants);
                    this._rebuildList(this._celestial.Relationships.Friends.map(function (value) { return value.celestial; }), this._lastFriendsLength, this._activeElements.friends);
                    this._rebuildList(this._celestial.Relationships.Enemies.map(function (value) { return value.celestial; }), this._lastEnemiesLength, this._activeElements.enemies);
                    this._setProgress(this._activeElements.socialNeeds, this._celestial.Moods.getMoodByName(celestials.engines.Moods.MOOD.Social));
                    this._setProgress(this._activeElements.hungerNeeds, this._celestial.Moods.getMoodByName(celestials.engines.Moods.MOOD.Hunger));
                    this._setProgress(this._activeElements.restNeeds, this._celestial.Moods.getMoodByName(celestials.engines.Moods.MOOD.Rest));
                    this._grabScreenshot();
                    this._lastDescendantsLength = this._celestial.Descendants.length;
                    this._lastFriendsLength = this._celestial.Relationships.Friends.length;
                    this._lastEnemiesLength = this._celestial.Relationships.Enemies.length;
                };
                Object.defineProperty(CelestialDetails, "isShowing", {
                    get: function () { return CelestialDetails._instance._isShowing; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CelestialDetails, "CurrentCelestial", {
                    get: function () { return CelestialDetails._instance._celestial; },
                    enumerable: true,
                    configurable: true
                });
                return CelestialDetails;
            }(menus.OverlayMenu));
            menus.CelestialDetails = CelestialDetails;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var App = (function () {
        function App(win, node) {
            App._instance = this;
            App._window = win;
            App._node = node;
            App._paused = false;
            App._usesMood = false;
        }
        App.setup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var celestialsMan, controls, debug;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("SETUP");
                            App._bounds = new celestials.Rect(App._node.offsetLeft, App._node.offsetTop, App._node.offsetWidth, App._node.offsetHeight);
                            return [4, new celestials.systems.Collision()];
                        case 1:
                            _a.sent();
                            return [4, new celestials.managers.MouseManager()];
                        case 2:
                            _a.sent();
                            return [4, new celestials.managers.InputManager()];
                        case 3:
                            _a.sent();
                            return [4, new celestials.ui.menus.Tooltip(document.querySelector(".overlay-menu.tooltip"))];
                        case 4:
                            _a.sent();
                            return [4, new celestials.managers.RemoteManager()];
                        case 5:
                            _a.sent();
                            return [4, new celestials.managers.CelestialsManager()];
                        case 6:
                            celestialsMan = _a.sent();
                            return [4, celestialsMan.setup(celestials.managers.RemoteManager.Files)];
                        case 7:
                            _a.sent();
                            return [4, new celestials.ui.menus.CelestialContext(document.querySelector(".context-menu.celestial"))];
                        case 8:
                            _a.sent();
                            return [4, new celestials.ui.menus.ApplicationContext(document.querySelector(".context-menu.application"))];
                        case 9:
                            _a.sent();
                            return [4, new celestials.ui.menus.NotificationBar(document.querySelector(".overlay-menu.notifications-bar"), document.querySelector(".notifications-bar-bounds"))];
                        case 10:
                            _a.sent();
                            return [4, new celestials.ui.menus.NotificationPanel(document.querySelector(".overlay-menu.notifications-panel"))];
                        case 11:
                            _a.sent();
                            return [4, new celestials.ui.menus.CelestialsPanel(document.querySelector(".overlay-menu.celestials"))];
                        case 12:
                            _a.sent();
                            return [4, new celestials.ui.menus.CurrentCelestialsPanel(document.querySelector(".overlay-menu.current-celestials"))];
                        case 13:
                            _a.sent();
                            return [4, new celestials.ui.menus.CelestialDetails(document.querySelector(".overlay-menu.celestial-details"))];
                        case 14:
                            _a.sent();
                            return [4, new celestials.ui.menus.ControlPanel(document.querySelector(".overlay-menu.control-panel"))];
                        case 15:
                            _a.sent();
                            celestials.systems.Notifications.addNotification("This is a test!", celestials.systems.Notifications.TYPE.Notify);
                            celestials.systems.Notifications.addNotification("This is a test for failure!", celestials.systems.Notifications.TYPE.Fail);
                            return [4, new celestials.systems.Controls()];
                        case 16:
                            controls = _a.sent();
                            return [4, new celestials.systems.Debugger()];
                        case 17:
                            debug = _a.sent();
                            setInterval(function () {
                                if (App._paused)
                                    return;
                                celestials.managers.InputManager.update();
                                celestials.managers.CelestialsManager.update();
                                celestials.systems.Collision.update();
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
            get: function () { return celestials.managers.MouseManager.MousePosition; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "Paused", {
            get: function () { return App._paused; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "UsesMood", {
            get: function () { return App._usesMood; },
            set: function (value) { App._usesMood = value; },
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
                console.log("ZEROED OUT");
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
            Object.defineProperty(Physics.prototype, "Gravity", {
                get: function () { return this._gravity; },
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
                if (this._celestial.IsControlled)
                    return;
                this._tick += this._eagerness;
                var locAttentionSpan = celestials.clamp(this._celestial.Sequencer.CurrentSequenceSet.attentionSpan || 100, 1, 100);
                var attentionSpan = this._attentionSpan * (locAttentionSpan / 100);
                var attention = celestials.randomRangeInt(this._tick, 100);
                if ((attention > attentionSpan) || this._celestial.Sequencer.CurrentSequenceSet.runOnce) {
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
                    console.log(nextStates);
                    var waitingForState = true;
                    while (waitingForState) {
                        for (var i = 0; i < nextStates.length; i++) {
                            var stateName = celestials.engines.CelestialSequencer.STATE[nextStates[i]];
                            if (this._celestial.Sequencer.changeState(stateName) != null) {
                                waitingForState = false;
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
            CelestialLogic.prototype.startState = function (stateName) {
                return __awaiter(this, void 0, void 0, function () {
                    var state, sequence;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this._pauseIntegrityCheck = true;
                                return [4, this._celestial.Sequencer.changeState(stateName)];
                            case 1:
                                state = _a.sent();
                                if (!(state != null)) return [3, 4];
                                if (state != stateName) {
                                    return [2, false];
                                    this._pauseIntegrityCheck = false;
                                }
                                return [4, this._celestial.Sequencer.getRandomStateSequence(state)];
                            case 2:
                                sequence = _a.sent();
                                if (!(sequence != null)) return [3, 4];
                                return [4, this._celestial.Sequencer.changeSequence(sequence)];
                            case 3:
                                _a.sent();
                                this._tick = 0;
                                this._pauseIntegrityCheck = false;
                                return [2, true];
                            case 4:
                                this._pauseIntegrityCheck = false;
                                return [2, false];
                        }
                    });
                });
            };
            CelestialLogic.prototype.tryEndState = function (stateName) {
                if (this._celestial.Sequencer.isCurrentState(stateName))
                    this.nextState();
            };
            CelestialLogic.prototype.handleWallHit = function (which) {
                this._handleStateIntegrity(which);
                if (which == Physics.WALL.Bottom && this._celestial.Sequencer.isCurrentState(celestials.engines.CelestialSequencer.STATE.Fall)) {
                    if (!this.startState(celestials.engines.CelestialSequencer.STATE.Recover))
                        this.next();
                }
            };
            CelestialLogic.prototype.updateState = function () {
                this._handleStateChange();
            };
            CelestialLogic.prototype.handleStateChange = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this._pauseIntegrityCheck = true;
                                this._celestial.Sequencer.reset();
                                return [4, this._celestial.update()];
                            case 1:
                                _a.sent();
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
                return __awaiter(this, void 0, void 0, function () {
                    var cs, lastState, currentState, lastTouchedWall;
                    return __generator(this, function (_a) {
                        cs = celestials.engines.CelestialSequencer;
                        lastState = this._celestial.Sequencer.LastState;
                        currentState = this._celestial.Sequencer.CurrentState;
                        console.log(this._celestial.Sequencer.CurrentFrame.name);
                        switch (currentState) {
                            case cs.STATE.Idle:
                            case cs.STATE.Walk:
                                this._celestial.Physics.zeroVelocity();
                            case cs.STATE.Fall:
                                this._celestial.Physics.resetGravity();
                                break;
                            case cs.STATE.Climb:
                                this._celestial.Physics.setGravity(0);
                                this._celestial.Physics.zeroVelocity();
                                lastTouchedWall = this._celestial.Physics.LastTouchedWall;
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
                            case cs.STATE.Hang:
                                this._celestial.Physics.zeroVelocity();
                                this._celestial.Physics.setGravity(0);
                                this._celestial.Physics.snapToTop();
                                break;
                            case cs.STATE.Hold:
                                this._celestial.Physics.zeroVelocity();
                                this._celestial.Physics.setGravity(0);
                                break;
                            case cs.STATE.Spawn:
                            case cs.STATE.Interact:
                                this._celestial.Physics.zeroVelocity();
                                this._celestial.Physics.resetGravity();
                                break;
                        }
                        return [2];
                    });
                });
            };
            CelestialLogic.prototype._handleStateNuance = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var cs, lastState, currentState;
                    return __generator(this, function (_a) {
                        cs = celestials.engines.CelestialSequencer;
                        lastState = this._celestial.Sequencer.LastState;
                        currentState = this._celestial.Sequencer.CurrentState;
                        console.log(lastState, currentState);
                        if (lastState == cs.STATE.Climb && currentState == cs.STATE.Hang) {
                            console.log("I AM USING THE NUANCE");
                            this._celestial.Physics.addForceX(celestials.randomRange(20, 30) * this._celestial.Direction.x);
                        }
                        return [2];
                    });
                });
            };
            CelestialLogic.prototype._handleStateIntegrity = function (wallHit) {
                return __awaiter(this, void 0, void 0, function () {
                    var cs, lastState, currentState;
                    return __generator(this, function (_a) {
                        cs = celestials.engines.CelestialSequencer;
                        lastState = this._celestial.Sequencer.LastState;
                        currentState = this._celestial.Sequencer.CurrentState;
                        if (this._celestial.IsControlled) {
                            if (this._celestial.Physics.isTouchingWall(celestials.engines.Physics.WALL.Top))
                                if (this._tryToHang(celestials.engines.Physics.WALL.Top))
                                    return [2];
                            if (this._celestial.Physics.isTouchingWall(Physics.WALL.Left, Physics.WALL.Right)) {
                                if (!this._tryToClimb(wallHit))
                                    this._celestial.flipX();
                                return [2];
                            }
                        }
                        switch (currentState) {
                            case cs.STATE.Walk:
                            case cs.STATE.Idle:
                            case cs.STATE.Fall:
                                if (!this._tryToClimb(wallHit))
                                    this._celestial.flipX();
                                break;
                            case cs.STATE.Climb:
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
                            case cs.STATE.Hang:
                                if (wallHit != null)
                                    if (wallHit == Physics.WALL.Left || wallHit == Physics.WALL.Right)
                                        this._celestial.flipX();
                                if (wallHit == null)
                                    if (this._celestial.Bounds.Top > celestials.App.Bounds.Top)
                                        this.nextState();
                                break;
                            case cs.STATE.Recover:
                                if (this._celestial.Bounds.Bottom < celestials.App.Bounds.Bottom)
                                    this.nextState();
                                break;
                            case cs.STATE.Hold:
                                if (this._celestial.Physics.isTouchingWall(celestials.engines.Physics.WALL.Top))
                                    this._tryToHang(celestials.engines.Physics.WALL.Top);
                                else if (!this._celestial.IsControlled) {
                                    if (!this._celestial.Physics.isTouchingWall(celestials.engines.Physics.WALL.Bottom)) {
                                        if (!this.startState(celestials.engines.CelestialSequencer.STATE.Fall))
                                            this.nextState();
                                    }
                                    else
                                        this.nextState();
                                }
                                break;
                            case cs.STATE.Fall:
                                if (this._celestial.Physics.isTouchingWall(celestials.engines.Physics.WALL.Top)) {
                                    this._tryToHang(celestials.engines.Physics.WALL.Top);
                                }
                                break;
                        }
                        return [2];
                    });
                });
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
                                var state, sequence, e_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            this._attentionSpan = celestials.clamp(this._attentionSpan + celestials.randomRange(-this._celestial.Variation, this._celestial.Variation), 0, 100);
                                            state = this._celestial.Sequencer.changeState(celestials.engines.CelestialSequencer.STATE.Fall, celestials.engines.CelestialSequencer.STATE.Idle);
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
                                            e_2 = _a.sent();
                                            reject(new Error("Could not load Logic on " + this._celestial.Name + "\n" + e_2));
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
                    else {
                        _this._celestial.Physics.setGravity(0);
                        if (_this._celestial.Sequencer.isCurrentState(celestials.engines.CelestialSequencer.STATE.Hold))
                            _this._handleHolds();
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
            CelestialLogic.prototype._handleHolds = function () {
                var frame = this._celestial.Sequencer.CurrentFrame;
            };
            CelestialLogic.prototype._completeHolds = function () {
            };
            CelestialLogic.prototype._tryToFlipX = function () {
                var random = celestials.randomRange(0, 1);
                var wantToFlipX = celestials.lerp((this._eagerness * 5), 100, random);
                if (wantToFlipX > this._attentionSpan)
                    this._celestial.flipX();
            };
            CelestialLogic.prototype._tryToClimb = function (wallHit) {
                if (wallHit != null) {
                    if (wallHit == Physics.WALL.Left || wallHit == Physics.WALL.Right) {
                        if (celestials.randomRange(0, 1) > this._celestial.Sequencer.CurrentSequenceSet.attentionSpan || 100 / 100) {
                            var state = this._celestial.Sequencer.changeState(celestials.engines.CelestialSequencer.STATE.Climb);
                            if (state != celestials.engines.CelestialSequencer.STATE.Climb)
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
                console.log("SHOULD I HANG? ", wallHit);
                if (wallHit == null)
                    return false;
                if (wallHit != Physics.WALL.Top)
                    return false;
                console.log("TEST RANGE");
                if (celestials.randomRange(0, 1) > 0) {
                    var state = this._celestial.Sequencer.changeState(celestials.engines.CelestialSequencer.STATE.Hang);
                    if (state != celestials.engines.CelestialSequencer.STATE.Hang)
                        return false;
                    var sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                    if (sequence != null) {
                        this._celestial.Sequencer.changeSequence(sequence);
                        return true;
                    }
                }
                return false;
            };
            Object.defineProperty(CelestialLogic.prototype, "AttentionSpan", {
                get: function () { return this._attentionSpan; },
                enumerable: true,
                configurable: true
            });
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
            Object.defineProperty(CelestialSequencer, "STATE", {
                get: function () {
                    return Object.freeze({
                        "Idle": "idles",
                        "Walk": "walks",
                        "Climb": "climbs",
                        "Hang": "hangs",
                        "Fall": "falls",
                        "Recover": "recovers",
                        "Hold": "holds",
                        "Spawn": "spawns",
                        "Interact": "interactions"
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
                if (state === void 0) { state = CelestialSequencer.STATE.Idle; }
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
            CelestialSequencer.prototype.getStateByName = function (state) {
                if (this._sequences[state] != null)
                    return this._sequences[state];
                return null;
            };
            CelestialSequencer.prototype.getRandomState = function (omitCurrentState) {
                if (omitCurrentState === void 0) { omitCurrentState = true; }
                var keys = Object.keys(CelestialSequencer.STATE);
                if (keys.length <= 1)
                    return this._currentState;
                var state = CelestialSequencer.STATE[keys[celestials.randomRangeInt(0, keys.length - 1)]];
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
                        _this._holdIndex++;
                        _this._totalIndex++;
                        if (_this._holdIndex > _this._currentSequence.frames[_this._frameIndex].hold * _this._updateRate) {
                            _this._frameIndex++;
                            _this._holdIndex = 0;
                        }
                        if (_this._frameIndex > _this._currentSequence.frames.length - 1) {
                            if (_this.CurrentSequenceSet.runOnce)
                                _this.completeSequence();
                            if (_this._currentSequence.looping) {
                                _this._frameIndex = 0;
                            }
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
    var engines;
    (function (engines) {
        var Moods = (function () {
            function Moods(celestial) {
                this._celestial = celestial;
                this._moods = this._celestial.Data.moods;
                this._moods = this._celestial.Data.moods ||
                    {
                        social: { value: 100, decay: 0 },
                        hunger: { value: 100, decay: 0 },
                        rest: { value: 100, decay: 0 }
                    };
                this._usesMood = false;
                this._updateTick = 0;
                this._onMoodChange = null;
            }
            Object.defineProperty(Moods, "MOOD", {
                get: function () { return Object.freeze({ "Social": "social", "Hunger": "hunger", "Rest": "rest" }); },
                enumerable: true,
                configurable: true
            });
            Moods.prototype.decay = function () {
                if (!this._usesMood)
                    return;
                for (var _i = 0, _a = Object.keys(Moods.MOOD); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var mood = this._moods[Moods.MOOD[key]];
                    if (mood != null) {
                        mood.value = celestials.clamp(mood.value - (mood.decay * this._celestial.Variation), 1, 100);
                    }
                }
            };
            Moods.prototype.boost = function (moodName, value, useRandomness) {
                if (useRandomness === void 0) { useRandomness = false; }
                if (!this._usesMood)
                    return;
                var mood = this.getMoodByName(moodName);
                if (mood != null) {
                    if (value != null) {
                        if (useRandomness) {
                            var seed = celestials.randomRange(0.5, 1.5);
                            var attachment = this._celestial.Relationships.Attachment / 100;
                            value = celestials.clamp(((attachment + seed) / 2) * value, 1, 100);
                        }
                        mood.value = celestials.clamp(mood.value + value, 1, 100);
                    }
                }
                else {
                    var seed = celestials.randomRange(0.5, 1.5);
                    var attachment = this._celestial.Relationships.Attachment / 100;
                    value = celestials.clamp(((attachment + seed) / 2) * (mood.decay * 3), 1, 100);
                }
            };
            Moods.prototype.getMoodByName = function (name) {
                if (this._moods == null)
                    return { value: 0, decay: 0 };
                var mood = this._moods[name];
                return mood || { value: 0, decay: 0 };
            };
            Moods.prototype.addMoodListener = function (callback) {
                this._onMoodChange = callback;
            };
            Moods.prototype.removeMoodListener = function () {
                this._onMoodChange = null;
            };
            Moods.prototype.load = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this._usesMood = celestials.App.UsesMood;
                        return [2];
                    });
                });
            };
            Moods.prototype.unload = function () {
            };
            Moods.prototype.update = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (!this._usesMood)
                            return [2];
                        if (this._moods == null)
                            return [2];
                        if (this._updateTick > (this._moods.updateRate || 200)) {
                            this._updateTick = 0;
                            this.decay();
                        }
                        this._updateTick++;
                        return [2];
                    });
                });
            };
            Object.defineProperty(Moods.prototype, "UsesMood", {
                get: function () { return this._usesMood; },
                enumerable: true,
                configurable: true
            });
            return Moods;
        }());
        engines.Moods = Moods;
    })(engines = celestials.engines || (celestials.engines = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var engines;
    (function (engines) {
        var Relationships = (function () {
            function Relationships(celestial) {
                this._celestial = celestial;
                this._relationshipsData = this._celestial.Data.relationships;
                this._usesRelationships = false;
                this._updateTick = 0;
                this._relationshipsListener = null;
                if (this._relationshipsData == null) {
                    this._relationshipsData = {
                        updateRate: 200,
                        neutral: 50,
                        attachment: 0,
                        friends: [],
                        enemies: []
                    };
                }
                this._relationships = new Array();
            }
            Object.defineProperty(Relationships, "MOOD", {
                get: function () { return Object.freeze({ "Social": "social", "Hunger": "hunger", "Rest": "rest" }); },
                enumerable: true,
                configurable: true
            });
            Relationships.prototype.getInteractValueWith = function (celestial, action) {
                var seed = celestials.randomRange(-1, 1);
                var goodRelationship = this._isGoodRelationshipType(celestial);
                var interpersonal = (this._getRelationshipValue(celestial) == 0) ? 0 : (this._getRelationshipValue(celestial) - 50) / 100;
                var interactionStrength = (seed * interpersonal) + (seed * ((goodRelationship) ? 1 : -1)) + seed;
                interactionStrength *= (celestials.randomRange(0.5, 1.5) * this._relationshipsData.aggression || 1);
                interactionStrength *= 10;
                return interactionStrength;
            };
            Relationships.prototype.setInteraction = function (celestial, value, action) {
                console.log("THIS INTERACTION IS WORTH: " + value + ", with: " + celestial.Name);
                var relation = this.findRelationshipByCelestial(celestial);
                if (relation == null) {
                    this._relationships.push({
                        celestial: celestial,
                        value: this._relationshipsData.neutral + value,
                        lastAction: action || "None"
                    });
                }
                else {
                    relation.value = celestials.clamp(relation.value + value, 0, 100);
                }
            };
            Relationships.prototype._isGoodRelationshipType = function (celestial) {
                if (this._relationshipsData.friends != null)
                    for (var _i = 0, _a = this._relationshipsData.friends; _i < _a.length; _i++) {
                        var f = _a[_i];
                        if (f == celestial.Lookup)
                            return true;
                    }
                if (this._relationshipsData.enemies != null)
                    for (var _b = 0, _c = this._relationshipsData.enemies; _b < _c.length; _b++) {
                        var e = _c[_b];
                        if (e == celestial.Lookup)
                            return false;
                    }
                return true;
            };
            Relationships.prototype._getRelationshipValue = function (celestial) {
                for (var _i = 0, _a = this._relationships; _i < _a.length; _i++) {
                    var rel = _a[_i];
                    if (rel.celestial == celestial)
                        return rel.value;
                }
                return 0;
            };
            Relationships.prototype.findRelationshipByCelestial = function (celestial) {
                for (var _i = 0, _a = this._relationships; _i < _a.length; _i++) {
                    var rel = _a[_i];
                    if (rel.celestial == celestial)
                        return rel;
                }
                return null;
            };
            Relationships.prototype.addRelationshipsListener = function (callback) {
                this._relationshipsListener = callback;
            };
            Relationships.prototype.removeRelationshipsListener = function () {
                this._relationshipsListener = null;
            };
            Relationships.prototype.load = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2];
                    });
                });
            };
            Relationships.prototype.unload = function () {
            };
            Relationships.prototype.update = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (!this._usesRelationships)
                            return [2];
                        return [2];
                    });
                });
            };
            Object.defineProperty(Relationships.prototype, "Attachment", {
                get: function () { return celestials.clamp(this._relationshipsData.attachment || 0, 0, 100); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Relationships.prototype, "Relationships", {
                get: function () { return this._relationships; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Relationships.prototype, "Friends", {
                get: function () { return this._relationships.filter(function (value) { return value.value > 75; }); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Relationships.prototype, "Enemies", {
                get: function () { return this._relationships.filter(function (value) { return value.value < 20; }); },
                enumerable: true,
                configurable: true
            });
            return Relationships;
        }());
        engines.Relationships = Relationships;
    })(engines = celestials.engines || (celestials.engines = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var components;
        (function (components) {
            var InputConfirm = (function () {
                function InputConfirm(node, confirmNode, changeListener, confirmListener, cancelListener, options) {
                    this._node = node;
                    this._confirmNode = confirmNode;
                    this._changeListener = changeListener;
                    this._confirmListener = confirmListener;
                    this._cancelListener = cancelListener;
                    this._options = options;
                    this._node.addEventListener("keydown", this._onChange.bind(this));
                    if (this._confirmNode != null)
                        this._confirmNode.addEventListener("mousedown", this._onConfirm.bind(this));
                }
                InputConfirm.prototype.cancel = function () {
                    console.log("CANCELLING");
                    if (this._cancelListener != null)
                        this._cancelListener(this._node.value);
                };
                InputConfirm.prototype.addChangeListener = function (callback) {
                    this._changeListener = callback;
                };
                InputConfirm.prototype.removeChangeListener = function () {
                    this._changeListener = null;
                };
                InputConfirm.prototype.addConfirmListener = function (callback) {
                    this._confirmListener = callback;
                };
                InputConfirm.prototype.removeConfirmListener = function () {
                    this._confirmListener = null;
                };
                InputConfirm.prototype.addCancelListener = function (callback) {
                    this._cancelListener = callback;
                };
                InputConfirm.prototype.removeCancelListener = function () {
                    this._cancelListener = null;
                };
                InputConfirm.prototype._onChange = function (e) {
                    if (this._changeListener != null)
                        this._changeListener(this._node.value);
                    console.log("MY KEY: " + e.key);
                    if (this._options != null) {
                        if (this._options.confirmWithEnterKey && e.key == "Enter")
                            this._onConfirm();
                        if (this._options.cancelWithEscapeKey && e.key == "Escape")
                            this.cancel();
                    }
                };
                InputConfirm.prototype._onLoseFocus = function (e) {
                    this.cancel();
                };
                InputConfirm.prototype._onConfirm = function () {
                    console.log("CONFIRMED!: " + this._node.value);
                    if (this._confirmListener != null)
                        this._confirmListener(this._node.value);
                };
                return InputConfirm;
            }());
            components.InputConfirm = InputConfirm;
        })(components = ui.components || (ui.components = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var components;
        (function (components) {
            var YesNoConfirm = (function () {
                function YesNoConfirm(yesNode, noNode, yesListener, noListener) {
                    this._yesNode = yesNode;
                    this._noNode = noNode;
                    this._yesListener = yesListener;
                    this._noListener = noListener;
                    this._yesNode.addEventListener("mousedown", this._onYes.bind(this));
                    this._noNode.addEventListener("mousedown", this._onNo.bind(this));
                }
                YesNoConfirm.prototype.addYesListener = function (callback) {
                    this._yesListener = callback;
                };
                YesNoConfirm.prototype.removeYesListener = function () {
                    this._yesListener = null;
                };
                YesNoConfirm.prototype.addNoListener = function (callback) {
                    this._noListener = callback;
                };
                YesNoConfirm.prototype.removeNoListener = function () {
                    this._noListener = null;
                };
                YesNoConfirm.prototype._onYes = function () {
                    if (this._yesListener != null)
                        this._yesListener();
                };
                YesNoConfirm.prototype._onNo = function () {
                    if (this._noListener != null)
                        this._noListener();
                };
                return YesNoConfirm;
            }());
            components.YesNoConfirm = YesNoConfirm;
        })(components = ui.components || (ui.components = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
})(celestials || (celestials = {}));
var celestials;
(function (celestials) {
    var ui;
    (function (ui) {
        var menus;
        (function (menus) {
            var CurrentCelestialsItem = (function (_super) {
                __extends(CurrentCelestialsItem, _super);
                function CurrentCelestialsItem(node, cel, changeListener, removeListener, updateListener) {
                    var _this = _super.call(this, node) || this;
                    _this._celestial = cel;
                    _this._changeListener = changeListener;
                    _this._removeListener = removeListener;
                    _this._updateListener = updateListener;
                    _this.updateData();
                    _this.loadIcon();
                    menus.Tooltip.lookForTooltips(_this.Node);
                    _this._registry = {
                        onInfo: _this._onInfo.bind(_this),
                        onEdit: _this._onEdit.bind(_this),
                        onDelete: _this._onDelete.bind(_this),
                        onCelestialChange: _this._onCelestialChange.bind(_this)
                    };
                    _this._buttons = {
                        infoButton: _this.Node.querySelector(".item.info"),
                        editButton: _this.Node.querySelector(".item.edit"),
                        deleteButton: _this.Node.querySelector(".item.delete")
                    };
                    var _a = _this._buttons, infoButton = _a.infoButton, editButton = _a.editButton, deleteButton = _a.deleteButton;
                    infoButton.addEventListener("mousedown", _this._registry.onInfo);
                    editButton.addEventListener("mousedown", _this._registry.onEdit);
                    deleteButton.addEventListener("mousedown", _this._registry.onDelete);
                    new ui.components.YesNoConfirm(_this.Node.querySelector(".confirm .icon.confirm"), _this.Node.querySelector(".confirm .icon.delete"), function () {
                        _this.callRemove();
                    }, function () {
                        _this.closeDeletePanel();
                    });
                    new ui.components.InputConfirm(_this.Node.querySelector(".edit-name input"), _this.Node.querySelector(".edit-name .confirm"), null, function (name) {
                        cel.setName(name);
                        _this.closeEditPanel();
                        _this.Node.querySelector(".name").innerHTML = cel.Name;
                        _this.callChange();
                    }, function () { return _this.closeEditPanel(); }, { confirmWithEnterKey: true, cancelWithEscapeKey: true });
                    return _this;
                }
                CurrentCelestialsItem.prototype.deselect = function () {
                    _super.prototype.deselect.call(this);
                    this.closeEditPanel();
                    this.closeDeletePanel();
                };
                CurrentCelestialsItem.prototype.updateData = function () {
                    this.Node.querySelector(".name").innerHTML = this._celestial.Name;
                    this.Node.querySelector(".type").innerHTML = this._celestial.Lookup;
                    var dateOptions = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
                    this.Node.querySelector(".date").innerHTML = this._celestial.DateSpawned.toLocaleDateString('us-EN', dateOptions);
                };
                CurrentCelestialsItem.prototype.loadIcon = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var image;
                        return __generator(this, function (_a) {
                            image = this.Node.querySelector("img");
                            image.src = this._celestial.Icon.src;
                            image.style.filter = this._celestial.Icon.style.filter;
                            return [2];
                        });
                    });
                };
                CurrentCelestialsItem.prototype.openEditPanel = function () {
                    this.Node.querySelector(".item.edit").classList.add("selected");
                    var inputDiv = this.Node.querySelector(".edit-name input");
                    console.log("FOCUS");
                    console.log(inputDiv);
                    window.setTimeout(function () { return inputDiv.focus(); }, 0);
                };
                CurrentCelestialsItem.prototype.closeEditPanel = function () {
                    this.Node.querySelector(".item.edit").classList.remove("selected");
                };
                CurrentCelestialsItem.prototype.openDeletePanel = function () {
                    console.log("OPEN ME");
                    this.Node.querySelector(".item.delete").classList.add("selected");
                };
                CurrentCelestialsItem.prototype.closeDeletePanel = function () {
                    console.log("CLOSE ME");
                    this.Node.querySelector(".item.delete").classList.remove("selected");
                };
                CurrentCelestialsItem.prototype.callChange = function () {
                    if (this._changeListener != null)
                        this._changeListener(this);
                };
                CurrentCelestialsItem.prototype.callRemove = function () {
                    if (this._removeListener != null)
                        this._removeListener(this);
                };
                CurrentCelestialsItem.prototype.callUpdate = function () {
                    if (this._updateListener != null)
                        this._updateListener(this);
                };
                CurrentCelestialsItem.prototype._onInfo = function () {
                    menus.CelestialDetails.show(this._celestial);
                };
                CurrentCelestialsItem.prototype._onEdit = function () {
                    var inputDiv = this.Node.querySelector(".edit-name input");
                    inputDiv.value = this._celestial.Name;
                    this.openEditPanel();
                };
                CurrentCelestialsItem.prototype._onDelete = function () {
                    this.openDeletePanel();
                };
                CurrentCelestialsItem.prototype._onCelestialChange = function () {
                    this.updateData();
                    this.callUpdate();
                };
                Object.defineProperty(CurrentCelestialsItem.prototype, "Celestial", {
                    get: function () { return this._celestial; },
                    enumerable: true,
                    configurable: true
                });
                return CurrentCelestialsItem;
            }(ui.components.Item));
            menus.CurrentCelestialsItem = CurrentCelestialsItem;
        })(menus = ui.menus || (ui.menus = {}));
    })(ui = celestials.ui || (celestials.ui = {}));
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