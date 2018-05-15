import * as Immutable from "immutable";
import { ActionEmitter } from "action-emitter";

import { FormStoreHelpers } from "./form-store-helpers";

import * as Actions from "../actions/form-store";
import { FieldStoreState, FieldValue, FieldProps } from "../contracts/field";
import { FormState, FormProps } from "../contracts/form";
import { FormStoreState, BuiltFormObject, FormStoreStateStatus } from "../contracts/form-store";
import { FieldsGroupStoreState, FieldsGroupStoreStateRecord } from "../contracts/fields-group";
import { FieldValidationStatus } from "../contracts/validation";
import { ConstructFormError } from "../utils/form-error-helpers";
import { FormError, FormErrorOrigin } from "../contracts/error";
import { ModifierValue } from "../contracts/value";

export type Dictionary<TItem = any> = { [key: string]: TItem };

export class FormStore extends ActionEmitter {
    constructor(formId: string) {
        super();
        this.FormId = formId;
        this.state = this.GetInitialFormStoreState();
    }

    protected FormId: string;
    protected BuiltFormObject: BuiltFormObject;

    private state: FormStoreState;
    protected get State(): FormStoreState {
        return this.state;
    }
    protected set State(newState: FormStoreState) {
        this.state = newState;
        this.emit(new Actions.StateChanged(this.FormId));
    }

    public GetState(): FormStoreState {
        return this.State;
    }

    public GetFormId(): string {
        return this.FormId;
    }

    /**
     * ========================
     *  Public API
     * ========================
     */

    public RegisterField(
        fieldId: string,
        name: string,
        defaultValue: FieldValue,
        initialValue?: FieldValue,
        value?: FieldValue,
        transitionalValue?: FieldValue,
        props?: FieldProps,
        fieldsGroupId?: string,
        isInFieldsArray: boolean = false
    ): void {
        if (this.HasField(fieldId) || this.HasFieldsGroup(fieldId)) {
            throw new Error(`@simplr/react-forms: Field '${fieldId}' already exists in form '${this.FormId}.`);
        }

        // Construct field state
        const fieldState: FieldStoreState = {
            Name: name,
            // Set default value without fallbacks
            DefaultValue: defaultValue,
            InitialValue: undefined,
            TransitionalValue: undefined,
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
        if (initialValue === undefined && value === undefined) {
            // 0 0
            fieldState.InitialValue = defaultValue;
            fieldState.Value = defaultValue;
        } else if (initialValue !== undefined && value === undefined) {
            // 1 0
            fieldState.InitialValue = initialValue;
            fieldState.Value = initialValue;
        } else if (initialValue === undefined && value !== undefined) {
            // 0 1
            fieldState.InitialValue = value;
            fieldState.Value = value;
        } else {
            // 1 1
            fieldState.InitialValue = initialValue;
            fieldState.Value = value;
        }

        if (props != null) {
            // If field is in FieldsArray and destroyOnUnmount is falsy
            if (isInFieldsArray && props.destroyOnUnmount != null) {
                // TODO: If there are more situations where it is suggested to fill issue,
                // extract GitHub url into a global constant.
                const githubUrl = "https://github.com/SimplrJS/react-forms";
                const errorMessage =
                    `@simplr/react-forms: destroyOnUnmount always defaults to true, when field is inside FieldsArray.` +
                    `Remove destroyOnUnmount prop or fill an issue in Github (${githubUrl}) defining your scenario.`;
                throw new Error(errorMessage);
            }

            fieldState.Props = props;
        }

        if (fieldsGroupId != null) {
            fieldState.FieldsGroup = {
                Id: fieldsGroupId
            };
        }

        fieldState.TransitionalValue = transitionalValue;

        // Add field into form store state
        this.State = {
            ...this.State,
            Fields: this.State.Fields.set(fieldId, fieldState)
        };

        this.emit(new Actions.FieldRegistered(this.FormId, fieldId));
    }

    public RegisterFieldsGroup(fieldsGroupId: string, name: string, parentId?: string): void {
        if (this.State.Fields.has(fieldsGroupId) || this.State.FieldsGroups.has(fieldsGroupId)) {
            throw new Error(`@simplr/react-forms: FieldsGroup '${fieldsGroupId}' already exists in form '${this.FormId}.`);
        }

        const fgState: FieldsGroupStoreState = {
            Name: name,
            Parent: parentId
        };

        // Add fields group into form store state
        this.State = {
            ...this.State,
            FieldsGroups: this.State.FieldsGroups.set(fieldsGroupId, fgState)
        };

        this.emit(new Actions.FieldsGroupRegistered(this.FormId, fieldsGroupId));
    }

    public RegisterFieldsArray(fieldsArrayId: string, name: string, indexWeight?: number, parentId?: string): void {
        if (this.State.Fields.has(fieldsArrayId) || this.State.FieldsGroups.has(fieldsArrayId)) {
            throw new Error(`@simplr/react-forms: FieldsArray '${fieldsArrayId}' name already exists in form '${this.FormId}.`);
        }

        const faState: FieldsGroupStoreState = {
            Name: name,
            ArrayName: name,
            Parent: parentId,
            IndexWeight: indexWeight
        };

        // Add fields array into form store state
        this.State = {
            ...this.State,
            FieldsGroups: this.State.FieldsGroups.set(fieldsArrayId, faState)
        };

        this.emit(new Actions.FieldsArrayRegistered(this.FormId, fieldsArrayId));
    }

    public UnregisterField(fieldId: string): void {
        // Remove field from form store state
        this.State = {
            ...this.State,
            Fields: this.State.Fields.remove(fieldId)
        };
    }

    public UnregisterFieldsGroup(fieldsGroupId: string): void {
        // Remove fields group from form store state
        this.State = {
            ...this.State,
            FieldsGroups: this.State.FieldsGroups.remove(fieldsGroupId)
        };
    }

    public UnregisterFieldsArray(fieldsArrayId: string): void {
        const nextState = { ...this.State };
        nextState.Fields = nextState.Fields.filter(x => {
            // Never...
            if (x == null) {
                return false;
            }

            // Take all fields not in FieldsGroup
            if (x.FieldsGroup == null) {
                return true;
            }

            // Skip (remove) all fields in a given FieldsArray
            if (x.FieldsGroup.Id === fieldsArrayId) {
                return false;
            }

            // Take all other fields
            return true;
        }).toMap();
        nextState.FieldsGroups = nextState.FieldsGroups.remove(fieldsArrayId);

        this.State = nextState;
    }

    public HasField(fieldId: string): boolean {
        return this.State.Fields.has(fieldId);
    }

    public GetField(fieldId: string): FieldStoreState {
        return this.State.Fields.get(fieldId);
    }

    public HasFieldsGroup(fieldsGroupId: string): boolean {
        return this.State.FieldsGroups.has(fieldsGroupId);
    }

    public GetFieldsGroup(fieldsGroupId: string): FieldsGroupStoreState {
        return this.State.FieldsGroups.get(fieldsGroupId);
    }

    public SetFormSubmitCallback(submitCallback: () => void): void {
        this.State = {
            ...this.State,
            Form: {
                ...this.State.Form,
                SubmitCallback: submitCallback
            }
        };
    }

    public UpdateFormProps(props: FormProps): void {
        const nextState = { ...this.State };

        nextState.Form = {
            ...nextState.Form,
            Props: props,
            Disabled: props != null && props.disabled === true
        };

        this.State = this.RecalculateDependentFormStatuses(nextState);

        this.emit(new Actions.FormPropsChanged(this.FormId));
    }

    public UpdateFieldProps(fieldId: string, props: FieldProps): void {
        const fieldState = this.State.Fields.get(fieldId);

        if (fieldState.Props == null || FormStoreHelpers.PropsEqual(props, fieldState.Props)) {
            return;
        }

        this.State = {
            ...this.State,
            Fields: this.State.Fields.set(fieldId, {
                ...fieldState,
                Props: props
            })
        };

        this.emit(new Actions.FieldPropsChanged(this.FormId, fieldId));
    }

    public UpdateFieldsArrayIndexWeight(fieldsArrayId: string, indexWeight?: number): void {
        const fieldArrayState = this.State.FieldsGroups.get(fieldsArrayId);

        this.State = {
            ...this.State,
            FieldsGroups: this.State.FieldsGroups.set(fieldsArrayId, {
                ...fieldArrayState,
                IndexWeight: indexWeight
            })
        };
    }

    public UpdateFieldValue(fieldId: string, newValue: ModifierValue): void {
        const fieldState = this.State.Fields.get(fieldId);
        if (fieldState.Value === newValue.Value && fieldState.TransitionalValue === newValue.TransitionalValue) {
            return;
        }

        const nextState = { ...this.State };

        nextState.Fields = nextState.Fields.set(fieldId, {
            ...fieldState,
            Value: newValue.Value,
            TransitionalValue: newValue.TransitionalValue,
            Pristine: newValue.Value === fieldState.InitialValue,
            Touched: true
        });

        nextState.Form = {
            ...nextState.Form,
            SuccessfullySubmitted: false,
            Error: undefined
        };

        this.State = this.RecalculateDependentFormStatuses(nextState);

        this.emit(new Actions.ValueChanged(this.FormId, fieldId));
    }

    public UpdateFieldDefaultValue(fieldId: string, defaultValue: FieldValue): void {
        this.State = {
            ...this.State,
            Fields: this.State.Fields.update(fieldId, field => ({
                ...field,
                DefaultValue: defaultValue
            }))
        };
    }

    public UpdateFieldInitialValue(fieldId: string, initialValue: FieldValue): void {
        this.State = {
            ...this.State,
            Fields: this.State.Fields.update(fieldId, field => ({
                ...field,
                InitialValue: initialValue
            }))
        };
    }

    public async ValidateField(fieldId: string, validationPromise: Promise<void>): Promise<void> {
        const fieldState = this.State.Fields.get(fieldId);
        const fieldValue = fieldState.Value;

        // If field is not validating
        if (!fieldState.Validating) {
            const nextState = { ...this.State };
            nextState.FieldsValidationStatuses = this.State.FieldsValidationStatuses.set(fieldId, FieldValidationStatus.Validating);
            nextState.Fields = this.State.Fields.update(fieldId, field => ({
                ...field,
                Validating: true,
                Error: undefined
            }));

            this.State = this.RecalculateDependentFormStatuses(nextState);
        }

        try {
            // Wait for validation to finish
            await validationPromise;

            // Skip validation if the value has changed again
            const currentFieldValue = this.State.Fields.get(fieldId).Value;
            if (currentFieldValue !== fieldValue) {
                return;
            }

            const nextState = { ...this.State };

            nextState.FieldsValidationStatuses = nextState.FieldsValidationStatuses.delete(fieldId);
            nextState.Fields = nextState.Fields.update(fieldId, field => ({
                ...field,
                Validating: false
            }));

            this.State = this.RecalculateDependentFormStatuses(nextState);
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

            const nextState = { ...this.State };
            nextState.FieldsValidationStatuses = nextState.FieldsValidationStatuses.set(fieldId, FieldValidationStatus.HasError);
            nextState.Fields = nextState.Fields.update(fieldId, field => ({
                ...field,
                Validating: false,
                Error: formError
            }));

            this.State = this.RecalculateDependentFormStatuses(nextState);
        }

        this.emit(new Actions.FieldValidated(this.FormId, fieldId));
    }

    public SetActiveField(fieldId: string | undefined): void {
        let fieldBlurredId: string | undefined = undefined;
        if (fieldId == null && this.state.Form.ActiveFieldId != null) {
            fieldBlurredId = this.state.Form.ActiveFieldId;
        }

        const nextState = { ...this.State };

        if (fieldId != null && nextState.Fields.has(fieldId)) {
            nextState.Fields = nextState.Fields.update(fieldId, field => ({
                ...field,
                Touched: true
            }));

            nextState.Form = { ...nextState.Form, ActiveFieldId: fieldId };
        } else if (fieldId != null) {
            console.warn(
                `@simplr/react-forms: Given field '${fieldId}' does not exist in form '${this.FormId}', ` +
                    `therefore field cannot be focused. Form.ActiveFieldId was reset to an undefined.`
            );
        } else {
            nextState.Form = { ...nextState.Form, ActiveFieldId: undefined };
        }

        this.State = this.RecalculateDependentFormStatuses(nextState);

        this.emit(new Actions.FieldActive(this.FormId, fieldId));
        if (fieldBlurredId != null) {
            this.emit(new Actions.FieldBlurred(this.FormId, fieldBlurredId));
        }
    }

    public SetFormDisabled(disabled: boolean): void {
        const nextState = { ...this.State };
        nextState.Form = {
            ...nextState.Form,
            Disabled: disabled
        };

        this.State = this.RecalculateDependentFormStatuses(nextState);

        if (disabled) {
            this.emit(new Actions.FormDisabled(this.FormId));
        } else {
            this.emit(new Actions.FormEnabled(this.FormId));
        }
    }

    public TouchFields(ids?: string[]): void {
        const fieldsIds: string[] = ids || this.state.Fields.keySeq().toArray();

        const nextState = { ...this.State };
        nextState.Fields = nextState.Fields.withMutations(fields => {
            for (const fieldId of fieldsIds) {
                if (fields.has(fieldId)) {
                    fields.update(fieldId, fieldState => ({ ...fieldState, Touched: true }));
                }
            }

            return fields;
        });

        this.State = this.RecalculateDependentFormStatuses(nextState);

        for (const fieldId of fieldsIds) {
            this.emit(new Actions.FieldTouched(this.FormId, fieldId));
        }
    }

    public async ValidateForm(validationPromise: Promise<void>): Promise<void> {
        // If form is not validating
        if (!this.State.Form.Validating) {
            const nexState = { ...this.State };
            nexState.Form = {
                ...nexState.Form,
                Validating: true,
                Error: undefined
            };

            this.State = this.RecalculateDependentFormStatuses(nexState);
        }

        try {
            // Wait for validation to finish
            await validationPromise;
            const nexState = { ...this.State };
            nexState.Form = {
                ...nexState.Form,
                Validating: false
            };

            this.State = this.RecalculateDependentFormStatuses(nexState);
        } catch (error) {
            const formError = ConstructFormError(error, FormErrorOrigin.Validation);
            if (formError == null) {
                throw Error(error);
            }

            const nexState = { ...this.State };
            nexState.Form = {
                ...nexState.Form,
                Validating: false,
                Error: formError
            };

            this.State = this.RecalculateDependentFormStatuses(nexState);
        }
    }

    public InitiateFormSubmit(): void {
        if (this.State.Form.SubmitCallback == null) {
            throw new Error("@simplr/react-forms: Submit method is called before SubmitCallback is set.");
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
        if (!this.State.Form.Submitting) {
            const nexState = { ...this.State };
            nexState.Form = {
                ...nexState.Form,
                Submitting: true,
                Error: undefined
            };
            this.State = this.RecalculateDependentFormStatuses(nexState);
        }

        // Try submitting
        try {
            await promise;
            // No error and submitting -> false
            const nexState = { ...this.State };
            nexState.Form = {
                ...nexState.Form,
                Submitting: false,
                SuccessfullySubmitted: true,
                Error: undefined
            };
            this.State = this.RecalculateDependentFormStatuses(nexState);
        } catch (caughtError) {
            // Set error origin
            const constructedError = ConstructFormError(caughtError, FormErrorOrigin.Submit);
            const nexState = { ...this.State };
            nexState.Form = {
                ...nexState.Form,
                Submitting: false,
                SuccessfullySubmitted: false,
                Error: constructedError
            };
            this.State = this.RecalculateDependentFormStatuses(nexState);
        }
    }

    /**
     * Set fields to default values.
     */
    public ClearFields(ids?: string[]): void {
        const fieldsIds: string[] = ids || this.State.Fields.keySeq().toArray();
        const nextState = { ...this.State };

        nextState.Fields = nextState.Fields.withMutations(fields => {
            for (const fieldId of fieldsIds) {
                if (fields.has(fieldId)) {
                    fields.update(fieldId, field => ({
                        ...field,
                        Error: undefined,
                        Value: field.DefaultValue,
                        Pristine: field.InitialValue === field.DefaultValue,
                        Touched: field.Value !== field.DefaultValue
                    }));
                }
            }
        });

        nextState.Form = {
            ...nextState.Form,
            SuccessfullySubmitted: false,
            Error: undefined
        };

        this.State = this.RecalculateDependentFormStatuses(nextState);
    }

    /**
     * Set fields to initial values.
     */
    public ResetFields(ids?: string[]): void {
        const fieldsIds: string[] = ids || this.State.Fields.keySeq().toArray();
        const nextState = { ...this.State };

        nextState.Fields = nextState.Fields.withMutations(fields => {
            for (const fieldId of fieldsIds) {
                if (fields.has(fieldId)) {
                    fields.update(fieldId, field => ({
                        ...field,
                        Error: undefined,
                        Value: field.InitialValue,
                        Pristine: true,
                        Touched: false
                    }));
                }
            }
        });

        nextState.Form = {
            ...nextState.Form,
            SuccessfullySubmitted: false,
            Error: undefined
        };

        this.State = this.RecalculateDependentFormStatuses(nextState);
    }

    public ToObject<TObject = any>(): TObject {
        if (this.BuiltFormObject == null || this.BuiltFormObject.Fields !== this.State.Fields) {
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
            Fields: Immutable.Map<string, FieldStoreState>(),
            FieldsValidationStatuses: Immutable.Map<string, FieldValidationStatus>(),
            FieldsGroups: Immutable.Map<string, FieldsGroupStoreStateRecord>(),
            Form: this.GetInitialFormState(),
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
            Props: {}
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

        const groupFields = this.State.Fields.filter(x => {
            // If the field is null (never)
            if (x == null) {
                return false;
            }

            if (x.FieldsGroup == null) {
                return fieldsGroupId == null;
            } else {
                return x.FieldsGroup.Id === fieldsGroupId;
            }
        });

        groupFields.forEach((field, fieldId) => {
            if (field == null || fieldId == null) {
                return;
            }
            result[field.Name] = field.Value;
        });

        const fieldsGroups = this.State.FieldsGroups.filter(x => x != null && x.Parent === fieldsGroupId);

        interface FieldArrayItem {
            State: FieldsGroupStoreState;
            FieldId: string;
        }

        // Use mutable structures for better performance
        const fieldsArrays: { [key: string]: FieldArrayItem[] } = {};

        fieldsGroups.forEach((fieldsGroup, fieldId) => {
            if (fieldsGroup == null || fieldId == null) {
                return;
            }

            // FieldsGroup
            if (fieldsGroup.ArrayName == null) {
                result[fieldsGroup.Name] = this.BuildFormObject(fieldId);
                return;
            }

            // FieldsArray, delay processing
            if (fieldsArrays[fieldsGroup.ArrayName] == null) {
                fieldsArrays[fieldsGroup.ArrayName] = [];
            }
            fieldsArrays[fieldsGroup.ArrayName].push({
                State: fieldsGroup,
                FieldId: fieldId
            });
        });

        for (const key in fieldsArrays) {
            if (!fieldsArrays.hasOwnProperty(key)) {
                continue;
            }

            const faItems = fieldsArrays[key];
            // Sort fields by IndexWeight
            faItems.sort((a, b) => {
                let weightA = a.State.IndexWeight;
                if (weightA == null) {
                    weightA = Number.MAX_SAFE_INTEGER;
                }
                let weightB = b.State.IndexWeight;
                if (weightB == null) {
                    weightB = Number.MAX_SAFE_INTEGER;
                }

                if (weightA < weightB) {
                    return -1;
                }
                if (weightA > weightB) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });

            for (const faItem of faItems) {
                // ArrayName is always defined, because only arrays were added into fieldsArrays dictionary.
                const arrayName = faItem.State.ArrayName!;
                if (result[arrayName] == null) {
                    result[arrayName] = [];
                }
                result[arrayName].push(this.BuildFormObject(faItem.FieldId));
            }
        }

        return result;
    }

    protected RecalculateDependentFormStatuses(formStoreState: FormStoreState): FormStoreState {
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
                if (updater.HasError && !updater.Pristine && updater.Touched && updater.Validating) {
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

        if (!updater.Disabled && (formState.Disabled || updater.Submitting)) {
            updater.Disabled = true;
        }

        return { ...formStoreState, ...updater };
    }

    protected IsPromise<T>(value: any): value is Promise<T> {
        return value != null && value.then != null && value.catch != null;
    }
}
