import { FormStoreState } from "./form-store-test";
import { Draft } from "immer";

export function registerField(
    id: string,
    defaultValue: unknown,
    initialValue: unknown,
    currentValue: unknown,
    transientValue: unknown
): (state: Draft<FormStoreState>) => void {
    return state => {
        if (state.fields[id] != null) {
            throw new Error(`Field ${id} already exists.`);
        }
        state.fields[id] = { id, currentValue, defaultValue, initialValue, transientValue };
    };
}

type Mutator<TParams extends object = {}> = (state: Draft<FormStoreState>, params: TParams) => void;

interface UpdateFieldValueParams {
    a: string;
}

export const updateFieldValue: Mutator<UpdateFieldValueParams> = (state, params) => {
    console.info(state, params);
};

export function registerField2(
    state: Draft<FormStoreState>,
    id: string,
    defaultValue: unknown,
    initialValue: unknown,
    currentValue: unknown,
    transientValue: unknown
): void {
    if (state.fields[id] != null) {
        throw new Error(`Field ${id} already exists.`);
    }
    state.fields[id] = { id, currentValue, defaultValue, initialValue, transientValue };
}

// export function updateFieldValue(state: Draft<FormStoreState>, id: string, value: unknown): void {
//     const field = state.fields[id];

//     if (field == null) {
//         throw new Error(`Field ${id} does not exist.`);
//     }

//     field.currentValue = value;
// }

// type StateMutator = (state: FormStoreState) => void;

// export function updateFieldValue2(id: string, value: unknown): StateMutator {
//     return state => {
//         const field = state.fields[id];

//         if (field == null) {
//             throw new Error(`Field ${id} does not exist.`);
//         }

//         field.currentValue = value;
//     };
// }

declare const store: {
    mutate: (mutator: (state: Draft<FormStoreState>) => void) => void;
};

store.mutate(state => {
    registerField2(state, "field-1", "default", "initial", "current", "transient");
    registerField2(state, "field-2", "default", "initial", "current", "transient");
    registerField2(state, "field-3", "default", "initial", "current", "transient");
    registerField2(state, "field-4", "default", "initial", "current", "transient");

    const fields = [
        {
            id: "field-1",
            defaultValue: "default",
            initialValue: "initial",
            currentValue: "current",
            transientValue: "transient"
        },
        {
            id: "field-2",
            defaultValue: "default",
            initialValue: "initial",
            currentValue: "current",
            transientValue: "transient"
        },
        {
            id: "field-3",
            defaultValue: "default",
            initialValue: "initial",
            currentValue: "current",
            transientValue: "transient"
        },
        {
            id: "field-4",
            defaultValue: "default",
            initialValue: "initial",
            currentValue: "current",
            transientValue: "transient"
        }
    ];

    const registerWithCurrentState = (...params: ) => registerField2(state);

    R.chain(R.map(fields), 
});
// store.mutate(registerField2(id, defaultValue));
