import * as ts from 'typescript';
import Extractor from '../Extractor';
import ApiItemContainer from './ApiItemContainer';
/**
  * This class is part of the ApiItem abstract syntax tree.  It represents the top-level
  * exports for an Rush package.  This object acts as the root of the Extractor's tree.
  */
export default class ApiPackage extends ApiItemContainer {
    private _exportedNormalizedSymbols;
    private static _getOptions(extractor, rootFile);
    constructor(extractor: Extractor, rootFile: ts.SourceFile);
    /**
     * Finds and returns the original symbol name.
     *
     * For example, suppose a class is defined as "export default class MyClass { }"
     * but exported from the package's index.ts like this:
     *
     *    export { default as _MyClass } from './MyClass';
     *
     * In this example, given the symbol for _MyClass, getExportedSymbolName() will return
     * the string "MyClass".
     */
    tryGetExportedSymbolName(symbol: ts.Symbol): string;
    shouldHaveDocumentation(): boolean;
}
