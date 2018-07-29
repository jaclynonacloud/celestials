namespace celestials {
    export interface IUpdateable {
        update();
    }
    
    export interface ICloneable<T> {
        clone():T;
    }

    export interface IPoint {
        x?:number;
        y?:number;
    }
}