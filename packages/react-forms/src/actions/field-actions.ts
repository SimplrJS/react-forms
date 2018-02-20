import { StoreHydrated } from "./store-actions";

export abstract class FieldBaseAction {
    constructor(private fieldId: string) {}

    public get FieldId(): string {
        return this.fieldId;
    }
}

export class FieldRegistered extends FieldBaseAction {}

export class FieldUnregistered extends FieldBaseAction {}

export class FieldValueChanged extends FieldBaseAction {
    constructor(fieldId: string, private value: string) {
        super(fieldId);
    }

    public get Value(): string {
        return this.value;
    }
}

export class FieldStoreHydrated extends StoreHydrated {
    constructor(private fieldId: string) {
        super();
    }

    public get FieldId(): string {
        return this.fieldId;
    }
}
