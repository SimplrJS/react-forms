export class FieldRegistered {
    constructor(private formId: string) {}

    public get FieldId(): string {
        return this.formId;
    }
}

export class FieldUnregistered {
    constructor(private formId: string) {}

    public get FieldId(): string {
        return this.formId;
    }
}

export class FieldValueChanged {
    constructor(private value: string) {}

    public get Value(): string {
        return this.value;
    }
}
