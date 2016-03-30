var HeaderComponent = React.createClass({
		render: function() {
			return utilsReact.fromJSON({
				props: {
					className: 'header'
				},
				children: [
					{
						type: MenuComponent,
						props: {
							onFile: 	this.props.onFile,
							onSave: 	this.props.onSave,
							onMotors: 	this.props.onMotors,
							onSensors: 	this.props.onSensors,
							onExamples: this.props.onExamples
						}
					}
				]
			});
		}
	});
