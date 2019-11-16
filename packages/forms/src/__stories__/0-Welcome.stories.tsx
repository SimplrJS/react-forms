import React from "react";
import { linkTo } from "@storybook/addon-links";
// import { Welcome } from "@storybook/react/demo";

interface WelcomeProps {
    showApp: (...args: string[]) => void;
}

const Welcome: React.FC<WelcomeProps> = props => {
    return <div>Welcome</div>;
};

// eslint-disable-next-line import/no-default-export
export default {
    title: "Welcome"
};

export const toStorybook = (): JSX.Element => <Welcome showApp={linkTo("Button")} />;

toStorybook.story = {
    name: "to Storybook"
};
