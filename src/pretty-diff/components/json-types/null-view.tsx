import React from "react";

import { JsonBaseProps, JsonNull } from "../../contracts";

const functionStyles: React.CSSProperties = {
    userSelect: "none",
    backgroundColor: "lightgrey",
    padding: "0 5px",
    marginLeft: "4px",
    borderRadius: "5px"
};

export interface NullViewProps extends JsonBaseProps<JsonNull> {}

export const NullView = (props: NullViewProps) => {
    let functionName: string | undefined;
    if (typeof props.value === "function" && props.value != null) {
        functionName = `${props.value.name}()`;
    }

    return (
        <>
            <span className="json-null">null</span>
            <span style={functionStyles}>{functionName}</span>
        </>
    );
};
