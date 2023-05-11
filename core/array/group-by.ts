export function groupBy<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
        const groupKey = fn(curr);
        prev[groupKey] = prev[groupKey] || [];
        prev[groupKey].push(curr);
        return prev;
    }, {});
}