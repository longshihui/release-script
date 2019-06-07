/**
 * 对比master分支和dev分支，判断是否可发布
 */
const childProcess = require('child_process');
const { promisify } = require('util');
const dargs = require('dargs');

const exec = promisify(childProcess.exec);
const gitDefaultArgs = {
    maxCount: 200
};

async function getCommits(branch) {
    const args = Object.assign({}, gitDefaultArgs, {
        branches: branch
    });
    return await exec(`git log ${dargs(args).join(' ')}`);
}

module.exports = async function(ctx) {
    const devBranch = ctx.options.devBranch;
    const masterBranch = ctx.options.masterBranch;
    const devCommits = await getCommits(devBranch);
    const masterCommits = await getCommits(masterBranch);
    if (
        masterCommits.length &&
        devBranch.length &&
        masterCommits.includes(devCommits[0])
    ) {
        throw new Error(`[success]已经是最新版本, 无需更新`);
    }
};
