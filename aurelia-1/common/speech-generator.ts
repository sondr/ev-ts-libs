import { PLATFORM } from "aurelia-framework";

interface IUtteranceOptions {
    lang?: string;
    pitch?: number;
    rate?: number;
    volume?: number;
}

export class SpeechGenerator {
    private readonly utterance: SpeechSynthesisUtterance;
    private id?: number = undefined;

    constructor(opts?: IUtteranceOptions) {
        this.utterance = new (PLATFORM.global as Window & typeof globalThis).SpeechSynthesisUtterance();
        this.setOptions(opts);
    }

    setOptions(opts?: IUtteranceOptions) {
        this.utterance.lang = opts?.lang || '';
        this.utterance.pitch = opts?.pitch || 1;
        this.utterance.rate = opts?.rate || 1;
        this.utterance.volume = opts?.volume || 1;
    }

    setVoice(voice: SpeechSynthesisVoice) {
        this.utterance.voice = voice;
    }

    resume() {
        (PLATFORM.global as Window & typeof globalThis).speechSynthesis.resume();
    }

    pause() {
        (PLATFORM.global as Window & typeof globalThis).speechSynthesis.pause();
    }

    cancel() {
        (PLATFORM.global as Window & typeof globalThis).speechSynthesis.cancel();
    }

    getVoices() {
        (PLATFORM.global as Window & typeof globalThis).speechSynthesis.getVoices();
    }

    speak(text: string) {
        this.utterance.text = text;
        (PLATFORM.global as Window & typeof globalThis).speechSynthesis.speak(this.utterance);
    }
}