import { FieldValue } from "../contracts/field";
import { ValueOfType } from "../utils/value-helpers";
import { BaseModifier } from "./base-modifier";

export interface NumericToStringModifierProps {
    // delimiter?: string | string[];
    defaultValue?: string | number;
}

export const DEFAULT_JS_NUMBER_DELIMITER = ".";

export class NumericToStringModifier extends BaseModifier<NumericToStringModifierProps, {}> {
    static defaultProps: NumericToStringModifierProps = {
        // delimiter: ".",
        defaultValue: NaN
    };

    Format(value: FieldValue): FieldValue {
        if (value == null || isNaN(value)) {
            return "";
        }
        return value.toString();
    }

    Parse(value: FieldValue): FieldValue {
        let parsedValue: number | undefined;
        if (ValueOfType<string>(value, NumericToStringModifier.name, "string")) {
            // TODO: Handle delimiter hell

            const isNegative = (value.length > 0 && value[0] === "-");
            const cleanValue = value.replace(/[^0-9\.]+/g, "");

            if (cleanValue === "") {
                return this.props.defaultValue;
            }

            parsedValue = Number(cleanValue);

            if (isNaN(parsedValue)) {
                return this.props.defaultValue;
            }

            if (isNegative) {
                parsedValue *= -1;
            }
        }

        return parsedValue;
    }
}
