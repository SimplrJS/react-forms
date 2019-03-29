import { TinyEmitter, Callback } from "../helpers/emitter";
import { produce } from "immer";

export const SEPARATOR = ".";

interface Status {
    isFocused: boolean;
    isTouched: boolean;
}

interface Field {
    id: string;
    name: string;

    defaultValue: string;
    initialValue: string;
    currentValue: string;

    status: Status;
}

type Fields = {
    [key: string]: Field | undefined;
};

interface GroupState {
    fields: Fields;
    status: Status;
}

const defaultStatus = (): Status => ({ isFocused: false, isTouched: false });

const calculateGroupStatus = (state: GroupState): Status => {
    let isFocused = false;
    let isTouched = false;

    for (const key of Object.keys(state.fields)) {
        const field = state.fields[key];
        if (field == null) {
            continue;
        }

        if (field.status.isFocused) {
            isFocused = true;
        }
        if (field.status.isTouched) {
            isTouched = true;
        }

        // If group is both focused and touched already, nothing is going to change anymore
        if (isFocused && isTouched) {
            // Thus, break.
            break;
        }
    }

    return {
        isFocused: isFocused,
        isTouched: isTouched
    };
};

export class GroupStoreMutable extends TinyEmitter<Callback> {
    protected state: GroupState = {
        fields: {},
        status: defaultStatus()
    };

    public getField(fieldId: string): Field | undefined {
        return this.state.fields[fieldId];
    }

    public generateFieldId(name: string, groupId: string): string {
        return `${groupId}${SEPARATOR}${name}`;
    }

    public registerField(
        name: string,
        groupId: string,
        defaultValue: string,
        initialValue?: string
    ): void {
        const id = this.generateFieldId(name, groupId);

        if (this.state.fields[id] != null) {
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
            status: defaultStatus()
        };

        this.state = produce(this.state, state => {
            state.fields[id] = newField;
        });
        this.emit();
    }

    public unregisterField(id: string): void {
        if (this.state.fields[id] == null) {
            return;
        }

        this.state = produce(this.state, state => {
            state.fields[id] = undefined;
        });
        this.emit();
    }

    public updateValue(fieldId: string, value: string): void {
        console.log(`Value updated ${fieldId}`);
        if (this.state.fields[fieldId] == null) {
            throw new Error(
                `Cannot update non-existent field value. (field id '${fieldId}').`
            );
        }
        this.state = produce(this.state, state => {
            const field = state.fields[fieldId];
            if (field == null) {
                return;
            }

            // Value equality check should be abstracted for particular component and value type
            if (field.currentValue !== value) {
                field.status.isTouched = true;
            }
            field.currentValue = value;
        });

        this.emit();
    }

    public focus(fieldId: string): void {
        console.log(`Focus ${fieldId}`);
        this.setFocused(fieldId, true);
        this.emit();
    }

    public blur(fieldId: string): void {
        console.log(`Blur ${fieldId}`);
        this.setFocused(fieldId, false);
        this.emit();
    }

    private setFocused(fieldId: string, isFocused: boolean): void {
        if (this.state.fields[fieldId] == null) {
            throw new Error(
                `Cannot update non-existent field value. (field id '${fieldId}').`
            );
        }

        this.state = produce(this.state, state => {
            const field = state.fields[fieldId];
            if (field == null || field.status.isFocused === isFocused) {
                return;
            }

            field.status.isFocused = isFocused;

            // If the field is not touched yet and got focused, make it touched.
            if (!field.status.isTouched && isFocused) {
                field.status.isTouched = true;
            }

            // Recalculate group status, because field status has changed
            state.status = calculateGroupStatus(state);
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
        this.emit();
    }

    public toObject(): unknown {
        const result: { [key: string]: unknown } = {};
        const fields = this.state.fields;
        for (const key in fields) {
            if (fields.hasOwnProperty(key)) {
                const field = fields[key];
                if (field == null) {
                    continue;
                }
                result[field.name] = field.currentValue;
            }
        }
        return result;
    }
}

export type GroupStore = Readonly<GroupStoreMutable>;
