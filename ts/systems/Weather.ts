namespace celestials.systems {
    export interface IWeather {
        node:HTMLElement;
        startFunction:Function;
        containers?:HTMLElement[];
        duration?:number;
        _index?:number;
    }
    export class Weather {
        public static get TYPE() { return Object.freeze({"None":"none", "Rain":"rain", "Snow":"snow"})}
        private static _instance:Weather;
        private _node:HTMLElement;

        private _weatherLookup:Dictionary<string, IWeather>;

        private _usesWeather:boolean;
        private _currentWeather:string;

        constructor(node) {
            Weather._instance = this;
            //test
            this._node = node;
            this._usesWeather = false;
            this._currentWeather = "";


            this._weatherLookup = new Dictionary();
            //define weather HERE -------------------------------
            //rain
            this._weatherLookup.add(Weather.TYPE.Rain, {
                node:this._node.querySelector(".raining"),
                startFunction: () => this._makeItRain(50),
                containers:[
                    this._node.querySelector('.raindrops'),
                    this._node.querySelector('.splatdrops'),
                ]
            });
            //snow
            this._weatherLookup.add(Weather.TYPE.Snow, {
                node:this._node.querySelector(".snowing"),
                startFunction: () => this._makeItSnow(50),
                containers:[
                    this._node.querySelector('.snowflakes')
                ]
            });


            //add console commands
            //start weather
            for(let weather of this._weatherLookup.FullList) {
                let key = `weather.start(${weather[0]})`;
                systems.Console.addToConsoleCommands(key, ()=>this.changeWeather(weather[0]));
            }
            //stop weather
            systems.Console.addToConsoleCommands(`weather.stop()`, ()=>this.stopWeather());
        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        public async changeWeather(type:string) {
            if(!this._usesWeather) return;
            //check if this is type
            if(!this._weatherLookup.containsKey(type)) {
                console.log(`${type} is not a weather type!`);
                return;
            }

            //if a last weather is playing, wait for it to clear up
            if(this._currentWeather != "") {
                await this.stopWeather();
            }

            this._currentWeather = type;
            //start the weather
            this._weatherLookup.getValue(type).startFunction();
        }

        public async stopWeather() {
            return new Promise(async (res, rej) => {
                console.log("STOPPING WEATHER");
                //get active container
                const containers = this._weatherLookup.getValue(this._currentWeather).containers;
                //incrementally remove the elements
                while(this._containersHaveChildren(containers)) {
                // for(let i = containers[0].childNodes.length-1; i >= 0; i--) {
                    //delete the first node
                    for(let cont of containers) {
                        await cont.childNodes[0].remove();
                    }
                    await wait(randomRange(0, 200));
                    console.log("RMING")
                }

                console.log("DONE");
                res();

            });            
        }

        private _containersHaveChildren(containers:HTMLElement[]) {
            for(let cont of containers)
                if(cont.childNodes.length > 0)
                    return true;

            return false;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- OVERRIDES -----------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/



        








        /*https://codemyui.com/configurable-rain-effect-css/*/
        private async _makeItRain(amount:number = 100) {
            //clear out everything
            let rainDiv = this._node.querySelector(".raindrops");
            let splatDiv = this._node.querySelector(".splatdrops");
            while(rainDiv.childNodes.length > 0) rainDiv.childNodes[0].remove();
            while(splatDiv.childNodes.length > 0) splatDiv.childNodes[0].remove();


            let counter = amount;

            while(--counter) {
                console.log("NUM: " + counter);
                //random
                let randPos = randomRange(1, 98);
                let randOffset = randomRange(2, 5);
                let randDuration = randomRange(3, 6);
                //create rain
                let rain = document.createElement("div");
                rain.classList.add("rain");
                rain.style.left = `${randPos}%`;
                rain.style.animationDelay = `-${randOffset}s`;
                rain.style.animationDuration = `0.${randDuration}s`;
                rainDiv.appendChild(rain);
                //create splat
                let splat = document.createElement("div");
                splat.classList.add("splat");
                splat.style.left = `${randPos}%`;
                splat.style.animationDelay = `-${randOffset}s`;
                splatDiv.appendChild(splat);
                await wait(randomRange(100, 300));
            }
        }


        private async _makeItSnow(amount:number = 100) {
            //clear out everything
            let snowDiv = this._node.querySelector(".snowflakes");
            while(snowDiv.childNodes.length > 0) snowDiv.childNodes[0].remove();


            let counter = amount;

            while(--counter) {
                console.log("NUM: " + counter);
                //random
                let randPos = randomRange(1, 98);
                let randOffset = randomRange(2, 5);
                let randDuration = randomRange(3, 8);
                //create snow
                let snow = document.createElement("div");
                snow.classList.add("snow");
                snow.style.left = `${randPos}%`;
                snow.style.animationDelay = `-${randOffset}s`;
                snow.style.animationDuration = `${randDuration}s`;
                snowDiv.appendChild(snow);
                await wait(randomRange(200, 600));
            }
        }


        


        



        public static get Instance():Weather { return Weather._instance; }
        
    }
}