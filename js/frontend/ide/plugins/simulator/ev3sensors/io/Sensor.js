/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../../../../lib/dispatcher').dispatcher;
const DOMNode               = require('../../../../../lib/dom').DOMNode;
const getImage              = require('../../../../data/images').getImage;

exports.Sensor = class extends DOMNode {
    constructor(opts) {
        super(opts);
        let brick = opts.brick;
        this._sensorContainer    = opts.sensorContainer;
        this._parentNode         = opts.parentNode;
        this._simulator          = opts.simulator;
        this._layer              = opts.layer;
        this._id                 = opts.id;
        this._ui                 = opts.ui;
        this._sensors            = opts.sensors;
        this._title              = opts.title;
        this._tabIndex           = opts.tabIndex;
        this._image              = opts.image;
        this._numberInputElement = null;
        this._mode               = null;
        this._value              = 0;
        this._timeoutReset       = null;
        this._timeoutType        = null;
        this._events             = [
            brick.addEventListener('Brick.Connecting',   this, this.onConnecting),
            brick.addEventListener('Brick.Connected',    this, this.onConnected),
            brick.addEventListener('Brick.Disconnected', this, this.onDisconnected)
        ];
        this.initDOM(opts.parentNode);
        opts.sensorContainer.setCurrentSensor(this);
    }

    initMainDom(parentNode, image, withMode, inputs) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('sensor'),
                className: 'sensor' + (this._hidden ? ' hidden' : ''),
                children: [
                    {
                        className: 'title' + (withMode ? ' with-mode' : ''),
                        id:        this.setTitleElement.bind(this),
                        children: [
                            {
                                type: 'img',
                                src:  getImage(image)
                            },
                            {
                                type:      'span',
                                innerHTML: this._title
                            }
                        ]
                    }
                ].concat(inputs)
            }
        );
    }
    remove() {
        while (this._events.length) {
            this._events.pop()();
        }
        let parentNode = this._parentNode;
        while (parentNode.childNodes.length) {
            parentNode.removeChild(parentNode.childNodes[0]);
        }
    }

    onConnecting() {
        this.setType(-1);
    }

    onConnected() {
    }

    onDisconnected() {
    }

    onChangeValue(value) {
        this._value = value;
        this.setTimeoutReset();
    }

    onChangeNumberValue(event) {
        let value = parseInt(event.target.value, 10);
        if (isNaN(value)) {
            return;
        }
        this._value = value;
        this.setTimeoutReset();
    }

    onResetTimeout() {
        this._timeoutReset = null;
        this._value        = 0;
    }

    setTitleElement(element) {
        this._titleElement = element;
        element.addEventListener(
            'click',
            (function(event) {
                let offsetX = element.offsetLeft;
                let offsetY = element.offsetTop;
                let parent  = element.offsetParent;
                while (parent) {
                    offsetX += parent.offsetLeft;
                    offsetY += parent.offsetTop;
                    parent = parent.offsetParent;
                }
                parent = element.offsetParent.offsetParent;
                this._sensors.showContextMenu(
                    this,
                    {x: offsetX + parent.scrollLeft, y: offsetY + parent.scrollTop},
                    event
                );
            }).bind(this)
        );
    }

    getNumberValueInput() {
        return {
            className: 'value hidden',
            ref:       this.setRef('numberValue'),
            children: [
                {
                    id:        this.setNumberInputElement.bind(this),
                    type:      'input',
                    ui:        this._ui,
                    tabIndex:  this._tabIndex,
                    inputType: 'text',
                    value:     '0'
                }
            ]
        };
    }

    setTimeoutReset() {
        if (!this._sensors.getAutoReset()) {
            return;
        }
        if (this._timeoutReset) {
            clearTimeout(this._timeoutReset);
        }
        this._timeoutType  = this._type;
        this._timeoutReset = setTimeout(this.onResetTimeout.bind(this), 1500);
    }

    getType() {
        return this._sensorContainer.getType();
    }

    setMode(mode) {
        this._mode = mode;
    }

    setValue(value) {
    }

    /**
     * https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
    **/
    setNumberInputElement(element) {
        this._numberInputElement = element;
        ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach(
            function(event) {
                /* eslint-disable no-invalid-this */
                element.addEventListener(
                    event,
                    function() {
                        if (/^\d*\.?\d*$/.test(this.value)) {
                            this.oldValue           = this.value;
                            this.oldSelectionStart  = this.selectionStart;
                            this.oldSelectionEnd    = this.selectionEnd;
                        } else if (this.hasOwnProperty('oldValue')) {
                            this.value = this.oldValue;
                            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                        }
                    }
                );
            }
        );
        ['keyup', 'change'].forEach(
            function(event) {
                element.addEventListener(event, this.onChangeNumberValue.bind(this));
            },
            this
        );
    }

    getLayer() {
        return this._layer;
    }

    getId() {
        return this._id;
    }

    getMode() {
       return this._mode;
    }

    getContextMenuOptions() {
        return null;
    }

    reset(reset) {
        let sensor = this.getSensor(reset.id);
        sensor && sensor.reset();
    }

    read() {
        return this._value;
    }
};
