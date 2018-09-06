namespace celestials.engines {
    export interface IMoodSet {
        value?:number;
        decay?:number;
    }
    export interface IMoods {
        updateRate?:number;
        social?:IMoodSet;
        hunger?:IMoodSet;
        rest?:IMoodSet;
    }

    import Celestial = entities.Celestial;
    
    export class Moods implements IUpdateable, ILoadable {
        public static get MOOD() { return Object.freeze({"Social":"social", "Hunger":"hunger", "Rest":"rest"});}

        private _celestial:Celestial;
        private _moods:IMoods;

        private _usesMood:boolean;
        private _updateTick:number;

        //callbacks
        private _onMoodChange:Function;

        constructor(celestial:Celestial) {
            this._celestial = celestial;

            this._moods = this._celestial.Data.moods;
            this._moods = this._celestial.Data.moods || 
            //moods default
            {
                social: { value:100, decay:0 },
                hunger: { value:100, decay:0},
                rest: { value:100,  decay:0}
            };
            this._usesMood = false;
            this._updateTick = 0;

            this._onMoodChange = null;

        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public decay() {
            if(!this._usesMood) return;
            //decay moods IF running
            //iterate through moods
            for(let key of Object.keys(Moods.MOOD)) {
                //get the mood
                let mood = this._moods[Moods.MOOD[key]];
                if(mood != null) {
                    //decay
                    mood.value = clamp(mood.value - (mood.decay * this._celestial.Variation), 1, 100);
                }
            }

        }
        public boost(moodName:string, value?:number, useRandomness:boolean = false) {
            if(!this._usesMood) return;
            let mood = this.getMoodByName(moodName);
            if(mood != null) {
                if(value != null) {
                    if(useRandomness) {
                        let seed = randomRange(0.5, 1.5);
                        let attachment = this._celestial.Relationships.Attachment / 100;
                        value = clamp(((attachment + seed) / 2) * value, 1, 100);
                    } 
                    mood.value = clamp(mood.value + value, 1, 100);
                }
            }
            else {
                //determine a random boost based on settings
                let seed = randomRange(0.5, 1.5);
                let attachment = this._celestial.Relationships.Attachment / 100;
                value = clamp(((attachment + seed) / 2) * (mood.decay * 3), 1, 100);

            }
        }

        public getMoodByName(name:string):IMoodSet {
            if(this._moods == null) return {value:0, decay:0};
            let mood = this._moods[name];
            return mood || {value:0, decay:0};
        }

        public addMoodListener(callback:Function) {
            this._onMoodChange = callback;
        }
        public removeMoodListener() {
            this._onMoodChange = null;
        }

        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public async load() {
            this._usesMood = App.UsesMood;
        }
        public async unload() {
            this.removeMoodListener();
        }

        public async update() {
            if(!this._usesMood) return;
            if(this._moods == null) return;
            if(this._updateTick > (this._moods.updateRate || 200)) {
                this._updateTick = 0;
                //degrade mood
                this.decay();
            }


            this._updateTick++;
        }

        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get UsesMood():boolean { return this._usesMood; }


    }

}