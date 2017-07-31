import { IDocElement, IHrefLinkElement, ICodeLinkElement } from './IDocElement';
import ApiDocumentation from './definitions/ApiDocumentation';
import Token from './Token';
import Tokenizer from './Tokenizer';
export default class DocElementParser {
    /**
     * Used to validate the display text for an \@link tag.  The display text can contain any
     * characters except for certain AEDoc delimiters: "@", "|", "{", "}".
     * This RegExp matches the first bad character.
     * Example: "Microsoft's {spec}" --> "{"
     */
    private static _displayTextBadCharacterRegEx;
    /**
     * Matches a href reference. This is used to get an idea whether a given reference is for an href
     * or an API definition reference.
     *
     * For example, the following would be matched:
     * 'http://'
     * 'https://'
     *
     * The following would not be matched:
     * '@microsoft/sp-core-library:Guid.newGuid'
     * 'Guid.newGuid'
     * 'Guid'
     */
    private static _hrefRegEx;
    static getAsText(collection: IDocElement[], reportError: (message: string) => void): string;
    static makeTextElement(text: string): IDocElement;
    static parse(documentation: ApiDocumentation, tokenizer: Tokenizer): IDocElement[];
    /**
     * This method parses the semantic information in an \@link JSDoc tag, creates and returns a
     * linkDocElement with the corresponding information. If the corresponding inline tag \@link is
     * not formatted correctly an error will be reported.
     *
     * The format for the \@link tag is {\@link URL or API defintion reference | display text}, where
     * the '|' is only needed if the optional display text is given.
     *
     * Examples:
     * \{@link http://microsoft.com | microsoft home \}
     * \{@link http://microsoft.com \}
     * \{@link @microsoft/sp-core-library:Guid.newGuid | new Guid Object \}
     * \{@link @microsoft/sp-core-library:Guid.newGuid \}
     */
    static parseLinkTag(documentation: ApiDocumentation, tokenItem: Token): IHrefLinkElement | ICodeLinkElement;
    /**
     * This method parses the semantic information in an \@inheritdoc JSDoc tag and sets
     * all the relevant documenation properties from the inherited doc onto the documenation
     * of the current api item.
     *
     * The format for the \@inheritdoc tag is {\@inheritdoc scopeName/packageName:exportName.memberName}.
     * For more information on the format see IInheritdocRef.
     */
    static parseInheritDoc(documentation: ApiDocumentation, token: Token, warnings: string[]): void;
}
