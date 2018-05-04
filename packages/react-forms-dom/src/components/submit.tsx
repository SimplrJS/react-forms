import * as React from "react";

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
            {...this.GetHTMLProps(this.props) }
            type="submit"
            className={this.ClassName}
            style={this.InlineStyles}
            disabled={this.Disabled}
            onClick={this.OnClick}
        >
            {this.props.children}
        </button>;
    }
}
