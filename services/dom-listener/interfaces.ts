export interface IDisposable {
    dispose(): void;
}


export type TEventType = (keyof DocumentEventMap) | string;