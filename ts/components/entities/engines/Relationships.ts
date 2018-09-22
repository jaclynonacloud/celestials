namespace celestials.engines {
    import Celestial = entities.Celestial;

    export interface IFriend {
        celestial?:Celestial;
        value?:number;
        lastAction?:string;
    }
    export interface IRelationships {
        updateRate?:number;
        neutral?:number; //the value in which a relationship will start at.
        attachment?:number; //how attached celestial is to friends.  Affects decay of social mood.
        aggression?:number; //how likely it is for an interaction to be hostile.
        friends?:string[];
        enemies?:string[];
    }
    
    export class Relationships implements IUpdateable, ILoadable {
        public static get MOOD() { return Object.freeze({"Social":"social", "Hunger":"hunger", "Rest":"rest"});}

        private _celestial:Celestial;
        private _relationshipsData:IRelationships;

        private _usesRelationships:boolean;
        private _updateTick:number;

        private _relationships:IFriend[];

        //callbacks
        private _relationshipsListener:Function;

        constructor(celestial:Celestial) {
            this._celestial = celestial;

            this._relationshipsData = this._celestial.Data.relationships;
            this._usesRelationships = false;
            this._updateTick = 0;

            this._relationshipsListener = null;

            if(this._relationshipsData == null) {
                //default relationships data
                this._relationshipsData = {
                    updateRate: 200,
                    neutral: 50,
                    attachment: 0,
                    friends: [],
                    enemies: []
                }
            }

            this._relationships = new Array();

        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public getInteractValueWith(celestial:Celestial, action?:string) {
            //determine whether this is a good or bad interaction
            let seed = randomRange(-1, 1);
            let goodRelationship = this._isGoodRelationshipType(celestial);
            //test interpersonal relation
            let interpersonal = (this._getRelationshipValue(celestial) == 0) ? 0 : (this._getRelationshipValue(celestial) - 50) / 100; //normalize and center
            let interactionStrength  = (seed * interpersonal) + (seed * ((goodRelationship) ? 1 : -1)) + seed;
            interactionStrength *= (randomRange(0.5, 1.5) * this._relationshipsData.aggression || 1);
            interactionStrength *= 10;

            // this.setInteraction(celestial, interactionStrength, action);

            return interactionStrength;
        }
        public setInteraction(celestial:Celestial, value:number, action?:string) {
            console.log("THIS INTERACTION IS WORTH: " + value + ", with: " + celestial.Name);

            //if we haven't interacted before, set relationship
            let relation = this.findRelationshipByCelestial(celestial);
            if(relation == null) {
                this._relationships.push({
                    celestial: celestial,
                    value: this._relationshipsData.neutral + value,
                    lastAction: action || "None"
                });
            }
            //otherwise, change the value
            else {
                relation.value = clamp(relation.value + value, 0, 100);
            }
        }

        private _isGoodRelationshipType(celestial:Celestial) {
            if(this._relationshipsData.friends != null)
                for(let f of this._relationshipsData.friends)
                    if(f == celestial.Lookup)
                        return true;
            if(this._relationshipsData.enemies != null)
                for(let e of this._relationshipsData.enemies)
                    if(e == celestial.Lookup)
                        return false;
            //default to a good relationship
            return true;
        }
        private _getRelationshipValue(celestial:Celestial) {
            for(let rel of this._relationships)
                if(rel.celestial == celestial)
                    return rel.value;
            return 0;
        }

        public findRelationshipByCelestial(celestial:Celestial) {
            for(let rel of this._relationships)
                if(rel.celestial == celestial)
                    return rel;
            return null;
        }

        public addRelationshipsListener(callback:Function) {
            this._relationshipsListener = callback;
        }
        public removeRelationshipsListener() {
            this._relationshipsListener = null;
        }

        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public async load() {
            
        }
        public async unload() {

        }

        public async update() {
            if(!this._usesRelationships) return;

            // this._updateTick++;
        }

        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public get Attachment():number { return clamp(this._relationshipsData.attachment || 0, 0, 100); }
        public get Relationships():IFriend[] { return this._relationships; }
        public get Friends():IFriend[] { return this._relationships.filter((value) => value.value > 75); }
        public get Enemies():IFriend[] { return this._relationships.filter((value) => value.value < 20); }


    }

}