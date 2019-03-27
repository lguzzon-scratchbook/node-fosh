'use strict';

const
    repl = require('../repl'),
    Conf = require('conf'),
    path = require('path');

exports.command = 'add [tags...]';
exports.desc = 'Assign paths to tags';

exports.handler = function (argv) {
    const conf = new Conf();
    repl('add', function (line) {
        const dir = path.resolve(line.trim());
        argv.tags.forEach(function assignDirToTag(tag) {
            const dirList = conf.get(tag, []);
            dirList.push(dir);
            conf.set(tag, dirList)
        });
    });
};
