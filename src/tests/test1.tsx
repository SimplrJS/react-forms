import React, { useState } from "react";
import { TextField } from "../components/text-field";

export const Test1 = () => {
    const [show, setShow] = useState(true);
    return (
        <>
            <div>
                <button onClick={() => setShow(!show)}>
                    {!show ? "Mount" : "Unmount"}
                </button>
                <label>
                    First name
                    <TextField name="firstName" initialValue="John" />
                </label>
                <label>
                    Last name
                    {show ? (
                        <TextField name="lastName" initialValue="Smith" />
                    ) : null}
                </label>
            </div>
        </>
    );
};
