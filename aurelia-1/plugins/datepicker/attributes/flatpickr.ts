import { DateParseValues, dateParse } from "../../../../core/date/date-parse";
import { nameof } from "../../../../core/functions/nameof";
import { inject, DOM, bindable, bindingMode, customAttribute, PLATFORM, BindingEngine, Disposable } from "aurelia-framework";
import { Instance } from "flatpickr/dist/types/instance";
import { Options } from "flatpickr/dist/types/options";
import flatpickr from 'flatpickr';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';

//import { Norwegian } from 'flatpickr/dist/l10n/no';
import 'flatpickr/dist/l10n/no';

const defaultOpts: Options = {
    locale: 'no',

    time_24hr: true,
    dateFormat: 'Y.m.d H:i',
    weekNumbers: true,
    closeOnSelect: true,
}

const dateTimeOptions: Options = {
    enableTime: true,
    noCalendar: false,
    time_24hr: true,
    dateFormat: 'Y.m.d H:i'
};
const dateOpts: Options = {
    enableTime: false,
    noCalendar: false,
    dateFormat: 'Y.m.d'
}
const timeOptions: Options = {
    enableTime: true,
    noCalendar: true,
    time_24hr: true,
    dateFormat: 'H.i'
};


export interface IOptions extends Options { }

const observedPropKeys = [
    nameof<FlatpickrCustomAttribute>(e => e.type),
    nameof<FlatpickrCustomAttribute>(e => e.minDate),
    nameof<FlatpickrCustomAttribute>(e => e.maxDate),
    nameof<FlatpickrCustomAttribute>(e => e.locale),
    nameof<FlatpickrCustomAttribute>(e => e.use24H),
    nameof<FlatpickrCustomAttribute>(e => e.options),
];

@customAttribute('datepicker')
@inject(DOM.Element, BindingEngine)
export class FlatpickrCustomAttribute {
    @bindable minDate?: DateParseValues;
    @bindable maxDate?: DateParseValues;
    private resetPicker: boolean = false;
    rangeElement: HTMLInputElement;

    @bindable use24H: boolean = true;
    @bindable locale: string = 'no';
    // localeChanged() {
    //     this.refresh();
    // }

    @bindable({ defaultBindingMode: bindingMode.fromView }) el: Instance;
    @bindable value: Date | string;
    valueChanged(date: Date, prevDate?: Date) {
        if (!this.el) { return; }
        const isSetByPicker = this.el.selectedDates?.some(e => e == date) ?? false;
        if (isSetByPicker) { return; }

        this.el.setDate(date);
    }
    @bindable rangeValue: Date | string;
    @bindable options: Options;
    // optionsChanged(options: Options) {
    //     if (!this.el || !options) return;

    //     this.refresh();
    // }
    @bindable rangeElementId: string;

    @bindable private onUpdate: (response: any) => void;
    @bindable private onChange: (response: any) => void;
    @bindable private onClose: (response: any) => void;

    @bindable type: DatepickerType = 'date-time';
    // typeChanged(t: DatepickerType, prevType?: DatepickerType) {
    //     this.refresh();
    // }

    private refreshTimer: number;
    refresh() {
        (PLATFORM.global as Window & typeof globalThis).clearTimeout(this.refreshTimer);
        this.refreshTimer = (PLATFORM.global as Window & typeof globalThis).setTimeout(() => {
            const opts = this.buildOptions(this.options);
            this.el.set(opts);

            if (this.type === 'date') {
                const currentDate = typeof (this.value) === 'string' ? new Date(this.value) : this.value;
                if (currentDate instanceof Date) { currentDate.setHours(0, 0, 0, 0); }
                this.el.setDate(currentDate);
            }
        }, 10)

    }

    //@bindable private enableTime: boolean;
    // enableTimeChanged(val: boolean, oldVal: boolean) {
    //     const currentDate = typeof (this.value) == 'string' ? new Date(this.value) : this.value;
    //     if (!val && currentDate) currentDate.setHours(0, 0, 0, 0);
    //     this.reset({
    //         enableTime: !!val,
    //         defaultDate: currentDate
    //     });
    // }



    constructor(
        private readonly element: HTMLInputElement,
        private readonly _be: BindingEngine
    ) { }


    private _refreshSubscribers: Disposable[] = [];
    setupSubscribers() {
        this._refreshSubscribers = observedPropKeys.map(key => {
            return this._be.propertyObserver(this, key).subscribe((next, prev) => {
                this.refresh();
            });
        });
    }
    disposeSubscribers() {
        this._refreshSubscribers?.forEach(s => s?.dispose());
        this._refreshSubscribers = [];
    }


    bind() { }

    unbind() {
        this.disposeSubscribers();
    }

    attached() {
        this.init();
        this.setupSubscribers();
    }

    destroy() {
        this.unbind();
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

    getTypeOptions(type: DatepickerType) {
        switch (type) {
            case 'date':
                return dateOpts;
            case 'date-time':
                return dateTimeOptions;
            case 'time':
                return timeOptions;
        }
    }

    buildOptions(o?: Options) {
        const now = new Date(Date.now());
        let opts: Options = Object.assign({}, defaultOpts, this.getTypeOptions(this.type));

        if (this.locale) {
            opts.locale = this.locale as any;
        }
        opts.time_24hr = this.use24H;
        opts.minDate = dateParse(this.minDate);
        opts.maxDate = dateParse(this.maxDate);

        console.log(opts);
        console.log(this);
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

type DatepickerType = 'date' | 'date-time' | 'time';
