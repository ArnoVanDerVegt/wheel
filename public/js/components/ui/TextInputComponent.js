(function() {
    var wheel = require('../../utils/base.js');

    wheel(
        'components.ui.TextInputComponent',
        React.createClass({
            getInitialState: function() {
                return {
                    value: this.props.value
                };
            },

            getValue: function() {
                return this.state.value;
            },

            onChange: function(event) {
                var state = this.state;
                state.value = event.target.value;
                this.setState(state);
                var props = this.props;
                props.onChange && props.onChange(event);
            },

            render: function() {
                return     utilsReact.fromJSON({
                    type: 'input',
                    props: {
                        type:        'text',
                        value:       this.state.value,
                        placeholder: this.props.placeholder,
                        onChange:    this.onChange
                    },
                });
            }
        })
    );
})();