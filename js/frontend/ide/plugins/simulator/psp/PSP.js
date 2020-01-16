/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../../lib/dispatcher').dispatcher;
const DOMNode         = require('../../../../lib/dom').DOMNode;
const Button          = require('../../../../lib/components/Button').Button;
const Component       = require('../../../../lib/components/Component').Component;
const SimulatorPlugin = require('../SimulatorPlugin').SimulatorPlugin;
const getImage        = require('../../../data/images').getImage;

const Joystick = class extends Component {
        constructor(opts) {
            super(opts);
            this.initDOM(opts.parentNode);
        }

        initDOM(parentNode) {
            this.create(
                parentNode,
                {
                    className: 'joystick',
                    children: [
                        {
                            className: 'joystick-circle',
                            children: [
                                {
                                    className: 'stick'
                                }
                            ]
                        }
                    ]
                }
            );
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
        this._simulator.registerPlugin('motors', this);
        opts.settings.on('Settings.Plugin', this, this.onPluginSettings);
    }

    initButton(className, title) {
        return {
            className: className,
            children: [
                (title === null) ? null :
                {
                    type:      Button,
                    ui:        this._ui,
                    color:     'gray',
                    value:     title
                    // 1 event:     'Button.Console.Change',
                    // 2 tabIndex:  tabIndex.CONSOLE_CLEAR_BUTTON,
                    // 3 onClick:   this.onClickClear.bind(this),
                }
            ]
        };
    }

    initButtonRow(title1, title2, title3, title4) {
        return [
            this.initButton('quarter', title1),
            this.initButton('quarter', title2),
            this.initButton('quarter', title3),
            this.initButton('quarter', title4)
        ];
    }

    initJoystickRow() {
        return [
            {
                type: Joystick,
                ui:   this._ui
            },
            {
                type: Joystick,
                ui:   this._ui
            }
        ];
    }

    initFourButtonsRow(leftTitle, centerTitle, rightTitle) {
        return [
            this.initButton('left',   leftTitle),
            this.initButton('center', centerTitle),
            this.initButton('right',  rightTitle)
        ];
    }

    initFourButtons(className, title1, title2, title3, title4) {
        return {
            className: 'four-buttons',
            children: [
                {
                    className: 'four-buttons-row ' + className,
                    children:  this.initFourButtonsRow(null, title1, null)
                },
                {
                    className: 'four-buttons-row ' + className,
                    children:  this.initFourButtonsRow(title2, null, title3)
                },
                {
                    className: 'four-buttons-row ' + className,
                    children:  this.initFourButtonsRow(null, title4, null)
                }
            ]
        };
    }

    initFourButtonsRows() {
        return [
            this.initFourButtons('left', '▲', '◄', '►', '▼'),
            this.initFourButtons('',     '△', '▢', '○', '✕')
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
                        children: this.initButtonRow('L1', 'L2', 'R1', 'R2').concat(
                            this.initButtonRow(null, 'Sel', 'Strt', null).concat(
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
