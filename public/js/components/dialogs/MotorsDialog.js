var MotorsDialog = React.createClass({
		getInitialState: function() {
			return {
				visible: 	false,
				title: 		'Motors setup',
				motors: {
					motor1_A: 	false,
					motor1_B: 	false,
					motor1_C: 	false,
					motor1_D: 	false,
					motor2_A: 	false,
					motor2_B: 	false,
					motor2_C: 	false,
					motor2_D: 	false,
					motor3_A: 	false,
					motor3_B: 	false,
					motor3_C: 	false,
					motor3_D: 	false,
					motor4_A: 	false,
					motor4_B: 	false,
					motor4_C: 	false,
					motor4_D: 	false,
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
			for (var i in motors) {
				state.motors[i] = motors[i];
				this.refs.tabs.refs[i] && this.refs.tabs.refs[i].setState({checked: motors[i]});
			}
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

			for (var i in motors) {
				if (this.refs.tabs.refs[i]) {
					motors[i] 				= this.refs.tabs.refs[i].getChecked();
					this.state.motors[i] 	= motors[i];
				}
			}
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
				motorChildrenColums = [[], [], []],
				motorProperties		= this.state.motorProperties,
				properties 			= ['type', 'position', 'target', 'power', 'speed', 'range'],
				propertiesChildren	= [];

			var i = 0;
			for (var motor in motors) {
				var motorChildren = motorChildrenColums[i >> 3];
				(function(motor) {
					motorChildren.push({
						props: {
							className: 'row'
						},
						children: [
							{
								type: CheckboxComponent,
								props: {
									ref: 		motor,
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
				i++;
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
							props: {
								ref: 		'c0',
								className: 	'third'
							},
							children: motorChildrenColums[0]
						},
						{
							props: {
								ref: 		'c1',
								className: 	'third'
							},
							children: motorChildrenColums[1]
						},
						{
							props: {
								ref: 		'c2',
								className: 	'third'
							},
							children: motorChildrenColums[2]
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
					'icon-settings',
					[
						{
							type: TabsComponent,
							props: {
								ref: 	'tabs',
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
