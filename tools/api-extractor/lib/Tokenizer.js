"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var Token_1 = require("./Token");
var TypeScriptHelpers_1 = require("./TypeScriptHelpers");
/**
 * Handles the tokenization of an AEDoc comment.
 */
var Tokenizer = (function () {
    function Tokenizer(docs, reportError) {
        this._reportError = reportError;
        this._tokenStream = this._tokenizeDocs(docs);
    }
    /**
     * Converts a doc comment string into an array of Tokens. This processing is done so that docs
     * can be processed more strictly.
     * Example: "This is an AEDoc description with a {@link URL} and more text. \@remarks example \@public"
     * => [
     *  {tokenType: 'text', parameter: 'This is an AEDoc description with a'},
     *  {tokenType: '@link', parameter: 'URL'},
     *  {tokenType: '\@remarks', parameter: ''},
     *  {tokenType: 'text', parameter: 'example'},
     *  {tokenType: '\@public', parameter: ''}
     * ]
     */
    Tokenizer.prototype._tokenizeDocs = function (docs) {
        if (!docs) {
            return;
        }
        var docEntries = TypeScriptHelpers_1.default.splitStringWithRegEx(docs, Tokenizer._aedocTagsRegex);
        var sanitizedTokens = this._sanitizeDocEntries(docEntries); // remove white space and empty entries
        // process each sanitized doc string to a Token object
        var tokens = [];
        var value;
        for (var i = 0; i < sanitizedTokens.length; i++) {
            var token = void 0;
            value = sanitizedTokens[i];
            if (value.charAt(0) === '@') {
                token = new Token_1.default(Token_1.TokenType.BlockTag, value);
            }
            else if (value.charAt(0) === '{' && value.charAt(value.length - 1) === '}') {
                token = this._tokenizeInline(value); // Can return undefined if invalid inline tag
            }
            else {
                token = new Token_1.default(Token_1.TokenType.Text, '', value);
            }
            if (token) {
                tokens.push(token);
            }
        }
        return tokens;
    };
    /**
     * Parse an inline tag and returns the Token for it if itis a valid inline tag.
     * Example '{@link https://bing.com | Bing}' => '{type: 'Inline', tag: '@link', text: 'https://bing.com  | Bing'}'
     */
    Tokenizer.prototype._tokenizeInline = function (docEntry) {
        if (docEntry.charAt(0) !== '{' || docEntry.charAt(docEntry.length - 1) !== '}') {
            // This is a program bug, since _tokenizeDocs() checks this condition before calling
            this._reportError('The AEDoc tag is not enclosed in "{" and "}"');
        }
        var tokenContent = docEntry.slice(1, docEntry.length - 1).trim();
        if (tokenContent.charAt(0) !== '@') {
            // This is a program bug, since it should have already been validated by the Tokenizer
            this._reportError('The AEDoc tag does not start with "@".');
            return;
        }
        var unescapedCurlyBraces = /([^\\])({|}[^$])/gi;
        if (unescapedCurlyBraces.test(tokenContent)) {
            this._reportError("An unescaped \"{\" or \"}\" character was found inside an inline tag. " +
                'Use a backslash ("\\") to escape curly braces.');
            return;
        }
        // Split the inline tag content with whitespace
        // Example: '@link    https://bing.com  |  Bing' => ['@link', 'https://bing.com', '|', 'Bing']
        var tokenChunks = tokenContent.split(/\s+/gi);
        if (tokenChunks[0] === '@link') {
            if (tokenChunks.length < 2) {
                this._reportError('The {@link} tag must include a URL or API item reference');
                return;
            }
            tokenChunks.shift(); // Gets rid of '@link'
            var token = new Token_1.default(Token_1.TokenType.InlineTag, '@link', tokenChunks.join(' '));
            return token;
        }
        else if (tokenChunks[0] === '@inheritdoc') {
            tokenChunks.shift(); // Gets rid of '@inheritdoc'
            var token = new Token_1.default(Token_1.TokenType.InlineTag, '@inheritdoc', tokenChunks.join(' '));
            return token;
        }
        // This is a program bug
        this._reportError('Invalid call to _tokenizeInline()');
        return;
    };
    Tokenizer.prototype.peekToken = function () {
        return (!this._tokenStream || this._tokenStream.length === 0) ? undefined : this._tokenStream[0];
    };
    Tokenizer.prototype.getToken = function () {
        return (!this._tokenStream || this._tokenStream.length === 0) ? undefined : this._tokenStream.shift();
    };
    /**
     * Trims whitespaces on either end of the entry (which is just a string within the doc comments),
     * replaces \r and \n's with single whitespace, and removes empty entries.
     *
     * @param docEntries - Array of doc strings to be santitized
     */
    Tokenizer.prototype._sanitizeDocEntries = function (docEntries) {
        var result = [];
        for (var _i = 0, docEntries_1 = docEntries; _i < docEntries_1.length; _i++) {
            var entry = docEntries_1[_i];
            entry = entry.replace(/\s+/g, ' ');
            entry = entry.trim();
            if (entry === '') {
                continue;
            }
            result.push(entry);
        }
        return result;
    };
    /**
     * Match AEDoc block tags and inline tags
     * Example "@a @b@c d@e @f {whatever} {@link a} { @something } \@g" => ["@a", "@f", "{@link a}", "{ @something }"]
     */
    Tokenizer._aedocTagsRegex = /{\s*@(\\{|\\}|[^{}])*}|(?:^|\s)(\@[a-z_]+)(?=\s|$)/gi;
    return Tokenizer;
}());
exports.default = Tokenizer;

//# sourceMappingURL=Tokenizer.js.map
