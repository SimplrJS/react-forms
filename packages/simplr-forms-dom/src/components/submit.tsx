import * as React from "react";
import { recordify, TypedRecord } from "typed-immutable-record";

import { BaseContainer, BaseContainerProps } from "simplr-forms";
import { FormError } from "simplr-forms/contracts";

import {
    BaseFormButton,
    BaseFormButtonProps,
    BaseFormButtonStateRecord
} from "../abstractions/base-form-button";

export type SubmitProps = BaseFormButtonProps;

export class Submit extends BaseFormButton<SubmitProps, BaseFormButtonStateRecord> {
    public static defaultProps: BaseFormButtonProps = {
        ...BaseFormButton.defaultProps,
        disableOnError: true
    };

    public render(): JSX.Element {
        return <button
            type="submit"
            className={this.ClassName}
            style={this.InlineStyles}
            disabled={this.Disabled}
        >
            {this.props.children}
        </button>;
    }
}
