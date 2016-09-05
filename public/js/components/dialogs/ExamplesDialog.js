(function() {
    var wheel = require('../../utils/base.js');

    var examples = [
            {
                group: 'Variables',
                examples: [
                    {
                        title:          'Numbers',
                        description:    'Declare a number variable',
                        filename:       '/examples/variables/number.whlp'
                    },
                    {
                        title:          'Number',
                        description:    'Declare a number constant',
                        filename:       '/examples/variables/numberConstant.whlp'
                    },
                    {
                        title:          'String',
                        description:    'Declaring strings',
                        filename:       '/examples/variables/string.whlp'
                    },
                    {
                        title:          'Struct',
                        description:    'Declaring a struct data type',
                        filename:       '/examples/variables/struct.whlp'
                    },
                    {
                        title:          'Struct array',
                        description:    'Declaring a struct data type',
                        filename:       '/examples/variables/structArray.whlp'
                    },
                    {
                        title:          'Struct parameter',
                        description:    'Struct parameter',
                        filename:       '/examples/variables/structParameter.whlp'
                    },
                    {
                        title:          'Array',
                        description:    'Declare an array',
                        filename:       '/examples/variables/array.whlp'
                    },
                    {
                        title:          'Array parameter',
                        description:    'An array as a procedure parameter',
                        filename:       '/examples/variables/arrayParameter.whlp'
                    },
                    {
                        title:          'Array struct',
                        description:    'An array of structs',
                        filename:       '/examples/variables/arrayStruct.whlp'
                    },
                    {
                        title:          'Addr',
                        description:    'Get the address of a variable',
                        filename:       '/examples/variables/addr.whlp'
                    },
                    {
                        title:          'Pointer',
                        description:    'Pointer declaration and assingment',
                        filename:       '/examples/variables/pointer.whlp'
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
                var exampleChildren = [];

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
                                            className: 'example-title',
                                            innerHTML: example.title,
                                            onClick:   (function() {
                                                this.onShowExample(example);
                                            }).bind(this)
                                        }
                                    },
                                    {
                                        type: 'span',
                                        props: {
                                            className: 'example-description',
                                            innerHTML: example.description
                                        }
                                    }
                                ]
                            });
                        }).call(this, examples[i].examples[j]);
                    }
                    exampleChildren.push(exampleChild);
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
                                children: exampleChildren
                            }
                        ]
                    )
                );
            }
        })
    );
})();