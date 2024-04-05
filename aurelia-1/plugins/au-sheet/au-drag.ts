// import { PLATFORM } from 'aurelia-framework';
// const doc = (PLATFORM.global as Window).document;

type positionType = 'client' | 'page' | 'screen';
type eventKeys = keyof DocumentEventMap | keyof HTMLElementEventMap;

const startEvents: eventKeys[] = ['mousedown', 'touchstart'];
const moveEvents: eventKeys[] = ['mousemove', 'touchmove'];
const endEvents: eventKeys[] = ['mouseup', 'touchend'];

export interface IPosition {
  x: number;
  y: number;
}

interface IAuDragConfig {
  positionType: positionType;
  passiveListeners: boolean;
}

export class DragEventHandler<T extends object> {
  public static create<T extends object>(element: Element, config?: IAuDragConfig) { return new DragEventHandler<T>(element, config); }

  private xKey: string;
  private yKey: string;
  private listenerOptions: AddEventListenerOptions = { passive: true };
  private isDragging = false;
  public startPosition: IPosition;

  private _data: T = {} as T;
  public getData() { return this._data; }

  onStart: (startPosition: IPosition, event: MouseEvent | TouchEvent | Event, data?: T) => T | void;
  onEnd: (currentPosition: IPosition, startPosition: IPosition, event: MouseEvent | TouchEvent | Event, data?: T) => T | void;
  onMove: (endPosition: IPosition, startPosition: IPosition, event: MouseEvent | TouchEvent | Event, data?: T) => T | void;


  setPositionType(type: positionType) {
    this.xKey = type + 'X';
    this.yKey = type + 'Y';
  }


  constructor(
    private readonly element: Element,
    config?: IAuDragConfig
  ) {
    if (!config) {
      config = { positionType: 'client', passiveListeners: true };
    }
    this.setPositionType(config.positionType);
    this.listenerOptions.passive = config.passiveListeners;
  }

  private startEvent: EventListener = (event): void => {
    this.isDragging = true;
    const pos = this.getPosition(event);
    this.startPosition = pos;
    const data = this.onStart?.(pos, event, this._data);
    if (data) { this._data = data; }
  };

  private dragEvent = (event: MouseEvent | TouchEvent | Event): void => {
    if (this.isDragging) {
      const pos = this.getPosition(event);
      const data = this.onMove?.(pos, this.startPosition, event, this._data);
      if (data) { this._data = data; }
    }
  };

  private endEvent = (event: MouseEvent | TouchEvent | Event): void => {
    if (this.isDragging) {
      this.isDragging = false;
      const pos = this.getPosition(event);
      const data = this.onEnd?.(pos, this.startPosition, event, this._data);
      if (data) { this._data = data; }
    }
  };



  public stop() { this.isDragging = false; }

  private getPosition(event: MouseEvent | TouchEvent | Event): IPosition {

    if ('touches' in event && event.touches.length > 0) {
      return { x: event.touches[0][this.xKey], y: event.touches[0][this.yKey] };
    } else {
      return { x: (event as MouseEvent)[this.xKey], y: (event as MouseEvent)[this.yKey] };
    }
  }

  public start() {
    startEvents.forEach(event => { this.element.addEventListener(event, this.startEvent, this.listenerOptions); });
    moveEvents.forEach(event => { document.addEventListener(event, this.dragEvent, this.listenerOptions); });
    endEvents.forEach(event => { document.addEventListener(event, this.endEvent, this.listenerOptions); });
  }

  public dispose() {
    startEvents.forEach(event => { this.element.removeEventListener(event, this.startEvent); });
    moveEvents.forEach(event => { document.removeEventListener(event, this.dragEvent); });
    endEvents.forEach(event => { document.removeEventListener(event, this.endEvent); });
  }

}
