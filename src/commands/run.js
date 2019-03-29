'use strict';

const
    cli = require('../cli'),
    execSync = require('child_process').execSync;

exports.command = 'run [pathspec...]';
exports.desc = 'Run shell commands';
exports.builder = {
    pathspec: {
        default: ['.'] // TODO: Defaults to previous set of pathspecs
    }
};
exports.handler = function (argv) {
    cli.repl('run', function (line) {
        argv.pathspec.forEach(function(pathspec) {
            cli.iterationSeparator(pathspec);
            try {
                execSync(line, {stdio: 'inherit', cwd: pathspec});
            } catch (e) {
                cli.errorMessage('There was an error while executing the command')
            }
        });
        cli.loopSeparator();
    });
};
