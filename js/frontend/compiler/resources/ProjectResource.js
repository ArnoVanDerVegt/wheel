/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const RgfImage = require('../../../shared/lib/RgfImage').RgfImage;

exports.ProjectResource = class {
    constructor(filename, data) {
        this._filename = filename;
        this._data     = data;
    }

    getFilename() {
        return this._filename;
    }

    getData(callback) {
        callback(this._data);
    }

    setData(data) {
        this._data = data;
    }

    getDownloadData(callback) {
        let data = this._data;
        switch (this._filename.substr(-4)) {
            case '.rgf':
                let rgfImage = new RgfImage();
                data = rgfImage.toString(rgfImage.pack({width: data[0].length, height: data.length, image: data}));
                break;
            case '.rsf':
                let s = '';
                for (let i = 0; i < data.length; i++) {
                    s += String.fromCharCode(data[i]);
                }
                data = s;
                break;
        }
        callback(data);
    }

    save(outputPath) {
    }
};
