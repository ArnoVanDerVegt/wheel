wheel(
	'components.ui.TextInputComponent',
	React.createClass({
		getInitialState: function() {
			return {
				value: this.props.value
			};
		},

		onChange: function(event) {
			this.setState({value: event.target.value});
		},

		render: function() {
			return 	utilsReact.fromJSON({
				type: 'input',
				props: {
					type: 			'text',
					value: 			this.state.value,
					placeholder: 	this.props.placeholder,
					onChange: 		this.onChange
				},
			});
		}
	})
);