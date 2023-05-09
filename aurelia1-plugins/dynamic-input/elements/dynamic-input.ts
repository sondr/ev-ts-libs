import { nameof } from '../../../common';
import { inject, bindable, bindingMode, inlineView, customElement, DOM, TemplatingEngine, View } from 'aurelia-framework';
import { DynamicInputType, IDynamicInputModel, ISelectOption, regularInputs } from '../interfaces';

const triggerBehaviors = {
  blur: " & updateTrigger:'blur'"
} as const;



@inlineView('<template></template>')
@customElement('dynamic-input')
//@containerless()
@inject(DOM.Element, TemplatingEngine)
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
    protected readonly te: TemplatingEngine
  ) { }

  bind() {
    if (this.inputModel && this.overrideClass) {
      this.inputModel.class = this.overrideClass;
    }
    this.buildHtml();
    this._view?.bind(this);
  }

  attached() {
    if (this.containerElement) { this.parentElement.appendChild(this.containerElement); }
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

    // regular
    if (this.isRegular) {
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


  valueBindString() {
    let triggerBehavior = this.trigger ?? '';

    //let vstring = this.inputModel.propertyId.split('.').reduce((current, next) => { return `${current}['${next}']` },
    //  nameof<CustomInput>(e => e.model)
    //);
    if (!this.inputModel.propertyId) {
      return '';
    }
    let vstring = this.inputModel.propertyId.split('.').reduce((current, next) => { return `${current}.${next}` },
      nameof<CustomInput>(e => e.model)
    );

    if (this.inputModel.validation?.required) {
      vstring = vstring + ' & validate';
    }

    return vstring + triggerBehavior;
  }

  attachInputElement() {
    const el = this.createEl('input');
    el.setAttribute('id.bind', nameof<CustomInput>(e => e.inputModel.id));
    el.setAttribute('type.bind', nameof<CustomInput>(e => e.inputModel.type));
    el.setAttribute('placeholder.bind', nameof<CustomInput>(e => e.inputModel.placeholder));
    el.setAttribute('class.bind', nameof<CustomInput>(e => e.inputModel.class));
    //el.setAttribute('readonly.bind', nameof<CustomInput>(e => e.inputModel.readonly));
    el.setAttribute('disabled.bind', nameof<CustomInput>(e => e.inputModel.disabled));
    el.setAttribute('value.bind', this.valueBindString());
    //if (this.inputModel.elementAttributes) {
    //  Object.keys()
    //}

    this.containerElement.appendChild(el);
  }

  attachTextareaElement() {
    const el = this.createEl('textarea');
    //el.setAttribute('type.bind', nameof<CustomInput>(e => e.model.type));
    el.setAttribute('id.bind', nameof<CustomInput>(e => e.inputModel.id));
    el.setAttribute('placeholder.bind', nameof<CustomInput>(e => e.inputModel.placeholder));
    el.setAttribute('class.bind', nameof<CustomInput>(e => e.inputModel.class));
    //el.setAttribute('readonly.bind', nameof<CustomInput>(e => e.inputModel.readonly));
    el.setAttribute('disabled.bind', nameof<CustomInput>(e => e.inputModel.disabled));
    el.setAttribute('rows.bind', nameof<CustomInput>(e => e.inputModel.rows));
    el.setAttribute('value.bind', this.valueBindString());


    this.containerElement.appendChild(el);
  }

  attachSelectElement() {
    const el = this.createEl('select');

    el.setAttribute('id.bind', nameof<CustomInput>(e => e.inputModel.id));
    el.setAttribute('class.bind', nameof<CustomInput>(e => e.inputModel.class));
    el.setAttribute('value.bind', this.valueBindString());

    // placeholder option
    const placeholderOption = this.createEl('option');
    placeholderOption.setAttribute('if.bind', nameof<CustomInput>(e => e.inputModel.placeholder));
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

  //attachDividerElement() {
  //  const el = this.createEl('div');
  //  el.setAttribute('class.bind', nameof<CustomInput>(e => e.inputModel.class));
  //  el.innerHTML = interpolateSyntax(nameof<CustomInput>(e => e.inputModel.name));

  //  this.containerElement.appendChild(el);
  //}


  createEl(tag: DynamicInputType | 'div' | 'option' | 'input') {
    return DOM.createElement(tag);
  }


}

function interpolateSyntax(txt: string) {
  return '${' + txt + '}';
}