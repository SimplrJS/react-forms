import * as shelljs from "shelljs";
import * as path from "path";
import { RushConfiguration } from "@microsoft/rush-lib";
import * as yargs from "yargs";

const version = "0.1.0";
const defaultRushJsonFile = "rush.json";

class RushRunTask {
    private rushConfiguration: RushConfiguration;

    constructor(args: ArgumentsValues) {
        const rushConfigurationPath = path.resolve(process.cwd(), args.config);
        this.rushConfiguration = RushConfiguration.loadFromConfigurationFile(rushConfigurationPath);

        this.runScript(args.script, args.exclude);
    }

    private runScript(script: string, excludePackageNames?: string[]) {
        const { projects } = this.rushConfiguration;

        const failedPackages: string[] = [];

        for (const project of projects) {
            // Skip package if it is in excluded list.
            if (excludePackageNames != null &&
                excludePackageNames.indexOf(project.packageName) !== -1) {
                continue;
            }
            shelljs.cd(project.projectFolder);
            console.log("====================================");
            console.log(`Package name: ${project.packageName}`);
            console.log("====================================");
            const result = shelljs.exec(`npm run ${script}`);

            if (result.code !== 0) {
                failedPackages.push(project.packageName);
            }
        }

        if (failedPackages.length > 0) {
            console.log("===================================");
            console.log(`Failed packages: ${failedPackages.length}`);
            console.log("===================================");
            for (const failedPackage of failedPackages) {
                console.log(failedPackage);
            }
        }
    }
}

interface ArgumentsValues {
    config: string;
    script: string;
    exclude?: string[];
}

const argv = yargs
    .help("h", "Show help.")
    .alias("h", "help")
    .version(() => {
        return `Current version: ${version}.`;
    })
    .alias("v", "version")
    .config("config")
    .option("c", {
        alias: "config",
        describe: "Relative path to rush config",
        type: "string",
        default: path.relative(process.cwd(), defaultRushJsonFile)
    })
    .option("s", {
        alias: "script",
        describe: "Script name in project package.json.",
        type: "string",
        required: "Script name in project package.json."
    })
    .option("e", {
        alias: "exclude",
        describe: "Excluding package names list",
        type: "array"
    })
    .argv as ArgumentsValues;

new RushRunTask(argv);
