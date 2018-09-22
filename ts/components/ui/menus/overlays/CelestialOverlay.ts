///<reference path="OverlayMenu.ts" />
namespace celestials.ui.menus {
    export class CelestialOverlay extends OverlayMenu {
        private _nameNode:HTMLElement;
        private _sequenceNode:HTMLElement;

        private _celestial:entities.Celestial;

        constructor(celestial:entities.Celestial, node?:HTMLElement, nameNode?:HTMLElement, sequenceNode?:HTMLElement) {
            super(node || document.querySelector(".overlay-menu.celestial").cloneNode(true) as HTMLElement, celestial.Bounds);
            this._celestial = celestial;
            this._nameNode = nameNode || this._node.querySelector(".name");
            this._sequenceNode = sequenceNode || this._node.querySelector(".sequence");
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        changeName(name:string) {
            this._nameNode.innerHTML = name;
        }
        changeSequence(sequence:string) {
            this._sequenceNode.innerHTML = sequence;
        }

        update() {
            this.changeTargetBounds(this._celestial.Bounds);
            super.update();
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {
        }
        public unload() {
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/

    }
}