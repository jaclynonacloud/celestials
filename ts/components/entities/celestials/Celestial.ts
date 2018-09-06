///<reference path="./../Entity.ts" />
///<reference path="../../ui/menus/overlays/CelestialOverlay.ts" />
namespace celestials.entities {

    export interface ICelestial extends IEntity {
        lookup?:string;
        presets?:string[];
        scale?:{min:number, max:number};
        variation?:number;
        spawnChance?:number; //the odds during a spawn update that this celestial will spawn
        maxSpawns?:number; //the max number of celestials of this type that may appear
        maxDescendants?:number; //the max descendants a celestial is allowed to spawn
        spawnLineage?:ISpawnLineage[];
        zIndex?:number;
        icon?:string;
        images?:{name:string, path:string}[];
        spritesheets?:ISpritesheet[];
        moods?:engines.IMoods;
        relationships?:engines.IRelationships;
        logic?:logic.ICelestialLogic;
        sequences?:engines.ICelestialSequences;

        locked?:boolean;
    }
    export interface ISpritesheet {
        path?:string;
        frames?:{name:string, x:number, y:number, w:number, h:number}[];
    }
    export interface ISpawnLineage {
        lookup:string;
        chance:number;
        rare?:boolean; //if rare, the celestial will ignore the cap and allow it to be spawned
    }

    export class Celestial extends Entity implements ICloneable<Celestial>, ILoadable, IUpdateable {

        private _sequencer:engines.CelestialSequencer;
        private _moods:engines.Moods;
        private _relationships:engines.Relationships;
        private _logic:logic.CelestialLogic;

        private _scale:number;
        private _variation:number;
        private _size:number; //created once loaded first logic on height of img vs height of screen
        private _dateSpawned:Date;
        private _eventsRegistry:Dictionary<string, any>;
        
        private _paused:boolean;
        private _isControlled:boolean; //true when user is controlling the celestial, such as dragging \\ limited movements
        private _icon:HTMLImageElement;
        
        private _spawnTick:number;
        private _spawnOdds:number; //increments for every failed spawn
        private _isSpawning:boolean;
        private _spawnedBy:Celestial;
        private _descendants:Celestial[];

        private _collisionObject:systems.ICollisionObject;
        private _interactingWith:Celestial;
        private _interactBurnout:number;

        //debug
        private _overlayMenu:ui.menus.CelestialOverlay;

        constructor(node:HTMLElement, container:HTMLElement, json:ICelestial) {
            super(json.name, node, json as any);
            this._container = container;
            this._mainImage = this._node.querySelector(".main-image");

            this._paused = false;
            this._isControlled = false;
            this._size = 0;

            this._spawnTick = 0;
            this._spawnOdds = 0;
            this._isSpawning = false;
            this._descendants = new Array();

            this._interactingWith = null;
            this._interactBurnout = 0;

            
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

        public async drawCurrentFrame() {
            //TODO remove; redundant line below -- it is covered in the main draw -- for testing only
            //if(this.getImage(this._sequencer.CurrentFrame.name) == this._mainImage.src) return await new Promise(function(resolve, reject) { resolve(this._mainImage);})
            return await this.draw(this.getImage(this._sequencer.CurrentFrame.name));
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

        public trySpawn() {
            this._spawnTick = 0;
            if(this.Data.spawnChance == null) return; //no spawning if no chance
            console.log(this.Data.spawnChance);
            console.log("LISTEN FOR SPAWNING!!!!!!!!");
            //increment tick
            this._spawnOdds++;
            let chance = randomRange(0, 100);
            let spawnChance = this.Data.spawnChance;
            let result = Math.abs(chance - this._spawnOdds);

            console.log("SPAWN CHANCE: ", spawnChance, " ODDS: ", this._spawnOdds, " CHANCE: ", chance, "COMB: ", result);
            if(result < spawnChance) {
                console.log("SPAWNING FRIEND");
                this.spawn();
            }
        }
        public spawn() {
            //reset odds
            this._spawnOdds = 0;
            this._isSpawning = true;
            //play a spawn sequence, if there is one
            if(!this._logic.startState(engines.CelestialSequencer.STATE.Spawn))
                this.endSpawn();
        }
        public async endSpawn(spawnChance?:number) {
            this._isSpawning = false;
            spawnChance = spawnChance || 50;
            console.log("MIGHT SPAWN");
            let chance = randomRange(0, 100);
            console.log("CHANCE: ", chance, "SPAWN CHANCE: ", spawnChance);
            if(spawnChance > chance) {
                console.log("WANT TO SPAWN!");
                
                //find the celestial to spawn
                let lookup = this.Lookup;
                let rare = false;
                if(this.Data.spawnLineage != null) {
                    //iterate through and test
                    for(let lin of this.Data.spawnLineage) {
                        let odds = randomRange(0, 100);
                        //test the value
                        if(lin.chance >= odds) {
                            //make sure the template is good
                            if(managers.CelestialsManager.getTemplateByLookup(lin.lookup) != null) {
                                lookup = lin.lookup;
                                rare = lin.rare || false;
                            }
                        }
                    }
                }

                //make sure we have not maxed out our descendants!
                console.log("MAX: " + this.Data.maxDescendants + ", CURRENT: " + this._descendants.length);
                //max descendants ONLY applies if we are not spawning a celestial deemed rarer
                if(this.Data.maxDescendants != null) {
                    if(this._descendants.length >= this.Data.maxDescendants && !rare) {
                        console.log(`${this.Name} has too many children!  Cannot spawn any more!`);
                        return;
                    }
                }

                //spawn the actual clone, and give this as its parent
                let spawn = await managers.CelestialsManager.addCelestialByLookupAtPosition(lookup, this.X, this.Y);
                if(spawn != null) {
                    spawn.setSpawnParent(this);
                    //fling the celestial a little bit
                    spawn.Physics.addForceX(randomRange(-100, 100));
                    spawn.Physics.addForceY(randomRange(-100, 100));

                    //set child as a descendant
                    this._descendants.push(spawn);

                    //add a notification that the celestial was spawned
                    let func = () => ui.menus.CelestialDetails.show(spawn);
                    systems.Notifications.addNotification(`${spawn.Name} the ${spawn.Lookup} was spawned!`,
                        systems.Notifications.TYPE.Notify,
                        new Date(),
                        func
                    );
                }
            }
            
        }


        public askToInteractWith(celestial:Celestial) {
            //don't try to interact if we are spawning
            if(this._sequencer.isCurrentState(engines.CelestialSequencer.STATE.Spawn)) return false;
            console.log("I WANT TO TALK TO : " + celestial.Name);
            //if we are already waiting, ignore this interaction proposal
            if(celestial.InteractingWith != null) return false;
            if(celestial.InteractingWith == this) return false;
            console.log("I AM LISTENING: " + this.Name);
            this._interactingWith = celestial;
            //if the celestial is being carried, no interacting
            if(this.Sequencer.CurrentState == engines.CelestialSequencer.STATE.Hold) return false;
            if(celestial.Sequencer.CurrentState == engines.CelestialSequencer.STATE.Hold) return false;
            //if we are burned out, no talking for the moment -- give a window for talking, but small
            if(this._interactBurnout > 0 && randomRange(0, 1) < 0.9) return false;

            //see if we are willing to interact
            //see if our social needs want us to talk
            if(this._moods.UsesMood) {
                let chance = randomRange(0, 100);
                if(chance < this._moods.getMoodByName(engines.Moods.MOOD.Social).value) return false;
                else if(randomRange(0, 1) > 0.2) return false; //otherwise, try to talk anyway
            }
            //see if we have a good relationship with this celestial
            if(this._relationships != null) {
                let relationship = this._relationships.findRelationshipByCelestial(celestial);
                if(relationship != null) {
                    let chance = randomRange(0, 100);
                    if(chance > relationship.value)
                        //if we have a bad relationship, chance talking to
                        if(randomRange(0, 1) > 0.5) return false;
                }
            }
            //figure out the type of interation this will be
            let valueOfInteraction = this._relationships.getInteractValueWith(celestial);
            celestial.Relationships.setInteraction(this, valueOfInteraction);
            this.Relationships.setInteraction(celestial, valueOfInteraction);
            //boost mood social
            this._moods.boost(engines.Moods.MOOD.Social, (valueOfInteraction * Math.max(1, this._relationships.Attachment)), true);
            celestial.Moods.boost(engines.Moods.MOOD.Social, (valueOfInteraction * Math.max(1, this._relationships.Attachment)), true);
            //otherwise, accept interaction
            this.startInteraction(celestial);
            celestial.startInteraction(this);

            //face one another
            if(this.X < celestial.X) {
                this.setDirectionX(1);
                celestial.setDirectionX(-1);
            }
            else {
                this.setDirectionX(-1);
                celestial.setDirectionX(1);
            }

            //try to start an interation dialog based on interation strength
            return true;
        }
        public async startInteraction(celestial:Celestial) {
            this._interactingWith = celestial;
            console.log("I AM STARTING AN INTERACTION WITH: " + celestial.Name);
            //set burnout
            this._interactBurnout = ((100-this.Relationships.Attachment) * randomRange(0.7, 1.3)) * 10;
            console.log("BURNOUT: " + this._interactBurnout);
            //start interact state if there is one, otherwise, default to idle
            //TODO display interaction based on good or bad
            if(await this._logic.startState(engines.CelestialSequencer.STATE.Interact)) {
                //set the interaction type for the last relationship action
                if(this._relationships != null) {
                    let relationship = this._relationships.findRelationshipByCelestial(celestial);
                    if(relationship != null) relationship.lastAction = `${celestial.Sequencer.CurrentSequence.name} with ${celestial.Name}`;
                }
                if(celestial.Relationships != null) {
                    let relationship = celestial.Relationships.findRelationshipByCelestial(this);
                    if(relationship != null) relationship.lastAction = `${this.Sequencer.CurrentSequence.name} with ${this.Name}`;
                }
            }
            else this._logic.startState(engines.CelestialSequencer.STATE.Idle);
        }
        public completeInteraction() {
            if(this._interactingWith.InteractingWith != null) {
                this._interactingWith.InteractingWith.Logic.nextState();
            }
            this._interactingWith = null;
        }
        public removeInteractionCelestial() {
            this._interactingWith = null;
        }
        
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public clone():Celestial {
            let clone:Celestial = new Celestial(managers.CelestialsManager.Template, this._container, JSON.parse(JSON.stringify(this._data)));
            return clone;
        }

        /**Only called on the template celestial to set up images. */
        public async preloadImages() {
            console.log("STARTING IMAGE PRELOAD");
            return await new Promise(async(resolve, reject) => {
                if(this.Data == null) {
                    reject("There is no data!");
                    return;
                }

                //get data
                const { images, spritesheets, path } = this.Data;

                //iterate through each image
                let promises = new Array();                           

                    
                if(images != null) {
                    for(let imgData of images) {
                        promises.push(
                            await new Promise((res, rej) => {
                                console.log("starting image load");
                                try {
                                    //go get the images to load
                                    let img = document.createElement("img");
                                    //listen for load
                                    img.onload = async() => {
                                        console.log("loaded image - " + this.Name);
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
                                    rej(e);
                                }
                            })
                        );
                    }
                }
                //iterate through each spritesheet
                if(spritesheets != null) {
                    for(let spritesheet of spritesheets) {
                        promises.push(
                            await new Promise((res, rej) => {
                                try {
                                    console.log("starting spritesheet load");
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
                                                this.addImage(frame.name, crop.src);
                                                // if(!this.addImage(frame.name, crop.src))
                                                //     throw new Error(`An image already exists belonging to ${this.Name} - ${frame.name}.  Please choose a unique name.`);
                                                res();
                                            });
                                        }
                                    }
                                    //load the spritesheet image
                                    img.src = path + spritesheet.path;
                                }
                                catch(e) {
                                    rej(e);
                                }
                            })
                        );
                    }
                }

                //set icon
                if(this.Data.icon != null) {
                    promises.push(
                        await new Promise((res, rej) => {
                            let iconImg = document.createElement("img");

                            iconImg.onload = () => {
                                this._icon = iconImg;
                                this._icon.style.filter = this._mainImage.style.filter;
                                this._imagesLookup.add("icon", iconImg.src);
                                res();
                            }
                            iconImg.onerror = () => { rej("Could not load icon on : " + this.Name); }

                            iconImg.src = path + this.Data.icon ;
                        })
                    );                    
                }
                // else this._icon = this.MainImage.cloneNode(false) as HTMLImageElement;


                console.log("Promises to load: " + promises.length);
                //once all images are loaded - continue
                await Promise.all(promises)
                    .catch((error) => console.log("DIDN'T CREATE IMAGES \n" + error));

                console.log("LOADED ALL IMAGES - " + this.Name);

                resolve();
            });
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
                    //create transform
                    this._transform = new engines.Transform(this, this._physics);
                    //create moods
                    this._moods = new engines.Moods(this);
                    //create relationships
                    this._relationships = new engines.Relationships(this);
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
                    // let { path, images, spritesheets, name, lookup } = this.Data;
                    const { images, spritesheets, name, lookup } = this.Data;

                    //get the images from the template
                    const template = managers.CelestialsManager.getCelestialTemplate(this.Lookup);
                    this._imagesLookup = template.ImagesLookup.clone();
                    this._icon = template.Icon.cloneNode(true) as HTMLImageElement;
                    
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

                    //load the moods
                    await this._moods.load();
                    //load the first logic
                    await this._logic.load();

                    //load other engines
                    await this._transform.load();


                    

                    //fix image problem
                    (this._node.querySelector(".graphics") as HTMLElement).ondragstart = function() { return false; }
                    //vary colour
                    let hueVariation:number = randomRange(-this.GlobalVariation * 10, this.GlobalVariation * 10);
                    this._mainImage.style.filter = `hue-rotate(${hueVariation}deg)`;
                    
                    

                    //DEBUG: Created a ui menu item to show current controls
                    this._overlayMenu = new ui.menus.CelestialOverlay(this);
                    this._overlayMenu.show();
                    this._node.parentNode.appendChild(this._overlayMenu.Node);

                    this._size = (this.Height / App.Bounds.Height) * this._scale;


                    //send to collision
                    systems.Collision.addToCollisionSystem(this);
                    //ask for collision object
                    this._collisionObject = systems.Collision.getCollisionObject(this);



                    resolve();
                    this._isLoaded = true;


                    //DEBUG: THIS IS A TEST
                    //create context menu
                    // ui.CelestialContext.show(this);

                    console.warn("SIZE NORMALIZED: " + this.SizeNormalized);

                    

                    //wire listeners
                    this._sequencer.addSequenceCompleteListener(this._eventsRegistry.getValue("sequenceComplete"));
                    this._sequencer.addStateChangeListener(this._eventsRegistry.getValue("stateChange"));
                    this._sequencer.addStateCompleteListener(this._eventsRegistry.getValue("stateComplete"));
                    this._transform.addWallHitListener(this._eventsRegistry.getValue("wallHit"));
                    //TODO I've setup the click event, don't readd unless removing this one
                    // managers.MouseManager.listenForMouseDown(this._node, (e) => this._onClicked(e));
                    managers.MouseManager.listenForDrag(this.MainImage,
                        (x,y) => {
                            managers.CelestialsManager.onGrab(this, x, y);
                            //start hold sequence, if there is one
                            this._logic.startState(engines.CelestialSequencer.STATE.Hold);
                        },
                        (x,y) => managers.CelestialsManager.onDrag(this, x, y),
                        (x,y) => {
                            managers.CelestialsManager.onDrop(this, x, y);
                            // this._logic.tryEndState(engines.CelestialSequencer.STATE.Hold);
                        }
                    );
                    //on right click, show context menu
                    managers.MouseManager.listenForRightClick(this.MainImage, () => ui.menus.CelestialContext.show(this), "rightclick");
                    
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
            this._transform.removeWallHitListener();

            this._node.removeEventListener("click", this._eventsRegistry.getValue("click"));
            this._node.removeEventListener("contextmenu", this._eventsRegistry.getValue("rightClick"));
            managers.MouseManager.removeListener("rightclick", this._node);
        }

        public async update() {
            if(this._paused) return;

            // handle spawn update
            this._spawnTick++;
            if(this._spawnTick > managers.CelestialsManager.SpawnRate) {
                this.trySpawn();
            }

            let lastPos:IPoint = {x:this.X, y:this.Y};

            //update sequence
            // logic > sequencer > draw > physics
            await this._logic.update();

            //if we have taken control, only render the first frame
            // if(!this._isControlled) {

                // console.log("LOGIC");
                await this._sequencer.update();
                // console.log("SEQUENCER");
                await this.drawCurrentFrame();
                // console.log("DRAW");
                await this._physics.update();
                await this._transform.update();
                // console.log("PHYSICS");
                await this._moods.update();
            // }

            //if we have moved, test our collision
            if(this._interactBurnout <= 0) {
                if(lastPos.x != this.X || lastPos.y != this.Y) {
                    let collidedWith = systems.Collision.checkCollision(this._collisionObject);
                    if(collidedWith != null) {
                         if(!this.askToInteractWith(collidedWith as Celestial))
                            //if we were rejected, add a bit of a burnout before trying again
                            this._interactBurnout = randomRange(0.8, 1.2) * 200;
                    }
                }
            }


            this._interactBurnout--;
            if(this._interactBurnout < 0) this._interactBurnout = 0;


            this._overlayMenu.update();
            this._overlayMenu.changeName(this.Name);
            this._overlayMenu.changeSequence(this._sequencer.CurrentSequence.name);
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onSequenceComplete() {
            console.log("SEQUENCE COMPLETE");
            //listen for spawning
            if(this._isSpawning) this.endSpawn(this._sequencer.CurrentSequence.spawnChance);
            if(this._interactingWith != null) {
                this.completeInteraction();
            }
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

        private _onWallHit(which:string) {
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
        public get Transform():engines.Transform { return this._transform; }
        public get Moods():engines.Moods { return this._moods; }
        public get Relationships():engines.Relationships { return this._relationships; }
        public get Logic():logic.CelestialLogic { return this._logic; }
        public get Icon():HTMLImageElement { 
            if(this._icon == null) this._icon = this.MainImage.cloneNode(false) as HTMLImageElement;
            return this._icon; 
        }

        public get Paused():boolean { return this._paused; }
        public get IsControlled():boolean { return this._isControlled; }
        public get DateSpawned():Date { return this._dateSpawned; }
        public get Scale():number { return this._scale; }
        public get Variation():number { return this._variation; }
        public get GlobalVariation():number { return this.Data.variation || 0; }
        public get Size():number { return this._size * App.Bounds.Height; }
        public get SizeNormalized():number { 
            const { min, max } = this.Data.scale;
            const size = this.Size;
            return ((size - min) / (max - min)) / 100;
        }
        public get Mass():number {
            return this._size * this._physics.Gravity;
        }
        public get Age():number {
            return (((new Date()).getTime() - this._dateSpawned.getTime()) / 1000 / 60 / 60);
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
        public get Descendants():Celestial[] { return this._descendants; }

        public get InteractingWith():Celestial { return this._interactingWith; }

        // public get Icon():string {
        //     if(this._imagesLookup.containsKey("icon"))
        //         return this._imagesLookup.getValue("icon");
        //     return this._imagesLookup.List[0];
        // }

        
    }
}