/* eslint-disable */

export interface JsonBaseProps<TValue = JsonType> {
    value: TValue;
    depth: number;
}

export interface JsonObject {
    [key: string]: JsonType;
}
export interface JsonArray extends Array<JsonType> {}
// tslint:disable-next-line ban-types
export type JsonNull = null | Function;
export type JsonNumber = number | bigint;
export type JsonString = string;
export type JsonBoolean = boolean;

export type JsonType = JsonObject | JsonArray | JsonNull | JsonNumber | JsonString | JsonBoolean;
