import * as Immutable from "immutable";
import { recordify } from "typed-immutable-record";
import { ActionEmitter } from "action-emitter";

import * as Actions from "../actions/form-store";
import {
    FieldState,
    FieldValue,
    FieldStateRecord,
    FormErrorRecord,
    FieldProps,
    FieldStatePropsRecord,
    FieldStateProps
} from "../contracts/field";
import { FormState, FormStateRecord } from "../contracts/form";
import { FormStoreState, FormStoreStateRecord } from "../contracts/form-store";
import { FieldsGroupStateRecord } from "../contracts/fields-group";
import { ConstructFormError } from "../utils/form-error-helpers";
import { FormError } from "../contracts/error";

export class FormStore extends ActionEmitter {
    constructor(formId: string) {
        super();
        this.FormId = formId;
        this.state = this.GetInitialFormStoreState();
    }

    protected FormId: string;

    private state: FormStoreStateRecord;
    protected get State(): FormStoreStateRecord {
        return this.state;
    }
    protected set State(newState: FormStoreStateRecord) {
        this.state = newState;

        this.emit(new Actions.StateUpdated());
    }

    public GetState(): FormStoreStateRecord {
        return this.State;
    }

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

    public RegisterField(
        fieldId: string,
        initialValue: FieldValue,
        defaultValue: FieldValue,
        props?: FieldStateProps,
        fieldsGroupId?: string
    ) {
        // Construct field state
        let fieldState = this.GetInitialFieldState();
        fieldState.DefaultValue = defaultValue;
        fieldState.Value = initialValue;

        if (props != null) {
            fieldState.Props = recordify<FieldStateProps, FieldStatePropsRecord>(props);
        }

        if (fieldsGroupId != null) {
            fieldState.FieldsGroup = {
                Id: fieldsGroupId
            };
        }

        // Add field into form store state
        this.State = this.State.withMutations(state => {
            state.Fields = state.Fields.set(fieldId, recordify<FieldState, FieldStateRecord>(fieldState));
        });

        this.emit(new Actions.FieldRegistered(fieldId, initialValue));
    }

    public UnregisterField(fieldId: string) {
        // Remove field from form store state
        this.State = this.State.withMutations(state => {
            state.Fields = state.Fields.remove(fieldId);
        });
    }

    public HasField(fieldId: string): boolean {
        return this.State.Fields.has(fieldId);
    }

    public GetField(fieldId: string): FieldStateRecord {
        return this.State.Fields.get(fieldId);
    }

    public SetSubmitCallback(submitCallback: () => void) {
        this.State = this.State.withMutations(state => {
            state.Form = state.Form.merge({
                SubmitCallback: submitCallback
            } as FormState);
        });
    }

    public UpdateProps(fieldId: string, props: FieldStateProps) {
        const propsRecord = recordify<FieldStateProps, FieldStatePropsRecord>(props);
        const fieldState = this.State.Fields.get(fieldId);

        if (fieldState.Props == null || fieldState.Props.equals(propsRecord)) {
            return;
        }

        this.State = this.State.withMutations(state => {
            const fieldState = state.Fields.get(fieldId);
            state.Fields = state.Fields.set(fieldId, fieldState.merge({
                Props: recordify<FieldStateProps, FieldStatePropsRecord>(props)
            } as FieldState));
        });

        this.emit(new Actions.PropsChanged(fieldId));
    }

    public ValueChanged(fieldId: string, newValue: FieldValue) {
        this.State = this.State.withMutations(state => {
            const fieldState = state.Fields.get(fieldId);
            state.Fields = state.Fields.set(fieldId, fieldState.merge({
                Value: newValue
            } as FieldState));
        });

        this.emit(new Actions.ValueChanged(fieldId, newValue));
    }

    public async Validate(fieldId: string, validationPromise: Promise<void>) {
        const field = this.State.Fields.get(fieldId);
        const fieldValue = field.Value;

        // Skip if it's already validating
        if (!field.Validating) {
            this.State = this.State.withMutations(state => {
                // Set form state to Validating: true
                state.Form = state.Form.merge({
                    Validating: true,
                    Error: undefined
                } as FormState);

                const fieldState = state.Fields.get(fieldId);
                state.Fields = state.Fields.set(fieldId, fieldState.merge({
                    Validating: true,
                    Error: undefined
                } as FieldState));
            });
        }

        try {
            // Wait for validation to finish
            await validationPromise;

            // Skip validation if the value has changed again
            const currentFieldValue = this.State.Fields.get(fieldId).Value;
            if (currentFieldValue !== fieldValue) {
                return;
            }

            this.State = this.State.withMutations(state => {
                const fieldState = state.Fields.get(fieldId);
                state.Fields = state.Fields.set(fieldId, fieldState.merge({
                    Validating: false
                } as FieldState));
            });
        } catch (error) {
            // Skip validation if the value has changed again
            const currentFieldValue = this.State.Fields.get(fieldId).Value;
            if (currentFieldValue !== fieldValue) {
                return;
            }

            const formError = ConstructFormError(error);
            if (formError == null) {
                throw Error(error);
            }

            this.State = this.State.withMutations(state => {
                const fieldState = state.Fields.get(fieldId);
                state.Fields = state.Fields.set(fieldId, fieldState.merge({
                    Validating: false,
                    Error: recordify<FormError, FormErrorRecord>(formError!)
                } as FieldState));
            });
        }
    }

    public InitiateSubmit() {
        if (this.State.Form.SubmitCallback == null) {
            throw new Error("simplr-forms-core: Submit method is called before SubmitCallback is set.");
        }
        this.State.Form.SubmitCallback();
    }

    // public Submit(submitPromise: Promise<>) {

    // }

    /**
     * ========================
     *  Local helper methods
     * ========================
     */

    protected GetInitialFormStoreState(): FormStoreStateRecord {
        return recordify<FormStoreState, FormStoreStateRecord>({
            Fields: Immutable.Map<string, FieldStateRecord>(),
            FieldsGroups: Immutable.Map<string, FieldsGroupStateRecord>(),
            Form: recordify<FormState, FormStateRecord>(this.GetInitialFormState())
        });
    }

    protected GetInitialFormState(): FormState {
        return {
            Validating: false,
            Submitting: false,
            Pristine: true,
            SuccessfullySubmitted: false,
            ActiveFieldId: undefined,
            Error: undefined,
            SubmitCallback: undefined
        };
    }

    protected GetInitialFieldState(): FieldState {
        return {
            DefaultValue: undefined,
            Value: undefined,
            Touched: false,
            Pristine: true,
            Validating: false,
            Error: undefined,
            FieldsGroup: undefined,
            Props: undefined
        };
    }
}
