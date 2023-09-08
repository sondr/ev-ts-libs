export function removeClasses(el?: HTMLElement, classes?: string[] | string) {
    if (el && classes?.length) {
        let list = typeof classes == 'string' ? classes.split(' ') : classes;
        el.classList.remove(...list);
    }
}

export function addClasses(el?: HTMLElement, classes?: string[] | string) {
    if (el && classes?.length) {
        let list = typeof classes == 'string' ? classes.split(' ') : classes;
        el.classList.remove(...list);
    }
}