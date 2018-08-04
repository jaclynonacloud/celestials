///<reference path="./Celestial.ts" />
namespace celestials.engines {
    import Celestial = entities.Celestial;

    export interface ICelestialSequences {
        updateRate?:number;
        idles?:ICelestialSequenceSet;
        walks?:ICelestialSequenceSet;
        climbs?:ICelestialSequenceSet;
        hangs?:ICelestialSequenceSet;
    }
    export interface ICelestialSequenceSet {
        attentionSpan?:number;
        transitionStates:string[]; //holds names to states that can be switched to next /*If none are supplied, the default states will be used.*/
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
            "Climb" : "climbs",
            "Hang" : "hangs"
        });}
        public static get DEFAULT_TRANSITIONAL_STATES():string[] { return ["Idle", "Walk"]; }

        private _celestial:Celestial;
        
        private _sequences:ICelestialSequences;
        private _currentSequence:ICelestialSequence;

        private _currentState:string;
        private _lastState:string;

        private _frameIndex:number; //holds the sequence frame index
        private _holdIndex:number; //holds the hold index of a frame
        private _totalIndex:number; //holds the runtime of the sequence

        private _sequenceCompleteListener:Function;
        private _stateChangeListener:Function;
        private _stateCompleteListener:Function;

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

            //check the state for sequences
            if(this._sequences[state].sequences.length <= 0)
                return null; //this state has no sequences

            this._currentState = state;
            //TODO decide a factor for switching sequences
            // let sequence:ICelestialSequence = this.getRandomStateSequence(this._currentState);
            // this.changeSequence(sequence);

            if(this._stateChangeListener != null)
                this._stateChangeListener();

            this._lastState = this._currentState;

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
            // if(this._currentSequence != null) this.reset();
            this.reset();
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
            if(this._stateCompleteListener != null)
                this._stateCompleteListener();
        }
        
        /*-------------- WIRES ------------*/

        public addSequenceCompleteListener(listener:Function) {
            this._sequenceCompleteListener = listener;
        }
        public removeSequenceCompleteListener() {
            this._sequenceCompleteListener = null;
        }

        public addStateChangeListener(listener:Function) {
            this._stateChangeListener = listener;
        }
        public removeStateChangeListener() {
            this._stateChangeListener = null;
        }

        public addStateCompleteListener(listener:Function) {
            this._stateCompleteListener = listener;
        }
        public removeStateCompleteListener() {
            this._stateCompleteListener = null;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public update() {

            return new Promise((resolve, reject) => {
                try {
                    //set the image
                    let key:string = this._currentSequence.frames[this._frameIndex].name;
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
                    // this._celestial.Physics.resetGravity();
                    //handle state differences
                    resolve();

                    // switch(this._currentState) {
                    //     case CelestialSequencer.State.Idle:
                    //         this._handleIdle();
                    //         break;
                    //     case CelestialSequencer.State.Walk:
                    //         this._handleWalk();
                    //         break;
                    //     case CelestialSequencer.State.Climb:
                    //         this._handleClimb();
                    //         break;
                    // }
                    // resolve();
                }
                catch(e) {
                    reject();
                }
            });

        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        private get Data():entities.ICelestial { return this._celestial.Data as entities.ICelestial; }
        public get Sequences():ICelestialSequences { return this._sequences; }
        public get CurrentState():string { return this._currentState; }
        public get LastState():string { return this._lastState; }
        public get CurrentSequence():ICelestialSequence { return this._currentSequence; }
        public get CurrentFrame():ICelestialFrame { return this._currentSequence.frames[this._frameIndex]; }
        public get CurrentSequenceSet():ICelestialSequenceSet { return this._sequences[this._currentState]; }
    }

}