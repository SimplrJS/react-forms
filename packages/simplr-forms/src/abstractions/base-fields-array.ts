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

    static contextTypes: PropTypes.ValidationMap<FieldContext> = {
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

    static childContextTypes: PropTypes.ValidationMap<FieldsGroupChildContext> = {
        FieldsGroupId: PropTypes.string,
        FieldsGroupProps: PropTypes.object
    };

    getChildContext(): FieldsGroupChildContext {
        return {
            FieldsGroupId: this.FieldsArrayId,
            FieldsGroupProps: this.FieldsArrayPropsContext
        };
    }

    componentWillMount() {
        const idBase = `${this.props.name}[${this.props.index}]`;
        this.FieldsArrayId = FormStoreHelpers.GetFieldsGroupId(idBase, this.context.FieldsGroupId);
        this.FormStore.RegisterFieldsArray(this.FieldsArrayId, this.props.name, this.props.index, this.context.FieldsGroupId);
    }

    componentWillUnmount(): void {
        if (this.FormStore != null && this.props.destroyOnUnmount) {
            this.FormStore.UnregisterFieldsArray(this.FieldsArrayId);
        }
    }
}
