import { IChartCombined } from '../interface';
import { inject, customAttribute, bindable, bindingMode } from 'aurelia-framework'
import { ModelObserver } from "../observers/model-observer"
import { Chart, ChartOptions  } from "chart.js"

@customAttribute('chart')
@inject(Element, ModelObserver)
export class ChartAttribute {
    @bindable type;
    @bindable data;
    @bindable shouldUpdate: boolean;
    @bindable throttle: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) nativeOptions: ChartOptions = {};

    private activeChart: Chart;
    private isSetup: boolean = false;
    private chartData: IChartCombined;

    constructor(
        private element: HTMLCanvasElement,
        private readonly modelObserver: ModelObserver
    ) { }

    attached() {
        this.createChart();
        this.isSetup = true;

        if (this.isObserving) {
            this.subscribeToChanges();
        }
    }

    detached() {
        if (this.shouldUpdate == true) {
            this.modelObserver.unsubscribe();
        }

        this.activeChart.destroy();

        this.isSetup = false;
    }

    propertyChanged = (propertyName, newValue, oldValue) => {
        if (this.isSetup && this.isObserving) {
            this.refreshChart();
            this.modelObserver.unsubscribe();
            this.subscribeToChanges();
        }
    }

    private get isObserving() {
        return String(this.shouldUpdate).toLowerCase() == String(true);
    }

    get clonedData() {
        return JSON.parse(JSON.stringify(this.data));
    }

    createChart() {
        this.chartData = {
            type: this.type,
            data: this.clonedData,
            options: this.nativeOptions
        };

        this.activeChart = new Chart(this.element, this.chartData);
        this.nativeOptions = this.activeChart.options;
        this.refreshChart();
    };

    refreshChart = () => {
        this.chartData.data = this.clonedData;
        this.activeChart.update();
        this.activeChart.resize();
    };

    subscribeToChanges() {
        this.modelObserver.throttle = this.throttle || 100;
        this.modelObserver.observe(this.data, this.refreshChart);
    };
}