import { IApiItemOptions } from './ApiItem';
import ApiMember from './ApiMember';
/**
 * This class is part of the ApiItem abstract syntax tree. It represents variables
 * that are exported by an ApiNamespace (or conceivably an ApiPackage in the future).
 * The variables have a name, a type, and an initializer. The ApiNamespace implementation
 * currently requires them to use a primitive type and be declared as "const".
 */
declare class ApiModuleVariable extends ApiMember {
    type: string;
    name: string;
    value: string;
    constructor(options: IApiItemOptions);
}
export default ApiModuleVariable;
