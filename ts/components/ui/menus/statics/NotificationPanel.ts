///<reference path="./../../components/List.ts" />
///<reference path="./../../../../systems/Notifications.ts" />
///<reference path="./NotificationBar.ts" />

namespace celestials.ui.menus {
    export class NotificationPanel extends OverlayMenu {
        private static _instance:NotificationPanel;

        private _itemsList:components.List;

        constructor(node:HTMLElement) {
            super(node, null);
            NotificationPanel._instance = this;

            //setup the exit
            this._node.querySelector(".ui.close").addEventListener("click", () => NotificationPanel._instance.hide());
            //setup the list
            this._itemsList = new components.List(this._node.querySelector(".list"), this._node.querySelector(".list .item.template"));

            this.hide();
        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        public static show() {
            NotificationPanel._instance.show();

            NotificationPanel.update();            
        }

        public static update() {
            let itemsList = NotificationPanel._instance._itemsList;
            itemsList.clear();
            //show any notifications
            //read in ascending order
            let notifications = systems.Notifications.Notifications;
            for(let i = notifications.length-1; i >= 0; i--) {
                let itemData = notifications[i];
                let item = itemsList.createItem();
                item.Node.classList.add(`--${itemData.type}`);
                item.Node.querySelector(".message").innerHTML = itemData.message;
                //setup listener
                if(itemData.clickHandler != null) {
                    item.Node.style.cursor = 'pointer';
                    item.addSelectListener(itemData.clickHandler)
                }
                //add time stamp
                let timeNode = item.Node.querySelector(".time");
                let dateOptions = { month:'long', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric', second:'numeric'}
                timeNode.innerHTML = itemData.date.toLocaleDateString('us-EN', dateOptions);
                itemsList.addItemToList(item);
            }
        }
        
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {

        }
        public unload() {
            
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/

    }
}