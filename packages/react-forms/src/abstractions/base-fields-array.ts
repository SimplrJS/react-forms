import * as React from "react";
import {
    FieldsArrayProps,
    FieldsArrayState,
    FieldsArrayPropsObject
} from "../contracts/fields-array";
import { FieldsGroupChildContext } from "../contracts/fields-group";
import { FieldContext } from "../contracts/field";
import { FSHContainer } from "../stores/form-stores-handler";
import { FormStore } from "../stores/form-store";
import { FormStoreHelpers } from "../stores/form-store-helpers";
import * as PropTypes from "prop-types";

export class BaseFieldsArray<TProps extends FieldsArrayProps,
    TState extends FieldsArrayState>
    extends React.Component<TProps, TState> {

    public context: FieldContext;
    protected FieldsArrayId: string;
    protected get FieldsArrayPropsContext(): FieldsArrayPropsObject {
        return {};
    }

    public static contextTypes: PropTypes.ValidationMap<FieldContext> = {
        FormId: PropTypes.string,
        FormProps: PropTypes.object,
        FieldsGroupId: PropTypes.string,
        FieldsGroupProps: PropTypes.object,
        IsInFieldsArray: PropTypes.bool
    };

    public static defaultProps: Partial<FieldsArrayProps> = {
        destroyOnUnmount: true
    };

    protected get FormId(): string {
        // Check for whether FieldsArray is being used inside of a form.
        const props: FieldsArrayProps = this.props;

        if (this.context.FormId != null) {
            // If both context and props have form id defined
            if (props.formId != null) {
                throw new Error("@simplr/react-forms: formId prop is defined, but FieldsArray is already inside a Form.");
            }

            return this.context.FormId;
        }
        if (props.formId != null) {
            return props.formId;
        }

        throw new Error("@simplr/react-forms: FieldsArray must be used inside a Form component or formId must be defined.");
    }

    protected get FormStore(): FormStore {
        return FSHContainer.FormStoresHandler.GetStore(this.FormId);
    }

    public static childContextTypes: PropTypes.ValidationMap<FieldsGroupChildContext> = {
        FieldsGroupId: PropTypes.string.isRequired,
        FieldsGroupProps: PropTypes.object.isRequired,
        IsInFieldsArray: PropTypes.bool.isRequired
    };

    public getChildContext(): FieldsGroupChildContext {
        return {
            FieldsGroupId: this.FieldsArrayId,
            FieldsGroupProps: this.FieldsArrayPropsContext,
            IsInFieldsArray: true
        };
    }

    public componentWillMount(): void {
        if (this.FormId == null) {
            // Never goes in here, because an Error is thrown inside this.FormId if it's not valid.
        }

        this.FieldsArrayId = FormStoreHelpers.GetFieldsArrayId(this.props.name, this.props.arrayKey, this.context.FieldsGroupId);
        this.FormStore.RegisterFieldsArray(this.FieldsArrayId, this.props.name, this.props.indexWeight, this.context.FieldsGroupId);
    }

    public componentWillReceiveProps(nextProps: TProps): void {
        if (this.props.indexWeight !== nextProps.indexWeight) {
            this.FormStore.UpdateFieldsArrayIndexWeight(this.FieldsArrayId, nextProps.indexWeight);
        }
    }

    public componentWillUnmount(): void {
        if (this.FormStore != null && this.props.destroyOnUnmount) {
            this.FormStore.UnregisterFieldsArray(this.FieldsArrayId);
        }
    }
}
