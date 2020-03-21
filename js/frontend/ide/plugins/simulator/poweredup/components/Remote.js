/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode  = require('../../../../../lib/dom').DOMNode;
const BasicHub = require('./BasicHub').BasicHub;

const RemoteButtons = class extends DOMNode {
        constructor(opts) {
            super(opts);
            this._remote    = opts.remote;
            this._className = opts.className;
            this._prefix    = opts.prefix;
            this.initDOM(opts.parentNode);
        }

        initDOM(parentNode) {
            this.create(
                parentNode,
                {
                    className: 'control-circle ' + this._className,
                    children: [
                        {
                            className: 'buttons',
                            children: [
                                {
                                    className: 'buttons',
                                    children: [
                                        {
                                            ref:       this._remote.setRef(this._prefix + 'Min'),
                                            className: 'button-left',
                                            innerHTML: '-'
                                        },
                                        {
                                            ref:       this._remote.setRef(this._prefix + 'Center'),
                                            className: 'button-center'
                                        },
                                        {
                                            ref:       this._remote.setRef(this._prefix + 'Plus'),
                                            className: 'button-right',
                                            innerHTML: '+'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            );
        }
    };

exports.Remote = class extends BasicHub {
    constructor(opts) {
        super(opts);
        this._buttons = 0;
        opts.plugin.setRemote(this);
        this
            .initDOM(opts.parentNode)
            .initButtons();
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('remote'),
                className: 'hub-remote',
                children: [
                    {
                        type:      RemoteButtons,
                        remote:    this,
                        prefix:    'buttonLeft',
                        className: 'left'
                    },
                    {
                        className: 'remote-button'
                    },
                    {
                        className: 'hub-light',
                        ref:       this.setRef('hubLight')
                    },
                    {
                        type:      RemoteButtons,
                        remote:    this,
                        prefix:    'buttonRight',
                        className: 'right'
                    }
                ]
            }
        );
        return this;
    }

    initButton(element, className, buttons) {
        let onMouseDown = (function(event) {
                this._buttons    = buttons;
                element.className = className + ' pressed';
                event.stopPropagation();
                event.preventDefault();
            }).bind(this);
        let onMouseUp   = (function(event) {
                this._buttons     = 0;
                element.className = className;
                event.stopPropagation();
                event.preventDefault();
            }).bind(this);
        element.addEventListener('mousedown', onMouseDown);
        element.addEventListener('mouseout',  onMouseUp);
        element.addEventListener('mouseup',   onMouseUp);
    }

    initButtons() {
        let refs = this._refs;
        this.initButton(refs.buttonRightMin,    'button-left',    8);
        this.initButton(refs.buttonRightCenter, 'button-center', 16);
        this.initButton(refs.buttonRightPlus,   'button-right',  32);
        this.initButton(refs.buttonLeftMin,     'button-left',    1);
        this.initButton(refs.buttonLeftCenter,  'button-center',  2);
        this.initButton(refs.buttonLeftPlus,    'button-right',   4);
    }

    getButtons() {
        return this._buttons;
    }

    setButton(buttons) {
        this._buttons = buttons;
        let refs = this._refs;
        refs.buttonRightMin.className    = 'button-left'   + (((buttons &  8) ===  8) ? ' pressed' : '');
        refs.buttonRightCenter.className = 'button-center' + (((buttons & 16) === 16) ? ' pressed' : '');
        refs.buttonRightPlus.className   = 'button-right'  + (((buttons & 32) === 32) ? ' pressed' : '');
        refs.buttonLeftMin.className     = 'button-left'   + (((buttons &  1) ===  1) ? ' pressed' : '');
        refs.buttonLeftCenter.className  = 'button-center' + (((buttons &  2) ===  2) ? ' pressed' : '');
        refs.buttonLeftPlus.className    = 'button-right'  + (((buttons &  4) ===  4) ? ' pressed' : '');
    }

    hide() {
        this._refs.remote.className = 'hub-remote';
    }

    show() {
        this._refs.remote.className = 'hub-remote visible';
    }
};
