import * as React from "react";
import * as PropTypes from "prop-types";

import { FormStore } from "../stores/form-store";
import { StateChanged } from "../actions/form-store";
import { FormRegistered } from "../actions/form-stores-handler";
import { FSHContainer } from "../stores/form-stores-handler";
import { EventSubscription } from "action-emitter";

export interface BaseContainerProps {
    formId?: string;
}

export interface BaseContainerParentContext {
    FormId: string;
    FieldId?: string;
}

export abstract class BaseContainer<TProps extends BaseContainerProps, TState> extends React.Component<TProps, TState> {
    public context: BaseContainerParentContext;

    public static contextTypes: PropTypes.ValidationMap<BaseContainerParentContext> = {
        FormId: PropTypes.string,
        FieldId: PropTypes.string
    };

    private eventStoreSubscription: EventSubscription | undefined;

    protected get FormId(): string {
        const propFormId: string | undefined = this.props.formId;
        if (propFormId != null) {
            return propFormId;
        }
        if (this.context.FormId != null) {
            return this.context.FormId;
        }

        // Should never happen as componentWillMount handles this situation
        throw new Error(`@simplr/react-forms: form id is not present neither in props, nor in context.`);
    }

    protected get FieldId(): string | undefined {
        return this.context.FieldId;
    }

    protected get FormStore(): FormStore {
        return FSHContainer.FormStoresHandler.GetStore(this.FormId);
    }

    public componentWillMount(): void {
        if (this.props.formId == null && this.context.FormId == null) {
            throw new Error("@simplr/react-forms: Container must be in a Form or have prop 'formId' set.");
        }

        if (this.props.formId != null && this.context.FormId != null) {
            const but = `but form id was defined: '${this.props.formId}'`;
            throw new Error(`@simplr/react-forms: Container is already in a Form '${this.context.FormId}' context, ${but}.`);
        }

        if (this.FormStore == null) {
            const fshContainerSubscription = FSHContainer.FormStoresHandler.addListener(FormRegistered, action => {
                if (this.FormStore != null) {
                    this.addFormStoreListener();
                    fshContainerSubscription.remove();
                }
            });
        } else {
            this.addFormStoreListener();
        }
    }

    private addFormStoreListener(): void {
        this.eventStoreSubscription = this.FormStore.addListener(StateChanged, this.OnStoreUpdated.bind(this));
    }

    public componentWillUnmount(): void {
        if (this.eventStoreSubscription != null) {
            this.eventStoreSubscription.remove();
        }
    }

    protected abstract OnStoreUpdated(): void;
}
