/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../../lib/dom').DOMNode;
const Button     = require('../../../../../lib/components/input/Button').Button;
const dispatcher = require('../../../../../lib/dispatcher').dispatcher;
const LedMatrix  = require('../io/LedMatrix').LedMatrix;
const HubStatus  = require('./HubStatus').HubStatus;

exports.Hub = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._visible = opts.visible;
        this._layer   = opts.layer;
        this._spike   = opts.spike;
        opts.plugin.addHub(this);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                children: [
                    {
                        type:    HubStatus,
                        spike:   this._spike,
                        layer:   this._layer,
                        visible: this._visible,
                        id:      this.setStatus.bind(this)
                    },
                    {
                        ref:      this.setRef('spikeHub'),
                        className: 'flt spike-hub' + (this._visible ? ' visible' : ''),
                        children: [
                            {
                                className: 'spike-top flt max-w',
                                children: [
                                    this.initButton()
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

    initButton() {
        return {
            className: 'button'
        };
    }

    initButtons() {
        return {
            className: 'flt buttons',
            children: [
                {
                    className: 'left-right'
                },
                {
                    className: 'center'
                }
            ]
        };
    }

    setStatus(status) {
        this._status = status;
    }

    setVisible(visible) {
        this._visible                 = visible;
        this._refs.hubInfo.className  = 'flt hub-info'  + (visible ? ' visible' : '');
        this._status.setVisible(visible);
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
};
