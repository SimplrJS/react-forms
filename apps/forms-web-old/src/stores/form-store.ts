import { TinyEmitter, Callback } from "../helpers/emitter";
import produce, { Draft } from "immer";
import { FormState } from "../contracts/form-store";
import { NestedDictionary } from "../contracts/helpers";
import { dehydrateField, hydrateField } from "./form-store.helpers";

export class FormStore extends TinyEmitter<Callback> {
    protected formId: string;
    protected state: FormState;
    protected dehydratedState: NestedDictionary<unknown> = {};

    constructor() {
        super();
        this.formId = "";
        this.state = this.getInitialState(this.formId);
    }

    public getState(): FormState {
        return this.state;
    }

    public update(mutator: (state: Draft<FormState>) => void): void {
        console.info("Updating state...");

        const newState = produce(this.state, draft => {
            return mutator(draft);
        });

        console.info("Updated...");

        if (this.state === newState) {
            console.info("State hasn't changed.");

            return;
        }
        this.state = newState;

        console.info("State has changed. Emitting...");

        this.emit();
    }

    protected getInitialState(id: string): FormState {
        const initialState: FormState = {
            id: id,
            name: id,
            data: {
                dehydratedState: {}
            },
            status: {
                focused: false,
                pristine: true,
                touched: false,
                disabled: false,
                readonly: false
            },
            fields: {},
            dehydrate: dehydrateField,
            hydrate: hydrateField
        };

        return produce<FormState>(initialState, () => {});
    }
}
