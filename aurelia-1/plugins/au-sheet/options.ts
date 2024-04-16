import { IAuSheetOptions } from "./interfaces";

const options = {
    autoClose: {
        overlay: false,
        //confirm: false,
        //cancel: false
    },
    showFooter: false,
    zIndex: 1000,
    showDragHandle: true
} as IAuSheetOptions;

export function setOptions(cb?: (opts: IAuSheetOptions) => void) {
    if (cb) {
        cb(options);
    }
}

export function getDefaultOptions() {
    return JSON.parse(JSON.stringify(options));
}