import { FormState, FieldState, FormStatus, FormStateUpdater, FieldData } from "../contracts/form-store";
import { JsonValue, NestedDictionary } from "../contracts/helpers";
import { SEPARATOR } from "./constants";

export const dehydrateField = (state: FieldState | FormState): NestedDictionary<JsonValue> => {
    throw new Error(`Not implemented: hydrate(${JSON.stringify(state)})`);
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

export const generateFieldId = (name: string, parentId: string | undefined): string => {
    if (parentId == null) {
        return name;
    }
    return `${parentId}${SEPARATOR}${name}`;
};

export function getDefaultStatuses(): FormStatus {
    return {
        disabled: false,
        touched: false,
        focused: false,
        pristine: true,
        readonly: false
    };
}

export function registerField<TFieldState extends FieldState<any>>(
    state: FormState,
    id: string,
    initialFieldState: Omit<TFieldState, "id" | "fields">
): void {
    if (state.fields[id] != null) {
        throw new Error(`Field '${id}' has been already registered.`);
    }

    // Add field into state
    state.fields[id] = {
        ...initialFieldState,
        id: id,
        fields: {}
    };
}

export function getDefaultFieldData<TValue, TRenderValue>(
    defaultValue: TValue,
    initialValue: TValue,
    currentValue?: TValue
): FieldData<TValue, TRenderValue> {
    if (initialValue == null) {
        initialValue = defaultValue;
    }

    if (currentValue == null) {
        currentValue = initialValue;
    }

    return {
        defaultValue,
        initialValue,
        currentValue
    };
}

export function updateField(state: FormState, id: string, updater: FormStateUpdater<FieldState>): void {
    const field = state.fields[id];
    if (field == null) {
        throw new Error(`Field '${id}' has been already registered.`);
    }
    updater(field);
}

export function updateCurrentValue(state: FieldState, value: unknown): void {
    state.data.currentValue = value;
}
