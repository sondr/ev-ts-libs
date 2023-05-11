import { bindable, customAttribute, inject, DOM } from "aurelia-framework";
import { FileinputCall, IFileInputOptions } from "../../../../core/file/fileinput-call";


@customAttribute('au-fileinput')
@inject(DOM.Element, FileinputCall)
export class FileinputAttrComponent {
  @bindable opts: IFileInputOptions;
  @bindable submit: (files: FileList | null) => void;

  handleOnClick: (e: MouseEvent) => {};

  constructor(
    private el: HTMLElement,
    private fileInput: FileinputCall
  ) {

    this.handleOnClick = async (event) => {
      const files = await this.fileInput.call(this.opts);
      this.submit(files);
    }
  }

  attached() {
    this.el.addEventListener('click', this.handleOnClick);
  }

  detached() {
    this.el.removeEventListener('click', this.handleOnClick);
  }

}

