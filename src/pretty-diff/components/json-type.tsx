import React from "react";
import { DEFAULT_JSON_COMPONENTS } from "../json-components";
import { JsonType } from "../contracts";

const { ArrayView, StringView, NumberView, ObjectView, BooleanView, NullView } = DEFAULT_JSON_COMPONENTS;

export interface JsonTypeProps {
    value: JsonType;
    depth: number;
}

export const JsonTypeView = ({ value, depth }: JsonTypeProps) => {
    if (Array.isArray(value)) {
        return <ArrayView value={value} depth={depth} />;
    }

    switch (typeof value) {
        case "boolean": {
            return <BooleanView value={value} depth={depth} />;
        }
        case "bigint":
        case "number": {
            return <NumberView value={value} depth={depth} />;
        }
        case "object": {
            if (value != null) {
                return <ObjectView value={value} depth={depth} />;
            } else {
                return <NullView value={value} depth={depth} />;
            }
        }
        case "function": {
            return <NullView value={value} depth={depth} />;
        }
        case "string": {
            return <StringView value={value} depth={depth} />;
        }
    }

    return null;
};
