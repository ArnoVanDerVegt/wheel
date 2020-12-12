/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.init = (opts) => {
    let style = opts.style || {};
    style.width           = ('width'        in opts) ? opts.width        : null;
    style.height          = ('height'       in opts) ? opts.height       : null;
    style.position        = ('position'     in opts) ? opts.position     : null;
    style.zIndex          = ('zIndex'       in opts) ? opts.zIndex       : null;
    style.left            = ('left'         in opts) ? opts.left         : null;
    style.top             = ('top'          in opts) ? opts.top          : null;
    style.fontSize        = ('fontSize'     in opts) ? opts.fontSize     : null;
    style.hAlign          = ('hAlign'       in opts) ? opts.hAlign       : null;
    style.radius          = ('radius'       in opts) ? opts.radius       : null;
    style.borderRadius    = ('borderRadius' in opts) ? opts.borderRadius : null;
    style.borderColor     = ('borderColor'  in opts) ? opts.borderColor  : null;
    style.borderWidth     = ('borderWidth'  in opts) ? opts.borderWidth  : null;
    style.fillColor       = (typeof opts.fillColor   === 'object') ? opts.fillColor   : null;
    style.borderColor     = (typeof opts.borderColor === 'object') ? opts.borderColor : null;
    return style;
};

exports.apply = (style, opts) => {
    if (opts.radius === null) {
        if (opts.width && (parseInt(opts.width, 10) >= 20)) {
            style.width = opts.width + 'px';
        } else if (this._allowAutoSize) {
            style.width = 'auto';
        }
        if (opts.height && (parseInt(opts.height, 10) >= 20)) {
            style.height = opts.height + 'px';
        } else if (this._allowAutoSize) {
            style.height = 'auto';
        }
    } else {
        style.width        = (opts.radius * 2) + 'px';
        style.height       = (opts.radius * 2) + 'px';
        style.borderRadius = opts.radius + 'px';
    }
    if ((opts.fontSize    !== null) && (parseInt(opts.fontSize, 10) >= 5)) { style.fontSize = opts.fontSize + 'px'; }
    if (opts.left         !== null) { style.left            = opts.left + 'px';  }
    if (opts.top          !== null) { style.top             = opts.top  + 'px';  }
    if (opts.position     !== null) { style.position        = opts.position;     }
    if (opts.zIndex       !== null) { style.zIndex          = opts.zIndex;       }
    if (opts.hAlign       !== null) { style.textAlign       = opts.hAlign;       }
    if (opts.borderRadius !== null) { style.borderRadius    = opts.borderRadius; }
    if (opts.borderWidth  !== null) { style.border          = opts.borderWidth + 'px solid ' + (opts.borderColor ? this.getColorFromRgb(opts.borderColor) : 'black'); }
    if (opts.fillColor    !== null) { style.backgroundColor = this.getColorFromRgb(opts.fillColor); }
    return style;
};

exports.update = (style, opts) => {
    if ('x'             in opts) { style.left         = opts.x;            }
    if ('y'             in opts) { style.top          = opts.y;            }
    if ('width'         in opts) { style.width        = opts.width;        }
    if ('height'        in opts) { style.height       = opts.height;       }
    if ('zIndex'        in opts) { style.zIndex       = opts.zIndex;       }
    if ('fontSize'      in opts) { style.fontSize     = opts.fontSize;     }
    if ('hAlign'        in opts) { style.hAlign       = opts.hAlign;       }
    if ('radius'        in opts) { style.radius       = opts.radius;       }
    if ('borderRadius'  in opts) { style.borderRadius = opts.borderRadius; }
    if ('borderWidth'   in opts) { style.borderWidth  = opts.borderWidth;  }
    if ('borderColor'   in opts) { style.borderColor  = opts.borderColor;  }
    if ('fillColor'     in opts) { style.fillColor    = opts.fillColor;    }
};
