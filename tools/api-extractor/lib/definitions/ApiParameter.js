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
/**
 * This class is part of the ApiItem abstract syntax tree. It represents parameters of a function declaration
 */
var ApiParameter = (function (_super) {
    __extends(ApiParameter, _super);
    function ApiParameter(options, docComment) {
        var _this = _super.call(this, options) || this;
        _this.kind = ApiItem_1.ApiItemKind.Parameter;
        var parameterDeclaration = options.declaration;
        _this.isOptional = !!parameterDeclaration.questionToken || !!parameterDeclaration.initializer;
        if (parameterDeclaration.type) {
            _this.type = parameterDeclaration.type.getText();
        }
        else {
            _this.hasIncompleteTypes = true;
            _this.type = 'any';
        }
        _this.isSpread = !!parameterDeclaration.dotDotDotToken;
        return _this;
    }
    return ApiParameter;
}(ApiItem_1.default));
exports.default = ApiParameter;

//# sourceMappingURL=ApiParameter.js.map
