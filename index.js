/**
 * 发布版本脚本
 */
const ReleaseWorkflow = require('./lib/ReleaseWorkflow');

module.exports = {
    async run() {
        const workflow = new ReleaseWorkflow();
        // 判断是否是发布分支
        workflow.addStep(require('./steps/isMasterBranch'));
        // 比较发布分支和开发分支
        workflow.addStep(require('./steps/compareBranch'));
        // 确认是否发布
        workflow.addStep(require('./steps/confirmRelease'));
        // 计算下个版本
        workflow.addStep(require('./steps/bumpVersion'));
        // 更新package.json
        workflow.addStep(require('./steps/updatePkg'));
        // 创建changelog
        workflow.addStep(require('./steps/genChangelog'));
        // 同步到git
        workflow.addStep(require('./steps/sync2Git'));
        await workflow.run();
    }
};
