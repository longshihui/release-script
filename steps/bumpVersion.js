/**
 * 计算下一个版本号
 */
const inquirer = require('inquirer');
const semver = require('semver');
const path = require('path');
const fs = require('fs');
//版本类型
const VersionType = {
    MAJOR: 'major', //主要版本
    MINOR: 'minor', //次要版本
    PATCH: 'patch' //补丁版本
};

async function getCurrentVersion() {
    const pkgPath = path.resolve(process.cwd(), './package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
    return pkg.version;
}

module.exports = async function(ctx) {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: '选择更新的版本类型',
            choices: [
                {
                    name: '主要版本 (可能不向下兼容)',
                    value: VersionType.MAJOR
                },
                {
                    name: '次要版本 (新增功能等)',
                    value: VersionType.MINOR
                },
                {
                    name: '补丁 (修复问题等)',
                    value: VersionType.PATCH
                }
            ]
        }
    ]);
    const type = answers.type;
    const currentVersion = await getCurrentVersion();
    ctx.nextVersion = semver.inc(currentVersion, type);
};
