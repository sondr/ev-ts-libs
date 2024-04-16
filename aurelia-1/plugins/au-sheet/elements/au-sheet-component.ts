import { inject, bindable, customElement, DOM, PLATFORM } from 'aurelia-framework';
import { DragEventHandler, IPosition } from '../au-drag';

/*
  Should add interactive-widget=resizes-content to the meta tag in the index.html file if content is input/needs soft keyboard
  <meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content">
*/

type Direction = 'expand' | 'shrink';
type Placement = 'top' | 'bottom' | 'left' | 'right';

const dragHandlerTop = 17;


const steps: IStep[] = [
    { minDim: 200, dim: 40, dynamic: true },
    { minDim: 200, dim: 100 }
];

interface IAuAutoClose {
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

const defaultOptions = () => ({
    autoClose: {
        overlay: false,
        //confirm: false,
        //cancel: false
    },
    showFooter: false,
    zIndex: 1000,
    showDragHandle: true
} as IAuSheetOptions);


@inject(DOM.Element)
@customElement('au-sheet')
export class AuSheetComponent {
    //actionButtons: any[];
    currentSize: Partial<ISize>;

    @bindable public options: IAuSheetOptions;
    @bindable public title: string;
    @bindable public placement: Placement;
    @bindable public showFooter: boolean;
    @bindable public zIndex: number;
    @bindable public showDragHandle: boolean;


    @bindable public padElement: HTMLElement; // element to pad when sheet is open
    @bindable public isOpen: boolean = false;

    // events
    @bindable beforeClose: (sheet: AuSheetComponent) => boolean | void | Promise<boolean | void>;
    @bindable afterClose: (sheet: AuSheetComponent) => void;
    @bindable beforeOpen: (sheet: AuSheetComponent) => boolean | void | Promise<boolean | void>;
    @bindable afterOpen: (sheet: AuSheetComponent) => void;
    @bindable steps = steps;

    private currentStep: IStep;
    private template: string;

    private bodyHandler: DragEventHandler<IContentData>;
    private dragHandler: DragEventHandler<IDragData>;

    private pushElement: HTMLElement;

    private readonly sheetElement: HTMLDivElement;
    private readonly overlayElement: HTMLDivElement;
    private readonly contentElement: HTMLDivElement;
    private readonly dragHandleElement: HTMLDivElement;
    private readonly bodyElement: HTMLDivElement;

    bodyStartSize: ISize;
    constructor() {
        this.iosWorkaround = () => {
            const vv = (PLATFORM.global as Window).visualViewport;
            //this.sheetElement.style.top = `${vv.height}px`;
            console.log("instan apple");
            console.log(vv);
        };

        this.pusher = new (PLATFORM.global as Window & typeof globalThis).ResizeObserver(() => {
            this.attachPadToElement();
        });
    }

    initialPad: Partial<CSSStyleDeclaration>;
    attachPadToElement() {
        if (!this.padElement) { return; }
        if (!this.initialPad) {
            this.initialPad = { width: this.padElement.style.width, height: this.padElement.style.height };
        }
        const cr = this.contentElement.getBoundingClientRect();
        this.padElement.style.paddingBottom = `${cr.height}px`;
    }
    detachPadToElement() {
        if (!this.padElement || !this.initialPad?.height) { return; }
        this.padElement.style.paddingBottom = this.initialPad.height;
    }


    bind(context: any) {
        //this.styling = CssBuilder.create(this);
        this.buildOptions();
    }

    buildOptions() {
        const options = defaultOptions();
        Object.assign(options, this.options ?? {});
        this.options = options;
        this.title = this.title ?? options.title;
        this.placement = this.placement ?? options.placement;
        this.zIndex = this.zIndex ?? options.zIndex;
        this.showFooter = this.showFooter === false ? false : options.showFooter ?? false;
        this.showDragHandle = this.showDragHandle === false ? false : options.showDragHandle ?? false;
    }

    attached() {
        const step = this.steps[0];
        this.snap(step);
        this.setupDragHandler();
        this.setupBodyHandler();
        this.sheetElement.style.zIndex = `${this.zIndex}`;
    }

    detached() {
        this.stopListening();
    }

    overlayClick() {
        if (this.options?.autoClose?.overlay) { this.close(); }
    }

    public async close() {
        if (this.beforeClose) {
            const canClose = await this.beforeClose(this);
            if (canClose === false) { return; }
        }
        this.isOpen = false;
        this.sheetElement.classList.remove('show');
        this.stopListening();
        this.detachPadToElement();

    }

    public async open() {
        if (this.beforeOpen) {
            const canOpen = await this.beforeOpen(this);
            if (canOpen === false) { return; }
        }
        this.startListening();
        //this.padElementFn();
        this.sheetElement.classList.add('show');
        this.isOpen = true;

        if (this.afterOpen) { this.afterOpen(this); }
    }



    private startListening() {
        this.dragHandler?.start();
        this.bodyHandler?.start();
        (PLATFORM.global as Window)?.visualViewport?.addEventListener('resize', this.iosWorkaround);
        this.pusher.observe(this.contentElement);
        //this.contentElement.addEventListener('resize', this.pusher);
    }

    private stopListening() {
        this.dragHandler?.dispose();
        this.bodyHandler?.dispose();
        (PLATFORM.global as Window)?.visualViewport?.removeEventListener('resize', this.iosWorkaround);
        this.pusher.unobserve(this.contentElement);
        //this.contentElement.removeEventListener('resize', this.pusher);
    }

    pusher: ResizeObserver;
    iosWorkaround: () => void;

    private setupBodyHandler() {
        const element = this.bodyElement
        if (!element) { return; }
        const handler = DragEventHandler.create<IContentData>(element, { positionType: 'client', passiveListeners: false })
        handler.onStart = (start, event, data) => {
            const scrollTopLog = [element.scrollTop];
            const positionLog = [];
            return { scrollTopLog, positionLog };
        };
        handler.onMove = (position, startPosition, event, data) => {
            const outOfBounds = element.scrollTop < 0 || element.scrollTop > element.clientHeight;
            if (outOfBounds) { event.preventDefault(); }

            data?.positionLog.push(position);
            data?.scrollTopLog.push(element.scrollTop);

            const contentNotScrollable = element.clientHeight == element.scrollHeight;
            if (contentNotScrollable) { event.preventDefault(); }
        };
        handler.onEnd = (position, startPos, event, data) => {
            if (data!.positionLog.length < 3) { return; }
            const startScrollTop = data!.scrollTopLog[0];
            const currentScrollTop = element.scrollTop;

            const scrolled = startScrollTop !== currentScrollTop;

            if (scrolled) {
                return;
            }
            const firstPosition = data!.positionLog[0];
            const lastPosition = data!.positionLog[data!.positionLog.length - 1];
            const posDelta = firstPosition.y - lastPosition.y;
            const direction: Direction = posDelta > 0 ? 'expand' : 'shrink';
            const step = this.findStep(direction);


            // rescroll for ios buggy behavior
            if (element.scrollTop < 0) { element.scrollTop = 0; }
            if (element.scrollTop > element.clientHeight) { element.scrollTop = element.clientHeight; }

            if (step) { this.snap(step); }
        };

        // .onMove()
        // .onEnd();

        this.bodyHandler = handler;
    }

    private setupDragHandler() {
        if (!this.dragHandleElement) { return; }

        const handler = DragEventHandler.create<IDragData>(this.dragHandleElement, { positionType: 'client', passiveListeners: false });
        handler.onStart = (position, event) => {
            const handle = this.findRelativePosition(this.dragHandleElement);
            this.sheetElement.classList.add("dragging");
            return { handle };
        };
        handler.onMove = (position, startPosition, event, data) => {
            event.preventDefault();
            const size = this.calculate(position, startPosition, data);
            this.update(size);
        };
        handler.onEnd = (position, startPosition, data) => {
            this.sheetElement.classList.remove("dragging");

            const direction = this.findDirection(position, startPosition);
            let step = this.findStep(direction);
            if (!step) {
                step = this.findClosestStep(this.currentSize);
            }
            this.snap(step);
        };

        this.dragHandler = handler;
    }

    findStep(direction: Direction) {
        return direction === 'expand' ? this.findNextStep() : this.findPrevStep();
    }

    findDirection(position: IPosition, startPosition: IPosition): Direction {
        let direction: Direction;
        switch (this.placement) {
            case 'top':
                break;
            case 'right':
                break;
            case 'bottom':
                direction = position.y > startPosition.y ? 'shrink' : 'expand';
                break;
            case 'left':
                break;
        }

        return direction!;
    }


    private findRelativePosition(el: HTMLElement) {
        const dims: ISize = { h: 0, w: 0 };
        if (el) {
            dims.h = el.clientHeight + el.offsetTop;
            dims.w = el.clientWidth + el.offsetLeft;
        }

        return dims;
    }

    private calculate(current: IPosition, start: IPosition, data) {
        const size: Partial<ISize> = {};
        //if (this.placement == 'top') {}
        //if (this.placement == 'right') { }
        if (this.placement == 'bottom') {
            const innerHeight = window.innerHeight;
            const handle = ((data?.handle?.h ?? 0) / 2) / innerHeight;
            const delta = start.y - current.y;
            const moveHeight = (delta / innerHeight) - handle;
            const startHeight = 1 - (start.y / innerHeight);
            size.h = (startHeight + moveHeight) * 100;
        }
        //if (this.placement == 'left') { }


        return size;
    }




    private update(size: Partial<ISize>, snap: boolean = false) {
        switch (this.placement) {
            case 'top':
            case 'bottom':
                this.contentElement.style.height = `${size.h}dvh`;
                break;
            case 'right':
            case 'left':
                this.contentElement.style.width = `${size.w}dvw`;
                break;
        }
        this.currentSize = size;
    }

    findClosestStep(size: Partial<ISize>) {
        const dim = (this.placement === 'top' || this.placement === 'bottom') ? size.h : size.w;
        return this.steps.reduce((prev, curr) => Math.abs(curr.dim - dim!) < Math.abs(prev.dim - dim!) ? curr : prev);
    }

    findPrevStep() {
        let step: IStep;
        const index = this.steps.indexOf(this.currentStep);
        if (index > 0) {
            step = this.steps[index - 1];
        }
        return step!;
    }

    findNextStep() {
        let step: IStep;
        const index = this.steps.indexOf(this.currentStep);
        if (index < this.steps.length - 1) {
            step = this.steps[index + 1];
        }
        return step!;
    }

    snap(step: IStep) {
        switch (this.placement) {
            case 'top':
            case 'bottom':
                console.log("dynamic: " + step.dynamic);
                this.contentElement.style.minHeight = step.minDim ? `${step.minDim}px` : '';
                this.contentElement.style.height = step.dynamic ? '' : `${step.dim}dvh`;


                break;
            case 'right':
            case 'left':
                this.contentElement.style.minWidth = step.minDim ? `${step.minDim}px` : '';
                this.contentElement.style.width = `${step.dim}dvw`;
                break;
        }
        this.currentStep = step;
    }

}


interface ISize {
    w: number;
    h: number;
}
interface IDragData {
    handle: ISize;
}
interface IContentData {
    positionLog: IPosition[];
    scrollTopLog: number[];
}
interface IStep {
    minDim?: number;
    dim: number;
    dynamic?: boolean;
}
interface IButtons {
    cancelText: string;
    confirmText: string;
}
