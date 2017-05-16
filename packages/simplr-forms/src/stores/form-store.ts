import * as React from "react";
import * as Immutable from "immutable";
import { recordify, TypedRecord } from "typed-immutable-record";
import { ActionEmitter } from "action-emitter";

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
        props?: FieldProps,
        fieldsGroupId?: string
    ): void {
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

        // Add field into form store state
        this.State = this.State.withMutations(state => {
            state.Fields = state.Fields.set(fieldId, recordify<FieldStoreState, FieldStoreStateRecord>(fieldState));
        });

        this.emit(new Actions.FieldRegistered(fieldId));
    }

    public RegisterFieldsGroup(id: string, name: string, parentId?: string): void {
        const fgState: FieldsGroupStoreState = {
            Name: name,
            Parent: parentId
        };

        const fgStateRecord = recordify<FieldsGroupStoreState, FieldsGroupStoreStateRecord>(fgState);
        this.State = this.State.withMutations(state => {
            state.FieldsGroups = state.FieldsGroups.set(id, fgStateRecord);
        });

        this.emit(new Actions.FieldsGroupRegistered(id));
    }

    public RegisterFieldsArray(id: string, name: string, index: number, parentId?: string): void {
        const fgState: FieldsGroupStoreState = {
            Name: name,
            ArrayName: name,
            Parent: parentId
        };

        const fgStateRecord = recordify<FieldsGroupStoreState, FieldsGroupStoreStateRecord>(fgState);
        this.State = this.State.withMutations(state => {
            state.FieldsGroups = state.FieldsGroups.set(id, fgStateRecord);
        });

        this.emit(new Actions.FieldsArrayRegistered(id));
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
            });
            this.emit(new Actions.FormPropsChanged());
        });
    }

    public UpdateFieldProps(fieldId: string, props: FieldProps): void {
        const propsRecord = recordify<FieldProps, FieldStorePropsRecord>(props);
        const fieldState = this.State.Fields.get(fieldId);

        if (fieldState.Props == null ||
            this.PropsEqual(propsRecord, fieldState.Props)) {
            return;
        }

        this.State = this.State.withMutations(state => {
            const fieldState = state.Fields.get(fieldId);
            state.Fields = state.Fields.set(fieldId, fieldState.merge({
                Props: propsRecord
            } as FieldStoreState));
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
            } as FieldStoreState));

            state.Form = state.Form.merge({
                SuccessfullySubmitted: false,
                Error: undefined
            } as FormState);

            return this.RecalculateDependentFormStatuses(state);
        });

        this.emit(new Actions.ValueChanged(fieldId));
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
            return state;
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
                return state;
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
            Validating: false,
            HasError: false,
            Pristine: true,
            Touched: false
        };
    }

    protected GetInitialFormState(): FormState {
        return {
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
            Validating: false
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
        fieldsGroups.forEach((fieldsGroup, fieldsGroupId) => {
            if (fieldsGroup == null || fieldsGroupId == null) {
                return;
            }
            if (fieldsGroup.ArrayName != null) {
                if (result[fieldsGroup.ArrayName] == null) {
                    result[fieldsGroup.ArrayName] = [];
                }
                result[fieldsGroup.ArrayName].push(this.BuildFormObject(fieldsGroupId));
            } else {
                result[fieldsGroup.Name] = this.BuildFormObject(fieldsGroupId);
            }
        });
        return result;
    }

    protected RecalculateDependentFormStatuses(formStoreState: FormStoreStateRecord): FormStoreStateRecord {
        let updater: FormStoreStateStatus = this.GetInitialStoreStatus();

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

        return formStoreState.merge(updater);
    }

    protected IsPromise<T>(value: any): value is Promise<T> {
        return value != null && value.then != null && value.catch != null;
    }

    protected DeepCompare(...args: any[]): boolean {
        var i, l, leftChain: any, rightChain: any;

        function Compare2Objects(x: any, y: any) {
            var p;

            // remember that NaN === NaN returns false
            // and isNaN(undefined) returns true
            if (isNaN(x) && isNaN(y) && typeof x === "number" && typeof y === "number") {
                return true;
            }

            // Compare primitives and functions.
            // Check if both arguments link to the same object.
            // Especially useful on the step where we compare prototypes
            if (x === y) {
                return true;
            }

            // Works in case when functions are created in constructor.
            // Comparing dates is a common scenario. Another built-ins?
            // We can even handle functions passed across iframes
            if ((typeof x === "function" && typeof y === "function") ||
                (x instanceof Date && y instanceof Date) ||
                (x instanceof RegExp && y instanceof RegExp) ||
                (x instanceof String && y instanceof String) ||
                (x instanceof Number && y instanceof Number)) {
                return x.toString() === y.toString();
            }

            // At last checking prototypes as good as we can
            if (!(x instanceof Object && y instanceof Object)) {
                return false;
            }

            if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
                return false;
            }

            if (x.constructor !== y.constructor) {
                return false;
            }

            if (x.prototype !== y.prototype) {
                return false;
            }

            // Check for infinitive linking loops
            if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
                return false;
            }

            // Quick checking of one object being a subset of another.
            // todo: cache the structure of arguments[0] for performance
            for (p in y) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                } else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }
            }

            // tslint:disable-next-line:forin
            for (p in x) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                } else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }

                switch (typeof (x[p])) {
                    case "object":
                    case "function":

                        leftChain.push(x);
                        rightChain.push(y);

                        if (!Compare2Objects(x[p], y[p])) {
                            return false;
                        }

                        leftChain.pop();
                        rightChain.pop();
                        break;

                    default:
                        if (x[p] !== y[p]) {
                            return false;
                        }
                        break;
                }
            }

            return true;
        }

        if (args.length < 1) {
            //Die silently? Don't know how to handle such case, please help...
            return true;
            // throw "Need two or more arguments to compare";
        }

        for (i = 1, l = args.length; i < l; i++) {
            //Todo: this can be cached
            leftChain = [];
            rightChain = [];

            if (!Compare2Objects(args[0], args[i])) {
                return false;
            }
        }

        return true;
    }

    protected ArrayUnique<T>(array: Array<T>, concat: boolean = true): Array<T> {
        let result = concat ? array.concat() : array;
        for (var i = 0; i < result.length; ++i) {
            for (var j = i + 1; j < result.length; ++j) {
                if (result[i] === result[j]) {
                    result.splice(j--, 1);
                }
            }
        }
        return result;
    }

    protected RemoveValues<T>(array: T[], valuesToRemove: T[], concat: boolean = true): T[] {
        let result = concat ? array.concat() : array;
        for (const value of valuesToRemove) {
            let index;
            while ((index = result.indexOf(value)) !== -1) {
                result.splice(index, 1);
            }
        }
        return result;
    }

    protected PropsEqual(newProps: FieldStorePropsRecord, oldProps: FieldStorePropsRecord): boolean {
        const newKeys = newProps.keySeq().toArray();
        const oldKeys = oldProps.keySeq().toArray();

        if (newKeys.length !== oldKeys.length) {
            return false;
        }
        const childrenKey = "children";
        let allKeys = this.ArrayUnique(newKeys.concat(oldKeys), false);
        allKeys = this.RemoveValues(allKeys, [childrenKey], false);

        // Custom props diff, to have most efficient diffing

        // Fist, check top level properties
        for (const key of allKeys) {
            const newValue = newProps.get(key);
            const oldValue = oldProps.get(key);

            const newValueType = typeof newValue;
            const oldValueType = typeof oldValue;

            if (newValueType !== oldValueType) {
                return false;
            }

            if (newValueType === "object" && !this.DeepCompare(newValue, oldValue)) {
                return false;
            } else if (newValue !== oldValue) {
                return false;
            }
        }

        const newChildrenValue = newProps.get(childrenKey) as React.ReactNode | undefined;
        const oldChildrenValue = oldProps.get(childrenKey) as React.ReactNode | undefined;

        const newChildren = React.Children.toArray(newChildrenValue);
        const oldChildren = React.Children.toArray(oldChildrenValue);

        if (newChildren.length !== oldChildren.length) {
            return false;
        }

        // For each newChildren
        for (const child of newChildren) {
            // If a child is a text component and no old child is equal to it
            if (typeof child === "string" && !oldChildren.some(x => x === child)) {
                // Props have changed
                return false;
            }

            const newChildElement = child as React.ReactElement<any>;

            // Try to find best a match for an old child in the newChildren array
            const oldChildElement = oldChildren.find(oldChild => {
                // String case has been checked before
                if (typeof oldChild !== "string") {
                    const element = oldChild as React.ReactElement<any>;
                    // If type and key properties match
                    // Children should be the same
                    if (element.type === newChildElement.type &&
                        element.key === newChildElement.key) {
                        return true;
                    }
                }
                // Return false explicitly by default
                return false;
            }) as React.ReactElement<any> | undefined;

            // If oldChildElement was found and its props are different
            if (oldChildElement != null &&
                !this.DeepCompare(newChildElement.props, oldChildElement.props)) {
                // Props are not the same
                return false;
            }
        }
        // Props are equal
        return true;
    }
}
