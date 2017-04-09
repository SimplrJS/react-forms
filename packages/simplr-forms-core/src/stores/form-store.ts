import { FieldState, FieldValueType, FieldStateRecord } from "../contracts/field";
import { FormState, FormStateRecord } from "../contracts/form";
import { FormStoreState } from "../contracts/form-store";
import { FieldGroupStateRecord } from "../contracts/field-group";
import * as Immutable from "immutable";
import { recordify } from "typed-immutable-record";

export class FormStore {
    constructor(formId: string) {
        this.FormId = formId;
    }

    protected FormId: string;
    protected State: FormStoreState = this.GetInitialFormStoreState();

    public RegisterField(formId: string, fieldName: string, initialValue: FieldValueType, fieldGroupId?: string) {
        let newFieldState = this.GetInitialFieldState();
        newFieldState.InitialValue = initialValue;
        newFieldState.Value = initialValue;
        if (fieldGroupId != null) {
            newFieldState.FieldsGroup = {
                Id: fieldGroupId
            };
        }

        const fieldId = this.GetFieldId(fieldName, fieldGroupId);

        this.State.Fields = this.State.set(fieldId, recordify<FieldState, FieldStateRecord>(newFieldState));
    }

    /*
    * Local helper methods
    */

    protected GetInitialFormStoreState(): FormStoreState {
        return {
            Fields: Immutable.Map<string, FieldStateRecord>(),
            FieldsGroups: Immutable.Map<string, FieldGroupStateRecord>(),
            Form: recordify<FormState, FormStateRecord>(this.GetInitialFormState())
        };
    }

    protected GetInitialFormState(): FormState {
        return {
            Submitting: false,
            SuccessfullySubmitted: false,
            ActiveFieldId: undefined,
            Error: undefined,
            SubmitCallback: undefined
        };
    }

    protected GetInitialFieldState(): FieldState {
        return {
            InitialValue: undefined,
            Value: undefined,
            Touched: false,
            Pristine: true,
            Validating: false,
            Error: undefined,
            FieldsGroup: undefined,
            Validators: undefined
        };
    }

    protected GetFieldId(fieldName: string, fieldGroupId?: string) {
        if (fieldGroupId != null) {
            return `${fieldGroupId}___${fieldName}`;
        }

        return fieldName;
    }
}
