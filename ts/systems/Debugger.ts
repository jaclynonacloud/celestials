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



            let spawnCelestialKey = [Key.Code.z];
            InputManager.addBinding("debug__spawnCelestial", new KeyBinding(this._spawnCelestial.bind(this), KeyBinding.State.Down, ...spawnCelestialKey));

            let flipCelestialXKey = [Key.Code.x];
            InputManager.addBinding("debug__flipCelestialX", new KeyBinding(this._flipCelestialX.bind(this), KeyBinding.State.Down, ...flipCelestialXKey));

            let switchStateKey = [Key.Code.v];
            InputManager.addBinding("debug__switchStateCelestial", new KeyBinding(this._switchState.bind(this), KeyBinding.State.Down, ...switchStateKey));


            let pauseKey = [Key.Code.p];
            InputManager.addBinding("debug__pauseApp", new KeyBinding(this._togglePause.bind(this), KeyBinding.State.Down, ...pauseKey));
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
                celestial.Sequencer.changeState(engines.CelestialSequencer.State.Walk);
        }


        private _togglePause() {
            if(App.Paused) App.resume();
            else App.pause();
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/

    }
}