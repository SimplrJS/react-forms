/* eslint-disable */

import React from "react";
import { JsonBaseProps, JsonString } from "../../contracts";

export interface StringViewProps extends JsonBaseProps<JsonString> {}

const URL_PATTERN = /^(http|https):\/\/[^\s]+$/;

export const StringView = (props: StringViewProps) => {
    const isUrl = URL_PATTERN.test(props.value);

    return (
        <>
            {isUrl ? (
                <span className="json-string url">
                    "
                    <a href={props.value} target="_blank">
                        {props.value}
                    </a>
                    "
                </span>
            ) : (
                <span className="json-string">"{props.value}"</span>
            )}
        </>
    );
};
