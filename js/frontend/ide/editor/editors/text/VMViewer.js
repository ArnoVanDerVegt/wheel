/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../../lib/dispatcher').dispatcher;
const Editor              = require('../Editor').Editor;
const ToolbarBottomViewer = require('./toolbar/ToolbarBottomViewer').ToolbarBottomViewer;

exports.VMViewer = class extends Editor {
    constructor(opts) {
        super(opts);
        this._textElement  = null;
        this._rtfElement   = null;
        this._codeMirror   = null;
        this._onGlobalUIId = this._ui.on('Global.UIId', this, this.onGlobalUIId);
        this.initDOM(opts.parentNode);
    }

    initCodeMirror() {
        let codeMirror = CodeMirror.fromTextArea(
                this._textElement,
                {
                    lineNumbers: true,
                    gutters:     ['CodeMirror-linenumbers'],
                    readOnly:    true,
                    mode:        'text/x-vm'
                }
            );
        this._codeMirror = codeMirror;
        this.setTextValue(this._value.text);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setRef('wrapper'),
                className: 'code-mirror-wrapper',
                children: [
                    {
                        id:        this.setTextElement.bind(this),
                        className: 'text',
                        type:      'textarea',
                        value:     this._value.text
                    },
                    {
                        id:        this.setRtfElement.bind(this),
                        className: 'rtf',
                        type:      'textarea',
                        value:     this._value.rtf,
                        style: {
                            display: 'none'
                        }
                    },
                    {
                        type:        ToolbarBottomViewer,
                        ui:          this._ui,
                        settings:    this._settings,
                        wheelEditor: this
                    }
                ]
            }
        );
        this.initCodeMirror();
    }

    remove() {
        super.remove();
        this._onGlobalUIId();
    }

    show() {
        super.show();
        dispatcher.dispatch('Screen.Ready');
    }

    onSelectText() {
        let refs    = this._refs;
        let wrapper = refs.wrapper;
        wrapper.querySelector('textarea.rtf').style.display             = 'none';
        wrapper.querySelector('.CodeMirror.cm-s-default').style.display = 'block';
        refs.selectAndCopy.setDisabled(true);
    }

    onSelectRtf() {
        let refs    = this._refs;
        let wrapper = refs.wrapper;
        wrapper.querySelector('.CodeMirror.cm-s-default').style.display = 'none';
        wrapper.querySelector('textarea.rtf').style.display             = 'block';
        refs.selectAndCopy.setDisabled(false);
    }

    onSelectAndCopy() {
        this._refs.wrapper.querySelector('textarea.rtf').select();
        document.execCommand('copy');
    }

    onGlobalUIId() {
        let disabled = (this._ui.getActiveUIId() !== 1);
        ['.CodeMirror textarea.text', '.CodeMirror textarea.rtf'].forEach(
            function(path) {
                let textarea = this._refs.wrapper.querySelector(path);
                if (textarea) {
                    textarea.disabled = disabled ? 'disabled' : '';
                }
            },
            this
        );
        this._codeMirror.readOnly = disabled;
    }

    getValue() {
        return this._codeMirror.getValue();
    }

    setValue(value, reset) {
        this.setTextValue(value.text);
        this.setRtfValue(value.rtf);
    }

    setTextValue(value) {
        let codeMirror      = this._codeMirror;
        let lines           = value.split('\n');
        let lastBlockId     = '';
        let backgroundClass = 'even';
        let lineClasses     = {};
        lines.forEach((line, index) => {
            let i = line.indexOf('|');
            if (i !== -1) {
                let blockId = line.substr(5, 4);
                if (blockId !== lastBlockId) {
                    lastBlockId     = blockId;
                    backgroundClass = (backgroundClass === 'odd') ? 'even' : 'odd';
                }
                line         = '    ' + line.substr(0, i) + line.substr(i + 5, line.length - i - 5);
                lines[index] = line;
                lineClasses[index] = backgroundClass;
            }
        });
        codeMirror.setValue(lines.join('\n'));
        for (let i in lineClasses) {
            codeMirror.addLineClass(parseInt(i, 10), 'background', lineClasses[i]);
        }
    }

    setRtfValue(value) {
        this._refs.wrapper.querySelector('textarea.rtf').value = value;
    }

    setTextElement(element) {
        this._textElement = element;
    }

    setRtfElement(element) {
        this._rftElement = element;
    }
};
