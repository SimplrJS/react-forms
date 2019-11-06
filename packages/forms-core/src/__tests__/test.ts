export function stringify(obj: unknown, space: string | number = 4): string {
    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    let cache: unknown[] = [];
    try {
        return JSON.stringify(
            obj,
            function(_key, value) {
                if (typeof value === "object" && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Duplicate reference found, discard key
                        return;
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                if (typeof value === "function") {
                    if (value.name) {
                        return `${value.name} () { ... }`;
                    }

                    return `anonymous () { ... }`;
                }
                return value;
            },
            space
        );
    } finally {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        cache = null; // Enable garbage collection
    }
}
