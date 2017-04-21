const mv = require("mv");
const process = require("process");
mv("dist", ".", {}, (err) => {
    if (err) {
        process.exit(1);
    }
    process.exit(0);
});