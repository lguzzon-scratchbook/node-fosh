'use strict';

const
    repl = require('../repl'),
    execSync = require('child_process').execSync;

exports.command = 'run [pathspec...]';
exports.desc = 'Run shell commands';
exports.builder = {
    pathspec: {
        default: ['.'] // TODO: Defaults to previous set of pathspecs
    }
};
exports.handler = function (argv) {
    repl('run', function (line) {
        argv.pathspec.forEach(function(pathspec) {
            console.log(header(pathspec));
            // TODO: Handle throw (unknown command in shell)
            execSync(
                line, {stdio: 'inherit', cwd: pathspec}
            );
        });
        console.log('='.repeat(process.stdout.columns - 1));
    });
};

function header(title) {
    return `\n__ ${title} ${'_'.repeat(process.stdout.columns - title.length - 5)}\n`;
}