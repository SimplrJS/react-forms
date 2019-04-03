import React, { useContext, useEffect, useState } from "react";
import { FieldContext } from "../contexts/field-context";
import { GroupContext } from "../contexts/group-context";
import { useForceUpdate } from "../force-update";
import { GroupStore } from "../stores/group-store";
import { PermanentContext } from "../contexts/permanent-context";
import { FieldValues } from "../contracts/field-contracts";

export interface TextFieldProps extends FieldValues {
    name: string;
    permanent?: boolean;
}

interface FieldResult {
    store: GroupStore;
    fieldId: string;
    fieldProps: JSX.IntrinsicElements["input"];
}

function useField(props: TextFieldProps): FieldResult {
    const { store, groupId } = useContext(GroupContext);

    // #region Development checks
    // #region Same id check
    const previousAndCurrent = (previous: string | undefined, current: string | undefined) =>
        `Previous value: ${previous}. Current: ${current}`;
    function useSameId(name: string, groupId?: string) {
        const [state] = useState({
            name: name,
            groupId: groupId
        });

        if (state.name !== name) {
            throw new Error(
                // tslint:disable-next-line:max-line-length
                `Prop 'name' cannot change during the lifecycle of the component.\nOtherwise, the field will be unregistered and registered again with an initial value.\nThus, you will lose its current value. ${previousAndCurrent(
                    state.name,
                    name
                )}`
            );
        }
        if (state.groupId !== groupId) {
            throw new Error(
                // tslint:disable-next-line:max-line-length
                `GroupContext 'groupId' cannot change during the lifecycle of the component.\nOtherwise, the field will be unregistered and registered again with an initial value.\nThus, you will lose its current value. ${previousAndCurrent(
                    "test",
                    groupId
                )}`
            );
        }
    }
    useSameId(props.name, groupId);
    // #endregion

    if (props.currentValue != null) {
        throw new Error(
            `Controlled current value through props is not implemented. Field name: ${props.name}.`
        );
    }

    // #endregion

    const [currentValue, setCurrentValue] = useState("");

    const { initialValue } = props;

    const defaultValue = props.defaultValue == null ? "" : props.defaultValue;

    const fieldId = store.generateFieldId(props.name, groupId);

    useEffect(() => {
        store.registerField(props.name, groupId, defaultValue, initialValue, props.permanent);

        const storeUpdated = () => {
            const field = store.getField(fieldId);
            if (field == null) {
                return;
            }

            setCurrentValue(field.currentValue);
        };

        // Initial update is skipped, because field is registered during first render and
        // store listener is added asynchronously. The change action is emitted in-between.
        // Thus, a manual update is needed.
        storeUpdated();

        store.addListener(storeUpdated);

        return () => {
            // First, remove listener to not get any more updates.
            store.removeListener(storeUpdated);
        };
    }, [
        // Any changes to these values will unregister and register the field again.
        props.name,
        groupId,
        fieldId
    ]);

    useEffect(() => {
        store.updateValues(fieldId, {
            defaultValue: defaultValue,
            initialValue: initialValue,
            // Use props.currentValue because currentValue is used for actual current value
            currentValue: props.currentValue
        });
    }, [defaultValue, initialValue, props.currentValue]);

    useEffect(() => {
        if (props.permanent != null) {
            store.setPermanent(fieldId, props.permanent);
        }
    }, [props.permanent]);

    useEffect(() => {
        return () => {
            // Unregistering field is the last thing to do while unmounting the component
            store.unregisterField(fieldId);
        };
    }, [
        // To be technically correct, the fieldId is added to dependencies list.
        // But the error will be thrown if fieldId changes anyway.
        fieldId
    ]);

    return {
        fieldId: fieldId,
        store: store,
        fieldProps: {
            value: currentValue,
            onChange: event => store.updateValue(fieldId, event.target.value),
            onFocus: () => store.focus(fieldId),
            onBlur: () => store.blur(fieldId)
        }
    };
}

export const TextField = (props: TextFieldProps) => {
    const { fieldId, store, fieldProps } = useField(props);

    return <input type="text" {...fieldProps} />;
};
