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
var ApiMember_1 = require("./ApiMember");
/**
 * This class is part of the ApiItem abstract syntax tree. It represents variables
 * that are exported by an ApiNamespace (or conceivably an ApiPackage in the future).
 * The variables have a name, a type, and an initializer. The ApiNamespace implementation
 * currently requires them to use a primitive type and be declared as "const".
 */
var ApiModuleVariable = (function (_super) {
    __extends(ApiModuleVariable, _super);
    function ApiModuleVariable(options) {
        var _this = _super.call(this, options) || this;
        _this.kind = ApiItem_1.ApiItemKind.ModuleVariable;
        var propertySignature = options.declaration;
        _this.type = propertySignature.type.getText();
        _this.name = propertySignature.name.getText();
        _this.value = propertySignature.initializer.getText(); // value of the export
        return _this;
    }
    return ApiModuleVariable;
}(ApiMember_1.default));
exports.default = ApiModuleVariable;

//# sourceMappingURL=ApiModuleVariable.js.map
