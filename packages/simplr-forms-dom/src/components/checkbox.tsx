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

export type CheckBoxOnChangeCallback = FieldOnChangeCallback<HTMLInputElement>;

/**
 * Override the differences between extended interfaces.
 */
export interface CheckBoxProps extends DomFieldProps, HTMLElementProps<HTMLInputElement> {
    name: string;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: CheckBoxOnChangeCallback;

    defaultValue?: boolean;
    initialValue?: boolean;
    value?: boolean;
    ref?: React.Ref<CheckBox>;
}

export class CheckBox extends BaseDomField<CheckBoxProps, BaseDomFieldState, HTMLInputElement> {
    protected GetValueFromEvent(event: React.ChangeEvent<HTMLInputElement>): FieldValue {
        return event.currentTarget.checked;
    }

    protected OnChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.persist();
        this.OnValueChange(this.GetValueFromEvent(event));

        const newValue = this.FormStore.GetField(this.FieldId).Value;

        if (this.props.onChange != null) {
            this.props.onChange(event, newValue, this.FieldId, this.FormId);
        }

        const formStoreState = this.FormStore.GetState();
        const formProps = formStoreState.Form.Props as FormProps;
        if (formProps.onChange != null) {
            formProps.onChange(event, newValue, this.FieldId, this.FormId);
        }
    }

    protected get RawDefaultValue(): boolean {
        if (this.props.defaultValue != null) {
            return this.props.defaultValue;
        }
        return false;
    }

    renderField(): JSX.Element | null {
        return <input
            ref={this.SetElementRef}
            type="checkbox"
            name={this.FieldId}
            checked={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.Disabled}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
            {...this.GetHTMLProps(this.props) }
        />;
    }
}
