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
 * This class is part of the ApiItem abstract syntax tree. It represents properties of classes or interfaces
 * (It does not represent member methods)
 */
var ApiProperty = (function (_super) {
    __extends(ApiProperty, _super);
    function ApiProperty(options) {
        var _this = _super.call(this, options) || this;
        _this.kind = ApiItem_1.ApiItemKind.Property;
        if (_this.documentation.hasReadOnlyTag) {
            _this.isReadOnly = true;
        }
        var declaration = options.declaration; /* tslint:disable-line:no-any */
        if (declaration.type) {
            _this.type = declaration.type.getText();
        }
        else {
            _this.hasIncompleteTypes = true;
            _this.type = 'any';
        }
        return _this;
    }
    ApiProperty.prototype.getDeclarationLine = function () {
        return _super.prototype.getDeclarationLine.call(this, {
            type: this.type,
            readonly: this.isReadOnly
        });
    };
    return ApiProperty;
}(ApiMember_1.default));
exports.default = ApiProperty;

//# sourceMappingURL=ApiProperty.js.map
