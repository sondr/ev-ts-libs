import { valueConverter } from 'aurelia-framework';
import { INumberFormatOptions } from '../interfaces';

const defaultOptions: INumberFormatOptions = {
  disabled: false,
  //spacing: 3,
  delimiter: '.'
};

@valueConverter('number-format')
export class NumberFormatValueConverter {
  toView(value: number, opts: INumberFormatOptions) {
    let options = Object.assign({}, defaultOptions, opts ?? {});
    let parts = (value || 0).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, options.delimiter!);

    return parts.join(",");
  }
}
