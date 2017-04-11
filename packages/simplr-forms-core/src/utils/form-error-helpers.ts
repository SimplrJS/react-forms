import { FormError } from "../contracts/error";

function isPromise<T>(value: any): value is Promise<T> {
    return value != null && value.then != null && value.catch != null;
}

function isFormError(value: any): value is FormError {
    return (value != null && (value as FormError).Message != null);
}

export function ResolveError(error: any) {
    if (typeof error === "string") {
        return {
            Message: error
        };
    } else if (isFormError(error)) {
        return error;
    }
}
