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
var PrettyPrinter_1 = require("../PrettyPrinter");
/**
 * This class is part of the ApiItem abstract syntax tree. It represents a TypeScript enum value.
 * The parent container will always be an ApiEnum instance.
 */
var ApiEnumValue = (function (_super) {
    __extends(ApiEnumValue, _super);
    function ApiEnumValue(options) {
        var _this = _super.call(this, options) || this;
        _this.kind = ApiItem_1.ApiItemKind.EnumValue;
        return _this;
    }
    /**
     * Returns a text string such as "MyValue = 123,"
     */
    ApiEnumValue.prototype.getDeclarationLine = function () {
        return PrettyPrinter_1.default.getDeclarationSummary(this.declaration);
    };
    return ApiEnumValue;
}(ApiItem_1.default));
exports.default = ApiEnumValue;

//# sourceMappingURL=ApiEnumValue.js.map
