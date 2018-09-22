namespace celestials.ui.components {

    export class List {
        private _node:HTMLElement;
        private _template:HTMLElement;

        private _items:Item[];
        protected _index:number;
        private _maxItems:number;

        protected _onSelectCallback:Function;

        constructor(node:HTMLElement, template:HTMLElement, maxItems?:number) {
            this._node = node;
            this._template = template;
            this._maxItems = maxItems || -1;
            this._index = -1;
            //hide the template
            this._template.classList.add("hide");
            
            this._items = new Array<Item>();
            
            this.clear();
        }

        /*------------------------------------------ METHODS ------------------------------*/
        /**
         * Creates a template clone to build an item for this list from.
         * @param bubbleSelect If true, the select event will be fired if any part of the item is selected.
         */
        public createItem(itemNode?:HTMLElement, bubbleSelect:boolean = true):Item {
            let item:Item = new Item(itemNode || this._template.cloneNode(true) as HTMLElement);  
            this.setupItem(item, bubbleSelect);

            //return the item, in case it needs to be expanded on
            return item;
        }
        public setupItem(item:Item, bubbleSelect:boolean = true) {
            item.Node.classList.remove("template", "hide");

            if(bubbleSelect) {
                // item.Node.addEventListener("click", () => item.select());
                item.wireSelector(item.Node);
            }

            //attach us to the item for listening
            item.addSelectListener((selected:Item) => {
                console.log("LESITNING TO BUTTON")
                //find our index
                let index = this._items.indexOf(selected);

                //deselect previous item
                if(index != this._index)
                    this.deselectItem(this._index);
                
                this._index = index;

               
                //call our select callback, if there is one
                if(this._onSelectCallback != null) this._onSelectCallback(this._index, item); 
            });
        }

        public addItemToList(item:Item) {
            item.Node.classList.remove("hide");
            //add the item to the list
            this._items.push(item);

            //pop the first if the list is too long
            if(this._maxItems != -1)
                if(this._items.length > this._maxItems)
                    this.removeItemAt(this._items.length-1);
            //show item in list
            this._node.appendChild(item.Node);
        }
        public removeItemAt(index:number, destroy:boolean = true) {
            //remove the item
            let removedItem:Item = this._items.splice(index, 1)[0];
            removedItem.destroy();

            if(destroy)
                removedItem = null;
        }
        public removeItem(item:Item, destroy:boolean = true) {
            let index:number = this._items.indexOf(item);
            if(index != -1) this.removeItemAt(index);
        }
        public addItemAt(item:Item, index:number) {
            if(index <= this._items.length-1 && index >= 0) {
                //render the item
                this._node.insertBefore(item.Node, this._items[index].Node);
                //if the item exists in the list elsewhere, remove
                if(this._items.indexOf(item) != -1) this._items.splice(this._items.indexOf(item), 1);
                //put the item into the list
                this._items.splice(index, 0, item);
            }
            else {
                this.addItemToList(item);
            }
        }
        public setItems(items:Item[]) {
            this._items = items;
        }

        /**Clears the list. */
        public clear() {
            while(this._items.length > 0) {
                this.removeItemAt(0);
            }
            // for(let i = this._items.length - 1; i >= 0; i--)
            //     this.removeItemAt(i);

            this._index = -1;
        }


        public selectItem(index:number, onlyOne:boolean = true) {
            if(index < this._items.length) {
                if(this._index != -1 && onlyOne) { 
                    this._items[this._index].deselect();
                }

                this._index = index;
                this._items[index].select();
            }
        }
        public deselectItem(index:number) {
            if(index < this._items.length && index != -1) {
                this._items[index].deselect();
            }
        }

        public deselectAll() {
            for(let i = this._items.length-1; i >= 0; i--) {
                this._items[i].deselect();
            }
        }

        /**
         * Adds a listener to any selection in the list.  Selection must be called by a List Item.
         * @param callback The callback (index:number) to call when selection occurs in the list.
         */
        addSelectListener(callback:Function) {
            this._onSelectCallback = callback;
        }
        removeSelectListener() {
            this._onSelectCallback = null;
        }
        /*------------------------------------------ INTERFACES ---------------------------*/
        /*------------------------------------------ EVENTS -------------------------------*/
        /*------------------------------------------ GETS & SETS --------------------------*/
        public get Items():Item[] { return this._items; }

    }




    export class Item{
        private _node:HTMLElement;

        private _onSelectCallback:Function;
        private _clickEvent;

        constructor(node:HTMLElement) {
            this._node = node;
            this._clickEvent = () => this.select();


            // this._node.addEventListener("change", e => { 
            //     if(this._onSelectCallback != null) this._onSelectCallback(this._node.value); 
            // });
            
        }

        /*------------------------------------------ METHODS ------------------------------*/
        select() {
            this._node.classList.add("selected");
            if(this._onSelectCallback != null) this._onSelectCallback(this);
        }
        deselect() {
            this._node.classList.remove("selected");
        }
        wireSelector(element?:HTMLElement) {
            let node = element || this._node;
            node.addEventListener("mousedown", this._clickEvent);
        }
        // wireSelectEvent() {
        //     //test
        //     this._node.querySelector(".btnDelete").addEventListener("mousedown", () => {
        //         this.select();
        //     });
        // }
        addSelectListener(callback:Function) {
            this._onSelectCallback = callback;
        }
        removeSelectListener() {
            this._onSelectCallback = null;
        }

        destroy() {
            this._node.removeEventListener("mousedown", this._clickEvent);
            this._onSelectCallback = null;
            this._node.remove();
        }
        /*------------------------------------------ INTERFACES ---------------------------*/
        /*------------------------------------------ EVENTS -------------------------------*/
        /*------------------------------------------ GETS & SETS --------------------------*/
        public get Node():HTMLElement { return this._node; }

    }

}