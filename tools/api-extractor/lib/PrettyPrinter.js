"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-bitwise */
var ts = require("typescript");
/**
  * Some helper functions for formatting certain TypeScript Compiler API expressions.
  */
var PrettyPrinter = (function () {
    function PrettyPrinter() {
    }
    /**
      * Used for debugging only.  This dumps the TypeScript Compiler's abstract syntax tree.
      */
    PrettyPrinter.dumpTree = function (node, indent) {
        if (indent === void 0) { indent = ''; }
        var kindName = ts.SyntaxKind[node.kind];
        var trimmedText;
        try {
            trimmedText = node.getText()
                .replace(/[\r\n]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            if (trimmedText.length > 100) {
                trimmedText = trimmedText.substr(0, 97) + '...';
            }
        }
        catch (e) {
            trimmedText = '(error getting text)';
        }
        console.log("" + indent + kindName + ": [" + trimmedText + "]");
        try {
            for (var _i = 0, _a = node.getChildren(); _i < _a.length; _i++) {
                var childNode = _a[_i];
                PrettyPrinter.dumpTree(childNode, indent + '  ');
            }
        }
        catch (e) {
            // sometimes getChildren() throws an exception
        }
    };
    /**
     * Returns a text representation of the enum flags.
     */
    PrettyPrinter.getSymbolFlagsString = function (flags) {
        return PrettyPrinter._getFlagsString(flags, PrettyPrinter._getSymbolFlagString);
    };
    /**
     * Returns a text representation of the enum flags.
     */
    PrettyPrinter.getTypeFlagsString = function (flags) {
        return PrettyPrinter._getFlagsString(flags, PrettyPrinter._getTypeFlagString);
    };
    /**
      * Returns the first line of a potentially nested declaration.
      * For example, for a class definition this might return
      * "class Blah<T> extends BaseClass" without the curly braces.
      * For example, for a function definition, this might return
      * "test(): void;" without the curly braces.
      */
    PrettyPrinter.getDeclarationSummary = function (node) {
        var result = '';
        var previousSyntaxKind = ts.SyntaxKind.Unknown;
        for (var _i = 0, _a = node.getChildren(); _i < _a.length; _i++) {
            var childNode = _a[_i];
            switch (childNode.kind) {
                case ts.SyntaxKind.JSDocComment:
                    break;
                case ts.SyntaxKind.Block:
                    result += ';';
                    break;
                default:
                    if (PrettyPrinter._wantSpaceAfter(previousSyntaxKind)
                        && PrettyPrinter._wantSpaceBefore(childNode.kind)) {
                        result += ' ';
                    }
                    result += childNode.getText();
                    previousSyntaxKind = childNode.kind;
                    break;
            }
        }
        return result;
    };
    /**
     * Throws an exception.  Use this only for unexpected errors, as it may ungracefully terminate the process;
     * ApiItem.reportError() is generally a better option.
     */
    PrettyPrinter.throwUnexpectedSyntaxError = function (errorNode, message) {
        throw new Error(PrettyPrinter.formatFileAndLineNumber(errorNode) + ': ' + message);
    };
    /**
     * Returns a string such as this, based on the context information in the provided node:
     *   "[C:\Folder\File.ts#123]"
     */
    PrettyPrinter.formatFileAndLineNumber = function (node) {
        var sourceFile = node.getSourceFile();
        var lineAndCharacter = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        return "[" + sourceFile.fileName + "#" + lineAndCharacter.line + "]";
    };
    PrettyPrinter._getSymbolFlagString = function (flag) {
        return ts.SymbolFlags[flag];
    };
    PrettyPrinter._getTypeFlagString = function (flag) {
        return ts.TypeFlags[flag];
    };
    PrettyPrinter._getFlagsString = function (flags, func) {
        /* tslint:disable:no-any */
        var result = '';
        var flag = 1;
        for (var bit = 0; bit < 32; ++bit) {
            if (flags & flag) {
                if (result !== '') {
                    result += ', ';
                }
                result += func(flag);
            }
            flag <<= 1;
        }
        return result === '' ? '???' : result;
        /* tslint:enable:no-any */
    };
    PrettyPrinter._wantSpaceAfter = function (syntaxKind) {
        switch (syntaxKind) {
            case ts.SyntaxKind.Unknown:
            case ts.SyntaxKind.OpenParenToken:
            case ts.SyntaxKind.CloseParenToken:
                return false;
        }
        return true;
    };
    PrettyPrinter._wantSpaceBefore = function (syntaxKind) {
        switch (syntaxKind) {
            case ts.SyntaxKind.Unknown:
            case ts.SyntaxKind.OpenParenToken:
            case ts.SyntaxKind.CloseParenToken:
            case ts.SyntaxKind.ColonToken:
            case ts.SyntaxKind.SemicolonToken:
                return false;
        }
        return true;
    };
    return PrettyPrinter;
}());
exports.default = PrettyPrinter;

//# sourceMappingURL=PrettyPrinter.js.map
