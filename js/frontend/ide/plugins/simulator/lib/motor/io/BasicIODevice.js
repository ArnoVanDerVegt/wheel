/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../../../lib/dom').DOMNode;
const IconSelect = require('../../../../../../lib/components/IconSelect').IconSelect;
const getImage   = require('../../../../../data/images').getImage;

exports.BasicIODevice = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._settings           = opts.settings;
        this._parentNode         = opts.parentNode;
        this._sensors            = opts.sensors;
        this._device             = opts.device;
        this._simulator          = opts.simulator;
        this._layer              = opts.layer;
        this._id                 = opts.id;
        this._hidden             = opts.hidden;
        this._title              = opts.title;
        this._tabIndex           = opts.tabIndex;
        this._ui                 = opts.ui;
        this._mode               = null;
        this._value              = 0;
        this._numberInputElement = null;
        this._timeoutReset       = null;
        this._timeoutType        = null;
    }

    remove() {
        let parentNode = this._parentNode;
        while (parentNode.childNodes.length) {
            parentNode.removeChild(parentNode.childNodes[0]);
        }
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

    onClickTitle(element, event) {
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
            {x: offsetX + parent.scrollLeft, y: offsetY - parent.scrollTop},
            event
        );
    }

    onResetTimeout() {
        this._timeoutReset = null;
        this._value        = 0;
    }

    setTitleElement(element) {
        this._titleElement = element;
        element.addEventListener('click', this.onClickTitle.bind(this, element));
    }

    getColorOptions() {
        return [
            {value: 0, icon: getImage('images/constants/colorNone.svg')},
            {value: 1, icon: getImage('images/constants/colorBlack.svg')},
            {value: 2, icon: getImage('images/constants/colorBlue.svg')},
            {value: 3, icon: getImage('images/constants/colorGreen.svg')},
            {value: 4, icon: getImage('images/constants/colorYellow.svg')},
            {value: 5, icon: getImage('images/constants/colorRed.svg')},
            {value: 6, icon: getImage('images/constants/colorWhite.svg')},
            {value: 7, icon: getImage('images/constants/colorBrown.svg')}
        ];
    }

    getColorValueInput() {
        return {
            className: 'value hidden',
            ref:       this.setRef('colorValue'),
            children: [
                {
                    ref:      this.setRef('colorValueInput'),
                    type:     IconSelect,
                    ui:       this._ui,
                    tabIndex: this._tabIndex,
                    options:  this.getColorOptions(),
                    onChange: this.onChangeValue.bind(this)
                }
            ]
        };
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
        if (!this._settings.getSensorAutoReset()) {
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

    setMode(mode) {
        this._mode = mode;
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
