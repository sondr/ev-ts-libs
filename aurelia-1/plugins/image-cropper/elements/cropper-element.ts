import { customElement, bindable, bindingMode } from 'aurelia-framework';
import Cropper from 'cropperjs';
import { mimes } from '../../../../core/mime/mime-types';

import 'cropperjs/dist/cropper.min.css';


export interface IOptions<T extends EventTarget> extends Cropper.Options<T> { }

@customElement('cropper')
export class CropperCustomElement<T extends EventTarget> {
    public element: HTMLImageElement;
    public cropper: Cropper;

    @bindable public dragMode: Cropper.DragMode = 'move';
    dragModeChanged(dragMode: Cropper.DragMode) {
        if (this.cropper?.setDragMode) {
            this.cropper.setDragMode(dragMode);
        }
    }

    @bindable({ defaultBindingMode: bindingMode.oneTime }) public elementCss: Partial<CSSStyleDeclaration> = {
        height: 'auto',
        width: '100%',
        maxHeight: '85vh !important'
    };

    //@bindable({ defaultBindingMode: bindingMode.oneTime }) public responsive: boolean = true;
    //@bindable({ defaultBindingMode: bindingMode.oneTime }) public maxHeight: Number = 85;

    @bindable({ defaultBindingMode: bindingMode.toView }) public options: IOptions<T>;
    @bindable({ defaultBindingMode: bindingMode.toView }) public src: string;
    @bindable({ defaultBindingMode: bindingMode.toView }) public title: string;

    @bindable({ defaultBindingMode: bindingMode.toView }) public cropStart: (event: CustomEvent) => void;
    @bindable({ defaultBindingMode: bindingMode.toView }) public cropMove: (event: CustomEvent) => void;
    @bindable({ defaultBindingMode: bindingMode.toView }) public cropEnd: (event: CustomEvent) => void;
    @bindable({ defaultBindingMode: bindingMode.toView }) public crop: (event: CustomEvent) => void;
    @bindable({ defaultBindingMode: bindingMode.toView }) public zoom: (event: CustomEvent) => void;

    private attached() { }

    private detached() {
        this.cropper.destroy();
    }

    public toLog() {
        console.log("CropBoxData", this.cropper.getCropBoxData());
        console.log("getData", this.cropper.getData());
        console.log("getImageData", this.cropper.getImageData());
        console.log("getCanvasData", this.cropper.getCanvasData());
    }

    public toFile(filename?: string, mimeType: string = 'image/jpeg'): Promise<File> {
        const promise = new Promise<File>((resolve, reject) => {
            if (this.cropper) {
                const extension = mimes.image.findExtension(mimeType);
                this.cropper
                    .getCroppedCanvas()
                    .toBlob((b => {
                        resolve(new File([b!], filename || `file.${extension ?? 'jpeg'}`));
                    }), mimeType);
            } else {
                reject();
            }
        });
        return promise;
    }

    public toDataUrl(mimeType: string = 'image/jpeg'): string | undefined {
        return this.cropper?.getCroppedCanvas()
            .toDataURL(mimeType);
    }

    loaded($event) {
        this.init();
    }

    private init() {
        let defaultOptions: IOptions<any> = {
            viewMode: 0, // 2 //CropperViewMods.CropBoxIsJustWithInTheContainer,
            dragMode: this.dragMode, //<any>'crop', // crop | move | none
            //aspectRatio: NaN,
            data: undefined,
            responsive: true,
            restore: true
        };

        if (this.cropStart) defaultOptions.cropstart = (event) => { this.cropStart(event); };
        if (this.cropMove) defaultOptions.cropmove = (event) => { this.cropMove(event); };
        if (this.cropEnd) defaultOptions.cropend = (event) => { this.cropEnd(event); };
        if (this.crop) defaultOptions.crop = (event) => { this.crop(event); };
        if (this.zoom) defaultOptions.zoom = (event) => { this.zoom(event); };

        let opts = Object.assign(defaultOptions, this.options || {});

        this.cropper = new Cropper(this.element, opts);
    }

}


/*
  VIEWMODE:
  Type: Number
  Default: 0
  Options:
  0: no restrictions
  1: restrict the crop box not to exceed the size of the canvas.
  2: restrict the minimum canvas size to fit within the container. If the proportions of the canvas and the container differ, the minimum canvas will be surrounded by extra space in one of the dimensions.
  3: restrict the minimum canvas size to fill fit the container. If the proportions of the canvas and the container are different, the container will not be able to fit the whole canvas in one of the dimensions.

  DRAGMODE:
  Type: String
  Default: 'crop'
  Options:
  'crop': create a new crop box
  'move': move the canvas
  'none': do nothing
 */
