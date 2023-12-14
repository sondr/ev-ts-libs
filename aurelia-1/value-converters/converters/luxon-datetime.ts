import { valueConverter } from 'aurelia-framework';
import { DateTime, DateTimeOptions, Zone } from 'luxon';
import { IDateTimeValueConverterConfig } from '../interfaces';

const config: IDateTimeValueConverterOptions = {
  defaultFormat: 'dd. LL yyyy',
  locale: undefined,
};

export function setConfig(cb: (config: IDateTimeValueConverterOptions) => void) {
  cb(this.config);
}

export function getDate(date: string | Date, opts?: DateTimeOptions) {
  opts = opts ?? {};
  if (!opts.locale) { opts.locale = config.locale; }
  if (!opts.zone) { opts.zone = config.zone; }

  return typeof date === 'string' ?
    DateTime.fromISO(date, opts) :
    DateTime.fromJSDate(date, opts);
}

function buildOptions(opts?: IDateTimeValueConverterOptions) {
  const options = Object.assign({}, config, opts ?? {});

  if (!options.format) { options.format = config.format ?? config.defaultFormat; }
  if (!options.defaultFormat) { options.format; }
  

  return options;
}

function getDateTimeOptions(opts?: IDateTimeValueConverterOptions) {
  return {
    locale: opts?.format ?? opts?.defaultFormat ?? config.format ?? config.defaultFormat,
    zone: opts?.zone ?? config.zone
  } as DateTimeOptions;
}

interface IDateTimeValueConverterOptions extends IDateTimeValueConverterConfig {
  format?: string;
  type?: 'toFormat' | 'toRelative' | 'relativeToCalendar';
  relativeBase?: string | Date;
  zone?: string | Zone | undefined;
}

// usage: | DateTime : 'dd.LL.yyyy'
@valueConverter('datetime')
export class DatetimeValueConverter {
  toView = DatetimeValueConverter.convert;

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
      return dt.toRelative({ base: base })
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