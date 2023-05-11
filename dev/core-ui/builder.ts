import { IColorComposition, IColorTheme, ICoreThemeComponent, ICoreUiActionColors } from "./interfaces";
import { CssProperty } from "./constants";
import { CssGenerator, CssPart } from "./css-generator";


export module ThemeBuilder {
  //export class Button implements ICoreThemeComponent {
  export class Button {


    public static readonly base = [
      'btn',
      'e-btn'
    ];
    public static readonly design = {
      'default': '',
      square: 'btn-app'
    };

    static get _selector() {
      return '';
    }

    //generateCssString(themepart: ICoreUiActionColors) {
    public static generateCssString(themepart: IColorTheme) {
      const defaultSelector = Button.base.join(".");
      const gen = CssGenerator.create(defaultSelector);

      // main button css
      //gen.appendPart({
      //  props: [
      //    ["", ""]
      //  ]
      //})
      // actions
      gen.appendPartsCustom(() => {
        const actionColors = themepart.styles.actions;
        const actionsparts = Object.keys(actionColors).map(key => {
          const value = themepart[key] as IColorComposition;

          return {
            sel: key,
            props: [
              [CssProperty.backgroundColor, value.primary],
              [CssProperty.color, value.accent],
              [CssProperty.border, value.border],
            ]
          } as CssPart;
        });
        return actionsparts;
      });
      // sizes

      return gen.cssString;
    };


  }

}

