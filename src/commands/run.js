'use strict';

const
    repl = require('repl'),
    execSync = require('child_process').execSync;

exports.command = 'run [pathspec...]';
exports.desc = 'Run shell commands';
exports.builder = {
    pathspec: {
        default: ['.'] // TODO: Defaults to previous set of pathspecs
    }
};
exports.handler = function (argv) {
    function myEval(cmd, context, filename, callback) {
        argv.pathspec.forEach(function(pathspec) {
            console.log(header(pathspec));
            execSync(
                cmd, {stdio: 'inherit', cwd: pathspec}
            );
        });
        console.log('='.repeat(process.stdout.columns - 1));
        callback();
    }
    repl.start({ prompt: 'shdo> ', eval: myEval });
};

function header(title) {
    return `\n__ ${title} ${'_'.repeat(process.stdout.columns - title.length - 5)}\n`;
}