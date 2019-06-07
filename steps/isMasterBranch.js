/**
 * 判断是否在发布分支上进行版本发布
 */
const gitBranch = require('git-branch');
const chalk = require('chalk');

module.exports = async function(ctx) {
    const masterBranch = ctx.options.masterBranch;
    if ((await gitBranch()) !== masterBranch) {
        throw new Error(
            `[error]发布版本只能在${chalk.red(`${masterBranch}`)}分支上进行`
        );
    }
};
