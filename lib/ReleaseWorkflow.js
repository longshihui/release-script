const colors = require('../../utils/colors');

const DefaultOptions = {
    masterBranch: 'master', //发布分支
    devBranch: 'dev', //开发分支
    remoteRepos: ['origin'],
    changelogPath: './CHANGELOG.md'
};

class ReleaseWorkflow {
    constructor(options) {
        this.options = Object.assign({}, DefaultOptions, options);
        this.nextVersion = null;
        this.steps = [];
    }
    addStep(step) {
        this.steps.push(step);
    }
    async run() {
        let hasException = false;
        while (this.steps.length) {
            try {
                const step = this.steps.shift();
                await step(this);
            } catch (e) {
                const matched = /(\[(.+)])?(.+)/g.exec(e.message);
                const type = matched[2] || 'info';
                const message = matched[3];
                console.log(
                    colors.formatTitle(type, type.toUpperCase()),
                    colors.formatText(type, message)
                );
                hasException = true;
                break;
            }
        }
        if (!hasException) {
            console.log(
                colors.formatTitle('success', 'success'.toUpperCase()),
                colors.formatText(
                    'success',
                    `已成功发布v${this.nextVersion}版本`
                )
            );
        }
        process.exit(0);
    }
}

module.exports = ReleaseWorkflow;
