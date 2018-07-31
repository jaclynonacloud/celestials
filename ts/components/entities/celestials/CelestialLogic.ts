///<reference path="./../engines/Physics.ts" />
namespace celestials.logic {
    import Celestial = entities.Celestial;
    import Physics = engines.Physics;

    export interface ICelestialLogic {
        updateRate?:number; //how often the update will be called
        eagerness?:number; //how many large a tick will be (1-tiny increase, 100-unrealistic increase)
        attentionSpan?:number; /*how attentive the Celestial is (0-No attention span, constantly changing action states, 100-Rarely changes action states)*/
    }
    
    export class CelestialLogic implements ILoadable, IUpdateable {
        private _celestial:Celestial;
        private _updateRate:number;
        private _eagerness:number;
        private _attentionSpan:number;

        private _tick:number;
        private _updateTick:number;

        constructor(celestial:Celestial, data:ICelestialLogic) {
            this._celestial = celestial;
            this._updateRate = 1;
            this._eagerness = 1;
            this._attentionSpan = 50;

            this._tick = 0;
            this._updateTick = 0;

            //check for data
            if(data != null) {
                if(data.updateRate != null) this._updateRate = clamp(data.updateRate, 1, 1000);
                if(data.eagerness != null) this._eagerness = clamp(data.eagerness, 1, 100);
                if(data.attentionSpan != null) this._attentionSpan = clamp(data.attentionSpan, 0, 100);
            }
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        /**
         * Ask for next logical action.
         */
        public next() {
            this._tick += this._eagerness;
            let attentionSpan:number = this._attentionSpan;
            let attention:number = randomRangeInt(this._tick, 100);

            console.log(`TICK:${this._tick}, ATTENTION:${attention}, SPAN:${attentionSpan}`);
            //check to see if attention span has been surpassed
            if(attention > attentionSpan) {
                //change state
                //TODO create a hierarchy for state selection
                console.log("CHANGE STATE!");
                let state:string = this._celestial.Sequencer.changeState(this._celestial.Sequencer.getRandomState());
                //TODO create a hierarchy for sequence selection
                let sequence:engines.ICelestialSequence = this._celestial.Sequencer.getRandomStateSequence(state);
                this._celestial.Sequencer.changeSequence(sequence);

                //reset tick
                this._tick = 0;
            }
            else {
                console.log("I'm not bored yet!");
                //if our attention span is not reached, just pick another action
                let sequence:engines.ICelestialSequence = this._celestial.Sequencer.getRandomStateSequence(this._celestial.Sequencer.CurrentState);
                this._celestial.Sequencer.changeSequence(sequence);
            }



            //get a random number
            let random:number = randomRange(0, 1);
            //don't flip on climb
            if(this._celestial.Sequencer.CurrentState != engines.CelestialSequencer.State.Climb) {
                console.log("I wanna flip!");
                let wantToFlipX:number = lerp((this._eagerness * 5), 100, random);
                if(wantToFlipX > this._attentionSpan) this._celestial.flipX();
            }
            
        }

        /**
         * Called by Physics engine when wall is hit.
         * @param which The wall that was hit.  Defined by Physics.Wall
         */
        public handleWallHit(which:number) {
            //flip us if we hit the edges
            if(which == Physics.Wall.Left || which == Physics.Wall.Right) {
                //TODO see if we want to climb - 50/50
                if(randomRange(0, 1) > 0) {
                    //start the climb
                    let state:string = this._celestial.Sequencer.changeState(engines.CelestialSequencer.State.Climb);
                    //if we can't climb, abort!
                    if(state != engines.CelestialSequencer.State.Climb) return;
                    //try to get a climb sequence
                    let sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                    if(sequence != null) {
                        this._celestial.Sequencer.changeSequence(sequence);
                        //wait for frame to draw -- so physics can be accurate
                        this._celestial.drawCurrentFrame()
                            .then(() => {
                                console.log("6-Handle Wall");
                                this.reset();
                                //snap to respective all
                                switch(which) {
                                    case Physics.Wall.Left:
                                        this._celestial.Physics.snapToLeft();
                                        this._celestial.setDirectionX(1);
                                        break;
                                    case Physics.Wall.Right:
                                        this._celestial.Physics.snapToRight();
                                        this._celestial.setDirectionX(-1);
                                }
                            });
                        
                    }
                    //if we couldn't find a climb, pretend we didn't try
                    // else
                    //     this.next();
                }
            }
        }

        handleStateComplete() {
            let state:string = this._celestial.Sequencer.CurrentState;

            //is it real?
                //uses the state name to look for a function matching this: _complete[State]
                let funcName:string = `_complete${state[0].toUpperCase()}${state.substr(1)}`;
                if(this[funcName] != null)
                    this[funcName]();
        }

        public reset() {
            this._tick = 0;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {
            return new Promise((resolve, reject) => {

                try {
                    //set the first sequence
                    let state:string = this._celestial.Sequencer.changeState(this._celestial.Sequencer.getRandomState());
                    let sequence:engines.ICelestialSequence = this._celestial.Sequencer.getRandomStateSequence(state);
                    this._celestial.Sequencer.changeSequence(sequence);
                    let frameName = this._celestial.Sequencer.CurrentFrame.name;
                    this._celestial.draw(this._celestial.getImage(frameName))
                        .then((img) => {
                            resolve();
                            console.log("LOADED FIRST LOGIC");
                        });
                    
                }
                catch(e) {
                    reject(new Error("Could not load Logic on " + this._celestial.Name + "\n" + e));
                }

            });
            
        }
        public unload() {

        }

        public update() {
            return new Promise((resolve, reject) => {
                

                //handle states
                let state:string = this._celestial.Sequencer.CurrentState;
                console.log("STATE: " + state);

                //is it real?
                //uses the state name to look for a function matching this: _handle[State]
                let funcName:string = `_handle${state[0].toUpperCase()}${state.substr(1)}`;
                if(this[funcName] != null)
                    this[funcName]();


                resolve();
            });
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/


        /*---------------------------------------------- STATES --------------------------------------*/
        private _handleIdles() {
            //do nothing yet...
        }
        private _handleWalks() {
            let frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            //get the walk properties
            let moveSpeed:number = frame.moveSpeed;
            let jumpForce:number = frame.jumpForce;
            //look for property value
            if(moveSpeed != null)
                this._celestial.Physics.addForceX(moveSpeed * this._celestial.Direction.x);
            if(jumpForce != null)
                this._celestial.Physics.addForceY(-jumpForce);
        }


        private _handleClimbs() {
            let frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            this._celestial.Physics.setGravity(0);
            //get the climb properties
            let moveSpeed:number = frame.moveSpeed || 10;
            //set the property
            this._celestial.Physics.addForceY(-moveSpeed);
        }
        private _completeClimbs() {
            console.log("JUMP OFF WALL!");
            console.log("LAST TOUCHED WALL: " + this._celestial.Physics.LastTouchedWall);
            //jump off wall
            switch(this._celestial.Physics.LastTouchedWall) {
                case Physics.Wall.Left:
                    this._celestial.Physics.addForceX(randomRange(35, 80));
                    this._celestial.flipX();
                    break;
                case Physics.Wall.Right:
                    this._celestial.Physics.addForceX(randomRange(-35, -80));
                    this._celestial.flipX();
            }
        }

    }
    
}