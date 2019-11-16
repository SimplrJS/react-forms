import React from "react";
import { FormStore } from "@reactway/forms-core";

const formStore = new FormStore();
console.log(formStore);

interface TextProps {
    initialValue: string;
}

export const Text: React.FC<TextProps> = props => {
    return <input type="text" />;
};
