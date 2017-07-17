"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var fsx = require("fs-extra");
var os = require("os");
var path = require("path");
var ApiItemContainer_1 = require("./definitions/ApiItemContainer");
var ResolvedApiItem_1 = require("./ResolvedApiItem");
var JsonFile_1 = require("./JsonFile");
/**
 * A loader for locating the IDocItem associated with a given project and API item, or
 * for locating an ApiItem  locally.
 * No processing on the IDocItem orApiItem  should be done in this class, this class is only
 * concerned with communicating state.
 * The IDocItem can then be used to enforce correct API usage, like enforcing internal.
 * To use DocItemLoader: provide a projectFolder to construct a instance of the DocItemLoader,
 * then use DocItemLoader.getItem to retrieve the IDocItem of a particular API item.
 */
var DocItemLoader = (function () {
    /**
     * The projectFolder is the top-level folder containing package.json for a project
     * that we are compiling.
     */
    function DocItemLoader(projectFolder) {
        if (!fsx.existsSync(path.join(projectFolder, 'package.json'))) {
            throw new Error("An NPM project was not found in the specified folder: " + projectFolder);
        }
        this._projectFolder = projectFolder;
        this._cache = new Map();
    }
    /**
     * {@inheritdoc IReferenceResolver.resolve}
     */
    DocItemLoader.prototype.resolve = function (apiDefinitionRef, apiPackage, warnings) {
        // We determine if an 'apiDfefinitionRef' is local if it has no package name or if the scoped
        // package name is equal to the current package's scoped package name.
        if (!apiDefinitionRef.packageName || apiDefinitionRef.toScopePackageString() === apiPackage.name) {
            // Resolution for local references
            return this.resolveLocalReferences(apiDefinitionRef, apiPackage, warnings);
        }
        else {
            // If there was no resolved apiItem then try loading from JSON
            return this.resolveJsonReferences(apiDefinitionRef, warnings);
        }
    };
    /**
     * Resolution of API definition references in the scenario that the reference given indicates
     * that we should search within the current ApiPackage to resolve.
     * No processing on the ApiItem should be done here, this class is only concerned
     * with communicating state.
     */
    DocItemLoader.prototype.resolveLocalReferences = function (apiDefinitionRef, apiPackage, warnings) {
        var apiItem = apiPackage.getMemberItem(apiDefinitionRef.exportName);
        // Check if export name was not found
        if (!apiItem) {
            warnings.push("Unable to find referenced export \"" + apiDefinitionRef.toExportString() + "\"");
            return undefined;
        }
        // If memberName exists then check for the existense of the name
        if (apiDefinitionRef.memberName) {
            if (apiItem instanceof ApiItemContainer_1.default) {
                var apiItemContainer = apiItem;
                // get() returns undefined if there is no match
                apiItem = apiItemContainer.getMemberItem(apiDefinitionRef.memberName);
            }
            else {
                // There are no other instances of apiItem that has members,
                // thus there must be a mistake with the apiDefinitionRef.
                apiItem = undefined;
            }
        }
        if (!apiItem) {
            // If we are here, we can be sure there was a problem with the memberName.
            // memberName was not found, apiDefinitionRef is invalid
            warnings.push("Unable to find referenced member \"" + apiDefinitionRef.toMemberString() + "\"");
            return undefined;
        }
        return ResolvedApiItem_1.default.createFromApiItem(apiItem);
    };
    /**
     * Resolution of API definition references in the scenario that the reference given indicates
     * that we should search outside of this ApiPackage and instead search within the JSON API file
     * that is associated with the apiDefinitionRef.
     */
    DocItemLoader.prototype.resolveJsonReferences = function (apiDefinitionRef, warnings) {
        // Check if package can be not found
        var docPackage = this.getPackage(apiDefinitionRef);
        if (!docPackage) {
            // package not found in node_modules
            warnings.push("Unable to find a documentation file (\"" + apiDefinitionRef.packageName + ".api.json\")" +
                ' for the referenced package');
            return undefined;
        }
        // found JSON package, now ensure export name is there
        // hasOwnProperty() not needed for JJU objects
        if (!(apiDefinitionRef.exportName in docPackage.exports)) {
            warnings.push("Unable to find referenced export \"" + apiDefinitionRef.toExportString() + "\"\"");
            return undefined;
        }
        var docItem = docPackage.exports[apiDefinitionRef.exportName];
        // If memberName exists then check for the existense of the name
        if (apiDefinitionRef.memberName) {
            var member = undefined;
            switch (docItem.kind) {
                case 'class':
                    // hasOwnProperty() not needed for JJU objects
                    member = apiDefinitionRef.memberName in docItem.members ?
                        docItem.members[apiDefinitionRef.memberName] : undefined;
                    break;
                case 'interface':
                    // hasOwnProperty() not needed for JJU objects
                    member = apiDefinitionRef.memberName in docItem.members ?
                        docItem.members[apiDefinitionRef.memberName] : undefined;
                    break;
                case 'enum':
                    // hasOwnProperty() not needed for JJU objects
                    member = apiDefinitionRef.memberName in docItem.values ?
                        docItem.values[apiDefinitionRef.memberName] : undefined;
                    break;
                default:
                    // Any other docItem.kind does not have a 'members' property
                    break;
            }
            if (member) {
                docItem = member;
            }
            else {
                // member name was not found, apiDefinitionRef is invalid
                warnings.push("Unable to find referenced member \"" + apiDefinitionRef.toMemberString() + "\"");
                return undefined;
            }
        }
        return ResolvedApiItem_1.default.createFromJson(docItem);
    };
    /**
     * Attempts to locate and load the IDocPackage object from the project folder's
     * node modules. If the package already exists in the cache, nothing is done.
     *
     * @param apiDefinitionRef - interface with propropties pertaining to the API definition reference
     */
    DocItemLoader.prototype.getPackage = function (apiDefinitionRef) {
        var cachePackageName = '';
        // We concatenate the scopeName and packageName in case there are packageName conflicts
        if (apiDefinitionRef.scopeName) {
            cachePackageName = apiDefinitionRef.scopeName + "/" + apiDefinitionRef.packageName;
        }
        else {
            cachePackageName = apiDefinitionRef.packageName;
        }
        // Check if package exists in cache
        if (this._cache.has(cachePackageName)) {
            return this._cache.get(cachePackageName);
        }
        // Doesn't exist in cache, attempt to load the json file
        var apiJsonFilePath = path.join(this._projectFolder, 'node_modules', apiDefinitionRef.scopeName, apiDefinitionRef.packageName, "dist/" + apiDefinitionRef.packageName + ".api.json");
        if (!fsx.existsSync(path.join(apiJsonFilePath))) {
            // Error should be handled by the caller
            return undefined;
        }
        return this.loadPackageIntoCache(apiJsonFilePath, cachePackageName);
    };
    /**
     * Loads the API documentation json file and validates that it conforms to our schema. If it does,
     * then the json file is saved in the cache and returned.
     */
    DocItemLoader.prototype.loadPackageIntoCache = function (apiJsonFilePath, cachePackageName) {
        var apiPackage = JsonFile_1.default.loadJsonFile(apiJsonFilePath);
        // Validate that the output conforms to our JSON schema
        var apiJsonSchema = JsonFile_1.default.loadJsonFile(path.join(__dirname, './schemas/api-json-schema.json'));
        JsonFile_1.default.validateSchema(apiPackage, apiJsonSchema, function (errorDetail) {
            var errorMessage = "ApiJsonGenerator validation error - output does not conform to api-json-schema.json:" + os.EOL
                + errorDetail;
            console.log(os.EOL + 'ERROR: ' + errorMessage + os.EOL + os.EOL);
            throw new Error(errorMessage);
        });
        this._cache.set(cachePackageName, apiPackage);
        return apiPackage;
    };
    return DocItemLoader;
}());
exports.default = DocItemLoader;

//# sourceMappingURL=DocItemLoader.js.map
