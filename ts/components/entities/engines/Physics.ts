namespace celestials.engines {
    export interface IPhysics {
        gravity?:number;
        degradeVelocity?:number;
        usesGravity?:boolean;
    }
    
    export class Physics implements IUpdateable {
        public static get DEF_GRAVITY():number { return 10; }
        private _entity:entities.Entity;
        private _gravity:number;
        private _velocityX:number;
        private _velocityY:number;
        private _degradeVelocity:number;

        private _usesGravity:boolean;

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

        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public addForceX(value:number) {
            this._velocityX += value;
        }
        public addForceY(value:number) {
            this._velocityY += value;
        }
        public setGravity(value:number) {
            this._gravity = value;
        }

        keepInBounds() {
            //get properties
            let screenBounds:Rect = App.Bounds;
            let entityBounds:Rect = this._entity.Bounds;
            let regOffset:IPoint = this._entity.RegistrationOffset;

            // if(entityBounds.Left < screenBounds.Left) this._entity.X = screenBounds.Left;
            // else if(entityBounds.Right > screenBounds.Right) this._entity.X = screenBounds.Right - entityBounds.Width;
            // if(entityBounds.Top < screenBounds.Top) this._entity.Y = screenBounds.Top;
            // else if(entityBounds.Bottom > screenBounds.Bottom) this._entity.Y = screenBounds.Bottom - entityBounds.Height;

            if(entityBounds.Left < screenBounds.Left) this._entity.X = screenBounds.Left + regOffset.x;
            else if(entityBounds.Right > screenBounds.Right) this._entity.X = screenBounds.Right - (entityBounds.Width - regOffset.x);
            if(entityBounds.Top < screenBounds.Top) this._entity.Y = screenBounds.Top + (entityBounds.Height - regOffset.y);
            else if(entityBounds.Bottom > screenBounds.Bottom) this._entity.Y = screenBounds.Bottom - regOffset.y;
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
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        update() {
            //degrade velocity
            this._velocityX *= this._degradeVelocity;
            this._velocityY *= this._degradeVelocity;

            //add gravity to entity
            if(this._usesGravity) {
                this._velocityY += this._gravity;
            }

            this.correctVelocity();
            //set the new position
            this._entity.X += this._velocityX;
            this._entity.Y += this._velocityY;

            
            this.keepInBounds();
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/


    }

}