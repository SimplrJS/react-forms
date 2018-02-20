import { StoreHydrated } from "./store-actions";

export class FormRegistered {
    constructor(private formId: string) {}

    public get FormId(): string {
        return this.formId;
    }
}

export class FormUnregistered {
    constructor(private formId: string) {}

    public get FormId(): string {
        return this.formId;
    }
}

export class FormStoreHydrated extends StoreHydrated {
    constructor(private formId: string) {
        super();
    }

    public get FormId(): string {
        return this.formId;
    }
}
