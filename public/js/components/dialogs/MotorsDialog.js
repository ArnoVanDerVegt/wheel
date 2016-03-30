var MotorsDialog = React.createClass({
		getInitialState: function() {
			return {
				visible: 	false,
				title: 		'Motors setup',
				motors: {
					motorA: 	true,
					motorB: 	true,
					motorC: 	true,
					motorD: 	true,
					motor1_1: 	false,
					motor1_2: 	false,
					motor2_1: 	false,
					motor2_2: 	false,
					motor3_1: 	false,
					motor3_2: 	false,
					motor4_1: 	false,
					motor4_2: 	false,
				},
				motorProperties: {
					type: 		true,
					position: 	true,
					target: 	true,
					power: 		true,
					speed: 		true,
					range: 		true
				}
			};
		},

		show: function(motorState, motorProperties, updateCallback) {
			var state = this.state;
			state.visible = true;
			for (var i = 0; i < motorState.length; i++) {
				var ref = motorState[i].ref;
				if (ref in state.motors) {
					state.motors[ref] = motorState[i].visible;
				}
			}
			state.motorProperties = motorProperties;
			this._updateCallback = updateCallback;
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
			this._updateCallback && this._updateCallback(this.state.motors, this.state.motorProperties);
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
				motorChildrenLeft 	= [],
				motorChildrenRight 	= [],
				motorProperties		= this.state.motorProperties,
				properties 			= ['type', 'position', 'target', 'power', 'speed', 'range'],
				propertiesChildren	= [];

			for (var motor in motors) {
				var motorChildren = (motor.indexOf('_') === -1) ? motorChildrenLeft : motorChildrenRight;
				(function(motor) {
					motorChildren.push({
						props: {
							className: 'row'
						},
						children: [
							{
								type: CheckboxComponent,
								props: {
									checked: 	motors[motor],
									onChange: 	function(checked) {
										this.state.motors[motor] = checked;
										this.setState(this.state);
									}.bind(this)
								}
							},
							{
								type: 'div',
								props: {
									className: 	'label',
									innerHTML: 	formatTitle(motor)
								}
							}
						]
					});
				}).call(this, motor);
			}

			for (var i = 0; i < properties.length; i++) {
				(function(property) {
					propertiesChildren.push({
						props: {
							className: 'row'
						},
						children: [
							{
								type: CheckboxComponent,
								props: {
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
						className: 'motors-content',
					},
					children: [
						{
							props: {
								className: 'half'
							},
							children: motorChildrenLeft
						},
						{
							props: {
								className: 'half'
							},
							children: motorChildrenRight
						}
					]
				},
				motorProperties = {
					props: {
						className: 'motors-content',
					},
					children: propertiesChildren
				};

			return 	utilsReact.fromJSON(
				createDialog(
					this,
					'motors',
					'mdi-settings',
					[
						{
							type: TabsComponent,
							props: {
								pages: [
									{
										title: 		'Motors',
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
