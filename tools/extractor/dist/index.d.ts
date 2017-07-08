import { Extractor } from "@microsoft/api-extractor";
import * as ts from "typescript";
export declare class ExtractorTaskClass {
    private projectPath;
    private scriptName;
    protected Extractor: Extractor;
    private errorsCount;
    constructor(projectPath: string);
    private onErrorHandler;
    protected readonly TSCompilerOptions: ts.CompilerOptions;
    protected Analyze(entryFile: string, otherFiles: string[]): void;
    JSONGenerator(jsonLocation: string, entryFile: string, otherFiles?: string[]): void;
    private consoleWrite(...text);
    private warningWrite(...warning);
    private errorWrite(...errors);
    private writeTag();
}
