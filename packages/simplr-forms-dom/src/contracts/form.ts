import * as React from "react";
import { FieldValue, FormError } from "simplr-forms-core/contracts";
import { FormProps as CoreFormProps } from "simplr-forms-core/contracts";
import { FormStore } from "simplr-forms-core/stores";
import { OnChangeCallback } from "../contracts/field";

export interface FormOnSubmitCallback extends React.EventHandler<React.FormEvent<any>> {
    (event: React.FormEvent<HTMLFormElement>, store: FormStore): void | Promise<any> | FormError | string;
}

export interface FormProps extends CoreFormProps {
    onSubmit?: FormOnSubmitCallback;
    onChange?: OnChangeCallback<any>;
    preventSubmitDefaultAndPropagation?: boolean;
    // tslint:disable-next-line:max-line-length
    // More properties at:
    // https://quatrodev.visualstudio.com/Simplr%20Frontend/_git/simplr-forms?path=%2Fsrc%2Fcontracts%2Fform-contracts.ts&version=GBdev&_a=contents
}
