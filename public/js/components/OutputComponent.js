var MotorStatus = Class(function() {
		this.init = function(opts) {
			this._canvas 	= opts.canvas;
			this._ctx 		= this._canvas.getContext('2d');
		};

		this.renderBar = function(start, end, color, alpha) {
			var ctx = this._ctx;

			if (start > end) {
				var n = start;
				start 	= end;
				end 	= n;
			}

			start 	= Math.min(Math.max(start, 0), 1);
			end 	= Math.min(Math.max(end, 0), 1);
			start 	= Math.PI * 1.5 + start * Math.PI * 2;
			end 	= Math.PI * 1.5 + end * Math.PI * 2;

			ctx.globalAlpha = alpha;
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.arc(16, 16, 11, start, end);
			ctx.lineWidth = 8;
			ctx.stroke();
			ctx.globalAlpha = 1;
		};

		this.render = function(state) {
			var ctx = this._ctx;

			ctx.clearRect(0, 0, 32, 32);

			var perc = 0.5;//0.1 + Math.random() * 0.8;

			var range 		= Math.abs(state.max - state.min),
				target 		= state.target,
				position 	= state.position;

			this.renderBar(0, 1, '#FFFFFF', 1);
			this.renderBar(0, target / range, '#1976D2', 1);
			this.renderBar(position / range, target / range, '#FF5252', 0.8);

			ctx.strokeStyle = '#000000';
			ctx.lineWidth 	= 1;

			ctx.beginPath();
			ctx.arc(16, 16, 15, 0, Math.PI * 2);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(16, 16, 7.5, 0, Math.PI * 2);
			ctx.closePath();
			ctx.stroke();
		};
	});

var EV3StatusRow = React.createClass({
		render: function() {
			return 	utilsReact.fromJSON({
				props: {
					className: 	'status-row',
				},
				children: [
					{
						type: 'div',
						props: {
							className: 'status-name',
							innerHTML: this.props.name + ':'
						}
					},
					{
						type: 'div',
						props: {
							className: 'status-value',
							innerHTML: this.props.value
						}
					}
				]
			});
		}
	});

var EV3MotorComponent = React.createClass({
		getInitialState: function() {
			var props 	= this.props,
				motors 	= props.motors,
				motor 	= motors.getMotor(props.index);
			return {
				position: 	motor.getPosition(),
				target: 	motor.getTarget(),
				power: 		motor.getPower(),
				speed: 		motor.getSpeed(),
				min: 		motor.getMin(),
				max: 		motor.getMax()
			};
		},

		componentDidMount: function() {
			if (!this._motorStatus) {
				this._motorStatus = new MotorStatus({canvas: this.refs.canvas});
			}
			this._motorStatus.render(this.state);
		},

		componentDidUpdate: function() {
			if (!this._motorStatus) {
				this._motorStatus = new MotorStatus({canvas: this.refs.canvas});
			}
			this._motorStatus.render(this.state);
		},

		render: function() {
			var state 				= this.state,
				propertiesChildren 	= [],
				motorProperties 	= this.props.motorProperties;

			motorProperties.type 		&& propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Type', 	value: 'Small' }});
			motorProperties.position 	&& propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Position', value: state.position }});
			motorProperties.target 		&& propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Target', 	value: state.target }});
			motorProperties.power 		&& propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Power', 	value: state.power + '%' }});
			motorProperties.speed 		&& propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Speed', 	value: '~' + state.speed + ' rpm' }});
			motorProperties.range 		&& propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Range', 	value: state.min + '..' + state.max }});

			return utilsReact.fromJSON({
				props: {
					className: 'motor ' + (this.props.className || '')
				},
				children: [
					{
						type: 'canvas',
						props: {
							className: 	'status-canvas',
							width: 		32,
							height: 	32,
							ref: 		'canvas'
						}
					},
					{
						props: {
							className: 	'title',
							innerHTML: 	this.props.title
						},
					},
					{
						props: {
							className: 'status'
						},
						children: propertiesChildren
					}
				]
			});
		}
	});

var EV3SensorComponent = React.createClass({
		render: function() {
			return utilsReact.fromJSON({
				props: {
					className: 'sensor ' + (this.props.className || '')
				},
				children: [
					{
						type: 'img',
						props: {
							src: '/images/Hardware_NXT_Touch.png'
						}
					},
					{
						props: {
							className: 	'title',
							innerHTML: 	this.props.title
						},
					},
					{
						props: {
							className: 'status'
						},
						children: [
							{ type: EV3StatusRow, props: { name: 'Type', 	value: 'Button' }},
							{ type: EV3StatusRow, props: { name: 'Value', 	value: 0 }},
						]
					}
				]
			});
		}
	});

var EV3Screen = Class(function() {
		this.init = function(opts) {
			this._updateCallback 	= opts.updateCallback;

			var buffer = document.createElement('canvas');
			buffer.width 	= 178;
			buffer.height 	= 128;

			this._buffer 	= buffer;
			this._bufferCtx = buffer.getContext('2d');

			this._imageData = this._bufferCtx.getImageData(0, 0, 178, 128);

			this.clear();
		};

		this.clear = function() {
			var data 	= this._imageData.data,
				offset 	= 0;
			for (var y = 0; y < 128; y++) {
				for (var x = 0; x < 178; x++) {
					for (var i = 0; i < 3; i++) {
						data[offset++] = 128;
					}
					data[offset++] = 255;
				}
			}

			this._updateCallback && this._updateCallback();
		};

		this._drawPixel = function(x, y, mode) {
			if ((x >= 0) && (y >= 0) && (x < 178) && (y < 128)) {
				var offset 	= (y * 178 * 4) + x * 4,
					data 	= this._imageData.data,
					color 	= (mode === 0) ? 0 : 128;
				for (var i = 0; i < 3; i++) {
					data[offset++] = color;
				}
				data[offset] = 255;
			}
		};

		this.drawPixel = function(x, y, mode) {
			this._drawPixel(x, y, mode);

			this._updateCallback && this._updateCallback();
		};

		this._drawLine = function(x1, y1, x2, y2, mode) {
			var dx 	= Math.abs(x2 - x1);
				dy 	= Math.abs(y2 - y1);
				sx 	= (x1 < x2) ? 1 : -1;
				sy 	= (y1 < y2) ? 1 : -1;
				err = dx - dy;
			while (true) {
				this._drawPixel(x1, y1, mode);  // Do what you need to for this

				if ((x1 == x2) && (y1 == y2)) break;
				var e2 = 2 * err;
				if (e2 >-dy) {
					err -= dy;
					x1  += sx;
				}
			 	if (e2 < dx) {
			 		err += dx;
			 		y1  += sy;
			 	}
			}
		};

		this.drawLine = function(x1, y1, x2, y2, mode) {
			this._drawLine(x1, y1, x2, y2, mode);

			this._updateCallback && this._updateCallback();
		};

		this.drawRect = function(x, y, width, height, mode) {
			this._drawLine(x, 			y, 			x + width, 	y, 			mode);
			this._drawLine(x, 			y, 			x, 			y + height, mode);
			this._drawLine(x + width, 	y, 			x + width, 	y + height, mode);
			this._drawLine(x, 			y + height, x + width, 	y + height, mode);

			this._updateCallback && this._updateCallback();
		};

		this.drawText = function(x, y, text, size) {
			var ctx = this._bufferCtx;
			ctx.putImageData(this._imageData, 0, 0);
			switch (size) {
				case 0:
					size = 8;
					break;

				case 1:
					size = 10;
					break;

				case 2:
					size = 12;
					break;

				default:
					size = 8;
					break;
			}

			ctx.fillStyle 		= '#000000';
			ctx.font 			= size + 'px Inconsolata';
			ctx.textBaseline 	= 'top';
			ctx.fillText(text, x, y);

			this._imageData = ctx.getImageData(0, 0, 178, 128);

			this._updateCallback && this._updateCallback();

			return size;
		};

		this.getImageData = function() {
			return this._imageData;
		};
	});

var EV3ScreenComponent = React.createClass({
		getInitialState: function() {
			return {
				small: true
			}
		},

		updateCtx: function() {
			if (!this._ctx) {
				return;
			}
			var ctx 		= this._ctx,
				imageData 	= this._ev3Screen.getImageData(),
				data 		= imageData.data,
				offset 		= 0,
				size 		= this.state.small ? 1 : 2;
			ctx.clearRect(0, 0, 178 * 2, 128 * 2);
			for (var y = 0; y < 128; y++) {
				for (var x = 0; x < 178; x++) {
					var r = data[offset++],
						g = data[offset++],
						b = data[offset++],
						a = data[offset++];

					if (r < 96) {
						r = 0;
						g = 0;
						b = 0;
					} else {
						r = 128;
						g = 128;
						b = 128;
					}
					ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
					ctx.fillRect(x * size, y * size, size, size);
				}
			}
			//this._ctx.putImageData(this._ev3Screen.getImageData(), 0, 0);
		},

		componentDidMount: function() {
			var canvas 	= this.refs.canvas,
				ctx 	= canvas.getContext('2d');
			if (!this._ev3Screen) {
				this._ev3Screen = new EV3Screen({
					imageData: 		ctx.getImageData(0, 0, 178, 128),
					updateCallback: bind(this, this.updateCtx)
				});
			}
			this._ctx = ctx;
			this.updateCtx();
		},

		onZoom: function() {
			var props = this.props,
				state = this.state;
			if (state.small) {
				state.small = false;
				props.onLarge && props.onLarge();
			} else {
				state.small = true;
				props.onSmall && props.onSmall();
			}
		},

		render: function() {
			var state = this.state,
				props = this.props;

 			return utilsReact.fromJSON({
 				props: {
 					className: 'ev3-screen dark-primary-color'
 				},
 				children: [
 					{
						type: 'canvas',
						props: {
							width: 	state.small ? 178 : 356,
							height: state.small ? 128 : 256,
							ref: 	'canvas'
						}
					},
					{
						props: {
							className: 'control-panel'
						},
						children: [
							{
								props: {
									className: 	'mdi mdi-play',
									onClick: 	(function() { this.props.onRun && this.props.onRun(); }).bind(this)
								}
							},
							{
								props: {
									className: 'mdi mdi-stop'
								}
							},
							{
								props: {
									className: 'mdi mdi-magnify',
									onClick: 	this.onZoom
								}
							}
						]
					}
 				]
 			});
		},

		getEV3Screen: function() {
			return this._ev3Screen;
		}
	});

var OutputComponent = React.createClass({
		getInitialState: function() {
			this.props.motors.on('Changed', this.onUpdateMotors);

			return {
				small: true,
				motors: [
					{ title: 'Motor 1_A', 	ref: 'motor1_A', 	visible: true },
					{ title: 'Motor 1_B', 	ref: 'motor1_B', 	visible: true },
					{ title: 'Motor 1_C', 	ref: 'motor1_C', 	visible: true },
					{ title: 'Motor 1_D', 	ref: 'motor1_D', 	visible: true },
					{ title: 'Motor 2_A', 	ref: 'motor2_A', 	visible: false },
					{ title: 'Motor 2_B', 	ref: 'motor2_B', 	visible: false },
					{ title: 'Motor 2_C', 	ref: 'motor2_C', 	visible: false },
					{ title: 'Motor 2_D', 	ref: 'motor2_D', 	visible: false },
					{ title: 'Motor 3_A', 	ref: 'motor3_A', 	visible: false },
					{ title: 'Motor 3_B', 	ref: 'motor3_B', 	visible: false },
					{ title: 'Motor 3_C', 	ref: 'motor3_C', 	visible: false },
					{ title: 'Motor 3_D', 	ref: 'motor3_D', 	visible: false },
					{ title: 'Motor 4_A', 	ref: 'motor4_A', 	visible: false },
					{ title: 'Motor 4_B', 	ref: 'motor4_B', 	visible: false },
					{ title: 'Motor 4_C', 	ref: 'motor4_C', 	visible: false },
					{ title: 'Motor 4_D', 	ref: 'motor4_D', 	visible: false },

					{ title: 'MMotor 1-1', 	ref: 'motor1_1', 	visible: false },
					{ title: 'MMotor 1-2', 	ref: 'motor1_2', 	visible: false },
					{ title: 'MMotor 2-1', 	ref: 'motor2_1', 	visible: false },
					{ title: 'MMotor 2-2', 	ref: 'motor2_2', 	visible: false },
					{ title: 'MMotor 3-1', 	ref: 'motor3_1', 	visible: false },
					{ title: 'MMotor 3-2', 	ref: 'motor3_2', 	visible: false },
					{ title: 'MMotor 4-1', 	ref: 'motor4_1', 	visible: false },
					{ title: 'MMotor 4-2', 	ref: 'motor4_2', 	visible: false }
				],
				motorProperties: {
					type: 		true,
					position: 	true,
					target: 	true,
					power: 		true,
					speed: 		true,
					range: 		true
				}
			}
		},

		setMotorInfo: function(motorState, motorProperties) {
			var state 	= this.state,
				motors 	= state.motors;
			for (var i = 0; i < motors.length; i++) {
				var motor = motors[i];
				if (motor.ref in motorState) {
					motor.visible = motorState[motor.ref];
				}
			}
			state.motorProperties = motorProperties;
			this.setState(state);
		},

		onUpdateMotors: function(changed) {
			var motors = this.props.motors;
			for (var i = 0; i < changed.length; i++) {
				var motor = motors.getMotor(changed[i]);
					motorComponent = this.refs['motor' + changed[i]];

				motorComponent && motorComponent.setState({
					position: 	motor.getPosition(),
					target: 	motor.getTarget(),
					power: 		motor.getPower(),
					speed: 		motor.getSpeed(),
					min: 		motor.getMin(),
					max: 		motor.getMax()
				});
			}
		},

		onSmall: function() {
			var state = this.state;
			state.small = true;
			this.setState(state);
			this.props.onSmall && this.props.onSmall();
		},

		onLarge: function() {
			var state = this.state;
			state.small = false;
			this.setState(state);
			this.props.onLarge && this.props.onLarge();
		},

		render: function() {
			var motors 			= this.state.motors,
				motorChildren 	= [];
			for (var i = 0; i < motors.length; i++) {
				var motor = motors[i];
				if (motor.visible) {
					motorChildren.push({
						type: EV3MotorComponent,
						props: {
							motors: 			this.props.motors,
							index: 				i,
							ref: 				'motor' + i,
							title: 				motor.title,
							motorProperties: 	this.state.motorProperties
						}}
					);
				}
			}
			return utilsReact.fromJSON({
				props: {
					className: 'output ' + (this.state.small ? ' small' : ' large')
				},
				children: [
					{
						type: EV3ScreenComponent,
						props: {
							ref: 		'screen',
							onRun: 		this.props.onRun,
							onSmall: 	this.onSmall,
							onLarge: 	this.onLarge
						}
					},
					{
						props: {
							className: 'io-wrapper',
						},
						children: [
							{
								props: {
									className: 'motor-container',
								},
								children: motorChildren
							},
							{
								props: {
									className: 'sensor-container'
								},
								children: [
									{ type: EV3SensorComponent, props: { ref: 'sensor1',  	title: 'Sensor 1' }},
									{ type: EV3SensorComponent, props: { ref: 'sensor2', 	title: 'Sensor 2' }},
									{ type: EV3SensorComponent, props: { ref: 'sensor3',	title: 'Sensor 3' }},
									{ type: EV3SensorComponent, props: { ref: 'sensor4', 	title: 'Sensor 4' }}
								]
							}
						]
					}
				]
			});
		},
	});