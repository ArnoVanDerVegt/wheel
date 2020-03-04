/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher         = require('../dispatcher').dispatcher;
const ComponentContainer = require('./ComponentContainer').ComponentContainer;
const Checkbox           = require('./Checkbox').Checkbox;
const getHelpData        = require('../../ide/help/helpData').getHelpData;

exports.Dialog = class extends ComponentContainer {
    constructor(opts) {
        super(opts);
        if (opts.uiOwner) {
            opts.ui = opts.uiOwner.getUI();
        }
        this._hideTimeout = null;
        this._settings    = opts.settings;
        this._ui          = opts.ui;
        this._uiId        = opts.ui.getNextUIId();
        this._getImage    = opts.getImage;
        this._help        = opts.help;
        this._ui.addEventListener('Global.Key.Up', this, this.onGlobalKeyUp);
    }

    setCloseElement(element) {
        element.addEventListener('click', this.hide.bind(this));
    }

    setHelpElement(element) {
        element.addEventListener('click', this.help.bind(this));
    }

    setDialogElement(element) {
        this._dialogElement = element;
    }

    show() {
        this._ui.pushUIId(this._uiId);
        let dialogNode = this._dialogNode;
        if (dialogNode.parentNode !== null) {
            return;
        }
        document.body.appendChild(dialogNode);
        setTimeout(
            (function() {
                dialogNode.className = this.addClassName(dialogNode.className, 'show');
            }).bind(this),
            5
        );
    }

    hide() {
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
            this._hideTimeout = null;
        }
        let dialogNode = this._dialogNode;
        dialogNode.className = this.removeClassName(dialogNode.className, 'show');
        this._hideTimeout = setTimeout(
            (function() {
                this._hideTimeout = null;
                try {
                    document.body.removeChild(dialogNode);
                    this._ui.popUIId();
                } catch (error) {
                    // Ignore if node is already removed...
                }
            }).bind(this),
            200
        );
    }

    /**
     * Todo: Move this help code out of this class...
    **/
    help() {
        let helpData = getHelpData();
        let keywords = Object.keys(helpData.keywords);
        let ids      = null;
        this._help = this._help.toUpperCase();
        for (let i = 0; i < keywords.length; i++) {
            if (keywords[i].toUpperCase().indexOf(this._help) !== -1) {
                ids = helpData.keywords[keywords[i]];
            }
        }
        if (!ids) {
            return;
        }
        let id   = ids[0];
        let item = null;
        if (id in helpData.subjectById) {
            item = helpData.subjectById[id];
        } else if (id in helpData.sectionById) {
            item = helpData.sectionById[id];
        }
        if (!item) {
            return;
        }
        dispatcher.dispatch(
            'Dialog.Help.Show',
            {
                keyword:   this._help,
                fileIndex: item.fileIndex
            }
        );
    }

    onGlobalKeyUp(event) {
        if (this._uiId !== this._ui.getActiveUIId()) {
            return;
        }
        if (event.keyCode === 27) { // Escape...
            this.hide();
        }
    }

    onApply() {
    }

    onDontShowAgain(dontShowAgain) {
    }

    createWindow(className, title, children) {
        children.unshift(
            {
                ref:       this.setRef('title'),
                type:      'h2',
                className: 'dialog-title',
                innerHTML: title
            },
            this._help ?
                {
                    id:        this.setHelpElement.bind(this),
                    className: 'dialog-help',
                    innerHTML: '?'
                } :
                null,
            {
                id:        this.setCloseElement.bind(this),
                className: 'dialog-close',
                innerHTML: '&#x2716;'
            }
        );
        this._dialogNode = this.create(
            null,
            {
                id:        this.setDialogElement.bind(this),
                className: 'dialog-background' + (className ? ' ' + className : ''),
                children: [
                    {
                        className: 'dialog-center',
                        children: [
                            {
                                className: 'dialog-content',
                                children: [
                                    {
                                        type:      'img',
                                        src:       this._getImage('images/logos/wheelWindow.svg'),
                                        className: 'dialog-content-image'
                                    }
                                ].concat(children)
                            }
                        ]
                    }
                ]
            }
        );
    }

    addDontShowAgain(tabIndex) {
        return {
            className: 'dont-show-again',
            children: [
                {
                    type:     Checkbox,
                    tabIndex: tabIndex,
                    ui:       this._ui,
                    uiId:     this._uiId,
                    onChange: this.onDontShowAgain.bind(this)
                },
                {
                    type:      'span',
                    className: 'dont-show-label',
                    innerHTML: 'Don\'t show this dialog again.'
                }
            ]
        };
    }
};
