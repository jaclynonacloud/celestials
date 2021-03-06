namespace celestials {
    export interface ILoadable {
        load();
        unload();
    }
    export interface IUpdateable {
        update();
    }
    export interface IPauseable {
        resume();
        pause();
    }
    
    export interface ICloneable<T> {
        clone():T;
    }

    export interface IPoint {
        x?:number;
        y?:number;
    }
}