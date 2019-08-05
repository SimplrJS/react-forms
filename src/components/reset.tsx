import React, { useContext } from "react";
import { GroupContext } from "../contexts/group-context";

export interface ResetButtonProps {
    children: React.ReactNode;
}

export const ResetButton = (props: ResetButtonProps) => {
    const { store, groupId } = useContext(GroupContext);

    const onClick: React.MouseEventHandler<HTMLButtonElement> = event => {
        store.reset();
    };

    return <button onClick={onClick}>{props.children}</button>;
};
