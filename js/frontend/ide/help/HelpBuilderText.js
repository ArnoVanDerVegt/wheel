/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path            = require('../../../shared/lib/path');
const dispatcher      = require('../../lib/dispatcher').dispatcher;
const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;
const getImage        = require('../data/images').getImage;
const SettingsState   = require('../settings/SettingsState');
const WheelSyntax     = require('./woc/WheelSyntax').WheelSyntax;
const IndexList       = require('./components/IndexList').IndexList;
const IndexListText   = require('./components/IndexListText').IndexListText;

const getFilename = function(subject) {
        [':', '_', '/', ',', ' '].forEach((c) => {
            subject = subject.split(c).join('_');
        });
        return subject + '.html';
    };

class HelpBuilderText {
    constructor(opts) {
        this._documentPath = opts.documentPath;
        this._helpData     = opts.helpData;
        this._output       = [];
    }

    getFilenameWithoutDocumentPath(filename) {
        if (this._documentPath === '') {
            return filename;
        }
        return filename.substr(this._documentPath.length + 1 - filename.length);
    }

    getIdsForKeyword(keyword) {
        keyword = keyword.toLowerCase();
        if (!this._helpData) {
            return null;
        }
        let keywords = this._helpData.keywords;
        if (keyword in keywords) {
            return keywords[keyword];
        }
        return null;
    }

    getTemplateFile(file, lines, className) {
        return [
            '<!doctype html>',
            '<html>',
            '<head>',
            '    <meta charset="utf-8"/>',
            '    <title>Wheel - ' + file.subject + '</title>',
            '    <meta name="description" content="' + file.subject + '"/>',
            '    <link rel="shortcut icon" href="../../favicon.ico" type="image/x-icon">',
            '    <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABhlBMVEUAVH8ASXAABwsAAAAAeLYAcbP///8Apf4FWuEDeOwGVt4AovYEaOAFYOMBlvgEbegAoPwCiPIDdOoChfECgO8Dfe4Ci/MDg/AEcekBnfoBmvkBjvUDaOUFZeT9/f3y8vKfn5+ampoWMVIBkfYAn/QAmPIBkPABiuwCgOkDcuRWW2D5+fkAnPXw8PAAk/Ds7OwChuwCe+gCeOcDbeLh4eEDcOHd3d3KysrGxsaoqKgBU5CLi4uJiYl3eXt0dHRmZmZZXWI7T1w2SlwJNFxYWVlHUFgYPFgUOVQDZdoEWdEAarIBYK8CV6sCQYkEQ3cEL3EGQWMpOEkAlfEBje4Cg+oCduUEYdwEV9YETLwAcrQCTqgDQqICTKECVIIBTH1laWtmaGtWXGA2TV06SFs2R1s9SVg4SFI4QlAfPE8gM0wAlOkAjuUAi+QEZeQBg+IAjNkBcs4AgMwCZckBb8YDXr8AbaoBXKQDPpgCQ4oCOXkDOHIFOGIFMl8XRV4GKFsMKlgIJlYpP0yHjd85AAAABnRSTlONeiAA5eUssUaZAAACGElEQVQ4y4WTZ3MaMRCGAdsbSOEA0xLIAXc0HwZsTAfTiwHT3Huv6b3Xf57dg8HyB+Lng6R955E0sxopJlRKxViUqgmFair2cCyxKZVCGbv/H2J4/IL6hq0/QlfNsqC4ETYbavXvMGR21Z+vu5uMMPNIZvey0N06Agj0f2X5pIAJMTMSGhUeErkoAATjOJyywlNiIw8s5y83GhSTsG6XqWLscElnZ5LLAZCq5it7mK6jEOG4JeH0PAXgFHbsHGffEZyA8JdLHBdBYZ7jviYpWWxzQ9qLVBdQmCfBar3mAfe3rSO+4BmJb7ggwW8w7GXxfsHAIDgg9wFnPwkajeZHHFzLGoZlF0SPyu80JKxh2Q+CFGGFiAQA4bJmDYU5UycTACiZblECpGaaI8FYo6JkvAUKgUzHSILPUg6jIPktDH4Jgv2WxeIjYfpN+TAKrtY0Q8sF8e84k7Cq1+vf58BR1zPUsd3ZT3r9Kgpes9ncSWCj0uYRaWo2f2U2e0mw2V4V5FanbUPScquTBzYbCSFR9F3wlDjrTa8oept13J8qFms+UQyhsKLVapuVfDVFz318cnJMzw1VrcwKCh5avAhpi8CSD8mCh4QnA0iIB3GI5hLAV57LIQmzjwfUkny29xebfvj2oHCxPQhnSdAN8OxffdRtZyDc0+meeYYhCe57LPs/e6+Z0o3/E4XxuJUK1aT7wVjck6o7v/8/LSdqSvnu0LoAAAAASUVORK5CYII=" type="image/x-icon" />',
            '    <link rel="stylesheet" href="../../css/fonts.css"/>',
            '    <link rel="stylesheet" href="../../css/index.css"/>',
            '    <link rel="stylesheet" href="../../css/docs.css"/>',
            '    <link rel="stylesheet" href="../../css/source.css"/>',
            '</head>',
            '<body>',
            '    <div class="header">',
            '        <div class="header-center">',
            '            <h2>',
            '                <a href="../../index.html">',
            '                    <img src="../../assets/images/logos/wheelSite.svg" width="40"/>',
            '                    <span>Wheel IDE</span>',
            '                </a>',
            '            </h2>',
            '            <a href="../ide/ide.html" class="start">Online demo &raquo;</a>',
            '            <ul>',
            '                <li><a href="index.html">Documentation</a></li>',
            '                <li><a href="../source.html">Source</a></li>',
            '                <li><a href="../screenshots.html">Screenshots</a></li>',
            '            </ul>',
            '        </div>',
            '    </div>',
            '    <div class="content-center">',
            '        <div class="' + className + '">',
            '        ' + lines,
            '        </div>',
            '        <div class="footer">',
            '            <img src="https://app.codeship.com/projects/582d421b-a5b5-4f7e-9d3c-99e2da0157ac/status?branch=main" title="Build status"/>',
            '            <a href="license.html" class="license">Copyright © Arno van der Vegt 2017 - present</a>',
            '        </div>',
            '    </div>',
            '</body>',
            '</html>'
        ].join('\n');
    }

    addH(parentNode, size, title, className) {
        new H({
            parentNode: parentNode,
            size:       size,
            innerHTML:  title,
            className:  className || ''
        });
        return this;
    }

    addSpan(parentNode, text, className) {
        new Span({
            parentNode: parentNode,
            className:  className,
            innerHTML:  text
        });
        return this;
    }

    addTitle(title, indent) {
        this._output.push((indent || '') + '<h2>' + title + '</h2>');
    }

    addSubTitle(title, indent) {
        this._output.push((indent || '') + '<h3>' + title + '</h3>');
    }

    addSubSubTitle(title, className, indent) {
        this._output.push((indent || '') + '<h4 class="' + (className || '') + '">' + title + '</h4>');
    }

    addSubSubSubTitle(title, className, indent) {
        this._output.push((indent || '') + '<h5 class="' + (className || '') + '">' + title + '</h5>');
    }

    addConstants(constant) {
        let output   = this._output;
        let hasImage = false;
        constant.values.forEach((value) => {
            if (value.image) {
                hasImage = true;
            }
        });
        output.push(
            '    <p>',
            '        <a id="' + constant.description.split(' ').join('') + '"></a>',
            '        <div>' + constant.description + '<br/></div>',
            '        <div class="source-location">Source: ' +  this.getFilenameWithoutDocumentPath(constant.filename) + ', line: ' + constant.lineNumber + '<br/></div>',
            '        <table class="help-table ' + (hasImage ? 'image-' : '') + 'constants">'
        );
        let body = [];
        if (hasImage) {
            constant.values.forEach((value) => {
                if (value.image) {
                    output.push('            <tr><td><div class="image-wrapper"><img src="../../assets/' + value.image + '"/></td></div><td>' + value.key + '</td><td>' + value.value + '</td></tr>');
                } else {
                    output.push('            <tr><td>&nbsp;<td>' + value.key + '</td><td>' + value.value + '</td></tr>');
                }
            });
        } else {
            constant.values.forEach((value) => {
                output.push('            <tr><td>' + value.key + '</td><td>' + value.value + '</td></tr>');
            });
        }
        output.push(
            '        </table>',
            '    </p>'
        );
    }

    addVar(vr) {
        let output = this._output;
        let name   = vr.name;
        let i      = name.indexOf('[');
        if (i !== -1) {
            name = name.substr(0, i);
        }
        output.push(
            '    <p>',
            '        <a id="' + vr.description.split(' ').join('') + '"></a>',
            '        <h5 class="title-with-source" title="' + vr.name + '">' + name + '</h5>',
            '        <div class="source-location">Source: ' +  this.getFilenameWithoutDocumentPath(vr.filename) + ', line: ' + vr.lineNumber + '<br/></div>',
            '        <div>' + vr.description + '<br/></div>'
        );

        if (vr.arraySize) {
            output.push(
                '        <table class="help-table">',
                '            <tr><th>Type</th><th>Array size</th></tr>',
                '            <tr><td>' + vr.type + '</td><td>' + vr.arraySize.join(', ') + '</td></tr>',
                '        </table>'
            );
        } else {
            output.push(
                '        <table class="help-table">',
                '            <tr><th>Type</th></tr>',
                '            <tr><td>' + vr.type + '</td></tr>',
                '        </table>'
            );
        }
        output.push('    </p>');
    }

    addRecord(record) {
        let output      = this._output;
        let fields      = record.fields;
        let arraySize   = false;
        let description = false;
        let cols        = 2;
        output.push(
            '    <p>',
            '        <a id="' + record.description.split(' ').join('') + '"></a>',
            '        <h5 title="' + record.name + '" class="title-with-source">' + record.name + '</h5>',
            '        <div class="source-location">Source: ' + this.getFilenameWithoutDocumentPath(record.filename) + ', line: ' + record.lineNumber + '<br/></div>',
            '        <div>' + record.description + '<br/></div>',
            '        <table class="help-table">'
        );
        for (let i = 0; i < fields.length; i++) {
            arraySize = !!fields[i].arraySize;
            if (arraySize) {
                cols++;
                break;
            }
        }
        for (let i = 0; i < fields.length; i++) {
            description = !!fields[i].description;
            if (description) {
                cols++;
                break;
            }
        }
        output.push(
            '        <tr>',
            '            <th>Name</th><th>Type</th>'
        );
        if (arraySize) {
            output.push('            <th>Array size</th>');
        }
        if (description) {
            output.push('            <th>Description</th>');
        }
        output.push('        </tr>');
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            if (field === 'union') {
                output.push('        <tr><td colspan="' + cols + '">union</td></tr>');
            } else {
                output.push(
                    '        <tr>',
                    '            <td>' + field.name + '</td>',
                    '            <td>' + field.type + '</td>'
                );
                if (arraySize) {
                    output.push(
                        '            <td>' + (field.arraySize ? field.arraySize.join(', ') : '') + '</td>'
                    );
                }
                if (description) {
                    output.push(
                        '            <td>' + (field.description || '') + '</td>'
                    );
                }
                output.push('        </tr>');
            }
        }
        output.push('    </p>');
    }

    addProc(proc) {
        let output = this._output;
        output.push('    <a id="' + proc.description.split(' ').join('') + '"></a>');
        this.addSubSubSubTitle(proc.name, 'title-with-source', '    ');
        output.push('    <div class="source-location">Source: ' +  this.getFilenameWithoutDocumentPath(proc.filename) + ', line: ' + proc.lineNumber + '<br/></div>');
        if (proc.device !== '') {
            output.push('    <div class="devices">');
            proc.device.split(',').forEach(
                function(device) {
                    if ('EPM'.indexOf(device) !== -1) {
                        output.push('<span class="' + device.toLowerCase() + '">' + device +'</span>');
                    }
                },
                this
            );
            output.push('    </div>');
        }
        output.push('    <p>' + proc.description + '</p>');
        let params = [];
        for (let i = 0; i < proc.params.length; i++) {
            let param = proc.params[i];
            params.push(param.type + ' ' + param.name);
        }
        let wheelSyntax = new WheelSyntax();
        let s           = 'proc ' + proc.name + '(' + params.join(', ') + ')';
        output.push('    <pre class="wheel">' + wheelSyntax.parseLines([s]) + '</pre>');
        if (proc.params.length) {
            output.push(
                '    <div>Parameters:<br/></div>',
                '    <table class="help-table">',
                '        <tr><th>Name</th><th>Type</th><th>Description</th></tr>'
            );
            for (let i = 0; i < proc.params.length; i++) {
                let param = proc.params[i];
                output.push('        <tr><td>' + param.name + '</td><td>' + param.type + '</td><td>' + param.description + '</td></tr>');
            }
            output.push('    </table>');
        }
        if (proc.ret) {
            output.push('    <div><b>Return:</b> ' + proc.ret + '<br/><br/></div>');
        }
        if (proc.text) {
            output.push('    <p>' + proc.text.join('<br/>') + '</p>');
        }
        if (proc.example) {
            output.push('    <pre class="wheel">' + wheelSyntax.parseLines(proc.example) + '</pre>');
        }
        output.push('    <hr/>');
    }

    addEvent(event) {
        let output = this._output;
        output.push('<a id="' + event.description.split(' ').join('') + '"></a>');
        this.addSubSubSubTitle(event.name, 'title-with-source', '    ');
        output.push('    <p>' + event.description + '</p>');
        let params = [];
        for (let i = 0; i < event.params.length; i++) {
            let param = event.params[i];
            params.push(param.type + ' ' + param.name);
        }
        let wheelSyntax = new WheelSyntax();
        let s           = 'proc ' + event.name + '(' + params.join(', ') + ')';
        output.push('    <pre class="wheel">' + wheelSyntax.parseLines([s]) + '</pre>');
        if (event.params.length) {
            output.push(
                '    <div>Parameters:<br/></div>',
                '    <table class="help-table">',
                '        <tr>',
                '            <th>Name</th><th>Type</th><th>Description</th>',
                '        </tr>'
            );
            for (let i = 0; i < event.params.length; i++) {
                let param = event.params[i];
                output.push(
                    '        <tr>',
                    '            <td>' + param.name + '</td><td>' + param.type + '</td><td>' + param.description + '</td>',
                    '        </tr>'
                );
            }
            output.push('    </table>');
        }
    }

    addProperties(properties) {
        let output = this._output;
        output.push(
            '    <p>These properties can be edited with the property editor in the IDE.</p>',
            '    <table class="help-table">',
            '        <tr>',
            '            <th>Name</th><th>Type</th><th>Description</th>',
            '        </tr>'
        );
        properties.properties.forEach((property) => {
            output.push(
                '<tr>' +
                    '<td>' + property.name + '</td>' +
                    '<td>' + property.type + '</td>' +
                    '<td>' + property.description + '</td>' +
                '</tr>'
            );
        });
        output.push('    </table>');
    }

    addImages(helpText) {
        let i      = helpText.indexOf('src="', 0);
        let id     = 0;
        let images = {};
        while (i !== -1) {
            let j        = helpText.indexOf('"', i + 6);
            let filename = helpText.substr(i + 5, j - i - 5);
            if (!(filename in images)) {
                images[filename] = [];
            }
            images[filename].push(id);
            helpText = helpText.substr(0, i + 5) + '" id="img' + id + '"' + helpText.substr(j + 1, helpText.length - j + 1);
            id++;
            i = helpText.indexOf('src="', i + 6);
        }
        return {
            helpText: helpText,
            images:   images
        };
    }

    addSubject(parentNode, subject) {
        let node = {
                children: []
            };
        if (('category' in subject) && (subject.category !== this._lastCategory)) {
            node.children.push({
                type:      'h3',
                innerHTML: subject.category,
                title:     subject.category
            });
            this._lastCategory = subject.category;
        }
        node.children.push({
            id: function(element) {
                element.addEventListener(
                    'click',
                    function() {
                        let id = subject.title.split(' ').join('');
                        container.scrollTop = document.getElementById(id).offsetTop;
                    }
                );
            },
            className: 'subject',
            innerHTML: subject.title,
            title:     subject.title
        });
        new DOMNode({}).create(parentNode, node);
        return this;
    }

    addLink(link) {
        this._output.push(
            '    <div class="link-box">',
            '        <a href="' + link.src + '" title="' + link.title + '" target="_wheelLink">' + link.title + '</a>',
            '    </div>'
        );
    }

    addFileTitle(opts) {
        let file         = opts.file;
        let documentPath = opts.documentPath;
        let mainTitle    = '';
        if (file.module) {
            this
                .addTitle(file.module + ' module', '    ')
                .addSubTitle(this.getFilenameWithoutDocumentPath(file.name), '    ');
        } else if (file.subject) {
            mainTitle = file.subject;
            let i = mainTitle.indexOf(':');
            mainTitle = (i === -1) ? mainTitle : mainTitle.substr(i + 1 - mainTitle.length);
            this.addTitle(mainTitle, '    ');
        } else {
            this.addTitle(this.getFilenameWithoutDocumentPath(file.name), '    ');
        }
        this._lastTitle = mainTitle;
    }

    addSee(opts) {
        let helpData       = this._helpData;
        let seeList        = [];
        let seeListByTitle = {};
        opts.see.forEach(
            function(see) {
                let items = see.split('|');
                let title = see;
                if (items.length > 1) {
                    title = items[0];
                    see   = items[1];
                }
                let ids = this.getIdsForKeyword(see);
                if (!ids) {
                    return;
                }
                ids.forEach(
                    function(id) {
                        let fileIndex    = -1;
                        let subjectTitle = title;
                        if (id in helpData.subjectById) {
                            let subject = helpData.subjectById[id];
                            fileIndex = subject.fileIndex;
                        } else if (id in helpData.sectionById) {
                            let section = helpData.sectionById[id];
                            subjectTitle = helpData.files[section.fileIndex].subject;
                            let i = subjectTitle.indexOf(':');
                            if (i !== -1) {
                                subjectTitle = subjectTitle.substr(i + 1 - subjectTitle.length);
                            }
                            if (title !== subjectTitle) {
                                subjectTitle = title + '(' + subjectTitle + ')';
                            }
                            fileIndex = section.fileIndex;
                        } else {
                            return;
                        }
                        if (seeListByTitle[subjectTitle]) {
                            return;
                        }
                        seeListByTitle[subjectTitle] = true;
                        seeList.push({
                            title:     subjectTitle,
                            fileIndex: fileIndex,
                            toString: function() {
                                return this.title;
                            }
                        });
                    },
                    this
                );
            },
            this
        );
        if (!seeList.length) {
            return;
        }
        let output = this._output;
        output.push(
            '    <div class="see-also-block">',
            '        <span class="see-also-label">See also: </span>'
        );
        seeList.sort();
        let files = this._helpData.files;
        seeList.forEach(
            function(see) {
                output.push('        <a href="' + getFilename(files[see.fileIndex].subject) + '" class="see-also">' + see.title + '</a>');
            },
            this
        );
        output.push('    </div>');
    }

    addTable(head, body) {
        let output = this._output;
        output.push(
            '    <table class="help-table">',
            '        <tr>'
        );
        head.forEach((h) => {
            output.push('            <th>' + h + '</th>');
        });
        output.push('        </th>');
        body.forEach((r) => {
            output.push('        <tr>');
            r.forEach((c) => {
                const loaderText = '<span class="image-loader">';
                const svgHeader  = 'data:image/svg+xml';
                let i = c.indexOf(loaderText);
                if (i !== -1) {
                    let j        = c.indexOf('</span>', i);
                    let filename = c.substr(i + loaderText.length, j - i - loaderText.length);
                    let image    = getImage(filename);
                    if (image) {
                        if (image.indexOf(svgHeader) === 0) {
                            image = image.substr(svgHeader.length + 1 - image.length);
                            c     = c.substr(0, i) + image + c.substr(j, i - j);
                            c     = '<div class="image-wrapper">' + c + '</div>';
                        } else {
                            c     = c.substr(0, i) + '<img src="' + image + '"/>' + c.substr(j, i - j);
                        }
                    }
                }
                if (c.substr(0, 1) === ':') {
                    output.push('            <td colspan="' + c.substr(1, 1) + '">' + c.substr(2 - c.length) + '</td>');
                } else {
                    output.push('            <td>' + c + '</td>');
                }
            });
            output.push('        </tr>');
        });
        output.push('    </table>');
    }

    addList(list) {
        let output = this._output;
        output.push('    <ul>');
        list.forEach((item) => {
            output.push('        <li>' + item + '</li>');
        });
        output.push('    </ul>');
    }

    addNamespace(namespace) {
        this._output.push(
            '<h5 class="title-with-source">Namespace</h5>',
            '<div class="source-location">' + namespace + '<br/></div>'
        );
    }

    buildFile(opts) {
        this._lastTitle     = '';
        this._output.length = 0;
        this.addFileTitle(opts);
        let output      = this._output;
        let file        = opts.file;
        let subjects    = [];
        let wheelSyntax = new WheelSyntax();
        let sections    = file.sections;
        if (file.namespace) {
            this.addNamespace(file.namespace);
        }
        for (let i = 0; i < sections.length; i++) {
            let section   = sections[i];
            let title     = section.title;
            let lastEvent = false;
            if (title === '') {
                continue;
            }
            output.push('    <a id="' + title.split(' ').join('') + '"></a>');
            if ((title !== '-') && (this._lastTitle !== title)) {
                this.addSubSubTitle(title, '', '    ');
            }
            let content = section.content;
            for (let j = 0; j < content.length; j++) {
                switch (content[j].type) {
                    case 'description':
                        let paragraph = [];
                        content[0].text.push('');
                        content[0].text.forEach((line) => {
                            if (line === '') {
                                output.push('    <p>' + paragraph.join(' ') + '</p>');
                                paragraph.length = 0;
                            } else {
                                paragraph.push(line);
                            }
                        });
                        break;
                    case 'text':
                        output.push('    <p>');
                        content[j].text.forEach(
                            function(line) {
                                output.push('        ' + ((line.trim() === '') ? '<br/>' : line));
                            },
                            this
                        );
                        output.push('    </p>');
                        break;
                    case 'load':
                        let url = content[j].text[1];
                        if (url.substr(-5) === '.wfrm') {
                            url = url.substr(0, url.length - 4) + 'whlp';
                        }
                        output.push(
                            '    <div class="link-box">',
                            '        <a href="https://github.com/ArnoVanDerVegt/wheel/tree/develop/assets/template/' + url + '" ' +
                            '           target="_wheelLink" class="start">View on Github »</a>',
                            '    </div>'
                        );
                        break;
                    case 'link':
                        this.addLink({title: content[j].text[0], src: content[j].text[1]});
                        break;
                    case 'see':
                        this.addSee({see: content[j].text});
                        break;
                    case 'example':
                        output.push('    <pre class="wheel">' + wheelSyntax.parseLines(content[j].text) + '</pre>');
                        break;
                    case 'error':
                        output.push('    <pre class="error">' + content[j].text.join('\n') + '</pre>');
                        break;
                    case 'list':
                        this.addList(content[j].text);
                        break;
                    case 'table':
                        this.addTable(content[j].text.head, content[j].text.body);
                        break;
                    case 'image':
                        output.push(
                            '    <img ' +
                            'src="' + (getImage(content[j].text) || content[j].text) + '" ' +
                            'class="' + ((content[j].text.indexOf('components/') !== -1) ? 'shadow' : '') + '"' +
                            '/>'
                        );
                        break;
                    case 'const':
                        this.addConstants(content[j].text);
                        break;
                    case 'event':
                        lastEvent = true;
                        this.addEvent(content[j].text);
                        break;
                    case 'properties':
                        this.addProperties(content[j].text);
                        break;
                    case 'proc':
                        this.addProc(content[j].text);
                        break;
                    case 'var':
                        this.addVar(content[j].text);
                        break;
                    case 'record':
                        this.addRecord(content[j].text);
                        break;
                }
            }
            if (lastEvent) {
                output.push('<hr/>');
            }
        }
        return this._output;
    }

    buildFileIndex(opts) {
        this.addFileTitle(opts);
        let container = opts.container;
        let file      = opts.file;
        let node      = {
                children: []
            };
        let onClick = function(id) {
                return function() {
                    let element = document.getElementById(id.split(' ').join(''));
                    if (element) {
                        container.scrollTop = element.offsetTop;
                    }
                };
            };
        file.sections.forEach((section) => {
            if (section.title !== '') {
                node.children.push({
                    id: function(element) {
                        element.addEventListener('click', onClick(section.title));
                    },
                    className: 'subject',
                    innerHTML: section.title,
                    title:     section.title
                });
                section.content.forEach((content) => {
                    if (['const', 'proc'].indexOf(content.type) !== -1) {
                        let id = content.text.description.split(' ').join('');
                        node.children.push({
                            id: function(element) {
                                element.addEventListener('click', onClick(id));
                            },
                            className: 'sub-subject',
                            innerHTML: content.text.description,
                            title:     content.text.description
                        });
                    }
                });
            }
        });
        new DOMNode({}).create(opts.parentNode, node);
        this.updateImages();
    }

    buildIndexList(title, helpFiles) {
        this._output = this._output.concat(new IndexListText({
            title:     title,
            helpFiles: helpFiles
        }).getOutput());
        return this;
    }

    buildSubjectIndex(helpData, prefix, notPrefix, title) {
        let files     = helpData.files;
        let helpFiles = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (!file.subject) {
                continue;
            }
            let show = (file.subject.indexOf(prefix) === 0);
            let name = file.subject.substr(prefix.length - file.subject.length);
            if (notPrefix && (file.subject.indexOf(notPrefix) === 0)) {
                show = false;
            }
            if (show) {
                helpFiles.push({
                    index:    i,
                    name:     name,
                    device:   file.device,
                    subject:  file.subject,
                    toString: function() { return this.name; }
                });
            }
        }
        helpFiles.sort();
        return this.buildIndexList(title, helpFiles);
    }

    buildMainIndex(helpData, documentPath) {
        this._output.length = 0;
        this._helpData      = helpData;
        this
            .addLegend()
            .buildSubjectIndex(helpData, 'Programming:',       false,               'Programming')
            .buildSubjectIndex(helpData, 'IDE:',               false,               'IDE')
            .buildSubjectIndex(helpData, 'VM:',                false,               'Compiler and VM')
            .addSeparator('')
            .buildSubjectIndex(helpData, 'Example:',           false,               'Examples')
            .buildSubjectIndex(helpData, 'EV3_Example:',       false,               'EV3 examples')
            .buildSubjectIndex(helpData, 'PoweredUp_Example:', false,               'Powered Up examples')
            .addSeparator('')
            .buildSubjectIndex(helpData, 'Component_Example:', false,               'IDE Component examples')
            .buildSubjectIndex(helpData, 'Module:',            'Module:Component/', 'Modules')
            .buildSubjectIndex(helpData, 'Module:Component/',  false,               'IDE Modules')
            .addSeparator('')
            .buildSubjectIndex(helpData, 'Miscellaneous:',     false,               'Miscellaneous');
        return this._output;
    }

    addLegend() {
        let output = this._output;
        const addLegendItem = function(type, title) {
                output.push.apply(
                    output,
                    [
                            '    <div class="legend-item">',
                            '        <div class="device ' + type + '">' + type.toUpperCase() + '</div>',
                            '        <div class="title">' + title + '</div>',
                            '    </div>'
                        ]
                    );
            };
        output.push('<div class="legend">');
        addLegendItem('n', 'NXT');
        addLegendItem('e', 'EV3');
        addLegendItem('p', 'Powered Up');
        addLegendItem('s', 'Spike');
        addLegendItem('i', 'IDE');
        output.push('</div>');
        return this;
    }

    addSeparator(indent) {
        this._output.push((indent || '') + '<div class="breaker"></div>');
        return this;
    }

    generateAllHelp(readyCallback) {
        let helpData    = this._helpData;
        let files       = helpData.files;
        let fileIndex   = 0;
        let processFile = () => {
                if (fileIndex >= files.length) {
                    readyCallback();
                    return;
                }
                let file     = files[fileIndex];
                let filename = getFilename(file.subject);
                fileIndex++;
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        type:    SettingsState.CONSOLE_MESSAGE_TYPE_HINT,
                        message: 'Writing: <i>' + 'site/docs/' + filename + '</i>'
                    }
                );
                getDataProvider().getData(
                    'post',
                    'ide/file-save',
                    {
                        filename: 'site/docs/' + filename,
                        data:     this.getTemplateFile(file, this.buildFile({file: file}).join('\n        '), 'help-file')
                    },
                    processFile
                );
            };
        dispatcher.dispatch(
            'Console.Log',
            {
                type:    SettingsState.CONSOLE_MESSAGE_TYPE_HINT,
                message: 'Writing: <i>site/docs/index.html</i>'
            }
        );
        getDataProvider().getData(
            'post',
            'ide/file-save',
            {
                filename: 'site/docs/index.html',
                data:     this.getTemplateFile(
                    {
                        subject: 'Documentation'
                    },
                    this.buildMainIndex(helpData, this._documentPath).join('\n        '),
                    'help-files'
                )
            },
            processFile
        );
    }
}

exports.getFilename     = getFilename;
exports.HelpBuilderText = HelpBuilderText;
