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
/* tslint:disable:no-bitwise */
var ts = require("typescript");
var ApiMethod_1 = require("./ApiMethod");
var ApiProperty_1 = require("./ApiProperty");
var ApiItem_1 = require("./ApiItem");
var ApiItemContainer_1 = require("./ApiItemContainer");
var TypeScriptHelpers_1 = require("../TypeScriptHelpers");
var PrettyPrinter_1 = require("../PrettyPrinter");
/**
  * This class is part of the ApiItem abstract syntax tree.  It represents a class,
  * interface, or type literal expression.
  */
var ApiStructuredType = (function (_super) {
    __extends(ApiStructuredType, _super);
    function ApiStructuredType(options) {
        var _this = _super.call(this, options) || this;
        _this._processedMemberNames = new Set();
        _this._setterNames = new Set();
        _this._classLikeDeclaration = options.declaration;
        _this.type = _this.typeChecker.getDeclaredTypeOfSymbol(_this.declarationSymbol);
        if (_this.declarationSymbol.flags & ts.SymbolFlags.Interface) {
            _this.kind = ApiItem_1.ApiItemKind.Interface;
        }
        else if (_this.declarationSymbol.flags & ts.SymbolFlags.TypeLiteral) {
            _this.kind = ApiItem_1.ApiItemKind.TypeLiteral;
        }
        else {
            _this.kind = ApiItem_1.ApiItemKind.Class;
        }
        for (var _i = 0, _a = _this._classLikeDeclaration.members; _i < _a.length; _i++) {
            var memberDeclaration = _a[_i];
            var memberSymbol = TypeScriptHelpers_1.default.tryGetSymbolForDeclaration(memberDeclaration);
            if (memberSymbol) {
                _this._processMember(memberSymbol, memberDeclaration);
            }
            else {
                // If someone put an extra semicolon after their function, we don't care about that
                if (memberDeclaration.kind !== ts.SyntaxKind.SemicolonClassElement) {
                    // If there is some other non-semantic junk, add a warning so we can investigate it
                    _this.reportWarning(PrettyPrinter_1.default.formatFileAndLineNumber(memberDeclaration)
                        + (": No semantic information for \"" + memberDeclaration.getText() + "\""));
                }
            }
        }
        // If there is a getter and no setter, mark it as readonly.
        for (var _b = 0, _c = _this.getSortedMemberItems(); _b < _c.length; _b++) {
            var member = _c[_b];
            var memberSymbol = TypeScriptHelpers_1.default.tryGetSymbolForDeclaration(member.getDeclaration());
            if (memberSymbol && (memberSymbol.flags === ts.SymbolFlags.GetAccessor)) {
                if (!_this._setterNames.has(member.name)) {
                    member.isReadOnly = true;
                }
            }
        }
        // Check for heritage clauses (implements and extends)
        if (_this._classLikeDeclaration.heritageClauses) {
            for (var _d = 0, _e = _this._classLikeDeclaration.heritageClauses; _d < _e.length; _d++) {
                var heritage = _e[_d];
                var typeText = heritage.types && heritage.types.length && heritage.types[0].expression ?
                    heritage.types[0].expression.getText() : undefined;
                if (heritage.token === ts.SyntaxKind.ExtendsKeyword) {
                    _this.extends = typeText;
                }
                else if (heritage.token === ts.SyntaxKind.ImplementsKeyword) {
                    _this.implements = typeText;
                }
            }
        }
        // Check for type parameters
        if (_this._classLikeDeclaration.typeParameters && _this._classLikeDeclaration.typeParameters.length) {
            if (!_this.typeParameters) {
                _this.typeParameters = [];
            }
            for (var _f = 0, _g = _this._classLikeDeclaration.typeParameters; _f < _g.length; _f++) {
                var param = _g[_f];
                _this.typeParameters.push(param.getText());
            }
        }
        // Throw errors for setters that don't have a corresponding getter
        _this._setterNames.forEach(function (setterName) {
            if (!_this.getMemberItem(setterName)) {
                // Normally we treat API design changes as warnings rather than errors.  However,
                // a missing getter is bizarre enough that it's reasonable to assume it's a mistake,
                // not a conscious design choice.
                _this.reportError("The \"" + setterName + "\" property has a setter, but no a getter");
            }
        });
        return _this;
    }
    /**
     * @virtual
     */
    ApiStructuredType.prototype.visitTypeReferencesForApiItem = function () {
        _super.prototype.visitTypeReferencesForApiItem.call(this);
        // Collect type references from the base classes
        if (this._classLikeDeclaration && this._classLikeDeclaration.heritageClauses) {
            for (var _i = 0, _a = this._classLikeDeclaration.heritageClauses; _i < _a.length; _i++) {
                var clause = _a[_i];
                this.visitTypeReferencesForNode(clause);
            }
        }
    };
    /**
      * Returns a line of text such as "class MyClass extends MyBaseClass", excluding the
      * curly braces and body.  The name "MyClass" will be the public name seend by external
      * callers, not the declared name of the class; @see ApiItem.name documentation for details.
      */
    ApiStructuredType.prototype.getDeclarationLine = function () {
        var result = '';
        if (this.kind !== ApiItem_1.ApiItemKind.TypeLiteral) {
            result += (this.declarationSymbol.flags & ts.SymbolFlags.Interface)
                ? 'interface ' : 'class ';
            result += this.name;
            if (this._classLikeDeclaration.typeParameters) {
                result += '<';
                result += this._classLikeDeclaration.typeParameters
                    .map(function (param) { return param.getText(); })
                    .join(', ');
                result += '>';
            }
            if (this._classLikeDeclaration.heritageClauses) {
                result += ' ';
                result += this._classLikeDeclaration.heritageClauses
                    .map(function (clause) { return clause.getText(); })
                    .join(', ');
            }
        }
        return result;
    };
    ApiStructuredType.prototype._processMember = function (memberSymbol, memberDeclaration) {
        if (memberDeclaration.modifiers) {
            for (var i = 0; i < memberDeclaration.modifiers.length; i++) {
                var modifier = memberDeclaration.modifiers[i];
                if (modifier.kind === ts.SyntaxKind.PrivateKeyword) {
                    return;
                }
            }
        }
        if (this._processedMemberNames.has(memberSymbol.name)) {
            if (memberSymbol.flags === ts.SymbolFlags.SetAccessor) {
                // In case of setters, just add them to a list to check later if they have a getter
                this._setterNames.add(memberSymbol.name);
            }
            // Throw an error for duplicate names, because we use names as identifiers
            // @todo #261549 Define an AEDoc tag to allow defining an identifier for overloaded methods eg. @overload method2
            return;
        }
        // Proceed to add the member
        this._processedMemberNames.add(memberSymbol.name);
        var memberOptions = {
            extractor: this.extractor,
            declaration: memberDeclaration,
            declarationSymbol: memberSymbol,
            jsdocNode: memberDeclaration
        };
        if (memberSymbol.flags & (ts.SymbolFlags.Method |
            ts.SymbolFlags.Constructor |
            ts.SymbolFlags.Signature |
            ts.SymbolFlags.Function)) {
            this.addMemberItem(new ApiMethod_1.default(memberOptions));
        }
        else if (memberSymbol.flags & (ts.SymbolFlags.Property |
            ts.SymbolFlags.GetAccessor)) {
            this.addMemberItem(new ApiProperty_1.default(memberOptions));
        }
        else {
            this.reportWarning("Unsupported member: " + memberSymbol.name);
        }
    };
    return ApiStructuredType;
}(ApiItemContainer_1.default));
exports.default = ApiStructuredType;

//# sourceMappingURL=ApiStructuredType.js.map
