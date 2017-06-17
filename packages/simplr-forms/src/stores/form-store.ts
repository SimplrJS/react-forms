import * as Immutable from "immutable";
import { recordify } from "typed-immutable-record";
import { ActionEmitter } from "action-emitter";

import { FormStoreHelpers } from "./form-store-helpers";

import * as Actions from "../actions/form-store";
import {
    FieldStoreState,
    FieldValue,
    FieldStoreStateRecord,
    FieldStorePropsRecord,
    FieldProps
} from "../contracts/field";
import {
    FormState,
    FormStateRecord,
    FormProps,
    FormPropsRecord
} from "../contracts/form";
import {
    FormStoreState,
    FormStoreStateRecord,
    BuiltFormObject,
    FormStoreStateStatus
} from "../contracts/form-store";
import {
    FieldsGroupStoreState,
    FieldsGroupStoreStateRecord
} from "../contracts/fields-group";
import { ConstructFormError } from "../utils/form-error-helpers";
import { FormError, FormErrorRecord, FormErrorOrigin } from "../contracts/error";
import { ModifierValue } from "../contracts/value";

export const FG_SEPARATOR = ".";

export type Dictionary<TItem = any> = { [key: string]: TItem };

export class FormStore extends ActionEmitter {
    constructor(formId: string) {
        super();
        this.FormId = formId;
        this.state = recordify<FormStoreState, FormStoreStateRecord>(this.GetInitialFormStoreState());
    }

    protected FormId: string;
    protected BuiltFormObject: BuiltFormObject;

    private state: FormStoreStateRecord;
    protected get State(): FormStoreStateRecord {
        return this.state;
    }
    protected set State(newState: FormStoreStateRecord) {
        this.state = newState;
        this.emit(new Actions.StateChanged(this.FormId));
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
    public GetFieldId(fieldName: string, fieldsGroupId?: string): string {
        if (fieldsGroupId != null) {
            return `${fieldsGroupId}${FG_SEPARATOR}${fieldName}`;
        }

        return fieldName;
    }

    public GetFieldsGroupId(name: string, parentId?: string): string {
        if (parentId != null) {
            return `${parentId}${FG_SEPARATOR}${name}`;
        }

        return name;
    }

    public GetFieldsArrayId(name: string, parentId?: string): string {
        return this.GetFieldsGroupId(name, parentId);
    }

    public RegisterField(
        fieldId: string,
        name: string,
        defaultValue: FieldValue,
        initialValue?: FieldValue,
        value?: FieldValue,
        transitionalValue?: FieldValue,
        props?: FieldProps,
        fieldsGroupId?: string
    ): void {
        if (this.State.Fields.has(fieldId) ||
            this.State.FieldsGroups.has(fieldId)) {
            throw new Error(`simplr-forms: Field '${fieldId}' already exists in form '${this.FormId}.`);
        }

        // Construct field state
        const fieldState: FieldStoreState = {
            Name: name,
            // Set default value without fallbacks
            DefaultValue: defaultValue,
            InitialValue: undefined,
            Value: undefined,
            Touched: false,
            Pristine: true,
            Validating: false,
            Error: undefined,
            FieldsGroup: undefined,
            Props: undefined
        };

        // (initialValue) (value)
        // 0 => null
        // 1 => not null

        // If neither initialValue, nor value is given
        // Fallback to defaultValue
        if (initialValue == null && value == null) {
            // 0 0
            fieldState.InitialValue = defaultValue;
            fieldState.Value = defaultValue;
        } else if (initialValue != null && value == null) {
            // 1 0
            fieldState.InitialValue = initialValue;
            fieldState.Value = initialValue;
        } else if (initialValue == null && value != null) {
            // 0 1
            fieldState.InitialValue = value;
            fieldState.Value = value;
        } else {
            // 0 0
            fieldState.InitialValue = initialValue;
            fieldState.Value = value;
        }

        if (props != null) {
            fieldState.Props = recordify<FieldProps, FieldStorePropsRecord>(props);
        }

        if (fieldsGroupId != null) {
            fieldState.FieldsGroup = {
                Id: fieldsGroupId
            };
        }

        fieldState.TransitionalValue = transitionalValue;

        // Add field into form store state
        this.State = this.State.merge({
            Fields: this.State.Fields.set(fieldId, recordify<FieldStoreState, FieldStoreStateRecord>(fieldState))
        } as FormStoreStateRecord);

        this.emit(new Actions.FieldRegistered(this.FormId, fieldId));
    }

    public RegisterFieldsGroup(fieldsGroupId: string, name: string, parentId?: string): void {
        if (this.State.Fields.has(fieldsGroupId) ||
            this.State.FieldsGroups.has(fieldsGroupId)) {
            throw new Error(`simplr-forms: FieldsGroup '${fieldsGroupId}' already exists in form '${this.FormId}.`);
        }

        const fgState: FieldsGroupStoreState = {
            Name: name,
            Parent: parentId
        };

        const fgStateRecord = recordify<FieldsGroupStoreState, FieldsGroupStoreStateRecord>(fgState);

        // Add fields group into form store state
        this.State = this.State.merge({
            FieldsGroups: this.State.FieldsGroups.set(fieldsGroupId, fgStateRecord)
        } as FormStoreStateRecord);

        this.emit(new Actions.FieldsGroupRegistered(this.FormId, fieldsGroupId));
    }

    public RegisterFieldsArray(fieldsArrayId: string, name: string, index: number, parentId?: string): void {
        if (this.State.Fields.has(fieldsArrayId) ||
            this.State.FieldsGroups.has(fieldsArrayId)) {
            throw new Error(`simplr-forms: FieldsArray '${fieldsArrayId}' already exists in form '${this.FormId}.`);
        }

        const faState: FieldsGroupStoreState = {
            Name: name,
            ArrayName: name,
            Parent: parentId
        };

        const faStateRecord = recordify<FieldsGroupStoreState, FieldsGroupStoreStateRecord>(faState);

        // Add fields array into form store state
        this.State = this.State.merge({
            FieldsGroups: this.State.FieldsGroups.set(fieldsArrayId, faStateRecord)
        } as FormStoreStateRecord);

        this.emit(new Actions.FieldsArrayRegistered(this.FormId, fieldsArrayId));
    }

    public UnregisterField(fieldId: string): void {
        // Remove field from form store state
        this.State = this.State.withMutations(state => {
            state.Fields = state.Fields.remove(fieldId);
        });
    }

    public UnregisterFieldsGroup(fieldsGroupId: string): void {
        // Remove fields group from form store state
        this.State = this.State.withMutations(state => {
            state.FieldsGroups = state.FieldsGroups.remove(fieldsGroupId);
        });
    }

    public UnregisterFieldsArray(fieldsGroupId: string): void {
        // Remove fields array from form store state
        this.State = this.State.withMutations(state => {
            state.FieldsGroups = state.FieldsGroups.remove(fieldsGroupId);
        });
    }

    public HasField(fieldId: string): boolean {
        return this.State.Fields.has(fieldId);
    }

    public GetField(fieldId: string): FieldStoreStateRecord {
        return this.State.Fields.get(fieldId);
    }

    public SetFormSubmitCallback(submitCallback: () => void): void {
        this.State = this.State.withMutations(state => {
            state.Form = state.Form.merge({
                SubmitCallback: submitCallback
            } as FormState);
        });
    }

    public UpdateFormProps(props: FormProps): void {
        this.State = this.State.withMutations(state => {
            state.Form = state.Form.withMutations(formState => {
                formState.Props = recordify<FormProps, FormPropsRecord>(props);
                if (props != null && props.disabled === true) {
                    formState.Disabled = true;
                }
            });
            return this.RecalculateDependentFormStatuses(state);
        });
        this.emit(new Actions.FormPropsChanged(this.FormId));
    }

    public UpdateFieldProps(fieldId: string, props: FieldProps): void {
        const propsRecord = recordify<FieldProps, FieldStorePropsRecord>(props);
        const fieldState = this.State.Fields.get(fieldId);

        if (fieldState.Props == null ||
            FormStoreHelpers.PropsEqual(propsRecord, fieldState.Props)) {
            return;
        }

        this.State = this.State.withMutations(state => {
            const field = state.Fields.get(fieldId);
            state.Fields = state.Fields.set(fieldId, field.merge({
                Props: propsRecord
            } as FieldStoreState));
        });

        this.emit(new Actions.FieldPropsChanged(this.FormId, fieldId));
    }

    public UpdateFieldValue(fieldId: string, newValue: ModifierValue): void {
        const fieldState = this.State.Fields.get(fieldId);
        if (fieldState.Value === newValue.Value &&
            fieldState.TransitionalValue === newValue.TransitionalValue) {
            return;
        }

        this.State = this.State.withMutations(state => {
            const newPristine = (newValue.Value === fieldState.InitialValue);
            state.Fields = state.Fields.set(fieldId, fieldState.merge({
                Value: newValue.Value,
                TransitionalValue: newValue.TransitionalValue,
                Pristine: newPristine,
                Touched: true
            } as FieldStoreState));

            state.Form = state.Form.merge({
                SuccessfullySubmitted: false,
                Error: undefined
            } as FormState);

            return this.RecalculateDependentFormStatuses(state);
        });

        this.emit(new Actions.ValueChanged(this.FormId, fieldId));
    }

    public async ValidateField(fieldId: string, validationPromise: Promise<never>): Promise<void> {
        const field = this.State.Fields.get(fieldId);
        const fieldValue = field.Value;

        // Skip if it's already validating
        if (!field.Validating) {
            this.State = this.State.withMutations(state => {
                state.merge({
                    Validating: true,
                    HasError: false
                } as Partial<FormStoreState>);
                const fieldState = state.Fields.get(fieldId);
                state.Fields = state.Fields.set(fieldId, fieldState.merge({
                    Validating: true,
                    Error: undefined
                } as FieldStoreState));
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
                } as FieldStoreState));

                return this.RecalculateDependentFormStatuses(state);
            });
        } catch (error) {
            // Skip validation if the value has changed again
            const currentFieldValue = this.State.Fields.get(fieldId).Value;
            if (currentFieldValue !== fieldValue) {
                return;
            }

            const formError = ConstructFormError(error, FormErrorOrigin.Validation);
            if (formError == null) {
                throw Error(error);
            }

            this.State = this.State.withMutations(state => {
                const fieldState = state.Fields.get(fieldId);
                state.Fields = state.Fields.set(fieldId, fieldState.merge({
                    Validating: false,
                    Error: recordify<FormError, FormErrorRecord>(formError!)
                } as FieldStoreState));

                return this.RecalculateDependentFormStatuses(state);
            });
        }
    }

    public SetActiveField(fieldId: string | undefined): void {
        this.State = this.State.withMutations(state => {
            if (fieldId == null) {
                state.Form = state.Form.merge({
                    ActiveFieldId: undefined
                } as FormState);
                return state;
            }

            const fieldState = this.State.Fields.get(fieldId);
            if (fieldState == null) {
                console.warn(`simplr-forms: Given field '${fieldId}' does not exist in form '${this.FormId}', `
                    + `therefore field cannot be focused. Form.ActiveFieldId was reset to an undefined.`);
                // Reset ActiveFieldId to an undefined
                state.Form = state.Form.merge({
                    ActiveFieldId: undefined
                } as FormState);
                return state;
            }

            state.Form = state.Form.merge({
                ActiveFieldId: fieldId
            } as FormState);

            state.Fields = state.Fields.set(fieldId, fieldState.merge({
                Touched: true
            } as FieldStoreState));

            return this.RecalculateDependentFormStatuses(state);
        });
    }

    public SetFormDisabled(disabled: boolean): void {
        this.State = this.State.withMutations(state => {
            state.Form = state.Form.merge({
                Disabled: disabled
            } as FormState);

            return this.RecalculateDependentFormStatuses(state);
        });

        if (disabled) {
            this.emit(new Actions.FormDisabled(this.FormId));
        } else {
            this.emit(new Actions.FormEnabled(this.FormId));
        }
    }

    public TouchFields(fieldsIds?: string[]): void {
        if (fieldsIds == null) {
            fieldsIds = this.state.Fields.keySeq().toArray();
        }

        this.State = this.State.withMutations(state => {

            fieldsIds!.forEach(fieldId => {
                const fieldState = state.Fields.get(fieldId);

                if (fieldState != null) {
                    state.Fields = state.Fields.set(fieldId, fieldState.merge({
                        Touched: true
                    } as FieldStoreState));
                }
            });

            return this.RecalculateDependentFormStatuses(state);
        });

        fieldsIds.forEach(fieldId => {
            this.emit(new Actions.FieldTouched(this.FormId, fieldId));
        });
    }

    public async ValidateForm(validationPromise: Promise<never>): Promise<void> {
        const form = this.State.Form;

        // Skip if it's already validating
        if (!form.Validating) {
            this.State = this.State.withMutations(state => {
                state.merge({
                    Validating: true,
                    HasError: false
                } as Partial<FormStoreState>);

                state.Form = state.Form.merge({
                    Validating: false,
                    Error: undefined
                } as FormState);
            });
        }

        try {
            // Wait for validation to finish
            await validationPromise;

            this.State = this.State.withMutations(state => {
                state.Form = state.Form.merge({
                    Validating: false
                } as FormState);

                return this.RecalculateDependentFormStatuses(state);
            });
        } catch (error) {
            const formError = ConstructFormError(error, FormErrorOrigin.Validation);
            if (formError == null) {
                throw Error(error);
            }

            this.State = this.State.withMutations(state => {
                state.Form = state.Form.merge({
                    Validating: false,
                    Error: recordify<FormError, FormErrorRecord>(formError!)
                } as FormState);

                return this.RecalculateDependentFormStatuses(state);
            });
        }
    }

    public InitiateFormSubmit(): void {
        if (this.State.Form.SubmitCallback == null) {
            throw new Error("simplr-forms: Submit method is called before SubmitCallback is set.");
        }
        this.State.Form.SubmitCallback();
    }

    public async SubmitForm(result: Promise<void> | FormError | any): Promise<void> {
        let promise: Promise<void>;
        if (this.IsPromise<void>(result)) {
            promise = result;
        } else {
            promise = new Promise<void>((resolve, reject) => {
                const error = ConstructFormError(result, FormErrorOrigin.Submit);
                if (error !== undefined) {
                    reject(result);
                    return;
                }
                resolve(result);
            });
        }

        // Form.Submitting -> true
        this.State = this.State.withMutations(state => {
            state.Form = state.Form.merge({
                Submitting: true
            } as FormState);
            return this.RecalculateDependentFormStatuses(state);
        });
        // Try submitting
        try {
            await promise;
            // No error and submitting -> false
            this.State = this.State.withMutations(state => {
                state.Form = state.Form.merge({
                    Submitting: false,
                    SuccessfullySubmitted: true,
                    Error: undefined
                } as FormState);
                return this.RecalculateDependentFormStatuses(state);
            });
        } catch (caughtError) {
            // Set error origin
            const constructedError = ConstructFormError(caughtError, FormErrorOrigin.Submit);
            let error: FormErrorRecord;
            if (constructedError != null) {
                error = recordify<FormError, FormErrorRecord>(constructedError);
            }

            // Error and submitting -> false
            this.State = this.State.withMutations(state => {
                state.Form = state.Form.merge({
                    Submitting: false,
                    SuccessfullySubmitted: false,
                    Error: error
                } as FormState);
                return this.RecalculateDependentFormStatuses(state);
            });
        }
    }

    /**
     * Set fields to default values.
     */
    public ClearFields(fieldsIds?: string[]): void {
        this.State = this.State.withMutations(state => {
            if (fieldsIds == null) {
                fieldsIds = state.Fields.keySeq().toArray();
            }

            fieldsIds.forEach(fieldId => {
                const fieldState = state.Fields.get(fieldId);

                if (fieldState != null) {
                    const oldValue = fieldState.Value;
                    state.Fields = state.Fields.set(fieldId, fieldState.merge({
                        Error: undefined,
                        Value: fieldState.DefaultValue,
                        Pristine: (fieldState.InitialValue === fieldState.DefaultValue),
                        Touched: oldValue !== fieldState.DefaultValue
                    } as FieldStoreState));
                }
            });

            state.Form = state.Form.merge({
                SuccessfullySubmitted: false,
                Error: undefined
            } as FormState);

            return this.RecalculateDependentFormStatuses(state);
        });
    }

    /**
     * Set fields to initial values.
     */
    public ResetFields(fieldsIds?: string[]): void {
        this.State = this.State.withMutations(state => {
            if (fieldsIds == null) {
                fieldsIds = state.Fields.keySeq().toArray();
            }

            fieldsIds.forEach(fieldId => {
                const fieldState = state.Fields.get(fieldId);

                if (fieldState != null) {
                    state.Fields = state.Fields.set(fieldId, fieldState.merge({
                        Error: undefined,
                        Value: fieldState.InitialValue,
                        Pristine: true,
                        Touched: false
                    } as FieldStoreState));
                }
            });

            state.Form = state.Form.merge({
                SuccessfullySubmitted: false,
                Error: undefined
            } as FormState);

            return this.RecalculateDependentFormStatuses(state);
        });
    }

    public ToObject<TObject = any>(): TObject {
        if (this.BuiltFormObject == null ||
            this.BuiltFormObject.Fields !== this.State.Fields) {
            this.BuiltFormObject = {
                Fields: this.State.Fields,
                Object: this.BuildFormObject()
            };
        }
        return this.BuiltFormObject.Object;
    }

    /**
     * ========================
     *  Local helper methods
     * ========================
     */

    protected GetInitialFormStoreState(): FormStoreState {
        return {
            Fields: Immutable.Map<string, FieldStoreStateRecord>(),
            FieldsGroups: Immutable.Map<string, FieldsGroupStoreStateRecord>(),
            Form: recordify<FormState, FormStateRecord>(this.GetInitialFormState()),
            // MUST be identical with GetInitialFieldState method.
            HasError: false,
            Pristine: true,
            Touched: false,
            Validating: false,
            Submitting: false,
            Disabled: false
        } as FormStoreState;
    }

    protected GetInitialFormState(): FormState {
        return {
            Disabled: false,
            Validating: false,
            Submitting: false,
            SuccessfullySubmitted: false,
            ActiveFieldId: undefined,
            Error: undefined,
            SubmitCallback: undefined,
            Props: recordify<FormProps, FormPropsRecord>({})
        } as FormState;
    }

    protected GetInitialStoreStatus(): FormStoreStateStatus {
        return {
            HasError: false,
            Pristine: true,
            Touched: false,
            Validating: false,
            Submitting: false,
            Disabled: false
        } as FormStoreStateStatus;
    }

    protected BuildFormObject(fieldsGroupId?: string): Dictionary {
        const result: Dictionary = {};

        const groupFields = this.State.Fields.filter(x =>
            x != null &&
            (x.FieldsGroup == null || x.FieldsGroup.Id === fieldsGroupId));

        groupFields.forEach((field, fieldId) => {
            if (field == null || field == null) {
                return;
            }
            result[field.Name] = field.Value;
        });

        const fieldsGroups = this.State.FieldsGroups.filter(x => x != null && x.Parent === fieldsGroupId);
        fieldsGroups.forEach((fieldsGroup, index) => {
            if (fieldsGroup == null || index == null) {
                return;
            }
            if (fieldsGroup.ArrayName != null) {
                if (result[fieldsGroup.ArrayName] == null) {
                    result[fieldsGroup.ArrayName] = [];
                }
                result[fieldsGroup.ArrayName].push(this.BuildFormObject(index));
            } else {
                result[fieldsGroup.Name] = this.BuildFormObject(index);
            }
        });
        return result;
    }

    protected RecalculateDependentFormStatuses(formStoreState: FormStoreStateRecord): FormStoreStateRecord {
        const updater: FormStoreStateStatus = this.GetInitialStoreStatus();

        // TODO: might build curried function for more efficient checking.

        // Check all fields
        formStoreState.Fields.forEach((fieldState, key) => {
            if (fieldState != null && key != null) {
                if (!updater.HasError && fieldState.Error) {
                    updater.HasError = true;
                }
                if (updater.Pristine && !fieldState.Pristine) {
                    updater.Pristine = false;
                }
                if (!updater.Touched && fieldState.Touched) {
                    updater.Touched = true;
                }
                if (fieldState.Validating) {
                    updater.Validating = true;
                }

                // Short circuit if everything is resolved with fields.
                if (updater.HasError &&
                    !updater.Pristine &&
                    updater.Touched &&
                    updater.Validating) {
                    return false;
                }
            }
        });

        // Check form state
        const formState = formStoreState.Form;
        if (!updater.HasError && formState.Error != null) {
            updater.HasError = true;
        }
        if (!updater.Validating && formState.Validating) {
            updater.Validating = true;
        }

        if (!updater.Submitting && formState.Submitting) {
            updater.Submitting = formState.Submitting;
        }

        if (!updater.Disabled &&
            (formState.Disabled || updater.Submitting)) {
            updater.Disabled = true;
        }

        return formStoreState.merge(updater);
    }

    protected IsPromise<T>(value: any): value is Promise<T> {
        return value != null && value.then != null && value.catch != null;
    }
}
