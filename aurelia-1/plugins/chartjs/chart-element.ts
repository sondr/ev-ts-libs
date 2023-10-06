import { customElement, bindable, inlineView } from 'aurelia-framework';
import { Chart, ChartType, ChartConfiguration, BubbleDataPoint, ChartData, ChartTypeRegistry, Plugin, Point, ChartOptions, registerables } from 'chart.js';
import { AuObserver } from './model-observer';

//Chart.register(LineController, DoughnutController)
Chart.register(...registerables);

@inlineView(`<template>
<div css.bind="css" class.bind="class" style="display:block;min-width:0;">
  <canvas ref="canvas" class="h-100 w-100" style="margin:auto;"></canvas>
</div>
</template>`)
@customElement('chart')
export class ChartJsComponent implements ChartConfiguration {
  plugins?: Plugin[];

  @bindable type: ChartType;
  @bindable css: Partial<CSSStyleDeclaration>;
  @bindable class: string;
  @bindable options?: ChartOptions;
  @bindable data: ChartData<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint)[], unknown>;
  dataChanged(val) {
    this.refresh();
  }
  @bindable observe: boolean = false;

  onChange(change: any) {
    this.refresh();
  }

  chart?: Chart;
  canvas: HTMLCanvasElement;

  constructor(
    private readonly modelObserver: AuObserver
  ) { }

  bind() { }

  attached() {
    this.setup();
  }

  detached() {
    this.dispose();
  }


  setup() {
    this.chart = new Chart(this.canvas, {
      type: this.type,
      data: this.data,
      plugins: this.plugins
    });
    //const div = document.createElement('div');
    this.modelObserver.addListener({
      type: 'resize',
      onChange: (event) => {
        this.chart?.resize();
      },
      throttleTimer: 100
    });
    //this.toggleObservation(this.observe);
  }

  refresh() {
    if (!this.chart?.data) { return; }
    this.chart.data = this.data;
    this.chart.update();
    this.chart.resize();
  }

  //toggleObservation(observe: boolean) {
  //  if (observe) {
  //    this.modelObserver.addModelObserver({
  //      model: this.data,
  //      onChange: this.onChange,
  //      throttleTimer: 200
  //    });
  //    this.refresh();
  //  } else {
  //    this.modelObserver.dispose();
  //  }
  //}


  dispose() {
    this.modelObserver?.dispose();
    this.chart?.destroy();
    this.chart = undefined;
  }
}
