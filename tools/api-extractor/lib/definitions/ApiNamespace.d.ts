import { IApiItemOptions } from './ApiItem';
import ApiItemContainer from './ApiItemContainer';
/**
  * This class is part of the ApiItem abstract syntax tree. It represents exports of
  * a namespace, the exports can be module variable constants of type "string", "boolean" or "number".
  * An ApiNamespace is defined using TypeScript's "namespace" keyword.
  *
  * @remarks A note about terminology:
  * - EcmaScript "namespace modules" are not conventional namespaces; their semantics are
  * more like static classes in C# or Java.
  * - API Extractor's support for namespaces is currently limited to representing tables of
  * constants, and has a benefit of enabling WebPack to avoid bundling unused values.
  * - We currently still recommend to use static classes for utility libraries, since this
  * provides getters/setters, public/private, and some other structure missing from namespaces.
  */
export default class ApiNamespace extends ApiItemContainer {
    private _exportedNormalizedSymbols;
    constructor(options: IApiItemOptions);
}
