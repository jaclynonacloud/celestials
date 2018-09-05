namespace celestials.ui.menus {
    export class CurrentCelestialsItem extends components.Item {
        private _celestial:entities.Celestial;
        private _changeListener:Function;
        private _removeListener:Function;
        private _updateListener:Function;
        private _buttons: {
            infoButton:HTMLElement,
            editButton:HTMLElement,
            deleteButton:HTMLElement
        }
        private _registry: {
            onInfo?,
            onEdit?,
            onDelete?,
            onCelestialChange?
        }
        constructor(node:HTMLElement, cel:entities.Celestial, changeListener?, removeListener?, updateListener?) {
            super(node);
            this._celestial = cel;
            this._changeListener = changeListener;
            this._removeListener = removeListener;
            this._updateListener = updateListener;

            //setup item
            this.updateData();
            this.loadIcon();         

            //listen to item click
            // this.Node.addEventListener("mousedown", () => this.select());

            //setup for tooltips
            menus.Tooltip.lookForTooltips(this.Node);


            //setup internal registry
            this._registry = {
                onInfo : this._onInfo.bind(this),
                onEdit : this._onEdit.bind(this),
                onDelete : this._onDelete.bind(this),
                onCelestialChange : this._onCelestialChange.bind(this)
            }


            this._buttons = {
                infoButton : this.Node.querySelector(".item.info"),
                editButton : this.Node.querySelector(".item.edit"),
                deleteButton : this.Node.querySelector(".item.delete")
            }

            let { infoButton, editButton, deleteButton } = this._buttons;

            //wire up item buttons
            infoButton.addEventListener("mousedown", this._registry.onInfo);
            editButton.addEventListener("mousedown", this._registry.onEdit);
            deleteButton.addEventListener("mousedown", this._registry.onDelete);

            //setup dependant ui components
            new components.YesNoConfirm(
                this.Node.querySelector(".confirm .icon.confirm"), 
                this.Node.querySelector(".confirm .icon.delete"),
                //onYes
                () => {
                    //remove celestial
                    this.callRemove();
                },
                //onNo
                () => {
                    //hide menu
                    this.closeDeletePanel();
                })
            new components.InputConfirm(
                this.Node.querySelector(".edit-name input"), 
                this.Node.querySelector(".edit-name .confirm"), 
                //onchange
                null,
                //onreturn
                (name) => {
                    cel.setName(name);
                    this.closeEditPanel();
                    //change item name immediately
                    this.Node.querySelector(".name").innerHTML = cel.Name;
                    //update the list
                    this.callChange();
                }, 
                //oncancel
                () => this.closeEditPanel(),
                { confirmWithEnterKey:true, cancelWithEscapeKey:true }
            );


            //listen to celestial for internal changes
            // this._celestial.registerListener(this.Node, this._registry.onCelestialChange);

        }

        /*------------------ METHODS ---------------*/
        public deselect() {
            super.deselect();
            //turn off panels
            this.closeEditPanel();
            this.closeDeletePanel();
        }

        public updateData() {
            //set properties
            this.Node.querySelector(".name").innerHTML = this._celestial.Name;
            this.Node.querySelector(".type").innerHTML = this._celestial.Lookup;
            // let dateOptions = { month:'long', day:'numeric', year:'numeric'}
            let dateOptions = { month:'long', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric', second:'numeric'}
            this.Node.querySelector(".date").innerHTML = this._celestial.DateSpawned.toLocaleDateString('us-EN', dateOptions);
        }

        public async loadIcon() {
            let image = this.Node.querySelector("img");
            image.src = this._celestial.Icon.src;
            image.style.filter = this._celestial.Icon.style.filter;
            /*
            //set the image
            await this._celestial.getIcon()
                .then(src => this.Node.querySelector("img").src = src);
            */
        }

        public openEditPanel() {
            this.Node.querySelector(".item.edit").classList.add("selected");

            //focus
            let inputDiv = (this.Node.querySelector(".edit-name input") as HTMLInputElement);
            console.log("FOCUS")
            console.log(inputDiv);
            window.setTimeout(() => inputDiv.focus(), 0)
            // inputDiv.focus();
        }
        public closeEditPanel() {
            this.Node.querySelector(".item.edit").classList.remove("selected");
        }
        public openDeletePanel() {
            console.log("OPEN ME")
            this.Node.querySelector(".item.delete").classList.add("selected");
        }
        public closeDeletePanel() {
            console.log("CLOSE ME")
            this.Node.querySelector(".item.delete").classList.remove("selected");
        }


        public callChange() {
            if(this._changeListener != null)
                this._changeListener(this);
        }
        public callRemove() {
            if(this._removeListener != null)
                this._removeListener(this);
        }
        public callUpdate() {
            if(this._updateListener != null)
                this._updateListener(this);
        }
        /*------------------ EVENTS ----------------*/
        private _onInfo() {
            //call info panel
            CelestialDetails.show(this._celestial);
        }
        private _onEdit() {
            //change text to name
            let inputDiv = (this.Node.querySelector(".edit-name input") as HTMLInputElement);
            inputDiv.value = this._celestial.Name;
            
            this.openEditPanel();
        }
        private _onDelete() {
            this.openDeletePanel();
        }

        private _onCelestialChange() {
            //ask for an update
            this.updateData();
            //tell anyone listening to us
            this.callUpdate();
        }
        /*------------------ GETS & SETS -----------*/
        public get Celestial():entities.Celestial { return this._celestial; }
    }
}