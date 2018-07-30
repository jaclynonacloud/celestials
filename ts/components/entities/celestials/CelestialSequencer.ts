///<reference path="./Celestial.ts" />
namespace celestials.engines {
    import Celestial = entities.Celestial;

    export interface ICelestialSequences {
        updateRate?:number;
        idles?:ICelestialSequenceSet;
        walks?:ICelestialSequenceSet;
        climbs?:ICelestialSequenceSet;
    }
    export interface ICelestialSequenceSet {
        attentionSpan?:number;
        special?:boolean; //marks whether a sequence can be randomly selected, or must be called
        sequences:ICelestialSequence[];
    }
    export interface ICelestialSequence {
        name?:string;
        duration?:number;
        looping?:boolean;
        frames?:ICelestialFrame[];
    }
    export interface ICelestialFrame {
        name?:string;
        hold?:number;
        moveSpeed?:number;
        jumpForce?:number;
    }

    

    export class CelestialSequencer implements IUpdateable {
        public static get State() { return Object.freeze({
            "Idle" : "idles",
            "Walk" : "walks",
            "Climb" : "climbs"
        });}

        private _celestial:Celestial;
        
        private _sequences:ICelestialSequences;
        private _currentSequence:ICelestialSequence;

        private _currentState:string;

        private _frameIndex:number; //holds the sequence frame index
        private _holdIndex:number; //holds the hold index of a frame
        private _totalIndex:number; //holds the runtime of the sequence

        private _sequenceCompleteListener:Function;

        constructor(celestial:Celestial) {
            this._celestial = celestial;
            this.reset();
            //look for sequences
            if(this.Data.sequences != null) {
                this._sequences = this.Data.sequences;
            }
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public reset() {
            this._frameIndex = 0;
            this._holdIndex = 0;
            this._totalIndex = 0;
        }

        /**Changes the Celestial's state.  Use the CelestialLogic.State options. */
        public changeState(state:string=CelestialSequencer.State.Idle) {
            //switch out
            if(this._currentState != null)
                this.completeState();

            this._currentState = state;
            //TODO decide a factor for switching sequences
            // let sequence:ICelestialSequence = this.getRandomStateSequence(this._currentState);
            // this.changeSequence(sequence);

            return this._currentState;
        }

        /**
         * Returns a random Celestial sequence state. i.e. Idle, Walk, Fly, etc.
         * @param omitCurrentState If true, the current state will not be reused.
         */
        public getRandomState(omitCurrentState:boolean=true) {
            let keys:string[] = Object.keys(CelestialSequencer.State);

            //if there is only one state, omit cannot be used
            if(keys.length <= 1) return this._currentState;

            let state:string = CelestialSequencer.State[keys[randomRangeInt(0, keys.length-1)]];
            if(omitCurrentState && state == this._currentState) 
                return this.getRandomState(true); //recursive
            //test whether this state is special
            if(this._sequences[state].special)
                return this.getRandomState(omitCurrentState);

            return state;
        }

        /**Returns a random sequence from a given state.  Use the CelestialLogic.State options. */
        public getRandomStateSequence(state:string):ICelestialSequence {
            const sequences = this._sequences[state].sequences;
            if(sequences.length > 0)
                return sequences[randomRangeInt(0, sequences.length-1)];
            return null;
        }

        /**Changes to the given sequence. */
        public changeSequence(sequence:ICelestialSequence) {
            if(this._currentSequence != null) this.reset();
            this._currentSequence = sequence;
            console.log("CHANGED SEQUENCE: " + this._currentSequence.name);
        }      

        /**Calls the sequence completion.  Can be used to stop a sequence early. */
        public completeSequence() {
            if(this._sequenceCompleteListener != null)
                this._sequenceCompleteListener();
        }

        public completeState() {
            console.log("COMPLETED STATE: " + this._currentState);
            switch(this._currentState) {
                case CelestialSequencer.State.Climb:
                    this._completeClimb();
                    break;
            }
        }
        
        /*-------------- WIRES ------------*/

        public addSequenceCompleteListener(listener:Function) {
            this._sequenceCompleteListener = listener;
        }
        public removeSequenceCompleteListener() {
            this._sequenceCompleteListener = null;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public async update() {
            if(this._currentSequence == null) return;
            console.log("2-Sequencer");

            //set the image
            let key:string = this._currentSequence.frames[this._frameIndex].name;
            let promise = this._celestial.draw(this._celestial.getImage(key));
            if(promise == null) console.log("MY PROMISE IS NULL");
            if(promise != null)
            await promise.then(img => {
                this._holdIndex++;
                this._totalIndex++;

                //do testing
                //test frame hold
                if(this._holdIndex > this._currentSequence.frames[this._frameIndex].hold * this._sequences.updateRate) {
                    this._frameIndex++;
                    this._holdIndex = 0;
                }
                //see if this is a looping sequence
                if(this._frameIndex > this._currentSequence.frames.length-1) {
                    if(this._currentSequence.looping) //just reset the index
                        this._frameIndex = 0;
                    else //end the sequence
                        this.completeSequence();
                }

                //see if sequence time is complete
                if(this._totalIndex > this._currentSequence.duration * this._sequences.updateRate) {
                    this.completeSequence();
                }     
                
                //reset things
                this._celestial.Physics.resetGravity();
                //handle state differences
                switch(this._currentState) {
                    case CelestialSequencer.State.Idle:
                        this._handleIdle();
                        break;
                    case CelestialSequencer.State.Walk:
                        this._handleWalk();
                        break;
                    case CelestialSequencer.State.Climb:
                        this._handleClimb();
                        break;
                }

                console.log("4-Finish Sequence Draw Update");

            });
            
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        private get Data():entities.ICelestial { return this._celestial.Data as entities.ICelestial; }
        public get Sequences():ICelestialSequences { return this._sequences; }
        public get CurrentState():string { return this._currentState; }
        public get CurrentSequence():ICelestialSequence { return this._currentSequence; }




        /*---------------------------------------------- STATES --------------------------------------*/
        private _handleIdle() {
            //do nothing yet...
        }
        private _handleWalk() {
            //get the walk properties
            let moveSpeed:number = this._currentSequence.frames[this._frameIndex].moveSpeed;
            let jumpForce:number = this._currentSequence.frames[this._frameIndex].jumpForce;
            //look for property value
            if(moveSpeed != null)
                this._celestial.Physics.addForceX(moveSpeed * this._celestial.Direction.x);
            if(jumpForce != null)
                this._celestial.Physics.addForceY(-jumpForce);
        }


        private _handleClimb() {
            this._celestial.Physics.setGravity(0);
            //push against wall
            // this._celestial.Physics.addForceX(10 * -this._celestial.Direction.x);
            console.log("SNAP");
            switch(this._celestial.Physics.LastTouchedWall) {
                case Physics.Wall.Left:
                    this._celestial.Physics.snapToLeft();
                    break;
                case Physics.Wall.Right:
                    this._celestial.Physics.snapToRight();
            }
            //get the climb properties
            let moveSpeed:number = this._currentSequence.frames[this._frameIndex].moveSpeed || 10;
            //set the property
            this._celestial.Physics.addForceY(-moveSpeed);
        }
        private _completeClimb() {
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