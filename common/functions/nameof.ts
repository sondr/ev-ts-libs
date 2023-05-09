export function nameof<T>(selector: (s: T) => any, deep = true) {
    const s = '' + selector;
    const m = s.match(/return\s+([A-Z0-9$_.]+)/i)
        || s.match(/.*?(?:=>|function.*?{(?!\s*return))\s*([A-Z0-9$_.]+)/i);
    const name = m && m[1] || "";
    const splitted = name.split('.');
    splitted.shift();

    return deep ? splitted.join('.') : splitted.pop() ?? '';
}