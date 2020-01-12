/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Sensor = require('./Sensor').Sensor;

exports.UnknownSensor = class extends Sensor {
    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('sensor'),
                className: 'sensor',
                children: [
                    {
                        className: 'title',
                        id:        this.setTitleElement.bind(this),
                        children: [
                            {
                                className: 'unknown-type',
                                innerHTML: '?'
                            },
                            {
                                type:      'span',
                                innerHTML: this._title
                            }
                        ]
                    }
                ]
            }
        );
    }

    onConnected() {
    }

    onDisconnected() {
    }

    onResetTimeout() {
    }
};
