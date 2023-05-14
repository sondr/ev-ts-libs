import { inject, OverrideContext, Parser, valueConverter } from 'aurelia-framework';
import { FilterMode, IFilterOptions } from '../interfaces';

const FILTER_MODES: IFilterMode = {
    'exact': { fn: (a: string, b: string) => a === b, stringify: true },
    'startsWith': { fn: (a: string, b: string) => a.startsWith(b), stringify: true },
    'endsWith': { fn: (a: string, b: string) => a.endsWith(b), stringify: true },
    'contains': { fn: (a: string, b: string) => a.indexOf(b) >= 0, stringify: true },
    '>=': { fn: (a: string, b: string) => a >= b, stringify: true },
    '>': { fn: (a: string, b: string) => a > b, stringify: true },
    '<=': { fn: (a: string, b: string) => a <= b, stringify: true },
    '<': { fn: (a: string, b: string) => a < b, stringify: true },
    '==': { fn: (a: string, b: string) => a == b, stringify: true },
    '===': { fn: (a: any, b: any) => a == b, stringify: false },
    '!=': { fn: (a: string, b: string) => a != b, stringify: false },

    // Expects b as array as well
    'Array.some': {
        fn: (a: string[], b: string[]) => (a || []).some(x => b.includes(x)),
        stringify: false,
        isArray: true
    },
    '!Array.some': {
        fn: (a: string[], b: string[]) => !(a || []).some(x => b.includes(x)),
        stringify: false,
        isArray: true
    },

    'Array.includes': {
        fn: (a: string[], b: string) => (a || []).includes(b),
        stringify: false,
        isArray: true
    },
    '!Array.includes': {
        fn: (a: string[], b: string) => !(a || []).includes(b),
        stringify: false,
        isArray: true
    },
};





@valueConverter('filter')
@inject(Parser)
export class FilterValueConverter {
    constructor(
        private readonly parser: Parser
    ) { }

    toView(arr: any, opts: IFilterOptions) {
        const isValid = validate(arr, opts);
        if (!isValid) {
            const takeIsPositiveInteger = opts?.take && opts.take > 0;

            return takeIsPositiveInteger ?
                arr.slice(0, opts.take) :
                arr;
        }

        const mode: FilterMode = (opts.mode && FILTER_MODES[opts.mode]) ? opts.mode : 'contains';

        let queries = Array.isArray(opts.q) ? opts.q : [opts.q];
        const properties = (Array.isArray(opts.props) ? opts.props : [opts.props]);

        let filteredArr: any[];

        const m = FILTER_MODES[mode];

        if (m.isArray) {
            filteredArr = arr.filter(entry =>
                properties.some(p => m.fn(queries, entry[p])));
        }
        else {

            const stringify = FILTER_MODES[mode].stringify;
            const settingsFn = term => stringify ? String(term).toLowerCase() : term;

            const propExpressions = (Array.isArray(opts.props) ? opts.props : [opts.props]).map((p) => this.parser.parse(p)),
                terms = queries.map(query => stringify ? String(query).toLowerCase() : query);

            filteredArr = arr.filter((entry: any) =>
                propExpressions.some((propExp) =>
                    terms.some(t =>
                        //FILTER_MODES[mode].fn(settingsFn(propExp.evaluate({ bindingContext: entry, overrideContext: null })), t)
                        FILTER_MODES[mode].fn(settingsFn(propExp.evaluate({ bindingContext: entry, overrideContext: null as unknown as OverrideContext })), t)
                    )));
        }

        return opts.take && typeof opts.take === 'number' ?
            filteredArr.slice(0, opts.take) :
            filteredArr;
    }
}


function validate(arr: any, opts: IFilterOptions) {
    let minLength = opts.minLength || 0;
    let isInvalid = opts?.disabled ||
        !Array.isArray(arr) ||
        !opts?.q ||
        ((opts.q || '').length < minLength);

    return !isInvalid;
};


// export interface ISearchMode {
//     name: string;
//     mode: FilterMode;
//     metaint: number;
// }

interface IFilterMode {
    [key: string]: {
        //fn: (a: string | string[], b: string | string[]) => boolean;
        fn: (a: string | string[] | any, b: string | string[] | any) => boolean;
        stringify: boolean;
        isArray?: boolean;
    }
}
