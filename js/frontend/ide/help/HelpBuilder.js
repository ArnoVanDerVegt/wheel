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
            className:  'no-select ' + (className || '')
        });
        return this;
    }

    addSpan(parentNode, text, className) {
        new Span({
            parentNode: parentNode,
            className:  'no-select ' + className,
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

    addSubSubTitle(parentNode, title, className) {
        return this.addH(parentNode, '4', title);
    }

    addSubSubSubTitle(parentNode, title, className) {
        return this.addH(parentNode, '5', title, className);
    }

    addConstants(parentNode, constant) {
        let body     = [];
        let hasImage = false;
        constant.values.forEach((value) => {
            if (value.image) {
                hasImage = true;
            }
        });
        constant.values.forEach((value) => {
            if (hasImage) {
                if (value.image) {
                    let image  = getImage(value.image);
                    let prefix = 'data:image/svg+xml,';
                    if (image.substr(0, prefix.length) === prefix) {
                        image = image.substr(prefix.length - image.length);
                        image = 'data:image/svg+xml;base64,' + btoa(image);
                    }
                    body.push(['<div class="no-select image-wrapper"><img src="' + image + '"/></div>', value.key, value.value]);
                } else {
                    body.push(['', value.key, value.value]);
                }
            } else {
                body.push([value.key, value.value]);
            }
        });
        let node = {
                type: 'p',
                children: [
                    {
                        type: A,
                        id:   constant.description.split(' ').join('')
                    },
                    {
                        className: 'no-select',
                        innerHTML: constant.description + '<br/>'
                    },
                    {
                        className: 'no-select source-location',
                        innerHTML: 'Source: ' +  this.getFilenameWithoutDocumentPath(constant.filename) + ', line: ' + constant.lineNumber + '<br/>'
                    },
                    {
                        type:      Table,
                        className: 'no-select help-table ' + (hasImage ? 'image-' : '') + 'constants',
                        body:      body
                    }
                ]
            };
        new DOMNode({}).create(parentNode, node);
    }

    addVar(parentNode, vr) {
        let head = ['Type'];
        let body = [vr.type];
        if (vr.arraySize) {
            head.push('Array size');
            body.push(vr.arraySize.join(', '));
        }
        let name = vr.name;
        let i    = name.indexOf('[');
        if (i !== -1) {
            name = name.substr(0, i);
        }
        let node = {
                type: 'p',
                children: [
                    {
                        type: A,
                        id:   vr.description.split(' ').join('')
                    },
                    {
                        type:      H,
                        size:      5,
                        innerHTML: name,
                        title:     vr.name,
                        className: 'no-select title-with-source'
                    },
                    {
                        className: 'no-select source-location',
                        innerHTML: 'Source: ' +  this.getFilenameWithoutDocumentPath(vr.filename) + ', line: ' + vr.lineNumber + '<br/>'
                    },
                    {
                        className: 'no-select',
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
            if (field === 'union') {
                body.push([':' + head.length + 'union']);
            } else {
                let row   = [field.name, field.type];
                if (arraySize) {
                    row.push(field.arraySize ? field.arraySize.join(', ') : '');
                }
                if (description) {
                    row.push(field.description || '');
                }
                body.push(row);
            }
        }
        let node = {
                type: 'p',
                children: [
                    {
                        type: A,
                        id:   record.description.split(' ').join('')
                    },
                    {
                        type:      H,
                        size:      5,
                        innerHTML: record.name,
                        title:     record.name,
                        className: 'no-select title-with-source'
                    },
                    {
                        className: 'no-select source-location',
                        innerHTML: 'Source: ' +  this.getFilenameWithoutDocumentPath(record.filename) + ', line: ' + record.lineNumber + '<br/>'
                    },
                    {
                        className: 'no-select',
                        innerHTML: record.description + '<br/>'
                    },
                    {
                        type:      Table,
                        className: 'no-select help-table',
                        head:      head,
                        body:      body
                    }
                ]
            };
        new DOMNode({}).create(parentNode, node);
    }

    addProc(parentNode, proc) {
        new A({parentNode: parentNode, id: proc.description.split(' ').join('')});
        this.addSubSubSubTitle(parentNode, proc.name, 'title-with-source');
        new DOMNode({}).create(
            parentNode,
            {
                className: 'no-select source-location',
                innerHTML: 'Source: ' +  this.getFilenameWithoutDocumentPath(proc.filename) + ', line: ' + proc.lineNumber + '<br/>'
            }
        );
        if (proc.device !== '') {
            let children = [];
            proc.device.split(',').forEach(
                function(device) {
                    if ('EPM'.indexOf(device) !== -1) {
                        children.push({type: Span, innerHTML: device, className: device.toLowerCase()});
                    }
                },
                this
            );
            new DOMNode({}).create(parentNode, {className: 'devices', children: children});
        }
        new P({parentNode: parentNode, className: 'no-select', innerHTML: proc.description});
        let params = [];
        for (let i = 0; i < proc.params.length; i++) {
            let param = proc.params[i];
            params.push(param.type + ' ' + param.name);
        }
        let wheelSyntax = new WheelSyntax();
        let s           = 'proc ' + proc.name + '(' + params.join(', ') + ')';
        new Pre({parentNode: parentNode, className: 'wheel', innerHTML: wheelSyntax.parseLines([s])});
        if (proc.params.length) {
            new DOMNode({}).create(parentNode, {className: 'no-select', innerHTML: 'Parameters:<br/>'});
            let head = ['Name', 'Type', 'Description'];
            let body = [];
            for (let i = 0; i < proc.params.length; i++) {
                let param = proc.params[i];
                body.push([param.name, param.type, param.description]);
            }
            new Table({parentNode, className: 'help-table', head: head, body: body});
        }
        if (proc.ret) {
            new P({parentNode: parentNode, className: 'no-select', innerHTML: '<b>Return:</b> ' + proc.ret + '<br/><br/>'});
        }
        if (proc.text) {
            new P({parentNode: parentNode, className: 'no-select', innerHTML: proc.text.join('<br/>')});
        }
        if (proc.example) {
            new Pre({parentNode: parentNode, className: 'wheel', innerHTML: wheelSyntax.parseLines(proc.example)});
        }
        new Hr({parentNode: parentNode});
    }

    addEvent(parentNode, event) {
        new A({parentNode: parentNode, id: event.description.split(' ').join('')});
        this.addSubSubSubTitle(parentNode, event.name, 'title-with-source');
        new P({parentNode: parentNode, className: 'no-select', innerHTML: event.description});
        let params = [];
        for (let i = 0; i < event.params.length; i++) {
            let param = event.params[i];
            params.push(param.type + ' ' + param.name);
        }
        let wheelSyntax = new WheelSyntax();
        let s           = 'proc ' + event.name + '(' + params.join(', ') + ')';
        new Pre({parentNode: parentNode, className: 'wheel', innerHTML: wheelSyntax.parseLines([s])});
        if (event.params.length) {
            new DOMNode({}).create(parentNode, {className: 'no-select', innerHTML: 'Parameters:<br/>'});
            let head = ['Name', 'Type', 'Description'];
            let body = [];
            for (let i = 0; i < event.params.length; i++) {
                let param = event.params[i];
                body.push([param.name, param.type, param.description]);
            }
            new Table({parentNode, className: 'help-table', head: head, body: body});
        }
    }

    addProperties(parentNode, properties) {
        new P({parentNode: parentNode, innerHTML: 'These properties can be edited with the property editor in the IDE.'});
        let head = ['Name', 'Type', 'Description'];
        let body = [];
        properties.properties.forEach((property) => {
            body.push([property.name, property.type, property.description]);
        });
        new Table({parentNode, className: 'help-table', head: head, body: body});
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
        let parentNode   = opts.parentNode;
        let file         = opts.file;
        let documentPath = opts.documentPath;
        let mainTitle    = '';
        if (file.module) {
            this
                .addTitle(parentNode, file.module + ' module')
                .addSubTitle(parentNode, this.getFilenameWithoutDocumentPath(file.name));
        } else if (file.subject) {
            mainTitle = file.subject;
            let i = mainTitle.indexOf(':');
            mainTitle = (i === -1) ? mainTitle : mainTitle.substr(i + 1 - mainTitle.length);
            this.addTitle(parentNode, mainTitle);
        } else {
            this.addTitle(this.getFilenameWithoutDocumentPath(file.name));
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
        let node = {
                className: 'see-also-block',
                children: [
                    {
                        type:      'span',
                        className: 'no-select',
                        innerHTML: 'See also: '
                    }
                ]
            };
        if (seeList.length > 1) {
            node.children.push({className: 'flt max-w'});
            seeList.sort();
        }
        seeList.forEach(
            function(see) {
                node.children.push({
                    type:      'span',
                    className: 'no-select see-also',
                    innerHTML: see.title,
                    id: (element) => {
                        element.addEventListener('click', this.onClickSee.bind(this, see.fileIndex));
                    }
                });
            },
            this
        );
        new DOMNode({}).create(opts.parentNode, node);
    }

    addNamespace(parentNode, namespace) {
        new DOMNode({}).create(
            parentNode,
            {
                type:      H,
                size:      5,
                innerHTML: 'Namespace',
                title:     'Namespace',
                className: 'title-with-source'
            }
        );
        new DOMNode({}).create(
            parentNode,
            {
                innerHTML: namespace + '<br/>',
                className: 'source-location'
            }
        );
    }

    onClickSee(fileIndex) {
        this._dialog.onShowFileIndex(fileIndex);
    }

    buildFile(opts) {
        this._lastTitle    = '';
        this._documentPath = opts.documentPath || '';
        this.addFileTitle(opts);
        let parentNode  = opts.parentNode;
        let file        = opts.file;
        let subjects    = [];
        let wheelSyntax = new WheelSyntax();
        let sections    = file.sections;
        if (file.namespace) {
            this.addNamespace(parentNode, file.namespace);
        }
        for (let i = 0; i < sections.length; i++) {
            let section   = sections[i];
            let title     = section.title;
            let lastEvent = false;
            if (title === '') {
                continue;
            }
            new A({parentNode: parentNode, id: title.split(' ').join('')});
            if ((title !== '-') && (this._lastTitle !== title)) {
                this.addSubSubTitle(parentNode, title);
            }
            this._lastTitle = '';
            let content = section.content;
            for (let j = 0; j < content.length; j++) {
                switch (content[j].type) {
                    case 'description':
                        let paragraph = [];
                        content[0].text.push('');
                        content[0].text.forEach((line) => {
                            if (line === '') {
                                new P({parentNode: parentNode, className: 'no-select description', innerHTML: paragraph.join(' ')});
                                paragraph.length = 0;
                            } else {
                                paragraph.push(line);
                            }
                        });
                        break;
                    case 'text':
                        let lines = [];
                        content[j].text.forEach((line) => {
                            lines.push((line.trim() === '') ? '<br/>' : line);
                        });
                        new P({parentNode: parentNode, className: 'no-select', innerHTML: lines.join(' ')});
                        break;
                    case 'load':
                        let buttons = [];
                        while (content[j].type === 'load') {
                            let button  = Object.assign({}, opts);
                            button.title = content[j].text[0];
                            button.src   = content[j].text[1];
                            buttons.push(button);
                            j++;
                        }
                        j--;
                        this.addLoadButton(buttons);
                        break;
                    case 'link':
                        this.addLink({
                            parentNode: parentNode,
                            title:      content[j].text[0],
                            src:        content[j].text[1]
                        });
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
                            className:  'no-select',
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
                            src:        getImage(content[j].text) || content[j].text,
                            className:  'no-select ' + ((content[j].text.indexOf('components/') !== -1) ? 'shadow' : '')
                        });
                        break;
                    case 'const':
                        this.addConstants(parentNode, content[j].text);
                        break;
                    case 'event':
                        lastEvent = true;
                        this.addEvent(parentNode, content[j].text);
                        break;
                    case 'properties':
                        this.addProperties(parentNode, content[j].text);
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
            if (lastEvent) {
                new Hr({parentNode: parentNode});
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
        file.sections.forEach((section) => {
            if ((section.title === '') ||(section.title === '-')) {
                return;
            }
            node.children.push({
                id: function(element) {
                    element.addEventListener('click', onClick(section.title));
                },
                className: 'no-select subject',
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
                        className: 'no-select sub-subject',
                        innerHTML: content.text.description,
                        title:     content.text.description
                    });
                }
            });
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

    buildSubjectIndex(parentNode, helpData, prefix, notPrefix, title) {
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
            .buildSubjectIndex(parentNode, helpData, 'Programming:',       false,               'Programming')
            .buildSubjectIndex(parentNode, helpData, 'IDE:',               false,               'IDE')
            .buildSubjectIndex(parentNode, helpData, 'VM:',                false,               'Compiler and VM')
            .addSeparator(parentNode)
            .buildSubjectIndex(parentNode, helpData, 'Example:',           false,               'Examples')
            .buildSubjectIndex(parentNode, helpData, 'EV3_Example:',       false,               'EV3 examples')
            .buildSubjectIndex(parentNode, helpData, 'PoweredUp_Example:', false,               'Powered Up examples')
            .addSeparator(parentNode)
            .buildSubjectIndex(parentNode, helpData, 'Component_Example:', false,               'IDE Component examples')
            .buildSubjectIndex(parentNode, helpData, 'Module:',            'Module:Component/', 'Modules')
            .buildSubjectIndex(parentNode, helpData, 'Module:Component/',  false,               'IDE Modules')
            .addSeparator(parentNode)
            .buildSubjectIndex(parentNode, helpData, 'Miscellaneous:',     false,               'Miscellaneous');
    }

    addLegend(parentNode) {
        const addLegendItem = function(type, title) {
                return {
                    className: 'flt legend-item',
                    children: [
                        {
                            className: 'no-select flt device ' + type,
                            innerHTML: type.toUpperCase()
                        },
                        {
                            className: 'no-select flt title',
                            innerHTML: title
                        }
                    ]
                };
            };
        new DOMNode({}).create(
            parentNode,
            {
                className: 'flt max-w legend',
                children: [
                    addLegendItem('e', 'EV3'),
                    addLegendItem('p', 'Powered Up'),
                    addLegendItem('m', 'Mindsensors'),
                    addLegendItem('i', 'IDE')
                ]
            }
        );
        return this;
    }

    addSeparator(parentNode) {
        new DOMNode({}).create(parentNode, {className: 'flt max-w'});
        return this;
    }

    updateImages() {
        let images = document.querySelectorAll('span.image-loader');
        for (let i = 0; i < images.length; i++) {
            let src = images[i].innerHTML;
            images[i].innerHTML = '';
            if (src.substr(-4) === '.svg') {
                new DOMNode({}).create(
                    images[i],
                    {
                        className: 'image-wrapper',
                        children: [
                            {
                                type: 'img',
                                src:  getImage(src)
                            }
                        ]
                    }
                );
            } else {
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
}

exports.helpBuilder = new HelpBuilder();
