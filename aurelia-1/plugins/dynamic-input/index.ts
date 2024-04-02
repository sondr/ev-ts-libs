import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { DynamicInputConfig } from './element-creator-config';

//const custom

export function configure(config: FrameworkConfiguration, configCallback?: (config: DynamicInputConfig) => void): void {
  const configer = config.aurelia.container.get(DynamicInputConfig);
  if (configCallback && typeof configCallback === 'function') {
    configCallback(configer);
  }

  config.globalResources([
    PLATFORM.moduleName('./elements/dynamic-input')
  ]);
}

export * from './interfaces'
