const { execSync } = require('child_process');
const cli = require('../cli');
const pathHandler = require('../path-handler');

function parseLine(line) {
  const prefix = (/^(@\d+\s+)+/.exec(line) || [''])[0];

  return {
    shellCommand: line.replace(prefix, ''),
    references: prefix.match(/@\d+/g),
  };
}

exports.command = 'run [pathspec...]';
exports.desc = 'Run shell commands';
exports.builder = {
  pathspec: {
    default: ['.'], // TODO: Defaults to previous set of pathspecs
  },
};

exports.handler = function runCommand(argv) {
  let dirParts;
  let parsedLine;

  cli.repl('run', (line) => {
    parsedLine = parseLine(line);
    pathHandler.resolve(argv.pathspec)
      .filter((dir, index) => !parsedLine.references || parsedLine.references.includes(`@${index + 1}`))
      .forEach((dir, index) => {
        dirParts = pathHandler.parse(dir);
        cli.iterationSeparator(`@${index + 1} ${dirParts.base} (${dirParts.dir})`);
        try {
          execSync(parsedLine.shellCommand, { stdio: 'inherit', cwd: dir });
        } catch (e) {
          cli.errorMessage('There was an error while executing the command');
        }
      });
    cli.loopSeparator();
  });
};
