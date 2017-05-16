import * as React from "react";
import { recordify, TypedRecord } from "typed-immutable-record";

import { BaseContainer, BaseContainerProps } from "simplr-forms";

export interface ClearProps extends BaseContainerProps, React.HTMLProps<HTMLButtonElement> {
    fieldIds?: string[];
}

export interface ClearState {
    Submitting: boolean;
}

export interface ClearStateRecord extends TypedRecord<ClearStateRecord>, ClearState { }

export class Clear extends BaseContainer<ClearProps, ClearStateRecord> {
    constructor(props: ClearProps) {
        super(props);

        this.state = recordify<ClearState, ClearStateRecord>({
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
        this.FormStore.ClearFields(this.props.fieldIds);

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
