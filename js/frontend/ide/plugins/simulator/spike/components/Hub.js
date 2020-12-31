/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const buttonModuleConstants = require('../../../../../../shared/vm/modules/buttonModuleConstants');
const lightModuleConstants  = require('../../../../../../shared/vm/modules/lightModuleConstants');
const DOMNode               = require('../../../../../lib/dom').DOMNode;
const Button                = require('../../../../../lib/components/input/Button').Button;
const dispatcher            = require('../../../../../lib/dispatcher').dispatcher;
const LedMatrix             = require('../io/LedMatrix').LedMatrix;
const HubStatus             = require('./HubStatus').HubStatus;

exports.Hub = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._visible = opts.visible;
        this._layer   = opts.layer;
        this._device  = opts.device;
        this._buttons = 0;
        this._light   = null;
        opts.plugin.addHub(this);
        this.initDOM(opts.parentNode);
        this._device.on('Spike.Button' + opts.layer, this, this.onButtons);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref: this.setRef('spikeHub'),
                style: {
                    display: this._visible ? 'block' : 'none'
                },
                children: [
                    {
                        type:   HubStatus,
                        device: this._device,
                        layer:  this._layer,
                        id:     this.setStatus.bind(this)
                    },
                    {
                        className: 'flt spike-hub',
                        children: [
                            {
                                className: 'spike-top flt max-w',
                                children: [
                                    this.initConnectButton()
                                ]
                            },
                            {
                                className: 'spike-middle flt max-w',
                                children: [
                                    this.initPorts(['A', 'C', 'E']),
                                    {
                                        ref:  this.setRef('ledMatrix'),
                                        type: LedMatrix
                                    },
                                    this.initPorts(['B', 'D', 'F'])
                                ]
                            },
                            {
                                className: 'spike-bottom flt max-w',
                                children: [
                                    this.initButtons()
                                ]
                            }
                        ]
                    }
                ]
            }
        );
    }

    initPorts(ports) {
        let result = {
                className: 'flt max-h ports',
                children: []
            };
        ports.forEach((port) => {
            result.children.push({
                className: 'flt port',
                innerHTML: port
            });
        });
        return result;
    }

    initConnectButton() {
        return {
            className: 'connect-button abs',
            children: [
                {
                    id:        this.setConnectButton.bind(this),
                    className: 'button'
                }
            ]
        };
    }

    initButtons() {
        return {
            className: 'flt buttons rel',
            children: [
                {
                    className: 'left-right abs',
                    children: [
                        {
                            id:        this.setLeftButton.bind(this),
                            className: 'button abs',
                            innerHTML: '&lt;'
                        },
                        {
                            id:        this.setRightButton.bind(this),
                            className: 'button right abs',
                            innerHTML: '&gt;'
                        }
                    ]
                },
                {
                    ref:       this.setRef('centerButton'),
                    className: 'center abs',
                    children: [
                        {
                            id:        this.setCenterButton.bind(this),
                            className: 'button'
                        }
                    ]
                }
            ]
        };
    }

    setStatus(status) {
        this._status = status;
    }

    setVisible(visible) {
        this._visible                     = visible;
        this._refs.spikeHub.style.display = visible ? 'block' : 'none';
    }

    setConnectButton(element) {
        this._connectElement = element;
        element.addEventListener('mousedown', this.onChangeButton.bind(this, element, 'button abs pressed', buttonModuleConstants.BUTTON_CONNECT));
        element.addEventListener('mouseup',   this.onChangeButton.bind(this, element, 'button abs',         buttonModuleConstants.BUTTON_NONE));
        element.addEventListener('mouseout',  this.onChangeButton.bind(this, element, 'button abs',         buttonModuleConstants.BUTTON_NONE));
    }

    setLeftButton(element) {
        this._leftElement = element;
        element.addEventListener('mousedown', this.onChangeButton.bind(this, element, 'button abs pressed', buttonModuleConstants.BUTTON_LEFT));
        element.addEventListener('mouseup',   this.onChangeButton.bind(this, element, 'button abs',         buttonModuleConstants.BUTTON_NONE));
        element.addEventListener('mouseout',  this.onChangeButton.bind(this, element, 'button abs',         buttonModuleConstants.BUTTON_NONE));
    }

    setCenterButton(element) {
        this._centerElement = element;
        element.addEventListener('mousedown', this.onChangeButton.bind(this, element, 'button abs pressed', buttonModuleConstants.BUTTON_CENTER));
        element.addEventListener('mouseup',   this.onChangeButton.bind(this, element, 'button abs',         buttonModuleConstants.BUTTON_NONE));
        element.addEventListener('mouseout',  this.onChangeButton.bind(this, element, 'button abs',         buttonModuleConstants.BUTTON_NONE));
    }

    setRightButton(element) {
        this._rightElement = element;
        element.addEventListener('mousedown', this.onChangeButton.bind(this, element, 'button right abs pressed', buttonModuleConstants.BUTTON_RIGHT));
        element.addEventListener('mouseup',   this.onChangeButton.bind(this, element, 'button right abs',         buttonModuleConstants.BUTTON_NONE));
        element.addEventListener('mouseout',  this.onChangeButton.bind(this, element, 'button right abs',         buttonModuleConstants.BUTTON_NONE));
    }

    getButtons() {
        return this._buttons;
    }

    getLight() {
        if (!this._light) {
            let refs = this._refs;
            this._light = {
                setColor(color) {
                    let className = null;
                    switch (color) {
                        case lightModuleConstants.LIGHT_SPIKE_PINK:   className = 'pink';   break;
                        case lightModuleConstants.LIGHT_SPIKE_VIOLET: className = 'violet'; break;
                        case lightModuleConstants.LIGHT_SPIKE_BLUE:   className = 'blue';   break;
                        case lightModuleConstants.LIGHT_SPIKE_AZURE:  className = 'azure';  break;
                        case lightModuleConstants.LIGHT_SPIKE_CYAN:   className = 'cyan';   break;
                        case lightModuleConstants.LIGHT_SPIKE_GREEN:  className = 'green';  break;
                        case lightModuleConstants.LIGHT_SPIKE_YELLOW: className = 'yellow'; break;
                        case lightModuleConstants.LIGHT_SPIKE_ORANGE: className = 'orange'; break;
                        case lightModuleConstants.LIGHT_SPIKE_RED:    className = 'red';    break;
                        case lightModuleConstants.LIGHT_SPIKE_WHITE:  className = '';       break;
                    }
                    if (className !== null) {
                        refs.centerButton.className = 'center ' + className + ' abs';
                    }
                },
                off() {
                    refs.centerButton.className = 'center abs';
                }
            };
        }
        return this._light;
    }

    matrixClear(led) {
        this._refs.ledMatrix.clear();
    }

    matrixSetLed(led) {
        this._refs.ledMatrix.setLed(led.x, led.y, led.brightness);
    }

    matrixSetText(led) {
        this._refs.ledMatrix.setText(led.text);
    }

    onChangeButton(element, className, value) {
        element.className = className;
        this._buttons     = value;
    }

    onButtons(buttons) {
        this._buttons = buttons;
        switch (buttons) {
            case buttonModuleConstants.BUTTON_CONNECT:
                this._connectElement.className   = 'button abs pressed';
                break;
            case buttonModuleConstants.BUTTON_LEFT:
                this._leftElement.className   = 'button abs pressed';
                break;
            case buttonModuleConstants.BUTTON_CENTER:
                this._centerElement.className = 'button abs pressed';
                break;
            case buttonModuleConstants.BUTTON_RIGHT:
                this._rightElement.className  = 'button right abs pressed';
                break;
            default:
                this._connectElement.className = 'button abs';
                this._leftElement.className    = 'button abs';
                this._centerElement.className  = 'button abs';
                this._rightElement.className   = 'button right abs';
                break;
        }
    }
};
