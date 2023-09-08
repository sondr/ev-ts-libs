import { addAttrs, removeAttrs } from "./element-attributer";
import { addClasses, removeClasses } from "./element-classer";
import { addStyles, removeStyles } from "./element-styler";

export class ElementManager implements IElementTogglerArgs {
  el?: HTMLElement;
  attrs: { [key: string]: string };
  css: Partial<CSSStyleDeclaration>;
  classes: string[];
  listeners: IElementTogglerListener[];
  data: any;

  public static create = (args: IElementTogglerArgs) => new ElementManager(args);
  private constructor(args: IElementTogglerArgs) { this.setProperties(args); }
  private setProperties(args: IElementTogglerArgs) {
    this.el = args.el;
    this.css = args.css ?? {};
    this.classes = args?.classes ?? [];
    this.attrs = args?.attrs ?? {};
    this.data = args?.data;
  }

  private get mutableProperties(): IElementTogglerArgs {
    return {
      attrs: this.attrs,
      classes: this.classes,
      css: this.css
    };
  };

  public get properties() {
    return {
      attrs: Object.assign({}, this.attrs ?? {}),
      classes: this.classes?.slice() ?? [],
      css: Object.assign({}, this.css ?? {}),
      listeners: this.listeners
    } as IElementTogglerArgs;
  }

  public setElement(el: HTMLElement, cleanPrevious: boolean = true) {
    if (cleanPrevious) { this.remove(); }
    this.el = el;
  }


  public apply(cb?: (args: IElementTogglerArgs) => void, cleanPrevious: boolean = true) {
    let current = this.mutableProperties;
    if (cb) { cb(current); }
    if (cleanPrevious) { this.remove(); }

    this.setProperties(current);

    return this
      .applyListeners()
      .applyClass()
      .applyCss()
      .applyAttrs();
  }

  public remove() {
    return this
      .removeListeners()
      .removeClass()
      .removeCss()
      .removeAttrs();
  }

  public dispose() {
    this.removeListeners();

    this.setProperties({
      el: undefined,
      attrs: {},
      classes: [],
      css: {},
      listeners: []
    });
  }

  private removeListeners() {
    removeEventListeners(this.el, this.listeners);
    return this;
  }
  private removeClass() {
    removeClasses(this.el, this.classes);
    return this;
  }
  private removeCss() {
    removeStyles(this.el, this.css);
    return this;
  }
  private removeAttrs() {
    removeAttrs(this.el, this.attrs);
    return this;
  }


  private applyListeners() {
    addEventListeners(this.el, this.listeners);
    return this;
  }
  private applyClass() {
    addClasses(this.el, this.classes);
    return this;
  }
  private applyCss() {
    addStyles(this.el, this.css);
    return this;
  }
  private applyAttrs() {
    addAttrs(this.el, this.attrs);
    return this;
  }



}

export function removeEventListeners(el?: HTMLElement, events?: IElementTogglerListener[]) {
  if (el && events?.length) {
    events.forEach(e => {
      el?.removeEventListener(e.key, e.event, e.options);
    });
  }
}
export function addEventListeners(el?: HTMLElement, events?: IElementTogglerListener[]) {
  if (el && events?.length) {
    events.forEach(e => el.addEventListener(e.key, e.event, e.options));
  }
}






export interface IElementTogglerArgs {
  el?: HTMLElement;
  attrs?: { [key: string]: string };
  css?: Partial<CSSStyleDeclaration>;
  classes?: string[];
  listeners?: IElementTogglerListener[];
  data?: any;
}

export interface IElementTogglerListener {
  key: string;
  event: <K extends keyof HTMLElementEventMap>(ev: HTMLElementEventMap[K]) => any;
  options?: boolean | AddEventListenerOptions;
}