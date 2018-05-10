import * as React from "react";
import { FormError } from "@simplr/react-forms";
import { FormProps as CoreFormProps } from "@simplr/react-forms";
import { FormStore } from "@simplr/react-forms";
import {
    FieldOnChangeCallback,
    FieldOnChangeInternalCallback,
    DomFieldTemplateCallback
} from "../contracts/field";

export interface FormOnSubmitInternalCallback {
    (event: React.FormEvent<HTMLFormElement>, ...parameters: any[]): void | Promise<void> | FormError | string;
}

export interface FormOnSubmitCallback {
    (event: React.FormEvent<HTMLFormElement>, store: FormStore): void | Promise<void> | FormError | string;
}

export type FormOnChangeCallback = FieldOnChangeCallback<any>;
export type FormOnChangeInternalCallback = FieldOnChangeInternalCallback;

export interface BaseFormProps extends CoreFormProps {
    onChange?: FormOnChangeCallback & FormOnChangeInternalCallback;
    preventSubmitPropagation?: boolean;
    template?: DomFieldTemplateCallback;
    errorClassName?: string;
    // tslint:disable-next-line:max-line-length
    // More properties at:
    // https://quatrodev.visualstudio.com/Simplr%20Frontend/_git/simplr-forms?path=%2Fsrc%2Fcontracts%2Fform-contracts.ts&version=GBdev&_a=contents
}
