import * as gulp from "gulp";
import { Extractor, ApiJsonGenerator, ApiErrorHandler } from "@microsoft/api-extractor";
import * as ts from "typescript";
import * as path from "path";
import * as chalk from "chalk";
import * as mkdirp from "mkdirp";

interface ErrorsCount {
    [type: string]: number;
    NodeModules: number;
    Types: number;
    TypeScript: number;
    Other: number;
}

export class ExtractorTaskClass {
    private scriptName: string = "AE";
    protected Extractor: Extractor;

    private errorsCount: ErrorsCount;

    constructor(private projectPath: string) {
        this.Extractor = new Extractor({
            compilerOptions: this.TSCompilerOptions,
            errorHandler: this.onErrorHandler
        });

        this.errorsCount = {
            NodeModules: 0,
            Types: 0,
            TypeScript: 0,
            Other: 0
        };
    }

    private onErrorHandler: ApiErrorHandler = (message, fileName, lineNumber) => {
        // Ignore node_modules errors
        if (fileName.indexOf("node_modules") !== -1) {
            this.errorsCount.NodeModules++;
            return;
        }
        // Ignore d.ts files
        if (path.basename(fileName).indexOf(".d.ts") !== -1) {
            this.errorsCount.Types++;
            return;
        }
        // Ignore TypeScript errors
        if (message.indexOf("TypeScript:") !== -1) {
            this.errorsCount.TypeScript++;
            return;
        }

        this.errorsCount.Other++;
        this.warningWrite(`[${fileName}:${lineNumber}] ${message}`);
    }

    protected get TSCompilerOptions(): ts.CompilerOptions {
        return {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            jsx: ts.JsxEmit.React,
            // Path to package.json folder.
            rootDir: this.projectPath,
            lib: [
                "dom",
                "dom.iterable",
                "es6"
            ],
            typeRoots: ["./"]
        };
    }

    protected Analyze(entryFile: string, otherFiles: string[]): void {
        const fullEntryFilePath = path.resolve(this.projectPath, entryFile);
        this.consoleWrite(`Entry file: ${fullEntryFilePath}`);

        this.Extractor.analyze({
            entryPointFile: entryFile,
            otherFiles: otherFiles
        });
    }

    public JSONGenerator(jsonLocation: string, entryFile: string, otherFiles: string[] = []): void {
        this.consoleWrite(chalk.cyan("------------- [Started] -------------"));
        this.Analyze(entryFile, otherFiles);
        const apiJSONGenerator = new ApiJsonGenerator();

        this.consoleWrite(chalk.cyan("--------------- [Log] ---------------"));

        const fullJSONPath = path.resolve(this.projectPath, jsonLocation);
        this.consoleWrite(chalk.green(`Writing JSON file: ${fullJSONPath}`));
        const jsonDirname = path.dirname(jsonLocation);
        mkdirp(jsonDirname, err => {
            this.errorWrite(`Failed to create folder [${jsonDirname}]: ${err}`);
        });
        apiJSONGenerator.writeJsonFile(jsonLocation, this.Extractor);

        // Writing errors.
        for (const errorName in this.errorsCount) {
            if (this.errorsCount.hasOwnProperty(errorName)) {
                const errorCount = this.errorsCount[errorName];

                if (errorCount > 0) {
                    this.warningWrite(`${errorName}: ${errorCount}`);
                }
            }
        }
        this.consoleWrite(chalk.cyan("-------------- [Done] ---------------"), "\n");
    }

    private consoleWrite(...text: string[]): void {
        const message = text.join(" ");
        console.info(`${this.writeTag()} ${message}`);
    }

    private warningWrite(...warning: string[]): void {
        const message = chalk.yellow(`WARN ${warning.join(" ")}`);
        console.warn(`${this.writeTag()} ${message}`);
    }

    private errorWrite(...errors: string[]): void {
        const message = chalk.red(`ERR! ${errors.join(" ")}`);
        console.error(`${this.writeTag()} ${message}`);
    }

    private writeTag(): string {
        return `[${chalk.cyan(this.scriptName)}]`;
    }
}
