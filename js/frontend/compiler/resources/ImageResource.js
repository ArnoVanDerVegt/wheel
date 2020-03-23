/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const RgfImage        = require('../../../shared/lib/RgfImage').RgfImage;
const dispatcher      = require('../../lib/dispatcher').dispatcher;
const path            = require('../../lib/path');
const ProjectResource = require('./ProjectResource').ProjectResource;

exports.ImageResource = class extends ProjectResource {
    save(outputPath) {
        let data = this._data;
        if (!data) {
            return;
        }
        let filename = this._filename;
        dispatcher.dispatch('Console.Log', {message: 'Writing image <i>' + filename + '</i>...'});
        this._getDataProvider().getData(
            'post',
            'ide/file-save',
            {
                filename: path.join(outputPath, filename),
                data: {
                    width:  data[0].length,
                    height: data.length,
                    image:  data
                }
            }
        );
    }

    getDownloadData(callback) {
        let rgfImage = new RgfImage();
        let data     = this._data;
        callback(rgfImage.toString(rgfImage.pack({width: data[0].length, height: data.length, image: data})));
    }
};
