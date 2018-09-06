 namespace celestials.managers {
    /**
     * 
    * 
    * 
    * Holds mouse registry dictionaries to organize (element, callback) pairings.
    */
    export interface IMouseRegistry {
        mousedown?:Dictionary<HTMLElement, Function>;
        mouseup?:Dictionary<HTMLElement, Function>;
        mouseover?:Dictionary<HTMLElement, Function>;
        mouseout?:Dictionary<HTMLElement, Function>;
        rightclick?:Dictionary<HTMLElement, Function>;
        drag?:Dictionary<HTMLElement, IDraggable>;
    }
    /**Holds mouse drag callback references. */
    export interface IDraggable {
        grabCallback?:Function;
        dragCallback?:Function;
        dropCallback?:Function;
    }
    export interface IMouseRegistryItem {
        key:string;
        element:HTMLElement;
        dictionary:Dictionary<HTMLElement, any>;
    }
    /**Handles the management of mouse states and allows DOM elements to register functions to the listeners of the states.*/
    export class MouseManager {
        private static _registry:IMouseRegistry;
        private static _registryItems:IMouseRegistryItem[];
        
        private static _activeElement:HTMLElement;

        private static _mousePosition:IPoint;
        private static _lastMousePosition:IPoint;

        constructor() {

            MouseManager._mousePosition = { x:0, y:0 };
            MouseManager._lastMousePosition = { x:0, y:0 };

            MouseManager._registry = {
                mousedown : new Dictionary(),
                mouseup : new Dictionary(),
                mouseout : new Dictionary(),
                mouseover : new Dictionary(),
                rightclick : new Dictionary(),
                drag : new Dictionary()
            }
            MouseManager._registryItems = new Array();

            App.Node.addEventListener("mousedown", this._onMouseDown.bind(this));
            App.Node.addEventListener("contextmenu", this._onRightClick.bind(this));
            App.Node.addEventListener("mousemove", this._onMouseMove.bind(this));
            App.Node.addEventListener("mouseup", this._onMouseUp.bind(this));
            //handle out of bounds
            App.Node.addEventListener("mouseenter", this._onMouseOver.bind(this));
            App.Node.addEventListener("mouseleave", this._onMouseOut.bind(this));
        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        /**
         * Registers an element to the mousedown registry with the given callback.
         * @param node The HTMLElement to register.
         * @param callback The function to call when mouse down on this node takes place.
         */
        public static listenForMouseDown(node:HTMLElement, callback:Function, key?:string) {
            //make sure is clickable
            node.setAttribute("data-clickable", "");
            MouseManager._registry.mousedown.add(node, callback);
            if(key != null) MouseManager._registryItems.push({key, element:node, dictionary:MouseManager._registry.mousedown});
        }
        /**
         * Registers an element to the mouseup registry with the given callback.
         * @param node The HTMLElement to register.
         * @param callback The function to call when mouse up on this node takes place.
         */
        public static listenForMouseUp(node:HTMLElement, callback:Function, key?:string) {
            //make sure is clickable
            node.setAttribute("data-clickable", "");
            MouseManager._registry.mouseup.add(node, callback);
            if(key != null) MouseManager._registryItems.push({key, element:node, dictionary:MouseManager._registry.mouseup});
        }
        /**
         * Registers an element to the mouseover registry with the given callback.
         * @param node The HTMLElement to register.
         * @param callback The function to call when mouse over on this node takes place.
         */
        public static listenForMouseOver(node:HTMLElement, callback:Function, key?:string) {
            //make sure is clickable
            node.setAttribute("data-clickable", "");
            MouseManager._registry.mouseover.add(node, callback);
            if(key != null) MouseManager._registryItems.push({key, element:node, dictionary:MouseManager._registry.mouseover});
        }
        /**
         * Registers an element to the mouseout registry with the given callback.
         * @param node The HTMLElement to register.
         * @param callback The function to call when mouse out on this node takes place.
         */
        public static listenForMouseOut(node:HTMLElement, callback:Function, key?:string) {
            //make sure is clickable
            node.setAttribute("data-clickable", "");
            MouseManager._registry.mouseout.add(node, callback);
            if(key != null) MouseManager._registryItems.push({key, element:node, dictionary:MouseManager._registry.mouseout});
        }
        /**
         * Registers an element to the right click registry with the given callback.
         * @param node The HTMLElement to register.
         * @param callback The function to call when right click on this node takes place.
         */
        public static listenForRightClick(node:HTMLElement, callback:Function, key?:string) {
            //make sure is clickable
            node.setAttribute("data-clickable", "");
            MouseManager._registry.rightclick.add(node, callback);
            if(key != null) MouseManager._registryItems.push({key, element:node, dictionary:MouseManager._registry.rightclick});
        }
        /**
         * Registers an element to the mousedown registry with the given callback.
         * @param node The HTMLElement to register.
         * @param grabCallback The function that will be called when the drag is first started.
         * @param dragCallback The function that will be called each frame the drag is continued.
         * @param dropCallback The function that will be called when the drag is released.
         */
        public static listenForDrag(node:HTMLElement, grabCallback:Function, dragCallback:Function, dropCallback:Function, key?:string) {
            //make sure is clickable
            node.setAttribute("data-clickable", "");
            
            MouseManager._registry.drag.add(node, { grabCallback, dragCallback, dropCallback });
            if(key != null) MouseManager._registryItems.push({key, element:node, dictionary:MouseManager._registry.drag});
        }


        public static removeListener(key?:string, node?:HTMLElement) {
            //if key AND node are set, ONLY remove the key from THAT element
            if(key != null && node != null) {
                //iterate through every registry item
                const items = MouseManager._registryItems;
                const itemKeys = items.map(item => item.key);
                for(const itemSet of items) {
                    if(itemSet.key == key && itemSet.element == node) {
                        //remove item from registry items and return
                        const item = items.splice(itemKeys.indexOf(key), 1)[0];
                        //remove from its dictionary array
                        item.dictionary.remove(item.element);
                    }
                }

            }
            if(key != null) {
                const items = MouseManager._registryItems;
                const index = items.map(item => item.key).indexOf(key);
                if(index == -1) return;
                //remove item from registry items and return
                const item = items.splice(index, 1)[0];
                //remove from its dictionary array
                item.dictionary.remove(item.element);
            }
            //if we are not using a key, look for node in lists
            //it will remove ALL instances it finds.  Specify a key if you want to target a particular event.
            else {
                if(node == null) return;
                for(let dictKey of Object.keys(MouseManager._registry)) {
                    const dict = MouseManager._registry[dictKey] as Dictionary<HTMLElement, any>;
                    if(dict.containsKey(node)) dict.remove(node);
                }
            }
        }


        /**
         * Enters the drag event.  Will not work as intended if the node element is not registered into the drag registry.
         * @param node The HTMLElement to active the drag with.
         */
        public static startDrag(node:HTMLElement) {
            MouseManager._activeElement = node;
        }
        

        /**
         * Simulates a mousedown call.
         * @param node The HTMLElement to activate the call with.
         * @param x (Optional) Sets the clientX value for the event.
         * @param y (Optional) Sets the clientY value for the event.
         */
        public static simuluateMouseDown(node:HTMLElement, x?:number, y?:number) {
            let mouseEvent:MouseEvent = new MouseEvent('mousedown', {
                bubbles : true,
                cancelable : true,
                clientX : x || MouseManager.MousePosition.x,
                clientY : y || MouseManager.MousePosition.y
            });

            node.dispatchEvent(mouseEvent);
        }
        /**
         * Simulates a mouseup call.
         * @param node The HTMLElement to activate the call with.
         * @param x (Optional) Sets the clientX value for the event.
         * @param y (Optional) Sets the clientY value for the event.
         */
        public static simluateMouseUp(node:HTMLElement, x?:number, y?:number) {
            let mouseEvent:MouseEvent = new MouseEvent('mouseup', {
                bubbles : true,
                cancelable : true,
                clientX : x || MouseManager.MousePosition.x,
                clientY : y || MouseManager.MousePosition.y
            });

            node.dispatchEvent(mouseEvent);
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onMouseDown(e:MouseEvent) {
            if(e.button != 0) return;
            let target:HTMLElement = (e.target as HTMLElement).closest("[data-clickable]") as HTMLElement;
            if(target == null) return;
            console.log(target);

            //get registries
            let { mousedown, drag } = MouseManager._registry;

            //first, check to see if we are dragging
            if(drag.containsKey(target)) {
                let { grabCallback } = drag.getValue(target);
                if(grabCallback != null)
                    grabCallback(e.clientX, e.clientY);
                //set active element
                MouseManager._activeElement = target;
                return;
            }
            //see if our target is registered
            if(mousedown.containsKey(target))
                mousedown.getValue(target)();
        }
        private _onRightClick(e:MouseEvent) {
            e.preventDefault();
            e.stopImmediatePropagation();
            let target:HTMLElement = (e.target as HTMLElement).closest("[data-clickable]") as HTMLElement;
            if(target == null) return;

            //get registries
            let { rightclick } = MouseManager._registry;

            //see if our target is registered
            if(rightclick.containsKey(target))
                rightclick.getValue(target)(e.clientX, e.clientY);
        }
        private _onMouseMove(e:MouseEvent) {
            //set mouse position
            MouseManager._lastMousePosition = MouseManager._mousePosition;
            MouseManager._mousePosition = { x: e.clientX, y: e.clientY };

            //get registries
            let { drag } = MouseManager._registry;

            //listen for drag
            if(MouseManager._activeElement != null) {
                //look for drag function
                if(drag.containsKey(MouseManager._activeElement)) {
                    let { dragCallback } = drag.getValue(MouseManager._activeElement);
                    if(dragCallback != null)
                        dragCallback(e.clientX, e.clientY);
                }
            }
        }
        private _onMouseUp(e:MouseEvent) {
            let target:HTMLElement = (e.target as HTMLElement).closest("[data-clickable]") as HTMLElement;
                if(target == null) return;

            //get registries
            let { mouseup, drag } = MouseManager._registry;
            
            //listen for release
            if(MouseManager._activeElement != null) {
                //look for drag function
                if(drag.containsKey(MouseManager._activeElement)) {
                    let { dropCallback } = drag.getValue(MouseManager._activeElement);
                    if(dropCallback != null)
                        dropCallback(e.clientX, e.clientY);
                    MouseManager._activeElement = null;
                    return;
                }
            }
            //listen for mouse up
            //see if our target is registered
            if(mouseup.containsKey(target))
            mouseup.getValue(target)(e.clientX, e.clientY);
        }

        private _onMouseOver(e:MouseEvent) {
            let target:HTMLElement = (e.target as HTMLElement).closest("[data-clickable]") as HTMLElement;
                if(target == null) return;
            
            //get registries
            let { mouseover } = MouseManager._registry;

            if(mouseover.containsKey(target))
                mouseover.getValue(target)(e.clientX, e.clientY);
        }
        private _onMouseOut(e:MouseEvent) {
            let target:HTMLElement = (e.target as HTMLElement).closest("[data-clickable]") as HTMLElement;
                if(target == null) return;

            //get registries
            let { mouseout } = MouseManager._registry;

            if(mouseout.containsKey(target))
                mouseout.getValue(target)(e.clientX, e.clientY);
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get MousePosition():IPoint { return MouseManager._mousePosition; }
        public static get LastMousePosition():IPoint { return MouseManager._lastMousePosition; }
        public static get Registry():IMouseRegistry { return MouseManager._registry; }
    }
}