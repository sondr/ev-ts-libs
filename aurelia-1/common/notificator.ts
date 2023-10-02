import { PLATFORM } from "aurelia-framework";

export class Notificator {

    get permission() { return (PLATFORM.global as Window & typeof globalThis).Notification.permission; }

    requestPermission() { return (PLATFORM.global as Window & typeof globalThis).Notification.requestPermission(); }

    async notify(title: string, options?: NotificationOptions) {
        let permission = this.permission;
        if (this.permission == 'default') {
            permission = await this.requestPermission();
        }
        if (permission == 'granted') {
            return new (PLATFORM.global as Window & typeof globalThis).Notification(title, options);
        }
        return undefined;
    }
}