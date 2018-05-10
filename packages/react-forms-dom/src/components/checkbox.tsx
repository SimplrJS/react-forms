import * as React from "react";
import { FieldValue } from "@simplr/react-forms";
import { DomFieldProps } from "../contracts/field";

import { BaseDomField, BaseDomFieldState } from "../abstractions/base-dom-field";
import { FieldOnChangeCallback } from "../contracts/field";
import {
    HTMLElementProps
} from "../contracts/field";
import { FormProps } from "./form";

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

    protected OnChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
        this.OnValueChange(this.GetValueFromEvent(event));

        const newValue = this.FormStore.GetField(this.FieldId).Value;

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

    protected GetRawDefaultValue(props: CheckBoxProps): boolean {
        if (props.defaultValue != null) {
            return props.defaultValue;
        }
        return false;
    }

    public renderField(): JSX.Element {
        return <input
            ref={this.SetElementRef}
            {...this.GetHTMLProps(this.props) }
            type="checkbox"
            name={this.FieldId}
            className={this.AddErrorClassName(this.props.className)}
            checked={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.Disabled}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
        />;
    }
}
