export function addAttrs(el?: HTMLElement, attrs?: { [key: string]: string }) {
    if (el && attrs) {
        Object.keys(attrs).forEach(k => {
            el.setAttribute(k, attrs[k]);
        });
    }
}
export function removeAttrs(el?: HTMLElement, attrs?: { [key: string]: string }) {
    if (el && attrs) {
        Object.keys(attrs).forEach(k => {
            el.removeAttribute(k);
        });
    }
}