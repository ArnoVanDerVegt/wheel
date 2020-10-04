/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const consoleColor  = require('../../lib/consoleColor');
const $             = require('../commands');
const Text          = require('./Text').Text;

exports.Log = class extends Text {
    output() {
        let lastBlock = '';
        let colors    = [consoleColor.reset, consoleColor.bright];
        let color     = 0;
        this.getOutput().split('\n').forEach((line) => {
            let block = line.substr(5, 4);
            if (block !== lastBlock) {
                lastBlock = block;
                color     = (color + 1) & 1;
            }
            console.log(colors[color], line);
        });
        console.log(consoleColor.reset);
    }
};
