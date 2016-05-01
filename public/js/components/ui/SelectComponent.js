wheel(
	'components.ui.SelectComponent',
	React.createClass({
		getInitialState: function() {
			var props = this.props;
			return {
				value: 		props.value,
				options: 	props.options || []
			};
		},

		onChange: function(event) {
			this.setState({value: event.target.value});
		},

		render: function() {
			var state 			= this.state,
				options 		= state.options,
				optionsChildren = [];
			for (var i = 0; i < options.length; i++) {
				var option = options[i];
				optionsChildren.push({
					type: 	'option',
					props: 	{
						value: 		option.value,
						innerHTML: 	option.text
					}
				});
			}
			return 	utilsReact.fromJSON({
				type: 'select',
				props: {
					onChange: this.onChange
				},
				children: optionsChildren
			});
		}
	})
);