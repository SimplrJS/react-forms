import * as React from "react";
import { FieldValue } from "simplr-forms/contracts";
import { DomFieldProps } from "../contracts/field";

import { BaseDomField, BaseDomFieldState } from "../abstractions/base-dom-field";
import { FieldOnChangeCallback } from "../contracts/field";
import { FieldOnChangeInternalCallback } from "../contracts";
import { NumericToStringModifier } from "simplr-forms/modifiers";

export type NumberOnChangeCallback = FieldOnChangeCallback<HTMLInputElement>;

/**
 * Override the differences between extended interfaces.
 */
export interface NumberProps extends DomFieldProps, React.HTMLProps<HTMLInputElement> {
    name: string;
    onFocus?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
    onBlur?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
    onChange?: NumberOnChangeCallback & FieldOnChangeInternalCallback;
    ref?: any;

    defaultValue?: FieldValue;
    value?: FieldValue;
}

export class Number extends BaseDomField<NumberProps, BaseDomFieldState> {
    protected get DefaultModifiers(): JSX.Element[] {
        return [/*<NumericToStringModifier />*/];
    }

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
            type="number"
            name={this.FieldId}
            value={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.Disabled}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
            inputMode="numeric"
            pattern="[0-9]"
            noValidate
        />;
    }
}
