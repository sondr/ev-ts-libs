import { _PLATFORM } from './../platform';
import { dynCssVariables, IcGElementStyleObject } from '../interfaces';
import { createElement, loadResource } from './utils';

const prependText: string = "cg-dyn";

export class DynamicStyle {
    private disposed: boolean;
    public counter: number = 1;
    public styleSheet?: HTMLStyleElement;
    public variables: dynCssVariables[] = [];
    private attached: boolean = false;

    constructor() {
        this.styleSheet = createElement({
            elementTagOrElement: 'style',
            attr: [
                ['type', 'text/css'],
                ['rel', 'stylesheet']
            ]
        }) as HTMLStyleElement;
        this.disposed = false;
    }

    public get isDisposed(){
        return this.disposed;
    }

    public appendStyle(styles: IcGElementStyleObject): string | undefined {
        if (!styles) return undefined;
        const name = prependText + this.counter++;
        if (!styles.values) styles.values = [];
        if (!styles.childValues) styles.childValues = [];

        this.variables.push({
            id: name,
            value: styles.values.filter(s => s.length === 2).map(s => `${s[0]}:${s[1].replace(';', '') + '!important;'}`).join(' '),
            childValues: styles.childValues!.filter(e => e.id && e.values && e.values.length > 0).map(child => {
                return <dynCssVariables>{
                    id: typeof child.id === 'string' ? `${name}${child.id}` : child.id!.map(c => `${name}${c}`).join(', .'),
                    value: child.values!.filter(e => e.length === 2).map(v => `${v[0]}:${v[1].replace(';', '') + '!important;'}`).join(' ')
                };
            })
        });

        return name;
    }

    public overWriteStyle(selector: string, styles: string[][]) {

    }

    public findStyle(classString: string) {

    }

    public buildSheet() {
        let sheetText = this.variables.map(v => {
            let s = '';
            if (v.childValues && v.childValues.length > 0)
                s = v.childValues.map(c => ` .${c.id}{${c.value}}`).join(' ');
            return `.${v.id}{${v.value}}${s}`;
        }).join(' ');
        this.styleSheet!.innerText = sheetText;

        if (!this.attached)
            this.attachStylesheet();
    }


    attachStylesheet() {
        if (this.styleSheet)
            this.attached = !!loadResource(this.styleSheet);
    }

    dispose() {
        if (this.styleSheet && this.styleSheet.parentElement)
            this.styleSheet.parentElement.removeChild(this.styleSheet);
            //_PLATFORM.DOM.head.removeChild(this.styleSheet);
        this.styleSheet = undefined;
        this.disposed = true;
    }
}