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

    /**
     * ========================
     *  Public API
     * ========================
     */

    /**
     * Constructs field id from given fieldName and an optional fieldsGroupIdkds
     *
     * @param {string} fieldName
     * @param {string} [fieldsGroupId]
     * @returns Constructed field id
     *
     * @memberOf FormStore
     */
    public GetFieldId(fieldName: string, fieldsGroupId?: string) {
        if (fieldsGroupId != null) {
            return `${fieldsGroupId}___${fieldName}`;
        }

        return fieldName;
    }

    public RegisterField(formId: string, fieldId: string, initialValue: FieldValueType, fieldsGroupId?: string) {
        let fieldState = this.GetInitialFieldState();
        fieldState.InitialValue = initialValue;
        fieldState.Value = initialValue;
        if (fieldsGroupId != null) {
            fieldState.FieldsGroup = {
                Id: fieldsGroupId
            };
        }

        this.State.Fields = this.State.Fields.set(fieldId, recordify<FieldState, FieldStateRecord>(fieldState));
    }
    public HasField(fieldName: string, fieldsGroupId?: string) {
        this.State.Fields.has(this.GetFieldId(fieldName, fieldsGroupId));
    }



    /**
     * ========================
     *  Local helper methods
     * ========================
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
}
