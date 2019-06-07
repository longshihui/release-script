/**
 * 确认是否提交
 */
const Mock = require('mockjs');
const inquirer = require('inquirer');

module.exports = async function() {
    const PIN = Mock.Random.string('upper', 5);
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'PIN',
            message: '请输入验证码: ' + PIN
        }
    ]);
    if (answers.PIN !== PIN) {
        throw new Error('[error]验证码不正确，发布操作被取消');
    }
};
