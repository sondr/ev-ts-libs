import { PLATFORM } from 'aurelia-framework';

export class MediaDevice {
    stream: MediaStream;

    public async start(options: DisplayMediaStreamOptions){
        this.stream = await (PLATFORM.global as Window & typeof globalThis).navigator.mediaDevices.getDisplayMedia(options);
    }

    public stop(){
        this.stream?.getTracks().forEach(t => t.stop());
    }


}