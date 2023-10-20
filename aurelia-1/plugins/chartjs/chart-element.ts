import { customElement, bindable, inlineView } from 'aurelia-framework';
import { Chart, ChartType, ChartConfiguration, BubbleDataPoint, ChartData, ChartTypeRegistry, Plugin, Point, ChartOptions, registerables } from 'chart.js';
import { AuObserver } from './model-observer';
import { Timeouter } from '../../common/timeout-intervaller';

//Chart.register(LineController, DoughnutController)
Chart.register(...registerables);

@inlineView(`<template>
<div ref="container"
     css.bind="css" 
     class.bind="class" 
     style="display:block;min-width:0;">
  <canvas ref="canvas" 
          class="h-100 w-100" 
          style="margin:auto;">
  </canvas>
</div>
</template>`)
@customElement('chart')
export class ChartJsComponent implements ChartConfiguration {
  container: HTMLDivElement;
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

  throttleTimer = 100;
  setup() {
    this.chart = new Chart(this.canvas, {
      type: this.type,
      data: this.data,
      plugins: this.plugins,
      options: {
        responsive: false
      }
    });

    const onChange = (event: GlobalEventHandlersEventMap['resize']) => {
      this.resize();
    };

    this.modelObserver.addListener({ type: 'resize', onChange, throttleTimer: this.throttleTimer });
    // this.modelObserver.addListener({ element: this.container, type: 'resize', onChange, throttleTimer: this.throttleTimer }); // add resizeobserver
    const timouter = new Timeouter();
    timouter.start(() => {
      this.resize();
    }, this.throttleTimer);

  }

  refresh() {
    if (!this.chart?.data) { return; }
    this.chart.data = this.data;
    this.chart.update();
    this.chart.resize();
  }

  lastResize: number;
  resize() {
    const now = new Date().getTime();
    if (!this.lastResize || (now - this.lastResize) > (this.throttleTimer * 2.5)) {
      this.chart?.resize();
      this.lastResize = now;
    }
  }


  dispose() {
    this.modelObserver?.dispose();
    this.chart?.destroy();
    this.chart = undefined;
  }
}
