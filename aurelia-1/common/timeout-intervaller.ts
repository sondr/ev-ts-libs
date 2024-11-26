import { PLATFORM } from "aurelia-framework";

/**
 * Abstract base class defining the structure for time-based operations.
 * Any class extending this must implement `start` and `clear` methods.
 */
abstract class TimeIntervalBase {
    protected id?: number;

     /**
     * Starts the timer or interval.
     * @param args Arguments required by the specific implementation.
     */
    public abstract start(...args: any[]): void;

     /**
     * Clears the timer or interval and returns the instance for chaining.
     * @returns The instance of the class.
     */
    public abstract clear(): TimeIntervalBase;
}


/**
 * Class for managing single-delay timers using `setTimeout`.
 *
 * @example
 * const timeout = new Timeouter();
 * timeout.start(() => console.log("Executed after delay"), 1000);
 * timeout.clear(); // Stops the timer.
 */
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

/**
 * Class for managing repeating timers using `setInterval`.
 *
 * @example
 * const interval = new Intervaller();
 * interval.start(() => console.log("Executed repeatedly"), 1000);
 * interval.clear(); // Stops the interval.
 */
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

/**
 * Class for scheduling tasks to execute before the next repaint using `requestAnimationFrame`.
 *
 * @example
 * const animationScheduler = new AnimationFrameScheduler();
 * animationScheduler.start(() => console.log("Executed before repaint"));
 * animationScheduler.clear(); // Cancels the animation frame request.
 */
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

/**
 * Class for managing periodic execution in a separate thread using Web Workers.
 * 
 * This timer offloads the timing logic to a Web Worker, ensuring that the main thread
 * remains free and responsive. The provided callback (`handler`) will be executed 
 * after the specified timeout and at each interval thereafter.
 *
 * Unlike `setInterval`, this implementation is better suited for tasks that
 * require precise timing and need to avoid being throttled by the browser.
 *
 * @example
 * const workerTimer = new WorkerTimer();
 * // Logs "Executed in worker" every 1000ms (1 second).
 * workerTimer.start(() => console.log("Executed in worker"), 1000);
 *
 * // Stops the periodic execution.
 * workerTimer.clear();
 *
 * @remarks
 * The `handler` function is executed at the specified interval. If you need a one-off
 * execution, consider using `Timeouter` instead of `WorkerTimer`.
 */
export class WorkerTimer extends TimeIntervalBase {
    private worker?: Worker;

    public start<TArgs extends any[]>(handler: TimerHandler, timeout: number, ...args: TArgs): void {
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function for WorkerTimer.');
        }

        const blob = new Blob([`
            self.onmessage = function(e) {
                const { timeout, args } = e.data;
                setTimeout(() => postMessage(args), timeout);
            };
        `], { type: 'application/javascript' });

        this.worker = new Worker(URL.createObjectURL(blob));
        this.worker.onmessage = (e) => handler(...e.data);
        this.worker.postMessage({ timeout, args });
    }

    public clear(): TimeIntervalBase {
        if (this.worker) {
            this.worker.terminate();
            this.worker = undefined;
        }
        return this;
    }
}

/**
 * Class for managing delay operations using Promises.
 *
 * @example
 * const promiseTimer = new PromiseTimer();
 * promiseTimer.start(() => console.log("Executed after delay"), 1000);
 * promiseTimer.clear(); // Cancels the promise timer.
 */
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
