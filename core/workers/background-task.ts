/**
 * A class for executing a function in a Web Worker and returning the result as a Promise.
 * This is useful for offloading computationally expensive tasks to a background thread.
 *
 * @example
 * const worker = new WorkHandler();
 * const enhancedData = await worker.run(() => {
 *     const data = bigCalculation();
 *     return data;
 * });
 */
export class BackgroundTask {
    private worker?: Worker;

    /**
     * Executes the provided function in a Web Worker and returns the result as a Promise.
     * @template T The type of the result returned by the function.
     * @param task A function containing the logic to execute in the worker.
     * @returns A Promise that resolves with the result of the function.
     */
    public run<T>(task: () => T): Promise<T> {
        return new Promise((resolve, reject) => {
            const taskString = task.toString();

            // Verify the task is serializable to a string
            if (typeof task !== 'function' || !taskString.startsWith('function') && !taskString.startsWith('(')) {
                reject(new Error('The provided task must be a pure function.'));
                return;
            }

            const blob = new Blob([`
                self.onmessage = function() {
                    try {
                        const result = (${taskString})();
                        postMessage({ result });
                    } catch (error) {
                        postMessage({ error: error.message });
                    }
                };
            `], { type: 'application/javascript' });

            this.worker = new Worker(URL.createObjectURL(blob));

            this.worker.onmessage = (event) => {
                const { result, error } = event.data;
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(result);
                }
                this.terminateWorker();
            };

            this.worker.onerror = (error) => {
                reject(error);
                this.terminateWorker();
            };

            this.worker.postMessage(null); // Start the worker task.
        });
    }

    /**
     * Terminates the worker if it exists.
     */
    public terminateWorker(): void {
        if (this.worker) {
            this.worker.terminate();
            this.worker = undefined;
        }
    }
}
