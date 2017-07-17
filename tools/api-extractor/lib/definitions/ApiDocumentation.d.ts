/// <reference types="es6-collections" />
import ApiPackage from './ApiPackage';
import { IDocElement, IParam, ICodeLinkElement } from '../IDocElement';
import ApiDefinitionReference from '../ApiDefinitionReference';
import Token from '../Token';
import Tokenizer from '../Tokenizer';
import Extractor from '../Extractor';
import ResolvedApiItem from '../ResolvedApiItem';
/**
  * A "release tag" is an AEDoc tag which indicates whether an ApiItem definition
  * is considered Public API for third party developers, as well as its release
  * stage (alpha, beta, etc).
  * @see https://onedrive.visualstudio.com/DefaultCollection/SPPPlat/_git/sp-client
  *      ?path=/common/docs/ApiPrinciplesAndProcess.md
  */
export declare enum ReleaseTag {
    /**
     * No release tag was specified in the AEDoc summary.
     */
    None = 0,
    /**
     * Indicates that an API item is meant only for usage by other NPM packages from the same
     * maintainer. Third parties should never use "internal" APIs. (To emphasize this, their
     * names are prefixed by underscores.)
     */
    Internal = 1,
    /**
     * Indicates that an API item is eventually intended to be public, but currently is in an
     * early stage of development. Third parties should not use "alpha" APIs.
     */
    Alpha = 2,
    /**
     * Indicates that an API item has been released in an experimental state. Third parties are
     * encouraged to try it and provide feedback. However, a "beta" API should NOT be used
     * in production.
     */
    Beta = 3,
    /**
     * Indicates that an API item has been officially released. It is part of the supported
     * contract (e.g. SemVer) for a package.
     */
    Public = 4,
}
/**
 * A dependency for ApiDocumentation constructor that abstracts away the function
 * of resolving an API definition reference.
 *
 * @internalremarks reportError() will be called if the apiDefinitionRef is to a non local
 * item and the package of that non local item can not be found.
 * If there is no package given and an  item can not be found we will return undefined.
 * Once we support local references, we can be sure that reportError will only be
 * called once if the item can not be found (and undefined will be retured by the reference
 * function).
 */
export interface IReferenceResolver {
    resolve(apiDefinitionRef: ApiDefinitionReference, apiPackage: ApiPackage, warnings: string[]): ResolvedApiItem;
}
export default class ApiDocumentation {
    /**
     * Match AEDoc block tags and inline tags
     * Example "@a @b@c d@e @f {whatever} {@link a} { @something } \@g" => ["@a", "@f", "{@link a}", "{ @something }"]
     */
    static readonly _aedocTagsRegex: RegExp;
    private static _allowedRegularAedocTags;
    private static _allowedInlineAedocTags;
    /**
     * The original AEDoc comment.
     *
     * Example: "This is a summary. \{\@link a\} \@remarks These are remarks."
     */
    originalAedoc: string;
    /**
     * The docComment text string split into an array of ITokenItems.  The tokens are essentially either
     * AEDoc tags (which start with the "@" character) or substrings containing the
     * remaining text.  The array can be empty, but not undefined.
     * Example:
     * docComment       = "Example Function\n@returns the number of items\n@internal  "
     * docCommentTokens = [
     *  {tokenType: 'text', parameter: 'Example Function\n'},
     *  {tokenType: '\@returns', parameter: ''}
     *  {tokenType: 'text', parameter: 'the number of items\n'}
     *  {tokenType: '@internal', parameter: ''}
     * ];
     */
    docCommentTokens: Token[];
    /**
    * docCommentTokens that are parsed into Doc Elements.
    */
    summary: IDocElement[];
    deprecatedMessage: IDocElement[];
    remarks: IDocElement[];
    returnsMessage: IDocElement[];
    parameters: {
        [name: string]: IParam;
    };
    /**
     * A list of \@link elements to be post-processed after all basic documentation has been created
     * for all items in the project.  We save the processing for later because we need ReleaseTag
     * information before we can determine whether a link element is valid.
     * Example: If API item A has a \@link in its documentation to API item B, then B must not
     * have ReleaseTag.Internal.
     */
    incompleteLinks: ICodeLinkElement[];
    /**
     * A list of 'Token' objects that have been recognized as \@inheritdoc tokens that will be processed
     * after the basic documentation for all API items is complete. We postpone the processing
     * because we need ReleaseTag information before we can determine whether an \@inheritdoc token
     * is valid.
     */
    incompleteInheritdocs: Token[];
    /**
     * A "release tag" is an AEDoc tag which indicates whether this definition
     * is considered Public API for third party developers, as well as its release
     * stage (alpha, beta, etc).
     */
    releaseTag: ReleaseTag;
    /**
     * True if the "@preapproved" tag was specified.
     * Indicates that this internal API is exempt from further reviews.
     */
    preapproved?: boolean;
    deprecated?: string;
    internalremarks?: string;
    paramDocs?: Map<string, string>;
    returns?: string;
    see?: string[];
    isDocBeta?: boolean;
    isDocInherited?: boolean;
    isDocInheritedDeprecated?: boolean;
    isOverride?: boolean;
    hasReadOnlyTag?: boolean;
    warnings: string[];
    /**
     * A function type interface that abstracts away resolving
     * an API definition reference to an item that has friendly
     * accessible ApiItem properties.
     *
     * Ex: this is useful in the case of parsing inheritdoc expressions,
     * in the sense that we do not know if we the inherited documentation
     * is coming from an ApiItem or a IDocItem.
     */
    referenceResolver: IReferenceResolver;
    /**
     * We need the extractor to access the package that this ApiItem
     * belongs to in order to resolve references.
     */
    extractor: Extractor;
    /**
     * True if any errors were encountered while parsing the AEDoc tokens.
     * This is used to suppress other "collateral damage" errors, e.g. if "@public" was
     * misspelled then we shouldn't also complain that the "@public" tag is missing.
     */
    failedToParse: boolean;
    readonly reportError: (message: string) => void;
    constructor(docComment: string, referenceResolver: IReferenceResolver, extractor: Extractor, errorLogger: (message: string) => void, warnings: string[]);
    /**
     * Executes the implementation details involved in completing the documentation initialization.
     * Currently completes link and inheritdocs.
     */
    completeInitialization(warnings: string[]): void;
    protected _parseDocs(): void;
    protected _parseParam(tokenizer: Tokenizer): IParam;
    /**
     * A processing of linkDocElements that refer to an ApiDefinitionReference. This method
     * ensures that the reference is to an API item that is not 'Internal'.
     */
    private _completeLinks();
    /**
     * A processing of inheritdoc 'Tokens'. This processing occurs after we have created documentation
     * for all API items.
     */
    private _completeInheritdocs(warnings);
    private _reportBadAedocTag(token);
    private _checkInheritDocStatus(aedocTag);
}
