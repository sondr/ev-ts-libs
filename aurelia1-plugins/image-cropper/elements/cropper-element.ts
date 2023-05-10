import { customElement, bindable, bindingMode } from 'aurelia-framework';
import Cropper from 'cropperjs';

@customElement('cropper')
export class CropperCustomElement {
    public element: HTMLImageElement;
    public cropper: Cropper;

    @bindable public dragMode: Cropper.DragMode = 'move';
    dragModeChanged(dragMode: Cropper.DragMode) {
        if (this.cropper?.setDragMode) {
            this.cropper.setDragMode(dragMode);
        }
    }

    @bindable({ defaultBindingMode: bindingMode.oneTime }) public responsive: boolean = true;
    @bindable({ defaultBindingMode: bindingMode.oneTime }) public maxHeight: Number = 85;

    @bindable({ defaultBindingMode: bindingMode.toView }) public options: Cropper.Options<any>;
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

    public getData() {
        console.log("CropBoxData", this.cropper.getCropBoxData());
        console.log("getData", this.cropper.getData());
        console.log("getImageData", this.cropper.getImageData());
        console.log("getCanvasData", this.cropper.getCanvasData());
    }

    public getFile(filename?: string, mimeType: string = 'image/jpeg'): Promise<File> {
        if (this.cropper) {

            return new Promise((res, rej) => {
                this.cropper.getCroppedCanvas().toBlob((b => {
                    res(new File([b!], filename || "file.png"));
                }), mimeType);
            });

        }

        return new Promise((res, rej) => rej());
    }

    public getDataUrl(mimeType: string = 'image/jpeg'): string | undefined {
        //mimeType = mimeType || 'image/jpeg';
        if (this.cropper) {
            return this.cropper
                .getCroppedCanvas()
                .toDataURL(mimeType);
        }

        return undefined;
    }

    loaded($event) {
        this.init();
    }

    private init() {
        let defaultOptions: Cropper.Options<any> = {
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
