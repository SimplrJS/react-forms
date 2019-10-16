/* eslint-disable */

import React from "react";

import { useDiff } from "../../hooks/use-diff";
import { JsonBaseProps, JsonArray } from "../../contracts";

import { JsonTypeView } from "../json-type";
import { LineView } from "../line-view";
import { getHighlighterState, Highlighter, HighlighterState } from "../highlighter";

export interface ArrayViewProps extends JsonBaseProps<JsonArray> {}

export const ArrayView = (props: ArrayViewProps) => {
    const { prevState: prevValue, state: value } = useDiff(props.value);
    const arrayLength = prevValue.length > value.length ? prevValue.length : value.length;

    const arrayElements: JSX.Element[] = [];

    for (let i = 0; i < arrayLength; i++) {
        const currentElementValue = value[i];
        const prevElementValue = prevValue[i];

        const state = getHighlighterState(prevElementValue, currentElementValue);

        arrayElements.push(
            <Highlighter state={state}>
                <JsonTypeView value={state !== HighlighterState.Removed ? currentElementValue : prevElementValue} depth={props.depth + 1} />
            </Highlighter>
        );
    }

    return (
        <>
            <LineView indent={0}>[</LineView>
            {arrayElements.map((x, index, arr) => (
                <LineView key={`array-${index}`} indent={props.depth + 1}>
                    {x}
                    {index !== arr.length - 1 ? "," : null}
                </LineView>
            ))}
            <LineView indent={props.depth} noNewLine={true}>
                ]
            </LineView>
        </>
    );
};
