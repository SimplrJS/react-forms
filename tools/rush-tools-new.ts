import * as path from "path";
import * as shelljs from "shelljs";

import {
    CommandLineParser,
    CommandLineFlagParameter,
    CommandLineAction,
    CommandLineStringListParameter,
    CommandLineStringParameter
} from "@microsoft/ts-command-line";

import { RushConfiguration } from "@microsoft/rush-lib";

// Tasks

class ShellTask {
    constructor(private rushConfiguration: RushConfiguration, private projects: string[]) { }

    public Execute(command: string): void {
        this.consoleWrite(`Starting: ${command}`);

        const failedProjects: string[] = [];
        const succeededProjects: string[] = [];

        for (const projectName of this.projects) {
            const project = this.rushConfiguration.getProjectByName(projectName);

            shelljs.cd(project.projectFolder);
            this.consoleBox(`Package name: ${projectName}`);

            const result = shelljs.exec(command);

            if (result.code === 0) {
                succeededProjects.push(projectName);
            } else {
                failedProjects.push(projectName);
            }
        }

        if (succeededProjects.length > 0) {
            this.consoleBox(`Succeeded projects ${succeededProjects.length}`);
            for (const project of succeededProjects) {
                this.consoleWrite(project);
            }
        }

        if (failedProjects.length > 0) {
            this.consoleBox(`Failed projects ${failedProjects.length}`);
            for (const project of failedProjects) {
                this.consoleWrite(project);
            }
            process.exit(1);
        }
    }

    private consoleWrite(...text: string[]): void {
        console.info(text.join(" "));
    }

    private consoleBox(message: string): void {
        this.consoleWrite("====================================");
        this.consoleWrite(message);
        this.consoleWrite("====================================");
    }
}

// Actions

const defaultRushJsonFile = "rush.json";

abstract class BaseAction extends CommandLineAction {
    protected RushConfiguration: RushConfiguration;

    protected onExecute(): void {
        if (this.RushConfiguration == null) {
            this.RushConfiguration = RushConfiguration.loadFromDefaultLocation();
        }
        this.run();
    }

    protected abstract run(): void;
}

class RushRunAction extends BaseAction {
    private parser: RushToolsCommandLineParser;

    private excluded: CommandLineStringListParameter;
    private script: CommandLineStringParameter;

    constructor(parser: RushToolsCommandLineParser) {
        super({
            actionVerb: "run",
            summary: "Runs scripts to all projects",
            documentation: "Runs scripts to all projects"
        });
        this.parser = parser;
    }

    protected onDefineParameters(): void {
        this.excluded = this.defineStringListParameter({
            parameterShortName: "-e",
            parameterLongName: "--exclude",
            description: "List of excluded project names"
        });

        this.script = this.defineStringParameter({
            parameterShortName: "-s",
            parameterLongName: "--script",
            description: "Name of script that will be run in projects"
        });
    }

    protected run(): void {
        if (this.script.value == null) {
            console.error("[RUN] Please specify script name with --script/-s parameter.");
            process.exit(1);
        }

        const excludedProjects = this.excluded.value;
        const projects = this.RushConfiguration
            .projects
            .map(x => x.packageName)
            .filter(x => excludedProjects.indexOf(x) === -1);

        const task = new ShellTask(this.RushConfiguration, projects);
        task.Execute(`npm run ${this.script.value}`);
    }
}

class RushPublicAction extends BaseAction {
    private parser: RushToolsCommandLineParser;

    private excluded: CommandLineStringListParameter;
    private access: CommandLineStringParameter;

    constructor(parser: RushToolsCommandLineParser) {
        super({
            actionVerb: "publish",
            summary: "Runs publish script on all projects",
            documentation: "Runs publish script on all projects"
        });
        this.parser = parser;
    }

    protected onDefineParameters(): void {
        this.excluded = this.defineStringListParameter({
            parameterShortName: "-e",
            parameterLongName: "--exclude",
            description: "List of excluded project names"
        });

        this.access = this.defineStringParameter({
            parameterLongName: "--access",
            description: "Publish package to public/private"
        });
    }

    protected run(): void {
        const excludedProjects = this.excluded.value || [];
        const projects = this.RushConfiguration
            .projects
            .filter(x => x.shouldPublish)
            .map(x => x.packageName)
            .filter(x => excludedProjects.indexOf(x) === -1);

        const task = new ShellTask(this.RushConfiguration, projects);
        const access = this.access.value != null ? `--access ${this.access.value}` : "";
        task.Execute(`npm publish ${access}`);
    }
}

// CLI

class RushToolsCommandLineParser extends CommandLineParser {
    constructor() {
        super({
            toolFilename: "rush-tools",
            toolDescription: "Rush tools for rush single repo tool"
        });

        this.populateActions();
    }

    protected onDefineParameters(): void {
        // Abstract
    }

    private populateActions(): void {
        this.addAction(new RushRunAction(this));
        this.addAction(new RushPublicAction(this));
    }
}

const cli = new RushToolsCommandLineParser();
cli.execute();

