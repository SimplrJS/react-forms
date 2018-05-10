import { FormError, FormStore } from "@simplr/react-forms";

import {
    BaseErrorsContainer,
    BaseErrorsContainerState,
    FieldErrors
} from "../abstractions/base-errors-container";

export type ErrorsTemplate = (fieldErrors: FieldErrors, formError: FormError | undefined, formStore: FormStore) => JSX.Element | null;

export interface ErrorsContainerProps {
    template: ErrorsTemplate;
}

export type ErrorsContainerState = BaseErrorsContainerState;

export class ErrorsContainer extends BaseErrorsContainer<ErrorsContainerProps, ErrorsContainerState> {
    public render(): JSX.Element | null {
        return this.props.template(this.state.FieldErrors, this.state.FormError, this.FormStore);
    }
}
