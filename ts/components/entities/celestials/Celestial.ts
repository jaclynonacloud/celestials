///<reference path="./../Entity.ts" />
namespace celestials.entities {

    export interface ICelestial extends IEntity {
        lookup?:string;
        scale?:{min:number, max:number};
        images?:{name:string, path:string, src?:string}[];
        spritesheets?:ISpritesheet[];
        physics?:engines.IPhysics;
        sequences?:logic.ICelestialSequences;
    }
    export interface ISpritesheet {
        path?:string;
        frames?:{name:string, x:number, y:number, width:number, height:number, src?:string}[];
    }

    export class Celestial extends Entity implements ICloneable<Celestial>, IUpdateable {

        private _logic:logic.CelestialLogic;
        private _physics:engines.Physics;

        private _scale:number;
        private _eventsRegistry:Dictionary<string, any>;

        constructor(node:HTMLElement, container:HTMLElement, json:ICelestial) {
            super(json.name, node, json as any);
            this._container = container;
            //create the main image holder
            // this._mainImage = document.createElement("img");
            // this._mainImage.classList.add("mainImage");
            console.log(this._node);
            this._mainImage = this._node.querySelector(".main-image");

            //add name to node
            this._node.dataset.name = this.Name;
            console.log("Created: " + this.Name);

            this._eventsRegistry = new Dictionary();
            this._eventsRegistry.add("sequenceComplete", this._onSequenceComplete.bind(this));
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        /**
         * Loads the Celestial's graphics and other data.
         */
        public async load() {
            await super.load();
            let data:ICelestial = this._data;
            //create logic
            this._logic = new logic.CelestialLogic(this);
            //create physics
            this._physics = new engines.Physics(this);
            //set the scale
            this._scale = randomRange(data.scale.min, data.scale.max);
            

            //iterate through each image
            for(let imgData of data.images) {
                //go get the images to load
                let img = document.createElement("img");
                //listen for load
                img.onload = () => {
                    console.log("LOADED");
                    //set the image
                    imgData.src = img.src;
                }
                //load the image
                img.src = data.path + imgData.path;
                console.log("LOAD THE IMAGE");
            }
            //iterate through each spritesheet
            for(let spritesheet of data.spritesheets) {
                //go get the images to load
                let img = document.createElement("img");
                //listen for laod
                img.onload = () => {
                    //set each frame
                    for(let frame of spritesheet.frames) {
                        //give the chop
                        //give the chop
                        cropImage(img, frame.x, frame.y, frame.width, frame.height, (crop) => {
                            //set as the image
                            frame.src = crop.src;
                        });
                    }
                }
                //load the spritesheet image
                img.src = data.path + spritesheet.path;
            }

            //put the container in
            this._container.appendChild(this._node);
            


            //wire listeners
            this._logic.addSequenceCompleteListener(this._eventsRegistry.getValue("sequenceComplete"));
            
            this._node.addEventListener("click", () => console.log("I'VE CLICKED: " + this.Name));
        }

        /**
         * Unloads the Celestial's graphics and other data.
         */
        public unload() {

            //remove listeners
            this._logic.removeSequenceCompleteListener();
        }

        draw(src:string) {
            if(src == null || src == "") return;

            this._mainImage.onload = () => {
                //set the scale
                this._mainImage.style.width = `${this._mainImage.naturalWidth * this._scale}px`;
                this._mainImage.style.height = `${this._mainImage.naturalHeight * this._scale}px`;

                //offset by registration point
                let x = `-${this.RegistrationOffset.x}px`;
                let y = `-${this.RegistrationOffset.y}px`;
                // this._mainImage.parentElement.style.transform = `translate(${x} ${y})`;
                this._mainImage.style.left = `-${this.RegistrationOffset.x}px`;
                this._mainImage.style.bottom = `-${this.RegistrationOffset.y}px`;
            }

            if(this._mainImage.src != src)
                this._mainImage.src = src;
        }

        getImageByName(name:string):string {
            //search images
            for(let imageData of this.Data.images) {
                if(imageData.name == name)
                    return imageData.src;
            }
            //search spritesheets
            for(let spritesheet of this.Data.spritesheets) {
                for(let frame of spritesheet.frames) {
                    if(frame.name == name)
                        return frame.src;
                }
            }
            return null;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public clone():Celestial {
            let clone:Celestial = new Celestial(managers.CelestialsManager.Template, this._container, JSON.parse(JSON.stringify(this._data)));
            return clone;
        }

        update() {
            this._logic.update();
            this._physics.update();
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onSequenceComplete() {
            console.log("SEQUENCE COMPLETE");
            //TODO set a sequence hierarchy either here or in logic.  Probably in logic.
            this._logic.changeSequence(this._logic.Sequences.idles[0]);
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get Lookup():string { return this.Data.lookup; }
        public get Data():ICelestial { return this._data as ICelestial; }
        public get Logic():logic.CelestialLogic { return this._logic; }
        public get Physics():engines.Physics { return this._physics; }
    }
}