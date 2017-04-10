import * as React from "react";
import * as fbemitter from "fbemitter";

import {
    FieldProps,
    FieldState,
    FieldValueType,
    FieldValidationType
} from "../contracts/field";
import { FormState } from "../contracts/form";
import { FormStore } from "../stores/form-store";
import * as FormStoreActions from "../stores/form-store-actions";
import { FSHContainer } from "../stores/form-stores-handler";

export interface BaseFieldState {
    Field?: FieldState;
    Form?: FormState;
    RenderValue?: FieldValueType;
}

export interface ParentContext {
    FormId: string;
    // FormProps: FormContracts.FormContextPropsObject;
    FieldsGroupId: string;
    // FieldGroupProps: FieldGroupContracts.FieldGroupContextPropsObject;
}

export abstract class BaseField<TProps extends FieldProps, TState extends BaseFieldState>
    extends React.Component<TProps, TState> {
    public context: ParentContext;

    static contextTypes: React.ValidationMap<ParentContext> = {
        FormId: React.PropTypes.string,
        // FormProps: React.PropTypes.object,
        FieldsGroupId: React.PropTypes.string,
        // FieldGroupProps: React.PropTypes.object
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
    }

    componentWillReceiveProps(nextProps: FieldProps) {
        // Check if field name has not been changed
        if (this.props.name !== nextProps.name) {
            throw new Error(`simplr-forms-core: Field name must be constant`);
        }
    }

    componentWillUnmount() {
        if (this.FormStore != null) {
            this.FormStore.UnregisterField(this.FieldId);
        }
    }

    protected OnStoreUpdated(action: FormStoreActions.StateUpdated) {

    }

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
    protected abstract get RawInitialValue(): FieldValueType;


    /**
     * Default field value.
     *
     * @readonly
     * @protected
     *
     * @memberOf BaseField
     */
    protected abstract get DefaultValue(): FieldValueType;

}
