///<reference path="./../Entity.ts" />
///<reference path="../../ui/menus/overlays/CelestialOverlay.ts" />
namespace celestials.entities {

    export interface ICelestial extends IEntity {
        lookup?:string;
        presets?:string[];
        scale?:{min:number, max:number};
        variation?:number;
        maxSpawns?:number;
        zIndex?:number;
        icon?:string;
        images?:{name:string, path:string}[];
        spritesheets?:ISpritesheet[];
        physics?:engines.IPhysics;
        moods?:engines.IMoods;
        logic?:logic.ICelestialLogic;
        sequences?:engines.ICelestialSequences;

        locked?:boolean;
    }
    export interface ISpritesheet {
        path?:string;
        frames?:{name:string, x:number, y:number, w:number, h:number}[];
    }

    export class Celestial extends Entity implements ICloneable<Celestial>, ILoadable, IUpdateable {

        private _sequencer:engines.CelestialSequencer;
        private _physics:engines.Physics;
        private _moods:engines.Moods;
        private _logic:logic.CelestialLogic;

        private _scale:number;
        private _variation:number;
        private _size:number; //created once loaded first logic on height of img vs height of screen
        private _dateSpawned:Date;
        private _spawnedBy:Celestial;
        private _eventsRegistry:Dictionary<string, any>;

        private _paused:boolean;
        private _isControlled:boolean; //true when user is controlling the celestial, such as dragging \\ limited movements

        //debug
        private _overlayMenu:ui.menus.CelestialOverlay;

        constructor(node:HTMLElement, container:HTMLElement, json:ICelestial) {
            super(json.name, node, json as any);
            this._container = container;
            this._mainImage = this._node.querySelector(".main-image");

            this._paused = false;
            this._isControlled = false;
            this._size = 0;

            
            //get the date
            this._dateSpawned = new Date();
            this._spawnedBy = null;

            //add name to node
            this._node.dataset.name = this.Name;
            console.log("Created: " + this.Name);

            this._eventsRegistry = new Dictionary();
            this._eventsRegistry.add("sequenceComplete", this._onSequenceComplete.bind(this));
            this._eventsRegistry.add("stateChange", this._onStateChange.bind(this));
            this._eventsRegistry.add("stateComplete", this._onStateComplete.bind(this));
            this._eventsRegistry.add("wallHit", this._onWallHit.bind(this));
            // this._eventsRegistry.add("click", this._onClicked.bind(this));
            this._eventsRegistry.add("rightClick", this._onRightClicked.bind(this));
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

        public pause() {
            this._paused = true;
        }
        public unpause() {
            this._paused = false;
        }


        public remove() {
            this.unload();
            this._node.remove();

            this._overlayMenu.remove();
        }


        public setName(name:string) {
            super.setName(name);
            managers.CelestialsManager.callChangeCelestial(this);
        }
        public setSpawnParent(celestial:Celestial) {
            this._spawnedBy = celestial;
        }

        public setZIndex(index:number) {
            this.setZIndexTemp(index);
            this.Data.zIndex = index;
        }
        public setZIndexTemp(index:number) {
            this._node.style.zIndex = `${index}`;
        }
        public resetZIndex() {
            this.setZIndexTemp(this.Data.zIndex);
        }


        public async getIcon():Promise<string> {

            if(this._imagesLookup.containsKey("icon")) {
                return new Promise<string>((resolve, reject) => resolve(this._imagesLookup.getValue("icon")));
            }

            let data = this.Data;
            return new Promise<string>((resolve, reject) => {
                //load the icon image
                let iconSrc = data.icon;
                if(iconSrc == null) {
                    if(data.images != null) iconSrc = data.images[0].path;
                    else if(data.spritesheets != null) iconSrc = data.spritesheets[0].path;
                }
                //check for icon
                if(iconSrc != null) {
                    //go get the images to load
                    let img = document.createElement("img");
                    //listen for load
                    img.onload = () => {
                        //set the image
                        console.log("loaded image!");
                        // imgData.src = img.src;
                        if(!this.addImage("icon", img.src))
                            throw new Error(`An image already exists belonging to ${this.Name} - icon.  Please choose a unique name.`);
                        resolve(img.src);
                    }
                    //load the image
                    img.src = data.path + iconSrc;
                }
            });
        }


        public takeControl() {
            this._isControlled = true;
        }
        public releaseControl() {
            this._isControlled = false;
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
        public async load() {
            return await new Promise(async (resolve, reject) => {
                await super.load();
                try {
                    let data:ICelestial = this._data;
                    //create logic
                    this._sequencer = new engines.CelestialSequencer(this);
                    //create physics
                    this._physics = new engines.Physics(this);
                    //create moods
                    this._moods = new engines.Moods(this);
                    //create logic
                    this._logic = new logic.CelestialLogic(this, this.Data.logic || null);
                    //set the scale
                    this._scale = randomRange(data.scale.min, data.scale.max);
                    //set the variation
                    this._variation = randomRange(0, data.variation || 0);
                    // this._scale = 1;
                    //pick a preset name, if defined
                    if(this.Data.presets != null) {
                        //pick a name!
                        this.setName(this.Data.presets[randomRangeInt(0, this.Data.presets.length-1)]);
                    }


                    //destructure data
                    let { path, images, spritesheets, name, lookup } = this.Data;


                    //iterate through each image
                    let promises = new Array();                           

                    
                    if(images != null) {
                        for(let imgData of images) {
                            promises.push(
                                new Promise((res, rej) => {
                                    try {
                                        //go get the images to load
                                        let img = document.createElement("img");
                                        //listen for load
                                        img.onload = () => {
                                            //set the image
                                            this.addImage(imgData.name, img.src)
                                            // if(!this.addImage(imgData.name, img.src))
                                            //     throw new Error(`An image already exists belonging to ${this.Name} - ${imgData.name}.  Please choose a unique name.`);
                                            res();
                                        }
                                        //load the image
                                        img.src = path + imgData.path;
                                    }
                                    catch(e) {
                                        rej();
                                    }
                                })
                            );
                        }
                    }
                    //iterate through each spritesheet
                    if(spritesheets != null) {
                        for(let spritesheet of spritesheets) {
                            promises.push(
                                new Promise((res, rej) => {
                                    try {
                                        //go get the images to load
                                        let img = document.createElement("img");
                                        //listen for laod
                                        img.onload = () => {
                                            //set each frame
                                            for(let frame of spritesheet.frames) {
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
                    }


                    //once all images are loaded - continue
                    await Promise.all(promises);

                    console.log("loaded all images!");
                    //TEST REQUIREMENTS of this entity
                    //needs a lookup
                    if(lookup == null)
                        throw new Error("Celestial has no lookup property!");
                    //needs a name
                    if(name == null)
                        throw new Error("Celestial has no name property!");
                    //needs images
                    if(images == null && spritesheets == null)
                        throw new Error("No images/spritesheets were supplied.");

                    //put the container in
                    this._container.appendChild(this._node);


                    console.log(this._imagesLookup.FullList);
                    //load the moods
                    await this._moods.load();
                    //load the first logic
                    await this._logic.load();
                    //DEBUG: Created a ui menu item to show current controls
                    this._overlayMenu = new ui.menus.CelestialOverlay(this);
                    this._node.parentNode.appendChild(this._overlayMenu.Node);

                    console.log("LOADED ALL OF : " + this.Name);
                    this._size = (this.Height / App.Bounds.Height) * this._scale;
                    resolve();
                    this._isLoaded = true;


                    //DEBUG: THIS IS A TEST
                    //create context menu
                    // ui.CelestialContext.show(this);

                    //fix image problem
                    (this._node.querySelector(".graphics") as HTMLElement).ondragstart = function() { return false; }
                    

                    //wire listeners
                    this._sequencer.addSequenceCompleteListener(this._eventsRegistry.getValue("sequenceComplete"));
                    this._sequencer.addStateChangeListener(this._eventsRegistry.getValue("stateChange"));
                    this._sequencer.addStateCompleteListener(this._eventsRegistry.getValue("stateComplete"));
                    this._physics.addWallHitListener(this._eventsRegistry.getValue("wallHit"));
                    //TODO I've setup the click event, don't readd unless removing this one
                    // managers.MouseManager.listenForMouseDown(this._node, (e) => this._onClicked(e));
                    managers.MouseManager.listenForDrag(this._node,
                        (x,y) => managers.CelestialsManager.onGrab(this, x, y),
                        (x,y) => managers.CelestialsManager.onDrag(this, x, y),
                        (x,y) => managers.CelestialsManager.onDrop(this, x, y)
                    );
                    //on right click, show context menu
                    managers.MouseManager.listenForRightClick(this._node, () => ui.menus.CelestialContext.show(this));
                    
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

            this._node.removeEventListener("click", this._eventsRegistry.getValue("click"));
            this._node.removeEventListener("contextmenu", this._eventsRegistry.getValue("rightClick"));
        }

        public async update() {
            if(this._paused) return;

            //update sequence
            // logic > sequencer > draw > physics
            await this._logic.update();

            //if we have taken control, only render the first frame
            if(!this._isControlled) {

                // console.log("LOGIC");
                await this._sequencer.update();
                // console.log("SEQUENCER");
                await this.drawCurrentFrame();
                // console.log("DRAW");
                await this._physics.update();
                // console.log("PHYSICS");
                await this._moods.update();
            }


            this._overlayMenu.update();
            this._overlayMenu.changeName(this.Name);
            this._overlayMenu.changeSequence(this._sequencer.CurrentSequence.name);
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


        


        // private _onClicked(e:MouseEvent) {
        //     if(e.button != 0) return;
        //     if(this._clickListener != null)
        //         this._clickListener(this);
        // }

        private _onRightClicked(e:Event) {
            e.preventDefault();
            e.stopImmediatePropagation();
            //show context menu
            ui.menus.CelestialContext.show(this);
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get Lookup():string { return this.Data.lookup; }
        public get Data():ICelestial { return this._data as ICelestial; }
        public get Sequencer():engines.CelestialSequencer { return this._sequencer; }
        public get Physics():engines.Physics { return this._physics; }
        public get Moods():engines.Moods { return this._moods; }
        public get Logic():logic.CelestialLogic { return this._logic; }

        public get Paused():boolean { return this._paused; }
        public get IsControlled():boolean { return this._isControlled; }
        public get DateSpawned():Date { return this._dateSpawned; }
        public get Scale():number { return this._scale; }
        public get Variation():number { return this._variation; }
        public get GlobalVariation():number { return this.Data.variation || 0; }
        public get Size():number { return this._size * App.Bounds.Height; }
        public get Mass():number {
            return this._size * this._physics.Gravity;
        }
        public get Age():number {
            let fakeDate = new Date("August 16, 2018");
            return (((new Date()).getTime() - fakeDate.getTime()) / 1000 / 60 / 60);
        }

        public get FavouriteSequence():string {
            let sequence:engines.ICelestialSequenceSet = null;
            let name:string = "None";
            for(let key of Object.keys(engines.CelestialSequencer.STATE)) {
                let state = engines.CelestialSequencer.STATE[key];
                let seq = this._sequencer.getStateByName(state);
                if(seq != null) {
                    if(sequence == null) {
                        sequence = seq;
                        name = key;
                    }
                    else if(seq.attentionSpan > sequence.attentionSpan) {
                        let canBeFavourite = (seq.canBeFavourite == undefined) ? true : seq.canBeFavourite;
                        if(!canBeFavourite) continue;
                        sequence = seq;
                        name = key;
                    }
                }
            }
            return name;
        }

        public get AvailableSequences():string[] {
            let sequences = new Array<string>();
            for(let key of Object.keys(engines.CelestialSequencer.STATE)) {
                let state = engines.CelestialSequencer.STATE[key];
                let seq = this._sequencer.getStateByName(state);
                if(seq != null) {
                    sequences.push(key);
                }
            }

            return sequences;
        }

        public get SpawnedBy():Celestial { return this._spawnedBy; }

        // public get Icon():string {
        //     if(this._imagesLookup.containsKey("icon"))
        //         return this._imagesLookup.getValue("icon");
        //     return this._imagesLookup.List[0];
        // }

        
    }
}