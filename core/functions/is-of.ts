type InstanceType = 'string' | 'number' | 'boolean' | 'bigint' | 'function' | 'symbol' | 'undefined' | Object | any;

export function isPrimitive(arg) {
    const type = typeof arg;
    return arg == null || (type != "object" && type != "function");
}
export function typeOf(obj) { return Object.getPrototypeOf(obj).constructor; }
export function instanceOf(obj: any, type: InstanceType) {
    if (isPrimitive(obj)) {
        return typeof obj === type;
    }

    const objType = typeOf(obj);
    return (
        // Allow native instanceof in case of Symbol.hasInstance
        obj instanceof type ||
        // Handle case where is of type type
        typeof obj === type ||
        // Handle general case
        type.isPrototypeOf(objType) ||
        // Handle special case where type.prototype acts as a
        // prototype of the object but its type isn't in the
        // prototype chain of the obj's type
        // OPTIONALLY remove this case if you don't want
        // primitives to be considered instances of Object
        type.prototype.isPrototypeOf(objType.prototype)
    );
}

export function isString(obj: any) { return typeof obj === 'string'; }
export function isNumber(obj: any) { return typeof obj === 'number'; }
export function isBool(obj: any) { return typeof obj === 'boolean'; }
export function isDate(obj: any) { return obj instanceof Date; }

