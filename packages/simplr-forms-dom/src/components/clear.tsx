import * as React from "react";
import { recordify, TypedRecord } from "typed-immutable-record";

import { BaseContainer, BaseContainerProps } from "simplr-forms";

import {
    BaseFormButton,
    BaseFormButtonProps,
    BaseFormButtonStateRecord
} from "../abstractions/base-form-button";

export interface ClearProps extends BaseFormButtonProps {
    fieldIds?: string[];
}

export class Clear extends BaseFormButton<ClearProps, BaseFormButtonStateRecord> {
    protected OnButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event): void => {
        this.FormStore.ClearFields(this.props.fieldIds);

        if (this.props.onClick != null) {
            event.persist();
            this.props.onClick(event);
        }
    }

    render(): JSX.Element | null {
        // TODO: Pass all other props.
        return <button
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
