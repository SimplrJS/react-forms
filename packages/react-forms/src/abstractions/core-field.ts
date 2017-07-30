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
        FieldsGroupProps: PropTypes.object
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
        // If the field is in FieldsArray
        // It's going to be removed in FormStore.UnregisterFieldsArray method

        const props: TProps = this.props;
        // If destroyOnUnmount is not provided in props
        if (props.destroyOnUnmount == null) {
            // By default, fields data should be retained, even if the field is unmounted
            return false;
        }
        return props.destroyOnUnmount;
    }

    protected get IsInFieldsArray(): boolean {
        if (this.context.FieldsGroupId != null) {
            const formState = this.FormStore.GetState();
            const fg = formState.FieldsGroups.get(this.context.FieldsGroupId);
            if (fg == null) {
                throw new Error();
            }
            if (fg.ArrayName != null) {
                return true;
            }
        }
        return false;
    }

    protected get DefaultModifiers(): JSX.Element[] {
        return [];
    }

    protected get DefaultNormalizers(): JSX.Element[] {
        return [];
    }

    protected get FormId(): string {
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

        // If field is in FieldsArray and destroyOnUnmount is defined
        if (this.IsInFieldsArray && this.props.destroyOnUnmount != null) {
            throw new Error("@simplr/react-forms: destroyOnUnmount always defaults to false, when field is inside FieldsArray. Remove destroyOnUnmount prop.");
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
        const defaultValue = this.processedOrEmptyModifierValue(this.RawDefaultValue, this.ProcessValueBeforeStore.bind(this));
        const initialValue = this.processedOrEmptyModifierValue(this.RawInitialValue, this.ProcessValueBeforeStore.bind(this));
        const value = this.processedOrEmptyModifierValue(this.RawValue, this.ProcessValueBeforeStore.bind(this));
        this.FormStore.RegisterField(
            this.FieldId,
            this.props.name,
            defaultValue.Value,
            initialValue.Value,
            value.Value,
            value.TransitionalValue,
            this.props,
            this.FieldsGroupId
        );
    }
}
