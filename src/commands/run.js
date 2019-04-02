'use strict';

const
    cli = require('../cli'),
    pathHandler = require('../path-handler'),
    execSync = require('child_process').execSync;

exports.command = 'run [pathspec...]';
exports.desc = 'Run shell commands';
exports.builder = {
    pathspec: {
        default: ['.'] // TODO: Defaults to previous set of pathspecs
    }
};
exports.handler = function (argv) {
    let
        dirParts,
        parsedLine;

    cli.repl('run', function (line) {
        parsedLine = parseLine(line);
        pathHandler.resolve(argv.pathspec)
            .filter(function(dir, index) { return !parsedLine.references || parsedLine.references.includes(`@${index+1}`) })
            .forEach(function(dir, index) {
                dirParts = pathHandler.parse(dir);
                cli.iterationSeparator(`@${index+1} ${dirParts.base} (${dirParts.dir})`);
                try {
                    execSync(parsedLine.shellCommand, {stdio: 'inherit', cwd: dir});
                } catch (e) {
                    cli.errorMessage('There was an error while executing the command')
                }
        });
        cli.loopSeparator();
    });
};

function parseLine(line) {
    const prefix = (/^(@\d+\s+)+/.exec(line) || [''])[0];

    return {
        'shellCommand': line.replace(prefix, ''),
        'references': prefix.match(/@\d+/g),
    }
}