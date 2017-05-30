import * as React from "react";
import * as PropTypes from "prop-types";
import { BaseField, BaseFieldState } from "simplr-forms";
import { FieldProps, FieldChildContext, FieldValue } from "simplr-forms/contracts";
import { HTMLElementProps, FormProps } from "../contracts";
import { BaseDomField } from "../abstractions";
import { TypedRecord } from "typed-immutable-record";

export interface RadioGroupProps extends FieldProps, HTMLElementProps<HTMLInputElement> {
    name: string;

    defaultValue?: FieldValue;
    initialValue?: FieldValue;
    value?: FieldValue;
}

export interface RadioGroupChildContext extends FieldChildContext {
    FieldName: string;
    RadioGroupOnChangeHandler: RadioOnChangeHandler;
    RadioGroupOnFocus: React.FocusEventHandler<HTMLInputElement>;
    RadioGroupOnBlur: React.FocusEventHandler<HTMLInputElement>;
}

export type RadioOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;

export class RadioGroup extends BaseDomField<RadioGroupProps, BaseFieldState> {
    static childContextTypes: PropTypes.ValidationMap<RadioGroupChildContext> = {
        ...BaseDomField.childContextTypes,
        FieldName: PropTypes.string,
        RadioGroupOnChangeHandler: PropTypes.func,
        RadioGroupOnBlur: PropTypes.func,
        RadioGroupOnFocus: PropTypes.func
    };

    getChildContext(): RadioGroupChildContext {
        const fieldChildContext = super.getChildContext();

        return Object.assign(
            {
                FieldId: this.FieldId,
                FieldName: this.props.name,
                RadioGroupOnChangeHandler: this.OnChangeHandler,
                RadioGroupOnBlur: this.OnBlur,
                RadioGroupOnFocus: this.OnFocus
            } as RadioGroupChildContext,
            fieldChildContext
        );
    }

    protected get RawDefaultValue() {
        if (this.props.defaultValue != null) {
            return this.props.defaultValue;
        }

        return "";
    }

    protected OnChangeHandler: RadioOnChangeHandler = (event, value) => {
        event.persist();
        this.OnValueChange(value);

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

    renderField(): JSX.Element | null {
        return <div {...this.GetHTMLProps(this.props) }>
            {this.props.children}
        </div>;
    }
}
