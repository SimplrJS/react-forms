export declare function Validate(components: Array<JSX.Element>, value: any): Promise<void>;
export declare function IsComponentOfType(component: JSX.Element, requiredType: string): boolean;
export declare function RenderComponents<TComponent>(components: Array<JSX.Element>): Array<TComponent>;
