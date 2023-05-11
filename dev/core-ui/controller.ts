import { UiClassConsts } from './constants';
import { CoreUiVars, IColorTheme } from './interfaces';
import { CssGenerator } from './css-generator';

const preId = 'ev-ss-';
export class CoreUiController {
  private vars: CoreUiVars;
  private stylesheet: IStyleSheet;

  constructor() {

  }


  public get themeNames() {
    return this.vars.colorThemes?.map(e => e.name);
  }
  public setTheme(themeName: string) {
    const theme = this.vars.colorThemes.find(e => e.name == themeName);
    this.buildStylesheet(theme!);
  }



  private buildStylesheet(theme: IColorTheme) {

    
    const cssGen = new CssGenerator();

    //cssGen.
  }




}



function buildButtonDesign() {
  const ss = document.styleSheets.item(0);

}

interface IStyleSheet {
  id: string;
  stylesheet: HTMLStyleElement;
}
