///<reference path="./../components/entities/celestials/Celestial.ts" />
///<reference path="./../components/ui/menus/statics/NotificationBar.ts" />
///<reference path="./../Tools.ts" />
namespace celestials.managers{
    import Celestial = entities.Celestial;
    import ICelestial = entities.ICelestial;

    export interface IActiveCelestial {
        celestial?:Celestial;
        zIndex?:number;
        lastX?:number;
        lastY?:number;
    }

    export class CelestialsManager {
        private static _instance:CelestialsManager;
        private static _lookup:Dictionary<string, Celestial>;
        private static _data:Dictionary<string, ICelestial>;

        private _template:HTMLElement;
        private _container:HTMLElement;

        private _templates:Celestial[];
        private _celestials:Celestial[];

        private _activeCelestial:IActiveCelestial;

        private _eventRegistry:Dictionary<string, any>;

        constructor() {
            CelestialsManager._instance = this;
            CelestialsManager._lookup = new Dictionary<string, Celestial>();
            CelestialsManager._data = new Dictionary<string, ICelestial>();

            this._template = document.querySelector(".template.celestial");
            this._container = document.querySelector(".celestials");


            this._templates = new Array<Celestial>();
            this._celestials = new Array<Celestial>();

            this._eventRegistry = new Dictionary();
            // this._eventRegistry.add("celClick", this._onCelestialClick.bind(this));
            this._eventRegistry.add("celDrag", this._onCelestialDrag.bind(this));
            this._eventRegistry.add("celDrop", this._onCelestialDrop.bind(this));

            this._activeCelestial = {
                celestial: null,
                zIndex: 1
            };


            //setup listeners
            // this._container.addEventListener("mousedown", this._eventRegistry.getValue("celClick"));
            
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
            if(CelestialsManager._lookup.containsKey("solaris"))
                CelestialsManager.addCelestial("solaris");
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

        public static async addCelestial(lookup:string, addedByLineage?:boolean) {
            addedByLineage = addedByLineage || false;
            //get celestial from lookup
            let celestial:Celestial = CelestialsManager._lookup.getValue(lookup);
            if(celestial != null) {
                //test for availability
                if(celestial.Data.maxSpawns != null && !addedByLineage) {
                    if(CelestialsManager.countCelestials(celestial.Lookup) + 1 > celestial.Data.maxSpawns) {
                        ui.menus.NotificationBar.addNotification(`Max spawns reached for ${celestial.Name}.`, ui.menus.NotificationBar.Type.Fail);
                        return null;
                    }
                }

                // let copy:Celestial = celestial.clone();
                let data:ICelestial = CelestialsManager._data.getValue(lookup);
                let copy:Celestial = celestial.clone();
                //TODO create COPY, not just use the template
                if(copy.load()) {
                    await CelestialsManager._instance._celestials.push(copy);
                    copy.addClickListener(CelestialsManager._instance._onCelestialClickFromCelestial.bind(this));
                    return copy;
                }
            }
            return null;
        }
        public static async addCelestialAtPosition(lookup:string, x:number, y:number, addedByLineage?:boolean) {
            let celestial:Celestial = await CelestialsManager.addCelestial(lookup, addedByLineage);
            if(celestial == null) return null;
            celestial.X = x;
            celestial.Y = y + celestial.Height;
            return celestial;
        }

        public static countCelestials(lookup:string) {
            let count:number = 0;
            for(let cel of CelestialsManager.Celestials)
                if(cel.Lookup == lookup)
                    count++;
            return count;
        }

        public static removeCelestial(celestial:Celestial) {
            let index = CelestialsManager._instance._celestials.indexOf(celestial);
            if(index != -1) {
                let cel = CelestialsManager._instance._celestials.splice(index, 1)[0];
                cel.remove();
            }
        }

        public static removeAllCelestials() {
            for(let celestial of CelestialsManager.Celestials) {
                this.removeCelestial(celestial);
            }
        }

        public static update() {
            //update the current celestials
            for(let cel of CelestialsManager._instance._celestials)
            if(cel.IsLoaded)
                cel.update();

            if(CelestialsManager._instance._activeCelestial.celestial != null) {
                CelestialsManager._instance._activeCelestial.lastX = App.MousePosition.x;
                CelestialsManager._instance._activeCelestial.lastY = App.MousePosition.y;
            }
        }

        public static setActiveCelestial(celestial:Celestial) {
            //must be an active one in the scene
            if(CelestialsManager._instance._celestials.indexOf(celestial) == -1) return;
            //otherwise, set it
            CelestialsManager._instance._activeCelestial.celestial = celestial;
        }
        public static startDrag(celestial:Celestial) {
            //stop listening if we were already draggging
            CelestialsManager._instance._onCelestialDrop(null);

            CelestialsManager.setActiveCelestial(celestial);
            CelestialsManager._instance._activeCelestial.zIndex = parseInt(celestial.Node.style.zIndex);
            //add celestial to top of stack briefly
            celestial.Node.style.zIndex = '100';
            celestial.takeControl();

            //setup listeners
            App.Node.addEventListener("mousemove", CelestialsManager._instance._eventRegistry.getValue("celDrag"));
            App.Node.addEventListener("mouseup", CelestialsManager._instance._eventRegistry.getValue("celDrop"));
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onCelestialClickFromCelestial(celestial:Celestial) {
            CelestialsManager.startDrag(celestial);
        }
        // private _onCelestialClick(e:MouseEvent) {
            
        // }
        private _onCelestialDrag(e:MouseEvent) {
            if(this._activeCelestial.celestial == null) return;
            let celestial:entities.Celestial = this._activeCelestial.celestial;
            celestial.Physics.setGravity(0);
            console.log("DRAG : " + celestial.Name);

            let x = e.clientX;
            let y = e.clientY + (celestial.Height * celestial.RegistrationPoint.y);

            celestial.X = x;
            celestial.Y = y;
        }
        private _onCelestialDrop(e:MouseEvent) {
            //remove listeners
            App.Node.removeEventListener("mousemove", this._eventRegistry.getValue("celDrag"));
            App.Node.removeEventListener("mouseup", this._eventRegistry.getValue("celDrop"));

            if(this._activeCelestial.celestial != null) {
                let celestial:entities.Celestial = this._activeCelestial.celestial;
                celestial.Node.style.zIndex = `${this._activeCelestial.zIndex}`;
                celestial.Physics.resetGravity();
                celestial.releaseControl();

                //gather fling velocity
                if(e != null) {
                    console.log("LAST: " , this._activeCelestial.lastX, ", CURR: " , e.clientX);
                    let flingX:number = ((e.clientX - (this._activeCelestial.lastX || e.clientX)) / App.Bounds.Width) * App.Bounds.Width;
                    let flingY:number = ((e.clientY - (this._activeCelestial.lastY || e.clientY)) / App.Bounds.Height) * App.Bounds.Height;

                    console.log("FLING: ", flingX, flingY);

                    celestial.Physics.zeroVelocity();
                    celestial.Physics.addForceX(flingX);
                    celestial.Physics.addForceY(flingY);

                    //change forward direction
                    if(flingX != 0) {
                        if(flingX > 0) celestial.setDirectionX(1);
                        else celestial.setDirectionX(-1);
                    }
                }

                

                this._activeCelestial.celestial = null;
            }
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Template():HTMLElement { return CelestialsManager._instance._template; }
        public static get Templates():Celestial[] { return CelestialsManager._instance._templates; }
        public static get Celestials():Celestial[] { return CelestialsManager._instance._celestials; }


    }
}