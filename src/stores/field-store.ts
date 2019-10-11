import { TinyEmitter, Callback } from "../helpers/emitter";

export class FieldStore extends TinyEmitter<Callback> {
    public initialValue: string;
    public defaultValue: string;
    public currentValue: string;

    /**
     *
     */
    constructor(defaultValue: string = "", initialValue?: string) {
        super();

        if (initialValue == null) {
            this.initialValue = defaultValue;
            this.currentValue = defaultValue;
        } else {
            this.initialValue = initialValue;
            this.currentValue = initialValue;
        }

        this.defaultValue = defaultValue;
    }

    public setCurrentValue(value: string): void {
        this.currentValue = value;
        this.emit();
    }
}
