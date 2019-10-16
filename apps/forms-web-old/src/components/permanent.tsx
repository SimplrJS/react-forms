/* eslint-disable */

import React from "react";
import { PermanentContext } from "../contexts/permanent-context";

interface Props {
    children: React.ReactNode;
}

export const Permanent = (props: Props) => {
    return (
        <PermanentContext.Provider value={{ permanent: true }}>
            {props.children}
        </PermanentContext.Provider>
    );
};
