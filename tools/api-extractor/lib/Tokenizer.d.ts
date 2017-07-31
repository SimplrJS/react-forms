import Token from './Token';
/**
 * Handles the tokenization of an AEDoc comment.
 */
export default class Tokenizer {
    /**
     * Match AEDoc block tags and inline tags
     * Example "@a @b@c d@e @f {whatever} {@link a} { @something } \@g" => ["@a", "@f", "{@link a}", "{ @something }"]
     */
    private static _aedocTagsRegex;
    /**
     * List of Tokens that have been tokenized.
     */
    private _tokenStream;
    private _reportError;
    constructor(docs: string, reportError: (message: string) => void);
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
    protected _tokenizeDocs(docs: string): Token[];
    /**
     * Parse an inline tag and returns the Token for it if itis a valid inline tag.
     * Example '{@link https://bing.com | Bing}' => '{type: 'Inline', tag: '@link', text: 'https://bing.com  | Bing'}'
     */
    protected _tokenizeInline(docEntry: string): Token;
    peekToken(): Token;
    getToken(): Token;
    /**
     * Trims whitespaces on either end of the entry (which is just a string within the doc comments),
     * replaces \r and \n's with single whitespace, and removes empty entries.
     *
     * @param docEntries - Array of doc strings to be santitized
     */
    private _sanitizeDocEntries(docEntries);
}
