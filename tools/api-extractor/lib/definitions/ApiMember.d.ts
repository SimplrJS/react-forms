import ApiItem, { IApiItemOptions } from './ApiItem';
import ApiStructuredType from './ApiStructuredType';
export declare enum AccessModifier {
    Private = 0,
    Protected = 1,
    Public = 2,
}
/**
 * This class is part of the ApiItem abstract syntax tree.  It represents syntax following
 * these types of patterns:
 *
 * - "someName: SomeTypeName;"
 * - "someName?: SomeTypeName;"
 * - "someName: { someOtherName: SomeOtherTypeName }", i.e. involving a type literal expression
 * - "someFunction(): void;"
 *
 * ApiMember is used to represent members of classes, interfaces, and nested type literal expressions.
 */
export default class ApiMember extends ApiItem {
    /**
     * True if the member is an optional field value, indicated by a question mark ("?") after the name
     */
    accessModifier: AccessModifier;
    isOptional: boolean;
    isStatic: boolean;
    /**
     * The type of the member item, if specified as a type literal expression.  Otherwise,
     * this field is undefined.
     */
    typeLiteral: ApiStructuredType;
    constructor(options: IApiItemOptions);
    /**
     * @virtual
     */
    visitTypeReferencesForApiItem(): void;
    /**
     * Returns a text string such as "someName?: SomeTypeName;", or in the case of a type
     * literal expression, returns a text string such as "someName?:".
     */
    getDeclarationLine(property?: {
        type: string;
        readonly: boolean;
    }): string;
}
