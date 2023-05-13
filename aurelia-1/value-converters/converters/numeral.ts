import { valueConverter } from 'aurelia-framework';
import * as numeral from 'numeral';

type NumLocals = 'nb' | 'se';

numeral.register('locale', 'nb' as NumLocals, {
  delimiters: {
    thousands: ' ',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  ordinal: function (number) {
    return number === 1 ? 'e' : 'er';
  },
  currency: {
    symbol: 'NOK'
  }
});

numeral.register('locale', 'se' as NumLocals, {
  delimiters: {
    thousands: ' ',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'mn',
    billion: 'md',
    trillion: 'bn'
  },
  ordinal: function (number) {
    var a = Math.abs(number) % 10,
      b = Math.abs(number) % 100;
    if ((a === 1 || a === 2) && (b !== 11 && b !== 12)) {
      return ':a';
    }
    return ':e';
  },
  currency: {
    symbol: 'SEK'
  }
});


@valueConverter('numeral')
export class numberformatValueConverter {
  toView(value, format, locale: NumLocals = 'nb') {
    numeral.locale(locale);
    return numeral(value).format(format);
  }
}
