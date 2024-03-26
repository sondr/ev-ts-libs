import { IDisposable, TEventType } from "./interfaces";


export class DomListenerItem implements IDisposable {
    private isActive: boolean = false;

    constructor(
        public readonly element: Document | HTMLElement,
        public readonly event: TEventType,
        private readonly callback: (event: Event) => void,
        public readonly capture: boolean,
        private removeCallback: (listener: DomListenerItem) => void
    ) {}

    public activate() {
        if (!this.isActive) {
            this.delayedAttach();
        }
        return this;
    }

    public deactivate() {
        if (this.isActive) {
            this.element.removeEventListener(this.event, this.callback, this.capture);
            this.isActive = false;
        }

        return this;
    }

    public dispose() {
        this.deactivate();
        this.removeCallback(this); // Notify the service to remove this from its tracking list
    }

    private delayedAttach() {
        setTimeout(() => { this.attach(); }, 0);
    }

    private attach() {
        this.element.addEventListener(this.event, this.callback, this.capture);
        this.isActive = true;
    }
}