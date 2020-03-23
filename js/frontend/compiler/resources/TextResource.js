/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;
const dispatcher      = require('../../lib/dispatcher').dispatcher;
const path            = require('../../lib/path');
const ProjectResource = require('./ProjectResource').ProjectResource;

exports.TextResource = class extends ProjectResource {
    save(outputPath) {
        let data = this._data;
        if (!data) {
            return;
        }
        let filename = this._filename;
        dispatcher.dispatch('Console.Log', {message: 'Writing text <i>' + filename + '</i>...'});
        this._getDataProvider().getData(
            'post',
            'ide/file-save',
            {
                filename: path.join(outputPath, filename),
                data:     data
            }
        );
    }
};
