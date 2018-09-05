///<reference path="./../Menu.ts" />
namespace celestials.ui.menus {
    export abstract class OverlayMenu extends Menu implements IUpdateable {
        private _targetBounds:Rect;
        private _position:IPoint;

        constructor(node:HTMLElement, targetBounds:Rect) {
            super(node);
            this._position = {
                x : 0,
                y : 0
            };
            //listen to node for position change
            this._targetBounds = targetBounds;
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public changeTargetBounds(bounds:Rect) {
            this._targetBounds = bounds;
        }
        private _keepInBounds() {
            let screenBounds:Rect = App.Bounds;
            let menuBounds:Rect = this.Bounds;
            //hover inward
            let hoverLeft = menuBounds.Center.x > screenBounds.Center.x;
            let hoverUp = menuBounds.Center.y > screenBounds.Center.y;
            if(hoverLeft) this.X -= menuBounds.Width - this._targetBounds.Width * 0.1;
            else this.X += this._targetBounds.Width + this._targetBounds.Width * 0.1;
            if(hoverUp) this.Y -= menuBounds.Height - this._targetBounds.Height * 0.1;
            else this.Y += this._targetBounds.Height + this._targetBounds.Height * 0.1;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public update() {
            //track the target position
            if(this._targetBounds == null) return;

            this.X = this._targetBounds.Left;
            this.Y = this._targetBounds.Top;

            this._keepInBounds();
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get Bounds():Rect {
            return new Rect(this._position.x, this._position.y, 
                this._node.getBoundingClientRect().width, this._node.getBoundingClientRect().height);
        }
        public get X():number { return this._position.x; }
        public set X(value:number) {
            this._position.x = value;
            this._node.style.left = `${this._position.x}px`;
        }

        public get Y():number { return this._position.y; }
        public set Y(value:number) {
            this._position.y = value;
            this._node.style.top = `${this._position.y}px`;
        }

    }
}