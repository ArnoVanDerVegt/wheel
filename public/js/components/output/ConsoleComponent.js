(function() {
    var wheel = require('../../utils/base.js');

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
                    type:        'log',
                    message:     message.message,
                    location:    message.location
                });
                this.setState(state);
                this.emitInfo();
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
                this.emitInfo();
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

                return utilsReact.fromJSON({
                    props: {
                        className: 'box-shadow console ' + (state.visible ? ' visible' : '') + (state.small ? ' small' : ' large'),
                        style: {
                            left: this.state.left + 'px'
                        }
                    },
                    children: [
                        {
                            props: {
                                className: 'messages'
                            },
                            children: messageChildren
                        },
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