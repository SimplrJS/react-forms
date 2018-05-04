import * as React from "react";
import { DomFieldProps } from "../contracts/field";

import { BaseDomField, BaseDomFieldState } from "../abstractions/base-dom-field";
import { FieldOnChangeCallback } from "../contracts/field";
import { HTMLElementProps } from "../contracts/field";
import { FormProps } from "./form";

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
    private isReactElement(child: React.ReactChild): child is React.ReactElement<any> {
        return typeof child !== "string" && typeof child !== "number";
    }

    protected GetRawInitialValue(props: SelectProps): SelectValue | undefined {
        if (props.multiple ||
            props.initialValue != null) {
            return props.initialValue;
        }
        // If select does not have multiple options, then we need to get the first option value.
        const children = React
        .Children
        .toArray(props.children)
        .filter(x => this.isReactElement(x)) as Array<React.ReactElement<any>>;
        const options = children.filter(x => x.type != null && x.type === "option");

        if (options.length === 0) {
            throw new Error("@simplr/react-forms-dom: Select MUST have at least one option!");
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
            return {
                ...state,
                RenderValue: newValue
            };
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

    protected GetRawDefaultValue(props: SelectProps): SelectValue {
        if (props.defaultValue != null) {
            return props.defaultValue;
        }
        return (props.multiple) ? [] : "";
    }

    protected get Value(): SelectValue {
        if (this.state != null && this.state.RenderValue != null) {
            return this.state.RenderValue;
        }

        return this.GetRawDefaultValue(this.props);
    }

    public renderField(): JSX.Element {
        return <select
            ref={this.SetElementRef}
            {...this.GetHTMLProps(this.props) }
            name={this.FieldId}
            className={this.AddErrorClassName(this.props.className)}
            value={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.Disabled}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
        >
            {this.props.children}
        </select>;
    }
}
