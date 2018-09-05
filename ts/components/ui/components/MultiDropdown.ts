///<reference path="Dropdown.ts" />
namespace celestials.ui.components {
    export class MultiDropdown extends Dropdown {
        private _headerTemplate:HTMLElement;
        private _indentNodeTemplate:HTMLElement;
        private _indentTemplate:HTMLElement;

        private _indents:HTMLElement[];

        constructor(node:HTMLElement, template:HTMLElement, headerTemplate:HTMLElement, indentNodeTemplate?:HTMLElement, indentTemplate?:HTMLElement) {
            super(node, template);
            
            this._headerTemplate = headerTemplate;
            this._indentNodeTemplate = indentNodeTemplate;
            this._indentTemplate = indentTemplate || this._itemTemplate;

            //hide the templates
            this._headerTemplate.classList.add("hide");
            this._indentNodeTemplate.classList.add("hide");
            this._indentTemplate.classList.add("hide");

            this._indents = new Array();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public createIndent():HTMLElement {
            //create a container
            let indent:HTMLElement = this._indentNodeTemplate.cloneNode(true) as HTMLElement;
            indent.classList.remove("template", "hide");
            let ul:HTMLUListElement = document.createElement("ul");

            this._indents.push(indent);
            return indent;
        }

        public addItemToLastIndent(node:HTMLElement, callback:Function) {
            let item:Item = new Item(node);
                item.wireSelector(item.Node);
                item.addSelectListener((select) => {
                    callback();
                });

                this._items.push(item);
                //put in view
                let indent:HTMLElement = this._indents[this._indents.length-1];
                if(indent instanceof HTMLUListElement) {
                    indent.appendChild(item.Node);
                }
                else {
                    let ul = indent.querySelector("ul");
                    ul.appendChild(item.Node);
                }
        }
        public addLastIndent(title:string) {
            //create the title
            let titleNode = this._headerTemplate.cloneNode(true) as HTMLElement;
            titleNode.innerHTML = title;
            titleNode.classList.remove("template", "hide");
            this._node.appendChild(titleNode);
            let titleIconNode = document.createElement("div");
            titleIconNode.innerHTML = "&#9655;";
            titleNode.appendChild(titleIconNode);
            //put in view
            this._node.appendChild(this._indents[this._indents.length-1]);
        }


        public async clear() {
            this.clearItems();
            //remove all the indents
            for(let i = this._indents.length-1; i >= 0; i--) {
                let indent = this._indents[i];
                this._indents.splice(i, 1);
                indent.parentNode.removeChild(indent);
                indent = null;
            }

            while (this._node.hasChildNodes()) {
                this._node.removeChild(this._node.lastChild);
            }
        }

        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
    }
}