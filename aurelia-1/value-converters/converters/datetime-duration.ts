import { valueConverter } from 'aurelia-framework';
import TimeAgo, { FormatOptions } from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en';
import nb from 'javascript-time-ago/locale/nb';
import sv from 'javascript-time-ago/locale/sv';

const localesModules = [en, nb, sv];

TimeAgo.addDefaultLocale(localesModules[0]);
localesModules.forEach(l => TimeAgo.addLocale(l));


@valueConverter('duration')
export class DurationValueConverter {
  private static defaultLocale: string;
  private static opts: IDurationOptions;
  private static ctrs: { [name: string]: TimeAgo };

  public toView = DurationValueConverter.convert;
  
  public static configure(opts?: IDurationOptions) {
    opts = Object.assign({}, opts ?? {});
    DurationValueConverter.defaultLocale = opts?.locale ?? 'en';
    DurationValueConverter.opts = opts;

    DurationValueConverter.ctrs = {};
    localesModules.forEach(l => {
      const locale = l.locale;
      DurationValueConverter.ctrs[locale] = new TimeAgo(locale);
    });
  };

  public static convert(date: string | Date, opts?: IDurationOptions) {
    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      const ctr = DurationValueConverter.ctrs[opts?.locale ?? DurationValueConverter.defaultLocale];
      return ctr.format(parsedDate, opts as FormatOptions);
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }
}


interface IDurationOptions extends FormatOptions {
  locale?: string;
  base?: Date | string;
}
