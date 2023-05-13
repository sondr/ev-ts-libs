import { View } from 'aurelia-framework';
import { Binding, bindingBehavior } from 'aurelia-binding';

@bindingBehavior('integer')
export class IntegerInputBindingBehavior { // implements Binding {
    bind(binding: Binding, source: View) {
        (binding as any).standardUpdateSource = binding.updateSource;
        binding.updateSource = (value) => {
            const intValue = Number.parseInt(value, 10);
            if (Number.isNaN(intValue)) {
                (binding as any).standardUpdateSource(0);
                return;
            }
            (binding as any).standardUpdateSource(intValue);
            if (intValue.toString(10) !== value) {
                binding.updateTarget!(intValue.toString(10));
            }
        };
    }

    unbind(binding: Binding, source: View) {
        binding.updateSource = (binding as any).standardUpdateSource;
        (binding as any).standardUpdateSource = null;
    }
}
