import * as React from "react";
import { recordify, TypedRecord } from "typed-immutable-record";

import { BaseContainer, BaseContainerProps } from "simplr-forms-core";
import { FormError } from "simplr-forms-core/contracts";

export interface SubmitProps extends BaseContainerProps, React.HTMLProps<HTMLButtonElement> {
    /**
     * Disable when form is submitting.
     *
     * Default: false
     * @type {boolean}
     * @memberOf SubmitProps
     */
    disableOnSubmitting?: boolean;
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
    disableOnWaiting?: boolean;
    /**
     * Disable when all fields are pristine.
     *
     * Default: false
     * @type {boolean}
     * @memberOf SubmitProps
     */
    disableOnPristine?: boolean;
    waiting?: boolean;
}

export interface SubmitState {
    Error?: FormError;
    Validating: boolean;
    Submitting: boolean;
    Pristine: boolean;
}

export interface SubmitStateRecord extends TypedRecord<SubmitStateRecord>, SubmitState { }

export class Submit extends BaseContainer<SubmitProps, SubmitStateRecord> {
    protected OnStoreUpdated(): void {
        const formStore = this.FormStore.GetState();
        const newState = {
            Error: formStore.Form.Error,
            Validating: formStore.Form.Validating,
            Submitting: formStore.Form.Submitting,
            Pristine: formStore.Form.Pristine
        };

        const newStateRecord = recordify(newState);
        if (!newStateRecord.equals(this.state)) {
            this.setState((prevState) => {
                // TODO: newStateRecord becomes an empty object after setState
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

            // TODO: waiting/busy

            if (this.props.disableOnSubmitting === true &&
                this.state.Submitting === true) {
                console.log("Disabling submit on submitting.");
                return true;
            }

            if (this.props.disableOnPristine === true &&
                this.state.Pristine === true) {
                console.log("Disabling submit on pristine.");
                return true;
            }
        }

        return false;
    }

    render() {
        return <button
            type="submit"
            disabled={this.Disabled}
        >
            {this.props.children}
        </button>;
    }
}
