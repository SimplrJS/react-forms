import * as git from "nodegit";
import * as process from "process";

process.chdir("../simplr-forms-dom");

function statusToText(status: any) {
    var words = [];
    if (status.isNew()) { words.push("[new]"); }
    if (status.isModified()) { words.push("[modified]"); }
    if (status.isTypechange()) { words.push("[typechange]"); }
    if (status.isRenamed()) { words.push("[renamed]"); }
    if (status.isIgnored()) { words.push("[ignored]"); }

    return words.join(" ");
}

async function ensureRepositoryIsClean(repository: any) {
    const statuses = await repository.getStatus();
    if (statuses != null && statuses.length > 0) {
        console.error(`Repository is dirty:`);
        for (const file of statuses) {
            console.info(`\t${file.path()} ${statusToText(file)}`);
        }
        console.info("");
        console.error("Repository must be clean before publishing.");
        console.info("Exiting...");
        process.exit(1);
    }
    console.info("Repository is clean. Starting publish...");
}

async function run() {
    const repository = await git.Repository.open("../../");
    ensureRepositoryIsClean(repository);
}

run();