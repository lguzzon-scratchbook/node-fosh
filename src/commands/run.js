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
    let dirParts;
    cli.repl('run', function (line) {
        pathHandler.resolve(argv.pathspec).forEach(function(dir, index) {
            dirParts = pathHandler.parse(dir);
            cli.iterationSeparator(`@${index} ${dirParts.base} (${dirParts.dir})`);
            try {
                execSync(line, {stdio: 'inherit', cwd: dir});
            } catch (e) {
                cli.errorMessage('There was an error while executing the command')
            }
        });
        cli.loopSeparator();
    });
};
