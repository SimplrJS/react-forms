import * as Immutable from "immutable";
import { FormStore } from "./form-store";

export class FormStoresHandlerClass {
    private storeCount = 0;
    private formStores = Immutable.Map<string, FormStore>();

    protected GetFormStoreId(formNumber: number) {
        return `form-store-${formNumber}`;
    }

    public NextStoreId() {
        return this.GetFormStoreId(++this.storeCount);
    }

    /**
     * Registers new form with unique formId.
     * If form exists with the same formId error will occurs.
     * 
     * Custom store instance can be given.
     * 
     * @param {string} [formId]
     * @param {*} [store]
     * @returns
     * 
     * @memberOf FormStoreHandlerBase
     */
    public RegisterForm(customFormId?: string, store?: any) {
        let formId = customFormId || this.NextStoreId();

        if (this.formStores.get(formId) != null) {
            throw new Error(`simplr-forms-core: Form '${customFormId}' already exist.`);
        }

        // Create store instance
        let storeInstance: FormStore = store || new FormStore(formId);

        // Add instance to formStores map by its id
        this.formStores = this.formStores.set(formId, storeInstance);

        return formId;
    }

    /**
     * Destroys store instance.
     * 
     * @param {string} formId
     * 
     * @memberOf FormStoreHandlerBase
     */
    public UnregisterForm(formId: string) {
        let store = this.formStores.get(formId);
        if (store != null) {
            this.formStores = this.formStores.delete(formId);
        }
    }

    /**
     * Gets form store instance, if it doesn't exist it will return undefined.
     * 
     * @param {string} formId
     * @returns
     * 
     * @memberOf FormStoreHandlerBase
     */
    public GetStore(formId: string) {
        return this.formStores.get(formId);
    }

    /**
     * Returns `true` if store exists.
     * 
     * @param {string} formId
     * @returns
     * 
     * @memberOf FormStoreHandlerBase
     */
    public Exists(formId: string) {
        return this.formStores.get(formId) != null;
    }
}

export var FormStoresHandler = new FormStoresHandlerClass();
