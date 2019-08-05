import React, { useContext } from "react";
import { Group } from "../components/group";
import { TextField } from "../components/text-field";
import { GroupContext } from "../contexts/group-context";

export const Test2 = () => {
    const { store } = useContext(GroupContext);
    const fieldId = "person.firstName";

    const field = store.getField(fieldId);
    if (field != null) {
        console.log(field.currentValue);
    }

    return (
        <Group name="person">
            <label>
                First name:
                <TextField name="firstName" initialValue="John" />
            </label>
            <label>
                Last name:
                <TextField name="lastName" initialValue="Smith" />
            </label>

            <Group name="meta">
                <label>
                    Age:
                    <TextField name="age" initialValue="20" />
                </label>
            </Group>
        </Group>
    );
};
