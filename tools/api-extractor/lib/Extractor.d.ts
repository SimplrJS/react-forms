import * as ts from 'typescript';
import ApiPackage from './definitions/ApiPackage';
import DocItemLoader from './DocItemLoader';
import PackageJsonLookup from './PackageJsonLookup';
export declare type ApiErrorHandler = (message: string, fileName: string, lineNumber: number) => void;
/**
 * Options for Extractor constructor.
 *
 * @public
 */
export interface IExtractorOptions {
    /**
     * Configuration for the TypeScript compiler.  The most important options to set are:
     *
     * - target: ts.ScriptTarget.ES5
     * - module: ts.ModuleKind.CommonJS
     * - moduleResolution: ts.ModuleResolutionKind.NodeJs
     * - rootDir: inputFolder
     */
    compilerOptions: ts.CompilerOptions;
    errorHandler?: ApiErrorHandler;
}
/**
 * Options for Extractor.analyze()
 *
 * @public
 */
export interface IExtractorAnalyzeOptions {
    /**
     * The entry point for the project.  This should correspond to the "main" field
     * from NPM's package.json file.  If it is a relative path, it will be relative to
     * the project folder described by IExtractorAnalyzeOptions.compilerOptions.
     */
    entryPointFile: string;
    /**
     * This can be used to specify other files that should be processed by the TypeScript compiler
     * for some reason, e.g. a "typings/tsd.d.ts" file.  It is NOT necessary to specify files that
     * are explicitly imported/required by the entryPointFile, since the compiler will trace
     * (the transitive closure of) ordinary dependencies.
     */
    otherFiles?: string[];
}
/**
 * The main entry point for the "api-extractor" utility.  The Analyzer object invokes the
 * TypeScript Compiler API to analyze a project, and constructs the ApiItem
 * abstract syntax tree.
 *
 * @public
 */
export default class Extractor {
    readonly errorHandler: ApiErrorHandler;
    typeChecker: ts.TypeChecker;
    package: ApiPackage;
    /**
     * One DocItemLoader is needed per analyzer to look up external API members
     * as needed.
     */
    readonly docItemLoader: DocItemLoader;
    readonly packageJsonLookup: PackageJsonLookup;
    private _compilerOptions;
    private _packageFolder;
    /**
     * The default implementation of ApiErrorHandler, which merely writes to console.log().
     */
    static defaultErrorHandler(message: string, fileName: string, lineNumber: number): void;
    constructor(options: IExtractorOptions);
    /**
     * Getter for the package folder that Extractor is analyzing.
     */
    readonly packageFolder: string;
    /**
     * Analyzes the specified project.
     */
    analyze(options: IExtractorAnalyzeOptions): void;
    /**
     * Reports an error message to the registered ApiErrorHandler.
     */
    reportError(message: string, sourceFile: ts.SourceFile, start: number): void;
    /**
     * Scans for external package api files and loads them into the docItemLoader member before
     * any API analysis begins.
     *
     * @param externalJsonCollectionPath - an absolute path to to the folder that contains all the external
     * api json files.
     * Ex: if externalJsonPath is './resources', then in that folder
     * are 'es6-collections.api.json', etc.
     */
    loadExternalPackages(externalJsonCollectionPath: string): void;
}
