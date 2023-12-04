export const regularInputs = [
    'text', 'number', 'email', 'tel', 'checkbox', 'password',  // defaults
    'color' //'date' // probable migration to own custom-elements
  ] as const;

export type RegularInputs = typeof regularInputs[number];
export type DynamicInputType =
  RegularInputs | // regular inputs
  'textarea' |
  'select' | // regular select
  // custom
  'select-control' | // custom select
  'date'
  //'divider' // form divider, mark a new section with some label // removed
  ;



export interface IDynamicInputModel<T> {
  type: DynamicInputType;
  propertyId?: string;
  id?: string;
  name: string;
  placeholder?: string;
  //readonly?: boolean;
  disabled?: boolean;
  options?: ISelectOption[];
  class?: string;
  rows?: string;
  //elementAttributes?: { [key: string]: string };
  validation?: IValidateOptions;
  data?: T;
}

//export interface IDynamicInputModel {

//}

export interface ISelectOption {
  id: string | number;
  title: string;
}
export interface IValidateOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export interface ISelectOptionsProp {
  id: any;
  name: string;
}


export type CustomDynamicInputFunction = () => HTMLElement;
export interface ICustomDynamicInput {
  [key: string]: CustomDynamicInputFunction;
}