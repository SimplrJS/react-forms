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
var os = require("os");
var path = require("path");
var ts = require("typescript");
var ApiItem_1 = require("../definitions/ApiItem");
var ApiItemVisitor_1 = require("../ApiItemVisitor");
var ApiMember_1 = require("../definitions/ApiMember");
var ApiDocumentation_1 = require("../definitions/ApiDocumentation");
var JsonFile_1 = require("../JsonFile");
var ApiJsonFile_1 = require("./ApiJsonFile");
/**
 * For a library such as "example-package", ApiFileGenerator generates the "example-package.api.ts"
 * report which is used to detect API changes.  The output is pseudocode whose syntax is similar
 * but not identical to a "*.d.ts" typings file.  The output file is designed to be committed to
 * Git with a branch policy that will trigger an API review workflow whenever the file contents
 * have changed.  For example, the API file indicates *whether* a class has been documented,
 * but it does not include the documentation text (since minor text changes should not require
 * an API review).
 *
 * @public
 */
var ApiJsonGenerator = (function (_super) {
    __extends(ApiJsonGenerator, _super);
    function ApiJsonGenerator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.jsonOutput = {};
        return _this;
    }
    // @override
    ApiJsonGenerator.prototype.visit = function (apiItem, refObject) {
        switch (apiItem.documentation.releaseTag) {
            case ApiDocumentation_1.ReleaseTag.None:
            case ApiDocumentation_1.ReleaseTag.Beta:
            case ApiDocumentation_1.ReleaseTag.Public:
                break;
            default:
                return; // skip @alpha and @internal definitions
        }
        _super.prototype.visit.call(this, apiItem, refObject);
    };
    ApiJsonGenerator.prototype.writeJsonFile = function (reportFilename, extractor) {
        this.visit(extractor.package, this.jsonOutput);
        // Write the output before validating the schema, so we can debug it
        JsonFile_1.default.saveJsonFile(reportFilename, this.jsonOutput);
        // Validate that the output conforms to our JSON schema
        var apiJsonSchema = JsonFile_1.default.loadJsonFile(path.join(__dirname, '../schemas/api-json-schema.json'));
        JsonFile_1.default.validateSchema(this.jsonOutput, apiJsonSchema, function (errorDetail) {
            var errorMessage = "ApiJsonGenerator validation error - output does not conform to api-json-schema.json:" + os.EOL
                + reportFilename + os.EOL
                + errorDetail;
            console.log(os.EOL + 'ERROR: ' + errorMessage + os.EOL + os.EOL);
            throw new Error(errorMessage);
        });
    };
    ApiJsonGenerator.prototype.visitApiStructuredType = function (apiStructuredType, refObject) {
        if (!apiStructuredType.supportedName) {
            return;
        }
        var kind = apiStructuredType.kind === ApiItem_1.ApiItemKind.Class ? ApiJsonFile_1.default.convertKindToJson(ApiItem_1.ApiItemKind.Class) :
            apiStructuredType.kind === ApiItem_1.ApiItemKind.Interface ?
                ApiJsonFile_1.default.convertKindToJson(ApiItem_1.ApiItemKind.Interface) : '';
        var structureNode = {
            kind: kind,
            extends: apiStructuredType.extends || '',
            implements: apiStructuredType.implements || '',
            typeParameters: apiStructuredType.typeParameters || [],
            deprecatedMessage: apiStructuredType.documentation.deprecatedMessage || [],
            summary: apiStructuredType.documentation.summary || [],
            remarks: apiStructuredType.documentation.remarks || [],
            isBeta: apiStructuredType.documentation.releaseTag === ApiDocumentation_1.ReleaseTag.Beta
        };
        refObject[apiStructuredType.name] = structureNode;
        ApiJsonGenerator._methodCounter = 0;
        var members = apiStructuredType.getSortedMemberItems();
        if (members && members.length) {
            var membersNode = {};
            structureNode[ApiJsonGenerator._MEMBERS_KEY] = membersNode;
            for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
                var apiItem = members_1[_i];
                this.visit(apiItem, membersNode);
            }
        }
    };
    ApiJsonGenerator.prototype.visitApiEnum = function (apiEnum, refObject) {
        if (!apiEnum.supportedName) {
            return;
        }
        var valuesNode = {};
        var enumNode = {
            kind: ApiJsonFile_1.default.convertKindToJson(apiEnum.kind),
            values: valuesNode,
            deprecatedMessage: apiEnum.documentation.deprecatedMessage || [],
            summary: apiEnum.documentation.summary || [],
            remarks: apiEnum.documentation.remarks || [],
            isBeta: apiEnum.documentation.releaseTag === ApiDocumentation_1.ReleaseTag.Beta
        };
        refObject[apiEnum.name] = enumNode;
        for (var _i = 0, _a = apiEnum.getSortedMemberItems(); _i < _a.length; _i++) {
            var apiItem = _a[_i];
            this.visit(apiItem, valuesNode);
        }
    };
    ApiJsonGenerator.prototype.visitApiEnumValue = function (apiEnumValue, refObject) {
        if (!apiEnumValue.supportedName) {
            return;
        }
        var declaration = apiEnumValue.getDeclaration();
        var firstToken = declaration ? declaration.getFirstToken() : undefined;
        var lastToken = declaration ? declaration.getLastToken() : undefined;
        var value = lastToken && lastToken !== firstToken ? lastToken.getText() : '';
        refObject[apiEnumValue.name] = {
            kind: ApiJsonFile_1.default.convertKindToJson(apiEnumValue.kind),
            value: value,
            deprecatedMessage: apiEnumValue.documentation.deprecatedMessage || [],
            summary: apiEnumValue.documentation.summary || [],
            remarks: apiEnumValue.documentation.remarks || [],
            isBeta: apiEnumValue.documentation.releaseTag === ApiDocumentation_1.ReleaseTag.Beta
        };
    };
    ApiJsonGenerator.prototype.visitApiFunction = function (apiFunction, refObject) {
        if (!apiFunction.supportedName) {
            return;
        }
        for (var _i = 0, _a = apiFunction.params; _i < _a.length; _i++) {
            var param = _a[_i];
            this.visitApiParam(param, apiFunction.documentation.parameters[param.name]);
        }
        var returnValueNode = {
            type: apiFunction.returnType,
            description: apiFunction.documentation.returnsMessage
        };
        var newNode = {
            kind: ApiJsonFile_1.default.convertKindToJson(apiFunction.kind),
            returnValue: returnValueNode,
            parameters: apiFunction.documentation.parameters,
            deprecatedMessage: apiFunction.documentation.deprecatedMessage || [],
            summary: apiFunction.documentation.summary || [],
            remarks: apiFunction.documentation.remarks || [],
            isBeta: apiFunction.documentation.releaseTag === ApiDocumentation_1.ReleaseTag.Beta
        };
        refObject[apiFunction.name] = newNode;
    };
    ApiJsonGenerator.prototype.visitApiPackage = function (apiPackage, refObject) {
        /* tslint:disable:no-string-literal */
        refObject['kind'] = ApiJsonFile_1.default.convertKindToJson(apiPackage.kind);
        refObject['summary'] = apiPackage.documentation.summary;
        refObject['remarks'] = apiPackage.documentation.remarks;
        /* tslint:enable:no-string-literal */
        var membersNode = {};
        refObject[ApiJsonGenerator._EXPORTS_KEY] = membersNode;
        for (var _i = 0, _a = apiPackage.getSortedMemberItems(); _i < _a.length; _i++) {
            var apiItem = _a[_i];
            this.visit(apiItem, membersNode);
        }
    };
    ApiJsonGenerator.prototype.visitApiNamespace = function (apiNamespace, refObject) {
        if (!apiNamespace.supportedName) {
            return;
        }
        var membersNode = {};
        for (var _i = 0, _a = apiNamespace.getSortedMemberItems(); _i < _a.length; _i++) {
            var apiItem = _a[_i];
            this.visit(apiItem, membersNode);
        }
        var newNode = {
            kind: ApiJsonFile_1.default.convertKindToJson(apiNamespace.kind),
            deprecatedMessage: apiNamespace.documentation.deprecatedMessage || [],
            summary: apiNamespace.documentation.summary || [],
            remarks: apiNamespace.documentation.remarks || [],
            isBeta: apiNamespace.documentation.releaseTag === ApiDocumentation_1.ReleaseTag.Beta,
            exports: membersNode
        };
        refObject[apiNamespace.name] = newNode;
    };
    ApiJsonGenerator.prototype.visitApiMember = function (apiMember, refObject) {
        if (!apiMember.supportedName) {
            return;
        }
        refObject[apiMember.name] = 'apiMember-' + apiMember.getDeclaration().kind;
    };
    ApiJsonGenerator.prototype.visitApiProperty = function (apiProperty, refObject) {
        if (!apiProperty.supportedName) {
            return;
        }
        if (apiProperty.getDeclaration().kind === ts.SyntaxKind.SetAccessor) {
            return;
        }
        var newNode = {
            kind: ApiJsonFile_1.default.convertKindToJson(apiProperty.kind),
            isOptional: !!apiProperty.isOptional,
            isReadOnly: !!apiProperty.isReadOnly,
            isStatic: !!apiProperty.isStatic,
            type: apiProperty.type,
            deprecatedMessage: apiProperty.documentation.deprecatedMessage || [],
            summary: apiProperty.documentation.summary || [],
            remarks: apiProperty.documentation.remarks || [],
            isBeta: apiProperty.documentation.releaseTag === ApiDocumentation_1.ReleaseTag.Beta
        };
        refObject[apiProperty.name] = newNode;
    };
    ApiJsonGenerator.prototype.visitApiModuleVariable = function (apiModuleVariable, refObject) {
        var newNode = {
            kind: ApiJsonFile_1.default.convertKindToJson(apiModuleVariable.kind),
            type: apiModuleVariable.type,
            value: apiModuleVariable.value,
            deprecatedMessage: apiModuleVariable.documentation.deprecatedMessage || [],
            summary: apiModuleVariable.documentation.summary || [],
            remarks: apiModuleVariable.documentation.remarks || [],
            isBeta: apiModuleVariable.documentation.releaseTag === ApiDocumentation_1.ReleaseTag.Beta
        };
        refObject[apiModuleVariable.name] = newNode;
    };
    ApiJsonGenerator.prototype.visitApiMethod = function (apiMethod, refObject) {
        if (!apiMethod.supportedName) {
            return;
        }
        for (var _i = 0, _a = apiMethod.params; _i < _a.length; _i++) {
            var param = _a[_i];
            this.visitApiParam(param, apiMethod.documentation.parameters[param.name]);
        }
        var newNode;
        if (apiMethod.name === '__constructor') {
            newNode = {
                kind: ApiJsonFile_1.default.convertKindToJson(ApiItem_1.ApiItemKind.Constructor),
                signature: apiMethod.getDeclarationLine(),
                parameters: apiMethod.documentation.parameters,
                deprecatedMessage: apiMethod.documentation.deprecatedMessage || [],
                summary: apiMethod.documentation.summary || [],
                remarks: apiMethod.documentation.remarks || []
            };
        }
        else {
            var returnValueNode = {
                type: apiMethod.returnType,
                description: apiMethod.documentation.returnsMessage
            };
            newNode = {
                kind: ApiJsonFile_1.default.convertKindToJson(apiMethod.kind),
                signature: apiMethod.getDeclarationLine(),
                accessModifier: apiMethod.accessModifier ? ApiMember_1.AccessModifier[apiMethod.accessModifier].toLowerCase() : '',
                isOptional: !!apiMethod.isOptional,
                isStatic: !!apiMethod.isStatic,
                returnValue: returnValueNode,
                parameters: apiMethod.documentation.parameters,
                deprecatedMessage: apiMethod.documentation.deprecatedMessage || [],
                summary: apiMethod.documentation.summary || [],
                remarks: apiMethod.documentation.remarks || [],
                isBeta: apiMethod.documentation.releaseTag === ApiDocumentation_1.ReleaseTag.Beta
            };
        }
        refObject[apiMethod.name] = newNode;
    };
    ApiJsonGenerator.prototype.visitApiParam = function (apiParam, refObject) {
        if (!apiParam.supportedName) {
            return;
        }
        if (refObject) {
            refObject.isOptional = apiParam.isOptional;
            refObject.isSpread = apiParam.isSpread;
            refObject.type = apiParam.type;
        }
    };
    ApiJsonGenerator._methodCounter = 0;
    ApiJsonGenerator._MEMBERS_KEY = 'members';
    ApiJsonGenerator._EXPORTS_KEY = 'exports';
    return ApiJsonGenerator;
}(ApiItemVisitor_1.default));
exports.default = ApiJsonGenerator;

//# sourceMappingURL=ApiJsonGenerator.js.map
