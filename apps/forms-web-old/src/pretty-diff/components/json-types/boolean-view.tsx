/* eslint-disable */

import React from "react";
import { JsonBoolean, JsonBaseProps } from "../../contracts";

export interface BooleanViewProps extends JsonBaseProps<JsonBoolean> {}

export const BooleanView = (props: BooleanViewProps) => {
    return <span className="json-boolean">{props.value.toString()}</span>;
};
