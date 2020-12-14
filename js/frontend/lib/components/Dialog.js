/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher         = require('../dispatcher').dispatcher;
const ComponentContainer = require('./component/ComponentContainer').ComponentContainer;
const Checkbox           = require('./input/Checkbox').Checkbox;
const getHelpData        = require('../../ide/help/helpData').getHelpData;

exports.Dialog = class extends ComponentContainer {
    constructor(opts) {
        super(opts);
        if (opts.uiOwner) {
            opts.ui = opts.uiOwner.getUI();
        }
        this._canClose       = ('canClose' in opts) ? opts.canClose : true;
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
        this._globalEvents   = [];
    }

    initWindow(opts) {
        if (opts.showSignal) {
            dispatcher.on(opts.showSignal, this, this.onShow);
        }
        this._help   = opts.help;
        this._width  = opts.width;
        this._height = opts.height;
        this._title  = opts.title;
        let children = this.initWindowContent(opts);
        children.unshift(
            {
                id: (element) => {
                    element.addEventListener('mousedown', this.onTitleMouseDown.bind(this));
                    element.addEventListener('mouseup',   this.onTitleMouseUp.bind(this));
                },
                ref:       this.setRef('title'),
                type:      'h2',
                className: 'flt rel max-w dialog-title',
                innerHTML: this._title
            },
            opts.help ?
                {
                    id:        this.setHelpElement.bind(this),
                    className: 'abs dialog-help',
                    innerHTML: '?'
                } :
                null,
            this._canClose ?
                {
                    id:        this.setCloseElement.bind(this),
                    className: 'abs dialog-close',
                    innerHTML: '&#x2716;'
                } :
                null
        );
        this._dialogNode = this.create(
            null,
            {
                id:        this.setDialogElement.bind(this),
                className: 'dialog-background' + (opts.className ? ' ' + opts.className : ''),
                children: [
                    {
                        className: 'abs max-w dialog-center',
                        children: [
                            {
                                id:        this.setDialogContentElement.bind(this),
                                className: 'dialog-content',
                                style: {
                                    marginTop: (-this._height / 2) + 'px',
                                    width:     this._width         + 'px',
                                    height:    this._height        + 'px'
                                },
                                children: [
                                    {
                                        className: 'abs max-w max-h dialog-content-image-wrapper',
                                        children: [
                                            {
                                                type:      'img',
                                                src:       this._getImage('images/logos/wheelWindow.svg'),
                                                className: 'abs dialog-content-image'
                                            }
                                        ]
                                    }
                                ].concat(children)
                            }
                        ]
                    }
                ]
            }
        );
        return this;
    }

    initTextInputRow(opts) {
        let result = {
                className: opts.className,
                children: [
                    {
                        className: opts.labelClassName || '',
                        innerHTML: opts.label
                    },
                    this.addTextInput({
                        ref:         opts.ref,
                        tabIndex:    opts.tabIndex,
                        onKeyUp:     opts.onKeyUp ? opts.onKeyUp : () => {},
                        placeholder: opts.placeholder || '',
                        value:       opts.value       || ''
                    })
                ]
            };
        if (opts.rowRef) {
            result.ref = opts.rowRef;
        }
        return result;
    }

    initCheckboxRow(opts) {
        let result = {
                className: opts.className,
                children: [
                    {
                        className: opts.labelClassName || '',
                        innerHTML: opts.label
                    },
                    this.addCheckbox({
                        ref:      opts.ref,
                        tabIndex: opts.tabIndex
                    }),
                    opts.extra || null
                ]
            };
        if (opts.rowRef) {
            result.ref = opts.rowRef;
        }
        return result;
    }

    initCheckboxListRow(opts) {
        return {
            className: 'flt max-w checkbox-list-row',
            children: [
                this.addCheckbox({
                    ref:      opts.ref,
                    tabIndex: opts.tabIndex,
                    checked:  opts.checked
                }),
                {
                    type:     'span',
                    innerHTML: opts.title
                }
            ]
        };
    }

    initTextRow(text) {
        return {
            className: 'flt text-row',
            children: [
                {
                    type:      'span',
                    innerHTML: text
                }
            ]
        };
    }

    initButtons(buttons) {
        let children = [];
        buttons.forEach((button) => {
            if (!button) {
                return;
            }
            if (button.type) {
                children.push(button);
            } else {
                children.push(this.addButton(button));
            }
        });
        return {
            className: 'abs max-w buttons',
            children:  children
        };
    }

    setCloseElement(element) {
        element.addEventListener('click', this.onClose.bind(this));
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
        if (this._ui.getActiveUIId() === this._uiId) {
            return;
        }
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
                    console.error(error);
                    // Ignore if node is already removed...
                }
            },
            200
        );
    }

    hideForBreakpoint() {
        this._ui.popUIId();
        this._dialogElement.style.display = 'none';
    }

    showForBreakpoint() {
        this._ui.pushUIId(this._uiId);
        this._dialogElement.style.display = 'block';
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

    onClose() {
        this.hide();
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
        this.onGlobalMouseUp(event);
    }

    addDontShowAgain(tabIndex) {
        return {
            type:      'div',
            className: 'frt dont-show-again',
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
