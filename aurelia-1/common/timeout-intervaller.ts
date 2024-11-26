import { PLATFORM } from "aurelia-framework";

abstract class TimeIntervalBase {
    protected id?: number;
    public abstract start(...args: any[]): void;

    public abstract clear(): TimeIntervalBase;
}

export class Timeouter extends TimeIntervalBase {
    public start<TArgs extends any[]>(handler: TimerHandler, ms: number, ...args: TArgs) {
        this.id = (PLATFORM.global as Window & typeof globalThis).setTimeout(handler, ms, ...args);
    }

    public clear() {
        if (this.id != undefined) {
            (PLATFORM.global as Window & typeof globalThis).clearTimeout(this.id);
            this.id = undefined;
        }

        return this;
    }
}

export class Intervaller extends TimeIntervalBase {
    public start<TArgs extends any[]>(handler: TimerHandler, timeout: number, ...args: TArgs) {
        this.id = (PLATFORM.global as Window & typeof globalThis).setInterval(handler, timeout, ...args);
    }

    public clear() {
        if (this.id != undefined) {
            (PLATFORM.global as Window & typeof globalThis).clearInterval(this.id);
            this.id = undefined;
        }

        return this;
    }
}

export class AnimationFrameScheduler extends TimeIntervalBase {
    public start(handler: FrameRequestCallback): void {
        this.id = (PLATFORM.global as Window & typeof globalThis).requestAnimationFrame(handler);
    }

    public clear(): TimeIntervalBase {
        if (this.id !== undefined) {
            (PLATFORM.global as Window & typeof globalThis).cancelAnimationFrame(this.id);
            this.id = undefined;
        }

        return this;
    }
}

export class WorkerTimer extends TimeIntervalBase {
    private worker?: Worker;

    public start(handler: TimerHandler, timeout: number): void {
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function for WorkerTimer.');
        }

        const blob = new Blob([`
            self.onmessage = function(e) {
                setTimeout(() => postMessage(null), e.data);
            }
        `], { type: 'application/javascript' });

        this.worker = new Worker(URL.createObjectURL(blob));
        this.worker.onmessage = () => handler();
        this.worker.postMessage(timeout);
    }

    public clear(): TimeIntervalBase {
        if (this.worker) {
            this.worker.terminate();
            this.worker = undefined;
        }

        return this;
    }
}

export class PromiseTimer extends TimeIntervalBase {
    private cancel?: () => void;

    public start<TArgs extends any[]>(handler: TimerHandler, timeout: number, ...args: TArgs): void {
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function for WorkerTimer.');
        }

        let canceled = false;

        this.cancel = () => { canceled = true; };

        new Promise<void>((resolve) => {
            setTimeout(() => {
                if (!canceled) resolve();
            }, timeout);
        }).then(() => handler(...args));
    }

    public clear(): TimeIntervalBase {
        if (this.cancel) {
            this.cancel();
            this.cancel = undefined;
        }
        return this;
    }
}
