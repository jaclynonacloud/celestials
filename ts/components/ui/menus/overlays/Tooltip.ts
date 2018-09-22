namespace celestials.ui.menus {
    export class Tooltip extends OverlayMenu {
        public static get DEF_DURATION():number { return 1000; }
        public static get DEF_IDLE():number { return 1000; }
        private static _instance:Tooltip;
        private _tooltips:HTMLElement[];

        private _durationTimer;
        private _idleTimer;

        constructor(node:HTMLElement) {
            super(node, null);
            Tooltip._instance = this;

            //get all the elements looking for a tooltip
            this._tooltips = new Array();
            let tooltips = App.Node.querySelectorAll(`[data-tooltip]`);
            for(let i = 0; i < tooltips.length; i++) {
                let tooltip = tooltips[i] as HTMLElement;
                Tooltip.addTooltip(tooltip);
            }

            // this._timer = setTimeout(Tooltip._instance.hide, Tooltip.DEF_DURATION);
            Tooltip._instance.hide();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public static lookForTooltips(node:HTMLElement) {
            let divs = node.querySelectorAll("*");
            for(let i = 0; i < divs.length; i++) {
                let div:HTMLElement = divs[i] as HTMLElement;
                if(div != null) {
                    if(div.dataset.tooltip != null)
                        Tooltip.addTooltip(div, div.dataset.tooltip);
                }
            }
        }
        public static addTooltip(tooltip:HTMLElement, text?:string) {
            if(Tooltip._instance._tooltips.indexOf(tooltip) !- -1)
                return;
                
            Tooltip._instance._tooltips.push(tooltip);

            if(tooltip.dataset.tooltip == null) {
                if(text != null)
                    tooltip.setAttribute('data-tooltip', text);
            }

            //listen for hover over
            tooltip.addEventListener("mouseenter", Tooltip._instance._onHover.bind(Tooltip._instance));
            tooltip.addEventListener("mouseleave", Tooltip._instance._onHoverOut.bind(Tooltip._instance));

            // console.log("ADDED TO TOOLTIPS");
            // console.log(tooltip);
        }
        public static showTooltipOnElement(text:string, element:HTMLElement, duration:number = Tooltip.DEF_DURATION, useDelay:boolean = true) {
            Tooltip.showTooltip(text, element.offsetLeft, element.offsetTop, duration);
        }
        public static showTooltip(text:string, x?:number, y?:number, duration:number = Tooltip.DEF_DURATION) {
            Tooltip._instance._node.innerHTML = text;
            Tooltip._instance.show();

            x = x || App.MousePosition.x;
            y = y || App.MousePosition.y;


            //move y down from mouse cursor a bit
            y += 15;
            let width = Tooltip._instance._node.getBoundingClientRect().width;
            let height = Tooltip._instance._node.getBoundingClientRect().height;
            if(x + width > App.Bounds.Right) x = App.Bounds.Right - width;
            if(y + height > App.Bounds.Bottom) y = App.Bounds.Top - height;

            Tooltip._instance.X = x;
            Tooltip._instance.Y = y;
            

            Tooltip._instance._durationTimer = setTimeout(() => {
                Tooltip._instance.hide();
                Tooltip._instance.reset();
            }, duration);
        }

        public static getMessageDuration(message:string) {
            return message.length * 0.07 * 1000;
        }

        private reset() {

            //reset the timeout
            if(Tooltip._instance._durationTimer != null)
                App.Window.clearTimeout(Tooltip._instance._durationTimer);    
            if(Tooltip._instance._idleTimer != null)        
                App.Window.clearTimeout(Tooltip._instance._idleTimer);
        }

        
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {
        }
        public unload() {
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onHover(e:MouseEvent) {
            let element:HTMLElement = e.target as HTMLElement;
            if(element == null) return;
            //bubble up to the parent
            if(element.dataset.tooltip == null) element = element.closest("[data-tooltip]") as HTMLElement;            
            
            let text = element.dataset.tooltip;
            
            //start idle timer
            this._idleTimer = setTimeout(
                () =>
                    Tooltip.showTooltip(element.dataset.tooltip, App.MousePosition.x, 
                        App.MousePosition.y, Tooltip.getMessageDuration(element.dataset.tooltip)),
                Tooltip.DEF_IDLE);

                
        }
        private _onHoverOut(e:MouseEvent) {
            let element:HTMLElement = e.target as HTMLElement;
            if(element == null) return;
            //bubble up to the parent
            if(element.dataset.tooltip == null) element = element.closest("[data-tooltip]") as HTMLElement;
            this.reset();
            this.hide();
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/

    }
}