namespace celestials.ui.components {
    export class Dropdown {
        protected _node:HTMLElement;
        protected _itemTemplate:HTMLElement;
        protected _items:Item[];

        protected _selectListener;

        constructor(node:HTMLElement, template:HTMLElement) {
            this._node = node;
            this._itemTemplate = template;
            
             //hide the templates
             this._itemTemplate.classList.add("hide");

            this._items = new Array();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public createItem():HTMLElement {
            let item:HTMLElement = this._itemTemplate.cloneNode(true) as HTMLElement;
            item.classList.remove("template", "hide");
            return item;
        }

        public addItem(node:HTMLElement, callback:Function) {
            let item:Item = new Item(node);
            item.wireSelector(item.Node);
            item.addSelectListener((select) => {
                callback();
                // if(this._selectListener != null)
                //     //if the item was clicked, return the item index
                //     // this._selectListener(this._items.indexOf(item));
                //     this._selectListener(select);
            });

            this._items.push(item);
            //put in view
            this._node.appendChild(item.Node);
        }
        public removeItemAt(index:number) {
            let item:Item = this._items.splice(index, 1)[0];
            item.Node.remove();
            item = null;
        }
        public clearItems() {
            for(let i = this._items.length - 1; i >= 0; i--)
                this.removeItemAt(i);
        }

        public addSelectListener(callback:Function) {
            this._selectListener = callback;
        }
        public removeSelectListener() {
            this._selectListener = null;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get Items():Item[] { return this._items; }
    }    
}