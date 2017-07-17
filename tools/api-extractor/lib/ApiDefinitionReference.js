"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * {@inheritdoc IApiDefinintionReferenceParts}
 */
var ApiDefinitionReference = (function () {
    function ApiDefinitionReference(parts) {
        this.scopeName = parts.scopeName;
        this.packageName = parts.packageName;
        this.exportName = parts.exportName;
        this.memberName = parts.memberName;
    }
    /**
     * Creates an ApiDefinitionReference instance given strings that symbolize the public
     * properties of ApiDefinitionReference.
     */
    ApiDefinitionReference.createFromParts = function (parts) {
        return new ApiDefinitionReference(parts);
    };
    /**
     * Takes an API reference expression of the form '@scopeName/packageName:exportName.memberName'
     * and deconstructs it into an IApiDefinitionReference interface object.
     * @returns the ApiDefinitionReference, or undefined if an error was reported.
     */
    ApiDefinitionReference.createFromString = function (apiReferenceExpr, reportError) {
        if (!apiReferenceExpr || apiReferenceExpr.split(' ').length > 1) {
            reportError('An API item reference must use the notation: "@scopeName/packageName:exportName.memberName"');
            return undefined;
        }
        var apiDefRefParts = {
            scopeName: '',
            packageName: '',
            exportName: '',
            memberName: ''
        };
        // E.g. @microsoft/sp-core-library:Guid.equals
        var parts = apiReferenceExpr.match(ApiDefinitionReference._packageRegEx);
        if (parts) {
            // parts[1] is of the form ‘@microsoft/sp-core-library’ or ‘sp-core-library’
            var scopePackageName = ApiDefinitionReference.parseScopedPackageName(parts[1]);
            apiDefRefParts.scopeName = scopePackageName.scope;
            apiDefRefParts.packageName = scopePackageName.package;
            apiReferenceExpr = parts[2]; // e.g. Guid.equals
        }
        // E.g. Guid.equals
        parts = apiReferenceExpr.match(ApiDefinitionReference._memberRegEx);
        if (parts) {
            apiDefRefParts.exportName = parts[1]; // e.g. Guid, can never be undefined
            apiDefRefParts.memberName = parts[2] ? parts[2] : ''; // e.g. equals
        }
        else {
            // the export name is required
            reportError("The API item reference contains an invalid \"exportName.memberName\""
                + (" expression: \"" + apiReferenceExpr + "\""));
            return undefined;
        }
        if (!apiReferenceExpr.match(ApiDefinitionReference._exportRegEx)) {
            reportError("The API item reference contains invalid characters: \"" + apiReferenceExpr + "\"");
            return undefined;
        }
        return ApiDefinitionReference.createFromParts(apiDefRefParts);
    };
    /**
     * For a scoped NPM package name this separates the scope and package parts.  For example:
     * parseScopedPackageName('@my-scope/myproject') = { scope: '@my-scope', package: 'myproject' }
     * parseScopedPackageName('myproject') = { scope: '', package: 'myproject' }
     */
    ApiDefinitionReference.parseScopedPackageName = function (scopedName) {
        if (scopedName.substr(0, 1) !== '@') {
            return { scope: '', package: scopedName };
        }
        var slashIndex = scopedName.indexOf('/');
        if (slashIndex >= 0) {
            return { scope: scopedName.substr(0, slashIndex), package: scopedName.substr(slashIndex + 1) };
        }
        else {
            throw new Error('Invalid scoped name: ' + scopedName);
        }
    };
    /**
     * Stringifies the ApiDefinitionReferenceOptions up and including the
     * scope and package name.
     *
     * Example output: '@microsoft/Utilities'
     */
    ApiDefinitionReference.prototype.toScopePackageString = function () {
        var result = '';
        if (this.scopeName) {
            result += this.scopeName + "/" + this.packageName;
        }
        else if (this.packageName) {
            result += this.packageName;
        }
        return result;
    };
    /**
     * Stringifies the ApiDefinitionReferenceOptions up and including the
     * scope, package and export name.
     *
     * Example output: '@microsoft/Utilities.Parse'
     */
    ApiDefinitionReference.prototype.toExportString = function () {
        var result = this.toScopePackageString();
        if (result) {
            result += ':';
        }
        return result + ("" + this.exportName);
    };
    /**
     * Stringifies the ApiDefinitionReferenceOptions up and including the
     * scope, package, export and member name.
     *
     * Example output: '@microsoft/Utilities.Parse.parseJsonToString'
     */
    ApiDefinitionReference.prototype.toMemberString = function () {
        return this.toExportString() + ("." + this.memberName);
    };
    /**
     * Splits an API reference expression into two parts, first part is the scopename/packageName and
     * the second part is the exportName.memberName.
     */
    ApiDefinitionReference._packageRegEx = /^([^:]*)\:(.*)$/;
    /**
     * Splits the exportName.memberName into two respective parts.
     */
    ApiDefinitionReference._memberRegEx = /^([^.|:]*)(?:\.(\w+))?$/;
    /**
     * Used to ensure that the export name contains only text characters.
     */
    ApiDefinitionReference._exportRegEx = /^\w+/;
    return ApiDefinitionReference;
}());
exports.default = ApiDefinitionReference;

//# sourceMappingURL=ApiDefinitionReference.js.map
