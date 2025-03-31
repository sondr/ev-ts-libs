export class FileinputCall {
  private el: HTMLInputElement | null = null;

  constructor(private readonly doc: Document = document) {}

  public call(opts?: IFileInputOptions): Promise<FileList> {
    this.init(opts);
    return new Promise((resolve) => {
      this.el!.onchange = () => {
        const files = this.el!.files;
        this.destroy(); // Clean up after selection
        resolve(files!);
      };
      this.el!.click();
    });
  }

  private init(opts?: IFileInputOptions) {
    this.destroy();
    this.el = this.doc.createElement('input');
    this.el.type = 'file';
    // Hide the input element
    this.el.style.display = 'none';
    // Append to the document to ensure the file picker works in all browsers
    this.doc.body.appendChild(this.el);

    // Allowed options for the file input element
    const allowedOptions: (keyof IFileInputOptions)[] = [
      'multiple',
      'accept',
      'capture',
      'webkitdirectory',
    ];
    if (opts) {
      allowedOptions.forEach((key) => {
        if (opts[key] !== undefined) {
          (this.el as any)[key] = opts[key];
        }
      });
    }
  }

  public destroy() {
    if (this.el && this.el.parentElement) {
      this.el.parentElement.removeChild(this.el);
      this.el = null;
    }
  }
}

export interface IFileInputOptions {
  multiple?: boolean;
  accept?: string;
  capture?: string; // e.g., 'user' for the front camera or 'environment' for the rear camera on mobile devices
  webkitdirectory?: boolean;
}