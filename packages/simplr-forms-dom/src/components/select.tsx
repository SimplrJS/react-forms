import * as React from "react";
import { FieldValue } from "simplr-forms/contracts";
import { DomFieldProps } from "../contracts/field";

import { BaseDomField, BaseDomFieldState } from "../abstractions/base-dom-field";
import { FieldOnChangeCallback } from "../contracts/field";
import {
    HTMLElementProps
} from "../contracts/field";
import {
    FormProps
} from "../contracts/form";

export type SelectValue = string | string[];
export type SelectOnChangeCallback = FieldOnChangeCallback<HTMLSelectElement>;

/**
 * Override the differences between extended interfaces.
 */
export interface SelectProps extends DomFieldProps, HTMLElementProps<HTMLSelectElement> {
    name: string;
    onFocus?: React.FocusEventHandler<HTMLSelectElement>;
    onBlur?: React.FocusEventHandler<HTMLSelectElement>;
    onChange?: SelectOnChangeCallback;

    defaultValue?: string | FieldValue;
    initialValue?: FieldValue;
    value?: FieldValue;
    ref?: React.Ref<Select>;
}

export interface SelectState extends BaseDomFieldState {
    RenderValue: SelectValue;
}

export class Select extends BaseDomField<SelectProps, SelectState> {
    protected GetValueFromEvent(event: React.FormEvent<HTMLSelectElement>): FieldValue {
        if (this.props.multiple) {
            let newValue = new Array<string>();

            for (let i = 0; i < event.currentTarget.options.length; i++) {
                let option = event.currentTarget.options[i] as HTMLOptionElement;
                if (option.selected) {
                    newValue.push(option.value);
                }
            }

            return newValue;
        }

        return event.currentTarget.value;
    }

    protected OnChangeHandler: React.FormEventHandler<HTMLSelectElement> = (event) => {
        event.persist();
        this.OnValueChange(this.GetValueFromEvent(event));
        let newValue = this.FormStore.GetField(this.FieldId).Value;

        // Check if it's immutable.
        // TODO: When using Immutable v4 use isImmutable instead.
        if (newValue.toArray != null) {
            newValue = newValue.toArray();
        }

        this.setState(state => {
            state.RenderValue = newValue;
            return state;
        });

        if (this.props.onChange != null) {
            this.props.onChange(event, newValue, this.FieldId, this.FormId);
        }

        const formStoreState = this.FormStore.GetState();
        const formProps = formStoreState.Form.Props as FormProps;
        if (formProps.onChange != null) {
            formProps.onChange(event, newValue, this.FieldId, this.FormId);
        }
    }

    protected get RawDefaultValue(): SelectValue {
        if (this.props.defaultValue != null) {
            return this.props.defaultValue;
        }
        return (this.props.multiple) ? [] : "";
    }

    protected get Value(): FieldValue {
        if (this.state != null && this.state.RenderValue != null) {
            return this.state.RenderValue;
        }

        return this.RawDefaultValue;
    }

    renderField(): JSX.Element | null {
        return <select
            name={this.FieldId}
            value={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.Disabled}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}


            multiple={this.props.multiple}
        >
            {this.props.children}
        </select>;
    }
}
