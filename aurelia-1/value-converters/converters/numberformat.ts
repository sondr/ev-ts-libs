import { valueConverter } from 'aurelia-framework';
import { INumberFormatOptions } from '../interfaces';

// const defaultOptions: INumberFormatOptions = {

// };

@valueConverter('numberformat')
export class NumberFormatValueConverter {
  toView = NumberFormatValueConverter.convert;

  public static readonly config: INumberFormatOptions = {
    disabled: false,
    //spacing: 3,
    delimiter: ' '
  }

  public static setConfig(cb: (config: INumberFormatOptions) => void) {
    cb(this.config);
  }


  public static convert(value: number, opts: INumberFormatOptions) {
    let options = Object.assign({}, NumberFormatValueConverter.config, opts ?? {});
    let parts = (value || 0).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, options.delimiter!);

    return parts.join(",");
  }
}
