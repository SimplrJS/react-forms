import * as React from "react";
import { FieldValue } from "simplr-forms/contracts";
import { DomFieldProps } from "../contracts/field";

import { BaseDomField, BaseDomFieldState } from "../abstractions/base-dom-field";
import { FieldOnChangeCallback } from "../contracts/field";
import { FieldOnChangeInternalCallback, HTMLElementProps } from "../contracts";

export type EmailOnChangeCallback = FieldOnChangeCallback<HTMLInputElement>;

/**
 * Override the differences between extended interfaces.
 */
export interface EmailProps extends DomFieldProps, HTMLElementProps<HTMLInputElement> {
    name: string;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: EmailOnChangeCallback;

    defaultValue?: FieldValue;
    value?: FieldValue;
    ref?: React.Ref<Email>;
}

export class Email extends BaseDomField<EmailProps, BaseDomFieldState> {
    protected GetValueFromEvent(event: React.FormEvent<HTMLInputElement>): FieldValue {
        return event.currentTarget.value;
    }

    protected OnChangeHandler: React.FormEventHandler<HTMLInputElement> = (event) => {
        this.OnValueChange(this.GetValueFromEvent(event));

        const newValue = this.FormStore.GetField(this.FieldId).Value;

        if (this.props.onChange != null) {
            this.props.onChange(event, newValue, this.FieldId, this.FormId);
        }

        // TODO: FormProps.OnFieldChange
    }

    protected get RawDefaultValue(): string {
        if (this.props.defaultValue != null) {
            return this.props.defaultValue;
        }
        return "";
    }

    renderField(): JSX.Element | null {
        return <input
            type="email"
            name={this.FieldId}
            value={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.Disabled}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
        />;
    }
}
