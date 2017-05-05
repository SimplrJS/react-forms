import { TypedRecord } from "typed-immutable-record/dist";
// Future self might love usage of an object with message property instead of a plain string

export interface FormError {
    Message: string;
    Origin?: FormErrorOrigin; // Told you so.
}

export interface FormErrorRecord extends TypedRecord<FormErrorRecord>, FormError { }

export enum FormErrorOrigin {
    None = 0,
    Validation = 1 << 0,
    Submit = 1 << 1
}
