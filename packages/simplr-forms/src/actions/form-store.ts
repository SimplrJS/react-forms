import { FieldValue } from "../contracts/field";

export class StateChanged { }

export class FieldRegistered {
    constructor(private fieldId: string) { }

    public get FieldId(): string {
        return this.fieldId;
    }
}

export class FieldsGroupRegistered {
    constructor(private fieldsGroupId: string) { }

    public get FieldsGroupId(): string {
        return this.fieldsGroupId;
    }
}

export class FieldsArrayRegistered {
    constructor(private fieldsGroupId: string) { }

    public get FieldsArrayId(): string {
        return this.fieldsGroupId;
    }
}

export class ValueChanged {
    constructor(private fieldId: string) { }

    public get FieldId(): string {
        return this.fieldId;
    }
}

export class FieldPropsChanged {
    constructor(private fieldId: string) { }

    public get FieldId(): string {
        return this.fieldId;
    }
}

export class FormPropsChanged { }
