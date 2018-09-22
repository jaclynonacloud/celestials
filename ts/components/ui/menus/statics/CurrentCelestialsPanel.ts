namespace celestials.ui.menus {
    import Celestial = entities.Celestial;
    export class CurrentCelestialsPanel extends OverlayMenu {
        private static _instance:CurrentCelestialsPanel;
        private _itemTemplate:HTMLElement;
        private _itemList:components.List;

        private _sortType:string;
        private _selectedItem:CurrentCelestialsItem;

        constructor(node:HTMLElement) {
            super(node, null);
            const CCP = CurrentCelestialsPanel;
            CCP._instance = this;
            this._sortType = "";

            CCP._instance._itemTemplate = this._node.querySelector(".item.celestial");
            this._node.querySelector(".ui.close").addEventListener("click", () => CCP.hide());

            //create list
            CCP._instance._itemList = new components.List(
                this._node.querySelector(".list"),
                this._node.querySelector(".item.celestial")
            );
            CCP._instance._itemList.addSelectListener((index, item) => CCP._onSelectItem(item));

            //create radios listener
            let sortRadios = this._node.querySelectorAll("input[name='sort']");
            for(let i = 0; i < sortRadios.length; i++) {
                sortRadios[i].addEventListener("change", () => CCP._onRadioSelect((sortRadios[i] as HTMLInputElement).value))
            }


            //load up celestials ONCE
            // create all the celestial items
            // CCP._instance._itemList.clear();
            // for(let cel of managers.CelestialsManager.Celestials) {
            //     let item = CCP.createItem(cel);
            //     //add item to list
            //     CCP._instance._itemList.addItemToList(item);
            // }

            //start sort at name
            // CCP.changeSortType('name');

            //listen to celestial manager for global change
            managers.CelestialsManager.listenForCelestialChanges((change) => CCP._onCelestialChange(change));
            
            CurrentCelestialsPanel.hide();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public static async show() {
            const CCP = CurrentCelestialsPanel;
            CCP._instance.show();

            CCP._instance._itemList.clear();
            for(let cel of managers.CelestialsManager.Celestials) {
                let item = CCP.createItem(cel);
                //add item to list
                CCP._instance._itemList.addItemToList(item);
            }

            if(CCP._instance._sortType == "")
                await CCP.changeSortType("name");


            //resort the items
            else await CCP.sortItems();
        }
        public static hide() {
            const CCP = CurrentCelestialsPanel;
            CCP._instance.hide();
            if(CCP._instance._selectedItem != null) {
                CCP._instance._selectedItem.deselect();
                CCP._instance._selectedItem = null;
            }
        }

        public static async selectCelestial(celestial:Celestial) {
            const CCP = CurrentCelestialsPanel;
            //if we are not showing, show now
            if(!CCP._instance._isShowing) await CCP.show();

            //find the item that has the celestial
            let item = CCP.findItemByCelestial(celestial);
            if(item == null) return;
            //select this celestial
            CCP._instance._itemList.selectItem(CCP._instance._itemList.Items.indexOf(item));
            item.Node.scrollIntoView();
        }

        public static createItem(celestial:Celestial) {
            const CCP = CurrentCelestialsPanel;
            let item = new CurrentCelestialsItem(CCP._instance._itemTemplate.cloneNode(true) as HTMLElement, celestial,
                //onchange
                (item) => CCP._onChangeItem(item),
                //onremove
                (item) => CCP._onRemoveItem(item),
                //onupdate
                (item) => CCP._onUpdateItem(item)
            );
            CCP._instance._itemList.setupItem(item);
            item.Node.addEventListener("click", () => {    
                CCP.selectCelestial(item.Celestial);
            });
            return item;
        }

        public static async changeSortType(value:string) {
            const CCP = CurrentCelestialsPanel;
            CCP._instance._sortType = value;
            console.log("CHANGED TO: " + value);
            await CCP.sortItems();
            
            //if we have a selected element, scroll it into view
            if(CCP._instance._selectedItem != null) {
                CCP._instance._itemList.deselectAll();
                //reselect the item
                CCP.selectCelestial(CCP._instance._selectedItem.Celestial);
                CCP._instance._selectedItem.Node.scrollIntoView();
            }
        }


        private static findItemByCelestial(celestial:Celestial):CurrentCelestialsItem {
            const CCP = CurrentCelestialsPanel;
            for(let item of CCP._instance._itemList.Items)
                if((item as CurrentCelestialsItem).Celestial == celestial)
                    return item as CurrentCelestialsItem;
            return null;
        }

        private static sortItem(item:CurrentCelestialsItem) {
            const CCP = CurrentCelestialsPanel;
            //remove item from list temporarily 
            CCP._instance._itemList.removeItem(item, false);
            //get sort index
            let index = CCP.getSortIndex(item);
            //add to list at that position
            CCP._instance._itemList.addItemAt(item, index);
        }

        private static getSortIndex(item:CurrentCelestialsItem) {
            const CCP = CurrentCelestialsPanel;
            let items = CCP._instance._itemList.Items.map(item => item as CurrentCelestialsItem);

            let index = -1;
            let sortType = CurrentCelestialsPanel._instance._sortType;
            for(let i = 0; i < items.length; i++) {
                index++;
                let compareCel:entities.Celestial = items[i].Celestial;
                if(compareCel == item.Celestial) continue;
                if(sortType == 'name')
                    if(item.Celestial.Name.localeCompare(compareCel.Name) < 0) return index;
                if(sortType == 'type') {
                    if(item.Celestial.Lookup.localeCompare(compareCel.Lookup) < 0) return index;
                    if(item.Celestial.Name.localeCompare(compareCel.Name) < 0) return index;
                }
                if(sortType == 'date')
                    if(item.Celestial.DateSpawned.getTime() > compareCel.DateSpawned.getTime()) return index;                

            }
            return index += 1;
        }

        private static async sortItems() {
            return new Promise((res, rej) => {

                const CCP = CurrentCelestialsPanel;
                console.log(CCP._instance._itemList.Items.length);
                let items = CCP._instance._itemList.Items.map(item => item as CurrentCelestialsItem);
                console.log(items);
                
                // console.log(CCP._instance._itemList.Items);
    
                switch(CCP._instance._sortType) {
                    case 'name':
                        items = items.sort((a,b) => {
                            return a.Celestial.Name.localeCompare(b.Celestial.Name);
                        });
                        break;
                    case 'type':
                        items = items.sort((a,b) => {
                            return a.Celestial.Lookup.localeCompare(b.Celestial.Lookup);
                        });
                        break;
                    case 'date':
                        items = items.sort((a,b) => {
                            if(a.Celestial.DateSpawned.getTime() > b.Celestial.DateSpawned.getTime()) return -1;
                            else if(a.Celestial.DateSpawned.getTime() < b.Celestial.DateSpawned.getTime()) return 1;
                            return 0;
                        });
                        break;
                }
    
                //layout by new list
                CCP._instance._itemList.clear();
                for(let item of items) {
                    CCP._instance._itemList.addItemToList(item);
                }
                CCP._instance._itemList.setItems(items);
                res();

            });
           

        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {

        }
        public unload() {
            const CCP = CurrentCelestialsPanel;
            CCP._instance._itemList.clear();
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private static _onSelectItem(item:CurrentCelestialsItem) {
            const CCP = CurrentCelestialsPanel;
            if(CCP._instance._selectedItem == item) return;
            //if the last item was not deselected, force deselect
            if(CCP._instance._selectedItem != null) CCP._instance._selectedItem.deselect();
            CCP._instance._selectedItem = item;

            //if the details panel is open, switch to this celestial
            if(CelestialDetails.isShowing)
                CelestialDetails.show(CCP._instance._selectedItem.Celestial);
        }
        private static _onRadioSelect(value:string) {
            const CCP = CurrentCelestialsPanel;
            //change the sort type
            CCP.changeSortType(value);
        }
        private static _onChangeItem(item:CurrentCelestialsItem) {
            const CCP = CurrentCelestialsPanel;
            //resort the item
            CCP.sortItem(item);            
        }
        private static _onRemoveItem(item:CurrentCelestialsItem) {
            const CCP = CurrentCelestialsPanel;
            //delete the celestial
            managers.CelestialsManager.removeCelestial(item.Celestial);
            //the above action will call the global, oncelestialchange
            //remove the item
            // CCP._instance._itemList.removeItem(item);

        }

        private static _onUpdateItem(item:CurrentCelestialsItem) {
            const CCP = CurrentCelestialsPanel;
            //resort the item
            CCP.sortItem(item);
        }

        private static _onCelestialChange(change:managers.ICelestialsChange) {
            const CCP = CurrentCelestialsPanel;
            if(change == null) return;
            //check what type of action we are taking
            if(change.delete != null) {
                //remove the item
                let item = this.findItemByCelestial(change.delete);
                if(item != null) CCP._instance._itemList.removeItem(item, false);
            }
            if(change.add != null) {
                let item = CCP.createItem(change.add);
                // CCP._instance._itemList.addItemToList(item);
                //TODO: add the item properly into the list
                CCP.sortItem(item);
            }
        }

        
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Instance():CurrentCelestialsPanel { return CurrentCelestialsPanel._instance; }

    }
    ;
}