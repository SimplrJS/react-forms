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

    defaultValue?: SelectValue;
    initialValue?: SelectValue;
    value?: SelectValue;
    ref?: React.Ref<Select>;
}

export interface SelectState extends BaseDomFieldState {
    RenderValue: SelectValue;
}

export class Select extends BaseDomField<SelectProps, SelectState> {
    protected get RawInitialValue(): SelectValue | undefined {
        if (this.props.multiple ||
            this.props.initialValue != null) {
            return this.props.initialValue;
        }
        // If select does not have multiple options, then we need to get the first option value.
        const options = React
            .Children
            .toArray(this.props.children)
            .filter((x: JSX.Element) => x.type != null && x.type === "option");

        if (options.length === 0) {
            throw new Error("simplr-forms-dom: Select MUST have at least one option!");
        }

        const firstOption = options[0] as JSX.Element;
        if (firstOption.props.value != null) {
            return firstOption.props.value;
        }

        return firstOption.props.children;
    }

    protected GetValueFromEvent(event: React.ChangeEvent<HTMLSelectElement>): SelectValue {
        if (this.props.multiple) {
            const newValue: string[] = [];

            for (let i = 0; i < event.currentTarget.options.length; i++) {
                const option = event.currentTarget.options[i];
                if (option.selected) {
                    newValue.push(option.value);
                }
            }

            return newValue;
        }

        return event.currentTarget.value;
    }

    protected OnChangeHandler: React.ChangeEventHandler<HTMLSelectElement> = event => {
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
            event.persist();
            this.props.onChange(event, newValue, this.FieldId, this.FormStore);
        }

        const formStoreState = this.FormStore.GetState();
        const formProps = formStoreState.Form.Props as FormProps;
        if (formProps.onChange != null) {
            event.persist();
            formProps.onChange(event, newValue, this.FieldId, this.FormStore);
        }
    }

    protected get RawDefaultValue(): SelectValue {
        if (this.props.defaultValue != null) {
            return this.props.defaultValue;
        }
        return (this.props.multiple) ? [] : "";
    }

    protected get Value(): SelectValue {
        if (this.state != null && this.state.RenderValue != null) {
            return this.state.RenderValue;
        }

        return this.RawDefaultValue;
    }

    public renderField(): JSX.Element {
        return <select
            ref={this.SetElementRef}
            name={this.FieldId}
            value={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.Disabled}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
            {...this.GetHTMLProps(this.props) }
        >
            {this.props.children}
        </select>;
    }
}
