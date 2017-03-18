(function() {
    var wheel = require('../utils/base.js').wheel;

    var Button = wheel.Class(function() {
            this.init = function(opts) {
                var element = opts.element;
                this._element   = element;
                this._down      = false;
                this._onClick   = opts.onClick;
                this._className = opts.className;

                element.addEventListener('mousedown', this.onMouseDown.bind(this));
                element.addEventListener('mouseup',   this.onMouseUp.bind(this));
                element.addEventListener('mouseout',  this.onMouseOut.bind(this));
            };

            this.onMouseDown = function() {
                this._down              = true;
                this._element.className = this._className.down;
                this._onClick && this._onClick();
            };

            this.onMouseUp = function() {
                this._up                = false;
                this._element.className = this._className.up;
            };

            this.onMouseOut = function() {
                this._out               = false;
                this._element.className = this._className.up;
            };
        });

    wheel(
        'simulator.Buttons',
        wheel.Class(function() {
            this.init = function(opts) {
                var nodesById = opts.nodesById;

                this._buttonStop = new Button({
                    element: nodesById.buttonStop,
                    className: {
                        up:   'ev3-button-stop',
                        down: 'ev3-button-stop pressed'
                    },
                    onClick: opts.onStop
                });
                this._buttonLeft = new Button({
                    element: nodesById.buttonLeft,
                    className: {
                        up:   'ev3-button-left',
                        down: 'ev3-button-left pressed'
                    }
                });
                this._buttonCenter = new Button({
                    element: nodesById.buttonCenter,
                    className: {
                        up:   'ev3-button-center',
                        down: 'ev3-button-center pressed'
                    }
                });
                this._buttonRight = new Button({
                    element: nodesById.buttonRight,
                    className: {
                        up:   'ev3-button-right',
                        down: 'ev3-button-right pressed'
                    }
                });
                this._buttonUp = new Button({
                    element: nodesById.buttonUp,
                    className: {
                        up:   'ev3-button-up',
                        down: 'ev3-button-up pressed'
                    }
                });
                this._buttonDown = new Button({
                    element: nodesById.buttonDown,
                    className: {
                        up:   'ev3-button-down',
                        down: 'ev3-button-down pressed'
                    }
                });
            };
        })
    );
})();
