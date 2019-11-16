import React from "react";
import { linkTo } from "@storybook/addon-links";
// import { Welcome } from "@storybook/react/demo";

interface WelcomeProps {
    showApp: (...args: string[]) => void;
}

const Welcome: React.FC<WelcomeProps> = props => {
    return <div>Welcome</div>;
};

export default {
    title: "Welcome"
};

export const toStorybook = () => <Welcome showApp={linkTo("Button")} />;

toStorybook.story = {
    name: "to Storybook"
};
