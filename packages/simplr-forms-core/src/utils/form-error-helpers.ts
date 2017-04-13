import { FormError } from "../contracts/error";

export function IsFormError(error: any): error is FormError {
    return (error != null && (error as FormError).Message != null);
}

export function ConstructFormError(error: any) {
    if (typeof error === "string") {
        return {
            Message: error
        };
    } else if (IsFormError(error)) {
        return error;
    }
}
