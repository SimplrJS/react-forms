import * as React from "react";
import * as actionEmitter from "action-emitter";
import * as PropTypes from "prop-types";

import {
    CoreFieldProps,
    FieldValue,
    FieldFormatValueCallback,
    FieldNormalizeValueCallback,
    FieldParseValueCallback,
    FieldStoreStateRecord,
    FieldContext
} from "../contracts/field";
import * as ValueHelpers from "../utils/value-helpers";
import { FormContextPropsObject } from "../contracts/form";
import { FormStore } from "../stores/form-store";
import { FormStoreStateRecord } from "../contracts/form-store";
import * as FormStoreActions from "../actions/form-store";
// import { FieldsGroupContextProps } from "../contracts/fields-group";
import { FSHContainer } from "../stores/form-stores-handler";
import { FieldValidationType } from "../contracts/validation";

export interface CoreFieldState {
    Field?: FieldStoreStateRecord;
    Form?: FormStoreStateRecord;
    Value?: FieldValue;
}

export abstract class CoreField<TProps extends CoreFieldProps, TState extends CoreFieldState>
    extends React.Component<TProps, TState> {
    public context: FieldContext;

    static contextTypes: PropTypes.ValidationMap<FieldContext> = {
        FormId: PropTypes.string,
        FormProps: PropTypes.object,
        FieldsGroupId: PropTypes.string,
        FieldsGroupProps: PropTypes.object
    };

    static defaultProps: CoreFieldProps = {
        // Empty string checked to have value in componentWillMount
        name: "",
        // By default, fields data should be retained, even if the field is unmounted
        destroyOnUnmount: false
    };

    protected get FormId(): string {
        return this.context.FormId;
    }

    protected get FormStore(): FormStore {
        return FSHContainer.FormStoresHandler.GetStore(this.FormId);
    }

    protected get FieldId(): string {
        return this.FormStore.GetFieldId(this.props.name, this.FieldsGroupId);
    }

    protected get FieldsGroupId(): string {
        return this.context.FieldsGroupId;
    }

    protected StoreEventSubscription: actionEmitter.EventSubscription;

    componentWillMount(): void {
        // props.name MUST have a proper value
        if (this.props.name == null || this.props.name === "") {
            throw new Error("simplr-forms: A proper field name must be given (undefined and empty string are not valid).");
        }

        if (this.FormId == null) {
            throw new Error("simplr-forms: Field must be used inside a Form component.");
        }
        this.StoreEventSubscription =
            this.FormStore.addListener<FormStoreActions.StateChanged>(
                FormStoreActions.StateChanged,
                this.OnStoreUpdated.bind(this));
        this.registerFieldInFormStore();
    }

    componentWillReceiveProps(nextProps: CoreFieldProps): void {
        // Check if field name has not been changed
        if (this.props.name !== nextProps.name) {
            throw new Error(`simplr-forms: Field name must be constant`);
        }

        this.FormStore.UpdateFieldProps(this.FieldId, nextProps);
    }

    componentWillUnmount(): void {
        if (this.StoreEventSubscription != null) {
            this.StoreEventSubscription.remove();
        }
        if (this.FormStore != null && this.props.destroyOnUnmount) {
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
    protected get IsControlled(): boolean {
        return false;
    }

    /**
     * Current or default field value.
     */
    protected get Value(): FieldValue {
        // If field is defined
        if (this.state != null && this.state.Value != null) {
            // Return its value
            return this.state.Value;
        }

        // Return default value
        return this.RawDefaultValue;
    }

    protected ProcessValueBeforeStore(value: FieldValue): FieldValue {
        // Parse and normalize value
        if (value != null) {
            return this.NormalizeValue(this.ParseValue(value));
        }
        return value;
    }

    protected ProcessValueFromStore(value: FieldValue): FieldValue {
        return this.FormatValue(value);
    }

    protected ParseValue(value: FieldValue): FieldValue {
        if (this.props.parseValue != null) {
            const parser = this.props.parseValue as FieldParseValueCallback;
            return parser(value);
        }
        return ValueHelpers.ParseValue(
            React.Children.toArray(this.props.children) as Array<JSX.Element>,
            value
        );
    }

    protected FormatValue(value: FieldValue): FieldValue {
        if (this.props.formatValue != null) {
            const formatter = this.props.formatValue as FieldFormatValueCallback;
            return formatter(value);
        }

        return ValueHelpers.FormatValue(
            React.Children.toArray(this.props.children) as Array<JSX.Element>,
            value
        );
    }

    protected NormalizeValue(value: FieldValue): FieldValue {
        if (this.props.normalizeValue != null) {
            const normalizer = this.props.normalizeValue as FieldNormalizeValueCallback;
            return normalizer(value);
        }

        return ValueHelpers.NormalizeValue(
            React.Children.toArray(this.props.children) as Array<JSX.Element>,
            value
        );
    }

    protected ChildrenToRender(): void {
        throw new Error("simplr-forms: Not implemented. Needs to filter out Validators, Modifiers and Normalizers.");
    }

    protected OnStoreUpdated(): void {
        const newFormState = this.FormStore.GetState();
        const newFieldState = this.FormStore.GetField(this.FieldId);

        const isStateDifferent = this.state == null ||
            this.state.Field !== newFieldState ||
            this.state.Form !== newFormState;

        if (isStateDifferent && newFieldState != null) {
            this.setState((state: TState) => {
                if (state == null) {
                    state = {} as any;
                }
                state.Form = newFormState;
                state.Field = newFieldState;
                state.Value = this.ProcessValueFromStore(newFieldState.Value);
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
    abstract render(): JSX.Element | null;

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

    /**
     * Registers a field in FormStore or throws if the field was already registered
     */
    private registerFieldInFormStore(): void {
        if (this.FormStore.HasField(this.FieldId)) {
            throw new Error(`simplr-forms: Duplicate field id '${this.FieldId}'`);
        }

        const defaultValue = this.ProcessValueBeforeStore(this.RawDefaultValue);
        const initialValue = this.ProcessValueBeforeStore(this.RawInitialValue);
        const value = this.ProcessValueBeforeStore(this.RawValue);
        this.FormStore.RegisterField(
            this.FieldId,
            this.props.name,
            defaultValue,
            initialValue,
            value,
            this.props,
            this.FieldsGroupId
        );
    }
}
