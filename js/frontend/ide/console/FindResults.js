/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const tokenUtils = require('../../compiler/tokenizer/tokenUtils');
const dispatcher = require('../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../lib/dom').DOMNode;
const path       = require('../../lib/path');
const platform   = require('../../lib/platform');

class FindResult extends DOMNode {
    constructor(opts) {
        super(opts);
        this._found = opts;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let found      = this._found;
        let line       = found.line;
        let textLength = found.textLength;
        line = line.substr(0, found.pos) + '<span>' + line.substr(found.pos, textLength) + '</span>' + line.substr(found.pos + textLength - line.length);
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'find-result found',
                children: [
                    {
                        className: 'found-pos',
                        innerHTML: (found.num + 1) + ', ' + found.pos,
                        title:     'Line ' + (found.num + 1) + ' character ' + found.pos
                    },
                    {
                        className: 'found-line',
                        innerHTML: line
                    }
                ]
            }
        );
    }

    setElement(element) {
        element.addEventListener('click', this.onClick.bind(this));
    }

    onClick(event) {
        let found    = this._found;
        let filename = found.filename;
        if (platform.forceWebVersion()) {
            filename = path.join('Wheel', filename);
        }
        dispatcher.dispatch('Dialog.File.Open', filename, {lineNum: found.num + 1, ch: found.pos});
        this.onCancelEvent(event);
    }
}

exports.FindResults = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._settings = opts.settings;
        dispatcher.on('Console.FindResults.Clear', this, this.onClear);
        this.initDOM(opts.parentNode);
        opts.id && opts.id(this);
    }

    setElement(element) {
        this._element = element;
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'find-results'
            }
        );
    }

    onClear() {
        let element = this._element;
        if (element) {
            element.scrollTop = 0;
            element.innerHTML = '';
        }
    }

    addResult(findResult) {
        let filename = path.removePath(this._settings.getDocumentPath(), findResult.filename);
        this.create(
            this._element,
            {
                className: 'find-result',
                innerHTML: filename
            }
        );
        let textLength = findResult.text.length;
        findResult.found.forEach((found) => {
            found.parentNode = this._element;
            found.textLength = textLength;
            found.filename   = filename;
            new FindResult(found);
        });
        this.scrollToLast();
    }

    scrollToLast() {
        let element    = this._element;
        let childNodes = element.childNodes;
        if (!childNodes.length) {
            return;
        }
        let lineHeight  = childNodes[0].offsetHeight;
        let lineCount   = childNodes.length;
        let linesHeight = lineCount * lineHeight;
        let viewHeight  = element.offsetHeight;
        if (linesHeight > viewHeight) {
            element.scrollTop = linesHeight - viewHeight;
        }
    }
};
