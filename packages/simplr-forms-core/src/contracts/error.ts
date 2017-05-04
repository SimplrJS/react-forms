// Future self might love usage of an object with message property instead of a plain string
export interface FormError {
    Message: string;
    Origin?: FormErrorOrigin; // Told you so.
}

export enum FormErrorOrigin {
    None = 0,
    Validation = 1 << 0,
    Submit = 1 << 1
}
