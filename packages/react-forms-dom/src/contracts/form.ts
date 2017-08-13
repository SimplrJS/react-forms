import * as React from "react";
import { FormError } from "@simplr/react-forms/contracts";
import { FormProps as CoreFormProps } from "@simplr/react-forms/contracts";
import { FormStore } from "@simplr/react-forms/stores";
import { DomFieldTemplateCallback } from "../contracts/field";

export interface FormOnSubmitInternalCallback {
    (event: React.FormEvent<HTMLFormElement>, ...parameters: any[]): void | Promise<void> | FormError | string;
}

export interface FormOnSubmitCallback {
    (event: React.FormEvent<HTMLFormElement>, store: FormStore): void | Promise<void> | FormError | string;
}

export interface BaseFormProps extends CoreFormProps {
    preventSubmitDefaultAndPropagation?: boolean;
    template?: DomFieldTemplateCallback;
    // tslint:disable-next-line:max-line-length
    // More properties at:
    // https://quatrodev.visualstudio.com/Simplr%20Frontend/_git/simplr-forms?path=%2Fsrc%2Fcontracts%2Fform-contracts.ts&version=GBdev&_a=contents
}
