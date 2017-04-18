import * as ReactDOM from "react-dom";

import * as Contracts from "./contracts";

export async function Validate(components: Array<JSX.Element>, value: any): Promise<void> {
    const validators = components.filter(x => IsComponentOfType(x, Contracts.VALIDATOR));
    const renderedValidators: Contracts.Validator[] = RenderComponents<Contracts.Validator>(validators);

    for (let i = 0; i < renderedValidators.length; i++) {
        let response = renderedValidators[i].Validate(value);

        if (response != null && typeof response === "string") {
            console.warn("ok", response);
            throw response;
        } else {
            await response;
        }
    }
}

export function IsComponentOfType(component: JSX.Element, requiredType: string) {
    let componentType = component.type as any;
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


