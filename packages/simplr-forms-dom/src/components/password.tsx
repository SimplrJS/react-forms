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

export type PasswordOnChangeCallback = FieldOnChangeCallback<HTMLInputElement>;

/**
 * Override the differences between extended interfaces.
 */
export interface PasswordProps extends DomFieldProps, HTMLElementProps<HTMLInputElement> {
    name: string;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: PasswordOnChangeCallback;

    defaultValue?: FieldValue;
    value?: FieldValue;
    ref?: React.Ref<Password>;
}

export class Password extends BaseDomField<PasswordProps, BaseDomFieldState> {
    protected GetValueFromEvent(event: React.ChangeEvent<HTMLInputElement>): FieldValue {
        return event.currentTarget.value;
    }

    protected OnChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
        this.OnValueChange(this.GetValueFromEvent(event));

        const newValue = this.FormStore.GetField(this.FieldId).Value;

        if (this.props.onChange != null) {
            event.persist();
            this.props.onChange(event, newValue, this.FieldId, this.FormId);
        }

        const formStoreState = this.FormStore.GetState();
        const formProps = formStoreState.Form.Props as FormProps;
        if (formProps.onChange != null) {
            event.persist();
            formProps.onChange(event, newValue, this.FieldId, this.FormId);
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
            type="password"
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
