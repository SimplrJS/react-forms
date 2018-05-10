import * as ReactDOM from "react-dom";
import { FieldValue } from "../contracts/field";
import * as Immutable from "immutable";
import { recordify } from "typed-immutable-record";
import {
    Modifier,
    Normalizer,
    ModifierValue
} from "../contracts/value";
import { ModifierValueRecord } from "../contracts";

export const MODIFIER_FUNCTION_NAME = "SimplrFormsCoreModifier";
export const NORMALIZER_FUNCTION_NAME = "SimplrFormsCoreNormalizer";

export function FormatValue(
    components: JSX.Element[],
    defaultModifiers: JSX.Element[],
    value: FieldValue
): FieldValue {
    return ProcessValue<Modifier, FieldValue, FieldValue>(
        components,
        defaultModifiers,
        ensureImmutability(value),
        MODIFIER_FUNCTION_NAME,
        (processor, valueToProcess) => processor.Format(valueToProcess),
        nullValue => nullValue
    );
}

export function ParseValue(
    components: JSX.Element[],
    defaultModifiers: JSX.Element[],
    value: ModifierValue
): ModifierValueRecord {
    const parsedValue = ProcessValue<Modifier, ModifierValueRecord, ModifierValueRecord>(
        components,
        defaultModifiers,
        ensureImmutability(value),
        MODIFIER_FUNCTION_NAME,
        (processor, valueToProcess) => processor.Parse(valueToProcess),
        nullValue => nullValue
    );

    // Ensure that parsed values are immutable
    if (!isValueImmutable(parsedValue)) {
        throwIfMutable(parsedValue.Value, "@simplr/react-forms: Parsed Value has to be immutable.");
        throwIfMutable(parsedValue.TransitionalValue, "@simplr/react-forms: Parsed TransitionalValue has to be immutable.");
    }

    return parsedValue;
}

export function NormalizeValue(
    components: JSX.Element[],
    defaultNormalizers: JSX.Element[],
    value: FieldValue
): FieldValue {
    const normalizedValue = ProcessValue<Normalizer, FieldValue, FieldValue>(
        components,
        defaultNormalizers,
        ensureImmutability(value),
        NORMALIZER_FUNCTION_NAME,
        (processor, valueToProcess) => processor.Normalize(valueToProcess),
        nullValue => nullValue
    );

    // Ensure that parsed values are immutable
    throwIfMutable(normalizedValue, "@simplr/react-forms: Normalized value has to be immutable.");

    return normalizedValue;
}

export function ProcessValue<TProcessor, TValue, TProcessedValue>(
    components: JSX.Element[],
    defaultProcessors: JSX.Element[],
    value: TValue,
    processorTypeFunctionName: string,
    process: (processor: TProcessor, value: TValue) => TProcessedValue,
    nullProcessor: (value: TValue) => TProcessedValue,
    postProcessing?: (value: TProcessedValue) => void): TProcessedValue {
    if (components == null && defaultProcessors.length === 0 ||
        components.length === 0 && defaultProcessors.length === 0) {
        return nullProcessor(value);
    }

    // Filter out from components (usually this.props.children) list processors.
    let processors = components.filter(x => IsComponentOfType(x, processorTypeFunctionName));

    if (processors.length === 0) {
        if (defaultProcessors.length === 0) {
            return nullProcessor(value);
        }

        processors = defaultProcessors;
    } else {
        const dedupedProcessors: JSX.Element[] = [];

        for (let i = processors.length - 1; i >= 0; i--) {
            const processor = processors[i];
            if (dedupedProcessors.find(x => x.type === processor.type) == null) {
                dedupedProcessors.push(processor);
            }
        }

        processors = dedupedProcessors;
    }

    const renderedProcessors = RenderComponents<TProcessor>(processors);

    let processedValue: TProcessedValue | undefined;
    for (const processor of renderedProcessors) {
        processedValue = process(processor, value);
        if (postProcessing != null) {
            postProcessing(processedValue);
        }
    }
    if (processedValue == null) {
        return nullProcessor(value);
    }
    return processedValue;
}

export function IsComponentOfType(component: JSX.Element, requiredType: string): boolean {
    const componentType = component.type as any;
    if (componentType == null && typeof component === "string") {
        console.warn("@simplr/react-forms: text should not be rendered inside fields:", component);
        return false;
    }
    return (componentType[requiredType] != null);
}

export function RenderComponents<TComponent>(components: JSX.Element[]): TComponent[] {
    const virtualDiv = document.createElement("div");
    const renderedComponents = components.map(component =>
        ReactDOM.render(component, virtualDiv) as any as TComponent);

    ReactDOM.unmountComponentAtNode(virtualDiv);
    return renderedComponents;
}

/**
 * Normalizers and modifiers helpers
 */

export type ValueTypeConfirmation = (valueToCheck: FieldValue) => boolean;

export function ValueOfType<TRequiredType>(
    value: FieldValue,
    normalizerName: string,
    requiredTypeOf: string,
    valueTypeConfirmation?: ValueTypeConfirmation): value is TRequiredType {
    if (valueTypeConfirmation == null) {
        valueTypeConfirmation = v => typeof v !== requiredTypeOf;
    }
    if (valueTypeConfirmation(value)) {
        let message = `${normalizerName} can only accept ${requiredTypeOf}, but received ${typeof value}. `;
        message += `Either use it with ${requiredTypeOf} value field or use modifier to do required type conversions. `;
        // TODO: Link to docs
        message += `More info: {link to docs}`;
        throw new Error(message);
    }
    return true;
}

export function RecordifyModifierValue<TValue extends ModifierValue>(value: TValue): ModifierValueRecord {
    return recordify<ModifierValue, ModifierValueRecord>(value);
}

/**
 * Temporary functions for ImmutableJS v4 substitutions
 */

const IS_ITERABLE_SENTINEL: string = "@@__IMMUTABLE_ITERABLE__@@";
const IS_RECORD_SENTINEL: string = "@@__IMMUTABLE_RECORD__@@";
function isImmutable(maybeImmutable: any): boolean {
    return (isCollection(maybeImmutable) || isRecord(maybeImmutable)) &&
        !maybeImmutable.__ownerID;
}

function isValueImmutable(value: any): boolean {
    return value == null || typeof value !== "object" || isImmutable(value);
}

function throwIfMutable(value: any, errorMessage: string): void {
    if (!isValueImmutable(value)) {
        throw new Error(errorMessage);
    }
}

function isCollection(maybeCollection: any): boolean {
    return !!(maybeCollection && maybeCollection[IS_ITERABLE_SENTINEL]);
}

function isRecord(maybeRecord: any): boolean {
    return !!(maybeRecord && maybeRecord[IS_RECORD_SENTINEL]);
}

// function ensureModifierValueImmutability(value: ModifierValue): ModifierValue {
//     if (value == null || isImmutable(value)) {
//         return value;
//     }

//     return {
//         Value: ensureImmutability(value.Value),
//         TransitionalValue: ensureImmutability(value.TransitionalValue)
//     };
// }

function ensureImmutability(value: any): any {
    if (value == null || typeof value !== "object" || isImmutable(value)) {
        return value;
    }

    if (Array.isArray(value)) {
        return Immutable.List(value);
    }

    return Immutable.Record(value)();
}
