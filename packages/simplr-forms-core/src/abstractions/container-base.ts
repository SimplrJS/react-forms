import * as React from "react";
import * as PropTypes from "prop-types";

import { FormStore } from "../stores/form-store";
import { FSHContainer } from "../stores/form-stores-handler";

export interface ContainerBaseProps {
    formId: string;
}

export interface ContainerBaseParentContext {
    FormId: string;
}

export abstract class ContainerBase<TProps extends ContainerBaseProps, TState> extends React.Component<TProps, TState> {
    context: ContainerBaseParentContext;

    static contextTypes: PropTypes.ValidationMap<ContainerBaseParentContext> = {
        FormId: PropTypes.string.isRequired
    };

    protected get FormId(): string {
        if (this.props.formId == null) {
            return this.props.formId;
        }
        if (this.context.FormId != null) {
            return this.context.FormId;
        }

        // Should never happen as componentWillMount handles this situation
        throw new Error(`simplr-forms-core: form id is not present neither in props, nor in context.`);
    }

    protected get FormStore(): FormStore {
        return FSHContainer.FormStoresHandler.GetStore(this.FormId);
    }

    componentWillMount() {
        if (this.FormId == null) {
            throw new Error("simplr-forms-core: Container must be in a Form or have 'formId' prop");
        }


        if (this.props.formId != null && this.context.FormId != null) {
            const but = `but form id was defined: '${this.props.formId}'.`;
            throw new Error(`simplr-forms-core: Container is already in a Form '${this.context.FormId}' context, ${but}`);
        }


    }
}
