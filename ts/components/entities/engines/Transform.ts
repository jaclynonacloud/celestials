namespace celestials.engines {
    export interface ITransform {
        position?:IPoint;
        randomPosition?:boolean;
    }
    
    export class Transform implements IUpdateable, ILoadable {
        public static get WALL() { return Object.freeze({
            "Top":"top", 
            "Right":"right", 
            "Bottom":"bottom", 
            "Left":"left"
        });}
        private _entity:entities.Entity;
        private _physics:Physics;

        private _position:IPoint;
        private _moveSpeed:IPoint;
        private _touchedWall:string;

        //callbacks
        private _onWallHitListener:Function;


        constructor(entity:entities.Entity, physics:Physics) {
            this._entity = entity;
            this._physics = physics;
            this._position = {
                x: 0,
                y: 0
            };
            this._moveSpeed = {
                x: 0,
                y: 0
            };

            //read entity for gravity data
            if(this._entity.Data.transform != null) {
                let data:ITransform = this._entity.Data.transform;
                if(data.position != null) this._position = data.position;
                if(data.randomPosition != null) this._position = {
                    x: randomRange(0, App.Bounds.Width),
                    y: randomRange(0, App.Bounds.Height)
                };
            }


            this._onWallHitListener = null;
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public moveX(moveSpeed:number = 0) {
            this.X += this._physics.Velocity.x + moveSpeed;
            // this._entity.X += moveSpeed;
        }
        public moveY(moveSpeed:number = 0) {
            this.Y += this._physics.Velocity.y + moveSpeed;
            // this._entity.Y += moveSpeed;
        }

        public setMoveXSpeed(moveSpeed:number) {
            this._moveSpeed.x = moveSpeed;
        }
        public setMoveYSpeed(moveSpeed:number) {
            this._moveSpeed.y = moveSpeed;
        }
        public zeroMoveSpeed() {
            this._moveSpeed.x = 0;
            this._moveSpeed.y = 0;
        }

        public snapToLeft() {
            this.X = App.Bounds.Left + this._entity.RegistrationOffset.x;
        }
        public snapToRight() {
            this.X = App.Bounds.Right - this._entity.Bounds.Width + this._entity.RegistrationOffset.x;
        }
        public snapToTop() {
            this.Y = App.Bounds.Top + (this._entity.Bounds.Height - this._entity.RegistrationOffset.y);
        }
        public snapToBottom() {
            this.Y = App.Bounds.Bottom - (this._entity.Bounds.Height + this._entity.RegistrationOffset.y);
        }

        public keepInBounds() {
            //get properties
            let screenBounds:Rect = App.Bounds;
            let entityBounds:Rect = this._entity.Bounds;
            let regOffset:IPoint = this._entity.RegistrationOffset;

            if(entityBounds.Left < screenBounds.Left) {
                this.X = screenBounds.Left + regOffset.x;
                this.callWallHit(Transform.WALL.Left);
            }
            else if(entityBounds.Right > screenBounds.Right) {
                this.X = screenBounds.Right - (entityBounds.Width - regOffset.x);
                this.callWallHit(Transform.WALL.Right);
            }
            if(entityBounds.Top < screenBounds.Top) {
                this.Y = screenBounds.Top + (entityBounds.Height - regOffset.y);
                this.callWallHit(Transform.WALL.Top);
            }
            else if(entityBounds.Bottom > screenBounds.Bottom) {
                this.Y = screenBounds.Bottom - regOffset.y;
                this.callWallHit(Transform.WALL.Bottom);
            }
        }


        public addWallHitListener(listener:Function) {
            this._onWallHitListener = listener;
        }
        public removeWallHitListener() {
            this._onWallHitListener = null;
        }


        public callWallHit(wall:string) {
            this._touchedWall = wall;
            if(this._onWallHitListener != null)
                this._onWallHitListener(wall);
        }


        public isTouchingWall(...walls:string[]) {
            let screenBounds:Rect = App.Bounds;
            let entityBounds:Rect = this._entity.Bounds;

            for(let wall of walls) {
                switch(wall) {
                    case Transform.WALL.Left:
                        if(entityBounds.Left <= screenBounds.Left) return true;
                        break;
                    case Transform.WALL.Right:
                        if(entityBounds.Right >= screenBounds.Right) return true;
                        break;
                    case Transform.WALL.Top:
                        if(entityBounds.Top <= screenBounds.Top) return true;
                        break;
                    case Transform.WALL.Bottom:
                        if(entityBounds.Bottom >= screenBounds.Bottom) return true;
                        break;
                }
            }

            return false;
        }

        

        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public async load() {
            //set initial position
            this.X = this._position.x;
            this.Y = this._position.y;
        }
        public async unload() {
            this.removeWallHitListener();
        }

        public async update() {

            this.moveX(this._moveSpeed.x);
            this.moveY(this._moveSpeed.y);
            
            await this.keepInBounds();
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get X():number { return this._position.x; }
        public set X(value:number) { 
            this._position.x = value;
            this._entity.Node.style.left = `${this._position.x}px`;
        }
        public get Y():number { return this._position.y; }
        public set Y(value:number) { 
            this._position.y = value;
            this._entity.Node.style.top = `${this._position.y}px`;
        }
        public get Position():IPoint { return this._position; }
        public get LastTouchedWall():string { return this._touchedWall; }

        


    }

}