import { BaseStore } from "../abstractions/base-store";
import { FormStore, FormStoreData } from "./form-store";

import { StoreHydrated } from "../actions/store-actions";
import { FormRegistered, FormUnregistered } from "../actions/form-list-actions";

export interface FormListStoreState {
    Forms: { [key: string]: FormStore };
}

export interface FormListStoreData {
    Forms: { [key: string]: FormStoreData };
}

export class FormListStore extends BaseStore<FormListStoreState, FormListStoreData> {
    private storesCount: number = 0;

    protected getInitialState(): FormListStoreState {
        return {
            Forms: {}
        };
    }

    protected getFormStoreId(formNumber: number): string {
        return `form-store-${formNumber}`;
    }

    /**
     * Returns unique incremental store id.
     */
    public getNextStoreId(): string {
        return this.getFormStoreId(++this.storesCount);
    }

    public registerForm(customFormId?: string): string {
        if (customFormId != null) {
            // To keep store count present nomatter the customFormId was given
            ++this.storesCount;
        }

        const formId = customFormId || this.getNextStoreId();

        if (this.getState().Forms[formId] != null) {
            throw Error(`@simplr/react-forms: Form '${customFormId}' already exists.`);
        }

        const storeInstance: FormStore = new FormStore(formId);

        this.setState(new FormRegistered(formId), state => ({
            Forms: {
                ...state.Forms,
                [`${formId}`]: storeInstance
            }
        }));

        return formId;
    }

    public unregisterForm(formId: string): void {
        const form = this.getState().Forms[formId];
        if (form == null) {
            return;
        }

        this.setState(new FormUnregistered(formId), state => {
            const { [`FormId`]: deletedForm, ...restForms } = state.Forms;

            return {
                Forms: restForms
            };
        });
    }

    public getForm(formId: string): FormStore | undefined {
        return this.getState().Forms[formId];
    }

    public getForms(): { [key: string]: FormStore | undefined } {
        return this.getState().Forms;
    }

    public hydrate(data: FormListStoreData): void {
        const state = this.getInitialState();

        for (const formId in data.Forms) {
            if (data.Forms.hasOwnProperty(formId)) {
                const form = new FormStore(formId);
                form.hydrate(data.Forms[formId]);

                state.Forms[formId] = form;
            }
        }

        this.emit(new StoreHydrated());
    }

    public dehydrate(): FormListStoreData {
        const state = this.getState();
        const data: FormListStoreData = {
            Forms: {}
        };

        for (const formId in state.Forms) {
            if (data.Forms.hasOwnProperty(formId)) {
                data.Forms[formId] = state.Forms[formId].dehydrate();
            }
        }

        return data;
    }
}
