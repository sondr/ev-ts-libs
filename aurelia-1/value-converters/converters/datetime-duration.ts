declare var require: any;

import { valueConverter } from 'aurelia-framework';
import TimeAgo, { FormatOptions } from 'javascript-time-ago';

function loadLocale(locale: string): any {
  switch (locale) {
    case 'en':
      return require('javascript-time-ago/locale/en');
    case 'nb':
      return require('javascript-time-ago/locale/nb');
    case 'sv':
      return require('javascript-time-ago/locale/sv');
    default:
      throw new Error(`Locale ${locale} is not supported.`);
  }
}

const en = loadLocale('en');
const nb = loadLocale('nb');
const sv = loadLocale('sv');

const localesModules = [en, nb, sv];

TimeAgo.addDefaultLocale(localesModules[0]);
localesModules.forEach(l => TimeAgo.addLocale(l));


@valueConverter('duration')
export class DurationValueConverter {
  private static isConfigured: boolean = false;
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

    this.isConfigured = true;
  };

  public static convert(date: string | Date, opts?: IDurationOptions) {
    DurationValueConverter.verifyConfig(opts);

    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      const ctr = DurationValueConverter.ctrs[opts?.locale ?? DurationValueConverter.defaultLocale];
      return ctr.format(parsedDate, opts as FormatOptions);
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }

  private static verifyConfig(opts?: IDurationOptions) {
    if (!this.isConfigured) {
      this.configure(opts);
    }
  }
}


interface IDurationOptions extends FormatOptions {
  locale?: string;
  base?: Date | string;
}
