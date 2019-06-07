/**
 * 更新package.json
 */
const fs = require('fs');
const path = require('path');
const getIndent = require('detect-indent');

module.exports = async function(ctx) {
    const nextVersion = ctx.nextVersion;
    const pkgPath = path.resolve(process.cwd(), './package.json');
    const pkgStr = fs.readFileSync(pkgPath, 'utf8').toString();
    const indent = getIndent(pkgStr).indent;
    const pkgJSON = JSON.parse(pkgStr);
    pkgJSON.version = nextVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkgJSON, null, indent));
};
