import { PLATFORM } from "aurelia-framework";

abstract class TimeIntervalBase {
    protected id?: number;
    public abstract start<TArgs extends any[]>(handler: TimerHandler, timeout: number, ...args: TArgs);
    public abstract clear() : TimeIntervalBase;
}



export class Timeouter extends TimeIntervalBase {
    public start<TArgs extends any[]>(handler: TimerHandler, ms: number, ...args: TArgs) {
        this.id = (PLATFORM.global as Window & typeof globalThis).setTimeout(handler, ms, args);
    }

    public clear() {
        (PLATFORM.global as Window & typeof globalThis).clearTimeout(this.id);
        this.id = undefined;

        return this;
    }
}




export class Intervaller extends TimeIntervalBase {
    public start<TArgs extends any[]>(handler: TimerHandler, timeout: number, ...args) {
        (PLATFORM.global as Window & typeof globalThis).setInterval(handler, timeout, args);
    }

    public clear() {
        (PLATFORM.global as Window & typeof globalThis).clearInterval(this.id);

        return this;
    }
}