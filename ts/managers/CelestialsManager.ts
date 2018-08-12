///<reference path="./../components/entities/celestials/Celestial.ts" />
///<reference path="./../components/ui/menus/statics/NotificationBar.ts" />
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

        constructor() {
            CelestialsManager._instance = this;
            CelestialsManager._lookup = new Dictionary<string, Celestial>();
            CelestialsManager._data = new Dictionary<string, ICelestial>();

            this._template = document.querySelector(".template.celestial");
            this._container = document.querySelector(".celestials");


            this._templates = new Array<Celestial>();
            this._celestials = new Array<Celestial>();            
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

        public static async addCelestial(lookup:string, addedByLineage?:boolean) {
            addedByLineage = addedByLineage || false;
            //get celestial from lookup
            let celestial:Celestial = CelestialsManager._lookup.getValue(lookup);
            if(celestial != null) {
                //test for availability
                if(celestial.Data.maxSpawns != null && !addedByLineage) {
                    if(CelestialsManager.countCelestials(celestial.Lookup) + 1 > celestial.Data.maxSpawns) {
                        systems.Notifications.addNotification(`Max spawns reached for ${celestial.Name}.`, systems.Notifications.TYPE.Fail);
                        return null;
                    }
                }

                let copy:Celestial = celestial.clone();
                if(copy.load()) {
                    await CelestialsManager._instance._celestials.push(copy);
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
            console.log(cel.Name);
            console.log("DRAGGING: ", x, y);
            //get position
            x = x;
            y += (cel.Height * cel.RegistrationPoint.y);
            //set position
            cel.X = x;
            cel.Y = y;
        }
        public static onDrop(cel:Celestial, x:number, y:number) {
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
            cel.Physics.addForceX(flingX);
            cel.Physics.addForceY(flingY);

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


    }
}