import * as React from "react";
import { FormError } from "simplr-forms/contracts";
import { FormProps as CoreFormProps } from "simplr-forms/contracts";
import { FormStore } from "simplr-forms/stores";
import {
    FieldOnChangeCallback,
    FieldOnChangeInternalCallback,
    DomFieldTemplateCallback
} from "../contracts/field";

export interface FormOnSubmitInternalCallback {
    (event: React.FormEvent<HTMLFormElement>, ...parameters: any[]): void | Promise<never> | FormError | string;
}

export interface FormOnSubmitCallback {
    (event: React.FormEvent<HTMLFormElement>, store: FormStore): void | Promise<never> | FormError | string;
}

export interface FormProps extends CoreFormProps, React.HTMLProps<HTMLFormElement> {
    onSubmit?: FormOnSubmitCallback & FormOnSubmitInternalCallback;
    onChange?: FieldOnChangeCallback<any> & FieldOnChangeInternalCallback;
    preventSubmitDefaultAndPropagation?: boolean;
    template?: DomFieldTemplateCallback;
    // tslint:disable-next-line:max-line-length
    // More properties at:
    // https://quatrodev.visualstudio.com/Simplr%20Frontend/_git/simplr-forms?path=%2Fsrc%2Fcontracts%2Fform-contracts.ts&version=GBdev&_a=contents
}
