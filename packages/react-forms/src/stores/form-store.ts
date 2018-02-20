import { BaseStore } from "../abstractions/base-store";
import { FieldStore, FieldStoreData } from "./field-store";

import { StoreHydrated } from "../actions/store-actions";
import { FieldRegistered, FieldUnregistered } from "../actions/field-actions";

export interface FormStoreState {
    fields: { [key: string]: FieldStore };
}

export interface FormStoreData {
    fields: { [key: string]: FieldStoreData };
}

export class FormStore extends BaseStore<FormStoreState, FormStoreData> {
    constructor(protected readonly formId: string) {
        super();
    }

    protected getInitialState(): FormStoreState {
        return {
            fields: {}
        };
    }

    public registerField(fieldId: string): void {
        if (this.getState().fields[fieldId] != null) {
            throw Error(`@simplr/react-forms: Field '${fieldId}' in '${this.formId}' already exists.`);
        }

        const storeInstance: FieldStore = new FieldStore(this.formId, fieldId);

        this.setState(new FieldRegistered(fieldId), state => ({
            fields: {
                ...state.fields,
                [`${fieldId}`]: storeInstance
            }
        }));
    }

    public unregisterField(fieldId: string): void {
        this.setState(new FieldUnregistered(fieldId), state => {
            const form = this.getState().fields[fieldId];
            if (form == null) {
                return state;
            }

            const { [`${fieldId}`]: deletedField, ...restFields } = state.fields;

            return {
                ...state,
                fields: restFields
            };
        });
    }

    public getField(fieldId: string): FieldStore | undefined {
        return this.getState().fields[fieldId];
    }

    public getFields(): { [key: string]: FieldStore | undefined } {
        return this.getState().fields;
    }

    public hydrate(data: FormStoreData): void {
        const state = this.getInitialState();

        for (const fieldId in data.fields) {
            if (data.fields.hasOwnProperty(fieldId)) {
                const field = new FieldStore(this.formId, fieldId);
                field.hydrate(data.fields[fieldId]);

                state.fields[fieldId] = field;
            }
        }

        this.emit(new StoreHydrated());
    }

    public dehydrate(): FormStoreData {
        const state = this.getState();
        const data: FormStoreData = {
            fields: {}
        };

        for (const fieldId in state.fields) {
            if (state.fields.hasOwnProperty(fieldId)) {
                data.fields[fieldId] = state.fields[fieldId].dehydrate();
            }
        }

        return data;
    }
}
