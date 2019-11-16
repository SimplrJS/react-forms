import React from "react";
import { Text } from "../components";

// eslint-disable-next-line import/no-default-export
export default {
    title: "Text"
};

export const text = (): JSX.Element => {
    return (
        <label>
            <div>Text input</div>
            <Text initialValue="test" />
        </label>
    );
};
