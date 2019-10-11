import { FormState, FieldState } from "../contracts/form-store";
import { JsonValue, NestedDictionary } from "../contracts/helpers";

export const dehydrateFields = (state: FieldState): NestedDictionary<JsonValue> => {
    const result: NestedDictionary<JsonValue> = {};

    for (const fieldId of Object.keys(state.fields)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const field = state.fields[fieldId]!;
        result[field.name] = field.dehydrate(field);
    }

    return result;
};

export const hydrateField = (value: JsonValue): FieldState => {
    return {
        dehydrate: dehydrateFields,
        hydrate: hydrateField,
        data: {
            
        }
    };
}