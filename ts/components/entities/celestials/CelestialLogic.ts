///<reference path="./../engines/Physics.ts" />
///<reference path="./../engines/Transform.ts" />
namespace celestials.logic {
    import Celestial = entities.Celestial;
    import Physics = engines.Physics;
    import Transform = engines.Transform;

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

        private _sizeMultiplier:number;
        private _sizeJumpMultiplier:number;


        constructor(celestial:Celestial, data:ICelestialLogic) {
            this._celestial = celestial;
            this._updateRate = 1;
            this._eagerness = 1;
            this._attentionSpan = 50;

            this._tick = 0;
            this._updateTick = 0;

            this._drawingFrame = false;

            this._pauseIntegrityCheck = false;


            this._sizeMultiplier = 1 + this._celestial.SizeNormalized;
            this._sizeJumpMultiplier = 1 + (this._celestial.SizeNormalized * 0.25);

            //check for data
            if(data != null) {
                let { updateRate, eagerness, attentionSpan } = data;
                if(updateRate != null) this._updateRate = clamp(updateRate, 1, 1000);
                if(eagerness != null) this._eagerness = clamp(eagerness, 1, 100);
                if(attentionSpan != null) this._attentionSpan = clamp(attentionSpan, 0, 100);
            }

        }
        /*---------------------------------------------- METHODS -------------------------------------*/
        /**
         * Ask for next logical action.
         */
        public next() {
            if(this._celestial.IsControlled) return;
            this._tick += this._eagerness;
            let locAttentionSpan:number = clamp(this._celestial.Sequencer.CurrentSequenceSet.attentionSpan || 100, 1, 100); //attention span from the sequence state type
            let attentionSpan:number = this._attentionSpan * (locAttentionSpan / 100); //attention span of the celestial
            let attention:number = randomRangeInt(this._tick, 100); //a random number -- incremented by the eagerness every time a the state isn't changed

            // console.log(`TICK:${this._tick}, ATTENTION:${attention}, SPAN:${attentionSpan}`);
            //check to see if attention span has been surpassed AND/OR we only run this sequence once
            if((attention > attentionSpan) || this._celestial.Sequencer.CurrentSequenceSet.runOnce || this._celestial.Sequencer.isCurrentState(engines.CelestialSequencer.STATE.Interact)) {
                //change state
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
                console.log(nextStates);
                //attempt to switch to one of these new states
                let waitingForState:boolean = true;
                while(waitingForState) {
                    for(let i = 0; i < nextStates.length; i++) {
                        let stateName = engines.CelestialSequencer.STATE[nextStates[i]];
                        if(this._celestial.Sequencer.changeState(stateName) != null) {
                            waitingForState = false;
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
         * Attempts to start a state by the name given.  If it cannot start the state, this function will return false.
         * @param stateName The name of the state to start.  Please use class constants.  engines.CelestialSequencer.STATE.
         */
        public async startState(stateName:string) {
            //attempt to switch logic to this state
            this._pauseIntegrityCheck = true;
            let state = await this._celestial.Sequencer.changeState(stateName);
            if(state != null) {
                if(state != stateName) {
                    return false;
                    this._pauseIntegrityCheck = false;
                }
                let sequence = await this._celestial.Sequencer.getRandomStateSequence(state);
                if(sequence != null) {
                    await this._celestial.Sequencer.changeSequence(sequence);
                    //reset tick
                    this._tick = 0;
                    this._pauseIntegrityCheck = false;
                    return true;
                }
            }
            this._pauseIntegrityCheck = false;
            return false;
        }

        public tryEndState(stateName:string) {
            if(this._celestial.Sequencer.isCurrentState(stateName))
                this.nextState();
        }

        /**
         * Called by Physics engine when wall is hit.
         * @param which The wall that was hit.  Defined by Physics.Wall
         */
        public handleWallHit(which:string) {
             //see if we hit the edges
             this._handleStateIntegrity(which);
            
            //see if we are hitting the floor from a fall
            if(which == Transform.WALL.Bottom && this._celestial.Sequencer.isCurrentState(engines.CelestialSequencer.STATE.Fall)) {
                //look for a recover state
                if(!this.startState(engines.CelestialSequencer.STATE.Recover))
                    this.next();
            }
        }

        public updateState() {
            this._handleStateChange();
        }

        async handleStateChange() {
            this._pauseIntegrityCheck = true;
            //if our state was changed, reset the sequencer
            this._celestial.Sequencer.reset();

            //call for a frame/physics update
            await this._celestial.update();
            //reset the tick timer
            this.reset();

            await this._handleStateChange();
            await this._handleStateNuance();

            

            this._pauseIntegrityCheck = false;
        }

        /**State changes.  Any snapping, or setting of initial state data should be set here. */
        async _handleStateChange() {
            let cs = engines.CelestialSequencer;
            //handle nuances between state
            let lastState:string = this._celestial.Sequencer.LastState;
            let currentState:string = this._celestial.Sequencer.CurrentState;

            //reset the velocity
            // this._celestial.Physics.zeroVelocity();

            console.log(this._celestial.Sequencer.CurrentFrame.name);
            switch(currentState) {
                case cs.STATE.Idle:
                case cs.STATE.Walk:
                    this._celestial.Physics.zeroVelocity();
                    this._celestial.Transform.zeroMoveSpeed();
                case cs.STATE.Fall:
                    this._celestial.Physics.resetGravity();
                    // this._tryToFlipX(); //randomly flip when we start this state -- maybe
                    break;
                case cs.STATE.Climb:
                    //turn off gravity
                    this._celestial.Physics.setGravity(0);
                    this._celestial.Physics.zeroVelocity();
                    this._celestial.Transform.zeroMoveSpeed();
                    //check wall
                    //if we haven't touched a wall, find the closest
                    let lastTouchedWall = this._celestial.Transform.LastTouchedWall;
                    if(lastTouchedWall != Transform.WALL.Left && lastTouchedWall != Transform.WALL.Right)
                        lastTouchedWall = (this._celestial.Bounds.Center.x < App.Bounds.Center.x) ? Transform.WALL.Left : Transform.WALL.Right;
                    switch(lastTouchedWall) {
                        case Transform.WALL.Left:
                            this._celestial.Transform.snapToLeft();
                            this._celestial.setDirectionX(-1);
                            break;
                        case Transform.WALL.Right:
                            this._celestial.Transform.snapToRight();
                            this._celestial.setDirectionX(1);
                    }
                    break;
                case cs.STATE.Hang:
                    this._celestial.Physics.zeroVelocity();
                    this._celestial.Transform.zeroMoveSpeed();
                    this._celestial.Physics.setGravity(0);
                    this._celestial.Transform.snapToTop();
                    break;
                case cs.STATE.Hold:
                    this._celestial.Physics.zeroVelocity();
                    this._celestial.Transform.zeroMoveSpeed();
                    this._celestial.Physics.setGravity(0);
                    break;
                case cs.STATE.Spawn:
                case cs.STATE.Interact:
                    this._celestial.Physics.zeroVelocity();
                    this._celestial.Transform.zeroMoveSpeed();
                    this._celestial.Physics.resetGravity();
                    break;

            }   

        }


        /**State nuances.  How they interact with one another. */
        async _handleStateNuance() {
            let cs = engines.CelestialSequencer;
            //handle nuances between state
            let lastState:string = this._celestial.Sequencer.LastState;
            let currentState:string = this._celestial.Sequencer.CurrentState;

            //climb > hang
            console.log(lastState, currentState);
            //push away from wall
            if(lastState == cs.STATE.Climb && currentState == cs.STATE.Hang) {
                console.log("I AM USING THE NUANCE");
                this._celestial.Physics.addForceX(randomRange(20, 30) * this._celestial.Direction.x);
            }
        }

        /**
         * Handles the state every frame to make sure that it is still a viable state to be in.
         * 
         * For example, if we are in a climbing state, but end up off the wall for whatever reason,
         * the state is no longer viable.
         */
        async _handleStateIntegrity(wallHit?:string) {
            let cs = engines.CelestialSequencer;
            //handle nuances between state
            let lastState:string = this._celestial.Sequencer.LastState;
            let currentState:string = this._celestial.Sequencer.CurrentState;

            //if our state is controlled, handle the following FIRST
            if(this._celestial.IsControlled) {
                //if we touch the top wall, just start hanging
                if(this._celestial.Transform.isTouchingWall(Transform.WALL.Top))
                    if(this._tryToHang(Transform.WALL.Top)) return;
                //see if we are touching a wall
                if(this._celestial.Transform.isTouchingWall(Transform.WALL.Left, Transform.WALL.Right)) {
                    if(!this._tryToClimb(wallHit))
                        //if we don't want to climb, just flip around
                        this._celestial.flipX();
                        return;
                }
            }

            switch(currentState) {
                case cs.STATE.Walk:
                case cs.STATE.Idle:
                case cs.STATE.Fall:
                    //if we hit a wall, check if we want to handle it
                    if(!this._tryToClimb(wallHit))
                        //if we don't want to climb, just flip around
                        this._celestial.flipX();
                    //if we hit the ceiling, try to hang
                    this._tryToHang(wallHit);
                    break;
                case cs.STATE.Climb:
                    //if we touch the roof, try to hang
                    if(this._tryToHang(wallHit)) break;
                    //make sure we are on the wall
                    if(!this._celestial.Transform.isTouchingWall(Transform.WALL.Left, Transform.WALL.Right)) {
                        this.nextState();                   
                        break;
                    }
                    //make sure we are facing the right direction
                    if(this._celestial.Transform.isTouchingWall(Transform.WALL.Left) && this._celestial.Direction.x != -1) {
                        this.nextState();
                        break;
                    }
                    if(this._celestial.Transform.isTouchingWall(Transform.WALL.Right) && this._celestial.Direction.x != 1) {
                        this.nextState();
                        break;
                    }
                    break;
                case cs.STATE.Hang:
                    //flip if we touch a wall
                    if(wallHit != null)
                        if(wallHit == Transform.WALL.Left || wallHit == Transform.WALL.Right)
                            this._celestial.flipX();
                    //make sure we are on the ceiling
                    if(wallHit == null)
                        if(this._celestial.Bounds.Top > App.Bounds.Top) this.nextState();
                    break;
                case cs.STATE.Recover:
                    //make sure we are on the ground
                    if(this._celestial.Bounds.Bottom < App.Bounds.Bottom) this.nextState();
                    break;
                case cs.STATE.Hold:
                    //if we touch the top wall, just start hanging
                    if(this._celestial.Transform.isTouchingWall(Transform.WALL.Top))
                        this._tryToHang(engines.Transform.WALL.Top);
                    //stop the hold if we are not controlled anymore
                    else if(!this._celestial.IsControlled) {
                        //if we are in the air, try falling first
                        if(!this._celestial.Transform.isTouchingWall(Transform.WALL.Bottom)) {
                            if(!this.startState(engines.CelestialSequencer.STATE.Fall))
                                this.nextState(); //fallback
                        }
                        else this.nextState();
                        
                    }
                    break;
                case cs.STATE.Fall:
                    //if we touched the ceiling, try to hang
                    if(this._celestial.Transform.isTouchingWall(engines.Transform.WALL.Top)) {
                        this._tryToHang(engines.Transform.WALL.Top);
                    }
                    break;
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
                    //vary properties
                    this._attentionSpan = clamp(this._attentionSpan + randomRange(-this._celestial.Variation, this._celestial.Variation), 0, 100);



                    //set the first sequence
                    // let state:string = this._celestial.Sequencer.changeState(this._celestial.Sequencer.getRandomState());
                    //TODO: find out the spawn location of the celestial to see what sequence we can spawn with
                    let state = this._celestial.Sequencer.changeState(engines.CelestialSequencer.STATE.Fall, engines.CelestialSequencer.STATE.Idle);
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

                if(!this._celestial.IsControlled) {
                    //uses the state name to look for a function matching this: _handle[State]
                    let funcName:string = `_handle${state[0].toUpperCase()}${state.substr(1)}`;
                    if(this[funcName] != null)
                        this[funcName]();

                    //check state for integrity
                    if(!this._pauseIntegrityCheck)
                        this._handleStateIntegrity();
                }
                //handle holding
                else {
                    this._celestial.Physics.setGravity(0);
                    //handle holds specifically
                    if(this._celestial.Sequencer.isCurrentState(engines.CelestialSequencer.STATE.Hold))
                        this._handleHolds();
                }


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
            const frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            //get the walk properties
            const moveSpeed:number = frame.moveSpeed * this._sizeMultiplier || 0;
            const jumpForce:number = frame.jumpForce * this._sizeJumpMultiplier || 0;
            //look for property value
            this._celestial.Transform.setMoveXSpeed(moveSpeed * this._celestial.Direction.x);
            this._celestial.Physics.addForceY(-jumpForce);
        }
        /**How the last walk frame is handled. */
        private _completeWalks() {

        }

        /**How the climb is handled ever update. */
        private _handleClimbs() {
            const frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            //get the climb properties
            const moveSpeed:number = frame.moveSpeed * this._sizeMultiplier || 10;
            //set the property
            this._celestial.Transform.setMoveYSpeed(-moveSpeed);
        }
        /**How the last climb frame is handled. */
        private _completeClimbs() {
            //jump off wall
            switch(this._celestial.Transform.LastTouchedWall) {
                case Transform.WALL.Left:
                    this._celestial.Physics.addForceX(randomRange(35, 80));
                    this._celestial.flipX();
                    break;
                case Transform.WALL.Right:
                    this._celestial.Physics.addForceX(randomRange(-35, -80));
                    this._celestial.flipX();
                    break;
            }
        }

        /**How the hang is handled every update. */
        private _handleHangs() {
            const frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            this._celestial.Physics.setGravity(0);
            //get the hang properties
            const moveSpeed:number = frame.moveSpeed & this._sizeMultiplier || 2;
            //set the properties
            this._celestial.Transform.setMoveXSpeed(moveSpeed * this._celestial.Direction.x);
        }


        /**How the fall is handled every update. */
        private _handleFalls() {
            const frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
        }

        /**How the hold is handled every update. */
        private _handleHolds() {
            const frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            
        }
        private _completeHolds() {
            //if we are in the air, try to fall
        }

        

        /**How the spawn frame is handled. */
        private _handleSpawns() {
            const frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            if(frame.moveSpeed != null) this._celestial.Transform.setMoveXSpeed(frame.moveSpeed * this._sizeMultiplier * this._celestial.Direction.x);
            if(frame.jumpForce != null) this._celestial.Physics.addForceY(-frame.jumpForce * this._sizeJumpMultiplier);
        }
        /**How the interaction frame is handled. */
        private _handleInteractions() {
            const frame:engines.ICelestialFrame = this._celestial.Sequencer.CurrentFrame;
            if(frame.jumpForce != null) this._celestial.Physics.addForceY(-frame.jumpForce * this._sizeJumpMultiplier);
        }


        private _tryToFlipX() {
            //get a random number
            let random:number = randomRange(0, 1);
            //don't flip on climb/hang
            let wantToFlipX:number = lerp((this._eagerness * 5), 100, random);
            if(wantToFlipX > this._attentionSpan) this._celestial.flipX();
        }



        private _tryToClimb(wallHit?:string):boolean {   
            if(this._celestial.Sequencer.isCurrentState(engines.CelestialSequencer.STATE.Spawn)) return false;
            //if we hit a wall, check if we want to handle it
            if(wallHit != null) {
                //see if we hit the edges
                if(wallHit == Transform.WALL.Left || wallHit == Transform.WALL.Right) {

                    //see if we want to climb - uses the attention span of the current sequence set
                    if(randomRange(0, 1) > this._celestial.Sequencer.CurrentSequenceSet.attentionSpan || 100 / 100) {

                        //get the climb state
                        let state:string = this._celestial.Sequencer.changeState(engines.CelestialSequencer.STATE.Climb);
                        //if we can't climb, abort!
                        if(state != engines.CelestialSequencer.STATE.Climb) return false;
                        
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

        private _tryToHang(wallHit?:string):boolean {
            if(this._celestial.Sequencer.isCurrentState(engines.CelestialSequencer.STATE.Spawn)) return false;
            if(wallHit == null) return false;
            if(wallHit != Transform.WALL.Top) return false;
            //TODO see if we want to hang
            if(randomRange(0, 1) > 0) {
                //get the hang state
                let state:string = this._celestial.Sequencer.changeState(engines.CelestialSequencer.STATE.Hang);
                //if we can't hang, abort!
                if(state != engines.CelestialSequencer.STATE.Hang) return false;
                //try to get a hange sequence
                let sequence = this._celestial.Sequencer.getRandomStateSequence(state);
                if(sequence != null) {
                    this._celestial.Sequencer.changeSequence(sequence);
                    return true;
                }
            }
            return false;
        }


        public get AttentionSpan():number { return this._attentionSpan; }
    }

    
}