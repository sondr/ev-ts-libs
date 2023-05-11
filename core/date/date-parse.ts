export type DateParseValues = 'today' | string | number | Date;

export function dateParse(value?: DateParseValues) {
    if (value == undefined) { return undefined; }

    if (value instanceof Date) {
        return value;
    }

    if (typeof value == 'string') {
        if (value.toLowerCase() == 'today') {
            return new Date();
        }

        let v = new Date(String(value));
        if (isValidDate(v)){
            return v;
        }
    }

    let number = Number.parseInt(String(value));
    if (Number.isInteger(number)) {
        const d = new Date()
        d.setDate(d.getDate() + number);
        return d;
    }

    return undefined;

}

function isValidDate(date: Date) {
    try {
        return Number.isInteger(date.getTime());
    } catch (e) {
        return false;
    }

}