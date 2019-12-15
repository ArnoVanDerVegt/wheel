/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../../lib/dispatcher').dispatcher;

exports.ImageLoader = class {
    constructor() {
        dispatcher.on('ImageLoader.Loaded', this, this.onLoadImage);
    }

    load(opts, callback) {
        this._opts     = opts;
        this._callback = callback;
        dispatcher.dispatch('Dialog.Image.Load.Show', opts);
    }

    onLoadImage(opts) {
        let value  = opts.value;
        let width  = value[0].length;
        let height = value.length;
        this._opts.filename = opts.filename;
        this._opts.value    = {
            width:  width,
            height: height,
            image:  value
        };
        this._callback(this._opts);
    }
};
