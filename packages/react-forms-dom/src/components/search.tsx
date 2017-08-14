import * as React from "react";
import { FieldValue } from "@simplr/react-forms/contracts";
import { DomFieldProps } from "../contracts/field";

import { BaseDomField, BaseDomFieldState } from "../abstractions/base-dom-field";
import { FieldOnChangeCallback } from "../contracts/field";
import { HTMLElementProps } from "../contracts/field";
import { FormProps } from "./form";

export type SearchOnChangeCallback = FieldOnChangeCallback<HTMLInputElement>;

/**
 * Override the differences between extended interfaces.
 */
export interface SearchProps extends DomFieldProps, HTMLElementProps<HTMLInputElement> {
    name: string;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: SearchOnChangeCallback;

    defaultValue?: string;
    initialValue?: string;
    value?: string;
    ref?: React.Ref<Search>;
}

export class Search extends BaseDomField<SearchProps, BaseDomFieldState> {
    protected GetValueFromEvent(event: React.ChangeEvent<HTMLInputElement>): string {
        return event.currentTarget.value;
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

    protected GetRawDefaultValue(props: SearchProps): string {
        if (props.defaultValue != null) {
            return props.defaultValue;
        }
        return "";
    }

    public renderField(): JSX.Element {
        return <input
            ref={this.SetElementRef}
            {...this.GetHTMLProps(this.props) }
            type="search"
            name={this.FieldId}
            value={this.Value}
            onChange={this.OnChangeHandler}
            disabled={this.Disabled}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
        />;
    }
}
