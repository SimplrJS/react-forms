import * as React from "react";
import {
    FieldsGroupProps,
    FieldsGroupState,
    FieldsGroupChildContext,
    FieldsGroupPropsObject
} from "../contracts/fields-group";
import { FieldContext } from "../contracts/field";
import { FSHContainer } from "../stores/form-stores-handler";
import { FormStore } from "../stores/form-store";
import * as PropTypes from "prop-types";
import { FormStoreHelpers } from "../stores/form-store-helpers";

export class BaseFieldsGroup<TProps extends FieldsGroupProps,
    TState extends FieldsGroupState>
    extends React.Component<TProps, TState> {

    public context: FieldContext;
    protected FieldsGroupId: string;
    protected get FieldsGroupPropsContext(): FieldsGroupPropsObject {
        return {};
    }

    public static contextTypes: PropTypes.ValidationMap<FieldContext> = {
        FormId: PropTypes.string,
        FormProps: PropTypes.object,
        FieldsGroupId: PropTypes.string,
        FieldsGroupProps: PropTypes.object
    };

    protected get FormId(): string {
        return this.context.FormId;
    }

    protected get FormStore(): FormStore {
        return FSHContainer.FormStoresHandler.GetStore(this.FormId);
    }

    public static childContextTypes: PropTypes.ValidationMap<FieldsGroupChildContext> = {
        FieldsGroupId: PropTypes.string,
        FieldsGroupProps: PropTypes.object
    };

    public getChildContext(): FieldsGroupChildContext {
        return {
            FieldsGroupId: this.FieldsGroupId,
            FieldsGroupProps: this.FieldsGroupPropsContext
        };
    }

    public componentWillMount(): void {
        this.FieldsGroupId = FormStoreHelpers.GetFieldsGroupId(this.props.name, this.context.FieldsGroupId);
        this.FormStore.RegisterFieldsGroup(this.FieldsGroupId, this.props.name, this.context.FieldsGroupId);
    }

    public componentWillUnmount(): void {
        if (this.FormStore != null && this.props.destroyOnUnmount) {
            this.FormStore.UnregisterFieldsGroup(this.FieldsGroupId);
        }
    }
}
