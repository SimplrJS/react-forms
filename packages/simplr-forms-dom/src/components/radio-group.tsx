import * as React from "react";
import * as PropTypes from "prop-types";
import { BaseField, BaseFieldState } from "simplr-forms";
import { FieldProps, FieldChildContext, FieldValue } from "simplr-forms/contracts";
import { HTMLElementProps, DomFieldTemplateCallback } from "../contracts/field";
import { FormProps } from "../contracts/form";
import { BaseDomField } from "../abstractions";
import { TypedRecord } from "typed-immutable-record";

export type RadioValue = string | number;

export interface RadioGroupProps extends FieldProps, HTMLElementProps<HTMLDivElement> {
    name: string;
    radioTemplate?: DomFieldTemplateCallback;

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
    public static childContextTypes: PropTypes.ValidationMap<RadioGroupChildContext> = {
        ...BaseDomField.childContextTypes,
        RadioGroupOnChangeHandler: PropTypes.func.isRequired,
        RadioGroupOnBlur: PropTypes.func.isRequired,
        RadioGroupOnFocus: PropTypes.func.isRequired
    };

    public getChildContext(): RadioGroupChildContext {
        return {
            ...super.getChildContext(),
            FieldId: this.FieldId,
            RadioGroupOnChangeHandler: this.OnChangeHandler,
            RadioGroupOnBlur: this.OnBlur,
            RadioGroupOnFocus: this.OnFocus
        };
    }

    protected get RawDefaultValue(): React.ReactText {
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

    protected GetHTMLProps(props: RadioGroupProps): {} {
        const cleanedProps = super.GetHTMLProps(props) as RadioGroupProps;
        const { radioTemplate, ...restProps } = cleanedProps;

        return restProps;
    }

    public renderField(): JSX.Element {
        return <div
            ref={this.SetElementRef}
            {...this.GetHTMLProps(this.props) }
        >
            {this.props.children}
        </div>;
    }
}
