/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../../lib/dom').DOMNode;
const Light   = require('./Light').Light;
const Button  = require('./Button').Button;

exports.Buttons = class extends DOMNode {
    constructor(opts) {
        super(opts);
        opts.id(this);
        this._opts         = opts;
        this._buttonLeft   = null;
        this._buttonCenter = null;
        this._buttonRight  = null;
        this._buttonUp     = null;
        this._buttonDown   = null;
        this.initDOM(opts.parentNode);
    }

    setLightElement(element) {
        this._light = new Light({element: element});
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'flt rel ev3-buttons',
                children: [
                    {
                        id:        this.setLightElement.bind(this),
                        className: 'abs ev3-light'
                    },
                    {
                        id:        function(element) { this._buttonUp = element; }.bind(this),
                        type:      Button,
                        className: 'abs ev3-button-up',
                        up:        'abs ev3-button-up',
                        down:      'abs ev3-button-up pressed'
                    },
                    {
                        id:        function(element) { this._buttonLeft = element; }.bind(this),
                        type:      Button,
                        className: 'abs ev3-button-left',
                        up:        'abs ev3-button-left',
                        down:      'abs ev3-button-left pressed'
                    },
                    {
                        id:        function(element) { this._buttonCenter = element; }.bind(this),
                        type:      Button,
                        className: 'abs ev3-button-center',
                        up:        'abs ev3-button-center',
                        down:      'abs ev3-button-center pressed'
                    },
                    {
                        id:        function(element) { this._buttonRight = element; }.bind(this),
                        type:      Button,
                        className: 'abs ev3-button-right',
                        up:        'abs ev3-button-right',
                        down:      'abs ev3-button-right pressed'
                    },
                    {
                        id:        function(element) { this._buttonDown = element; }.bind(this),
                        type:      Button,
                        className: 'abs ev3-button-down',
                        up:        'abs ev3-button-down',
                        down:      'abs ev3-button-down pressed'
                    }
                ]
            }
        );
    }

    readButton() {
        if (this._buttonUp.getDown()) {
            return 1;
        }
        if (this._buttonCenter.getDown()) {
            return 2;
        }
        if (this._buttonDown.getDown()) {
            return 3;
        }
        if (this._buttonRight.getDown()) {
            return 4;
        }
        if (this._buttonLeft.getDown()) {
            return 5;
        }
        return 0;
    }
};
