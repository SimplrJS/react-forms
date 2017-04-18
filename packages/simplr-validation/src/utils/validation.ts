import * as ReactDOM from "react-dom";
import { Utils, Contracts } from "simplr-forms-core";

import { Validator, VALIDATOR_FUNCTION_NAME } from "../contracts";


export function Validate(components: Array<JSX.Element>, value: Contracts.FieldValue) {
    return Utils.ProcessValue<Validator, Promise<void>>(components, value, VALIDATOR_FUNCTION_NAME,
        async (processor, value) => {
            const validationResult = processor.Validate(value);
            if (validationResult != null && typeof validationResult === "string") {
                throw validationResult;
            }
            return await validationResult;
        });
}
