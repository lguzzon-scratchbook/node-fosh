const cli = require('../cli');
const pathHandler = require('../path-handler');

exports.command = 'list';
exports.desc = 'Prints the path of the tag list file';

exports.handler = function listCommand() {
  cli.rawMessage(pathHandler.getTagFilePath());
};
