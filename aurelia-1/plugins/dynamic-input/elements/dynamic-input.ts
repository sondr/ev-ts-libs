import { nameof } from '../../../../core';
import { inject, bindable, bindingMode, inlineView, customElement, DOM, TemplatingEngine, View } from 'aurelia-framework';
import { CustomDynamicInputFunction, DynamicInputType, IDynamicInputModel, ISelectOption, regularInputs } from '../interfaces';
import { DynamicInputConfig } from '../element-creator-config';

const triggerBehaviors = {
  blur: " & updateTrigger:'blur'"
} as const;



@inlineView('<template></template>')
@customElement('dynamic-input')
//@containerless()
@inject(DOM.Element, TemplatingEngine, DynamicInputConfig)
export class CustomInput {
  private containerElement: HTMLElement;
  private _view: View;

  @bindable({ defaultBindingMode: bindingMode.oneTime }) inputModel: IDynamicInputModel<any>;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) model: {};
  @bindable overrideClass: '';
  @bindable({ defaultBindingMode: bindingMode.oneTime }) trigger?: string = triggerBehaviors.blur;


  // LIFECYCLE
  constructor(
    protected readonly parentElement: HTMLTemplateElement,
    protected readonly te: TemplatingEngine,
    protected readonly config: DynamicInputConfig
  ) { }

  bind() {
    if (this.inputModel && this.overrideClass) {
      this.inputModel.class = this.overrideClass;
    }
    this.buildHtml();
    this._view?.bind(this);
  }

  attached() {
    if (this.containerElement) {
      this.parentElement.appendChild(this.containerElement);
    }
    this._view?.attached();
  }

  unbind() {
    this._view?.unbind();
  }

  detached() {
    if (this.containerElement) {
      this.parentElement.removeChild(this.containerElement);
    }
    this._view?.detached();
  }
  // LIFECYCLE END



  buildHtml() {
    const type = this.inputModel?.type;

    if (!type) {
      return;
    }

    this.containerElement = this.createEl('div'); // DOM.createTemplateElement();

    // custom
    const customMethod = this.config?.find(type);
    if (customMethod) {
      this.attachCustomElement(customMethod);
    }

    // regular
    else if (this.isRegular) {
      this.attachInputElement();
    }

    else {

      // individuals
      switch (this.inputModel.type) {
        //case 'divider':
        //  this.attachDividerElement();
        //  break;

        case 'textarea':
          this.attachTextareaElement();
          break;

        case 'select':
          this.attachSelectElement();
          break;

      }
    }

    this._view = this.te.enhance({ element: this.containerElement, bindingContext: this });
    this._view?.created();
  }

  get isRegular() { return regularInputs.some(e => e == this.inputModel.type); }


  buildValueString(addTriggerBehavior: boolean = true) {
    let triggerBehavior = this.trigger ?? '';

    if (!this.inputModel.propertyId) {
      return '';
    }
    let vstring = this.inputModel.propertyId.split('.').reduce((current, next) => { return `${current}.${next}` },
      nameof<CustomInput>(e => e.model)
    );

    if (this.inputModel.validation?.required) {
      vstring = vstring + ' & validate';
    }

    if (addTriggerBehavior) {
      vstring = vstring + triggerBehavior;
    }

    return vstring;
  }

  setSharedBinds(el: HTMLElement) {
    el.setAttribute('id.bind', nameof<CustomInput>(e => e.inputModel.id));
    el.setAttribute('placeholder.bind', nameof<CustomInput>(e => e.inputModel.placeholder));
    el.setAttribute('class.bind', nameof<CustomInput>(e => e.inputModel.class));
    el.setAttribute('disabled.bind', nameof<CustomInput>(e => e.inputModel.disabled));

    if (this.inputModel.type == 'checkbox') {
      el.setAttribute('checked.two-way', this.buildValueString(false));
    } else {
      el.setAttribute('value.two-way', this.buildValueString());
    }
  }

  attachCustomElement(fn: CustomDynamicInputFunction) {
    const el = fn(this);
    this.containerElement.appendChild(el);
  }

  attachInputElement() {
    const el = this.createEl('input');

    this.setSharedBinds(el);
    el.setAttribute('type.bind', nameof<CustomInput>(e => e.inputModel.type));

    this.containerElement.appendChild(el);
  }

  attachTextareaElement() {
    const el = this.createEl('textarea');

    this.setSharedBinds(el);
    //el.setAttribute('readonly.bind', nameof<CustomInput>(e => e.inputModel.readonly));
    el.setAttribute('rows.bind', nameof<CustomInput>(e => e.inputModel.rows));

    this.containerElement.appendChild(el);
  }


  attachSelectElement() {
    const el = this.createEl('select');

    el.setAttribute('id.bind', nameof<CustomInput>(e => e.inputModel.id));
    el.setAttribute('class.bind', nameof<CustomInput>(e => e.inputModel.class));
    el.setAttribute('value.two-way', this.buildValueString());

    // placeholder option
    const placeholderOption = this.createEl('option');
    placeholderOption.setAttribute('if.bind', nameof<CustomInput>(e => e.inputModel.placeholder));
    placeholderOption.setAttribute('model.bind', 'null');
    placeholderOption.innerHTML = interpolateSyntax(nameof<CustomInput>(e => e.inputModel.placeholder));
    el.appendChild(placeholderOption);

    // options
    const options = this.createEl('option');
    options.setAttribute('repeat.for', `o of ${nameof<CustomInput>(e => e.inputModel.options)}`);
    options.setAttribute('model.bind', `o.${nameof<ISelectOption>(e => e.id)}`);
    options.innerHTML = interpolateSyntax(`o.${nameof<ISelectOption>(e => e.title)}`);



    el.appendChild(options);

    this.containerElement.appendChild(el);
  }

  createEl(tag: DynamicInputType | 'div' | 'option' | 'input') {
    return DOM.createElement(tag);
  }


}

function interpolateSyntax(txt: string) {
  return '${' + txt + '}';
}