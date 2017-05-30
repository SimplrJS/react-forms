import * as React from "react";
import * as PropTypes from "prop-types";

import { BaseContainer, BaseContainerParentContext } from "simplr-forms";
import { FormStoreStateRecord, FieldValue } from "simplr-forms/contracts";
import { RadioGroupChildContext, RadioGroupProps } from "./radio-group";
import { HTMLElementProps } from "../contracts";

export interface RadioProps extends HTMLElementProps<HTMLInputElement> {
    value: string;
}

export interface RadioState {
    FormStoreState?: FormStoreStateRecord;
    Value?: FieldValue;
}

export type RadioParentContext = RadioGroupChildContext & BaseContainerParentContext;

export class Radio extends BaseContainer<RadioProps, RadioState> {
    state: RadioState = {};
    public context: RadioParentContext;

    static contextTypes: PropTypes.ValidationMap<RadioParentContext> = {
        ...BaseContainer.contextTypes,
        FieldId: PropTypes.string.isRequired,
        RadioGroupOnChangeHandler: PropTypes.func.isRequired,
        RadioGroupOnBlur: PropTypes.func.isRequired,
        RadioGroupOnFocus: PropTypes.func.isRequired
    };

    componentWillMount() {
        super.componentWillMount();

        if (this.FieldId == null) {
            throw new Error("simplr-forms-dom: Radio must be in RadioGroup component.");
        }

        this.setState(state => {
            state.FormStoreState = this.FormStore.GetState();
            state.Value = this.FormStore.GetField(this.FieldId!).Value;
            return state;
        });
    }

    protected OnChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.persist();
        this.context.RadioGroupOnChangeHandler(event, this.props.value);
    }

    protected OnFocus: React.FocusEventHandler<HTMLInputElement> = (event) => {
        event.persist();
        this.context.RadioGroupOnFocus(event);
    }

    protected OnBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
        event.persist();
        this.context.RadioGroupOnBlur(event);
    }

    protected get Disabled(): boolean | undefined {
        // FormStore can only enforce disabling
        if (this.FormStore.GetState().Disabled === true) {
            return true;
        }
        if (this.FieldId != null) {
            const fieldProps = this.FormStore.GetField(this.FieldId).Props as any as RadioGroupProps;

            if (fieldProps != null && fieldProps.disabled != null) {
                return fieldProps.disabled;
            }
        }

        if (this.props.disabled != null) {
            return this.props.disabled;
        }
    }

    protected OnStoreUpdated(): void {
        const newFormStoreState = this.FormStore.GetState();
        const isStateDifferent = this.state == null ||
            this.state.FormStoreState !== newFormStoreState;

        if (isStateDifferent) {
            this.setState(state => {
                if (state == null) {
                    state = {
                        FormStoreState: newFormStoreState
                    };
                } else {
                    state.FormStoreState = newFormStoreState;
                }

                if (this.FieldId != null) {
                    const newFieldState = this.FormStore.GetField(this.FieldId);
                    state.Value = newFieldState.Value;
                }
                return state;
            });
        }
    }

    renderField() {
        return <input
            type="radio"
            checked={(this.state.Value === this.props.value)}
            onChange={this.OnChangeHandler}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
            disabled={this.Disabled}
            {...this.props}
        />;
    }

    render() {
        // TODO: RadioButtonTemplate
        return this.renderField();
    }
}
