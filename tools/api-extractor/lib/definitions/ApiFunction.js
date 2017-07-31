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
var ApiItem_1 = require("./ApiItem");
var ApiParameter_1 = require("./ApiParameter");
var TypeScriptHelpers_1 = require("../TypeScriptHelpers");
var PrettyPrinter_1 = require("../PrettyPrinter");
/**
  * This class is part of the ApiItem abstract syntax tree. It represents functions that are directly
  * defined inside a package and are not member of classes, interfaces, or nested type literal expressions
  *
  * @see ApiMethod for functions that are members of classes, interfaces, or nested type literal expressions
  */
var ApiFunction = (function (_super) {
    __extends(ApiFunction, _super);
    function ApiFunction(options) {
        var _this = _super.call(this, options) || this;
        _this.kind = ApiItem_1.ApiItemKind.Function;
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
        // Return type
        if (methodDeclaration.type) {
            _this.returnType = methodDeclaration.type.getText();
        }
        else {
            _this.hasIncompleteTypes = true;
            _this.returnType = 'any';
        }
        return _this;
    }
    /**
     * Returns a text string such as "someName?: SomeTypeName;", or in the case of a type
     * literal expression, returns a text string such as "someName?:".
     */
    ApiFunction.prototype.getDeclarationLine = function () {
        return PrettyPrinter_1.default.getDeclarationSummary(this.declaration);
    };
    return ApiFunction;
}(ApiItem_1.default));
exports.default = ApiFunction;

//# sourceMappingURL=ApiFunction.js.map
