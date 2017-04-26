import { FormError } from "../contracts/error";

export function IsFormError(error: any): error is FormError {
    return (error != null && (error as FormError).Message != null);
}

export function ConstructFormError(error: any): FormError | undefined {
    if (IsFormError(error)) {
        return error;
    }
    if (typeof error === "string") {
        return {
            Message: error
        };
    }
    return undefined;
}
