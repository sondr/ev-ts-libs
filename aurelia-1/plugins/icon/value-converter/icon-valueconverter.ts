import { valueConverter } from "aurelia-framework";

const prefix = 'fa-';
const types = ['fa-solid', 'fa-regular'];
const fallback = 'exclamation';

@valueConverter('icon')
export class UiIconValueConverter {
  toView = UiIconValueConverter.convert;

  static convert(icon: string) {
    return UiIconValueConverter.convertToClassList(icon)?.join(' ') ?? '';
  }

  static convertToClassList(icon: string) {
    if (!icon) { icon = fallback; }
    let classes = icon.trim().split(' ').map(e => prefix + e);
    UiIconValueConverter.ensureType(classes);

    return classes;
  }

  static ensureType(classes: string[]) {
    const hasType = classes.some(e => types.some(t => t == e));
    if (hasType) { return; }

    classes.unshift(types[0]);
  }

}
