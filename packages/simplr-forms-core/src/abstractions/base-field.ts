import * as React from "react";
import * as actionEmitter from "action-emitter";

import {
    FieldProps,
    FieldState,
    FieldValue,
    FieldValidationType,
    FieldFormatValueCallback,
    FieldNormalizeValueCallback,
    FieldParseValueCallback
} from "../contracts/field";
import * as ValueHelpers from "../utils/value-helpers";
import { FormContextPropsObject } from "../contracts/form";
import { FormStore } from "../stores/form-store";
import { FormStoreStateRecord } from "../contracts/form-store";
import * as FormStoreActions from "../actions/form-store-actions";
// import { FieldsGroupContextProps } from "../contracts/fields-group";
import { FSHContainer } from "../stores/form-stores-handler";

export interface BaseFieldState {
    Field?: FieldState;
    Form?: FormStoreStateRecord;
    Value?: FieldValue;
}

export interface ParentContext {
    FormId: string;
    FormProps: FormContextPropsObject;
    FieldsGroupId: string;
    // FieldsGroupProps: FieldsGroupContextProps;
}


export abstract class BaseField<TProps extends FieldProps, TState extends BaseFieldState>
    extends React.Component<TProps, TState> {
    public context: ParentContext;

    static contextTypes: React.ValidationMap<ParentContext> = {
        FormId: React.PropTypes.string,
        FormProps: React.PropTypes.object,
        FieldsGroupId: React.PropTypes.string,
        // FieldsGroupProps: React.PropTypes.object
    };

    static defaultProps: FieldProps = {
        // Empty string checked to have value in componentWillMount
        name: "",
        validationType: FieldValidationType.OnChange,
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

    componentWillMount() {
        // props.name MUST have a proper value
        if (this.props.name == null || this.props.name === "") {
            throw new Error("simplr-forms-core: A proper field name must be given (undefined and empty string are not valid).");
        }

        if (this.FormId == null) {
            throw new Error("simplr-forms-core: Field must be used inside a Form component.");
        }
        this.StoreEventSubscription =
            this.FormStore.addListener<FormStoreActions.StateUpdated>(
                FormStoreActions.StateUpdated,
                this.OnStoreUpdated.bind(this));
        this.registerFieldInFormStore();
    }

    componentWillReceiveProps(nextProps: FieldProps) {
        // Check if field name has not been changed
        if (this.props.name !== nextProps.name) {
            throw new Error(`simplr-forms-core: Field name must be constant`);
        }

        this.FormStore.UpdateProps(this.FieldId, nextProps);
    }

    componentWillUnmount() {
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
     *
     * @readonly
     * @protected
     *
     * @memberOf BaseField
     */
    protected get IsControlled() {
        return false;
    }

    /**
     * Current or default field value.
     *
     * @readonly
     * @protected
     * @type {FieldValue}
     * @memberOf BaseField
     */
    protected get Value(): FieldValue {
        // If field is defined
        if (this.state != null && this.state.Field != null) {
            // Return its value
            return (this.state.Field as FieldState).Value;
        }

        // Return default value
        return this.DefaultValue;
    }

    protected ProcessValueBeforeStore(value: FieldValue) {
        // Parse and normalize value
        return this.NormalizeValue(this.ParseValue(value));
    }

    protected ProcessValueFromStore(value: FieldValue) {
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
            const formatter = this.props.parseValue as FieldFormatValueCallback;
            return formatter(value);
        }

        return ValueHelpers.FormatValue(
            React.Children.toArray(this.props.children) as Array<JSX.Element>,
            value
        );
    }

    protected NormalizeValue(value: FieldValue): FieldValue {
        if (this.props.formatValue != null) {
            const normalizer = this.props.parseValue as FieldNormalizeValueCallback;
            return normalizer(value);
        }

        return ValueHelpers.NormalizeValue(
            React.Children.toArray(this.props.children) as Array<JSX.Element>,
            value
        );
    }

    protected ChildrenToRender() {
        throw new Error("simplr-forms-core: Not implemented. Needs to filter out Validators, Modifiers and Normalizers.");
    }

    protected OnStoreUpdated() {
        const newFormState = this.FormStore.GetState();
        const newFieldState = this.FormStore.GetField(this.FieldId);

        const isStateDifferent = this.state == null ||
            this.state.Field !== newFieldState ||
            this.state.Form !== newFormState;

        if (isStateDifferent && newFieldState != null) {
            this.setState((state: TState) => {
                state.Form = newFormState;
                state.Field = newFieldState;
                state.Value = this.ProcessValueFromStore(newFieldState.Value);
            });
        }
    }

    protected OnValueChange(newValue: FieldValue, processValue: boolean = true) {
        // Noop if the component is controlled from outside
        if (this.IsControlled) {
            return;
        }

        if (processValue) {
            newValue = this.ProcessValueBeforeStore(newValue);
        }

        this.FormStore.ValueChanged(this.FieldId, newValue);
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
     * Initial value before render.
     * Most common usage is for getting initial value from field props.
     *
     * @readonly
     * @protected
     * @type {(FieldContracts.ValueTypes | any)}
     * @memberOf BaseField
     */
    protected abstract get RawInitialValue(): FieldValue;


    /**
     * Default field value.
     *
     * @readonly
     * @protected
     *
     * @memberOf BaseField
     */
    protected abstract get DefaultValue(): FieldValue;

    /**
     * ========================
     *  Local helper methods
     * ========================
     */

    /**
     * Registers a field in FormStore or throws if the field was already registered
     *
     * @private
     *
     * @memberOf BaseField
     */
    private registerFieldInFormStore() {
        if (this.FormStore.HasField(this.FieldId)) {
            throw new Error(`simplr-forms-core: Duplicate field id '${this.FieldId}'`);
        }

        const initialValue = this.RawInitialValue;
        this.FormStore.RegisterField(
            this.FieldId,
            initialValue,
            this.props,
            this.FieldsGroupId
        );
    }
}
