import { FieldValue } from "../contracts/field";
import { ValueOfType } from "../utils/value-helpers";
import { BaseModifier } from "./base-modifier";

export class NumericModifier extends BaseModifier<{}, {}> {
    Format(value: FieldValue): FieldValue {
        if (value == null) {
            return "";
        }
        return value.toString();
    }
    Parse(value: FieldValue): FieldValue {
        return value.replace(/[^0-9\.]+/g, "");
    }
}
