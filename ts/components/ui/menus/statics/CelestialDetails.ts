///<reference path="./../../components/MultiList.ts" />
///<reference path="./../overlays/Tooltip.ts" />
namespace celestials.ui.menus {
    interface IStaticElements {
        lookup?:HTMLElement;
        dateSpawned?:HTMLElement;
        rarity?:HTMLElement;
        favouriteAction?:HTMLElement;
        availableActions?:HTMLElement;
        spawnedBy?:HTMLElement;
        attentionSpan?:HTMLElement;
    }
    interface IActiveElements {
        name?:HTMLElement;
        age?:HTMLElement;
        size?:HTMLElement;
        mass?:HTMLElement;
        currentAction?:HTMLElement;
        descendants?:HTMLElement;
        friends?:HTMLElement;
        enemies?:HTMLElement;
        socialNeeds?:HTMLElement;
        hungerNeeds?:HTMLElement;
        restNeeds?:HTMLElement;
        screenshot?:HTMLImageElement;
    }
    
    import Celestial = entities.Celestial;
    export class CelestialDetails extends OverlayMenu {
        private static _instance:CelestialDetails;

        private _eventsRegistry:Dictionary<string, any>;

        private _celestial:Celestial;
        private _staticElements:IStaticElements;
        private _activeElements:IActiveElements;
        private _moodToggle:{ disable:HTMLElement, enable:HTMLElement }

        private _lastDescendantsLength:number;
        private _lastFriendsLength:number;
        private _lastEnemiesLength:number;

        private _closeButton:HTMLElement;
        private _viewInListButton:HTMLElement;

        private _updateTimer;

        constructor(node:HTMLElement) {
            super(node, null);
            CelestialDetails._instance = this;


            this._closeButton = this._node.querySelector(".ui.close");
            this._viewInListButton = this._node.querySelector(".ui.view");

            //setup elements
            this._staticElements = {
                lookup : this._node.querySelector("[data-detail='lookup']"),
                dateSpawned : this._node.querySelector("[data-detail='date-spawned']"),
                rarity : this._node.querySelector("[data-detail='rarity']"),
                favouriteAction : this._node.querySelector("[data-detail='favourite-action']"),
                availableActions : this._node.querySelector("[data-detail='available-actions']"),
                spawnedBy : this._node.querySelector("[data-detail='spawned-by']"),
                attentionSpan : this._node.querySelector("[data-detail='attention-span']"),
            };
            this._activeElements = {
                name : this._node.querySelector("[data-detail='name']"),
                age : this._node.querySelector("[data-detail='age']"),
                size : this._node.querySelector("[data-detail='size']"),
                mass : this._node.querySelector("[data-detail='mass']"),
                currentAction : this._node.querySelector("[data-detail='current-action']"),
                descendants : this._node.querySelector("[data-detail='descendants']"),
                friends : this._node.querySelector("[data-detail='friends']"),
                enemies : this._node.querySelector("[data-detail='enemies']"),
                socialNeeds : this._node.querySelector("[data-detail='social-need']"),
                hungerNeeds : this._node.querySelector("[data-detail='hunger-need']"),
                restNeeds : this._node.querySelector("[data-detail='rest-need']"),
                screenshot : this._node.querySelector("[data-detail='screenshot'")
            };

            this._moodToggle = {
                disable : this._node.querySelector(".mood .disabled"),
                enable : this._node.querySelector(".mood .enabled")
            };

            CelestialDetails.hide();
            CelestialDetails.hideMood();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public static async show(celestial:Celestial) {
            // await setTimeout(() =>{}, 100);
            CelestialDetails._instance.show();

            let instance = CelestialDetails._instance;
            instance._celestial = celestial;

            //setup all the static elements on show
            instance._staticElements.lookup.innerHTML = celestial.Lookup;
            let dateSpawned = celestial.DateSpawned;
            instance._staticElements.dateSpawned.innerHTML = `${dateSpawned.getMonth()+1}/${dateSpawned.getDate()}/${dateSpawned.getFullYear()}`;
            instance._staticElements.rarity.innerHTML = "TODO";

            instance._staticElements.attentionSpan.innerHTML = `${celestial.Logic.AttentionSpan.toFixed(1)}%`;
            instance._staticElements.favouriteAction.innerHTML = celestial.FavouriteSequence;
            instance._staticElements.availableActions.innerHTML = celestial.AvailableSequences.join(", ");

            if(celestial.SpawnedBy != null) {
                instance._staticElements.spawnedBy.innerHTML = "";
                 //create a span tag
                 let span = document.createElement("span");
                 span.classList.add("link");
                 span.innerHTML = celestial.SpawnedBy.Name;
                 instance._staticElements.spawnedBy.appendChild(span);

                 //link
                 span.addEventListener("click", () => {
                    ui.menus.CelestialDetails.show(celestial.SpawnedBy);
                    if(ui.menus.CurrentCelestialsPanel.Instance.IsShowing)
                        ui.menus.CurrentCelestialsPanel.selectCelestial(celestial.SpawnedBy);
                });
            }
            else instance._staticElements.spawnedBy.innerHTML = "User Action";

            instance._rebuildList(celestial.Descendants, instance._lastDescendantsLength, instance._activeElements.descendants, true);
            instance._rebuildList(celestial.Relationships.Friends.map((value) => value.celestial), instance._lastFriendsLength, instance._activeElements.friends, true);
            instance._rebuildList(celestial.Relationships.Enemies.map((value) => value.celestial), instance._lastEnemiesLength, instance._activeElements.enemies, true);

            //run the update method for the active elements
            instance.update();
            //run the filter only on show
            instance._activeElements.screenshot.style.filter = celestial.MainImage.style.filter;

            
        }

        public static hide() {
            CelestialDetails._instance.hide();            
        }

        public static showMood() {
            let instance = CelestialDetails._instance;
            instance._moodToggle.enable.classList.remove("hide");
            instance._moodToggle.disable.classList.add("hide");
        }
        public static hideMood() {
            let instance = CelestialDetails._instance;
            instance._moodToggle.disable.classList.remove("hide");
            instance._moodToggle.enable.classList.add("hide");
        }

        private _setProgress(bar:HTMLElement, mood:engines.IMoodSet) {
            let value = mood.value;
            //if the value is LESS than 20%, make bar low
            bar.style.width = `${value}%`;

            bar.parentElement.classList.remove("low");
            bar.parentElement.classList.remove("high");
            if(value < 20) bar.parentElement.classList.add("low");
            else if(value > 80) bar.parentElement.classList.add("high");
            
        }


        private _grabScreenshot(forceChange:boolean = false) {
            let instance = CelestialDetails._instance;
            let lastSrc = instance._activeElements.screenshot.src;
            let mainImage = instance._celestial.MainImage;
            let currSrc = mainImage.src;
            if(lastSrc != currSrc || forceChange) {
                instance._activeElements.screenshot.src = currSrc;
                this._activeElements.screenshot.style.width = `${mainImage.width}px`;
                this._activeElements.screenshot.style.height = `${mainImage.height}px`;
            }
        }

        private _rebuildDescendants(firstTime:boolean = false) {
            if(this._celestial == null) return;
            let descendants = this._celestial.Descendants;
            if(descendants.length != this._lastDescendantsLength || firstTime) {
                //only recreate this element if it has changed length
                this._activeElements.descendants.innerHTML = "";
                for(let i = 0; i < descendants.length; i++) {
                    let desc = descendants[i];
                    //create a span tag
                    let span = document.createElement("span");
                    span.classList.add("link");
                    span.innerHTML = desc.Name;
                    this._activeElements.descendants.appendChild(span);
                    if(i < descendants.length-1) {
                        let commaSpan = document.createElement("span");
                        commaSpan.innerHTML = ", ";
                        this._activeElements.descendants.appendChild(commaSpan);
                    }

                    //link
                    span.addEventListener("click", () => {
                        ui.menus.CelestialDetails.show(desc);
                        if(ui.menus.CurrentCelestialsPanel.Instance.IsShowing)
                            ui.menus.CurrentCelestialsPanel.selectCelestial(desc);
                    });
                }
            }
        }

        private _rebuildList(list:Celestial[], lastLength:number, container:HTMLElement, firstTime:boolean = false) {
            if(this._celestial == null) return;
            if(list.length != lastLength || firstTime) {
                //only recreate this element if it has changed length
                container.innerHTML = "";
                for(let i = 0; i < list.length; i++) {
                    let item = list[i];
                    //create a span tag
                    let span = document.createElement("span");
                    span.classList.add("link");
                    span.innerHTML = item.Name;
                    container.appendChild(span);
                    if(i < list.length-1) {
                        let commaSpan = document.createElement("span");
                        commaSpan.innerHTML = ", ";
                        container.appendChild(commaSpan);
                    }

                    //link
                    span.addEventListener("click", () => {
                        ui.menus.CelestialDetails.show(item);
                        if(ui.menus.CurrentCelestialsPanel.Instance.IsShowing)
                            ui.menus.CurrentCelestialsPanel.selectCelestial(item);
                    });
                }
            }
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        public load() {
            //set the update interval
            CelestialDetails._instance._updateTimer = setInterval(CelestialDetails._instance.update.bind(CelestialDetails._instance), 100);

            managers.MouseManager.listenForMouseUp(this._closeButton, () => CelestialDetails.hide(), "celDetails_closeButton");
            managers.MouseManager.listenForMouseUp(this._viewInListButton, () => this._onShowInView(), "celDetails_viewInListButton");
        }
        public unload() {
            App.Window.clearInterval(CelestialDetails._instance._updateTimer);

            managers.MouseManager.removeListener("celDetails_closeButton");
            managers.MouseManager.removeListener("celDetails_viewInListButton");
        }
        /*---------------------------------------------- EVENTS --------------------------------------*/
        

        private _onShowInView() {
            if(this._celestial != null) {
                CurrentCelestialsPanel.selectCelestial(this._celestial);
            }
        }
        /*---------------------------------------------- OVERRIDES -----------------------------------*/
        public update() {
        // (CelestialDetails._instance as OverlayM,enu).update();
        //update the active elements
            //setup all the elements on show
            this._activeElements.name.innerHTML = this._celestial.Name;
            this._staticElements.lookup.innerHTML = this._celestial.Lookup;
            this._activeElements.age.innerHTML = this._celestial.Age.toFixed(2);
            this._activeElements.size.innerHTML = this._celestial.Size.toFixed(2);
            this._activeElements.mass.innerHTML = `${this._celestial.Mass.toFixed(2)} souls`;

            this._activeElements.currentAction.innerHTML = this._celestial.Sequencer.CurrentSequence.name;

            // this._rebuildDescendants();
            this._rebuildList(this._celestial.Descendants, this._lastDescendantsLength, this._activeElements.descendants);
            this._rebuildList(this._celestial.Relationships.Friends.map((value) => value.celestial), this._lastFriendsLength, this._activeElements.friends);
            this._rebuildList(this._celestial.Relationships.Enemies.map((value) => value.celestial), this._lastEnemiesLength, this._activeElements.enemies);

             
            this._setProgress(this._activeElements.socialNeeds, this._celestial.Moods.getMoodByName(engines.Moods.MOOD.Social));
            this._setProgress(this._activeElements.hungerNeeds, this._celestial.Moods.getMoodByName(engines.Moods.MOOD.Hunger));
            this._setProgress(this._activeElements.restNeeds, this._celestial.Moods.getMoodByName(engines.Moods.MOOD.Rest));

            this._grabScreenshot();

            this._lastDescendantsLength = this._celestial.Descendants.length;
            this._lastFriendsLength = this._celestial.Relationships.Friends.length;
            this._lastEnemiesLength = this._celestial.Relationships.Enemies.length;
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get isShowing():boolean { return CelestialDetails._instance._isShowing; }
        public static get CurrentCelestial():Celestial { return CelestialDetails._instance._celestial; }


    }
}