// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import ApiItem, { IApiItemOptions } from './ApiItem';

/**
  * This is an abstract base class for ApiPackage, ApiEnum, and ApiStructuredType,
  * which all act as containers for other ApiItem definitions.
  */
abstract class ApiItemContainer extends ApiItem {
  private _memberItems: Map<string, ApiItem> = new Map<string, ApiItem>();

  constructor(options: IApiItemOptions) {
    super(options);
  }

  /**
   * Find a member in this namespace by name and return it if found.
   *
   * @param memberName - the name of the exported ApiItem
   */
  public getMemberItem(memberName: string): ApiItem {
    return this._memberItems.get(memberName);
  }

  /**
   * Return a list of the child items for this container, sorted alphabetically.
   */
  public getSortedMemberItems(): ApiItem[] {
    const apiItems: ApiItem[] = [];
    this._memberItems.forEach((apiItem: ApiItem) => {
      apiItems.push(apiItem);
    });

    return apiItems
      .sort((a: ApiItem, b: ApiItem) => a.name.localeCompare(b.name));
  }

  /**
   * Add a child item to the container.
   */
  protected addMemberItem(apiItem: ApiItem): void {
    if (apiItem.hasAnyIncompleteTypes()) {
      this.reportWarning(`${apiItem.name} has incomplete type information`);
    } else {
      this.innerItems.push(apiItem);
      this._memberItems.set(apiItem.name, apiItem);
      apiItem.notifyAddedToContainer(this);
    }
  }

  /**
   * @virtual
   */
  public visitTypeReferencesForApiItem(): void {
    super.visitTypeReferencesForApiItem();

    this._memberItems.forEach((apiItem) => {
      apiItem.visitTypeReferencesForApiItem();
    });
  }
}

export default ApiItemContainer;
