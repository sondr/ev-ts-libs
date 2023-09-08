export function addStyles(el?: HTMLElement, css?: Partial<CSSStyleDeclaration>) {
    if (el && css) {
        Object.keys(css).forEach(k => {
            el.style[k] = css[k];
        });
    }
}
export function removeStyles(el?: HTMLElement, css?: Partial<CSSStyleDeclaration>) {
    if (el && css) {
        Object.keys(css).forEach(k => {
            el.style[k] = undefined;
        });
    }
}