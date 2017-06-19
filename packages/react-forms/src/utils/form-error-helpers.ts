import { FormError, FormErrorOrigin } from "../contracts/error";

export function IsFormError(error: any): error is FormError {
    return (error != null && (error as FormError).Message != null);
}

export function ConstructFormError(error: any, origin: FormErrorOrigin): FormError | undefined {
    if (IsFormError(error)) {
        if (error.Origin != null && error.Origin !== origin) {
            console.warn(`simplr-forms: Given error contains property Origin, which is reserved and is always set by FormStore.`);
        }
        error.Origin = origin;
        return error;
    }
    if (typeof error === "string") {
        return {
            Message: error,
            Origin: origin
        };
    }
    if (error instanceof Error) {
        return {
            Message: error.message,
            Origin: origin
        };
    }
    return undefined;
}
