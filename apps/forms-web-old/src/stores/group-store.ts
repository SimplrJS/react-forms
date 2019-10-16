/* eslint-disable */

import { produce } from "immer";
import { TinyEmitter, Callback } from "../helpers/emitter";
import { FieldValues } from "../contracts/field-contracts";
import { SEPARATOR } from "./constants";

interface Status {
    focused: boolean;
    touched: boolean;
}

interface Field {
    id: string;
    name: string;

    defaultValue: string;
    initialValue: string;
    currentValue: string;

    status: Status;
    permanent: boolean;
}

type Fields = {
    [key: string]: Field | undefined;
};

interface GroupState {
    fields: Fields;
    status: Status;
}

const defaultStatus = (): Status => ({ focused: false, touched: false });

const getField = (state: GroupState, fieldId: string): Field => {
    const field = state.fields[fieldId];
    if (field == null) {
        throw new Error(`Field '${fieldId}' does not exist.`);
    }
    return field;
};

const calculateGroupStatus = (state: GroupState): Status => {
    let focused = false;
    let touched = false;

    for (const key of Object.keys(state.fields)) {
        const field = state.fields[key];
        if (field == null) {
            continue;
        }

        if (field.status.focused) {
            focused = true;
        }
        if (field.status.touched) {
            touched = true;
        }

        // If group is both focused and touched already, nothing is going to change anymore
        if (focused && touched) {
            // Thus, break.
            break;
        }
    }

    return {
        focused: focused,
        touched: touched
    };
};

// TODO: Value equality check should be abstracted for particular component and value type
export class GroupStoreMutable extends TinyEmitter<Callback> {
    protected _state: GroupState = {
        fields: {},
        status: defaultStatus()
    };

    protected get state(): GroupState {
        return this._state;
    }

    protected set state(newState: GroupState) {
        // If the reference has not changed
        if (this.state === newState) {
            // There is not point in updating it.
            return;
        }

        // Else, update the reference
        this._state = newState;

        // And emit the change
        this.emit();
    }

    public getField(fieldId: string): Field | undefined {
        return this.state.fields[fieldId];
    }

    public generateFieldId(name: string, groupId: string | undefined): string {
        if (groupId == null) {
            return name;
        }
        return `${groupId}${SEPARATOR}${name}`;
    }

    public registerField(
        name: string,
        groupId: string | undefined,
        defaultValue: string,
        initialValue?: string,
        permanent?: boolean
    ): void {
        const id = this.generateFieldId(name, groupId);
        console.log(`registerField '${id}'`);

        const existingField = this.state.fields[id];
        if (existingField != null) {
            // If existing field is permanent, it is registered already.
            if (existingField.permanent) {
                return;
            }
            throw new Error(`Field with an id '${id}' is already registered.`);
        }

        if (initialValue == null) {
            initialValue = defaultValue;
        }

        const newField: Field = {
            id: id,
            name: name,
            defaultValue: defaultValue,
            initialValue: initialValue,
            currentValue: initialValue,
            permanent: Boolean(permanent),
            status: defaultStatus()
        };

        this.state = produce(this.state, state => {
            state.fields[id] = newField;
        });
    }

    public unregisterField(id: string): void {
        console.log(`unregisterField '${id}'`);
        const existingField = this.state.fields[id];
        if (existingField == null) {
            return;
        }

        if (existingField.permanent) {
            return;
        }

        this.state = produce(this.state, state => {
            state.fields[id] = undefined;
        });
    }

    public updateValue(fieldId: string, value: string): void {
        this.state = produce(this.state, state => {
            const field = getField(state, fieldId);

            // TODO: Value equality check should be abstracted for particular component and value type
            if (field.currentValue !== value) {
                field.currentValue = value;

                // If current value has changed, the field has been touched.
                field.status.touched = true;
                // Recalculate group status, because field status has changed.
                state.status = calculateGroupStatus(state);
            }
        });
    }

    public updateValues(fieldId: string, values: FieldValues): void {
        this.state = produce(this.state, state => {
            const field = getField(state, fieldId);

            if (values.defaultValue != null) {
                field.defaultValue = values.defaultValue;
            }
            if (values.initialValue != null) {
                field.initialValue = values.initialValue;
            }
            if (values.currentValue != null && values.currentValue !== field.currentValue) {
                field.currentValue = values.currentValue;

                // If current value has changed, the field has been touched.
                field.status.touched = true;
                // Recalculate group status, because field status has changed.
                state.status = calculateGroupStatus(state);
            }
        });
    }

    public focus(fieldId: string): void {
        console.log(`Focus ${fieldId}`);
        this.setFocused(fieldId, true);
    }

    public blur(fieldId: string): void {
        console.log(`Blur ${fieldId}`);
        this.setFocused(fieldId, false);
    }

    private setFocused(fieldId: string, focused: boolean): void {
        this.state = produce(this.state, state => {
            const field = getField(state, fieldId);
            if (field.status.focused === focused) {
                return;
            }

            field.status.focused = focused;

            // If the field is not touched yet and got focused, make it touched.
            if (!field.status.touched && focused) {
                field.status.touched = true;
            }

            // Recalculate group status, because field status has changed
            state.status = calculateGroupStatus(state);
        });
    }

    public setPermanent(fieldId: string, permanent: boolean): void {
        this.state = produce(this.state, state => {
            const field = getField(state, fieldId);
            field.permanent = permanent;
        });
    }

    public reset(): void {
        console.log(`Reset state`);
        this.state = produce(this.state, state => {
            // Reset fields
            const fields = state.fields;
            for (const key of Object.keys(fields)) {
                const field = fields[key];
                if (field == null) {
                    continue;
                }

                field.currentValue = field.initialValue;
                field.status = defaultStatus();
            }

            // Reset group status
            state.status = defaultStatus();
        });
    }

    public toObject(): unknown {
        const result: { [key: string]: unknown } = {};
        const fields = this.state.fields;
        for (const key in fields) {
            if (fields.hasOwnProperty(key)) {
                const field = fields[key];
                if (field == null) {
                    // Will never happen
                    continue;
                }

                const splitKey = key.split(SEPARATOR);

                const paths = splitKey.slice(0, splitKey.length - 1);

                // tslint:disable-next-line no-any
                let current: any = result;
                for (const path of paths) {
                    if (current[path] == null) {
                        current[path] = {};
                    }
                    current = current[path];
                }

                current[field.name] = field.currentValue;
            }
        }
        return result;
    }
}

export type GroupStore = Readonly<GroupStoreMutable>;
