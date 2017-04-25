import { FieldValue } from "simplr-forms-core/contracts";
import { ProcessValue } from "simplr-forms-core/utils";

import { Validator, VALIDATOR_FUNCTION_NAME } from "../contracts";


export function Validate(components: Array<JSX.Element>, value: FieldValue) {
    return ProcessValue<Validator, Promise<void>>(components, value, VALIDATOR_FUNCTION_NAME,
        async (processor, value) => {
            const validationResult = processor.Validate(value);
            if (validationResult != null && typeof validationResult === "string") {
                throw validationResult;
            }
            return await validationResult;
        });
}
