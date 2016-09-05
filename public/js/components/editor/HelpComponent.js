(function() {
    var wheel = require('../../utils/base.js');

    wheel(
        'components.editor.HelpComponent',
        React.createClass({
            getInitialState: function() {
                var props = this.props;
                return {
                    left:        360,
                    visible:     props.visible,
                    console:     props.console,
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

            setConsole: function(console) {
                var state = this.state;
                state.console = console;
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

            show: function() {
                var state = this.state;
                if (state.visible) {
                    return false;
                }
                state.visible = true;
                this.setState(state);
                return true;
            },

            hide: function() {
                var state = this.state;
                if (!state.visible) {
                    return false;
                }
                state.visible = false;
                this.setState(state);
                return true;
            },

            onClose: function() {
                var state = this.state;
                state.visible = false;
                this.setState(state);
                this.props.onClose();
            },

            render: function() {
                var props = this.props;
                var state = this.state;

                return utilsReact.fromJSON({
                    props: {
                        className: 'box-shadow help ' +
                            (state.visible ? ' visible'      : '') +
                            (state.console ? ' show-console' : '') +
                            (state.small   ? ' small'        : ' large'),
                        style: {
                            left: this.state.left + 'px'
                        }
                    },
                    children: [
                        {
                            type: 'iframe',
                            props: {
                                src: 'help.html'
                            }
                        },
                        {
                            props: {
                                className: 'icon icon-close',
                                onClick:   this.onClose,
                                title:     'Close console'
                            }
                        }
                    ]
                });
            }
        })
    );
})();