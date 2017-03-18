(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'simulator.Simulator',
        wheel.Class(function() {
            this.init = function(opts) {
                this._nodesById = null;
                this._initDom(opts.parentNode);

                this._display = new wheel.simulator.Display({canvas: this._nodesById.display});
                this._buttons = new wheel.simulator.Buttons({nodesById: this._nodesById, onStop: opts.onStop});
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
