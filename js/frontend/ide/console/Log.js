/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const tokenUtils = require('../../compiler/tokenizer/tokenUtils');
const dispatcher = require('../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../lib/dom').DOMNode;
const path       = require('../../lib/path');

class LogMessage extends DOMNode {
    constructor(opts) {
        super(opts);
        this._open            = false;
        this._className       = opts.className;
        this._log             = opts.log;
        this._lineInfo        = opts.lineInfo;
        this._parentMessageId = opts.parentMessageId;
        this._messageId       = opts.messageId;
        this._message         = opts.message;
        this._type            = opts.type;
        this._className       = opts.className || '';
        this._count           = 1;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this.getClassName(),
                innerHTML: this._message,
                style: {
                    display: this._parentMessageId ? 'none' : 'block'
                },
                children: [
                    {
                        ref:  this.setRef('count'),
                        type: 'span'
                    }
                ]
            }
        );
    }

    getParentMessageId() {
        return this._parentMessageId;
    }

    getMessage() {
        return this._message;
    }

    getMessageId() {
        return this._messageId;
    }

    getType() {
        return this._type;
    }

    getClassName() {
        return this._className +
            (this._messageId ? ' ' + (this._open ? 'open' : 'closed') : '') +
            (this._lineInfo  ? ' with-info' : '');
    }

    setElement(element) {
        this._element = element;
        if (this._lineInfo) {
            element.addEventListener('click', this.onClickLineInfo.bind(this));
        }
        if (this._messageId) {
            element.addEventListener('click', this.onClickParentMessage.bind(this));
        }
    }

    setVisible(visible) {
        this._element.style.display = visible ? 'block' : 'none';
    }

    addCount() {
        this._count++;
        let count = this._refs.count;
        count.className = 'count';
        count.innerHTML = this._count;
    }

    onClickLineInfo() {
        let lineInfo = this._lineInfo;
        dispatcher.dispatch('Dialog.File.Open', lineInfo.filename, lineInfo);
    }

    onClickParentMessage() {
        this._open = !this._open;
        let open      = this._open;
        let messageId = this._messageId;
        let messages  = this._log.getMessages();
        this._element.className = this.getClassName();
        messages.forEach((message) => {
            if (message.getParentMessageId() === messageId) {
                message.setVisible(open);
            }
        });
    }
}

let messageId = 1;

exports.getMessageId = function() {
    return messageId++;
};

exports.Log = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._settings     = opts.settings;
        this._lastMessage  = null;
        this._messages     = [];
        this._preProcessor = null;
        dispatcher
            .on('Console.Clear',        this, this.onClear)
            .on('Console.Log',          this, this.onLog)
            .on('Console.Error',        this, this.onError)
            .on('Console.PreProcessor', this, this.onPreProcessor);
        this.initDOM(opts.parentNode);
        opts.id && opts.id(this);
    }

    getMessages() {
        return this._messages;
    }

    setElement(element) {
        this._element = element;
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'console-lines'
            }
        );
    }

    onClear() {
        let element = this._element;
        if (element) {
            element.scrollTop = 0;
            element.innerHTML = '';
        }
        this._lastMessage     = null;
        this._messages.length = 0;
    }

    onLog(opts) {
        let element = this._element;
        if (!element) {
            return;
        }
        if (this._lastMessage && (this._lastMessage.getMessage() === opts.message) && (this._lastMessage.getType() === opts.type)) {
            this._lastMessage.addCount();
        } else {
            let maxMessageCount = this._settings.getConsoleMessageCount();
            while (element.childNodes.length && (element.childNodes.length > maxMessageCount)) {
                element.removeChild(element.childNodes[0]);
            }
            this._lastMessage = new LogMessage({
                parentNode:      element,
                log:             this,
                message:         opts.message,
                messageId:       opts.messageId,
                parentMessageId: opts.parentMessageId,
                lineInfo:        opts.lineInfo,
                type:            opts.type,
                className:       'console-line type-' + (opts.type || '').toLowerCase()
            });
            this._messages.push(this._lastMessage);
        }
        this.scrollToLast();
    }

    onError(opts) {
        let error = opts;
        if (error.token) {
            let token       = error.token;
            let sortedFiles = this._preProcessor.getSortedFiles();
            let filename    = token.filename || sortedFiles[token.fileIndex].filename;
            let line        = tokenUtils.getLineFromToken(token, opts.tokens);
            let text        = '<i class="error">' + line.left + '<b>' + line.lexeme + '</b>' + line.right + '<i>';
            let pathAndFilename = path.getPathAndFilename(filename);
            this.onLog({
                message:  pathAndFilename.filename + '(line:' + token.lineNum + ',' + line.left.length + ') ' + text,
                lineInfo: {filename: filename, lineNum: token.lineNum, ch: line.left.length}
            });
        }
        this.onLog({
            message:   (error.type || 'Error') + ': <b>' + error.message + '</b>',
            className: 'error'
        });
    }

    onPreProcessor(preProcessor) {
        this._preProcessor = preProcessor;
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
