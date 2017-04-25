import * as Immutable from "immutable";
import { ActionEmitter } from "action-emitter";

import { FormStore } from "./form-store";
import * as Actions from "../actions/form-stores-handler";

export class FormStoresHandler extends ActionEmitter {
    private storesCount: number;
    private formStores: Immutable.Map<string, FormStore>;

    constructor() {
        super();
        this.resetFormStores();
    }

    protected GetFormStoreId(formNumber: number): string {
        return `form-store-${formNumber}`;
    }

    /**
     * Returns unique incremental store id.
     *
     * @returns
     *
     * @memberOf FormStoresHandlerClass
     */
    public NextStoreId(): string {
        return this.GetFormStoreId(++this.storesCount);
    }

    /**
     * Returns count of currently registered stores.
     *
     * @readonly
     *
     * @memberOf FormStoresHandlerClass
     */
    public get StoresCount(): number {
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
    public RegisterForm(customFormId?: string, store?: any): string {
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

        this.emit(new Actions.FormRegistered(formId));

        return formId;
    }

    /**
     * Destroys store instance.
     *
     * @param {string} formId
     *
     * @memberOf FormStoreHandlerBase
     */
    public UnregisterForm(formId: string): void {
        const store = this.formStores.get(formId);
        if (store != null) {
            this.formStores = this.formStores.delete(formId);
            this.emit(new Actions.FormUnregistered(formId));
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
    public GetStore(formId: string): FormStore {
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
    public Exists(formId: string): boolean {
        return this.formStores.has(formId);
    }

    private resetFormStores(): void {
        this.storesCount = 0;
        this.formStores = Immutable.Map<string, FormStore>();
    }
}

export class FSHContainerClass {
    private instance: FormStoresHandler;

    SetFormStoresHandler(newHandler: FormStoresHandler, disposeOldOne: boolean = true) {
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
            this.instance = new FormStoresHandler();
        }
        return this.instance;
    }
}

export const FSHContainer = new FSHContainerClass();
