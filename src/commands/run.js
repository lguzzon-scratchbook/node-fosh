const { execSync } = require('child_process');
const cli = require('../cli');
const pathHandler = require('../path-handler');

function parseLine(line) {
  const prefix = ((new RegExp(`^${pathHandler.TAG_MARKER}(\\d+,?)+`)).exec(line) || [''])[0];
  const references = prefix.substr(1)
    .split(',')
    .filter(index => index !== '')
    .map(index => parseInt(index, 10));

  return {
    shellCommand: line.replace(prefix, ''),
    references: references.length ? references : null,
  };
}

function getTargetDirs(dirList, references) {
  return dirList.reduce((acc, curr, index) => {
    if (!references || references.includes(index + 1)) {
      acc[index + 1] = curr;
    }
    return acc;
  }, []);
}

exports.command = 'run [pathspec...]';
exports.desc = 'Run shell commands';
exports.builder = {
  pathspec: {
    default: [`${pathHandler.TAG_MARKER}MOST-RECENTLY-USED`],
  },
};

exports.handler = function runCommand(argv) {
  const dirList = pathHandler.resolve(argv.pathspec);

  if (argv.pathspec[0] === `${pathHandler.TAG_MARKER}MOST-RECENTLY-USED`) {
    cli.warningMessage('Using most recently used directory list');
  }

  pathHandler.deleteTag('MOST-RECENTLY-USED');
  pathHandler.assignTagToDirs('MOST-RECENTLY-USED', dirList);

  cli.repl('run', (line) => {
    const parsedLine = parseLine(line);
    getTargetDirs(dirList, parsedLine.references)
      .forEach((dir, index) => {
        const dirParts = pathHandler.parse(dir);
        cli.iterationSeparator(`${pathHandler.TAG_MARKER}${index} ${dirParts.base} (${dirParts.dir})`);
        try {
          execSync(parsedLine.shellCommand, { stdio: 'inherit', cwd: dir });
        } catch (e) {
          cli.errorMessage('There was an error while executing the command');
        }
      });
    cli.loopSeparator();
  });
};
