/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher           = require('../../../lib/dispatcher').dispatcher;
const SubjectFileProcessor = require('./SubjectFileProcessor').SubjectFileProcessor;
const WhlFileProcessor     = require('./WhlFileProcessor').WhlFileProcessor;
const WocFileProcessor     = require('./WocFileProcessor').WocFileProcessor;

exports.Woc = class {
    build(filelist) {
        let help      = {keywords: {}, files: []};
        let wocByName = {};
        filelist.forEach((file) => {
            let filename = file.filename;
            if (filename.substr(-4) === '.woc') {
                new WocFileProcessor(help, filename, file.lines).process(wocByName);
            }
        });
        filelist.forEach((file, index) => {
            let filename = file.filename;
            let lines    = file.lines;
            if ((filename.substr(-4) === '.whl') || (filename.substr(-5) === '.whlp')) {
                new WhlFileProcessor(help, filename, lines).process(wocByName);
            }
            if ((filename.substr(-12) === '.subject.woc')) {
                new SubjectFileProcessor(help, filename, lines).process(wocByName);
            }
            dispatcher.dispatch('Woc.Progress', {index: index, total: filelist.length});
        });
        return help;
    }
};
