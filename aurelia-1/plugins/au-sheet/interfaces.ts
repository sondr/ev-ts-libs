export type Direction = 'expand' | 'shrink';
export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface IAuAutoClose {
    overlay?: boolean;
    //confirm: boolean;
    //cancel: boolean;
}
export interface IAuSheetOptions {
    title?: string;
    placement?: Placement;
    autoClose?: IAuAutoClose;
    showFooter?: boolean;
    zIndex?: number;
    showDragHandle?: boolean;
}

export interface ISize {
    w: number;
    h: number;
}
export interface IDragData {
    handle: ISize;
}
export interface IContentData {
    positionLog: IPosition[];
    scrollTopLog: number[];
}
export interface IStep {
    minDim?: number;
    dim: number;
    dynamic?: boolean;
}
export interface IButtons {
    cancelText: string;
    confirmText: string;
}

export interface IPosition {
    x: number;
    y: number;
  }