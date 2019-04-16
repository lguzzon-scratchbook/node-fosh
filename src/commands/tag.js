const cli = require('../cli');
const pathHandler = require('../path-handler');

exports.command = 'tag [tags...]';
exports.desc = 'Assign tags to directories';

exports.handler = function tagCommand(argv) {
  cli.repl('tag', (dir) => {
    pathHandler.assignDirToTags(
      dir, argv.tags.map(
        tag => tag.replace(new RegExp(`^${pathHandler.TAG_MARKER}`), ''),
      ),
    );
  });
};
