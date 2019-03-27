'use strict';

const
    readline = require('readline');

module.exports = function repl(commandName, callback) {
    const input = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: `shdo: ${commandName} > `
        });

    input.prompt();
    input.on('line', (line) => {
        callback(line);
        input.prompt();
    });
};