'use strict';

const
    readline = require('readline');

function repl(commandName, callback) {
    const
        input = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: `shdo: ${commandName} > `
        });

    input.prompt();
    input.on('line', (line) => {
        try {
            callback(line);
        } catch (e) {
            errorMessage('There was an error while processing the command')
        }
        input.prompt();
    });
}

function iterationSeparator(title) {
    console.log(`\n__ ${title} ${'_'.repeat(process.stdout.columns - title.length - 5)}`);
}

function loopSeparator(title = '', level = 0) {
    console.log(`\n${'='.repeat(process.stdout.columns - 1)}`);
}

function errorMessage(message) {
    console.error('shdo: ERROR:', message)
}

module.exports.repl = repl;
module.exports.iterationSeparator = iterationSeparator;
module.exports.loopSeparator = loopSeparator;
module.exports.errorMessage = errorMessage;