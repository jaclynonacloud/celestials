namespace celestials {
    /**
     * Creates an HTMLImageElement of a file object once loaded.
     * @param file The file object to create the image from.
     * @param callback The function that will call when the image is loaded.
     */
    export function createImageFromFile(file:File, callback:Function) {
        //create an image element
        let img:HTMLImageElement = document.createElement("img");
        //create the reader for the file
        let reader:FileReader = new FileReader();
        //load handler
        reader.onload = e => 
        {
            img.onload = ev => callback(img);
            img.src = e.target.result;
        }

        //read
        reader.readAsDataURL(file);
    }


    /**
     * Clamps the number between the min/max.
     */
    export function clamp(value:number, min:number, max:number):number {
        return (value < min) ? min : (value > max) ? max : value;
    }


    /**Returns a random number within the specified range. */
    export function randomRange(min:number, max:number):number {
        return Math.random() * (max - min) + min;
    }
    /**Returns a random whole number within the specified range. */
    export function randomRangeInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**Fetches a json file and returns the results via a callback function. */
    export async function fetchJson(filename:string, callback:Function) {
        await fetch(filename)
            .then(blob => blob.json())
            .then(json => callback(json))
            .catch(e => console.log(`Could not get file from ${filename}\n${e}`));
    }

    /**Basic linear interpolation. */
    export function lerp(a:number, b:number, t:number) {
        return (b-a) * t + a;
    }


    /**Returns the max bounds of a node, including its children. */
    // export function maxBounds(node:HTMLElement) {
    //     const children = node.children;
    //     let maxWidth:number = (children[0] as HTMLElement).getBoundingClientRect().width;
    //     let maxHeight:number = (children[0] as HTMLElement).getBoundingClientRect().height;
    //     for(let i = 0; i < children.length; i++) {
    //         maxWidth = Math.max(maxWidth, (children[i] as HTMLElement).getBoundingClientRect().width);
    //         maxHeight = Math.max(maxHeight, (children[i] as HTMLElement).getBoundingClientRect().height);
    //     }
    //     return {x:maxWidth, y:maxHeight};
    // }


    /**
     * A key value pairing list.
     */
    export class Dictionary<K, V> {
        private _pairs:Array<[K,V]>;
        constructor() {
            this._pairs = new Array();
        }

        add(key:K, value:V) {
            this._pairs.push([key , value]);
        }

        remove(key:K)  {
            for(let i = 0; i < this._pairs.length; i++)
                if(this._pairs[i][0] == key) 
                    this._pairs.splice(i, 1);
        }


        getValue(key:K):V {
            for(let i = 0; i < this._pairs.length; i++)
                if(this._pairs[i][0] == key)
                    return this._pairs[i][1];
            return null;
        }

        setValue(key:K, value:V) {
            for(let i = 0; i < this._pairs.length; i++)
                if(this._pairs[i][0] == key)
                    this._pairs[i][1] = value;
        }


        containsKey(key:K):boolean {
            for(let i = 0; i < this._pairs.length; i++)
                if(this._pairs[i][0] == key) return true;
            return false;
        }

        containsValue(value:V):boolean {
            for(let i = 0; i < this._pairs.length; i++)
                if(this._pairs[i][1] == value) return true;
            return false;
        }

        get List():Array<V> {
            let list:Array<V> = new Array<V>();
            for(let i = 0; i < this._pairs.length; i++)
                list.push(this._pairs[i][1]);
            return list;
        }

        get FullList():Array<[K,V]> {
            return this._pairs;
        }
    }

    /**
     * Creates a rectangle object.
     */
    export class Rect {
        private _x:number;
        private _y:number;
        private _width:number;
        private _height:number;
        constructor(x:number, y:number, width:number, height:number) {
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
        }


        public reset() {
            this._x = 0;
            this._y = 0;
            this._width = 0;
            this._height = 0;
        }


        public toString():string {
            return `Rect(x:${this._x}, y:${this._y}, w:${this._width}, h:${this._height}`;
        }

        public set X(value:number) { this._x = value; }
        public set Y(value:number) { this._y = value; }
        public set Width(value:number) { this._width = value; }
        public set Height(value:number) { this._height = value; }

        public get X():number { return this._x; }
        public get Y():number { return this._y; }
        public get Width():number { return this._width; }
        public get Height():number { return this._height; }
        public get Left():number { return this._x; }
        public get Top():number { return this._y; }
        public get Right():number { return this._x + this._width; }
        public get Bottom():number { return this._y + this._height; }
        public get Center() { return { x:this._x + this._width / 2, y:this._y + this._height / 2 }; }

        public static get Empty():Rect { return new Rect(0, 0, 0, 0); }
    }




    /**
     * Use html2canvas to create a cropped image.
     * @param img 
     * @param x 
     * @param y 
     * @param w 
     * @param h 
     */
    export async function cropImage(img:HTMLImageElement, x:number, y:number, w:number, h:number, callback:Function) {
        //create a temp canvas
        let canvas = document.createElement("canvas");
        canvas.id = await `tempCanvas`;
        canvas.width = w;
        canvas.height = h;
        document.body.appendChild(canvas);
        //get the context
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, -x, -y);
        //create image
        let imgDiv = document.createElement("img");
        imgDiv.onload = () => callback(imgDiv);
        imgDiv.src = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        //destroy canvas
        canvas.remove();
        canvas = null;
    }


}