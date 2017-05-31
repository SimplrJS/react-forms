import * as React from "react";
import * as PropTypes from "prop-types";
import { BaseField, BaseFieldState } from "simplr-forms";
import { FieldProps, FieldChildContext, FieldValue } from "simplr-forms/contracts";
import { HTMLElementProps, FormProps } from "../contracts";
import { BaseDomField } from "../abstractions";
import { TypedRecord } from "typed-immutable-record";

export type RadioValue = string | number;

export interface RadioGroupProps extends FieldProps, HTMLElementProps<HTMLInputElement> {
    name: string;

    defaultValue?: RadioValue;
    initialValue?: RadioValue;
    value?: RadioValue;
}

export interface RadioGroupChildContext extends FieldChildContext {
    RadioGroupOnChangeHandler: RadioOnChangeHandler;
    RadioGroupOnFocus: React.FocusEventHandler<HTMLInputElement>;
    RadioGroupOnBlur: React.FocusEventHandler<HTMLInputElement>;
}

export type RadioOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;

export class RadioGroup extends BaseDomField<RadioGroupProps, BaseFieldState> {
    static childContextTypes: PropTypes.ValidationMap<RadioGroupChildContext> = {
        ...BaseDomField.childContextTypes,
        RadioGroupOnChangeHandler: PropTypes.func.isRequired,
        RadioGroupOnBlur: PropTypes.func.isRequired,
        RadioGroupOnFocus: PropTypes.func.isRequired
    };

    getChildContext(): RadioGroupChildContext {
        return {
            ...super.getChildContext(),
            FieldId: this.FieldId,
            FieldName: this.props.name,
            RadioGroupOnChangeHandler: this.OnChangeHandler,
            RadioGroupOnBlur: this.OnBlur,
            RadioGroupOnFocus: this.OnFocus
        };
    }

    protected get RawDefaultValue() {
        if (this.props.defaultValue != null) {
            return this.props.defaultValue;
        }

        return "";
    }

    protected OnChangeHandler: RadioOnChangeHandler = (event, value) => {
        this.OnValueChange(value);

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

    renderField(): JSX.Element | null {
        return <div
            ref={this.SetElementRef}
            {...this.GetHTMLProps(this.props) }
        >
            {this.props.children}
        </div>;
    }
}
