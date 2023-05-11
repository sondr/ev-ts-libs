import { Options, Config, ConfigEvents } from './interfaces';
import { Overlay } from './dom/overlay';
import { DynamicStyle } from './dom/dynamic-styles';

export let _PLATFORM: PLATFORM;

export class PLATFORM {
    public readonly DOM: Document;
    public readonly global: Window;
    public readonly overlay: Overlay;
    public readonly styleSheet: DynamicStyle;
    public readonly configEvents: ConfigEvents;
    public readonly container: HTMLElement;
    public readonly defaultOptions: Options;
    public readonly variables: any;

    // static create(DOM: Document, global: Window, container: HTMLElement, defaultOptions: Options) {
    //     _PLATFORM = new PLATFORM(DOM, global, container, defaultOptions);
    //     return _PLATFORM;
    // }

    static create(config:Config) {
        _PLATFORM = new PLATFORM(config.document, config.window, config.containerElement as HTMLElement, config.defaultOptions!, config.Events);
        return _PLATFORM;
    }

    constructor(DOM: Document, global: Window, container: HTMLElement, defaultOptions: Options, configEvents?: ConfigEvents) {
        this.DOM = DOM;
        this.global = global;
        this.container = container;
        this.defaultOptions = defaultOptions;
        this.configEvents = configEvents!;
        this.variables = {};

        _PLATFORM = this;

        this.overlay = new Overlay();
        this.styleSheet = new DynamicStyle();
        //console.log("Container", this.container);
    }

    dispose() {
        try{
        if (!this.overlay.isDisposed) this.overlay.dispose();
        if (!this.styleSheet.isDisposed) this.styleSheet.dispose();
        }catch(e){ console.error("Cargal _platform", e); }
    }
}