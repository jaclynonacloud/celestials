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
                let wantToFlipX:number = lerp((this._eagerness * 5), 100, random);
                if(wantToFlipX > this._attentionSpan) this._celestial.flipX();
            }
            
        }


        public async handleWallHit(which:number) {
            //flip us if we hit the edges
            if(which == Physics.Wall.Left || which == Physics.Wall.Right) {
                //TODO see if we want to climb - 50/50
                if(randomRange(0, 1) > 0) {
                    //start the climb
                    let state:string = this._celestial.Sequencer.changeState(engines.CelestialSequencer.State.Climb);
                    if(state != engines.CelestialSequencer.State.Climb) return;
                    //try to get a climb sequence
                    let sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                    if(sequence != null) {
                        await this._celestial.Sequencer.changeSequence(sequence);
                        await this._celestial.Sequencer.update();
                        console.log("6-Handle Wall");
                        this.reset();
                        await this._celestial.flipX();
                        //snap to respective all
                        if(which == Physics.Wall.Left)
                            this._celestial.Physics.snapToLeft();
                        if(which == Physics.Wall.Right)
                            this._celestial.Physics.snapToRight();
                    }
                    //if we couldn't find a climb, pretend we didn't try
                    // else
                    //     this.next();
                }
            }
        }

        public reset() {
            this._tick = 0;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {
            //set the first sequence
            let state:string = this._celestial.Sequencer.changeState(this._celestial.Sequencer.getRandomState());
            let sequence:engines.ICelestialSequence = this._celestial.Sequencer.getRandomStateSequence(state);
            this._celestial.Sequencer.changeSequence(sequence);
            this._celestial.draw(this._celestial.getImage(sequence.name));
            console.log("LOADED FIRST LOGIC");
        }
        public unload() {

        }

        public update() {
            return;
            this._updateTick++;
            if(this._updateTick > this._updateRate)
                this._updateTick = 0;

            if(this._updateTick != 0) return;
            //decide how often we just decide to change direction

            //get a random number
            let random:number = randomRange(0, 1);
            let wantToFlipX:number = lerp((this._eagerness * 5), 100, random);
            if(wantToFlipX > this._attentionSpan) this._celestial.flipX();
            
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/

    }
    
}