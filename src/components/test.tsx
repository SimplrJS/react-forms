import React, { useState, useContext } from "react";

export const Test = () => {
    const [value, setValue] = useState("Test");

    return (
        <input
            type="text"
            value={value}
            onChange={event => setValue(event.target.value)}
        />
    );
};
