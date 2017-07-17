/**
 * An API definition reference that is used to locate the documentation of exported
 * API items that may or may not belong to an external package.
 *
 * The format of the API definition reference is:
 * scopeName/packageName:exportName.memberName
 *
 * The following are valid API definition references:
 * \@microsoft/sp-core-library:DisplayMode
 * \@microsoft/sp-core-library:Guid
 * \@microsoft/sp-core-library:Guid.equals
 * es6-collections:Map
 */
export interface IApiDefinintionReferenceParts {
    /**
     * This is an optional property to denote that a package name is scoped under this name.
     * For example, a common case is when having the '@microsoft' scope name in the
     * API definition reference: '\@microsoft/sp-core-library'.
     */
    scopeName: string;
    /**
     * The name of the package that the exportName belongs to.
     */
    packageName: string;
    /**
     * The name of the export API item.
     */
    exportName: string;
    /**
     * The name of the member API item.
     */
    memberName: string;
}
/**
 * A scope and package name are semantic information within an API reference expression.
 * If there is no scope or package, then the corresponding values will be an empty string.
 *
 * Example: '@microsoft/Utilities' -> \{ scope: '@microsoft', package: 'Utilities' \}
 * Example: 'Utilities' -> \{ scope: '', package: 'Utilities' \}
 */
export interface IScopedPackageName {
    /**
     * The scope name of an API reference expression.
     */
    scope: string;
    /**
     * The package name of an API reference expression.
     */
    package: string;
}
/**
 * {@inheritdoc IApiDefinintionReferenceParts}
 */
export default class ApiDefinitionReference {
    /**
     * Splits an API reference expression into two parts, first part is the scopename/packageName and
     * the second part is the exportName.memberName.
     */
    private static _packageRegEx;
    /**
     * Splits the exportName.memberName into two respective parts.
     */
    private static _memberRegEx;
    /**
     * Used to ensure that the export name contains only text characters.
     */
    private static _exportRegEx;
    /**
     * {@inheritdoc IApiDefinintionReferenceParts.scopeName}
     */
    scopeName: string;
    /**
     * {@inheritdoc IApiDefinintionReferenceParts.packageName}
     */
    packageName: string;
    /**
     * {@inheritdoc IApiDefinintionReferenceParts.exportName}
     */
    exportName: string;
    /**
     * {@inheritdoc IApiDefinintionReferenceParts.memberName}
     */
    memberName: string;
    /**
     * Creates an ApiDefinitionReference instance given strings that symbolize the public
     * properties of ApiDefinitionReference.
     */
    static createFromParts(parts: IApiDefinintionReferenceParts): ApiDefinitionReference;
    /**
     * Takes an API reference expression of the form '@scopeName/packageName:exportName.memberName'
     * and deconstructs it into an IApiDefinitionReference interface object.
     * @returns the ApiDefinitionReference, or undefined if an error was reported.
     */
    static createFromString(apiReferenceExpr: string, reportError: (message: string) => void): ApiDefinitionReference | undefined;
    /**
     * For a scoped NPM package name this separates the scope and package parts.  For example:
     * parseScopedPackageName('@my-scope/myproject') = { scope: '@my-scope', package: 'myproject' }
     * parseScopedPackageName('myproject') = { scope: '', package: 'myproject' }
     */
    static parseScopedPackageName(scopedName: string): IScopedPackageName;
    /**
     * Stringifies the ApiDefinitionReferenceOptions up and including the
     * scope and package name.
     *
     * Example output: '@microsoft/Utilities'
     */
    toScopePackageString(): string;
    /**
     * Stringifies the ApiDefinitionReferenceOptions up and including the
     * scope, package and export name.
     *
     * Example output: '@microsoft/Utilities.Parse'
     */
    toExportString(): string;
    /**
     * Stringifies the ApiDefinitionReferenceOptions up and including the
     * scope, package, export and member name.
     *
     * Example output: '@microsoft/Utilities.Parse.parseJsonToString'
     */
    toMemberString(): string;
    private constructor();
}
