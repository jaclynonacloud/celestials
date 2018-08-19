///<reference path="./../components/entities/celestials/Celestial.ts" />
///<reference path="./../components/ui/menus/statics/NotificationBar.ts" />
///<reference path="./../Tools.ts" />
namespace celestials.managers{
    import Celestial = entities.Celestial;
    import ICelestial = entities.ICelestial;

    export interface ICelestialsChange {
        add?:Celestial;
        delete?:Celestial;
        change?:Celestial;
    }

    export class CelestialsManager {
        // public static DEF_SPAWNRATE:number = 30000;
        public static DEF_SPAWNRATE:number = 200;
        private static _instance:CelestialsManager;
        private static _lookup:Dictionary<string, Celestial>;
        private static _data:Dictionary<string, ICelestial>;

        private _template:HTMLElement;
        private _container:HTMLElement;

        private _templates:Celestial[];
        private _celestials:Celestial[];

        //functions to call if they are listening to celestial changes
        private _changeRegistry:Function[];

        // private _spawnTick:number;
        private _spawnRate:number;

        constructor() {
            CelestialsManager._instance = this;
            CelestialsManager._lookup = new Dictionary<string, Celestial>();
            CelestialsManager._data = new Dictionary<string, ICelestial>();

            this._template = document.querySelector(".template.celestial");
            this._container = document.querySelector(".celestials");


            this._templates = new Array<Celestial>();
            this._celestials = new Array<Celestial>();          
            
            this._changeRegistry = new Array<Function>();


            // this._spawnTick = 0;
            //TODO: Set a global spawn rate from a json file
            this._spawnRate = CelestialsManager.DEF_SPAWNRATE;
        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        public async setup(files?:string[]) {
            //load files
            //for now, just give the folders
            if(files == null)
             files = [
                "./res/celestials/anthony/anthony.json",
                "./res/celestials/solaris/solaris.json",
                "./res/celestials/victor/victor.json"];

            for(const file of files) {
                await fetchJson(file, (json) => {
                    //DEBUG create celectial
                    let cel:entities.Celestial = new Celestial(this._template, this._container, json);
                    CelestialsManager.addTemplate(cel);
                });
                
            }

             //DEBUG let app/user decide what celestials are added
            //  for(let temp of this._templates) {
            //     CelestialsManager.addCelestial(temp.Lookup);
            //     console.log("ADDED: " + temp.Name);
            // }
            
            //TODO: load a random unlocked celestial
            // if(CelestialsManager._lookup.containsKey("solaris"))
            //     await CelestialsManager.addCelestialByLookup("solaris");
            if(CelestialsManager._lookup.containsKey("solaris"))
                await CelestialsManager.addCelestialByLookup("solaris");


            //listen to bounds leave -- call up event if we leave
            managers.MouseManager.listenForMouseOut(App.Node, (x,y) => managers.MouseManager.simluateMouseUp(App.Node));
        }

        /**
         * Adds a Celestial to the templates array, and gives their lookup to the lookup dictionary for easy selection.
         * @param celestial The Celestial object to add.
         */
        public static async addTemplate(celestial:Celestial) {
            if(!CelestialsManager._lookup.containsKey(celestial.Lookup)) {
                CelestialsManager._lookup.add(celestial.Lookup, celestial);
                CelestialsManager._data.add(celestial.Lookup, celestial.Data);
            }

            await CelestialsManager._instance._templates.push(celestial);
        }

        public static getTemplateByLookup(lookup:string) {
            if(CelestialsManager._lookup.containsKey(lookup)) return CelestialsManager._lookup.getValue(lookup);
            return null;
        }

        public static async addCelestial(celestial:Celestial, addedByLineage?:boolean):Promise<Celestial> {
            addedByLineage = addedByLineage || false;

            return await new Promise<Celestial>(async(res, rej) => {
                //test for availability
                if(celestial.Data.maxSpawns != null) {
                    if(CelestialsManager.countCelestialsOfType(celestial.Lookup) + 1 > celestial.Data.maxSpawns) {
                        //only warn about max spawns if USER tried to spawn the celestial
                        if(!addedByLineage)
                            systems.Notifications.addNotification(`Max spawns reached for ${celestial.Name}.`, systems.Notifications.TYPE.Fail);
                        res(null);
                    }
                }

                await celestial.load()
                    .then(() => {
                        console.log("CREATED COPY")
                        CelestialsManager._instance._celestials.push(celestial);
                        CelestialsManager.callChangeRegistry({add:celestial});

                        //TEST
                        // ui.menus.CelestialDetails.show(copy);

                        //setup collision
                        systems.Collision.addToCollisionSystem(celestial, (cel) => {
                            celestial.askToInteractWith(cel);
                        });

                        res(celestial);
                        // return celestial;
                    });
            });    
        }

        public static async addCelestialByLookup(lookup:string, addedByLineage?:boolean) {
            addedByLineage = addedByLineage || false;
            //get celestial from lookup
            let celestial:Celestial = CelestialsManager._lookup.getValue(lookup);
            if(celestial != null) {
                let copy:Celestial = await celestial.clone();
                return await this.addCelestial(copy, addedByLineage);
            }
            return null;
        }
        public static async addCelestialByLookupAtPosition(lookup:string, x:number, y:number, addedByLineage?:boolean) {
            let celestial:Celestial = await CelestialsManager.addCelestialByLookup(lookup, addedByLineage);
            if(celestial == null) return null;
            celestial.X = x;
            celestial.Y = y + celestial.Height;
            return celestial;
        }

        public static countCelestialsOfType(lookup:string) {
            let count:number = 0;
            for(let cel of CelestialsManager.Celestials)
                if(cel.Lookup == lookup)
                    count++;
            return count;
        }

        public static removeCelestial(celestial:Celestial, callChangeRegistry:boolean = true) {
            let index = CelestialsManager._instance._celestials.indexOf(celestial);
            if(index != -1) {
                let cel = CelestialsManager._instance._celestials.splice(index, 1)[0];
                if(callChangeRegistry)
                    CelestialsManager.callChangeRegistry({delete:cel});
                //if we were the active celestial in the detail panel, close the panel
                if(ui.menus.CelestialDetails.isShowing)
                    if(ui.menus.CelestialDetails.CurrentCelestial == cel)
                        ui.menus.CelestialDetails.hide();
                cel.remove();
            }
        }

        public static removeAllCelestials() {
            for(let celestial of CelestialsManager.Celestials) {
                this.removeCelestial(celestial, false);
            }
            CelestialsManager.callChangeRegistry(null);
        }

        public static update() {
            const instance = CelestialsManager._instance;
            // //update spawn tick
            // instance._spawnTick++;
            // let callSpawn:boolean = false;
            // if(instance._spawnTick > instance._spawnRate) {
            //     callSpawn = true;
            //     instance._spawnTick = 0;
            // }
            //update the current celestials
            for(let cel of instance._celestials) {
                if(cel.IsLoaded) {
                    cel.update();
                    // if(callSpawn) cel.trySpawn();
                }
            }
        }

        public static callChangeCelestial(celestial:Celestial) {
            CelestialsManager.callChangeRegistry({change:celestial});
        }


        public static callChangeRegistry(change:ICelestialsChange) {
            for(let func of CelestialsManager._instance._changeRegistry)
                func(change);
        }
        public static listenForCelestialChanges(func:Function) {
            CelestialsManager._instance._changeRegistry.push(func);
        }
        public static removeListenForCelestialChanges(func:Function) {
            let index:number = CelestialsManager._instance._changeRegistry.indexOf(func);
            if(index != -1)
                CelestialsManager._instance._changeRegistry.splice(index, 1);
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        public static onGrab(cel:Celestial, x:number, y:number) {
            console.log("GRABBED");
            //add celestial to top of stack briefly
            cel.Node.style.zIndex = '100';
            cel.takeControl();
            cel.Physics.zeroVelocity();
        }
        public static onDrag(cel:Celestial, x:number, y:number) {
            //get position
            x = x;
            y += (cel.Height * cel.RegistrationPoint.y);
            //set position
            cel.X = x;
            cel.Y = y;
        }
        public static async onDrop(cel:Celestial, x:number, y:number) {
            console.log("DROPPED");
            cel.releaseControl();
            cel.Physics.resetGravity();
            //put celestial back where it came from
            cel.Node.style.zIndex = `${cel.Data.zIndex || 1}`;

            //fling celestial
            let { x:lastX, y:lastY } = MouseManager.LastMousePosition;
            let flingX:number = ((x - lastX) / App.Bounds.Width) * App.Bounds.Width;
            let flingY:number = ((y - lastY) / App.Bounds.Height) * App.Bounds.Height;

            cel.Physics.zeroVelocity();
            cel.Physics.addForceX(flingX * 1.2);
            cel.Physics.addForceY(flingY);

            console.log("FLING: ", flingX, flingY);
            console.log(cel.Physics.Velocity);

            //change forward direction
            if(flingX != 0) {
                if(flingX > 0) cel.setDirectionX(1);
                else cel.setDirectionX(-1);
            }

        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Template():HTMLElement { return CelestialsManager._instance._template; }
        public static get Templates():Celestial[] { return CelestialsManager._instance._templates; }
        public static get Celestials():Celestial[] { return CelestialsManager._instance._celestials; }
        public static get SpawnRate():number { return CelestialsManager._instance._spawnRate; }


    }
}