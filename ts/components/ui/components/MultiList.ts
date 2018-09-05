///<reference path="List.ts" />
namespace celestials.ui.components {
    export interface IMultiListItem {
        lookup?:string;
        template?:HTMLElement;
    }

    export class MultiList extends List {

        private _templates:IMultiListItem[];

        constructor(node:HTMLElement, templates?:IMultiListItem[], maxItems?:number) {
            super(node, templates[0].template, maxItems);

            this._templates = templates;
            for(let template of templates)
                template.template.classList.add("hide");
        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        /**
         * Creates a template clone to build an item for this list from.
         * @param bubbleSelect If true, the select event will be fired if any part of the item is selected.
         */
        public createItemFromLookup(templateLookup:string, bubbleSelect:boolean = true):Item {
            let template = this._getTemplateFromLookup(templateLookup);
            if(template == null) return;

            let item:Item = new Item(template.template.cloneNode(true) as HTMLElement);  
            item.Node.classList.remove("template");
            item.Node.classList.add("hide");

            if(bubbleSelect) {
                item.Node.addEventListener("click", () => item.select());
            }

            //attach us to the item for listening
            item.addSelectListener((selected:Item) => {
                //find our index
                this._index = this.Items.indexOf(selected);
                //call our select callback, if there is one
                if(this._onSelectCallback != null) this._onSelectCallback(this._index); 
            });

            //return the item, in case it needs to be expanded on
            return item;
        }

        private _getTemplateFromLookup(lookup:string) {
            for(let template of this._templates)
                if(template.lookup == lookup)
                    return template;
            return null;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/

    }
}