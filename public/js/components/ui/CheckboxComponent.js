wheel(
	'components.ui.CheckboxComponent',
	React.createClass({
		getInitialState: function() {
			return {
				checked: !!this.props.checked
			};
		},

		getChecked: function() {
			return this.state.checked;
		},

		setChecked: function(checked) {
			this.state.checked = checked;
			this.setState(this.state);
		},

		onClick: function() {
			var checked = this.state.checked;
			this.setState({
				checked: !checked
			});
			this.props.onChange && this.props.onChange(!checked);
		},

		render: function() {
			var cb1 = this.props.slider ? 'icon-check' : 'icon-circle-check',
				cb2 = 'icon-circle';

			return 	utilsReact.fromJSON({
				props: {
					className: 	'checkbox' +
									(this.props.slider ? ' slider' : '') +
									(this.state.checked ? ' checked' : ''),
					onClick: 	this.onClick
				},
				children: [
					{
						props: {
							className: 'checkbox-track'
						}
					},
					{
						props: {
							className: 'checkbox-value mdi ' + (this.state.checked ? cb1 : (this.props.slider ? '' : cb2))
						}
					}
				]
			});
		}
	})
);