import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('./converters/filter'),
    PLATFORM.moduleName('./converters/join'),
    PLATFORM.moduleName('./converters/datetime-duration'),
    PLATFORM.moduleName('./converters/datetime'),
    PLATFORM.moduleName('./converters/numberformat'),
    PLATFORM.moduleName('./converters/numeral'),
    PLATFORM.moduleName('./converters/take'),
    PLATFORM.moduleName('./converters/sort'),
    PLATFORM.moduleName('./converters/sum')
  ]);
}

export * from './interfaces';