namespace celestials.ui.components {
    export class YesNoConfirm {
        private _yesNode:HTMLElement;
        private _noNode:HTMLElement;

        private _yesListener;
        private _noListener;

        constructor(yesNode:HTMLElement, noNode:HTMLElement, yesListener?, noListener?) {
           this._yesNode = yesNode;
           this._noNode = noNode;
           this._yesListener = yesListener;
           this._noListener = noListener;

            //setup listeners
            this._yesNode.addEventListener("mousedown", this._onYes.bind(this)); 
            this._noNode.addEventListener("mousedown", this._onNo.bind(this)); 
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public addYesListener(callback:Function) {
            this._yesListener = callback;
        }
        public removeYesListener() {
            this._yesListener = null;
        }
        public addNoListener(callback:Function) {
            this._noListener = callback;
        }
        public removeNoListener() {
            this._noListener = null;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onYes() {
            if(this._yesListener != null)
                this._yesListener();
        }
        private _onNo() {
            if(this._noListener != null)
                this._noListener();
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
    }    
}