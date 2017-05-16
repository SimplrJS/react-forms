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
        this.FieldsArrayId = this.FormStore.GetFieldsGroupId(idBase, this.context.FieldsGroupId);
        if (this.FormStore.GetState().FieldsGroups.has(this.FieldsArrayId)) {
            throw new Error(`simplr-forms: FieldsArray '${this.FieldsArrayId}' already exists in form '${this.FormId}'.`);
        }

        this.FormStore.RegisterFieldsArray(this.FieldsArrayId, this.props.name, this.props.index, this.context.FieldsGroupId);
    }
}
