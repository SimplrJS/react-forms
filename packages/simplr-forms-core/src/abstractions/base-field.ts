import * as React from "react";
import * as fbemitter from "fbemitter";

import {
    FieldProps,
    FieldState,
    FieldValue,
    FieldValidationType
} from "../contracts/field";
import { FormState, FormContextPropsObject } from "../contracts/form";
import { FormStore } from "../stores/form-store";
import * as FormStoreActions from "../stores/form-store-actions";
import { FieldsGroupContextProps } from "../contracts/fields-group";
import { FSHContainer } from "../stores/form-stores-handler";

export interface BaseFieldState {
    Field?: FieldState;
    Form?: FormState;
    RenderValue?: FieldValue;
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

    protected get FormStore(): FormStore {
        return FSHContainer.FormStoresHandler.GetStore(this.context.FormId);
    }

    protected get FieldId(): string {
        return this.FormStore.GetFieldId(this.props.name, this.context.FieldsGroupId);
    }

    protected StoreEventSubscription: fbemitter.EventSubscription;

    componentWillMount() {
        // props.name MUST have a proper value
        if (this.props.name == null || this.props.name === "") {
            throw new Error("simplr-forms-core: A proper field name must be given (undefined and empty string are not valid).");
        }

        if (this.context.FormId == null) {
            throw new Error("simplr-forms-core: Field must be used inside a Form component.");
        }

        this.StoreEventSubscription =
            this.FormStore.addListener<FormStoreActions.StateUpdated>(FormStoreActions.StateUpdated, this.OnStoreUpdated);

        this.registerFieldInFormStore();

        // TODO: Set validators
    }

    componentWillReceiveProps(nextProps: FieldProps) {
        // Check if field name has not been changed
        if (this.props.name !== nextProps.name) {
            throw new Error(`simplr-forms-core: Field name must be constant`);
        }

        // TODO: Update validators
    }

    componentWillUnmount() {
        if (this.StoreEventSubscription != null) {
            this.StoreEventSubscription.remove();
        }
        if (this.FormStore != null && this.props.destroyOnUnmount) {
            this.FormStore.UnregisterField(this.FieldId);
        }
    }


    protected OnStoreUpdated(action: FormStoreActions.StateUpdated) {

    }

    /**
     * ========================
     *  Protected methods
     * ========================
     */

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

    protected ProcessValue(value: FieldValue) {

    }

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
        this.FormStore.RegisterField(this.FieldId, initialValue, this.context.FieldsGroupId);
    }
}
