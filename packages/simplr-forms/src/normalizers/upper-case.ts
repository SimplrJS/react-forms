import { FieldValue } from "../contracts/field";
import { ValueOfType } from "../utils/value-helpers";
import { BaseNormalizer } from "./base-normalizer";

export class UpperCaseNormalizer extends BaseNormalizer<{}, {}> {
    Normalize(value: FieldValue): FieldValue {
        if (ValueOfType<string>(value, UpperCaseNormalizer.name, "string")) {
            return value.toUpperCase();
        }
    }
}
