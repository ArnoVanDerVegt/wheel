/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path            = require('../../../shared/lib/path');
const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;
const dispatcher      = require('../../lib/dispatcher').dispatcher;
const ProjectResource = require('./ProjectResource').ProjectResource;

exports.TextResource = class extends ProjectResource {
    save(outputPath) {
        let data = this._data;
        if (!data) {
            return;
        }
        let filename = this._filename;
        dispatcher.dispatch(
            'Console.Log',
            {
                type:    'Info',
                message: 'Writing text <i>' + filename + '</i>...'
            }
        );
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
