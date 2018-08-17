///<reference path="./../managers/InputManager.ts" />
///<reference path="./../managers/CelestialsManager.ts" />
namespace celestials.systems {
    import InputManager = managers.InputManager;
    import CelestialsManager = managers.CelestialsManager;

    export class Debugger {
        private static _instance:Debugger;
        private _openMenuKey:number[];
        private _closeMenuKey:number[];

        constructor() {
            Debugger._instance = this;

            //debug
            let randoVelocityKey = [Key.Code.a];
            InputManager.addBinding("debug__velocity", new KeyBinding(this._randomVelocity.bind(this), KeyBinding.State.Down, ...randoVelocityKey));

            let leftKey = [Key.Code["left arrow"]];
            InputManager.addBinding("debug__left", new KeyBinding(this._sendLeft.bind(this), KeyBinding.State.Down, ...leftKey));

            let rightKey = [Key.Code["right arrow"]];
            InputManager.addBinding("debug__right", new KeyBinding(this._sendRight.bind(this), KeyBinding.State.Down, ...rightKey));

            let upKey = [Key.Code["up arrow"]];
            InputManager.addBinding("debug__up", new KeyBinding(this._sendUp.bind(this), KeyBinding.State.Down, ...upKey));

            let downKey = [Key.Code["down arrow"]];
            InputManager.addBinding("debug__down", new KeyBinding(this._sendDown.bind(this), KeyBinding.State.Down, ...downKey));

            let snapUpKey = [Key.Code.o];
            InputManager.addBinding("debug__snapUp", new KeyBinding(this._snapToTop.bind(this), KeyBinding.State.Down, ...snapUpKey));



            let spawnCelestialKey = [Key.Code.z];
            InputManager.addBinding("debug__spawnCelestial", new KeyBinding(this._spawnCelestial.bind(this), KeyBinding.State.Down, ...spawnCelestialKey));

            let flipCelestialXKey = [Key.Code.x];
            InputManager.addBinding("debug__flipCelestialX", new KeyBinding(this._flipCelestialX.bind(this), KeyBinding.State.Down, ...flipCelestialXKey));

            let switchStateKey = [Key.Code.v];
            InputManager.addBinding("debug__switchStateCelestial", new KeyBinding(this._switchState.bind(this), KeyBinding.State.Down, ...switchStateKey));


            let pauseKey = [Key.Code.p];
            InputManager.addBinding("debug__pauseApp", new KeyBinding(this._togglePause.bind(this), KeyBinding.State.Down, ...pauseKey));

            let controlPanelKey = [Key.Code.c];
            InputManager.addBinding("debug__openControlPanel", new KeyBinding(this._openControlPanel.bind(this), KeyBinding.State.Down, ...controlPanelKey));

            let celestialsPanelKey = [Key.Code.m];
            InputManager.addBinding("debug__openCelestialsPanel", new KeyBinding(this._openCelestialsPanel.bind(this), KeyBinding.State.Down, ...celestialsPanelKey));

            let currentCelestialsPanelKey = [Key.Code.comma];
            InputManager.addBinding("debug__openCurrentCelestialsPanel", new KeyBinding(this._openCurrentCelestialsPanel.bind(this), KeyBinding.State.Down, ...currentCelestialsPanelKey));

            let notificationPanelKey = [Key.Code.j];
            InputManager.addBinding("debug__showNotificationPanel", new KeyBinding(this._openNotificationPanel.bind(this), KeyBinding.State.Down, ...notificationPanelKey));

            let addNotificationKey = [Key.Code.n];
            InputManager.addBinding("debug__addNotification", new KeyBinding(this._addNotification.bind(this), KeyBinding.State.Down, ...addNotificationKey));

            let deleteLastCelestialKey = [Key.Code["numpad 0"]];
            InputManager.addBinding("debug__deleteLastCelestial", new KeyBinding(this._deleteLastCelestial.bind(this), KeyBinding.State.Down, ...deleteLastCelestialKey));
        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        private _randomVelocity() {
            console.log("Rando Vel");
            //look for celestials
            for(let i = 0; i < CelestialsManager.Celestials.length; i++) {
                //add rando velocity to each
                let celestial:entities.Celestial = CelestialsManager.Celestials[i];
                let x = randomRange(-150, 150);
                let y = randomRange(-150, 0);
                celestial.Physics.addForceX(x);
                celestial.Physics.addForceY(y);

                let grav = randomRange(2, 15);
                celestial.Physics.setGravity(grav);
            }
        }

        private _sendLeft() {
            for(let cel of CelestialsManager.Celestials)
                cel.Physics.addForceX(-100);
        }
        private _sendRight() {
            for(let cel of CelestialsManager.Celestials)
                cel.Physics.addForceX(100);
        }
        private _sendUp() {
            for(let cel of CelestialsManager.Celestials)
                cel.Physics.addForceY(-200);
        }
        private _sendDown() {
            for(let cel of CelestialsManager.Celestials)
                cel.Physics.addForceY(200);
        }

        private _snapToTop() {
            for(let cel of CelestialsManager.Celestials)
                cel.Physics.snapToTop();
        }

        private _spawnCelestial() {
            CelestialsManager.addCelestial("solaris");
        }

        private _flipCelestialX() {
            for(let celestial of CelestialsManager.Celestials)
                celestial.flipX();
        }

        private _switchState() {
            //switch to walk
            for(let celestial of CelestialsManager.Celestials)
                celestial.Sequencer.changeState(engines.CelestialSequencer.STATE.Walk);
        }


        private _togglePause() {
            if(App.Paused) App.resume();
            else App.pause();
        }

        private _openControlPanel() {
            ui.menus.ControlPanel.show();
        }
        private _openCelestialsPanel() {
            ui.menus.CelestialsPanel.show();
        }
        private _openCurrentCelestialsPanel() {
            ui.menus.CurrentCelestialsPanel.show();
        }
        private _openNotificationPanel() {
            ui.menus.NotificationPanel.show();
        }

        private _addNotification() {
            systems.Notifications.addNotification("This is a test notification!");
        }

        private _deleteLastCelestial() {
            managers.CelestialsManager.removeCelestial(managers.CelestialsManager.Celestials[managers.CelestialsManager.Celestials.length-1]);        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/

    }
}