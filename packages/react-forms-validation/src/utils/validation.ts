import { FieldValue, FormErrorOrigin } from "@simplr/react-forms/contracts";
import {
    IsComponentOfType,
    RenderComponents,
    ConstructFormError
} from "@simplr/react-forms/utils";
import { FormStore } from "@simplr/react-forms/stores";

import {
    Validator,
    FIELD_VALIDATOR_FUNCTION_NAME,
    FORM_VALIDATOR_FUNCTION_NAME,
    ValidationFieldErrorTemplate,
    ValidationFormErrorTemplate,
    ValidationError,
    ValidationResult
} from "../contracts";

function IsPromise<T>(value: any): value is Promise<T> {
    return value != null && value.then != null && value.catch != null;
}

function IsFunction<T>(value: any): value is T {
    return typeof value === "function";
}

export async function ValidateValue(
    components: JSX.Element[],
    value: any,
    validatorTypeFunctionName: string,
    errorProccessor: (error: ValidationResult) => ValidationResult
): Promise<void> {
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
                const buildedError = errorProccessor(validationResult);
                const error = ConstructFormError(buildedError, FormErrorOrigin.Validation);
                if (error !== undefined) {
                    reject(error);
                    return;
                }
                resolve();
            });
        }
        await promise;
    }
}

export async function ValidateField(components: JSX.Element[], value: FieldValue, fieldId: string, formStore: FormStore): Promise<void> {
    return ValidateValue(components, value, FIELD_VALIDATOR_FUNCTION_NAME, error => {
        if (IsFunction<ValidationFieldErrorTemplate>(error)) {
            const errorTemplate = error;
            const buildedError = errorTemplate(fieldId, formStore);
            return buildedError;
        }

        return error;
    });
}

export async function ValidateForm(components: JSX.Element[], value: any, formStore: FormStore): Promise<void> {
    return ValidateValue(components, value, FORM_VALIDATOR_FUNCTION_NAME, error => {
        if (IsFunction<ValidationFormErrorTemplate>(error)) {
            const errorTemplate = error;
            return errorTemplate(formStore);
        }

        return error;
    });
}
