import * as React from "react";
import { FieldValue, FormError } from "simplr-forms-core/contracts";
import { FormStore } from "simplr-forms-core/stores";

export interface FormOnSubmitCallback extends React.FormEventHandler<HTMLFormElement> {
    (event: React.FormEvent<HTMLFormElement>, store: FormStore): void | Promise<never> | FormError | string;
}
