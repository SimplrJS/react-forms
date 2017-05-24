import * as React from "react";
import { FieldValue } from "simplr-forms/contracts";
import { DomFieldProps } from "../contracts/field";

import { BaseDomField, BaseDomFieldState } from "../abstractions/base-dom-field";
import { FieldOnChangeCallback } from "../contracts/field";
import { FieldOnChangeInternalCallback } from "../contracts";

export type TextAreaOnChangeCallback = FieldOnChangeCallback<HTMLTextAreaElement>;

/**
 * Override the differences between extended interfaces.
 */
export interface TextAreaProps extends DomFieldProps, React.HTMLProps<HTMLTextAreaElement> {
    name: string;
    onFocus?: React.EventHandler<React.FocusEvent<HTMLTextAreaElement>>;
    onBlur?: React.EventHandler<React.FocusEvent<HTMLTextAreaElement>>;
    onChange?: TextAreaOnChangeCallback & FieldOnChangeInternalCallback;
    ref?: any;

    defaultValue?: FieldValue;
    value?: FieldValue;
}

export class TextArea extends BaseDomField<TextAreaProps, BaseDomFieldState> {
    protected GetValueFromEvent(event: React.FormEvent<HTMLTextAreaElement>): FieldValue {
        return event.currentTarget.value;
    }

    protected OnChangeHandler: React.FormEventHandler<HTMLTextAreaElement> = (event) => {
        this.OnValueChange(this.GetValueFromEvent(event));

        const newValue = this.FormStore.GetField(this.FieldId).Value;

        if (this.props.onChange != null) {
            this.props.onChange(event, newValue, this.FieldId, this.FormId);
        }

        // TODO: FormProps.OnFieldChange
    }

    protected get RawDefaultValue() {
        if (this.props.defaultValue != null) {
            return this.props.defaultValue;
        }
        return "";
    }

    renderField(): JSX.Element | null {
        return <textarea
            name={this.FieldId}
            value={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.Disabled}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
        />;
    }
}
