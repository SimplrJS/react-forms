import ApiItem, { IApiItemOptions } from './ApiItem';
/**
  * This is an abstract base class for ApiPackage, ApiEnum, and ApiStructuredType,
  * which all act as containers for other ApiItem definitions.
  */
declare abstract class ApiItemContainer extends ApiItem {
    private _memberItems;
    constructor(options: IApiItemOptions);
    /**
     * Find a member in this namespace by name and return it if found.
     *
     * @param memberName - the name of the exported ApiItem
     */
    getMemberItem(memberName: string): ApiItem;
    /**
     * Return a list of the child items for this container, sorted alphabetically.
     */
    getSortedMemberItems(): ApiItem[];
    /**
     * Add a child item to the container.
     */
    protected addMemberItem(apiItem: ApiItem): void;
    /**
     * @virtual
     */
    visitTypeReferencesForApiItem(): void;
}
export default ApiItemContainer;
