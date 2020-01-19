/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../../lib/dispatcher').dispatcher;
const DOMNode             = require('../../../../lib/dom').DOMNode;
const Button              = require('../../../../lib/components/Button').Button;
const Component           = require('../../../../lib/components/Component').Component;
const SimulatorPlugin     = require('../SimulatorPlugin').SimulatorPlugin;
const getImage            = require('../../../data/images').getImage;

const PSP_BUTTON_CIRCLE   =  0;
const PSP_BUTTON_CROSS    =  1;
const PSP_BUTTON_TRIANGLE =  2;
const PSP_BUTTON_SQUARE   =  3;
const PSP_BUTTON_R1       =  4;
const PSP_BUTTON_R2       =  5;
const PSP_BUTTON_L1       =  6;
const PSP_BUTTON_L2       =  7;
const PSP_BUTTON_LEFT     =  8;
const PSP_BUTTON_RIGHT    =  9;
const PSP_BUTTON_UP       = 10;
const PSP_BUTTON_DOWN     = 11;
const PSP_BUTTON_START    = 12;
const PSP_BUTTON_SELECT   = 13;
const PSP_STICK_LEFT_X    = 14;
const PSP_STICK_LEFT_Y    = 15;
const PSP_STICK_RIGHT_X   = 16;
const PSP_STICK_RIGHT_Y   = 17;

const Joystick = class extends Component {
        constructor(opts) {
            super(opts);
            this.initDOM(opts.parentNode);
            this._down      = false;
            this._upTimeout = null;
            this._offsetX   = opts.offsetX;
            this._offsetY   = opts.offsetY;
        }

        initDOM(parentNode) {
            this.create(
                parentNode,
                {
                    className: 'joystick',
                    children: [
                        {
                            className: 'joystick-circle',
                            ref:       this.setRef('circle'),
                            children: [
                                {
                                    id:        this.setStickElement.bind(this),
                                    className: 'stick'
                                }
                            ]
                        }
                    ]
                }
            );
        }

        setStickElement(element) {
            this._stickElement = element;
            let circle = this._refs.circle;
            circle.addEventListener('mousedown', this.onMouseDown.bind(this));
            circle.addEventListener('mousemove', this.onMouseMove.bind(this));
            circle.addEventListener('mouseup',   this.onMouseUp.bind(this));
            circle.addEventListener('mouseout',  this.onMouseUp.bind(this));
        }

        setPosition(x, y) {
            let stick = this._stickElement;
            dispatcher.dispatch('Sensor.PSP.Changed', this._offsetX, Math.round(x / 48 * 100));
            dispatcher.dispatch('Sensor.PSP.Changed', this._offsetY, Math.round(y / 48 * 100));
            stick.style.margin = (y - 16) + 'px 0 0 ' + (x - 16) + 'px';
        }

        onMouseDown(event) {
            if (this._upTimeout) {
                clearTimeout(this._upTimeout);
                this._upTimeout = null;
            }
            this._down = true;
            this.setPosition(event.offsetX - 48, event.offsetY - 48);
            event.preventDefault();
        }

        onMouseMove(event) {
            if (!this._down) {
                return;
            }
            this.setPosition(event.offsetX - 48, event.offsetY - 48);
            event.preventDefault();
        }

        onMouseUp(event) {
            this._down = false;
            if (this._upTimeout) {
                clearTimeout(this._upTimeout);
            }
            this._upTimeout = setTimeout(this.setPosition.bind(this, 0, 0), 1000);
        }
    };

exports.Plugin = class extends SimulatorPlugin {
    constructor(opts) {
        super(opts);
        this._baseClassName       = 'psp';
        this._disconnectedTimeout = null;
        this.initDOM(opts.parentNode);
        this._brick
            .addEventListener('Brick.Connected',    this, this.onBrickConnected)
            .addEventListener('Brick.Disconnected', this, this.onBrickDisconnected);
        opts.settings.on('Settings.Plugin', this, this.onPluginSettings);
    }

    initButton(className, opts) {
        return {
            className: className,
            children: [
                (opts === null) ?
                    null :
                    {
                        type:      Button,
                        ui:        this._ui,
                        color:     'gray',
                        value:     opts.title,
                        onMouseDown: function() {
                            dispatcher.dispatch('Sensor.PSP.Changed', opts.input, 1);
                        },
                        onMouseUp: function() {
                            dispatcher.dispatch('Sensor.PSP.Changed', opts.input, 0);
                        }
                        // 1 event:     'Button.Console.Change',
                        // 2 tabIndex:  tabIndex.CONSOLE_CLEAR_BUTTON,
                        // 3 onClick:   this.onClickClear.bind(this),
                    }
            ]
        };
    }

    initButtonRow(opts1, opts2, opts3, opts4) {
        return [
            this.initButton('quarter', opts1),
            this.initButton('quarter', opts2),
            this.initButton('quarter', opts3),
            this.initButton('quarter', opts4)
        ];
    }

    initJoystickRow() {
        return [
            {
                type:    Joystick,
                ui:      this._ui,
                offsetX: PSP_STICK_LEFT_X,
                offsetY: PSP_STICK_LEFT_Y
            },
            {
                type:    Joystick,
                ui:      this._ui,
                offsetX: PSP_STICK_RIGHT_X,
                offsetY: PSP_STICK_RIGHT_Y
            }
        ];
    }

    initFourButtonsRow(leftOpts, centerOpts, rightOpts) {
        return [
            this.initButton('left',   leftOpts),
            this.initButton('center', centerOpts),
            this.initButton('right',  rightOpts)
        ];
    }

    initFourButtons(className, opts1, opts2, opts3, opts4) {
        return {
            className: 'four-buttons',
            children: [
                {
                    className: 'four-buttons-row ' + className,
                    children:  this.initFourButtonsRow(null, opts1, null)
                },
                {
                    className: 'four-buttons-row ' + className,
                    children:  this.initFourButtonsRow(opts2, null, opts3)
                },
                {
                    className: 'four-buttons-row ' + className,
                    children:  this.initFourButtonsRow(null, opts4, null)
                }
            ]
        };
    }

    initFourButtonsRows() {
        return [
            this.initFourButtons(
                'left',
                {title: '▲', input: PSP_BUTTON_UP},
                {title: '◄', input: PSP_BUTTON_LEFT},
                {title: '►', input: PSP_BUTTON_RIGHT},
                {title: '▼', input: PSP_BUTTON_DOWN}
            ),
            this.initFourButtons(
                '',
                {title: '△', input: PSP_BUTTON_TRIANGLE},
                {title: '▢', input: PSP_BUTTON_SQUARE},
                {title: '○', input: PSP_BUTTON_CIRCLE},
                {title: '✕', input: PSP_BUTTON_CROSS}
            )
        ];
    }

    initTitle() {
        return [
            {
                className: 'title',
                children: [
                    {
                        type:      'span',
                        innerHTML: 'PSP'
                    },
                    {
                        type: 'img',
                        src:  getImage('images/ev3/psp.png')
                    }
                ]
            }
        ];
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('psp'),
                className: this.getClassName(),
                children: [
                    {
                        className: 'device',
                        children: this.initButtonRow(
                            {title: 'L1', input: PSP_BUTTON_L1},
                            {title: 'L2', input: PSP_BUTTON_L2},
                            {title: 'R1', input: PSP_BUTTON_R1},
                            {title: 'R2', input: PSP_BUTTON_R2}
                        ).concat(
                            this.initButtonRow(
                                null,
                                {title: 'Sel',  input: PSP_BUTTON_SELECT},
                                {title: 'Strt', input: PSP_BUTTON_START},
                                null
                            ).concat(
                                this.initFourButtonsRows().concat(
                                    this.initJoystickRow().concat(
                                        this.initTitle()
                                    )
                                )
                            )
                        )
                    }
                ]
            }
        );
    }

    onBrickConnected() {
        if (this._disconnectedTimeout) {
            clearTimeout(this._disconnectedTimeout);
            this._disconnectedTimeout = null;
        }
    }

    onBrickDisconnected() {
    }

    onPluginSettings() {
        this._refs.psp.className = this.getClassName();
    }

    reset() {
    }
};
