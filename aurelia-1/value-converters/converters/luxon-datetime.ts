import { valueConverter } from 'aurelia-framework';
import { DateTime, DateTimeOptions } from 'luxon';


// usage: | DateTime : 'dd.LL.yyyy'
@valueConverter('datetime')
export class DatetimeValueConverter {
    toView = DatetimeValueConverter.convert;

    public static convert(date: string | Date, format: string = 'dd.LL.yyyy', locale?: string) {
        let opts: DateTimeOptions = {};
        if (locale) { opts.locale = locale; }

        let dt = typeof date === 'string' ?
            DateTime.fromISO(date, opts) :
            DateTime.fromJSDate(date, opts);

        return dt.toFormat(format);
    }
}
