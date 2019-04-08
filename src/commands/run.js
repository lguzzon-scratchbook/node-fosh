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

function getTargetDirs(dirList, references) {
  return dirList.reduce((acc, curr, index) => {
    if (!references || references.includes(`@${index + 1}`)) {
      acc[index + 1] = curr;
    }
    return acc;
  }, []);
}

exports.command = 'run [pathspec...]';
exports.desc = 'Run shell commands';
exports.builder = {
  pathspec: {
    default: ['.'], // TODO: Defaults to previous set of pathspecs
  },
};

exports.handler = function runCommand(argv) {
  cli.repl('run', (line) => {
    const parsedLine = parseLine(line);
    getTargetDirs(pathHandler.resolve(argv.pathspec), parsedLine.references)
      .forEach((dir, index) => {
        const dirParts = pathHandler.parse(dir);
        cli.iterationSeparator(`@${index} ${dirParts.base} (${dirParts.dir})`);
        try {
          execSync(parsedLine.shellCommand, { stdio: 'inherit', cwd: dir });
        } catch (e) {
          cli.errorMessage('There was an error while executing the command');
        }
      });
    cli.loopSeparator();
  });
};
