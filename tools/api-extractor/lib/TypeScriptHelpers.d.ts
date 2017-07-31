import * as ts from 'typescript';
export default class TypeScriptHelpers {
    /**
     * Splits by the characters '\r\n'.
     */
    static newLineRegEx: RegExp;
    /**
     * Start sequence is '/**'.
     */
    static jsdocStartRegEx: RegExp;
    /**
     * End sequence is '*\/'.
     */
    static jsdocEndRegEx: RegExp;
    /**
     * Intermediate lines of JSDoc comment character.
     */
    static jsdocIntermediateRegEx: RegExp;
    /**
     * Returns the Symbol for the provided Declaration.  This is a workaround for a missing
     * feature of the TypeScript Compiler API.   It is the only apparent way to reach
     * certain data structures, and seems to always work, but is not officially documented.
     *
     * @returns The associated Symbol.  If there is no semantic information (e.g. if the
     * declaration is an extra semicolon somewhere), then "undefined" is returned.
     */
    static tryGetSymbolForDeclaration(declaration: ts.Declaration): ts.Symbol;
    /**
     * Same semantics as tryGetSymbolForDeclaration(), but throws an exception if the symbol
     * cannot be found.
     */
    static getSymbolForDeclaration(declaration: ts.Declaration): ts.Symbol;
    /**
     * Returns the JSDoc comments associated with the specified node, if any.
     *
     * Example:
     * "This \n is \n a comment" from "\/** This\r\n* is\r\n* a comment *\/
     */
    static getJsdocComments(node: ts.Node, errorLogger: (message: string) => void): string;
    /**
     * Helper function to remove the comment stars ('/**'. '*', '/*) from lines of comment text.
     *
     * Example:
     * ["\/**", "*This \n", "*is \n", "*a comment", "*\/"] to "This \n is \n a comment"
     */
    static removeJsdocSequences(textLines: string[]): string;
    /**
     * Similar to calling string.split() with a RegExp, except that the delimiters
     * are included in the result.
     *
     * Example: _splitStringWithRegEx("ABCDaFG", /A/gi) -> [ "A", "BCD", "a", "FG" ]
     * Example: _splitStringWithRegEx("", /A/gi) -> [ ]
     * Example: _splitStringWithRegEx("", /A?/gi) -> [ "" ]
     */
    static splitStringWithRegEx(text: string, regExp: RegExp): string[];
    /**
     * Extracts the body of a TypeScript comment and returns it.
     */
    static extractCommentContent(text: string): string;
}
