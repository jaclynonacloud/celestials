///<reference path="./../../components/MultiList.ts" />
///<reference path="./../overlays/Tooltip.ts" />
namespace celestials.ui.menus {
    export class CelestialsPanel extends OverlayMenu {
        private static _instance:CelestialsPanel;

        private static _celestialsList:components.MultiList;
        private _eventsRegistry:Dictionary<string, any>;

        constructor(node:HTMLElement) {
            super(node, null);
            CelestialsPanel._instance = this;

            this._node.querySelector(".ui.close").addEventListener("click", () => this.hide());

            CelestialsPanel._celestialsList = new components.MultiList(
                this._node.querySelector(".list"), [
                    {"lookup" : "normal", "template" : this._node.querySelector(".item.celestial")},
                    {"lookup" : "locked", "template" : this._node.querySelector(".item.celestial--locked")}
                ]);
            
            this.hide();
            
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public static async show() {
            CelestialsPanel._instance.show();

            CelestialsPanel._celestialsList.clear();
            //update list with celestials
            let celestials:entities.Celestial[] = managers.CelestialsManager.Templates;

            celestials = celestials.sort((a,b) => {
                let lookup = a.Lookup.localeCompare(b.Lookup);
                if(a.Data.locked && b.Data.locked) return lookup;
                if(lookup < 0 && a.Data.locked) return 1;
                return lookup;
            });

            console.log("MAKE THE ICONS");
            //TODO, if they are locked, show lock
            for(let cel of celestials) {
                //create item
                let locked:boolean = cel.Data.locked || false;
                let item = CelestialsPanel._celestialsList.createItemFromLookup((!locked) ? "normal" : "locked");
                if(!locked) {
                    item.Node.querySelector(".name").innerHTML = cel.Lookup;
                    await cel.getIcon()
                        .then(src => item.Node.querySelector("img").src = src);
                    Tooltip.addTooltip(item.Node, `Click to spawn ${cel.Name}!`);

                    managers.MouseManager.listenForMouseDown(item.Node, (x,y) => CelestialsPanel._instance._onCelestialsItemClicked(item, x, y));

                    //fix image problem
                    (item.Node.querySelector("img") as HTMLElement).ondragstart = function() { return false; }
                }
                else {
                    let message = 'This celestial is currently locked.  Be patient!';
                    managers.MouseManager.listenForMouseDown(item.Node, (x,y) => Tooltip.showTooltip(message, x, y, Tooltip.getMessageDuration(message)));
                    Tooltip.addTooltip(item.Node, message);
                }

                //add item to list
                CelestialsPanel._celestialsList.addItemToList(item);
            }
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {

        }
        public unload() {
            //kill the item events
            for(let item of CelestialsPanel._celestialsList.Items)
                managers.MouseManager.removeListener(null, item.Node);
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private async _onCelestialsItemClicked(item:components.Item, x:number, y:number) {
            console.log("CLICKED");
            //read the item's name to create the lookup template
            let template = item.Node.querySelector(".name").innerHTML;
            let cel:entities.Celestial = await managers.CelestialsManager.addCelestialByLookupAtPosition(template, x, y);
            if(cel != null) {
                //fake grab
                managers.CelestialsManager.onGrab(cel, x, y);
                //drag the celestial
                managers.MouseManager.startDrag(cel.Node);
            }
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/


    }
}