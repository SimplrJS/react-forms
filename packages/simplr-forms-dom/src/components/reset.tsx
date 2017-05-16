import * as React from "react";
import { recordify, TypedRecord } from "typed-immutable-record";

import { BaseContainer, BaseContainerProps } from "simplr-forms";

export interface ResetProps extends BaseContainerProps, React.HTMLProps<HTMLButtonElement> {
    fieldIds?: string[];
}

export interface ResetState {
    Submitting: boolean;
}

export interface ResetStateRecord extends TypedRecord<ResetStateRecord>, ResetState { }

export class Reset extends BaseContainer<ResetProps, ResetStateRecord> {
    constructor(props: ResetProps) {
        super(props);

        this.state = recordify<ResetState, ResetStateRecord>({
            Submitting: false
        });
    }

    protected OnStoreUpdated(): void {
        const formStore = this.FormStore.GetState();
        const newState = recordify({
            Submitting: formStore.Form.Submitting
        });

        if (!newState.equals(this.state)) {
            this.setState(() => newState);
        }
    }

    protected get Disabled(): boolean {
        if (this.props.disabled != null) {
            return this.props.disabled;
        }

        return this.state.Submitting;
    }

    protected OnButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event): void => {
        event.persist();
        this.FormStore.ResetFields(this.props.fieldIds);

        if (this.props.onClick != null) {
            this.props.onClick(event);
        }
    }

    render(): JSX.Element | null {
        // TODO: Pass all other props.
        return <button
            type="button"
            disabled={this.Disabled}
            onClick={this.OnButtonClick}
        >
            {this.props.children}
        </button>;
    }
}
