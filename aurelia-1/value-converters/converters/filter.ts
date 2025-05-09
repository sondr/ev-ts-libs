import { inject, OverrideContext, Parser, valueConverter } from 'aurelia-framework';
import { FilterMode, IFilterOptions } from '../interfaces';

const toMillis = (d: string | Date): number =>
    d instanceof Date ? d.getTime() : new Date(d).getTime();

const FILTER_MODES: IFilterMode = {
    // String
    'exact': { fn: (a: string, b: string) => a === b, stringify: true },
    'startsWith': { fn: (a: string, b: string) => a.startsWith(b), stringify: true },
    'endsWith': { fn: (a: string, b: string) => a.endsWith(b), stringify: true },
    'contains': { fn: (a: string, b: string) => a.indexOf(b) >= 0, stringify: true },

    // Numbers
    '>=': { fn: <T>(a: T, b: T) => a >= b, stringify: false },
    '>': { fn: <T>(a: T, b: T) => a > b, stringify: false },
    '<=': { fn: <T>(a: T, b: T) => a <= b, stringify: false },
    '<': { fn: <T>(a: T, b: T) => a < b, stringify: false },
    '==': { fn: <T>(a: T, b: T) => a == b, stringify: false },
    '===': { fn: <T>(a: T, b: T) => a == b, stringify: false },
    '!=': { fn: <T>(a: T, b: T) => a != b, stringify: false },

    // Arrays
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
    'date>=': {
        fn: (a: string | Date, b: string | Date) => {
          const t1 = toMillis(a);
          const t2 = toMillis(b);
          return t1 >= t2;
        },
        stringify: false
      },
      'date<': {
        fn: (a: string | Date, b: string | Date) => {
          const t1 = toMillis(a);
          const t2 = toMillis(b);
          return t1 < t2;
        },
        stringify: false
      }
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

        const FILTERMODE = FILTER_MODES[mode];

        if (FILTERMODE.isArray) {
            filteredArr = arr.filter(entry =>
                properties.some(p => FILTERMODE.fn(queries, entry[p])));
        }
        else {

            const stringify = FILTERMODE.stringify;
            const settingsFn = term => stringify ? String(term).toLowerCase() : term;

            const propExpressions = (Array.isArray(opts.props) ? opts.props : [opts.props]).map((p) => this.parser.parse(p)),
                terms = queries.map(query => stringify ? String(query).toLowerCase() : query);

            filteredArr = arr.filter((entry: any) =>
                propExpressions.some(propExp => {
                    const evaluated = propExp.evaluate({ bindingContext: entry, overrideContext: null as unknown as OverrideContext });
                    return terms.some(t =>
                        FILTERMODE.fn(settingsFn(evaluated), t)
                    );
                }));
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
