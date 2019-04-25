import React, { useContext } from "react";
import { SEPARATOR } from "../stores/constants";
import { GroupContext, GroupContextObject } from "../contexts/group-context";

interface Props {
    name: string;
    permanent?: boolean;
    children: React.ReactNode;
}

export const Group = (props: Props) => {
    const groupContext = useContext(GroupContext);

    let groupId = props.name;
    if (groupContext.groupId != null) {
        groupId = `${groupContext.groupId}${SEPARATOR}${props.name}`;
    }

    let permanent = props.permanent;

    if (permanent == null) {
        permanent = groupContext.permanent;
    }

    const groupObject: GroupContextObject = {
        ...groupContext,
        groupId,
        permanent
    };
    return <GroupContext.Provider value={groupObject}>{props.children}</GroupContext.Provider>;
};
