import produce, { Draft } from "immer";
import { TinyEmitter } from "@reactway/tiny-emitter";
import { FormState } from "../contracts/form-store";
import { NestedDictionary } from "../contracts/helpers";
import { dehydrateField, hydrateField } from "./form-store-helpers";

export class FormStore extends TinyEmitter {
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

    public update(updater: (draft: Draft<FormState>) => void): void {
        const newState = produce(this.state, draft => {
            return updater(draft);
        });

        if (this.state === newState) {
            return;
        }
        this.state = newState;

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
