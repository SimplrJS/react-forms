import * as React from "react";
import { DomFieldProps } from "../contracts/field";

import {
    BaseDomField,
    BaseDomFieldState
} from "../abstractions/base-dom-field";
import {
    FieldOnChangeCallback,
    HTMLElementProps
} from "../contracts/field";
import { FormProps } from "./form";

export type TextOnChangeCallback = FieldOnChangeCallback<HTMLInputElement>;

/**
 * Override the differences between extended interfaces.
 */
export interface TextProps extends DomFieldProps, HTMLElementProps<HTMLInputElement> {
    name: string;
    onFocus?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
    onBlur?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
    onChange?: TextOnChangeCallback;

    defaultValue?: string;
    initialValue?: string;
    value?: string;
    ref?: React.Ref<Text>;
}

export class Text extends BaseDomField<TextProps, BaseDomFieldState, HTMLInputElement> {
    protected GetValueFromEvent(event: React.ChangeEvent<HTMLInputElement>): string {
        return event.target.value;
    }

    protected OnChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
        let newValue: string | undefined;
        if (!this.IsControlled) {
            this.OnValueChange(this.GetValueFromEvent(event));
            newValue = this.FormStore.GetField(this.FieldId).Value;
        } else {
            newValue = this.GetValueFromEvent(event);
        }

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

    protected get RawDefaultValue(): string {
        if (this.props.defaultValue != null) {
            return this.props.defaultValue;
        }

        return "";
    }

    public renderField(): JSX.Element {
        return <input
            ref={this.SetElementRef}
            {...this.GetHTMLProps(this.props) }
            type="text"
            name={this.FieldId}
            value={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.Disabled}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
        />;
    }
}
