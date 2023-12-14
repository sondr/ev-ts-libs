import { DateTime, DateTimeOptions, Zone } from 'luxon';
import { IDateTimeValueConverterConfig } from '../interfaces';

const defaultConfig: IDateTimeValueConverterOptions = {
  defaultFormat: 'dd. LL yyyy'
};

export function configure(cb: (config: IDateTimeValueConverterOptions) => void) {
  cb(defaultConfig);
}

export function getDate(date: string | Date, opts?: DateTimeOptions) {
  opts = opts ?? {};
  if (!opts.locale) { opts.locale = defaultConfig.locale; }
  if (!opts.zone) { opts.zone = defaultConfig.zone; }
  
  return typeof date === 'string' ?
    DateTime.fromISO(date, opts) :
    DateTime.fromJSDate(date, opts);
}

export function buildOptions(opts?: IDateTimeValueConverterOptions) {
  const options = Object.assign({}, defaultConfig, opts ?? {});

  if (!options.format) { options.format = defaultConfig.format ?? defaultConfig.defaultFormat; }
  if (!options.defaultFormat) { options.format; }
  

  return options;
}

export function getDateTimeOptions(opts?: IDateTimeValueConverterOptions) {
  return {
    locale: opts?.locale ?? defaultConfig.locale,
    zone: opts?.zone ?? defaultConfig.zone
  } as DateTimeOptions;
}

export interface IDateTimeValueConverterOptions extends IDateTimeValueConverterConfig {
  format?: string;
  type?: 'toFormat' | 'toRelative' | 'relativeToCalendar';
  relativeBase?: string | Date;
  zone?: string | Zone | undefined;
}
