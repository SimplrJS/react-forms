import { GroupStore } from "../stores/group-store";
import { createContext } from "react";

export interface GroupContextObject {
    store: GroupStore;
    groupId?: string;
    test?: string;
}

export const GroupContext = createContext<GroupContextObject>({
    store: {} as GroupStore
});
