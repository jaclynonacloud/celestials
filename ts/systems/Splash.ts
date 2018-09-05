namespace celestials.systems {
    export class Splash {
        private static _instance:Splash;
        private _node:HTMLElement;
        private _progress:HTMLElement;
        private _loaderElement:HTMLElement;
        private _loadedElement:HTMLElement;

        private _tasks:any[];
        
        constructor(node:HTMLElement, progress?:HTMLElement, loadedElement?:HTMLElement) {
            Splash._instance = this;
            this._node = node;
            this._progress = progress || this._node.querySelector(".progress");
            this._loaderElement = this._node.querySelector(".loader");
            this._loadedElement = loadedElement || this._node.querySelector(".loaded");
            
            this._tasks = new Array();

            this.open();
        }

        /*---------------------------------------------- METHODS -------------------------------------*/
        public open() {
            this._progress.innerHTML = '0%';
            this._node.classList.remove("hide");
            this._loadedElement.classList.add("hide");
            this._loaderElement.classList.add("hide");
        }
        /**Shows the splash screen until the user clicks. */
        public openStatic() {
            this.open();
            let clickEvent = (e:MouseEvent) => {
                if(e.button == 0) {
                    this.close();
                    this._node.classList.remove("temp-cursor");
                    this._node.removeEventListener("mouseup", clickEvent);
                }
            };
            this._node.classList.add("temp-cursor");
            this._node.addEventListener("mouseup", clickEvent);
        }
        public close() {
            this._node.classList.add("hide");
        }

        public setProgress(value:number) {
            this._progress.innerHTML = `${value.toFixed(2)}%`;
        }

        public setTasks(tasks:any[]) {
            this._tasks = tasks;
        }

        public async startTasks() {
            return await new Promise(async(resolve, reject) => {

                this._loaderElement.classList.add("hide");
                await wait(1000);
                this._loaderElement.classList.remove("hide");
                //load each task
                for(let i = 0; i < this._tasks.length; i++) {
                    await new Promise(async(res, rej) => {

                        console.log(`LOADING ${i} of ${this._tasks.length}`);
                        const task = this._tasks[i];
                        //load the task
                        await task();
                        //set new progress
                        this.setProgress(((i+1) / this._tasks.length) * 100);

                        res();
                        return;

                    });
                    
                }

                this.setProgress(100);

                //loaded!
                console.log("LOADING APPLICATION");
                this._loadedElement.classList.remove("hide");
                await wait(2000);

                resolve();

            });           
    
        }

        /**Runs the tasks without showing the splash screen. */
        public async autoStartTasks() {
            this.close();

            return await new Promise(async(resolve, reject) => {

                //load each task
                for(let i = 0; i < this._tasks.length; i++) {
                    await new Promise(async(res, rej) => {
                        const task = this._tasks[i];
                        //load the task
                        await task();
                        //set new progress
                        this.setProgress(((i+1) / this._tasks.length) * 100);

                        res();
                    });
                    
                }

                resolve();
            });           
        }

        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- OVERRIDES -----------------------------------*/
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
        public static get Instance():Splash { return Splash._instance; }

    }
}