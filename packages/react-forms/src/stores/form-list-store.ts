import { BaseStore } from "../abstractions/base-store";
import { FormStore, FormStoreData } from "./form-store";

import { StoreHydrated } from "../actions/store-actions";
import { FormRegistered, FormUnregistered, FormStoreHydrated } from "../actions/form-list-actions";

export interface FormListStoreState {
    forms: { [key: string]: FormStore };
}

export interface FormListStoreData {
    forms: { [key: string]: FormStoreData };
}

export class FormListStore extends BaseStore<FormListStoreState, FormListStoreData> {
    private storesCount: number = 0;

    protected getInitialState(): FormListStoreState {
        return {
            forms: {}
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

        if (this.getState().forms[formId] != null) {
            throw Error(`@simplr/react-forms: Form '${customFormId}' already exists.`);
        }

        const storeInstance: FormStore = new FormStore(formId);

        this.setState(new FormRegistered(formId), state => ({
            forms: {
                ...state.forms,
                [formId]: storeInstance
            }
        }));

        return formId;
    }

    public unregisterForm(formId: string): void {
        this.setState(new FormUnregistered(formId), state => {
            const form = this.getState().forms[formId];
            if (form == null) {
                return state;
            }

            const { [formId]: deletedForm, ...restForms } = state.forms;

            return {
                ...state,
                forms: restForms
            };
        });
    }

    public getForm(formId: string): FormStore | undefined {
        return this.getState().forms[formId];
    }

    public getForms(): { [key: string]: FormStore | undefined } {
        return this.getState().forms;
    }

    public hydrateForm(formId: string, data: FormStoreData): void {
        this.setState(new FormStoreHydrated(formId), state => {
            const formStore = state.forms[formId] || new FormStore(formId);
            formStore.hydrate(data);

            return {
                ...state,
                forms: {
                    ...state.forms,
                    [formId]: formStore
                }
            };
        });
    }

    public hydrate(data: FormListStoreData): void {
        this.setState(new StoreHydrated(), () => {
            const nextState = this.getInitialState();

            for (const formId in data.forms) {
                if (data.forms.hasOwnProperty(formId)) {
                    const form = new FormStore(formId);
                    form.hydrate(data.forms[formId]);

                    nextState.forms[formId] = form;
                }
            }

            return nextState;
        });
    }

    public dehydrate(): FormListStoreData {
        const state = this.getState();
        const data: FormListStoreData = {
            forms: {}
        };

        for (const formId in state.forms) {
            if (data.forms.hasOwnProperty(formId)) {
                data.forms[formId] = state.forms[formId].dehydrate();
            }
        }

        return data;
    }
}
