namespace celestials.ui {
    export abstract class Menu implements ILoadable {
        protected _node:HTMLElement;
        protected _isShowing:boolean;
        protected _isDisabled:boolean;

        constructor(node:HTMLElement) {
            this._node = node;
            this._isShowing = false;
            this._isDisabled = false;
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        show() {
            this._node.classList.remove("hide");
            this._isShowing = true;

            this.load();
        }

        hide() {
            this._node.classList.add("hide");
            this._isShowing = false;

            this.unload();
        }

        remove() {
            this.unload();

            this._node.remove();
            this._isShowing = false;
        }

        disable() {
            this._isDisabled = true;
            this.unload();
        }
        enable() {
            this._isDisabled = false;
            this.load();
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        public abstract load();
        public abstract unload();
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get Node():HTMLElement { return this._node; }
        public get IsShowing():boolean { return this._isShowing; }
        public get IsDisabled():boolean { return this._isDisabled; }

    }
}