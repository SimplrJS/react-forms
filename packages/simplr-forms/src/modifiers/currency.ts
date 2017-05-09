import { FieldValue } from "../contracts/field";
import { ValueOfType } from "../utils/value-helpers";
import { BaseModifier } from "./base-modifier";

export interface CurrencyProps {
    symbol: string;
}

const EMPTY_VALUE = "";

export class CurrencyModifier extends BaseModifier<CurrencyProps, {}> {
    private emptyFormattedValue = this.Format(EMPTY_VALUE);

    Format(value: FieldValue): FieldValue {
        value = value !== EMPTY_VALUE ? value : 0;
        return `${value}${this.props.symbol}`;
    }
    Parse(value: FieldValue): FieldValue {
        if (value === this.emptyFormattedValue) {
            return 0;
        }
        if (ValueOfType<string>(value, CurrencyModifier.name, "string")) {
            const firstChar = value.substr(0, 1);
            let negative = false;
            if (firstChar === "-") {
                negative = true;
                value = value.substr(1);
            }
            const leadingMinus = negative ? "-" : "";
            const numValue = Number(leadingMinus + value.replace(/[^0-9\.]+/g, ""));
            return numValue;
        }
    }
}
