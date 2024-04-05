import { DomListenerItem } from "./event-listener-item";
import { TEventType } from "./interfaces";

export class DomListenerService {
    private listeners: DomListenerItem[] = [];

    public register(element: Document | HTMLElement, event: TEventType, callback: (event: Event) => void, capture: boolean = false): DomListenerItem {
        const listener = new DomListenerItem(element, event, callback, capture, this.remove.bind(this));
        this.listeners.push(listener);

        return listener;
    }

    public getListeners() {
        return this.listeners;
    }

    private remove(listener: DomListenerItem) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
}