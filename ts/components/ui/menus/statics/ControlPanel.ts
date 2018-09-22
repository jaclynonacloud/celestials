///<reference path="./../../components/ToggleGroup.ts" />
namespace celestials.ui.menus {
    export class ControlPanel extends OverlayMenu {
        private static _instance:ControlPanel;

        private _celestialSpawnButton:HTMLElement;
        private _celestialsListButton:HTMLElement;
        private _notificationsButton:HTMLElement;

        constructor(node:HTMLElement) {
            super(node, null);
            ControlPanel._instance = this;
            this._node = node;



            //handle close
            this._node.querySelector(".ui.close").addEventListener("click", () => ControlPanel.hide());

            //create the toggles
            let useMoods = new components.ToggleGroup(this._node.querySelector("[data-checkbox='use-moods']"),
                null,
                this._onUseMoods.bind(this)
            );
            let allowNotifications = new components.ToggleGroup(this._node.querySelector("[data-checkbox=allow-notifications"),
                null,
                this._onAllowNotifications.bind(this)
            );
            let useWeather = new components.ToggleGroup(this._node.querySelector("[data-checkbox=use-weather"),
                null,
                this._onUseWeather.bind(this)
            );
            let developerMode = new components.ToggleGroup(this._node.querySelector("[data-checkbox=dev-mode]"), 
                this._node.querySelector("[data-checkbox-collapse=dev-mode]"), 
                this._onDevMode.bind(this)
            );
            let showOverlays = new components.ToggleGroup(this._node.querySelector("[data-checkbox='show-overlays']"),
                null,
                this._onShowOverlays.bind(this)
            );
            let showConsole = new components.ToggleGroup(this._node.querySelector("[data-checkbox='show-console']"),
                null,
                this._onShowConsole.bind(this)
            );
            
            //wire the buttons
            this._celestialSpawnButton = this._node.querySelector("[data-button='show-celestial-spawner']");
            this._celestialsListButton = this._node.querySelector("[data-button='show-celestial-list']");
            this._notificationsButton = this._node.querySelector("[data-button='show-notifications']");

            this._node.classList.remove("opacity-0");
            ControlPanel.hide();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public static show() {
            ControlPanel._instance.show();
        }

        public static hide() {
            ControlPanel._instance.hide();
        }

        public static toggleConsole(on?:boolean, getValue?:boolean) {
            let node = ControlPanel._instance._node.querySelector("[data-checkbox='show-console']") as HTMLInputElement;
            if(getValue != null) return node.checked;
            if(on) node.checked = true;
            else node.checked = false;
            return node.checked;
        }
        public static toggleOverlays(on?:boolean, getValue?:boolean) {
            let node = ControlPanel._instance._node.querySelector("[data-checkbox='show-overlays']") as HTMLInputElement;
            if(getValue != null) return node.checked;
            if(on) node.checked = true;
            else node.checked = false;
            return node.checked;
        }

        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {
            managers.MouseManager.listenForMouseUp(this._celestialSpawnButton, ()=>this._onShowCelestialSpawner(), "controlPanel_celSpawnButton");
            managers.MouseManager.listenForMouseUp(this._celestialsListButton, ()=>this._onShowCelestialList(), "controlPanel_celListButton");
            managers.MouseManager.listenForMouseUp(this._notificationsButton, ()=>this._onShowNotifications(), "controlPanel_notificationsButton");
        }
        public unload() {
            managers.MouseManager.removeListener("controlPanel_celSpawnButton");
            managers.MouseManager.removeListener("controlPanel_celListButton");
            managers.MouseManager.removeListener("controlPanel_notificationsButton");
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onAllowNotifications(checked:boolean) {
            //TODO set some global value to stop allowing
            //notify
            if(checked) {
                ui.menus.NotificationBar.enable();
                systems.Notifications.addNotification("Turned on notifications!", systems.Notifications.TYPE.Notify, null, () => ControlPanel.show());
            } 
            else {
                ui.menus.NotificationBar.disable();
            }
        }
        private _onUseMoods(checked:boolean) {
            App.UsesMood = checked;
            if(checked) CelestialDetails.showMood();
            else CelestialDetails.hideMood();
        }
        private _onUseWeather(checked:boolean) {
            systems.Weather.UseWeather = checked;
            console.log("SWITCH: " + checked);
            if(checked) {
                //TODO set to clear
                systems.Weather.Instance.changeWeather(systems.Weather.CurrentWeather);
            }
            if(!checked) systems.Weather.Instance.killWeather();
        }
        private _onShowCelestialSpawner() {
            console.log("SHWO SPANWR");
            CelestialsPanel.show();
        }
        private _onShowCelestialList() {
            CurrentCelestialsPanel.show();
        }
        private _onShowNotifications() {
            ui.menus.NotificationPanel.show();
        }
        private _onDevMode(checked:boolean) {
            console.log("DEV MODE: " + checked);
            if(!checked) {
                //simulate turning off the options
                this._onShowOverlays(false);
                this._onShowConsole(false);
            }
            //put settings to their desired state
            else {
                let overlays = ControlPanel.toggleOverlays(null, true);
                let console = ControlPanel.toggleConsole(null, true);
                this._onShowOverlays(overlays);
                this._onShowConsole(console);
            }
        }
        private _onShowOverlays(checked:boolean) {
            //toggle the collision bounds boxes
            systems.Collision.showCollisionBounds(checked);
            //toggle the reg point divs
            for(let cel of managers.CelestialsManager.Celestials) {
                cel.showRegistrationPoint(checked);
            }
        }
        private _onShowConsole(checked:boolean) {
            if(checked) systems.Console.Instance.open();
            else systems.Console.Instance.close();
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/


    }
}