///<reference path="WeatherAbstract.ts"/>
namespace celestials.weathers {
    export class Snow extends WeatherAbstract {

        private _snowflakeTemplate:HTMLElement;
        private _snowflakes:HTMLElement[]

        constructor(container:HTMLElement, snowflakeTemplate:HTMLElement) {
            super(container);

            this._snowflakeTemplate = snowflakeTemplate;
            this._snowflakes = new Array<HTMLElement>();

            //remove templates
            this._snowflakeTemplate.remove();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public async start(numberOfSnowflakes?:number) {
            this._isStillRunning = true;
            return await new Promise(async(resolve, reject) => {

                const flakesNumber = numberOfSnowflakes || 50;
                //create the snowflakes
                this._snowflakes = new Array<HTMLElement>();
                for(let i = 0; i < flakesNumber; i++) {
                    if(!this._isStillRunning || this._isPaused) {
                        resolve(); //if we stopped running while in this loop, escape
                        return;
                    }
                    const snowflake:HTMLElement = this._snowflakeTemplate.cloneNode(true) as HTMLElement;
                    //add to array
                    this._snowflakes.push(snowflake);
                    //add to container
                    this._container.appendChild(snowflake);
                    //change position
                    snowflake.style.left = `${randomRange(0, 98)}%`;
                    snowflake.style.animationDelay = `-${randomRange(2, 5)}s`;
                    snowflake.style.animationDuration = `${randomRange(3, 8)}s`;

                    await wait(randomRange(100, 400));
                }

                resolve();

            });
            
        }
        public async stop() {
            this._isStillRunning = false;
            return await new Promise(async(resolve, reject) => {

                while(this._snowflakes.length > 0) {
                    if(this._isStillRunning || this._isPaused) {
                        resolve(); //if we started up this weather again, continue
                        return;
                    }
                    //remove the flake after a brief amount of time
                    const snowflake = this._snowflakes.splice(0, 1)[0];
                    snowflake.remove();
    
                    await wait(randomRange(80, 200));
                }
                resolve();

            });
            
        }
        /**Kills the weather immediately. */
        public async kill() {
            this._isStillRunning = false;
            while(this._snowflakes.length > 0) {
                const snowflake = this._snowflakes.splice(0, 1)[0];
                snowflake.remove();
            }
        }
        public async resume() {
            this._isPaused = false;
            for(let i = 0; i < this._snowflakes.length; i++) {
                if(this._snowflakes[i] == null) continue;
                this._snowflakes[i].style.animationPlayState = "running";
            }
        }
        public async pause() {
            this._isPaused = true;
            for(let i = 0; i < this._snowflakes.length; i++) {
                if(this._snowflakes[i] == null) continue;
                this._snowflakes[i].style.animationPlayState = "paused";
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