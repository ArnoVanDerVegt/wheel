/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path            = require('../../../shared/lib/path');
const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;
const dispatcher      = require('../../lib/dispatcher').dispatcher;
const ProjectResource = require('./ProjectResource').ProjectResource;

exports.FormResource = class extends ProjectResource {
    constructor(opts) {
        super(opts);
        this._onGetFileData       = opts.onGetFileData;
        this._onGetEditorFileData = opts.onGetEditorFileData;
        this._wfrm                = null;
    }

    canSave() {
        return false;
    }

    neededBeforeCompile() {
        return true;
    }

    loadFromDataProvider(callback) {
        this._getDataProvider().getData(
            'get',
            'ide/file',
            {filename: path.join(this._projectPath, this._filename)},
            (data) => {
                try {
                    data       = JSON.parse(data);
                    this._wfrm = JSON.parse(data.data.wfrm);
                } catch (error) {
                    data       = null;
                    this._wfrm = null;
                }
                callback(data);
            }
        );
    }

    getWFrm() {
        return this._wfrm;
    }

    getData(callback) {
        if (this._onGetEditorFileData) {
            this._onGetEditorFileData(
                path.join(this._projectPath, this._filename),
                (data) => {
                    if (data) {
                        this._wfrm = data;
                        callback(data);
                    } else {
                        this.loadFromDataProvider(callback);
                    }
                }
            );
        } else {
            this.loadFromDataProvider(callback);
        }
    }
};
