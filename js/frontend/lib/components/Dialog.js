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
        this._titleMove      = false;
        this._documentMouseX = null;
        this._documentMouseY = null;
        this._documentDeltaX = 0;
        this._documentDeltaY = 0;
        this._hideTimeout    = null;
        this._settings       = opts.settings;
        this._ui             = opts.ui;
        this._uiId           = opts.ui.getNextUIId();
        this._getImage       = opts.getImage;
        this._help           = opts.help;
        this._globalEvents   = [];
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

    setDialogContentElement(element) {
        this._dialogContentElement = element;
    }

    show() {
        let ui = this._ui;
        this._globalEvents.push(
            ui.addEventListener('Global.Mouse.Up',   this, this.onGlobalMouseUp),
            ui.addEventListener('Global.Mouse.Move', this, this.onGlobalMouseMove),
            ui.addEventListener('Global.Key.Up',     this, this.onGlobalKeyUp)
        );
        ui.pushUIId(this._uiId);
        let dialogNode = this._dialogNode;
        if (dialogNode.parentNode !== null) {
            return;
        }
        document.body.appendChild(dialogNode);
        setTimeout(
            () => {
                dialogNode.className = this.addClassName(dialogNode.className, 'show');
            },
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
            () => {
                this._hideTimeout = null;
                try {
                    let globalEvents = this._globalEvents;
                    while (globalEvents.length) {
                        globalEvents.pop()();
                    }
                    document.body.removeChild(dialogNode);
                    this._ui.popUIId();
                    this.onHide();
                } catch (error) {
                    // Ignore if node is already removed...
                }
            },
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

    onGlobalMouseUp(event) {
        let style = this._dialogContentElement.style;
        style.pointerEvents  = 'auto';
        style.transition     = 'transform 0.2s, opacity 0.2s';
        this._titleMove      = false;
        this._documentMouseX = null;
    }

    onGlobalMouseMove(event) {
        if (this._documentMouseX === null) {
            this._documentMouseX = event.x;
            this._documentMouseY = event.y;
            return;
        }
        if (this._titleMove) {
            this._documentDeltaX += event.x - this._documentMouseX;
            this._documentDeltaY += event.y - this._documentMouseY;
            event.stopPropagation();
            event.preventDefault();
            let style = this._dialogContentElement.style;
            style.transition = '';
            style.transform  = 'translate(' + this._documentDeltaX + 'px,' + this._documentDeltaY + 'px)';
        }
        this._documentMouseX = event.x;
        this._documentMouseY = event.y;
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

    onHide() {
    }

    onDontShowAgain(dontShowAgain) {
    }

    onTitleMouseDown(event) {
        let style = this._dialogContentElement.style;
        style.transition    = '';
        style.pointerEvents = 'none';
        this._titleMove     = true;
    }

    onTitleMouseUp(event) {
        onGlobalMouseUp(event);
    }

    createWindow(className, title, children) {
        children.unshift(
            {
                id: (element) => {
                    element.addEventListener('mousedown', this.onTitleMouseDown.bind(this));
                    element.addEventListener('mouseup',   this.onTitleMouseUp.bind(this));
                },
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
                                id:        this.setDialogContentElement.bind(this),
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
