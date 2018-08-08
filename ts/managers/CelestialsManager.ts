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

        constructor(files?:string[]) {
            CelestialsManager._instance = this;
            CelestialsManager._lookup = new Dictionary<string, Celestial>();
            CelestialsManager._data = new Dictionary<string, ICelestial>();

            this._template = document.querySelector(".template.celestial");
            this._container = document.querySelector(".celestials");


            this._templates = new Array<Celestial>();
            this._celestials = new Array<Celestial>();


            this._setup(files);
            
        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        private async _setup(files?:string[]) {
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
                }
            }
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
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Template():HTMLElement { return CelestialsManager._instance._template; }
        public static get Templates():Celestial[] { return CelestialsManager._instance._templates; }
        public static get Celestials():Celestial[] { return CelestialsManager._instance._celestials; }


    }
}