namespace celestials.entities {

    export interface IEntity {
        name?:string;
        path?:string;
        //setup
        registrationPoint?:IPoint;
        direction?:IPoint;
        //engines
        physics?:engines.IPhysics;
        transform?:engines.ITransform;
    }

    export class Entity implements ILoadable {
        private _name:string;
        protected _node:HTMLElement;
        protected _container:HTMLElement;
        protected _mainImage:HTMLImageElement;

        //engines used by all entities
        protected _physics:engines.Physics;
        protected _transform:engines.Transform;

        protected _data:IEntity;
        protected _imagesLookup:Dictionary<string, string>; //name, src

        protected _registrationPoint:IPoint;
        protected _direction:IPoint;

        protected _width:number;
        protected _height: number;

        protected _isLoaded:boolean;

        //lets objects listen for changes to the entity
        private _callbacksRegistry:Dictionary<HTMLElement, Function[]>;

        constructor(name:string, node:HTMLElement, data:IEntity=null) {
            this._name = name;

            this._node = node.cloneNode(true) as HTMLElement;
            this._node.style.position = "absolute";
            this._node.classList.remove("template");

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
            this._imagesLookup = new Dictionary();

            this._isLoaded = false;

            this._callbacksRegistry = new Dictionary();


            //setup with data, if applicable
            if(this._data != null) {
                if(this._data.registrationPoint != null) this._registrationPoint = this._data.registrationPoint;
                if(this._data.direction != null) this._direction = this._data.direction;
            }


            
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        /**Adds image to the image lookup. */
        public addImage(key:string, src:string):boolean {
            if(this._imagesLookup.containsKey(key))
                return false;
            this._imagesLookup.add(key, src);
            return true;
        }
        /**Gets the image associated to the key. */
        public getImage(key:string) {
            if(this._imagesLookup.containsKey(key))
                return this._imagesLookup.getValue(key);
        }

        public setName(name:string) {
            this._name = name;
        }

        public flipX() {
            //flip the entity
            this._direction.x *= -1;
            this.setDirectionX(this._direction.x);
        }
        public setDirectionX(value:number) {
            console.log("DIRECTION CHANGE: " + value);
            this._direction.x = value;
            let deg = this._direction.x == 1 ? 0 : 180;
            this._node.style.transform = `rotateY(${deg}deg)`;
        }

        public callListeners() {
            for(let html of this._callbacksRegistry.List)
                for(let func of html)
                    func();
        }


        public showRegistrationPoint(show:boolean) {
            let regPointDiv = this._node.querySelector(".coord");
            if(regPointDiv == null) return;
            if(show) regPointDiv.classList.remove("hide");
            else regPointDiv.classList.add("hide");
        }


        public registerListener(node:HTMLElement, func:Function) {
            //look for entry
            if(this._callbacksRegistry.containsKey(node)) {
                //add to preexisitng registry
                this._callbacksRegistry.getValue(node).push(func);
            }
        }
        public removeListeners(node:HTMLElement) {
            if(this._callbacksRegistry.containsKey(node))
                this._callbacksRegistry.remove(node);
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public async load() {
            return new Promise((resolve, reject) => {
                try {
                    resolve();
                }
                catch(e) {
                    reject();
                }
            });
        }
        public unload() {
            
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get Node():HTMLElement { return this._node; }
        public get Name():string { return this._name; }
        public get Data():IEntity { return this._data; }
        public get X():number { return (this._transform != null) ? this._transform.Position.x : 0; }
        public get Y():number { return (this._transform != null) ? this._transform.Position.y : 0; }
        public get Direction():IPoint { return this._direction; }

        public get RegistrationPoint():IPoint { return this._registrationPoint; }

        public get RegistrationOffset():IPoint { 
            return {
                x: this.Width * this._registrationPoint.x,
                //because we are attached to the bottom, 
                //our reg point needs to start at the bottom
                y: this.Height - (this.Height * this._registrationPoint.y)
            };
        }

        public get ImagesLookup():Dictionary<string, string> { return this._imagesLookup; }

        public get Width():number {
            return this._width
        }
        public get Height():number {
            return this._height;
        }

        public get MainImage():HTMLImageElement { return this._mainImage; }

        public get IsLoaded():boolean {
            return this._isLoaded;
        }

        public get Bounds():Rect { 
            return (this._transform != null) ? new Rect(this._transform.Position.x - this.RegistrationOffset.x, this._transform.Position.y - (this.Height - this.RegistrationOffset.y), this.Width, this.Height) : Rect.Empty; 
        }
    }
}