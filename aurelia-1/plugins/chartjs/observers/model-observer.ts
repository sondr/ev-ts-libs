import { BindingEngine, Disposable, ICollectionObserverSplice, inject, PLATFORM } from 'aurelia-framework';

type TSubscriberEv = (callback: (changeRecords: ICollectionObserverSplice<any, any>[]) => void) => Disposable;

@inject(BindingEngine)
export class ModelObserver {
    public throttle: number = 100;
    private throttleTimeout: number | null = 0;
    private activeSubscriptions: Disposable[] = [];


    constructor(
        private bindingEngine: BindingEngine
    ) {
    }

    public observe = (model, onChange) => {
        let subscriptions: TSubscriberEv[] = [];
        this.getAllSubscriptions(model, subscriptions);

        const throttledHandler = (args) => {
            if (this.throttle <= 0) { return onChange(); }

            if (!this.throttleTimeout) {
                this.throttleTimeout = (PLATFORM.global as Window & typeof globalThis).setTimeout(() => {
                    this.throttleTimeout = null;
                    onChange();
                }, this.throttle);
            }
        };

        for (let i = 0; i < subscriptions.length; i++) {
            let outstandingSubscription = subscriptions[i](throttledHandler);
            this.activeSubscriptions.push(outstandingSubscription);
        }
    }

    public unsubscribe = () => {
        for (let i = 0; i < this.activeSubscriptions.length; i++) { this.activeSubscriptions[i].dispose(); }

        this.activeSubscriptions = [];
    }

    private getObjectType(obj) {
        if ((obj) && (typeof (obj) === "object") && (obj.constructor == (new Date).constructor)) return "date";
        return typeof obj;
    }

    //private getAllSubscriptions(model, subscriptions: (callback:(changeRecords: ICollectionObserverSplice<any,any>) => void))[]) {
    private getAllSubscriptions(model, subscriptions: TSubscriberEv[]) {
        if (Array.isArray(model)) {
            let subscription = this.bindingEngine.collectionObserver(model).subscribe;
            subscriptions.push(subscription);
        }

        for (let property in model) {
            let typeOfData = this.getObjectType(model[property]);
            switch (typeOfData) {
                case "object":
                    { this.getAllSubscriptions(model[property], subscriptions); }
                    break;
                case "array":
                    {
                        let underlyingArray = model[property]();
                        underlyingArray.forEach((entry, index) => { this.getAllSubscriptions(underlyingArray[index], subscriptions); });

                        let arraySubscription = this.bindingEngine.propertyObserver(model, property).subscribe;
                        if (arraySubscription) { subscriptions.push(arraySubscription); }
                    }
                    break;

                default:
                    {
                        let subscription = this.bindingEngine.propertyObserver(model, property).subscribe;
                        if (subscription) { subscriptions.push(subscription); }
                    }
                    break;
            }
        }
    }
}