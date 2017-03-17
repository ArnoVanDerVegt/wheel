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
        'simulator.Simulator',
        wheel.Class(function() {
            this.init = function(opts) {
                this._nodesById = null;
                this._initDom(opts.parentNode);

                this._display = new wheel.simulator.Display({canvas: this._nodesById.display});

                var nodesById = this._nodesById;

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

            this.getDisplay = function() {
                return this._display;
            };

            this._initDom = function(domNode) {
                var tree = {
                        className: 'ev3',
                        children: [
                            {
                                className: 'ev3-left',
                            },
                            {
                                className: 'ev3-body',
                                children: [
                                    {
                                        className: 'ev3-display',
                                        children: [
                                            {
                                                className: 'display-border',
                                                children: [
                                                    {
                                                        type: 'canvas',
                                                        id:   'display'
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        className: 'ev3-panel',
                                        children: [
                                            {
                                                className: 'ev3-buttons',
                                                children: [
                                                    {
                                                        id:        'light',
                                                        className: 'ev3-light'
                                                    },
                                                    {
                                                        id:        'buttonUp',
                                                        className: 'ev3-button-up'
                                                    },
                                                    {
                                                        id:        'buttonLeft',
                                                        className: 'ev3-button-left'
                                                    },
                                                    {
                                                        id:        'buttonCenter',
                                                        className: 'ev3-button-center'
                                                    },
                                                    {
                                                        id:        'buttonRight',
                                                        className: 'ev3-button-right'
                                                    },
                                                    {
                                                        id:        'buttonDown',
                                                        className: 'ev3-button-down'
                                                    }
                                                ]
                                            },
                                            {
                                                id:        'buttonStop',
                                                className: 'ev3-button-stop'
                                            }
                                        ]
                                    },
                                    {
                                        className: 'ev3-bottom',
                                        children: [
                                            {
                                                className: 'ev3-log-text',
                                                innerHTML: 'WHL'
                                            },
                                            {
                                                className: 'ev3-logo'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                className: 'ev3-right',
                            }
                        ]
                    };

                var createNode = (function(parentNode, node) {
                        var domNode  = document.createElement(node.type || 'div');
                        var children = node.children || [];

                        if ('id' in node) {
                            domNode.id = node.id;
                            this._nodesById[node.id] = domNode;
                        }
                        if ('innerHTML' in node) {
                            domNode.innerHTML = node.innerHTML;
                        }

                        domNode.className = node.className || '';
                        parentNode.appendChild(domNode);

                        children.forEach(function(child) {
                            createNode(domNode, child)
                        });
                    }).bind(this);

                this._nodesById = {};

                createNode(domNode, tree);
            };
        })
    );
})();
