///<reference path="./../components/entities/celestials/Celestial.ts" />
///<reference path="./../Tools.ts" />
namespace celestials.managers{
    import Celestial = entities.Celestial;
    import ICelestial = entities.ICelestial;

    export class CelestialsManager {
        private static _instance:CelestialsManager;
        private static _lookup:Dictionary<string, Celestial>;
        private static _data:Dictionary<string, ICelestial>;

        private _template:HTMLElement;
        private _container:HTMLElement;

        private _templates:Celestial[];
        private _celestials:Celestial[];

        private _activeCelestial:Celestial;
        private _activeCelestialZ:number;

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
            this._eventRegistry.add("celClick", this._onCelestialClick.bind(this));
            this._eventRegistry.add("celDrag", this._onCelestialDrag.bind(this));
            this._eventRegistry.add("celDrop", this._onCelestialDrop.bind(this));


            //setup listeners
            this._container.addEventListener("mousedown", this._eventRegistry.getValue("celClick"));
            
        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        public async setup(files?:string[]) {
            //load files
            //for now, just give the folders
            if(files == null)
             files = [
                "./res/celestials/solaris/solaris.json",
                        "./res/celestials/anthony/anthony.json"];

            for(const file of files) {
                await fetchJson(file, (json) => {
                    //DEBUG create celectial
                    let cel:entities.Celestial = new Celestial(this._template, this._container, json);
                    CelestialsManager.addTemplate(cel);
                });
                
            }

             //DEBUG let app/user decide what celestials are added
             for(let temp of this._templates) {
                CelestialsManager.addCelestial(temp.Lookup);
                console.log("ADDED: " + temp.Name);
            }
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

        public static async addCelestial(lookup:string) {
            //get celestial from lookup
            let celestial:Celestial = CelestialsManager._lookup.getValue(lookup);
            if(celestial != null) {
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
        public static async addCelestialAtPosition(lookup:string, x:number, y:number) {
            let celestial:Celestial = await CelestialsManager.addCelestial(lookup);
            celestial.X = x;
            celestial.Y = y;
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
        }

        public static setActiveCelestial(celestial:Celestial) {
            //must be an active one in the scene
            if(CelestialsManager._instance._celestials.indexOf(celestial) == -1) return;
            //otherwise, set it
            CelestialsManager._instance._activeCelestial = celestial;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onCelestialClickFromCelestial(celestial:Celestial) {
            CelestialsManager.setActiveCelestial(celestial);
            this._activeCelestialZ = parseInt(celestial.Node.style.zIndex);
        }
        private _onCelestialClick(e:MouseEvent) {
            //setup listeners
            App.Node.addEventListener("mousemove", this._eventRegistry.getValue("celDrag"));
            App.Node.addEventListener("mouseup", this._eventRegistry.getValue("celDrop"));
        }
        private _onCelestialDrag(e:MouseEvent) {
            if(this._activeCelestial == null) return;
            console.log("DRAG : " + this._activeCelestial.Name);
            //add celestial to top of stack briefly
            this._activeCelestial.Node.style.zIndex = '100';
        }
        private _onCelestialDrop(e:MouseEvent) {
            //remove listeners
            App.Node.removeEventListener("mousemove", this._eventRegistry.getValue("celDrag"));
            App.Node.removeEventListener("mouseup", this._eventRegistry.getValue("celDrop"));

            if(this._activeCelestial != null) {
                this._activeCelestial.Node.style.zIndex = `${this._activeCelestialZ}`;
                this._activeCelestial = null;
            }
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Template():HTMLElement { return CelestialsManager._instance._template; }
        public static get Templates():Celestial[] { return CelestialsManager._instance._templates; }
        public static get Celestials():Celestial[] { return CelestialsManager._instance._celestials; }


    }
}