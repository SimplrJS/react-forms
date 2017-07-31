import { ApiItemKind } from '../definitions/ApiItem';
/**
 * Supports the conversion between ApiItems that are loaded from ApiItem to JSON notation
 * and vice versa.
 */
export default class ApiJsonFile {
    private static _KIND_CONSTRUCTOR;
    private static _KIND_CLASS;
    private static _KIND_ENUM;
    private static _KIND_ENUM_VALUE;
    private static _KIND_INTERFACE;
    private static _KIND_FUNCTION;
    private static _KIND_PACKAGE;
    private static _KIND_PROPERTY;
    private static _KIND_METHOD;
    private static _KIND_NAMESPACE;
    private static _KIND_MODULEVARIABLE;
    /**
     * Uses the lowercase string that represents 'kind' in an API JSON file, and
     * converts it to an ApiItemKind enum value.
     * There are two cases we do not include here, (Parameter and StructuredType),
     * this is intential as we do not expect to be loading these kind of JSON object
     * from file.
     */
    static convertJsonToKind(jsonItemKind: string): ApiItemKind;
    /**
     * Converts the an ApiItemKind into a lower-case string that is written to API JSON files.
     */
    static convertKindToJson(apiItemKind: ApiItemKind): string;
}
