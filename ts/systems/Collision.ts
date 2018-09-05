namespace celestials.systems {
    import Entity = entities.Entity;

    export interface ICollisionObject {
        entity:Entity;
        rect:Rect;
        visual:HTMLElement;
        isOverlapping:boolean;
    }

    export class Collision implements ILoadable {
        public static COLLISION_SIZE:number = 50;
        private static _instance:Collision;
        private _objects:ICollisionObject[];
        private _usesCollision:boolean;
        private _showCollisionBounds:boolean;

        constructor() {
            Collision._instance = this;
            this._objects = new Array();
            this._usesCollision = true;
            this._showCollisionBounds = true;
        }
        /*---------------------------------------------- METHODS -------------------------------------*/
        public static addToCollisionSystem(entity:Entity) {
            //give the entity a collision rect
            let rect:Rect = entity.Bounds;
            //create a visual element
            let visual:HTMLElement = document.createElement("div");
            visual.classList.add("collision");
            // entity.Node.appendChild(visual);
            App.Node.appendChild(visual);
            //add to system
            Collision._instance._objects.push({entity, rect, visual, isOverlapping:false});
        }

        // public static hasOverlap(a:ICollisionObject, b:ICollisionObject) {
        //     // if(a.rect.Left >= b.rect.Right || b.rect.Left >= a.rect.Right) return false;
        //     // if(a.rect.Top >= b.rect.Bottom || b.rect.Top >= a.rect.Bottom) return false;

        //     // return true;
        //     const onLeft = a.rect.Right < b.rect.Left;
        //     const onRight = a.rect.Left > b.rect.Right;
        //     const onTop = a.rect.Top > b.rect.Bottom;
        //     const onBottom = a.rect.Bottom < b.rect.Top;
        //     return !(onLeft || onRight || onTop || onBottom);
        // }

        public static showCollisionBounds(show:boolean) {
            Collision._instance._showCollisionBounds = show;
            for(let obj of Collision._instance._objects) {
                if(show) obj.visual.classList.remove("hide");
                else obj.visual.classList.add("hide");
            }
        }

        public static getCollisionObject(entity:entities.Entity) {
            for(let i = 0; i < Collision._instance._objects.length; i++)
                if(Collision._instance._objects[i].entity == entity)
                    return Collision._instance._objects[i];
            return null;
        }

        public static checkCollision(colObj:ICollisionObject):entities.Entity {
            if(!Collision._instance._usesCollision) return null;
            for(let obj of Collision._instance._objects) {
                if(obj.entity == colObj.entity) continue;
                if(Math.abs(obj.entity.X - colObj.entity.X) > 200) continue;
                if(Math.abs(obj.entity.Y - colObj.entity.Y) > 200) continue;
                if(Collision._instance._isColliding(obj.rect, colObj.rect))
                    return obj.entity;
            }
            return null;
        }

        private _isColliding(a:Rect, b:Rect) {
            return !(
                ((a.Y + a.Height) < (b.X)) ||
                (a.Y > (b.Y + b.Height)) ||
                ((a.X + a.Width) < b.X) ||
                (a.X > (b.X + b.Width))
            );
        }
        /*---------------------------------------------- ABSTRACTS -----------------------------------*/
        /*---------------------------------------------- INTERFACES ----------------------------------*/
        /*---------------------------------------------- EVENTS --------------------------------------*/
        /*---------------------------------------------- OVERRIDES -----------------------------------*/
        public load() {

        }
        public unload() {

        }

        public static update() {
            if(!Collision._instance._usesCollision) return;

            // //get the bounds
            // let colSize = Collision.COLLISION_SIZE;
            // for(let obj of Collision._instance._objects) {
            //     let bounds = obj.entity.MainImage.getBoundingClientRect();
            //     // obj.rect = new Rect(
            //     //     bounds.left - colSize,
            //     //     bounds.top - colSize,
            //     //     bounds.width + (colSize * 2),
            //     //     bounds.height + (colSize * 2)
            //     // );
            //     obj.rect = new Rect(
            //         (obj.entity.Direction.x < 0) ? (bounds.left - colSize) : (bounds.left + bounds.width + colSize),
            //         bounds.top + (bounds.height/2),
            //         5,
            //         5
            //     );

            //     if(Collision._instance._showCollisionBounds) {
            //         //update the visual
            //         obj.visual.style.left = `${obj.rect.X}px`;
            //         obj.visual.style.top = `${obj.rect.Y}px`;
            //         // obj.visual.style.width = `${obj.rect.Width}px`;
            //         // obj.visual.style.height = `${obj.rect.Height}px`;
            //     }
            // }

            //get the bounds
            let colSize = Collision.COLLISION_SIZE;
            for(let obj of Collision._instance._objects) {
                let bounds = obj.entity.MainImage.getBoundingClientRect();
                obj.rect = new Rect(
                    bounds.left - colSize,
                    bounds.top - colSize,
                    bounds.width + (colSize * 2),
                    bounds.height + (colSize * 2)
                );

                if(Collision._instance._showCollisionBounds) {
                    //update the visual
                    obj.visual.style.left = `${obj.rect.X}px`;
                    obj.visual.style.top = `${obj.rect.Y}px`;
                    obj.visual.style.width = `${obj.rect.Width}px`;
                    obj.visual.style.height = `${obj.rect.Height}px`;
                }
            }

            // //once the collision sizes are set, if the rect overlaps with any other collider, call the pair of collider's callbacks
            // for(let obj of Collision._instance._objects) {
            //     let isOverlapping = false;
            //     for(let compObj of Collision._instance._objects) {
            //         if(this.hasOverlap(obj, compObj)) {
            //             if(obj == compObj) continue;
            //             isOverlapping = true;
            //             if(!obj.isOverlapping) {
            //                 console.log("WE ARE OVERLAPPING: " + obj.entity.Name + ", " + compObj.entity.Name);
            //                 if(obj.collisionCallback != null) {
            //                     obj.collisionCallback(compObj.entity);
            //                 }
            //             }
            //         }
            //     }
            //     obj.isOverlapping = isOverlapping;
            // }
        }
        /*---------------------------------------------- GETS & SETS ---------------------------------*/
    }
}