///<reference path="./../Entity.ts" />
namespace celestials.entities {

    export interface ICelestial extends IEntity {
        lookup?:string;
        scale?:{min:number, max:number};
        images?:{name:string, path:string}[];
        spritesheets?:ISpritesheet[];
        physics?:engines.IPhysics;
        logic?:logic.ICelestialLogic;
        sequences?:engines.ICelestialSequences;
    }
    export interface ISpritesheet {
        path?:string;
        frames?:{name:string, x:number, y:number, w:number, h:number}[];
    }

    export class Celestial extends Entity implements ICloneable<Celestial>, ILoadable, IUpdateable {

        private _sequencer:engines.CelestialSequencer;
        private _physics:engines.Physics;
        private _logic:logic.CelestialLogic;

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
            this._eventsRegistry.add("wallHit", this._onWallHit.bind(this));
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public draw(src:string) {
            console.log("SRC: " + src);
            if(src == null || src == "") return null;
            console.log("3-Draw");

            let img = this._mainImage;
            let registrationOffset = this.RegistrationOffset;
            let regPoint = this._registrationPoint;
            let physics = this._physics;

            if(src == this._mainImage.src) return new Promise(function(resolve, reject) { resolve(img);})

            return new Promise(function(resolve, reject) {    
                img.onload = () => {
                    console.log("CHANGING IMAGE");
                    //set the scale
                    let width = img.naturalWidth * this._scale;
                    let height = img.naturalHeight * this._scale;
                    img.style.width = `${width}px`;
                    img.style.height = `${height}px`;

                    let offset = {
                        x: width * regPoint.x,
                        y: height - (height * regPoint.y)
                    };

                    //offset by registration point
                    let x = `-${offset.x}px`;
                    let y = `-${offset.y}px`;
                    // img.parentElement.style.transform = `translate(${x} ${y})`;
                    img.style.left = `-${x}px`;
                    img.style.bottom = `-${y}px`;
                    console.log("3.5-Finish New Draw");

                    resolve(img);
                }
                img.onerror = () => reject(new Error("Image could not be loaded!"));
    
                img.src = src;
            });
        }
        
        // draw(src:string) {
        //     if(src == null || src == "") return;
        //     if(src == this._mainImage.src) return;

        //     return new Promise(function(resolve, reject) {    
        //         this._mainImage.onload = () => {
        //             //set the scale
        //             this._mainImage.style.width = `${this._mainImage.naturalWidth * this._scale}px`;
        //             this._mainImage.style.height = `${this._mainImage.naturalHeight * this._scale}px`;

        //             //offset by registration point
        //             let x = `-${this.RegistrationOffset.x}px`;
        //             let y = `-${this.RegistrationOffset.y}px`;
        //             // this._mainImage.parentElement.style.transform = `translate(${x} ${y})`;
        //             this._mainImage.style.left = `-${this.RegistrationOffset.x}px`;
        //             this._mainImage.style.bottom = `-${this.RegistrationOffset.y}px`;
        //             console.log("LOADED IMG");

        //             resolve();
        //         }
        //         this._mainImage.onerror = () => reject();
    
        //         if(this._mainImage.src != src)
        //             this._mainImage.src = src;
        //     });

        //     // let loadEvent = () => {
        //     //     //set the scale
        //     //     this._mainImage.style.width = `${this._mainImage.naturalWidth * this._scale}px`;
        //     //     this._mainImage.style.height = `${this._mainImage.naturalHeight * this._scale}px`;

        //     //     //offset by registration point
        //     //     let x = `-${this.RegistrationOffset.x}px`;
        //     //     let y = `-${this.RegistrationOffset.y}px`;
        //     //     // this._mainImage.parentElement.style.transform = `translate(${x} ${y})`;
        //     //     this._mainImage.style.left = `-${this.RegistrationOffset.x}px`;
        //     //     this._mainImage.style.bottom = `-${this.RegistrationOffset.y}px`;
        //     //     this._mainImage.removeEventListener("load", loadEvent);
        //     //     console.log("LOADED IMG");
        //     // }

        //     // await this._mainImage.addEventListener("load", loadEvent);

        //     // if(this._mainImage.src != src)
        //     //     this._mainImage.src = src;
        // }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public clone():Celestial {
            let clone:Celestial = new Celestial(managers.CelestialsManager.Template, this._container, JSON.parse(JSON.stringify(this._data)));
            return clone;
        }

        /**
         * Loads the Celestial's graphics and other data.
         */
        public async load() {
            try {
                await super.load();
                let data:ICelestial = this._data;
                //create logic
                this._sequencer = new engines.CelestialSequencer(this);
                //create physics
                this._physics = new engines.Physics(this);
                //create logic
                this._logic = new logic.CelestialLogic(this, this.Data.logic || null);
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
                        // imgData.src = img.src;
                        if(!this.addImage(imgData.name, img.src))
                            throw new Error(`An image already exists belonging to ${this.Name} - ${imgData.name}.  Please choose a unique name.`);
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
                            cropImage(img, frame.x, frame.y, frame.w, frame.h, (crop) => {
                                //set as the image
                                // frame.src = crop.src;
                                if(!this.addImage(frame.name, crop.src))
                                    throw new Error(`An image already exists belonging to ${this.Name} - ${frame.name}.  Please choose a unique name.`);
                            });
                        }
                    }
                    //load the spritesheet image
                    img.src = data.path + spritesheet.path;
                }

                //TEST REQUIREMENTS of this entity
                //needs a lookup
                if(data.lookup == null)
                    throw new Error("Celestial has no lookup property!");
                //needs a name
                if(data.name == null)
                    throw new Error("Celestial has no name property!");
                //needs images
                if(data.images == null && data.spritesheets == null)
                    throw new Error("No images/spritesheets were supplied.");

                //put the container in
                this._container.appendChild(this._node);


                //load the first logic
                await this._logic.load();
                

                this._isLoaded = true;

                //wire listeners
                this._sequencer.addSequenceCompleteListener(this._eventsRegistry.getValue("sequenceComplete"));
                this._physics.addWallHitListener(this._eventsRegistry.getValue("wallHit"));
                
                this._node.addEventListener("click", () => console.log("I'VE CLICKED: " + this.Name));
            }  
            catch(e) {
                console.log("Could not load Celestial. \n" + e);
            }
        }

        /**
         * Unloads the Celestial's graphics and other data.
         */
        public unload() {

            //remove listeners
            this._sequencer.removeSequenceCompleteListener();
            this._physics.removeWallHitListener();
        }

        public async update() {
            console.log("1-Update");
            await this._logic.update();
            await this._sequencer.update();
            //now draw
            this.draw(this._sequencer.CurrentFrame.name)
            .then(img => {
                this._physics.update();
            });
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onSequenceComplete() {
            console.log("SEQUENCE COMPLETE");
            //TODO set a sequence hierarchy either here or in logic.  Probably in logic.
            // this._sequencer.changeSequence(this._sequencer.Sequences.idles[0]);
            this._logic.next();
        }

        private _onWallHit(which:number) {
            console.log("Hit wall " + which);
            //tell logic
            this._logic.handleWallHit(which);
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get Lookup():string { return this.Data.lookup; }
        public get Data():ICelestial { return this._data as ICelestial; }
        public get Sequencer():engines.CelestialSequencer { return this._sequencer; }
        public get Physics():engines.Physics { return this._physics; }
        public get Logic():logic.CelestialLogic { return this._logic; }
    }
}