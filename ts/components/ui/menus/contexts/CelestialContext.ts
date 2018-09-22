///<reference path="./../../components/MultiDropdown.ts" />
namespace celestials.ui.menus {
    export class CelestialContext extends Menu {
        private static _instance:CelestialContext;
        private static _node:HTMLElement;
        private static _nameNode:HTMLElement;
        private static _typeNode:HTMLElement;
        private static _statesDropdown:components.MultiDropdown;
        private static _actionsDropdown:components.MultiDropdown;

        constructor(node:HTMLElement) {
            super(node);
            CelestialContext._instance = this;
            let ctx:HTMLElement = document.querySelector(".context-menu.celestial");
            CelestialContext._node = node;
            CelestialContext._nameNode = ctx.querySelector(".name");
            CelestialContext._typeNode = ctx.querySelector(".type");
            let statesNode:HTMLElement = ctx.querySelector(".states");
            CelestialContext._statesDropdown = new components.MultiDropdown(
                statesNode.querySelector(".ctx-dropdown.template"),
                statesNode.querySelector(".ctx-item.template"),
                statesNode.querySelector(".ctx-dropdown-header.template"),
                statesNode.querySelector(".ctx-dropdown-2.template"),
                statesNode.querySelector(".ctx-dropdown-2 .ctx-item.template")
            );
            let actionsNode:HTMLElement = ctx.querySelector(".actions");
            CelestialContext._actionsDropdown = new components.MultiDropdown(
                actionsNode.querySelector(".ctx-dropdown.template"),
                actionsNode.querySelector(".ctx-item.template"),
                actionsNode.querySelector(".ctx-dropdown-header.template"),
                actionsNode.querySelector(".ctx-dropdown-2.template"),
                actionsNode.querySelector(".ctx-dropdown-2 .ctx-item.template")
            );

            CelestialContext.hide();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        //TEST
        static show(celestial:entities.Celestial) {
            console.log("CEL: " + celestial);
            if(celestial == null) return;
            CelestialContext._instance.show();
            //setup the data
            CelestialContext._nameNode.innerHTML = celestial.Name;
            CelestialContext._typeNode.innerHTML = celestial.Lookup;

            //create the states dropdown items
            let statesDrop:components.MultiDropdown = CelestialContext._statesDropdown;
            statesDrop.clear();
            //create every state
            for(let indentData of Object.keys(engines.CelestialSequencer.STATE)) {
                //get all the sequences with that state
                let state = engines.CelestialSequencer.STATE[indentData];
                let sequences = celestial.Sequencer.getStateSequences(state);
                if(sequences == null) continue;
                //get if this is a special sequence set
                // if(celestial.Sequencer.Sequences[state].special) continue;
                //create the indent
                statesDrop.createIndent();
                //create the sequences
                for(let seq of sequences) {
                    this._createIndentItem(statesDrop, seq.name, () => {
                        //switch to state
                        celestial.Sequencer.changeState(state);
                        celestial.Sequencer.changeSequence(celestial.Sequencer.getSequenceByName(seq.name));
                        console.log(`SEQUENCE: ${seq.name}`);
                        if(celestial.Sequencer.CurrentState == engines.CelestialSequencer.STATE.Spawn)
                            celestial.spawn();
                    });
                }
                //add the indent
                statesDrop.addLastIndent(indentData);
            }

            //create the actions dropdown items
            let actionsDrop:components.MultiDropdown = CelestialContext._actionsDropdown;
            actionsDrop.clear();
            //create the states
            //--general
            actionsDrop.createIndent();
            this._createIndentItem(actionsDrop, "Flip X", () => { celestial.flipX(); });
            this._createIndentItem(actionsDrop, "Nudge Left", () => { celestial.Physics.addForceX(-50); });
            this._createIndentItem(actionsDrop, "Nudge Right", () => { celestial.Physics.addForceX(50); });
            this._createIndentItem(actionsDrop, "Nudge Up", () => { celestial.Physics.addForceY(-150); });
            this._createIndentItem(actionsDrop, "Nudge Down", () => { celestial.Physics.addForceY(50); });
            this._createIndentItem(actionsDrop, "Show Details", () => { ui.menus.CelestialDetails.show(celestial); });
            actionsDrop.addLastIndent("General");
            //--sorting
            actionsDrop.createIndent();
            this._createIndentItem(actionsDrop, "Send to Front", () => console.log("Send to FRONT"));
            this._createIndentItem(actionsDrop, "Send to Back", () => console.log("Send to BACK"));
            actionsDrop.addLastIndent("Sorting");
            //--control
            actionsDrop.createIndent();
            this._createIndentItem(actionsDrop, "Pause/Unpause", () => { (celestial.Paused) ? celestial.unpause() : celestial.pause(); });
            this._createIndentItem(actionsDrop, "Copy", () => { managers.CelestialsManager.addCelestialByLookup(celestial.Lookup); });
            this._createIndentItem(actionsDrop, "Delete", () => { managers.CelestialsManager.removeCelestial(celestial); });
            actionsDrop.addLastIndent("Control");

            //put in bounds
            CelestialContext._keepOnScreen(celestial.Bounds);
        }

        public static hide() {
            CelestialContext._instance.hide();
        }


        private static _createIndentItem(dropdown:components.MultiDropdown, title:string, action:Function) {
            let item = dropdown.createItem();
            item.innerHTML = title;
            let act = () => {
                action();
                //also hide if something is clicked
                CelestialContext.hide();
            }
            dropdown.addItemToLastIndent(item, act);
        }

        private static _keepOnScreen(celBounds:Rect) {
            let node = CelestialContext._node;
            //put the menu to the top left corner of the celestial
            let x = celBounds.Left;
            let y = celBounds.Top;
            //check bottom/right
            if(x + node.offsetWidth > App.Bounds.Right) x = App.Bounds.Right - node.offsetWidth - 150;
            if(y + node.offsetHeight > App.Bounds.Bottom) y = App.Bounds.Bottom - node.offsetHeight - 150;

            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {
            managers.MouseManager.listenForMouseDown(App.Node, () => CelestialContext.hide(), "celContext_MouseDown");
        }
        public unload() {
            managers.MouseManager.removeListener("celContext_MouseDown");
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get StatesDropdown():components.Dropdown { return CelestialContext._statesDropdown; }


    }
}