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
								className: 'motor-number',
								innerHTML: 'Motor'
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

	function motorSettingGenerator() {
		if (!motorSettingGenerator._data) {
			console.log('make');
			motorSettingGenerator._data = {
				visible: 		true,
				port: 			1,
				i2c: 			6,
				motorNumber: 	1,
				type: 			1
			};
		}
		var data 	= motorSettingGenerator._data,
			result 	= JSON.parse(JSON.stringify(data));

		data.motorNumber++;
		if (data.motorNumber > 2) {
			data.motorNumber = 1;
			data.port++;
			if (data.port > 4) {
				data.port = 1;
				data.i2c++;
			}
		}
		return result;
	}

	var MotorRow = React.createClass({
			getInitialState: function() {
				return motorSettingGenerator();
			},

			onRemove: function() {
				var props = this.props;
				props.list.onRemoveMotor(props.index);
			},

			render: function() {
				var state = this.state;

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
										slider: 	true,
										checked: 	state.visible
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
										value: 		state.port,
										options: 	[
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
									type: 	wheel.components.ui.TextInputComponent,
									props: 	{
										value: state.i2c
									}
								}
							]
						},
						{
							props: {
								className: 'motor-number'
							},
							children: [
								{
									type: wheel.components.ui.SelectComponent,
									props: {
										value: 		state.motorNumber,
										options: 	[
											{value: '1', text: '1'},
											{value: '2', text: '2'}
										]
									}
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
										value: 		state.type,
										options: 	[
											{value: '1', text: 'Medium'},
											{value: '2', text: 'Large'}
										]
									}
								}
							]
						},
						{
							props: {
								className: 	'remove',
								onClick: 	this.onRemove
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

	var I2CMotorList = React.createClass({
			getInitialState: function() {
				return {
					motors: []
				}
			},

			onAddMotor: function() {
				var state 	= this.state,
					motors 	= state.motors;

				motors.push({});

				this.setState(state);
			},

			onRemoveMotor: function(index) {
				var state 	= this.state,
					motors 	= state.motors;

				motors.splice(index, 1);

				this.setState(state);
			},

			render: function() {
				var state 			= this.state,
					motors 			= state.motors,
					listChildren 	= [];

				for (var i = 0; i < motors.length; i++) {
					listChildren.push({
						type: 	MotorRow,
						props: 	{
							list: 	this,
							index: 	i
						}
					});
				}

				return utilsReact.fromJSON({
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
							children: listChildren
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
										onClick: 	this.onAddMotor
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

				var motorProperties = {
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
											content: 	[
												{
													type: I2CMotorList
												}
											]
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