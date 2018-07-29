///<reference path="./Celestial.ts" />
namespace celestials.logic {
    import Celestial = entities.Celestial;

    export interface ICelestialSequences {
        updateRate?:number;
        idles?:ICelestialSequence[];
        walks?:ICelestialSequence[];
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
    }

    

    export class CelestialLogic implements IUpdateable {
        public static get State() { return Object.freeze({
            "Idle" : "idles",
            "Walk" : "walks"
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
                this.changeState(CelestialLogic.State.Idle);
            }
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public reset() {
            this._frameIndex = 0;
            this._holdIndex = 0;
            this._totalIndex = 0;
        }

        /**Changes the Celestial's state.  Use the CelestialLogic.State options. */
        public changeState(state:string=CelestialLogic.State.Idle) {
            this._currentState = state;
            //TODO decide a factor for switching sequences
            let sequence:ICelestialSequence = this.getRandomStateSequence(this._currentState);
            this.changeSequence(sequence);
        }

        /**Returns a random sequence from a given state.  Use the CelestialLogic.State options. */
        public getRandomStateSequence(state:string):ICelestialSequence {
            const sequences = this._sequences[state];
            if(sequences.length > 0)
                return sequences[randomRangeInt(0, sequences.length-1)];
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
        
        /*-------------- WIRES ------------*/

        public addSequenceCompleteListener(listener:Function) {
            this._sequenceCompleteListener = listener;
        }
        public removeSequenceCompleteListener() {
            this._sequenceCompleteListener = null;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public update() {
            if(this._currentSequence == null) return;

            //set the image
            this._celestial.draw(this._celestial.getImageByName(this._currentSequence.frames[this._frameIndex].name));
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
            
            //handle state differences
            switch(this._currentState) {
                case CelestialLogic.State.Walk:
                    this._handleWalk();
                    break;
            }
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        private get Data():entities.ICelestial { return this._celestial.Data as entities.ICelestial; }
        public get Sequences():ICelestialSequences { return this._sequences; }
        public get CurrentSequence():ICelestialSequence { return this._currentSequence; }




        /*---------------------------------------------- STATES --------------------------------------*/
        private _handleWalk() {
            //get the movespeed
            let moveSpeed:number = this._currentSequence.frames[this._frameIndex].moveSpeed;
            if(moveSpeed != null)
                this._celestial.Physics.addForceX(moveSpeed);
        }

        

    }

}