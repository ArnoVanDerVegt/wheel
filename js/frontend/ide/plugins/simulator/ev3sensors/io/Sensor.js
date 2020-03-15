/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../../../../lib/dispatcher').dispatcher;
const DOMNode               = require('../../../../../lib/dom').DOMNode;
const getImage              = require('../../../../data/images').getImage;
const BasicIODevice         = require('./../../lib/motor/io/BasicIODevice').BasicIODevice;

exports.Sensor = class extends BasicIODevice {
    constructor(opts) {
        super(opts);
        let device = opts.device;
        this._sensorContainer = opts.sensorContainer;
        this._image           = opts.image;
        this._events          = [
            device.addEventListener('EV3.Connecting',   this, this.onConnecting),
            device.addEventListener('EV3.Connected',    this, this.onConnected),
            device.addEventListener('EV3.Disconnected', this, this.onDisconnected)
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
                                type:      'img',
                                className: 'type',
                                src:       getImage(image)
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
        super.remove();
    }

    onConnecting() {
        this._sensorContainer.setType(-1);
    }

    onConnected() {
    }

    onDisconnected() {
    }
};
