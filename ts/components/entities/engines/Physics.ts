namespace celestials.engines {
    export interface IPhysics {
        gravity?:number;
        degradeVelocity?:number;
        usesGravity?:boolean;
    }
    
    export class Physics implements IUpdateable {
        public static get DEF_GRAVITY():number { return 9.81; }
        private _entity:entities.Entity;
        private _gravity:number;
        private _velocity:IPoint;
        private _degradeVelocity:number;

        private _usesGravity:boolean;

        

        constructor(entity:entities.Entity) {
            this._entity = entity;
            this._gravity = Physics.DEF_GRAVITY;
            this._usesGravity = true;
            this._velocity = {
                x: 0,
                y: 0
            };
            this._degradeVelocity = 0.75;

            //read entity for gravity data
            if(this._entity.Data.physics != null) {
                let data:IPhysics = this._entity.Data.physics;
                if(data.gravity != null) this._gravity = data.gravity;
                if(data.degradeVelocity != null) this._degradeVelocity = data.degradeVelocity;
                if(data.usesGravity != null) this._usesGravity = data.usesGravity
            }


            

        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public addForceX(value:number) {
            this._velocity.x += value;
        }
        public addForceY(value:number) {
            this._velocity.y += value;
        }
        public zeroVelocity() {
            this._velocity.x = 0;
            this._velocity.y = 0;
        }
        public setGravity(value:number) {
            this._gravity = value;
        }
        public resetGravity() {
            this._gravity = this._entity.Data.physics.gravity || Physics.DEF_GRAVITY;
        }

        correctVelocity() {
            //get properties
            let screenBounds:Rect = App.Bounds;
            let entityBounds:Rect = this._entity.Bounds;

            if(entityBounds.Left <= screenBounds.Left) if(this._velocity.x < 0) this._velocity.x = 0;
            if(entityBounds.Right >= screenBounds.Right) if(this._velocity.x > 0) this._velocity.x = 0;
            if(entityBounds.Top <= screenBounds.Top) if(this._velocity.y < 0) this._velocity.y = 0;
            if(entityBounds.Bottom >= screenBounds.Bottom) if(this._velocity.y > 0) this._velocity.y = 0;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        async update() {
            this._velocity.x = lerp(this._velocity.x, 0, this._degradeVelocity);
            this._velocity.y = lerp(this._velocity.y, ((this._usesGravity) ? this._gravity : 0), this._degradeVelocity);
            
            await this.correctVelocity();

            
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get Velocity():IPoint { return {x:this._velocity.x, y:this._velocity.y}; }
        public get Gravity():number { return this._gravity; }

        


    }

}