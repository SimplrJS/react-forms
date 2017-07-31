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
var ApiStructuredType_1 = require("./ApiStructuredType");
var PrettyPrinter_1 = require("../PrettyPrinter");
var TypeScriptHelpers_1 = require("../TypeScriptHelpers");
var AccessModifier;
(function (AccessModifier) {
    AccessModifier[AccessModifier["Private"] = 0] = "Private";
    AccessModifier[AccessModifier["Protected"] = 1] = "Protected";
    AccessModifier[AccessModifier["Public"] = 2] = "Public";
})(AccessModifier = exports.AccessModifier || (exports.AccessModifier = {}));
/**
 * This class is part of the ApiItem abstract syntax tree.  It represents syntax following
 * these types of patterns:
 *
 * - "someName: SomeTypeName;"
 * - "someName?: SomeTypeName;"
 * - "someName: { someOtherName: SomeOtherTypeName }", i.e. involving a type literal expression
 * - "someFunction(): void;"
 *
 * ApiMember is used to represent members of classes, interfaces, and nested type literal expressions.
 */
var ApiMember = (function (_super) {
    __extends(ApiMember, _super);
    function ApiMember(options) {
        var _this = _super.call(this, options) || this;
        _this.typeLiteral = undefined;
        var memberSignature = _this.declaration;
        _this.isOptional = !!memberSignature.questionToken;
        // Modifiers
        if (memberSignature.modifiers) {
            for (var _i = 0, _a = memberSignature.modifiers; _i < _a.length; _i++) {
                var modifier = _a[_i];
                if (modifier.kind === ts.SyntaxKind.PublicKeyword) {
                    _this.accessModifier = AccessModifier.Public;
                }
                else if (modifier.kind === ts.SyntaxKind.ProtectedKeyword) {
                    _this.accessModifier = AccessModifier.Protected;
                }
                else if (modifier.kind === ts.SyntaxKind.PrivateKeyword) {
                    _this.accessModifier = AccessModifier.Private;
                }
                else if (modifier.kind === ts.SyntaxKind.StaticKeyword) {
                    _this.isStatic = true;
                }
            }
        }
        if (memberSignature.type && memberSignature.type.kind === ts.SyntaxKind.TypeLiteral) {
            var propertyTypeDeclaration = memberSignature.type;
            var propertyTypeSymbol = TypeScriptHelpers_1.default.getSymbolForDeclaration(propertyTypeDeclaration);
            var typeLiteralOptions = {
                extractor: _this.extractor,
                declaration: propertyTypeDeclaration,
                declarationSymbol: propertyTypeSymbol,
                jsdocNode: propertyTypeDeclaration
            };
            _this.typeLiteral = new ApiStructuredType_1.default(typeLiteralOptions);
            _this.innerItems.push(_this.typeLiteral);
        }
        return _this;
    }
    /**
     * @virtual
     */
    ApiMember.prototype.visitTypeReferencesForApiItem = function () {
        _super.prototype.visitTypeReferencesForApiItem.call(this);
        if (this.declaration.kind !== ts.SyntaxKind.PropertySignature) {
            this.visitTypeReferencesForNode(this.declaration);
        }
    };
    /**
     * Returns a text string such as "someName?: SomeTypeName;", or in the case of a type
     * literal expression, returns a text string such as "someName?:".
     */
    ApiMember.prototype.getDeclarationLine = function (property) {
        if (this.typeLiteral || !!property) {
            var accessModifier = this.accessModifier ? AccessModifier[this.accessModifier].toLowerCase() : undefined;
            var result = accessModifier ? accessModifier + " " : '';
            result += this.isStatic ? 'static ' : '';
            result += property && property.readonly ? 'readonly ' : '';
            result += "" + this.name;
            result += this.isOptional ? '?' : '';
            result += ':';
            result += !this.typeLiteral && property && property.type ? " " + property.type + ";" : '';
            return result;
        }
        else {
            return PrettyPrinter_1.default.getDeclarationSummary(this.declaration);
        }
    };
    return ApiMember;
}(ApiItem_1.default));
exports.default = ApiMember;

//# sourceMappingURL=ApiMember.js.map
