"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-bitwise */
var ts = require("typescript");
var ApiStructuredType_1 = require("./ApiStructuredType");
var ApiEnum_1 = require("./ApiEnum");
var ApiFunction_1 = require("./ApiFunction");
var ApiItem_1 = require("./ApiItem");
var ApiItemContainer_1 = require("./ApiItemContainer");
var ApiNamespace_1 = require("./ApiNamespace");
var TypeScriptHelpers_1 = require("../TypeScriptHelpers");
/**
  * This class is part of the ApiItem abstract syntax tree.  It represents the top-level
  * exports for an Rush package.  This object acts as the root of the Extractor's tree.
  */
var ApiPackage = (function (_super) {
    __extends(ApiPackage, _super);
    function ApiPackage(extractor, rootFile) {
        var _this = _super.call(this, ApiPackage._getOptions(extractor, rootFile)) || this;
        _this._exportedNormalizedSymbols = [];
        _this.kind = ApiItem_1.ApiItemKind.Package;
        // The scoped package name. (E.g. "@microsoft/api-extractor")
        _this.name = _this.extractor.packageJsonLookup.readPackageName(_this.extractor.packageFolder);
        var exportSymbols = _this.typeChecker.getExportsOfModule(_this.declarationSymbol);
        if (exportSymbols) {
            for (var _i = 0, exportSymbols_1 = exportSymbols; _i < exportSymbols_1.length; _i++) {
                var exportSymbol = exportSymbols_1[_i];
                var followedSymbol = _this.followAliases(exportSymbol);
                if (!followedSymbol.declarations) {
                    // This is an API Extractor bug, but it could happen e.g. if we upgrade to a new
                    // version of the TypeScript compiler that introduces new AST variations that we
                    // haven't tested before.
                    _this.reportWarning("Definition with no declarations: " + exportSymbol.name);
                    continue;
                }
                for (var _a = 0, _b = followedSymbol.declarations; _a < _b.length; _a++) {
                    var declaration = _b[_a];
                    var options = {
                        extractor: _this.extractor,
                        declaration: declaration,
                        declarationSymbol: followedSymbol,
                        jsdocNode: declaration,
                        exportSymbol: exportSymbol
                    };
                    if (followedSymbol.flags & (ts.SymbolFlags.Class | ts.SymbolFlags.Interface)) {
                        _this.addMemberItem(new ApiStructuredType_1.default(options));
                    }
                    else if (followedSymbol.flags & ts.SymbolFlags.ValueModule) {
                        _this.addMemberItem(new ApiNamespace_1.default(options));
                    }
                    else if (followedSymbol.flags & ts.SymbolFlags.Function) {
                        _this.addMemberItem(new ApiFunction_1.default(options));
                    }
                    else if (followedSymbol.flags & ts.SymbolFlags.Enum) {
                        _this.addMemberItem(new ApiEnum_1.default(options));
                    }
                    else {
                        _this.reportWarning("Unsupported export: " + exportSymbol.name);
                    }
                }
                _this._exportedNormalizedSymbols.push({
                    exportedName: exportSymbol.name,
                    followedSymbol: followedSymbol
                });
            }
        }
        return _this;
    }
    ApiPackage._getOptions = function (extractor, rootFile) {
        var rootFileSymbol = TypeScriptHelpers_1.default.getSymbolForDeclaration(rootFile);
        var statement;
        var foundDescription = undefined;
        for (var _i = 0, _a = rootFile.statements; _i < _a.length; _i++) {
            var statementNode = _a[_i];
            if (statementNode.kind === ts.SyntaxKind.VariableStatement) {
                statement = statementNode;
                for (var _b = 0, _c = statement.declarationList.declarations; _b < _c.length; _b++) {
                    var statementDeclaration = _c[_b];
                    if (statementDeclaration.name.getText() === 'packageDescription') {
                        foundDescription = statement;
                    }
                }
            }
        }
        return {
            extractor: extractor,
            declaration: rootFileSymbol.declarations[0],
            declarationSymbol: rootFileSymbol,
            jsdocNode: foundDescription
        };
    };
    /**
     * Finds and returns the original symbol name.
     *
     * For example, suppose a class is defined as "export default class MyClass { }"
     * but exported from the package's index.ts like this:
     *
     *    export { default as _MyClass } from './MyClass';
     *
     * In this example, given the symbol for _MyClass, getExportedSymbolName() will return
     * the string "MyClass".
     */
    ApiPackage.prototype.tryGetExportedSymbolName = function (symbol) {
        var followedSymbol = this.followAliases(symbol);
        for (var _i = 0, _a = this._exportedNormalizedSymbols; _i < _a.length; _i++) {
            var exportedSymbol = _a[_i];
            if (exportedSymbol.followedSymbol === followedSymbol) {
                return exportedSymbol.exportedName;
            }
        }
        return undefined;
    };
    ApiPackage.prototype.shouldHaveDocumentation = function () {
        // We don't write JSDoc for the ApiPackage object
        return false;
    };
    return ApiPackage;
}(ApiItemContainer_1.default));
exports.default = ApiPackage;

//# sourceMappingURL=ApiPackage.js.map
