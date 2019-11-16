import React from "react";
import { action, HandlerFunction } from "@storybook/addon-actions";
// import { Button } from "@storybook/react/demo";

interface ButtonProps {
    onClick: HandlerFunction;
}

const Button: React.FC<ButtonProps> = props => {
    return <button {...props} />;
};

export default {
    title: "Button"
};

export const text = () => (
    <Button
        onClick={(...args) => {
            action("clicked", {
                clearOnStoryChange: false
            })(args);
        }}
    >
        Hello Button
    </Button>
);

export const emoji = () => (
    <Button onClick={action("clicked")}>
        <span role="img" aria-label="so cool">
            😀 😎 👍 💯 No more emojis for youasdasd
        </span>
    </Button>
);
