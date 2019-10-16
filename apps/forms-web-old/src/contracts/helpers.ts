export interface Dictionary<TValue> {
    [index: string]: TValue | undefined;
}

export interface NestedDictionary<TValue> {
    [index: string]: TValue | NestedDictionary<TValue> | undefined;
}

export type JsonValue = string | number | boolean | JsonValue[] | NestedDictionary<JsonValue> | null;
