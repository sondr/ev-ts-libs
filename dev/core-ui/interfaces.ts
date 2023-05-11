export type ColorThemeType = 'light' | 'dark'; // | 'colorful';

export interface CoreUiVars {
  defaultColorTheme: ColorThemeType;
  colorThemes: IColorTheme[];
}

export interface IColorTheme {
  name: string;
  baseTheme?: ColorThemeType;
  styles: ICoreUiDesignColors;
}


export interface ICoreUiDesignColors {
  layout: ICoreUiLayoutColors;
  indicators: ICoreUiIndicatorColors;
  actions: ICoreUiActionColors;
  feedback: ICoreUiFeedbackColors;

  //containers
  //headers
}


export interface ICoreUiIndicatorColors {
  active: IColorComposition;
  disabled: IColorComposition;
}

export interface ICoreUiLayoutColors {
  header: IColorComposition;
  nav: IColorComposition;
  sidebar: IColorComposition;
  content: IColorComposition;
  footer: IColorComposition;
}

export interface ICoreUiFeedbackColors {
  info: IColorComposition;
  warn: IColorComposition;
  error: IColorComposition;
  valid: IColorComposition;
}


interface ICoreUiAction<T> {
  option: T;
  optionElevated: T;
  cancel: T;
  confirm: T;
  delete: T;
}
export interface ICoreUiActionColors extends ICoreUiAction<IColorComposition> {}
export interface ICoreUiActionClasses extends ICoreUiAction<string> {
  base: string;
}


export interface IColorComposition {
  primary: string;
  accent: string;
  border?: string;
};

export interface ICoreThemeComponent {
  //static readonly base: string[];
  //static readonly generateCssString: (themepart: IColorTheme) => string;
}


