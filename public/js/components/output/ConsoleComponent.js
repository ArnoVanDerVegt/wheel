wheel(
    'components.output.ConsoleComponent',
    React.createClass({
        getInitialState: function() {
            var props = this.props;
            return {
                left:        360,
                visible:     props.visible,
                small:       props.small,
                messages:    [],
                globals:     {}
            }
        },

        setLeft: function(left) {
            var state = this.state;
            state.left = left;
            this.setState(state);
        },

        setSmall: function() {
            var state = this.state;
            state.small = true;
            this.setState(state);
        },

        setLarge: function() {
            var state = this.state;
            state.small = false;
            this.setState(state);
        },

        setGlobals: function(globals) {
            var state = this.state;
            state.globals = globals;
            this.setState(state);
        },

        addLog: function(message) {
            var state = this.state;
            state.messages.push({
                type:         'log',
                message:     message.message,
                location:     message.location
            });
            this.setState(state);
        },

        addError: function(error) {
            var state = this.state;
            state.messages.push({
                type:         'error',
                message:     error.toString(),
                location:     error.location
            });
            this.setState(state);
        },

        clearMessages: function() {
            var state = this.state;
            state.messages = [];
            this.setState(state);
        },

        onClose: function() {
            var state = this.state;
            state.visible = false;
            this.setState(state);
            this.props.onClose && this.props.onClose();
        },

        onClearMessages: function() {
            this.clearMessages();
            this.props.onClearMessages && this.props.onClearMessages();
        },

        show: function() {
            var state = this.state;
            if (state.visible) {
                return false;
            }
            state.visible = true;
            this.setState(state);
            return true;
        },

        render: function() {
            var state           = this.state;
            var props           = this.props;
            var messages        = state.messages;
            var messageChildren = [];
            var globals         = state.globals;
            var globalsChildren = [];

            for (var i = 0; i < messages.length; i++) {
                (function(message) {
                    var location  = message.location;
                    var className = 'row ' + message.type;
                    switch (message.type) {
                        case 'log':
                            className += ' icon-circle-info';
                            break;

                        case 'error':
                            className += ' icon-triangle-warning';
                            break;
                    }
                    messageChildren.push({
                        props: {
                            className: className,
                            onClick:   function() {
                                switch (message.type) {
                                    case 'log':
                                        props.onShowLog && props.onShowLog(location.filename, location.lineNumber);
                                        break;

                                    case 'error':
                                        props.onShowError && props.onShowError(location.filename, location.lineNumber);
                                        break;
                                }
                            }.bind(this)
                        },
                        children: [
                            {
                                props: {
                                    className: 'location',
                                    innerHTML: (location.filename !== '') ? (location.filename + ':' + (location.lineNumber + 1)) : ''
                                }
                            },
                            {
                                props: {
                                    className: 'message',
                                    innerHTML: message.message
                                }
                            }
                        ]
                    });
                }).call(this, messages[i]);
            }

            for (var i in globals) {
                var vr         = globals[i],
                    offset     = ('000000' + vr.offset).substr(-6),
                    length     = ('000000' + vr.length).substr(-6),
                    size     = ('000000' + vr.size).substr(-6);
                globalsChildren.push({
                    type:     'tr',
                    props:     {
                        className: 'row var'
                        //onClick:     function() { this.props.onShowError && this.props.onShowError(message.filename, message.lineNumber); }.bind(this)
                    },
                    children: [
                        {
                            type:     'td',
                            props:     {
                                className: 'offset',
                                innerHTML: offset
                            }
                        },
                        {
                            type:     'td',
                            props:     {
                                className: 'offset',
                                innerHTML: length
                            }
                        },
                        {
                            type:     'td',
                            props:     {
                                className: 'offset',
                                innerHTML: size
                            }
                        },
                        {
                            type:     'td',
                            props:     {
                                className: 'name',
                                innerHTML: i
                            }
                        }
                    ]
                });
            }

            return utilsReact.fromJSON({
                props: {
                    className: 'box-shadow console ' + (state.visible ? ' visible' : '') + (state.small ? ' small' : ' large'),
                    style: {
                        left: this.state.left + 'px'
                    }
                },
                children: [
                    {
                        type: wheel.components.ui.TabsComponent,
                        props: {
                            ref:     'tabs',
                            pages: [
                                {
                                    title:         'Messages',
                                    content:     messageChildren
                                },
                                {
                                    title:         'Data',
                                    content:     [
                                        {
                                            type:         'table',
                                            children:     [
                                                {
                                                    type:         'tbody',
                                                    children:     [
                                                        {
                                                            type:     'tr',
                                                            props:     {
                                                                className: 'row var'
                                                            },
                                                            children: [
                                                                {
                                                                    type:     'th',
                                                                    props:     {
                                                                        className: 'offset',
                                                                        innerHTML: 'Offset'
                                                                    }
                                                                },
                                                                {
                                                                    type:     'th',
                                                                    props:     {
                                                                        className: 'offset',
                                                                        innerHTML: 'Length'
                                                                    }
                                                                },
                                                                {
                                                                    type:     'th',
                                                                    props:     {
                                                                        className: 'offset',
                                                                        innerHTML: 'Size'
                                                                    }
                                                                },
                                                                {
                                                                    type:     'th',
                                                                    props:     {
                                                                        className: 'name',
                                                                        innerHTML: 'Name'
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    ].concat(globalsChildren)
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            tools: [
                                {
                                    type: 'li',
                                    props: {
                                        className: 'tool',
                                    },
                                    children: [
                                        {
                                            props: {
                                                className:     'icon-close',
                                                onClick:     this.onClose
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: 'li',
                                    props: {
                                        className: 'tool',
                                    },
                                    children: [
                                        {
                                            props: {
                                                className:     'icon-comment-close',
                                                onClick:     this.onClearMessages
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            });
        },
    })
);