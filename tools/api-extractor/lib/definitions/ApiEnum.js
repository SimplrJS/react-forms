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
var ApiItemContainer_1 = require("./ApiItemContainer");
var ApiEnumValue_1 = require("./ApiEnumValue");
var TypeScriptHelpers_1 = require("../TypeScriptHelpers");
/**
 * This class is part of the ApiItem abstract syntax tree. It represents a TypeScript enum definition.
 * The individual enum values are represented using ApiEnumValue.
 */
var ApiEnum = (function (_super) {
    __extends(ApiEnum, _super);
    function ApiEnum(options) {
        var _this = _super.call(this, options) || this;
        _this.kind = ApiItem_1.ApiItemKind.Enum;
        for (var _i = 0, _a = options.declaration.members; _i < _a.length; _i++) {
            var memberDeclaration = _a[_i];
            var memberSymbol = TypeScriptHelpers_1.default.getSymbolForDeclaration(memberDeclaration);
            var memberOptions = {
                extractor: _this.extractor,
                declaration: memberDeclaration,
                declarationSymbol: memberSymbol,
                jsdocNode: memberDeclaration
            };
            _this.addMemberItem(new ApiEnumValue_1.default(memberOptions));
        }
        return _this;
    }
    return ApiEnum;
}(ApiItemContainer_1.default));
exports.default = ApiEnum;

//# sourceMappingURL=ApiEnum.js.map
