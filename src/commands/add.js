'use strict';

const
    cli = require('../cli'),
    pathHandler = require('../path-handler');

exports.command = 'add [tags...]';
exports.desc = 'Assign directories to tags';

exports.handler = function (argv) {
    cli.repl('add', function (line) {
        pathHandler.assignDirToTags(line, argv.tags);
    });
};
