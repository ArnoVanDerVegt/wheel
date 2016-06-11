(function() {
    var examples = [
            {
                group: 'Variables',
                examples: [
                    {
                        title:    'Numbers',
                        filename: '/examples/variables.whlp'
                    }
                ]
            },
            {
                group: 'Conditions',
                examples: [
                    {
                        title:    'Jump if equal',
                        filename: '/examples/conditions/je.whlp'
                    },
                    {
                        title:    'Jump if greater',
                        filename: '/examples/conditions/jg.whlp'
                    },
                    {
                        title:    'Jump if greater or equal',
                        filename: '/examples/conditions/jge.whlp'
                    },
                    {
                        title:    'Jump if less',
                        filename: '/examples/conditions/jl.whlp'
                    },
                    {
                        title:    'Jump if less or equal',
                        filename: '/examples/conditions/je.whlp'
                    }
                ]
            },
            {
                group: 'Drawing',
                examples: [
                    {
                        title:    'Circle',
                        filename: '/examples/drawing/circle.whlp'
                    },
                    {
                        title:    'Line',
                        filename: '/examples/drawing/line.whlp'
                    },
                    {
                        title:    'Pixel',
                        filename: '/examples/drawing/pixel.whlp'
                    },
                    {
                        title:    'Print',
                        filename: '/examples/drawing/print.whlp'
                    },
                    {
                        title:    'Rect',
                        filename: '/examples/drawing/rect.whlp'
                    },
                ]
            }
        ];

    wheel(
        'components.dialogs.ExamplesDialog',
        React.createClass({
            getInitialState: function() {
                return {
                    visible: false,
                    title:   'Examples'
                };
            },

            show: function(onShowExample) {
                this.state.visible       = true;
                this.state.onShowExample = onShowExample;
                this.setState(this.state);
            },

            hide: function() {
                this.state.visible = false;
                this.setState(this.state);
            },

            onClose: function() {
                this.setState({
                    visible: false
                });
            },

            onShowExample: function(example) {
                this.state.onShowExample && this.state.onShowExample(example);
                this.hide();
            },

            render: function() {
                var exampleChildren = [[], []];

                for (var i = 0; i < examples.length; i++) {
                    var exampleChild = {
                            type: 'ul',
                            children: [
                                {
                                    type: 'li',
                                    children: [
                                        {
                                            type: 'h3',
                                            props: {
                                                innerHTML: examples[i].group
                                            }
                                        },
                                        {
                                            type: 'ul',
                                            children: []
                                        }
                                    ]
                                }
                            ]
                        };

                    for (var j = 0; j < examples[i].examples.length; j++) {
                        (function(example) {
                            exampleChild.children[0].children[1].children.push({
                                type: 'li',
                                children: [
                                    {
                                        type: 'span',
                                        props: {
                                            className:     'example-title',
                                            innerHTML:     example.title,
                                            onClick:     (function() {
                                                this.onShowExample(example);
                                            }).bind(this)
                                        }
                                    }
                                ]
                            });
                        }).call(this, examples[i].examples[j]);
                    }
                    exampleChildren[~~(2 * i / examples.length)].push(exampleChild);
                }

                return     utilsReact.fromJSON(
                    wheel.components.dialogs.createDialog(
                        this,
                        'examples',
                        'icon-project',
                        [
                            {
                                props: {
                                    className: 'examples-content',
                                },
                                children: [
                                    {
                                        props: {
                                            className: 'half'
                                        },
                                        children: exampleChildren[0]
                                    },
                                    {
                                        props: {
                                            className: 'half'
                                        },
                                        children: exampleChildren[1]
                                    }
                                ]
                            }
                        ]
                    )
                );
            }
        })
    );
})();