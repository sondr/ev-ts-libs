import { valueConverter } from 'aurelia-framework';

@valueConverter('join')
export class JoinValueConverter {
  toView(arr: string[], seperator: string = ', ') {
    return arr?.join(seperator);
  }
}
