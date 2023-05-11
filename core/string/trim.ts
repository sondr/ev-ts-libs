export function trimWhiteSpace(s: string, allOccurences: boolean = true) {
    return s.replace(new RegExp('\\s', allOccurences ? 'g' : undefined), "");
}