"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-bitwise */
/* tslint:disable:no-constant-condition */
var ts = require("typescript");
var ApiDocumentation_1 = require("./ApiDocumentation");
var TypeScriptHelpers_1 = require("../TypeScriptHelpers");
var DocElementParser_1 = require("../DocElementParser");
var ApiDefinitionReference_1 = require("../ApiDefinitionReference");
/**
 * Indicates the type of definition represented by a ApiItem object.
 */
var ApiItemKind;
(function (ApiItemKind) {
    /**
      * A TypeScript class.
      */
    ApiItemKind[ApiItemKind["Class"] = 0] = "Class";
    /**
      * A TypeScript enum.
      */
    ApiItemKind[ApiItemKind["Enum"] = 1] = "Enum";
    /**
      * A TypeScript value on an enum.
      */
    ApiItemKind[ApiItemKind["EnumValue"] = 2] = "EnumValue";
    /**
      * A TypeScript function.
      */
    ApiItemKind[ApiItemKind["Function"] = 3] = "Function";
    /**
      * A TypeScript interface.
      */
    ApiItemKind[ApiItemKind["Interface"] = 4] = "Interface";
    /**
      * A TypeScript method.
      */
    ApiItemKind[ApiItemKind["Method"] = 5] = "Method";
    /**
      * A TypeScript package.
      */
    ApiItemKind[ApiItemKind["Package"] = 6] = "Package";
    /**
      * A TypeScript parameter.
      */
    ApiItemKind[ApiItemKind["Parameter"] = 7] = "Parameter";
    /**
      * A TypeScript property.
      */
    ApiItemKind[ApiItemKind["Property"] = 8] = "Property";
    /**
      * A TypeScript type literal expression, i.e. which defines an anonymous interface.
      */
    ApiItemKind[ApiItemKind["TypeLiteral"] = 9] = "TypeLiteral";
    /**
     * A Typescript class constructor function.
     */
    ApiItemKind[ApiItemKind["Constructor"] = 10] = "Constructor";
    /**
     * A Typescript namespace.
     */
    ApiItemKind[ApiItemKind["Namespace"] = 11] = "Namespace";
    /**
     * A Typescript BlockScopedVariable.
     */
    ApiItemKind[ApiItemKind["ModuleVariable"] = 12] = "ModuleVariable";
})(ApiItemKind = exports.ApiItemKind || (exports.ApiItemKind = {}));
/**
 * The state of completing the ApiItem's doc comment references inside a recursive call to ApiItem.resolveReferences().
 */
var InitializationState;
(function (InitializationState) {
    /**
     * The references of this ApiItem have not begun to be completed.
     */
    InitializationState[InitializationState["Incomplete"] = 0] = "Incomplete";
    /**
     * The refernces of this ApiItem are in the process of being completed.
     * If we encounter this state again during completing, a circular dependency
     * has occured.
     */
    InitializationState[InitializationState["Completing"] = 1] = "Completing";
    /**
     * The references of this ApiItem have all been completed and the documentation can
     * now safely be created.
     */
    InitializationState[InitializationState["Completed"] = 2] = "Completed";
})(InitializationState || (InitializationState = {}));
// Names of NPM scopes that contain packages that provide typings for the real package.
// The TypeScript compiler's typings design doesn't seem to handle scoped NPM packages,
// so the transformation will always be simple, like this:
// "@types/example" --> "example"
// NOT like this:
// "@types/@contoso/example" --> "@contoso/example"
// "@contosotypes/example" --> "@contoso/example"
// Eventually this constant should be provided by the gulp task that invokes the compiler.
var typingsScopeNames = ['@types'];
/**
 * ApiItem is an abstract base that represents TypeScript API definitions such as classes,
 * interfaces, enums, properties, functions, and variables.  Rather than directly using the
 * abstract syntax tree from the TypeScript Compiler API, we use ApiItem to extract a
 * simplified tree which correponds to the major topics for our API documentation.
 */
var ApiItem = (function () {
    function ApiItem(options) {
        /**
         * A superset of memberItems. Includes memberItems and also other ApiItems that
         * comprise this ApiItem.
         *
         * Ex: if this ApiItem is an ApiFunction, then in it's innerItems would
         * consist of ApiParameters.
         * Ex: if this ApiItem is an ApiMember that is a type literal, then it's
         * innerItems would contain ApiProperties.
         */
        this.innerItems = [];
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
        this.hasIncompleteTypes = false;
        this.reportError = this.reportError.bind(this);
        this.jsdocNode = options.jsdocNode;
        this.declaration = options.declaration;
        this._errorNode = options.declaration;
        this._state = InitializationState.Incomplete;
        this.warnings = [];
        this.extractor = options.extractor;
        this.typeChecker = this.extractor.typeChecker;
        this.declarationSymbol = options.declarationSymbol;
        this.exportSymbol = options.exportSymbol || this.declarationSymbol;
        this.name = this.exportSymbol.name || '???';
        var originalJsdoc = '';
        if (this.jsdocNode) {
            originalJsdoc = TypeScriptHelpers_1.default.getJsdocComments(this.jsdocNode, this.reportError);
        }
        this.documentation = new ApiDocumentation_1.default(originalJsdoc, this.extractor.docItemLoader, this.extractor, this.reportError, this.warnings);
    }
    /**
     * Called by ApiItemContainer.addMemberItem().  Other code should NOT call this method.
     */
    ApiItem.prototype.notifyAddedToContainer = function (parentContainer) {
        if (this._parentContainer) {
            // This would indicate a program bug
            throw new Error('The API item has already been added to another container: ' + this._parentContainer.name);
        }
        this._parentContainer = parentContainer;
    };
    /**
     * Called after the constructor to finish the analysis.
     */
    ApiItem.prototype.visitTypeReferencesForApiItem = function () {
        // (virtual)
    };
    /**
     * Return the compiler's underlying Declaration object
     * @todo Generally ApiItem classes don't expose ts API objects; we should add
     *       an appropriate member to avoid the need for this.
     */
    ApiItem.prototype.getDeclaration = function () {
        return this.declaration;
    };
    /**
     * Return the compiler's underlying Symbol object that contains semantic information about the item
     * @todo Generally ApiItem classes don't expose ts API objects; we should add
     *       an appropriate member to avoid the need for this.
     */
    ApiItem.prototype.getDeclarationSymbol = function () {
        return this.declarationSymbol;
    };
    /**
     * Whether this APiItem should have documentation or not.  If false, then
     * ApiItem.missingDocumentation will never be set.
     */
    ApiItem.prototype.shouldHaveDocumentation = function () {
        return true;
    };
    Object.defineProperty(ApiItem.prototype, "parentContainer", {
        /**
         * The ApiItemContainer that this member belongs to, or undefined if there is none.
         */
        get: function () {
            return this._parentContainer;
        },
        enumerable: true,
        configurable: true
    });
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
    ApiItem.prototype.followAliases = function (symbol) {
        var current = symbol;
        while (true) {
            if (!(current.flags & ts.SymbolFlags.Alias)) {
                break;
            }
            var currentAlias = this.typeChecker.getAliasedSymbol(current);
            if (!currentAlias || currentAlias === current) {
                break;
            }
            current = currentAlias;
        }
        return current;
    };
    /**
     * Reports an error through the ApiErrorHandler interface that was registered with the Extractor,
     * adding the filename and line number information for the declaration of this ApiItem.
     */
    ApiItem.prototype.reportError = function (message) {
        this.extractor.reportError(message, this._errorNode.getSourceFile(), this._errorNode.getStart());
    };
    /**
     * Adds a warning to the ApiItem.warnings list.  These warnings will be emtted in the API file
     * produced by ApiFileGenerator.
     */
    ApiItem.prototype.reportWarning = function (message) {
        this.warnings.push(message);
    };
    /**
     * This function assumes all references from this ApiItem have been resolved and we can now safely create
     * the documentation.
     */
    ApiItem.prototype.onCompleteInitialization = function () {
        this.documentation.completeInitialization(this.warnings);
        // TODO: this.visitTypeReferencesForNode(this);
        var summaryTextCondensed = DocElementParser_1.default.getAsText(this.documentation.summary, this.reportError).replace(/\s\s/g, ' ');
        this.needsDocumentation = this.shouldHaveDocumentation() && summaryTextCondensed.length <= 10;
        this.supportedName = (this.kind === ApiItemKind.Package) || ApiItem._allowedNameRegex.test(this.name);
        if (!this.supportedName) {
            this.warnings.push("The name \"" + this.name + "\" contains unsupported characters; " +
                'API names should use only letters, numbers, and underscores');
        }
        if (this.kind === ApiItemKind.Package) {
            if (this.documentation.releaseTag !== ApiDocumentation_1.ReleaseTag.None) {
                var tag = '@' + ApiDocumentation_1.ReleaseTag[this.documentation.releaseTag].toLowerCase();
                this.reportError("The " + tag + " tag is not allowed on the package, which is always considered to be @public");
            }
        }
        if (this.documentation.preapproved) {
            if (!(this.getDeclaration().kind & (ts.SyntaxKind.InterfaceDeclaration | ts.SyntaxKind.ClassDeclaration))) {
                this.reportError('The @preapproved tag may only be applied to classes and interfaces');
                this.documentation.preapproved = false;
            }
        }
        if (this.documentation.isDocInheritedDeprecated && this.documentation.deprecatedMessage.length === 0) {
            this.reportError('The @inheritdoc target has been marked as @deprecated.  ' +
                'Add a @deprecated message here, or else remove the @inheritdoc relationship.');
        }
        if (this.name.substr(0, 1) === '_') {
            if (this.documentation.releaseTag !== ApiDocumentation_1.ReleaseTag.Internal
                && this.documentation.releaseTag !== ApiDocumentation_1.ReleaseTag.None) {
                this.reportWarning('The underscore prefix ("_") should only be used with definitions'
                    + ' that are explicitly marked as @internal');
            }
        }
        else {
            if (this.documentation.releaseTag === ApiDocumentation_1.ReleaseTag.Internal) {
                this.reportWarning('Because this definition is explicitly marked as @internal, an underscore prefix ("_")'
                    + ' should be added to its name');
            }
        }
        // Is it missing a release tag?
        if (this.documentation.releaseTag === ApiDocumentation_1.ReleaseTag.None) {
            // Only warn about top-level exports
            if (this.parentContainer && this.parentContainer.kind === ApiItemKind.Package) {
                // Don't warn about items that failed to parse.
                if (!this.documentation.failedToParse) {
                    // If there is no release tag, and this is a top-level export of the package, then
                    // report an error
                    this.reportError("A release tag (@alpha, @beta, @public, @internal) must be specified"
                        + (" for " + this.name));
                }
            }
        }
    };
    /**
     * This function is a second stage that happens after Extractor.analyze() calls ApiItem constructor to build up
     * the abstract syntax tree. In this second stage, we are creating the documentation for each ApiItem.
     *
     * This function makes sure we create the documentation for each ApiItem in the correct order.
     * In the event that a circular dependency occurs, an error is reported. For example, if ApiItemOne has
     * an \@inheritdoc referencing ApiItemTwo, and ApiItemTwo has an \@inheritdoc refercing ApiItemOne then
     * we have a circular dependency and an error will be reported.
     */
    ApiItem.prototype.completeInitialization = function () {
        switch (this._state) {
            case InitializationState.Completed:
                return;
            case InitializationState.Incomplete:
                this._state = InitializationState.Completing;
                this.onCompleteInitialization();
                this._state = InitializationState.Completed;
                for (var _i = 0, _a = this.innerItems; _i < _a.length; _i++) {
                    var innerItem = _a[_i];
                    innerItem.completeInitialization();
                }
                return;
            case InitializationState.Completing:
                this.reportError('circular reference');
                return;
            default:
                throw new Error('ApiItem state is invalid');
        }
    };
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
    ApiItem.prototype.hasAnyIncompleteTypes = function () {
        if (this.hasIncompleteTypes) {
            return true;
        }
        for (var _i = 0, _a = this.innerItems; _i < _a.length; _i++) {
            var innerItem = _a[_i];
            if (innerItem.hasIncompleteTypes) {
                return true;
            }
        }
        return false;
    };
    /**
     * This is called by ApiItems to visit the types that appear in an expression.  For example,
     * if a Public API function returns a class that is defined in this package, but not exported,
     * this is a problem. visitTypeReferencesForNode() finds all TypeReference child nodes under the
     * specified node and analyzes each one.
     */
    ApiItem.prototype.visitTypeReferencesForNode = function (node) {
        if (node.kind === ts.SyntaxKind.Block ||
            (node.kind >= ts.SyntaxKind.JSDocTypeExpression && node.kind <= ts.SyntaxKind.NeverKeyword)) {
            // Don't traverse into code blocks or JSDoc items; we only care about the function signature
            return;
        }
        if (node.kind === ts.SyntaxKind.TypeReference) {
            var typeReference = node;
            this._analyzeTypeReference(typeReference);
        }
        // Recurse the tree
        for (var _i = 0, _a = node.getChildren(); _i < _a.length; _i++) {
            var childNode = _a[_i];
            this.visitTypeReferencesForNode(childNode);
        }
    };
    /**
     * This is a helper for visitTypeReferencesForNode().  It analyzes a single TypeReferenceNode.
     */
    ApiItem.prototype._analyzeTypeReference = function (typeReferenceNode) {
        var symbol = this.extractor.typeChecker.getSymbolAtLocation(typeReferenceNode.typeName);
        if (!symbol) {
            // Is this bad?
            return;
        }
        if (symbol.flags & ts.SymbolFlags.TypeParameter) {
            // Don't analyze e.g. "T" in "Set<T>"
            return;
        }
        // Follow the aliases all the way to the ending SourceFile
        var currentSymbol = this.followAliases(symbol);
        if (!currentSymbol.declarations || !currentSymbol.declarations.length) {
            // This is a degenerate case that happens sometimes
            return;
        }
        var sourceFile = currentSymbol.declarations[0].getSourceFile();
        // Walk upwards from that directory until you find a directory containing package.json,
        // this is where the referenced type is located.
        // Example: "c:\users\<username>\sp-client\spfx-core\sp-core-library"
        var typeReferencePackagePath = this.extractor.packageJsonLookup
            .tryFindPackagePathUpwards(sourceFile.fileName);
        // Example: "@microsoft/sp-core-library"
        var typeReferencePackageName = '';
        // If we can not find a package path, we consider the type to be part of the current project's package.
        // One case where this happens is when looking for a type that is a symlink
        if (!typeReferencePackagePath) {
            typeReferencePackageName = this.extractor.package.name;
        }
        else {
            typeReferencePackageName = this.extractor.packageJsonLookup
                .readPackageName(typeReferencePackagePath);
            typingsScopeNames.every(function (typingScopeName) {
                if (typeReferencePackageName.indexOf(typingScopeName) > -1) {
                    typeReferencePackageName = typeReferencePackageName.replace(typingScopeName + '/', '');
                    // returning true breaks the every loop
                    return true;
                }
            });
        }
        // Read the name/version from package.json -- that tells you what package the symbol
        // belongs to. If it is your own ApiPackage.name/version, then you know it's a local symbol.
        var currentPackageName = this.extractor.package.name;
        var typeName = typeReferenceNode.typeName.getText();
        if (!typeReferencePackagePath || typeReferencePackageName === currentPackageName) {
            // The type is defined in this project.  Did the person remember to export it?
            var exportedLocalName = this.extractor.package.tryGetExportedSymbolName(currentSymbol);
            if (exportedLocalName) {
                // [CASE 1] Local/Exported
                // Yes; the type is properly exported.
                // TODO: In the future, here we can check for issues such as a @public type
                // referencing an @internal type.
                return;
            }
            else {
                // [CASE 2] Local/Unexported
                // No; issue a warning
                this.reportWarning("The type \"" + typeName + "\" needs to be exported by the package"
                    + " (e.g. added to index.ts)");
                return;
            }
        }
        // External
        // Attempt to load from docItemLoader
        var scopedPackageName = ApiDefinitionReference_1.default.parseScopedPackageName(typeReferencePackageName);
        var apiDefinitionRefParts = {
            scopeName: scopedPackageName.scope,
            packageName: scopedPackageName.package,
            exportName: '',
            memberName: ''
        };
        // the currentSymbol.name is the name of an export, if it contains a '.' then the substring
        // after the period is the member name
        if (currentSymbol.name.indexOf('.') > -1) {
            var exportMemberName = currentSymbol.name.split('.');
            apiDefinitionRefParts.exportName = exportMemberName.pop();
            apiDefinitionRefParts.memberName = exportMemberName.pop();
        }
        else {
            apiDefinitionRefParts.exportName = currentSymbol.name;
        }
        var apiDefinitionRef = ApiDefinitionReference_1.default.createFromParts(apiDefinitionRefParts);
        // Attempt to resolve the type by checking the node modules
        var referenceResolutionWarnings = [];
        var resolvedApiItem = this.extractor.docItemLoader.resolveJsonReferences(apiDefinitionRef, referenceResolutionWarnings);
        if (resolvedApiItem) {
            // [CASE 3] External/Resolved
            // This is a reference to a type from an external package, and it was resolved.
            return;
        }
        else {
            // [CASE 4] External/Unresolved
            // For cases when we can't find the external package, we are going to write a report
            // at the bottom of the *api.ts file. We do this because we do not yet support references
            // to items like react:Component.
            // For now we are going to silently ignore these errors.
            return;
        }
    };
    /**
     * Names of API items should only contain letters, numbers and underscores.
     */
    ApiItem._allowedNameRegex = /^[a-zA-Z_]+[a-zA-Z_0-9]*$/;
    return ApiItem;
}());
exports.default = ApiItem;

//# sourceMappingURL=ApiItem.js.map
