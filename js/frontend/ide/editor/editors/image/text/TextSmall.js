/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Text  = require('./Text').Text;
const small = require('../../../../data/texts').small;

exports.TextSmall = class extends Text {
    constructor(opts) {
        opts.src = small;
        super(opts);
    }
};
