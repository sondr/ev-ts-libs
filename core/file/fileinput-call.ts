export class FileinputCall {
    constructor(
        private readonly doc: Document = document
        ) {}
  
    public el: HTMLInputElement | null;
  
    public call(opts?: IFileInputOptions): Promise<FileList | null> {
      this.init(opts);
      return new Promise((resolve, reject) => {
        this.el!.onchange = e => resolve(this.el!.files);
        this.el!.click();
      });
    }
  
    private init(opts?: IFileInputOptions) {
      this.destroy();
      this.el = this.doc.createElement('input');
      this.el.type = 'file';
      
      
      if (opts) {
        if (opts.multiple) {
          this.el.multiple = true;
        }
  
        if (opts.accept) {
          this.el.accept = opts.accept;
        }
  
      }
  
      if (opts) {
        Object.keys(opts).forEach(key =>
          this.el![key] = opts[key]);
      }
    }
  
    public destroy() {
      if (this.el) {
        this.el.remove();
        this.el = null;
      }
    }
  }
  
  export interface IFileInputOptions {
    multiple?: boolean;
    accept?: string;
  }
  