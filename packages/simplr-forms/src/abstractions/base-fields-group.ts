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

export class BaseFieldsGroup<TProps extends FieldsGroupProps,
    TState extends FieldsGroupState>
    extends React.Component<TProps, TState> {

    public context: FieldContext;
    protected FieldsGroupId: string;
    protected get FieldsGroupPropsContext(): FieldsGroupPropsObject {
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
            FieldsGroupId: this.FieldsGroupId,
            FieldsGroupProps: this.FieldsGroupPropsContext
        };
    }

    componentWillMount() {
        this.FieldsGroupId = this.FormStore.GetFieldsGroupId(this.props.name, this.context.FieldsGroupId);
        if (this.FormStore.GetState().FieldsGroups.has(this.FieldsGroupId)) {
            throw new Error(`simplr-forms: FieldsGroup '${this.FieldsGroupId}' already exists in form '${this.FormId}'.`);
        }

        this.FormStore.RegisterFieldsGroup(this.FieldsGroupId, this.props.name, this.context.FieldsGroupId);
    }
}
