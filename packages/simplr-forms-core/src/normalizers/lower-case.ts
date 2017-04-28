import * as React from "react";
import { FieldValue } from "../contracts/field";
import { ValueOfType } from "../utils/value-helpers";
import { BaseNormalizer } from "./base-normalizer";

export class LowerCaseNormalizer extends BaseNormalizer<{}, {}> {
    Normalize(value: FieldValue): FieldValue {
        if (ValueOfType<string>(value, LowerCaseNormalizer.name, "string")) {
            return value.toLowerCase();
        }
    }
}
