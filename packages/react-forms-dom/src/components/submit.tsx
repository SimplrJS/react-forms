import * as React from "react";
import { recordify, TypedRecord } from "typed-immutable-record";

import { BaseContainer, BaseContainerProps } from "@simplr/react-forms";
import { FormError } from "@simplr/react-forms/contracts";

import {
    BaseFormButton,
    BaseFormButtonProps,
    BaseFormButtonStateRecord
} from "../abstractions/base-form-button";
import { HTMLElementProps } from "../contracts/field";

export interface SubmitProps extends BaseFormButtonProps, HTMLElementProps<HTMLButtonElement> {
    ref?: React.Ref<Submit>;
}

export class Submit extends BaseFormButton<SubmitProps, BaseFormButtonStateRecord> {
    public static defaultProps: BaseFormButtonProps = {
        ...BaseFormButton.defaultProps,
        disableOnError: true
    };

    protected OnClick: React.MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault();
        this.FormStore.InitiateFormSubmit();

        if (this.props.onClick != null) {
            event.persist();
            this.props.onClick(event);
        }
    }

    public render(): JSX.Element {
        return <button
            type="submit"
            className={this.ClassName}
            style={this.InlineStyles}
            disabled={this.Disabled}
            onClick={this.OnClick}
            {...this.GetHTMLProps(this.props) }
        >
            {this.props.children}
        </button>;
    }
}
