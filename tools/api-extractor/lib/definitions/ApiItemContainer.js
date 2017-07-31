"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ApiItem_1 = require("./ApiItem");
/**
  * This is an abstract base class for ApiPackage, ApiEnum, and ApiStructuredType,
  * which all act as containers for other ApiItem definitions.
  */
var ApiItemContainer = (function (_super) {
    __extends(ApiItemContainer, _super);
    function ApiItemContainer(options) {
        var _this = _super.call(this, options) || this;
        _this._memberItems = new Map();
        return _this;
    }
    /**
     * Find a member in this namespace by name and return it if found.
     *
     * @param memberName - the name of the exported ApiItem
     */
    ApiItemContainer.prototype.getMemberItem = function (memberName) {
        return this._memberItems.get(memberName);
    };
    /**
     * Return a list of the child items for this container, sorted alphabetically.
     */
    ApiItemContainer.prototype.getSortedMemberItems = function () {
        var apiItems = [];
        this._memberItems.forEach(function (apiItem) {
            apiItems.push(apiItem);
        });
        return apiItems
            .sort(function (a, b) { return a.name.localeCompare(b.name); });
    };
    /**
     * Add a child item to the container.
     */
    ApiItemContainer.prototype.addMemberItem = function (apiItem) {
        if (apiItem.hasAnyIncompleteTypes()) {
            this.reportWarning(apiItem.name + " has incomplete type information");
        }
        else {
            this.innerItems.push(apiItem);
            this._memberItems.set(apiItem.name, apiItem);
            apiItem.notifyAddedToContainer(this);
        }
    };
    /**
     * @virtual
     */
    ApiItemContainer.prototype.visitTypeReferencesForApiItem = function () {
        _super.prototype.visitTypeReferencesForApiItem.call(this);
        this._memberItems.forEach(function (apiItem) {
            apiItem.visitTypeReferencesForApiItem();
        });
    };
    return ApiItemContainer;
}(ApiItem_1.default));
exports.default = ApiItemContainer;

//# sourceMappingURL=ApiItemContainer.js.map
