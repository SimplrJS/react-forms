"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var ApiPackage_1 = require("./definitions/ApiPackage");
var ApiEnum_1 = require("./definitions/ApiEnum");
var ApiEnumValue_1 = require("./definitions/ApiEnumValue");
var ApiFunction_1 = require("./definitions/ApiFunction");
var ApiStructuredType_1 = require("./definitions/ApiStructuredType");
var ApiMethod_1 = require("./definitions/ApiMethod");
var ApiNamespace_1 = require("./definitions/ApiNamespace");
var ApiProperty_1 = require("./definitions/ApiProperty");
var ApiModuleVariable_1 = require("./definitions/ApiModuleVariable");
/**
  * This is a helper class that provides a standard way to walk the ApiItem
  * abstract syntax tree.
  */
var ApiItemVisitor = (function () {
    function ApiItemVisitor() {
    }
    ApiItemVisitor.prototype.visit = function (apiItem, refObject) {
        if (apiItem instanceof ApiStructuredType_1.default) {
            this.visitApiStructuredType(apiItem, refObject);
        }
        else if (apiItem instanceof ApiEnum_1.default) {
            this.visitApiEnum(apiItem, refObject);
        }
        else if (apiItem instanceof ApiEnumValue_1.default) {
            this.visitApiEnumValue(apiItem, refObject);
        }
        else if (apiItem instanceof ApiFunction_1.default) {
            this.visitApiFunction(apiItem, refObject);
        }
        else if (apiItem instanceof ApiPackage_1.default) {
            this.visitApiPackage(apiItem, refObject);
        }
        else if (apiItem instanceof ApiProperty_1.default) {
            this.visitApiProperty(apiItem, refObject);
        }
        else if (apiItem instanceof ApiMethod_1.default) {
            this.visitApiMethod(apiItem, refObject);
        }
        else if (apiItem instanceof ApiNamespace_1.default) {
            this.visitApiNamespace(apiItem, refObject);
        }
        else if (apiItem instanceof ApiModuleVariable_1.default) {
            this.visitApiModuleVariable(apiItem, refObject);
        }
        else {
            throw new Error('Not implemented');
        }
    };
    ApiItemVisitor.prototype.visitApiMethod = function (apiMethod, refObject) {
        this.visitApiMember(apiMethod, refObject);
    };
    ;
    ApiItemVisitor.prototype.visitApiProperty = function (apiProperty, refObject) {
        this.visitApiMember(apiProperty, refObject);
    };
    ;
    return ApiItemVisitor;
}());
exports.default = ApiItemVisitor;

//# sourceMappingURL=ApiItemVisitor.js.map
