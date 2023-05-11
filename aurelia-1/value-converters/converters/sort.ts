import { valueConverter } from 'aurelia-framework';
import { ISortOptions } from '../interfaces';





@valueConverter('sort')
export class SortValueConverter {
    toView = SortValueConverter.sort;

    public static sort<T>(array: T[], opts: ISortOptions): T[] {
        const isValid = validate(array, opts);
        if (!isValid) {
            return array;
        }

        const key = opts.key!;
        const factor = opts.asc === true ? 1 : -1;

        const firstValue = array.find(e => e[key])?.[key];
        if (!firstValue) {
            return array;
        }

        let sorted;
        const sortType = findSortType(firstValue);

        switch (sortType) {
            case SortTypes.Date:
                try {
                    sorted = array.sort((a, b) => ((a[key] as Date).getTime() - (b[key] as Date).getTime()) * factor);
                } catch (e) { console.log(e); }
                break;
            case SortTypes.String:
                sorted = array.sort((a, b) => ((a[key] || "").localeCompare(b[key])) * factor)
                break;
            default:
                sorted = array.sort((a, b) => (a[key] - b[key]) * factor);
        }

        return sorted;
    }

}

function validate<T>(array: T[], opts: ISortOptions) {
    let isInvalid = !opts?.key ||
        !Array.isArray(array) ||
        array.length <= 1 ||
        !localeCompareSupport();

    return !isInvalid;
}

function localeCompareSupport(): boolean {
    try { 'a'.localeCompare('b',); } catch (e) { console.log("nosuppoert", e); return false; }
    return true;
}

function findSortType(obj) {
    if (obj instanceof Date && !Number.isNaN(obj)) {
        return SortTypes.Date;
    }
    if (typeof obj === 'string') {
        return SortTypes.String;
    }

    return null;
}

enum SortTypes {
    Date = 'date',
    String = 'string'
}
