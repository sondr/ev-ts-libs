export function saveAs(blob: File | Blob, filename: string, globalWindow: Window & typeof globalThis = window) {
    const a = globalWindow.document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
    a.download = filename;
    a.rel = 'noopener';
    a.href = globalWindow.URL.createObjectURL(blob);
  
    const timeout = 40 * 1000;
    globalWindow.setTimeout(() => URL.revokeObjectURL(a.href), timeout);
    globalWindow.setTimeout(() => a.click(), 0);
  }
  