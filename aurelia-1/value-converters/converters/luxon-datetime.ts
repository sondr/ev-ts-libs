import { valueConverter } from 'aurelia-framework';
import { DateTime, DateTimeOptions } from 'luxon';
import { IDateTimeValueConverterConfig } from '../interfaces';


// usage: | DateTime : 'dd.LL.yyyy'
@valueConverter('datetime')
export class DatetimeValueConverter {
    toView = DatetimeValueConverter.convert;


    public static readonly config: IDateTimeValueConverterConfig = {
        defaultFormat: 'dd. LL yyyy',
        locale: undefined
      }
      
      public static setConfig(cb: (config: IDateTimeValueConverterConfig) => void) {
        cb(this.config);
      }

      

      public static convert(date: string | Date, format?: string, locale?: string) {
        if (!format) {
          format = DatetimeValueConverter.config.defaultFormat;
        }
        if (!locale) {
          locale = DatetimeValueConverter.config.locale;
        }

        let opts: DateTimeOptions = {};
        if (locale) { opts.locale = locale; }

        let dt = typeof date === 'string' ?
            DateTime.fromISO(date, opts) :
            DateTime.fromJSDate(date, opts);

        return dt.toFormat(format);
    }
}

