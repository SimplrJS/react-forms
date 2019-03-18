import { TinyEmitter, Callback } from "../helpers/emitter";
import produce from "immer";

export const SEPARATOR = ".";

interface Field {
    id: string;
    name: string;
    defaultValue?: string;
    initialValue?: string;
    currentValue: string;
}

type Fields = {
    [key: string]: Field | undefined;
};

export class GroupStoreMutable extends TinyEmitter<Callback> {
    protected fields: Fields = {};

    constructor() {
        super();
    }

    public getField(fieldId: string): Field | undefined {
        return this.fields[fieldId];
    }

    public generateFieldId(name: string, groupId: string): string {
        return `${groupId}${SEPARATOR}${name}`;
    }

    public registerField(
        name: string,
        groupId: string,
        defaultValue: string,
        initialValue: string
    ): void {
        const id = this.generateFieldId(name, groupId);

        if (this.fields[id] != null) {
            throw new Error(`Field with an id '${id}' is already registered.`);
        }

        const newField: Field = {
            id: id,
            name: name,
            defaultValue: defaultValue,
            initialValue: initialValue,
            currentValue: initialValue || defaultValue
        };

        this.fields = produce(this.fields, fields => {
            fields[id] = newField;
        });
        this.emit();
    }

    public unregisterField(id: string): void {
        if (this.fields[id] == null) {
            return;
        }

        this.fields = produce(this.fields, fields => {
            fields[id] = undefined;
        });
        this.emit();
    }

    public updateValue(fieldId: string, value: string): void {
        if (this.fields[fieldId] == null) {
            throw new Error(
                `Cannot update non-existent field value. (field id '${fieldId}').`
            );
        }
        this.fields = produce(this.fields, fields => {
            const field = fields[fieldId];
            if (field == null) {
                return;
            }
            field.currentValue = value;
        });

        this.emit();
    }

    public toObject(): unknown {
        const result: { [key: string]: unknown } = {};
        for (const key in this.fields) {
            if (this.fields.hasOwnProperty(key)) {
                const field = this.fields[key];
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
