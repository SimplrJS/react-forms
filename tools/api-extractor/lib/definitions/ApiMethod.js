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
var ts = require("typescript");
var ApiItem_1 = require("./ApiItem");
var ApiMember_1 = require("./ApiMember");
var ApiParameter_1 = require("./ApiParameter");
var TypeScriptHelpers_1 = require("../TypeScriptHelpers");
var ApiDefinitionReference_1 = require("../ApiDefinitionReference");
/**
 * This class is part of the ApiItem abstract syntax tree. It represents functions that are members of
 * classes, interfaces, or nested type literal expressions. Unlike ApiFunctions, ApiMethods can have
 * access modifiers (public, private, etc.) or be optional, because they are members of a structured type
 *
 * @see ApiFunction for functions that are defined inside of a package
 */
var ApiMethod = (function (_super) {
    __extends(ApiMethod, _super);
    function ApiMethod(options) {
        var _this = _super.call(this, options) || this;
        _this.kind = ApiItem_1.ApiItemKind.Method;
        var methodDeclaration = options.declaration;
        // Parameters
        if (methodDeclaration.parameters) {
            _this.params = [];
            for (var _i = 0, _a = methodDeclaration.parameters; _i < _a.length; _i++) {
                var param = _a[_i];
                var declarationSymbol = TypeScriptHelpers_1.default.tryGetSymbolForDeclaration(param);
                var apiParameter = new ApiParameter_1.default({
                    extractor: _this.extractor,
                    declaration: param,
                    declarationSymbol: declarationSymbol,
                    jsdocNode: param
                });
                _this.innerItems.push(apiParameter);
                _this.params.push(apiParameter);
            }
        }
        // tslint:disable-next-line:no-bitwise
        _this._isConstructor = (options.declarationSymbol.flags & ts.SymbolFlags.Constructor) !== 0;
        // Return type
        if (!_this.isConstructor) {
            if (methodDeclaration.type) {
                _this.returnType = methodDeclaration.type.getText();
            }
            else {
                _this.returnType = 'any';
                _this.hasIncompleteTypes = true;
            }
        }
        return _this;
    }
    Object.defineProperty(ApiMethod.prototype, "isConstructor", {
        /**
         * Returns true if this member represents a class constructor.
         */
        get: function () {
            return this._isConstructor;
        },
        enumerable: true,
        configurable: true
    });
    ApiMethod.prototype.onCompleteInitialization = function () {
        _super.prototype.onCompleteInitialization.call(this);
        // If this is a class constructor, and if the documentation summary was omitted, then
        // we fill in a default summary versus flagging it as "undocumented".
        // Generally class constructors have uninteresting documentation.
        if (this.isConstructor) {
            if (this.documentation.summary.length === 0) {
                this.documentation.summary.push({
                    kind: 'textDocElement',
                    value: 'Constructs a new instance of the '
                });
                var scopedPackageName = ApiDefinitionReference_1.default
                    .parseScopedPackageName(this.extractor.package.name);
                this.documentation.summary.push({
                    kind: 'linkDocElement',
                    referenceType: 'code',
                    scopeName: scopedPackageName.scope,
                    packageName: scopedPackageName.package,
                    exportName: this.parentContainer.name,
                    value: this.parentContainer.name
                });
                this.documentation.summary.push({
                    kind: 'textDocElement',
                    value: ' class'
                });
            }
            this.needsDocumentation = false;
        }
    };
    return ApiMethod;
}(ApiMember_1.default));
exports.default = ApiMethod;

//# sourceMappingURL=ApiMethod.js.map
