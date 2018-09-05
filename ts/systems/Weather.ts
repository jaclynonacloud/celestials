///<reference path="weathers/Rain.ts"/>
///<reference path="weathers/Snow.ts"/>
namespace celestials.systems {    
    import Rain = weathers.Rain;
    import Snow = weathers.Snow;

    export class Weather implements IUpdateable, IPauseable {
        public static get TYPE() { return Object.freeze({"None":"none", "Rain":"rain", "Snow":"snow"})}
        private static _instance:Weather;
        private _node:HTMLElement;

        private _weathers:Map<string, weathers.WeatherAbstract>;

        private _usesWeather:boolean;
        private _currentWeather:weathers.WeatherAbstract;

        constructor(node:HTMLElement) {
            Weather._instance = this;
            //test
            this._node = node;
            this._usesWeather = false;
            // this._currentWeather = "";
            this._currentWeather = null;


            //setup weather
            this._weathers = new Map();
            console.log(this._weathers);
            //rain
            this._weathers[Weather.TYPE.Rain] = new weathers.Rain(
                this._node.querySelector(".raindrops"),
                this._node.querySelector(".rain"),
                this._node.querySelector(".splat"),
                this._node.querySelector(".splatdrops")
            );
            //snow
            this._weathers[Weather.TYPE.Snow] = new weathers.Snow(
                this._node.querySelector(".snowflakes"),
                this._node.querySelector(".snow")
            );
            


            //add console commands
            for(let weather of Object.keys(this._weathers)) {
                let key = `weather.start(${weather})`;
                systems.Console.addToConsoleCommands(key, ()=>this.changeWeather(this._weathers[weather]));
            }
            //stop weather
            systems.Console.addToConsoleCommands(`weather.stop()`, ()=>this.stopWeather());
            //kill weather
            systems.Console.addToConsoleCommands(`weather.kill()`, ()=>this.killWeather());


            this._node.classList.remove("hide");
        }


        /*---------------------------------------------- METHODS -------------------------------------*/
        public async changeWeather(weather:weathers.WeatherAbstract) {
            if(!this._usesWeather) return;
            //check if this is type
            const newWeather = weather;
            if(newWeather == null) {
                console.log(`${newWeather} is not a weather type!`);
                return;
            }

            //if a last weather is playing, wait for it to clear up
            if(this._currentWeather != null) {
                await this.stopWeather();
            }

            this._currentWeather = newWeather;
            //star the weather
            this._currentWeather.start();
        }

        public async stopWeather() {
            if(this._currentWeather != null) {
                await this._currentWeather.stop();
            }          
        }

        public async killWeather() {
            if(this._currentWeather != null) {
                await this._currentWeather.kill();
            }
        }

        private _containersHaveChildren(containers:HTMLElement[]) {
            for(let cont of containers)
                if(cont.childNodes.length > 0)
                    return true;

            return false;
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public resume() {
            if(this._currentWeather != null) this._currentWeather.resume();
        }
        public pause() {
            if(this._currentWeather != null) this._currentWeather.pause();
        }
        public update() {
            if(this._currentWeather != null) this._currentWeather.update();
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- OVERRIDES -----------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Instance():Weather { return Weather._instance; }
        public static set UseWeather(value:boolean) { Weather.Instance._usesWeather = value; }
        public static get CurrentWeather():weathers.WeatherAbstract { return Weather.Instance._currentWeather; }
        
    }
}