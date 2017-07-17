import ApiItem, { ApiItemKind } from './definitions/ApiItem';
import { ReleaseTag } from './definitions/ApiDocumentation';
import { IDocElement, IParam } from './IDocElement';
import { IDocItem } from './IDocItem';
/**
 * A class to abstract away the difference between an item from our public API that could be
 * represented by either an ApiItem or an IDocItem that is retrieved from a JSON file.
 */
export default class ResolvedApiItem {
    kind: ApiItemKind;
    summary: IDocElement[];
    remarks: IDocElement[];
    deprecatedMessage: IDocElement[];
    releaseTag: ReleaseTag;
    isBeta: boolean;
    params: {
        [name: string]: IParam;
    };
    returnsMessage: IDocElement[];
    /**
     * This property will either be an ApiItem or undefined.
     */
    apiItem: ApiItem;
    /**
     * A function to abstract the construction of a ResolvedApiItem instance
     * from an ApiItem.
     */
    static createFromApiItem(apiItem: ApiItem): ResolvedApiItem;
    /**
     * A function to abstract the construction of a ResolvedApiItem instance
     * from a JSON object that symbolizes an IDocItem.
     */
    static createFromJson(docItem: IDocItem): ResolvedApiItem;
    private constructor();
}
