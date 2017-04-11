import * as Immutable from "immutable";
import { recordify } from "typed-immutable-record";
import { ActionEmitter } from "action-emitter";

import * as Actions from "./form-store-actions";
import { FieldState, FieldValue, FieldStateRecord } from "../contracts/field";
import { FormState, FormStateRecord } from "../contracts/form";
import { FormStoreState, FormStoreStateRecord } from "../contracts/form-store";
import { FieldsGroupStateRecord } from "../contracts/fields-group";
import { ResolveError } from "../utils/form-error-helpers";

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

    public RegisterField(fieldId: string, initialValue: FieldValue, fieldsGroupId?: string) {
        // Construct field state
        let fieldState = this.GetInitialFieldState();
        fieldState.InitialValue = initialValue;
        fieldState.Value = initialValue;
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

    public ValueChanged(fieldId: string, newValue: FieldValue) {
        this.emit(new Actions.ValueChanged(fieldId));

        this.State = this.State.withMutations(state => {
            const fieldState = state.Fields.get(fieldId);
            state.Fields = state.Fields.set(fieldId, fieldState.merge({
                Value: newValue
            } as FieldState));
        });
    }

    public Validate(fieldId: string, promise: Promise<void>) {
        this.State = this.State.withMutations(state => {
            const fieldState = state.Fields.get(fieldId);
            state.Fields = state.Fields.set(fieldId, fieldState.merge({
                Validating: true,
                Error: undefined
            } as FieldState));
        });

        promise.then(() => {
            this.State = this.State.withMutations(state => {
                const fieldState = state.Fields.get(fieldId);
                state.Fields = state.Fields.set(fieldId, fieldState.merge({
                    Validating: false
                } as FieldState));
            });
        }).catch((error) => {
            let resolvedError = ResolveError(error);
            if (resolvedError != null) {
                this.State = this.State.withMutations(state => {
                    const fieldState = state.Fields.get(fieldId);
                    state.Fields = state.Fields.set(fieldId, fieldState.merge({
                        Validating: false,
                        Error: resolvedError
                    } as FieldState));
                });
            } else {
                throw Error(error);
            }
        });
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
            Validators: undefined
        };
    }
}
