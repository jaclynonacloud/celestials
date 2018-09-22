///<reference path="./../../components/List.ts" />
///<reference path="./NotificationPanel.ts" />
///<reference path="./../../../../systems/Notifications.ts" />

namespace celestials.ui.menus {
    export class NotificationBar extends OverlayMenu {
        public static get DEF_IDLE():number { return 1000; }
        public static get DEF_DURATION():number { return 3000; }
        private static _instance:NotificationBar;
        private _itemsList:components.List;

        private _durationTimer;
        private _idleTimer;
        private _idleTime;

        constructor(node:HTMLElement, nodeIdle?:HTMLElement, idleTime?:number) {
            super(node, null);
            NotificationBar._instance = this;

            this._node.querySelector(".popout").addEventListener("click", () => {
                //hide this
                this._clearIdle();
                this._clearDuration();
                this.hide();
                //show notification panel
                NotificationPanel.show();
            });

            //setup the list
            this._itemsList = new components.List(this._node.querySelector(".list"), this._node.querySelector(".list .item.template"), 5);

            //listen to idle, if it exists
            //idle reopens bar if idle has been moused over for long period of time
            console.log("IDLE");
            console.log(nodeIdle);
            if(nodeIdle != null) {
                console.log("GRUE");
                this._idleTime = idleTime || NotificationBar.DEF_IDLE;
                nodeIdle.addEventListener("mouseenter", this._onIdleEnter.bind(this));
                nodeIdle.addEventListener("mouseleave", this._onIdleExit.bind(this));
            }
            this._node.addEventListener("mouseenter", () => this._clearDuration());
            this._node.addEventListener("mouseleave", () => this._startDurationTimer(NotificationBar.DEF_DURATION));
        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        public static show() {
            console.log("AM I DISABLED?" + NotificationBar._instance._isDisabled);
            if(NotificationBar._instance._isDisabled) return;
            NotificationBar._instance.show();
        }
        public static enable() {
            NotificationBar._instance.enable();
        }
        public static disable() {
            NotificationBar._instance.disable();
            NotificationBar._instance.hide();
        }

        public static addNotification(notification:string, type?:string, clickCallback?:Function, duration?:number) {
            let item = NotificationBar._instance._itemsList.createItem();
            item.Node.innerHTML = notification;
            item.Node.classList.add("show");
            //read notification import CCP = CurrentCelestialsPanel
            if(type != null && type != "") item.Node.classList.add(`--${type}`);

            //listen to callback
            if(clickCallback != null) {
                item.Node.style.cursor = 'pointer';
                item.addSelectListener(clickCallback);
            }

            //add to list
            NotificationBar._instance._itemsList.addItemToList(item);

            //show bar, if allowed
            NotificationBar.show();

            //start timeout to hide
            NotificationBar._instance._startDurationTimer(duration || notification.length * 0.1 * 1000);

            //tell the panel
            NotificationPanel.update();

            //timeout show
            setTimeout(() => item.Node.classList.remove("show"), 2000);
        }
        public static clearNotifications() {
            NotificationBar._instance._itemsList.clear();
        }

        private _startDurationTimer(duration:number) {
            this._clearDuration();
            this._durationTimer = setTimeout(() => this.hide(), duration);
        }

        private _clearDuration() {
            if(this._durationTimer != null)
                App.Window.clearTimeout(this._durationTimer);
            this._durationTimer = null;
        }
        private _clearIdle() {
            if(this._idleTimer != null)
                App.Window.clearTimeout(this._idleTimer);
            this._idleTimer = null;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {

        }
        public unload() {
            
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onIdleEnter() {
            if(this._idleTimer != null) return;
            this._idleTimer = setTimeout(() => NotificationBar.show(), this._idleTime);
            this._clearDuration();
        }
        private _onIdleExit() {
            this._clearIdle();
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Items() { return NotificationBar._instance._itemsList.Items; }

    }
}