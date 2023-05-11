import { inject, Parser, valueConverter } from 'aurelia-framework';

@valueConverter('sum')
@inject(Parser)
export class SumValueConverter {
    constructor(private parser: Parser) { }

    toView(arr: any[], key?: string) {
        if (!Array.isArray(arr) || arr.length < 1) {
            return 0;
        }

        let property;
        if (key) {
            property = this.parser.parse(key);
        }

        return arr.reduce((sum, current) => {
            let currentValue = property ?
                property.evaluate({ bindingContext: current, overrideContext: undefined }) :
                current;

            if (currentValue == null) {
                currentValue = 0;
            }

            if (typeof currentValue === 'string') {
                let useValue = Number.parseInt(currentValue);
                currentValue = Number.isNaN(useValue) ? 0 : useValue;
            }

            return sum + currentValue;
        }, 0);


    }
}
