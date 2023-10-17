import { autoinject, BindingEngine, PLATFORM, Disposable, ICollectionObserverSplice, transient } from 'aurelia-framework';

interface IObjectObservator {
  keys?: string[];
  callback: Tsubs;
}

type Tsubs = (callback: (changeRecords: ICollectionObserverSplice<any, any>[]) => void) => Disposable;
function getObjectType(obj) {
  if ((obj) && (typeof (obj) === "object") && (obj.constructor == (new Date).constructor)) return "date";
  return typeof obj;
}

function generateSubscriptions(engine: BindingEngine, model: any, subs?: IObjectObservator[], parentKeys?: string[]) {
  if (!subs?.length) {
    subs = [];
  }

  if (Array.isArray(model)) {
    let subscription = engine.collectionObserver(model).subscribe;
    subs.push({ callback: subscription, keys: parentKeys });
  }

  for (let property in model) {
    let objType = getObjectType(model[property]);
    let keys = parentKeys?.slice() ?? [];
    keys.push(property);
    switch (objType) {
      case "object":
        { generateSubscriptions(engine, model[property], subs, keys); }
        break;
      case "array":
        {
          let underlyingArray = model[property]();
          underlyingArray.forEach((entry, index) => { generateSubscriptions(engine, underlyingArray[index], subs, keys); });

          let arraySubscription = engine.propertyObserver(model, property).subscribe;
          if (arraySubscription) { subs.push({ callback: arraySubscription, keys }); }
        }
        break;

      default:
        {
          let subscription = engine.propertyObserver(model, property).subscribe;
          if (subscription) { subs.push({ callback: subscription, keys }); }
        }
        break;
    }
  }

  return subs;
}


// Missing function to observe newly added
@transient()
@autoinject()
export class AuObserver {
  private _observations: AureliaObserver.IModelObserver[] = [];
  private _listeners: AureliaObserver.IAddEventListenerArgs[] = [];
  constructor(
    private readonly _be: BindingEngine
  ) { }


  public addModelObserver(args: AureliaObserver.IModelObserverArgs) {
    const obs = {
      model: args.model,
      key: args.key,
      throttleTimer: args.throttleTimer
    } as AureliaObserver.IModelObserver;

    if (!obs.throttleTimer || obs.throttleTimer <= 0) {
      obs.onChange = args.onChange();
    }
    else {
      const throttler = (throttleArgs) => {
        (PLATFORM.global as Window & typeof globalThis).clearTimeout(obs.throttleTimeoutId);
        obs.throttleTimeoutId = (PLATFORM.global as Window & typeof globalThis).setTimeout(() => {
          args.onChange(throttleArgs);
        }, obs.throttleTimer);
      };
      obs.onChange = throttler;
    }

    const subs = generateSubscriptions(this._be, args.model);
    const subscriptions = subs.map(s => s.callback(e => obs.onChange(s.keys)));
    obs.subscriptions = subscriptions;
    this._observations.push(obs);
  }

  // START: Event Listeners
  public addListener(args: AureliaObserver.IAddEventListenerArgs): number {
    if (!args?.element) { args.element = PLATFORM.global as Window & typeof globalThis; }

    const obs = {
      element: args.element,
      key: args.key,
      throttleTimer: args.throttleTimer,
      type: args.type,
      options: args.options
    } as AureliaObserver.IAddEventListener;

    if (!obs.throttleTimer || obs.throttleTimer <= 0) {
      obs.onChange = args.onChange;
    }
    else {
      const throttler = (throttleArgs) => {
        (PLATFORM.global as Window & typeof globalThis).clearTimeout(obs.throttleTimeoutId);
        obs.throttleTimeoutId = (PLATFORM.global as Window & typeof globalThis).setTimeout(() => {
          args.onChange(throttleArgs);
        }, obs.throttleTimer);
      };
      obs.onChange = throttler;
    }

    args.element.addEventListener(obs.type, obs.onChange, obs.options);
    const index = this._listeners.push(obs);

    return index;
  }

  public removeListener(index: number) {
    const listener = this._listeners[index];
    listener.element?.removeEventListener(listener.type, listener.onChange);
  }

  public findListenerIndex(key: string | number) {
    if (!key) { return undefined; }
    return this._listeners.findIndex(e => e.key == key);
  }
  // END: Event Listeners


  public removeListeners() {
    this._listeners?.forEach(l => l.element?.removeEventListener(l.type, l.onChange));
    this._listeners = [];
  }

  public removeModelObservers() {
    this._observations?.forEach(o => o.subscriptions?.forEach(s => s?.dispose()));
    this._observations = [];
  }



  public dispose() {
    this.removeListeners();
    this.removeModelObservers();
  }

}


export module AureliaObserver {
  interface IOnChange<K extends keyof GlobalEventHandlersEventMap> {
    key?: string | number;
    onChange: (args?: any) => any;
    throttleTimer?: number;
  }
  interface IThrottleTimeoutId {
    throttleTimeoutId?: number;
  }

  export interface IAddEventListenerArgs extends IOnChange<keyof GlobalEventHandlersEventMap> {
    type: keyof GlobalEventHandlersEventMap;
    element?: GlobalEventHandlers;
    options?: AddEventListenerOptions;
  }

  export interface IAddEventListener extends IAddEventListenerArgs, IThrottleTimeoutId {
    type: keyof GlobalEventHandlersEventMap;
    element?: GlobalEventHandlers;
    options?: AddEventListenerOptions;
    //throttleTimeoutId?: number;
  }

  export interface IModelObserverArgs extends IOnChange<keyof GlobalEventHandlersEventMap> {
    model: any;
  }

  export interface IModelObserver extends IModelObserverArgs, IThrottleTimeoutId {
    //throttleTimeoutId?: number;
    subscriptions?: Disposable[];
  }
}
