// TODO: extract into abstractions
// This requires tooling update, because webpack goes crazy now
export abstract class FormAction {
    constructor(protected formId: string) { }

    public get FormId(): string {
        return this.formId;
    }
}

export abstract class FieldAction extends FormAction {
    constructor(formId: string, protected fieldId: string) {
        super(formId);
    }

    public get FieldId(): string {
        return this.fieldId;
    }
}

export class StateChanged extends FormAction { }

export class FieldRegistered extends FieldAction { }

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

export class ValueChanged extends FieldAction { }

export class FieldPropsChanged extends FieldAction { }

export class FormPropsChanged extends FormAction { }

export class FormDisabled extends FormAction { }

export class FormEnabled extends FormAction { }

export class FieldTouched extends FieldAction { }

export class FieldValidated extends FieldAction { }

export class FieldActive extends FormAction {
    constructor(formId: string, private fieldId: string | undefined) {
        super(formId);
    }

    public get FieldId(): string | undefined {
        return this.fieldId;
    }
}

export class FieldBlurred extends FieldAction { }
