import { TypedRecord } from "typed-immutable-record/dist";
// Future self might love usage of an object with message property instead of a plain string

export interface FormError {
    Message: string;
    // Told you so.
    Origin?: FormErrorOrigin;
}

export interface FormErrorRecord extends TypedRecord<FormErrorRecord>, FormError { }

export enum FormErrorOrigin {
    None,
    Validation,
    Submit
}
