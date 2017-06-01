import * as ReactDOM from "react-dom";
import { FieldValue } from "../contracts/field";
import { Modifier, Normalizer } from "../contracts/value";

export const MODIFIER_FUNCTION_NAME = "SimplrFormsCoreModifier";
export const NORMALIZER_FUNCTION_NAME = "SimplrFormsCoreNormalizer";

export function FormatValue(
    components: Array<JSX.Element>,
    defaultModifiers: JSX.Element[],
    value: FieldValue
) {
    return ProcessValue<Modifier, FieldValue>(components, defaultModifiers, value, MODIFIER_FUNCTION_NAME,
        (processor, value) => processor.Format(value));
}

export function ParseValue(
    components: Array<JSX.Element>,
    defaultModifiers: JSX.Element[],
    value: FieldValue
) {
    return ProcessValue<Modifier, FieldValue>(components, defaultModifiers, value, MODIFIER_FUNCTION_NAME,
        (processor, value) => processor.Parse(value));
}

export function NormalizeValue(
    components: Array<JSX.Element>,
    defaultNormalizers: JSX.Element[],
    value: FieldValue
) {
    return ProcessValue<Normalizer, FieldValue>(components, defaultNormalizers, value, NORMALIZER_FUNCTION_NAME,
        (processor, value) => processor.Normalize(value));
}

export function ProcessValue<TProcessor, TProcessedResult>(
    components: Array<JSX.Element>,
    defaultProcessors: JSX.Element[],
    value: FieldValue,
    processorTypeFunctionName: string,
    process: (processor: TProcessor, value: FieldValue) => TProcessedResult): TProcessedResult {
    if (components == null && defaultProcessors.length === 0 ||
        components.length === 0 && defaultProcessors.length === 0) {
        return value;
    }

    // Filter out from components (usually this.props.children) list processors.
    let processors = components.filter(x => IsComponentOfType(x, processorTypeFunctionName));

    if (processors.length === 0) {
        if (defaultProcessors.length === 0) {
            return value;
        }

        processors = defaultProcessors;
    } else {
        let dedupedProcessors: JSX.Element[] = [];

        for (let i = processors.length - 1; i >= 0; i--) {
            const processor = processors[i];
            if (dedupedProcessors.find(x => x.type === processor.type) == null) {
                dedupedProcessors.push(processor);
            }
        }

        processors = dedupedProcessors;
    }

    const renderedProcessors = RenderComponents<TProcessor>(processors);

    for (const processor of renderedProcessors) {
        value = process(processor, value);
    }
    return value;
}

export function IsComponentOfType(component: JSX.Element, requiredType: string) {
    let componentType = component.type as any;
    if (componentType == null && typeof component === "string") {
        console.warn("simplr-forms: text should not be rendered inside fields:", component);
        return false;
    }
    return (componentType[requiredType] != null);
}

export function RenderComponents<TComponent>(components: Array<JSX.Element>): Array<TComponent> {
    const virtualDiv = document.createElement("div");
    const renderedComponents = components.map(component => {
        return ReactDOM.render(component, virtualDiv) as any as TComponent;
    });

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
        valueTypeConfirmation = (v) => typeof v !== requiredTypeOf;
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
