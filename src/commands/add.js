'use strict';

const
    repl = require('repl').start,
    Conf = require('conf'),
    path = require('path');

exports.command = 'add [tags...]';
exports.desc = 'Assign paths to tags';

exports.handler = function (argv) {
    const conf = new Conf();

    function parseInput(input, context, filename, callback) {
        const dir = path.resolve(input.trim());
        argv.tags.forEach(function assignDirToTag(tag) {
            const dirList = conf.get(tag, []);
            dirList.push(dir);
            conf.set(tag, dirList)
        });
        callback();
    }
    // TODO: Paths starting with '.' treated as REPL commands - should I use another REPL?
    repl({ prompt: 'shdo> ', eval: parseInput });
};
