import * as React from "react";
import * as Immutable from "immutable";
import { recordify } from "typed-immutable-record";
import { ActionEmitter } from "action-emitter";

import * as Actions from "../actions/form-store";
import {
    FieldState,
    FieldValue,
    FieldStateRecord,
    FormErrorRecord,
    FieldStatePropsRecord,
    FieldStateProps
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
    BuiltFormObject
} from "../contracts/form-store";
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
    protected BuiltFormObject: BuiltFormObject;

    private state: FormStoreStateRecord;
    protected get State(): FormStoreStateRecord {
        return this.state;
    }
    protected set State(newState: FormStoreStateRecord) {
        this.state = newState;
        this.emit(new Actions.StateChanged());
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
            return `${fieldsGroupId}___${fieldName}`;
        }

        return fieldName;
    }

    public RegisterField(
        fieldId: string,
        defaultValue: FieldValue,
        initialValue?: FieldValue,
        value?: FieldValue,
        props?: FieldStateProps,
        fieldsGroupId?: string
    ): void {
        // Construct field state
        let fieldState = this.GetInitialFieldState();

        // Set default value without fallbacks
        fieldState.DefaultValue = defaultValue;

        // (initialValue)(value)
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

    public UnregisterField(fieldId: string): void {
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

    public SetFormSubmitCallback(submitCallback: () => void): void {
        this.State = this.State.withMutations(state => {
            state.Form = state.Form.merge({
                SubmitCallback: submitCallback
            } as FormState);
        });
    }

    public UpdateFormProps(props: FormProps): void {
        this.State = this.State.withMutations(state => {
            state.FormProps = recordify<FormProps, FormPropsRecord>(props);
            this.emit(new Actions.FormPropsChanged());
        });
    }

    public UpdateFieldProps(fieldId: string, props: FieldStateProps): void {
        const propsRecord = recordify<FieldStateProps, FieldStatePropsRecord>(props);
        const fieldState = this.State.Fields.get(fieldId);

        if (fieldState.Props == null) {
            return;
        }

        // Custom props diff, because Immutable.Reacord.equals always returns false
        // (because of children always changing?..)
        let changed = false;
        propsRecord.toSeq().forEach((value, key) => {
            if (key == null) {
                return;
            }
            const oldValue = fieldState.Props!.get(key);
            if (key !== "children") {
                if (!this.ObjectsEqualDeepCheck(oldValue, value)) {
                    changed = true;
                    return false;
                }
            } else {
                // Take old children
                const oldChildren = fieldState.Props!.get(key) as React.ReactNode | undefined;
                if (oldChildren != null) {
                    // Take new children and convert them to an array with React.Children.toArray
                    const newChildren = React.Children.toArray(value);

                    // For each oldChildren
                    React.Children.forEach(oldChildren, (child: React.ReactChild, index) => {
                        // If a child is a text component and no new children is equal to it
                        if (typeof child === "string" && !newChildren.some(x => x === child)) {
                            // Props have changed
                            changed = true;
                            return false;
                        }

                        const childElement = child as React.ReactElement<any>;

                        // Try to find best a match for an old child in the newChildren array
                        const newChildElement = newChildren.find(x => {
                            // String case has been checked before
                            if (typeof x !== "string") {
                                const xElement = x as React.ReactElement<any>;
                                // If type and key properties match
                                // Children should be the same
                                if (xElement.type === childElement.type &&
                                    xElement.key === childElement.key) {
                                    return true;
                                }
                            }
                            // Return false explicitly by default
                            return false;
                        }) as React.ReactElement<any>;

                        // If newChildElement was found and its props are different
                        if (newChildElement != null &&
                            !this.ObjectsEqualDeepCheck(childElement.props, newChildElement.props)) {
                            // Props have changed
                            changed = true;
                            return false;
                        }
                    });
                }
            }
        });

        if (!changed) {
            return;
        }

        this.State = this.State.withMutations(state => {
            const fieldState = state.Fields.get(fieldId);
            state.Fields = state.Fields.set(fieldId, fieldState.merge({
                Props: recordify<FieldStateProps, FieldStatePropsRecord>(props)
            } as FieldState));
        });

        this.emit(new Actions.FieldPropsChanged(fieldId));
    }

    public UpdateFieldValue(fieldId: string, newValue: FieldValue): void {
        const fieldState = this.State.Fields.get(fieldId);
        if (fieldState.Value === newValue) {
            return;
        }

        this.State = this.State.withMutations(state => {
            const newPristine = (newValue === fieldState.InitialValue);
            state.Fields = state.Fields.set(fieldId, fieldState.merge({
                Value: newValue,
                Pristine: newPristine,
                Touched: true
            } as FieldState));

            state.Form = this.RecalculateDependentFormState(state, {
                Pristine: newPristine,
                Touched: true
            });
        });

        this.emit(new Actions.ValueChanged(fieldId, newValue));
    }

    public async ValidateField(fieldId: string, validationPromise: Promise<never>): Promise<void> {
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

    public InitiateFormSubmit(): void {
        if (this.State.Form.SubmitCallback == null) {
            throw new Error("simplr-forms-core: Submit method is called before SubmitCallback is set.");
        }
        this.State.Form.SubmitCallback();
    }

    public async SubmitForm(result: Promise<void> | FormError | any): Promise<void> {
        let promise: Promise<void>;
        if (this.IsPromise<void>(result)) {
            promise = result;
        } else {
            promise = new Promise<void>((resolve, reject) => {
                const error = ConstructFormError(result);
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
        });

        // Try submitting
        try {
            await promise;
            // No error and submitting -> false
            this.State = this.State.withMutations(state => {
                state.Form = state.Form.merge({
                    Submitting: false,
                    Error: undefined
                } as FormState);
            });
        } catch (err) {
            // Error and submitting -> false
            this.State = this.State.withMutations(state => {
                state.Form = state.Form.merge({
                    Submitting: false,
                    Error: err
                } as FormState);
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
                    } as FieldState));
                }
            });
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
                    } as FieldState));
                }
            });
        });
    }

    public ToObject<TObject = any>(): TObject {
        if (this.BuiltFormObject == null ||
            this.BuiltFormObject.Fields !== this.State.Fields) {
            this.BuiltFormObject = {
                Fields: this.State.Fields,
                Object: this.BuildFormObject(this.State)
            };
        }
        return this.BuiltFormObject.Object;
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
            Form: recordify<FormState, FormStateRecord>(this.GetInitialFormState()),
            FormProps: recordify<FormProps, FormPropsRecord>({})
        });
    }

    protected GetInitialFormState(): FormState {
        return {
            Validating: false,
            Submitting: false,
            Pristine: true,
            SuccessfullySubmitted: false,
            ActiveFieldId: undefined,
            Touched: false,
            Error: undefined,
            SubmitCallback: undefined
        };
    }

    protected GetInitialFieldState(): FieldState {
        return {
            DefaultValue: undefined,
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

    protected BuildFormObject(state: FormStoreStateRecord) {
        const formStoreObject: { [id: string]: any } = {};

        this.State.Fields.forEach((field, fieldId) => {
            if (fieldId == null || field == null) {
                return;
            }
            formStoreObject[fieldId] = field.Value;
        });

        // TODO: FieldsGroups values

        return formStoreObject;
    }

    protected RecalculateDependentFormState(
        formStoreState: FormStoreStateRecord,
        newStatePartial: Partial<FormState>): FormStateRecord {
        let updater = {
            Pristine: true,
            Touched: false,
            ...newStatePartial
        } as FormState;

        // TODO: might build curried function for more efficient checking

        this.State.Fields.forEach(field => {
            if (field != null) {
                if (updater.Pristine && !field.Pristine) {
                    updater.Pristine = false;
                }
                if (!updater.Touched && field.Touched) {
                    updater.Touched = true;
                }

                // Short circuit if both Pristine and Touched are already resolved
                if (!updater.Pristine && updater.Touched) {
                    return false;
                }
            }
        });

        return formStoreState.Form.merge(updater);
    }

    protected IsPromise<T>(value: any): value is Promise<T> {
        return value != null && value.then != null && value.catch != null;
    }

    protected ObjectsEqualDeepCheck(obj: { [key: string]: any }, obj2: { [key: string]: any }) {
        if (typeof obj !== "object" && typeof obj !== typeof obj2) {
            console.warn("Object Deep Check: Variable given is not an object!");
            return false;
        }

        if ((obj == null && obj2 != null) || (obj != null && obj2 == null)) {
            return false;
        } else if (obj == null && obj2 == null) {
            return true;
        }

        if (Object.keys(obj2).length !== Object.keys(obj).length) {
            return false;
        }

        for (let key in obj) {
            if (typeof obj[key] === "object" && typeof obj2[key] === "object") {
                if (!this.ObjectsEqualDeepCheck(obj[key], obj2[key])) {
                    return false;
                }
            } else if (obj[key] !== obj2[key]) {
                return false;
            }
        }
        return true;
    }
}
