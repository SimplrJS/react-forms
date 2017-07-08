import * as gulp from "gulp";
import { Extractor, ApiJsonGenerator } from "@microsoft/api-extractor";
import * as ts from "typescript";

export class ExtractorTaskClass {
    protected Extractor: Extractor;

    constructor(private projectPath: string) {
        this.Extractor = new Extractor({
            compilerOptions: this.TSCompilerOptions
        });
    }

    protected get TSCompilerOptions(): ts.CompilerOptions {
        return {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            jsx: ts.JsxEmit.React,
            // Path to package.json folder.
            rootDir: this.projectPath,
            typeRoots: ["./"]
        };
    }

    protected Analyze(entryFile: string, otherFiles: string[]): void {
        this.consoleWrite(`Entry file: ${entryFile}`);

        this.Extractor.analyze({
            entryPointFile: entryFile,
            otherFiles: otherFiles
        });
    }

    public JSONGenerator(jsonLocation: string, entryFile: string, otherFiles: string[] = []): void {
        this.Analyze(entryFile, otherFiles);
        const apiJSONGenerator = new ApiJsonGenerator();

        this.consoleWrite(`Writing JSON file:\n ${jsonLocation}`);
        apiJSONGenerator.writeJsonFile(jsonLocation, this.Extractor);
        this.consoleWrite("Done.");
    }

    private consoleWrite(text: string): void {
        console.info(`[API-Extractor] ${text}`);
    }
}
