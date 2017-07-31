import * as ts from 'typescript';
import Extractor from '../Extractor';
import ApiDocumentation from './ApiDocumentation';
import ApiItemContainer from './ApiItemContainer';
/**
 * Indicates the type of definition represented by a ApiItem object.
 */
export declare enum ApiItemKind {
    /**
      * A TypeScript class.
      */
    Class = 0,
    /**
      * A TypeScript enum.
      */
    Enum = 1,
    /**
      * A TypeScript value on an enum.
      */
    EnumValue = 2,
    /**
      * A TypeScript function.
      */
    Function = 3,
    /**
      * A TypeScript interface.
      */
    Interface = 4,
    /**
      * A TypeScript method.
      */
    Method = 5,
    /**
      * A TypeScript package.
      */
    Package = 6,
    /**
      * A TypeScript parameter.
      */
    Parameter = 7,
    /**
      * A TypeScript property.
      */
    Property = 8,
    /**
      * A TypeScript type literal expression, i.e. which defines an anonymous interface.
      */
    TypeLiteral = 9,
    /**
     * A Typescript class constructor function.
     */
    Constructor = 10,
    /**
     * A Typescript namespace.
     */
    Namespace = 11,
    /**
     * A Typescript BlockScopedVariable.
     */
    ModuleVariable = 12,
}
/**
  * This interface is used to pass options between constructors for ApiItem child classes.
  */
export interface IApiItemOptions {
    /**
     * The associated Extractor object for this ApiItem
     */
    extractor: Extractor;
    /**
     * The declaration node for the main syntax item that this ApiItem is associated with.
     */
    declaration: ts.Declaration;
    /**
     * The semantic information for the declaration.
     */
    declarationSymbol: ts.Symbol;
    /**
     * The declaration node that contains the JSDoc comments for this ApiItem.
     * In most cases this is the same as `declaration`, but for ApiPackage it will be
     * a separate node under the root.
     */
    jsdocNode: ts.Node;
    /**
     * The symbol used to export this ApiItem from the ApiPackage.
     */
    exportSymbol?: ts.Symbol;
}
/**
 * ApiItem is an abstract base that represents TypeScript API definitions such as classes,
 * interfaces, enums, properties, functions, and variables.  Rather than directly using the
 * abstract syntax tree from the TypeScript Compiler API, we use ApiItem to extract a
 * simplified tree which correponds to the major topics for our API documentation.
 */
declare abstract class ApiItem {
    /**
     * Names of API items should only contain letters, numbers and underscores.
     */
    private static _allowedNameRegex;
    /**
     * The name of the definition, as seen by external consumers of the Public API.
     * For example, suppose a class is defined as "export default class MyClass { }"
     * but exported from the package's index.ts like this:
     *
     *    export { default as _MyClass } from './MyClass';
     *
     * In this example, the ApiItem.name would be "_MyClass", i.e. the alias as exported
     * from the top-level ApiPackage, not "MyClass" from the original definition.
     */
    name: string;
    /**
     * The name of an API item should be readable and not contain any special characters.
     */
    supportedName: boolean;
    /**
     * Indicates the type of definition represented by this ApiItem instance.
     */
    kind: ApiItemKind;
    /**
     * A superset of memberItems. Includes memberItems and also other ApiItems that
     * comprise this ApiItem.
     *
     * Ex: if this ApiItem is an ApiFunction, then in it's innerItems would
     * consist of ApiParameters.
     * Ex: if this ApiItem is an ApiMember that is a type literal, then it's
     * innerItems would contain ApiProperties.
     */
    innerItems: ApiItem[];
    /**
     * True if this ApiItem either itself has missing type information or one
     * of it's innerItems is missing type information.
     *
     * Ex: if this ApiItem is an ApiMethod and has no type on the return value, then
     * we consider the ApiItem as 'itself' missing type informations and this property
     * is set to true.
     * Ex: If this ApiItem is an ApiMethod and one of its innerItems is an ApiParameter
     * that has no type specified, then we say an innerItem of this ApiMethod is missing
     * type information and this property is set to true.
     */
    hasIncompleteTypes: boolean;
    /**
     * A list of extractor warnings that were reported using ApiItem.reportWarning().
     * Whereas an "error" will break the build, a "warning" will merely be tracked in
     * the API file produced by ApiFileGenerator.
     */
    warnings: string[];
    /**
     * The declaration node that contains the JSDoc comments for this ApiItem.
     * In most cases this is the same as `declaration`, but for ApiPackage it will be
     * a separate node under the root.
     */
    jsdocNode: ts.Node;
    /**
     * The parsed AEDoc comment for this item.
     */
    documentation: ApiDocumentation;
    /**
     * Indicates that this ApiItem does not have adequate AEDoc comments. If shouldHaveDocumentation()=true,
     * and there is less than 10 characters of summary text in the AEDoc, then this will be set to true and
     * noted in the API file produced by ApiFileGenerator.
     * (The AEDoc text itself is not included in that report, because documentation
     * changes do not require an API review, and thus should not cause a diff for that report.)
     */
    needsDocumentation: boolean;
    /**
     * The Extractor object that acts as the root of the abstract syntax tree that this item belongs to.
     */
    protected extractor: Extractor;
    /**
     * Syntax information from the TypeScript Compiler API, corresponding to the place
     * where this object is originally defined.
     */
    protected declaration: ts.Declaration;
    /**
     * Semantic information from the TypeScript Compiler API, corresponding to the place
     * where this object is originally defined.
     */
    protected declarationSymbol: ts.Symbol;
    /**
     * Semantic information from the TypeScript Compiler API, corresponding to the symbol
     * that is seen by external consumers of the Public API.  For an aliased symbol, this
     * would be the alias that is exported from the top-level package (i.e. ApiPackage).
     */
    protected exportSymbol: ts.Symbol;
    protected typeChecker: ts.TypeChecker;
    /**
     * Syntax information from the TypeScript Compiler API, used to locate the file name
     * and line number when reporting an error for this ApiItem.
     */
    private _errorNode;
    /**
     * The state of this ApiItems references. These references could include \@inheritdoc references
     * or type references.
     */
    private _state;
    private _parentContainer;
    constructor(options: IApiItemOptions);
    /**
     * Called by ApiItemContainer.addMemberItem().  Other code should NOT call this method.
     */
    notifyAddedToContainer(parentContainer: ApiItemContainer): void;
    /**
     * Called after the constructor to finish the analysis.
     */
    visitTypeReferencesForApiItem(): void;
    /**
     * Return the compiler's underlying Declaration object
     * @todo Generally ApiItem classes don't expose ts API objects; we should add
     *       an appropriate member to avoid the need for this.
     */
    getDeclaration(): ts.Declaration;
    /**
     * Return the compiler's underlying Symbol object that contains semantic information about the item
     * @todo Generally ApiItem classes don't expose ts API objects; we should add
     *       an appropriate member to avoid the need for this.
     */
    getDeclarationSymbol(): ts.Symbol;
    /**
     * Whether this APiItem should have documentation or not.  If false, then
     * ApiItem.missingDocumentation will never be set.
     */
    shouldHaveDocumentation(): boolean;
    /**
     * The ApiItemContainer that this member belongs to, or undefined if there is none.
     */
    readonly parentContainer: ApiItemContainer | undefined;
    /**
     * This traverses any type aliases to find the original place where an item was defined.
     * For example, suppose a class is defined as "export default class MyClass { }"
     * but exported from the package's index.ts like this:
     *
     *    export { default as _MyClass } from './MyClass';
     *
     * In this example, calling followAliases() on the _MyClass symbol will return the
     * original definition of MyClass, traversing any intermediary places where the
     * symbol was imported and re-exported.
     */
    protected followAliases(symbol: ts.Symbol): ts.Symbol;
    /**
     * Reports an error through the ApiErrorHandler interface that was registered with the Extractor,
     * adding the filename and line number information for the declaration of this ApiItem.
     */
    protected reportError(message: string): void;
    /**
     * Adds a warning to the ApiItem.warnings list.  These warnings will be emtted in the API file
     * produced by ApiFileGenerator.
     */
    protected reportWarning(message: string): void;
    /**
     * This function assumes all references from this ApiItem have been resolved and we can now safely create
     * the documentation.
     */
    protected onCompleteInitialization(): void;
    /**
     * This function is a second stage that happens after Extractor.analyze() calls ApiItem constructor to build up
     * the abstract syntax tree. In this second stage, we are creating the documentation for each ApiItem.
     *
     * This function makes sure we create the documentation for each ApiItem in the correct order.
     * In the event that a circular dependency occurs, an error is reported. For example, if ApiItemOne has
     * an \@inheritdoc referencing ApiItemTwo, and ApiItemTwo has an \@inheritdoc refercing ApiItemOne then
     * we have a circular dependency and an error will be reported.
     */
    completeInitialization(): void;
    /**
     * A procedure for determining if this ApiItem is missing type
     * information. We first check if the ApiItem itself is missing
     * any type information and if not then we check each of it's
     * innerItems for missing types.
     *
     * Ex: On the ApiItem itself, there may be missing type information
     * on the return value or missing type declaration of itself
     * (const name;).
     * Ex: For each innerItem, there may be an ApiParameter that is missing
     * a type. Or for an ApiMember that is a type literal, there may be an
     * ApiProperty that is missing type information.
     */
    hasAnyIncompleteTypes(): boolean;
    /**
     * This is called by ApiItems to visit the types that appear in an expression.  For example,
     * if a Public API function returns a class that is defined in this package, but not exported,
     * this is a problem. visitTypeReferencesForNode() finds all TypeReference child nodes under the
     * specified node and analyzes each one.
     */
    protected visitTypeReferencesForNode(node: ts.Node): void;
    /**
     * This is a helper for visitTypeReferencesForNode().  It analyzes a single TypeReferenceNode.
     */
    private _analyzeTypeReference(typeReferenceNode);
}
export default ApiItem;
