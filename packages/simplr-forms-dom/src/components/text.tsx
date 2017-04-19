import * as React from "react";
import { Contracts as CoreContracts } from "simplr-forms-core";

import { BaseDomField, BaseDomFieldState } from "../abstractions/base-dom-field";
import { OnChangeCallback } from "../contracts/field";

/**
 * Override the differences between extended interfaces.
 *
 * @export
 * @interface Props
 * @extends {CoreContracts.FieldProps}
 * @extends {React.HTMLProps<HTMLInputElement>}
 */
export interface Props extends CoreContracts.FieldProps, React.HTMLProps<HTMLInputElement> {
    name: string;
    onFocus?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
    onBlur?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
    ref?: any;
}

export interface TextProps extends Props {
    onChange?: OnChangeCallback<HTMLInputElement>;
}

export class Text extends BaseDomField<TextProps, BaseDomFieldState> {
    protected GetValueFromEvent(event: React.FormEvent<HTMLInputElement>): CoreContracts.FieldValue {
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

    protected get IsDisabled() {
        let disabled: boolean | undefined;

        // TODO: FormProps.Disabled and FieldsGroupProps.Disabled

        if (this.props.disabled != null) {
            disabled = this.props.disabled;
        }

        return disabled;
    }

    renderField(): JSX.Element | null {
        return <input
            type="text"
            name={this.FieldId}
            value={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.IsDisabled}
        />;
    }
}