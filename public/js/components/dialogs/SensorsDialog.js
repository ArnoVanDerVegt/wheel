var SensorsDialog = React.createClass({
		getInitialState: function() {
			return {
				visible: 	false,
				title: 		'Sensors setup',
				sensors: {
					sensor1: 	true,
					sensor2: 	true,
					sensor3: 	true,
					sensor4: 	true,
				}
			};
		},

		show: function() {
			this.state.visible = true;
			this.setState(this.state);
		},

		hide: function() {
			this.state.visible = false;
			this.setState(this.state);
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
			var formatTitle = function(title) {
					title = title.substr(0, 1).toUpperCase() + title.substr(1 - title.length);
					var i = title.indexOf('_');
					if (i !== -1) {
						title = title.substr(0, i) + '(' + title[i + 1] + ')';
					}
					return title;
				},
				sensors 		= this.state.sensors,
				sensorChildren 	= [],
				sensorTypes 	= [
					{img: 'Hardware_NXT_Light.png', 		name: 'Light'},
					{img: 'Hardware_NXT_Touch.png', 		name: 'Touch'},
					{img: 'Hardware_NXT_US.png', 			name: 'Ultrasonic'},
					{img: 'Hardware_NXT_Sound.png', 		name: 'Sound'},
					{img: 'Hardware_NXT_Color.png', 		name: 'Color'},
					{img: 'Hardware_NXT_Temperature.png', 	name: 'Temperature'}
				];

			for (var sensor in sensors) {
				var sensorTypesChildren = [];

				for (var i = 0; i < sensorTypes.length; i++) {
					sensorTypesChildren.push({
						props: {
							className: 'sensor-type'
						},
						children: [
							{
								type: 'img',
								props: {
									src: '/images/' + sensorTypes[i].img
								}
							},
							{
								type: CheckboxComponent,
								props: {
									checked: false
								}
							}
						]
					});
				}
				sensorChildren.push({
					props: {
						className: 'row'
					},
					children: [
						{
							type: CheckboxComponent,
							props: {
								slider: 	true,
								checked: 	sensors[sensor]
							}
						},
						{
							props: {
								className: 	'label',
								innerHTML: 	formatTitle(sensor)
							}
						}
					].concat(sensorTypesChildren)
				});
			}

			return 	utilsReact.fromJSON(
				createDialog(
					this,
					'sensors',
					'mdi-signal-variant',
					[
						{
							props: {
								className: 'sensors-content',
							},
							children: sensorChildren
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
