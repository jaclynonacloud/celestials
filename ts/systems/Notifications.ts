///<reference path="./../components/ui/menus/statics/NotificationBar.ts" />
namespace celestials.systems {
    export interface INotification {
        message?:string;
        type?:string;
        date?:Date;
        clickHandler?:Function;
    }
    export class Notifications {
        public static get TYPE() { return Object.freeze({"Normal":"", "Success":"success", "Fail":"fail", "Notify":"notify"});}
        private static _instance:Notifications;
        private _notifications:INotification[];


        /*---------------------------------------------- METHODS -------------------------------------*/
        public static addNotification(message:string, type?:string, date?:Date, clickHandler?:Function) {
            Notifications.Instance._notifications.push({
                message : message,
                type : type,
                date : date || new Date(),
                clickHandler : clickHandler
            });

            //add the notification to the notifications bar
            ui.menus.NotificationBar.addNotification(message, type, clickHandler);
        }

        public static removeNotification(index:number) {
            Notifications.Instance._notifications.splice(index, 1);
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        private static get Instance() {
            if(Notifications._instance == null) {
                Notifications._instance = new Notifications();
                Notifications._instance._notifications = new Array();
            }
            return Notifications._instance;
        }
        public static get Notifications() { return Notifications.Instance._notifications; }

    }
}