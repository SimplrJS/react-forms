import { FieldValue } from "../contracts/field";

// TODO: extract into abstractions
// This requires tooling update, because webpack goes crazy now
export abstract class FormAction {
    constructor(protected formId: string) { }

    public get FormId(): string {
        return this.formId;
    }
}

export class StateChanged extends FormAction { }

export class FieldRegistered extends FormAction {
    constructor(protected formId: string, private fieldId: string) {
        super(formId);
    }

    public get FieldId(): string {
        return this.fieldId;
    }
}

export class FieldsGroupRegistered extends FormAction {
    constructor(protected formId: string, private fieldsGroupId: string) {
        super(formId);
    }

    public get FieldsGroupId(): string {
        return this.fieldsGroupId;
    }
}

export class FieldsArrayRegistered extends FormAction {
    constructor(protected formId: string, private fieldsGroupId: string) {
        super(formId);
    }

    public get FieldsArrayId(): string {
        return this.fieldsGroupId;
    }
}

export class ValueChanged extends FormAction {
    constructor(protected formId: string, private fieldId: string) {
        super(formId);
    }

    public get FieldId(): string {
        return this.fieldId;
    }
}

export class FieldPropsChanged extends FormAction {
    constructor(protected formId: string, private fieldId: string) {
        super(formId);
    }

    public get FieldId(): string {
        return this.fieldId;
    }
}

export class FormPropsChanged extends FormAction { }

export class FormDisabled extends FormAction {
    constructor(protected formId: string) {
        super(formId);
    }
}

export class FormEnabled extends FormAction {
    constructor(protected formId: string) {
        super(formId);
    }
}
