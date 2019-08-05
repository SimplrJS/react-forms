import React from "react";
import { JsonBaseProps, JsonNumber } from "../../contracts";

export interface NumberViewProps extends JsonBaseProps<JsonNumber> {}

export const NumberView = (props: NumberViewProps) => {
    return <span>{props.value}</span>;
};
