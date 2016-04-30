var EV3Font = Class(function() {
		this.init = function(opts) {
			this._chars 	= {};
			this._ev3Screen = opts.ev3Screen;
			this._imageData = opts.ev3Screen.getImageData();

			var image = new Image();
			image.addEventListener('load', this.onLoadImage.bind(this));
			image.src = opts.filename;
		};

		this.onLoadImage = function(event) {
			var buffer 	= document.createElement('canvas'),
				ctx 	= buffer.getContext('2d'),
				image 	= event.target,
				width 	= image.width / 94,
				height 	= image.height;

			buffer.width 	= image.width;
			buffer.height 	= image.height;
			ctx.drawImage(image, 0, 0);
			for (var i = 0; i < 94; i++) {
				var imageData 	= ctx.getImageData(i * width, 0, width, height),
					data 		= imageData.data,
					charData 	= [],
					charLine;

				for (var y = 0; y < height; y++) {
					charLine = [];
					for (var x = 0; x < width; x++) {
						var offset = (y * width + x) * 4;
						charLine.push(!data[offset] ? 0 : 1);
					}
					charData.push(charLine);
				}
				this._chars[String.fromCharCode(33 + i)] = charData;
			}
			this._width 	= width;
			this._height	= height;
		};

		this.drawChar = function(x, y, c) {
			var chars = this._chars;
			if (c in chars) {
				var ev3Screen 	= this._ev3Screen,
					c 			= chars[c],
					width 		= this._width,
					height 		= this._height;
				for (b = 0; b < height; b++) {
					for (a = 0; a < width; a++) {
						ev3Screen._drawPixel(x + a, y + b, c[b][a]);
					}
				}
			}
		};

		this.drawText = function(x, y, text) {
			for (var i = 0; i < text.length; i++) {
				var c = text[i];
				(c === ' ') || this.drawChar(x, y, c);
				x += this._width;
			}
		};
	});

var EV3Screen = Class(function() {
		this.init = function(opts) {
			this._updateCallback = opts.updateCallback;

			var buffer = document.createElement('canvas');
			buffer.width 	= 178;
			buffer.height 	= 128;

			this._buffer 	= buffer;
			this._bufferCtx = buffer.getContext('2d');

			this._imageData = this._bufferCtx.getImageData(0, 0, 178, 128);

			this._fonts = {
				size1: new EV3Font({
					ev3Screen: 	this,
					filename: 	'/images/text1.png'
				})
			};

			this.clear();
		};

		this.clear = function() {
			var data 	= this._imageData.data,
				offset 	= 0;
			for (var y = 0; y < 128; y++) {
				for (var x = 0; x < 178; x++) {
					for (var i = 0; i < 3; i++) {
						data[offset++] = 168;
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
				this._drawPixel(x1, y1, mode);

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
/*
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
*/
			this._fonts.size1.drawText(x, y, text);
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
						r = 168;
						g = 168;
						b = 168;
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
 					className: 'box-shadow ev3-screen'
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
									className: 	'icon icon-circle-play',
									onClick: 	(function() { this.props.onRun && this.props.onRun(); }).bind(this)
								}
							},
							{
								props: {
									className: 'icon icon-circle-pause',
									onClick: 	(function() { this.props.onStop && this.props.onStop(); }).bind(this)
								}
							},
							{
								props: {
									className: 'icon icon-area',
									onClick: 	this.onZoom
								}
							},
							{
								props: {
									className: 'icon icon-comment',
									onClick: 	(function() { this.props.onShowConsole && this.props.onShowConsole(); }).bind(this)
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