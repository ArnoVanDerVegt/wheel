(function() {
    var wheel = require('../utils/base.js').wheel;

    var WIDTH  = 178;
    var HEIGHT = 128;

    wheel(
        'simulator.Display',
        wheel.Class(function() {
            this.init = function(opts) {
                wheel.vm.modules.ScreenModule.setDisplay(this);

                var canvas  = opts.canvas;
                var context = canvas.getContext('2d');

                canvas.width      = WIDTH;
                canvas.height     = HEIGHT;

                this._fill        = false;
                this._fillColor   = 0;
                this._canvas      = canvas;
                this._context     = context;

                this._loadedCount = 3;

                var onLoad = this.onLoad.bind(this);

                this._text      = [
                    new wheel.simulator.TextSmall({display: this, onLoad: onLoad}),
                    new wheel.simulator.TextMedium({display: this, onLoad: onLoad}),
                    new wheel.simulator.TextLarge({display: this, onLoad: onLoad})
                ];

                this.clearScreen();
            };

            this.onLoad = function() {
                this._loadedCount--;
                if (this._loadedCount) {
                    return;
                }
                this._text[1].drawText(24, 56, 'Simulator ready.');
                this.render();
            };

            this.clearScreen = function() {
                var context   = this._context;
                var fillColor = 128;

                context.fillStyle = 'rgb(' + fillColor + ',' + fillColor + ',' + fillColor + ')';
                context.fillRect(0, 0, WIDTH, HEIGHT);
                this._imageData = context.getImageData(0, 0, WIDTH, HEIGHT);
            };

            this.drawText = function(x, y, size, text) {
                this._text[size].drawText(x, y, text);
            };

            this.drawCenterText = function(y, size, text) {
                this._text[size].drawText(~~((178 - text.length * 8) * 0.5), y, text);
            };

            this.drawReady = function() {
                this.clearScreen();
                this.drawCenterText(1, 56, 'Simulator ready.');
                this.render();
            };

            this.drawLoaded = function(title) {
                this.clearScreen();
                this.drawCenterText(51, 0, 'Loaded');
                this.drawCenterText(68, 1, title);
                this.render();
            };

            this.drawPixel = function(x, y) {
                if ((x < 0) || (y < 0) || (x >= WIDTH) || (y >= HEIGHT)) {
                    return;
                }

                var data   = this._imageData.data;
                var offset = (y * WIDTH + x) * 4;
                var color  = this.getColor();

                data[offset++] = color;
                data[offset++] = color;
                data[offset++] = color;
                data[offset++] = 255;
            };

            this.drawLine = function(x1, y1, x2, y2) {
                var dx = Math.abs(x2 - x1);
                var dy = Math.abs(y2 - y1);
                var sx = (x1 < x2) ? 1 : -1;
                var sy = (y1 < y2) ? 1 : -1;
                var err = dx - dy;

                this.drawPixel(x1, y1);
                while (!((x1 == x2) && (y1 == y2))) {
                    var e2 = err << 1;
                    if (e2 > -dy) {
                        err -= dy;
                        x1 += sx;
                    }
                    if (e2 < dx) {
                        err += dx;
                        y1 += sy;
                    }
                    this.drawPixel(x1, y1);
                }
            };

            this.drawLineHorizontal = function(x, y, width) {
                if ((y < 0) || (y >= HEIGHT) || (x >= WIDTH) || (x + WIDTH < 0) || (width <= 0)) {
                    return;
                }

                if (x + width >= WIDTH) {
                    width -= x + width - WIDTH;
                }
                if (x < 0) {
                    width += x;
                    x = 0;
                }
                var data   = this._imageData.data;
                var offset = (y * WIDTH + x) * 4;
                var color  = this.getColor();
                for (var i = 0; i < width; i++) {
                    data[offset++] = color;
                    data[offset++] = color;
                    data[offset++] = color;
                    data[offset++] = 255;
                }
            };

            this.drawLineVertical = function(x, y, height) {
                if ((x < 0) || (x >= WIDTH) || (y >= HEIGHT) || (y + HEIGHT < 0) || (height <= 0)) {
                    return;
                }

                if (y + height >= HEIGHT) {
                    height -= y + height - HEIGHT;
                }
                if (y < 0) {
                    height += y;
                    y = 0;
                }
                var data   = this._imageData.data;
                var offset = (y * WIDTH + x) * 4;
                for (var i = 0; i < height; i++) {
                    data[offset++] = 0;
                    data[offset++] = 0;
                    data[offset++] = 0;
                    data[offset++] = 255;
                    offset += (WIDTH - 1) * 4
                }
            };

            this.drawStrokeRect = function(x, y, width, height) {
                this.drawLineHorizontal(x, y, width);
                this.drawLineVertical(x, y, height);
                this.drawLineHorizontal(x, y + height - 1, width);
                this.drawLineVertical(x + width - 1, y, height);
            };

            this.drawFillRect = function(x, y, width, height) {
                if ((x >= WIDTH) ||
                    (x + width < 0) ||
                    (y >= HEIGHT) ||
                    (y + height < 0) ||
                    (width <= 0) ||
                    (height <= 0)) {
                    return;
                }
                if (y < 0) {
                    height += y;
                    y = 0;
                }
                if (y + height >= HEIGHT) {
                    height -= y + height - HEIGHT;
                }
                for (var i = y; i < y + height; i++) {
                    this.drawLineHorizontal(x, i, width);
                }
            };

            this.drawRect = function(x, y, width, height) {
                this._fill ?
                    this.drawFillRect(x, y, width, height) :
                    this.drawStrokeRect(x, y, width, height);
            };

            this.drawStrokeCircle = function(x, y, radius) {
                if ((x + radius < 0) || (y + radius < 0) || (x - radius >= WIDTH) || (y - radius >= HEIGHT)) {
                    return;
                }

                var a             = radius;
                var b             = 0;
                var decisionOver2 = 1 - a;   // Decision criterion divided by 2 evaluated at x=r, y=0

                while (a >= b) {
                    this.drawPixel(x + a, y + b);
                    this.drawPixel(x - a, y + b);

                    this.drawPixel(x + b, y + a);
                    this.drawPixel(x - b, y + a);

                    this.drawPixel(x - a, y - b);
                    this.drawPixel(x + a, y - b);

                    this.drawPixel(x - b, y - a);
                    this.drawPixel(x + b, y - a);
                    b++;
                    if (decisionOver2 <= 0) {
                        decisionOver2 += 2 * b + 1; // Change in decision criterion for y -> y+1
                    } else {
                        a--;
                        decisionOver2 += 2 * (b - a) + 1; // Change for y -> y+1, x -> x-1
                    }
                }
            };

            this.drawFillCircle = function(x, y, radius) {
                if ((x + radius < 0) || (y + radius < 0) || (x - radius >= WIDTH) || (y - radius >= HEIGHT)) {
                    return;
                }

                var a             = radius;
                var b             = 0;
                var decisionOver2 = 1 - a;   // Decision criterion divided by 2 evaluated at x=r, y=0
                var lines         = [];
                var minY          = HEIGHT;
                var maxY          = 0;

                var addPoints = function(x1, x2, y) {
                        if ((y >= 0) && (y < HEIGHT)) {
                            if (x1 > x2) {
                                var i = x1;
                                x1 = x2;
                                x2 = i;
                            }
                            minY = Math.min(y, minY);
                            maxY = Math.max(y, maxY);
                            lines[y] = {
                                x1: x1,
                                x2: x2
                            };
                        }
                    };

                while (a >= b) {
                    addPoints(x - a, x + a, y + b);
                    addPoints(x - b, x + b, y + a);
                    addPoints(x - a, x + a, y - b);
                    addPoints(x - b, x + b, y - a);

                    b++;
                    if (decisionOver2 <= 0) {
                        decisionOver2 += 2 * b + 1; // Change in decision criterion for y -> y+1
                    } else {
                        a--;
                        decisionOver2 += 2 * (b - a) + 1; // Change for y -> y+1, x -> x-1
                    }
                }

                for (var y = minY; y <= maxY; y++) {
                    var line = lines[y];
                    this.drawLineHorizontal(line.x1, y, line.x2 - line.x1);
                }
            };

            this.drawCircle = function(x, y, radius) {
                this._fill ?
                    this.drawFillCircle(x, y, radius) :
                    this.drawStrokeCircle(x, y, radius);
            };

            this.render = function() {
                var context = this._context;
                context.clearRect(0, 0, WIDTH, HEIGHT);
                context.putImageData(this._imageData, 0, 0);
            };

            this.getColor = function() {
                return this._fillColor ? 128 : 0;
            };

            this.getWidth = function() {
                return WIDTH;
            };

            this.getHeight = function() {
                return HEIGHT;
            };

            this.getImageData = function() {
                return this._imageData;
            };

            this.setFill = function(fill) {
                this._fill = fill;
            };

            this.setFillColor = function(fillColor) {
                this._fillColor = fillColor;
            };
        })
    );
})();
