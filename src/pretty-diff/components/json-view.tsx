import React from "react";
import { JsonTypeView } from "./json-type";
import { JsonType } from "../contracts";

export interface JsonViewProps {
    value: JsonType;
}

export const JsonView = (props: JsonViewProps) => {
    return (
        <pre>
            <code>
                <JsonTypeView value={props.value} depth={0} />
            </code>
        </pre>
    );
};
