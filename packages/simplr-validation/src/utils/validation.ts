import { FieldValue, FormErrorOrigin } from "simplr-forms/contracts";
import {
    ProcessValue,
    IsComponentOfType,
    RenderComponents,
    ConstructFormError
} from "simplr-forms/utils";

import {
    Validator,
    FIELD_VALIDATOR_FUNCTION_NAME,
    FORM_VALIDATOR_FUNCTION_NAME
} from "../contracts";

function IsPromise<T>(value: any): value is Promise<T> {
    return value != null && value.then != null && value.catch != null;
}

export async function ValidateValue(
    components: JSX.Element[],
    value: any,
    validatorTypeFunctionName: string): Promise<void> {
    const validators = components.filter(x => IsComponentOfType(x, validatorTypeFunctionName));
    const renderedValidators = RenderComponents<Validator>(validators);

    for (const validator of renderedValidators) {
        const validationResult = validator.Validate(value);
        // Ensure that we have a promise
        let promise: Promise<void>;
        if (IsPromise<void>(validationResult)) {
            promise = validationResult;
        } else {
            promise = new Promise<void>((resolve, reject) => {
                const error = ConstructFormError(validationResult, FormErrorOrigin.Validation);
                if (error !== undefined) {
                    reject(validationResult);
                    return;
                }
                resolve();
            });
        }
        await promise;
    }
}

export async function ValidateField(components: JSX.Element[], value: FieldValue): Promise<void> {
    return ValidateValue(components, value, FIELD_VALIDATOR_FUNCTION_NAME);
}

export async function ValidateForm(components: JSX.Element[], value: any): Promise<void> {
    return ValidateValue(components, value, FORM_VALIDATOR_FUNCTION_NAME);
}
