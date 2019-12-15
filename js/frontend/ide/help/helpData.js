/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let help     = null;
let helpData = null;

exports.setHelp = function(h) {
    help     = h;
    helpData = null;
};

exports.getHelpData = function() {
    if (help === null) {
        return {};
    }
    if (helpData !== null) {
        return helpData;
    }
    help.subjectById = [];
    help.sectionById = [];
    (function(help) {
        for (let i = 0; i < help.files.length; i++) {
            let file = help.files[i];
            if (file.sections) {
                for (let j = 0; j < file.sections.length; j++) {
                    let section = file.sections[j];
                    section.fileIndex            = i;
                    help.sectionById[section.id] = section;
                    section.content.forEach(function(content) {
                        if (content.type === 'proc') {
                            section.type = 'proc';
                            help.subjectById[content.text.id] = section;
                        } else if (content.type === 'const') {
                            section.type = 'const';
                            help.subjectById[content.text.id] = section;
                        }
                    });
                }
            }
        }
    })(help);
    helpData = help;
    return helpData;
};
