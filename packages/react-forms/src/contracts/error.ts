// Future self might love usage of an object with message property instead of a plain string

export interface FormError {
    Message: string;
    // Told you so.
    Origin?: FormErrorOrigin;
}

export enum FormErrorOrigin {
    None,
    Validation,
    Submit
}
