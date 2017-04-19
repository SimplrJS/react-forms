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
        props?: FieldProps,
        fieldsGroupId?: string
    ) {
        // Construct field state
        let fieldState = this.GetInitialFieldState();
        fieldState.InitialValue = initialValue;
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

    public UpdateProps(fieldId: string, props: FieldProps) {
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
        this.emit(new Actions.ValueChanged(fieldId));

        this.State = this.State.withMutations(state => {
            const fieldState = state.Fields.get(fieldId);
            state.Fields = state.Fields.set(fieldId, fieldState.merge({
                Value: newValue
            } as FieldState));
        });
    }

    public async Validate(fieldId: string, validationPromise: Promise<void>) {
        this.State = this.State.withMutations(state => {
            const fieldState = state.Fields.get(fieldId);
            state.Fields = state.Fields.set(fieldId, fieldState.merge({
                Validating: true,
                Error: undefined
            } as FieldState));
        });

        try {
            await validationPromise;
            this.State = this.State.withMutations(state => {
                const fieldState = state.Fields.get(fieldId);
                state.Fields = state.Fields.set(fieldId, fieldState.merge({
                    Validating: false
                } as FieldState));
            });
        } catch (error) {
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
            Props: undefined
        };
    }
}
