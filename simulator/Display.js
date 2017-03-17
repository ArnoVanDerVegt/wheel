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

                canvas.width    = WIDTH;
                canvas.height   = HEIGHT;

                this._canvas    = canvas;
                this._context   = context;
                this._fillColor = 128;
                this._color     = 0;

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
                var fillColor = this._fillColor;

                context.fillStyle = 'rgb(' + fillColor + ',' + fillColor + ',' + fillColor + ')';
                context.fillRect(0, 0, WIDTH, HEIGHT);
                this._imageData = context.getImageData(0, 0, WIDTH, HEIGHT);
            };

            this.drawText = function(x, y, size, text) {
                this._text[size].drawText(x, y, text);
            };

            this.drawPixel = function(x, y) {
                if ((x < 0) || (y < 0) || (x >= WIDTH) || (y >= HEIGHT)) {
                    return;
                }

                var data   = this._imageData.data;
                var offset = (y * WIDTH + x) * 4;
                var color  = this._color;

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
                var color  = this._color;
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

            this.drawRect = function(x, y, width, height) {
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

            this.render = function() {
                var context = this._context;
                context.clearRect(0, 0, WIDTH, HEIGHT);
                context.putImageData(this._imageData, 0, 0);
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
        })
    );
})();
