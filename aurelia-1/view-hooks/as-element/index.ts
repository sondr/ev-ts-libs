import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { AsElementViewHook } from './as-element-viewhook';

export function configure(framework: FrameworkConfiguration, configCallback?: (config: any) => Promise<any>) {

    const vh = framework.aurelia.container.get(AsElementViewHook)

    framework.globalResources([
        PLATFORM.moduleName('./as-element-viewhook')
      ]);


    let instance = framework.container.get(AsElementViewHook);
    //instance.

    // if (configCallback !== undefined && typeof (configCallback) === 'function') {
    //     configCallback(instance);
    // }

    //aurelia.globalResources([]);
}