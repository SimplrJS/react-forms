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
var ApiModuleVariable_1 = require("./ApiModuleVariable");
var ApiItem_1 = require("./ApiItem");
var ApiItemContainer_1 = require("./ApiItemContainer");
var allowedTypes = ['string', 'number', 'boolean'];
/**
  * This class is part of the ApiItem abstract syntax tree. It represents exports of
  * a namespace, the exports can be module variable constants of type "string", "boolean" or "number".
  * An ApiNamespace is defined using TypeScript's "namespace" keyword.
  *
  * @remarks A note about terminology:
  * - EcmaScript "namespace modules" are not conventional namespaces; their semantics are
  * more like static classes in C# or Java.
  * - API Extractor's support for namespaces is currently limited to representing tables of
  * constants, and has a benefit of enabling WebPack to avoid bundling unused values.
  * - We currently still recommend to use static classes for utility libraries, since this
  * provides getters/setters, public/private, and some other structure missing from namespaces.
  */
var ApiNamespace = (function (_super) {
    __extends(ApiNamespace, _super);
    function ApiNamespace(options) {
        var _this = _super.call(this, options) || this;
        _this._exportedNormalizedSymbols = [];
        _this.kind = ApiItem_1.ApiItemKind.Namespace;
        _this.name = options.declarationSymbol.name;
        var exportSymbols = _this.typeChecker.getExportsOfModule(_this.declarationSymbol);
        if (exportSymbols) {
            for (var _i = 0, exportSymbols_1 = exportSymbols; _i < exportSymbols_1.length; _i++) {
                var exportSymbol = exportSymbols_1[_i];
                var followedSymbol = _this.followAliases(exportSymbol);
                if (!followedSymbol.declarations) {
                    // This is an API Extractor bug, but it could happen e.g. if we upgrade to a new
                    // version of the TypeScript compiler that introduces new AST variations that we
                    // haven't tested before.
                    _this.reportWarning("The definition \"" + exportSymbol.name + "\" has no declarations");
                    continue;
                }
                if (!(followedSymbol.flags === ts.SymbolFlags.BlockScopedVariable)) {
                    _this.reportWarning("Unsupported export \"" + exportSymbol.name + "\" " +
                        'Currently the "namespace" block only supports constant variables.');
                    continue;
                }
                // Since we are imposing that the items within a namespace be
                // const properties we are only taking the first declaration.
                // If we decide to add support for other types within a namespace
                // we will have for evaluate each declaration.
                var declaration = followedSymbol.getDeclarations()[0];
                if (declaration.parent.flags !== ts.NodeFlags.Const) {
                    _this.reportWarning("Export \"" + exportSymbol.name + "\" is missing the \"const\" " +
                        'modifier. Currently the "namespace" block only supports constant variables.');
                    continue;
                }
                var propertySignature = declaration;
                if (!propertySignature.type || allowedTypes.indexOf(propertySignature.type.getText()) < 0) {
                    _this.reportWarning("Export \"" + exportSymbol.name + "\" must specify and be of type" +
                        '"string", "number" or "boolean"');
                    continue;
                }
                if (!propertySignature.initializer) {
                    _this.reportWarning("Export \"" + exportSymbol.name + "\" must have an initialized value");
                    continue;
                }
                // Typescript's VariableDeclaration AST nodes have an VariableDeclarationList parent,
                // and the VariableDeclarationList exists within a VariableStatement, which is where
                // the JSDoc comment Node can be found.
                // If there is no parent or grandparent of this VariableDeclartion then
                // we do not know how to obtain the JSDoc comment.
                var jsdocNode = void 0;
                if (!declaration.parent || !declaration.parent.parent ||
                    declaration.parent.parent.kind !== ts.SyntaxKind.VariableStatement) {
                    _this.reportWarning("Unable to locate the documentation node for \"" + exportSymbol.name + "\"; "
                        + "this may be an API Extractor bug");
                }
                else {
                    jsdocNode = declaration.parent.parent;
                }
                var exportMemberOptions = {
                    extractor: _this.extractor,
                    declaration: declaration,
                    declarationSymbol: followedSymbol,
                    jsdocNode: jsdocNode,
                    exportSymbol: exportSymbol
                };
                _this.addMemberItem(new ApiModuleVariable_1.default(exportMemberOptions));
                _this._exportedNormalizedSymbols.push({
                    exportedName: exportSymbol.name,
                    followedSymbol: followedSymbol
                });
            }
        }
        return _this;
    }
    return ApiNamespace;
}(ApiItemContainer_1.default));
exports.default = ApiNamespace;

//# sourceMappingURL=ApiNamespace.js.map
