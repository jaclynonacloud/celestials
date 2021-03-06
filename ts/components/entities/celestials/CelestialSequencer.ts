///<reference path="./Celestial.ts" />
namespace celestials.engines {
    import Celestial = entities.Celestial;

    export interface ICelestialSequences {
        updateRate?:number;
        idles:ICelestialSequenceSet;
        walks?:ICelestialSequenceSet;
        climbs?:ICelestialSequenceSet;
        hangs?:ICelestialSequenceSet;
        falls?:ICelestialSequenceSet;
        recovers?:ICelestialSequenceSet;
        holds?:ICelestialSequenceSet;
        spawns?:ICelestialSequenceSet;
        interactions?:ICelestialSequenceSet;
    }
    export interface ICelestialSequenceSet {
        attentionSpan?:number;
        transitionStates:string[]; //holds names to states that can be switched to next /*If none are supplied, the default states will be used.*/
        special?:boolean; //marks whether a sequence can be selected, or must be called
        runOnce?:boolean; //marks whether a sequence only runs through its frames once /*Overrides any separate sequence controllers like looping or duration.*/
        canBeFavourite?:boolean; //marks whether a sequence can be a favourite action -- used in the details panel.  Uses attention span to calculate.
        isGrounded?:boolean; //marks whether this sequence set needs to be on the ground to take place
        sequences:ICelestialSequence[];
    }
    export interface ICelestialSequence {
        name?:string;
        duration?:number;
        looping?:boolean;
        spawnChance?:number; //used by the spawns sequences
        frames?:ICelestialFrame[];
    }
    export interface ICelestialFrame {
        name?:string;
        hold?:number;
        moveSpeed?:number;
        jumpForce?:number;
    }

    

    export class CelestialSequencer implements IUpdateable, ILoadable {
        public static get STATE() { return Object.freeze({
            "Idle" : "idles",
            "Walk" : "walks",
            "Climb" : "climbs",
            "Hang" : "hangs",
            "Fall" : "falls",
            "Recover" : "recovers",
            "Hold" : "holds",
            "Spawn" : "spawns",
            "Interact" : "interactions"
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

        private _updateRate:number;

        private _sequenceCompleteListener:Function;
        private _stateChangeListener:Function;
        private _stateCompleteListener:Function;

        constructor(celestial:Celestial) {
            this._celestial = celestial;
            this.reset();

            //look for sequences
            if(this.Data.sequences != null) {
                this._sequences = this.Data.sequences;
                this._updateRate = this._sequences.updateRate || 1;
            }

        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public reset() {
            this._frameIndex = 0;
            this._holdIndex = 0;
            this._totalIndex = 0;
        }

        /**Changes the Celestial's state.  Use the CelestialLogic.State options. */
        public changeState(state:string=CelestialSequencer.STATE.Idle, fallback?:string) {
            //switch out
            if(this._currentState != null)
                this.completeState();

            this._lastState = this._currentState || "";

            //make sure the state has sequences
            let sequences:ICelestialSequenceSet = (this._sequences[state] != null) ? this._sequences[state].sequences : null;
            if(sequences == null && fallback != null) return this._changeToFallbackState(fallback);
            else if(sequences == null && fallback == null) return null;



            this._currentState = state;

            if(this._stateChangeListener != null)
                this._stateChangeListener();

            return this._currentState;
        }
        private _changeToFallbackState(state:string) {
            return this.changeState(state);
        }

        public getStateByName(state:string):ICelestialSequenceSet {
            if(this._sequences[state] != null) return this._sequences[state] as ICelestialSequenceSet
            return null;
        }

        /**
         * Returns a random Celestial sequence state. i.e. Idle, Walk, Fly, etc.
         * @param omitCurrentState If true, the current state will not be reused.
         */
        public getRandomState(omitCurrentState:boolean=true) {
            let keys:string[] = Object.keys(CelestialSequencer.STATE);

            //if there is only one state, omit cannot be used
            if(keys.length <= 1) return this._currentState;

            let state:string = CelestialSequencer.STATE[keys[randomRangeInt(0, keys.length-1)]];
            if(omitCurrentState && state == this._currentState) 
                return this.getRandomState(true); //recursive
            //test whether this state is special
            if(this._sequences[state].special)
                return this.getRandomState(omitCurrentState);

            return state;
        }

        public getStateSequences(state:string):ICelestialSequence[] {
            return (this._sequences[state] != null) ? this._sequences[state].sequences : null;
        }

        /**Returns a random sequence from a given state.  Use the CelestialLogic.State options. */
        public getRandomStateSequence(state:string):ICelestialSequence {
            const sequences = this._sequences[state].sequences;
            if(sequences.length > 0)
                return sequences[randomRangeInt(0, sequences.length-1)];
            return null;
        }

        public getSequenceByName(name:string):ICelestialSequence {
            //look for sequence in state
            let sequences = this._sequences[this._currentState].sequences;
            for(let seq of sequences) {
                if(seq.name == name)
                    return seq;
            }

            return null;
        }

        /**Changes to the given sequence. */
        public changeSequence(sequence:ICelestialSequence) {
            if(sequence == null) return;
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


        public isCurrentState(...states:string[]) {
            for(let state of states)
                if(this._currentState == state)
                    return true;
            return false;
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
        public async load() {

        }
        public async unload() {
            this.removeSequenceCompleteListener();
            this.removeStateChangeListener();
            this.removeStateCompleteListener();
        }

        public update() {

            return new Promise((resolve, reject) => {
                try {
                    this._holdIndex += 1 - App.FPS_Latency;
                    this._totalIndex += 1 - App.FPS_Latency;

                    //do testing
                    //test frame hold
                    if(this._holdIndex > this._currentSequence.frames[this._frameIndex].hold * this._updateRate) {
                        this._frameIndex++;
                        this._holdIndex = 0;
                    }
                    //see if this is a looping sequence
                    // if(this._frameIndex > this._currentSequence.frames.length-1) {
                    //     if(this._currentSequence.looping && !(this.CurrentSequenceSet.runOnce || true)) //just reset the index
                    //         this._frameIndex = 0;
                    //     else //end the sequence
                    //         this.completeSequence();
                    // }
                    if(this._frameIndex > this._currentSequence.frames.length-1) {
                        if(this.CurrentSequenceSet.runOnce) this.completeSequence();
                        if(this._currentSequence.looping) { //just reset the index
                            this._frameIndex = 0;
                        }
                        else //end the sequence
                            this.completeSequence();
                    }

                    //see if sequence time is complete
                    if(this._totalIndex > this._currentSequence.duration * this._updateRate) {
                        this.completeSequence();
                    }     
                    resolve();
                }
                catch(e) {
                    reject(console.log("PROBLEM WITH SEQUENCER ON " + this._celestial.Name + "\n" + e));
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