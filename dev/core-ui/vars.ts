import { IColorComposition, IColorTheme } from "./interfaces";

//const lighmode: IColorTheme = {
//  name: 'light',
//  styles: {
//    layout: {
//      header: shorthandColorComp(),
//      nav: shorthandColorComp(),
//      content: shorthandColorComp(),
//      sidebar: shorthandColorComp(),
//      footer: shorthandColorComp(),
//    },
//    actions: {
//      //cancel: shorthandColorComp('#212529', CoreColor.white),
//      option: shorthandColorComp('#212529', '#f8f9fa'),
//      optionElevated: shorthandColorComp(CoreColor.white, '#6c757d'),
//      confirm: shorthandColorComp(CoreColor.white, '#343a40'),
//      delete: shorthandColorComp(CoreColor.bkRed, CoreColor.white)
//    },
//    feedback: {
//      info: shorthandColorComp('#0dcaf0', CoreColor.white), // lightblue
//      valid: shorthandColorComp('#198754', CoreColor.white), // green
//      warn: shorthandColorComp('#fff3cd', CoreColor.black), // yellow
//      error: shorthandColorComp(CoreColor.bkRed, CoreColor.white),
//    },
//    indicators: {
//      active: shorthandColorComp(),
//      disabled: shorthandColorComp(),
//    }
//  }
//};


//const darkModeTheme: ColorTheme = {};


//const shorthandColorComp = (color: string, backgroundColor: string, border?: string) => (<ColorComposition>{
//  color,
//  backgroundColor,
//  border
//});

function shorthandColorComp(primary: string, accent: string, border?: string) {
    return (<IColorComposition>{
        primary,
        accent,
        border
    });
}
