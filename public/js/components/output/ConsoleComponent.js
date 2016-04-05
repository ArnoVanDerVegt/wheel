var ConsoleComponent = React.createClass({
		getInitialState: function() {
			return {
				left: 		360,
				visible: 	true,
				small: 		false,
				messages: 	[],
				globals: 	{}
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
				type: 		'log',
				message: 	message.message,
				filename: 	message.filename,
				lineNumber: message.lineNumber
			});
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

		onClose: function() {
			var state = this.state;
			state.visible = false;
			this.setState(state);
			this.props.onClose && this.props.onClose();
		},

		onClearMessages: function() {
			this.clearMessages();
			this.props.onClearMessages && this.props.onClearMessages();
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

		render: function() {
			var state 			= this.state,
				messages 		= state.messages,
				messageChildren = [],
				globals 		= state.globals,
				globalsChildren = [];

			for (var i = 0; i < messages.length; i++) {
				(function(message) {
					messageChildren.push({
						props: {
							className: 'row ' + message.type,
							onClick: 	function() { this.props.onShowError && this.props.onShowError(message.filename, message.lineNumber); }.bind(this)
						},
						children: [
							{
								props: {
									className: 'location',
									innerHTML: message.filename + ':' + (message.lineNumber + 1)
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

			for (var i in globals) {
				var vr 		= globals[i],
					offset 	= ('000000' + vr.offset).substr(-6),
					length 	= ('000000' + vr.length).substr(-6),
					size 	= ('000000' + vr.size).substr(-6);
				globalsChildren.push({
					props: {
						className: 'row var',
						//onClick: 	function() { this.props.onShowError && this.props.onShowError(message.filename, message.lineNumber); }.bind(this)
					},
					children: [
						{
							props: {
								className: 'offset',
								innerHTML: offset
							}
						},
						{
							props: {
								className: 'offset',
								innerHTML: length
							}
						},
						{
							props: {
								className: 'offset',
								innerHTML: size
							}
						},
						{
							props: {
								className: 'name',
								innerHTML: i
							}
						}
					]
				});
			}

			return utilsReact.fromJSON({
				props: {
					className: 'console ' + (state.visible ? ' visible' : '') + (state.small ? ' small' : ' large'),
					style: {
						left: this.state.left + 'px'
					}
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
									content: 	globalsChildren
								}
							],
							tools: [
								{
									type: 'li',
									props: {
										className: 'tool',
									},
									children: [
										{
											props: {
												className: 	'mdi mdi-close',
												onClick: 	this.onClose
											}
										}
									]
								},
								{
									type: 'li',
									props: {
										className: 'tool',
									},
									children: [
										{
											props: {
												className: 	'mdi mdi-comment-remove-outline',
												onClick: 	this.onClearMessages
											}
										}
									]
								}
							]
						}
					}
				]
			});
		},
	});