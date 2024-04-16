import { FrameworkConfiguration } from 'aurelia-framework';
import { IAuSheetOptions } from './interfaces';
import { PLATFORM } from 'aurelia-pal';
import { setOptions } from './options';


export function configure(config: FrameworkConfiguration, opts?: (cb: IAuSheetOptions) => void): void {
  config.globalResources([
    PLATFORM.moduleName('./elements/au-sheet-component')
  ]);

  setOptions(opts);
}
