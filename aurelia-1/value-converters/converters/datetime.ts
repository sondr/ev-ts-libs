import { valueConverter } from 'aurelia-framework';
import { DateTime } from 'luxon';
import { IDateTimeValueConverterOptions, buildOptions, getDate, getDateTimeOptions, configure } from './datetime-config';


@valueConverter('datetime')
export class DatetimeValueConverter {
  toView = DatetimeValueConverter.convert;
  
  public static configure = configure;

  public static convert(date: string | Date, options?: IDateTimeValueConverterOptions) {
    options = buildOptions(options);
    const dtOptions = getDateTimeOptions(options);
    const dt = getDate(date, dtOptions);

    const type = options?.type?.toLowerCase();
    if(!type  || type == 'toformat'){
      return dt.toFormat(options!.format!);
    }

    if(type == 'torelative'){
      let base: DateTime | undefined = undefined;
      if(options.relativeBase){
        base = getDate(options.relativeBase, dtOptions);
      }
      return dt.toRelative({ base: base, round: false })
    }

    if(type == 'torelativecalendar'){
      let base: DateTime | undefined = undefined;
      if(options.relativeBase){
        base = getDate(options.relativeBase, dtOptions);
      }
      return dt.toRelativeCalendar({ base: base })
    }
  }
}