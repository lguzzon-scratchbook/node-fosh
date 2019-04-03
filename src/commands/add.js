const cli = require('../cli');
const pathHandler = require('../path-handler');

exports.command = 'add [tags...]';
exports.desc = 'Assign directories to tags';

exports.handler = function addCommand(argv) {
  cli.repl('add', (line) => {
    pathHandler.assignDirToTags(line, argv.tags);
  });
};
