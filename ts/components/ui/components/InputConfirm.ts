namespace celestials.ui.components {
    export interface IInputConfirmOptions {
        confirmWithEnterKey?:boolean;
        cancelWithEscapeKey?:boolean;
    }
    export class InputConfirm {
        private _node:HTMLInputElement;
        private _confirmNode:HTMLElement;

        private _changeListener;
        private _confirmListener;
        private _cancelListener;
        private _options:IInputConfirmOptions;

        constructor(node:HTMLInputElement, confirmNode?:HTMLElement, changeListener?, confirmListener?, cancelListener?, options?:IInputConfirmOptions) {
            this._node = node;
            this._confirmNode = confirmNode;
            this._changeListener = changeListener;
            this._confirmListener = confirmListener;
            this._cancelListener = cancelListener;
            this._options = options;

            //setup change listener on node
            this._node.addEventListener("keydown", this._onChange.bind(this));
            // this._node.addEventListener("blur", this._onLoseFocus.bind(this));
            if(this._confirmNode != null) this._confirmNode.addEventListener("mousedown", this._onConfirm.bind(this));
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public cancel() {
            console.log("CANCELLING");
            if(this._cancelListener != null)
                this._cancelListener(this._node.value);
        }

        public addChangeListener(callback:Function) {
            this._changeListener = callback;
        }
        public removeChangeListener() {
            this._changeListener = null;
        }
        public addConfirmListener(callback:Function) {
            this._confirmListener = callback;
        }
        public removeConfirmListener() {
            this._confirmListener = null;
        }
        public addCancelListener(callback:Function) {
            this._cancelListener = callback;
        }
        public removeCancelListener() {
            this._cancelListener = null;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onChange(e) {
            if(this._changeListener != null)
                this._changeListener(this._node.value);

            console.log("MY KEY: " + e.key);

            if(this._options != null) {
                //if we confirm with enter key
                if(this._options.confirmWithEnterKey && e.key == "Enter") this._onConfirm();
                //if we cancel with escape key
                if(this._options.cancelWithEscapeKey && e.key == "Escape") this.cancel();
            }
        }
        private _onLoseFocus(e:FocusEvent) {
            this.cancel();
        }
        private _onConfirm() {
            console.log("CONFIRMED!: " + this._node.value);
            if(this._confirmListener != null)
                this._confirmListener(this._node.value);
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
    }    
}