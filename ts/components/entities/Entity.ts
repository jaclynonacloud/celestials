namespace celestials.entities {

    export interface IEntity {
        name?:string;
        path?:string;
        //setup
        position?:IPoint;
        registrationPoint?:IPoint;
        direction?:IPoint;
        //engines
        physics?:engines.IPhysics;
    }

    export class Entity {
        private _name:string;
        protected _node:HTMLElement;
        protected _container:HTMLElement;
        protected _mainImage:HTMLImageElement;

        protected _data:IEntity;

        protected _position:IPoint;
        protected _registrationPoint:IPoint;
        protected _direction:IPoint;

        constructor(name:string, node:HTMLElement, data:IEntity=null) {
            this._name = name;

            this._node = node.cloneNode(true) as HTMLElement;
            this._node.style.position = "absolute";
            this._node.classList.remove("template");

            this._position = {
                x: 0,
                y: 0
            }

            this._registrationPoint = {
                x: 0.5,
                y: 1
            }

            this._direction = {
                //1,1 faces right, upright
                x: 1,
                y: 1
            }

            this._data = data;


            //setup with data, if applicable
            if(this._data != null) {
                if(this._data.position != null) this._position = this._data.position;
                if(this._data.registrationPoint != null) this._registrationPoint = this._data.registrationPoint;
                if(this._direction != null) this._direction = this._data.direction;
            }


            
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public async load() {
            //set position
            console.log(this._position);
            this.X = this._position.x;
            this.Y = this._position.y;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get Node():HTMLElement { return this._node; }
        public get Name():string { return this._name; }
        public get Data():IEntity { return this._data; }
        public get X():number { return this._position.x; }
        public set X(value:number) { 
            this._position.x = value;
            this._node.style.left = `${this._position.x}px`;
        }
        public get Y():number { return this._position.y; }
        public set Y(value:number) { 
            this._position.y = value;
            this._node.style.top = `${this._position.y}px`;
        }

        public get RegistrationPoint():IPoint { return this._registrationPoint; }

        public get RegistrationOffset():IPoint { 
            return {
                x: this.Width * this._registrationPoint.x,
                //because we are attached to the bottom, 
                //our reg point needs to start at the bottom
                y: this.Height - (this.Height * this._registrationPoint.y)
            };
        }

        public get Width():number {
            return this._mainImage.getBoundingClientRect().width;
        }
        public get Height():number {
            return this._mainImage.getBoundingClientRect().height;
        }

        public get Bounds():Rect { 
            // return new Rect(this._position.x, this._position.y, this._mainImage.getBoundingClientRect().width, this._mainImage.getBoundingClientRect().height); 
            return new Rect(this._position.x - this.RegistrationOffset.x, this._position.y - (this.Height - this.RegistrationOffset.y), this.Width, this.Height); 
        }
    }
}