(function() {
	var MotorHeader = React.createClass({
			render: function() {
				return utilsReact.fromJSON({
					props: {
						className: 'motor-header'
					},
					children: [
						{
							props: {
								className: 'display',
								innerHTML: 'Visible'
							}
						},
						{
							props: {
								className: 'port',
								innerHTML: 'Port'
							}
						},
						{
							props: {
								className: 'i2c',
								innerHTML: 'I2C Address'
							}
						},
						{
							props: {
								className: 'type',
								innerHTML: 'Motor type'
							}
						},
						{
							props: {
								className: 'remove'
							}
						}
					]
				});
			}
		});

	var MotorRow = React.createClass({
			render: function() {
				return utilsReact.fromJSON({
					props: {
						className: 'motor-row'
					},
					children: [
						{
							props: {
								className: 'display'
							},
							children: [
								{
									type: wheel.components.ui.CheckboxComponent,
									props: {
										slider: true
									}
								}
							]
						},
						{
							props: {
								className: 'port'
							},
							children: [
								{
									type: wheel.components.ui.SelectComponent,
									props: {
										options: [
											{value: '1', 	text: '1'},
											{value: '2', 	text: '2'},
											{value: '3', 	text: '3'},
											{value: '4', 	text: '4'}
										]
									}
								}
							]
						},
						{
							props: {
								className: 'i2c',
							},
							children: [
								{
									type: wheel.components.ui.TextInputComponent
								}
							]
						},
						{
							props: {
								className: 'type'
							},
							children: [
								{
									type: wheel.components.ui.SelectComponent,
									props: {
										options: [
											{value: 'medium', 	text: 'Medium'},
											{value: 'large', 	text: 'Large'}
										]
									}
								}
							]
						},
						{
							props: {
								className: 'remove'
							},
							children: [
								{
									props: {
										className: 'icon-close'
									}
								}
							]
						}
					]
				});
			}
		});

	wheel(
		'components.dialogs.MotorsDialog',
		React.createClass({
			getInitialState: function() {
				return {
					visible: 	false,
					title: 		'Motors setup',
					motorProperties: {
						type: 		false,
						position: 	false,
						target: 	false,
						power: 		false,
						speed: 		false,
						range: 		false
					}
				};
			},

			show: function(updateCallback) {
				var motorSettings 	= this.props.editor.getMotorSettings(),
					motors 			= motorSettings.motors,
					motorProperties	= motorSettings.motorProperties;

				var state = this.state;
				state.visible = true;
				/*for (var i in motors) {
					state.motors[i] = motors[i];
					this.refs.tabs.refs[i] && this.refs.tabs.refs[i].setState({checked: motors[i]});
				}*/
				for (var i in motorProperties) {
					state.motorProperties[i] = motorProperties[i];
					this.refs.tabs.refs[i] && this.refs.tabs.refs[i].setState({checked: motorProperties[i]});
				}

				state.motorProperties 	= motorSettings.motorProperties;
				this._updateCallback 	= updateCallback;
				this.setState(this.state);
			},

			hide: function() {
				this.state.visible = false;
				this.setState(this.state);
			},

			onClose: function() {
				this.hide();
			},

			onConfirm: function() {
				var motorSettings 	= this.props.editor.getMotorSettings(),
					motors 			= motorSettings.motors,
					motorProperties = motorSettings.motorProperties;

				/*for (var i in motors) {
					if (this.refs.tabs.refs[i]) {
						motors[i] 				= this.refs.tabs.refs[i].getChecked();
						this.state.motors[i] 	= motors[i];
					}
				}*/
				for (var i in motorProperties) {
					if (this.refs.tabs.refs[i]) {
						motorProperties[i] 				= this.refs.tabs.refs[i].getChecked();
						this.state.motorProperties[i] 	= motorProperties[i];
					}
				}
				LocalStorage.getInstance().set('motorSettings', motorSettings);

				this._updateCallback && this._updateCallback();
				this.hide();
			},

			render: function() {
				var formatTitle = function(title) {
						title = title.substr(0, 1).toUpperCase() + title.substr(1 - title.length);
						var i = title.indexOf('_');
						if (i !== -1) {
							title = title.substr(0, i) + '(' + title[i + 1] + ')';
						}
						return title;
					},
					motors 				= this.state.motors,
					motorProperties		= this.state.motorProperties,
					properties 			= ['type', 'position', 'target', 'power', 'speed', 'range'],
					propertiesChildren	= [];

				for (var i = 0; i < properties.length; i++) {
					(function(property) {
						propertiesChildren.push({
							props: {
								className: 'row'
							},
							children: [
								{
									type: wheel.components.ui.CheckboxComponent,
									props: {
										ref: 		property,
										checked: 	motorProperties[properties[i]],
										onChange: 	function(checked) {
											this.state.motorProperties[property] = checked;
											this.setState(this.state);
										}.bind(this)
									}
								},
								{
									type: 'div',
									props: {
										className: 	'label',
										innerHTML: 	formatTitle(properties[i])
									}
								}
							]
						});
					}).call(this, properties[i]);
				}

				var motorSelectPage = {
						props: {
							ref: 		'motorSelectPage',
							className: 	'motors-content',
						},
						children: [
							{
								type: MotorHeader
							},
							{
								props: {
									className: 'motors-container'
								},
								children: [
									{
										type: MotorRow
									}
								]
							},
							{
								props: {
									className: 'motors-add'
								},
								children: [
									{
										type: 'button',
										props: {
											className: 	'button',
											innerHTML: 	'Add motor',
											//onClick: 	this.onClose
										}
									}
								]
							}
						]
					},
					motorProperties = {
						props: {
							className: 'motors-content',
						},
						children: propertiesChildren
					};

				return utilsReact.fromJSON(
					wheel.components.dialogs.createDialog(
						this,
						'motors',
						'icon-settings',
						[
							{
								type: wheel.components.ui.TabsComponent,
								props: {
									ref: 	'tabs',
									pages: [
										{
											title: 		'Standard motors',
											content: 	[]
										},
										{
											title: 		'I2C Motors',
											content: 	[motorSelectPage]
										},
										{
											title: 		'Properties',
											content: 	[motorProperties]
										}
									]
								}
							}
						],
						[
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
		})
	);
})();