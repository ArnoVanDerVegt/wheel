/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../lib/dom').DOMNode;
const tabIndex   = require('../tabIndex');

exports.Terminal = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._username  = '';
        this._cwd       = '';
        this._lineCount = 0;
        this
            .initDOM(opts.parentNode)
            .initUsername();
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'terminal',
                children: [
                    {
                        ref:       this.setRef('output'),
                        className: 'output'
                    },
                    {
                        className: 'input-line',
                        children: [
                            {
                                ref:       this.setRef('userInfo'),
                                className: 'user-info'
                            },
                            {
                                id:        this.setInputElement.bind(this),
                                type:      'input',
                                inputType: 'text',
                                className: 'input'
                            }
                        ]
                    }
                ]
            }
        );
        return this;
    }

    initUsername() {
        const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;
        getDataProvider().getData(
            'get',
            'ide/user-info',
            {},
            (data) => {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    return;
                }
                this._username = data.username;
                this._cwd      = data.cwd;
                this.showUser();
            }
        );
    }

    setElement(element) {
        this._element = element;
        element.addEventListener('click', this.onClickTerminal.bind(this));
    }

    setInputElement(element) {
        this._inputElement = element;
        element.addEventListener('keydown', this.onKeyDown.bind(this));
        element.addEventListener('keyup',   this.onKeyUp.bind(this));
    }

    showUser() {
        let parts = this._cwd.split('/');
        let s     = '';
        if (parts.length) {
            s += parts[parts.length - 1] + '&nbsp;';
        }
        this._refs.userInfo.innerHTML = s + this._username + '$&nbsp;';
    }

    showResult(output, className) {
        let lines = output.split('\n');
        this._lineCount += lines.length;
        lines.forEach(
            function(line) {
                this.create(
                    this._refs.output,
                    {
                        type:      'pre',
                        className: 'output-line ' + (className || ''),
                        innerHTML: line
                    }
                );
            },
            this
        );
    }

    clear() {
        this._lineCount = 0;
        let output = this._refs.output;
        while (output.childNodes.length) {
            output.removeChild(output.childNodes[0]);
        }
        return this;
    }

    focus() {
        this._inputElement.focus();
    }

    onClickTerminal() {
        this.focus();
    }

    onKeyDown(event) {
        if ((event.key === 'k') && (event.metaKey || event.ctrlKey)) {
            this.clear().focus();
        }
    }

    onKeyUp(event) {
        if (event.keyCode !== 13) {
            return;
        }
        const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;
        let value = event.target.value.trim();
        event.target.value = '';
        if (value === 'clear') {
            this.clear();
            return;
        }
        getDataProvider().getData(
            'post',
            'ide/exec',
            {
                command: value
            },
            (data) => {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    console.error(error);
                }
                if (data.success) {
                    if ('cwd' in data) {
                        this._cwd = data.cwd;
                        this.showUser();
                    }
                    if (data.output) {
                        this.showResult(data.output.trim());
                    }
                } else if (data.error) {
                    this.showResult(data.error.trim(), 'error');
                }
                this.scrollIntoView();
            }
        );
    }

    scrollIntoView() {
        let height      = this._refs.output.parentNode.offsetHeight;
        let linesHeight = this._lineCount * 20;
        if (linesHeight > height) {
            this._refs.output.parentNode.scrollTop = linesHeight - height + 20;
        }
    }
};
