import * as ts from 'typescript';
import { IApiItemOptions } from './ApiItem';
import ApiItemContainer from './ApiItemContainer';
/**
  * This class is part of the ApiItem abstract syntax tree.  It represents a class,
  * interface, or type literal expression.
  */
export default class ApiStructuredType extends ApiItemContainer {
    implements?: string;
    extends?: string;
    /**
     * An array of type parameters for generic classes
     * Example: Foo<T, S> => ['T', 'S']
     */
    typeParameters: string[];
    /**
     * The data type of the ApiItem.declarationSymbol.  This is not the exported alias,
     * but rather the original that has complete member and inheritance information.
     */
    protected type: ts.Type;
    private _classLikeDeclaration;
    private _processedMemberNames;
    private _setterNames;
    constructor(options: IApiItemOptions);
    /**
     * @virtual
     */
    visitTypeReferencesForApiItem(): void;
    /**
      * Returns a line of text such as "class MyClass extends MyBaseClass", excluding the
      * curly braces and body.  The name "MyClass" will be the public name seend by external
      * callers, not the declared name of the class; @see ApiItem.name documentation for details.
      */
    getDeclarationLine(): string;
    private _processMember(memberSymbol, memberDeclaration);
}
