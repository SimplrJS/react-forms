import React, { useContext, useEffect, useState } from "react";
import { FieldContext } from "../contexts/field-context";
import { GroupContext } from "../contexts/group-context";
import { useForceUpdate } from "../force-update";
import { GroupStore } from "../stores/group-store";

export interface FieldValues {
    defaultValue?: string;
    initialValue?: string;
    currentValue?: string;
}

export interface TextFieldProps extends FieldValues {
    name: string;
}

interface FieldResult {
    store: GroupStore;
    fieldId: string;
    fieldProps: JSX.IntrinsicElements["input"];
}

function useField(props: TextFieldProps): FieldResult {
    const [currentValue, setCurrentValue] = useState("");

    const { store, groupId } = useContext(GroupContext);

    if (groupId == null) {
        // TODO: Error message.
        throw new Error("groupId is not defined.");
    }

    let { defaultValue, initialValue } = props;

    const fieldId = store.generateFieldId(props.name, groupId);

    const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        store.updateValue(fieldId, event.target.value);
    };

    useEffect(() => {
        if (defaultValue == null) {
            defaultValue = "";
        }

        if (initialValue == null) {
            initialValue = defaultValue;
        }

        store.registerField(props.name, groupId, defaultValue, initialValue);

        const storeUpdated = () => {
            const field = store.getField(fieldId);
            if (field == null) {
                return;
            }
            setCurrentValue(field.currentValue);
        };
        storeUpdated();

        store.addListener(storeUpdated);

        return () => {
            // First, remove listener to not get any more updates.
            store.removeListener(storeUpdated);
            // Then, unregister field.
            store.unregisterField(fieldId);
        };
    }, []);
    return {
        fieldId: fieldId,
        store: store,
        fieldProps: {
            value: currentValue,
            onChange: onChange
        }
    };
}

export const TextField = (props: TextFieldProps) => {
    const { fieldId, store, fieldProps } = useField(props);

    return <input type="text" {...fieldProps} />;
};
