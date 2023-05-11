export function trimStrings(obj: Object) {
    Object.keys(obj).forEach(key => {
        if (!obj[key]) {
            return;
        }

        if (typeof obj[key] === 'string') {
            obj[key] = (obj[key] as string).trim();
        }
        else if (typeof obj[key] === 'object') {
            trimStrings(obj[key]);
        }
    });
}