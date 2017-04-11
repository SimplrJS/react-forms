export class StateUpdated { }

export class ValueChanged {
    constructor(private fieldId: string) { }

    public get FieldId() {
        return this.fieldId;
    }
}
