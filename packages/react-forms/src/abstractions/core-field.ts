import * as React from "react";
import * as ActionEmitter from "action-emitter";
import * as PropTypes from "prop-types";

import {
    CoreFieldProps,
    FieldValue,
    FieldFormatValueCallback,
    FieldNormalizeValueCallback,
    FieldParseValueCallback,
    FieldContext,
    FieldStoreState,
    FieldChildContext
} from "../contracts/field";
import * as ValueHelpers from "../utils/value-helpers";
import { FormStore } from "../stores/form-store";
import * as FormStoreActions from "../actions/form-store";
import { FSHContainer } from "../stores/form-stores-handler";
import { FormStoreStateRecord } from "../contracts/form-store";
import { ModifierValue } from "../contracts/value";
import { FormStoreHelpers } from "../stores/form-store-helpers";

export interface CoreFieldState {
    FormStoreState: FormStoreStateRecord;
    Value?: FieldValue;
}

export abstract class CoreField<TProps extends CoreFieldProps, TState extends CoreFieldState>
    extends React.Component<TProps, TState> {
    public context: FieldContext;

    public static contextTypes: PropTypes.ValidationMap<FieldContext> = {
        FormId: PropTypes.string,
        FormProps: PropTypes.object,
        FieldsGroupId: PropTypes.string,
        FieldsGroupProps: PropTypes.object,
        IsInFieldsArray: PropTypes.bool
    };

    public static childContextTypes: PropTypes.ValidationMap<FieldChildContext> = {
        FieldId: PropTypes.string
    };

    public getChildContext(): FieldChildContext {
        return {
            FieldId: this.FieldId
        };
    }

    public static defaultProps: CoreFieldProps = {
        // Empty string checked to have value in componentWillMount
        name: ""
    };

    protected get DestroyOnUnmount(): boolean {
        const props: TProps = this.props;

        // If field is in FieldsArray, it has to always be destroyed when unmounted.
        if (this.IsInFieldsArray) {
            return true;
        }

        // If destroyOnUnmount is not provided in props
        if (props.destroyOnUnmount == null) {
            // By default, field's data should not be retained when the field is unmounted,
            // because default React mechanism unmounts components and they're gone.
            // While showing only a portion of a Form at a time for a better UX,
            // and wanting to keep the data, user can set destroyOnUnmount to false explicitly.
            return true;
        }
        return props.destroyOnUnmount;
    }

    protected get DefaultModifiers(): JSX.Element[] {
        return [];
    }

    protected get DefaultNormalizers(): JSX.Element[] {
        return [];
    }

    protected get FormId(): string {
        // Check for this value is done in componentWillMount
        // to ensure that field is being used inside the form.
        return this.context.FormId;
    }

    protected get FormStore(): FormStore {
        return FSHContainer.FormStoresHandler.GetStore(this.FormId);
    }

    protected get FieldId(): string {
        return FormStoreHelpers.GetFieldId(this.props.name, this.FieldsGroupId);
    }

    protected get FieldsGroupId(): string {
        return this.context.FieldsGroupId;
    }

    protected get FieldState(): FieldStoreState {
        return this.FormStore.GetState().Fields.get(this.FieldId);
    }

    protected get Name(): string {
        return this.FieldState.Name;
    }

    protected StoreEventSubscription: ActionEmitter.EventSubscription;

    public componentWillMount(): void {
        // props.name MUST have a proper value
        if (this.props.name == null || this.props.name === "") {
            throw new Error("@simplr/react-forms: A proper field name must be given (undefined and empty string are not valid).");
        }

        if (this.FormId == null) {
            throw new Error("@simplr/react-forms: Field must be used inside a Form component.");
        }

        this.StoreEventSubscription =
            this.FormStore.addListener<FormStoreActions.StateChanged>(
                FormStoreActions.StateChanged,
                this.OnStoreUpdated.bind(this));
        this.registerFieldInFormStore();
    }

    public componentWillReceiveProps(nextProps: TProps): void {
        const props = this.props as CoreFieldProps;
        // Check if field name has not been changed
        if (props.name !== nextProps.name) {
            throw new Error("@simplr/react-forms: Field name must be constant.");
        }

        this.getFormStoreValuesUpdater()
            .updateFormStoreValues(this.FormStore);

        this.FormStore.UpdateFieldProps(this.FieldId, nextProps);
    }

    public componentWillUnmount(): void {
        if (this.StoreEventSubscription != null) {
            this.StoreEventSubscription.remove();
        }
        if (this.FormStore != null && this.DestroyOnUnmount) {
            this.FormStore.UnregisterField(this.FieldId);
        }
    }

    /**
     * ========================
     *  Protected methods
     * ========================
     */

    /**
     * Is field currently controlled.
     */
    protected abstract get IsControlled(): boolean;

    /**
     * Current or default field value.
     */
    protected get Value(): FieldValue {
        // If state is defined and Value is set
        if (this.state != null && this.state.Value != null) {
            // Return its value
            return this.state.Value;
        }

        // Return default value
        return this.RawDefaultValue;
    }

    protected abstract get ControlledValue(): FieldValue;

    protected ProcessValueBeforeStore(value: FieldValue): ModifierValue {
        // Parse and normalize value
        if (value != null) {
            const modifierValue: ModifierValue = {
                Value: value
            };
            const parsedValue = this.ParseValue(modifierValue);

            const result: ModifierValue = modifierValue;

            result.Value = this.NormalizeValue(parsedValue.Value);

            if (parsedValue.TransitionalValue != null) {
                result.TransitionalValue = this.NormalizeValue(parsedValue.TransitionalValue);
            }

            return result;
        }

        return {
            Value: value
        };
    }

    protected ProcessValueFromStore(value: FieldValue): FieldValue {
        return this.FormatValue(value);
    }

    protected ParseValue(value: ModifierValue): ModifierValue {
        if (this.props.parseValue != null) {
            const parser = this.props.parseValue as FieldParseValueCallback;
            value = parser(value);
        }
        return ValueHelpers.ParseValue(
            React.Children.toArray(this.props.children) as JSX.Element[],
            this.DefaultModifiers,
            value
        );
    }

    protected FormatValue(value: FieldValue): FieldValue {
        if (this.props.formatValue != null) {
            const formatter = this.props.formatValue as FieldFormatValueCallback;
            value = formatter(value);
        }

        const modifiers = React.Children.toArray(this.props.children) as JSX.Element[];
        return ValueHelpers.FormatValue(
            modifiers.reverse(),
            Array.from(this.DefaultModifiers).reverse(),
            value
        );
    }

    protected NormalizeValue(value: FieldValue): FieldValue {
        if (this.props.normalizeValue != null) {
            const normalizer = this.props.normalizeValue as FieldNormalizeValueCallback;
            value = normalizer(value);
        }

        return ValueHelpers.NormalizeValue(
            React.Children.toArray(this.props.children) as JSX.Element[],
            this.DefaultNormalizers,
            value
        );
    }

    protected ChildrenToRender(): void {
        throw new Error("@simplr/react-forms: Not implemented. Needs to filter out Validators, Modifiers and Normalizers.");
    }

    protected OnStoreUpdated(): void {
        const newFormStoreState = this.FormStore.GetState();

        const isStateDifferent = this.state == null ||
            this.state.FormStoreState !== newFormStoreState;

        if (isStateDifferent) {
            this.setState((state: TState) => {
                if (state == null) {
                    state = {
                        FormStoreState: newFormStoreState
                    } as TState;
                } else {
                    state.FormStoreState = newFormStoreState;
                }
                const newFieldState = this.FormStore.GetField(this.FieldId);
                const value = newFieldState.TransitionalValue != null ? newFieldState.TransitionalValue : newFieldState.Value;
                state.Value = this.ProcessValueFromStore(value);
                return state;
            });
        }
    }

    protected OnValueChange(newValue: FieldValue, processValue: boolean = true): void {
        // Noop if the component is controlled from outside
        if (this.IsControlled) {
            return;
        }

        if (processValue) {
            newValue = this.ProcessValueBeforeStore(newValue);
        }

        this.FormStore.UpdateFieldValue(this.FieldId, newValue);
    }

    protected Focus(): void {
        this.FormStore.SetActiveField(this.FieldId);
    }

    protected Blur(): void {
        this.FormStore.SetActiveField(undefined);
    }

    protected get IsInFieldsArray(): boolean {
        return this.context.IsInFieldsArray;
    }

    /**
     * ========================
     *  Abstract methods
     * ========================
     */

    /**
     * React Component's render method
     */
    public abstract render(): JSX.Element | null;

    /**
     * Default field value.
     */
    protected abstract get RawDefaultValue(): FieldValue;

    /**
     * Initial value.
     */
    protected abstract get RawInitialValue(): FieldValue;

    /**
     * Value before render.
     * Most common usage is for getting value from field props.
     */
    protected abstract get RawValue(): FieldValue;

    /**
     * ========================
     *  Local helper methods
     * ========================
     */

    private processedOrEmptyModifierValue(value: FieldValue, processor: (value: FieldValue) => ModifierValue): ModifierValue {
        if (value != null) {
            return processor(value);
        }
        return {
            Value: value
        };
    }

    /**
     * Registers a field in FormStore or throws if the field was already registered
     */
    private registerFieldInFormStore(): void {
        const formHasField = this.FormStore.HasField(this.FieldId) || this.FormStore.HasFieldsGroup(this.FieldId);

        const fieldValues = this.getFormStoreValuesUpdater();
        if (
            // If field has already been registered
            formHasField
            // And DestroyOnUnmount is true
            && this.DestroyOnUnmount) {
            // Then throw, because it's an ambiguous situation and it's tricky to support it,
            // because if user copies and pastes a field with a name prop already specified,
            // and does not change the name, not throwing here would make it a frequent unintentional behavior
            // that is not visible right away.
            throw new Error(`@simplr/react-forms: Field '${this.FieldId}' already exists in form '${this.FormId}.`);
        }

        // If field does not exist
        if (!formHasField) {
            // Register the field with form store
            this.FormStore.RegisterField(
                this.FieldId,
                this.props.name,
                fieldValues.defaultValue.Value,
                fieldValues.initialValue.Value,
                fieldValues.value.Value,
                fieldValues.value.TransitionalValue,
                this.props,
                this.FieldsGroupId,
                this.IsInFieldsArray
            );
        } else {
            // Update field values
            fieldValues.updateFormStoreValues(this.FormStore);
        }
    }

    private getFormStoreValuesUpdater(): {
        defaultValue: ModifierValue,
        initialValue: ModifierValue,
        value: ModifierValue,
        updateFormStoreValues: (formStore: FormStore) => void
    } {
        const defaultValue = this.processedOrEmptyModifierValue(this.RawDefaultValue, this.ProcessValueBeforeStore.bind(this));
        const initialValue = this.processedOrEmptyModifierValue(this.RawInitialValue, this.ProcessValueBeforeStore.bind(this));
        const value = this.processedOrEmptyModifierValue(this.RawValue, this.ProcessValueBeforeStore.bind(this));

        return {
            defaultValue,
            initialValue,
            value,
            updateFormStoreValues: formStore => {
                formStore.UpdateFieldDefaultValue(this.FieldId, defaultValue);
                formStore.UpdateFieldInitialValue(this.FieldId, initialValue);
                formStore.UpdateFieldValue(this.FieldId, value);
            }
        };
    }
}
