import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('./elements/car-gal-element')
  ]);
}

export interface ICargalImg {
  src: string;
  srcSet?: string;
  title: string;
  desc: string;
};