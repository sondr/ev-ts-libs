import { valueConverter } from 'aurelia-framework';
import { ISkipTakeOptions } from '../interfaces';



@valueConverter('skip-take')
export class SkipTakeValueConverter {
    toView(array: any[], opts: ISkipTakeOptions) {
        const valid = validate(array, opts);
        if (!valid) {
            return array;
        }

        let take = opts.take;
        let skip = opts.page >= 0 ? (opts.page * opts.take) : opts.skip ?? 0;

        return array.slice(skip, skip + take);
    }

}

function validate(array: any[], opts: ISkipTakeOptions) {
    let invalid = opts?.disabled ||
        !Array.isArray(array) ||
        !(opts?.take >= 0) ||
        !(opts?.page >= 0 || opts?.skip! >= 0);


    return !invalid;
};