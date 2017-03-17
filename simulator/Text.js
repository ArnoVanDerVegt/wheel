(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'simulator.Text',
        wheel.Class(function() {
            this.init = function(opts) {
                this._display = opts.display;
                this._char    = {
                    data:     [],
                    dataSize: 0,
                    width:    0,
                    height:   0
                };

                this._onLoad = opts.onLoad;
                this._image  = new Image();
                this._image.addEventListener('load', this.onLoad.bind(this));
                this._image.src = opts.src;
            };

            this.onLoad = function(event) {
                var image   = this._image;
                var width   = image.width;
                var height  = image.height;
                var canvas  = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var chr     = this._char;

                chr.width     = width;
                chr.height    = height / 94;
                chr.dataSize  = width * chr.height;
                canvas.width  = width;
                canvas.height = height;
                context.drawImage(image, 0, 0);

                var imageData = context.getImageData(0, 0, width, height);
                var data      = imageData.data;
                var offset    = 0;

                for (var y = 0; y < height; y++) {
                    for (var x = 0; x < width; x++) {
                        chr.data.push(data[offset] === 0);
                        offset += 4;
                    }
                }
                this._onLoad && this._onLoad();
            };

            this.drawChar = function(x, y, index) {
                var chr          = this._char;
                var width        = chr.width;
                var height       = chr.height;
                var display      = this._display;
                var imageData    = display.getImageData();
                var destWidth    = display.getWidth();
                var destHeight   = display.getHeight();
                var restWidth    = 0;
                var startOffset  = 0;

                if ((x >= destWidth) || (x + width < 0) || (y >= destHeight) || (y + height < 0)) {
                    return;
                }

                if (x < 0) {
                    restWidth = -x;
                    width += x;
                    x = 0;
                }
                if (y < 0) {
                    startOffset = -y * width;
                    height += y;
                    y = 0;
                }
                if (x + width >= destWidth) {
                    restWidth = (x + width) - destWidth;
                    width -= restWidth;
                }
                if (y + height >= destHeight) {
                    height -= (y + height) - destHeight;
                }

                var destOffset   = (y * destWidth + x) * 4;
                var sourceOffset = index * chr.dataSize + startOffset;
                var sourceData   = chr.data;

                for (var j = 0; j < height; j++) {
                    for (var i = 0; i < width; i++) {
                        var color = sourceData[sourceOffset] ? 0 : 128;
                        imageData.data[destOffset++] = color;
                        imageData.data[destOffset++] = color;
                        imageData.data[destOffset++] = color;

                        destOffset++;
                        sourceOffset++;
                    }

                    sourceOffset += restWidth;
                    destOffset += (destWidth - width) * 4;
                }
            };

            this.drawText = function(x, y, text) {
                if (!text.length) {
                    return;
                }

                var chr = this._char;
                for (var i = 0; i < text.length; i++) {
                    var c = text.charCodeAt(i);
                    if (c === 32) {
                        x += chr.width;
                    } else if ((c > 32) && (c <= 126)) {
                        this.drawChar(x, y, c - 33);
                        x += chr.width;
                    }
                }
            };
        })
    );
})();