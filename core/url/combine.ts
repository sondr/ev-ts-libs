export function urlCombine(...parts: string[]){
    return parts.join("/").replace(/([^:]\/)\/+/g, "$1");
}