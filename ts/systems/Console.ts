namespace celestials.systems {
    export class Console {
        private static _instance:Console;
        private _node:HTMLElement;
        private _input:HTMLInputElement;
        private _inputMimic:HTMLInputElement;

        private _keyPressed;
        private _commands:Dictionary<string | RegExp, { prettyName?:string, func:Function, params:number[] }>;
        private _prevCommands:string[];
        private _prevIndex:number;
        private _ctrlPresses:number;

        constructor(node:HTMLElement) {
            Console._instance = this;
            this._node = node;
            this._input = this._node.querySelector("input.console");
            this._inputMimic = this._node.querySelector("input.mimic");

            this._node.querySelector(".ui.close").addEventListener("click", () => {
                //toggle the control panel
                ui.menus.ControlPanel.toggleConsole(false);
                this.close();
            });

            this._keyPressed = this._onKeyPressed.bind(this);
            this._commands = new Dictionary();
            this._prevCommands = new Array();
            this._prevIndex = -1;
            this._ctrlPresses = 0;

            this.close();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public async open() {
            this._node.classList.remove("hide");
            this._input.focus();
            this.killListeners();
            //listen to keys
            this._input.addEventListener("keydown", this._keyPressed);
            managers.InputManager.addBinding("console__keyReturn", new KeyBinding(this._onKeyReturn.bind(this), KeyBinding.State.Down, Key.Code.enter));
            managers.InputManager.addBinding("console__keyUp", new KeyBinding(this._onLastCommand.bind(this), KeyBinding.State.Down, Key.Code["up arrow"]));
            managers.InputManager.addBinding("console__keyDown", new KeyBinding(this._onNextCommand.bind(this), KeyBinding.State.Down, Key.Code["down arrow"]));
            managers.InputManager.addBinding("console__keyRight", new KeyBinding(this._onAutocomplete.bind(this), KeyBinding.State.Down, Key.Code["right arrow"]));
            managers.InputManager.addBinding("console__keyEnd", new KeyBinding(this._onAutocomplete.bind(this), KeyBinding.State.Down, Key.Code.end));


            this._input.value = "Type command here...";
            await wait(100);
            this._input.setSelectionRange(0, this._input.value.length);
        }
        public close() {
            this._node.classList.add("hide");
            this.killListeners();
        }

        public killListeners() {
            //stop listen to keys
            this._input.removeEventListener("keydown", this._keyPressed);
            managers.InputManager.removeBinding("console__keyReturn");
            managers.InputManager.removeBinding("console__keyUp");
            managers.InputManager.removeBinding("console__keyDown");
            managers.InputManager.removeBinding("console__keyRight");
            managers.InputManager.removeBinding("console__keyEnd");
        }

        public static addToConsoleCommands(key:string | RegExp, command:Function, prettyName?:string, ...params:number[]) {
            //get the params out of the string
            Console._instance._commands.add(key, {func:command, prettyName, params});

            //sort the commands
            Console._instance._commands.FullList.sort((a, b) => {
                //the key can either be a string or RegExp.  If RegExp, check for a pretty name.  If there is no pretty name, return ""
                const newA = (a[0] instanceof RegExp) ? ((a[1].prettyName != null) ? a[1].prettyName : "") : a[0] as string;
                const newB = (b[0] instanceof RegExp) ? ((b[1].prettyName != null) ? b[1].prettyName : "") : b[0] as string;
                return newA.localeCompare(newB)
            });
        }

        private _getListNames() {
            const regList = this._commands.FullList
                .filter(reg => reg[0] instanceof RegExp && reg[1].prettyName != null)
                .map(reg => reg[1].prettyName as string);
            const stringList = this._commands.FullList.filter(reg => !(reg[0] instanceof RegExp)).map(reg => reg[0] as string);
            return stringList.concat(regList);
        }

        private _findNearestCommand(key:string):string {
            if(key == "") return "";
            //iterate through commands
            const fullList = this._getListNames();
            for(let i = 0; i < fullList.length; i++) {
                if(fullList[i].toLowerCase().startsWith(key.toLowerCase()))
                    return fullList[i];
            }
            return "";
        }

        private _findNextNearestCommand(key:string, index:number):string {
            const fullList = this._getListNames();
            let ind = 0;
            for(let i = 0; i < fullList.length; i++) {
                if(fullList[i].toLowerCase().startsWith(key.toLowerCase())) {
                    ind++;
                    if(ind == index) return fullList[i];
                }
            }
            return "";
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        private _onKeyPressed(e:KeyboardEvent) {
            //get value of input
            let value = this._input.value;

            if(e.which == 39) return;

            //let mimic try to find the nearest command
            let mimicCommand = this._findNearestCommand(value);
            this._inputMimic.value = mimicCommand;

            if(value == "") this._inputMimic.value = "";

            //if we pressed ctrl, toggle to the NEXT possible option
            if(e.which == 17) {
                this._ctrlPresses++;
                const nextCommand = this._findNextNearestCommand(this._input.value, this._ctrlPresses+1);
                if(nextCommand != "") this._inputMimic.value = nextCommand;
                else this._ctrlPresses = 0;
            }
        }
        private _onKeyReturn() {
            //see if we have a console item
            if(!this._commands.containsKey(this._input.value)) {
                //test the regexps
                const regs = this._commands.FullList.filter(comm => comm[0] instanceof RegExp);
                //see if our input matches a regular expression
                for(let reg of regs) {
                    const exp = reg[0] as RegExp;
                    if(exp.test(this._input.value)) {
                        const objs = this._input.value.split(" ");
                        //try an match the params to return
                        let args = new Array();
                        for(let i = 0; i < reg[1].params.length; i++) {
                            //get the value of the item at that point
                            args.push(objs[reg[1].params[i]]);
                        }

                        //send the function, with the params
                        reg[1].func(args);
                        break;
                    }
                }
            }
            //if we have a command item that is a straight string, just call it
            else {
                //call command
                const command = this._commands.getValue(this._input.value);
                command.func();
            }

            //if our previous index is not at the end of our commands, kill them
            if(this._prevIndex != -1)
                this._prevCommands.splice(this._prevIndex+1);

            //set as last command
            this._prevCommands.push(this._input.value);
            this._prevIndex = this._prevCommands.length;
            
            //clear console
            this._input.value = "";
            this._inputMimic.value = "";
            this._ctrlPresses = 0;
        }
        private async _onLastCommand() {
            if(this._prevIndex-1 < 0) {
                this._inputMimic.value = "";
                //set caret at end
                await wait(10);
                this._input.selectionStart = this._input.selectionEnd = this._input.value.length;
                return;
            }
            this._prevIndex--;
            //display last command
            this._input.value = this._prevCommands[this._prevIndex];
            this._inputMimic.value = "";
            //set caret at end
            await wait(10);
            this._input.selectionStart = this._input.selectionEnd = this._input.value.length;
        }
        private async _onNextCommand() {
            if(this._prevIndex + 1 > this._prevCommands.length-1) {
                this._input.value = "";
                this._inputMimic.value = "";
                this._prevIndex = this._prevCommands.length;
                return;
            }
            this._prevIndex++;
            //display last command
            this._input.value = this._prevCommands[this._prevIndex];
            this._inputMimic.value = "";
            await wait(10);
            //set caret at end
            this._input.selectionStart = this._input.selectionEnd = this._input.value.length;
        }
        private _onAutocomplete() {
            //fill in with placeholder value
            if(this._inputMimic.value == "") return;
            this._input.value = this._inputMimic.value;
            this._inputMimic.value = "";
        }
        /*---------------------------------------------- OVERRIDES -----------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Instance():Console { return Console._instance; }

    }
}