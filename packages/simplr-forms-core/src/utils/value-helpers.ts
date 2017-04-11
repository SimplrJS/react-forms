import * as ReactDOM from "react-dom";
import { FieldValue } from "../contracts/field";
import { Modifier, Normalizer } from "../contracts/value";

export const MODIFIER_FUNCTION_NAME = "SimplrFormsCoreModifier";
export const NORMALIZER_FUNCTION_NAME = "SimplrFormsCoreNormalizer";

export function FormatValue(components: Array<JSX.Element>, value: FieldValue) {
    return ProcessValue<Modifier>(components, value, MODIFIER_FUNCTION_NAME,
        (processor, value) => processor.Format(value));
}

export function ParseValue(components: Array<JSX.Element>, value: FieldValue) {
    return ProcessValue<Modifier>(components, value, MODIFIER_FUNCTION_NAME,
        (processor, value) => processor.Parse(value));
}

export function NormalizeValue(components: Array<JSX.Element>, value: FieldValue) {
    return ProcessValue<Normalizer>(components, value, MODIFIER_FUNCTION_NAME,
        (processor, value) => processor.Normalize(value));
}

export function ProcessValue<TProcessor>(
    components: Array<JSX.Element>,
    value: FieldValue,
    processorTypeFunctionName: string,
    process: (processor: TProcessor, value: FieldValue) => FieldValue) {
    if (components == null || components.length === 0) {
        return value;
    }

    const modifiers = components.filter(x => IsComponentOfType(x, processorTypeFunctionName));

    const renderedModifiers = RenderComponents<TProcessor>(modifiers);

    for (const modifier of renderedModifiers) {
        value = process(modifier, value);
    }
    return value;
}

export function IsComponentOfType(component: JSX.Element, requiredType: string) {
    let componentType = component.type as any;
    return (componentType[requiredType] != null);
}

export function RenderComponents<TComponent>(components: Array<JSX.Element>): Array<TComponent> {
    const virtualDiv = document.createElement("div");
    const renderedComponents = components.map(component => ReactDOM.render(component, virtualDiv) as any as TComponent);

    ReactDOM.unmountComponentAtNode(virtualDiv);
    return renderedComponents;
}
