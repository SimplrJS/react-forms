export class StateUpdated { }

export class ValueChanged {
    constructor(private fieldId: string, private newValue: any) { }

    public get FieldId() {
        return this.fieldId;
    }

    public get NewValue() {
        return this.newValue;
    }
}

export class PropsChanged {
    constructor(private fieldId: string) { }

    public get FieldId() {
        return this.fieldId;
    }
}
