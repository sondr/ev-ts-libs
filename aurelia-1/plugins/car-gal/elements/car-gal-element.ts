import { ICargalImg } from '../interfaces';
import { bindable, customElement, PLATFORM, DOM } from 'aurelia-framework';
import { CarGal } from '../../../../libs/car-gal/car-gal';
import { cargalDefaultOpts } from '../config/options';
import * as ICarGal from '../../../../libs/car-gal/interfaces';
import * as Cargal from '../../../../libs/car-gal';

import '../../../../libs/car-gal/styles.scss';

@customElement('car-gal')
export class CarouselCustomElement {
  el: HTMLDivElement;
  instance: CarGal | null;

  @bindable containerId: string;
  @bindable title: string;
  @bindable desc: string;
  @bindable opts: ICarGal.Options = cargalDefaultOpts;
  @bindable images: ICargalImg[] = [];
  imagesChanged() {
    this.dispose();
    this.init();
  }

  bind() { } // prevent first imagesChanged

  attached() {
    //setTimeout(() => {
    this.init();
    //}, 2000);
  }

  detached() {
    this.dispose();
  }

  init() {
    const config: ICarGal.Config = {
      defaultOptions: this.opts,
      //containerElement: [this.el],
      autoInit: false,
      instances: [
        { container: this.el, options: this.opts }
      ]
      //window: PLATFORM.global,
      //document: DOM
    };

    if (this.images?.length) {
      try {
        this.instance = Cargal.init(config);
      } catch (e) {
        console.log("error", e);
      }
    }

    this.findHighestZIndex()
  }

  findHighestZIndex() {
    const d = DOM as unknown as Document;
    let overlay = d.querySelector('.cg-overlay') as HTMLElement;

    if (!overlay) return;

    let zIndex = 0;
    (Array.from(DOM.querySelectorAll('body *')) as Element[])
      .forEach(a => {
        let n = Number.parseFloat((PLATFORM.global as Window).getComputedStyle(a).zIndex);
        if (!isNaN(n) && n > zIndex)
          zIndex = n;
      });

    overlay.style.zIndex = String(zIndex++);

  }

  dispose() {
    if (this.instance && typeof this.instance.dispose === 'function') {
      try {
        this.instance.dispose();
      } catch (e) { console.error("cargal dispose", e) }
    }

    this.instance = null;
  }


}