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
							onFile: 		this.props.onFile,
							onSave: 		this.props.onSave,
							onSelectAll: 	this.props.onSelectAll,
							onFind: 		this.props.onFind,
							onFindNext: 	this.props.onFindNext,
							onFindPrev: 	this.props.onFindPrev,
							onFormat: 		this.props.onFormat,
							onUndo: 		this.props.onUndo,
							onRedo: 		this.props.onRedo,
							onMotors: 		this.props.onMotors,
							onSensors: 		this.props.onSensors,
							onExamples: 	this.props.onExamples
						}
					}
				]
			});
		}
	});
