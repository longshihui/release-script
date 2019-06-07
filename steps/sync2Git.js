/**
 * 同步到git生态系统
 * 1. 提交发布时的更改
 * 2. 打tag
 * 3. 同步到远程
 */
const childProcess = require('child_process');
const { promisify } = require('util');

const exec = promisify(childProcess.exec);

module.exports = async function(ctx) {
    const version = ctx.nextVersion;
    const remoteRepos = ctx.options.remoteRepos;
    const masterBranch = ctx.options.masterBranch;
    await exec('git add .');
    await exec(`git commit -m "Release v${version} [ci skip]"`);
    await exec(`git tag v${version}`);
    await Promise.all(
        remoteRepos.map(remoteRepoName =>
            exec(`git push ${remoteRepoName} ${masterBranch} --tags`)
        )
    );
};
