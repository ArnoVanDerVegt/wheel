wheel(
    'components.ui.SelectComponent',
    React.createClass({
        getInitialState: function() {
            var props = this.props;
            return {
                value:   props.value,
                options: props.options || []
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
            var state           = this.state;
            var options         = state.options;
            var optionsChildren = [];
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                optionsChildren.push({
                    type: 'option',
                    props: {
                        value:     option.value,
                        innerHTML: option.text
                    }
                });
            }
            return utilsReact.fromJSON({
                props: {
                    className: 'select icon-chevron-down'
                },
                children: [
                    {
                        type: 'select',
                        props: {
                            value:    state.value,
                            onChange: this.onChange
                        },
                        children: optionsChildren
                    }
                ]
            });
        }
    })
);