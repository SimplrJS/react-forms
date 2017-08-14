import * as React from "react";
import * as PropTypes from "prop-types";
import { TypedRecord } from "typed-immutable-record";
import { BaseField, BaseFieldState } from "@simplr/react-forms";
import { FieldProps, FieldChildContext, FieldValue } from "@simplr/react-forms/contracts";
import { HTMLElementProps, DomFieldTemplateCallback, FieldOnChangeCallback } from "../contracts/field";
import { FormProps } from "./form";
import { BaseDomField } from "../abstractions";

export type RadioValue = string | number;

export interface RadioGroupProps extends FieldProps, HTMLElementProps<HTMLDivElement> {
    name: string;
    radioTemplate?: DomFieldTemplateCallback;
    onChange?: FieldOnChangeCallback<HTMLInputElement>;

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

    protected GetRawDefaultValue(props: RadioGroupProps): React.ReactText {
        if (props.defaultValue != null) {
            return props.defaultValue;
        }

        return "";
    }

    protected OnChangeHandler: RadioOnChangeHandler = (event, value) => {
        this.OnValueChange(value);

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

    protected GetHTMLProps(props: RadioGroupProps): {} {
        const cleanedProps = super.GetHTMLProps(props) as RadioGroupProps;
        const {
            radioTemplate,
            onChange,
            ...restProps
        } = cleanedProps;

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
