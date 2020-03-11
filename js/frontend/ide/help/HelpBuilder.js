/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const A           = require('../../lib/components/basic/A').A;
const H           = require('../../lib/components/basic/H').H;
const P           = require('../../lib/components/basic/P').P;
const Hr          = require('../../lib/components/basic/Hr').Hr;
const Pre         = require('../../lib/components/basic/Pre').Pre;
const Table       = require('../../lib/components/basic/Table').Table;
const Img         = require('../../lib/components/basic/Img').Img;
const Ul          = require('../../lib/components/basic/Ul').Ul;
const Span        = require('../../lib/components/basic/Span').Span;
const Button      = require('../../lib/components/Button').Button;
const DOMNode     = require('../../lib/dom').DOMNode;
const dispatcher  = require('../../lib/dispatcher').dispatcher;
const path        = require('../../lib/path');
const getImage    = require('../data/images').getImage;
const WheelSyntax = require('./woc/WheelSyntax').WheelSyntax;
const IndexList   = require('./components/IndexList').IndexList;

class HelpBuilder {
    getFilenameWithoutDocumentPath(filename, documentPath) {
        if (documentPath === '') {
            return filename;
        }
        return filename.substr(documentPath.length + 1 - filename.length);
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

    addH(parentNode, size, title) {
        new H({
            parentNode: parentNode,
            size:       size,
            innerHTML:  title
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

    addTitle(parentNode, title) {
        return this.addH(parentNode, '2', title);
    }

    addSubTitle(parentNode, title) {
        return this.addH(parentNode, '3', title);
    }

    addSubSubTitle(parentNode, title) {
        return this.addH(parentNode, '4', title);
    }

    addSubSubSubTitle(parentNode, title) {
        return this.addH(parentNode, '5', title);
    }

    addConstants(parentNode, constant) {
        let body = [];
        constant.values.forEach(function(value) {
            body.push([value.key, value.value]);
        });
        let node = {
                type: 'p',
                children: [
                    {
                        type: A,
                        id:   constant.description.split(' ').join('')
                    },
                    {
                        innerHTML: constant.description + '<br/>'
                    },
                    {
                        type:      Table,
                        className: 'help-table constants',
                        body:      body
                    }
                ]
            };
        new DOMNode({}).create(parentNode, node);
    }

    addVar(parentNode, vr) {
        let head = ['Name', 'Type'];
        let body = [vr.name, vr.type];
        if (vr.arraySize) {
            head.push('Array size');
            body.push(vr.arraySize.join(', '));
        }
        let node = {
                type: 'p',
                children: [
                    {
                        type: A,
                        id:   vr.description.split(' ').join('')
                    },
                    {
                        innerHTML: vr.description + '<br/>'
                    },
                    {
                        type:      Table,
                        className: 'help-table',
                        head:      head,
                        body:      [body]
                    }
                ]
            };
        new DOMNode({}).create(parentNode, node);
    }

    addRecord(parentNode, record) {
        let head        = ['Name', 'Type'];
        let body        = [];
        let fields      = record.fields;
        let arraySize   = false;
        let description = false;
        for (let i = 0; i < fields.length; i++) {
            arraySize = fields[i].arraySize;
            if (arraySize) {
                head.push('Array size');
                break;
            }
        }
        for (let i = 0; i < fields.length; i++) {
            description = fields[i].description;
            if (description) {
                head.push('Description');
                break;
            }
        }
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            let row   = [field.name, field.type];
            if (arraySize) {
                row.push(field.arraySize ? field.arraySize.join(', ') : '');
            }
            if (description) {
                row.push(field.description || '');
            }
            body.push(row);
        }
        let node = {
                type: 'p',
                children: [
                    {
                        type: A,
                        id:   record.description.split(' ').join('')
                    },
                    {
                        innerHTML: record.description + '<br/>'
                    },
                    {
                        type:      Table,
                        className: 'help-table',
                        head:      head,
                        body:      body
                    }
                ]
            };
        new DOMNode({}).create(parentNode, node);
    }

    addProc(parentNode, proc) {
        new A({parentNode: parentNode, id: proc.description.split(' ').join('')});
        this.addSubSubTitle(parentNode, proc.name);
        if (proc.device !== '') {
            let children = [];
            proc.device.split(',').forEach(
                function(device) {
                    if ('EP'.indexOf(device) !== -1) {
                        children.push({type: Span, innerHTML: device, className: device.toLowerCase()});
                    }
                },
                this
            );
            new DOMNode({}).create(parentNode, {className: 'devices', children: children});
        }
        new P({parentNode: parentNode, innerHTML: proc.description});
        let params = [];
        for (let i = 0; i < proc.params.length; i++) {
            let param = proc.params[i];
            params.push(param.type + ' ' + param.name);
        }
        let wheelSyntax = new WheelSyntax();
        let s           = 'proc ' + proc.name + '(' + params.join(',') + ')';
        new Pre({parentNode: parentNode, className: 'wheel', innerHTML: wheelSyntax.parseLines([s])});
        if (proc.ret) {
            new DOMNode({parentNode: parentNode, innerHTML: '<b>Return:</b> ' + proc.ret + '<br/><br/>'});
        }
        if (proc.params.length) {
            let head = ['Name', 'Type', 'Description'];
            let body = [];
            for (let i = 0; i < proc.params.length; i++) {
                let param = proc.params[i];
                body.push([param.name, param.type, param.description]);
            }
            new Table({parentNode, className: 'help-table', head: head, body: body});
        }
        if (proc.ret) {
            new P({parentNode: parentNode, innerHTML: 'Return: <i>' + proc.ret + '</i>'});
        }
        if (proc.text) {
            new P({parentNode: parentNode, innerHTML: proc.text.join('<br/>')});
        }
        if (proc.example) {
            new Pre({parentNode: parentNode, className: 'wheel', innerHTML: wheelSyntax.parseLines(proc.example)});
        }
        new Hr({parentNode: parentNode});
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

    addLoadButton(opts) {
        new DOMNode({}).create(
            opts.parentNode,
            {
                className: 'example-loader',
                children: [
                    {
                        type:     Button,
                        ui:       opts.ui,
                        uiId:     opts.uiId,
                        value:    opts.title,
                        tabIndex: 256,
                        color:    'blue',
                        onClick:  function() {
                            opts.dialog.hide();
                            dispatcher.dispatch('Dialog.File.Open', path.join(opts.documentPath, opts.src));
                        }
                    }
                ]
            }
        );
    }

    addFileTitle(opts) {
        let parentNode   = opts.parentNode;
        let file         = opts.file;
        let documentPath = opts.documentPath;
        let mainTitle    = '';
        if (file.module) {
            this
                .addTitle(parentNode, file.module + ' module')
                .addSubTitle(parentNode, this.getFilenameWithoutDocumentPath(file.name, documentPath));
        } else if (file.subject) {
            mainTitle = file.subject;
            let i = mainTitle.indexOf(':');
            this.addTitle(parentNode, (i === -1) ? mainTitle : mainTitle.substr(i + 1 - mainTitle.length));
        } else {
            this.addTitle(this.getFilenameWithoutDocumentPath(file.name, documentPath));
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

    onClickSee(fileIndex) {
        this._dialog.onShowFileIndex(fileIndex);
    }

    buildFile(opts) {
        this.addFileTitle(opts);
        let parentNode  = opts.parentNode;
        let file        = opts.file;
        let subjects    = [];
        let wheelSyntax = new WheelSyntax();
        let sections    = file.sections;
        for (let i = 0; i < sections.length; i++) {
            let section = sections[i];
            let title   = section.title;
            if (title !== '') {
                new A({parentNode: parentNode, id: title.split(' ').join('')});
                this.addSubSubTitle(parentNode, title);
                let content = section.content;
                for (let j = 0; j < content.length; j++) {
                    switch (content[j].type) {
                        case 'text':
                            let lines = [];
                            content[j].text.forEach(function(line) {
                                lines.push((line.trim() === '') ? '<br/>' : line);
                            });
                            new P({parentNode: parentNode, innerHTML: lines.join(' ')});
                            break;
                        case 'load':
                            opts.title = content[j].text[0];
                            opts.src   = content[j].text[1];
                            this.addLoadButton(opts);
                            break;
                        case 'see':
                            this.addSee({
                                parentNode: parentNode,
                                see:        content[j].text
                            });
                            break;
                        case 'example':
                            new Pre({
                                parentNode: parentNode,
                                className:  'wheel',
                                innerHTML:  wheelSyntax.parseLines(content[j].text)
                            });
                            break;
                        case 'error':
                            new Pre({
                                parentNode: parentNode,
                                className:  'error',
                                innerHTML:  content[j].text.join('\n')
                            });
                            break;
                        case 'list':
                            new Ul({
                                parentNode: parentNode,
                                list:       content[j].text
                            });
                            break;
                        case 'table':
                            new Table({
                                parentNode: parentNode,
                                className:  'help-table',
                                head:       content[j].text.head,
                                body:       content[j].text.body
                            });
                            break;
                        case 'image':
                            new Img({
                                parentNode: parentNode,
                                src:        getImage(content[j].text) || content[j].text
                            });
                            break;
                        case 'const':
                            this.addConstants(parentNode, content[j].text);
                            break;
                        case 'proc':
                            this.addProc(parentNode, content[j].text);
                            break;
                        case 'var':
                            this.addVar(parentNode, content[j].text);
                            break;
                        case 'record':
                            this.addRecord(parentNode, content[j].text);
                            break;
                    }
                }
            }
        }
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

    buildIndexList(parentNode, title, helpFiles) {
        new IndexList({
            dialog:     this._dialog,
            parentNode: parentNode,
            title:      title,
            helpFiles:  helpFiles
        });
        return this;
    }

    buildSubjectIndex(parentNode, helpData, prefix, title) {
        let files     = helpData.files;
        let helpFiles = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.subject && (file.subject.indexOf(prefix) === 0)) {
                helpFiles.push({
                    index:    i,
                    name:     file.subject.substr(prefix.length - file.subject.length),
                    device:   file.device,
                    toString: function() { return this.name; }
                });
            }
        }
        helpFiles.sort();
        return this.buildIndexList(parentNode, title, helpFiles);
    }

    buildMainIndex(dialog, parentNode, helpData, documentPath) {
        this._helpData = helpData;
        this._dialog   = dialog;
        this
            .addLegend(parentNode)
            .buildSubjectIndex(parentNode, helpData, 'Programming:', 'Programming')
            .buildSubjectIndex(parentNode, helpData, 'Example:',     'Examples')
            .buildSubjectIndex(parentNode, helpData, 'Module:',      'Modules')
            .addSeparator(parentNode)
            .buildSubjectIndex(parentNode, helpData, 'IDE:',         'IDE')
            .buildSubjectIndex(parentNode, helpData, 'Installing:',  'Installing')
            .buildSubjectIndex(parentNode, helpData, 'Compiler:',    'Compiler')
            .addSeparator(parentNode)
            .buildSubjectIndex(parentNode, helpData, 'VM:',          'VM');
    }

    addLegend(parentNode) {
        const addLegendItem = function(type, title) {
                return {
                    className: 'legend-item',
                    children: [
                        {
                            className: 'device ' + type,
                            innerHTML: type.toUpperCase()
                        },
                        {
                            className: 'title',
                            innerHTML: title
                        }
                    ]
                };
            };
        new DOMNode({}).create(
            parentNode,
            {
                className: 'legend',
                children: [
                    addLegendItem('e', 'EV3'),
                    addLegendItem('p', 'Powered Up')
                ]
            }
        );
        return this;
    }

    addSeparator(parentNode) {
        new DOMNode({}).create(parentNode, {className: 'breaker'});
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

exports.helpBuilder = new HelpBuilder();
