import React from "react";

function generateSpace(n: number): string {
    let spaces = "";
    for (let i = 0; i < n; i++) {
        spaces += "\u00A0";
    }

    return spaces;
}

export interface LineViewProps {
    indent: number;
    noNewLine?: boolean;
    children?: React.ReactNode;
}

export const LineView = (props: LineViewProps): JSX.Element => {
    return (
        <>
            {generateSpace(props.indent * 4)}
            {props.children}
            {props.noNewLine ? null : "\n"}
        </>
    );
};
