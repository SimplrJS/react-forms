import { FormState, FieldState } from "../contracts/form-store";
import { JsonValue, NestedDictionary } from "../contracts/helpers";

export const dehydrateField = (state: FieldState | FormState): NestedDictionary<JsonValue> => {
    const result: NestedDictionary<JsonValue> = {};

    for (const fieldId of Object.keys(state.fields)) {
        // TODO: Make sure no-null-assertion is correct here.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const field = state.fields[fieldId]!;
        result[field.name] = field.dehydrate(field);
    }

    return result;
};

export const hydrateField = (value: JsonValue): FieldState => {
    throw new Error(`Not implemented: hydrate(${JSON.stringify(value)})`);
};
