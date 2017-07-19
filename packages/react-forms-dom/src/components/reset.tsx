import * as React from "react";

import {
    BaseFormButton,
    BaseFormButtonProps,
    BaseFormButtonStateRecord
} from "../abstractions/base-form-button";
import { HTMLElementProps } from "../contracts/field";

export interface ResetProps extends BaseFormButtonProps, HTMLElementProps<HTMLButtonElement> {
    fieldIds?: string[];

    ref?: React.Ref<Reset>;
}

export class Reset extends BaseFormButton<ResetProps, BaseFormButtonStateRecord> {
    protected OnButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event): void => {
        this.FormStore.ResetFields(this.props.fieldIds);

        if (this.props.onClick != null) {
            event.persist();
            this.props.onClick(event);
        }
    }

    protected GetHTMLProps(props: ResetProps): {} {
        const filteredProps = super.GetHTMLProps(props) as ResetProps;
        const {
            fieldIds,
            ...restProps
        } = filteredProps;

        return restProps;
    }

    public render(): JSX.Element {
        return <button
            {...this.GetHTMLProps(this.props) }
            type="button"
            className={this.ClassName}
            style={this.InlineStyles}
            disabled={this.Disabled}
            onClick={this.OnButtonClick}
        >
            {this.props.children}
        </button>;
    }
}
