var ConsoleComponent = React.createClass({
		getInitialState: function() {
			return {
				small: 		false,
				messages: 	[]
			}
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

		addError: function(error) {
			var state = this.state;
			state.messages.push({
				type: 		'error',
				message: 	error.toString(),
				filename: 	error.filename,
				lineNumber: error.lineNumber
			});
			this.setState(state);
		},

		clearMessages: function() {
			var state = this.state;
			state.messages = [];
			this.setState(state);
		},

		render: function() {
			var state 			= this.state,
				messages 		= state.messages,
				messageChildren = [];
			for (var i = 0; i < messages.length; i++) {
				(function(message) {
					messageChildren.push({
						props: {
							className: 'row error',
							onClick: 	function() { this.props.onShowError && this.props.onShowError(message.filename, message.lineNumber); }.bind(this)
						},
						children: [
							{
								props: {
									className: 'location',
									innerHTML: message.filename + ':' + message.lineNumber
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
					className: 'console ' + (this.state.small ? ' small' : ' large')
				},
				children: [
					{
						type: TabsComponent,
						props: {
							ref: 	'tabs',
							pages: [
								{
									title: 		'Messages',
									content: 	messageChildren
								},
								{
									title: 		'Data',
									content: 	[]
								}
							]
						}
					}
				]
			});
		},
	});