import { IApiItemOptions } from './ApiItem';
import ApiMember from './ApiMember';
import ApiParameter from './ApiParameter';
/**
 * This class is part of the ApiItem abstract syntax tree. It represents functions that are members of
 * classes, interfaces, or nested type literal expressions. Unlike ApiFunctions, ApiMethods can have
 * access modifiers (public, private, etc.) or be optional, because they are members of a structured type
 *
 * @see ApiFunction for functions that are defined inside of a package
 */
export default class ApiMethod extends ApiMember {
    readonly returnType: string;
    readonly params: ApiParameter[];
    private readonly _isConstructor;
    constructor(options: IApiItemOptions);
    /**
     * Returns true if this member represents a class constructor.
     */
    readonly isConstructor: boolean;
    protected onCompleteInitialization(): void;
}
