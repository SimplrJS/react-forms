"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var fsx = require("fs-extra");
var path = require("path");
var ApiPackage_1 = require("./definitions/ApiPackage");
var DocItemLoader_1 = require("./DocItemLoader");
var PackageJsonLookup_1 = require("./PackageJsonLookup");
/**
 * The main entry point for the "api-extractor" utility.  The Analyzer object invokes the
 * TypeScript Compiler API to analyze a project, and constructs the ApiItem
 * abstract syntax tree.
 *
 * @public
 */
var Extractor = (function () {
    function Extractor(options) {
        this._compilerOptions = options.compilerOptions;
        this.docItemLoader = new DocItemLoader_1.default(options.compilerOptions.rootDir);
        this.packageJsonLookup = new PackageJsonLookup_1.default();
        this.errorHandler = options.errorHandler || Extractor.defaultErrorHandler;
    }
    /**
     * The default implementation of ApiErrorHandler, which merely writes to console.log().
     */
    Extractor.defaultErrorHandler = function (message, fileName, lineNumber) {
        console.log("ERROR: [" + fileName + ":" + lineNumber + "] " + message);
    };
    Object.defineProperty(Extractor.prototype, "packageFolder", {
        /**
         * Getter for the package folder that Extractor is analyzing.
         */
        get: function () {
            return this._packageFolder;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Analyzes the specified project.
     */
    Extractor.prototype.analyze = function (options) {
        var rootFiles = [options.entryPointFile].concat(options.otherFiles || []);
        var program = ts.createProgram(rootFiles, this._compilerOptions);
        // This runs a full type analysis, and then augments the Abstract Syntax Tree (i.e. declarations)
        // with semantic information (i.e. symbols).  The "diagnostics" are a subset of the everyday
        // compile errors that would result from a full compilation.
        for (var _i = 0, _a = program.getSemanticDiagnostics(); _i < _a.length; _i++) {
            var diagnostic = _a[_i];
            this.reportError('TypeScript: ' + diagnostic.messageText, diagnostic.file, diagnostic.start);
        }
        this.typeChecker = program.getTypeChecker();
        var rootFile = program.getSourceFile(options.entryPointFile);
        if (!rootFile) {
            throw new Error('Unable to load file: ' + options.entryPointFile);
        }
        // Assign _packageFolder by probing upwards from entryPointFile until we find a package.json
        var currentPath = path.resolve(options.entryPointFile);
        // This is guaranteed to succeed since we do check prior to this point
        this._packageFolder = this.packageJsonLookup.tryFindPackagePathUpwards(currentPath);
        this.package = new ApiPackage_1.default(this, rootFile); // construct members
        this.package.completeInitialization(); // creates ApiDocumentation
        this.package.visitTypeReferencesForApiItem();
    };
    /**
     * Reports an error message to the registered ApiErrorHandler.
     */
    Extractor.prototype.reportError = function (message, sourceFile, start) {
        var lineNumber = sourceFile.getLineAndCharacterOfPosition(start).line;
        this.errorHandler(message, sourceFile.fileName, lineNumber);
    };
    /**
     * Scans for external package api files and loads them into the docItemLoader member before
     * any API analysis begins.
     *
     * @param externalJsonCollectionPath - an absolute path to to the folder that contains all the external
     * api json files.
     * Ex: if externalJsonPath is './resources', then in that folder
     * are 'es6-collections.api.json', etc.
     */
    Extractor.prototype.loadExternalPackages = function (externalJsonCollectionPath) {
        var _this = this;
        if (!externalJsonCollectionPath) {
            return;
        }
        var files = fsx.readdirSync(externalJsonCollectionPath);
        files.forEach(function (file) {
            if (path.extname(file) === '.json') {
                var externalJsonFilePath = path.join(externalJsonCollectionPath, file);
                _this.docItemLoader.loadPackageIntoCache(externalJsonFilePath, path.parse(file).name.split('.').shift());
            }
        });
    };
    return Extractor;
}());
exports.default = Extractor;

//# sourceMappingURL=Extractor.js.map
