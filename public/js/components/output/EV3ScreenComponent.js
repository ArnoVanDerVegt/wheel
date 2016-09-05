(function() {
    var wheel = require('../../utils/base.js');

    var EV3Font = wheel.Class(function() {
            this.init = function(opts) {
                this._chars     = {};
                this._ev3Screen = opts.ev3Screen;
                this._imageData = opts.ev3Screen.getImageData();

                var image = new Image();
                image.addEventListener('load', this.onLoadImage.bind(this));
                image.src = opts.filename;
            };

            this.onLoadImage = function(event) {
                var buffer = document.createElement('canvas');
                var ctx    = buffer.getContext('2d');
                var image  = event.target;
                var width  = image.width / 94;
                var height = image.height;

                buffer.width  = image.width;
                buffer.height = image.height;
                ctx.drawImage(image, 0, 0);
                for (var i = 0; i < 94; i++) {
                    var imageData = ctx.getImageData(i * width, 0, width, height);
                    var data      = imageData.data;
                    var charData  = [];
                    var charLine;

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
                this._width  = width;
                this._height = height;
            };

            this.drawChar = function(x, y, c) {
                var chars = this._chars;
                if (c in chars) {
                    var ev3Screen = this._ev3Screen;
                    var c         = chars[c];
                    var width     = this._width;
                    var height    = this._height;
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

    var EV3Screen = wheel.Class(function() {
            this.init = function(opts) {
                this._updateCallback = opts.updateCallback;

                var buffer = document.createElement('canvas');
                buffer.width    = 178;
                buffer.height   = 128;

                this._buffer    = buffer;
                this._bufferCtx = buffer.getContext('2d');

                this._imageData = this._bufferCtx.getImageData(0, 0, 178, 128);

                this._fonts = {
                    size1: new EV3Font({
                        ev3Screen: this,
                        filename:  '/images/text1.png'
                    })
                };

                this.clear();
            };

            this.clear = function() {
                var data   = this._imageData.data;
                var offset = 0;
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
                    var offset = (y * 178 * 4) + x * 4;
                    var data   = this._imageData.data;
                    var color  = (mode === 0) ? 0 : 128;
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
                var dx  = Math.abs(x2 - x1);
                var dy  = Math.abs(y2 - y1);
                var sx  = (x1 < x2) ? 1 : -1;
                var sy  = (y1 < y2) ? 1 : -1;
                var err = dx - dy;
                while (true) {
                    this._drawPixel(x1, y1, mode);

                    if ((x1 == x2) && (y1 == y2)) break;
                    var e2 = 2 * err;
                    if (e2 > -dy) {
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
                this._drawLine(x,         y,             x + width, y,          mode);
                this._drawLine(x,         y,             x,         y + height, mode);
                this._drawLine(x + width, y,             x + width, y + height, mode);
                this._drawLine(x,         y + height, x + width,    y + height, mode);

                this._updateCallback && this._updateCallback();
            };

            this.drawCircle = function(x, y, radius) {
                // d start from D(M) = r^2 - r^2 + r-1/4 = r- 1/4 , but we can ignore constant because r>1/4
                var d  = radius;
                var dx = (-2) * radius; // dx = -2x +2 , constant move to loop
                var dy = 0;             // dy = 2y + 1 , constant move to loop
                var cx = radius;        // starting point:
                var cy = 0;

                this._drawPixel(x - radius, y, 0);
                this._drawPixel(x + radius, y, 0);
                this._drawPixel(x, y - radius, 0);
                this._drawPixel(x, y + radius, 0);

                while (cx > cy) {
                    if (d > 0) {
                        cx--;
                        d += (-2) * cx + 2;
                    }
                    cy++;
                    d += 2 * cy + 1;

                    this._drawPixel(x - cx, y - cy, 0);
                    this._drawPixel(x + cx, y - cy, 0);
                    this._drawPixel(x - cx, y + cy, 0);
                    this._drawPixel(x + cx, y + cy, 0);
                    this._drawPixel(x - cy, y - cx, 0);
                    this._drawPixel(x + cy, y - cx, 0);
                    this._drawPixel(x - cy, y + cx, 0);
                    this._drawPixel(x + cy, y + cx, 0);
                }

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

                ctx.fillStyle         = '#000000';
                ctx.font             = size + 'px Inconsolata';
                ctx.textBaseline     = 'top';
                ctx.fillText(text, x, y);

                this._imageData = ctx.getImageData(0, 0, 178, 128);
    */
                this._fonts.size1.drawText(x, y, text);
                this._updateCallback && this._updateCallback();

                return size;
            };

            this.drawImage = function(x, y, resource) {
                var lines = resource.split("\n");
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    for (var j = 0; j < line.length; j++) {
                        this._drawPixel(x + j, y + i, (line[j] === '0') ? 1 : 0);
                    }
                }

                this._updateCallback && this._updateCallback();
            };

            this.getImageData = function() {
                return this._imageData;
            };
        });

    wheel(
        'components.output.EV3ScreenComponent',
        React.createClass({
            getInitialState: function() {
                var emitter = this.props.editor.getEmitter();

                emitter.on('MessagesInfo', this, this.onMessagesInfo);
                emitter.on('Run',          this, this.onRun);
                emitter.on('Stop',         this, this.onStop);

                return {
                    small:             this.props.small,
                    running:           false,
                    messagesCounter:   0,
                    messagesClassName: null
                };
            },

            updateCtx: function() {
                if (!this._ctx) {
                    return;
                }
                var ctx       = this._ctx;
                var imageData = this._ev3Screen.getImageData();
                var data      = imageData.data;
                var offset    = 0;
                var size      = this.state.small ? 1 : 2;
                ctx.clearRect(0, 0, 178 * 2, 128 * 2);
                for (var y = 0; y < 128; y++) {
                    for (var x = 0; x < 178; x++) {
                        var r = data[offset++];
                        var g = data[offset++];
                        var b = data[offset++];
                        var a = data[offset++];

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
            },

            componentDidMount: function() {
                var canvas = this.refs.canvas;
                var ctx    = canvas.getContext('2d');
                if (!this._ev3Screen) {
                    this._ev3Screen = new EV3Screen({
                        imageData:      ctx.getImageData(0, 0, 178, 128),
                        updateCallback: wheel.bind(this, this.updateCtx)
                    });
                }
                this._ctx = ctx;
                this.updateCtx();
            },

            onZoom: function() {
                var props = this.props;
                var state = this.state;
                if (state.small) {
                    state.small = false;
                    props.onLarge && props.onLarge();
                } else {
                    state.small = true;
                    props.onSmall && props.onSmall();
                }
            },

            onRun: function() {
                this._ev3Screen.clear();
                var state = this.state;
                state.running = true;
                this.setState(state);
            },

            onStop: function() {
                this._ev3Screen.clear();
                var state = this.state;
                state.running = false;
                this.setState(state);
            },

            onMessagesInfo: function(info) {
                var state = this.state;
                if (info.log) {
                    if (info.error) {
                        state.messagesCounter   = info.log + info.error;
                        state.messagesClassName = 'yellow';
                    } else {
                        state.messagesCounter   = info.log;
                        state.messagesClassName = 'green';
                    }
                } else if (info.error) {
                    state.messagesCounter   = info.error;
                    state.messagesClassName = 'red';
                } else {
                    state.messagesCounter = 0;
                }
                this.setState(state);
            },

            render: function() {
                var state = this.state;
                var props = this.props;

                 return utilsReact.fromJSON({
                     props: {
                         className: 'box-shadow ev3-screen'
                     },
                     children: [
                         {
                            type: 'canvas',
                            props: {
                                width:  state.small ? 178 : 356,
                                height: state.small ? 128 : 256,
                                ref:    'canvas'
                            }
                        },
                        {
                            props: {
                                className: 'control-panel'
                            },
                            children: [
                                // Left side...
                                {
                                    props: {
                                        className: 'icon icon-circle-play',
                                        onClick:   function() { props.onRun && props.onRun(); }
                                    }
                                },
                                (state.running ?
                                    {
                                        props: {
                                            className: 'icon icon-circle-pause',
                                            onClick:   function() { props.onStop && props.onStop(); }
                                        }
                                    } :
                                    null
                                ),

                                // Right side...
                                {
                                    props: {
                                        className: 'icon icon-comment-help',
                                        onClick:   function() { props.onShowHelp && props.onShowHelp(); }
                                    }
                                },
                                {
                                    props: {
                                        className: 'icon icon-comment',
                                        onClick:   function() { props.onShowConsole && props.onShowConsole(); }
                                    },
                                    children: [
                                        state.messagesCounter ?
                                            {
                                                props: {
                                                    className: 'counter ' + state.messagesClassName,
                                                    innerHTML: state.messagesCounter
                                                }
                                            } :
                                            null
                                    ]
                                },
                                {
                                    props: {
                                        className: state.small ? 'icon icon-larger' : 'icon icon-smaller',
                                        onClick:   this.onZoom
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
        })
    );
})();