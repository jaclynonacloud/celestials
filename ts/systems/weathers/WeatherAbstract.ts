namespace celestials.weathers {
    /**Used to build a weather system that the Weather class will read and update.*/
    export abstract class WeatherAbstract implements IUpdateable, IPauseable {
        protected _container:HTMLElement;
        protected _duration:number;
        protected _isStillRunning:boolean;
        protected _isPaused:boolean;

        constructor(container:HTMLElement, duration?:number) {
            this._container = container;
            this._duration = duration || 30000;

            this._isStillRunning = false;
            this._isPaused = false;
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        public abstract start();
        public abstract stop();
        public abstract kill();
        public abstract resume();
        public abstract pause();
        public abstract update();
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- OVERRIDES -----------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/

    }
}