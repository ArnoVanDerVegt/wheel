(function() {
    var wheel = require('../../utils/base.js').wheel;

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
                    output:      [],
                    viewMode:    'messages',
                    runLines:    [],
                    runCount:    0
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

            addLog: function(message) {
                var state = this.state;
                state.messages.push({
                    type:        'log',
                    message:     message.message,
                    location:    message.location
                });
                this.setState(state);
                this.emitInfo();
            },

            addRunLine: function(index) {
                var state = this.state;
                if (state) {
                    var runLines = state.runLines;
                    state.runCount++;
                    state.runLines[index] = state.runCount;
                    this.setState(state);
                }
            },

            setOutput: function(output) {
                this.setState({
                    runLines: [],
                    runCount: 0,
                    output:   output
                });
            },

            addError: function(error) {
                var state = this.state;
                state.messages.push({
                    type:        'error',
                    message:     error.toString(),
                    location:    error.location
                });
                this.setState(state);
                this.emitInfo();
            },

            clearMessages: function() {
                this.setState({messages: []});
            },

            onClose: function() {
                this.setState({visible: false});
                this.props.onClose && this.props.onClose();
            },

            onClearMessages: function() {
                this.clearMessages();
                this.props.onClearMessages && this.props.onClearMessages();
                this.emitInfo();
            },

            onShowCode: function() {
                this.setState({viewMode: 'code'});
            },

            onShowMessages: function() {
                this.setState({viewMode: 'messages'});
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

            emitInfo: function() {
                var messages = this.state.messages;
                var log      = 0;
                var error    = 0;
                for (var i = 0; i < messages.length; i++) {
                    var message = messages[i];
                    switch (message.type) {
                        case 'log':
                            log++;
                            break;

                        case 'error':
                            error++;
                            break;
                    }
                }
                this.props.editor.getEmitter().emit('MessagesInfo', {log: log, error: error});
            },

            renderMessages: function() {
                var state           = this.state;
                var props           = this.props;
                var messages        = state.messages;
                var messageChildren = [];

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

                return messageChildren;
            },

            renderCode: function() {
                var state           = this.state;
                var props           = this.props;
                var output          = state.output;
                var messageChildren = [];

                for (var i = 0; i < output.length; i++) {
                    var className = 'row code';
                    var runLine   = state.runLines[i];
                    var color     = '#000000';
                    if (runLine !== undefined) {
                        var grn = ~~(255 * runLine / state.runCount);
                        var red = ~~(255 * (1 - runLine / state.runCount));
                        color = '#' + ('000000' + ((red << 16) + (grn << 8)).toString(16)).substr(-6);
                    }

                    messageChildren.push({
                        props: {
                            className: className,
                        },
                        children: [
                            {
                                type: 'pre',
                                props: {
                                    className: 'message',
                                },
                                children: [
                                    (runLine !== undefined) ?
                                        {
                                            type: 'span',
                                            props: {
                                                style: {
                                                    backgroundColor: color
                                                },
                                                className: 'executed',
                                                innerHTML: runLine
                                            }
                                        } :
                                        null,
                                    {
                                        type: 'span',
                                        props: {
                                            className: 'output-code',
                                            innerHTML: output[i]
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }

                return messageChildren;
            },

            render: function() {
                var state = this.state;
                var props = this.props;

                return utilsReact.fromJSON({
                    props: {
                        className: 'box-shadow console ' + (state.visible ? ' visible' : '') + (state.small ? ' small' : ' large'),
                        style: {
                            left: this.state.left + 'px'
                        }
                    },
                    children: [
                        (state.viewMode === 'messages') ?
                            {
                                props: {
                                    className: 'messages'
                                },
                                children: this.renderMessages()
                            } :
                            null,

                        (state.viewMode === 'code') ?
                            {
                                props: {
                                    className: 'messages'
                                },
                                children: this.renderCode()
                            } :
                            null,
                        {
                            props: {
                                className: 'control-panel'
                            },
                            children: [
                                {
                                    props: {
                                        className: 'icon icon-close',
                                        onClick:   this.onClose,
                                        title:     'Close console'
                                    }
                                },
                                {
                                    props: {
                                        className: 'icon icon-square-bracket',
                                        onClick:    this.onShowCode,
                                        title:     'Code'
                                    }
                                },
                                {
                                    props: {
                                        className: 'icon icon-comment',
                                        onClick:    this.onShowMessages,
                                        title:     'Messages'
                                    }
                                },
                                {
                                    props: {
                                        className: 'icon icon-comment-close',
                                        onClick:   this.onClearMessages,
                                        title:     'Clear console'
                                    }
                                },
                                {
                                    props: {
                                        className: 'icon icon-comment-help',
                                        onClick:    props.onShowHelp,
                                        title:     'Help'
                                    }
                                }
                            ]
                        }
                    ]
                });
            }
        })
    );
})();