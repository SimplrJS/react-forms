/* eslint-disable */

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
