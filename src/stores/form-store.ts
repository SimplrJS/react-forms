import { TinyEmitter, Callback } from "../helpers/emitter";
import produce, { Draft } from "immer";
import { FormState } from "../contracts/form-store";
import { NestedDictionary } from "../contracts/helpers";
import { dehydrateFields } from "./form-store.helpers";

export class FormStore extends TinyEmitter<Callback> {
    protected state: FormState = emptyImmutable;
    protected dehydratedState: NestedDictionary = emptyImmutable;

    public getState(): FormState {
        return this.state;
    }

    public mutateState(mutator: (state: Draft<FormState>) => FormState | void): void {
        this.state = produce(this.state, mutator);
    }

    protected getInitialState(id: string): FormState {
        const initialState: FormState = {
            id: id,
            name: id,
            data: {},
            status: {
                focused: false,
                pristine: true,
                touched: false,
                disabled: false,
                readonly: false
            },
            fields: {},
            dehydrate: dehydrateFields,
            hydrate: hydrateField
        };

        return produce<FormState>(initialState, () => {});
    }
}
