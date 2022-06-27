const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const disable2fa = require("./commands/disable2fa");

yargs(hideBin(process.argv))
    .command(disable2fa)
    .parse();
