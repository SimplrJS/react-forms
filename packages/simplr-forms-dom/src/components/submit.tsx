import * as React from "react";
import { recordify, TypedRecord } from "typed-immutable-record";

import { BaseContainer, BaseContainerProps } from "simplr-forms";
import { FormError } from "simplr-forms/contracts";

export interface SubmitProps extends BaseContainerProps, React.HTMLProps<HTMLButtonElement> {
    /**
     * Disable when at least one field has error.
     *
     * Default: true
     * @type {boolean}
     * @memberOf SubmitProps
     */
    disableOnError?: boolean;
    /**
     * Disable when at least one field is validating.
     *
     * Default: true
     * @type {boolean}
     * @memberOf SubmitProps
     */
    disableOnBusy?: boolean;
    /**
     * Disable when all fields are pristine.
     *
     * Default: false
     * @type {boolean}
     * @memberOf SubmitProps
     */
    disableOnPristine?: boolean;
    busy?: boolean;
    busyClass?: string;
}

export interface SubmitState {
    Error?: FormError;
    Validating: boolean;
    Submitting: boolean;
    Pristine: boolean;
}

export interface SubmitStateRecord extends TypedRecord<SubmitStateRecord>, SubmitState { }

export class Submit extends BaseContainer<SubmitProps, SubmitStateRecord> {
    public static defaultProps: SubmitProps = {
        disableOnBusy: true,
        disableOnError: true,
        disableOnPristine: false,
        busyClass: "busy"
    };

    protected OnStoreUpdated(): void {
        const formStore = this.FormStore.GetState();
        const newState = {
            Error: formStore.Form.Error,
            Validating: formStore.Form.Validating,
            Submitting: formStore.Form.Submitting,
            Pristine: formStore.Pristine
        };

        const newStateRecord = recordify(newState);
        if (!newStateRecord.equals(this.state)) {
            this.setState((prevState) => {
                // newStateRecord becomes an empty object after setState
                // This happens because of an underlying Immutable.Record
                return newState;
            });
        }
    }

    protected get Disabled(): boolean {
        if (this.props.disabled != null) {
            return this.props.disabled;
        }
        if (this.state != null) {
            if (this.props.disableOnError === true &&
                this.state.Error != null) {
                console.log("Disabling submit on error.");
                return true;
            }

            if (this.props.disableOnBusy === true &&
                this.Busy) {
                console.log("Disabling submit on busy.");
                return true;
            }

            if (this.props.disableOnPristine === true &&
                this.state.Pristine === true) {
                return true;
            }
        }

        return false;
    }

    protected get Busy(): boolean {
        return this.props.busy === true ||
            this.state != null &&
            (this.state.Validating ||
                this.state.Submitting);
    }

    protected get InlineStyles() {
        let inlineStyles: React.CSSProperties = {};

        if (this.props.style != null) {
            inlineStyles = this.props.style;
        }

        if (this.Busy && !this.props.disabled) {
            inlineStyles.cursor = this.props.busyClass;
        }

        return inlineStyles;
    }

    render() {
        return <button
            type="submit"
            disabled={this.Disabled}
            style={this.InlineStyles}
        >
            {this.props.children}
        </button>;
    }
}
