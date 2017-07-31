"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var ApiItem_1 = require("../definitions/ApiItem");
/**
 * Supports the conversion between ApiItems that are loaded from ApiItem to JSON notation
 * and vice versa.
 */
var ApiJsonFile = (function () {
    function ApiJsonFile() {
    }
    /**
     * Uses the lowercase string that represents 'kind' in an API JSON file, and
     * converts it to an ApiItemKind enum value.
     * There are two cases we do not include here, (Parameter and StructuredType),
     * this is intential as we do not expect to be loading these kind of JSON object
     * from file.
     */
    ApiJsonFile.convertJsonToKind = function (jsonItemKind) {
        switch (jsonItemKind) {
            case (this._KIND_CONSTRUCTOR):
                return ApiItem_1.ApiItemKind.Constructor;
            case (this._KIND_CLASS):
                return ApiItem_1.ApiItemKind.Class;
            case (this._KIND_ENUM):
                return ApiItem_1.ApiItemKind.Enum;
            case (this._KIND_ENUM_VALUE):
                return ApiItem_1.ApiItemKind.EnumValue;
            case (this._KIND_INTERFACE):
                return ApiItem_1.ApiItemKind.Interface;
            case (this._KIND_FUNCTION):
                return ApiItem_1.ApiItemKind.Function;
            case (this._KIND_PACKAGE):
                return ApiItem_1.ApiItemKind.Package;
            case (this._KIND_PROPERTY):
                return ApiItem_1.ApiItemKind.Property;
            case (this._KIND_METHOD):
                return ApiItem_1.ApiItemKind.Method;
            case (this._KIND_NAMESPACE):
                return ApiItem_1.ApiItemKind.Namespace;
            case (this._KIND_MODULEVARIABLE):
                return ApiItem_1.ApiItemKind.ModuleVariable;
            default:
                throw new Error('Unsupported kind when converting JSON item kind to API item kind.');
        }
    };
    /**
     * Converts the an ApiItemKind into a lower-case string that is written to API JSON files.
     */
    ApiJsonFile.convertKindToJson = function (apiItemKind) {
        switch (apiItemKind) {
            case (ApiItem_1.ApiItemKind.Constructor):
                return this._KIND_CONSTRUCTOR;
            case (ApiItem_1.ApiItemKind.Class):
                return this._KIND_CLASS;
            case (ApiItem_1.ApiItemKind.Enum):
                return this._KIND_ENUM;
            case (ApiItem_1.ApiItemKind.EnumValue):
                return this._KIND_ENUM_VALUE;
            case (ApiItem_1.ApiItemKind.Interface):
                return this._KIND_INTERFACE;
            case (ApiItem_1.ApiItemKind.Function):
                return this._KIND_FUNCTION;
            case (ApiItem_1.ApiItemKind.Package):
                return this._KIND_PACKAGE;
            case (ApiItem_1.ApiItemKind.Property):
                return this._KIND_PROPERTY;
            case (ApiItem_1.ApiItemKind.Method):
                return this._KIND_METHOD;
            case (ApiItem_1.ApiItemKind.Namespace):
                return this._KIND_NAMESPACE;
            case (ApiItem_1.ApiItemKind.ModuleVariable):
                return this._KIND_MODULEVARIABLE;
            default:
                throw new Error('Unsupported API item kind when converting to string used in API JSON file.');
        }
    };
    ApiJsonFile._KIND_CONSTRUCTOR = 'constructor';
    ApiJsonFile._KIND_CLASS = 'class';
    ApiJsonFile._KIND_ENUM = 'enum';
    ApiJsonFile._KIND_ENUM_VALUE = 'enum value';
    ApiJsonFile._KIND_INTERFACE = 'interface';
    ApiJsonFile._KIND_FUNCTION = 'function';
    ApiJsonFile._KIND_PACKAGE = 'package';
    ApiJsonFile._KIND_PROPERTY = 'property';
    ApiJsonFile._KIND_METHOD = 'method';
    ApiJsonFile._KIND_NAMESPACE = 'namespace';
    ApiJsonFile._KIND_MODULEVARIABLE = 'module variable';
    return ApiJsonFile;
}());
exports.default = ApiJsonFile;

//# sourceMappingURL=ApiJsonFile.js.map
