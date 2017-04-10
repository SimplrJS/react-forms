import * as Immutable from "immutable";
import { FormStore } from "./form-store";

export class FormStoresHandlerClass {
    private storesCount: number;
    private formStores: Immutable.Map<string, FormStore>;

    constructor() {
        this.resetFormStores();
    }

    protected GetFormStoreId(formNumber: number) {
        return `form-store-${formNumber}`;
    }

    public NextStoreId() {
        return this.GetFormStoreId(++this.storesCount);
    }

    /**
     * Returns count of currently registered stores
     * 
     * @readonly
     * 
     * @memberOf FormStoresHandlerClass
     */
    public get StoresCount() {
        return this.formStores.count();
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
        if (customFormId != null) {
            // To keep store count present nomatter the customFormId was given
            ++this.storesCount;
        }

        const formId = customFormId || this.NextStoreId();

        if (this.formStores.get(formId) != null) {
            throw new Error(`simplr-forms-core: Form '${customFormId}' already exists.`);
        }

        // Create store instance
        const storeInstance: FormStore = store || new FormStore(formId);

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
        const store = this.formStores.get(formId);
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

    private resetFormStores() {
        this.storesCount = 0;
        this.formStores = Immutable.Map<string, FormStore>();
    }
}

export class FSHContainerClass {
    private instance: FormStoresHandlerClass;

    SetFormStoresHandler(newHandler: FormStoresHandlerClass, disposeOldOne: boolean = true) {
        if (disposeOldOne) {
            if (this.instance != null) {
                // Call internal method to reset stores
                (this.instance as any).resetFormStores();
                delete this.instance;
            }
        }
        this.instance = newHandler;
    }

    get FormStoresHandler() {
        if (this.instance == null) {
            this.instance = new FormStoresHandlerClass();
        }
        return this.instance;
    }
}

export var FSHContainer = new FSHContainerClass();
