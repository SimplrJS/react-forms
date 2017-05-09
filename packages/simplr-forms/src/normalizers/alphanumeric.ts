import * as React from "react";
import { FieldValue } from "../contracts/field";
import { ValueOfType } from "../utils/value-helpers";
import { BaseNormalizer } from "./base-normalizer";

export interface AlphanumericProps {
    allowSpaces?: boolean;
}

export class AlphanumericNormalizer extends BaseNormalizer<AlphanumericProps, {}> {
    static defaultProps: AlphanumericProps = {
        allowSpaces: true
    };

    Normalize(value: FieldValue): FieldValue {
        if (ValueOfType<string>(value, AlphanumericNormalizer.name, "string")) {
            const space = this.props.allowSpaces ? " " : "";
            const regex = new RegExp(`[^0-9a-zA-Z${space}]`);
            return value.replace(regex, "");
        }
    }
}
