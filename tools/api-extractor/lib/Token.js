"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Allowed Token types.
 */
var TokenType;
(function (TokenType) {
    /**
     * A Token that contains only text.
     */
    TokenType[TokenType["Text"] = 0] = "Text";
    /**
     * A Token representing an AEDoc block tag.
     * Example: \@public, \@remarks, etc.
     */
    TokenType[TokenType["BlockTag"] = 1] = "BlockTag";
    /**
     * A Token representing an AEDoc inline tag.  Inline tags must be enclosed in
     * curly braces, which may include parameters.
     *
     * Example:
     * \{@link http://microosft.com | microsoft home \}
     * \{@inheritdoc  @ microsoft/sp-core-library:Guid.newGuid \}
     */
    TokenType[TokenType["InlineTag"] = 2] = "InlineTag";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
/**
 * A structured object created from a doc comment string within an AEDoc comment block.
 */
var Token = (function () {
    function Token(type, tag, text) {
        this._type = type;
        this._tag = tag ? tag : '';
        this._text = text ? this._unescape(text) : '';
        return this;
    }
    /**
     * Determines if the type is not what we expect.
     */
    Token.prototype.requireType = function (type) {
        if (this._type !== type) {
            throw new Error("Encountered a token of type \"" + this._type + "\" when expecting \"" + type + "\"");
        }
    };
    Object.defineProperty(Token.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "tag", {
        get: function () {
            return this._tag;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "text", {
        get: function () {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Token.prototype._unescape = function (text) {
        return text.replace('\\@', '@').replace('\\{', '{').replace('\\\\', '\\').replace('\\}', '}');
    };
    return Token;
}());
exports.default = Token;

//# sourceMappingURL=Token.js.map
