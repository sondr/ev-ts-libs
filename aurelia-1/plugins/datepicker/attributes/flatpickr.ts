import { inject, DOM, bindable, bindingMode, customAttribute, PLATFORM } from "aurelia-framework";
import { Instance } from "flatpickr/dist/types/instance";
import { Options } from "flatpickr/dist/types/options";
import flatpickr from 'flatpickr';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';

//import { Norwegian } from 'flatpickr/dist/l10n/no';
import 'flatpickr/dist/l10n/no';

const timeOptions: Options = {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H.i',
    time_24hr: true
};
const dateOptions: Options = {
    enableTime: false,
    dateFormat: 'Y.m.d'
};

export interface IOptions extends Options { }

@customAttribute('datepicker')
@inject(DOM.Element)
export class FlatpickrCustomAttribute {
    private resetPicker: boolean = false;

    rangeElement: HTMLInputElement;

    @bindable({ defaultBindingMode: bindingMode.fromView }) el: Instance;
    @bindable value: Date | string;
    valueChanged(date: Date, prevDate?: Date) {
        if (!this.el) { return; }
        const isSetByPicker = this.el.selectedDates?.some(e => e == date) ?? false;
        if (isSetByPicker) { return; }

        this.el.setDate(date);
    }
    @bindable rangeValue: Date | string;
    @bindable type?: DatepickerType;
    @bindable options: Options;
    optionsChanged(options: Options) {
        if (!this.el || !options) return;

        let builtOptions = this.buildOptions(options);
        this.el.set(builtOptions);
    }
    @bindable rangeElementId: string;

    @bindable private onUpdate: (response: any) => void;
    @bindable private onChange: (response: any) => void;
    @bindable private onClose: (response: any) => void;

    @bindable private enableTime: boolean;
    enableTimeChanged(val: boolean, oldVal: boolean) {
        const currentDate = typeof (this.value) == 'string' ? new Date(this.value) : this.value;
        if (!val && currentDate) currentDate.setHours(0, 0, 0, 0);
        this.reset({
            enableTime: !!val,
            defaultDate: currentDate
        });
    }

    constructor(
        private readonly element: HTMLInputElement
    ) { }

    bind() { }

    attached() {
        this.init();
    }

    destroy() {
        this.el.destroy();
    }

    detached() {
        this.destroy();
    }

    setDates(dates: Date[], currentDateString: string, instance: Instance, data?: any) {
        let sliced = dates.slice();
        let value: Date | null = sliced[0];
        if (!this.el.config.enableTime && value instanceof Date) {
            value.setHours(this.el.config.defaultHour);
        }
        this.value = value;
        this.element.value = this.value ? this.getDateStr(this.value) : '';

        if (sliced.length > 1) {
            this.rangeValue = sliced[1];
            if (this.rangeElement)
                this.rangeElement.value = this.getDateStr(this.rangeValue);
        }

        if (this.onUpdate) {
            (PLATFORM.global as Window).setTimeout(() => { this.onUpdate({ value }); }, 0);
        }
    }

    buildOptions(o?: Options) {
        const now = new Date(Date.now());
        let opts: Options = Object.assign({
            time_24hr: true,
            //enableTime: !!this.enableTime,
            dateFormat: 'Y.m.d H:i',
            locale: 'no',
            weekNumbers: true,
            closeOnSelect: true,
            minDate: now
        } as Options,
            (this.type ? (this.type == 'date' ? dateOptions : (this.type == 'time' ? timeOptions : null)) : {}) || {},
            this.options || {},
            o || {});

        if (typeof this.enableTime === 'boolean') {
            opts.enableTime = this.enableTime;
        }

        return opts;
    }

    init(o?: Options) {
        let opts = this.buildOptions(o);

        if (this.value) {
            opts.defaultDate = [this.value, this.rangeValue]
                .filter(e => e)
                .map(e => typeof (e) === 'string' ? new Date(e) : e);
        }

        opts.onClose = (dates, currentDateString, instance, data) => {
            if (this.onClose) { this.onClose({ dates, currentDateString, instance, data }); }
        };

        opts.onValueUpdate = (dates, currentDateString, instance, data) => {
            this.setDates(dates, currentDateString, instance, data);
        };

        opts.onChange = (dates, currentDateString, instance, data) => {
            if (this.onChange) { this.onChange({ dates, currentDateString, instance, data }); }
        };

        opts.plugins = [];
        if (this.rangeElementId) {
            this.rangeElement = DOM.getElementById(this.rangeElementId) as HTMLInputElement;
            if (this.rangeElement) {
                opts.mode = 'range';
            }
            opts.plugins.push(
                rangePlugin({ input: this.rangeElement })
            );
        }

        this.el = flatpickr(this.element, opts) as Instance;
    }

    getDateStr(date: Date) {
        const self = this.el;
        return self.formatDate(date, self.config.dateFormat);
    }

    reset(o: Options) {
        this.destroy();
        this.init(o);
        this.el.redraw();
    }
}

type DatepickerType = 'time' | 'date';
