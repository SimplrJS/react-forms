export function mergeObjectKeys(a: { [key: string]: unknown }, b: { [key: string]: unknown }): string[] {
    const result = Object.keys(a);

    for (const key of Object.keys(b)) {
        if (result.indexOf(key) !== -1) {
            continue;
        }

        result.push(key);
    }

    return result;
}

export function isEqualTypes(a: unknown, b: unknown): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
        return true;
    }

    const aType = typeof a;
    const bType = typeof b;

    if (aType === "object" && bType === "object") {
        return (a === null && b === null) || (a !== null && b !== null);
    }

    if (aType === bType) {
        return a === b;
    }

    return false;
}
