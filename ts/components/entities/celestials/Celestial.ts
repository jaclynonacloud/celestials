///<reference path="./../Entity.ts" />
///<reference path="./../../ui/CelestialOverlay.ts" />
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

        //debug
        private _overlayMenu:ui.CelestialOverlay;

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
            this._eventsRegistry.add("stateChange", this._onStateChange.bind(this));
            this._eventsRegistry.add("stateComplete", this._onStateComplete.bind(this));
            this._eventsRegistry.add("wallHit", this._onWallHit.bind(this));
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        /**
         * Draws an image into the main image container via an src string.
         * @param src The src to load into the string.
         * @returns A Promise(HTMLImageElement) with the loaded image as an argument.
         */
        public draw(src:string):Promise<HTMLImageElement> {

            if(src == this._mainImage.src) return new Promise(function(resolve, reject) { resolve(this._mainImage);})

            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this._mainImage.src = img.src;
                    //set the scale
                    this._width = img.naturalWidth * this._scale;
                    this._height = img.naturalHeight * this._scale;
                    this._mainImage.style.width = `${this._width}px`;
                    this._mainImage.style.height = `${this._height}px`;

                    //offset by registration point
                    let x = `-${this.RegistrationOffset.x}px`;
                    let y = `-${this.RegistrationOffset.y}px`;
                    
                    this._mainImage.style.left = x;
                    this._mainImage.style.bottom = y;

                    resolve(this._mainImage);
                }
                img.onerror = () => reject(new Error("Image could not be loaded!"));
    
                img.src = src;
            });

        }

        public drawCurrentFrame() {
            //TODO remove; redundant line below -- it is covered in the main draw -- for testing only
            if(this.getImage(this._sequencer.CurrentFrame.name) == this._mainImage.src) return new Promise(function(resolve, reject) { resolve(this._mainImage);})
            return this.draw(this.getImage(this._sequencer.CurrentFrame.name));
        }
        
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public clone():Celestial {
            let clone:Celestial = new Celestial(managers.CelestialsManager.Template, this._container, JSON.parse(JSON.stringify(this._data)));
            return clone;
        }

        /**
         * Loads the Celestial's graphics and other data.
         */
        public load() {
            return new Promise((resolve, reject) => {
                try {
                    super.load()
                        .then(() => {
                            let data:ICelestial = this._data;
                            //create logic
                            this._sequencer = new engines.CelestialSequencer(this);
                            //create physics
                            this._physics = new engines.Physics(this);
                            //create logic
                            this._logic = new logic.CelestialLogic(this, this.Data.logic || null);
                            //set the scale
                            this._scale = randomRange(data.scale.min, data.scale.max);
                            // this._scale = 1;
                            
    
                            //iterate through each image
                            let promises = new Array();
                            for(let imgData of data.images) {
                                promises.push(
                                    new Promise((res, rej) => {
                                        try {
                                            //go get the images to load
                                            let img = document.createElement("img");
                                            //listen for load
                                            img.onload = () => {
                                                //set the image
                                                console.log("loaded image!");
                                                // imgData.src = img.src;
                                                if(!this.addImage(imgData.name, img.src))
                                                    throw new Error(`An image already exists belonging to ${this.Name} - ${imgData.name}.  Please choose a unique name.`);
                                                res();
                                            }
                                            //load the image
                                            img.src = data.path + imgData.path;
                                        }
                                        catch(e) {
                                            rej();
                                        }
                                    })
                                );
                            }
                            //iterate through each spritesheet
                            for(let spritesheet of data.spritesheets) {
                                promises.push(
                                    new Promise((res, rej) => {
                                        try {
                                            //go get the images to load
                                            let img = document.createElement("img");
                                            //listen for laod
                                            img.onload = () => {
                                                //set each frame
                                                for(let frame of spritesheet.frames) {
                                                    console.log("loaded sprite!");
                                                    //give the chop
                                                    cropImage(img, frame.x, frame.y, frame.w, frame.h, (crop) => {
                                                        //set as the image
                                                        // frame.src = crop.src;
                                                        if(!this.addImage(frame.name, crop.src))
                                                            throw new Error(`An image already exists belonging to ${this.Name} - ${frame.name}.  Please choose a unique name.`);
                                                        res();
                                                    });
                                                }
                                            }
                                            //load the spritesheet image
                                            img.src = data.path + spritesheet.path;
                                        }
                                        catch(e) {
                                            rej();
                                        }
                                    })
                                );
                            }

                            //once all images are loaded - continue
                            Promise.all(promises)
                                .then(() => {
                                    console.log("loaded all images!");
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
            
            
                                    console.log(this._imagesLookup.FullList);
                                    //load the first logic
                                    this._logic.load()
                                        .then(() => {

                                            //DEBUG: Created a ui menu item to show current controls
                                            this._overlayMenu = new ui.CelestialOverlay(this._node);
                                            this._node.parentNode.appendChild(this._overlayMenu.Node);

                                            resolve();
                                            this._isLoaded = true;
                                        });
                                    
            
                                    //wire listeners
                                    this._sequencer.addSequenceCompleteListener(this._eventsRegistry.getValue("sequenceComplete"));
                                    this._sequencer.addStateChangeListener(this._eventsRegistry.getValue("stateChange"));
                                    this._sequencer.addStateCompleteListener(this._eventsRegistry.getValue("stateComplete"));
                                    this._physics.addWallHitListener(this._eventsRegistry.getValue("wallHit"));
                                    //TODO I've setup the click event, don't readd unless removing this one
                                    this._node.addEventListener("click", () => console.log("I'VE CLICKED: " + this.Name));
                                });
    
    
                        });
                    
                }  
                catch(e) {
                    reject(new Error("Could not load Celestial. \n" + e));
                }

            });            
        }

        /**
         * Unloads the Celestial's graphics and other data.
         */
        public unload() {

            //remove listeners
            this._sequencer.removeSequenceCompleteListener();
            this._sequencer.removeStateChangeListener();
            this._sequencer.removeStateCompleteListener();
            this._physics.removeWallHitListener();
        }

        public async update() {
            //update sequence
            // logic > sequencer > draw > physics
            await this._logic.update();
            // console.log("LOGIC");
            await this._sequencer.update();
            // console.log("SEQUENCER");
            await this.drawCurrentFrame();
            // console.log("DRAW");
            await this._physics.update();
            // console.log("PHYSICS");


            this._overlayMenu.update();
            this._overlayMenu.changeName(this.Name);
            this._overlayMenu.changeSequence(this._sequencer.CurrentSequence.name);


            // this._logic.update()
            //     .then(() => this._sequencer.update())
            //         .then(() => this.draw(this.getImage(this._sequencer.CurrentFrame.name)))
            //             .then(img => this._physics.update());
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onSequenceComplete() {
            console.log("SEQUENCE COMPLETE");
            //TODO set a sequence hierarchy either here or in logic.  Probably in logic.
            // this._sequencer.changeSequence(this._sequencer.Sequences.idles[0]);
            this._logic.next();
        }

        private _onStateChange() {
            // this.startWallhitCooldown();
            this._logic.handleStateChange();
        }
        private _onStateComplete() {
            this._logic.handleStateComplete();
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