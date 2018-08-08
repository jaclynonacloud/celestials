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

        private _drawingFrame:boolean;
        private _pauseIntegrityCheck:boolean;

        constructor(celestial:Celestial, data:ICelestialLogic) {
            this._celestial = celestial;
            this._updateRate = 1;
            this._eagerness = 1;
            this._attentionSpan = 50;

            this._tick = 0;
            this._updateTick = 0;

            this._drawingFrame = false;

            this._pauseIntegrityCheck = false;

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
            let locAttentionSpan:number = clamp(this._celestial.Sequencer.CurrentSequenceSet.attentionSpan || 100, 1, 100); //attention span from the sequence state type
            let attentionSpan:number = this._attentionSpan * (locAttentionSpan / 100); //attention span of the celestial
            let attention:number = randomRangeInt(this._tick, 100); //a random number -- incremented by the eagerness every time a the state isn't changed

            console.log(`TICK:${this._tick}, ATTENTION:${attention}, SPAN:${attentionSpan}`);
            //check to see if attention span has been surpassed OR we only run this sequence once
            if(attention > attentionSpan || this._celestial.Sequencer.CurrentSequenceSet.runOnce) {
                //change state
                console.log("CHANGE STATE!");
                this.nextState();

                //reset tick
                this._tick = 0;
            }
            else {
                console.log("I'm not bored yet!");
                //if our attention span is not reached, just pick another action
                let sequence:engines.ICelestialSequence = this._celestial.Sequencer.getRandomStateSequence(this._celestial.Sequencer.CurrentState);
                this._celestial.Sequencer.changeSequence(sequence);
            }



            
            
        }


        public nextState(state?:string) {
            //TODO create a hierarchy for state selection
            //get current state
            if(state == null) {
                state = this._celestial.Sequencer.CurrentState;
                //get the transitional states, if any
                let nextStates:string[] = this._celestial.Sequencer.CurrentSequenceSet.transitionStates || engines.CelestialSequencer.DEFAULT_TRANSITIONAL_STATES;
                shuffleArray(nextStates);
                console.log("NEXT STATES");
                console.log(nextStates);
                //attempt to switch to one of these new states
                let waitingForState:boolean = true;
                while(waitingForState) {
                    for(let i = 0; i < nextStates.length; i++) {
                        let stateName = engines.CelestialSequencer.State[nextStates[i]];
                        if(this._celestial.Sequencer.changeState(stateName) != null) {
                            waitingForState = false;
                            console.log("I FOUND A STATE: " + this._celestial.Sequencer.CurrentState);
                            break;
                        }
                    }
                    if(waitingForState)
                        //if we have exhausted all the states, and have still not found a match, throw an error
                        throw new Error("The state: " + state + " does not have a transition state available.  Celestial " + this._celestial.Name + " is trapped!");
                }
                console.log("Switched TO: " + this._celestial.Sequencer.CurrentState);
                let sequence = this._celestial.Sequencer.getRandomStateSequence(this._celestial.Sequencer.CurrentState);
                this._celestial.Sequencer.changeSequence(sequence);
                
            }
        }

        /**
         * Called by Physics engine when wall is hit.
         * @param which The wall that was hit.  Defined by Physics.Wall
         */
        public handleWallHit(which:number) {
             //see if we hit the edges
             this._handleStateIntegrity(which);
            
            //see if we are hitting the floor from a fall
            if(which == Physics.Wall.Bottom && this._celestial.Sequencer.isCurrentState(engines.CelestialSequencer.State.Fall)) {
                console.log("CALLED");
                //look for a recover state
                let state:string = this._celestial.Sequencer.changeState(engines.CelestialSequencer.State.Recover);
                //if we can't recover, just go to next state
                if(state != engines.CelestialSequencer.State.Recover) {
                    this.next();
                }
                //otherwise, change the sequence
                let sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                if(sequence != null)
                    this._celestial.Sequencer.changeSequence(sequence);
            }
        }

        async handleStateChange() {
            console.log("----------CALLLED----------");
            console.log("STATE: -------- " + this._celestial.Sequencer.CurrentState);
            this._pauseIntegrityCheck = true;
            //if our state was changed, reset the sequencer
            this._celestial.Sequencer.reset();

            //call for a frame/physics update
            await this._celestial.update();
            console.log("FINISHED UPDATING");
            //reset the tick timer
            this.reset();

            await this._handleStateChange();
            await this._handleStateNuance();

            

            this._pauseIntegrityCheck = false;
        }

        /**State changes.  Any snapping, or setting of initial state data should be set here. */
        _handleStateChange() {
            console.log("HANDLING STATE CHANGE");
            let cs = engines.CelestialSequencer;
            //handle nuances between state
            let lastState:string = this._celestial.Sequencer.LastState;
            let currentState:string = this._celestial.Sequencer.CurrentState;

            //reset the velocity
            this._celestial.Physics.zeroVelocity();

            console.log("State setup: " + currentState);
            console.log(this._celestial.Sequencer.CurrentFrame.name);
            switch(currentState) {
                case cs.State.Idle:
                case cs.State.Walk:
                case cs.State.Fall:
                    this._celestial.Physics.resetGravity();
                    this._tryToFlipX(); //randomly flip when we start this state -- maybe
                    break;
                case cs.State.Climb:
                    //turn off gravity
                    this._celestial.Physics.setGravity(0);
                    //check wall
                    //if we haven't touched a wall, find the closest
                    let lastTouchedWall = this._celestial.Physics.LastTouchedWall;
                    if(lastTouchedWall != Physics.Wall.Left && lastTouchedWall != Physics.Wall.Right)
                        lastTouchedWall = (this._celestial.Bounds.Center.x < App.Bounds.Center.x) ? Physics.Wall.Left : Physics.Wall.Right;
                    switch(lastTouchedWall) {
                        case Physics.Wall.Left:
                            this._celestial.Physics.snapToLeft();
                            this._celestial.setDirectionX(-1);
                            break;
                        case Physics.Wall.Right:
                            this._celestial.Physics.snapToRight();
                            this._celestial.setDirectionX(1);
                    }
                    break;
                case cs.State.Hang:
                    console.log("SNAPPING TO TOP");
                    this._celestial.Physics.setGravity(0);
                    this._celestial.Physics.snapToTop();
                    break;
                    

            }   

        }


        /**State nuances.  How they interact with one another. */
        _handleStateNuance() {
            let cs = engines.CelestialSequencer;
            //handle nuances between state
            let lastState:string = this._celestial.Sequencer.LastState;
            let currentState:string = this._celestial.Sequencer.CurrentState;

            //climb > hang
            console.log(lastState, currentState);
            //push off wall, flip direction
            if(lastState == cs.State.Climb && currentState == cs.State.Hang) {
                console.log("I AM USING THE NUANCE");
                this._celestial.flipX();
                this._celestial.Physics.addForceX(randomRange(20, 30) * this._celestial.Direction.x);
            }
        }

        /**
         * Handles the state every frame to make sure that it is still a viable state to be in.
         * 
         * For example, if we are in a climbing state, but end up off the wall for whatever reason,
         * the state is no longer viable.
         */
        _handleStateIntegrity(wallHit?:number) {
            let cs = engines.CelestialSequencer;
            //handle nuances between state
            let lastState:string = this._celestial.Sequencer.LastState;
            let currentState:string = this._celestial.Sequencer.CurrentState;

            switch(currentState) {
                case cs.State.Walk:
                case cs.State.Idle:
                case cs.State.Fall:
                    //if we hit a wall, check if we want to handle it
                    if(!this._tryToClimb(wallHit))
                        //if we don't want to climb, just flip around
                        this._celestial.flipX();
                    break;
                case cs.State.Climb:
                    //if we touch the roof, try to hang
                    if(this._tryToHang(wallHit)) break;
                    //make sure we are on the wall
                    if(!this._celestial.Physics.isTouchingWall(Physics.Wall.Left, Physics.Wall.Right)) {
                        this.nextState();                   
                        break;
                    }
                    //make sure we are facing the right direction
                    if(this._celestial.Physics.isTouchingWall(Physics.Wall.Left) && this._celestial.Direction.x != -1) {
                        this.nextState();
                        break;
                    }
                    if(this._celestial.Physics.isTouchingWall(Physics.Wall.Right) && this._celestial.Direction.x != 1) {
                        this.nextState();
                        break;
                    }
                    break;
                case cs.State.Hang:
                    //flip if we touch a wall
                    if(wallHit != null)
                        if(wallHit == Physics.Wall.Left || wallHit == Physics.Wall.Right)
                            this._celestial.flipX();
                    //make sure we are on the ceiling
                    if(wallHit == null)
                        if(this._celestial.Bounds.Top > App.Bounds.Top) this.nextState();
                    break;
                case cs.State.Recover:
                    //make sure we are on the ground
                    if(this._celestial.Bounds.Bottom < App.Bounds.Bottom) this.nextState();
            }

        }

        handleStateComplete() {
            let state:string = this._celestial.Sequencer.CurrentState;

            //is it real?
            //uses the state name to look for a function matching this: _complete[State]
            let funcName:string = `_complete${state[0].toUpperCase()}${state.substr(1)}`;
            if(this[funcName] != null) {
                //reset last state
                this._celestial.Physics.resetGravity();
                //call the function
                this[funcName]();
            }
        }

        public reset() {
            this._tick = 0;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public async load() {
            return new Promise(async(resolve, reject) => {

                try {
                    //set the first sequence
                    // let state:string = this._celestial.Sequencer.changeState(this._celestial.Sequencer.getRandomState());
                    //TODO: find out the spawn location of the celestial to see what sequence we can spawn with
                    let state = this._celestial.Sequencer.changeState(engines.CelestialSequencer.State.Fall, engines.CelestialSequencer.State.Idle);
                    console.log("STATE: " + state);
                    console.log(this._celestial.Sequencer.Sequences);
                    let sequence:engines.ICelestialSequence = this._celestial.Sequencer.getRandomStateSequence(state);
                    this._celestial.Sequencer.changeSequence(sequence);
                    await this._celestial.drawCurrentFrame();
                    console.log("LOADED FIRST LOGIC");
                    resolve();
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

                //is it real?
                //uses the state name to look for a function matching this: _handle[State]
                let funcName:string = `_handle${state[0].toUpperCase()}${state.substr(1)}`;
                if(this[funcName] != null)
                    this[funcName]();

                //check state for integrity
                if(!this._pauseIntegrityCheck)
                    this._handleStateIntegrity();


                resolve();
            });
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/


        /*---------------------------------------------- STATES --------------------------------------*/
        /**How the idle is handled every update. */
        private _handleIdles() {
            //do nothing yet...
        }
        /**How the last idle frame is handled. */
        private _completeIdles() {
            //TODO: Allow for duplication state here.
        }

        /**How the walk is handled every update. */
        private _handleWalks() {
            let frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            //get the walk properties
            let moveSpeed:number = frame.moveSpeed || 0;
            let jumpForce:number = frame.jumpForce || 0;
            //look for property value
            this._celestial.Physics.addForceX(moveSpeed * this._celestial.Direction.x);
            this._celestial.Physics.addForceY(-jumpForce);
        }
        /**How the last walk frame is handled. */
        private _completeWalks() {

        }

        /**How the climb is handled ever update. */
        private _handleClimbs() {
            let frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            //get the climb properties
            let moveSpeed:number = frame.moveSpeed || 10;
            //set the property
            this._celestial.Physics.addForceY(-moveSpeed);
        }
        /**How the last climb frame is handled. */
        private _completeClimbs() {
            console.log("JUMP OFF WALL!");
            // //jump off wall
            switch(this._celestial.Physics.LastTouchedWall) {
                case Physics.Wall.Left:
                    this._celestial.Physics.addForceX(randomRange(35, 80));
                    this._celestial.flipX();
                    break;
                case Physics.Wall.Right:
                    this._celestial.Physics.addForceX(randomRange(-35, -80));
                    this._celestial.flipX();
                    break;
            }
        }

        /**How the hang is handled every update. */
        private _handleHangs() {
            let frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            this._celestial.Physics.setGravity(0);
            //get the hang properties
            let moveSpeed:number = frame.moveSpeed || 2;
            //set the properties
            this._celestial.Physics.addForceX(moveSpeed * this._celestial.Direction.x);
        }


        /**How the fall is handled every update. */
        private _handleFalls() {
            let frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            // this._celestial.Physics.setGravity(0);
            // //get the hang properties
            // let moveSpeed:number = frame.moveSpeed || 2;
            // //set the properties
            // this._celestial.Physics.addForceX(moveSpeed * this._celestial.Direction.x);
        }


        private _tryToFlipX() {
            //get a random number
            let random:number = randomRange(0, 1);
            //don't flip on climb/hang
            console.log("I wanna flip!");
            let wantToFlipX:number = lerp((this._eagerness * 5), 100, random);
            if(wantToFlipX > this._attentionSpan) this._celestial.flipX();
        }



        private _tryToClimb(wallHit?:number):boolean {   
            
            //if we hit a wall, check if we want to handle it
            if(wallHit != null) {
                //see if we hit the edges
                if(wallHit == Physics.Wall.Left || wallHit == Physics.Wall.Right) {

                    //see if we want to climb - uses the attention span of the climb sequence set
                    if(randomRange(0, 1) > this._celestial.Sequencer.CurrentSequenceSet.attentionSpan || 100 / 100) {

                        //get the climb state
                        let state:string = this._celestial.Sequencer.changeState(engines.CelestialSequencer.State.Climb);
                        //if we can't climb, abort!
                        if(state != engines.CelestialSequencer.State.Climb) return false;
                        
                        //try to get a climb sequence
                        let sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                        if(sequence != null) {
                            this._celestial.Sequencer.changeSequence(sequence);     
                            return true;                   
                        }
                    }
                    return false;
                }
            }       
            return true;
        }

        private _tryToHang(wallHit?:number):boolean {
            if(wallHit == null) return false;
            if(wallHit != Physics.Wall.Top) return false;
            //TODO see if we want to hang
            if(randomRange(0, 1) > 0) {
                //get the hang state
                let state:string = this._celestial.Sequencer.changeState(engines.CelestialSequencer.State.Hang);
                //if we can't hang, abort!
                if(state != engines.CelestialSequencer.State.Hang) return false;
                //try to get a hange sequence
                let sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                if(sequence != null) {
                    this._celestial.Sequencer.changeSequence(sequence);
                    return true;
                }
            }
            return false;
        }


    }
    
}