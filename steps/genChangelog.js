/**
 * 生成changelog
 */
const cc = require('conventional-changelog');
const fs = require('fs');
const path = require('path');

const groupTitleOptions = {
    feat: '🌟 新特性',
    fix: '🐛 解决的问题',
    perf: '🚀 性能优化',
    revert: '🔙 回滚部分',
    docs: '📝 更新文档',
    style: '🎨 代码风格',
    refactor: '🔨 重构',
    test: '🔧 测试',
    build: '🏠 构建系统',
    ci: '📦 持续集成',
    breakingChange: '不向下兼容的改动',
    other: '其他改动'
};

const writerOpts = {
    transform: (commit, context) => {
        let discard = true;
        const issues = [];

        commit.notes.forEach(note => {
            note.title = groupTitleOptions.breakingChange;
            discard = false;
        });

        if (commit.type === `feat`) {
            commit.type = groupTitleOptions.feat;
        } else if (commit.type === `fix`) {
            commit.type = groupTitleOptions.fix;
        } else if (commit.type === `perf`) {
            commit.type = groupTitleOptions.perf;
        } else if (commit.type === `revert`) {
            commit.type = groupTitleOptions.revert;
        } else if (discard) {
            return;
        } else if (commit.type === `docs`) {
            commit.type = groupTitleOptions.docs;
        } else if (commit.type === `style`) {
            commit.type = groupTitleOptions.style;
        } else if (commit.type === `refactor`) {
            commit.type = groupTitleOptions.refactor;
        } else if (commit.type === `test`) {
            commit.type = groupTitleOptions.test;
        } else if (commit.type === `build`) {
            commit.type = groupTitleOptions.build;
        } else if (commit.type === `ci`) {
            commit.type = groupTitleOptions.ci;
        }

        if (commit.scope === `*` || commit.scope === null) {
            commit.scope = ``;
        }

        if (typeof commit.hash === `string`) {
            commit.hash = commit.hash.substring(0, 7);
        }

        if (typeof commit.subject === `string`) {
            let url = context.repository
                ? `${context.host}/${context.owner}/${context.repository}`
                : context.repoUrl;
            if (url) {
                url = `${url}/issues/`;
                // Issue URLs.
                commit.subject = commit.subject.replace(
                    /#([0-9]+)/g,
                    (_, issue) => {
                        issues.push(issue);
                        return `[#${issue}](${url}${issue})`;
                    }
                );
            }
            if (context.host) {
                // User URLs.
                commit.subject = commit.subject.replace(
                    /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
                    (_, username) => {
                        if (username.includes('/')) {
                            return `@${username}`;
                        }

                        return `[@${username}](${context.host}/${username})`;
                    }
                );
            }
        }

        // remove references that already appear in the subject
        commit.references = commit.references.filter(reference => {
            if (issues.indexOf(reference.issue) === -1) {
                return true;
            }

            return false;
        });

        return commit;
    },
    finalizeContext(context) {
        const commitGroups = context.commitGroups;
        for (let group of commitGroups) {
            if (!group.title) {
                group.title = groupTitleOptions.other;
            }
        }
        return context;
    }
};

module.exports = function(ctx) {
    const options = {
        preset: 'angular',
        pkg: {
            transform(pkg) {
                pkg.version = ctx.nextVersion;
                return pkg;
            }
        },
        releaseCount: 0,
        outputUnreleased: true
    };

    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(
            path.resolve(process.cwd(), ctx.options.changelogPath)
        );

        cc(options, null, null, null, writerOpts)
            .pipe(fileStream)
            .on('finish', function() {
                resolve();
            })
            .on('error', function(err) {
                reject(err);
            });
    });
};
