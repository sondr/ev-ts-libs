import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { DynamicInputConfig } from './element-creator-config';
import { ICustomDynamicInput } from './interfaces';

//const custom

export function configure(config: FrameworkConfiguration, configCallback?: (config: DynamicInputConfig) => void): void {
  if (configCallback) {
    const configer = config.aurelia.container.get(DynamicInputConfig);
    configCallback(configer);
    configer.build();
  }

  config.globalResources([
    PLATFORM.moduleName('./elements/dynamic-input')
  ]);
}

export * from './interfaces'
