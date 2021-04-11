/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path            = require('../../../../../shared/lib/path');
const getDataProvider = require('../../../../lib/dataprovider/dataProvider').getDataProvider;

exports.WocFileLoader = class {
    loadFile(filename, callback) {
        setTimeout(
            function() {
                getDataProvider().getData(
                    'get',
                    'ide/file',
                    {filename: filename},
                    function(data) {
                        let lines = [];
                        try {
                            data  = JSON.parse(data);
                            lines = data.data.split('\n');
                        } catch (error) {

                        }
                        callback(filename, lines);
                    }
                );
            },
            1
        );
    }

    load(callback) {
        this._callback    = callback;
        this._count       = 0;
        this._loadedFiles = [];
        getDataProvider().getData('get', 'ide/files-in-path', {}, this.onFilesInPath.bind(this));
    }

    onWocFile(filename, lines) {
        this._loadedFiles.push({
            filename: filename,
            lines:    lines
        });
        this._count--;
        if (this._count === 0) {
            this._callback(this._loadedFiles);
        }
    }

    onFilesInPath(files) {
        try {
            files = JSON.parse(files);
            files.forEach(
                function(filename) {
                    let extension = path.getExtension(filename);
                    if (['.whl', '.whlp', '.woc'].indexOf(extension) !== -1) {
                        this._count++;
                        this.loadFile(filename, this.onWocFile.bind(this));
                    }
                },
                this
            );
        } catch (error) {
        }
    }
};
