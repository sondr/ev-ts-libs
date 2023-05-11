import { FrameworkConfiguration } from 'aurelia-framework';
import { FilterValueConverter } from './converters/filter';
import { PLATFORM } from 'aurelia-pal';

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('./converters/filter'),
    PLATFORM.moduleName('./converters/join'),
    PLATFORM.moduleName('./converters/skip-take'),
    PLATFORM.moduleName('./converters/sort'),
    PLATFORM.moduleName('./converters/sum')
  ]);
}

export * from './interfaces';