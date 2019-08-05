import React from "react";

import { useDiff } from "../../hooks/use-diff";
import { mergeObjectKeys } from "../../helpers";

import { JsonTypeView } from "../json-type";
import { LineView } from "../line-view";
import { Highlighter, getHighlighterState, HighlighterState } from "../highlighter";
import { JsonObject, JsonBaseProps } from "../../contracts";

export interface ObjectViewProps extends JsonBaseProps<JsonObject> {}

export const ObjectView = (props: ObjectViewProps) => {
    const { prevState: prevValue, state: value } = useDiff(props.value);
    const keys = mergeObjectKeys(prevValue, value);

    const objectElements: { [key: string]: JSX.Element } = {};

    for (const key of keys) {
        const currentElementValue = value[key];
        const prevElementValue = prevValue[key];

        const state = getHighlighterState(prevElementValue, currentElementValue);

        objectElements[key] = (
            <Highlighter state={state}>
                <span>"{key}": </span>
                <JsonTypeView
                    value={
                        state !== HighlighterState.Removed ? currentElementValue : prevElementValue
                    }
                    depth={props.depth + 1}
                />
            </Highlighter>
        );
    }

    return (
        <span>
            <LineView indent={0}>{"{"}</LineView>
            {keys.map((key, index, arr) => (
                <LineView key={`object-${key}`} indent={props.depth + 1}>
                    {objectElements[key]}
                    {index !== arr.length - 1 ? "," : null}
                </LineView>
            ))}
            <LineView indent={props.depth} noNewLine={true}>
                {"}"}
            </LineView>
        </span>
    );
};
