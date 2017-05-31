import * as React from "react";
import { FieldValue } from "simplr-forms/contracts";
import { DomFieldProps } from "../contracts/field";

import {
    BaseDomField,
    BaseDomFieldState
} from "../abstractions/base-dom-field";
import {
    FieldOnChangeCallback
} from "../contracts/field";
import {
    FormProps
} from "../contracts/form";
import { HTMLElementProps } from "../contracts";

export type TextAreaOnChangeCallback = FieldOnChangeCallback<HTMLTextAreaElement>;

/**
 * Override the differences between extended interfaces.
 */
export interface TextAreaProps extends DomFieldProps, HTMLElementProps<HTMLTextAreaElement> {
    name: string;
    onFocus?: React.EventHandler<React.FocusEvent<HTMLTextAreaElement>>;
    onBlur?: React.EventHandler<React.FocusEvent<HTMLTextAreaElement>>;
    onChange?: TextAreaOnChangeCallback;

    defaultValue?: string;
    initialValue?: string;
    value?: string;
    ref?: React.Ref<TextArea>;
}

export class TextArea extends BaseDomField<TextAreaProps, BaseDomFieldState> {
    protected GetValueFromEvent(event: React.ChangeEvent<HTMLTextAreaElement>): string {
        return event.currentTarget.value;
    }

    protected OnChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
        event.persist();

        let newValue: string | undefined;
        if (!this.IsControlled) {
            this.OnValueChange(this.GetValueFromEvent(event));
            newValue = this.FormStore.GetField(this.FieldId).Value;
        } else {
            newValue = this.GetValueFromEvent(event);
        }

        if (this.props.onChange != null) {
            this.props.onChange(event, newValue, this.FieldId, this.FormId);
        }

        const formStoreState = this.FormStore.GetState();
        const formProps = formStoreState.Form.Props as FormProps;
        if (formProps.onChange != null) {
            formProps.onChange(event, newValue, this.FieldId, this.FormId);
        }
    }

    protected get RawDefaultValue(): string {
        if (this.props.defaultValue != null) {
            return this.props.defaultValue;
        }
        return "";
    }

    renderField(): JSX.Element | null {
        return <textarea
            ref={this.SetElementRef}
            name={this.FieldId}
            value={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.Disabled}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
            {...this.GetHTMLProps(this.props) }
        />;
    }
}
