"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Whether the function is public, private, or protected.
 */
var AccessModifier;
(function (AccessModifier) {
    AccessModifier[AccessModifier["public"] = 0] = "public";
    AccessModifier[AccessModifier["private"] = 1] = "private";
    AccessModifier[AccessModifier["protected"] = 2] = "protected";
    /**
     * Exmpty string, no access modifier.
     */
    AccessModifier[AccessModifier[""] = 3] = "";
})(AccessModifier = exports.AccessModifier || (exports.AccessModifier = {}));

//# sourceMappingURL=IDocItem.js.map
