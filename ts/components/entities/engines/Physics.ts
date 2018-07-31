namespace celestials.engines {
    export interface IPhysics {
        gravity?:number;
        degradeVelocity?:number;
        usesGravity?:boolean;
    }
    
    export class Physics implements IUpdateable {
        public static get Wall() { return Object.freeze({"Top":0, "Right":1, "Bottom":2, "Left":3});}
        public static get DEF_GRAVITY():number { return 10; }
        private _entity:entities.Entity;
        private _gravity:number;
        private _velocityX:number;
        private _velocityY:number;
        private _degradeVelocity:number;

        private _usesGravity:boolean;
        private _touchedWall:number;

        //callbacks
        private _onWallHitListener:Function;

        constructor(entity:entities.Entity) {
            this._entity = entity;
            this._gravity = Physics.DEF_GRAVITY;
            this._usesGravity = true;
            this._velocityX = 0;
            this._velocityY = 0;
            this._degradeVelocity = 0.75;

            //read entity for gravity data
            if(this._entity.Data.physics != null) {
                let data:IPhysics = this._entity.Data.physics;
                if(data.gravity != null) this._gravity = data.gravity;
                if(data.degradeVelocity != null) this._degradeVelocity = data.degradeVelocity;
                if(data.usesGravity != null) this._usesGravity = data.usesGravity
            }


            this._onWallHitListener = null;

        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public addForceX(value:number) {
            this._velocityX += value;
        }
        public addForceY(value:number) {
            this._velocityY += value;
            console.log("VEL: " + value);
            this.update();
        }
        public setGravity(value:number) {
            this._gravity = value;
        }
        public resetGravity() {
            this._gravity = this._entity.Data.physics.gravity || Physics.DEF_GRAVITY;
        }


        public snapToLeft() {
            this._entity.X = App.Bounds.Left + this._entity.RegistrationOffset.x;
        }
        public snapToRight() {
            this._entity.X = App.Bounds.Right - this._entity.Bounds.Width + this._entity.RegistrationOffset.x;
        }

        keepInBounds() {
            //get properties
            let screenBounds:Rect = App.Bounds;
            let entityBounds:Rect = this._entity.Bounds;
            let regOffset:IPoint = this._entity.RegistrationOffset;

            if(entityBounds.Left < screenBounds.Left) {
                this._entity.X = screenBounds.Left + regOffset.x;
                this.callWallHit(Physics.Wall.Left);
            }
            else if(entityBounds.Right > screenBounds.Right) {
                this._entity.X = screenBounds.Right - (entityBounds.Width - regOffset.x);
                this.callWallHit(Physics.Wall.Right);
            }
            if(entityBounds.Top < screenBounds.Top) {
                this._entity.Y = screenBounds.Top + (entityBounds.Height - regOffset.y);
                this.callWallHit(Physics.Wall.Top);
            }
            else if(entityBounds.Bottom > screenBounds.Bottom) {
                this._entity.Y = screenBounds.Bottom - regOffset.y;
                this.callWallHit(Physics.Wall.Bottom);
            }
        }

        correctVelocity() {
            //get properties
            let screenBounds:Rect = App.Bounds;
            let entityBounds:Rect = this._entity.Bounds;

            if(entityBounds.Left <= screenBounds.Left) if(this._velocityX < 0) this._velocityX = 0;
            if(entityBounds.Right >= screenBounds.Right) if(this._velocityX > 0) this._velocityX = 0;
            if(entityBounds.Top <= screenBounds.Top) if(this._velocityY < 0) this._velocityY = 0;
            if(entityBounds.Bottom >= screenBounds.Bottom) if(this._velocityY > 0) this._velocityY = 0;
        }


        addWallHitListener(listener:Function) {
            this._onWallHitListener = listener;
        }
        removeWallHitListener() {
            this._onWallHitListener = null;
        }


        callWallHit(wall:number) {
            this._touchedWall = wall;
            if(this._onWallHitListener != null)
                this._onWallHitListener(wall);
        }

        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        async update() {
            //degrade velocity
            this._velocityX *= this._degradeVelocity;
            this._velocityY *= this._degradeVelocity;

            //add gravity to entity
            if(this._usesGravity) {
                this._velocityY += this._gravity;
            }

            await this.correctVelocity();
            //set the new position
            this._entity.X += this._velocityX;
            this._entity.Y += this._velocityY;

            
            await this.keepInBounds();
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get LastTouchedWall():number { return this._touchedWall; }


    }

}