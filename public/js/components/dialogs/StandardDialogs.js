var LORUM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer pulvinar dui et velit suscipit dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.';

function createDialog(reactClass, dialogClassName, iconClassName, content, buttons) {
	return {
		props: {
			className: 'dialog-background' + (reactClass.state.visible ? ' visible' : '')
		},
		children: [
			{
				props: {
					className: 	'dialog ' + dialogClassName,
				},
				children: [
					{
						props: {
							className: 'dialog-vertical'
						},
						children: [
							{
								props: {
									className: 'dialog-header'
								},
								children: [
									{
										type: 'h4',
										props: {
											innerHTML: 	reactClass.state.title
										}
									},
									{
										props: {
											className: 	'close-button icon-close',
											onClick: 	reactClass.onClose
										}
									}
								]
							},
							{
								props: {
									className: 'dialog-content'
								},
								children: [
									{
										props: {
											className: 'icon ' + iconClassName
										}
									}
								].concat(content || [])
							},
							{
								props: {
									className: 'buttons'
								},
								children: buttons || [
									{
										type: 'button',
										props: {
											className: 	'button',
											innerHTML: 	'Ok',
											onClick: 	reactClass.onClose
										}
									}
								]
							}
						]
					}
				]
			}
		]
	};
};

var AlertDialog = React.createClass({
		getInitialState: function() {
			return {
				visible: 	false,
				title: 		'This is the dialog title'
			};
		},

		onClose: function() {
			this.setState({
				visible: false
			});
		},

		render: function() {
			return 	utilsReact.fromJSON(
				createDialog(
					this,
					'alert',
					'icon-triangle-warning',
					[
						{
							props: {
								className: 'alert-content',
								innerHTML: this.state.content || LORUM_IPSUM
							}
						}
					]
				)
			);
		}
	});

var ConfirmDialog = React.createClass({
		getInitialState: function() {
			return {
				visible: 	false,
				title: 		'This is the confirm dialog title'
			};
		},

		onClose: function() {
			this.setState({
				visible: false
			});
		},

		onConfirm: function() {
			this.state.onConfirm && this.state.onConfirm();
			this.setState({
				visible: false
			});
		},

		render: function() {
			return 	utilsReact.fromJSON(
				createDialog(
					this,
					'alert',
					this.state.icon || 'mdi-comment-question-outline',
					[
						{
							props: {
								className: 'alert-content',
								innerHTML: this.state.content || LORUM_IPSUM
							}
						}
					],
					[
						{
							type: 'button',
							props: {
								className: 	'button',
								innerHTML: 	'Cancel',
								onClick: 	this.onClose
							}
						},
						{
							type: 'button',
							props: {
								className: 	'button',
								innerHTML: 	'Ok',
								onClick: 	this.onConfirm
							}
						}
					]
				)
			);
		}
	});

var PromptDialog = React.createClass({
		getInitialState: function() {
			return {
				visible: 	false,
				title: 		'This is the prompt dialog title'
			};
		},

		onClose: function() {
			this.setState({
				visible: false
			});
		},

		onConfirm: function() {
			this.state.onConfirm && this.state.onConfirm(this.refs.input.state.value);
			this.setState({
				visible: false
			});
		},

		show: function(title, content, placeholder, value, onConfirm) {
			this.refs.input.setState({value: value});

			this.setState({
				visible: 		true,
				title: 			title,
				content: 		content,
				placeholder: 	placeholder,
				value: 			value,
				onConfirm: 		onConfirm
			});
		},

		render: function() {
			return 	utilsReact.fromJSON(
				createDialog(
					this,
					'prompt',
					'icon-pen',
					[
						{
							props: {
								className: 'prompt-content',
								innerHTML: this.state.content || LORUM_IPSUM
							}
						},
						{
							type: TextInputComponent,
							props: {
								placeholder: 	this.state.placeholder || 'input text',
								value: 			this.state.value,
								ref: 			'input'
							}
						}
					],
					[
						{
							type: 'button',
							props: {
								className: 	'button',
								innerHTML: 	'Cancel',
								onClick: 	this.onClose
							}
						},
						{
							type: 'button',
							props: {
								className: 	'button',
								innerHTML: 	'Ok',
								onClick: 	this.onConfirm
							}
						}
					]
				)
			);
		}
	});
