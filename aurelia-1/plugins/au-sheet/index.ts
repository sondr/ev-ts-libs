import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { IAuSheetOptions } from './interfaces';
import { setOptions } from './options';


export function configure(config: FrameworkConfiguration, cb?: (opts: IAuSheetOptions) => void): void {
  config.globalResources([
    PLATFORM.moduleName('./elements/au-sheet-component')
  ]);

  setOptions(cb);
}
