import * as React from "react";
import { FieldStoreProps } from "../contracts/field";

export const FIELDS_GROUP_SEPARATOR = ".";

export namespace FormStoreHelpers {
    /**
     * Constructs field id from given fieldName and an optional fieldsGroupIdkds
     *
     * @param {string} fieldName
     * @param {string} [fieldsGroupId]
     * @returns Constructed field id
     *
     * @memberOf FormStore
     */
    export function GetFieldId(fieldName: string, fieldsGroupId?: string): string {
        if (fieldsGroupId != null) {
            return `${fieldsGroupId}${FIELDS_GROUP_SEPARATOR}${fieldName}`;
        }

        return fieldName;
    }

    export function GetFieldsGroupId(name: string, parentId?: string): string {
        if (parentId != null) {
            return `${parentId}${FIELDS_GROUP_SEPARATOR}${name}`;
        }

        return name;
    }

    export function GetFieldsArrayId(name: string, arrayKey: string, parentId?: string): string {
        return GetFieldsGroupId(`${name}${arrayKey}`, parentId);
    }

    export function ArrayUnique<T>(array: T[], concat: boolean = true): T[] {
        const result = concat ? array.concat() : array;
        for (let i = 0; i < result.length; ++i) {
            for (let j = i + 1; j < result.length; ++j) {
                if (result[i] === result[j]) {
                    result.splice(j--, 1);
                }
            }
        }
        return result;
    }

    export function RemoveValues<T>(array: T[], valuesToRemove: T[], concat: boolean = true): T[] {
        const result = concat ? array.concat() : array;
        for (const value of valuesToRemove) {
            let index;
            while ((index = result.indexOf(value)) !== -1) {
                result.splice(index, 1);
            }
        }
        return result;
    }

    export function PropsEqual(
        newProps: FieldStoreProps & { [key: string]: any },
        oldProps: FieldStoreProps & { [key: string]: any }
    ): boolean {
        const newKeys = Object.keys(newProps);
        const oldKeys = Object.keys(oldProps);

        if (newKeys.length !== oldKeys.length) {
            return false;
        }
        const childrenKey = "children";
        let allKeys = ArrayUnique(newKeys.concat(oldKeys), false);
        allKeys = RemoveValues(allKeys, [childrenKey], false);

        // Custom props diff, to have most efficient diffing

        // First, check top level properties
        for (const key of allKeys) {
            const newValue = newProps[key];
            const oldValue = oldProps[key];

            const newValueType = typeof newValue;
            const oldValueType = typeof oldValue;

            if (newValueType !== oldValueType) {
                return false;
            }

            if (newValueType === "object" || newValueType === "function") {
                if (!DeepCompare(newValue, oldValue)) {
                    return false;
                }
            } else if (newValue !== oldValue) {
                return false;
            }
        }

        const newChildrenValue = newProps[childrenKey] as React.ReactNode | undefined;
        const oldChildrenValue = oldProps[childrenKey] as React.ReactNode | undefined;

        const newChildren = React.Children.toArray(newChildrenValue);
        const oldChildren = React.Children.toArray(oldChildrenValue);

        if (newChildren.length !== oldChildren.length) {
            return false;
        }

        // For each newChildren
        for (const child of newChildren) {
            // If a child is a text component and no old child is equal to it
            if (typeof child === "string" && !oldChildren.some(x => x === child)) {
                // Props have changed
                return false;
            }

            const newChildElement = child as React.ReactElement<any>;

            // Try to find best a match for an old child in the newChildren array
            const oldChildElement = oldChildren.find(oldChild => {
                // String case has been checked before
                if (typeof oldChild !== "string") {
                    const element = oldChild as React.ReactElement<any>;
                    // If type and key properties match
                    // Children should be the same
                    if (element.type === newChildElement.type && element.key === newChildElement.key) {
                        return true;
                    }
                }
                // Return false explicitly by default
                return false;
            }) as React.ReactElement<any> | undefined;

            // If oldChildElement was found and its props are different
            if (oldChildElement != null && !DeepCompare(newChildElement.props, oldChildElement.props)) {
                // Props are not the same
                return false;
            }
        }
        // Props are equal
        return true;
    }

    // tslint:disable
    export function DeepCompare(...args: any[]): boolean {
        var i, l, leftChain: any, rightChain: any;
        function Compare2Objects(x: any, y: any) {
            var p;

            // remember that NaN === NaN returns false
            // and isNaN(undefined) returns true
            if (isNaN(x) && isNaN(y) && typeof x === "number" && typeof y === "number") {
                return true;
            }

            // Compare primitives and functions.
            // Check if both arguments link to the same object.
            // Especially useful on the step where we compare prototypes
            if (x === y) {
                return true;
            }

            // Works in case when functions are created in constructor.
            // Comparing dates is a common scenario. Another built-ins?
            // We can even handle functions passed across iframes
            if (
                (typeof x === "function" && typeof y === "function") ||
                (x instanceof Date && y instanceof Date) ||
                (x instanceof RegExp && y instanceof RegExp) ||
                (x instanceof String && y instanceof String) ||
                (x instanceof Number && y instanceof Number)
            ) {
                return x.toString() === y.toString();
            }

            // At last checking prototypes as good as we can
            if (!(x instanceof Object && y instanceof Object)) {
                return false;
            }

            if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
                return false;
            }

            if (x.constructor !== y.constructor) {
                return false;
            }

            if (x.prototype !== y.prototype) {
                return false;
            }

            // Check for infinitive linking loops
            if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
                return false;
            }

            // Quick checking of one object being a subset of another.
            // todo: cache the structure of arguments[0] for performance
            for (p in y) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                } else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }
            }

            // tslint:disable-next-line:forin
            for (p in x) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                } else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }

                switch (typeof x[p]) {
                    case "object":
                    case "function":
                        leftChain.push(x);
                        rightChain.push(y);

                        if (!Compare2Objects(x[p], y[p])) {
                            return false;
                        }

                        leftChain.pop();
                        rightChain.pop();
                        break;

                    default:
                        if (x[p] !== y[p]) {
                            return false;
                        }
                        break;
                }
            }
            return true;
        }

        if (args.length < 1) {
            //Die silently? Don't know how to handle such case, please help...
            return true;
            // throw "Need two or more arguments to compare";
        }

        for (i = 1, l = args.length; i < l; i++) {
            //Todo: this can be cached
            leftChain = [];
            rightChain = [];

            if (!Compare2Objects(args[0], args[i])) {
                return false;
            }
        }
        return true;
    }
    // tslint:enable
}
