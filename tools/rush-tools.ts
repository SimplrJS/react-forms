import * as shelljs from "shelljs";
import * as path from "path";
import { RushConfiguration } from "@microsoft/rush-lib";
import * as yargs from "yargs";

const version = "0.1.0";
const defaultRushJsonFile = "rush.json";

class RushTools {
    private rushConfiguration: RushConfiguration;

    constructor(args: ArgumentsValues) {
        const rushConfigurationPath = path.resolve(process.cwd(), args.config);
        this.rushConfiguration = RushConfiguration.loadFromConfigurationFile(rushConfigurationPath);

        if (args.run) {
            this.runScript(`npm run ${args.script}`, args.exclude);
        } else if (args.publish) {
            const excludedPackages: string[] = args.exclude != null ? args.exclude : [];
            const { projects } = this.rushConfiguration;

            for (const project of projects) {
                if (!project.shouldPublish) {
                    excludedPackages.push(project.packageName);
                }
            }

            this.runScript(`npm publish`, excludedPackages);
        }
    }

    private runScript(command: string, excludePackageNames?: string[]): void {
        const { projects } = this.rushConfiguration;

        const failedPackages: string[] = [];

        for (const project of projects) {
            // Skip package if it is in excluded list.
            if (excludePackageNames != null &&
                excludePackageNames.indexOf(project.packageName) !== -1) {
                continue;
            }
            shelljs.cd(project.projectFolder);
            console.info("====================================");
            console.info(`Package name: ${project.packageName}`);
            console.info("====================================");
            const result = shelljs.exec(command);

            if (result.code !== 0) {
                failedPackages.push(project.packageName);
            }
        }

        if (failedPackages.length > 0) {
            console.info("===================================");
            console.info(`Failed packages: ${failedPackages.length}`);
            console.info("===================================");
            for (const failedPackage of failedPackages) {
                console.info(failedPackage);
            }

            process.exit(1);
        }
    }
}

interface ArgumentsValues {
    config: string;
    exclude: string[];

    run: boolean;
    script: string;

    publish: boolean;
}

const argv = yargs
    .help("h", "Show help.")
    .alias("h", "help")
    .version(() => `Current version: ${version}.`)
    .alias("v", "version")
    .option("c", {
        alias: "config",
        describe: "Relative path to rush config",
        type: "string",
        default: path.relative(process.cwd(), defaultRushJsonFile)
    })
    .option("e", {
        alias: "exclude",
        describe: "Excluding package names list",
        type: "array"
    })
    .command(
    "run",
    "Run package.json script",
    yargs => yargs,
    argvObj => {
        const args: string[] = argvObj._;
        const filteredArgs = args.map(arg => {
            if (arg.length > 0 && arg[0] === "-") {
                return false;
            }
            return arg;
        });
        const script = filteredArgs.slice(1, filteredArgs.length).join(" ");

        if (script.length === 0) {
            throw Error("rush-tools: Script name is required");
        }

        argvObj.run = true;
        argvObj.script = script;
    })
    .command(
    "publish",
    "Publish projects",
    yargs => yargs,
    argvObj => {
        argvObj.publish = true;
    })
    .demandCommand(1, "You need run a command")
    .argv as ArgumentsValues;

new RushTools(argv);
