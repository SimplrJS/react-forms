import { FormError } from "../contracts/error";

export function IsFormError(value: any): value is FormError {
    return (value != null && (value as FormError).Message != null);
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
