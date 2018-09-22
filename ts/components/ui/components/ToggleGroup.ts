namespace celestials.ui.components {
    export class ToggleGroup {
        private _inputNode:HTMLInputElement;
        private _collapsableNode:HTMLElement;
        private _collapsableHeight:number;

        private _changeListener;

        constructor(inputNode:HTMLInputElement, collapsableNode?:HTMLElement, changeListener?) {
            this._inputNode = inputNode;
            this._collapsableNode = collapsableNode;
            this._changeListener = changeListener;

            this._collapsableHeight = (this._collapsableNode != null) ? this._collapsableNode.scrollHeight : 0;
            // this._collapsableHeight = (this._collapsableNode != null) ? this._collapsableNode.getBoundingClientRect().height : 0;
            console.warn("SET SIZE OF TOGGLE: " + this._collapsableHeight);

            this._inputNode.addEventListener("change", this._onToggleChanged.bind(this));

            this._onToggleChanged(); //call once
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public addChangeListener(callback:Function) {
            this._changeListener = callback;
        }
        public removeChangeListener() {
            this._changeListener = null;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onToggleChanged() {
            if(this._changeListener != null)
                this._changeListener(this._inputNode.checked);

            //if there is a collapsable group, show it
            if(this._collapsableNode != null) {
                if(this._inputNode.checked) {
                    console.warn(this._collapsableHeight);
                    this._collapsableNode.style.maxHeight = `${this._collapsableHeight}px`;
                    // this._collapsableNode.style.maxHeight = `300px`;
                    this._collapsableNode.classList.remove("hide");
                }
                else {
                    this._collapsableNode.style.maxHeight = '0px';
                    this._collapsableNode.classList.add("hide");
                }
            }
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
    }    
}