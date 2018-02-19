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
