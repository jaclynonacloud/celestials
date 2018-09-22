///<reference path="./../managers/InputManager.ts" />
namespace celestials.systems {
    import InputManager = managers.InputManager;

    export class Controls {
        private static _instance:Controls;
        private _openMenuKey:number[];
        private _closeMenuKey:number[];

        constructor() {
            Controls._instance = this;

            this._openMenuKey = [Key.Code.w];
            this._closeMenuKey = [Key.Code.q];

            //add initial bindings
            InputManager.addBinding("open menu", new KeyBinding(this._openMenu.bind(this), KeyBinding.State.Down, ...this._openMenuKey));
            InputManager.addBinding("close menu", new KeyBinding(this._closeMenu.bind(this), KeyBinding.State.Down, ...this._closeMenuKey));

        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        private _openMenu() {
            console.log("Open menu!");
        }
        private _closeMenu() {
            console.log("Close menu!");
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/

    }
}