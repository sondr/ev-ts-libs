export interface IDisposable {
    dispose(): void;
}


export type TEventType = (keyof DocumentEventMap) | string;

const s = new Map<string, string>();