import React from "react";
import ReactDOM from "react-dom";
import { Text } from "@reactway/forms";

const App = (): JSX.Element => {
    return <Text initialValue="hello" />;
    // return <div>Hello</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
