///<reference path="WeatherAbstract.ts"/>
namespace celestials.weathers {
    export class Rain extends WeatherAbstract {

        private _raindropTemplate:HTMLElement;
        private _splatTemplate:HTMLElement;
        private _splatContainer:HTMLElement;
        private _raindrops:HTMLElement[][];

        constructor(container:HTMLElement, raindropTemplate:HTMLElement, splatTemplate?:HTMLElement, splatContainer?:HTMLElement) {
            super(container);

            this._raindropTemplate = raindropTemplate;
            this._splatTemplate = splatTemplate;
            this._splatContainer = this._splatContainer;

            //remove templates once gathered
            this._raindropTemplate.remove();
            this._splatTemplate.remove();

            this._raindrops = new Array(HTMLElement[2]); //holds the raindrop and its splat
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        /*https://codemyui.com/configurable-rain-effect-css/*/
        public async start(numberOfDrops?:number) {
            this._isStillRunning = true;
            return await new Promise(async(resolve, reject) => {

                const dropsNumber = numberOfDrops || 50;
                //create the drops/splats
                this._raindrops = new Array(HTMLElement[2]);
                for(let i = 0; i < dropsNumber; i++) {
                    if(!this._isStillRunning || this._isPaused) {
                        resolve(); //if we stopped running while in this loop, escape
                        return;
                    }
                    const raindropSet = [
                        (this._raindropTemplate.cloneNode(true) as HTMLElement),
                        (this._splatTemplate != null) ? (this._splatTemplate.cloneNode(true) as HTMLElement) : null
                    ];
                    //add to array
                    this._raindrops.push(raindropSet);
                    //add to container
                    this._container.appendChild(raindropSet[0]);
                    if(this._splatContainer != null)
                        this._splatContainer.appendChild(raindropSet[1]);

                    //change the properties
                    const randPos = randomRange(1, 98);
                    const randOffset = randomRange(2, 5);
                    const randDuration = randomRange(3, 6);
                    for(let i = 0; i < raindropSet.length; i++) {
                        const el = raindropSet[i];
                        if(el == null) continue;
                        el.style.left = `${randPos}%`;
                        el.style.animationDelay = `-${randOffset}s`;
                        el.style.animationDuration = `0.${randDuration}s`;
                    }

                    await wait(randomRange(100, 400));
                }

                resolve();

            });
            

        }
        public async stop() {
            this._isStillRunning = false;
            return await new Promise(async(resolve, reject) => {

                while(this._raindrops.length > 0) {
                    if(this._isStillRunning || this._isPaused) {
                        resolve(); //if we started up this weather again, continue
                        return;
                    }
                    //remove the drop after a brief amount of time
                    const raindrop:HTMLElement[] = this._raindrops.splice(0, 1)[0];
                    if(raindrop != null) {
                        for(let i = 0; i < raindrop.length; i++) {
                            if(raindrop[i] != null) raindrop[i].remove();
                        }
                    }
    
                    await wait(randomRange(100, 400));
                }
                resolve();

            });
        }
        /**Kills the weather immediately. */
        public async kill() {
            this._isStillRunning = false;
            while(this._raindrops.length > 0) {
                const raindrop:HTMLElement[] = this._raindrops.splice(0, 1)[0];
                if(raindrop != null) {
                    for(let i = 0; i < raindrop.length; i++) {
                        if(raindrop[i] != null) raindrop[i].remove();
                    }
                }
            }
        }
        public async resume() {
            this._isPaused = false;
            for(let i = 0; i < this._raindrops.length; i++) {
                if(this._raindrops[i] == null) continue;
                for(let n = 0; n < this._raindrops[i].length; n++) {
                    if(this._raindrops[i][n] != null) this._raindrops[i][n].style.animationPlayState = "running";
                }
            }
        }
        public async pause() {
            this._isPaused = true;
            for(let i = 0; i < this._raindrops.length; i++) {
                if(this._raindrops[i] == null) continue;
                for(let n = 0; n < this._raindrops[i].length; n++) {
                    if(this._raindrops[i][n] != null) this._raindrops[i][n].style.animationPlayState = "paused";
                }
            }
        }
        public async update() {
            
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- OVERRIDES -----------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/

    }
}