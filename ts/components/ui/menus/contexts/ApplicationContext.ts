///<reference path="./../../components/MultiDropdown.ts" />
///<reference path="./../Menu.ts" />
namespace celestials.ui.menus {
    export class ApplicationContext extends Menu {
        private static _instance:ApplicationContext;
        private static _celestialsDropdown:components.MultiDropdown;
        private static _actionsDropdown:components.MultiDropdown;

        private static _eventsRegistry:Dictionary<string, any>;

        constructor(node:HTMLElement) {
            super(node);
            ApplicationContext._instance = this;
            let ctx:HTMLElement = document.querySelector(".context-menu.application");
            let celestialsNode:HTMLElement = ctx.querySelector(".celestials");
            ApplicationContext._celestialsDropdown = new components.MultiDropdown(
                celestialsNode.querySelector(".ctx-dropdown.template"),
                celestialsNode.querySelector(".ctx-item.template"),
                celestialsNode.querySelector(".ctx-dropdown-header.template"),
                celestialsNode.querySelector(".ctx-dropdown-2.template"),
                celestialsNode.querySelector(".ctx-dropdown-2 .ctx-item.template")
            );
            let actionsNode:HTMLElement = ctx.querySelector(".actions");
            ApplicationContext._actionsDropdown = new components.MultiDropdown(
                actionsNode.querySelector(".ctx-dropdown.template"),
                actionsNode.querySelector(".ctx-item.template"),
                actionsNode.querySelector(".ctx-dropdown-header.template"),
                actionsNode.querySelector(".ctx-dropdown-2.template"),
                actionsNode.querySelector(".ctx-dropdown-2 .ctx-item.template")
            );

            ApplicationContext._eventsRegistry = new Dictionary<string, any>();

            ApplicationContext.hide();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        //TEST
        static show() {
            ApplicationContext._instance.show();
            //setup the data

            //create the states dropdown items
            let celestialsDrop:components.MultiDropdown = ApplicationContext._celestialsDropdown;
            celestialsDrop.clear();

            //create celestials indent
            celestialsDrop.createIndent();
            for(let celestial of managers.CelestialsManager.Templates) {
                //get if this is a special sequence set
                this._createIndentItem(celestialsDrop, celestial.Lookup, () => {
                    //create the templated celestial
                    managers.CelestialsManager.addCelestialByLookup(celestial.Lookup);
                });
            }
            //add the indent
            celestialsDrop.addLastIndent("Add Celestial");

            //create the actions dropdown items
            let actionsDrop:components.MultiDropdown = ApplicationContext._actionsDropdown;
            actionsDrop.clear();
            //create the states
            //--control
            actionsDrop.createIndent();
            this._createIndentItem(actionsDrop, "Pause All", () => { console.log("PAUSE ALL"); });
            this._createIndentItem(actionsDrop, "Unpause All", () => { console.log("UNPAUSE ALL"); });
            this._createIndentItem(actionsDrop, "Delete All", () => { managers.CelestialsManager.removeAllCelestials(); });
            actionsDrop.addLastIndent("Control");

            //put in bounds
            // ApplicationContext._keepOnScreen();


            //add listener
            App.Node.addEventListener("click", ApplicationContext._eventsRegistry.getValue("closeContext"));
        }

        public static hide() {
            ApplicationContext._instance.hide();
        }


        private static _createIndentItem(dropdown:components.MultiDropdown, title:string, action:Function) {
            let item = dropdown.createItem();
            item.innerHTML = title;
            let act = () => {
                action();
                //also hide if something is clicked
                ApplicationContext.hide();
            }
            dropdown.addItemToLastIndent(item, act);
        }

        // private static _keepOnScreen() {
        //     let node = ApplicationContext._node;
        //     //put the menu to the top left corner of the celestial
        //     let x = celBounds.Left;
        //     let y = celBounds.Top;
        //     //check bottom/right
        //     if(x + node.offsetWidth > App.Bounds.Right) x = App.Bounds.Right - node.offsetWidth - 150;
        //     if(y + node.offsetHeight > App.Bounds.Bottom) y = App.Bounds.Bottom - node.offsetHeight - 150;

        //     node.style.left = `${x}px`;
        //     node.style.top = `${y}px`;
        // }

        public static showAt(x:number, y:number) {
            ApplicationContext._instance._node.style.left = `${x}px`;
            ApplicationContext._instance._node.style.top = `${y}px`;

            ApplicationContext.show();
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {
            //register right click with mouse manager for context opening
            managers.MouseManager.listenForRightClick(App.Node, (x, y) => ApplicationContext.showAt(x, y), "appContext_RightClick");
            managers.MouseManager.listenForMouseDown(App.Node, () => ApplicationContext.hide(), "appContext_MouseDown");
        }
        public unload() {
            managers.MouseManager.removeListener("appContext_RightClick");
            managers.MouseManager.removeListener("appContext_MouseDown");
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get StatesDropdown():components.Dropdown { return ApplicationContext._celestialsDropdown; }


    }
}