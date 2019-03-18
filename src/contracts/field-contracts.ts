export interface FieldValues {
    defaultValue?: string;
    initialValue?: string;
    currentValue?: string;
}

export interface FieldProps extends FieldValues {
    name: string;
}

export interface FieldState extends FieldProps {
    fieldId: string;
}
