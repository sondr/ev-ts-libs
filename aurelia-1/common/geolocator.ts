import { PLATFORM } from "aurelia-framework";

export class GeoLocator {
    private readonly ctr: Geolocation;
    private id?: number = undefined;

    constructor() {
        this.ctr = new (PLATFORM.global as Window & typeof globalThis).Geolocation();
    }

    locate(): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            this.ctr.getCurrentPosition(location => {
                return resolve(location);
            }, error => { return reject(error); });
        })

    }

    watch(success: PositionCallback, error: PositionErrorCallback) {
        const watcher = this.ctr.watchPosition(success, error);
    }

    stopWatch() {
        if (this.id) {
            this.ctr.clearWatch(this.id!);
            this.id = undefined;
        }
    }
}