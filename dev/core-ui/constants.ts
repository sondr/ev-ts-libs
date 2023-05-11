import { ICoreUiActionClasses } from "./interfaces";

export module UiClassConsts {
  //export const uiClass = {}

  export const button: ICoreUiActionClasses = {
    base: 'btn e-btn',
    cancel: 'e-btn-cancel',
    option: 'e-btn-opt',
    optionElevated: 'e-btn-opt-alt',
    confirm: 'e-btn-confirm',
    delete: 'e-btn-delete',
  };
}

export enum CssProperty {
  backgroundColor = 'background-color',
  color = 'color',
  border = 'border'
}

export enum CoreColor {
  white = '#ffffff',
  black = '#000000',

  bkRed = '#D81F26',
  bkBlue = '#1F1955'
};
