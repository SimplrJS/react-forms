import * as React from "react";

import {
    BaseFormButton,
    BaseFormButtonProps,
    BaseFormButtonStateRecord
} from "../abstractions/base-form-button";
import { HTMLElementProps } from "../contracts/field";

export interface ClearProps extends BaseFormButtonProps, HTMLElementProps<HTMLButtonElement> {
    fieldIds?: string[];

    ref?: React.Ref<Clear>;
}

export class Clear extends BaseFormButton<ClearProps, BaseFormButtonStateRecord> {
    protected OnButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event): void => {
        this.FormStore.ClearFields(this.props.fieldIds);

        if (this.props.onClick != null) {
            event.persist();
            this.props.onClick(event);
        }
    }

    protected GetHTMLProps(props: ClearProps): {} {
        const filteredProps = super.GetHTMLProps(props) as ClearProps;
        const {
            fieldIds,
            ...restProps
        } = filteredProps;

        return restProps;
    }

    public render(): JSX.Element {
        return <button
            type="button"
            className={this.ClassName}
            style={this.InlineStyles}
            disabled={this.Disabled}
            onClick={this.OnButtonClick}
            {...this.GetHTMLProps(this.props) }
        >
            {this.props.children}
        </button>;
    }
}
