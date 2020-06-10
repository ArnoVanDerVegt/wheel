/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const A             = require('../../lib/components/basic/A').A;
const H             = require('../../lib/components/basic/H').H;
const P             = require('../../lib/components/basic/P').P;
const Hr            = require('../../lib/components/basic/Hr').Hr;
const Pre           = require('../../lib/components/basic/Pre').Pre;
const Table         = require('../../lib/components/basic/Table').Table;
const Img           = require('../../lib/components/basic/Img').Img;
const Ul            = require('../../lib/components/basic/Ul').Ul;
const Span          = require('../../lib/components/basic/Span').Span;
const Button        = require('../../lib/components/Button').Button;
const DOMNode       = require('../../lib/dom').DOMNode;
const dispatcher    = require('../../lib/dispatcher').dispatcher;
const path          = require('../../lib/path');
const getImage      = require('../data/images').getImage;
const WheelSyntax   = require('./woc/WheelSyntax').WheelSyntax;
const IndexList     = require('./components/IndexList').IndexList;
const IndexListText = require('./components/IndexListText').IndexListText;

const getFilename = function(subject) {
        [':', '_', '/', ',', ' '].forEach(function(c) {
            subject = subject.split(c).join('_');
        });
        return subject + '.html';
    };

class HelpBuilderText {
    constructor() {
        this._output = [];
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
        let output = this._output;
        output.push(
            '    <p>',
            '        <a id="' + constant.description.split(' ').join('') + '"></a>',
            '        <div>' + constant.description + '<br/></div>',
            '        <div class="source-location">Source: ' +  this.getFilenameWithoutDocumentPath(constant.filename) + ', line: ' + constant.lineNumber + '<br/></div>',
            '        <table class="help-table constants">'
        );

        let body = [];
        constant.values.forEach(function(value) {
            output.push('            <tr><td>' + value.key + '</td><td>' + value.value + '</td></tr>');
        });
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
                '            <th>Name</th><th>Type</th>Description</th>',
                '        </tr>'
            );
            for (let i = 0; i < event.params.length; i++) {
                let param = event.params[i];
                output.push(
                    '        <tr>',
                    '            <th>' + param.name + '</th><th>' + param.type + '</th>' + param.description + '</th>',
                    '        </tr>'
                );
            }
            output.push('    </table>');
        }
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

    addLoadButton(buttons) {
        let children = [];
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            children.push({
                type:     Button,
                ui:       button.ui,
                uiId:     button.uiId,
                value:    button.title,
                tabIndex: 256,
                color:    'blue',
                onClick:  function() {
                    button.dialog.hide();
                    dispatcher.dispatch('Dialog.File.Open', path.join(button.documentPath, button.src));
                }
            });
        }
        new DOMNode({}).create(
            buttons[0].parentNode,
            {
                className: 'example-loader',
                children:  children
            }
        );
    }

    addLink(link) {
        new DOMNode({}).create(
            link.parentNode,
            {
                className: 'link-box',
                children: [
                    window.electron ?
                        {
                            innerHTML: link.title,
                            title:     link.title,
                            className: 'link',
                            id: function(element) {
                                element.addEventListener(
                                    'click',
                                    function() {
                                        const shell = require('electron').shell;
                                        shell.openExternal(link.src);
                                    }
                                );
                            }
                        } :
                        {
                            type:      'a',
                            href:      link.src,
                            innerHTML: link.title,
                            title:     link.title,
                            target:    '_wheelLink'
                        }
                ]
            }
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
            this.addTitle((i === -1) ? mainTitle : mainTitle.substr(i + 1 - mainTitle.length), '    ');
        } else {
            this.addTitle(this.getFilenameWithoutDocumentPath(file.name), '    ');
        }
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
        let node = {
                className: 'see-also-block',
                children: [
                    {
                        type:      'span',
                        innerHTML: 'See also: '
                    }
                ]
            };
        if (seeList.length > 1) {
            node.children.push({className: 'breaker'});
            seeList.sort();
        }
        seeList.forEach(
            function(see) {
                node.children.push({
                    type:      'span',
                    className: 'see-also',
                    innerHTML: see.title,
                    id: (function(element) {
                        element.addEventListener('click', this.onClickSee.bind(this, see.fileIndex));
                    }).bind(this)
                });
            },
            this
        );
        new DOMNode({}).create(opts.parentNode, node);
    }

    addTable(head, body) {
        let output = this._output;
        output.push(
            '    <table class="help-table">',
            '        <tr>'
        );
        head.forEach(function(h) {
            output.push('            <th>' + h + '</th>');
        });
        output.push('        </th>');
        body.forEach(function(r) {
            output.push('        <tr>');
            r.forEach(function(c) {
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

    onClickSee(fileIndex) {
        this._dialog.onShowFileIndex(fileIndex);
    }

    buildFile(opts) {
        this._output.length = 0;
        this._documentPath  = opts.documentPath || '';
        this.addFileTitle(opts);
        let output      = this._output;
        let file        = opts.file;
        let subjects    = [];
        let wheelSyntax = new WheelSyntax();
        let sections    = file.sections;
        for (let i = 0; i < sections.length; i++) {
            let section   = sections[i];
            let title     = section.title;
            let lastEvent = false;
            if (title === '') {
                continue;
            }
            output.push('    <a id="' + title.split(' ').join('') + '"></a>');
            this.addSubSubTitle(title, '', '    ');
            let content = section.content;
            for (let j = 0; j < content.length; j++) {
                switch (content[j].type) {
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
                        console.log('Todo: load');
                        // let buttons = [];
                        // while (content[j].type === 'load') {
                        //     let button  = Object.assign({}, opts);
                        //     button.title = content[j].text[0];
                        //     button.src   = content[j].text[1];
                        //     buttons.push(button);
                        //     j++;
                        // }
                        // j--;
                        // this.addLoadButton(buttons);
                        break;
                    case 'link':
                        console.log('Todo: link');
                        // this.addLink({
                        //     parentNode: parentNode,
                        //     title:      content[j].text[0],
                        //     src:        content[j].text[1]
                        // });
                        break;
                    case 'see':
                        console.log('Todo: see');
                        // this.addSee({
                        //     parentNode: parentNode,
                        //     see:        content[j].text
                        // });
                        break;
                    case 'example':
                        output.push('    <pre class="wheel">' + wheelSyntax.parseLines(content[j].text) + '</pre>');
                        break;
                    case 'error':
                        output.push('    <pre class="error">' + content[j].text.join('\n') + '</pre>');
                        break;
                    case 'list':
                        console.log('Todo: list');
                        // new Ul({
                        //     parentNode: parentNode,
                        //     list:       content[j].text
                        // });
                        break;
                    case 'table':
                        this.addTable(content[j].text.head, content[j].text.body);
                        break;
                    case 'image':
                        console.log('Todo: image');
                        // new Img({
                        //     parentNode: parentNode,
                        //     src:        getImage(content[j].text) || content[j].text
                        // });
                        break;

                    case 'const':
                        this.addConstants(content[j].text);
                        break;
                    case 'event':
                        lastEvent = true;
                        this.addEvent(content[j].text);
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
        file.sections.forEach(function(section) {
            if (section.title !== '') {
                node.children.push({
                    id: function(element) {
                        element.addEventListener('click', onClick(section.title));
                    },
                    className: 'subject',
                    innerHTML: section.title,
                    title:     section.title
                });
                section.content.forEach(function(content) {
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
            dialog:     this._dialog,
            title:      title,
            helpFiles:  helpFiles
        }).getOutput());
        return this;
    }

    buildSubjectIndex(helpData, prefix, title) {
        let files     = helpData.files;
        let helpFiles = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (!file.subject) {
                continue;
            }
            let show = (file.subject.indexOf(prefix) === 0);
            let name = file.subject.substr(prefix.length - file.subject.length);
            if (file.subject.indexOf('/') !== -1) {
                if (prefix === 'Module:') {
                    show = false;
                } else {
                    name = name.substr(1 - name.length);
                }
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
            .buildSubjectIndex(helpData, 'Programming:',       'Programming')
            .buildSubjectIndex(helpData, 'IDE:',               'IDE')
            .buildSubjectIndex(helpData, 'VM:',                'Compiler and VM')
            .addSeparator('')
            .buildSubjectIndex(helpData, 'Example:',           'Examples')
            .buildSubjectIndex(helpData, 'EV3_Example:',       'EV3 examples')
            .buildSubjectIndex(helpData, 'PoweredUp_Example:', 'Powered Up examples')
            .addSeparator('')
            .buildSubjectIndex(helpData, 'Module:',            'Modules')
            .buildSubjectIndex(helpData, 'Module:Component',   'IDE Modules')
            .buildSubjectIndex(helpData, 'Miscellaneous:',     'Miscellaneous');
        return this._output;
    }

    addLegend() {
        let output = this._output;
        const addLegendItem = function(type, title) {
                output.push.apply(
                    output,
                    [
                            '    <div class="legend-item">',
                            '        <div class="device" ' + type + '">' + type.toUpperCase() + '</div>',
                            '        <div class="title">' + title + '</div>',
                            '    </div>'
                        ]
                    );
            };
        output.push('<div class="legend">');
        addLegendItem('e', 'EV3');
        addLegendItem('p', 'Powered Up');
        addLegendItem('m', 'Mindsensors');
        addLegendItem('i', 'IDE');
        output.push('</div>');
        return this;
    }

    addSeparator(indent) {
        this._output.push((indent || '') + '<div class="breaker"></div>');
        return this;
    }

    updateImages() {
        let images = document.querySelectorAll('span.image-loader');
        for (let i = 0; i < images.length; i++) {
            let src = images[i].innerHTML;
            images[i].innerHTML = '';
            new DOMNode({}).create(
                images[i],
                {
                    type: 'img',
                    src:  getImage(src)
                }
            );
        }
    }
}

exports.getFilename     = getFilename;
exports.HelpBuilderText = HelpBuilderText;
